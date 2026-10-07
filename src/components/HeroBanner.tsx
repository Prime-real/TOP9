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
  Tv,
  Video,
  Radio,
  Image as ImageIcon,
} from 'lucide-react';

interface HeroBannerProps {
  onGenerate: (topic?: string, tvNetwork?: string) => void;
  isGenerating: boolean;
  lastUpdatedDate: string;
  currentTrendingTopic?: string;
  onSelectTopic?: (topic: string) => void;
  tvNetworkFilter?: string;
  onSelectTvNetwork?: (network: string) => void;
  theme?: 'dark' | 'light';
}

export const POPULAR_TRENDING_TOPICS = [
  { id: 'breaking', label: '⚡ All Breaking News Wire', query: 'Top breaking news wire alerts' },
  { id: 'politics', label: '🏛️ Midterms & Politics', query: '2026 congressional midterm elections and political campaigns' },
  { id: 'economy', label: '📈 Economy, Jobs & Fed', query: 'US economy, jobs report, inflation and Federal Reserve' },
  { id: 'tech', label: '🤖 AI & Tech Industry', query: 'Artificial intelligence infrastructure, semiconductors and big tech' },
  { id: 'courts', label: '⚖️ Supreme Court & Legal', query: 'Supreme Court cases, federal court rulings and legal decisions' },
  { id: 'defense', label: '🚨 National Security & Defense', query: 'White House defense, military policy and homeland security' },
];

export const POPULAR_TV_NETWORKS = [
  {
    id: 'all-tv',
    label: '📺 All 4 TV Channels',
    sub: 'CNN · Fox News · NBC · ABC',
    value: 'All TV Networks (CNN · Fox News · NBC · ABC)',
    badgeColor: 'border-slate-500 text-white',
  },
  {
    id: 'cnn',
    label: '🔴 CNN Live Wire',
    sub: 'Cable News Network',
    value: 'CNN',
    badgeColor: 'border-red-500 text-red-400 bg-red-950/40',
  },
  {
    id: 'fox',
    label: '🔵 Fox News Alert',
    sub: 'Fox News Channel',
    value: 'Fox News',
    badgeColor: 'border-blue-500 text-blue-400 bg-blue-950/40',
  },
  {
    id: 'nbc',
    label: '🟣 NBC News Today',
    sub: 'NBC / Nightly News',
    value: 'NBC News',
    badgeColor: 'border-purple-500 text-purple-300 bg-purple-950/40',
  },
  {
    id: 'abc',
    label: '🟡 ABC News Breaking',
    sub: 'ABC World News',
    value: 'ABC News',
    badgeColor: 'border-amber-500 text-amber-300 bg-amber-950/40',
  },
];

