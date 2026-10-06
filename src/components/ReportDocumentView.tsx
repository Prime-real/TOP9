import React, { useState, useMemo } from 'react';
import {
  Download,
  Printer,
  Copy,
  Check,
  ExternalLink,
  ShieldCheck,
  Newspaper,
  Compass,
  MapPin,
  Calendar,
  AlertCircle,
  Eye,
  Tv,
  Globe,
  Landmark,
  Scale,
  FileText,
  Radio,
  Share2,
  Link2,
  X,
  FileCheck,
  Send,
  Search,
  Filter,
  Layers,
  ChevronDown,
  Bookmark,
  Clock,
  Sparkles,
  Flame,
  Zap,
} from 'lucide-react';
import { NewsReport, NewsSource } from '../types/news';
import { generatePdfDocument, generateSummaryPdfDocument } from '../utils/pdfGenerator';

interface ReportDocumentViewProps {
  report: NewsReport;
  rankingOrder: 'desc' | 'asc';
  theme?: 'dark' | 'light';
}

function getOutletTypeBadge(type?: string, isDark: boolean = true) {
  switch (type) {
    case 'Wire Service':
      return {
        icon: Globe,
        label: 'Wire Service',
        bg: isDark ? 'bg-blue-950/60 text-blue-300 border-blue-500/40 glow-blue-sm' : 'bg-blue-50 text-blue-800 border-blue-200',
      };
    case 'Broadcast Network':
      return {
        icon: Tv,
        label: 'Broadcast TV / Radio',
        bg: isDark ? 'bg-purple-950/60 text-purple-300 border-purple-500/40' : 'bg-purple-50 text-purple-800 border-purple-200',
      };
    case 'Official Government':
      return {
        icon: Landmark,
        label: 'Official Government (.gov)',
        bg: isDark ? 'bg-emerald-950/60 text-emerald-300 border-emerald-500/40 glow-emerald' : 'bg-emerald-50 text-emerald-800 border-emerald-200',
      };
    case 'Primary Court Record':
      return {
        icon: Scale,
        label: 'Court Docket / Legal Record',
        bg: isDark ? 'bg-rose-950/60 text-rose-300 border-rose-500/40 glow-red-sm' : 'bg-rose-50 text-rose-800 border-rose-200',
      };
    case 'Major Newspaper':
      return {
        icon: Newspaper,
        label: 'National Newspaper',
        bg: isDark ? 'bg-amber-950/60 text-amber-300 border-amber-500/40 glow-amber' : 'bg-amber-50 text-amber-900 border-amber-200',
      };
    case 'Specialized Journal':
      return {
        icon: FileText,
        label: 'Specialized Journal',
        bg: isDark ? 'bg-cyan-950/60 text-cyan-300 border-cyan-500/40 glow-cyan-sm' : 'bg-cyan-50 text-cyan-800 border-cyan-200',
      };
    default:
      return {
        icon: Newspaper,
        label: 'Verified Press',
        bg: isDark ? 'bg-slate-900 text-slate-300 border-slate-700' : 'bg-slate-50 text-slate-800 border-slate-200',
      };
  }
}

