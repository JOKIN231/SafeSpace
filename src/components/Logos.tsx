import React from 'react';

/**
 * AMEU SafeSpace Brand Logo
 * Primary brand mark with digital shield and checkmark
 */
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

/**
 * African Methodist Episcopal University (AMEU) Official Crest Logo
 * Matches the official university seal:
 * - Forest green circular border with gold lettering:
 *   "AFRICAN METHODIST EPISCOPAL UNIVERSITY • CAMP JOHNSON ROAD, MONROVIA"
 * - Gold inner ring, founded 1995
 * - Historic AME Richard Allen anvil, Christian cross, open Holy Bible, and motto
 */
export const AMEUUniversityLogo: React.FC<{ className?: string; light?: boolean; iconOnly?: boolean }> = ({
  className = '',
  light = false,
  iconOnly = false,
}) => {
  return (
    <div className={`flex items-center gap-2.5 ${className}`}>
      <div className="relative flex h-11 w-11 shrink-0 items-center justify-center rounded-full shadow-sm ring-1 ring-amber-500/40 bg-[#064E32] overflow-hidden">
        <svg viewBox="0 0 100 100" className="h-full w-full" aria-label="AMEU Official Seal">
          {/* Outer Ring */}
          <circle cx="50" cy="50" r="48" fill="#064E32" stroke="#F59E0B" strokeWidth="2.5" />
          {/* Inner Golden Ring */}
          <circle cx="50" cy="50" r="38" fill="#FFFDF0" stroke="#F59E0B" strokeWidth="1.5" />

          {/* Curved Text - Top Arc */}
          <path id="ameuTopArc" d="M 18,50 A 32,32 0 1,1 82,50" fill="none" />
          <text fontSize="6.5" fill="#F59E0B" fontWeight="900" letterSpacing="0.4">
            <textPath href="#ameuTopArc" startOffset="50%" textAnchor="middle">
              AME UNIVERSITY
            </textPath>
          </text>

          {/* Curved Text - Bottom Arc */}
          <path id="ameuBottomArc" d="M 82,50 A 32,32 0 0,1 18,50" fill="none" />
          <text fontSize="5.5" fill="#FDE68A" fontWeight="800" letterSpacing="0.2">
            <textPath href="#ameuBottomArc" startOffset="50%" textAnchor="middle">
              MONROVIA • LIBERIA
            </textPath>
          </text>

          {/* Star Accents */}
          <polygon points="15,50 17,45 22,45 18,48 20,53 15,50" fill="#F59E0B" transform="scale(0.5) translate(12, 45)" />
          <polygon points="15,50 17,45 22,45 18,48 20,53 15,50" fill="#F59E0B" transform="scale(0.5) translate(168, 45)" />

          {/* Center Field: Foundation Year */}
          <text x="50" y="32" fontSize="5" fontWeight="bold" fill="#064E32" textAnchor="middle">
            FOUNDED 1995
          </text>

          {/* Open Bible / Scripture with Radiance */}
          <path
            d="M 40,38 Q 45,35 50,38 Q 55,35 60,38 L 59,44 Q 55,41 50,43 Q 45,41 41,44 Z"
            fill="#FEF3C7"
            stroke="#D97706"
            strokeWidth="0.8"
          />
          <line x1="50" y1="38" x2="50" y2="43" stroke="#D97706" strokeWidth="0.8" />
          {/* Radiant Light Rays */}
          <line x1="50" y1="34" x2="50" y2="36" stroke="#F59E0B" strokeWidth="1" />
          <line x1="45" y1="35" x2="46" y2="37" stroke="#F59E0B" strokeWidth="0.8" />
          <line x1="55" y1="35" x2="54" y2="37" stroke="#F59E0B" strokeWidth="0.8" />

          {/* Christian Cross */}
          <rect x="48.5" y="44" width="3" height="15" fill="#B91C1C" rx="0.5" />
          <rect x="44" y="47" width="12" height="3" fill="#B91C1C" rx="0.5" />

          {/* Historic AME Richard Allen Anvil */}
          <path
            d="M 38,59 L 44,57 L 56,57 L 62,59 L 58,64 L 54,64 L 56,68 L 44,68 L 46,64 L 42,64 Z"
            fill="#1E293B"
            stroke="#0F172A"
            strokeWidth="0.8"
          />

          {/* Laurel Wreath at Base */}
          <path
            d="M 33,65 Q 40,73 50,73 Q 60,73 67,65"
            fill="none"
            stroke="#15803D"
            strokeWidth="1.2"
            strokeDasharray="2 1"
          />

          {/* Motto Banner */}
          <rect x="26" y="74" width="48" height="6.5" rx="2" fill="#F59E0B" stroke="#B45309" strokeWidth="0.6" />
          <text x="50" y="79" fontSize="3.8" fontWeight="bold" fill="#064E32" textAnchor="middle">
            TO KNOW GOD AND TO EXCEL
          </text>
        </svg>
      </div>

      {!iconOnly && (
        <div className="flex flex-col leading-tight">
          <span className={`text-xs font-black tracking-tight ${light ? 'text-white' : 'text-[#064E32]'}`}>
            AME University
          </span>
          <span className={`text-[10px] font-medium ${light ? 'text-amber-300' : 'text-amber-700'}`}>
            Camp Johnson Rd • Monrovia
          </span>
          <span className="text-[9px] font-semibold text-emerald-600/90">
            Est. 1995 • Host University
          </span>
        </div>
      )}
    </div>
  );
};

