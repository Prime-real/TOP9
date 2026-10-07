import React from 'react';
import { Settings, ShieldCheck, Database, Sliders, Globe, Clock } from 'lucide-react';

interface SettingsViewProps {
  rankingOrder: 'desc' | 'asc';
  setRankingOrder: (order: 'desc' | 'asc') => void;
  outputFormat: string;
  setOutputFormat: (fmt: string) => void;
  timezonePreference?: 'dual' | 'us' | 'india';
  setTimezonePreference?: (tz: 'dual' | 'us' | 'india') => void;
  theme?: 'dark' | 'light';
}

export const SettingsView: React.FC<SettingsViewProps> = ({
  rankingOrder,
  setRankingOrder,
  outputFormat,
  setOutputFormat,
  timezonePreference = 'dual',
  setTimezonePreference,
  theme = 'dark',
}) => {
  const isDark = theme === 'dark';

  return (
    <div
      className={`rounded-2xl border p-6 sm:p-8 no-print max-w-3xl mx-auto space-y-6 transition-all duration-200 ${
        isDark
          ? 'bg-[#0b1220] border-slate-800 text-slate-100 shadow-[0_4px_30px_rgba(0,0,0,0.5)]'
          : 'bg-white border-slate-200 text-slate-900 shadow-xs'
      }`}
    >
      <div className={`border-b pb-4 ${isDark ? 'border-slate-800' : 'border-slate-100'}`}>
        <h2 className="text-xl font-bold flex items-center gap-2">
          <Settings className={`w-5 h-5 ${isDark ? 'text-cyan-400 glow-cyan-sm' : 'text-blue-600'}`} />
          <span className={isDark ? 'text-white glow-text-cyan' : 'text-slate-900'}>
            Intelligence Engine Settings &amp; Preferences
          </span>
        </h2>
        <p className={`text-xs mt-1 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
          Configure research depth, citation rules, and document rendering options.
        </p>
      </div>

      {/* Sourcing & Verification Standard */}
      <div className="space-y-3">
        <div className={`flex items-center gap-2 text-sm font-bold ${isDark ? 'text-slate-200' : 'text-slate-800'}`}>
          <ShieldCheck className={`w-4 h-4 ${isDark ? 'text-emerald-400' : 'text-emerald-600'}`} />
          <span>Journalistic Verification Rules</span>
        </div>
        <div className={`p-4 rounded-xl border space-y-2 text-xs transition-colors ${
          isDark
            ? 'bg-slate-900/70 border-slate-800 text-slate-300'
            : 'bg-slate-50 border-slate-200/80 text-slate-700'
        }`}>
          <div className="flex items-center justify-between">
            <span className="font-semibold">Minimum Independent Sources per Story:</span>
            <span className={`font-bold ${isDark ? 'text-cyan-400 glow-cyan-sm' : 'text-blue-700'}`}>2 Independent Outlets</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="font-semibold">Primary Source Prioritization:</span>
            <span className={`font-bold ${isDark ? 'text-emerald-300 glow-text-emerald' : 'text-emerald-700'}`}>
              Enabled (.gov, courts, direct wire)
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="font-semibold">Exclusion of Unverified Viral Claims:</span>
            <span className={`font-bold ${isDark ? 'text-emerald-300 glow-text-emerald' : 'text-emerald-700'}`}>
              Enforced
            </span>
          </div>
        </div>
      </div>

      {/* Default Order */}
      <div className="space-y-3">
        <div className={`flex items-center gap-2 text-sm font-bold ${isDark ? 'text-slate-200' : 'text-slate-800'}`}>
          <Sliders className={`w-4 h-4 ${isDark ? 'text-cyan-400' : 'text-blue-600'}`} />
          <span>Story Ranking Display Order</span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div
            onClick={() => setRankingOrder('desc')}
            className={`p-3.5 rounded-xl border cursor-pointer transition-all ${
              rankingOrder === 'desc'
                ? isDark
                  ? 'border-cyan-400 bg-cyan-950/40 text-white glow-cyan-sm shadow-[0_0_15px_rgba(6,182,212,0.2)]'
                  : 'border-blue-500 bg-blue-50/60 ring-2 ring-blue-500/20'
                : isDark
                ? 'border-slate-800 bg-slate-900/60 text-slate-300 hover:border-slate-700 hover:bg-slate-900'
                : 'border-slate-200 hover:border-slate-300'
            }`}
          >
            <div className={`font-bold text-xs ${isDark && rankingOrder === 'desc' ? 'text-cyan-300' : isDark ? 'text-white' : 'text-slate-900'}`}>
              #9 to #1 Countdown (Recommended)
            </div>
            <p className={`text-[11px] mt-1 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
              Builds anticipation toward Story #1, representing the highest public significance.
            </p>
          </div>

          <div
            onClick={() => setRankingOrder('asc')}
            className={`p-3.5 rounded-xl border cursor-pointer transition-all ${
              rankingOrder === 'asc'
                ? isDark
                  ? 'border-cyan-400 bg-cyan-950/40 text-white glow-cyan-sm shadow-[0_0_15px_rgba(6,182,212,0.2)]'
                  : 'border-blue-500 bg-blue-50/60 ring-2 ring-blue-500/20'
                : isDark
                ? 'border-slate-800 bg-slate-900/60 text-slate-300 hover:border-slate-700 hover:bg-slate-900'
                : 'border-slate-200 hover:border-slate-300'
            }`}
          >
            <div className={`font-bold text-xs ${isDark && rankingOrder === 'asc' ? 'text-cyan-300' : isDark ? 'text-white' : 'text-slate-900'}`}>
              #1 to #9 Leading Order
            </div>
            <p className={`text-[11px] mt-1 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
              Presents the most impactful national story at the very top of the briefing.
            </p>
          </div>
        </div>
      </div>

      {/* Real Live Watch & Timezone Setting */}
      {setTimezonePreference && (
        <div className="space-y-3">
          <div className={`flex items-center gap-2 text-sm font-bold ${isDark ? 'text-slate-200' : 'text-slate-800'}`}>
            <Clock className={`w-4 h-4 ${isDark ? 'text-cyan-400' : 'text-blue-600'}`} />
            <span>Live Watch &amp; Timezone Display Preference</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div
              onClick={() => setTimezonePreference('dual')}
              className={`p-3.5 rounded-xl border cursor-pointer transition-all ${
                timezonePreference === 'dual'
                  ? isDark
                    ? 'bg-cyan-950/60 border-cyan-500/50 text-white glow-cyan-sm shadow-md'
                    : 'bg-blue-50/80 border-blue-400 text-blue-950 shadow-xs'
                  : isDark
                  ? 'bg-slate-900/60 border-slate-800 text-slate-300 hover:border-slate-700'
                  : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
              }`}
            >
              <div className="font-bold text-xs flex items-center gap-1.5">
                <span>🌐 Dual Watch (USA &amp; India)</span>
              </div>
              <p className={`text-[11px] mt-1 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                Displays both US Eastern Time (EDT) and India Standard Time (IST) simultaneously.
              </p>
            </div>

            <div
              onClick={() => setTimezonePreference('us')}
              className={`p-3.5 rounded-xl border cursor-pointer transition-all ${
                timezonePreference === 'us'
                  ? isDark
                    ? 'bg-blue-950/60 border-blue-500/50 text-white glow-blue-sm shadow-md'
                    : 'bg-blue-50/80 border-blue-400 text-blue-950 shadow-xs'
                  : isDark
                  ? 'bg-slate-900/60 border-slate-800 text-slate-300 hover:border-slate-700'
                  : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
              }`}
            >
              <div className="font-bold text-xs flex items-center gap-1.5">
                <span>🇺🇸 USA Eastern Standard</span>
              </div>
              <p className={`text-[11px] mt-1 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                Locks briefing dates and timestamps to America/New_York (Washington, D.C. / NY).
              </p>
            </div>

            <div
              onClick={() => setTimezonePreference('india')}
              className={`p-3.5 rounded-xl border cursor-pointer transition-all ${
                timezonePreference === 'india'
                  ? isDark
                    ? 'bg-amber-950/60 border-amber-500/50 text-white glow-amber-sm shadow-md'
                    : 'bg-amber-50/80 border-amber-400 text-amber-950 shadow-xs'
                  : isDark
                  ? 'bg-slate-900/60 border-slate-800 text-slate-300 hover:border-slate-700'
                  : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
              }`}
            >
              <div className="font-bold text-xs flex items-center gap-1.5">
                <span>🇮🇳 India Standard Time (IST)</span>
              </div>
              <p className={`text-[11px] mt-1 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                Locks briefing dates and timestamps to Asia/Kolkata (+5:30 UTC time zone).
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Output Format */}
      <div className="space-y-3">
        <div className={`flex items-center gap-2 text-sm font-bold ${isDark ? 'text-slate-200' : 'text-slate-800'}`}>
          <Database className={`w-4 h-4 ${isDark ? 'text-purple-400' : 'text-violet-600'}`} />
          <span>Default Document Output Format</span>
        </div>
        <select
          value={outputFormat}
          onChange={(e) => setOutputFormat(e.target.value)}
          className={`w-full text-xs rounded-xl p-2.5 font-medium border transition-colors ${
            isDark
              ? 'bg-slate-900 border-slate-700 text-slate-100 focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400'
              : 'bg-slate-50 border-slate-200 text-slate-800'
          }`}
        >
          <option value="pdf">PDF (Print Friendly A4 / Letter)</option>
          <option value="briefing">Executive Briefing Document</option>
          <option value="dossier">Full Intelligence Dossier</option>
        </select>
      </div>

      {/* Search Engine Grounding Status */}
      <div className={`p-4 rounded-xl border flex items-start gap-3 text-xs transition-colors ${
        isDark
          ? 'bg-blue-950/30 border-blue-500/30 text-slate-300 glow-blue-sm'
          : 'bg-blue-50/50 border-blue-100 text-slate-700'
      }`}>
        <Globe className={`w-4 h-4 shrink-0 mt-0.5 ${isDark ? 'text-cyan-400' : 'text-blue-600'}`} />
        <div>
          <span className={`font-bold ${isDark ? 'text-cyan-300' : 'text-blue-950'}`}>Live Search Grounding: Active</span>
          <p className={`mt-0.5 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
            Powered by Google GenAI Google Search tool. All queries research verified news updated within the last 24 hours.
          </p>
        </div>
      </div>
    </div>
  );
};
