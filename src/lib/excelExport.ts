// Excel Export Utility for AMEU SafeSpace using SheetJS
import * as XLSX from 'xlsx';
import { Report, ExportOptions } from '../types/database';
import { sanitizeSpreadsheetCell, formatDate, formatDateOnly } from './utils';
import { recordActivity } from './supabase';

/**
 * Generates and triggers download of an authorized Excel workbook (.xlsx).
 * Enforces formula injection neutralization, privacy filters, and audit logging.
 */
export async function exportReportsToExcel(
  reports: Report[],
  options: ExportOptions,
  actorUserId: string,
  actorName: string
): Promise<{ success: boolean; filename: string; recordCount: number }> {
  // 1. Filter reports based on export options
  const filtered = reports.filter((report) => {
    if (options.statusFilter !== 'all' && report.status !== options.statusFilter) {
      return false;
    }
    if (options.categoryFilter !== 'all' && !report.incident_types.includes(options.categoryFilter)) {
      return false;
    }
    if (options.dateFrom) {
      const fromDate = new Date(options.dateFrom).getTime();
      const reportDate = new Date(report.created_at).getTime();
      if (reportDate < fromDate) return false;
    }
    if (options.dateTo) {
      const toDate = new Date(options.dateTo).setHours(23, 59, 59, 999);
      const reportDate = new Date(report.created_at).getTime();
      if (reportDate > toDate) return false;
    }
    return true;
  });

  // 2. Build sanitized row data
  const rows = filtered.map((report) => {
    const baseRow: Record<string, string> = {
      'Report Reference': sanitizeSpreadsheetCell(report.reference_code),
      'Date Received': sanitizeSpreadsheetCell(formatDate(report.created_at)),
      'Incident Category': sanitizeSpreadsheetCell(report.incident_types.join('; ')),
      'Platform': sanitizeSpreadsheetCell(report.platform),
      'Incident Date': sanitizeSpreadsheetCell(formatDateOnly(report.incident_date)),
      'Reporting For': sanitizeSpreadsheetCell(
        report.reporting_for === 'me'
          ? 'Self'
          : report.reporting_for === 'friend'
          ? 'Friend / Other Student'
          : 'Unsure'
      ),
      'Immediate Danger': sanitizeSpreadsheetCell(report.immediate_danger.toUpperCase()),
      'Contact Requested': sanitizeSpreadsheetCell(report.contact_requested ? 'Yes' : 'No'),
      'Urgency Level': sanitizeSpreadsheetCell(report.urgency.toUpperCase()),
      'Status': sanitizeSpreadsheetCell(
        report.status
          .split('_')
          .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
          .join(' ')
      ),
    };

    if (options.includeDescriptions) {
      baseRow['Incident Description'] = sanitizeSpreadsheetCell(report.description);
    }

    return baseRow;
  });

  // 3. Create worksheet and workbook
  const worksheet = XLSX.utils.json_to_sheet(rows);

  // Set column widths
  const columnWidths = [
    { wch: 18 }, // Reference
    { wch: 22 }, // Date Received
    { wch: 32 }, // Category
    { wch: 16 }, // Platform
    { wch: 16 }, // Incident Date
    { wch: 22 }, // Reporting For
    { wch: 16 }, // Immediate Danger
    { wch: 18 }, // Contact Requested
    { wch: 14 }, // Urgency Level
    { wch: 18 }, // Status
  ];

  if (options.includeDescriptions) {
    columnWidths.push({ wch: 50 }); // Description
  }

  worksheet['!cols'] = columnWidths;

  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Cyberbullying Reports');

  // 4. Generate filename with ISO date
  const today = new Date().toISOString().split('T')[0];
  const filename = `AMEU_SafeSpace_Reports_${today}.xlsx`;

  // 5. Trigger download
  XLSX.writeFile(workbook, filename);

  // 6. Record audit event for export
  if (filtered.length > 0) {
    // Record audit against the first report or general log
    await recordActivity({
      report_id: filtered[0].id,
      actor_user_id: actorUserId,
      actor_name: actorName,
      action_type: 'report_exported',
      note: `Exported ${filtered.length} reports to ${filename} (Options: status=${options.statusFilter}, category=${options.categoryFilter}, descriptions=${options.includeDescriptions})`,
    });
  }

  return {
    success: true,
    filename,
    recordCount: filtered.length,
  };
}
