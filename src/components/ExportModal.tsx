import React, { useState } from 'react';
import { X, FileSpreadsheet, Download, CheckCircle2, AlertCircle, Shield } from 'lucide-react';
import { Report, ExportOptions } from '../types/database';
import { exportReportsToExcel } from '../lib/excelExport';

interface ExportModalProps {
  reports: Report[];
  actorUserId: string;
  actorName: string;
  onClose: () => void;
}

export const ExportModal: React.FC<ExportModalProps> = ({
  reports,
  actorUserId,
  actorName,
  onClose,
}) => {
  const [statusFilter, setStatusFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [includeDescriptions, setIncludeDescriptions] = useState(true);

  const [isExporting, setIsExporting] = useState(false);
  const [exportFeedback, setExportFeedback] = useState<string | null>(null);
  const [exportError, setExportError] = useState<string | null>(null);

  const handleExport = async () => {
    setIsExporting(true);
    setExportFeedback(null);
    setExportError(null);

    try {
      const options: ExportOptions = {
        statusFilter,
        categoryFilter,
        dateFrom: dateFrom || undefined,
        dateTo: dateTo || undefined,
        includeDescriptions,
        includeContactDetails: false, // Protected: excluded from standard exports
      };

      const result = await exportReportsToExcel(
        reports,
        options,
        actorUserId,
        actorName
      );

      if (result.success) {
        setExportFeedback(
          `Your report export has been generated. (${result.recordCount} records saved to ${result.filename})`
        );
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Unknown error during spreadsheet generation.';
      setExportError(`Export failed: ${msg}`);
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in-50">
      <div className="w-full max-w-lg rounded-3xl bg-white border border-slate-200 shadow-2xl p-6 sm:p-8 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2.5">
            <div className="h-10 w-10 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center">
              <FileSpreadsheet className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900">Export Reports</h2>
              <p className="text-xs text-slate-500">Generate confidential Excel workbook (.xlsx)</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Feedback / Error Alerts */}
        {exportFeedback && (
          <div className="rounded-xl bg-emerald-50 border border-emerald-200 p-3.5 text-xs text-emerald-900 flex items-start gap-2.5 animate-in fade-in-50">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
            <span>{exportFeedback}</span>
          </div>
        )}

        {exportError && (
          <div className="rounded-xl bg-rose-50 border border-rose-200 p-3.5 text-xs text-rose-800 flex items-start gap-2.5">
            <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
            <span>{exportError}</span>
          </div>
        )}

        {/* Form Options */}
        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                Filter by Status
              </label>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full rounded-xl border border-slate-300 p-2 text-xs sm:text-sm text-slate-900 focus:border-emerald-600 focus:outline-hidden"
              >
                <option value="all">All Statuses</option>
                <option value="new">New</option>
                <option value="under_review">Under Review</option>
                <option value="support_requested">Support Requested</option>
                <option value="referred">Referred</option>
                <option value="closed">Closed</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                Filter by Category
              </label>
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="w-full rounded-xl border border-slate-300 p-2 text-xs sm:text-sm text-slate-900 focus:border-emerald-600 focus:outline-hidden"
              >
                <option value="all">All Categories</option>
                <option value="Social media harassment">Social media harassment</option>
                <option value="Threats or intimidation">Threats or intimidation</option>
                <option value="Impersonation or fake accounts">Impersonation or fake accounts</option>
                <option value="Public humiliation or targeted insults">Public humiliation</option>
                <option value="Hurtful or threatening messages">Hurtful messages</option>
                <option value="Sharing images or videos without permission">Non-consensual media</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                Date Received From
              </label>
              <input
                type="date"
                value={dateFrom}
                onChange={(e) => setDateFrom(e.target.value)}
                className="w-full rounded-xl border border-slate-300 p-2 text-xs sm:text-sm text-slate-900 focus:border-emerald-600 focus:outline-hidden"
              />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                Date Received To
              </label>
              <input
                type="date"
                value={dateTo}
                onChange={(e) => setDateTo(e.target.value)}
                className="w-full rounded-xl border border-slate-300 p-2 text-xs sm:text-sm text-slate-900 focus:border-emerald-600 focus:outline-hidden"
              />
            </div>
          </div>

          {/* Privacy Protections */}
          <div className="pt-2 border-t border-slate-100 space-y-3">
            <label className="flex items-center gap-2 cursor-pointer text-xs text-slate-700">
              <input
                type="checkbox"
                checked={includeDescriptions}
                onChange={(e) => setIncludeDescriptions(e.target.checked)}
                className="rounded text-emerald-600 focus:ring-emerald-500"
              />
              <span>Include full incident narrative descriptions</span>
            </label>

            <div className="rounded-xl bg-slate-50 border border-slate-200 p-3 space-y-1 text-[11px] text-slate-600">
              <div className="flex items-center gap-1.5 font-bold text-slate-800">
                <Shield className="w-3.5 h-3.5 text-emerald-700" />
                <span>Safeguarding Rules Applied</span>
              </div>
              <p>
                Student phone numbers are strictly excluded from standard spreadsheets. Spreadsheet formula injection protection is actively applied. This export is recorded in the case activity audit log.
              </p>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2.5 rounded-xl border border-slate-300 text-xs sm:text-sm font-semibold text-slate-700 hover:bg-slate-50 transition-colors"
          >
            Cancel
          </button>
          <button
            type="button"
            disabled={isExporting}
            onClick={handleExport}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-800 hover:bg-emerald-900 active:scale-95 text-xs sm:text-sm font-bold text-white shadow-md shadow-emerald-800/20 transition-all disabled:opacity-50 cursor-pointer"
          >
            <Download className="w-4 h-4" />
            <span>{isExporting ? 'Generating Excel...' : 'EXPORT TO EXCEL (.XLSX)'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
