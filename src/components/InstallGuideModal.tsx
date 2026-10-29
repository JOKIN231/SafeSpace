import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  X,
  Smartphone,
  Apple,
  Monitor,
  Laptop,
  Share2,
  PlusSquare,
  MoreVertical,
  Download,
  CheckCircle2,
  ArrowRight,
  ArrowLeft,
  ExternalLink,
  ShieldCheck,
  Check
} from 'lucide-react';
import { usePWAInstall } from '../hooks/usePWAInstall';

export type OSType = 'android' | 'iphone' | 'mac' | 'windows';

interface InstallGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialOS?: OSType;
}

interface OSGuideData {
  id: OSType;
  pageNumber: number;
  label: string;
  subLabel: string;
  icon: React.ElementType;
  badge: string;
  primaryBrowser: string;
  steps: {
    number: number;
    title: string;
    description: string;
    iconTip?: string;
  }[];
  proTip: string;
}

const OS_GUIDES: OSGuideData[] = [
  {
    id: 'android',
    pageNumber: 1,
    label: 'Android',
    subLabel: 'Phone & Tablet',
    icon: Smartphone,
    badge: 'Chrome / Samsung Internet',
    primaryBrowser: 'Google Chrome & Samsung Internet',
    steps: [
      {
        number: 1,
        title: 'Open in Chrome or Samsung Internet',
        description: 'Make sure you are visiting this site in Google Chrome or Samsung Internet on your Android device.',
      },
      {
        number: 2,
        title: 'Tap the Menu Button (⋮)',
        description: 'Tap the three vertical dots (⋮) in the top-right corner of Chrome (or the ☰ menu bar in Samsung Internet).',
        iconTip: 'Look for ⋮ in the top right',
      },
      {
        number: 3,
        title: 'Select "Install app" or "Add to Home screen"',
        description: 'Scroll through the menu options and tap "Install app" (or "Add to Home screen").',
      },
      {
        number: 4,
        title: 'Confirm Installation',
        description: 'Tap "Install" on the pop-up prompt. The AMEU SafeSpace icon will be placed directly on your phone home screen and app tray with zero storage overhead.',
      },
    ],
    proTip: 'SafeSpace launches in full-screen standalone mode without any browser URL bar, keeping your browsing history clean and private.',
  },
  {
    id: 'iphone',
    pageNumber: 2,
    label: 'iPhone & iPad',
    subLabel: 'Apple iOS Safari',
    icon: Apple,
    badge: 'Safari Browser',
    primaryBrowser: 'Apple Safari',
    steps: [
      {
        number: 1,
        title: 'Open in Safari',
        description: 'Ensure you are browsing in Apple Safari (if opened through WhatsApp, Facebook, or Instagram, tap the compass or Safari icon to open in Safari).',
      },
      {
        number: 2,
        title: 'Tap the Share Button',
        description: 'Tap the Share icon at the bottom of the screen (a square with an arrow pointing upward). On iPad, it is located in the top-right toolbar.',
        iconTip: 'Share button (Square with Up arrow)',
      },
      {
        number: 3,
        title: 'Scroll Down and Tap "Add to Home Screen"',
        description: 'Scroll down the list of share actions and select "Add to Home Screen" (with the [+] plus icon).',
      },
      {
        number: 4,
        title: 'Tap "Add" in the Top Right Corner',
        description: 'Confirm the name "AMEU SafeSpace" and tap "Add" in the top-right corner of your screen.',
      },
    ],
    proTip: 'Once added, SafeSpace operates just like a native iOS app with an official icon on your home screen and fast, offline-ready emergency resources.',
  },
  {
    id: 'mac',
    pageNumber: 3,
    label: 'Mac',
    subLabel: 'macOS Safari & Chrome',
    icon: Laptop,
    badge: 'Safari / Chrome on Mac',
    primaryBrowser: 'macOS Safari & Google Chrome',
    steps: [
      {
        number: 1,
        title: 'In Safari: Use "Add to Dock"',
        description: 'In Safari on macOS Sonoma or later, click "File" in the top Mac menu bar, then click "Add to Dock...".',
      },
      {
        number: 2,
        title: 'In Chrome: Click the Address Bar Install Icon',
        description: 'In Google Chrome, look at the right side of the address bar for the desktop install icon (computer with down arrow), or click Menu (⋮) > "Save and share" > "Install AMEU SafeSpace".',
        iconTip: 'Install icon in URL bar',
      },
      {
        number: 3,
        title: 'Confirm and Add',
        description: 'Click "Add" or "Install". A dedicated app shortcut will be created in your Mac Dock, Launchpad, and Applications folder.',
      },
      {
        number: 4,
        title: 'Launch as an Independent Window',
        description: 'SafeSpace now opens as an isolated macOS window, without distraction from your general browser tabs.',
      },
    ],
    proTip: 'You can pin SafeSpace to your macOS Dock for rapid counselor contact and emergency hotline access anytime.',
  },
  {
    id: 'windows',
    pageNumber: 4,
    label: 'Windows',
    subLabel: 'Windows 10 / 11 PC',
    icon: Monitor,
    badge: 'Chrome / Microsoft Edge',
    primaryBrowser: 'Google Chrome & Microsoft Edge',
    steps: [
      {
        number: 1,
        title: 'Open in Chrome or Microsoft Edge',
        description: 'Visit AMEU SafeSpace on your Windows desktop or laptop in either Google Chrome or Microsoft Edge.',
      },
      {
        number: 2,
        title: 'Click the Install Icon in the URL Bar',
        description: 'In the address bar at the top, click the "Install App" icon on the far right (or click the three dots Menu > "Apps" > "Install this site as an app").',
        iconTip: 'Computer/monitor with down arrow',
      },
      {
        number: 3,
        title: 'Click "Install"',
        description: 'In the confirmation dialog, click the blue "Install" button.',
      },
      {
        number: 4,
        title: 'Pin to Windows Taskbar or Start Menu',
        description: 'Check the boxes to "Pin to taskbar" and "Pin to Start" so you can open SafeSpace with a single click from your Windows desktop.',
      },
    ],
    proTip: 'When installed on Windows, SafeSpace runs as a standalone desktop application with high performance and full offline support.',
  },
];

