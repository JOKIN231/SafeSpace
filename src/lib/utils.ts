// Utility functions for AMEU SafeSpace

/**
 * Generates an unpredictable, human-readable report reference.
 * Format: SS-XXXX-XXXX (e.g. SS-7K4M-92PX)
 * Excludes ambiguous characters (0, O, 1, I, L) to avoid transcription errors.
 */
export function generateReferenceCode(): string {
  const chars = '23456789ABCDEFGHJKMNPQRSTUVWXYZ';
  const segment = (len: number) => {
    let result = '';
    const array = new Uint8Array(len);
    crypto.getRandomValues(array);
    for (let i = 0; i < len; i++) {
      result += chars[array[i] % chars.length];
    }
    return result;
  };

  return `SS-${segment(4)}-${segment(4)}`;
}

/**
 * Neutralizes CSV/Excel spreadsheet formula injection attacks (CSV/Formula Injection).
 * Any cell value starting with '=', '+', '-', '@', tab, or carriage return
 * is safely prefixed with a single quote (') so spreadsheet engines treat it as plain text.
 */
export function sanitizeSpreadsheetCell(value: unknown): string {
  if (value === null || value === undefined) return '';
  const str = String(value);
  if (/^[=+\-@\t\r]/.test(str)) {
    return `'${str}`;
  }
  return str;
}

/**
 * Calculates case urgency based on immediate danger and incident severity.
 */
export function calculateUrgency(
  immediateDanger: string,
  incidentTypes: string[]
): 'high' | 'medium' | 'low' {
  if (immediateDanger === 'yes') return 'high';
  const highSeverityTypes = [
    'Threats or intimidation',
    'Sharing images or videos without permission',
    'Sharing private information without permission'
  ];
  const hasHighSeverity = incidentTypes.some((t) => highSeverityTypes.includes(t));
  if (hasHighSeverity) return 'high';
  if (incidentTypes.length > 2 || immediateDanger === 'not_sure') return 'medium';
  return 'low';
}

/**
 * Format ISO date string into readable format (e.g., "Oct 13, 2026, 04:30 PM")
 */
export function formatDate(isoString: string): string {
  if (!isoString) return '—';
  try {
    const d = new Date(isoString);
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(d);
  } catch {
    return isoString;
  }
}

/**
 * Format date only (e.g., "Oct 13, 2026")
 */
export function formatDateOnly(dateString: string | null | undefined): string {
  if (!dateString) return 'Not specified';
  try {
    const d = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    }).format(d);
  } catch {
    return dateString;
  }
}