/**
 * Career Launchpad Liberia Official Logo
 * Lead Implementing Partner
 * Matches the official branding:
 * - Dynamic ascending launch rocket / multi-tone geometric speed fin
 * - Vibrant emerald, cyan/teal, deep slate, and orange flame
 * - "CAREER LAUNCHPAD LIBERIA"
 */
export const CareerLaunchpadLogo: React.FC<{ className?: string; light?: boolean; iconOnly?: boolean }> = ({
  className = '',
  light = false,
  iconOnly = false,
}) => {
  return (
    <div className={`flex items-center gap-2.5 ${className}`}>
      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-slate-900 shadow-sm ring-1 ring-emerald-500/30 p-1.5 overflow-hidden">
        <svg viewBox="0 0 40 40" className="h-full w-full" aria-label="Career Launchpad Logo">
          {/* Dynamic Launch Rocket Glyphs */}
          {/* Main Fuselage Body */}
          <path
            d="M 20,6 C 26,11 29,19 28,26 L 20,22 L 12,26 C 11,19 14,11 20,6 Z"
            fill="url(#launchpadGrad)"
          />
          {/* Left Teal Wing */}
          <path
            d="M 12,24 L 6,29 C 6,32 10,32 12,29 Z"
            fill="#06B6D4"
          />
          {/* Right Emerald Wing */}
          <path
            d="M 28,24 L 34,29 C 34,32 30,32 28,29 Z"
            fill="#10B981"
          />
          {/* Center Viewport */}
          <circle cx="20" cy="16" r="3.2" fill="#FFFFFF" />
          <circle cx="20" cy="16" r="1.8" fill="#0F172A" />
          {/* Propulsion Flame Exhaust */}
          <path
            d="M 16,25 Q 20,36 20,37 Q 20,36 24,25 Q 20,29 16,25 Z"
            fill="#F59E0B"
          />
          <path
            d="M 18,25 Q 20,32 20,33 Q 20,32 22,25 Z"
            fill="#FEF08A"
          />

          <defs>
            <linearGradient id="launchpadGrad" x1="12" y1="6" x2="28" y2="26" gradientUnits="userSpaceOnUse">
              <stop stopColor="#10B981" />
              <stop offset="0.5" stopColor="#059669" />
              <stop offset="1" stopColor="#047857" />
            </linearGradient>
          </defs>
        </svg>
      </div>

      {!iconOnly && (
        <div className="flex flex-col leading-tight">
          <div className="flex items-center gap-1">
            <span className={`text-xs font-black tracking-tight ${light ? 'text-white' : 'text-slate-900'}`}>
              CAREER
            </span>
            <span className="text-xs font-black tracking-tight text-[#138A45]">
              LAUNCHPAD
            </span>
          </div>
          <span className="text-[10px] font-bold tracking-wider text-emerald-600 uppercase">
            Liberia
          </span>
          <span className="text-[9px] font-medium text-slate-500">
            Lead Implementing Partner
          </span>
        </div>
      )}
    </div>
  );
};

