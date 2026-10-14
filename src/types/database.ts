// Database and Domain Types for AMEU SafeSpace

export type ReportingForOption = 'me' | 'friend' | 'not_sure';

export type ImmediateDangerOption = 'yes' | 'no' | 'not_sure';

export type ReportStatus =
  | 'new'
  | 'under_review'
  | 'support_requested'
  | 'referred'
  | 'closed';

export type UrgencyLevel = 'high' | 'medium' | 'low';

export type CounselorRole =
  | 'peer_counselor'
  | 'supervising_counselor'
  | 'administrator';

export type ActionType =
  | 'status_change'
  | 'note_added'
  | 'referral_made'
  | 'contact_viewed'
  | 'report_exported'
  | 'counselor_added'
  | 'counselor_deleted'
  | 'counselor_updated';

export interface EvidenceFile {
  id: string;
  name: string;
  size: number;
  type: string;
  dataUrl: string; // base64 representation for display & persistence
  uploaded_at?: string;
}

export interface Report {
  id: string;
  reference_code: string;
  reporting_for: ReportingForOption;
  incident_types: string[];
  incident_types_other?: string | null;
  platform: string;
  incident_date?: string | null;
  description: string;
  immediate_danger: ImmediateDangerOption;
  contact_requested: boolean;
  evidence_files?: EvidenceFile[];
  status: ReportStatus;
  urgency: UrgencyLevel;
  created_at: string;
  updated_at: string;
}

export interface ReportContact {
  id: string;
  report_id: string;
  phone_number: string;
  consent_to_contact: boolean;
  created_at: string;
}

export interface CounselorProfile {
  id: string;
  email: string;
  display_name: string;
  role: CounselorRole;
  active: boolean;
  created_at: string;
  department?: string;
  specialty?: string;
  phone?: string;
  avatar_url?: string;
  available_today?: boolean;
  bio?: string;
}

export interface CaseActivity {
  id: string;
  report_id: string;
  actor_user_id: string;
  actor_name: string;
  action_type: ActionType;
  note?: string | null;
  previous_status?: ReportStatus | null;
  new_status?: ReportStatus | null;
  created_at: string;
}

export interface SubmitReportPayload {
  reporting_for: ReportingForOption;
  incident_types: string[];
  incident_types_other?: string;
  platform: string;
  incident_date?: string | null;
  description: string;
  immediate_danger: ImmediateDangerOption;
  contact_requested: boolean;
  phone_number?: string;
  consent_to_contact?: boolean;
  evidence_files?: EvidenceFile[];
}

export interface ReportFilterOptions {
  searchQuery?: string;
  status?: string;
  urgency?: string;
  incidentCategory?: string;
  dateFrom?: string;
  dateTo?: string;
}

export interface ExportOptions {
  statusFilter: string;
  categoryFilter: string;
  dateFrom?: string;
  dateTo?: string;
  includeDescriptions: boolean;
  includeContactDetails: boolean; // only for authorized roles
}
