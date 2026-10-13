import React, { useState } from 'react';
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
  ExternalLink
} from 'lucide-react';

interface SupportPageProps {
  onNavigate: (tab: string) => void;
}

export const SupportPage: React.FC<SupportPageProps> = ({ onNavigate }) => {
  const [activeTab, setActiveTab] = useState<'cyberbullying' | 'what_to_do' | 'support_friend' | 'evidence' | 'when_to_seek'>('cyberbullying');

  const tabs = [
    { id: 'cyberbullying', label: 'What Is Cyberbullying?' },
    { id: 'what_to_do', label: 'What Can I Do If It Happens to Me?' },
    { id: 'support_friend', label: 'How Can I Support a Friend?' },
    { id: 'evidence', label: 'How Can I Preserve Evidence?' },
    { id: 'when_to_seek', label: 'When Should I Seek Urgent Help?' },
  ];

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-10">
      {/* Header Banner with Supportive Student Photography */}
      <div className="rounded-3xl bg-slate-900 text-white shadow-2xl relative overflow-hidden">
        <div className="relative h-64 sm:h-72 w-full overflow-hidden">
          <img
            src="https://images.unsplash.com/photo-1517486808906-6ca8b3f04846?auto=format&fit=crop&w=1200&q=80"
            alt="Students talking and supporting each other"
            className="w-full h-full object-cover filter brightness-85"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-emerald-950 via-emerald-950/70 to-emerald-950/20"></div>

          <div className="absolute bottom-6 left-6 right-6 max-w-2xl space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/30 backdrop-blur-md text-emerald-300 text-xs font-semibold">
              <Heart className="w-3.5 h-3.5" />
              <span>Student Wellbeing Guide</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-white">
              Get Support. You Are Not Alone.
            </h1>
            <p className="text-sm sm:text-base text-emerald-100/90 leading-relaxed">
              Explore guidance, safe evidence preservation, and peer support options for AMEU students.
            </p>
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
                ? 'bg-emerald-700 text-white shadow-xs'
                : 'text-slate-600 hover:text-emerald-800 hover:bg-slate-100'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content Panes */}
      <div className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-200/90 shadow-sm space-y-8">
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
                <h3 className="text-sm font-bold text-slate-900">Common Signs & Manifestations</h3>
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
                    Block abusive phone numbers on WhatsApp, report harmful accounts on TikTok/Instagram, and adjust your profile privacy settings to 'Friends only'.
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
                <h2 className="text-xl font-bold text-slate-900">How to support a friend</h2>
                <p className="text-sm text-slate-600 mt-1 leading-relaxed">
                  Watching someone you care about face harassment is distressing. Your solidarity can make a vital difference.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                <h3 className="text-sm font-bold text-slate-900">What Helps</h3>
                <ul className="text-xs text-slate-600 space-y-2 list-disc list-inside leading-relaxed">
                  <li><strong>Listen without judging:</strong> Let them speak openly without doubting their story or minimizing the hurt.</li>
                  <li><strong>Validate their emotions:</strong> Remind them that cruelty online says everything about the bully and nothing about their worth.</li>
                  <li><strong>Help them document evidence:</strong> Assist them calmly in capturing clean screenshots without circulating them.</li>
                  <li><strong>Encourage reporting:</strong> Offer to sit with them while they submit an anonymous report on AMEU SafeSpace.</li>
                </ul>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                <h3 className="text-sm font-bold text-slate-900">What to Avoid</h3>
                <ul className="text-xs text-slate-600 space-y-2 list-disc list-inside leading-relaxed">
                  <li>Avoid saying "just ignore it" or "it's only online"—the psychological impact is very real.</li>
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
                  <li><strong>Capture Full Screen:</strong> Include the sender's phone number or username handle, time of message, and battery bar to establish authenticity.</li>
                  <li><strong>Preserve Web URLs:</strong> On browsers, copy the exact link to the post or profile before it can be deleted or edited.</li>
                  <li><strong>Do Not Crop or Edit:</strong> Maintain raw, uncropped images to ensure forensic integrity.</li>
                  <li><strong>Store Safely:</strong> Keep copies in a password-protected cloud drive or personal folder.</li>
                </ol>
              </div>

              <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-xs text-amber-900 flex items-start gap-3">
                <AlertOctagon className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                <span>
                  <strong>Privacy Alert:</strong> AMEU SafeSpace reporting forms intentionally omit direct image uploads to protect your personal media. Keep evidence on your device until meeting securely with an authorized counselor.
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
                <p className="text-xs pt-1">
                  In these situations, reach out immediately to AMEU Campus Security, the Office of Student Affairs, or local law enforcement.
                </p>
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
    </div>
  );
};
