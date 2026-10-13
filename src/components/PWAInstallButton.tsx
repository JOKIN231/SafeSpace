import React, { useState } from 'react';
import { Download, Smartphone, X } from 'lucide-react';
import { usePWAInstall } from '../hooks/usePWAInstall';

export const PWAInstallButton: React.FC<{ compact?: boolean }> = ({ compact = true }) => {
  const { isInstallable, isInstalled, isIOS, install } = usePWAInstall();
  const [showIOSGuide, setShowIOSGuide] = useState(false);

  // If already installed, hide the button
  if (isInstalled) {
    return null;
  }

  // Chromium / Android / Desktop prompt - reduced to a sleek, minimal button
  if (isInstallable) {
    return (
      <button
        onClick={install}
        className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] font-semibold text-emerald-800 bg-emerald-50 hover:bg-emerald-100/90 border border-emerald-300/60 shadow-2xs active:scale-95 transition-all cursor-pointer"
        title="Install AMEU SafeSpace App"
      >
        <Download className="w-3.5 h-3.5 text-emerald-700 shrink-0" />
        <span>Install App</span>
      </button>
    );
  }

  // iOS Safari prompt - reduced to a sleek, minimal button
  if (isIOS) {
    return (
      <>
        <button
          onClick={() => setShowIOSGuide(true)}
          className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] font-semibold text-emerald-800 bg-emerald-50 hover:bg-emerald-100/90 border border-emerald-300/60 shadow-2xs active:scale-95 transition-all cursor-pointer"
          title="Add AMEU SafeSpace to Home Screen"
        >
          <Smartphone className="w-3.5 h-3.5 text-emerald-700 shrink-0" />
          <span>Add to Home</span>
        </button>

        {showIOSGuide && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
            <div className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-2xl border border-slate-100 animate-in fade-in zoom-in-95 duration-200">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <h3 className="text-base font-bold text-slate-900">Install on iPhone / iPad</h3>
                <button
                  onClick={() => setShowIOSGuide(false)}
                  className="rounded-lg p-1 text-slate-400 hover:text-slate-600"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="mt-4 space-y-3 text-xs sm:text-sm text-slate-600">
                <div className="flex items-start gap-3">
                  <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-[10px] font-bold text-emerald-800">
                    1
                  </div>
                  <p>
                    Tap the <strong>Share</strong> button at the bottom of Safari.
                  </p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-[10px] font-bold text-emerald-800">
                    2
                  </div>
                  <p>
                    Scroll down and tap <strong>Add to Home Screen</strong>.
                  </p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-[10px] font-bold text-emerald-800">
                    3
                  </div>
                  <p>
                    Tap <strong>Add</strong> in the top-right corner to launch SafeSpace like an app.
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowIOSGuide(false)}
                className="mt-5 w-full rounded-xl bg-emerald-800 py-2.5 text-xs sm:text-sm font-semibold text-white hover:bg-emerald-900 cursor-pointer"
              >
                Got It
              </button>
            </div>
          </div>
        )}
      </>
    );
  }

  return null;
};