export const HeroBanner: React.FC<HeroBannerProps> = ({
  onGenerate,
  isGenerating,
  lastUpdatedDate,
  currentTrendingTopic = 'All Breaking News Wire',
  onSelectTopic,
  tvNetworkFilter = 'All TV Networks (CNN · Fox News · NBC · ABC)',
  onSelectTvNetwork,
  theme = 'dark',
}) => {
  const [customTopicInput, setCustomTopicInput] = useState('');
  const isDark = theme === 'dark';

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
      onGenerate(customTopicInput.trim(), tvNetworkFilter);
    } else {
      onGenerate(undefined, tvNetworkFilter);
    }
  };

  const handleTopicClick = (topicQuery: string) => {
    if (onSelectTopic) onSelectTopic(topicQuery);
    onGenerate(topicQuery, tvNetworkFilter);
  };

  const handleTvNetworkClick = (networkValue: string) => {
    if (onSelectTvNetwork) onSelectTvNetwork(networkValue);
    onGenerate(currentTrendingTopic, networkValue);
  };

  return (
    <div
      className={`relative overflow-hidden rounded-2xl p-6 sm:p-8 lg:p-10 no-print space-y-6 transition-all duration-300 border ${
        isDark
          ? 'bg-[#080d1a] text-white border-cyan-500/30 shadow-[0_0_35px_rgba(6,182,212,0.12),0_12px_45px_rgba(0,0,0,0.6)]'
          : 'bg-[#0b192c] text-white border-slate-800 shadow-xl'
      }`}
    >
      {/* Ambient luminous glow spots */}
      <div className="absolute right-0 top-0 bottom-0 w-2/3 bg-gradient-to-l from-blue-900/30 via-slate-900/30 to-transparent pointer-events-none" />
      <div
        className={`absolute -right-16 -top-16 w-80 h-80 rounded-full blur-3xl pointer-events-none ${
          isDark ? 'bg-cyan-500/15' : 'bg-red-900/10'
        }`}
      />
      <div
        className={`absolute -left-16 -bottom-16 w-72 h-72 rounded-full blur-3xl pointer-events-none ${
          isDark ? 'bg-red-600/15' : 'bg-blue-950/20'
        }`}
      />

      <div className="relative z-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-8">
        {/* Left Editorial Text Column */}
        <div className="max-w-2xl space-y-3.5">
          {/* Metadata Kicker with TV Channels & Google Grounding */}
          <div className="flex flex-wrap items-center gap-2 text-xs font-semibold text-slate-300 tracking-wider uppercase">
            <span
              className={`font-bold flex items-center gap-1.5 ${isDark ? 'text-rose-400 glow-text-red' : 'text-red-400'}`}
            >
              <Flame className="w-4 h-4 text-rose-500 animate-pulse" />
              Live TV Wire Hunt: CNN · Fox · NBC · ABC
            </span>
            <span aria-hidden="true" className="text-slate-600">·</span>
            <span className={`flex items-center gap-1.5 ${isDark ? 'text-emerald-300 glow-text-emerald' : 'text-emerald-400'}`}>
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_8px_rgba(52,211,153,0.9)]" />
              Google Search Grounding Active
            </span>
            <span aria-hidden="true" className="text-slate-600">·</span>
            <span className="text-cyan-300 font-mono text-[11px] flex items-center gap-1">
              <ImageIcon className="w-3.5 h-3.5 text-cyan-400" />
              Real Press Media (Zero AI)
            </span>
          </div>

          <h1
            className={`text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight leading-tight font-editorial-serif ${
              isDark ? 'text-white glow-text-cyan' : 'text-white'
            }`}
          >
            USA Daily Top 9 News Intelligence
          </h1>

          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed max-w-xl font-normal">
            Hunts live breaking headlines, on-air video segments, and wire flashes directly from America's top TV newsrooms (CNN, Fox News, NBC News, ABC News) and wire services. Features real news photography and authentic broadcast video links verified with live Google Search data.
          </p>

          <div className="pt-2 flex flex-wrap items-center gap-3 sm:gap-4">
            <button
              onClick={() => onGenerate(currentTrendingTopic, tvNetworkFilter)}
              disabled={isGenerating}
              className={`inline-flex items-center gap-2.5 px-6 py-3 rounded-xl font-bold text-sm transition-all cursor-pointer ${
                isGenerating
                  ? 'bg-blue-600/70 text-white cursor-not-allowed ring-2 ring-blue-400/40 glow-blue'
                  : isDark
                  ? 'bg-gradient-to-r from-red-600 to-rose-700 hover:from-red-500 hover:to-rose-600 text-white glow-red border border-red-400/40 active:scale-98 animate-glow-pulse-red'
                  : 'bg-red-700 hover:bg-red-800 text-white hover:shadow-xl active:scale-98 ring-2 ring-red-500/20 shadow-md'
              }`}
            >
              {isGenerating ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin text-white" />
                  <span>Hunting Live TV Breaking Headlines...</span>
                </>
              ) : (
                <>
                  <Play className="w-4 h-4 fill-white drop-shadow-[0_0_4px_rgba(255,255,255,0.7)]" />
                  <span className={isDark ? 'drop-shadow-[0_0_4px_rgba(255,255,255,0.4)]' : ''}>
                    Hunt Live Breaking News
                  </span>
                </>
              )}
            </button>

            <button
              onClick={scrollToReport}
              className={`inline-flex items-center gap-1.5 px-4 py-3 rounded-xl font-semibold text-xs transition-all cursor-pointer border ${
                isDark
                  ? 'bg-slate-900/90 hover:bg-slate-800 text-cyan-300 hover:text-white border-cyan-500/30 hover:border-cyan-400 glow-cyan-sm'
                  : 'bg-slate-800/80 hover:bg-slate-800 text-slate-200 hover:text-white border-slate-700'
              }`}
            >
              <span>View Dossier &amp; Media</span>
              <ChevronRight className="w-3.5 h-3.5 text-cyan-400" />
            </button>

            <div className="flex items-center gap-2 text-xs text-slate-400 font-medium pl-1">
              <Clock className="w-3.5 h-3.5 text-slate-400" />
              <span>Edition: {lastUpdatedDate}</span>
            </div>
          </div>
        </div>

        {/* Right TV Broadcast Hunt Blueprint Card */}
        <div
          className={`w-full lg:w-88 shrink-0 rounded-xl p-4.5 space-y-3 transition-all ${
            isDark
              ? 'bg-slate-950/85 backdrop-blur-md border border-cyan-500/30 shadow-[0_0_20px_rgba(6,182,212,0.15)] glow-cyan-sm'
              : 'bg-slate-900/90 backdrop-blur-md border border-slate-700/80 shadow-lg'
          }`}
        >
          <div className="flex items-center justify-between border-b border-slate-800 pb-2.5">
            <div className="flex items-center gap-1.5 text-xs font-bold text-white uppercase tracking-wider">
              <Tv className="w-4 h-4 text-cyan-400" />
              <span>TV Network News Wire</span>
            </div>
            <span
              className={`text-[10px] font-mono font-bold ${
                isDark ? 'text-emerald-300 glow-text-emerald' : 'text-emerald-400'
              }`}
            >
              LIVE GOOGLE DATA
            </span>
          </div>

          {/* 4 TV Networks Grid */}
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="flex items-center gap-2 p-2 rounded-lg bg-red-950/30 border border-red-500/40 text-red-200">
              <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
              <div className="min-w-0">
                <div className="text-[11px] font-bold">CNN Live Wire</div>
                <div className="text-[9.5px] text-red-300/80">Breaking News Desk</div>
              </div>
            </div>

            <div className="flex items-center gap-2 p-2 rounded-lg bg-blue-950/30 border border-blue-500/40 text-blue-200">
              <span className="w-2 h-2 rounded-full bg-blue-400 animate-pulse" />
              <div className="min-w-0">
                <div className="text-[11px] font-bold">Fox News Alert</div>
                <div className="text-[9.5px] text-blue-300/80">On-Air Special Reports</div>
              </div>
            </div>

            <div className="flex items-center gap-2 p-2 rounded-lg bg-purple-950/30 border border-purple-500/40 text-purple-200">
              <span className="w-2 h-2 rounded-full bg-purple-400 animate-pulse" />
              <div className="min-w-0">
                <div className="text-[11px] font-bold">NBC News Today</div>
                <div className="text-[9.5px] text-purple-300/80">Nightly News Desk</div>
              </div>
            </div>

            <div className="flex items-center gap-2 p-2 rounded-lg bg-amber-950/30 border border-amber-500/40 text-amber-200">
              <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
              <div className="min-w-0">
                <div className="text-[11px] font-bold">ABC News Wire</div>
                <div className="text-[9.5px] text-amber-300/80">World News Tonight</div>
              </div>
            </div>
          </div>

          <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-[10px] text-slate-400 font-medium">
            <span className="flex items-center gap-1 text-emerald-400 font-semibold">
              <ShieldCheck className="w-3.5 h-3.5" />
              100% Real Photo &amp; Video Data
            </span>
            <span className="text-cyan-300 font-mono">Zero AI Images</span>
          </div>
        </div>
      </div>

      {/* POPULAR TV CHANNELS WIRE HUNT SELECTOR */}
      <div className="pt-4 border-t border-slate-800/90 space-y-2.5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1.5">
          <div className="flex items-center gap-2 text-xs font-bold text-slate-200 uppercase tracking-wider">
            <Tv className={`w-3.5 h-3.5 ${isDark ? 'text-rose-400' : 'text-red-500'}`} />
            <span>Hunt Live Headlines By TV Channel:</span>
          </div>
          <span className="text-[11px] text-slate-400 font-medium">
            Click any network to filter breaking news &amp; broadcast videos:
          </span>
        </div>

        {/* TV Channel Quick Filter Buttons */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-thin">
          {POPULAR_TV_NETWORKS.map((tv) => {
            const isSelected = tvNetworkFilter === tv.value;
            return (
              <button
                key={tv.id}
                onClick={() => handleTvNetworkClick(tv.value)}
                disabled={isGenerating}
                className={`shrink-0 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 border ${
                  isSelected
                    ? isDark
                      ? 'bg-cyan-600 text-white border-cyan-300 glow-cyan-sm shadow-md'
                      : 'bg-[#0b192c] text-white border-slate-900 shadow-xs'
                    : isDark
                    ? `bg-slate-900/90 border-slate-800 hover:border-slate-700 hover:bg-slate-800 ${tv.badgeColor}`
                    : 'bg-slate-800/90 text-slate-200 border-slate-700 hover:bg-slate-700'
                }`}
              >
                <span>{tv.label}</span>
                {isSelected && (
                  <span className="text-[10px] font-mono uppercase bg-white/20 px-1 rounded">Active</span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* TRENDING TOPICS & BREAKING HEADLINES CONTROL BAR */}
      <div className="pt-3 border-t border-slate-800/70 space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1.5">
          <div className="flex items-center gap-2 text-xs font-bold text-slate-200 uppercase tracking-wider">
            <Zap
              className={`w-3.5 h-3.5 ${
                isDark ? 'text-amber-300 drop-shadow-[0_0_6px_rgba(251,191,36,0.8)]' : 'text-amber-400'
              }`}
            />
            <span className={isDark ? 'text-white' : 'text-slate-200'}>Trending Desks:</span>
          </div>
          <span className="text-[11px] text-slate-400 font-medium">
            Or select specific national topic wire:
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
                    ? isDark
                      ? 'bg-gradient-to-r from-red-600 to-rose-700 text-white border-red-400 glow-red-sm shadow-md'
                      : 'bg-red-700 text-white border-red-500 shadow-xs'
                    : isDark
                    ? 'bg-slate-900/90 text-slate-300 border-slate-800 hover:border-slate-700 hover:bg-slate-800 hover:text-white'
                    : 'bg-slate-800/90 text-slate-200 border-slate-700 hover:bg-slate-700 hover:text-white'
                }`}
              >
                <span>{topic.label}</span>
              </button>
            );
          })}
        </div>

        {/* Custom Trending Topic Input Form with Glowing Focus Ring */}
        <form onSubmit={handleCustomSubmit} className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 pt-1">
          <div className="relative flex-1">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              placeholder="Or enter any specific trending headline topic (e.g. 'Presidential Speech', 'Aviation FAA', 'Wall Street Fed', 'SpaceX')..."
              value={customTopicInput}
              onChange={(e) => setCustomTopicInput(e.target.value)}
              disabled={isGenerating}
              className={`w-full pl-9 pr-3 py-2 rounded-xl text-xs text-white placeholder-slate-400 focus:outline-hidden transition-all font-medium ${
                isDark
                  ? 'bg-slate-950/90 border border-slate-700 focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400/50 focus:shadow-[0_0_15px_rgba(6,182,212,0.25)]'
                  : 'bg-slate-900/90 border border-slate-700 focus:ring-1 focus:ring-red-500'
              }`}
            />
          </div>
          <button
            type="submit"
            disabled={isGenerating}
            className={`px-4 py-2 rounded-xl text-xs font-bold text-white transition-all flex items-center justify-center gap-1.5 shrink-0 cursor-pointer border ${
              isDark
                ? 'bg-slate-900 hover:bg-slate-800 border-amber-500/40 hover:border-amber-400 glow-amber-sm'
                : 'bg-slate-800 hover:bg-slate-700 border border-slate-600'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-400 animate-spin-slow" />
            <span>Hunt This Topic</span>
          </button>
        </form>
      </div>
    </div>
  );
};
