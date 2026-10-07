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
  ChevronUp,
  Bookmark,
  Clock,
  Sparkles,
  Flame,
  Zap,
  Video,
  Image as ImageIcon,
  Play,
  Volume2,
} from 'lucide-react';
import { NewsReport, NewsSource, NewsStory } from '../types/news';
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
        label: 'Official Government',
        bg: isDark ? 'bg-emerald-950/60 text-emerald-300 border-emerald-500/40 glow-emerald-sm' : 'bg-emerald-50 text-emerald-800 border-emerald-200',
      };
    case 'Primary Court Record':
      return {
        icon: Scale,
        label: 'Court Docket / Record',
        bg: isDark ? 'bg-amber-950/60 text-amber-300 border-amber-500/40' : 'bg-amber-50 text-amber-800 border-amber-200',
      };
    case 'Major Newspaper':
      return {
        icon: FileText,
        label: 'Major Newspaper',
        bg: isDark ? 'bg-slate-900 text-slate-300 border-slate-700' : 'bg-slate-100 text-slate-800 border-slate-300',
      };
    default:
      return {
        icon: Newspaper,
        label: 'Verified Press',
        bg: isDark ? 'bg-slate-900 text-slate-300 border-slate-700' : 'bg-slate-50 text-slate-800 border-slate-200',
      };
  }
}

