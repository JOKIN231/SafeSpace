// Supabase client and storage abstraction layer for AMEU SafeSpace
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import {
  Report,
  ReportContact,
  CounselorProfile,
  CaseActivity,
  SubmitReportPayload,
  ReportStatus
} from '../types/database';
import { generateReferenceCode, calculateUrgency } from './utils';

// Environment variables
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const isSupabaseConfigured = Boolean(
  supabaseUrl &&
  supabaseAnonKey &&
  !supabaseUrl.includes('placeholder') &&
  !supabaseAnonKey.includes('placeholder')
);

export const supabase: SupabaseClient | null = isSupabaseConfigured
  ? createClient(supabaseUrl!, supabaseAnonKey!)
  : null;

// Default initial counselor profile
export const DEFAULT_DEV_COUNSELOR: CounselorProfile = {
  id: 'counselor-001',
  email: 'counselor@ame.edu.lr',
  display_name: 'Jane Doe',
  role: 'peer_counselor',
  active: true,
  created_at: '2026-09-01T08:00:00Z',
};

// Initial realistic baseline reports for preview and testing (matching mockup records)
const INITIAL_DEMO_REPORTS: Report[] = [
  {
    id: 'rep-001',
    reference_code: 'SS-7K4M-92PX',
    reporting_for: 'me',
    incident_types: ['Social media harassment', 'Public humiliation or targeted insults'],
    incident_types_other: null,
    platform: 'WhatsApp',
    incident_date: '2026-10-10',
    description: 'Threatening group chat messages targeting me regarding student union debates, circulating distorted screenshots.',
    immediate_danger: 'no',
    contact_requested: true,
    status: 'new',
    urgency: 'high',
    created_at: '2026-10-13T03:15:00Z',
    updated_at: '2026-10-13T03:15:00Z',
  },
  {
    id: 'rep-002',
    reference_code: 'SS-3F9D-11KQ',
    reporting_for: 'friend',
    incident_types: ['Threats or intimidation', 'Repeated unwanted contact'],
    incident_types_other: null,
    platform: 'Facebook',
    incident_date: '2026-10-11',
    description: 'Anonymous account repeatedly messaging my classmate threatening academic blackmail and stalking outside campus gates.',
    immediate_danger: 'yes',
    contact_requested: true,
    status: 'under_review',
    urgency: 'high',
    created_at: '2026-10-12T14:40:00Z',
    updated_at: '2026-10-12T16:00:00Z',
  },
  {
    id: 'rep-003',
    reference_code: 'SS-8J2N-4ZPL',
    reporting_for: 'me',
    incident_types: ['Impersonation or fake accounts'],
    incident_types_other: null,
    platform: 'TikTok',
    incident_date: '2026-10-09',
    description: 'Someone created a fake profile with my picture and university name making derogatory statements about faculty.',
    immediate_danger: 'no',
    contact_requested: true,
    status: 'support_requested',
    urgency: 'medium',
    created_at: '2026-10-11T10:20:00Z',
    updated_at: '2026-10-11T11:00:00Z',
  },
  {
    id: 'rep-004',
    reference_code: 'SS-1M7P-6GHT',
    reporting_for: 'me',
    incident_types: ['Hurtful or threatening messages'],
    incident_types_other: null,
    platform: 'Instagram',
    incident_date: '2026-10-08',
    description: 'Unwanted targeted harassment in direct messages regarding class presentations.',
    immediate_danger: 'no',
    contact_requested: false,
    status: 'referred',
    urgency: 'medium',
    created_at: '2026-10-10T09:00:00Z',
    updated_at: '2026-10-11T15:30:00Z',
  },
  {
    id: 'rep-005',
    reference_code: 'SS-6L3V-9KBD',
    reporting_for: 'friend',
    incident_types: ['Sharing images or videos without permission'],
    incident_types_other: null,
    platform: 'Snapchat',
    incident_date: '2026-10-05',
    description: 'Dorm photo taken without permission and posted in meme group.',
    immediate_danger: 'no',
    contact_requested: false,
    status: 'closed',
    urgency: 'low',
    created_at: '2026-10-06T18:00:00Z',
    updated_at: '2026-10-08T12:00:00Z',
  },
];

