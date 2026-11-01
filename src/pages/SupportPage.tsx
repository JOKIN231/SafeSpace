import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  ShieldAlert,
  ArrowRight,
  ShieldCheck,
  Camera,
  AlertOctagon,
  Heart,
  MessageCircle,
  HelpCircle,
  CheckCircle2,
  ExternalLink,
  PhoneCall,
  Phone,
  Copy,
  Check,
  Clock,
  MapPin,
  X,
  Siren,
  Building2,
  LifeBuoy
} from 'lucide-react';
import ameuSupportHeaderImg from '../assets/images/ameu_support_header_1791965500503.jpg';

interface SupportPageProps {
  onNavigate: (tab: string) => void;
}

interface EmergencyContact {
  id: string;
  name: string;
  agency: string;
  number: string;
  displayNumber: string;
  hours: string;
  location: string;
  category: 'campus' | 'police' | 'helpline' | 'medical';
  description: string;
  badge: string;
  isPrimary?: boolean;
}

const EMERGENCY_CONTACTS: EmergencyContact[] = [
  {
    id: 'campus-security',
    name: 'AMEU Campus Security Dispatch',
    agency: 'African Methodist Episcopal University',
    number: '+231770002638',
    displayNumber: '+231 77 000 2638',
    hours: '24/7 Immediate Campus Response',
    location: 'Main Gate & Campus Patrol, Camp Johnson Road',
    category: 'campus',
    description: 'Direct dispatch for immediate on-campus threats, physical safety concerns, or security escorts around Camp Johnson Road.',
    badge: 'On-Campus 24/7',
    isPrimary: true,
  },
  {
    id: 'lnp-police',
    name: 'Liberia National Police (LNP) Dispatch',
    agency: 'Liberia National Police Command',
    number: '911',
    displayNumber: '911 / +231 77 080 0911',
    hours: '24/7 Emergency Dispatch',
    location: 'Monrovia Central Command & Capitol Hill Zone',
    category: 'police',
    description: 'National emergency services for violent threats, severe stalking, physical extortion, or urgent criminal intervention.',
    badge: 'Emergency 911',
    isPrimary: true,
  },
  {
    id: 'gbv-cyber-helpline',
    name: 'National GBV & Cyber Harassment Helpline',
    agency: 'Ministry of Justice & Ministry of Gender',
    number: '2883',
    displayNumber: '2883 (Toll-Free) / +231 77 600 2883',
    hours: '24/7 Confidential Helpline',
    location: 'Monrovia, Republic of Liberia',
    category: 'helpline',
    description: 'Free confidential hotline providing counseling, guidance, and legal support for digital harassment and online exploitation.',
    badge: 'Toll-Free 2883',
    isPrimary: true,
  },
  {
    id: 'dean-students',
    name: 'AMEU Office of the Dean of Students',
    agency: 'Division of Student Affairs & Safeguarding',
    number: '+231775551212',
    displayNumber: '+231 77 555 1212',
    hours: 'Mon – Fri, 8:00 AM – 5:00 PM',
    location: 'Administration Building, Camp Johnson Road Campus',
    category: 'campus',
    description: 'Official student affairs escalation, disciplinary referrals, academic accommodations, and student protection inquiries.',
    badge: 'Campus Admin',
  },
  {
    id: 'fire-medical',
    name: 'National Fire & Medical Emergency',
    agency: 'Liberia National Fire & Ambulance Service',
    number: '112',
    displayNumber: '112 / +231 77 080 0112',
    hours: '24/7 Emergency Services',
    location: 'Montserrado County Emergency Dispatch',
    category: 'medical',
    description: 'Urgent medical ambulance assistance, campus fire rescue, and trauma stabilization dispatch.',
    badge: 'Emergency 112',
  },
  {
    id: 'mental-health-crisis',
    name: 'National Mental Health & Crisis Line',
    agency: 'Liberia Psychosocial Counseling Network',
    number: '+231886518932',
    displayNumber: '+231 88 651 8932',
    hours: 'Daily, 8:00 AM – 10:00 PM',
    location: 'Montserrado Psychosocial Support Center',
    category: 'helpline',
    description: 'Confidential crisis intervention for students experiencing acute emotional overwhelm, panic, or psychological distress.',
    badge: 'Mental Health',
  },
];

