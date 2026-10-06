export interface NewsSource {
  name: string;
  outletType?: 'Wire Service' | 'Broadcast Network' | 'Official Government' | 'Major Newspaper' | 'Primary Court Record' | 'Specialized Journal';
  articleTitle?: string;
  channelOrDomain?: string;
  date: string;
  url: string;
  isVerified?: boolean;
}

export interface NewsStory {
  rank: number; // 1 to 9 (or 9 to 1)
  category: string;
  headline: string;
  location: string;
  date: string;
  summary: string;
  keyFacts: string[]; // exactly 3 key facts
  whyItMatters: string;
  whatHappensNext: string;
  sources: NewsSource[];
  significanceRating?: 'Critical' | 'High' | 'Notable';
}

export interface NewsReport {
  id: string;
  title: string;
  reportDate: string;
  generatedAt: string;
  storiesVerified: number;
  trendingTopic?: string;
  executiveSummary: string;
  tableOfContents: { rank: number; headline: string; category: string }[];
  stories: NewsStory[];
  keyDevelopmentsToWatch: string[];
  completeSources: { outlet: string; headline: string; url: string; date: string }[];
  disclaimer: string;
}

export interface GenerationProgress {
  stage: 0 | 1 | 2 | 3 | 4 | 5; // 0=idle, 1=searching, 2=verifying, 3=ranking, 4=writing, 5=finalizing
  message: string;
}