const INITIAL_DEMO_CONTACTS: Record<string, ReportContact> = {
  'rep-001': {
    id: 'con-001',
    report_id: 'rep-001',
    phone_number: '+231 77 123 4567',
    consent_to_contact: true,
    created_at: '2026-10-13T03:15:00Z',
  },
  'rep-002': {
    id: 'con-002',
    report_id: 'rep-002',
    phone_number: '+231 88 987 6543',
    consent_to_contact: true,
    created_at: '2026-10-12T14:40:00Z',
  },
  'rep-003': {
    id: 'con-003',
    report_id: 'rep-003',
    phone_number: '+231 77 555 1212',
    consent_to_contact: true,
    created_at: '2026-10-11T10:20:00Z',
  },
};

const INITIAL_DEMO_ACTIVITIES: CaseActivity[] = [
  {
    id: 'act-001',
    report_id: 'rep-002',
    actor_user_id: 'counselor-001',
    actor_name: 'Jane Doe',
    action_type: 'status_change',
    previous_status: 'new',
    new_status: 'under_review',
    note: 'Initial review initiated. High urgency flagged due to physical intimidation warning.',
    created_at: '2026-10-12T16:00:00Z',
  },
  {
    id: 'act-002',
    report_id: 'rep-004',
    actor_user_id: 'counselor-001',
    actor_name: 'Jane Doe',
    action_type: 'referral_made',
    previous_status: 'under_review',
    new_status: 'referred',
    note: 'Referred to AMEU Student Affairs Wellbeing Committee with reporter consent.',
    created_at: '2026-10-11T15:30:00Z',
  },
];

// Local storage key management
const STORAGE_KEYS = {
  REPORTS: 'ameu_safespace_reports',
  CONTACTS: 'ameu_safespace_contacts',
  ACTIVITIES: 'ameu_safespace_activities',
};

function getLocalReports(): Report[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.REPORTS);
    if (!raw) {
      localStorage.setItem(STORAGE_KEYS.REPORTS, JSON.stringify(INITIAL_DEMO_REPORTS));
      return INITIAL_DEMO_REPORTS;
    }
    return JSON.parse(raw);
  } catch {
    return INITIAL_DEMO_REPORTS;
  }
}

function saveLocalReports(reports: Report[]) {
  try {
    localStorage.setItem(STORAGE_KEYS.REPORTS, JSON.stringify(reports));
  } catch (err) {
    console.error('Failed to save reports to localStorage', err);
  }
}

function getLocalContacts(): Record<string, ReportContact> {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.CONTACTS);
    if (!raw) {
      localStorage.setItem(STORAGE_KEYS.CONTACTS, JSON.stringify(INITIAL_DEMO_CONTACTS));
      return INITIAL_DEMO_CONTACTS;
    }
    return JSON.parse(raw);
  } catch {
    return INITIAL_DEMO_CONTACTS;
  }
}

function saveLocalContacts(contacts: Record<string, ReportContact>) {
  try {
    localStorage.setItem(STORAGE_KEYS.CONTACTS, JSON.stringify(contacts));
  } catch (err) {
    console.error('Failed to save contacts to localStorage', err);
  }
}

function getLocalActivities(): CaseActivity[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.ACTIVITIES);
    if (!raw) {
      localStorage.setItem(STORAGE_KEYS.ACTIVITIES, JSON.stringify(INITIAL_DEMO_ACTIVITIES));
      return INITIAL_DEMO_ACTIVITIES;
    }
    return JSON.parse(raw);
  } catch {
    return INITIAL_DEMO_ACTIVITIES;
  }
}

function saveLocalActivities(activities: CaseActivity[]) {
  try {
    localStorage.setItem(STORAGE_KEYS.ACTIVITIES, JSON.stringify(activities));
  } catch (err) {
    console.error('Failed to save activities to localStorage', err);
  }
}

// ---------------------------------------------------------
// REPOSITORY METHODS
// ---------------------------------------------------------

/**
 * Submits a new anonymous or contact-optional report.
 * Works with Supabase if configured, otherwise uses local secure store.
 */
