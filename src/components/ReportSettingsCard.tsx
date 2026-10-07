import React from 'react';
import { Settings2, ArrowDownUp, CheckSquare, Layers, Flame, Zap, Tv, Image as ImageIcon, ShieldCheck } from 'lucide-react';

interface ReportSettingsCardProps {
  selectedCategories: string[];
  setSelectedCategories: React.Dispatch<React.SetStateAction<string[]>>;
  outputFormat: string;
  setOutputFormat: (fmt: string) => void;
  rankingOrder: 'desc' | 'asc'; // desc = 9 down to 1; asc = 1 up to 9
  setRankingOrder: (order: 'desc' | 'asc') => void;
  trendingTopic?: string;
  setTrendingTopic?: (topic: string) => void;
  tvNetworkFilter?: string;
  setTvNetworkFilter?: (network: string) => void;
  theme?: 'dark' | 'light';
}

export const ALL_CATEGORIES = [
  'Politics & Government',
  'Public Safety',
  'Economy & Jobs',
  'International Affairs',
  'Business & Markets',
  'Science & Space',
  'Technology & AI',
  'Weather & Disasters',
  'Courts & Legal',
];

export const POPULAR_DESKS = [
  { label: '⚡ All Breaking News Wire', value: 'Top breaking news wire alerts' },
  { label: '🏛️ Midterms & Politics', value: '2026 congressional midterm elections and political campaigns' },
  { label: '📈 Economy & Inflation', value: 'US economy, jobs report, inflation and Federal Reserve' },
  { label: '🤖 AI & Big Tech', value: 'Artificial intelligence infrastructure, semiconductors and big tech' },
  { label: '⚖️ Supreme Court', value: 'Supreme Court cases, federal court rulings and legal decisions' },
  { label: '🚨 National Security', value: 'White House defense, military policy and homeland security' },
];

export const TV_NETWORKS = [
  { label: '📺 All 4 Networks (CNN · Fox · NBC · ABC)', value: 'All TV Networks (CNN · Fox News · NBC · ABC)' },
  { label: '🔴 CNN Live Wire Desk', value: 'CNN' },
  { label: '🔵 Fox News Alert Desk', value: 'Fox News' },
  { label: '🟣 NBC News Today Desk', value: 'NBC News' },
  { label: '🟡 ABC News Breaking Desk', value: 'ABC News' },
];

