import React, { useState } from 'react';
import {
  Play,
  Loader2,
  Clock,
  Landmark,
  TrendingUp,
  Cpu,
  Globe,
  ShieldCheck,
  ChevronRight,
  Flame,
  Zap,
  Scale,
  Search,
  Sparkles,
} from 'lucide-react';

interface HeroBannerProps {
  onGenerate: (topic?: string) => void;
  isGenerating: boolean;
  lastUpdatedDate: string;
  currentTrendingTopic?: string;
  onSelectTopic?: (topic: string) => void;
}

export const POPULAR_TRENDING_TOPICS = [
  { id: 'breaking', label: '⚡ All Breaking News Wire', query: 'Top breaking news wire alerts' },
  { id: 'politics', label: '🏛️ Midterms & Politics', query: '2026 congressional midterm elections and political campaigns' },
  { id: 'economy', label: '📈 Economy, Jobs & Fed', query: 'US economy, jobs report, inflation and Federal Reserve' },
  { id: 'tech', label: '🤖 AI & Tech Industry', query: 'Artificial intelligence infrastructure, semiconductors and big tech' },
  { id: 'courts', label: '⚖️ Supreme Court & Legal', query: 'Supreme Court cases, federal court rulings and legal decisions' },
  { id: 'defense', label: '🚨 National Security & Defense', query: 'White House defense, military policy and homeland security' },
];

