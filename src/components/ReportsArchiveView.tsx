import React from 'react';
import { FileText, Calendar, Clock, Download, ArrowRight, Trash2, FileCheck, ShieldCheck } from 'lucide-react';
import { NewsReport } from '../types/news';
import { generatePdfDocument, generateSummaryPdfDocument } from '../utils/pdfGenerator';

interface ReportsArchiveViewProps {
  reports: NewsReport[];
  currentReportId: string;
  onSelectReport: (report: NewsReport) => void;
  onDeleteReport?: (id: string) => void;
  theme?: 'dark' | 'light';
}

export const ReportsArchiveView: React.FC<ReportsArchiveViewProps> = ({
  reports,
  currentReportId,
  onSelectReport,
  onDeleteReport,
  theme = 'dark',
}) => {
  const isDark = theme === 'dark';

  return (
    <div
      className={`rounded-2xl border p-6 sm:p-8 no-print max-w-4xl mx-auto space-y-6 transition-all duration-200 ${
        isDark
          ? 'bg-[#0b1220] border-slate-800 text-slate-100 shadow-[0_4px_30px_rgba(0,0,0,0.5)]'
          : 'bg-white border-slate-200/90 text-slate-900 shadow-xs'
      }`}
    >
      <div className={`flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b pb-4 ${
        isDark ? 'border-slate-800' : 'border-slate-100'
      }`}>
        <div>
          <h2 className="text-xl font-bold flex items-center gap-2">
            <FileText className={`w-5 h-5 ${isDark ? 'text-cyan-400 glow-cyan-sm' : 'text-blue-600'}`} />
            <span className={isDark ? 'text-white glow-text-cyan' : 'text-slate-900'}>
              Intelligence Archive &amp; Briefing History
            </span>
          </h2>
          <p className={`text-xs mt-1 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
            Access, inspect, and export verified intelligence dossiers generated for the United States.
          </p>
        </div>
        <div
          className={`text-xs font-semibold px-3 py-1 rounded-lg w-fit border ${
            isDark
              ? 'bg-slate-900 border-slate-800 text-cyan-300'
              : 'bg-slate-100 border-slate-200 text-slate-700'
          }`}
        >
          {reports.length} {reports.length === 1 ? 'Edition' : 'Editions'} Available
        </div>
      </div>

      {reports.length === 0 ? (
        <div className="text-center py-12 text-slate-400 space-y-2">
          <FileText className="w-12 h-12 mx-auto opacity-40" />
          <p className="text-sm font-medium">No previous reports in archive.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {reports.map((rpt) => {
            const isSelected = rpt.id === currentReportId;
            return (
              <div
                key={rpt.id}
                className={`p-4 sm:p-5 rounded-xl border transition-all flex flex-col md:flex-row items-start md:items-center justify-between gap-4 ${
                  isSelected
                    ? isDark
                      ? 'border-cyan-500/60 bg-cyan-950/25 glow-cyan-sm shadow-[0_0_20px_rgba(6,182,212,0.15)]'
                      : 'border-blue-400 bg-blue-50/40 shadow-xs'
                    : isDark
                    ? 'border-slate-800/80 bg-slate-900/60 hover:border-slate-700 hover:bg-slate-900'
                    : 'border-slate-200 bg-white hover:border-slate-300'
                }`}
              >
                <div className="space-y-2 flex-1">
                  <div className="flex flex-wrap items-center gap-2 text-xs">
                    <span className={`font-extrabold tracking-tight ${isDark ? 'text-white' : 'text-[#0b192c]'}`}>
                      {rpt.title}
                    </span>
                    <span aria-hidden="true" className={isDark ? 'text-slate-600' : 'text-slate-300'}>·</span>
                    <span className={`font-semibold ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>{rpt.reportDate}</span>
                    {isSelected && (
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md flex items-center gap-1 border ${
                        isDark
                          ? 'text-emerald-300 bg-emerald-950/70 border-emerald-500/40 glow-emerald-sm'
                          : 'text-emerald-700 bg-emerald-100/80 border-emerald-200'
                      }`}>
                        <ShieldCheck className="w-3 h-3" />
                        Active in Workspace
                      </span>
                    )}
                  </div>

                  <h3 className={`text-sm font-bold line-clamp-1 ${isDark ? 'text-slate-200' : 'text-slate-900'}`}>
                    {rpt.tableOfContents[0]?.headline || 'Top U.S. News Briefing'}
                  </h3>

                  <div className={`flex flex-wrap items-center gap-3 text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                    <span className="flex items-center gap-1 font-mono text-[11px]">
                      <Clock className="w-3.5 h-3.5 text-slate-400" />
                      {rpt.generatedAt}
                    </span>
                    <span aria-hidden="true" className={isDark ? 'text-slate-700' : 'text-slate-300'}>·</span>
                    <span>{rpt.storiesVerified} Verified Stories</span>
                    <span aria-hidden="true" className={isDark ? 'text-slate-700' : 'text-slate-300'}>·</span>
                    <span>{rpt.completeSources.length} Primary Wire &amp; .gov Sources</span>
                  </div>
                </div>

                {/* Actions */}
                <div className={`flex items-center gap-2 shrink-0 pt-2 md:pt-0 border-t md:border-t-0 w-full md:w-auto justify-end ${
                  isDark ? 'border-slate-800' : 'border-slate-100'
                }`}>
                  {/* Summary PDF */}
                  <button
                    onClick={() => generateSummaryPdfDocument(rpt)}
                    className={`p-2 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer border ${
                      isDark
                        ? 'border-slate-800 bg-slate-900 text-emerald-400 hover:bg-slate-800 hover:border-emerald-500/40 glow-emerald-sm'
                        : 'border-slate-200 text-slate-600 hover:text-emerald-700 hover:bg-emerald-50'
                    }`}
                    title="Download 1-page summary PDF"
                  >
                    <FileCheck className="w-3.5 h-3.5 text-emerald-400" />
                    <span className="hidden sm:inline">Summary</span>
                  </button>

                  {/* Full PDF */}
                  <button
                    onClick={() => generatePdfDocument(rpt)}
                    className={`p-2 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer border ${
                      isDark
                        ? 'border-slate-800 bg-slate-900 text-cyan-300 hover:bg-slate-800 hover:border-cyan-500/40 glow-cyan-sm'
                        : 'border-slate-200 text-slate-600 hover:text-blue-700 hover:bg-blue-50'
                    }`}
                    title="Download complete dossier PDF"
                  >
                    <Download className="w-3.5 h-3.5 text-cyan-400" />
                    <span className="hidden sm:inline">Full PDF</span>
                  </button>

                  {/* Select Report */}
                  <button
                    onClick={() => onSelectReport(rpt)}
                    className={`px-3.5 py-2 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer border ${
                      isDark
                        ? 'bg-gradient-to-r from-red-600 to-rose-700 hover:from-red-500 hover:to-rose-600 text-white border-red-500/50 glow-red-sm'
                        : 'bg-[#0b192c] hover:bg-[#1a3d60] text-white border-transparent shadow-xs'
                    }`}
                  >
                    <span>Inspect</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>

                  {onDeleteReport && reports.length > 1 && (
                    <button
                      onClick={() => onDeleteReport(rpt.id)}
                      className={`p-2 rounded-lg transition-colors cursor-pointer ${
                        isDark
                          ? 'text-slate-500 hover:text-red-400 hover:bg-red-950/40'
                          : 'text-slate-400 hover:text-red-600 hover:bg-red-50'
                      }`}
                      title="Remove from history"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