function detectCurrentOS(): OSType {
  if (typeof window === 'undefined') return 'android';
  const ua = window.navigator.userAgent.toLowerCase();
  if (/iphone|ipad|ipod/.test(ua)) return 'iphone';
  if (/android/.test(ua)) return 'android';
  if (/macintosh|mac os x/.test(ua)) return 'mac';
  if (/windows/.test(ua)) return 'windows';
  return 'android';
}

export const InstallGuideModal: React.FC<InstallGuideModalProps> = ({
  isOpen,
  onClose,
  initialOS,
}) => {
  const [selectedOS, setSelectedOS] = useState<OSType>(initialOS || detectCurrentOS());
  const [confirmedAdded, setConfirmedAdded] = useState(false);
  const { isInstallable, install, markAsInstalled } = usePWAInstall();

  // Reset or sync when modal opens
  useEffect(() => {
    if (isOpen) {
      if (initialOS) {
        setSelectedOS(initialOS);
      } else {
        setSelectedOS(detectCurrentOS());
      }
      setConfirmedAdded(false);
    }
  }, [isOpen, initialOS]);

  if (!isOpen) return null;

  const currentGuide = OS_GUIDES.find((g) => g.id === selectedOS) || OS_GUIDES[0];
  const currentIndex = OS_GUIDES.findIndex((g) => g.id === selectedOS);

  const handleNextOS = () => {
    const nextIdx = (currentIndex + 1) % OS_GUIDES.length;
    setSelectedOS(OS_GUIDES[nextIdx].id);
  };

  const handlePrevOS = () => {
    const prevIdx = (currentIndex - 1 + OS_GUIDES.length) % OS_GUIDES.length;
    setSelectedOS(OS_GUIDES[prevIdx].id);
  };

  const handleConfirmAdded = () => {
    markAsInstalled();
    setConfirmedAdded(true);
    setTimeout(() => {
      onClose();
    }, 1500);
  };

  const handleNativeInstall = async () => {
    if (isInstallable) {
      const accepted = await install();
      if (accepted) {
        setConfirmedAdded(true);
        setTimeout(() => {
          onClose();
        }, 1500);
      }
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-slate-950/70 backdrop-blur-xs overflow-y-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          transition={{ type: 'spring', damping: 28, stiffness: 320 }}
          className="w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-emerald-100 overflow-hidden my-auto"
          role="dialog"
          aria-modal="true"
          aria-labelledby="tutorial-guide-title"
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-[#064E32] via-[#0E5C3C] to-[#138A45] text-white p-5 sm:p-6 relative">
            <button
              onClick={onClose}
              className="absolute top-4 right-4 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white/90 transition-colors focus:outline-hidden"
              aria-label="Close guide"
              title="Close guide"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-2 mb-1.5">
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-400/25 text-emerald-100 text-[10px] font-extrabold uppercase tracking-wider ring-1 ring-emerald-300/30">
                Official Add to Home Screen Guide
              </span>
              <span className="text-xs text-emerald-200/90 font-medium">
                Page {currentGuide.pageNumber} of 4
              </span>
            </div>

            <h2 id="tutorial-guide-title" className="text-xl sm:text-2xl font-black tracking-tight text-white">
              How to Add SafeSpace to Home Screen
            </h2>
            <p className="text-xs sm:text-sm text-emerald-100/90 mt-1 max-w-xl leading-relaxed">
              Follow these simple steps to install AMEU SafeSpace as an app on your Android, iPhone, Mac, or Windows computer.
            </p>

            {/* OS Navigation Tabs (4 Pages) */}
            <div className="grid grid-cols-4 gap-1.5 mt-5 p-1 rounded-2xl bg-black/20 backdrop-blur-xs border border-white/10">
              {OS_GUIDES.map((guide) => {
                const Icon = guide.icon;
                const isActive = guide.id === selectedOS;
                return (
                  <button
                    key={guide.id}
                    onClick={() => setSelectedOS(guide.id)}
                    className={`flex flex-col items-center justify-center py-2 px-1 rounded-xl text-center transition-all cursor-pointer ${
                      isActive
                        ? 'bg-white text-[#064E32] font-bold shadow-md shadow-black/10'
                        : 'text-white/80 hover:text-white hover:bg-white/10'
                    }`}
                  >
                    <Icon className="w-4 h-4 mb-0.5" />
                    <span className="text-xs font-bold leading-tight">{guide.label}</span>
                    <span className={`text-[9px] ${isActive ? 'text-[#138A45]' : 'text-emerald-200/70'} hidden sm:block`}>
                      Page {guide.pageNumber}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Guide Page Body */}
          <div className="p-5 sm:p-7 space-y-6 max-h-[68vh] overflow-y-auto">
            {confirmedAdded ? (
              <div className="py-10 text-center space-y-3">
                <div className="w-14 h-14 rounded-full bg-emerald-100 text-[#064E32] mx-auto flex items-center justify-center">
                  <CheckCircle2 className="w-8 h-8 text-[#138A45]" />
                </div>
                <h3 className="text-lg font-bold text-slate-900">Awesome! App Added to Home Screen</h3>
                <p className="text-xs sm:text-sm text-slate-600 max-w-md mx-auto">
                  You can now launch AMEU SafeSpace directly from your home screen anytime with instant, confidential access.
                </p>
              </div>
            ) : (
              <>
                {/* Active OS Header Banner */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-100">
                  <div className="flex items-center gap-2.5">
                    <div className="w-9 h-9 rounded-xl bg-emerald-100 text-[#064E32] flex items-center justify-center font-bold shrink-0">
                      <currentGuide.icon className="w-5 h-5 text-[#064E32]" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="text-base font-extrabold text-slate-900">{currentGuide.label} Tutorial Guide</h3>
                        <span className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-600 text-[10px] font-semibold">
                          Page {currentGuide.pageNumber} of 4
                        </span>
                      </div>
                      <p className="text-xs text-slate-500">Optimized for {currentGuide.primaryBrowser}</p>
                    </div>
                  </div>

                  {/* Android / Windows native prompt button if active and available */}
                  {isInstallable && (selectedOS === 'android' || selectedOS === 'windows') && (
                    <button
                      onClick={handleNativeInstall}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#064E32] hover:bg-[#0E5C3C] text-white text-xs font-bold transition-all shadow-sm shrink-0 cursor-pointer"
                    >
                      <Download className="w-3.5 h-3.5 text-emerald-300" />
                      <span>Trigger 1-Click Install</span>
                    </button>
                  )}
                </div>

                {/* Step by Step List */}
                <div className="space-y-3.5">
                  {currentGuide.steps.map((step) => (
                    <div
                      key={step.number}
                      className="p-3.5 sm:p-4 rounded-2xl bg-slate-50 border border-slate-200/70 hover:border-emerald-300/70 transition-colors flex items-start gap-3.5"
                    >
                      <div className="w-7 h-7 rounded-xl bg-[#064E32] text-white flex items-center justify-center font-black text-xs shrink-0 shadow-xs">
                        {step.number}
                      </div>
                      <div className="flex-1 space-y-1">
                        <div className="flex items-center justify-between">
                          <h4 className="text-xs sm:text-sm font-bold text-slate-900">{step.title}</h4>
                          {step.iconTip && (
                            <span className="text-[10px] font-semibold text-emerald-800 bg-emerald-100/80 px-2 py-0.5 rounded-md border border-emerald-200/50 hidden sm:inline-block">
                              {step.iconTip}
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-slate-600 leading-relaxed">{step.description}</p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Pro Tip Card */}
                <div className="p-3.5 rounded-2xl bg-emerald-50/80 border border-emerald-200/70 flex items-start gap-3">
                  <ShieldCheck className="w-5 h-5 text-[#138A45] shrink-0 mt-0.5" />
                  <div className="space-y-0.5">
                    <span className="text-xs font-bold text-[#064E32]">Why add to Home Screen?</span>
                    <p className="text-xs text-emerald-900/90 leading-relaxed">{currentGuide.proTip}</p>
                  </div>
                </div>

                {/* Footer Controls: Previous OS, Next OS, Done button */}
                <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-slate-100">
                  <div className="flex items-center gap-2 w-full sm:w-auto justify-between sm:justify-start">
                    <button
                      onClick={handlePrevOS}
                      className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
                    >
                      <ArrowLeft className="w-3.5 h-3.5" />
                      <span>Previous OS</span>
                    </button>

                    <button
                      onClick={handleNextOS}
                      className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
                    >
                      <span>Next OS</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <div className="flex items-center gap-2 w-full sm:w-auto">
                    <button
                      onClick={handleConfirmAdded}
                      className="w-full sm:w-auto py-2.5 px-4 rounded-xl bg-[#064E32] hover:bg-[#0E5C3C] text-white text-xs font-bold transition-all shadow-sm cursor-pointer flex items-center justify-center gap-1.5"
                    >
                      <Check className="w-4 h-4 text-emerald-300" />
                      <span>I&apos;ve Added to Home Screen</span>
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
