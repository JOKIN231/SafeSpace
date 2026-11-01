import React, { useState } from 'react';
import { Download, Smartphone, Sparkles } from 'lucide-react';
import { usePWAInstall } from '../hooks/usePWAInstall';
import { InstallGuideModal } from './InstallGuideModal';

export const PWAInstallButton: React.FC<{ compact?: boolean }> = ({ compact = false }) => {
  const { isInstalled } = usePWAInstall();
  const [showGuide, setShowGuide] = useState(false);

  // If user already installed or marked standalone, hide button from navbar
  if (isInstalled) {
    return null;
  }

  return (
    <>
      <button
        onClick={() => setShowGuide(true)}
        className="group relative inline-flex items-center gap-2 px-3 py-1.5 sm:px-3.5 sm:py-2 rounded-xl text-xs font-black text-white bg-gradient-to-r from-emerald-600 via-[#138A45] to-[#064E32] hover:from-emerald-700 hover:to-[#053d27] shadow-md shadow-emerald-900/25 ring-1 ring-emerald-300/40 active:scale-95 transition-all cursor-pointer overflow-hidden"
        title="Download AMEU SafeSpace App (Free for Android, iPhone, Mac, Windows)"
      >
        {/* Shimmer light effect */}
        <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full duration-1000 bg-gradient-to-r from-transparent via-white/20 to-transparent transition-transform" />

        {/* Pulsing indicator */}
        <span className="relative flex h-2 w-2 shrink-0">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-300 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-300"></span>
        </span>

        <Smartphone className="w-3.5 h-3.5 text-emerald-100 shrink-0 group-hover:scale-110 transition-transform" />
        <span className="tracking-tight">Download App</span>

        <span className="hidden sm:inline-flex px-1.5 py-0.2 rounded-md bg-white/20 text-emerald-100 text-[10px] font-extrabold uppercase tracking-wide">
          Free
        </span>
      </button>

      {/* 4-Page OS Tutorial Guide Modal (Portaled to document.body at z-[99999]) */}
      <InstallGuideModal
        isOpen={showGuide}
        onClose={() => setShowGuide(false)}
      />
    </>
  );
};
