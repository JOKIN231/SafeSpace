import React from 'react';
import { ShieldCheck, Check } from 'lucide-react';

export const SafeSpaceBrandLogo: React.FC<{ className?: string; iconOnly?: boolean; light?: boolean }> = ({
  className = '',
  iconOnly = false,
  light = false,
}) => {
  return (
    <div className={`flex items-center gap-2.5 font-bold tracking-tight select-none ${className}`}>
      {/* Consistent Shield-and-Checkmark Digital Safety Symbol */}
      <div className="relative flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#064E32] text-white shadow-md shadow-[#064E32]/25 ring-1 ring-[#25A55B]/40">
        <svg viewBox="0 0 36 36" fill="none" className="h-6 w-6">
          <path
            d="M18 4C26 4 30 7 30 7C30 19 26 28 18 32C10 28 6 19 6 7C6 7 10 4 18 4Z"
            fill="#138A45"
            stroke="#25A55B"
            strokeWidth="1.5"
            strokeLinejoin="round"
          />
          {/* Internal shield glow */}
          <path
            d="M18 7C24 7 27 9.5 27 9.5C27 18 24 25.5 18 28.5C12 25.5 9 18 9 9.5C9 9.5 12 7 18 7Z"
            fill="#064E32"
          />
          {/* Digital Checkmark Symbol */}
          <path
            d="M13 18L16.5 21.5L23.5 14.5"
            stroke="#FFFFFF"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>

      {!iconOnly && (
        <div className="flex flex-col leading-none">
          <div className="flex items-center gap-1">
            <span className={`text-base font-extrabold tracking-tight ${light ? 'text-white' : 'text-[#064E32]'}`}>
              AMEU
            </span>
            <span className="text-base font-extrabold tracking-tight text-[#138A45]">
              SafeSpace
            </span>
          </div>
          <span className={`text-[10px] font-semibold tracking-wider uppercase ${light ? 'text-[#F0F8F1]/80' : 'text-[#138A45]'}`}>
            Digital Safety & Peer Support
          </span>
        </div>
      )}
    </div>
  );
};

export const CareerLaunchpadLogo: React.FC<{ className?: string }> = ({ className = 'h-10' }) => {
  return (
    <div className={`flex items-center gap-2.5 ${className}`}>
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#138A45] text-white shadow-sm ring-1 ring-[#25A55B]">
        <svg viewBox="0 0 32 32" fill="none" className="h-6 w-6">
          <path d="M16 4C19 8 21 12 21 17H11C11 12 13 8 16 4Z" fill="#ffffff" />
          <path d="M16 4C17.2 6.5 18 9 18 11H14C14 9 14.8 6.5 16 4Z" fill="#25A55B" />
          <circle cx="16" cy="14" r="2" fill="#064E32" />
          <path d="M11 14.5L7 18C7 20 10 20 11 19Z" fill="#86efac" />
          <path d="M21 14.5L25 18C25 20 22 20 21 19Z" fill="#86efac" />
          <path d="M14 18C14 22 16 25 16 25C16 25 18 22 18 18Z" fill="#f59e0b" />
        </svg>
      </div>
      <div className="flex flex-col leading-tight">
        <span className="text-xs font-bold text-slate-900 tracking-tight">Career Launchpad</span>
        <span className="text-[10px] font-semibold text-[#138A45]">Liberia (Implementing Partner)</span>
      </div>
    </div>
  );
};

