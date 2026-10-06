import React from 'react';
import { Compass, CheckCircle2, Loader2, Sparkles, ShieldCheck } from 'lucide-react';

interface HowItWorksCardProps {
  currentStage?: number; // 0=idle, 1=search, 2=verify, 3=rank, 4=write, 5=complete
  isGenerating?: boolean;
  theme?: 'dark' | 'light';
}

export const HowItWorksCard: React.FC<HowItWorksCardProps> = ({
  currentStage = 0,
  isGenerating = false,
  theme = 'dark',
}) => {
  const isDark = theme === 'dark';

  const steps = [
    {
      step: 1,
      title: 'Real-Time News Research',
      desc: 'Searches U.S. reporting across AP, Reuters, Bloomberg, and .gov sites within the last 24 hours.',
    },
    {
      step: 2,
      title: 'Fact & Document Verification',
      desc: 'Cross-checks every claim against at least 2 independent wire services and primary public records.',
    },
    {
      step: 3,
      title: 'Significance Ranking (#9 to #1)',
      desc: 'Ranks developments by national public impact, legal weight, and economic significance.',
    },
    {
      step: 4,
      title: 'Executive Dossier Synthesis',
      desc: 'Produces a PDF-ready report with executive summary, 3 key facts per story, and clickable source citations.',
    },
  ];

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
          <Compass className="w-4 h-4 text-cyan-400" />
          <span className={isDark ? 'text-white' : 'text-[#0b192c]'}>Intelligence Pipeline</span>
        </div>
        <span className={`text-[10px] font-mono font-semibold uppercase ${
          isDark ? 'text-cyan-400' : 'text-slate-400'
        }`}>
          4-Stage Protocol
        </span>
      </div>

      <div className="space-y-3">
        {steps.map((s) => {
          const isActive = isGenerating && currentStage === s.step;
          const isDone = isGenerating ? currentStage > s.step : false;

          return (
            <div
              key={s.step}
              className={`flex items-start gap-3 p-2.5 rounded-lg transition-all ${
                isActive
                  ? isDark
                    ? 'bg-cyan-950/40 border border-cyan-500/50 glow-cyan-sm'
                    : 'bg-blue-50/90 border border-blue-200 shadow-xs'
                  : isDark
                  ? 'hover:bg-slate-900/60'
                  : 'hover:bg-slate-50'
              }`}
            >
              {/* Step indicator */}
              <div className="shrink-0 mt-0.5">
                {isActive ? (
                  <div className="w-6 h-6 rounded-full bg-cyan-600 text-white flex items-center justify-center text-xs font-bold glow-cyan-sm">
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  </div>
                ) : isDone ? (
                  <div className="w-6 h-6 rounded-full bg-emerald-600 text-white flex items-center justify-center shadow-xs">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                  </div>
                ) : (
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold font-mono border ${
                    isDark
                      ? 'bg-slate-900 border-slate-700 text-slate-300'
                      : 'bg-slate-100 border-slate-200 text-slate-700'
                  }`}>
                    {s.step}
                  </div>
                )}
              </div>

              <div className="min-w-0">
                <h4
                  className={`text-xs font-bold ${
                    isActive
                      ? isDark ? 'text-cyan-300' : 'text-blue-900'
                      : isDark ? 'text-slate-200' : 'text-slate-800'
                  }`}
                >
                  {s.title}
                </h4>
                <p className={`text-[11px] leading-snug mt-0.5 ${
                  isDark ? 'text-slate-400' : 'text-slate-500'
                }`}>
                  {s.desc}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