/**
 * Ministry of Justice, Republic of Liberia Official Seal Logo
 * Government Partner
 * Matches the official national seal & scales of justice:
 * - Golden double-ring circular seal
 * - "MINISTRY OF JUSTICE • REPUBLIC OF LIBERIA"
 * - National emblem: ship, rising sun, peace dove, palm tree, plow & spade
 * - Scales of Justice (balance scales)
 */
export const MinistryOfJusticeLogo: React.FC<{ className?: string; light?: boolean; iconOnly?: boolean }> = ({
  className = '',
  light = false,
  iconOnly = false,
}) => {
  return (
    <div className={`flex items-center gap-2.5 ${className}`}>
      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-amber-50 shadow-sm ring-1 ring-amber-600/40 p-1 overflow-hidden">
        <svg viewBox="0 0 100 100" className="h-full w-full" aria-label="Ministry of Justice Seal">
          {/* Outer Gold Band */}
          <circle cx="50" cy="50" r="48" fill="#FFFBEB" stroke="#B45309" strokeWidth="2.5" />
          <circle cx="50" cy="50" r="44" fill="none" stroke="#D97706" strokeWidth="1" strokeDasharray="2 1.5" />
          <circle cx="50" cy="50" r="37" fill="#FEF3C7" stroke="#B45309" strokeWidth="1.5" />

          {/* Curved Text - Top */}
          <path id="mojTopArc" d="M 16,50 A 34,34 0 1,1 84,50" fill="none" />
          <text fontSize="6.5" fill="#92400E" fontWeight="900" letterSpacing="0.3">
            <textPath href="#mojTopArc" startOffset="50%" textAnchor="middle">
              MINISTRY OF JUSTICE
            </textPath>
          </text>

          {/* Curved Text - Bottom */}
          <path id="mojBottomArc" d="M 84,50 A 34,34 0 0,1 16,50" fill="none" />
          <text fontSize="5.5" fill="#78350F" fontWeight="800" letterSpacing="0.4">
            <textPath href="#mojBottomArc" startOffset="50%" textAnchor="middle">
              REPUBLIC OF LIBERIA
            </textPath>
          </text>

          {/* Center Inner Coat of Arms & Scales */}
          {/* Sky & Horizon */}
          <clipPath id="innerShield">
            <circle cx="50" cy="50" r="28" />
          </clipPath>
          <g clipPath="url(#innerShield)">
            {/* Sky */}
            <rect x="22" y="22" width="56" height="30" fill="#BAE6FD" />
            {/* Ocean */}
            <rect x="22" y="47" width="56" height="31" fill="#0284C7" />
            {/* Rising Sun */}
            <circle cx="50" cy="46" r="6" fill="#F59E0B" />
            <line x1="50" y1="38" x2="50" y2="40" stroke="#F59E0B" strokeWidth="1.5" />
            <line x1="43" y1="41" x2="45" y2="42" stroke="#F59E0B" strokeWidth="1.5" />
            <line x1="57" y1="41" x2="55" y2="42" stroke="#F59E0B" strokeWidth="1.5" />

            {/* Sailing 19th Century Ship on Ocean */}
            <path d="M 33,48 Q 38,51 43,48 L 41,52 Q 38,53 35,52 Z" fill="#78350F" />
            <path d="M 38,41 L 38,48 L 42,48 Z" fill="#FFFFFF" stroke="#78350F" strokeWidth="0.5" />
            <path d="M 35,43 L 38,48 L 35,48 Z" fill="#FFFFFF" stroke="#78350F" strokeWidth="0.5" />

            {/* White Peace Dove with Scroll */}
            <path
              d="M 60,32 Q 64,30 67,33 Q 64,35 60,33 Z"
              fill="#FFFFFF"
              stroke="#D97706"
              strokeWidth="0.5"
            />

            {/* Palm Tree on Shore */}
            <path d="M 63,55 Q 64,48 62,44" stroke="#78350F" strokeWidth="1.5" fill="none" />
            <path d="M 62,44 Q 57,42 56,45" stroke="#15803D" strokeWidth="1.2" fill="none" />
            <path d="M 62,44 Q 67,42 68,45" stroke="#15803D" strokeWidth="1.2" fill="none" />
            <path d="M 62,44 Q 62,39 63,38" stroke="#15803D" strokeWidth="1.2" fill="none" />

            {/* Superimposed Scales of Justice */}
            <rect x="49" y="32" width="2" height="26" fill="#B45309" />
            <line x1="38" y1="36" x2="62" y2="36" stroke="#92400E" strokeWidth="2" strokeLinecap="round" />
            {/* Left Pan */}
            <line x1="40" y1="36" x2="36" y2="44" stroke="#92400E" strokeWidth="0.8" />
            <line x1="40" y1="36" x2="44" y2="44" stroke="#92400E" strokeWidth="0.8" />
            <path d="M 35,44 Q 40,48 45,44 Z" fill="#D97706" stroke="#92400E" strokeWidth="0.8" />
            {/* Right Pan */}
            <line x1="60" y1="36" x2="56" y2="44" stroke="#92400E" strokeWidth="0.8" />
            <line x1="60" y1="36" x2="64" y2="44" stroke="#92400E" strokeWidth="0.8" />
            <path d="M 55,44 Q 60,48 65,44 Z" fill="#D97706" stroke="#92400E" strokeWidth="0.8" />
            {/* Base Pedestal */}
            <polygon points="46,58 54,58 56,62 44,62" fill="#78350F" />
          </g>

          {/* National Motto Ribbon */}
          <rect x="22" y="73" width="56" height="7" rx="2" fill="#92400E" stroke="#F59E0B" strokeWidth="0.6" />
          <text x="50" y="78" fontSize="3.6" fontWeight="bold" fill="#FEF3C7" textAnchor="middle">
            THE LOVE OF LIBERTY BROUGHT US HERE
          </text>
        </svg>
      </div>

      {!iconOnly && (
        <div className="flex flex-col leading-tight">
          <span className={`text-xs font-black tracking-tight ${light ? 'text-white' : 'text-slate-900'}`}>
            Ministry of Justice
          </span>
          <span className={`text-[10px] font-semibold ${light ? 'text-amber-300' : 'text-amber-800'}`}>
            Republic of Liberia
          </span>
          <span className="text-[9px] font-medium text-slate-500">
            Government Safeguarding Partner
          </span>
        </div>
      )}
    </div>
  );
};

