import React from 'react';
import { FileText, Calendar, Clock, Download, ArrowRight, Trash2, FileCheck, ShieldCheck } from 'lucide-react';
import { NewsReport } from '../types/news';
import { generatePdfDocument, generateSummaryPdfDocument } from '../utils/pdfGenerator';

interface ReportsArchiveViewProps {
  reports: NewsReport[];
  currentReportId: string;
  onSelectReport: (report: NewsReport) => void;
  onDeleteReport?: (id: string) => void;
}

export const ReportsArchiveView: React.FC<ReportsArchiveViewProps> = ({
  reports,
  currentReportId,
  onSelectReport,
  onDeleteReport,
}) => {
  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 p-6 sm:p-8 shadow-xs max-w-4xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <FileText className="w-5 h-5 text-blue-600" />
            Intelligence Archive &amp; Briefing History
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Access, inspect, and export verified intelligence dossiers generated for the United States.
          </p>
        </div>
        <div className="text-xs font-semibold px-3 py-1 bg-slate-100 rounded-lg text-slate-700 w-fit">
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
                    ? 'border-blue-400 bg-blue-50/40 shadow-xs'
                    : 'border-slate-200 bg-white hover:border-slate-300'
                }`}
              >
                <div className="space-y-2 flex-1">
                  <div className="flex flex-wrap items-center gap-2 text-xs">
                    <span className="font-extrabold text-[#0b192c] tracking-tight">
                      {rpt.title}
                    </span>
                    <span aria-hidden="true" className="text-slate-300">·</span>
                    <span className="text-slate-600 font-semibold">{rpt.reportDate}</span>
                    {isSelected && (
                      <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100/80 px-2 py-0.5 rounded-md flex items-center gap-1">
                        <ShieldCheck className="w-3 h-3" />
                        Active in Workspace
                      </span>
                    )}
                  </div>

                  <h3 className="text-sm font-bold text-slate-900 line-clamp-1">
                    {rpt.tableOfContents[0]?.headline || 'Top U.S. News Briefing'}
                  </h3>

                  <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500">
                    <span className="flex items-center gap-1 font-mono text-[11px]">
                      <Clock className="w-3.5 h-3.5 text-slate-400" />
                      {rpt.generatedAt}
                    </span>
                    <span aria-hidden="true" className="text-slate-300">·</span>
                    <span>{rpt.storiesVerified} Verified Stories</span>
                    <span aria-hidden="true" className="text-slate-300">·</span>
                    <span>{rpt.completeSources.length} Primary Wire &amp; .gov Sources</span>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2 shrink-0 pt-2 md:pt-0 border-t md:border-t-0 border-slate-100 w-full md:w-auto justify-end">
                  {/* Summary PDF */}
                  <button
                    onClick={() => generateSummaryPdfDocument(rpt)}
                    className="p-2 text-slate-600 hover:text-emerald-700 hover:bg-emerald-50 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer border border-slate-200"
                    title="Download 1-page summary PDF"
                  >
                    <FileCheck className="w-3.5 h-3.5 text-emerald-600" />
                    <span className="hidden sm:inline">Summary</span>
                  </button>

                  {/* Full PDF */}
                  <button
                    onClick={() => generatePdfDocument(rpt)}
                    className="p-2 text-slate-600 hover:text-blue-700 hover:bg-blue-50 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer border border-slate-200"
                    title="Download complete dossier PDF"
                  >
                    <Download className="w-3.5 h-3.5 text-blue-600" />
                    <span className="hidden sm:inline">Full PDF</span>
                  </button>

                  {/* Select Report */}
                  <button
                    onClick={() => onSelectReport(rpt)}
                    className="px-3.5 py-2 bg-[#0b192c] hover:bg-[#1a3d60] text-white rounded-lg text-xs font-bold flex items-center gap-1.5 shadow-xs transition-colors cursor-pointer"
                  >
                    <span>Inspect</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>

                  {onDeleteReport && reports.length > 1 && (
                    <button
                      onClick={() => onDeleteReport(rpt.id)}
                      className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
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
