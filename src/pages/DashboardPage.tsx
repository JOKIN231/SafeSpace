import React, { useState, useEffect } from 'react';
import {
  FileSpreadsheet,
  Search,
  Filter,
  Eye,
  LogOut,
  Phone,
  Shield,
  Clock,
  CheckCircle2,
  AlertTriangle,
  Send,
  X,
  Lock,
  Calendar,
  Layers,
  Settings,
  UserCheck,
  ChevronRight,
  Database,
  Info,
  Users,
  UserPlus,
  Trash2,
  Plus,
  Sparkles,
  ToggleLeft,
  ToggleRight
} from 'lucide-react';
import {
  Report,
  ReportStatus,
  CaseActivity,
  ReportContact,
  CounselorProfile,
  CounselorRole
} from '../types/database';
import {
  getReports,
  getActivities,
  updateReportStatus,
  recordActivity,
  getReportContact,
  isSupabaseConfigured,
  getCounselorProfiles,
  addCounselorProfile,
  deleteCounselorProfile,
  updateCounselorProfile
} from '../lib/supabase';
import { formatDate, formatDateOnly } from '../lib/utils';
import { useAuth } from '../hooks/useAuth';
import { ExportModal } from '../components/ExportModal';
import { SafeSpaceBrandLogo } from '../components/Logos';

interface DashboardPageProps {
  onSignOut: () => void;
  onGoHome: () => void;
}

