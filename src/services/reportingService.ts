// Reporting Service Interface and Implementation for AMEU SafeSpace
// Fully wired to Supabase PostgreSQL RPC with fallback
import { SubmitReportPayload } from '../types/database';
import { generateReferenceCode, calculateUrgency } from '../lib/utils';
import { supabase, isSupabaseConfigured } from '../lib/supabase';

export interface ReportSubmissionResult {
  success: boolean;
  referenceCode: string;
  reportId?: string;
  isMock: boolean;
  message: string;
  timestamp: string;
}

export interface IReportingService {
  submitReport(payload: SubmitReportPayload): Promise<ReportSubmissionResult>;
  isLiveBackendConfigured(): boolean;
}

/**
 * Validates the report payload against Phase 3 requirements before submission.
 */
export function validateReportPayload(payload: SubmitReportPayload): { isValid: boolean; error?: string } {
  // Step 1: Who is the report about
  if (!payload.reporting_for || !['me', 'friend', 'not_sure'].includes(payload.reporting_for)) {
    return { isValid: false, error: 'Please specify who is affected by this incident.' };
  }

  // Step 2: Incident category
  if (!payload.incident_types || payload.incident_types.length === 0) {
    return { isValid: false, error: 'Please select at least one incident category or "I\'m not sure".' };
  }
  if (payload.incident_types.includes('Other') && (!payload.incident_types_other || !payload.incident_types_other.trim())) {
    return { isValid: false, error: 'Please describe the incident in the "Other" field.' };
  }

  // Step 3: Platform
  if (!payload.platform || !payload.platform.trim()) {
    return { isValid: false, error: 'Please specify the platform where this communication occurred.' };
  }

  // Step 4: Narrative Description
  const desc = payload.description ? payload.description.trim() : '';
  if (!desc || desc.length < 10) {
    return { isValid: false, error: 'Please provide a brief description of what happened (at least 10 characters).' };
  }
  if (desc.length > 3000) {
    return { isValid: false, error: 'Description exceeds maximum limit of 3,000 characters.' };
  }

  // Step 5: Immediate danger
  if (!payload.immediate_danger || !['yes', 'no', 'not_sure'].includes(payload.immediate_danger)) {
    return { isValid: false, error: 'Please indicate whether anyone is in immediate physical danger.' };
  }

  // Step 5: Contact requests
  if (payload.contact_requested) {
    if (payload.phone_number?.trim() && !payload.consent_to_contact) {
      return { isValid: false, error: 'Explicit consent is mandatory when providing a phone number.' };
    }
  }

  return { isValid: true };
}

/**
 * Production reporting service.
 * Submits through Supabase RPC 'submit_student_report' with database-level security and validation.
 */
class ReportingService implements IReportingService {
  isLiveBackendConfigured(): boolean {
    return isSupabaseConfigured;
  }

  async submitReport(payload: SubmitReportPayload): Promise<ReportSubmissionResult> {
    // 1. Client-side safeguarding validation
    const validation = validateReportPayload(payload);
    if (!validation.isValid) {
      throw new Error(validation.error || 'Invalid report submission data.');
    }

    const now = new Date().toISOString();

    // 2. Real Supabase Backend Submission via Server-Side Function / RPC
    if (!isSupabaseConfigured || !supabase) {
      throw new Error(
        'The confidential reporting service is currently offline or undergoing backend maintenance. If you or someone else is in immediate danger, please contact Campus Security directly.'
      );
    }

    try {
      const { data, error } = await supabase.rpc('submit_student_report', {
        p_reporting_for: payload.reporting_for,
        p_incident_types: payload.incident_types,
        p_incident_types_other: payload.incident_types_other?.trim() || null,
        p_platform: payload.platform.trim(),
        p_incident_date: payload.incident_date || null,
        p_description: payload.description.trim(),
        p_immediate_danger: payload.immediate_danger,
        p_contact_requested: Boolean(payload.contact_requested),
        p_phone_number: payload.phone_number?.trim() || null,
        p_consent_to_contact: Boolean(payload.consent_to_contact),
      });

      if (error) {
        throw new Error(error.message || 'Database error during report registration.');
      }

      if (!data || !data.reference_code) {
        throw new Error('Server did not return a valid confirmation receipt.');
      }

      // Return verified server result
      return {
        success: true,
        referenceCode: data.reference_code,
        reportId: data.report_id,
        isMock: false,
        message: data.message || 'Report received and securely recorded by server.',
        timestamp: now,
      };
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Network communication error';
      throw new Error(`Submission failed: ${message}`);
    }
  }
}

export const reportingService: IReportingService = new ReportingService();