/**
 * Federation of Liberian Youth (FLY) Official Logo
 * National Youth Umbrella Body
 * Matches official FLY branding:
 * - Royal blue circular seal with gold/white rings
 * - "FEDERATION OF LIBERIAN YOUTH • EST. 1974"
 * - Liberian flag red and white stripes
 * - Lone Star of Liberia (bold white 5-pointed star)
 * - United youth silhouettes in solidarity
 * - "FLY" acronym
 */
export const FLYLogo: React.FC<{ className?: string; light?: boolean; iconOnly?: boolean }> = ({
  className = '',
  light = false,
  iconOnly = false,
}) => {
  return (
    <div className={`flex items-center gap-2.5 ${className}`}>
      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#003366] shadow-sm ring-1 ring-blue-500/40 p-1 overflow-hidden">
        <svg viewBox="0 0 100 100" className="h-full w-full" aria-label="FLY Official Logo">
          {/* Outer Royal Blue Disc */}
          <circle cx="50" cy="50" r="48" fill="#003366" stroke="#F59E0B" strokeWidth="2.5" />
          <circle cx="50" cy="50" r="44" fill="none" stroke="#FFFFFF" strokeWidth="1" />
          <circle cx="50" cy="50" r="38" fill="#0A2540" stroke="#F59E0B" strokeWidth="1.2" />

          {/* Curved Text - Top */}
          <path id="flyTopArc" d="M 16,50 A 34,34 0 1,1 84,50" fill="none" />
          <text fontSize="6" fill="#FFFFFF" fontWeight="900" letterSpacing="0.2">
            <textPath href="#flyTopArc" startOffset="50%" textAnchor="middle">
              FEDERATION OF LIBERIAN YOUTH
            </textPath>
          </text>

          {/* Curved Text - Bottom */}
          <path id="flyBottomArc" d="M 84,50 A 34,34 0 0,1 16,50" fill="none" />
          <text fontSize="5.5" fill="#FDE68A" fontWeight="800" letterSpacing="0.4">
            <textPath href="#flyBottomArc" startOffset="50%" textAnchor="middle">
              EST. SEPT 8, 1974 • LIBERIA
            </textPath>
          </text>

          {/* Center Flag Stripes Band */}
          <g transform="translate(24, 43)">
            <rect x="0" y="0" width="52" height="3" fill="#DC2626" rx="0.5" />
            <rect x="0" y="3" width="52" height="3" fill="#FFFFFF" rx="0.5" />
            <rect x="0" y="6" width="52" height="3" fill="#DC2626" rx="0.5" />
            <rect x="0" y="9" width="52" height="3" fill="#FFFFFF" rx="0.5" />
            <rect x="0" y="12" width="52" height="3" fill="#DC2626" rx="0.5" />
          </g>

          {/* Lone Star Canton & Star */}
          <rect x="24" y="43" width="16" height="15" fill="#1E40AF" stroke="#FFFFFF" strokeWidth="0.8" rx="1" />
          {/* White Five-Pointed Star of Liberia */}
          <polygon
            points="32,45 34,49.5 39,49.5 35,52.5 36.5,57 32,54 27.5,57 29,52.5 25,49.5 30,49.5"
            fill="#FFFFFF"
          />

          {/* United Youth Silhouettes standing in solidarity */}
          <g transform="translate(38, 22)">
            {/* Person 1 Left */}
            <circle cx="10" cy="5" r="2.5" fill="#F59E0B" />
            <path d="M 7,14 C 7,9 13,9 13,14 Z" fill="#F59E0B" />
            {/* Person 2 Center Tall */}
            <circle cx="18" cy="3" r="3" fill="#FFFFFF" />
            <path d="M 14,14 C 14,8 22,8 22,14 Z" fill="#FFFFFF" />
            {/* Person 3 Right */}
            <circle cx="26" cy="5" r="2.5" fill="#F59E0B" />
            <path d="M 23,14 C 23,9 29,9 29,14 Z" fill="#F59E0B" />
          </g>

          {/* Bold FLY Acronym Ribbon */}
          <rect x="36" y="64" width="28" height="10" rx="3" fill="#FFFFFF" stroke="#003366" strokeWidth="1.2" />
          <text x="50" y="72" fontSize="7.5" fontWeight="900" fill="#003366" textAnchor="middle" letterSpacing="0.8">
            FLY
          </text>
        </svg>
      </div>

      {!iconOnly && (
        <div className="flex flex-col leading-tight">
          <span className={`text-xs font-black tracking-tight ${light ? 'text-white' : 'text-slate-900'}`}>
            Federation of Liberian Youth
          </span>
          <span className="text-[10px] font-bold text-blue-700">
            FLY • National Youth Umbrella
          </span>
          <span className="text-[9px] font-medium text-slate-500">
            Est. 1974 • Youth Partner
          </span>
        </div>
      )}
    </div>
  );
};

/**
 * Horizontal Partner Bar
 * Shows all 4 partnering institutions clearly with full labels and visual consistency
 */
export const PartnerBar: React.FC<{ className?: string }> = ({ className = '' }) => {
  return (
    <div className={`bg-white border border-slate-200/90 rounded-2xl p-4 sm:p-5 shadow-xs ${className}`}>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 mb-3 border-b border-slate-100">
        <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
          Official Safeguarding & Implementing Partners
        </span>
        <span className="text-[10px] font-semibold text-emerald-800 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200/60 self-start sm:self-auto">
          AMEU SafeSpace Coalition • Camp Johnson Road
        </span>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 items-center">
        <div className="p-2 rounded-xl hover:bg-slate-50 transition-colors">
          <AMEUUniversityLogo />
        </div>
        <div className="p-2 rounded-xl hover:bg-slate-50 transition-colors">
          <CareerLaunchpadLogo />
        </div>
        <div className="p-2 rounded-xl hover:bg-slate-50 transition-colors">
          <MinistryOfJusticeLogo />
        </div>
        <div className="p-2 rounded-xl hover:bg-slate-50 transition-colors">
          <FLYLogo />
        </div>
      </div>
    </div>
  );
};