export const DashboardPage: React.FC<DashboardPageProps> = ({ onSignOut, onGoHome }) => {
  const { user } = useAuth();
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);

  // Filters & Search
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [urgencyFilter, setUrgencyFilter] = useState<string>('all');

  // Active Selected Report for Detail View
  const [selectedReport, setSelectedReport] = useState<Report | null>(null);
  const [reportActivities, setReportActivities] = useState<CaseActivity[]>([]);
  const [revealedContact, setRevealedContact] = useState<ReportContact | null>(null);
  const [loadingContact, setLoadingContact] = useState(false);

  // Status update & Note state
  const [newStatus, setNewStatus] = useState<ReportStatus | null>(null);
  const [internalNote, setInternalNote] = useState('');
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);
  const [actionSuccessMsg, setActionSuccessMsg] = useState<string | null>(null);

  // Export Modal
  const [showExportModal, setShowExportModal] = useState(false);

  // Navigation tab inside dashboard: 'dashboard' | 'reports' | 'counselors' | 'settings'
  const [activeDashTab, setActiveDashTab] = useState<'dashboard' | 'reports' | 'counselors' | 'settings'>('dashboard');

  // Peer Counselors Logging & Management State
  const [counselors, setCounselors] = useState<CounselorProfile[]>([]);
  const [loadingCounselors, setLoadingCounselors] = useState(false);
  const [showAddCounselorModal, setShowAddCounselorModal] = useState(false);
  const [counselorToDelete, setCounselorToDelete] = useState<CounselorProfile | null>(null);
  const [counselorSearch, setCounselorSearch] = useState('');
  const [counselorRoleFilter, setCounselorRoleFilter] = useState('all');

  // Form fields for logging a new counselor
  const [newCounselorName, setNewCounselorName] = useState('');
  const [newCounselorEmail, setNewCounselorEmail] = useState('');
  const [newCounselorRole, setNewCounselorRole] = useState<CounselorRole>('peer_counselor');
  const [newCounselorDepartment, setNewCounselorDepartment] = useState('');
  const [newCounselorSpecialty, setNewCounselorSpecialty] = useState('');
  const [newCounselorPhone, setNewCounselorPhone] = useState('');
  const [newCounselorAvailable, setNewCounselorAvailable] = useState(true);
  const [newCounselorBio, setNewCounselorBio] = useState('');
  const [isSavingCounselor, setIsSavingCounselor] = useState(false);
  const [counselorSuccessMsg, setCounselorSuccessMsg] = useState<string | null>(null);

  const loadReports = async () => {
    setLoading(true);
    try {
      const data = await getReports();
      setReports(data);
    } catch (err) {
      console.error('Failed to load reports:', err);
    } finally {
      setLoading(false);
    }
  };

  const loadCounselors = async () => {
    setLoadingCounselors(true);
    try {
      const data = await getCounselorProfiles();
      setCounselors(data);
    } catch (err) {
      console.error('Failed to load counselors:', err);
    } finally {
      setLoadingCounselors(false);
    }
  };

  useEffect(() => {
    loadReports();
    loadCounselors();
  }, []);

  const handleSaveNewCounselor = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCounselorName.trim() || !newCounselorEmail.trim()) return;

    setIsSavingCounselor(true);
    setCounselorSuccessMsg(null);
    try {
      await addCounselorProfile(
        {
          display_name: newCounselorName.trim(),
          email: newCounselorEmail.trim().toLowerCase(),
          role: newCounselorRole,
          active: true,
          department: newCounselorDepartment.trim() || undefined,
          specialty: newCounselorSpecialty.trim() || undefined,
          phone: newCounselorPhone.trim() || undefined,
          available_today: newCounselorAvailable,
          bio: newCounselorBio.trim() || undefined,
        },
        user?.id,
        user?.display_name
      );

      await loadCounselors();
      setShowAddCounselorModal(false);
      setNewCounselorName('');
      setNewCounselorEmail('');
      setNewCounselorDepartment('');
      setNewCounselorSpecialty('');
      setNewCounselorPhone('');
      setNewCounselorBio('');
      setCounselorSuccessMsg('Peer counselor successfully logged into university roster.');
      setTimeout(() => setCounselorSuccessMsg(null), 4000);
    } catch (err) {
      console.error('Failed to save counselor:', err);
    } finally {
      setIsSavingCounselor(false);
    }
  };

  const handleConfirmDeleteCounselor = async () => {
    if (!counselorToDelete || !user) return;
    try {
      await deleteCounselorProfile(counselorToDelete.id, user.id, user.display_name);
      await loadCounselors();
      setCounselorToDelete(null);
      setCounselorSuccessMsg(`Counselor ${counselorToDelete.display_name} removed from roster.`);
      setTimeout(() => setCounselorSuccessMsg(null), 4000);
    } catch (err) {
      console.error('Failed to delete counselor:', err);
    }
  };

  const handleToggleActive = async (counselor: CounselorProfile) => {
    if (!user) return;
    try {
      await updateCounselorProfile(
        counselor.id,
        { active: !counselor.active },
        user.id,
        user.display_name
      );
      await loadCounselors();
    } catch (err) {
      console.error('Failed to toggle counselor active status:', err);
    }
  };

  const handleToggleDuty = async (counselor: CounselorProfile) => {
    if (!user) return;
    try {
      await updateCounselorProfile(
        counselor.id,
        { available_today: !counselor.available_today },
        user.id,
        user.display_name
      );
      await loadCounselors();
    } catch (err) {
      console.error('Failed to toggle duty status:', err);
    }
  };

  // When a report is clicked, load its audit activities
  const handleOpenReport = async (report: Report) => {
    setSelectedReport(report);
    setNewStatus(report.status);
    setRevealedContact(null);
    setActionSuccessMsg(null);
    setInternalNote('');
    try {
      const acts = await getActivities(report.id);
      setReportActivities(acts);
    } catch (err) {
      console.error('Failed to load activities', err);
    }
  };

  // Reveal protected contact info
  const handleRevealContact = async () => {
    if (!selectedReport || !user) return;
    setLoadingContact(true);
    try {
      const contact = await getReportContact(selectedReport.id, user.id, user.display_name);
      setRevealedContact(contact);
      // Reload activities to reflect audit event
      const updatedActs = await getActivities(selectedReport.id);
      setReportActivities(updatedActs);
    } catch (err) {
      console.error('Failed to reveal contact:', err);
    } finally {
      setLoadingContact(false);
    }
  };

  // Update status or add internal note
  const handleSaveCaseUpdate = async () => {
    if (!selectedReport || !user) return;
    setIsUpdatingStatus(true);
    setActionSuccessMsg(null);

    try {
      const statusChanged = newStatus && newStatus !== selectedReport.status;

      if (statusChanged && newStatus) {
        await updateReportStatus(
          selectedReport.id,
          newStatus,
          user.id,
          user.display_name,
          internalNote || undefined
        );
      } else if (internalNote.trim()) {
        await recordActivity({
          report_id: selectedReport.id,
          actor_user_id: user.id,
          actor_name: user.display_name,
          action_type: 'note_added',
          note: internalNote.trim(),
        });
      }

      setActionSuccessMsg('Case record updated and logged to audit trail.');
      setInternalNote('');

      // Refresh data
      await loadReports();
      const updatedReport = {
        ...selectedReport,
        status: newStatus || selectedReport.status,
      };
      setSelectedReport(updatedReport);
      const acts = await getActivities(selectedReport.id);
      setReportActivities(acts);
    } catch (err) {
      console.error('Failed to update case:', err);
    } finally {
      setIsUpdatingStatus(false);
    }
  };

  // Counts by status
  const counts = {
    new: reports.filter((r) => r.status === 'new').length,
    under_review: reports.filter((r) => r.status === 'under_review').length,
    support_requested: reports.filter((r) => r.status === 'support_requested').length,
    referred: reports.filter((r) => r.status === 'referred').length,
    closed: reports.filter((r) => r.status === 'closed').length,
  };

  // Filtered reports
  const filteredReports = reports.filter((r) => {
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      const matchRef = r.reference_code.toLowerCase().includes(q);
      const matchCat = r.incident_types.some((c) => c.toLowerCase().includes(q));
      const matchPlat = r.platform.toLowerCase().includes(q);
      if (!matchRef && !matchCat && !matchPlat) return false;
    }

    if (statusFilter !== 'all' && r.status !== statusFilter) return false;
    if (urgencyFilter !== 'all' && r.urgency !== urgencyFilter) return false;

    return true;
  });

  return (
    <div className="min-h-screen bg-slate-100/70 flex flex-col lg:flex-row">
      {/* Sidebar Navigation */}
      <aside className="w-full lg:w-64 bg-emerald-950 text-white shrink-0 p-5 flex flex-col justify-between border-r border-emerald-900">
        <div className="space-y-6">
          <div className="pb-4 border-b border-emerald-900/80">
            <SafeSpaceBrandLogo light />
          </div>

          {/* Counselor Profile card */}
          <div className="rounded-2xl bg-emerald-900/60 p-3.5 border border-emerald-800 flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-emerald-700 flex items-center justify-center font-bold text-emerald-200 shrink-0">
              {user?.display_name?.charAt(0) || 'C'}
            </div>
            <div className="overflow-hidden">
              <span className="block text-xs font-bold truncate text-white">
                {user?.display_name || 'Counselor'}
              </span>
              <span className="block text-[10px] text-emerald-300 uppercase tracking-wider font-semibold">
                {user?.role?.replace('_', ' ') || 'Peer Counselor'}
              </span>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="space-y-1">
            <button
              onClick={() => {
                setActiveDashTab('dashboard');
                setStatusFilter('all');
              }}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
                activeDashTab === 'dashboard' && statusFilter === 'all'
                  ? 'bg-emerald-700 text-white shadow-xs'
                  : 'text-emerald-200/80 hover:bg-emerald-900 hover:text-white'
              }`}
            >
              <Layers className="w-4 h-4" />
              <span>Dashboard Overview</span>
            </button>

            <button
              onClick={() => {
                setActiveDashTab('reports');
                setStatusFilter('all');
              }}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
                activeDashTab === 'reports'
                  ? 'bg-emerald-700 text-white shadow-xs'
                  : 'text-emerald-200/80 hover:bg-emerald-900 hover:text-white'
              }`}
            >
              <Clock className="w-4 h-4" />
              <span>Reports ({reports.length})</span>
            </button>

            <button
              onClick={() => {
                setActiveDashTab('dashboard');
                setStatusFilter('support_requested');
              }}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
                statusFilter === 'support_requested'
                  ? 'bg-emerald-700 text-white shadow-xs'
                  : 'text-emerald-200/80 hover:bg-emerald-900 hover:text-white'
              }`}
            >
              <Phone className="w-4 h-4 text-purple-300" />
              <span>Support Requests ({counts.support_requested})</span>
            </button>

            <button
              onClick={() => {
                setActiveDashTab('dashboard');
                setStatusFilter('referred');
              }}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
                statusFilter === 'referred'
                  ? 'bg-emerald-700 text-white shadow-xs'
                  : 'text-emerald-200/80 hover:bg-emerald-900 hover:text-white'
              }`}
            >
              <UserCheck className="w-4 h-4 text-orange-300" />
              <span>Referrals ({counts.referred})</span>
            </button>

            <button
              onClick={() => {
                setActiveDashTab('counselors');
              }}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
                activeDashTab === 'counselors'
                  ? 'bg-emerald-700 text-white shadow-xs'
                  : 'text-emerald-200/80 hover:bg-emerald-900 hover:text-white'
              }`}
            >
              <div className="flex items-center gap-3">
                <Users className="w-4 h-4 text-emerald-300" />
                <span>Counselor Management</span>
              </div>
              <span className="text-[10px] bg-emerald-800 text-emerald-200 px-2 py-0.5 rounded-full font-bold">
                {counselors.length}
              </span>
            </button>

            <button
              onClick={() => setShowExportModal(true)}
              className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold text-emerald-200/80 hover:bg-emerald-900 hover:text-white transition-all cursor-pointer"
            >
              <FileSpreadsheet className="w-4 h-4 text-emerald-400" />
              <span>Export Reports</span>
            </button>

            <button
              onClick={() => setActiveDashTab('settings')}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
                activeDashTab === 'settings'
                  ? 'bg-emerald-700 text-white shadow-xs'
                  : 'text-emerald-200/80 hover:bg-emerald-900 hover:text-white'
              }`}
            >
              <Settings className="w-4 h-4" />
              <span>Settings</span>
            </button>
          </nav>
        </div>

        {/* Footer controls */}
        <div className="pt-6 border-t border-emerald-900 space-y-2">
          {/* Supabase status indicator */}
          <div className="flex items-center gap-2 px-2 py-1 text-[11px] text-emerald-300">
            <Database className="w-3.5 h-3.5 text-emerald-400" />
            <span>
              {isSupabaseConfigured ? 'Supabase Live Connected' : 'Local Storage Mode'}
            </span>
          </div>

          <button
            onClick={onSignOut}
            className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold text-rose-300 hover:bg-rose-950/40 hover:text-rose-200 transition-colors"
          >
            <LogOut className="w-4 h-4" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 p-4 sm:p-6 lg:p-8 space-y-6 overflow-x-hidden">
        {/* Top Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
          <div>
            <h1 className="text-2xl font-black text-slate-900 tracking-tight">
              Counselor Dashboard
            </h1>
            <p className="text-xs sm:text-sm text-slate-600">
              Manage student cyberbullying reports and peer-counseling support.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowExportModal(true)}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-800 hover:bg-emerald-900 active:scale-95 text-xs sm:text-sm font-bold text-white shadow-sm transition-all cursor-pointer"
            >
              <FileSpreadsheet className="w-4 h-4" />
              <span>Export Reports</span>
            </button>
          </div>
        </div>

        {/* Prototype / Demonstration Notice */}
        {!isSupabaseConfigured && (
          <div className="rounded-2xl bg-amber-50 border border-amber-200/80 p-3.5 flex items-start gap-3 text-xs text-amber-900">
            <Info className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
            <div className="space-y-0.5">
              <span className="font-bold">Fictional Demonstration Data Notice</span>
              <p className="text-[11px] text-amber-800 leading-normal">
                These records are simulated test data for evaluating counselor workflows and status transitions. They do not represent real AMEU student incidents. Connect live Supabase credentials to synchronize production records.
              </p>
            </div>
          </div>
        )}

        {/* SUMMARY STAT CARDS */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3.5 sm:gap-4">
          {/* New */}
          <div className="rounded-2xl bg-white p-4 border border-slate-200 shadow-xs space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500">New</span>
              <div className="h-7 w-7 rounded-lg bg-blue-50 text-blue-700 flex items-center justify-center font-bold text-xs">
                ●
              </div>
            </div>
            <div className="text-2xl sm:text-3xl font-black text-slate-900">{counts.new}</div>
          </div>

          {/* Under Review */}
          <div className="rounded-2xl bg-white p-4 border border-slate-200 shadow-xs space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Under Review</span>
              <div className="h-7 w-7 rounded-lg bg-amber-50 text-amber-700 flex items-center justify-center font-bold text-xs">
                ●
              </div>
            </div>
            <div className="text-2xl sm:text-3xl font-black text-slate-900">{counts.under_review}</div>
          </div>

          {/* Support Requested */}
          <div className="rounded-2xl bg-white p-4 border border-slate-200 shadow-xs space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Support Req.</span>
              <div className="h-7 w-7 rounded-lg bg-purple-50 text-purple-700 flex items-center justify-center font-bold text-xs">
                ●
              </div>
            </div>
            <div className="text-2xl sm:text-3xl font-black text-slate-900">{counts.support_requested}</div>
          </div>

          {/* Referred */}
          <div className="rounded-2xl bg-white p-4 border border-slate-200 shadow-xs space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Referred</span>
              <div className="h-7 w-7 rounded-lg bg-orange-50 text-orange-700 flex items-center justify-center font-bold text-xs">
                ●
              </div>
            </div>
            <div className="text-2xl sm:text-3xl font-black text-slate-900">{counts.referred}</div>
          </div>

          {/* Closed */}
          <div className="rounded-2xl bg-white p-4 border border-slate-200 shadow-xs space-y-2 col-span-2 sm:col-span-1">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Closed</span>
              <div className="h-7 w-7 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center font-bold text-xs">
                ✓
              </div>
            </div>
            <div className="text-2xl sm:text-3xl font-black text-slate-900">{counts.closed}</div>
          </div>
        </div>

        {/* COUNSELORS VIEW IF ACTIVE */}
        {activeDashTab === 'counselors' ? (
          <div className="space-y-6">
            {/* Top Toolbar */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-3xl border border-slate-200 shadow-xs">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <h2 className="text-lg font-black text-slate-900 tracking-tight">
                    Counselor Management & Directory
                  </h2>
                  <span className="text-[11px] font-bold bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full">
                    Admin Session
                  </span>
                </div>
                <p className="text-xs text-slate-600">
                  Register, activate, or remove authorized peer counselors and supervisors in the AMEU SafeSpace system.
                </p>
              </div>

              <button
                onClick={() => setShowAddCounselorModal(true)}
                className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-800 hover:bg-emerald-900 active:scale-95 text-white font-bold text-xs shadow-md transition-all cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>Log New Peer Counselor</span>
              </button>
            </div>

            {/* Success notification banner */}
            {counselorSuccessMsg && (
              <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs font-semibold flex items-center justify-between animate-in fade-in">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>{counselorSuccessMsg}</span>
                </div>
                <button
                  onClick={() => setCounselorSuccessMsg(null)}
                  className="text-emerald-700 hover:text-emerald-900 cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            )}

            {/* Summary Statistics */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-1">
                <span className="text-[11px] font-bold uppercase text-slate-500">Total Logged</span>
                <div className="text-2xl font-black text-slate-900">{counselors.length}</div>
              </div>
              <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-1">
                <span className="text-[11px] font-bold uppercase text-slate-500">Active Roster</span>
                <div className="text-2xl font-black text-emerald-700">
                  {counselors.filter((c) => c.active).length}
                </div>
              </div>
              <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-1">
                <span className="text-[11px] font-bold uppercase text-slate-500">On Duty Today</span>
                <div className="text-2xl font-black text-blue-700">
                  {counselors.filter((c) => c.active && c.available_today).length}
                </div>
              </div>
              <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-1">
                <span className="text-[11px] font-bold uppercase text-slate-500">Supervisors</span>
                <div className="text-2xl font-black text-amber-700">
                  {counselors.filter((c) => c.role === 'supervising_counselor' || c.role === 'administrator').length}
                </div>
              </div>
            </div>

            {/* Counselors Table with Search and Filters */}
            <div className="rounded-3xl bg-white border border-slate-200 shadow-xs overflow-hidden space-y-4">
              <div className="p-4 sm:p-5 border-b border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-3">
                <div className="relative flex-1 max-w-md">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                  <input
                    type="text"
                    value={counselorSearch}
                    onChange={(e) => setCounselorSearch(e.target.value)}
                    placeholder="Search counselor name, email, department, or specialty..."
                    className="w-full rounded-xl border border-slate-200 pl-10 pr-4 py-2 text-xs text-slate-900 placeholder:text-slate-400 focus:border-emerald-600 focus:outline-hidden"
                  />
                </div>

                <div className="flex items-center gap-2">
                  <Filter className="w-3.5 h-3.5 text-slate-500" />
                  <select
                    value={counselorRoleFilter}
                    onChange={(e) => setCounselorRoleFilter(e.target.value)}
                    className="rounded-lg border border-slate-200 px-2 py-1.5 text-xs text-slate-800 focus:outline-hidden"
                  >
                    <option value="all">All Roles</option>
                    <option value="peer_counselor">Peer Counselors</option>
                    <option value="supervising_counselor">Supervising Counselors</option>
                    <option value="administrator">Administrators</option>
                  </select>
                </div>
              </div>

              {/* Table */}
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="bg-slate-50/80 border-b border-slate-200 text-slate-600 font-bold uppercase tracking-wider text-[11px]">
                      <th className="py-3 px-4">Counselor</th>
                      <th className="py-3 px-4">Role</th>
                      <th className="py-3 px-4">Department & Specialty</th>
                      <th className="py-3 px-4">Internal Contact</th>
                      <th className="py-3 px-4 text-center">Duty Status</th>
                      <th className="py-3 px-4 text-center">Active Status</th>
                      <th className="py-3 px-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {loadingCounselors ? (
                      <tr>
                        <td colSpan={7} className="py-12 text-center text-slate-400">
                          Loading counselor roster...
                        </td>
                      </tr>
                    ) : counselors.filter((c) => {
                        if (counselorRoleFilter !== 'all' && c.role !== counselorRoleFilter) return false;
                        if (counselorSearch.trim()) {
                          const q = counselorSearch.toLowerCase();
                          return (
                            c.display_name.toLowerCase().includes(q) ||
                            c.email.toLowerCase().includes(q) ||
                            c.department?.toLowerCase().includes(q) ||
                            c.specialty?.toLowerCase().includes(q)
                          );
                        }
                        return true;
                      }).length === 0 ? (
                      <tr>
                        <td colSpan={7} className="py-12 text-center text-slate-500 space-y-2">
                          <Users className="w-8 h-8 mx-auto text-slate-300" />
                          <p className="font-semibold">No counselors match your filter criteria.</p>
                        </td>
                      </tr>
                    ) : (
                      counselors
                        .filter((c) => {
                          if (counselorRoleFilter !== 'all' && c.role !== counselorRoleFilter) return false;
                          if (counselorSearch.trim()) {
                            const q = counselorSearch.toLowerCase();
                            return (
                              c.display_name.toLowerCase().includes(q) ||
                              c.email.toLowerCase().includes(q) ||
                              c.department?.toLowerCase().includes(q) ||
                              c.specialty?.toLowerCase().includes(q)
                            );
                          }
                          return true;
                        })
                        .map((c) => (
                          <tr key={c.id} className="hover:bg-slate-50/70 transition-colors">
                            <td className="py-3 px-4">
                              <div className="flex items-center gap-3">
                                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-emerald-800 text-white font-bold text-xs">
                                  {c.display_name.slice(0, 2).toUpperCase()}
                                </div>
                                <div>
                                  <div className="font-bold text-slate-900">{c.display_name}</div>
                                  <div className="text-[11px] text-slate-500 font-mono">{c.email}</div>
                                </div>
                              </div>
                            </td>
                            <td className="py-3 px-4">
                              <span
                                className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                                  c.role === 'administrator'
                                    ? 'bg-blue-100 text-blue-800'
                                    : c.role === 'supervising_counselor'
                                    ? 'bg-amber-100 text-amber-800'
                                    : 'bg-emerald-100 text-emerald-800'
                                }`}
                              >
                                {c.role.replace('_', ' ')}
                              </span>
                            </td>
                            <td className="py-3 px-4 max-w-xs">
                              <div className="font-semibold text-slate-800 truncate">
                                {c.specialty || 'General Digital Safety'}
                              </div>
                              <div className="text-[11px] text-slate-500 truncate">
                                {c.department || 'AMEU Campus'}
                              </div>
                            </td>
                            <td className="py-3 px-4 font-mono text-[11px] text-slate-700">
                              {c.phone || 'Internal Only'}
                            </td>
                            <td className="py-3 px-4 text-center">
                              <button
                                onClick={() => handleToggleDuty(c)}
                                className={`px-2 py-1 rounded-full text-[10px] font-bold cursor-pointer transition-all ${
                                  c.available_today
                                    ? 'bg-blue-50 text-blue-700 border border-blue-200'
                                    : 'bg-slate-100 text-slate-500'
                                }`}
                                title="Click to toggle on-duty today"
                              >
                                {c.available_today ? '● On Duty Today' : 'Off Duty'}
                              </button>
                            </td>
                            <td className="py-3 px-4 text-center">
                              <button
                                onClick={() => handleToggleActive(c)}
                                className={`px-2.5 py-1 rounded-full text-[10px] font-bold cursor-pointer transition-all ${
                                  c.active
                                    ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                                    : 'bg-rose-50 text-rose-700 border border-rose-200'
                                }`}
                                title="Click to toggle active status"
                              >
                                {c.active ? 'Active' : 'Deactivated'}
                              </button>
                            </td>
                            <td className="py-3 px-4 text-right">
                              <button
                                onClick={() => setCounselorToDelete(c)}
                                className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                                title={`Delete counselor ${c.display_name}`}
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </td>
                          </tr>
                        ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        ) : activeDashTab === 'settings' ? (
          <div className="rounded-3xl bg-white border border-slate-200 p-6 sm:p-8 space-y-6">
            <h2 className="text-lg font-bold text-slate-900">Supabase & Security Architecture</h2>
            <p className="text-xs text-slate-600 leading-relaxed">
              AMEU SafeSpace is designed with strict PostgreSQL Row Level Security (RLS). Below is the active configuration status:
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
                <span className="font-bold text-slate-900 block">Supabase Connection</span>
                <p className="text-slate-600">
                  Status: <strong>{isSupabaseConfigured ? 'Live Supabase Instance Active' : 'Standalone Development Mode (Supabase URL/Key Not Set)'}</strong>
                </p>
                <p className="text-slate-500 text-[11px]">
                  Configured in <code>.env</code> with <code>VITE_SUPABASE_URL</code> and <code>VITE_SUPABASE_ANON_KEY</code>.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
                <span className="font-bold text-slate-900 block">Row Level Security (RLS) Enforcement</span>
                <p className="text-slate-600">
                  Public SELECT on <code>reports</code>: <strong>DENIED</strong> (Authorized counselors only)
                </p>
                <p className="text-slate-600">
                  Separated Contact Store: <strong>report_contacts</strong> with granular audit logging.
                </p>
              </div>
            </div>

            <button
              onClick={() => setActiveDashTab('dashboard')}
              className="px-4 py-2 rounded-xl bg-emerald-800 text-white font-semibold text-xs"
            >
              Back to Dashboard
            </button>
          </div>
        ) : (
          /* RECENT REPORTS TABLE */
          <div className="rounded-3xl bg-white border border-slate-200 shadow-xs overflow-hidden space-y-4">
            {/* Filter and Search Bar */}
            <div className="p-4 sm:p-6 border-b border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="relative flex-1 max-w-md">
                <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search by reference, platform, or category..."
                  className="w-full rounded-xl border border-slate-200 pl-10 pr-4 py-2 text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 focus:border-emerald-600 focus:outline-hidden"
                />
              </div>

              <div className="flex flex-wrap items-center gap-2.5">
                <div className="flex items-center gap-1.5 text-xs text-slate-600">
                  <Filter className="w-3.5 h-3.5 text-slate-500" />
                  <span>Status:</span>
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="rounded-lg border border-slate-200 px-2 py-1.5 text-xs text-slate-800 focus:outline-hidden"
                  >
                    <option value="all">All</option>
                    <option value="new">New</option>
                    <option value="under_review">Under Review</option>
                    <option value="support_requested">Support Requested</option>
                    <option value="referred">Referred</option>
                    <option value="closed">Closed</option>
                  </select>
                </div>

                <div className="flex items-center gap-1.5 text-xs text-slate-600">
                  <span>Urgency:</span>
                  <select
                    value={urgencyFilter}
                    onChange={(e) => setUrgencyFilter(e.target.value)}
                    className="rounded-lg border border-slate-200 px-2 py-1.5 text-xs text-slate-800 focus:outline-hidden"
                  >
                    <option value="all">All</option>
                    <option value="high">High</option>
                    <option value="medium">Medium</option>
                    <option value="low">Low</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-slate-50/80 border-b border-slate-200 text-slate-600 font-bold uppercase tracking-wider text-[11px]">
                    <th className="py-3 px-4">Reference</th>
                    <th className="py-3 px-4">Category</th>
                    <th className="py-3 px-4">Platform</th>
                    <th className="py-3 px-4">Date Received</th>
                    <th className="py-3 px-4">Urgency</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {loading ? (
                    <tr>
                      <td colSpan={7} className="py-8 text-center text-slate-500">
                        Loading reports...
                      </td>
                    </tr>
                  ) : filteredReports.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="py-12 text-center text-slate-500 space-y-2">
                        <Shield className="w-8 h-8 text-slate-300 mx-auto" />
                        <p className="font-semibold text-slate-700">No reports found.</p>
                        <p className="text-[11px] text-slate-400">
                          {searchQuery || statusFilter !== 'all'
                            ? 'Try clearing search filters to see all recorded reports.'
                            : 'No reports have been submitted yet.'}
                        </p>
                      </td>
                    </tr>
                  ) : (
                    filteredReports.map((report) => {
                      const urgencyColor =
                        report.urgency === 'high'
                          ? 'bg-rose-100 text-rose-800 border-rose-200'
                          : report.urgency === 'medium'
                          ? 'bg-amber-100 text-amber-800 border-amber-200'
                          : 'bg-emerald-100 text-emerald-800 border-emerald-200';

                      const statusColor =
                        report.status === 'new'
                          ? 'bg-blue-100 text-blue-800'
                          : report.status === 'under_review'
                          ? 'bg-amber-100 text-amber-800'
                          : report.status === 'support_requested'
                          ? 'bg-purple-100 text-purple-800'
                          : report.status === 'referred'
                          ? 'bg-orange-100 text-orange-800'
                          : 'bg-emerald-100 text-emerald-800';

                      return (
                        <tr
                          key={report.id}
                          className="hover:bg-slate-50/80 transition-colors group cursor-pointer"
                          onClick={() => handleOpenReport(report)}
                        >
                          <td className="py-3.5 px-4 font-mono font-bold text-slate-900 whitespace-nowrap">
                            {report.reference_code}
                          </td>
                          <td className="py-3.5 px-4 text-slate-700 max-w-[200px] truncate">
                            {report.incident_types.join(', ')}
                          </td>
                          <td className="py-3.5 px-4 text-slate-600 whitespace-nowrap">
                            {report.platform}
                          </td>
                          <td className="py-3.5 px-4 text-slate-500 whitespace-nowrap">
                            {formatDate(report.created_at)}
                          </td>
                          <td className="py-3.5 px-4 whitespace-nowrap">
                            <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase border ${urgencyColor}`}>
                              {report.urgency}
                            </span>
                          </td>
                          <td className="py-3.5 px-4 whitespace-nowrap">
                            <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold ${statusColor}`}>
                              {report.status.replace('_', ' ')}
                            </span>
                          </td>
                          <td className="py-3.5 px-4 text-right whitespace-nowrap">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleOpenReport(report);
                              }}
                              className="inline-flex items-center gap-1 px-3 py-1 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-800 font-bold text-xs transition-colors"
                            >
                              <Eye className="w-3.5 h-3.5" />
                              <span>View</span>
                            </button>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </main>

      {/* REPORT DETAIL MODAL / DRAWER */}
      {selectedReport && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in-50">
          <div className="w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-3xl bg-white border border-slate-200 shadow-2xl p-6 sm:p-8 space-y-6">
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div className="space-y-1">
                <div className="flex items-center gap-3">
                  <span className="font-mono text-xl font-black text-slate-900">
                    {selectedReport.reference_code}
                  </span>
                  <span
                    className={`px-2.5 py-0.5 rounded-full text-xs font-bold uppercase ${
                      selectedReport.urgency === 'high'
                        ? 'bg-rose-100 text-rose-800'
                        : selectedReport.urgency === 'medium'
                        ? 'bg-amber-100 text-amber-800'
                        : 'bg-emerald-100 text-emerald-800'
                    }`}
                  >
                    {selectedReport.urgency} Urgency
                  </span>
                </div>
                <p className="text-xs text-slate-500">
                  Received on {formatDate(selectedReport.created_at)} • Platform: {selectedReport.platform}
                </p>
              </div>

              <button
                onClick={() => setSelectedReport(null)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Success notification */}
            {actionSuccessMsg && (
              <div className="rounded-xl bg-emerald-50 border border-emerald-200 p-3 text-xs text-emerald-900 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>{actionSuccessMsg}</span>
              </div>
            )}

            {/* Details Grid */}
            <div className="grid grid-cols-2 gap-4 text-xs">
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
                <span className="text-slate-500 font-semibold block">Reporting For</span>
                <span className="font-bold text-slate-900 capitalize">
                  {selectedReport.reporting_for === 'me'
                    ? 'Self (Student affected)'
                    : selectedReport.reporting_for === 'friend'
                    ? 'A friend or classmate'
                    : 'Unsure'}
                </span>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
                <span className="text-slate-500 font-semibold block">Incident Date</span>
                <span className="font-bold text-slate-900">
                  {formatDateOnly(selectedReport.incident_date)}
                </span>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-1 col-span-2">
                <span className="text-slate-500 font-semibold block">Incident Categories</span>
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {selectedReport.incident_types.map((t) => (
                    <span
                      key={t}
                      className="px-2.5 py-1 rounded-md bg-white border border-slate-200 font-medium text-slate-800 text-[11px]"
                    >
                      {t}
                    </span>
                  ))}
                  {selectedReport.incident_types_other && (
                    <span className="px-2.5 py-1 rounded-md bg-amber-50 border border-amber-200 font-medium text-amber-900 text-[11px]">
                      Other: {selectedReport.incident_types_other}
                    </span>
                  )}
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-1 col-span-2">
                <span className="text-slate-500 font-semibold block">Narrative Description</span>
                <p className="text-slate-800 leading-relaxed whitespace-pre-wrap pt-1 font-sans">
                  {selectedReport.description}
                </p>
              </div>

              {/* Immediate Danger Check */}
              <div
                className={`p-3.5 rounded-xl border col-span-2 flex items-center justify-between ${
                  selectedReport.immediate_danger === 'yes'
                    ? 'bg-rose-50 border-rose-200 text-rose-900'
                    : 'bg-slate-50 border-slate-200 text-slate-700'
                }`}
              >
                <div className="flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-rose-600" />
                  <span className="font-semibold">Immediate Danger Flag:</span>
                  <span className="font-bold uppercase">{selectedReport.immediate_danger}</span>
                </div>
                {selectedReport.immediate_danger === 'yes' && (
                  <span className="text-[11px] font-bold text-rose-700">Urgent Supervision Required</span>
                )}
              </div>
            </div>

            {/* Contact Details (Restricted & Protected) */}
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Phone className="w-4 h-4 text-emerald-700" />
                  <span className="text-xs font-bold text-slate-900">
                    Follow-Up Contact Request
                  </span>
                </div>
                <span className="text-xs font-semibold text-slate-600">
                  {selectedReport.contact_requested ? 'Yes, contact requested' : 'Anonymous (No contact requested)'}
                </span>
              </div>

              {selectedReport.contact_requested && (
                <div className="pt-2 border-t border-slate-200/80">
                  {revealedContact ? (
                    <div className="p-3 rounded-xl bg-white border border-emerald-300 space-y-1 animate-in fade-in-50">
                      <div className="flex items-center justify-between">
                        <span className="text-[11px] text-slate-500 font-semibold">Protected Student Phone:</span>
                        <span className="text-[10px] text-emerald-800 font-bold bg-emerald-100 px-2 py-0.5 rounded-full">
                          Consent Confirmed
                        </span>
                      </div>
                      <div className="font-mono text-base font-bold text-slate-900">
                        {revealedContact.phone_number}
                      </div>
                    </div>
                  ) : (
                    <button
                      type="button"
                      disabled={loadingContact}
                      onClick={handleRevealContact}
                      className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white border border-slate-300 hover:bg-slate-100 text-slate-700 text-xs font-bold transition-all"
                    >
                      <Lock className="w-3.5 h-3.5 text-slate-500" />
                      <span>{loadingContact ? 'Accessing Secure Record...' : 'View Protected Phone Number'}</span>
                    </button>
                  )}
                  <p className="text-[10px] text-slate-400 mt-1">
                    Viewing this information records an immutable audit log event.
                  </p>
                </div>
              )}
            </div>

            {/* Case Management Actions */}
            <div className="pt-4 border-t border-slate-100 space-y-4">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800">
                Update Case Status & Internal Notes
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Change Status
                  </label>
                  <select
                    value={newStatus || selectedReport.status}
                    onChange={(e) => setNewStatus(e.target.value as ReportStatus)}
                    className="w-full rounded-xl border border-slate-300 p-2 text-xs sm:text-sm text-slate-900 focus:border-emerald-600 focus:outline-hidden"
                  >
                    <option value="new">New</option>
                    <option value="under_review">Under Review</option>
                    <option value="support_requested">Support Requested</option>
                    <option value="referred">Referred</option>
                    <option value="closed">Closed</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Internal Note / Referral Action
                  </label>
                  <input
                    type="text"
                    value={internalNote}
                    onChange={(e) => setInternalNote(e.target.value)}
                    placeholder="e.g. Conducted peer check-in; referred to Student Affairs"
                    className="w-full rounded-xl border border-slate-300 px-3 py-2 text-xs sm:text-sm text-slate-900 focus:border-emerald-600 focus:outline-hidden"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  disabled={isUpdatingStatus}
                  onClick={handleSaveCaseUpdate}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-800 hover:bg-emerald-900 active:scale-95 text-xs sm:text-sm font-bold text-white shadow-md transition-all disabled:opacity-50 cursor-pointer"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>{isUpdatingStatus ? 'Saving Case Log...' : 'Update Case Record'}</span>
                </button>
              </div>
            </div>

            {/* Case Activity & Audit History */}
            <div className="pt-4 border-t border-slate-100 space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800">
                Audit Trail & Activity Log
              </h3>
              <div className="space-y-2 max-h-40 overflow-y-auto">
                {reportActivities.length === 0 ? (
                  <p className="text-xs text-slate-400 italic">No activity recorded yet for this report.</p>
                ) : (
                  reportActivities.map((act) => (
                    <div
                      key={act.id}
                      className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs space-y-1"
                    >
                      <div className="flex items-center justify-between text-[11px] text-slate-500">
                        <span className="font-bold text-slate-800">{act.actor_name}</span>
                        <span>{formatDate(act.created_at)}</span>
                      </div>
                      <p className="text-slate-700 leading-snug">{act.note}</p>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* EXPORT MODAL */}
      {showExportModal && user && (
        <ExportModal
          reports={reports}
          actorUserId={user.id}
          actorName={user.display_name}
          onClose={() => setShowExportModal(false)}
        />
      )}

      {/* LOG NEW COUNSELOR MODAL */}
      {showAddCounselorModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in duration-200">
          <div className="w-full max-w-lg rounded-3xl bg-white p-6 sm:p-8 shadow-2xl border border-slate-100 space-y-6 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2.5">
                <div className="h-10 w-10 rounded-xl bg-emerald-800 text-white flex items-center justify-center">
                  <UserPlus className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900">Log New Peer Counselor</h3>
                  <p className="text-xs text-slate-500">Add an authorized counselor to the AMEU SafeSpace roster</p>
                </div>
              </div>
              <button
                onClick={() => setShowAddCounselorModal(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveNewCounselor} className="space-y-4">
              <div className="space-y-1">
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
                  Full Name *
                </label>
                <input
                  type="text"
                  required
                  value={newCounselorName}
                  onChange={(e) => setNewCounselorName(e.target.value)}
                  placeholder="e.g. Fatu M. Johnson"
                  className="w-full rounded-xl border border-slate-300 p-2.5 text-xs sm:text-sm text-slate-900 focus:border-emerald-600 focus:outline-hidden"
                />
              </div>

              <div className="space-y-1">
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
                  University / Institutional Email *
                </label>
                <input
                  type="email"
                  required
                  value={newCounselorEmail}
                  onChange={(e) => setNewCounselorEmail(e.target.value)}
                  placeholder="e.g. fjohnson@ame.edu.lr"
                  className="w-full rounded-xl border border-slate-300 p-2.5 text-xs sm:text-sm text-slate-900 focus:border-emerald-600 focus:outline-hidden"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
                    Role *
                  </label>
                  <select
                    value={newCounselorRole}
                    onChange={(e) => setNewCounselorRole(e.target.value as CounselorRole)}
                    className="w-full rounded-xl border border-slate-300 p-2.5 text-xs text-slate-900 focus:border-emerald-600 focus:outline-hidden"
                  >
                    <option value="peer_counselor">Peer Counselor</option>
                    <option value="supervising_counselor">Supervising Counselor</option>
                    <option value="administrator">Administrator</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
                    Department / College
                  </label>
                  <input
                    type="text"
                    value={newCounselorDepartment}
                    onChange={(e) => setNewCounselorDepartment(e.target.value)}
                    placeholder="e.g. Department of Sociology"
                    className="w-full rounded-xl border border-slate-300 p-2.5 text-xs text-slate-900 focus:border-emerald-600 focus:outline-hidden"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
                  Specialty / Safeguarding Focus
                </label>
                <input
                  type="text"
                  value={newCounselorSpecialty}
                  onChange={(e) => setNewCounselorSpecialty(e.target.value)}
                  placeholder="e.g. Social Media Harassment & WhatsApp De-escalation"
                  className="w-full rounded-xl border border-slate-300 p-2.5 text-xs sm:text-sm text-slate-900 focus:border-emerald-600 focus:outline-hidden"
                />
              </div>

              <div className="space-y-1">
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
                  Internal Phone / WhatsApp Contact
                </label>
                <input
                  type="text"
                  value={newCounselorPhone}
                  onChange={(e) => setNewCounselorPhone(e.target.value)}
                  placeholder="e.g. +231 77 123 4567"
                  className="w-full rounded-xl border border-slate-300 p-2.5 text-xs sm:text-sm text-slate-900 focus:border-emerald-600 focus:outline-hidden"
                />
              </div>

              <div className="space-y-1">
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
                  Bio / Peer Introduction
                </label>
                <textarea
                  rows={2}
                  value={newCounselorBio}
                  onChange={(e) => setNewCounselorBio(e.target.value)}
                  placeholder="Brief note on their peer support focus and listening approach..."
                  className="w-full rounded-xl border border-slate-300 p-2.5 text-xs sm:text-sm text-slate-900 focus:border-emerald-600 focus:outline-hidden"
                />
              </div>

              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="availToday"
                  checked={newCounselorAvailable}
                  onChange={(e) => setNewCounselorAvailable(e.target.checked)}
                  className="h-4 w-4 rounded border-slate-300 text-emerald-700 focus:ring-emerald-500"
                />
                <label htmlFor="availToday" className="text-xs font-semibold text-slate-700 cursor-pointer">
                  Mark as On Duty / Available Today for student inquiries
                </label>
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowAddCounselorModal(false)}
                  className="px-4 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-50 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSavingCounselor}
                  className="px-5 py-2.5 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-xs font-bold text-white shadow-md cursor-pointer disabled:opacity-50"
                >
                  {isSavingCounselor ? 'Logging Counselor...' : 'Save & Authorize Counselor'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* CONFIRM DELETE COUNSELOR MODAL */}
      {counselorToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in duration-200">
          <div className="w-full max-w-md rounded-3xl bg-white p-6 shadow-2xl border border-slate-100 space-y-5">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-rose-100 text-rose-700 flex items-center justify-center">
                <Trash2 className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900">Remove Peer Counselor</h3>
                <p className="text-xs text-slate-500">Revoke authorization from university roster</p>
              </div>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed">
              Are you sure you want to remove <strong>{counselorToDelete.display_name}</strong> ({counselorToDelete.email})? They will no longer have access to confidential student case logs and will be removed from the student peer directory. This action is permanently audited.
            </p>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setCounselorToDelete(null)}
                className="px-4 py-2 rounded-xl border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-50 cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmDeleteCounselor}
                className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-xs font-bold text-white shadow-md cursor-pointer"
              >
                Confirm Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