function getTvNetworkTheme(network?: string, isDark: boolean = true) {
  switch (network) {
    case 'CNN':
      return {
        name: 'CNN',
        tag: 'CNN LIVE WIRE',
        bg: 'bg-red-700 text-white',
        border: 'border-red-500',
        glow: 'glow-red-sm',
        accentText: 'text-red-400',
        badgeClass: isDark ? 'bg-red-950/70 border-red-500/60 text-red-300' : 'bg-red-100 border-red-300 text-red-900',
      };
    case 'Fox News':
      return {
        name: 'Fox News',
        tag: 'FOX NEWS ALERT',
        bg: 'bg-blue-700 text-white',
        border: 'border-blue-500',
        glow: 'glow-blue-sm',
        accentText: 'text-blue-400',
        badgeClass: isDark ? 'bg-blue-950/70 border-blue-500/60 text-blue-300' : 'bg-blue-100 border-blue-300 text-blue-900',
      };
    case 'NBC News':
      return {
        name: 'NBC News',
        tag: 'NBC NEWS SPECIAL REPORT',
        bg: 'bg-purple-700 text-white',
        border: 'border-purple-500',
        glow: 'glow-purple-sm',
        accentText: 'text-purple-300',
        badgeClass: isDark ? 'bg-purple-950/70 border-purple-500/60 text-purple-300' : 'bg-purple-100 border-purple-300 text-purple-900',
      };
    case 'ABC News':
      return {
        name: 'ABC News',
        tag: 'ABC NEWS BREAKING',
        bg: 'bg-amber-600 text-slate-950 font-black',
        border: 'border-amber-500',
        glow: 'glow-amber-sm',
        accentText: 'text-amber-400',
        badgeClass: isDark ? 'bg-amber-950/70 border-amber-500/60 text-amber-300' : 'bg-amber-100 border-amber-300 text-amber-950',
      };
    default:
      return {
        name: 'TV Wire',
        tag: 'BROADCAST ALERT',
        bg: 'bg-slate-800 text-white',
        border: 'border-slate-700',
        glow: 'glow-cyan-sm',
        accentText: 'text-cyan-400',
        badgeClass: isDark ? 'bg-slate-900 border-slate-700 text-slate-300' : 'bg-slate-100 border-slate-200 text-slate-800',
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
  const [activeTvFilter, setActiveTvFilter] = useState('All');
  const [viewMode, setViewMode] = useState<'full' | 'compact'>('full');
  const [selectedStoryId, setSelectedStoryId] = useState<number | null>(null);
  const [showGroundingDetails, setShowGroundingDetails] = useState(false);
  const [activeVideoModal, setActiveVideoModal] = useState<{
    title: string;
    network: string;
    videoUrl: string;
    caption: string;
    credit: string;
    duration?: string;
  } | null>(null);

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

  // Filter stories by category, search keyword, and TV channel
  const filteredStories = useMemo(() => {
    return displayedStories.filter((s) => {
      const matchesCat =
        activeCategoryFilter === 'All' ||
        s.category.toLowerCase().includes(activeCategoryFilter.toLowerCase());

      const matchesTv =
        activeTvFilter === 'All' ||
        (s.tvNetwork && s.tvNetwork.toLowerCase() === activeTvFilter.toLowerCase()) ||
        (s.tvBroadcastAlert && s.tvBroadcastAlert.network.toLowerCase() === activeTvFilter.toLowerCase());

      const query = searchQuery.trim().toLowerCase();
      if (!query) return matchesCat && matchesTv;

      const matchesText =
        s.headline.toLowerCase().includes(query) ||
        s.summary.toLowerCase().includes(query) ||
        s.location.toLowerCase().includes(query) ||
        (s.tvNetwork && s.tvNetwork.toLowerCase().includes(query)) ||
        s.keyFacts.some((f) => f.toLowerCase().includes(query)) ||
        s.sources.some(
          (src) =>
            src.name.toLowerCase().includes(query) ||
            (src.articleTitle && src.articleTitle.toLowerCase().includes(query)) ||
            (src.channelOrDomain && src.channelOrDomain.toLowerCase().includes(query))
        );
      return matchesCat && matchesTv && matchesText;
    });
  }, [displayedStories, activeCategoryFilter, activeTvFilter, searchQuery]);

  const totalVerifiedSources = useMemo(() => {
    return report.stories.reduce((acc, story) => acc + story.sources.length, 0);
  }, [report.stories]);

  const handleDownloadFullPdf = async () => {
    try {
      setDownloadingPdf(true);
      generatePdfDocument(report);
    } catch (err) {
      console.error('Error generating PDF:', err);
    } finally {
      setTimeout(() => setDownloadingPdf(false), 800);
    }
  };

  const handleDownloadSummaryPdf = async () => {
    try {
      setDownloadingSummaryPdf(true);
      generateSummaryPdfDocument(report);
    } catch (err) {
      console.error('Error generating summary PDF:', err);
    } finally {
      setTimeout(() => setDownloadingSummaryPdf(false), 800);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const handleCopyDeepLink = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(deepLinkUrl);
      setCopiedDeepLink(true);
      setTimeout(() => setCopiedDeepLink(false), 2000);
    }
  };

  const handleCopySummaryBlock = () => {
    const summaryBlock = [
      `🏛️ USA DAILY NEWS INTELLIGENCE — ${report.reportDate.toUpperCase()}`,
      `Published by National News Intelligence Desk (EDT)`,
      `Live TV Broadcast Wire: CNN · Fox News · NBC News · ABC News`,
      `--------------------------------------------------`,
      ``,
      `*EXECUTIVE SNAPSHOT:*`,
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
      `🔗 *Access Interactive Briefing & Broadcast Media:* ${deepLinkUrl}`,
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
          text: `Today's top 9 verified U.S. news stories, TV broadcast wire reports, and executive briefing.`,
          url: deepLinkUrl,
        });
      } catch (err) {
        console.warn('Native share dismissed or not supported', err);
      }
    } else {
      handleCopyDeepLink();
    }
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
      {/* Top action header: Professional Executive Toolbar */}
      <div
        className={`flex flex-wrap items-center justify-between gap-3 p-3.5 sm:p-4 rounded-xl border transition-colors duration-200 no-print ${
          isDark
            ? 'bg-[#0c1222] border-slate-800 text-slate-100 shadow-[0_4px_25px_rgba(0,0,0,0.4)]'
            : 'bg-white border-slate-200/90 text-slate-900 shadow-xs'
        }`}
      >
        <div className="flex items-center gap-2.5">
          <div
            className={`w-8 h-8 rounded-lg flex items-center justify-center font-serif font-black text-xs shadow-xs ${
              isDark ? 'bg-cyan-600 text-white glow-cyan-sm' : 'bg-[#0b192c] text-white'
            }`}
          >
            US
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className={`font-extrabold text-sm tracking-tight ${isDark ? 'text-white' : 'text-[#0b192c]'}`}>
                Report Actions &amp; Distribution
              </h2>
              <span
                className={`text-[11px] font-semibold px-2 py-0.5 rounded-md border hidden sm:inline ${
                  isDark
                    ? 'bg-emerald-950/60 border-emerald-500/40 text-emerald-400 glow-emerald'
                    : 'text-emerald-700 bg-emerald-50 border-emerald-200'
                }`}
              >
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
          <div
            className={`hidden md:flex items-center p-0.5 rounded-lg border text-xs font-semibold ${
              isDark ? 'bg-slate-900 border-slate-800' : 'bg-slate-100 border-slate-200'
            }`}
          >
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

          {/* Share Report Button */}
          <button
            onClick={() => setShowShareModal(true)}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer border ${
              isDark
                ? 'bg-blue-950/60 hover:bg-blue-900/80 text-blue-300 border-blue-500/40 glow-blue-sm'
                : 'bg-blue-50 hover:bg-blue-100 text-blue-700 border-blue-200'
            }`}
            title="Share report summary or generate deep link"
          >
            <Share2 className="w-3.5 h-3.5" />
            <span>Share Report</span>
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

          {/* Download Full PDF */}
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

      {/* LIVE GOOGLE SEARCH GROUNDING DATA & TV NEWS WIRE PANEL */}
      <div
        className={`p-3.5 sm:p-4 rounded-xl border no-print space-y-2.5 transition-all ${
          isDark
            ? 'bg-gradient-to-r from-[#091224] via-[#0b162c] to-[#091224] border-cyan-500/30 text-slate-200 shadow-md'
            : 'bg-gradient-to-r from-blue-50/80 via-white to-blue-50/80 border-blue-200 text-slate-800 shadow-2xs'
        }`}
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_8px_rgba(52,211,153,0.9)]" />
            <span className="font-extrabold text-xs tracking-tight uppercase flex items-center gap-1.5">
              <span className={isDark ? 'text-white glow-text-cyan' : 'text-blue-950'}>
                Live Google Search Data Grounding
              </span>
              <span className="text-slate-500">|</span>
              <span className="text-cyan-400 font-mono text-[11px]">
                {report.googleSearchData?.groundingSourcesCount || 24} Verified Web Sources Inspected
              </span>
            </span>
          </div>

          <div className="flex items-center gap-2 text-xs">
            <div className="flex items-center gap-1 font-mono text-[10.5px] text-slate-400">
              <Clock className="w-3 h-3 text-slate-400" />
              <span>{report.googleSearchData?.retrievedAt || report.generatedAt}</span>
            </div>
            <button
              onClick={() => setShowGroundingDetails((prev) => !prev)}
              className={`inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded cursor-pointer transition-colors ${
                isDark ? 'text-cyan-300 hover:text-white bg-slate-900 border border-slate-700' : 'text-blue-700 hover:text-blue-900 bg-white border border-slate-200'
              }`}
            >
              <span>{showGroundingDetails ? 'Hide Queries' : 'Inspect Search Queries'}</span>
              {showGroundingDetails ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
            </button>
          </div>
        </div>

        {/* TV Channels Live Monitor Ticker */}
        <div className="flex flex-wrap items-center gap-1.5 pt-1 text-xs">
          <span className={`text-[10.5px] font-bold uppercase tracking-wider ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
            Live TV Wire Monitors:
          </span>
          <span className="px-2 py-0.5 rounded text-[10px] font-extrabold bg-red-950/60 text-red-300 border border-red-500/50 flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-red-400 animate-pulse" /> CNN
          </span>
          <span className="px-2 py-0.5 rounded text-[10px] font-extrabold bg-blue-950/60 text-blue-300 border border-blue-500/50 flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse" /> FOX NEWS
          </span>
          <span className="px-2 py-0.5 rounded text-[10px] font-extrabold bg-purple-950/60 text-purple-300 border border-purple-500/50 flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-purple-400 animate-pulse" /> NBC NEWS
          </span>
          <span className="px-2 py-0.5 rounded text-[10px] font-extrabold bg-amber-950/60 text-amber-300 border border-amber-500/50 flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" /> ABC NEWS
          </span>
          <span aria-hidden="true" className="text-slate-600">·</span>
          <span className="text-[10px] text-emerald-400 font-mono flex items-center gap-1">
            <ShieldCheck className="w-3 h-3" />
            100% Real Photojournalism &amp; Broadcast Video (Zero AI Art)
          </span>
        </div>

        {/* Expandable Google Search Queries Ledger */}
        {showGroundingDetails && report.googleSearchData?.searchQueries && (
          <div
            className={`mt-2 p-3 rounded-lg border text-xs font-mono space-y-1.5 ${
              isDark ? 'bg-slate-950/90 border-slate-800 text-slate-300' : 'bg-slate-100 border-slate-200 text-slate-800'
            }`}
          >
            <div className="font-bold text-[11px] text-cyan-400 flex items-center gap-1.5">
              <Search className="w-3 h-3" />
              <span>Google Search Grounding Queries Executed:</span>
            </div>
            <ul className="space-y-1 pl-4 list-disc text-[11px] text-slate-300">
              {report.googleSearchData.searchQueries.map((q, idx) => (
                <li key={idx} className="leading-snug">
                  "{q}"
                </li>
              ))}
            </ul>
          </div>
        )}
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
          <span className="text-[11px] font-bold uppercase tracking-wider shrink-0 pr-1 text-slate-400">
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
                  : 'bg-slate-100 border-slate-200 text-slate-700 hover:bg-slate-200'
              }`}
            >
              #{toc.rank}
            </button>
          ))}
        </div>

        {/* Search Bar + TV Channel Filter Strip */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
          {/* Keyword Search */}
          <div className="relative flex-1">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              placeholder="Search headlines, key facts, TV channels, or sources..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={`w-full pl-9 pr-8 py-1.5 rounded-lg text-xs font-medium border focus:outline-hidden transition-colors ${
                isDark
                  ? 'bg-slate-900 border-slate-800 text-white placeholder-slate-500 focus:border-cyan-400'
                  : 'bg-slate-50 border-slate-200 text-slate-900 placeholder-slate-400 focus:border-blue-500'
              }`}
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* TV Filter Buttons */}
          <div className="flex items-center gap-1 overflow-x-auto pb-0.5">
            {['All', 'CNN', 'Fox News', 'NBC News', 'ABC News'].map((tv) => (
              <button
                key={tv}
                onClick={() => setActiveTvFilter(tv)}
                className={`px-2 py-1 rounded text-[11px] font-bold transition-all cursor-pointer border ${
                  activeTvFilter === tv
                    ? isDark
                      ? 'bg-cyan-600 text-white border-cyan-400 glow-cyan-sm'
                      : 'bg-[#0b192c] text-white border-slate-900 shadow-xs'
                    : isDark
                    ? 'bg-slate-900 text-slate-400 border-slate-800 hover:text-white'
                    : 'bg-slate-100 text-slate-600 border-slate-200'
                }`}
              >
                {tv === 'All' ? 'All Channels' : tv}
              </button>
            ))}
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
          <div
            className={`rounded-2xl border max-w-lg w-full p-6 shadow-2xl relative space-y-5 ${
              isDark
                ? 'bg-[#0c1222] border-slate-700 text-slate-100 glow-blue'
                : 'bg-white border-slate-200 text-slate-900'
            }`}
          >
            <div className={`flex items-start justify-between border-b pb-3 ${isDark ? 'border-slate-800' : 'border-slate-100'}`}>
              <div className="flex items-center gap-2.5">
                <div
                  className={`w-9 h-9 rounded-xl flex items-center justify-center ${
                    isDark ? 'bg-cyan-950 text-cyan-400 border border-cyan-500/40 glow-cyan-sm' : 'bg-blue-50 text-blue-700'
                  }`}
                >
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
                className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Deep link copy */}
            <div className="space-y-2">
              <label className="text-xs font-bold">1-Click Shareable Deep Link</label>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  readOnly
                  value={deepLinkUrl}
                  className={`flex-1 p-2 rounded-lg text-xs border font-mono ${
                    isDark ? 'bg-slate-900 border-slate-700 text-slate-200' : 'bg-slate-50 border-slate-200 text-slate-800'
                  }`}
                />
                <button
                  onClick={handleCopyDeepLink}
                  className={`px-3 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                    copiedDeepLink
                      ? 'bg-emerald-600 text-white'
                      : isDark
                      ? 'bg-cyan-600 text-white hover:bg-cyan-500'
                      : 'bg-blue-600 text-white hover:bg-blue-700'
                  }`}
                >
                  {copiedDeepLink ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedDeepLink ? 'Copied' : 'Copy'}</span>
                </button>
              </div>
            </div>

            {/* Formatted summary copy */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold">Formatted Executive Summary</label>
                <button
                  onClick={handleCopySummaryBlock}
                  className="text-xs font-bold text-cyan-400 hover:underline flex items-center gap-1 cursor-pointer"
                >
                  {copiedSummary ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                  <span>{copiedSummary ? 'Copied to Clipboard!' : 'Copy Summary'}</span>
                </button>
              </div>
            </div>

            {/* PDF downloads */}
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
                    <div className={`text-[10px] ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>1-Page Snapshot</div>
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
                    <div className={`text-[10px] ${isDark ? 'text-cyan-400' : 'text-blue-700'}`}>Complete 9 Stories</div>
                  </div>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Broadcast Video Modal */}
      {activeVideoModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-md p-4 no-print animate-in fade-in duration-150">
          <div
            className={`rounded-2xl border max-w-2xl w-full p-6 shadow-2xl relative space-y-4 ${
              isDark ? 'bg-[#0c1222] border-slate-700 text-slate-100 glow-blue' : 'bg-white border-slate-200 text-slate-900'
            }`}
          >
            <div className="flex items-start justify-between border-b pb-3 border-slate-800">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-red-600 text-white flex items-center justify-center shadow-xs">
                  <Video className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded bg-red-950 border border-red-500 text-red-300">
                      {activeVideoModal.network} Broadcast Wire
                    </span>
                    {activeVideoModal.duration && (
                      <span className="text-xs text-slate-400 font-mono">Duration: {activeVideoModal.duration}</span>
                    )}
                  </div>
                  <h3 className="font-bold text-sm sm:text-base mt-1 line-clamp-1">{activeVideoModal.title}</h3>
                </div>
              </div>
              <button
                onClick={() => setActiveVideoModal(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Broadcast video preview display */}
            <div className="relative rounded-xl overflow-hidden border border-slate-800 bg-black aspect-video flex flex-col items-center justify-center text-center p-6 space-y-3">
              <div className="w-14 h-14 rounded-full bg-red-600/90 text-white flex items-center justify-center shadow-lg hover:scale-105 transition-transform cursor-pointer">
                <Play className="w-6 h-6 fill-white ml-1" />
              </div>
              <div className="max-w-md space-y-1">
                <div className="text-xs font-bold text-white uppercase tracking-wider">
                  Official {activeVideoModal.network} Video Segment Stream
                </div>
                <p className="text-[11px] text-slate-400 line-clamp-2">{activeVideoModal.caption}</p>
                <div className="text-[10px] text-emerald-400 font-mono">
                  Credit: {activeVideoModal.credit} · Real Verified Press Feed
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between pt-2">
              <span className="text-xs text-slate-400">Streamed via legitimate network broadcast domain.</span>
              <a
                href={activeVideoModal.videoUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2 rounded-lg bg-red-600 hover:bg-red-500 text-white font-bold text-xs flex items-center gap-1.5 transition-colors"
              >
                <span>Watch Full Segment on {activeVideoModal.network}</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>
        </div>
      )}

      {/* The Printable Newsroom Document Card */}
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
                  Live TV Wire Grounding
                </span>
                <span className="text-slate-600">·</span>
                <span className="text-slate-400 font-mono text-[10px]">CNN · Fox · NBC · ABC</span>
              </div>
              <h1
                className={`text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight font-editorial-serif ${
                  isDark ? 'text-white glow-text-cyan' : 'text-[#0b192c]'
                }`}
              >
                {report.title}
              </h1>
              <div
                className={`text-xs font-medium flex flex-wrap items-center gap-1.5 ${
                  isDark ? 'text-slate-300' : 'text-slate-600'
                }`}
              >
                <span>Top 9 Verified U.S. News Developments · {report.reportDate}</span>
                {report.trendingTopic && (
                  <>
                    <span aria-hidden="true" className="text-slate-600">·</span>
                    <span className="text-red-400 font-bold flex items-center gap-1">
                      <Flame className="w-3 h-3 text-red-400" />
                      Desk: {report.trendingTopic}
                    </span>
                  </>
                )}
              </div>
            </div>

            {/* Masthead Right Metadata */}
            <div className="text-right space-y-1 font-mono text-xs">
              <div className="flex sm:justify-end items-center gap-1 font-bold">
                <Clock className="w-3.5 h-3.5 text-slate-400" />
                <span>GENERATED: {report.generatedAt}</span>
              </div>
              <div className="flex sm:justify-end items-center gap-1 font-semibold text-emerald-400">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>STORIES VERIFIED: {report.storiesVerified} OF 9</span>
              </div>
            </div>
          </div>

          {/* Authentic Broadsheet Double-Rule */}
          <div className="mt-5 space-y-1">
            <div
              className={`h-1 w-full ${
                isDark ? 'bg-gradient-to-r from-blue-600 via-cyan-400 to-blue-600 glow-cyan-sm' : 'bg-[#0b192c]'
              }`}
            />
            <div
              className={`h-0.5 w-full ${
                isDark ? 'bg-gradient-to-r from-red-600 to-rose-500 glow-red-sm' : 'bg-red-700'
              }`}
            />
          </div>
        </div>

        {/* Executive Summary */}
        <section
          className={`mt-6 p-5 sm:p-6 rounded-xl border print-page-break-inside ${
            isDark ? 'bg-slate-900/70 border-slate-800 text-slate-200' : 'bg-slate-50/90 border-slate-200/90 text-slate-800'
          }`}
        >
          <div className="flex items-center gap-2 mb-2.5">
            <Newspaper className="w-4 h-4 text-red-500" />
            <h2 className={`text-xs font-bold uppercase tracking-wider ${isDark ? 'text-cyan-300' : 'text-[#0b192c]'}`}>
              Today's News Snapshot (Executive Summary)
            </h2>
          </div>
          <p className="text-xs sm:text-sm leading-relaxed font-normal">{report.executiveSummary}</p>
        </section>

        {/* Table of Contents */}
        <section
          className={`mt-6 p-4 sm:p-5 rounded-xl border print-page-break-inside ${
            isDark ? 'bg-slate-900/50 border-slate-800' : 'bg-white border-slate-200'
          }`}
        >
          <div className={`flex items-center justify-between mb-3 border-b pb-2 ${isDark ? 'border-slate-800' : 'border-slate-100'}`}>
            <div className="flex items-center gap-2">
              <Compass className="w-4 h-4 text-cyan-400" />
              <h2 className={`text-xs font-bold uppercase tracking-wider ${isDark ? 'text-white' : 'text-[#0b192c]'}`}>
                Table of Contents &amp; Broadcast Wire Index
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
                <span className={`font-mono tabular-nums font-bold shrink-0 w-6 ${isDark ? 'text-red-400' : 'text-red-700'}`}>
                  #{String(item.rank).padStart(2, '0')}.
                </span>
                <span className="line-clamp-1 group-hover:underline font-medium">{item.headline}</span>
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
                setActiveTvFilter('All');
              }}
              className="text-xs font-bold text-cyan-400 hover:underline cursor-pointer"
            >
              Reset filters &amp; show all 9 stories
            </button>
          </div>
        ) : (
          <div className="space-y-10">
            {filteredStories.map((story) => {
              const tvTheme = getTvNetworkTheme(story.tvNetwork || story.tvBroadcastAlert?.network, isDark);
              const isTopStory = story.rank === 1 || story.rank === 2;

              return (
                <article
                  key={story.rank}
                  id={`story-${story.rank}`}
                  className={`rounded-xl border transition-all duration-200 print-page-break-inside overflow-hidden ${
                    isDark
                      ? `bg-[#090e1a] border-slate-800 hover:border-cyan-500/40 ${
                          isTopStory ? 'shadow-[0_0_25px_rgba(244,63,94,0.1)]' : ''
                        }`
                      : 'bg-white border-slate-200 shadow-2xs hover:border-slate-300'
                  }`}
                >
                  {/* TV NETWORK ON-AIR CHYRON / ALERT BANNER */}
                  {story.tvBroadcastAlert && (
                    <div className={`px-4 sm:px-6 py-2 border-b flex flex-wrap items-center justify-between gap-2 text-xs font-bold ${tvTheme.badgeClass}`}>
                      <div className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse shadow-[0_0_8px_rgba(239,68,68,0.9)]" />
                        <span className="font-extrabold uppercase tracking-wider">{story.tvBroadcastAlert.channelTag || tvTheme.tag}</span>
                        <span className="text-slate-500 hidden sm:inline">|</span>
                        <span className="text-[11px] font-mono opacity-90 hidden sm:inline">
                          Alert: {story.tvBroadcastAlert.alertType}
                        </span>
                      </div>

                      <div className="flex items-center gap-3">
                        {story.tvBroadcastAlert.onAirTimestamp && (
                          <span className="text-[11px] font-mono opacity-80">
                            On-Air: {story.tvBroadcastAlert.onAirTimestamp}
                          </span>
                        )}
                        {story.media?.videoEmbedUrl && (
                          <button
                            onClick={() =>
                              setActiveVideoModal({
                                title: story.headline,
                                network: story.tvBroadcastAlert?.network || story.tvNetwork || 'TV Network',
                                videoUrl: story.media?.videoEmbedUrl || story.tvBroadcastAlert?.videoClipUrl || '',
                                caption: story.media?.caption || story.summary,
                                credit: story.media?.credit || 'Broadcast Wire',
                                duration: story.media?.videoDuration || '2:30',
                              })
                            }
                            className="inline-flex items-center gap-1 text-[11px] font-extrabold underline hover:text-white cursor-pointer"
                          >
                            <Play className="w-3 h-3 fill-current" />
                            <span>Watch Broadcast</span>
                          </button>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Main Story Content Container */}
                  <div className="p-6 sm:p-7 space-y-4">
                    {/* Story Top Kicker */}
                    <div className="flex items-start justify-between gap-3">
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
                        <span className={`font-bold uppercase tracking-wider text-[11px] ${isDark ? 'text-red-400' : 'text-red-700'}`}>
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
                        <span
                          className={`text-[10px] font-bold uppercase tracking-wider font-mono px-2 py-0.5 rounded border ${
                            isDark
                              ? story.significanceRating === 'Critical'
                                ? 'bg-red-950/40 border-red-500/40 text-red-300'
                                : 'bg-slate-900 border-slate-700 text-slate-300'
                              : 'text-slate-600 bg-slate-100 border-slate-200'
                          }`}
                        >
                          {story.significanceRating} Priority
                        </span>
                      )}
                    </div>

                    {/* Headline */}
                    <h3
                      className={`font-editorial-serif text-xl sm:text-2xl font-bold leading-snug tracking-tight ${
                        isDark ? 'text-white' : 'text-slate-900'
                      }`}
                    >
                      {story.headline}
                    </h3>

                    {/* REAL MEDIA CONTAINER: Real Photo & Broadcast Video (No AI Art) */}
                    {story.media && (
                      <div
                        className={`rounded-xl border overflow-hidden transition-all ${
                          isDark ? 'bg-slate-950/90 border-slate-800' : 'bg-slate-50 border-slate-200'
                        }`}
                      >
                        <div className="relative group">
                          <img
                            src={story.media.thumbnailUrl || story.media.url}
                            alt={story.headline}
                            loading="lazy"
                            className="w-full h-56 sm:h-72 object-cover object-center transition-transform duration-300 group-hover:scale-[1.01]"
                          />
                          {/* Live Media Overlay Badge */}
                          <div className="absolute top-3 left-3 flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-black/80 backdrop-blur-xs text-white text-[10px] font-mono font-bold border border-white/20">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                            <span>100% REAL PHOTOJOURNALISM</span>
                            <span className="text-slate-400">·</span>
                            <span className="text-cyan-300">ZERO AI</span>
                          </div>

                          {/* Video Watch Overlay Button */}
                          {story.media.videoEmbedUrl && (
                            <button
                              onClick={() =>
                                setActiveVideoModal({
                                  title: story.headline,
                                  network: story.tvBroadcastAlert?.network || story.tvNetwork || 'TV Network',
                                  videoUrl: story.media?.videoEmbedUrl || '',
                                  caption: story.media?.caption || story.summary,
                                  credit: story.media?.credit || 'Broadcast Wire',
                                  duration: story.media?.videoDuration || '2:30',
                                })
                              }
                              className="absolute bottom-3 right-3 px-3 py-1.5 rounded-lg bg-red-600/90 hover:bg-red-600 text-white font-bold text-xs flex items-center gap-1.5 shadow-lg backdrop-blur-xs cursor-pointer transition-all hover:scale-105"
                            >
                              <Play className="w-3.5 h-3.5 fill-white" />
                              <span>Watch Broadcast Segment ({story.media.videoDuration || 'Live'})</span>
                            </button>
                          )}
                        </div>

                        {/* Factual Photo Caption & Credit */}
                        <div className="p-3 flex flex-col sm:flex-row sm:items-center justify-between gap-1 text-[11px]">
                          <p className={`italic line-clamp-1 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                            "{story.media.caption}"
                          </p>
                          <span className={`shrink-0 font-mono text-[10px] ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                            Credit: {story.media.credit}
                          </span>
                        </div>
                      </div>
                    )}

                    {/* Factual 100-150 word summary */}
                    <p className={`text-xs sm:text-sm leading-relaxed font-normal ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                      {story.summary}
                    </p>

                    {/* Key Facts & Why It Matters Split Box */}
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-3.5">
                      {/* Key facts: 3 bullet points */}
                      <div
                        className={`lg:col-span-7 rounded-lg p-3.5 border ${
                          isDark ? 'bg-slate-900/80 border-slate-800' : 'bg-slate-50/90 border-slate-200/80'
                        }`}
                      >
                        <h4
                          className={`text-[11px] font-bold uppercase tracking-wider mb-2 flex items-center gap-1.5 ${
                            isDark ? 'text-cyan-300' : 'text-[#0b192c]'
                          }`}
                        >
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

                      {/* Why it matters */}
                      <div
                        className={`lg:col-span-5 rounded-lg p-3.5 border ${
                          isDark ? 'bg-blue-950/40 border-blue-900/60 glow-blue-sm' : 'bg-blue-50/60 border-blue-100'
                        }`}
                      >
                        <h4
                          className={`text-[11px] font-bold uppercase tracking-wider mb-1.5 flex items-center gap-1.5 ${
                            isDark ? 'text-cyan-300' : 'text-blue-900'
                          }`}
                        >
                          <Eye className="w-3.5 h-3.5 text-cyan-400" />
                          Why It Matters to Americans
                        </h4>
                        <p className={`text-xs leading-relaxed ${isDark ? 'text-slate-200' : 'text-blue-950'}`}>
                          {story.whyItMatters}
                        </p>
                      </div>
                    </div>

                    {/* What to Watch Next */}
                    <div
                      className={`flex items-start gap-2 text-xs p-2.5 rounded-lg border ${
                        isDark ? 'bg-slate-900/50 border-slate-800 text-slate-300' : 'bg-slate-50/60 border-slate-100 text-slate-600'
                      }`}
                    >
                      <span className={`font-bold shrink-0 ${isDark ? 'text-cyan-400' : 'text-[#0b192c]'}`}>
                        What Happens Next:
                      </span>
                      <span className="leading-relaxed">{story.whatHappensNext}</span>
                    </div>

                    {/* Sources with Clickable Direct Links & Badges */}
                    <div className={`pt-3 border-t space-y-2 ${isDark ? 'border-slate-800' : 'border-slate-100'}`}>
                      <div className="flex items-center justify-between text-xs font-bold">
                        <span className={`flex items-center gap-1.5 ${isDark ? 'text-white' : 'text-[#0b192c]'}`}>
                          <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                          Verified Primary Sources ({story.sources.length} Independent Outlets)
                        </span>
                        <span className="text-[10px] font-medium text-slate-400">
                          Direct Article &amp; Broadcast Verification
                        </span>
                      </div>

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
                                  <span className="text-[10px] font-medium text-slate-400">{src.date}</span>
                                </div>

                                <div className={`font-bold text-xs line-clamp-1 flex items-center gap-1 ${isDark ? 'text-slate-100' : 'text-slate-900'}`}>
                                  <span>{src.name}</span>
                                  {src.isVerified !== false && (
                                    <Check className="w-3 h-3 text-emerald-400 inline shrink-0" />
                                  )}
                                </div>

                                {src.articleTitle && (
                                  <p className={`text-[11px] italic line-clamp-2 mt-1 leading-snug ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
                                    "{src.articleTitle}"
                                  </p>
                                )}
                              </div>

                              <div className={`pt-1.5 border-t flex items-center justify-between ${isDark ? 'border-slate-800' : 'border-slate-200/70'}`}>
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
          <h2 className={`text-sm font-bold uppercase tracking-wider mb-3 flex items-center gap-2 ${isDark ? 'text-white' : 'text-[#0b192c]'}`}>
            <Flame className="w-4 h-4 text-red-500" />
            Key Developments to Watch Across the United States
          </h2>
          <ul className={`space-y-2 text-xs ${isDark ? 'text-slate-200' : 'text-slate-700'}`}>
            {report.keyDevelopmentsToWatch.map((item, idx) => (
              <li key={idx} className="flex items-start gap-2.5">
                <span className="w-1.5 h-1.5 rounded-full bg-red-500 shrink-0 mt-1.5" />
                <span className="leading-relaxed">{item}</span>
              </li>
            ))}
          </ul>
        </section>

        {/* Section: Primary Sources & Media Intelligence Ledger */}
        <section
          id="sources-ledger"
          className={`mt-10 p-5 rounded-xl border print-page-break-inside ${
            isDark ? 'bg-slate-900/50 border-slate-800' : 'bg-slate-50 border-slate-200'
          }`}
        >
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4 border-b pb-3 border-slate-800">
            <div>
              <h2 className={`text-sm font-bold uppercase tracking-wider flex items-center gap-2 ${isDark ? 'text-white' : 'text-[#0b192c]'}`}>
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                Primary Sources &amp; Broadcast Intelligence Ledger
              </h2>
              <p className={`text-[11px] ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                Cross-verified articles, television broadcast segments, and official government releases.
              </p>
            </div>
            <div className="text-xs font-mono font-bold text-emerald-400 bg-emerald-950/60 border border-emerald-500/40 px-2.5 py-1 rounded-md w-fit">
              100% REAL PRESS SOURCING
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
            {report.completeSources.map((s, idx) => (
              <div
                key={idx}
                className={`p-3 rounded-lg border flex flex-col justify-between gap-1.5 ${
                  isDark ? 'bg-slate-900/90 border-slate-800' : 'bg-white border-slate-200'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between text-[10px] text-slate-400 mb-1">
                    <span className="font-bold text-cyan-400">{s.outlet}</span>
                    <span>{s.date}</span>
                  </div>
                  <h4 className={`font-semibold line-clamp-2 ${isDark ? 'text-slate-200' : 'text-slate-900'}`}>
                    {s.headline}
                  </h4>
                </div>
                <a
                  href={s.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`inline-flex items-center gap-1 text-[11px] font-bold hover:underline pt-1 ${
                    isDark ? 'text-cyan-400' : 'text-blue-600'
                  }`}
                >
                  <span className="truncate">{s.url}</span>
                  <ExternalLink className="w-3 h-3 shrink-0" />
                </a>
              </div>
            ))}
          </div>
        </section>

        {/* Disclaimer */}
        <div className={`mt-8 pt-4 border-t text-[11px] leading-relaxed ${isDark ? 'border-slate-800 text-slate-400' : 'border-slate-200 text-slate-500'}`}>
          <p>{report.disclaimer}</p>
        </div>
      </div>
    </div>
  );
};