export const HeroBanner: React.FC<HeroBannerProps> = ({
  onGenerate,
  isGenerating,
  lastUpdatedDate,
  currentTrendingTopic = 'All Breaking News Wire',
  onSelectTopic,
}) => {
  const [customTopicInput, setCustomTopicInput] = useState('');

  const scrollToReport = () => {
    const el = document.getElementById('news-report-document');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleCustomSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (customTopicInput.trim()) {
      if (onSelectTopic) onSelectTopic(customTopicInput.trim());
      onGenerate(customTopicInput.trim());
    } else {
      onGenerate();
    }
  };

  const handleTopicClick = (topicQuery: string) => {
    if (onSelectTopic) onSelectTopic(topicQuery);
    onGenerate(topicQuery);
  };

  return (
    <div className="relative overflow-hidden rounded-2xl bg-[#0b192c] text-white p-6 sm:p-8 lg:p-10 shadow-lg no-print border border-slate-800 space-y-6">
      {/* Subtle national editorial geometry & gradient background */}
      <div className="absolute right-0 top-0 bottom-0 w-2/3 bg-gradient-to-l from-blue-900/30 via-slate-900/40 to-transparent pointer-events-none" />
      <div className="absolute -right-16 -top-16 w-64 h-64 rounded-full bg-red-900/10 blur-3xl pointer-events-none" />

      <div className="relative z-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-8">
        {/* Left Editorial Text Column */}
        <div className="max-w-2xl space-y-3.5">
          {/* Metadata Kicker without clunky static pills */}
          <div className="flex flex-wrap items-center gap-2 text-xs font-semibold text-slate-300 tracking-wider uppercase">
            <span className="text-red-400 font-bold flex items-center gap-1">
              <Flame className="w-3.5 h-3.5 text-red-400" />
              Breaking &amp; Trending Desk
            </span>
            <span aria-hidden="true" className="text-slate-600">·</span>
            <span>24-Hour Verified Cycle</span>
            <span aria-hidden="true" className="text-slate-600">·</span>
            <span className="text-emerald-400 flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              Google Search Grounding
            </span>
          </div>

          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight leading-tight font-editorial-serif text-white">
            USA Daily Top 9 News Intelligence
          </h1>

          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed max-w-xl font-normal">
            Researches real-time breaking news headlines, trending national topics, and wire flashes across the United States. Cross-references every claim with at least two primary sources and delivers an executive, PDF-ready briefing.
          </p>

          <div className="pt-2 flex flex-wrap items-center gap-3 sm:gap-4">
            <button
              onClick={() => onGenerate()}
              disabled={isGenerating}
              className={`inline-flex items-center gap-2.5 px-6 py-3 rounded-xl font-bold text-sm shadow-md transition-all cursor-pointer ${
                isGenerating
                  ? 'bg-blue-600/70 text-white cursor-not-allowed ring-2 ring-blue-400/40'
                  : 'bg-red-700 hover:bg-red-800 text-white hover:shadow-xl active:scale-98 ring-2 ring-red-500/20'
              }`}
            >
              {isGenerating ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin text-white" />
                  <span>Researching Breaking News...</span>
                </>
              ) : (
                <>
                  <Play className="w-4 h-4 fill-white" />
                  <span>Generate Today's Briefing</span>
                </>
              )}
            </button>

            <button
              onClick={scrollToReport}
              className="inline-flex items-center gap-1.5 px-4 py-3 rounded-xl font-semibold text-xs text-slate-200 hover:text-white bg-slate-800/80 hover:bg-slate-800 border border-slate-700 transition-colors cursor-pointer"
            >
              <span>View Verified Dossier</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>

            <div className="flex items-center gap-2 text-xs text-slate-400 font-medium pl-1">
              <Clock className="w-3.5 h-3.5 text-slate-400" />
              <span>Edition: {lastUpdatedDate}</span>
            </div>
          </div>
        </div>

        {/* Right Coverage Blueprint Card */}
        <div className="w-full lg:w-84 shrink-0 bg-slate-900/90 backdrop-blur-md rounded-xl border border-slate-700/80 p-4.5 space-y-3 shadow-lg">
          <div className="flex items-center justify-between border-b border-slate-800 pb-2.5">
            <div className="flex items-center gap-1.5 text-xs font-bold text-white uppercase tracking-wider">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Intelligence Standards</span>
            </div>
            <span className="text-[10px] text-emerald-400 font-mono font-semibold">100% VERIFIED</span>
          </div>

          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="flex items-center gap-2 p-2 rounded-lg bg-slate-800/70 border border-slate-700/60 text-slate-200">
              <Landmark className="w-3.5 h-3.5 text-blue-400 shrink-0" />
              <div className="min-w-0">
                <div className="text-[11px] font-bold truncate">Politics &amp; Gov</div>
                <div className="text-[9.5px] text-slate-400">Midterms &amp; White House</div>
              </div>
            </div>

            <div className="flex items-center gap-2 p-2 rounded-lg bg-slate-800/70 border border-slate-700/60 text-slate-200">
              <TrendingUp className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
              <div className="min-w-0">
                <div className="text-[11px] font-bold truncate">Economy &amp; Jobs</div>
                <div className="text-[9.5px] text-slate-400">BLS &amp; Fed Markets</div>
              </div>
            </div>

            <div className="flex items-center gap-2 p-2 rounded-lg bg-slate-800/70 border border-slate-700/60 text-slate-200">
              <Cpu className="w-3.5 h-3.5 text-violet-400 shrink-0" />
              <div className="min-w-0">
                <div className="text-[11px] font-bold truncate">Technology &amp; AI</div>
                <div className="text-[9.5px] text-slate-400">Semiconductors &amp; AI</div>
              </div>
            </div>

            <div className="flex items-center gap-2 p-2 rounded-lg bg-slate-800/70 border border-slate-700/60 text-slate-200">
              <Globe className="w-3.5 h-3.5 text-amber-400 shrink-0" />
              <div className="min-w-0">
                <div className="text-[11px] font-bold truncate">SCOTUS &amp; Safety</div>
                <div className="text-[9.5px] text-slate-400">FAA &amp; Federal Dockets</div>
              </div>
            </div>
          </div>

          <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-[10px] text-slate-400 font-medium">
            <span>Primary Sources: AP · Reuters · PBS</span>
            <span className="text-emerald-400 font-semibold">Exact Article Permalinks</span>
          </div>
        </div>
      </div>

      {/* TRENDING TOPICS & BREAKING HEADLINES CONTROL BAR */}
      <div className="pt-4 border-t border-slate-800/90 space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div className="flex items-center gap-2 text-xs font-bold text-slate-200 uppercase tracking-wider">
            <Zap className="w-3.5 h-3.5 text-amber-400" />
            <span>Research By Trending Topic &amp; Breaking Headlines:</span>
          </div>
          <span className="text-[11px] text-slate-400 font-medium">
            Click any trending desk or enter a custom topic below:
          </span>
        </div>

        {/* Quick Trending Topic Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-thin">
          {POPULAR_TRENDING_TOPICS.map((topic) => {
            const isSelected =
              currentTrendingTopic === topic.query ||
              (topic.id === 'breaking' && (!currentTrendingTopic || currentTrendingTopic === 'All Breaking News Wire'));
            return (
              <button
                key={topic.id}
                onClick={() => handleTopicClick(topic.query)}
                disabled={isGenerating}
                className={`shrink-0 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer flex items-center gap-1.5 border ${
                  isSelected
                    ? 'bg-red-700 text-white border-red-500 shadow-xs'
                    : 'bg-slate-800/90 text-slate-200 border-slate-700 hover:bg-slate-700 hover:text-white'
                }`}
              >
                <span>{topic.label}</span>
              </button>
            );
          })}
        </div>

        {/* Custom Trending Topic Input Form */}
        <form onSubmit={handleCustomSubmit} className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 pt-1">
          <div className="relative flex-1">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              placeholder="Or enter any specific trending topic (e.g. 'Tariffs & Trade', 'Aviation Safety', 'SpaceX', 'Immigration')..."
              value={customTopicInput}
              onChange={(e) => setCustomTopicInput(e.target.value)}
              disabled={isGenerating}
              className="w-full pl-9 pr-3 py-2 bg-slate-900/90 border border-slate-700 rounded-xl text-xs text-white placeholder-slate-400 focus:outline-hidden focus:ring-1 focus:ring-red-500 font-medium"
            />
          </div>
          <button
            type="submit"
            disabled={isGenerating}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 border border-slate-600 rounded-xl text-xs font-bold text-white transition-colors flex items-center justify-center gap-1.5 shrink-0 cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>Research This Topic</span>
          </button>
        </form>
      </div>
    </div>
  );
};
