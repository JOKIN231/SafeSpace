import React from 'react';
import {
  Users,
  ShieldCheck,
  HeartHandshake,
  Clock,
  MapPin,
  ArrowRight,
  Phone,
  Shield,
  CheckCircle2,
  Lock,
  Sparkles,
  HelpCircle
} from 'lucide-react';

interface PeerCounselorsSectionProps {
  onNavigateToReport: () => void;
  onNavigateToSupport: () => void;
}

export const PeerCounselorsSection: React.FC<PeerCounselorsSectionProps> = ({
  onNavigateToReport,
  onNavigateToSupport,
}) => {
  return (
    <section className="relative overflow-hidden py-4 sm:py-6">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div className="space-y-3 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold tracking-wide">
              <Users className="w-3.5 h-3.5 text-emerald-700" />
              <span>STUDENT SAFEGUARDING & PEER LISTENING</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
              AMEU <span className="text-emerald-700">Peer Support Network</span>
            </h2>
            <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
              Trained fellow students and safeguarding staff ready to listen with empathy, guidance, and strict confidentiality. You never have to handle digital harassment or online hostility alone.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onNavigateToReport}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-800 hover:bg-emerald-900 active:scale-95 text-white text-xs font-bold shadow-md shadow-emerald-900/20 transition-all cursor-pointer"
            >
              <span>Request Peer Follow-Up</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* 3 Pillars of Safe Peer Counseling */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Pillar 1: How Peer Counseling Works */}
          <div className="rounded-3xl bg-white border border-slate-200/90 p-6 sm:p-7 shadow-xs space-y-4 hover:border-emerald-500/50 transition-all">
            <div className="h-12 w-12 rounded-2xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold">
              <HeartHandshake className="w-6 h-6 text-emerald-700" />
            </div>
            <h3 className="text-lg font-bold text-slate-900">1. Safe, Non-Judgmental Listening</h3>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              AMEU peer counselors are senior university students trained in active listening, empathy, and crisis de-escalation under the supervision of the Dean of Students.
            </p>
            <ul className="text-xs text-slate-600 space-y-2 pt-2 border-t border-slate-100">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <span>Zero blame or judgment</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <span>Assistance navigating campus rules</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <span>Emotional support and practical steps</span>
              </li>
            </ul>
          </div>

          {/* Pillar 2: How Contact is Initiated Safely */}
          <div className="rounded-3xl bg-white border border-slate-200/90 p-6 sm:p-7 shadow-xs space-y-4 hover:border-emerald-500/50 transition-all">
            <div className="h-12 w-12 rounded-2xl bg-blue-100 text-blue-800 flex items-center justify-center font-bold">
              <Lock className="w-6 h-6 text-blue-700" />
            </div>
            <h3 className="text-lg font-bold text-slate-900">2. Requesting Support Safely</h3>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              To prevent miscommunication or harassment, contact is never conducted through public phone numbers. Instead, submit a confidential report with the contact option enabled.
            </p>
            <ul className="text-xs text-slate-600 space-y-2 pt-2 border-t border-slate-100">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <span>Voluntary phone number with consent</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <span>Isolated contact storage with RLS</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <span>Discreet, counselor-initiated reach out</span>
              </li>
            </ul>
          </div>

          {/* Pillar 3: On-Campus Walk-in Hours */}
          <div className="rounded-3xl bg-white border border-slate-200/90 p-6 sm:p-7 shadow-xs space-y-4 hover:border-emerald-500/50 transition-all">
            <div className="h-12 w-12 rounded-2xl bg-amber-100 text-amber-800 flex items-center justify-center font-bold">
              <MapPin className="w-6 h-6 text-amber-700" />
            </div>
            <h3 className="text-lg font-bold text-slate-900">3. In-Person Campus Support</h3>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              Prefer an in-person conversation? Visit the Student Welfare and Counseling desk located on the AMEU Camp Johnson Road campus.
            </p>
            <div className="space-y-2 pt-2 border-t border-slate-100 text-xs text-slate-600">
              <div className="flex items-start gap-2">
                <Clock className="w-3.5 h-3.5 text-slate-500 mt-0.5 shrink-0" />
                <span><strong>Hours:</strong> Mon – Fri, 9:00 AM – 4:00 PM</span>
              </div>
              <div className="flex items-start gap-2">
                <MapPin className="w-3.5 h-3.5 text-slate-500 mt-0.5 shrink-0" />
                <span><strong>Location:</strong> Dean of Students Office, Student Affairs Complex, AMEU Campus</span>
              </div>
            </div>
          </div>
        </div>

        {/* Reassurance Banner with direct actions */}
        <div className="rounded-3xl bg-gradient-to-r from-emerald-900 via-emerald-950 to-slate-900 text-white p-6 sm:p-8 flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-xl border border-emerald-800">
          <div className="space-y-2 max-w-xl">
            <div className="flex items-center gap-2 text-emerald-300 text-xs font-bold uppercase tracking-wider">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Campus Safeguarding Pledge</span>
            </div>
            <h3 className="text-xl sm:text-2xl font-black">
              Experiencing harassment right now?
            </h3>
            <p className="text-xs sm:text-sm text-emerald-100/90 leading-relaxed">
              You are never required to prove an incident before reaching out. Whether you want to talk or make a record, we are here for you.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 shrink-0">
            <button
              onClick={onNavigateToReport}
              className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 active:scale-95 text-emerald-950 font-bold text-xs shadow-lg transition-all cursor-pointer"
            >
              <span>Submit Confidential Report</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <button
              onClick={onNavigateToSupport}
              className="inline-flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-white/10 hover:bg-white/20 text-white font-semibold text-xs border border-white/20 transition-all cursor-pointer"
            >
              <HelpCircle className="w-4 h-4 text-emerald-300" />
              <span>Emergency & Helplines</span>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};
