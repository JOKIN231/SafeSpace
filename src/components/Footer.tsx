import React from 'react';
import { Lock } from 'lucide-react';
import { SafeSpaceBrandLogo, AMEUUniversityLogo, CareerLaunchpadLogo, MinistryOfJusticeLogo, FLYLogo } from './Logos';

interface FooterProps {
  onNavigate: (tab: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  return (
    <footer className="bg-emerald-950 text-slate-100 border-t border-emerald-900/60 mt-16">
      {/* Upper Partner Banner */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-10">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8 pb-10 border-b border-emerald-900">
          {/* Brand info */}
          <div className="max-w-sm space-y-3">
            <SafeSpaceBrandLogo light />
            <p className="text-xs text-emerald-200/80 leading-relaxed">
              Your Voice. Your Safety. Your Digital Space. An initiative dedicated to empowering AMEU students against digital harassment through secure peer support and community safeguarding.
            </p>
          </div>

          {/* Partnership Logos */}
          <div className="space-y-3">
            <span className="text-xs font-semibold uppercase tracking-wider text-emerald-300/80 block">
              In Partnership With
            </span>
            <div className="flex flex-wrap items-center gap-4 sm:gap-6 bg-white/95 backdrop-blur-xs p-3.5 rounded-2xl shadow-inner">
              <AMEUUniversityLogo />
              <div className="h-6 w-px bg-slate-200 hidden sm:block"></div>
              <CareerLaunchpadLogo />
              <div className="h-6 w-px bg-slate-200 hidden sm:block"></div>
              <MinistryOfJusticeLogo />
              <div className="h-6 w-px bg-slate-200 hidden sm:block"></div>
              <FLYLogo />
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-emerald-300/70">
          <div className="flex items-center gap-6">
            <button
              onClick={() => onNavigate('support')}
              className="hover:text-white transition-colors"
            >
              Support & Resources
            </button>
            <span className="text-emerald-800">•</span>
            <button
              onClick={() => onNavigate('privacy')}
              className="hover:text-white transition-colors"
            >
              Privacy & Safeguarding Notice
            </button>
            <span className="text-emerald-800">•</span>
            <button
              onClick={() => onNavigate('about')}
              className="hover:text-white transition-colors"
            >
              About the Initiative
            </button>
          </div>

          <div className="flex items-center gap-4">
            <p>© 2026 AMEU SafeSpace. All rights reserved.</p>

            {/* Discreet counselor access link */}
            <button
              onClick={() => onNavigate('internal-access')}
              className="inline-flex items-center gap-1 text-[11px] text-emerald-400/60 hover:text-emerald-200 transition-colors p-1 rounded-sm focus:outline-hidden"
              title="Authorized Personnel Access"
            >
              <Lock className="w-3 h-3" />
              <span>Internal Access</span>
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};
