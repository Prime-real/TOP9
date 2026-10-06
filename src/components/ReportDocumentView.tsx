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
} from 'lucide-react';
import { NewsReport, NewsSource } from '../types/news';
import { generatePdfDocument, generateSummaryPdfDocument } from '../utils/pdfGenerator';

interface ReportDocumentViewProps {
  report: NewsReport;
  rankingOrder: 'desc' | 'asc';
}

function getOutletTypeBadge(type?: string) {
  switch (type) {
    case 'Wire Service':
      return {
        icon: Globe,
        label: 'Wire Service',
        bg: 'bg-blue-50 text-blue-800 border-blue-200',
        badgeBg: 'bg-blue-600 text-white',
      };
    case 'Broadcast Network':
      return {
        icon: Tv,
        label: 'Broadcast TV / Radio',
        bg: 'bg-purple-50 text-purple-800 border-purple-200',
        badgeBg: 'bg-purple-600 text-white',
      };
    case 'Official Government':
      return {
        icon: Landmark,
        label: 'Official Government (.gov)',
        bg: 'bg-emerald-50 text-emerald-800 border-emerald-200',
        badgeBg: 'bg-emerald-600 text-white',
      };
    case 'Primary Court Record':
      return {
        icon: Scale,
        label: 'Court Docket / Legal Record',
        bg: 'bg-rose-50 text-rose-800 border-rose-200',
        badgeBg: 'bg-rose-600 text-white',
      };
    case 'Major Newspaper':
      return {
        icon: Newspaper,
        label: 'National Newspaper',
        bg: 'bg-amber-50 text-amber-900 border-amber-200',
        badgeBg: 'bg-amber-700 text-white',
      };
    case 'Specialized Journal':
      return {
        icon: FileText,
        label: 'Specialized Journal',
        bg: 'bg-cyan-50 text-cyan-800 border-cyan-200',
        badgeBg: 'bg-cyan-600 text-white',
      };
    default:
      return {
        icon: Newspaper,
        label: 'Verified Press',
        bg: 'bg-slate-50 text-slate-800 border-slate-200',
        badgeBg: 'bg-slate-700 text-white',
      };
  }
}

