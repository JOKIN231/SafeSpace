import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  User,
  Users,
  HelpCircle,
  ArrowRight,
  ArrowLeft,
  Lock,
  AlertTriangle,
  Send,
  Calendar,
  Phone,
  ShieldCheck,
  CheckSquare,
  Square,
  FileText,
  Loader2,
  Info,
  MessageCircle,
  PhoneCall,
  Sparkles,
  Shield
} from 'lucide-react';
import {
  ReportingForOption,
  ImmediateDangerOption,
  SubmitReportPayload
} from '../types/database';
import { reportingService } from '../services/reportingService';
import { ConfirmationView } from './ConfirmationView';
import { useOnlineStatus } from '../hooks/useOnlineStatus';

const INCIDENT_CATEGORIES = [
  'Hurtful or threatening messages',
  'Social media harassment',
  'Sharing private information without permission',
  'Sharing images or videos without permission',
  'Impersonation or fake accounts',
  'Repeated unwanted contact',
  'Public humiliation or targeted insults',
  'Threats or intimidation',
  'Other',
  "I'm not sure",
];

const PLATFORMS = [
  'WhatsApp',
  'Facebook',
  'TikTok',
  'Instagram',
  'Snapchat',
  'Telegram',
  'Text messages or phone calls',
  'Online gaming platform',
  'Another platform',
  "I'm not sure",
];

interface ReportPageProps {
  onHome: () => void;
  onSupport: () => void;
}

