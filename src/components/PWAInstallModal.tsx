import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Download, Smartphone, X, ShieldCheck, Zap, WifiOff, ArrowRight, BookOpen, Apple, Laptop, Monitor } from 'lucide-react';
import { usePWAInstall } from '../hooks/usePWAInstall';
import { InstallGuideModal, OSType } from './InstallGuideModal';

interface PWAInstallModalProps {
  currentTab: string;
}

function detectOS(): OSType {
  if (typeof window === 'undefined') return 'android';
  const ua = window.navigator.userAgent.toLowerCase();
  if (/iphone|ipad|ipod/.test(ua)) return 'iphone';
  if (/android/.test(ua)) return 'android';
  if (/macintosh|mac os x/.test(ua)) return 'mac';
  if (/windows/.test(ua)) return 'windows';
  return 'android';
}

export const PWAInstallModal: React.FC<PWAInstallModalProps> = ({ currentTab }) => {
  const { isInstalled, markAsInstalled } = usePWAInstall();
  const [isOpen, setIsOpen] = useState(false);
  const [showGuide, setShowGuide] = useState(false);
  const [targetOS, setTargetOS] = useState<OSType>('android');
  const previousTabRef = useRef(currentTab);
  const isInitialMount = useRef(true);

  // 1. Initial trigger: Show after 3 seconds of opening the web app
  useEffect(() => {
    if (isInstalled) return;

    const timer = setTimeout(() => {
      setIsOpen(true);
    }, 3000);

    return () => clearTimeout(timer);
  }, [isInstalled]);

  // 2. Persistent page navigation trigger: Show after user opens any other page
  useEffect(() => {
    if (isInstalled) return;

    if (isInitialMount.current) {
      isInitialMount.current = false;
      previousTabRef.current = currentTab;
      return;
    }

    if (previousTabRef.current !== currentTab) {
      previousTabRef.current = currentTab;
      // Re-trigger popup shortly after navigating to the new page
      const timer = setTimeout(() => {
        setIsOpen(true);
      }, 500);

      return () => clearTimeout(timer);
    }
  }, [currentTab, isInstalled]);

  // If already installed (standalone mode or completed install), never show
  if (isInstalled && !showGuide) {
    return null;
  }

  const handleOpenGuide = (os?: OSType) => {
    setTargetOS(os || detectOS());
    setShowGuide(true);
  };

  const handleManualConfirmed = () => {
    markAsInstalled();
    setIsOpen(false);
    setShowGuide(false);
  };

  return (
    <>
      <AnimatePresence>
        {isOpen && !showGuide && (
          <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-3 sm:p-4 bg-slate-950/60 backdrop-blur-xs">
            <motion.div
              initial={{ opacity: 0, scale: 0.94, y: 30 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ type: 'spring', damping: 26, stiffness: 320 }}
              className="w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-emerald-100 overflow-hidden relative"
              role="dialog"
              aria-modal="true"
              aria-labelledby="pwa-install-title"
            >
              {/* Top decorative gradient header */}
              <div className="bg-gradient-to-r from-[#064E32] via-[#0E5C3C] to-[#138A45] text-white px-6 pt-6 pb-5 relative">
                <button
                  onClick={() => setIsOpen(false)}
                  className="absolute top-4 right-4 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white/90 transition-colors focus:outline-hidden"
                  aria-label="Dismiss for now"
                  title="Dismiss for now"
                >
                  <X className="w-5 h-5" />
                </button>

                <div className="flex items-center gap-3">
                  {/* App Shield Icon */}
                  <div className="w-12 h-12 rounded-2xl bg-white text-[#064E32] flex items-center justify-center shadow-lg ring-2 ring-emerald-300/40 shrink-0">
                    <svg viewBox="0 0 36 36" fill="none" className="w-7 h-7">
                      <path
                        d="M18 4C26 4 30 7 30 7C30 19 26 28 18 32C10 28 6 19 6 7C6 7 10 4 18 4Z"
                        fill="#138A45"
                        stroke="#25A55B"
                        strokeWidth="1.5"
                      />
                      <path
                        d="M18 7C24 7 27 9.5 27 9.5C27 18 24 25.5 18 28.5C12 25.5 9 18 9 9.5C9 9.5 12 7 18 7Z"
                        fill="#064E32"
                      />
                      <path
                        d="M13 18L16.5 21.5L23.5 14.5"
                        stroke="#FFFFFF"
                        strokeWidth="2.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </div>

                  <div>
                    <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-400/20 text-emerald-100 text-[10px] font-bold tracking-wider uppercase ring-1 ring-emerald-300/30">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-300 animate-pulse"></span>
                      Free Home Screen App
                    </div>
                    <h2
                      id="pwa-install-title"
                      className="text-xl sm:text-2xl font-black text-white tracking-tight mt-0.5"
                    >
                      Download the App for Free
                    </h2>
                  </div>
                </div>

                <p className="text-xs sm:text-sm text-emerald-100/90 mt-2.5 leading-relaxed">
                  Click below to open our 4-page tutorial guide showing how to add AMEU SafeSpace to your Android, iPhone, Mac, or Windows home screen.
                </p>
              </div>

              {/* Content Body */}
              <div className="p-5 sm:p-6 space-y-4">
                {/* Highlights Grid */}
                <div className="grid grid-cols-3 gap-2.5">
                  <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100 flex flex-col items-center text-center">
                    <div className="w-8 h-8 rounded-xl bg-emerald-100 text-[#064E32] flex items-center justify-center mb-1.5">
                      <ShieldCheck className="w-4 h-4" />
                    </div>
                    <span className="text-xs font-bold text-slate-900 leading-tight">100% Private</span>
                    <span className="text-[10px] text-slate-500 mt-0.5 leading-tight">No history trace</span>
                  </div>

                  <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100 flex flex-col items-center text-center">
                    <div className="w-8 h-8 rounded-xl bg-emerald-100 text-[#064E32] flex items-center justify-center mb-1.5">
                      <WifiOff className="w-4 h-4" />
                    </div>
                    <span className="text-xs font-bold text-slate-900 leading-tight">Works Offline</span>
                    <span className="text-[10px] text-slate-500 mt-0.5 leading-tight">Hotlines & Guides</span>
                  </div>

                  <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100 flex flex-col items-center text-center">
                    <div className="w-8 h-8 rounded-xl bg-emerald-100 text-[#064E32] flex items-center justify-center mb-1.5">
                      <Zap className="w-4 h-4" />
                    </div>
                    <span className="text-xs font-bold text-slate-900 leading-tight">Instant Open</span>
                    <span className="text-[10px] text-slate-500 mt-0.5 leading-tight">Zero app store fees</span>
                  </div>
                </div>

                {/* Primary Action Button: Takes user to the 4-page tutorial guide */}
                <div className="space-y-2.5 pt-1">
                  <button
                    onClick={() => handleOpenGuide()}
                    className="w-full py-3.5 px-5 rounded-2xl bg-[#064E32] hover:bg-[#0E5C3C] text-white font-bold text-sm shadow-lg shadow-[#064E32]/25 active:scale-98 transition-all flex items-center justify-center gap-2 cursor-pointer group"
                  >
                    <Download className="w-4 h-4 text-emerald-300 group-hover:translate-y-0.5 transition-transform" />
                    <span>Download App &bull; View 4-Page Guide</span>
                    <ArrowRight className="w-4 h-4 opacity-70 group-hover:translate-x-1 transition-transform ml-auto" />
                  </button>

                  {/* Quick Select OS Buttons */}
                  <div className="space-y-1.5">
                    <span className="text-[11px] font-semibold text-slate-500 block text-center">
                      Select your operating system:
                    </span>
                    <div className="grid grid-cols-4 gap-1.5">
                      <button
                        onClick={() => handleOpenGuide('android')}
                        className="py-1.5 px-1 rounded-xl bg-slate-100 hover:bg-emerald-50 hover:text-[#064E32] text-slate-700 text-[11px] font-bold flex flex-col items-center justify-center gap-0.5 border border-slate-200/70 transition-colors cursor-pointer"
                      >
                        <Smartphone className="w-3.5 h-3.5" />
                        <span>Android</span>
                      </button>
                      <button
                        onClick={() => handleOpenGuide('iphone')}
                        className="py-1.5 px-1 rounded-xl bg-slate-100 hover:bg-emerald-50 hover:text-[#064E32] text-slate-700 text-[11px] font-bold flex flex-col items-center justify-center gap-0.5 border border-slate-200/70 transition-colors cursor-pointer"
                      >
                        <Apple className="w-3.5 h-3.5" />
                        <span>iPhone</span>
                      </button>
                      <button
                        onClick={() => handleOpenGuide('mac')}
                        className="py-1.5 px-1 rounded-xl bg-slate-100 hover:bg-emerald-50 hover:text-[#064E32] text-slate-700 text-[11px] font-bold flex flex-col items-center justify-center gap-0.5 border border-slate-200/70 transition-colors cursor-pointer"
                      >
                        <Laptop className="w-3.5 h-3.5" />
                        <span>Mac</span>
                      </button>
                      <button
                        onClick={() => handleOpenGuide('windows')}
                        className="py-1.5 px-1 rounded-xl bg-slate-100 hover:bg-emerald-50 hover:text-[#064E32] text-slate-700 text-[11px] font-bold flex flex-col items-center justify-center gap-0.5 border border-slate-200/70 transition-colors cursor-pointer"
                      >
                        <Monitor className="w-3.5 h-3.5" />
                        <span>Windows</span>
                      </button>
                    </div>
                  </div>

                  <div className="flex items-center justify-between px-1 text-[11px] text-slate-500 pt-1">
                    <span>Free PWA • Official AMEU SafeSpace</span>
                    <button
                      onClick={handleManualConfirmed}
                      className="text-emerald-700 hover:text-emerald-900 font-semibold underline underline-offset-2 cursor-pointer"
                    >
                      Already added? Click here
                    </button>
                  </div>
                </div>

                {/* Dismiss button */}
                <div className="pt-1 text-center">
                  <button
                    onClick={() => setIsOpen(false)}
                    className="text-xs font-medium text-slate-500 hover:text-slate-800 transition-colors py-1 px-3 rounded-lg cursor-pointer"
                  >
                    Continue in browser for now
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* 4-Page OS Tutorial Guide Modal */}
      <InstallGuideModal
        isOpen={showGuide}
        initialOS={targetOS}
        onClose={() => {
          setShowGuide(false);
          setIsOpen(false);
        }}
      />
    </>
  );
};
