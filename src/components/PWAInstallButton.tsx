import React, { useState } from 'react';
import { Download } from 'lucide-react';
import { usePWAInstall } from '../hooks/usePWAInstall';
import { InstallGuideModal } from './InstallGuideModal';

export const PWAInstallButton: React.FC<{ compact?: boolean }> = () => {
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
        className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] font-semibold text-emerald-800 bg-emerald-50 hover:bg-emerald-100/90 border border-emerald-300/60 shadow-2xs active:scale-95 transition-all cursor-pointer"
        title="Download AMEU SafeSpace App (4-OS Guide)"
      >
        <Download className="w-3.5 h-3.5 text-emerald-700 shrink-0" />
        <span>Download App</span>
      </button>

      <InstallGuideModal
        isOpen={showGuide}
        onClose={() => setShowGuide(false)}
      />
    </>
  );
};