export const ReportSettingsCard: React.FC<ReportSettingsCardProps> = ({
  selectedCategories,
  setSelectedCategories,
  outputFormat,
  setOutputFormat,
  rankingOrder,
  setRankingOrder,
  trendingTopic = 'Top breaking news wire alerts',
  setTrendingTopic,
  tvNetworkFilter = 'All TV Networks (CNN · Fox News · NBC · ABC)',
  setTvNetworkFilter,
  theme = 'dark',
}) => {
  const isDark = theme === 'dark';

  const toggleCategory = (cat: string) => {
    setSelectedCategories((prev) => {
      if (prev.includes(cat)) {
        if (prev.length <= 3) return prev;
        return prev.filter((c) => c !== cat);
      } else {
        return [...prev, cat];
      }
    });
  };

  const selectAll = () => setSelectedCategories([...ALL_CATEGORIES]);

  return (
    <div
      className={`rounded-xl border p-5 shadow-xs no-print space-y-4 transition-colors duration-200 ${
        isDark
          ? 'bg-[#0c1222] border-slate-800/90 text-slate-100 shadow-[0_4px_20px_rgba(0,0,0,0.35)]'
          : 'bg-white border-slate-200/90 text-slate-900 shadow-xs'
      }`}
    >
      <div
        className={`flex items-center justify-between border-b pb-3 ${
          isDark ? 'border-slate-800' : 'border-slate-100'
        }`}
      >
        <div className="flex items-center gap-2 font-bold text-sm">
          <Settings2 className="w-4 h-4 text-cyan-400" />
          <span className={isDark ? 'text-white' : 'text-[#0b192c]'}>Research Parameters</span>
        </div>
        <button
          onClick={selectAll}
          className={`text-[11px] font-semibold underline cursor-pointer ${
            isDark ? 'text-cyan-400 hover:text-cyan-300' : 'text-blue-600 hover:text-blue-800'
          }`}
        >
          Select All ({ALL_CATEGORIES.length})
        </button>
      </div>

      {/* Popular TV News Channels Hunt Section */}
      {setTvNetworkFilter && (
        <div className="space-y-2">
          <label
            className={`text-xs font-bold flex items-center justify-between ${
              isDark ? 'text-slate-200' : 'text-slate-800'
            }`}
          >
            <span className="flex items-center gap-1.5">
              <Tv className="w-3.5 h-3.5 text-rose-400" />
              Live TV Wire Hunt (CNN · Fox · NBC · ABC)
            </span>
            <span className="text-[10px] text-cyan-400 font-mono">Google Data</span>
          </label>
          <div className="grid grid-cols-1 gap-1.5">
            {TV_NETWORKS.map((tv) => {
              const isSelected = tvNetworkFilter === tv.value;
              return (
                <button
                  key={tv.value}
                  type="button"
                  onClick={() => setTvNetworkFilter(tv.value)}
                  className={`px-2.5 py-1.5 rounded-lg border text-left text-xs transition-all cursor-pointer flex items-center justify-between ${
                    isSelected
                      ? isDark
                        ? 'bg-cyan-950/40 border-cyan-400 text-cyan-200 font-bold glow-cyan-sm'
                        : 'bg-blue-50 border-blue-400 text-blue-950 font-bold'
                      : isDark
                      ? 'bg-slate-900/60 border-slate-800 text-slate-300 hover:bg-slate-800'
                      : 'bg-slate-50/70 border-slate-200/80 text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  <span>{tv.label}</span>
                  {isSelected && (
                    <span className="w-2 h-2 rounded-full bg-cyan-400 shadow-[0_0_8px_rgba(6,182,212,0.9)]" />
                  )}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Breaking News / Trending Focus */}
      {setTrendingTopic && (
        <div className={`pt-2 border-t ${isDark ? 'border-slate-800' : 'border-slate-100'} space-y-2`}>
          <label
            className={`text-xs font-bold flex items-center justify-between ${
              isDark ? 'text-slate-200' : 'text-slate-800'
            }`}
          >
            <span className="flex items-center gap-1.5">
              <Flame className="w-3.5 h-3.5 text-red-500" />
              Trending Focus Desk
            </span>
          </label>
          <div className="grid grid-cols-1 gap-1.5">
            {POPULAR_DESKS.map((desk) => {
              const isSelected = trendingTopic === desk.value;
              return (
                <button
                  key={desk.label}
                  type="button"
                  onClick={() => setTrendingTopic(desk.value)}
                  className={`px-2.5 py-1.5 rounded-lg border text-left text-xs transition-all cursor-pointer flex items-center justify-between ${
                    isSelected
                      ? isDark
                        ? 'bg-red-950/40 border-red-500/60 text-red-300 font-bold glow-red-sm'
                        : 'bg-red-50/80 border-red-300 text-red-950 font-bold'
                      : isDark
                      ? 'bg-slate-900/60 border-slate-800 text-slate-300 hover:bg-slate-800'
                      : 'bg-slate-50/70 border-slate-200/80 text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  <span>{desk.label}</span>
                  {isSelected && (
                    <span className="w-2 h-2 rounded-full bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.8)]" />
                  )}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Categories */}
      <div className={`pt-2 border-t ${isDark ? 'border-slate-800' : 'border-slate-100'}`}>
        <div className="flex items-center justify-between mb-2">
          <label className={`text-xs font-bold ${isDark ? 'text-slate-200' : 'text-slate-800'}`}>
            Monitored News Domains
          </label>
          <span className="text-[10px] text-slate-400 font-mono">
            {selectedCategories.length} Active
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
          {ALL_CATEGORIES.map((cat) => {
            const isChecked = selectedCategories.includes(cat);
            return (
              <button
                key={cat}
                type="button"
                onClick={() => toggleCategory(cat)}
                className={`p-2 rounded-lg border text-left text-xs transition-all cursor-pointer flex items-center justify-between ${
                  isChecked
                    ? isDark
                      ? 'bg-slate-900 border-cyan-500/50 text-cyan-200 font-semibold'
                      : 'bg-blue-50/70 border-blue-200 text-blue-900 font-semibold'
                    : isDark
                    ? 'border-slate-800/80 bg-slate-900/30 text-slate-400 opacity-60'
                    : 'border-slate-200 bg-slate-50 text-slate-400 opacity-60'
                }`}
              >
                <span className="truncate pr-1">{cat}</span>
                <span
                  className={`w-3.5 h-3.5 rounded flex items-center justify-center text-[10px] shrink-0 ${
                    isChecked
                      ? isDark
                        ? 'bg-cyan-500 text-slate-950 font-bold'
                        : 'bg-blue-600 text-white font-bold'
                      : 'border border-slate-600'
                  }`}
                >
                  {isChecked ? '✓' : ''}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Real Media Standards Badge */}
      <div
        className={`p-3 rounded-lg border text-xs space-y-1 ${
          isDark
            ? 'bg-slate-900/80 border-slate-800 text-slate-300'
            : 'bg-slate-50 border-slate-200 text-slate-700'
        }`}
      >
        <div className="flex items-center gap-1.5 font-bold text-[11px] text-emerald-400">
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>Real Media Policy (Zero AI Art)</span>
        </div>
        <p className="text-[10.5px] leading-relaxed text-slate-400">
          Stories embed authentic photojournalism and official broadcast video links from CNN, Fox News, NBC News, and ABC News retrieved via Google Search data.
        </p>
      </div>

      {/* Output Format */}
      <div className={`pt-2 border-t ${isDark ? 'border-slate-800' : 'border-slate-100'}`}>
        <label
          className={`block text-xs font-bold mb-1.5 flex items-center justify-between ${
            isDark ? 'text-slate-200' : 'text-slate-800'
          }`}
        >
          <span className="flex items-center gap-1.5">
            <Layers className="w-3.5 h-3.5 text-slate-400" />
            Document Output Format
          </span>
        </label>
        <select
          value={outputFormat}
          onChange={(e) => setOutputFormat(e.target.value)}
          className={`w-full text-xs rounded-lg p-2 font-medium border transition-colors cursor-pointer ${
            isDark
              ? 'bg-slate-900 border-slate-800 text-slate-200 focus:border-cyan-400'
              : 'bg-slate-50 border-slate-200 text-slate-800 focus:border-blue-500'
          }`}
        >
          <option value="pdf">PDF (Print-Friendly A4 Dossier)</option>
          <option value="summary">1-Page Executive Summary (PDF)</option>
          <option value="briefing">Web Intelligence Briefing</option>
        </select>
      </div>

      {/* Ranking Order */}
      <div className={`pt-2 border-t ${isDark ? 'border-slate-800' : 'border-slate-100'}`}>
        <label
          className={`block text-xs font-bold mb-1.5 flex items-center justify-between ${
            isDark ? 'text-slate-200' : 'text-slate-800'
          }`}
        >
          <span className="flex items-center gap-1.5">
            <ArrowDownUp className="w-3.5 h-3.5 text-slate-400" />
            Ranking Order
          </span>
          <span className="text-[10px] text-slate-400 font-mono">
            {rankingOrder === 'desc' ? '#9 → #1' : '#1 → #9'}
          </span>
        </label>

        <div className="grid grid-cols-2 gap-2 text-xs">
          <button
            type="button"
            onClick={() => setRankingOrder('desc')}
            className={`p-2 rounded-lg border text-center transition-all cursor-pointer ${
              rankingOrder === 'desc'
                ? isDark
                  ? 'bg-cyan-600 text-white border-cyan-500 font-bold glow-cyan-sm'
                  : 'bg-[#0b192c] text-white border-[#0b192c] font-bold shadow-xs'
                : isDark
                ? 'border-slate-800 bg-slate-900 text-slate-400 hover:bg-slate-800'
                : 'border-slate-200 bg-slate-50 text-slate-600 hover:bg-slate-100'
            }`}
          >
            <div className="font-bold text-[11px]">#9 Down to #1</div>
            <div className="text-[9.5px] opacity-80">Climaxes at #1 Story</div>
          </button>

          <button
            type="button"
            onClick={() => setRankingOrder('asc')}
            className={`p-2 rounded-lg border text-center transition-all cursor-pointer ${
              rankingOrder === 'asc'
                ? isDark
                  ? 'bg-cyan-600 text-white border-cyan-500 font-bold glow-cyan-sm'
                  : 'bg-[#0b192c] text-white border-[#0b192c] font-bold shadow-xs'
                : isDark
                ? 'border-slate-800 bg-slate-900 text-slate-400 hover:bg-slate-800'
                : 'border-slate-200 bg-slate-50 text-slate-600 hover:bg-slate-100'
            }`}
          >
            <div className="font-bold text-[11px]">#1 Down to #9</div>
            <div className="text-[9.5px] opacity-80">Leads with Top Story</div>
          </button>
        </div>
      </div>
    </div>
  );
};
