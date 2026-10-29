import React from 'react';
import {
  ShieldAlert,
  HeartHandshake,
  CheckCircle2,
  Lock,
  MessageSquare,
  BookOpen,
  Users,
  ArrowRight,
  ShieldCheck,
  FileCheck2,
  Clock,
  PhoneCall,
  UserCheck
} from 'lucide-react';

import { HeroBanner } from '../components/HeroBanner';
import { PartnerBar } from '../components/Logos';
import { PeerCounselorsSection } from '../components/PeerCounselorsSection';

import speakUpCardImg from '../assets/images/ameu_speak_up_card_1791965356557.jpg';
import understandOptionsCardImg from '../assets/images/ameu_understand_options_card_1791965377971.jpg';
import findSupportCardImg from '../assets/images/ameu_find_support_card_1791965401335.jpg';
import missionCollabImg from '../assets/images/ameu_mission_collab_1791965425038.jpg';
import solidarityCtaImg from '../assets/images/ameu_solidarity_cta_1791965449839.jpg';

interface LandingPageProps {
  onNavigate: (tab: string) => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onNavigate }) => {
  return (
    <div className="space-y-16 sm:space-y-24 pb-12">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-4 sm:pt-10">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-8 items-center">
            {/* Left Column: Headlines & Actions */}
            <div className="lg:col-span-7 space-y-6 sm:space-y-8">
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-slate-900 tracking-tight leading-[1.1]">
                Your Digital Safety <span className="text-emerald-700">Matters.</span>
              </h1>

              <p className="text-base sm:text-lg text-slate-600 leading-relaxed max-w-xl">
                Experiencing cyberbullying, or worried about a friend? You can report an incident and explore available support through this student reporting platform.
              </p>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3.5 pt-2">
                <button
                  onClick={() => onNavigate('report')}
                  className="inline-flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 active:scale-98 text-white font-bold text-base shadow-lg shadow-emerald-700/25 transition-all cursor-pointer group"
                >
                  <ShieldAlert className="w-5 h-5 text-emerald-200 group-hover:rotate-6 transition-transform" />
                  <span>REPORT AN INCIDENT</span>
                </button>

                <button
                  onClick={() => onNavigate('support')}
                  className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl border-2 border-emerald-700/80 bg-white hover:bg-emerald-50 text-emerald-800 font-bold text-base transition-all cursor-pointer"
                >
                  <HeartHandshake className="w-5 h-5 text-emerald-700" />
                  <span>GET SUPPORT</span>
                </button>
              </div>

              {/* Three Reassurance Statements */}
              <div className="pt-3 border-t border-slate-200/80 grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="flex items-center gap-2 text-xs font-semibold text-slate-700">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>No name required to report</span>
                </div>
                <div className="flex items-center gap-2 text-xs font-semibold text-slate-700">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Share only what you feel comfortable sharing</span>
                </div>
                <div className="flex items-center gap-2 text-xs font-semibold text-slate-700">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Reports are reviewed by authorized personnel</span>
                </div>
              </div>
            </div>

            {/* Right Column: Dynamic Hero Banner with 5 African youth images & 1s transition */}
            <div className="lg:col-span-5">
              <HeroBanner />
            </div>
          </div>
        </div>
      </section>

      {/* Official Partners Bar */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <PartnerBar />
      </section>

      {/* Feature Cards Section (Speak Up, Understand Your Options, Find Support) with Visual Banners */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* CARD 1: SPEAK UP */}
          <div className="group rounded-3xl bg-white border border-slate-200/90 shadow-sm hover:shadow-xl hover:border-emerald-500/50 transition-all flex flex-col justify-between overflow-hidden">
            <div className="h-40 w-full overflow-hidden relative">
              <img
                src={speakUpCardImg}
                alt="West African university student empowered to speak up safely"
                className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
              <div className="absolute bottom-3 left-4 flex items-center gap-2 text-white">
                <div className="h-8 w-8 rounded-lg bg-emerald-600 flex items-center justify-center">
                  <MessageSquare className="w-4 h-4 text-white" />
                </div>
                <span className="text-xs uppercase font-extrabold tracking-wider">Report Safely</span>
              </div>
            </div>

            <div className="p-6 space-y-3 flex-1 flex flex-col justify-between">
              <div className="space-y-2">
                <h2 className="text-xl font-bold text-slate-900 tracking-tight">SPEAK UP</h2>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  Report an incident affecting you or someone you know safely, with no requirement to provide your name or student ID.
                </p>
              </div>
              <button
                onClick={() => onNavigate('report')}
                className="mt-4 inline-flex items-center gap-1.5 text-xs font-bold text-emerald-700 hover:text-emerald-900 group-hover:translate-x-1 transition-transform cursor-pointer"
              >
                <span>Make a Report</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* CARD 2: UNDERSTAND YOUR OPTIONS */}
          <div className="group rounded-3xl bg-white border border-slate-200/90 shadow-sm hover:shadow-xl hover:border-emerald-500/50 transition-all flex flex-col justify-between overflow-hidden">
            <div className="h-40 w-full overflow-hidden relative">
              <img
                src={understandOptionsCardImg}
                alt="West African university students learning digital rights and safety guidelines"
                className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
              <div className="absolute bottom-3 left-4 flex items-center gap-2 text-white">
                <div className="h-8 w-8 rounded-lg bg-emerald-600 flex items-center justify-center">
                  <BookOpen className="w-4 h-4 text-white" />
                </div>
                <span className="text-xs uppercase font-extrabold tracking-wider">Resource Guides</span>
              </div>
            </div>

            <div className="p-6 space-y-3 flex-1 flex flex-col justify-between">
              <div className="space-y-2">
                <h2 className="text-xl font-bold text-slate-900 tracking-tight">UNDERSTAND YOUR OPTIONS</h2>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  Learn about cyberbullying, responsible online behavior, preserving evidence safely, and effective ways to seek support.
                </p>
              </div>
              <button
                onClick={() => onNavigate('support')}
                className="mt-4 inline-flex items-center gap-1.5 text-xs font-bold text-emerald-700 hover:text-emerald-900 group-hover:translate-x-1 transition-transform cursor-pointer"
              >
                <span>Explore Guidelines</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* CARD 3: FIND SUPPORT */}
          <div className="group rounded-3xl bg-white border border-slate-200/90 shadow-sm hover:shadow-xl hover:border-emerald-500/50 transition-all flex flex-col justify-between overflow-hidden">
            <div className="h-40 w-full overflow-hidden relative">
              <img
                src={findSupportCardImg}
                alt="Compassionate West African peer counselor listening and offering guidance"
                className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
              <div className="absolute bottom-3 left-4 flex items-center gap-2 text-white">
                <div className="h-8 w-8 rounded-lg bg-emerald-600 flex items-center justify-center">
                  <Users className="w-4 h-4 text-white" />
                </div>
                <span className="text-xs uppercase font-extrabold tracking-wider">Peer Mentorship</span>
              </div>
            </div>

            <div className="p-6 space-y-3 flex-1 flex flex-col justify-between">
              <div className="space-y-2">
                <h2 className="text-xl font-bold text-slate-900 tracking-tight">FIND SUPPORT</h2>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  Explore available resources and request confidential follow-up from an authorized peer counselor if you choose.
                </p>
              </div>
              <button
                onClick={() => onNavigate('support')}
                className="mt-4 inline-flex items-center gap-1.5 text-xs font-bold text-emerald-700 hover:text-emerald-900 group-hover:translate-x-1 transition-transform cursor-pointer"
              >
                <span>Learn About Peer Counseling</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Campus Mission Block with Real Study Group Photography */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rounded-3xl bg-slate-900 text-white overflow-hidden shadow-2xl border border-slate-800">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center p-8 sm:p-12">
            <div className="lg:col-span-7 space-y-5">
              <span className="text-xs font-bold uppercase tracking-widest text-emerald-400">Our Shared Mission</span>
              <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
                A safer digital campus starts with us.
              </h2>
              <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
                AMEU SafeSpace is a confidential platform where students can report cyberbullying, access support resources, and get help from trained peer counselors. Reports are reviewed by authorized personnel in accordance with our privacy and safeguarding procedures.
              </p>
              <div className="pt-2 flex flex-wrap items-center gap-3">
                <button
                  onClick={() => onNavigate('about')}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 font-semibold text-sm text-white transition-colors cursor-pointer"
                >
                  <span>LEARN MORE</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
                <button
                  onClick={() => onNavigate('report')}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl border border-slate-700 hover:bg-slate-800 font-semibold text-sm text-slate-200 transition-colors cursor-pointer"
                >
                  <span>Report an Incident</span>
                </button>
              </div>
            </div>

            <div className="lg:col-span-5 relative">
              <div className="rounded-2xl overflow-hidden shadow-xl border border-slate-700/80">
                <img
                  src={missionCollabImg}
                  alt="West African university students collaborating on student wellbeing"
                  className="w-full h-56 sm:h-64 object-cover filter brightness-90 hover:scale-105 transition-transform duration-500"
                />
                <div className="p-4 bg-slate-800/95 space-y-1">
                  <div className="flex items-center justify-between text-xs font-bold text-emerald-400">
                    <span>Collaborative Student Wellbeing</span>
                    <span>AMEU & FLY</span>
                  </div>
                  <p className="text-[11px] text-slate-300 leading-snug">
                    Implemented by Career Launchpad Liberia in partnership with Ministry of Justice and FLY.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Connect with Peer Counselors Section */}
      <PeerCounselorsSection
        onNavigateToReport={() => onNavigate('report')}
        onNavigateToSupport={() => onNavigate('support')}
      />

      {/* What Happens After You Report? 3-Step Timeline */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-xl mx-auto space-y-3 mb-12">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            What happens after you report?
          </h2>
          <p className="text-sm text-slate-600">
            A clear, structured, and compassionate path designed to protect your peace of mind.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative">
          {/* Step 1 */}
          <div className="relative rounded-3xl bg-white p-7 border border-slate-200/90 shadow-sm space-y-4 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-800 font-black text-sm">
                1
              </div>
              <FileCheck2 className="w-5 h-5 text-emerald-600" />
            </div>
            <h3 className="text-base font-bold text-slate-900">1. Submit your report</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Complete the quick 5-step form. Choose whether to remain fully anonymous or share your contact number for counselor check-ins. You receive an unpredictable tracking receipt code.
            </p>
          </div>

          {/* Step 2 */}
          <div className="relative rounded-3xl bg-white p-7 border border-slate-200/90 shadow-sm space-y-4 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-800 font-black text-sm">
                2
              </div>
              <Clock className="w-5 h-5 text-emerald-600" />
            </div>
            <h3 className="text-base font-bold text-slate-900">2. Reviewed by authorized personnel</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Trained peer counselors and designated supervisors assess urgency and context in accordance with university safeguarding standards, without public disclosure.
            </p>
          </div>

          {/* Step 3 */}
          <div className="relative rounded-3xl bg-white p-7 border border-slate-200/90 shadow-sm space-y-4 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-800 font-black text-sm">
                3
              </div>
              <HeartHandshake className="w-5 h-5 text-emerald-600" />
            </div>
            <h3 className="text-base font-bold text-slate-900">3. Voluntary follow-up support</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              If contact was requested, a counselor reaches out via WhatsApp or phone call to listen, advise, or coordinate formal university wellbeing referrals.
            </p>
          </div>
        </div>
      </section>

      {/* Closing Call to Action with Supportive Photography */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative rounded-3xl overflow-hidden shadow-2xl bg-[#064E32] text-white">
          <div className="grid grid-cols-1 lg:grid-cols-12 items-center">
            <div className="lg:col-span-7 p-8 sm:p-12 space-y-5">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#138A45]/40 text-emerald-200 text-xs font-semibold">
                <ShieldCheck className="w-4 h-4 text-emerald-300" />
                <span>Confidential University Support</span>
              </div>
              <h2 className="text-3xl sm:text-4xl font-black tracking-tight text-white leading-tight">
                You Deserve to Feel Safe Online.
              </h2>
              <p className="text-sm sm:text-base text-emerald-100/90 leading-relaxed max-w-lg">
                No student should face harassment, humiliation, or fear alone. Whether you want to report an incident anonymously or connect with an AMEU peer counselor, we are here for you.
              </p>
              <div className="pt-2">
                <button
                  onClick={() => onNavigate('report')}
                  className="inline-flex items-center gap-2.5 px-7 py-4 rounded-xl bg-white hover:bg-emerald-50 text-[#064E32] font-black text-sm sm:text-base shadow-xl transition-all cursor-pointer active:scale-95"
                >
                  <ShieldAlert className="w-5 h-5 text-[#138A45]" />
                  <span>REPORT AN INCIDENT</span>
                </button>
              </div>
            </div>

            <div className="lg:col-span-5 h-72 sm:h-80 lg:h-full relative overflow-hidden">
              <img
                src={solidarityCtaImg}
                alt="Supportive West African university students smiling in solidarity and community"
                className="w-full h-full object-cover filter brightness-95"
              />
              <div className="absolute inset-0 bg-gradient-to-t lg:bg-gradient-to-r from-[#064E32] via-[#064E32]/30 to-transparent"></div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