export const ReportPage: React.FC<ReportPageProps> = ({ onHome, onSupport }) => {
  const isOnline = useOnlineStatus();

  // Current step: 1 through 5
  const [step, setStep] = useState(1);

  // In-memory Form State (strictly preserved in React memory across step navigation, never stored in browser disk/cache)
  const [reportingFor, setReportingFor] = useState<ReportingForOption>('me');
  const [incidentTypes, setIncidentTypes] = useState<string[]>([]);
  const [incidentTypesOther, setIncidentTypesOther] = useState('');
  const [platform, setPlatform] = useState<string>('WhatsApp');
  const [incidentDate, setIncidentDate] = useState<string>('');
  const [unsureDate, setUnsureDate] = useState<boolean>(false);
  const [description, setDescription] = useState<string>('');
  const [immediateDanger, setImmediateDanger] = useState<ImmediateDangerOption>('no');
  const [contactRequested, setContactRequested] = useState<boolean>(false);
  const [phoneNumber, setPhoneNumber] = useState<string>('');
  const [contactMethod, setContactMethod] = useState<'whatsapp' | 'call' | 'either'>('whatsapp');
  const [consentToContact, setConsentToContact] = useState<boolean>(false);

  // Form validation, loading & receipt state
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [submissionResult, setSubmissionResult] = useState<{ referenceCode: string; isMock: boolean } | null>(null);

  // Toggle incident category selection with mutual exclusivity for "I'm not sure"
  const handleToggleCategory = (category: string) => {
    if (category === "I'm not sure") {
      setIncidentTypes(["I'm not sure"]);
      setIncidentTypesOther('');
      return;
    }

    setIncidentTypes((prev) => {
      const filtered = prev.filter((item) => item !== "I'm not sure");
      if (filtered.includes(category)) {
        const next = filtered.filter((item) => item !== category);
        if (category === 'Other') setIncidentTypesOther('');
        return next;
      } else {
        return [...filtered, category];
      }
    });
  };

  // Step-by-step validation and forward navigation
  const handleNext = () => {
    setError(null);

    // STEP 1 Validation: Who is affected
    if (step === 1) {
      if (!reportingFor) {
        setError('Please select who is affected by this incident.');
        return;
      }
    }

    // STEP 2 Validation: Category selection
    if (step === 2) {
      if (incidentTypes.length === 0) {
        setError('Please select at least one incident category or "I\'m not sure".');
        return;
      }
      if (incidentTypes.includes('Other') && !incidentTypesOther.trim()) {
        setError('Please describe what happened in the "Other" field.');
        return;
      }
    }

    // STEP 3 Validation: Platform
    if (step === 3) {
      if (!platform) {
        setError('Please choose the platform where this communication occurred.');
        return;
      }
    }

    // STEP 4 Validation: Description
    if (step === 4) {
      const trimmedDesc = description.trim();
      if (!trimmedDesc || trimmedDesc.length < 10) {
        setError('Please provide a brief description of what happened (at least 10 characters).');
        return;
      }
    }

    // STEP 5 Validation & Submission
    if (step === 5) {
      if (contactRequested) {
        if (!phoneNumber.trim()) {
          setError('Please provide a phone number if requesting counselor contact, or select "No, I prefer to remain anonymous".');
          return;
        }
        if (!consentToContact) {
          setError('Please acknowledge the contact consent checkbox before submitting your phone number.');
          return;
        }
      }
      handleSubmit();
      return;
    }

    setStep((prev) => Math.min(prev + 1, 5));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Backward navigation preserving state
  const handleBack = () => {
    setError(null);
    setStep((prev) => Math.max(prev - 1, 1));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Submission handler with debounce and loading lock
  const handleSubmit = async () => {
    if (isSubmitting) return;

    if (!isOnline) {
      setError('You appear to be offline. Online submission requires an active network connection.');
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      const fullPhone = contactRequested && phoneNumber.trim()
        ? `${phoneNumber.trim()} (${contactMethod})`
        : undefined;

      const payload: SubmitReportPayload = {
        reporting_for: reportingFor,
        incident_types: incidentTypes,
        incident_types_other: incidentTypes.includes('Other') ? incidentTypesOther.trim() : undefined,
        platform,
        incident_date: unsureDate ? null : incidentDate || null,
        description: description.trim(),
        immediate_danger: immediateDanger,
        contact_requested: contactRequested,
        phone_number: fullPhone,
        consent_to_contact: contactRequested ? consentToContact : undefined,
      };

      const result = await reportingService.submitReport(payload);
      if (result.success) {
        setSubmissionResult({
          referenceCode: result.referenceCode,
          isMock: result.isMock,
        });
      } else {
        setError('Report could not be recorded. Please try again.');
      }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'An error occurred during submission.';
      setError(`Submission failed: ${message}. Your answers have been preserved—please try again.`);
    } finally {
      setIsSubmitting(false);
    }
  };

  // If successfully submitted, display receipt screen
  if (submissionResult) {
    return (
      <ConfirmationView
        referenceCode={submissionResult.referenceCode}
        isMock={submissionResult.isMock}
        onHome={onHome}
        onSupport={onSupport}
      />
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-6 sm:py-10">
      {/* Step Header & Animated Progress Indicator */}
      <div className="mb-6 space-y-2">
        <div className="flex items-center justify-between text-xs font-bold text-emerald-800 tracking-wide uppercase">
          <span>Step {step} of 5</span>
          <span>{Math.round((step / 5) * 100)}% Complete</span>
        </div>
        <div className="h-2.5 w-full bg-slate-200 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-emerald-600 to-teal-500 transition-all duration-500 ease-out"
            style={{ width: `${(step / 5) * 100}%` }}
          />
        </div>
      </div>

      {/* Main Form Container */}
      <div className="rounded-3xl bg-white border border-slate-200/90 shadow-xl p-6 sm:p-8 space-y-6">
        {/* Error notification banner */}
        {error && (
          <div className="rounded-xl bg-rose-50 border border-rose-200 p-3.5 text-xs sm:text-sm text-rose-800 flex items-start gap-2.5 animate-in fade-in-50">
            <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        <AnimatePresence mode="wait">
          {/* STEP 1: WHO IS THE REPORT ABOUT? */}
          {step === 1 && (
            <motion.div
              key="step-1"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.35, ease: 'easeOut' }}
              className="space-y-6"
            >
              <div>
                <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
                  Who is affected by this incident?
                </h1>
                <p className="text-sm text-slate-600 mt-1">
                  Select who is experiencing the cyberbullying. You can report for yourself or on behalf of someone else.
                </p>
              </div>

              <div className="space-y-3">
                {/* Option 1: Me */}
                <button
                  type="button"
                  onClick={() => setReportingFor('me')}
                  className={`w-full flex items-center justify-between p-4 rounded-2xl border-2 text-left transition-all cursor-pointer ${
                    reportingFor === 'me'
                      ? 'border-emerald-600 bg-emerald-50/70 shadow-xs'
                      : 'border-slate-200 hover:border-slate-300 bg-white'
                  }`}
                >
                  <div className="flex items-center gap-3.5">
                    <div
                      className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${
                        reportingFor === 'me' ? 'bg-emerald-600 text-white shadow-sm' : 'bg-slate-100 text-slate-600'
                      }`}
                    >
                      <User className="w-5 h-5" />
                    </div>
                    <div>
                      <h2 className="text-base font-bold text-slate-900">Me</h2>
                      <p className="text-xs text-slate-500">I have experienced this myself.</p>
                    </div>
                  </div>
                  <ArrowRight
                    className={`w-4 h-4 ${reportingFor === 'me' ? 'text-emerald-700' : 'text-slate-400'}`}
                  />
                </button>

                {/* Option 2: A friend or another student */}
                <button
                  type="button"
                  onClick={() => setReportingFor('friend')}
                  className={`w-full flex items-center justify-between p-4 rounded-2xl border-2 text-left transition-all cursor-pointer ${
                    reportingFor === 'friend'
                      ? 'border-emerald-600 bg-emerald-50/70 shadow-xs'
                      : 'border-slate-200 hover:border-slate-300 bg-white'
                  }`}
                >
                  <div className="flex items-center gap-3.5">
                    <div
                      className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${
                        reportingFor === 'friend' ? 'bg-emerald-600 text-white shadow-sm' : 'bg-slate-100 text-slate-600'
                      }`}
                    >
                      <Users className="w-5 h-5" />
                    </div>
                    <div>
                      <h2 className="text-base font-bold text-slate-900">A friend or another student</h2>
                      <p className="text-xs text-slate-500">I want to report on behalf of someone else.</p>
                    </div>
                  </div>
                  <ArrowRight
                    className={`w-4 h-4 ${reportingFor === 'friend' ? 'text-emerald-700' : 'text-slate-400'}`}
                  />
                </button>

                {/* Option 3: I'm not sure */}
                <button
                  type="button"
                  onClick={() => setReportingFor('not_sure')}
                  className={`w-full flex items-center justify-between p-4 rounded-2xl border-2 text-left transition-all cursor-pointer ${
                    reportingFor === 'not_sure'
                      ? 'border-emerald-600 bg-emerald-50/70 shadow-xs'
                      : 'border-slate-200 hover:border-slate-300 bg-white'
                  }`}
                >
                  <div className="flex items-center gap-3.5">
                    <div
                      className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${
                        reportingFor === 'not_sure' ? 'bg-emerald-600 text-white shadow-sm' : 'bg-slate-100 text-slate-600'
                      }`}
                    >
                      <HelpCircle className="w-5 h-5" />
                    </div>
                    <div>
                      <h2 className="text-base font-bold text-slate-900">I'm not sure</h2>
                      <p className="text-xs text-slate-500">I'm not sure who this affects or if it counts.</p>
                    </div>
                  </div>
                  <ArrowRight
                    className={`w-4 h-4 ${reportingFor === 'not_sure' ? 'text-emerald-700' : 'text-slate-400'}`}
                  />
                </button>
              </div>
            </motion.div>
          )}

          {/* STEP 2: INCIDENT CATEGORY */}
          {step === 2 && (
            <motion.div
              key="step-2"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.35, ease: 'easeOut' }}
              className="space-y-6"
            >
              <div>
                <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
                  What would you like to report?
                </h1>
                <p className="text-sm text-slate-600 mt-1">
                  Select all that apply. These categories describe an experience and are not definitive legal classifications.
                </p>
              </div>

              <div className="space-y-2.5">
                {INCIDENT_CATEGORIES.map((category) => {
                  const isSelected = incidentTypes.includes(category);
                  return (
                    <div key={category} className="space-y-2">
                      <button
                        type="button"
                        onClick={() => handleToggleCategory(category)}
                        className={`w-full flex items-center gap-3 p-3.5 rounded-xl border text-left transition-all cursor-pointer ${
                          isSelected
                            ? 'border-emerald-600 bg-emerald-50/80 font-semibold text-emerald-950 shadow-xs'
                            : 'border-slate-200 hover:border-slate-300 bg-white text-slate-700'
                        }`}
                      >
                        {isSelected ? (
                          <CheckSquare className="w-5 h-5 text-emerald-600 shrink-0" />
                        ) : (
                          <Square className="w-5 h-5 text-slate-400 shrink-0" />
                        )}
                        <span className="text-sm leading-snug">{category}</span>
                      </button>

                      {category === 'Other' && isSelected && (
                        <div className="pl-8 pt-1">
                          <input
                            type="text"
                            value={incidentTypesOther}
                            onChange={(e) => setIncidentTypesOther(e.target.value)}
                            placeholder="Please describe if 'Other'..."
                            className="w-full rounded-xl border border-emerald-300 bg-white px-3.5 py-2 text-sm text-slate-900 focus:border-emerald-600 focus:outline-hidden"
                          />
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </motion.div>
          )}

          {/* STEP 3: PLATFORM AND DATE */}
          {step === 3 && (
            <motion.div
              key="step-3"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.35, ease: 'easeOut' }}
              className="space-y-6"
            >
              <div>
                <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
                  Platform and Date
                </h1>
                <p className="text-sm text-slate-600 mt-1">
                  Where did this incident happen, and approximately when?
                </p>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
                    Platform or Online Space
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {PLATFORMS.map((p) => (
                      <button
                        key={p}
                        type="button"
                        onClick={() => setPlatform(p)}
                        className={`p-3 rounded-xl border text-left text-sm font-medium transition-all cursor-pointer ${
                          platform === p
                            ? 'border-emerald-600 bg-emerald-50 text-emerald-900 font-bold shadow-xs'
                            : 'border-slate-200 hover:border-slate-300 text-slate-700'
                        }`}
                      >
                        {p}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Optional Incident Date */}
                <div className="pt-4 border-t border-slate-100 space-y-3">
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
                    Approximate Date (Optional)
                  </label>
                  <div className="flex items-center gap-3">
                    <div className="relative flex-1">
                      <Calendar className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                      <input
                        type="date"
                        disabled={unsureDate}
                        value={incidentDate}
                        onChange={(e) => setIncidentDate(e.target.value)}
                        className="w-full rounded-xl border border-slate-200 pl-10 pr-3 py-2 text-sm text-slate-900 disabled:bg-slate-100 disabled:text-slate-400 focus:border-emerald-600 focus:outline-hidden"
                      />
                    </div>
                  </div>

                  <label className="flex items-center gap-2 cursor-pointer text-xs text-slate-600">
                    <input
                      type="checkbox"
                      checked={unsureDate}
                      onChange={(e) => {
                        setUnsureDate(e.target.checked);
                        if (e.target.checked) setIncidentDate('');
                      }}
                      className="rounded text-emerald-600 focus:ring-emerald-500"
                    />
                    <span>I'm not sure about the exact date</span>
                  </label>
                </div>
              </div>
            </motion.div>
          )}

          {/* STEP 4: DESCRIPTION */}
          {step === 4 && (
            <motion.div
              key="step-4"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.35, ease: 'easeOut' }}
              className="space-y-6"
            >
              <div>
                <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
                  Would you like to tell us more?
                </h1>
                <p className="text-sm text-slate-600 mt-1 leading-relaxed">
                  Share only what you feel comfortable sharing. Avoid including passwords or unnecessary personal information.
                </p>
              </div>

              <div className="space-y-3">
                <div className="relative">
                  <textarea
                    rows={6}
                    maxLength={3000}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Describe what happened, how it affected you or the person involved, and anything else you think the support team should know."
                    className="w-full rounded-2xl border border-slate-200 p-4 text-sm text-slate-900 focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600 focus:outline-hidden"
                  />
                  <div className="flex items-center justify-between text-[11px] text-slate-400 mt-1">
                    <span>Minimum 10 characters</span>
                    <span>{description.length} / 3,000 characters</span>
                  </div>
                </div>

                {/* Safeguarding Reassurance on No Proof Needed & File Uploads */}
                <div className="rounded-2xl bg-slate-50 border border-slate-200 p-4 space-y-2">
                  <div className="flex items-center gap-2 text-xs font-bold text-slate-800">
                    <FileText className="w-4 h-4 text-emerald-600" />
                    <span>No Proof or File Uploads Required</span>
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    You are not required to prove that an incident occurred before submitting this report. In order to safeguard student media and confidentiality, image and file uploads are disabled on this form. Please keep screenshots saved securely on your personal device.
                  </p>
                </div>
              </div>
            </motion.div>
          )}

          {/* STEP 5: SAFETY AND SUPPORT */}
          {step === 5 && (
            <motion.div
              key="step-5"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.35, ease: 'easeOut' }}
              className="space-y-6"
            >
              <div>
                <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
                  Safety and Support
                </h1>
                <p className="text-sm text-slate-600 mt-1">
                  Help us assess immediate safety and whether you would like voluntary peer counselor contact.
                </p>
              </div>

              {/* Immediate Danger Check */}
              <div className="space-y-3">
                <label className="block text-sm font-bold text-slate-900">
                  Is anyone in immediate danger?
                </label>
                <div className="grid grid-cols-3 gap-3">
                  {(['no', 'yes', 'not_sure'] as ImmediateDangerOption[]).map((option) => (
                    <button
                      key={option}
                      type="button"
                      onClick={() => setImmediateDanger(option)}
                      className={`py-2.5 px-3 rounded-xl border text-center text-xs font-bold transition-all cursor-pointer ${
                        immediateDanger === option
                          ? option === 'yes'
                            ? 'border-rose-600 bg-rose-50 text-rose-800 shadow-xs'
                            : 'border-emerald-600 bg-emerald-50 text-emerald-900 shadow-xs'
                          : 'border-slate-200 text-slate-700 hover:border-slate-300'
                      }`}
                    >
                      {option === 'yes' ? 'Yes' : option === 'no' ? 'No' : "I'm not sure"}
                    </button>
                  ))}
                </div>

                {/* Emergency Guidance Banner when danger is flagged */}
                {immediateDanger === 'yes' && (
                  <div className="rounded-2xl bg-rose-50 border border-rose-300 p-4 space-y-2 animate-in fade-in-50">
                    <div className="flex items-center gap-2 text-xs font-bold text-rose-900">
                      <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
                      <span>Immediate Safety Advisory</span>
                    </div>
                    <p className="text-xs text-rose-800 leading-relaxed">
                      This reporting form is <strong>not</strong> an emergency response service and does not guarantee an immediate response. If someone is facing immediate physical danger, violence, or harm, please seek direct assistance from a trusted person, campus security, university authority, or verified emergency channel immediately.
                    </p>
                  </div>
                )}
              </div>

              {/* Peer Counselor Contact Request */}
              <div className="pt-4 border-t border-slate-100 space-y-4">
                <label className="block text-sm font-bold text-slate-900">
                  Would you like an authorized peer counselor to contact you?
                </label>

                <div className="space-y-2">
                  <button
                    type="button"
                    onClick={() => {
                      setContactRequested(false);
                      setPhoneNumber('');
                      setConsentToContact(false);
                    }}
                    className={`w-full flex items-center justify-between p-3.5 rounded-xl border text-left text-xs sm:text-sm font-medium transition-all cursor-pointer ${
                      !contactRequested
                        ? 'border-emerald-600 bg-emerald-50 text-emerald-900 font-bold shadow-xs'
                        : 'border-slate-200 text-slate-700'
                    }`}
                  >
                    <span>No, I prefer to remain anonymous.</span>
                    {!contactRequested && <CheckSquare className="w-4 h-4 text-emerald-600" />}
                  </button>

                  <button
                    type="button"
                    onClick={() => setContactRequested(true)}
                    className={`w-full flex items-center justify-between p-3.5 rounded-xl border text-left text-xs sm:text-sm font-medium transition-all cursor-pointer ${
                      contactRequested
                        ? 'border-emerald-600 bg-emerald-50 text-emerald-900 font-bold shadow-xs'
                        : 'border-slate-200 text-slate-700'
                    }`}
                  >
                    <span>Yes, I would like someone to contact me.</span>
                    {contactRequested && <CheckSquare className="w-4 h-4 text-emerald-600" />}
                  </button>
                </div>

                {/* Dynamic Counselor Contact Box with Liberian Phone Format & Method Selection */}
                {contactRequested && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3 }}
                    className="rounded-3xl bg-slate-50 border border-slate-200 p-5 space-y-4 shadow-inner"
                  >
                    {/* Safeguarding Explanation */}
                    <div className="rounded-2xl bg-emerald-50 border border-emerald-200/80 p-3.5 text-xs text-emerald-900 flex items-start gap-3">
                      <div className="h-8 w-8 rounded-lg bg-emerald-200/80 text-emerald-800 flex items-center justify-center shrink-0">
                        <Shield className="w-4 h-4" />
                      </div>
                      <div className="space-y-1">
                        <p className="font-bold">Confidential Counselor Check-In</p>
                        <p className="leading-relaxed text-[11px] text-emerald-800/90">
                          Your phone number is stored in an isolated, encrypted table. Only designated AMEU peer counselors assigned to this case can access it to coordinate a safe, non-judgmental check-in.
                        </p>
                      </div>
                    </div>

                    {/* Preferred Method Toggle */}
                    <div className="space-y-1.5">
                      <span className="text-xs font-bold text-slate-700">Preferred Contact Method</span>
                      <div className="grid grid-cols-3 gap-2">
                        <button
                          type="button"
                          onClick={() => setContactMethod('whatsapp')}
                          className={`p-2 rounded-xl border text-xs font-semibold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                            contactMethod === 'whatsapp'
                              ? 'bg-emerald-700 text-white border-emerald-700 shadow-xs'
                              : 'bg-white text-slate-700 border-slate-200'
                          }`}
                        >
                          <MessageCircle className="w-3.5 h-3.5" />
                          <span>WhatsApp</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => setContactMethod('call')}
                          className={`p-2 rounded-xl border text-xs font-semibold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                            contactMethod === 'call'
                              ? 'bg-emerald-700 text-white border-emerald-700 shadow-xs'
                              : 'bg-white text-slate-700 border-slate-200'
                          }`}
                        >
                          <PhoneCall className="w-3.5 h-3.5" />
                          <span>Voice Call</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => setContactMethod('either')}
                          className={`p-2 rounded-xl border text-xs font-semibold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                            contactMethod === 'either'
                              ? 'bg-emerald-700 text-white border-emerald-700 shadow-xs'
                              : 'bg-white text-slate-700 border-slate-200'
                          }`}
                        >
                          <Sparkles className="w-3.5 h-3.5" />
                          <span>Either</span>
                        </button>
                      </div>
                    </div>

                    {/* Phone Number Field with Liberian Badge */}
                    <div className="space-y-1">
                      <div className="flex items-center justify-between">
                        <label className="text-xs font-bold text-slate-800">
                          Your Phone Number
                        </label>
                        <span className="text-[10px] text-slate-400">Orange (077) or Lonestar MTN (088)</span>
                      </div>
                      <div className="relative flex items-center">
                        <div className="absolute left-3 flex items-center gap-1 text-xs font-bold text-slate-500 pr-2 border-r border-slate-200">
                          <span>🇱🇷 +231</span>
                        </div>
                        <input
                          type="tel"
                          value={phoneNumber}
                          onChange={(e) => setPhoneNumber(e.target.value)}
                          placeholder="77 123 4567"
                          className="w-full rounded-xl border border-slate-300 bg-white pl-20 pr-3 py-2.5 text-sm font-mono text-slate-900 focus:border-emerald-600 focus:outline-hidden"
                        />
                      </div>
                    </div>

                    {/* Explicit unchecked by default consent checkbox */}
                    <label className="flex items-start gap-2.5 cursor-pointer pt-1 bg-white p-3 rounded-xl border border-slate-200">
                      <input
                        type="checkbox"
                        checked={consentToContact}
                        onChange={(e) => setConsentToContact(e.target.checked)}
                        className="mt-0.5 rounded text-emerald-600 focus:ring-emerald-500 shrink-0 cursor-pointer"
                      />
                      <span className="text-xs text-slate-700 leading-normal">
                        I understand that providing my phone number allows authorized personnel to contact me about this report.
                      </span>
                    </label>
                  </motion.div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Action Controls: Back and Continue Buttons */}
        <div className="pt-4 border-t border-slate-100 flex items-center justify-between gap-3">
          {step > 1 ? (
            <button
              type="button"
              onClick={handleBack}
              disabled={isSubmitting}
              className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl border border-slate-300 bg-white hover:bg-slate-50 text-slate-700 font-semibold text-xs sm:text-sm transition-all cursor-pointer disabled:opacity-50"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back</span>
            </button>
          ) : (
            <button
              type="button"
              onClick={onHome}
              className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-slate-500 hover:text-slate-800 text-xs sm:text-sm font-medium transition-all cursor-pointer"
            >
              Cancel
            </button>
          )}

          <button
            type="button"
            onClick={handleNext}
            disabled={isSubmitting}
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 active:scale-95 text-white font-bold text-xs sm:text-sm shadow-md shadow-emerald-700/20 transition-all ml-auto disabled:opacity-50 cursor-pointer"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Submitting report...</span>
              </>
            ) : step === 5 ? (
              <>
                <span>SUBMIT REPORT</span>
                <Send className="w-4 h-4" />
              </>
            ) : (
              <>
                <span>Continue</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </div>

        {/* Confidentiality & Non-Identification Reassurance Banner */}
        <div className="rounded-xl bg-emerald-50/70 border border-emerald-200/60 p-3.5 flex items-center gap-3 text-xs text-emerald-900">
          <Lock className="w-4 h-4 text-emerald-700 shrink-0" />
          <span>
            This is a confidential form. You do not need to provide your name, student ID, or phone number unless you choose to.
          </span>
        </div>
      </div>
    </div>
  );
};
