import React from 'react';
import { Settings2, ArrowDownUp, CheckSquare, Layers, Flame, Zap } from 'lucide-react';

interface ReportSettingsCardProps {
  selectedCategories: string[];
  setSelectedCategories: React.Dispatch<React.SetStateAction<string[]>>;
  outputFormat: string;
  setOutputFormat: (fmt: string) => void;
  rankingOrder: 'desc' | 'asc'; // desc = 9 down to 1; asc = 1 up to 9
  setRankingOrder: (order: 'desc' | 'asc') => void;
  trendingTopic?: string;
  setTrendingTopic?: (topic: string) => void;
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

export const ReportSettingsCard: React.FC<ReportSettingsCardProps> = ({
  selectedCategories,
  setSelectedCategories,
  outputFormat,
  setOutputFormat,
  rankingOrder,
  setRankingOrder,
  trendingTopic = 'Top breaking news wire alerts',
  setTrendingTopic,
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
      <div className={`flex items-center justify-between border-b pb-3 ${
        isDark ? 'border-slate-800' : 'border-slate-100'
      }`}>
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

      {/* Breaking News / Trending Focus */}
      {setTrendingTopic && (
        <div className="space-y-2">
          <label className={`text-xs font-bold flex items-center justify-between ${
            isDark ? 'text-slate-200' : 'text-slate-800'
          }`}>
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
                  {isSelected && <span className="w-2 h-2 rounded-full bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.8)]" />}
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
              <label
                key={cat}
                className={`flex items-center gap-2 p-1.5 rounded-lg border text-xs cursor-pointer select-none transition-all ${
                  isChecked
                    ? isDark
                      ? 'border-cyan-500/40 bg-cyan-950/30 text-cyan-200 font-medium'
                      : 'border-blue-200 bg-blue-50/50 text-slate-900 font-medium'
                    : isDark
                    ? 'border-slate-800/80 bg-slate-900/40 hover:bg-slate-900 text-slate-400'
                    : 'border-slate-200/70 hover:bg-slate-50 text-slate-500'
                }`}
              >
                <input
                  type="checkbox"
                  checked={isChecked}
                  onChange={() => toggleCategory(cat)}
                  className="rounded-sm border-slate-600 text-cyan-500 focus:ring-cyan-500 h-3.5 w-3.5 cursor-pointer"
                />
                <span className="truncate text-[11px]">{cat}</span>
              </label>
            );
          })}
        </div>
      </div>

      {/* Output Format */}
      <div className={`pt-2 border-t ${isDark ? 'border-slate-800' : 'border-slate-100'}`}>
        <label className={`block text-xs font-bold mb-1.5 ${isDark ? 'text-slate-200' : 'text-slate-800'}`}>
          Default Report Output
        </label>
        <select
          value={outputFormat}
          onChange={(e) => setOutputFormat(e.target.value)}
          className={`w-full text-xs border rounded-lg px-3 py-2 font-medium focus:ring-1 focus:ring-cyan-500 outline-hidden cursor-pointer ${
            isDark
              ? 'bg-slate-900 border-slate-700 text-slate-200'
              : 'bg-slate-50 border-slate-200 text-slate-800'
          }`}
        >
          <option value="pdf">PDF (Print-Friendly A4 Dossier)</option>
          <option value="summary">1-Page Executive Summary (PDF)</option>
          <option value="briefing">Web Intelligence Briefing</option>
        </select>
      </div>

      {/* Ranking Order */}
      <div className={`pt-2 border-t ${isDark ? 'border-slate-800' : 'border-slate-100'}`}>
        <label className={`block text-xs font-bold mb-1.5 flex items-center justify-between ${
          isDark ? 'text-slate-200' : 'text-slate-800'
        }`}>
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
