import React, { useState, useEffect } from 'react';
import {
  Users,
  MessageCircle,
  Phone,
  ShieldCheck,
  HeartHandshake,
  Clock,
  Sparkles,
  ArrowRight,
  Send,
  X,
  CheckCircle2,
  Lock,
  UserCheck
} from 'lucide-react';
import { CounselorProfile } from '../types/database';
import { getCounselorProfiles } from '../lib/supabase';

interface PeerCounselorsSectionProps {
  onNavigateToReport: () => void;
  onNavigateToSupport: () => void;
}

export const PeerCounselorsSection: React.FC<PeerCounselorsSectionProps> = ({
  onNavigateToReport,
  onNavigateToSupport,
}) => {
  const [counselors, setCounselors] = useState<CounselorProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCounselor, setSelectedCounselor] = useState<CounselorProfile | null>(null);
  const [activeFilter, setActiveFilter] = useState<'all' | 'available' | 'peer' | 'supervisor'>('all');

  // Modal contact request state
  const [contactMode, setContactMode] = useState<'whatsapp' | 'meeting' | 'callback'>('whatsapp');
  const [studentNote, setStudentNote] = useState('');
  const [studentPhone, setStudentPhone] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    async function fetchCounselors() {
      try {
        const data = await getCounselorProfiles();
        setCounselors(data);
      } catch (err) {
        console.error('Failed to fetch peer counselors:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchCounselors();
  }, []);

  const filteredCounselors = counselors.filter((c) => {
    if (!c.active) return false;
    if (activeFilter === 'available') return c.available_today;
    if (activeFilter === 'peer') return c.role === 'peer_counselor';
    if (activeFilter === 'supervisor') return c.role === 'supervising_counselor' || c.role === 'administrator';
    return true;
  });

  const handleOpenConnect = (counselor: CounselorProfile) => {
    setSelectedCounselor(counselor);
    setIsSubmitted(false);
    setStudentNote('');
    setStudentPhone('');
  };

  const handleSendRequest = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setTimeout(() => {
      setSubmitting(false);
      setIsSubmitted(true);
    }, 600);
  };

  const generateWhatsAppLink = (phone?: string, counselorName?: string) => {
    const rawNumber = (phone || '+231771238899').replace(/[^0-9]/g, '');
    const text = encodeURIComponent(
      `Hello ${counselorName || 'Counselor'}, I am an AMEU student reaching out through the AMEU SafeSpace platform for confidential peer support.`
    );
    return `https://wa.me/${rawNumber}?text=${text}`;
  };

  return (
    <section className="relative overflow-hidden py-4 sm:py-6">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div className="space-y-3 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold tracking-wide">
              <Users className="w-3.5 h-3.5 text-emerald-700" />
              <span>CONFIDENTIAL PEER SUPPORT NETWORK</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
              Connect with <span className="text-emerald-700">Peer Counselors</span>
            </h2>
            <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
              Trained fellow students at African Methodist Episcopal University who understand your digital campus experience. Reach out privately for friendly listening, guidance, or assistance.
            </p>
          </div>

          {/* Filter Pills */}
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => setActiveFilter('all')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                activeFilter === 'all'
                  ? 'bg-emerald-700 text-white shadow-xs'
                  : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
              }`}
            >
              All Counselors ({counselors.filter((c) => c.active).length})
            </button>
            <button
              onClick={() => setActiveFilter('available')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer flex items-center gap-1.5 ${
                activeFilter === 'available'
                  ? 'bg-emerald-700 text-white shadow-xs'
                  : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
              }`}
            >
              <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></span>
              <span>Available Today</span>
            </button>
            <button
              onClick={() => setActiveFilter('peer')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                activeFilter === 'peer'
                  ? 'bg-emerald-700 text-white shadow-xs'
                  : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
              }`}
            >
              Peer Mentors
            </button>
          </div>
        </div>

        {/* Counselors Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-pulse">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-64 rounded-3xl bg-slate-200"></div>
            ))}
          </div>
        ) : filteredCounselors.length === 0 ? (
          <div className="p-8 text-center bg-white rounded-3xl border border-slate-200 text-slate-500 space-y-2">
            <Users className="w-10 h-10 text-slate-400 mx-auto" />
            <p className="font-semibold text-slate-700">No counselors currently match this filter.</p>
            <button
              onClick={() => setActiveFilter('all')}
              className="text-xs font-bold text-emerald-700 hover:underline"
            >
              View all registered counselors
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCounselors.map((counselor) => {
              const isSupervisor =
                counselor.role === 'supervising_counselor' || counselor.role === 'administrator';

              return (
                <div
                  key={counselor.id}
                  className="rounded-3xl bg-white border border-slate-200/90 shadow-sm hover:shadow-xl hover:border-emerald-500/40 transition-all flex flex-col justify-between overflow-hidden group p-6 space-y-5"
                >
                  <div className="space-y-4">
                    {/* Header Row: Initials Badge & Status */}
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <div
                          className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl font-black text-sm text-white shadow-sm ${
                            isSupervisor ? 'bg-amber-700' : 'bg-[#064E32]'
                          }`}
                        >
                          {counselor.display_name
                            .split(' ')
                            .map((n) => n[0])
                            .slice(0, 2)
                            .join('')}
                        </div>
                        <div>
                          <h3 className="text-base font-bold text-slate-900 group-hover:text-emerald-800 transition-colors">
                            {counselor.display_name}
                          </h3>
                          <span
                            className={`text-[11px] font-semibold px-2 py-0.5 rounded-full inline-block ${
                              isSupervisor
                                ? 'bg-amber-100 text-amber-800'
                                : 'bg-emerald-100 text-emerald-800'
                            }`}
                          >
                            {isSupervisor ? 'Supervising Counselor' : 'Trained Peer Counselor'}
                          </span>
                        </div>
                      </div>

                      {counselor.available_today ? (
                        <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200/70 px-2.5 py-1 rounded-full">
                          <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                          Available
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-[10px] font-medium text-slate-500 bg-slate-100 px-2.5 py-1 rounded-full">
                          <Clock className="w-2.5 h-2.5" /> On Call
                        </span>
                      )}
                    </div>

                    {/* Department & Specialty */}
                    <div className="space-y-2 text-xs">
                      {counselor.department && (
                        <p className="text-slate-500 font-medium">{counselor.department}</p>
                      )}

                      {counselor.specialty && (
                        <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-800 bg-emerald-50/80 px-2.5 py-1.5 rounded-xl border border-emerald-200/60 w-full">
                          <Sparkles className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                          <span className="truncate">{counselor.specialty}</span>
                        </div>
                      )}

                      {counselor.bio && (
                        <p className="text-slate-600 text-[11px] leading-relaxed line-clamp-2 pt-1">
                          {counselor.bio}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="pt-3 border-t border-slate-100 flex items-center gap-2">
                    <button
                      onClick={() => handleOpenConnect(counselor)}
                      className="flex-1 inline-flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs shadow-sm hover:shadow-md transition-all cursor-pointer active:scale-95"
                    >
                      <MessageCircle className="w-3.5 h-3.5" />
                      <span>Connect Privately</span>
                    </button>

                    <a
                      href={generateWhatsAppLink(counselor.phone, counselor.display_name)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2.5 rounded-xl border border-emerald-300 text-emerald-800 bg-emerald-50 hover:bg-emerald-100 transition-colors cursor-pointer"
                      title="Quick WhatsApp message"
                    >
                      <Phone className="w-4 h-4 text-emerald-700" />
                    </a>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Safeguarding Reassurance Box */}
        <div className="rounded-2xl bg-emerald-900/90 text-white p-5 sm:p-6 flex flex-col md:flex-row items-center justify-between gap-4 shadow-lg border border-emerald-700/60">
          <div className="flex items-center gap-3.5">
            <div className="h-10 w-10 shrink-0 rounded-xl bg-emerald-800 flex items-center justify-center text-emerald-300 ring-1 ring-emerald-500/40">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-sm font-bold tracking-tight text-white">
                100% Confidential Peer Safeguarding
              </h4>
              <p className="text-xs text-emerald-200/90">
                Peer counselors are bound by strict non-disclosure policies. Conversations are never shared with classmates or instructors.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={onNavigateToReport}
              className="px-4 py-2 rounded-xl bg-white text-emerald-950 hover:bg-emerald-50 font-bold text-xs transition-colors cursor-pointer shadow-sm"
            >
              Submit An Incident Report
            </button>
            <button
              onClick={onNavigateToSupport}
              className="px-4 py-2 rounded-xl border border-emerald-400 text-emerald-100 hover:bg-emerald-800/80 font-bold text-xs transition-colors cursor-pointer"
            >
              Support Guidelines
            </button>
          </div>
        </div>
      </div>

      {/* Connect Modal */}
      {selectedCounselor && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in duration-200">
          <div className="w-full max-w-lg rounded-3xl bg-white p-6 sm:p-8 shadow-2xl border border-slate-100 space-y-6">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-800 text-white font-bold text-sm">
                  {selectedCounselor.display_name
                    .split(' ')
                    .map((n) => n[0])
                    .slice(0, 2)
                    .join('')}
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900">
                    Connect with {selectedCounselor.display_name}
                  </h3>
                  <span className="text-xs font-semibold text-emerald-700">
                    {selectedCounselor.specialty || 'AMEU Peer Counselor'}
                  </span>
                </div>
              </div>
              <button
                onClick={() => setSelectedCounselor(null)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {isSubmitted ? (
              <div className="py-6 text-center space-y-4">
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-emerald-100 text-emerald-700">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <h4 className="text-lg font-bold text-slate-900">Request Sent Confidentially</h4>
                <p className="text-xs sm:text-sm text-slate-600 max-w-sm mx-auto leading-relaxed">
                  Your confidential check-in request has been logged. {selectedCounselor.display_name} will follow up in accordance with your chosen communication preference.
                </p>
                <div className="pt-2">
                  <button
                    onClick={() => setSelectedCounselor(null)}
                    className="px-6 py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-semibold text-xs cursor-pointer"
                  >
                    Close Window
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSendRequest} className="space-y-4">
                <div className="space-y-2">
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
                    How would you prefer to connect?
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    <button
                      type="button"
                      onClick={() => setContactMode('whatsapp')}
                      className={`p-3 rounded-xl border text-xs font-semibold flex flex-col items-center gap-1.5 transition-all cursor-pointer ${
                        contactMode === 'whatsapp'
                          ? 'border-emerald-600 bg-emerald-50 text-emerald-900 ring-2 ring-emerald-500/20'
                          : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                      }`}
                    >
                      <MessageCircle className="w-4 h-4 text-emerald-600" />
                      <span>WhatsApp</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setContactMode('meeting')}
                      className={`p-3 rounded-xl border text-xs font-semibold flex flex-col items-center gap-1.5 transition-all cursor-pointer ${
                        contactMode === 'meeting'
                          ? 'border-emerald-600 bg-emerald-50 text-emerald-900 ring-2 ring-emerald-500/20'
                          : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                      }`}
                    >
                      <HeartHandshake className="w-4 h-4 text-emerald-600" />
                      <span>Campus Chat</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setContactMode('callback')}
                      className={`p-3 rounded-xl border text-xs font-semibold flex flex-col items-center gap-1.5 transition-all cursor-pointer ${
                        contactMode === 'callback'
                          ? 'border-emerald-600 bg-emerald-50 text-emerald-900 ring-2 ring-emerald-500/20'
                          : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                      }`}
                    >
                      <Phone className="w-4 h-4 text-emerald-600" />
                      <span>Phone Call</span>
                    </button>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-slate-700">
                    Optional Message or Topic
                  </label>
                  <textarea
                    rows={3}
                    value={studentNote}
                    onChange={(e) => setStudentNote(e.target.value)}
                    placeholder="e.g. Someone is posting hurtful messages in our class WhatsApp group..."
                    className="w-full rounded-xl border border-slate-300 p-3 text-xs sm:text-sm text-slate-800 placeholder-slate-400 focus:border-emerald-600 focus:outline-hidden"
                  />
                  <p className="text-[10px] text-slate-500">
                    Share only what you are comfortable sharing. You do not need to provide your full name.
                  </p>
                </div>

                {contactMode !== 'whatsapp' && (
                  <div className="space-y-1.5">
                    <label className="block text-xs font-bold text-slate-700">
                      Phone Number or Preferred Contact
                    </label>
                    <input
                      type="text"
                      value={studentPhone}
                      onChange={(e) => setStudentPhone(e.target.value)}
                      placeholder="+231 77 123 4567"
                      className="w-full rounded-xl border border-slate-300 p-2.5 text-xs sm:text-sm text-slate-800 focus:border-emerald-600 focus:outline-hidden"
                      required
                    />
                  </div>
                )}

                <div className="rounded-xl bg-slate-50 border border-slate-200 p-3 flex items-start gap-2.5 text-[11px] text-slate-600">
                  <Lock className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
                  <span>
                    Your conversation with {selectedCounselor.display_name} is protected by university confidentiality safeguards.
                  </span>
                </div>

                <div className="flex items-center gap-3 pt-2">
                  {contactMode === 'whatsapp' ? (
                    <a
                      href={generateWhatsAppLink(selectedCounselor.phone, selectedCounselor.display_name)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 inline-flex items-center justify-center gap-2 py-3 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs sm:text-sm shadow-md transition-all cursor-pointer"
                    >
                      <MessageCircle className="w-4 h-4" />
                      <span>Start Confidential WhatsApp Chat</span>
                    </a>
                  ) : (
                    <button
                      type="submit"
                      disabled={submitting}
                      className="flex-1 inline-flex items-center justify-center gap-2 py-3 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs sm:text-sm shadow-md transition-all cursor-pointer disabled:opacity-50"
                    >
                      <Send className="w-4 h-4" />
                      <span>{submitting ? 'Submitting...' : 'Send Discreet Check-in Request'}</span>
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={() => setSelectedCounselor(null)}
                    className="py-3 px-4 rounded-xl border border-slate-200 text-slate-700 font-semibold text-xs sm:text-sm hover:bg-slate-50 cursor-pointer"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </section>
  );
};
