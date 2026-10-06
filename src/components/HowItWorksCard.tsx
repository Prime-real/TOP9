import React from 'react';
import { Compass, CheckCircle2, Loader2, Sparkles, ShieldCheck } from 'lucide-react';

interface HowItWorksCardProps {
  currentStage?: number; // 0=idle, 1=search, 2=verify, 3=rank, 4=write, 5=complete
  isGenerating?: boolean;
}

export const HowItWorksCard: React.FC<HowItWorksCardProps> = ({
  currentStage = 0,
  isGenerating = false,
}) => {
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
    <div className="bg-white rounded-xl border border-slate-200/90 p-5 shadow-xs no-print space-y-4">
      <div className="flex items-center justify-between border-b border-slate-100 pb-3">
        <div className="flex items-center gap-2 text-[#0b192c] font-bold text-sm">
          <Compass className="w-4 h-4 text-blue-600" />
          <span>Intelligence Pipeline</span>
        </div>
        <span className="text-[10px] font-mono font-semibold text-slate-400 uppercase">
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
                  ? 'bg-blue-50/90 border border-blue-200 shadow-xs'
                  : 'hover:bg-slate-50'
              }`}
            >
              {/* Step indicator */}
              <div className="shrink-0 mt-0.5">
                {isActive ? (
                  <div className="w-6 h-6 rounded-full bg-blue-600 text-white flex items-center justify-center text-xs font-bold shadow-xs">
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  </div>
                ) : isDone ? (
                  <div className="w-6 h-6 rounded-full bg-emerald-600 text-white flex items-center justify-center shadow-xs">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                  </div>
                ) : (
                  <div className="w-6 h-6 rounded-full bg-slate-100 text-slate-700 border border-slate-200 flex items-center justify-center text-xs font-bold font-mono">
                    {s.step}
                  </div>
                )}
              </div>

              <div className="min-w-0">
                <h4
                  className={`text-xs font-bold ${
                    isActive ? 'text-blue-900' : 'text-slate-800'
                  }`}
                >
                  {s.title}
                </h4>
                <p className="text-[11px] text-slate-500 leading-snug mt-0.5">
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