export async function submitReport(payload: SubmitReportPayload): Promise<{ referenceCode: string; reportId: string }> {
  const referenceCode = generateReferenceCode();
  const reportId = crypto.randomUUID ? crypto.randomUUID() : `rep-${Date.now()}`;
  const now = new Date().toISOString();
  const urgency = calculateUrgency(payload.immediate_danger, payload.incident_types);

  if (isSupabaseConfigured && supabase) {
    // 1. Insert report record
    const { data: reportData, error: reportError } = await supabase
      .from('reports')
      .insert({
        id: reportId,
        reference_code: referenceCode,
        reporting_for: payload.reporting_for,
        incident_types: payload.incident_types,
        incident_types_other: payload.incident_types_other || null,
        platform: payload.platform,
        incident_date: payload.incident_date || null,
        description: payload.description,
        immediate_danger: payload.immediate_danger,
        contact_requested: payload.contact_requested,
        status: 'new',
        urgency,
        created_at: now,
        updated_at: now,
      })
      .select()
      .single();

    if (reportError) {
      console.error('Supabase report submission error:', reportError);
      throw new Error(`Submission failed: ${reportError.message}`);
    }

    // 2. Insert separate protected contact record if phone provided
    if (payload.contact_requested && payload.phone_number && payload.consent_to_contact) {
      const contactId = crypto.randomUUID ? crypto.randomUUID() : `con-${Date.now()}`;
      const { error: contactError } = await supabase
        .from('report_contacts')
        .insert({
          id: contactId,
          report_id: reportId,
          phone_number: payload.phone_number,
          consent_to_contact: true,
          created_at: now,
        });

      if (contactError) {
        console.error('Supabase contact submission error:', contactError);
        // Note: Report is still safely registered even if contact insert encounters an issue
      }
    }

    return { referenceCode, reportId: reportData.id };
  }

  // Fallback Local Storage Mode
  const newReport: Report = {
    id: reportId,
    reference_code: referenceCode,
    reporting_for: payload.reporting_for,
    incident_types: payload.incident_types,
    incident_types_other: payload.incident_types_other || null,
    platform: payload.platform,
    incident_date: payload.incident_date || null,
    description: payload.description,
    immediate_danger: payload.immediate_danger,
    contact_requested: payload.contact_requested,
    status: 'new',
    urgency,
    created_at: now,
    updated_at: now,
  };

  const reports = getLocalReports();
  reports.unshift(newReport);
  saveLocalReports(reports);

  if (payload.contact_requested && payload.phone_number && payload.consent_to_contact) {
    const contacts = getLocalContacts();
    contacts[reportId] = {
      id: `con-${Date.now()}`,
      report_id: reportId,
      phone_number: payload.phone_number,
      consent_to_contact: true,
      created_at: now,
    };
    saveLocalContacts(contacts);
  }

  return { referenceCode, reportId };
}

/**
 * Fetch all reports (authorized counselors only)
 */
export async function getReports(): Promise<Report[]> {
  if (isSupabaseConfigured && supabase) {
    const { data, error } = await supabase
      .from('reports')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Supabase getReports error:', error);
      throw error;
    }
    return data || [];
  }

  return getLocalReports();
}

/**
 * Fetch contact details for a report (strictly authorized)
 */
export async function getReportContact(reportId: string, counselorId: string, counselorName: string): Promise<ReportContact | null> {
  // Record audit log for viewing sensitive contact
  await recordActivity({
    report_id: reportId,
    actor_user_id: counselorId,
    actor_name: counselorName,
    action_type: 'contact_viewed',
    note: 'Authorized peer counselor requested and viewed protected contact information.',
  });

  if (isSupabaseConfigured && supabase) {
    const { data, error } = await supabase
      .from('report_contacts')
      .select('*')
      .eq('report_id', reportId)
      .maybeSingle();

    if (error) {
      console.error('Supabase getReportContact error:', error);
      return null;
    }
    return data;
  }

  const contacts = getLocalContacts();
  return contacts[reportId] || null;
}

/**
 * Update report status with audit record
 */
export async function updateReportStatus(
  reportId: string,
  newStatus: ReportStatus,
  actorUserId: string,
  actorName: string,
  note?: string
): Promise<void> {
  const now = new Date().toISOString();

  if (isSupabaseConfigured && supabase) {
    // 1. Fetch current status
    const { data: current } = await supabase
      .from('reports')
      .select('status')
      .eq('id', reportId)
      .single();

    const previousStatus = current?.status;

    // 2. Update status
    const { error: updateError } = await supabase
      .from('reports')
      .update({ status: newStatus, updated_at: now })
      .eq('id', reportId);

    if (updateError) throw updateError;

    // 3. Log audit event
    await recordActivity({
      report_id: reportId,
      actor_user_id: actorUserId,
      actor_name: actorName,
      action_type: 'status_change',
      previous_status: previousStatus,
      new_status: newStatus,
      note: note || `Status transitioned from ${previousStatus} to ${newStatus}`,
    });
    return;
  }

  // Local storage mode
  const reports = getLocalReports();
  const index = reports.findIndex((r) => r.id === reportId);
  if (index !== -1) {
    const previousStatus = reports[index].status;
    reports[index].status = newStatus;
    reports[index].updated_at = now;
    saveLocalReports(reports);

    await recordActivity({
      report_id: reportId,
      actor_user_id: actorUserId,
      actor_name: actorName,
      action_type: 'status_change',
      previous_status: previousStatus,
      new_status: newStatus,
      note: note || `Status transitioned from ${previousStatus} to ${newStatus}`,
    });
  }
}