export const MinistryOfJusticeLogo: React.FC<{ className?: string }> = ({ className = 'h-10' }) => {
  return (
    <div className={`flex items-center gap-2.5 ${className}`}>
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-amber-50 border-2 border-amber-600/40 p-1 shadow-sm">
        <svg viewBox="0 0 36 36" fill="none" className="h-7 w-7">
          <circle cx="18" cy="18" r="16" stroke="#b45309" strokeWidth="1.5" fill="#fef3c7" />
          <path d="M18 7V26" stroke="#92400e" strokeWidth="1.5" strokeLinecap="round" />
          <path d="M12 11H24" stroke="#92400e" strokeWidth="1.5" strokeLinecap="round" />
          <path d="M12 11L9 16H15L12 11Z" fill="#d97706" />
          <path d="M24 11L21 16H27L24 11Z" fill="#d97706" />
          <path d="M13 26H23" stroke="#92400e" strokeWidth="2" strokeLinecap="round" />
        </svg>
      </div>
      <div className="flex flex-col leading-tight">
        <span className="text-xs font-bold text-slate-900 tracking-tight">Ministry of Justice</span>
        <span className="text-[10px] font-medium text-slate-600">Republic of Liberia</span>
      </div>
    </div>
  );
};

export const FLYLogo: React.FC<{ className?: string }> = ({ className = 'h-10' }) => {
  return (
    <div className={`flex items-center gap-2.5 ${className}`}>
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-900 border border-blue-700 p-1 shadow-sm overflow-hidden relative">
        <div className="absolute inset-0 flex flex-col justify-between py-1 px-1 opacity-90">
          <div className="h-1 bg-red-600 rounded-sm"></div>
          <div className="h-1 bg-white rounded-sm"></div>
          <div className="h-1 bg-red-600 rounded-sm"></div>
        </div>
        <div className="relative z-10 flex items-center justify-center">
          <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5">
            <polygon
              points="12,2 15,9 22,9 17,14 19,21 12,17 5,21 7,14 2,9 9,9"
              fill="#ffffff"
            />
          </svg>
        </div>
      </div>
      <div className="flex flex-col leading-tight">
        <span className="text-xs font-bold text-slate-900 tracking-tight">Federation of Liberian</span>
        <span className="text-[10px] font-semibold text-blue-700">Youth (FLY)</span>
      </div>
    </div>
  );
};

export const AMEUUniversityLogo: React.FC<{ className?: string; light?: boolean }> = ({
  className = 'h-10',
  light = false,
}) => {
  return (
    <div className={`flex items-center gap-2.5 ${className}`}>
      <div className="relative flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#064E32] text-amber-300 ring-2 ring-amber-400/60 shadow-md">
        <svg viewBox="0 0 40 40" fill="none" className="h-7 w-7">
          {/* Outer circular crest */}
          <circle cx="20" cy="20" r="18" stroke="#F59E0B" strokeWidth="1.5" strokeDasharray="2 1.5" />
          {/* Central Cross & Anvil / Open Book */}
          <path d="M20 7V22" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" />
          <path d="M14 12H26" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" />
          {/* Anvil base / Open pages */}
          <path
            d="M13 25C16 23 19 24 20 25C21 24 24 23 27 25V30C24 28 21 29 20 30C19 29 16 28 13 30Z"
            fill="#F59E0B"
            stroke="#D97706"
            strokeWidth="0.8"
          />
          {/* Star rays */}
          <circle cx="20" cy="9" r="1" fill="#FEF08A" />
        </svg>
      </div>
      <div className="flex flex-col leading-tight">
        <span className={`text-xs font-black tracking-tight ${light ? 'text-white' : 'text-[#064E32]'}`}>
          AME University
        </span>
        <span className={`text-[10px] font-medium ${light ? 'text-amber-300' : 'text-amber-700'}`}>
          Monrovia, Liberia
        </span>
      </div>
    </div>
  );
};

export const PartnerBar: React.FC<{ className?: string }> = ({ className = '' }) => {
  return (
    <div className={`bg-white border border-slate-200/80 rounded-2xl p-4 sm:p-5 shadow-xs ${className}`}>
      <div className="flex items-center justify-between gap-2 pb-3 mb-3 border-b border-slate-100">
        <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
          Official Safeguarding & Implementing Partners
        </span>
        <span className="text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200/60">
          AMEU SafeSpace Coalition
        </span>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 items-center">
        <AMEUUniversityLogo />
        <CareerLaunchpadLogo />
        <MinistryOfJusticeLogo />
        <FLYLogo />
      </div>
    </div>
  );
};
