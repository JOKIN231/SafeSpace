import React from 'react';
import { ShieldCheck, Lock, Eye, AlertCircle, FileText, CheckCircle2 } from 'lucide-react';

export const PrivacyPage: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-10">
      {/* Title Banner */}
      <div className="space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#F0F8F1] text-[#064E32] text-xs font-bold ring-1 ring-[#25A55B]/30">
          <Lock className="w-3.5 h-3.5 text-[#138A45]" />
          <span>Data Protection & Student Safeguarding</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
          Privacy & Safeguarding Notice
        </h1>
        <p className="text-base sm:text-lg text-slate-600">
          Your information. <strong className="text-[#064E32]">Our responsibility.</strong>
        </p>
      </div>

      <div className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-200/90 shadow-sm space-y-8 text-slate-700">
        <p className="text-sm sm:text-base leading-relaxed text-slate-600">
          We collect and use information only for the purposes of supporting student safety, digital wellbeing, and building a harassment-free university community at AMEU.
        </p>

        {/* Section 1 */}
        <div className="space-y-3 pt-4 border-t border-slate-100">
          <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-emerald-100 text-[#064E32] text-xs font-bold">1</span>
            What information a report may contain
          </h2>
          <ul className="text-sm space-y-2 list-disc list-inside text-slate-600 pl-2 leading-relaxed">
            <li>
              <strong>Report details:</strong> Who is affected, incident categories, online platform used, optional approximate incident date, and the narrative description you voluntarily share.
            </li>
            <li>
              <strong>Optional contact information:</strong> If you explicitly choose to request peer counselor contact, your phone number and contact preferences are stored in an isolated, access-restricted database table protected by PostgreSQL Row Level Security (RLS) accessible only to authorized supervising staff.
            </li>
            <li>
              <strong>Technical headers:</strong> Standard web server connection headers required for network routing and security threat defense (we do not collect invasive device fingerprints or tracking cookies).
            </li>
          </ul>
        </div>

        {/* Section 2 */}
        <div className="space-y-3 pt-4 border-t border-slate-100">
          <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-emerald-100 text-[#064E32] text-xs font-bold">2</span>
            The optional nature of contact information & why it is requested
          </h2>
          <p className="text-sm text-slate-600 leading-relaxed pl-2">
            Providing your name, student ID, or phone number is <strong>never required</strong> to submit a report. Contact information is collected strictly when you voluntarily choose peer counselor follow-up, enabling designated support personnel to reach out safely.
          </p>
        </div>

        {/* Institutional Safeguarding Box */}
        <div className="rounded-2xl bg-amber-50 border border-amber-200/80 p-5 flex items-start gap-3.5 text-xs text-amber-900">
          <AlertCircle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <p className="font-bold">Institutional Approval Notice</p>
            <p className="leading-relaxed">
              This notice outlines current platform technical safeguarding principles. The final institutional privacy policy must be formally reviewed and approved by responsible AMEU university authorities and deans prior to full production deployment.
            </p>
          </div>
        </div>

        {/* Section 3 */}
        <div className="space-y-3 pt-4 border-t border-slate-100">
          <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-emerald-100 text-[#064E32] text-xs font-bold">3</span>
            The principle of restricted access
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
              <span className="text-xs font-bold text-[#064E32] block">Authorized Peer Counselors</span>
              <p className="text-xs text-slate-600">Access report details within assigned cases to assess wellbeing and provide guidance.</p>
            </div>
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
              <span className="text-xs font-bold text-[#064E32] block">Supervising Counselors</span>
              <p className="text-xs text-slate-600">Oversee complex situations and coordinate formal university referrals.</p>
            </div>
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
              <span className="text-xs font-bold text-[#064E32] block">System Administrators</span>
              <p className="text-xs text-slate-600">Manage account access, audit logs, and security infrastructure.</p>
            </div>
          </div>
        </div>

        {/* Section 4 */}
        <div className="space-y-3 pt-4 border-t border-slate-100">
          <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-emerald-100 text-[#064E32] text-xs font-bold">4</span>
            Avoid including unnecessary personal information
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
            When describing an incident, please share only what is necessary to convey what occurred. <strong>Never submit passwords, bank credentials, or sensitive intimate photos.</strong>
          </p>
        </div>

        {/* Section 5 */}
        <div className="space-y-3 pt-4 border-t border-slate-100">
          <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-emerald-100 text-[#064E32] text-xs font-bold">5</span>
            Realistic Technical Anonymity & Receipt Codes
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
            While AMEU SafeSpace does not require personal identifiers to file a report, internet hosting infrastructure inevitably processes standard technical network traffic. We therefore avoid claiming absolute mathematical anonymity, but enforce strict zero-retention policies on client identity. Your receipt code (e.g., <code>SS-7K4M-92PX</code>) serves strictly as an administrative tracking receipt, not an authentication token.
          </p>
        </div>
      </div>
    </div>
  );
};