/**
 * Add case activity note or referral
 */
export async function recordActivity(payload: Omit<CaseActivity, 'id' | 'created_at'>): Promise<void> {
  const now = new Date().toISOString();
  const id = crypto.randomUUID ? crypto.randomUUID() : `act-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;

  if (isSupabaseConfigured && supabase) {
    const { error } = await supabase.from('case_activity').insert({
      id,
      report_id: payload.report_id,
      actor_user_id: payload.actor_user_id,
      actor_name: payload.actor_name,
      action_type: payload.action_type,
      note: payload.note || null,
      previous_status: payload.previous_status || null,
      new_status: payload.new_status || null,
      created_at: now,
    });
    if (error) {
      console.error('Supabase recordActivity error:', error);
    }
    return;
  }

  const activities = getLocalActivities();
  activities.unshift({
    ...payload,
    id,
    created_at: now,
  });
  saveLocalActivities(activities);
}

/**
 * Get case activities for a specific report
 */
export async function getActivities(reportId: string): Promise<CaseActivity[]> {
  if (isSupabaseConfigured && supabase) {
    const { data, error } = await supabase
      .from('case_activity')
      .select('*')
      .eq('report_id', reportId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Supabase getActivities error:', error);
      return [];
    }
    return data || [];
  }

  const activities = getLocalActivities();
  return activities.filter((a) => a.report_id === reportId);
}

/**
 * Peer Counselor Management for Admin Session
 */
const LOCAL_COUNSELORS_KEY = 'ameu_safespace_counselor_profiles';

const INITIAL_DEMO_COUNSELORS: CounselorProfile[] = [
  {
    id: 'counselor-001',
    email: 'fatu.johnson@ame.edu.lr',
    display_name: 'Fatu M. Johnson',
    role: 'peer_counselor',
    active: true,
    created_at: '2026-09-01T08:00:00Z',
    department: 'Department of Sociology (Class of 2027)',
    specialty: 'Social Media Harassment & Cyberbullying',
    phone: '+231 77 123 8899',
    available_today: true,
    bio: 'Trained AMEU student counselor focused on non-judgmental listening, WhatsApp de-escalation, and student safety.',
  },
  {
    id: 'counselor-002',
    email: 'musa.kamara@ame.edu.lr',
    display_name: 'Musa Kamara',
    role: 'peer_counselor',
    active: true,
    created_at: '2026-09-05T09:30:00Z',
    department: 'College of Liberal Arts (Junior)',
    specialty: 'Cyberstalking & Digital Privacy Boundaries',
    phone: '+231 88 456 1234',
    available_today: true,
    bio: 'Assists students in navigating unwanted direct messages, securing social accounts, and staying safe.',
  },
  {
    id: 'counselor-003',
    email: 'blessing.gbotoe@ame.edu.lr',
    display_name: 'Blessing Gbotoe',
    role: 'peer_counselor',
    active: true,
    created_at: '2026-09-10T11:00:00Z',
    department: 'Department of Mass Communications',
    specialty: 'Public Humiliation, Meme Pages & Rumor Control',
    phone: '+231 77 999 4321',
    available_today: true,
    bio: 'Passionate about digital wellness and supporting students whose reputations or photos have been targeted.',
  },
  {
    id: 'counselor-004',
    email: 'emmanuel.dennis@ame.edu.lr',
    display_name: 'Emmanuel Dennis',
    role: 'peer_counselor',
    active: true,
    created_at: '2026-09-12T14:15:00Z',
    department: 'Business & Public Administration',
    specialty: 'Online Gaming Toxicity & Threat De-escalation',
    phone: '+231 88 222 3456',
    available_today: false,
    bio: 'Helps young men and campus gamers address cyber-intimidation and build respectful digital spaces.',
  },
  {
    id: 'counselor-005',
    email: 'kou.saye@ame.edu.lr',
    display_name: 'Kou Saye',
    role: 'peer_counselor',
    active: true,
    created_at: '2026-09-15T10:00:00Z',
    department: 'Criminal Justice & Safeguarding',
    specialty: 'Impersonation, Fake Profiles & Image Abuse',
    phone: '+231 77 654 9870',
    available_today: true,
    bio: 'Provides guidance on reporting fake accounts to platforms and preserving digital evidence responsibly.',
  },
  {
    id: 'counselor-006',
    email: 'admin@ame.edu.lr',
    display_name: 'Rev. Dr. C. Dunbar',
    role: 'supervising_counselor',
    active: true,
    created_at: '2026-08-15T08:00:00Z',
    department: 'AMEU Student Affairs & Wellbeing',
    specialty: 'Dean of Student Welfare & Institutional Safeguarding',
    phone: '+231 77 888 1122',
    available_today: true,
    bio: 'Senior supervisor coordinating crisis escalation with Career Launchpad Liberia and the Ministry of Justice.',
  },
];

function getLocalCounselors(): CounselorProfile[] {
  try {
    const raw = localStorage.getItem(LOCAL_COUNSELORS_KEY);
    if (!raw) {
      localStorage.setItem(LOCAL_COUNSELORS_KEY, JSON.stringify(INITIAL_DEMO_COUNSELORS));
      return INITIAL_DEMO_COUNSELORS;
    }
    return JSON.parse(raw);
  } catch {
    return INITIAL_DEMO_COUNSELORS;
  }
}

function saveLocalCounselors(counselors: CounselorProfile[]): void {
  try {
    localStorage.setItem(LOCAL_COUNSELORS_KEY, JSON.stringify(counselors));
  } catch (err) {
    console.warn('Could not persist counselors to localStorage', err);
  }
}

export async function getCounselorProfiles(): Promise<CounselorProfile[]> {
  if (isSupabaseConfigured && supabase) {
    const { data, error } = await supabase
      .from('counselor_profiles')
      .select('*')
      .order('created_at', { ascending: false });

    if (!error && data && data.length > 0) {
      return data;
    }
  }
  return getLocalCounselors();
}

export async function addCounselorProfile(
  payload: Omit<CounselorProfile, 'id' | 'created_at'>,
  actorUserId?: string,
  actorName?: string
): Promise<CounselorProfile> {
  const now = new Date().toISOString();
  const id = crypto.randomUUID
    ? crypto.randomUUID()
    : `counselor-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;

  const newCounselor: CounselorProfile = {
    ...payload,
    id,
    created_at: now,
  };

  if (isSupabaseConfigured && supabase) {
    const { data, error } = await supabase
      .from('counselor_profiles')
      .insert(newCounselor)
      .select()
      .single();

    if (!error && data) {
      return data;
    }
  }

  // Local storage mode
  const current = getLocalCounselors();
  const updated = [newCounselor, ...current];
  saveLocalCounselors(updated);

  // Record audit activity if actor details provided
  if (actorUserId && actorName) {
    await recordActivity({
      report_id: 'SYSTEM_AUDIT',
      actor_user_id: actorUserId,
      actor_name: actorName,
      action_type: 'counselor_added',
      note: `Logged new counselor ${newCounselor.display_name} (${newCounselor.role})`,
    });
  }

  return newCounselor;
}

