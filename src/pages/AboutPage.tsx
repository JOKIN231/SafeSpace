import React from 'react';
import {
  Shield,
  Sparkles,
  Building2,
  Users2,
  ArrowRight,
  HeartHandshake,
  CheckCircle2,
  Lock,
  Scale,
  Award
} from 'lucide-react';
import { AMEUUniversityLogo, CareerLaunchpadLogo, MinistryOfJusticeLogo, FLYLogo } from '../components/Logos';
import ameuCampusImg from '../assets/images/ameu_campus_about_1791965474141.jpg';

interface AboutPageProps {
  onNavigate: (tab: string) => void;
}

export const AboutPage: React.FC<AboutPageProps> = ({ onNavigate }) => {
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-12">
      {/* Intro Header */}
      <div className="space-y-4">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#F0F8F1] text-[#064E32] text-xs font-bold ring-1 ring-[#25A55B]/30">
          <Sparkles className="w-3.5 h-3.5 text-[#138A45]" />
          <span>AMEU Anti-Cyberbullying Awareness Initiative</span>
        </div>
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 tracking-tight">
          About AMEU SafeSpace
        </h1>
        <p className="text-base sm:text-lg text-slate-600 leading-relaxed max-w-3xl">
          AMEU SafeSpace is a digital cyberbullying reporting, awareness, and peer-support initiative intended to promote respectful online behavior, provide a pathway for reporting incidents, and help students find appropriate support.
        </p>
      </div>

      {/* Campus Banner Card with Campus Photography */}
      <div className="rounded-3xl bg-slate-900 text-white shadow-2xl relative overflow-hidden">
        <div className="relative h-64 sm:h-80 w-full overflow-hidden">
          <img
            src={ameuCampusImg}
            alt="African Methodist Episcopal University Camp Johnson Road campus community in Monrovia, Liberia"
            className="w-full h-full object-cover filter brightness-90"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#064E32] via-[#064E32]/70 to-transparent"></div>

          <div className="absolute bottom-6 left-6 right-6 max-w-2xl space-y-2">
            <span className="text-xs uppercase tracking-wider font-extrabold text-emerald-300">African Methodist Episcopal University</span>
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
              Camp Johnson Road Campus Community
            </h2>
            <p className="text-xs sm:text-sm text-emerald-100/90 leading-relaxed">
              Implemented by Career Launchpad Liberia in partnership with the Ministry of Justice, Republic of Liberia, and the Federation of Liberian Youth (FLY) to foster a positive, supportive academic community.
            </p>
          </div>
        </div>
      </div>

      {/* Mission & Key Objectives */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="rounded-3xl bg-[#F0F8F1] border border-emerald-200/80 p-8 space-y-4 shadow-xs">
          <div className="h-11 w-11 rounded-2xl bg-[#064E32] text-white flex items-center justify-center shadow-md">
            <Shield className="w-6 h-6" />
          </div>
          <h2 className="text-xl font-bold text-slate-900">Our Mission</h2>
          <p className="text-sm text-slate-600 leading-relaxed">
            To create a safer, more respectful digital environment for all AMEU students through accessible education, confident, non-judgmental peer support, and institutional safeguarding partnerships.
          </p>
        </div>

        <div className="rounded-3xl bg-white border border-slate-200 p-8 space-y-4 shadow-xs">
          <div className="h-11 w-11 rounded-2xl bg-[#138A45] text-white flex items-center justify-center shadow-md">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <h2 className="text-xl font-bold text-slate-900">Key Objectives</h2>
          <ul className="text-xs sm:text-sm text-slate-600 space-y-2 list-disc list-inside leading-relaxed">
            <li>Provide a low-friction, confidential reporting channel without mandatory self-identification.</li>
            <li>Train authorized peer counselors to offer empathetic listening and guidance.</li>
            <li>Educate students on digital rights, cyber harassment laws, and evidence preservation.</li>
            <li>Connect complex incidents with approved university student affairs resources.</li>
          </ul>
        </div>
      </div>

      {/* The Importance of Digital Respect & The Role of Peer Support */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="rounded-3xl bg-white border border-slate-200 p-8 space-y-4 shadow-xs">
          <div className="h-11 w-11 rounded-2xl bg-amber-100 text-amber-800 flex items-center justify-center">
            <Sparkles className="w-6 h-6" />
          </div>
          <h2 className="text-xl font-bold text-slate-900">The Importance of Digital Respect</h2>
          <p className="text-sm text-slate-600 leading-relaxed">
            University class group chats, social media pages, and message forums should be spaces of collaboration, debate, and encouragement. Harassment, doxxing, non-consensual media sharing, and humiliation compromise emotional wellbeing and academic achievement. We champion digital empathy across all platforms.
          </p>
        </div>

        <div className="rounded-3xl bg-white border border-slate-200 p-8 space-y-4 shadow-xs">
          <div className="h-11 w-11 rounded-2xl bg-emerald-100 text-[#064E32] flex items-center justify-center">
            <Users2 className="w-6 h-6" />
          </div>
          <h2 className="text-xl font-bold text-slate-900">The Role of Peer Support</h2>
          <p className="text-sm text-slate-600 leading-relaxed">
            Students often hesitate to approach formal university disciplinary boards immediately. Peer counselors serve as trained, compassionate listeners who understand campus life, demystify options, and walk alongside reporters at their own pace.
          </p>
        </div>
      </div>

      {/* Partner Organizations */}
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Partner Organizations</h2>
          <p className="text-sm text-slate-600 mt-1">
            Built through cross-sector collaboration between youth innovators, civil society, and government institutions.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Partner 1: AMEU */}
          <div className="rounded-3xl bg-white p-6 border border-slate-200 shadow-sm space-y-4 flex flex-col justify-between hover:shadow-md transition-shadow">
            <div className="space-y-3">
              <div className="h-14 flex items-center">
                <AMEUUniversityLogo />
              </div>
              <h3 className="text-base font-bold text-slate-900">AME University</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Host university providing collegiate safeguarding oversight, student welfare leadership, and campus policy framework.
              </p>
            </div>
            <div className="text-[11px] font-bold text-[#064E32] pt-2 border-t border-slate-100">
              Host Academic Institution
            </div>
          </div>

          {/* Partner 2: Career Launchpad */}
          <div className="rounded-3xl bg-white p-6 border border-slate-200 shadow-sm space-y-4 flex flex-col justify-between hover:shadow-md transition-shadow">
            <div className="space-y-3">
              <div className="h-14 flex items-center">
                <CareerLaunchpadLogo />
              </div>
              <h3 className="text-base font-bold text-slate-900">Career Launchpad Liberia</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Lead implementing partner developing technical solutions, training student peer counselors, and championing youth empowerment across Liberia.
              </p>
            </div>
            <div className="text-[11px] font-bold text-[#138A45] pt-2 border-t border-slate-100">
              Implementing Organization
            </div>
          </div>

          {/* Partner 2 */}
          <div className="rounded-3xl bg-white p-6 border border-slate-200 shadow-sm space-y-4 flex flex-col justify-between hover:shadow-md transition-shadow">
            <div className="space-y-3">
              <div className="h-14 flex items-center">
                <MinistryOfJusticeLogo />
              </div>
              <h3 className="text-base font-bold text-slate-900">Ministry of Justice</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Republic of Liberia partner guiding cyber safety standards, child & youth safeguarding policies, and formal legal referral channels.
              </p>
            </div>
            <div className="text-[11px] font-bold text-amber-700 pt-2 border-t border-slate-100">
              Government Partner
            </div>
          </div>

          {/* Partner 3 */}
          <div className="rounded-3xl bg-white p-6 border border-slate-200 shadow-sm space-y-4 flex flex-col justify-between hover:shadow-md transition-shadow">
            <div className="space-y-3">
              <div className="h-14 flex items-center">
                <FLYLogo />
              </div>
              <h3 className="text-base font-bold text-slate-900">Federation of Liberian Youth</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                National youth umbrella body promoting student solidarity, peer support networks, and responsible civic behavior in digital spaces.
              </p>
            </div>
            <div className="text-[11px] font-bold text-blue-700 pt-2 border-t border-slate-100">
              National Youth Partner
            </div>
          </div>
        </div>
      </div>

      {/* Report CTA */}
      <div className="pt-4 text-center">
        <button
          onClick={() => onNavigate('report')}
          className="inline-flex items-center gap-2.5 px-8 py-4 rounded-xl bg-[#064E32] hover:bg-[#138A45] text-white font-black text-sm shadow-xl shadow-[#064E32]/25 transition-all cursor-pointer active:scale-95"
        >
          <span>REPORT AN INCIDENT TODAY</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