export const ReportDocumentView: React.FC<ReportDocumentViewProps> = ({
  report,
  rankingOrder,
  theme = 'dark',
}) => {
  const isDark = theme === 'dark';

  const [copied, setCopied] = useState(false);
  const [downloadingPdf, setDownloadingPdf] = useState(false);
  const [downloadingSummaryPdf, setDownloadingSummaryPdf] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const [copiedDeepLink, setCopiedDeepLink] = useState(false);
  const [copiedSummary, setCopiedSummary] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategoryFilter, setActiveCategoryFilter] = useState('All');
  const [viewMode, setViewMode] = useState<'full' | 'compact'>('full');
  const [selectedStoryId, setSelectedStoryId] = useState<number | null>(null);

  // Deep-link URL construction
  const deepLinkUrl =
    typeof window !== 'undefined'
      ? `${window.location.origin}${window.location.pathname}?report=${encodeURIComponent(report.id)}`
      : '';

  // Sort stories based on user's ranking order preference
  const displayedStories = useMemo(() => {
    return [...report.stories].sort((a, b) => {
      return rankingOrder === 'desc' ? b.rank - a.rank : a.rank - b.rank;
    });
  }, [report.stories, rankingOrder]);

  // Unique categories for filter bar
  const availableCategories = useMemo(() => {
    const set = new Set<string>();
    report.stories.forEach((s) => set.add(s.category));
    return ['All', ...Array.from(set)];
  }, [report.stories]);

  // Filter stories by category and search keyword
  const filteredStories = useMemo(() => {
    return displayedStories.filter((s) => {
      const matchesCat =
        activeCategoryFilter === 'All' ||
        s.category.toLowerCase().includes(activeCategoryFilter.toLowerCase());
      const query = searchQuery.trim().toLowerCase();
      if (!query) return matchesCat;
      const matchesText =
        s.headline.toLowerCase().includes(query) ||
        s.summary.toLowerCase().includes(query) ||
        s.location.toLowerCase().includes(query) ||
        s.keyFacts.some((f) => f.toLowerCase().includes(query)) ||
        s.sources.some(
          (src) =>
            src.name.toLowerCase().includes(query) ||
            (src.articleTitle && src.articleTitle.toLowerCase().includes(query)) ||
            (src.channelOrDomain && src.channelOrDomain.toLowerCase().includes(query))
        );
      return matchesCat && matchesText;
    });
  }, [displayedStories, activeCategoryFilter, searchQuery]);

  const totalVerifiedSources = useMemo(() => {
    return report.stories.reduce((acc, story) => acc + story.sources.length, 0);
  }, [report.stories]);

  const handleDownloadFullPdf = async () => {
    try {
      setDownloadingPdf(true);
      generatePdfDocument(report);
    } catch (err) {
      console.error('Failed to generate full PDF:', err);
    } finally {
      setTimeout(() => setDownloadingPdf(false), 800);
    }
  };

  const handleDownloadSummaryPdf = async () => {
    try {
      setDownloadingSummaryPdf(true);
      generateSummaryPdfDocument(report);
    } catch (err) {
      console.error('Failed to generate summary PDF:', err);
    } finally {
      setTimeout(() => setDownloadingSummaryPdf(false), 800);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const handleCopyDeepLink = () => {
    if (navigator.clipboard && deepLinkUrl) {
      navigator.clipboard.writeText(deepLinkUrl);
      setCopiedDeepLink(true);
      setTimeout(() => setCopiedDeepLink(false), 2500);
    }
  };

  const handleCopySummary = () => {
    const summaryBlock = [
      `🇺🇸 *USA DAILY NEWS BRIEFING* — ${report.reportDate}`,
      `Generated: ${report.generatedAt} | Verified Stories: ${report.storiesVerified}`,
      report.trendingTopic ? `Focus: ${report.trendingTopic}` : ``,
      ``,
      `*TODAY'S EXECUTIVE SNAPSHOT:*`,
      report.executiveSummary,
      ``,
      `*TOP 9 NATIONAL DEVELOPMENTS:*`,
      ...displayedStories.map(
        (s) =>
          `*#${s.rank}. [${s.category}]* ${s.headline}\n> • ${s.keyFacts[0] || ''}\n> _Primary Source: ${s.sources[0]?.name || 'Primary Wire'}_ (${s.sources[0]?.url || ''})`
      ),
      ``,
      `*KEY DEVELOPMENTS TO WATCH:*`,
      ...report.keyDevelopmentsToWatch.map((k) => `• ${k}`),
      ``,
      `🔗 *Access Interactive Briefing:* ${deepLinkUrl}`,
    ].join('\n');

    if (navigator.clipboard) {
      navigator.clipboard.writeText(summaryBlock);
      setCopiedSummary(true);
      setTimeout(() => setCopiedSummary(false), 2500);
    }
  };

  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `USA Daily News Briefing — ${report.reportDate}`,
          text: `Today's top 9 verified U.S. news stories and executive briefing.`,
          url: deepLinkUrl,
        });
      } catch (err) {
        console.warn('Native share dismissed or not supported', err);
      }
    } else {
      handleCopyDeepLink();
    }
  };

  const handleCopyText = () => {
    const textLines = [
      `================================================`,
      `USA DAILY NEWS BRIEFING — ${report.reportDate}`,
      `Report Generated: ${report.generatedAt} | Verified Stories: ${report.storiesVerified}`,
      report.trendingTopic ? `Desk: ${report.trendingTopic}` : ``,
      `================================================\n`,
      `TODAY'S NEWS SNAPSHOT:`,
      report.executiveSummary,
      `\n------------------------------------------------`,
      `TABLE OF CONTENTS:`,
      ...report.tableOfContents.map((t) => `#${t.rank} [${t.category}] ${t.headline}`),
      `\n------------------------------------------------\n`,
      ...displayedStories.map(
        (s) =>
          `[STORY #${s.rank} - ${s.category.toUpperCase()}]\n` +
          `${s.headline}\n` +
          `Date: ${s.date} | Location: ${s.location}\n\n` +
          `Summary:\n${s.summary}\n\n` +
          `Key Facts:\n` +
          s.keyFacts.map((f) => `• ${f}`).join('\n') +
          `\n\nWhy It Matters to Americans:\n${s.whyItMatters}\n\n` +
          `What to Watch Next:\n${s.whatHappensNext}\n\n` +
          `Verified Sources:\n` +
          s.sources
            .map((src) => `- ${src.name} [${src.outletType || 'Press'}] (${src.date}): ${src.url}`)
            .join('\n') +
          `\n\n------------------------------------------------\n`
      ),
      `KEY DEVELOPMENTS TO WATCH ACROSS THE U.S.:`,
      ...report.keyDevelopmentsToWatch.map((k) => `• ${k}`),
      `\n------------------------------------------------`,
      `DISCLAIMER:`,
      report.disclaimer,
    ];

    navigator.clipboard.writeText(textLines.join('\n'));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const scrollToStory = (rank: number) => {
    setSelectedStoryId(rank);
    const el = document.getElementById(`story-${rank}`);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <div className="space-y-4">
      {/* Top action header: Professional Executive Toolbar with Glowing Effects in Dark Mode */}
      <div
        className={`flex flex-wrap items-center justify-between gap-3 p-3.5 sm:p-4 rounded-xl border transition-colors duration-200 no-print ${
          isDark
            ? 'bg-[#0c1222] border-slate-800 text-slate-100 shadow-[0_4px_25px_rgba(0,0,0,0.4)]'
            : 'bg-white border-slate-200/90 text-slate-900 shadow-xs'
        }`}
      >
        <div className="flex items-center gap-2.5">
          <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-serif font-black text-xs shadow-xs ${
            isDark ? 'bg-cyan-600 text-white glow-cyan-sm' : 'bg-[#0b192c] text-white'
          }`}>
            US
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className={`font-extrabold text-sm tracking-tight ${isDark ? 'text-white' : 'text-[#0b192c]'}`}>
                Report Actions &amp; Distribution
              </h2>
              <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-md border hidden sm:inline ${
                isDark
                  ? 'bg-emerald-950/60 border-emerald-500/40 text-emerald-400 glow-emerald'
                  : 'text-emerald-700 bg-emerald-50 border-emerald-200'
              }`}>
                Verified Desk
              </span>
            </div>
            <p className={`text-[11px] ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
              {report.storiesVerified} Ranked Stories · {totalVerifiedSources} Primary Sources · {report.reportDate}
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center gap-2">
          {/* View Mode Toggle */}
          <div className={`hidden md:flex items-center p-0.5 rounded-lg border text-xs font-semibold ${
            isDark ? 'bg-slate-900 border-slate-800' : 'bg-slate-100 border-slate-200'
          }`}>
            <button
              onClick={() => setViewMode('full')}
              className={`px-2.5 py-1 rounded-md transition-all cursor-pointer ${
                viewMode === 'full'
                  ? isDark
                    ? 'bg-cyan-950 border border-cyan-500/40 text-cyan-300 glow-cyan-sm'
                    : 'bg-white text-slate-900 shadow-xs'
                  : isDark
                  ? 'text-slate-400 hover:text-white'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Full Dossier
            </button>
            <button
              onClick={() => setViewMode('compact')}
              className={`px-2.5 py-1 rounded-md transition-all cursor-pointer ${
                viewMode === 'compact'
                  ? isDark
                    ? 'bg-cyan-950 border border-cyan-500/40 text-cyan-300 glow-cyan-sm'
                    : 'bg-white text-slate-900 shadow-xs'
                  : isDark
                  ? 'text-slate-400 hover:text-white'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Compact View
            </button>
          </div>

          {/* Share Report Button with glowing pulse */}
          <button
            onClick={() => setShowShareModal(true)}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer border ${
              isDark
                ? 'bg-blue-950/60 border-blue-500/50 text-blue-300 hover:bg-blue-900/80 glow-blue-sm'
                : 'border-blue-200 bg-blue-50 text-blue-700 hover:bg-blue-100 shadow-2xs'
            }`}
            title="Share report via deep-link or executive summary"
          >
            <Share2 className="w-3.5 h-3.5" />
            <span>Share Report</span>
          </button>

          {/* Copy Plain Text */}
          <button
            onClick={handleCopyText}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-semibold transition-colors cursor-pointer ${
              isDark
                ? 'border-slate-800 bg-slate-900 text-slate-300 hover:bg-slate-800 hover:text-white'
                : 'border-slate-200 text-slate-700 hover:bg-slate-50'
            }`}
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5 text-slate-400" />}
            <span>{copied ? 'Copied' : 'Copy Text'}</span>
          </button>

          {/* Browser Print / Save */}
          <button
            onClick={handlePrint}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-semibold transition-colors cursor-pointer ${
              isDark
                ? 'border-slate-800 bg-slate-900 text-slate-300 hover:bg-slate-800 hover:text-white'
                : 'border-slate-200 text-slate-700 hover:bg-slate-50'
            }`}
          >
            <Printer className="w-3.5 h-3.5 text-slate-400" />
            <span>Print</span>
          </button>

          {/* Download 1-Page Summary PDF */}
          <button
            onClick={handleDownloadSummaryPdf}
            disabled={downloadingSummaryPdf}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-semibold transition-colors cursor-pointer ${
              isDark
                ? 'border-slate-800 bg-slate-900 text-emerald-400 hover:bg-slate-800'
                : 'border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-700'
            }`}
          >
            <FileCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span>{downloadingSummaryPdf ? 'Generating...' : 'Summary (PDF)'}</span>
          </button>

          {/* Download Full PDF with glowing highlight */}
          <button
            onClick={handleDownloadFullPdf}
            disabled={downloadingPdf}
            className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              isDark
                ? 'bg-red-700 hover:bg-red-600 text-white glow-red-sm border border-red-500/50'
                : 'bg-[#0b192c] hover:bg-[#1a3d60] text-white shadow-xs'
            }`}
          >
            <Download className="w-3.5 h-3.5 text-white" />
            <span>{downloadingPdf ? 'Preparing...' : 'Full PDF'}</span>
          </button>
        </div>
      </div>

      {/* Quick-Jump Story Navigator & Search / Filter Strip */}
      <div
        className={`p-3 sm:p-3.5 rounded-xl border no-print space-y-3 transition-colors duration-200 ${
          isDark
            ? 'bg-[#0c1222] border-slate-800 text-slate-200 shadow-xs'
            : 'bg-white border-slate-200/90 text-slate-800 shadow-xs'
        }`}
      >
        {/* Quick-Jump Story Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs scrollbar-thin">
          <span className={`text-[11px] font-bold uppercase tracking-wider shrink-0 pr-1 ${
            isDark ? 'text-slate-400' : 'text-slate-400'
          }`}>
            Jump to:
          </span>
          {report.tableOfContents.map((toc) => (
            <button
              key={toc.rank}
              onClick={() => scrollToStory(toc.rank)}
              className={`shrink-0 px-2.5 py-1 rounded-md font-mono text-xs font-bold transition-all cursor-pointer border ${
                selectedStoryId === toc.rank
                  ? isDark
                    ? 'bg-red-700 text-white border-red-500 glow-red-sm'
                    : 'bg-red-700 text-white border-red-600 shadow-xs'
                  : isDark
                  ? 'bg-slate-900 border-slate-800 text-slate-300 hover:bg-slate-800 hover:border-slate-700'
                  : 'bg-slate-100 border-slate-200 hover:bg-slate-200 text-slate-700'
              }`}
            >
              #{toc.rank}
            </button>
          ))}
          <a
            href="#key-developments"
            className={`shrink-0 px-2.5 py-1 rounded-md text-xs font-semibold border ${
              isDark
                ? 'bg-slate-900 border-slate-800 text-slate-300 hover:bg-slate-800'
                : 'bg-slate-100 border-slate-200 hover:bg-slate-200 text-slate-700'
            }`}
          >
            Watchlist
          </a>
          <a
            href="#sources-ledger"
            className={`shrink-0 px-2.5 py-1 rounded-md text-xs font-semibold border ${
              isDark
                ? 'bg-slate-900 border-slate-800 text-slate-300 hover:bg-slate-800'
                : 'bg-slate-100 border-slate-200 hover:bg-slate-200 text-slate-700'
            }`}
          >
            All Sources
          </a>
        </div>

        {/* Search & Category Filter Controls */}
        <div className={`flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2 border-t ${
          isDark ? 'border-slate-800' : 'border-slate-100'
        }`}>
          {/* Search Input */}
          <div className="relative flex-1 max-w-md">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              placeholder="Search stories by keyword, agency, topic..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={`w-full pl-8.5 pr-8 py-1.5 rounded-lg text-xs placeholder-slate-400 focus:outline-hidden focus:ring-1 ${
                isDark
                  ? 'bg-slate-900 border border-slate-700 text-white focus:ring-cyan-500'
                  : 'bg-slate-50 border border-slate-200 text-slate-800 focus:ring-blue-500'
              }`}
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200 p-0.5 cursor-pointer"
              >
                <X className="w-3 h-3" />
              </button>
            )}
          </div>

          {/* Showing count and reset */}
          <div className="flex items-center gap-2 text-xs font-medium shrink-0">
            <Filter className="w-3.5 h-3.5 text-slate-400" />
            <span className={isDark ? 'text-slate-400' : 'text-slate-500'}>
              Showing {filteredStories.length} of {report.stories.length} stories
            </span>
            {(searchQuery || activeCategoryFilter !== 'All') && (
              <button
                onClick={() => {
                  setSearchQuery('');
                  setActiveCategoryFilter('All');
                }}
                className={`font-semibold underline ml-1 cursor-pointer ${
                  isDark ? 'text-cyan-400 hover:text-cyan-300' : 'text-blue-600 hover:text-blue-800'
                }`}
              >
                Reset
              </button>
            )}
          </div>
        </div>

        {/* Category Filter Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-0.5 scrollbar-thin">
          {availableCategories.map((cat) => {
            const isSelected = activeCategoryFilter === cat;
            const count =
              cat === 'All'
                ? report.stories.length
                : report.stories.filter((s) => s.category === cat).length;
            return (
              <button
                key={cat}
                onClick={() => setActiveCategoryFilter(cat)}
                className={`shrink-0 px-2.5 py-1 rounded-md text-[11px] font-medium transition-colors cursor-pointer border ${
                  isSelected
                    ? isDark
                      ? 'bg-cyan-600 text-white border-cyan-400 font-bold glow-cyan-sm'
                      : 'bg-[#0b192c] text-white border-slate-900 font-bold shadow-2xs'
                    : isDark
                    ? 'bg-slate-900/80 border-slate-800 text-slate-300 hover:bg-slate-800'
                    : 'bg-slate-100 border-slate-200 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {cat}{' '}
                <span className={isSelected ? 'text-cyan-200' : isDark ? 'text-slate-500' : 'text-slate-400'}>
                  ({count})
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Share Report Modal */}
      {showShareModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 backdrop-blur-xs p-4 no-print animate-in fade-in duration-150">
          <div className={`rounded-2xl border max-w-lg w-full p-6 shadow-2xl relative space-y-5 ${
            isDark ? 'bg-[#0c1222] border-slate-700 text-slate-100 glow-blue' : 'bg-white border-slate-200 text-slate-900'
          }`}>
            <div className={`flex items-start justify-between border-b pb-3 ${
              isDark ? 'border-slate-800' : 'border-slate-100'
            }`}>
              <div className="flex items-center gap-2.5">
                <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${
                  isDark ? 'bg-cyan-950 text-cyan-400 border border-cyan-500/40 glow-cyan-sm' : 'bg-blue-50 text-blue-700'
                }`}>
                  <Share2 className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-bold text-base">Share Daily Briefing</h3>
                  <p className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                    Distribute verified national intelligence to teams and leadership.
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowShareModal(false)}
                className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                  isDark ? 'text-slate-400 hover:text-white hover:bg-slate-800' : 'text-slate-400 hover:text-slate-600 hover:bg-slate-100'
                }`}
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Section 1: Deep Link */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold flex items-center gap-1.5">
                <Link2 className="w-3.5 h-3.5 text-cyan-400" />
                Shareable Deep-Link URL
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  readOnly
                  value={deepLinkUrl}
                  className={`flex-1 border rounded-lg px-3 py-2 text-xs font-mono outline-hidden ${
                    isDark ? 'bg-slate-900 border-slate-700 text-slate-200' : 'bg-slate-50 border-slate-200 text-slate-700'
                  }`}
                />
                <button
                  onClick={handleCopyDeepLink}
                  className="px-3.5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-bold flex items-center gap-1.5 shrink-0 transition-colors shadow-xs cursor-pointer glow-blue-sm"
                >
                  {copiedDeepLink ? (
                    <>
                      <Check className="w-3.5 h-3.5" />
                      <span>Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>Copy Link</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Section 2: Executive Summary Copy */}
            <div className={`space-y-2 pt-2 border-t ${isDark ? 'border-slate-800' : 'border-slate-100'}`}>
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold flex items-center gap-1.5">
                  <Send className="w-3.5 h-3.5 text-violet-400" />
                  Executive Distribution Summary
                </label>
                <button
                  onClick={handleCopySummary}
                  className={`text-xs font-bold flex items-center gap-1 cursor-pointer ${
                    isDark ? 'text-cyan-400 hover:text-cyan-300' : 'text-blue-600 hover:text-blue-800'
                  }`}
                >
                  {copiedSummary ? (
                    <>
                      <Check className="w-3 h-3 text-emerald-400" />
                      <span className="text-emerald-400">Copied to Clipboard!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3 h-3" />
                      <span>Copy Summary Text</span>
                    </>
                  )}
                </button>
              </div>

              <div className={`border rounded-xl p-3 max-h-36 overflow-y-auto text-xs font-mono leading-relaxed whitespace-pre-wrap select-all ${
                isDark ? 'bg-slate-900/90 border-slate-800 text-slate-300' : 'bg-slate-50 border-slate-200 text-slate-700'
              }`}>
                {`🇺🇸 USA DAILY NEWS BRIEFING — ${report.reportDate}\nGenerated: ${report.generatedAt}\n\nTOP DEVELOPMENTS:\n` +
                  displayedStories
                    .slice(0, 3)
                    .map((s) => `• #${s.rank} [${s.category}] ${s.headline}`)
                    .join('\n') +
                  `\n...and 6 more verified developments.\n\nLink: ${deepLinkUrl}`}
              </div>
            </div>

            {/* Section 3: Instant PDF Downloads */}
            <div className={`space-y-2 pt-2 border-t ${isDark ? 'border-slate-800' : 'border-slate-100'}`}>
              <label className="text-xs font-bold">Instant PDF Downloads</label>
              <div className="grid grid-cols-2 gap-2.5">
                <button
                  onClick={handleDownloadSummaryPdf}
                  disabled={downloadingSummaryPdf}
                  className={`p-2.5 rounded-xl border text-left transition-colors flex items-center gap-2.5 cursor-pointer ${
                    isDark
                      ? 'bg-slate-900 border-slate-800 hover:border-emerald-500/50 hover:bg-slate-800'
                      : 'bg-slate-50 border-slate-200 hover:bg-white hover:border-blue-300'
                  }`}
                >
                  <FileCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                  <div>
                    <div className="text-xs font-bold">Summary (PDF)</div>
                    <div className={`text-[10px] ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>1-Page Executive Snapshot</div>
                  </div>
                </button>

                <button
                  onClick={handleDownloadFullPdf}
                  disabled={downloadingPdf}
                  className={`p-2.5 rounded-xl border text-left transition-colors flex items-center gap-2.5 cursor-pointer ${
                    isDark
                      ? 'bg-blue-950/40 border-blue-500/40 hover:bg-blue-900/60 glow-blue-sm'
                      : 'border-blue-200 bg-blue-50/60 hover:bg-blue-100'
                  }`}
                >
                  <Download className="w-4 h-4 text-cyan-400 shrink-0" />
                  <div>
                    <div className="text-xs font-bold text-cyan-300">Full Dossier (PDF)</div>
                    <div className={`text-[10px] ${isDark ? 'text-cyan-400' : 'text-blue-700'}`}>Complete 9-Story Dossier</div>
                  </div>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* The Printable Newsroom Document Card (Theme-Adaptive & Glowing in Dark Mode, Pure Paper on Print) */}
      <div
        id="news-report-document"
        className={`print-document rounded-2xl border p-6 sm:p-10 transition-all duration-200 ${
          isDark
            ? 'bg-[#0b1120] border-slate-800/90 text-slate-100 shadow-[0_8px_40px_rgba(0,0,0,0.65)]'
            : 'bg-white border-slate-200/90 text-slate-900 shadow-sm'
        }`}
      >
        {/* Document Broadsheet Masthead */}
        <div className={`border-b-2 pb-5 ${isDark ? 'border-slate-800' : 'border-slate-900'}`}>
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
            <div className="space-y-1">
              <div className="text-[11px] font-bold uppercase tracking-widest flex items-center gap-2">
                <span className={isDark ? 'text-cyan-400' : 'text-slate-400'}>National News Intelligence Desk</span>
                <span className="text-slate-600">·</span>
                <span className="text-red-500 font-bold flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 inline text-emerald-400" />
                  Verified Reporting
                </span>
              </div>
              <h1 className={`text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight font-editorial-serif ${
                isDark ? 'text-white glow-text-cyan' : 'text-[#0b192c]'
              }`}>
                {report.title}
              </h1>
              <div className={`text-xs font-medium flex flex-wrap items-center gap-1.5 ${
                isDark ? 'text-slate-300' : 'text-slate-600'
              }`}>
                <span>Top 9 Verified U.S. News Developments · {report.reportDate}</span>
                {report.trendingTopic && (
                  <>
                    <span aria-hidden="true" className="text-slate-600">·</span>
                    <span className="text-red-400 font-bold flex items-center gap-1">
                      <span>⚡ Breaking / Trending Desk:</span>
                      <span className={`underline decoration-red-400 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                        {report.trendingTopic}
                      </span>
                    </span>
                  </>
                )}
              </div>
            </div>

            {/* Meta right aligned */}
            <div className={`text-left sm:text-right text-[11px] space-y-0.5 border-t sm:border-t-0 pt-2 sm:pt-0 font-medium ${
              isDark ? 'border-slate-800 text-slate-400' : 'border-slate-100 text-slate-500'
            }`}>
              <div>
                <span className={isDark ? 'text-slate-200 font-semibold' : 'text-slate-700 font-semibold'}>DATE:</span> {report.reportDate}
              </div>
              <div>
                <span className={isDark ? 'text-slate-200 font-semibold' : 'text-slate-700 font-semibold'}>COMPILED:</span> {report.generatedAt}
              </div>
              <div className="flex sm:justify-end items-center gap-1 font-semibold text-emerald-400">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>STORIES VERIFIED: {report.storiesVerified} OF 9</span>
              </div>
            </div>
          </div>

          {/* Authentic Broadsheet Double-Rule with Glowing Effect */}
          <div className="mt-5 space-y-1">
            <div className={`h-1 w-full ${
              isDark ? 'bg-gradient-to-r from-blue-600 via-cyan-400 to-blue-600 glow-cyan-sm' : 'bg-[#0b192c]'
            }`} />
            <div className={`h-0.5 w-full ${
              isDark ? 'bg-gradient-to-r from-red-600 to-rose-500 glow-red-sm' : 'bg-red-700'
            }`} />
          </div>
        </div>

        {/* Executive Summary: Today's News Snapshot */}
        <section className={`mt-6 p-5 sm:p-6 rounded-xl border print-page-break-inside ${
          isDark
            ? 'bg-slate-900/70 border-slate-800 text-slate-200'
            : 'bg-slate-50/90 border-slate-200/90 text-slate-800'
        }`}>
          <div className="flex items-center gap-2 mb-2.5">
            <Newspaper className="w-4 h-4 text-red-500" />
            <h2 className={`text-xs font-bold uppercase tracking-wider ${
              isDark ? 'text-cyan-300' : 'text-[#0b192c]'
            }`}>
              Today's News Snapshot (Executive Summary)
            </h2>
          </div>
          <p className="text-xs sm:text-sm leading-relaxed font-normal">
            {report.executiveSummary}
          </p>
        </section>

        {/* Table of Contents / Story Index */}
        <section className={`mt-6 p-4 sm:p-5 rounded-xl border print-page-break-inside ${
          isDark ? 'bg-slate-900/50 border-slate-800' : 'bg-white border-slate-200'
        }`}>
          <div className={`flex items-center justify-between mb-3 border-b pb-2 ${
            isDark ? 'border-slate-800' : 'border-slate-100'
          }`}>
            <div className="flex items-center gap-2">
              <Compass className="w-4 h-4 text-cyan-400" />
              <h2 className={`text-xs font-bold uppercase tracking-wider ${
                isDark ? 'text-white' : 'text-[#0b192c]'
              }`}>
                Table of Contents &amp; Story Index
              </h2>
            </div>
            <span className={`text-[11px] font-medium ${isDark ? 'text-slate-400' : 'text-slate-400'}`}>
              9 Selected Developments
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-2 text-xs">
            {report.tableOfContents.map((item) => (
              <a
                key={item.rank}
                href={`#story-${item.rank}`}
                onClick={() => setSelectedStoryId(item.rank)}
                className={`group flex items-start gap-2 py-1 transition-colors ${
                  isDark ? 'text-slate-300 hover:text-cyan-300' : 'text-slate-700 hover:text-blue-700'
                }`}
              >
                <span className={`font-mono tabular-nums font-bold shrink-0 w-6 ${
                  isDark ? 'text-red-400' : 'text-red-700'
                }`}>
                  #{String(item.rank).padStart(2, '0')}.
                </span>
                <span className="line-clamp-1 group-hover:underline font-medium">
                  {item.headline}
                </span>
              </a>
            ))}
          </div>
        </section>

        {/* Story Index Divider */}
        <div className={`my-8 border-b ${isDark ? 'border-slate-800' : 'border-slate-200'}`} />

        {/* Stories Listing */}
        {filteredStories.length === 0 ? (
          <div className="py-12 text-center space-y-2 text-slate-500">
            <Search className="w-8 h-8 mx-auto text-slate-400" />
            <p className="text-sm font-semibold">No stories match your filter criteria.</p>
            <button
              onClick={() => {
                setSearchQuery('');
                setActiveCategoryFilter('All');
              }}
              className="text-xs font-bold text-cyan-400 hover:underline cursor-pointer"
            >
              Reset search &amp; show all 9 stories
            </button>
          </div>
        ) : (
          <div className="space-y-8">
            {filteredStories.map((story) => {
              const isTopStory = story.rank === 1 || story.rank === 2;
              return (
                <article
                  key={story.rank}
                  id={`story-${story.rank}`}
                  className={`p-6 sm:p-7 rounded-xl border transition-all duration-200 print-page-break-inside ${
                    isDark
                      ? `bg-[#090e1a] border-slate-800 hover:border-cyan-500/40 ${
                          isTopStory ? 'shadow-[0_0_20px_rgba(244,63,94,0.08)]' : ''
                        }`
                      : 'bg-white border-slate-200 shadow-2xs hover:border-slate-300'
                  }`}
                >
                  {/* Story Top Kicker */}
                  <div className="flex items-start justify-between gap-3 mb-2.5">
                    <div className="flex flex-wrap items-center gap-2 text-xs font-medium">
                      <span
                        className={`font-mono tabular-nums font-extrabold text-sm sm:text-base px-2 py-0.5 rounded border ${
                          isDark
                            ? story.significanceRating === 'Critical'
                              ? 'bg-rose-950/60 border-rose-500/50 text-rose-300 glow-red-sm'
                              : story.significanceRating === 'High'
                              ? 'bg-amber-950/60 border-amber-500/50 text-amber-300 glow-amber-sm'
                              : 'bg-cyan-950/60 border-cyan-500/50 text-cyan-300 glow-cyan-sm'
                            : 'bg-slate-100 border-slate-200 text-[#0b192c]'
                        }`}
                      >
                        #{String(story.rank).padStart(2, '0')}
                      </span>
                      <span aria-hidden="true" className="text-slate-600">·</span>
                      <span className={`font-bold uppercase tracking-wider text-[11px] ${
                        isDark ? 'text-red-400' : 'text-red-700'
                      }`}>
                        {story.category}
                      </span>
                      <span aria-hidden="true" className="text-slate-600">·</span>
                      <span className={`flex items-center gap-1 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                        <MapPin className="w-3 h-3 text-slate-400" />
                        {story.location}
                      </span>
                      <span aria-hidden="true" className="text-slate-600">·</span>
                      <span className={isDark ? 'text-slate-400' : 'text-slate-500'}>{story.date}</span>
                    </div>

                    {story.significanceRating && (
                      <span className={`text-[10px] font-bold uppercase tracking-wider font-mono px-2 py-0.5 rounded border ${
                        isDark
                          ? story.significanceRating === 'Critical'
                            ? 'bg-red-950/40 border-red-500/40 text-red-300'
                            : 'bg-slate-900 border-slate-700 text-slate-300'
                          : 'text-slate-600 bg-slate-100 border-slate-200'
                      }`}>
                        {story.significanceRating} Priority
                      </span>
                    )}
                  </div>

                  {/* Headline with glowing serif font in dark mode */}
                  <h3 className={`font-editorial-serif text-xl sm:text-2xl font-bold leading-snug tracking-tight mb-3 ${
                    isDark ? 'text-white' : 'text-slate-900'
                  }`}>
                    {story.headline}
                  </h3>

                  {/* Factual 100-150 word summary */}
                  <p className={`text-xs sm:text-sm leading-relaxed font-normal mb-4 ${
                    isDark ? 'text-slate-300' : 'text-slate-700'
                  }`}>
                    {story.summary}
                  </p>

                  {/* Key Facts & Why It Matters Split Box */}
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-3.5 mb-4">
                    {/* Key facts: 3 bullet points */}
                    <div className={`lg:col-span-7 rounded-lg p-3.5 border ${
                      isDark ? 'bg-slate-900/80 border-slate-800' : 'bg-slate-50/90 border-slate-200/80'
                    }`}>
                      <h4 className={`text-[11px] font-bold uppercase tracking-wider mb-2 flex items-center gap-1.5 ${
                        isDark ? 'text-cyan-300' : 'text-[#0b192c]'
                      }`}>
                        <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 shadow-[0_0_6px_rgba(34,211,238,0.8)]" />
                        Key Facts (Verified)
                      </h4>
                      <ul className={`space-y-1.5 text-xs ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                        {story.keyFacts.map((fact, fIdx) => (
                          <li key={fIdx} className="flex items-start gap-2">
                            <span className="text-cyan-400 font-black text-sm leading-tight">•</span>
                            <span className="leading-relaxed">{fact}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Why it matters with ambient glow */}
                    <div className={`lg:col-span-5 rounded-lg p-3.5 border ${
                      isDark ? 'bg-blue-950/40 border-blue-900/60 glow-blue-sm' : 'bg-blue-50/60 border-blue-100'
                    }`}>
                      <h4 className={`text-[11px] font-bold uppercase tracking-wider mb-1.5 flex items-center gap-1.5 ${
                        isDark ? 'text-cyan-300' : 'text-blue-900'
                      }`}>
                        <Eye className="w-3.5 h-3.5 text-cyan-400" />
                        Why It Matters to Americans
                      </h4>
                      <p className={`text-xs leading-relaxed ${isDark ? 'text-slate-200' : 'text-blue-950'}`}>
                        {story.whyItMatters}
                      </p>
                    </div>
                  </div>

                  {/* What to Watch Next */}
                  <div className={`flex items-start gap-2 text-xs p-2.5 rounded-lg border mb-4 ${
                    isDark ? 'bg-slate-900/50 border-slate-800 text-slate-300' : 'bg-slate-50/60 border-slate-100 text-slate-600'
                  }`}>
                    <span className={`font-bold shrink-0 ${isDark ? 'text-cyan-400' : 'text-[#0b192c]'}`}>
                      What Happens Next:
                    </span>
                    <span className="leading-relaxed">{story.whatHappensNext}</span>
                  </div>

                  {/* Sources with Clickable Direct Links & Professional Newsroom Badges */}
                  <div className={`pt-3.5 border-t space-y-2.5 ${isDark ? 'border-slate-800' : 'border-slate-100'}`}>
                    <div className="flex items-center justify-between text-xs font-bold">
                      <span className={`flex items-center gap-1.5 ${isDark ? 'text-white' : 'text-[#0b192c]'}`}>
                        <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                        Verified Primary Sources ({story.sources.length} Independent Outlets)
                      </span>
                      <span className={`text-[10px] font-medium hidden sm:inline ${isDark ? 'text-slate-400' : 'text-slate-400'}`}>
                        Direct Article &amp; Wire Verification
                      </span>
                    </div>

                    {/* Sources Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5 pt-1">
                      {story.sources.map((src, sIdx) => {
                        const badge = getOutletTypeBadge(src.outletType, isDark);
                        const BadgeIcon = badge.icon;
                        const domainName =
                          src.channelOrDomain ||
                          (src.url.startsWith('http')
                            ? new URL(src.url).hostname.replace('www.', '')
                            : 'source.gov');

                        return (
                          <div
                            key={sIdx}
                            className={`p-3 rounded-lg border transition-all flex flex-col justify-between gap-2 ${
                              isDark
                                ? 'bg-slate-900/90 border-slate-800 hover:border-cyan-500/50 hover:shadow-[0_0_15px_rgba(6,182,212,0.15)]'
                                : 'bg-slate-50/70 border-slate-200/90 hover:bg-white hover:border-blue-300 hover:shadow-xs'
                            }`}
                          >
                            <div>
                              <div className="flex items-center justify-between gap-1 mb-1.5">
                                <span className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[9.5px] font-bold border ${badge.bg}`}>
                                  <BadgeIcon className="w-2.5 h-2.5" />
                                  <span>{badge.label}</span>
                                </span>
                                <span className={`text-[10px] font-medium ${isDark ? 'text-slate-400' : 'text-slate-400'}`}>
                                  {src.date}
                                </span>
                              </div>

                              <div className={`font-bold text-xs line-clamp-1 flex items-center gap-1 ${
                                isDark ? 'text-slate-100' : 'text-slate-900'
                              }`}>
                                <span>{src.name}</span>
                                {src.isVerified !== false && (
                                  <Check className="w-3 h-3 text-emerald-400 inline shrink-0" />
                                )}
                              </div>

                              {src.articleTitle && (
                                <p className={`text-[11px] italic line-clamp-2 mt-1 leading-snug ${
                                  isDark ? 'text-slate-300' : 'text-slate-600'
                                }`}>
                                  "{src.articleTitle}"
                                </p>
                              )}
                            </div>

                            <div className={`pt-1.5 border-t flex items-center justify-between ${
                              isDark ? 'border-slate-800' : 'border-slate-200/70'
                            }`}>
                              <span className={`text-[10px] font-mono ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                                {domainName}
                              </span>
                              <a
                                href={src.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className={`inline-flex items-center gap-1 text-[11px] font-bold hover:underline ${
                                  isDark ? 'text-cyan-400 hover:text-cyan-300' : 'text-blue-600 hover:text-blue-800'
                                }`}
                              >
                                <span>Read Source</span>
                                <ExternalLink className="w-3 h-3" />
                              </a>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        )}

        {/* Section: Key Developments to Watch */}
        <section
          id="key-developments"
          className={`mt-10 p-5 rounded-xl border-t-2 border-x border-b print-page-break-inside ${
            isDark
              ? 'bg-slate-900/80 border-slate-800 border-t-cyan-500 glow-cyan-sm'
              : 'bg-slate-50/80 border-slate-200 border-t-[#0b192c]'
          }`}
        >
          <h2 className={`text-sm font-bold uppercase tracking-wider mb-3 flex items-center gap-2 ${
            isDark ? 'text-cyan-300' : 'text-[#0b192c]'
          }`}>
            <span className="w-2 h-2 rounded-full bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.8)]" />
            Key Developments to Watch Across America
          </h2>
          <div className="space-y-2.5">
            {report.keyDevelopmentsToWatch.map((dev, dIdx) => (
              <div key={dIdx} className={`flex items-start gap-2.5 text-xs ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                <span className="text-red-500 font-bold text-sm leading-none">•</span>
                <p className="leading-relaxed">{dev}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Section: Complete Sources Directory */}
        <section
          id="sources-ledger"
          className={`mt-8 pt-6 border-t text-xs print-page-break-inside space-y-3 ${
            isDark ? 'border-slate-800' : 'border-slate-200'
          }`}
        >
          <div className="flex items-center justify-between">
            <h2 className={`text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 ${
              isDark ? 'text-slate-200' : 'text-slate-900'
            }`}>
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              Complete Sources &amp; Verified Citations Directory
            </h2>
            <span className={`text-[11px] font-medium ${isDark ? 'text-slate-400' : 'text-slate-400'}`}>
              {report.completeSources.length} Primary Records Cited
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5 text-[11px]">
            {report.completeSources.map((cs, idx) => (
              <div
                key={idx}
                className={`p-2 rounded-lg border flex items-center justify-between gap-2 ${
                  isDark ? 'bg-slate-900 border-slate-800' : 'bg-slate-50 border-slate-200/80 text-slate-600'
                }`}
              >
                <div className="flex items-center gap-1.5 truncate">
                  <span className="text-slate-500 font-mono text-[10px]">
                    {String(idx + 1).padStart(2, '0')}.
                  </span>
                  <span className={`font-bold shrink-0 ${isDark ? 'text-slate-200' : 'text-slate-900'}`}>
                    {cs.outlet}:
                  </span>
                  <a
                    href={cs.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`hover:underline truncate ${isDark ? 'text-cyan-400' : 'text-blue-600'}`}
                  >
                    {cs.headline}
                  </a>
                </div>
                <ExternalLink className="w-3 h-3 text-slate-500 shrink-0" />
              </div>
            ))}
          </div>
        </section>

        {/* Editorial Disclaimer */}
        <section className={`mt-6 p-4 rounded-lg border text-[11px] leading-relaxed print-page-break-inside flex items-start gap-2.5 ${
          isDark
            ? 'bg-amber-950/30 border-amber-500/40 text-amber-200/90'
            : 'bg-amber-50/70 border-amber-200/80 text-amber-950'
        }`}>
          <AlertCircle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
          <p>
            <strong className="font-semibold">Editorial Disclaimer: </strong>
            {report.disclaimer}
          </p>
        </section>

        {/* Print / Document Footer */}
        <div className={`mt-8 pt-4 border-t flex items-center justify-between text-[10px] font-medium ${
          isDark ? 'border-slate-800 text-slate-500' : 'border-slate-200 text-slate-400'
        }`}>
          <span>USA DAILY NEWS BRIEFING • INTELLIGENCE REPORT</span>
          <span>PAGE 1 OF 5 (PRINT READY A4 / LETTER)</span>
        </div>
      </div>
    </div>
  );
};