export async function deleteCounselorProfile(
  counselorId: string,
  actorUserId: string,
  actorName: string
): Promise<void> {
  if (isSupabaseConfigured && supabase) {
    await supabase.from('counselor_profiles').delete().eq('id', counselorId);
  }

  const current = getLocalCounselors();
  const target = current.find((c) => c.id === counselorId);
  const updated = current.filter((c) => c.id !== counselorId);
  saveLocalCounselors(updated);

  if (target) {
    await recordActivity({
      report_id: 'SYSTEM_AUDIT',
      actor_user_id: actorUserId,
      actor_name: actorName,
      action_type: 'counselor_deleted',
      note: `Removed counselor ${target.display_name} (${target.email})`,
    });
  }
}

export async function updateCounselorProfile(
  counselorId: string,
  updates: Partial<CounselorProfile>,
  actorUserId?: string,
  actorName?: string
): Promise<void> {
  if (isSupabaseConfigured && supabase) {
    await supabase.from('counselor_profiles').update(updates).eq('id', counselorId);
  }

  const current = getLocalCounselors();
  const index = current.findIndex((c) => c.id === counselorId);
  if (index !== -1) {
    current[index] = { ...current[index], ...updates };
    saveLocalCounselors(current);

    if (actorUserId && actorName) {
      await recordActivity({
        report_id: 'SYSTEM_AUDIT',
        actor_user_id: actorUserId,
        actor_name: actorName,
        action_type: 'counselor_updated',
        note: `Updated counselor ${current[index].display_name}: ${Object.keys(updates).join(', ')}`,
      });
    }
  }
}
