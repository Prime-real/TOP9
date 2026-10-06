import React from 'react';
import { Settings, ShieldCheck, Database, Sliders, Globe } from 'lucide-react';

interface SettingsViewProps {
  rankingOrder: 'desc' | 'asc';
  setRankingOrder: (order: 'desc' | 'asc') => void;
  outputFormat: string;
  setOutputFormat: (fmt: string) => void;
}

export const SettingsView: React.FC<SettingsViewProps> = ({
  rankingOrder,
  setRankingOrder,
  outputFormat,
  setOutputFormat,
}) => {
  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs max-w-3xl mx-auto space-y-6">
      <div className="border-b border-slate-100 pb-4">
        <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
          <Settings className="w-5 h-5 text-blue-600" />
          Intelligence Engine Settings &amp; Preferences
        </h2>
        <p className="text-xs text-slate-500 mt-1">
          Configure research depth, citation rules, and document rendering options.
        </p>
      </div>

      {/* Sourcing & Verification Standard */}
      <div className="space-y-3">
        <div className="flex items-center gap-2 text-sm font-bold text-slate-800">
          <ShieldCheck className="w-4 h-4 text-emerald-600" />
          <span>Journalistic Verification Rules</span>
        </div>
        <div className="p-4 bg-slate-50 rounded-xl border border-slate-200/80 space-y-2 text-xs text-slate-700">
          <div className="flex items-center justify-between">
            <span className="font-semibold">Minimum Independent Sources per Story:</span>
            <span className="font-bold text-blue-700">2 Independent Outlets</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="font-semibold">Primary Source Prioritization:</span>
            <span className="text-emerald-700 font-bold">Enabled (.gov, courts, direct wire)</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="font-semibold">Exclusion of Unverified Viral Claims:</span>
            <span className="text-emerald-700 font-bold">Enforced</span>
          </div>
        </div>
      </div>

      {/* Default Order */}
      <div className="space-y-3">
        <div className="flex items-center gap-2 text-sm font-bold text-slate-800">
          <Sliders className="w-4 h-4 text-blue-600" />
          <span>Story Ranking Display Order</span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div
            onClick={() => setRankingOrder('desc')}
            className={`p-3.5 rounded-xl border cursor-pointer transition-all ${
              rankingOrder === 'desc'
                ? 'border-blue-500 bg-blue-50/60 ring-2 ring-blue-500/20'
                : 'border-slate-200 hover:border-slate-300'
            }`}
          >
            <div className="font-bold text-xs text-slate-900">#9 to #1 Countdown (Recommended)</div>
            <p className="text-[11px] text-slate-500 mt-1">
              Builds anticipation toward Story #1, representing the highest public significance.
            </p>
          </div>

          <div
            onClick={() => setRankingOrder('asc')}
            className={`p-3.5 rounded-xl border cursor-pointer transition-all ${
              rankingOrder === 'asc'
                ? 'border-blue-500 bg-blue-50/60 ring-2 ring-blue-500/20'
                : 'border-slate-200 hover:border-slate-300'
            }`}
          >
            <div className="font-bold text-xs text-slate-900">#1 to #9 Leading Order</div>
            <p className="text-[11px] text-slate-500 mt-1">
              Presents the most impactful national story at the very top of the briefing.
            </p>
          </div>
        </div>
      </div>

      {/* Output Format */}
      <div className="space-y-3">
        <div className="flex items-center gap-2 text-sm font-bold text-slate-800">
          <Database className="w-4 h-4 text-violet-600" />
          <span>Default Document Output Format</span>
        </div>
        <select
          value={outputFormat}
          onChange={(e) => setOutputFormat(e.target.value)}
          className="w-full text-xs bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-slate-800 font-medium"
        >
          <option value="pdf">PDF (Print Friendly A4 / Letter)</option>
          <option value="briefing">Executive Briefing Document</option>
          <option value="dossier">Full Intelligence Dossier</option>
        </select>
      </div>

      {/* Search Engine Grounding Status */}
      <div className="p-4 rounded-xl bg-blue-50/50 border border-blue-100 flex items-start gap-3 text-xs text-slate-700">
        <Globe className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
        <div>
          <span className="font-bold text-blue-950">Live Search Grounding: Active</span>
          <p className="text-slate-600 mt-0.5">
            Powered by Google GenAI Google Search tool. All queries research verified news updated within the last 24 hours.
          </p>
        </div>
      </div>
    </div>
  );
};