export const ReportDocumentView: React.FC<ReportDocumentViewProps> = ({
  report,
  rankingOrder,
}) => {
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

  // Total verified source count across all stories
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
      ``,
      `*TODAY'S EXECUTIVE SNAPSHOT:*`,
      report.executiveSummary,
      ``,
      `*TOP 9 NATIONAL DEVELOPMENTS:*`,
      ...displayedStories.map(
        (s) =>
          `*#${s.rank}. [${s.category}]* ${s.headline}\n> • ${s.keyFacts[0] || ''}\n> _Primary Source: ${s.sources[0]?.name || 'Primary Wire'}_`
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
      {/* Top action header: Professional Executive Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-white p-3.5 sm:p-4 rounded-xl border border-slate-200/90 shadow-xs no-print">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-[#0b192c] text-white flex items-center justify-center font-serif font-black text-xs shadow-xs">
            US
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="font-extrabold text-sm text-[#0b192c] tracking-tight">Report Actions &amp; Distribution</h2>
              <span className="text-[11px] text-emerald-700 font-semibold bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200 hidden sm:inline">
                Verified Desk
              </span>
            </div>
            <p className="text-[11px] text-slate-500">
              {report.storiesVerified} Ranked Stories · {totalVerifiedSources} Primary Sources · {report.reportDate}
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center gap-2">
          {/* View Mode Toggle (Full vs Compact) */}
          <div className="hidden md:flex items-center bg-slate-100 p-0.5 rounded-lg border border-slate-200 text-xs font-semibold">
            <button
              onClick={() => setViewMode('full')}
              className={`px-2.5 py-1 rounded-md transition-all cursor-pointer ${
                viewMode === 'full'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
              title="Full detailed dossier view"
            >
              Full Dossier
            </button>
            <button
              onClick={() => setViewMode('compact')}
              className={`px-2.5 py-1 rounded-md transition-all cursor-pointer ${
                viewMode === 'compact'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
              title="Compact executive summary view"
            >
              Compact View
            </button>
          </div>

          {/* Share Report Button */}
          <button
            onClick={() => setShowShareModal(true)}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-blue-200 bg-blue-50 text-xs font-bold text-blue-700 hover:bg-blue-100 transition-colors shadow-2xs cursor-pointer"
            title="Share report via deep-link or executive summary"
          >
            <Share2 className="w-3.5 h-3.5 text-blue-600" />
            <span>Share Report</span>
          </button>

          {/* Copy Plain Text */}
          <button
            onClick={handleCopyText}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors cursor-pointer"
            title="Copy entire structured report as plain text"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5 text-slate-500" />}
            <span>{copied ? 'Copied' : 'Copy Text'}</span>
          </button>

          {/* Browser Print / Save */}
          <button
            onClick={handlePrint}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors cursor-pointer"
            title="Print or Save via Browser (Ctrl+P)"
          >
            <Printer className="w-3.5 h-3.5 text-slate-500" />
            <span>Print</span>
          </button>

          {/* Download 1-Page Summary PDF */}
          <button
            onClick={handleDownloadSummaryPdf}
            disabled={downloadingSummaryPdf}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 bg-slate-50 hover:bg-slate-100 text-xs font-semibold text-slate-700 transition-colors cursor-pointer"
            title="Download compact 1-page Executive Summary PDF"
          >
            <FileCheck className="w-3.5 h-3.5 text-emerald-600" />
            <span>{downloadingSummaryPdf ? 'Generating...' : 'Summary (PDF)'}</span>
          </button>

          {/* Download Full PDF */}
          <button
            onClick={handleDownloadFullPdf}
            disabled={downloadingPdf}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-[#0b192c] hover:bg-[#1a3d60] text-white text-xs font-bold shadow-xs transition-colors cursor-pointer"
            title="Download complete 9-story Intelligence Dossier PDF"
          >
            <Download className="w-3.5 h-3.5 text-white" />
            <span>{downloadingPdf ? 'Preparing...' : 'Full PDF'}</span>
          </button>
        </div>
      </div>

      {/* Interactive Quick-Jump Story Navigator & Search / Filter Strip */}
      <div className="bg-white p-3 sm:p-3.5 rounded-xl border border-slate-200/90 shadow-xs no-print space-y-3">
        {/* Quick-Jump Story Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider shrink-0 pr-1">
            Jump to:
          </span>
          {report.tableOfContents.map((toc) => (
            <button
              key={toc.rank}
              onClick={() => scrollToStory(toc.rank)}
              className={`shrink-0 px-2.5 py-1 rounded-md font-mono text-xs font-bold transition-all cursor-pointer ${
                selectedStoryId === toc.rank
                  ? 'bg-red-700 text-white shadow-xs'
                  : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
              }`}
              title={`Jump to #${toc.rank}: ${toc.headline}`}
            >
              #{toc.rank}
            </button>
          ))}
          <a
            href="#key-developments"
            className="shrink-0 px-2.5 py-1 rounded-md text-xs font-semibold bg-slate-100 hover:bg-slate-200 text-slate-700"
          >
            Watchlist
          </a>
          <a
            href="#sources-ledger"
            className="shrink-0 px-2.5 py-1 rounded-md text-xs font-semibold bg-slate-100 hover:bg-slate-200 text-slate-700"
          >
            All Sources
          </a>
        </div>

        {/* Search & Category Filter Controls */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2 border-t border-slate-100">
          {/* Search Input */}
          <div className="relative flex-1 max-w-md">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              placeholder="Search stories by keyword, agency, topic..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-8.5 pr-8 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-800 placeholder-slate-400 focus:outline-hidden focus:ring-1 focus:ring-blue-500"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-0.5 cursor-pointer"
              >
                <X className="w-3 h-3" />
              </button>
            )}
          </div>

          {/* Showing count and reset */}
          <div className="flex items-center gap-2 text-xs text-slate-500 font-medium shrink-0">
            <Filter className="w-3.5 h-3.5 text-slate-400" />
            <span>
              Showing {filteredStories.length} of {report.stories.length} stories
            </span>
            {(searchQuery || activeCategoryFilter !== 'All') && (
              <button
                onClick={() => {
                  setSearchQuery('');
                  setActiveCategoryFilter('All');
                }}
                className="text-blue-600 hover:text-blue-800 font-semibold underline ml-1 cursor-pointer"
              >
                Reset
              </button>
            )}
          </div>
        </div>

        {/* Category Filter Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-0.5">
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
                className={`shrink-0 px-2.5 py-1 rounded-md text-[11px] font-medium transition-colors cursor-pointer ${
                  isSelected
                    ? 'bg-[#0b192c] text-white font-bold shadow-2xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200 hover:text-slate-900'
                }`}
              >
                {cat}{' '}
                <span className={isSelected ? 'text-blue-200' : 'text-slate-400'}>
                  ({count})
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Share Report Modal */}
      {showShareModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 no-print">
          <div className="bg-white rounded-2xl border border-slate-200 max-w-lg w-full p-6 shadow-2xl relative space-y-5 animate-in fade-in duration-150">
            {/* Modal Header */}
            <div className="flex items-start justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center">
                  <Share2 className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-bold text-base text-slate-900">Share Daily Briefing</h3>
                  <p className="text-xs text-slate-500">
                    Distribute verified national intelligence to teams and leadership.
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowShareModal(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Section 1: Shareable Deep-Link */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                <Link2 className="w-3.5 h-3.5 text-blue-600" />
                Shareable Deep-Link URL
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  readOnly
                  value={deepLinkUrl}
                  className="flex-1 bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs font-mono text-slate-700 outline-hidden focus:ring-1 focus:ring-blue-500"
                />
                <button
                  onClick={handleCopyDeepLink}
                  className="px-3.5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-bold flex items-center gap-1.5 shrink-0 transition-colors shadow-xs cursor-pointer"
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
              <p className="text-[11px] text-slate-500">
                Opening this link directly loads this specific verified edition.
              </p>
            </div>

            {/* Section 2: Formatted Executive Summary for Slack / Teams / Email */}
            <div className="space-y-2 pt-2 border-t border-slate-100">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                  <Send className="w-3.5 h-3.5 text-violet-600" />
                  Executive Distribution Summary
                </label>
                <button
                  onClick={handleCopySummary}
                  className="text-xs font-bold text-blue-600 hover:text-blue-800 flex items-center gap-1 cursor-pointer"
                >
                  {copiedSummary ? (
                    <>
                      <Check className="w-3 h-3 text-emerald-600" />
                      <span className="text-emerald-600">Copied to Clipboard!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3 h-3" />
                      <span>Copy Summary Text</span>
                    </>
                  )}
                </button>
              </div>

              {/* Preview Box */}
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 max-h-36 overflow-y-auto text-xs text-slate-700 font-mono leading-relaxed whitespace-pre-wrap select-all">
                {`🇺🇸 USA DAILY NEWS BRIEFING — ${report.reportDate}\nGenerated: ${report.generatedAt}\n\nTOP DEVELOPMENTS:\n` +
                  displayedStories
                    .slice(0, 3)
                    .map((s) => `• #${s.rank} [${s.category}] ${s.headline}`)
                    .join('\n') +
                  `\n...and 6 more verified developments.\n\nLink: ${deepLinkUrl}`}
              </div>
              <p className="text-[11px] text-slate-500">
                Formatted with key bullets and citations for instant sharing in Slack, Teams, or Executive Email.
              </p>
            </div>

            {/* Section 3: Instant Document Download Buttons */}
            <div className="space-y-2 pt-2 border-t border-slate-100">
              <label className="text-xs font-bold text-slate-800">
                Instant PDF Downloads
              </label>
              <div className="grid grid-cols-2 gap-2.5">
                <button
                  onClick={handleDownloadSummaryPdf}
                  disabled={downloadingSummaryPdf}
                  className="p-2.5 rounded-xl border border-slate-200 bg-slate-50 hover:bg-white hover:border-blue-300 text-left transition-colors flex items-center gap-2.5 cursor-pointer"
                >
                  <FileCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                  <div>
                    <div className="text-xs font-bold text-slate-800">Summary (PDF)</div>
                    <div className="text-[10px] text-slate-500">1-Page Executive Snapshot</div>
                  </div>
                </button>

                <button
                  onClick={handleDownloadFullPdf}
                  disabled={downloadingPdf}
                  className="p-2.5 rounded-xl border border-blue-200 bg-blue-50/60 hover:bg-blue-100 text-left transition-colors flex items-center gap-2.5 cursor-pointer"
                >
                  <Download className="w-4 h-4 text-blue-700 shrink-0" />
                  <div>
                    <div className="text-xs font-bold text-blue-900">Full Dossier (PDF)</div>
                    <div className="text-[10px] text-blue-700">Complete 9-Story Dossier</div>
                  </div>
                </button>
              </div>
            </div>

            {/* Native Share button */}
            {typeof navigator !== 'undefined' && 'share' in navigator && (
              <button
                onClick={handleNativeShare}
                className="w-full py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition-colors flex items-center justify-center gap-2 cursor-pointer"
              >
                <Share2 className="w-3.5 h-3.5" />
                <span>Open System Share Sheet</span>
              </button>
            )}
          </div>
        </div>
      )}

      {/* The Printable Newsroom Document Card */}
      <div
        id="news-report-document"
        className="print-document bg-white rounded-2xl border border-slate-200/90 shadow-sm p-6 sm:p-10 text-slate-900 transition-all"
      >
        {/* Document Broadsheet Masthead */}
        <div className="border-b-2 border-slate-900 pb-5">
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
            <div className="space-y-1">
              <div className="text-[11px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                <span>National News Intelligence Desk</span>
                <span>·</span>
                <span className="text-red-700 font-bold">Verified Reporting</span>
              </div>
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[#0b192c] tracking-tight font-editorial-serif">
                {report.title}
              </h1>
              <div className="text-xs text-slate-600 font-medium flex flex-wrap items-center gap-1.5">
                <span>Top 9 Verified U.S. News Developments · {report.reportDate}</span>
                {report.trendingTopic && (
                  <>
                    <span aria-hidden="true" className="text-slate-300">·</span>
                    <span className="text-red-700 font-bold flex items-center gap-1">
                      <span>⚡ Breaking / Trending Desk:</span>
                      <span className="text-slate-800 underline decoration-red-400">{report.trendingTopic}</span>
                    </span>
                  </>
                )}
              </div>
            </div>

            {/* Meta right aligned */}
            <div className="text-left sm:text-right text-[11px] text-slate-500 space-y-0.5 border-t sm:border-t-0 pt-2 sm:pt-0 border-slate-100 font-medium">
              <div>
                <span className="font-semibold text-slate-700">DATE:</span> {report.reportDate}
              </div>
              <div>
                <span className="font-semibold text-slate-700">COMPILED:</span> {report.generatedAt}
              </div>
              <div className="flex sm:justify-end items-center gap-1 font-semibold text-emerald-700">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>STORIES VERIFIED: {report.storiesVerified} OF 9</span>
              </div>
            </div>
          </div>

          {/* Authentic Broadsheet Double-Rule (Thick Navy + Thin Crimson) */}
          <div className="mt-5 space-y-1">
            <div className="h-1 bg-[#0b192c] w-full" />
            <div className="h-0.5 bg-red-700 w-full" />
          </div>
        </div>

        {/* Executive Summary: Today's News Snapshot */}
        <section className="mt-6 p-5 sm:p-6 rounded-xl bg-slate-50/90 border border-slate-200/90 print-page-break-inside">
          <div className="flex items-center gap-2 mb-2.5 text-[#0b192c]">
            <Newspaper className="w-4 h-4 text-red-700" />
            <h2 className="text-xs font-bold uppercase tracking-wider">
              Today's News Snapshot (Executive Summary)
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-slate-800 leading-relaxed font-normal">
            {report.executiveSummary}
          </p>
        </section>

        {/* Table of Contents / Story Index */}
        <section className="mt-6 p-4 sm:p-5 rounded-xl border border-slate-200 bg-white print-page-break-inside">
          <div className="flex items-center justify-between mb-3 border-b border-slate-100 pb-2">
            <div className="flex items-center gap-2 text-[#0b192c]">
              <Compass className="w-4 h-4 text-blue-600" />
              <h2 className="text-xs font-bold uppercase tracking-wider">
                Table of Contents &amp; Story Index
              </h2>
            </div>
            <span className="text-[11px] text-slate-400 font-medium">9 Selected Developments</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-2 text-xs">
            {report.tableOfContents.map((item) => (
              <a
                key={item.rank}
                href={`#story-${item.rank}`}
                onClick={() => setSelectedStoryId(item.rank)}
                className="group flex items-start gap-2 py-1 text-slate-700 hover:text-blue-700 transition-colors"
              >
                <span className="font-mono tabular-nums font-bold text-red-700 shrink-0 w-6">
                  #{String(item.rank).padStart(2, '0')}.
                </span>
                <span className="line-clamp-1 group-hover:underline font-medium text-slate-800">
                  {item.headline}
                </span>
              </a>
            ))}
          </div>
        </section>

        {/* Story Index Divider */}
        <div className="my-8 border-b border-slate-200" />

        {/* Stories Listing (Filtered) */}
        {filteredStories.length === 0 ? (
          <div className="py-12 text-center space-y-2 text-slate-500">
            <Search className="w-8 h-8 mx-auto text-slate-300" />
            <p className="text-sm font-semibold text-slate-700">No stories match your filter criteria.</p>
            <button
              onClick={() => {
                setSearchQuery('');
                setActiveCategoryFilter('All');
              }}
              className="text-xs font-bold text-blue-600 hover:underline cursor-pointer"
            >
              Reset search &amp; show all 9 stories
            </button>
          </div>
        ) : (
          <div className="space-y-8">
            {filteredStories.map((story) => (
              <article
                key={story.rank}
                id={`story-${story.rank}`}
                className="p-6 sm:p-7 rounded-xl border border-slate-200 bg-white shadow-2xs hover:border-slate-300 transition-colors print-page-break-inside"
              >
                {/* Story Top Kicker: Clean Typographic Metadata (Zero Pills) */}
                <div className="flex items-start justify-between gap-3 mb-2.5">
                  <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500 font-medium">
                    <span className="font-mono tabular-nums font-extrabold text-[#0b192c] text-sm">
                      #{String(story.rank).padStart(2, '0')}
                    </span>
                    <span aria-hidden="true" className="text-slate-300">·</span>
                    <span className="text-red-700 font-bold uppercase tracking-wider text-[11px]">
                      {story.category}
                    </span>
                    <span aria-hidden="true" className="text-slate-300">·</span>
                    <span className="flex items-center gap-1 text-slate-600">
                      <MapPin className="w-3 h-3 text-slate-400" />
                      {story.location}
                    </span>
                    <span aria-hidden="true" className="text-slate-300">·</span>
                    <span>{story.date}</span>
                  </div>

                  {story.significanceRating && (
                    <span className="text-[10px] font-bold text-slate-600 uppercase tracking-wider font-mono">
                      {story.significanceRating} Priority
                    </span>
                  )}
                </div>

                {/* Headline */}
                <h3 className="font-editorial-serif text-xl sm:text-2xl font-bold text-slate-900 leading-snug tracking-tight mb-3">
                  {story.headline}
                </h3>

                {/* Factual 100-150 word summary */}
                <p className="text-xs sm:text-sm text-slate-700 leading-relaxed font-normal mb-4">
                  {story.summary}
                </p>

                {/* Key Facts & Why It Matters Split Box */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-3.5 mb-4">
                  {/* Key facts: 3 bullet points */}
                  <div className="lg:col-span-7 bg-slate-50/90 rounded-lg p-3.5 border border-slate-200/80">
                    <h4 className="text-[11px] font-bold text-[#0b192c] uppercase tracking-wider mb-2 flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-blue-600" />
                      Key Facts (Verified)
                    </h4>
                    <ul className="space-y-1.5 text-xs text-slate-700">
                      {story.keyFacts.map((fact, fIdx) => (
                        <li key={fIdx} className="flex items-start gap-2">
                          <span className="text-[#0b192c] font-black text-sm leading-tight">•</span>
                          <span className="leading-relaxed">{fact}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Why it matters */}
                  <div className="lg:col-span-5 bg-blue-50/60 rounded-lg p-3.5 border border-blue-100">
                    <h4 className="text-[11px] font-bold text-blue-900 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                      <Eye className="w-3.5 h-3.5 text-blue-700" />
                      Why It Matters to Americans
                    </h4>
                    <p className="text-xs text-blue-950 leading-relaxed">
                      {story.whyItMatters}
                    </p>
                  </div>
                </div>

                {/* What to Watch Next */}
                <div className="flex items-start gap-2 text-xs text-slate-600 bg-slate-50/60 p-2.5 rounded-lg border border-slate-100 mb-4">
                  <span className="font-bold text-[#0b192c] shrink-0">What Happens Next:</span>
                  <span className="leading-relaxed">{story.whatHappensNext}</span>
                </div>

                {/* Sources with Clickable Direct Links & Professional Newsroom Badges */}
                <div className="pt-3.5 border-t border-slate-100 space-y-2.5">
                  <div className="flex items-center justify-between text-xs font-bold text-slate-700">
                    <span className="flex items-center gap-1.5 text-[#0b192c]">
                      <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                      Verified Primary Sources ({story.sources.length} Independent Outlets)
                    </span>
                    <span className="text-[10px] text-slate-400 font-medium hidden sm:inline">
                      Direct Article &amp; Wire Verification
                    </span>
                  </div>

                  {/* Sources Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5 pt-1">
                    {story.sources.map((src, sIdx) => {
                      const badge = getOutletTypeBadge(src.outletType);
                      const BadgeIcon = badge.icon;
                      const domainName =
                        src.channelOrDomain ||
                        (src.url.startsWith('http')
                          ? new URL(src.url).hostname.replace('www.', '')
                          : 'source.gov');

                      return (
                        <div
                          key={sIdx}
                          className="p-3 rounded-lg border border-slate-200/90 bg-slate-50/70 hover:bg-white hover:border-blue-300 hover:shadow-xs transition-all flex flex-col justify-between gap-2"
                        >
                          <div>
                            {/* Outlet Type & Verification */}
                            <div className="flex items-center justify-between gap-1 mb-1.5">
                              <span
                                className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[9.5px] font-bold border ${badge.bg}`}
                              >
                                <BadgeIcon className="w-2.5 h-2.5" />
                                <span>{badge.label}</span>
                              </span>
                              <span className="text-[10px] text-slate-400 font-medium">
                                {src.date}
                              </span>
                            </div>

                            {/* Outlet Name */}
                            <div className="font-bold text-xs text-slate-900 line-clamp-1 flex items-center gap-1">
                              <span>{src.name}</span>
                              {src.isVerified !== false && (
                                <Check className="w-3 h-3 text-emerald-600 inline shrink-0" />
                              )}
                            </div>

                            {/* Article Title / Reporting Angle */}
                            {src.articleTitle && (
                              <p className="text-[11px] text-slate-600 italic line-clamp-2 mt-1 leading-snug">
                                "{src.articleTitle}"
                              </p>
                            )}
                          </div>

                          {/* Direct Clickable Link */}
                          <div className="pt-1.5 border-t border-slate-200/70 flex items-center justify-between">
                            <span className="text-[10px] text-slate-500 font-mono">
                              {domainName}
                            </span>
                            <a
                              href={src.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1 text-[11px] font-bold text-blue-600 hover:text-blue-800 hover:underline"
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
            ))}
          </div>
        )}

        {/* Section: Key Developments to Watch */}
        <section
          id="key-developments"
          className="mt-10 p-5 rounded-xl border-t-2 border-t-[#0b192c] bg-slate-50/80 border-x border-b border-slate-200 print-page-break-inside"
        >
          <h2 className="text-sm font-bold text-[#0b192c] uppercase tracking-wider mb-3 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-red-600" />
            Key Developments to Watch Across America
          </h2>
          <div className="space-y-2.5">
            {report.keyDevelopmentsToWatch.map((dev, dIdx) => (
              <div key={dIdx} className="flex items-start gap-2.5 text-xs text-slate-700">
                <span className="text-red-700 font-bold text-sm leading-none">•</span>
                <p className="leading-relaxed">{dev}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Section: Complete Sources & Verified Citations Directory */}
        <section
          id="sources-ledger"
          className="mt-8 pt-6 border-t border-slate-200 text-xs print-page-break-inside space-y-3"
        >
          <div className="flex items-center justify-between">
            <h2 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              Complete Sources &amp; Verified Citations Directory
            </h2>
            <span className="text-[11px] text-slate-400 font-medium">
              {report.completeSources.length} Primary Records Cited
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5 text-[11px] text-slate-600">
            {report.completeSources.map((cs, idx) => (
              <div
                key={idx}
                className="p-2 rounded-lg bg-slate-50 border border-slate-200/80 flex items-center justify-between gap-2"
              >
                <div className="flex items-center gap-1.5 truncate">
                  <span className="text-slate-400 font-mono text-[10px]">
                    {String(idx + 1).padStart(2, '0')}.
                  </span>
                  <span className="font-bold text-slate-900 shrink-0">{cs.outlet}:</span>
                  <a
                    href={cs.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline truncate"
                  >
                    {cs.headline}
                  </a>
                </div>
                <ExternalLink className="w-3 h-3 text-slate-400 shrink-0" />
              </div>
            ))}
          </div>
        </section>

        {/* Editorial Disclaimer */}
        <section className="mt-6 p-4 rounded-lg bg-amber-50/70 border border-amber-200/80 text-[11px] text-amber-950 leading-relaxed print-page-break-inside flex items-start gap-2.5">
          <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
          <p>
            <strong className="font-semibold text-amber-900">Editorial Disclaimer: </strong>
            {report.disclaimer}
          </p>
        </section>

        {/* Print / Document Footer */}
        <div className="mt-8 pt-4 border-t border-slate-200 flex items-center justify-between text-[10px] text-slate-400 font-medium">
          <span>USA DAILY NEWS BRIEFING • INTELLIGENCE REPORT</span>
          <span>PAGE 1 OF 5 (PRINT READY A4 / LETTER)</span>
        </div>
      </div>
    </div>
  );
};