export const SupportPage: React.FC<SupportPageProps> = ({ onNavigate }) => {
  const [activeTab, setActiveTab] = useState<'emergency' | 'cyberbullying' | 'what_to_do' | 'support_friend' | 'evidence' | 'when_to_seek'>('emergency');
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [filterCategory, setFilterCategory] = useState<'all' | 'campus' | 'police' | 'helpline' | 'medical'>('all');

  const tabs = [
    { id: 'emergency', label: '🚨 Emergency Contacts', highlight: true },
    { id: 'cyberbullying', label: 'What Is Cyberbullying?' },
    { id: 'what_to_do', label: 'What Can I Do If It Happens to Me?' },
    { id: 'support_friend', label: 'How Can I Support a Friend?' },
    { id: 'evidence', label: 'How Can I Preserve Evidence?' },
    { id: 'when_to_seek', label: 'When Should I Seek Urgent Help?' },
  ];

  const handleCopyNumber = (id: string, number: string) => {
    navigator.clipboard.writeText(number);
    setCopiedId(id);
    setTimeout(() => {
      setCopiedId(null);
    }, 2000);
  };

  const filteredContacts = filterCategory === 'all'
    ? EMERGENCY_CONTACTS
    : EMERGENCY_CONTACTS.filter((c) => c.category === filterCategory);

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8">
      {/* Header Banner with Supportive Student Photography */}
      <div className="rounded-3xl bg-slate-900 text-white shadow-2xl relative overflow-hidden">
        <div className="relative h-64 sm:h-72 w-full overflow-hidden">
          <img
            src={ameuSupportHeaderImg}
            alt="West African university students engaged in caring, confidential peer support in counseling lounge"
            className="w-full h-full object-cover filter brightness-90"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-emerald-950 via-emerald-950/70 to-emerald-950/20"></div>

          <div className="absolute bottom-6 left-6 right-6 max-w-2xl space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/30 backdrop-blur-md text-emerald-300 text-xs font-semibold">
              <Heart className="w-3.5 h-3.5" />
              <span>Student Wellbeing &amp; Safety Hub</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-white">
              Get Support. You Are Not Alone.
            </h1>
            <p className="text-sm sm:text-base text-emerald-100/90 leading-relaxed">
              Immediate emergency contacts, practical guidance, safe evidence preservation, and peer support options for AMEU students.
            </p>
          </div>
        </div>
      </div>

      {/* Urgent Emergency Quick-Dial Banner & Drawer Trigger */}
      <div className="rounded-3xl bg-gradient-to-r from-rose-900 via-rose-800 to-rose-900 text-white p-5 sm:p-6 shadow-xl border border-rose-700/50 relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-5">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-2xl bg-white text-rose-800 flex items-center justify-center shrink-0 shadow-lg ring-4 ring-rose-500/30 animate-pulse">
              <PhoneCall className="w-6 h-6 text-rose-700" />
            </div>
            <div className="space-y-1">
              <div className="flex flex-wrap items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full bg-rose-400/20 text-rose-100 text-[10px] font-black tracking-wider uppercase ring-1 ring-rose-400/30">
                  Immediate Emergency Hotlines
                </span>
                <span className="text-xs text-rose-200 font-semibold">• 24/7 Campus &amp; Police Dispatch</span>
              </div>
              <h2 className="text-lg sm:text-xl font-black tracking-tight text-white">
                In Immediate Danger or Facing Violence?
              </h2>
              <p className="text-xs sm:text-sm text-rose-100/90 max-w-xl leading-relaxed">
                Connect directly with AMEU Campus Security on Camp Johnson Road or Liberia emergency services.
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2.5 shrink-0">
            <a
              href="tel:+231770002638"
              className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 px-5 py-3 rounded-2xl bg-white text-rose-900 hover:bg-rose-50 font-bold text-xs sm:text-sm shadow-md active:scale-95 transition-all"
            >
              <PhoneCall className="w-4 h-4 text-rose-700" />
              <span>Call Campus Security</span>
            </a>

            <button
              onClick={() => setIsDrawerOpen(true)}
              className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 px-4 py-3 rounded-2xl bg-rose-700/80 hover:bg-rose-700 text-white border border-rose-400/30 font-bold text-xs sm:text-sm transition-all cursor-pointer"
            >
              <Siren className="w-4 h-4 text-rose-300" />
              <span>Open Emergency Drawer</span>
            </button>
          </div>
        </div>
      </div>

      {/* Nav Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-slate-200">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as typeof activeTab)}
            className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all cursor-pointer ${
              activeTab === tab.id
                ? tab.highlight
                  ? 'bg-rose-700 text-white shadow-xs'
                  : 'bg-emerald-700 text-white shadow-xs'
                : tab.highlight
                ? 'bg-rose-50 text-rose-700 hover:bg-rose-100/80 border border-rose-200/80'
                : 'text-slate-600 hover:text-emerald-800 hover:bg-slate-100'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content Panes */}
      <div className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-200/90 shadow-sm space-y-8">
        {/* TAB 0: Emergency Contacts Section */}
        {activeTab === 'emergency' && (
          <div className="space-y-6 animate-in fade-in-50 duration-200">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-100">
              <div className="flex items-start gap-4">
                <div className="h-12 w-12 rounded-2xl bg-rose-100 text-rose-800 flex items-center justify-center shrink-0">
                  <Siren className="w-6 h-6" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-slate-900">Campus &amp; Local Emergency Contacts</h2>
                  <p className="text-sm text-slate-600 mt-1 leading-relaxed">
                    Direct quick-dial links for immediate assistance, personal safety escorts, and confidential crisis support.
                  </p>
                </div>
              </div>

              <button
                onClick={() => setIsDrawerOpen(true)}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-rose-50 hover:text-rose-700 text-slate-700 text-xs font-bold transition-colors cursor-pointer shrink-0"
              >
                <PhoneCall className="w-3.5 h-3.5 text-rose-600" />
                <span>View Slide-Out Drawer</span>
              </button>
            </div>

            {/* Quick-Filter Pills */}
            <div className="flex flex-wrap items-center gap-2 pt-1">
              <span className="text-xs font-bold text-slate-500 mr-1">Filter:</span>
              {(['all', 'campus', 'police', 'helpline', 'medical'] as const).map((cat) => (
                <button
                  key={cat}
                  onClick={() => setFilterCategory(cat)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold capitalize transition-all cursor-pointer ${
                    filterCategory === cat
                      ? 'bg-rose-700 text-white shadow-xs'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {cat === 'all' ? 'All Contacts (6)' : cat}
                </button>
              ))}
            </div>

            {/* Emergency Contacts Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
              {filteredContacts.map((contact) => (
                <div
                  key={contact.id}
                  className={`rounded-2xl p-5 border transition-all space-y-3 flex flex-col justify-between ${
                    contact.isPrimary
                      ? 'bg-rose-50/50 border-rose-200 hover:border-rose-300'
                      : 'bg-slate-50 border-slate-200/80 hover:border-slate-300'
                  }`}
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between gap-2">
                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider ${
                        contact.isPrimary
                          ? 'bg-rose-100 text-rose-800 border border-rose-200'
                          : 'bg-slate-200/70 text-slate-700'
                      }`}>
                        {contact.badge}
                      </span>
                      <div className="flex items-center gap-1 text-[11px] text-slate-500">
                        <Clock className="w-3 h-3 text-slate-400" />
                        <span>{contact.hours}</span>
                      </div>
                    </div>

                    <div>
                      <h3 className="text-base font-extrabold text-slate-900 leading-snug">
                        {contact.name}
                      </h3>
                      <p className="text-xs text-slate-500 font-medium">
                        {contact.agency}
                      </p>
                    </div>

                    <p className="text-xs text-slate-600 leading-relaxed">
                      {contact.description}
                    </p>

                    <div className="flex items-center gap-1.5 text-[11px] text-slate-500 pt-1">
                      <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span className="truncate">{contact.location}</span>
                    </div>
                  </div>

                  {/* Actions: Call Now & Copy */}
                  <div className="pt-3 border-t border-slate-200/60 flex items-center gap-2">
                    <a
                      href={`tel:${contact.number}`}
                      className="flex-1 inline-flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl bg-rose-700 hover:bg-rose-800 text-white font-bold text-xs shadow-xs active:scale-95 transition-all"
                    >
                      <PhoneCall className="w-3.5 h-3.5" />
                      <span>Call {contact.displayNumber}</span>
                    </a>

                    <button
                      onClick={() => handleCopyNumber(contact.id, contact.number)}
                      className="p-2.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-100 text-slate-700 transition-colors cursor-pointer"
                      title="Copy phone number"
                      aria-label="Copy phone number"
                    >
                      {copiedId === contact.id ? (
                        <Check className="w-4 h-4 text-emerald-600" />
                      ) : (
                        <Copy className="w-4 h-4 text-slate-500" />
                      )}
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Critical Emergency Advice Box */}
            <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200/80 text-xs text-amber-950 flex items-start gap-3">
              <AlertOctagon className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
              <div className="space-y-1">
                <span className="font-bold">What to say when calling for emergency help:</span>
                <p className="leading-relaxed text-amber-900">
                  State your exact location (e.g. &ldquo;Camp Johnson Road Campus, near Main Gate / Academic Hall&rdquo;), your name, the immediate threat, and if you require security escort or medical assistance.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* TAB 1: Cyberbullying */}
        {activeTab === 'cyberbullying' && (
          <div className="space-y-6 animate-in fade-in-50 duration-200">
            <div className="flex items-start gap-4">
              <div className="h-12 w-12 rounded-2xl bg-emerald-100 text-emerald-800 flex items-center justify-center shrink-0">
                <HelpCircle className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-slate-900">What is cyberbullying?</h2>
                <p className="text-sm text-slate-600 mt-1 leading-relaxed">
                  Cyberbullying involves using digital platforms—such as WhatsApp group chats, Facebook, Instagram, TikTok, or SMS—to harass, intimidate, threaten, humiliate, or isolate another person repeatedly.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                <h3 className="text-sm font-bold text-slate-900">Common Signs &amp; Manifestations</h3>
                <ul className="text-xs text-slate-600 space-y-2 list-disc list-inside leading-relaxed">
                  <li>Direct threatening, abusive, or humiliating messages.</li>
                  <li>Doxxing: circulating private contact numbers, grades, or personal details without consent.</li>
                  <li>Impersonating someone through spoofed social accounts to slander their reputation.</li>
                  <li>Targeted exclusion from academic class groups or student societies.</li>
                </ul>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                <h3 className="text-sm font-bold text-slate-900">How It Affects Wellbeing</h3>
                <ul className="text-xs text-slate-600 space-y-2 list-disc list-inside leading-relaxed">
                  <li>Feelings of anxiety, dread, shame, or loneliness.</li>
                  <li>Difficulty concentrating on campus studies, tests, and lectures.</li>
                  <li>Withdrawing from social circles and campus activities.</li>
                  <li>Remember: It is never your fault, and you do not have to carry it alone.</li>
                </ul>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: What to Do */}
        {activeTab === 'what_to_do' && (
          <div className="space-y-6 animate-in fade-in-50 duration-200">
            <div className="flex items-start gap-4">
              <div className="h-12 w-12 rounded-2xl bg-emerald-100 text-emerald-800 flex items-center justify-center shrink-0">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-slate-900">What can I do if it happens to me?</h2>
                <p className="text-sm text-slate-600 mt-1 leading-relaxed">
                  Taking practical, calm steps can protect your safety and regain control of your digital space.
                </p>
              </div>
            </div>

            <div className="space-y-3 pt-2">
              <div className="flex items-start gap-3 p-4 rounded-2xl bg-slate-50 border border-slate-200">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                <div>
                  <h3 className="text-sm font-bold text-slate-900">1. Do not retaliate or engage in flame wars</h3>
                  <p className="text-xs text-slate-600 mt-0.5 leading-relaxed">
                    Harassers often look for emotional reactions. Refrain from sending angry responses that could be misconstrued or escalate the situation.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-4 rounded-2xl bg-slate-50 border border-slate-200">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                <div>
                  <h3 className="text-sm font-bold text-slate-900">2. Save and document evidence safely</h3>
                  <p className="text-xs text-slate-600 mt-0.5 leading-relaxed">
                    Take full screenshots showing timestamps, usernames, and group names before blocking or reporting on social platforms.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-4 rounded-2xl bg-slate-50 border border-slate-200">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                <div>
                  <h3 className="text-sm font-bold text-slate-900">3. Utilize platform safety tools</h3>
                  <p className="text-xs text-slate-600 mt-0.5 leading-relaxed">
                    Block abusive phone numbers on WhatsApp, report harmful accounts on TikTok/Instagram, and adjust your profile privacy settings to &apos;Friends only&apos;.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-4 rounded-2xl bg-slate-50 border border-slate-200">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                <div>
                  <h3 className="text-sm font-bold text-slate-900">4. Reach out through AMEU SafeSpace</h3>
                  <p className="text-xs text-slate-600 mt-0.5 leading-relaxed">
                    Submit an anonymous or supported report to receive confidential peer counseling from trained AMEU students.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: Support a Friend */}
        {activeTab === 'support_friend' && (
          <div className="space-y-6 animate-in fade-in-50 duration-200">
            <div className="flex items-start gap-4">
              <div className="h-12 w-12 rounded-2xl bg-emerald-100 text-emerald-800 flex items-center justify-center shrink-0">
                <Heart className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-slate-900">How can I support a friend?</h2>
                <p className="text-sm text-slate-600 mt-1 leading-relaxed">
                  Being a supportive ally can make a massive difference in helping a friend feel grounded and safe.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                <h3 className="text-sm font-bold text-slate-900">What to Do</h3>
                <ul className="text-xs text-slate-600 space-y-2 list-disc list-inside leading-relaxed">
                  <li>Listen without judgment or interrupting.</li>
                  <li>Believe their experience and validate how frightening it feels.</li>
                  <li>Encourage them to document records calmly without forcing action.</li>
                  <li>Offer to walk with them to see an AMEU peer counselor or security officer.</li>
                </ul>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                <h3 className="text-sm font-bold text-slate-900">What to Avoid</h3>
                <ul className="text-xs text-slate-600 space-y-2 list-disc list-inside leading-relaxed">
                  <li>Avoid saying &ldquo;just ignore it&rdquo; or &ldquo;it&apos;s only online&rdquo;—the psychological impact is very real.</li>
                  <li>Do not confront the harasser with threats, which can escalate danger for your friend.</li>
                  <li>Do not re-share screenshots in public groups without their explicit permission.</li>
                </ul>
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: Evidence Preservation */}
        {activeTab === 'evidence' && (
          <div className="space-y-6 animate-in fade-in-50 duration-200">
            <div className="flex items-start gap-4">
              <div className="h-12 w-12 rounded-2xl bg-emerald-100 text-emerald-800 flex items-center justify-center shrink-0">
                <Camera className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-slate-900">Preserving evidence safely</h2>
                <p className="text-sm text-slate-600 mt-1 leading-relaxed">
                  Clear, unaltered digital records are invaluable if university disciplinary boards or legal channels need to intervene.
                </p>
              </div>
            </div>

            <div className="space-y-3 pt-2">
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2 text-xs text-slate-700 leading-relaxed">
                <h3 className="text-sm font-bold text-slate-900">Key Evidence Best Practices:</h3>
                <ol className="list-decimal list-inside space-y-1.5 pt-1">
                  <li><strong>Capture Full Screen:</strong> Include the sender&apos;s phone number or username handle, time of message, and battery bar to establish authenticity.</li>
                  <li><strong>Preserve Web URLs:</strong> On browsers, copy the exact link to the post or profile before it can be deleted or edited.</li>
                  <li><strong>Do Not Crop or Edit:</strong> Maintain raw, uncropped images to ensure forensic integrity.</li>
                  <li><strong>Store Safely:</strong> Keep copies in a password-protected cloud drive or personal folder.</li>
                </ol>
              </div>

              <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-950 flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                <span>
                  <strong>Screenshot Uploads:</strong> You can securely attach supporting screenshots directly into your incident report form, or present them to an authorized peer counselor.
                </span>
              </div>
            </div>
          </div>
        )}

        {/* TAB 5: When to Seek Help */}
        {activeTab === 'when_to_seek' && (
          <div className="space-y-6 animate-in fade-in-50 duration-200">
            <div className="flex items-start gap-4">
              <div className="h-12 w-12 rounded-2xl bg-emerald-100 text-emerald-800 flex items-center justify-center shrink-0">
                <AlertOctagon className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-slate-900">When to seek immediate assistance</h2>
                <p className="text-sm text-slate-600 mt-1 leading-relaxed">
                  Understanding the boundaries and purpose of peer counseling.
                </p>
              </div>
            </div>

            <div className="space-y-4 pt-2 text-xs sm:text-sm text-slate-600 leading-relaxed">
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                <h3 className="text-sm font-bold text-slate-900">The Scope of Peer Counseling</h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  AMEU SafeSpace peer counselors are student leaders trained in empathetic listening, conflict mediation, and institutional referrals. They are <strong>not</strong> certified therapists, legal attorneys, or emergency responders.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 space-y-2 text-rose-900">
                <h3 className="text-sm font-bold">Seek Urgent Authority If:</h3>
                <ul className="text-xs space-y-1 list-disc list-inside">
                  <li>There are explicit threats of physical assault or campus violence.</li>
                  <li>Someone is experiencing self-harm urges or severe psychiatric distress.</li>
                  <li>Blackmail involving extortion or weaponized personal imagery occurs.</li>
                </ul>
                <div className="pt-2">
                  <button
                    onClick={() => setIsDrawerOpen(true)}
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-rose-700 hover:bg-rose-800 text-white font-bold text-xs shadow-xs transition-colors cursor-pointer"
                  >
                    <PhoneCall className="w-3.5 h-3.5" />
                    <span>Open Emergency Contacts Quick-Dial</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Call to Action Banner */}
      <div className="rounded-3xl bg-emerald-800 p-8 text-white flex flex-col sm:flex-row items-center justify-between gap-6 shadow-lg">
        <div className="space-y-2 text-center sm:text-left">
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight">Support each other.</h2>
          <p className="text-xs sm:text-sm text-emerald-100 max-w-md">
            Build a safer online university community today. If you or someone you know is hurting, speak up.
          </p>
        </div>
        <button
          onClick={() => onNavigate('report')}
          className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-white text-emerald-900 font-bold text-sm hover:bg-emerald-50 active:scale-95 transition-all shrink-0 cursor-pointer"
        >
          <span>Report an Incident</span>
          <ArrowRight className="w-4 h-4 text-emerald-700" />
        </button>
      </div>

      {/* Floating Emergency Contacts Trigger Pill (Visible on page) */}
      <div className="fixed bottom-6 right-6 z-30">
        <button
          onClick={() => setIsDrawerOpen(true)}
          className="inline-flex items-center gap-2.5 px-4 py-3 rounded-full bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs sm:text-sm shadow-2xl shadow-rose-900/30 ring-2 ring-white/60 active:scale-95 transition-all cursor-pointer group"
          title="Open Emergency Contacts Drawer"
        >
          <span className="relative flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-white"></span>
          </span>
          <PhoneCall className="w-4 h-4 text-rose-100 group-hover:rotate-12 transition-transform" />
          <span>Emergency Contacts</span>
        </button>
      </div>

      {/* Slide-Over Emergency Contacts Drawer */}
      <AnimatePresence>
        {isDrawerOpen && (
          <div className="fixed inset-0 z-50 flex justify-end bg-slate-950/60 backdrop-blur-xs">
            {/* Backdrop click to close */}
            <div
              className="absolute inset-0"
              onClick={() => setIsDrawerOpen(false)}
            />

            {/* Drawer Container */}
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 30, stiffness: 300 }}
              className="relative w-full max-w-md sm:max-w-lg bg-white h-full shadow-2xl flex flex-col z-10 overflow-hidden"
              role="dialog"
              aria-modal="true"
              aria-labelledby="emergency-drawer-title"
            >
              {/* Drawer Header */}
              <div className="bg-gradient-to-r from-rose-900 via-rose-800 to-rose-900 text-white p-5 sm:p-6 shrink-0 relative">
                <button
                  onClick={() => setIsDrawerOpen(false)}
                  className="absolute top-4 right-4 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white/90 transition-colors focus:outline-hidden"
                  aria-label="Close emergency contacts drawer"
                >
                  <X className="w-5 h-5" />
                </button>

                <div className="flex items-center gap-2.5">
                  <div className="w-10 h-10 rounded-2xl bg-white text-rose-800 flex items-center justify-center font-bold shadow-md ring-2 ring-rose-400/40 shrink-0">
                    <PhoneCall className="w-5 h-5 text-rose-700" />
                  </div>
                  <div>
                    <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-rose-400/25 text-rose-100 text-[10px] font-black tracking-wider uppercase ring-1 ring-rose-300/30">
                      <span className="w-1.5 h-1.5 rounded-full bg-rose-300 animate-pulse"></span>
                      Direct Dial
                    </div>
                    <h2 id="emergency-drawer-title" className="text-xl font-black text-white tracking-tight mt-0.5">
                      Emergency Contacts
                    </h2>
                  </div>
                </div>

                <p className="text-xs text-rose-100/90 mt-2 leading-relaxed">
                  Tap any number below to dial immediately from your phone. All contacts are verified for AMEU students.
                </p>

                {/* Drawer Category Filter Pills */}
                <div className="flex flex-wrap items-center gap-1.5 mt-4">
                  {(['all', 'campus', 'police', 'helpline', 'medical'] as const).map((cat) => (
                    <button
                      key={cat}
                      onClick={() => setFilterCategory(cat)}
                      className={`px-2.5 py-1 rounded-xl text-[11px] font-bold capitalize transition-all cursor-pointer ${
                        filterCategory === cat
                          ? 'bg-white text-rose-900 shadow-sm'
                          : 'bg-white/15 text-white hover:bg-white/25'
                      }`}
                    >
                      {cat === 'all' ? 'All (6)' : cat}
                    </button>
                  ))}
                </div>
              </div>

              {/* Drawer Body - Scrollable Contact Cards */}
              <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-3.5 bg-slate-50">
                {filteredContacts.map((contact) => (
                  <div
                    key={contact.id}
                    className={`rounded-2xl p-4 bg-white border transition-all space-y-2.5 shadow-xs ${
                      contact.isPrimary
                        ? 'border-rose-200 ring-1 ring-rose-500/10'
                        : 'border-slate-200/90'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider ${
                        contact.isPrimary
                          ? 'bg-rose-100 text-rose-800'
                          : 'bg-slate-100 text-slate-700'
                      }`}>
                        {contact.badge}
                      </span>
                      <div className="flex items-center gap-1 text-[10px] text-slate-500">
                        <Clock className="w-3 h-3 text-slate-400" />
                        <span>{contact.hours}</span>
                      </div>
                    </div>

                    <div>
                      <h3 className="text-sm font-extrabold text-slate-900 leading-tight">
                        {contact.name}
                      </h3>
                      <p className="text-[11px] text-slate-500">
                        {contact.agency}
                      </p>
                    </div>

                    <p className="text-xs text-slate-600 leading-snug">
                      {contact.description}
                    </p>

                    <div className="flex items-center gap-1.5 text-[11px] text-slate-500">
                      <MapPin className="w-3 h-3 text-slate-400 shrink-0" />
                      <span className="truncate">{contact.location}</span>
                    </div>

                    {/* Quick-Dial & Copy Buttons */}
                    <div className="pt-2 flex items-center gap-2">
                      <a
                        href={`tel:${contact.number}`}
                        className="flex-1 inline-flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl bg-rose-700 hover:bg-rose-800 text-white font-bold text-xs shadow-xs active:scale-95 transition-all"
                      >
                        <PhoneCall className="w-3.5 h-3.5" />
                        <span>Quick-Dial {contact.displayNumber}</span>
                      </a>

                      <button
                        onClick={() => handleCopyNumber(contact.id, contact.number)}
                        className="p-2.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 transition-colors cursor-pointer"
                        title="Copy phone number"
                        aria-label="Copy phone number"
                      >
                        {copiedId === contact.id ? (
                          <Check className="w-4 h-4 text-emerald-600" />
                        ) : (
                          <Copy className="w-4 h-4 text-slate-500" />
                        )}
                      </button>
                    </div>
                  </div>
                ))}

                {/* Bottom Campus Safety Notice */}
                <div className="p-3.5 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 text-xs leading-relaxed space-y-1">
                  <span className="font-bold flex items-center gap-1.5 text-amber-950">
                    <LifeBuoy className="w-3.5 h-3.5 text-amber-700" />
                    Campus Johnson Road Location Note
                  </span>
                  <p className="text-[11px]">
                    If you are on campus and feel unsafe walking to your vehicle, hostel, or lecture hall at night, call Campus Security for a protective escort.
                  </p>
                </div>
              </div>

              {/* Drawer Footer */}
              <div className="p-4 bg-white border-t border-slate-200 flex items-center justify-between gap-3 shrink-0">
                <button
                  onClick={() => setIsDrawerOpen(false)}
                  className="w-full py-2.5 px-4 rounded-xl border border-slate-200 hover:bg-slate-100 text-xs font-semibold text-slate-700 transition-colors cursor-pointer"
                >
                  Close Drawer
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
