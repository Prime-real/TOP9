import React from 'react';
import { HelpCircle, CheckCircle, Search, ShieldCheck, ListOrdered, FileEdit, Printer } from 'lucide-react';

export const HelpView: React.FC = () => {
  const steps = [
    {
      num: 'STEP 1',
      title: 'Current Date & News Research',
      icon: Search,
      bullets: [
        "Determines today's date and current time across U.S. time zones.",
        'Executes web search for news published or updated within the last 24 hours.',
        'Prioritizes AP, Reuters, NPR, PBS NewsHour, BBC, official government websites (.gov), and major national newsrooms.',
        'Searches across all 9 core categories: Politics, Economy, Business, Tech & AI, Courts & Legal, Public Safety, International Affairs, Science & Health, and Weather.',
        'Selects exactly 9 distinct, important stories without sensationalism.',
      ],
    },
    {
      num: 'STEP 2',
      title: 'Verify the Facts',
      icon: ShieldCheck,
      bullets: [
        'Verifies claims using at least two independent reliable sources whenever possible.',
        'Prefers original documents, court records, government releases, and direct reporting for primary facts.',
        'Distinguishes confirmed facts from allegations, opinions, and developing reports.',
        'Neutrally highlights disagreements between sources.',
        'Strictly excludes unverified viral claims and duplicate stories.',
      ],
    },
    {
      num: 'STEP 3',
      title: 'Rank the Stories',
      icon: ListOrdered,
      bullets: [
        'Ranks the 9 stories from #9 to #1, with #1 representing the story of greatest national public significance.',
        'Ranking reflects non-partisan public impact rather than political endorsement.',
        'Includes explicit rationale for why each development matters to the American people.',
      ],
    },
    {
      num: 'STEP 4',
      title: 'Draft the Report',
      icon: FileEdit,
      bullets: [
        'Written in clean, natural American English for a general audience.',
        'Each story includes: rank, category, clear headline, 100-150 word summary (who, what, when, where), 3 key facts, why it matters, and what to watch next.',
        'Attaches direct clickable source citations with publication dates.',
      ],
    },
    {
      num: 'STEP 5',
      title: 'Deliver the Final Print-Ready Briefing',
      icon: Printer,
      bullets: [
        'Formatted as a print-ready briefing titled "USA DAILY NEWS BRIEFING".',
        'Includes executive summary snapshot, table of contents, 9 stories, forward-looking watchpoints, and full source index.',
        'One-click PDF download via jsPDF and browser print stylesheet (A4 / Letter ready).',
        'Transparent AI-assisted research disclaimer.',
      ],
    },
  ];

  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs max-w-4xl mx-auto space-y-6">
      <div className="border-b border-slate-100 pb-4">
        <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
          <HelpCircle className="w-5 h-5 text-blue-600" />
          Editorial Methodology &amp; Workflow Guide
        </h2>
        <p className="text-xs text-slate-500 mt-1">
          How USA Daily Top 9 News Intelligence researches, verifies, and packages national daily briefings.
        </p>
      </div>

      <div className="space-y-6">
        {steps.map((step) => {
          const Icon = step.icon;
          return (
            <div key={step.num} className="border border-slate-200 rounded-xl p-5 bg-slate-50/50">
              <div className="flex items-center gap-3 mb-3">
                <span className="text-[11px] font-black uppercase tracking-wider text-blue-700 bg-blue-100/70 px-2.5 py-0.5 rounded-md">
                  {step.num}
                </span>
                <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                  <Icon className="w-4 h-4 text-blue-600" />
                  {step.title}
                </h3>
              </div>
              <ul className="space-y-1.5 text-xs text-slate-700">
                {step.bullets.map((b, bIdx) => (
                  <li key={bIdx} className="flex items-start gap-2">
                    <CheckCircle className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                    <span className="leading-relaxed">{b}</span>
                  </li>
                ))}
              </ul>
            </div>
          );
        })}
      </div>

      {/* Reputable Sources Reference */}
      <div className="p-4 rounded-xl bg-blue-50/60 border border-blue-200 text-xs text-slate-700">
        <h4 className="font-bold text-blue-900 mb-1">Source Verification Standards:</h4>
        <p className="leading-relaxed text-slate-600">
          We strictly prioritize wire services (Associated Press, Reuters), established public broadcasters (NPR, PBS NewsHour), official federal/state records (.gov, Supreme Court slip opinions, Federal Register), and major publications with verified fact-checking standards.
        </p>
      </div>
    </div>
  );
};
