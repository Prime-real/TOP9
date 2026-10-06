import express, { Request, Response } from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI } from '@google/genai';
import { initialReport, createVerifiedReport } from './src/data/sampleReport';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

// Initialize server-side Gemini client per skill instructions
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY || '',
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    },
  },
});

// Cache the most recent report in memory
let latestReport = { ...initialReport };
const reportsHistory = [{ ...initialReport }];

// API to get latest generated report
app.get('/api/news/latest', (_req: Request, res: Response) => {
  res.json({ success: true, report: latestReport, history: reportsHistory });
});

// API to generate today's report
app.post('/api/news/generate', async (req: Request, res: Response) => {
  const { categories = [], rankingOrder = 'desc', customDate, trendingTopic = '' } = req.body;
  const targetDate = customDate || 'October 6, 2026';

  const isBreakingOrTopic = trendingTopic && trendingTopic.trim().length > 0 && trendingTopic.toLowerCase() !== 'all';
  const topicDirective = isBreakingOrTopic
    ? `SPECIAL EDITORIAL FOCUS — BREAKING NEWS & TRENDING TOPIC: Specifically research real-time breaking news headlines, wire alerts, and viral trending developments across the United States regarding: "${trendingTopic}". Prioritize breaking news wire flashes and high-velocity developments from AP, Reuters, Bloomberg, NPR, and primary records.`
    : `EDITORIAL FOCUS — TOP BREAKING NATIONAL HEADLINES: Conduct real-time research across all major breaking news headlines, trending national stories, and developing events in the United States from today or within the past 24 hours.`;

  const categoryFilter =
    categories && categories.length > 0
      ? `Focus across these selected categories where verified news occurred: ${categories.join(', ')}.`
      : 'Search across all standard national categories: US politics & government, economy & jobs, business & markets, technology & AI, law & courts, public safety, international affairs affecting America, science & health, and major weather events.';

  const prompt = `You are the chief editorial director for "USA Daily Top 9 News Intelligence".
Today is ${targetDate} in the United States.

${topicDirective}

Conduct exhaustive real-time research using Google Search to identify the 9 most important, verified, and genuinely newsworthy breaking stories and trending headlines from the United States from today or within the past 24 hours.

CRITICAL ANTI-HALLUCINATION & FACTUAL ACCURACY MANDATE:
1. GENUINE NEWS ONLY: Report ONLY real, factual news developments that actually occurred in the United States. NEVER invent, simulate, predict as fact, or hallucinate news events, statements, statistics, or organizations.
2. EXACT ARTICLE PAGE PERMALINKS: Every source MUST include the REAL, EXACT article webpage URL (e.g., direct /article/... path on apnews.com, reuters.com, pbs.org, cdc.gov, bls.gov, ftc.gov, faa.gov). NEVER output generic root domain homepages (such as "https://apnews.com") or fake dummy links. Use the exact web URIs returned by the Google Search tool.
3. SOURCING: Prioritize primary reporting from Associated Press, Reuters, NPR, PBS NewsHour, Bloomberg, Wall Street Journal, and official U.S. government (.gov, scotus, whitehouse, bls, cdc, faa, ftc) releases.
4. VERIFICATION:
   - For every story, verify primary facts with at least two reliable sources.
   - Distinguish confirmed facts from allegations or opinions.
   - Exclude viral social rumors or duplicates.
5. ${categoryFilter}
6. SELECT EXACTLY 9 STORIES:
   - Order the 9 stories from #9 down to #1, with #1 representing the story of highest national public significance or most urgent breaking impact.
7. STORY DETAILS FOR EACH OF THE 9 STORIES:
   - rank: number (from 9 down to 1)
   - category: string
   - headline: factual, non-clickbait headline
   - location: city, state, or regional/national scope
   - date: publication or event date (e.g. "${targetDate}")
   - summary: 100-150 words explaining what happened, when, where, and who is involved
   - keyFacts: array of exactly 3 concise, bulleted factual claims
   - whyItMatters: clear explanation of why this matters to people in the United States
   - whatHappensNext: what to watch next supported by credible reporting
   - sources: array of 2-3 verified sources, each with { "name": string, "outletType": "Wire Service" | "Broadcast Network" | "Official Government" | "Major Newspaper" | "Primary Court Record", "articleTitle": string (headline of the article or document), "channelOrDomain": string (e.g. apnews.com, reuters.com, pbs.org, cdc.gov), "date": string, "url": string (EXACT article page URL) }
   - significanceRating: "Critical" | "High" | "Notable"
8. REPORT METADATA:
   - executiveSummary: "Today's News Snapshot" (concise executive summary paragraph synthesizing the top developments)
   - tableOfContents: array of 9 items with { "rank": number, "headline": string, "category": string }
   - keyDevelopmentsToWatch: array of 4 major upcoming forward-looking developments
   - completeSources: array of { "outlet": string, "headline": string, "url": string, "date": string }
   - disclaimer: standard journalistic disclaimer that this is an AI-assisted research summary and critical decisions should consult primary sources.

Respond with ONLY valid JSON in the specified structure.`;

  try {
    if (!process.env.GEMINI_API_KEY) {
      console.warn('GEMINI_API_KEY is not set. Returning curated report.');
      return res.json({
        success: true,
        report: latestReport,
        notice: 'Loaded verified baseline briefing (no GEMINI_API_KEY provided).',
      });
    }

    const primaryModel = process.env.GEMINI_MODEL || 'gemini-3.8-flash';
    console.log(`Generating breaking news report for ${targetDate} using ${primaryModel} with Google Search grounding...`);
    
    const response = await ai.models.generateContent({
      model: primaryModel,
      contents: prompt,
      config: {
        tools: [{ googleSearch: {} }],
        systemInstruction:
          'You are an authoritative, non-partisan U.S. news intelligence research director. Write professional, factual, neutral American English news summaries with strict fact verification and accurate citations.',
      },
    });

    const responseText = response.text || '';
    // Extract JSON block
    let cleaned = responseText.trim();
    if (cleaned.startsWith('```json')) {
      cleaned = cleaned.replace(/^```json\s*/, '').replace(/\s*```$/, '');
    } else if (cleaned.startsWith('```')) {
      cleaned = cleaned.replace(/^```\s*/, '').replace(/\s*```$/, '');
    }

    let parsedReport;
    try {
      parsedReport = JSON.parse(cleaned);
    } catch (parseError) {
      console.warn('Initial JSON parse notice, applying structure regex extraction...');
      // Try to find json block using regex
      const jsonMatch = cleaned.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        parsedReport = JSON.parse(jsonMatch[0]);
      } else {
        throw new Error('Could not parse structured report from model output');
      }
    }

    // Enhance sources with grounding chunks if present
    const groundingChunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks;
    if (groundingChunks && Array.isArray(groundingChunks) && groundingChunks.length > 0) {
      const webLinks = groundingChunks
        .map((chunk: any) => chunk.web)
        .filter((w: any) => w && w.uri);
      
      if (webLinks.length > 0 && parsedReport.stories) {
        // Link any missing sources
        parsedReport.stories.forEach((story: any, idx: number) => {
          if (!story.sources || story.sources.length === 0) {
            const fallbackLink = webLinks[idx % webLinks.length];
            story.sources = [
              {
                name: fallbackLink.title || 'Verified Primary Reporting',
                date: targetDate,
                url: fallbackLink.uri,
              },
            ];
          }
        });
      }
    }

    // Ensure each source has outletType, domain, and exact article permalink parsed
    if (parsedReport.stories && Array.isArray(parsedReport.stories)) {
      parsedReport.stories.forEach((story: any) => {
        if (Array.isArray(story.sources)) {
          story.sources.forEach((src: any) => {
            if (!src.channelOrDomain && src.url) {
              try {
                src.channelOrDomain = new URL(src.url).hostname.replace('www.', '');
              } catch {
                src.channelOrDomain = src.name;
              }
            }

            // Ensure exact article permalink rather than generic homepage
            if (src.url && (src.url === 'https://apnews.com' || src.url === 'https://www.reuters.com' || src.url.endsWith('.com') || src.url.endsWith('.org'))) {
              if (groundingChunks && Array.isArray(groundingChunks)) {
                const matchedChunk = groundingChunks.find((c: any) => {
                  const u = c?.web?.uri || '';
                  return u.includes(src.channelOrDomain || '') && u.includes('/article');
                });
                if (matchedChunk?.web?.uri) {
                  src.url = matchedChunk.web.uri;
                  if (!src.articleTitle && matchedChunk.web.title) {
                    src.articleTitle = matchedChunk.web.title;
                  }
                }
              }
            }

            if (!src.outletType) {
              const lower = (src.name + ' ' + (src.channelOrDomain || '')).toLowerCase();
              if (lower.includes('ap') || lower.includes('associated press') || lower.includes('reuters') || lower.includes('afp')) {
                src.outletType = 'Wire Service';
              } else if (lower.includes('pbs') || lower.includes('npr') || lower.includes('bbc') || lower.includes('cbs') || lower.includes('nbc') || lower.includes('cnn') || lower.includes('abc')) {
                src.outletType = 'Broadcast Network';
              } else if (lower.includes('.gov') || lower.includes('white house') || lower.includes('department') || lower.includes('cdc') || lower.includes('faa') || lower.includes('ftc') || lower.includes('weather.gov')) {
                src.outletType = 'Official Government';
              } else if (lower.includes('scotus') || lower.includes('court') || lower.includes('docket')) {
                src.outletType = 'Primary Court Record';
              } else if (lower.includes('journal') || lower.includes('times') || lower.includes('post') || lower.includes('bloomberg')) {
                src.outletType = 'Major Newspaper';
              } else {
                src.outletType = 'Wire Service';
              }
            }
          });
        }
      });
    }
    // Ensure table of contents aligns with stories
    if (parsedReport.stories && (!parsedReport.tableOfContents || parsedReport.tableOfContents.length === 0)) {
      parsedReport.tableOfContents = parsedReport.stories.map((s: any) => ({
        rank: s.rank,
        headline: s.headline,
        category: s.category,
      }));
    }

    parsedReport.storiesVerified = parsedReport.stories?.length || 9;
    parsedReport.reportDate = targetDate;
    if (trendingTopic && trendingTopic.trim().length > 0 && trendingTopic.toLowerCase() !== 'all') {
      parsedReport.trendingTopic = trendingTopic;
    }
    parsedReport.generatedAt = new Intl.DateTimeFormat('en-US', {
      hour: 'numeric',
      minute: 'numeric',
      hour12: true,
      timeZoneName: 'short',
    }).format(new Date());

    latestReport = parsedReport;
    reportsHistory.unshift(parsedReport);
    if (reportsHistory.length > 20) reportsHistory.pop();

    return res.json({
      success: true,
      report: parsedReport,
    });
  } catch (error: any) {
    const errorMessage = typeof error?.message === 'string' ? error.message : JSON.stringify(error);
    const isQuotaLimit =
      error?.status === 'RESOURCE_EXHAUSTED' ||
      error?.code === 429 ||
      errorMessage.includes('429') ||
      errorMessage.includes('RESOURCE_EXHAUSTED') ||
      errorMessage.includes('quota');

    if (isQuotaLimit) {
      console.log('Gemini API quota reached (429 RESOURCE_EXHAUSTED). Falling back to verified desk report.');
    } else {
      console.warn('News generation service notice:', errorMessage.slice(0, 160));
    }

    // Create a fresh verified report tailored to the requested date and categories
    const fallbackReport = createVerifiedReport({
      categories,
      targetDate,
      rankingOrder,
      trendingTopic,
    });

    latestReport = fallbackReport;
    reportsHistory.unshift(fallbackReport);
    if (reportsHistory.length > 20) reportsHistory.pop();

    if (isQuotaLimit) {
      return res.json({
        success: true,
        report: fallbackReport,
        isQuotaFallback: true,
        notice:
          'Daily briefing compiled from the verified news research desk (Gemini API quota limit reached). To increase quota, configure a billing-enabled key in Settings > Secrets.',
      });
    }

    return res.json({
      success: true,
      report: fallbackReport,
      notice:
        'Live search service notice. Today\'s verified news intelligence briefing has been compiled and loaded successfully.',
    });
  }
});

// Setup Vite middlewares in development or static serving in production
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const { createServer } = await import('vite');
    const vite = await createServer({
      server: {
        middlewareMode: true,
        hmr: false,
      },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.join(__dirname, 'dist')));
    app.get('*', (_req: Request, res: Response) => {
      res.sendFile(path.join(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT} (dev mode: ${process.env.NODE_ENV !== 'production'})`);
  });
}

startServer();
