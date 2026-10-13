import React, { useState } from 'react';
import { Check, Copy, CheckCircle2, Home, HeartHandshake, Shield, Sparkles, Info, Heart } from 'lucide-react';

interface ConfirmationViewProps {
  referenceCode: string;
  isMock?: boolean;
  onHome: () => void;
  onSupport: () => void;
}

export const ConfirmationView: React.FC<ConfirmationViewProps> = ({
  referenceCode,
  isMock = false,
  onHome,
  onSupport,
}) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(referenceCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-8 sm:py-12 animate-in fade-in-50 duration-300">
      <div className="rounded-3xl bg-white border border-emerald-950/10 shadow-2xl p-6 sm:p-10 text-center space-y-6">
        {/* Celebratory Checkmark Icon */}
        <div className="relative mx-auto w-20 h-20 flex items-center justify-center">
          <div className="absolute inset-0 rounded-full bg-emerald-100 animate-ping opacity-25"></div>
          <div className="relative flex h-20 w-20 items-center justify-center rounded-full bg-emerald-600 text-white shadow-lg shadow-emerald-600/30">
            <CheckCircle2 className="w-10 h-10" />
          </div>
        </div>

        {/* Heading & Reassurance */}
        <div className="space-y-2">
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Your report has been received.
          </h1>
          <p className="text-sm sm:text-base text-slate-600 max-w-md mx-auto leading-relaxed">
            Thank you for taking the time to share this information. Your report has been recorded for review by the authorized support team.
          </p>
        </div>

        {/* Reference Code Card */}
        <div className="rounded-2xl bg-emerald-50/80 border-2 border-emerald-200/80 p-5 max-w-md mx-auto space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs uppercase tracking-wider font-bold text-emerald-800">
              Your Report Reference
            </span>
            {isMock && (
              <span className="inline-flex items-center gap-1 text-[10px] font-semibold bg-emerald-200/80 text-emerald-900 px-2 py-0.5 rounded-md">
                <Info className="w-3 h-3" /> Dev Preview
              </span>
            )}
          </div>

          <div className="flex items-center justify-center gap-3">
            <span className="font-mono text-2xl sm:text-3xl font-black text-emerald-950 tracking-wider">
              {referenceCode}
            </span>
            <button
              onClick={handleCopy}
              className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-emerald-700 hover:bg-emerald-800 active:scale-95 text-white text-xs font-semibold shadow-xs transition-all cursor-pointer"
              title="Copy reference code"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-white" />
                  <span>Copied</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5 text-white" />
                  <span>Copy</span>
                </>
              )}
            </button>
          </div>

          {/* Educational Note on Reference Nature */}
          <div className="pt-2 border-t border-emerald-200/60 text-left space-y-1.5">
            <p className="text-[11px] text-emerald-900 leading-normal">
              <strong>Receipt Notice:</strong> This reference serves strictly as an administrative confirmation receipt. It is not an authentication credential, login password, or identity document.
            </p>
            <p className="text-[11px] text-emerald-800/80 leading-normal">
              To protect student safety, reports cannot be viewed or retrieved publicly using this code alone.
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2 max-w-md mx-auto">
          <button
            onClick={onHome}
            className="w-full sm:w-auto flex-1 inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white font-semibold text-sm transition-all cursor-pointer"
          >
            <Home className="w-4 h-4" />
            <span>Return to Home</span>
          </button>
          <button
            onClick={onSupport}
            className="w-full sm:w-auto flex-1 inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl border border-slate-300 bg-white hover:bg-slate-50 text-slate-700 font-semibold text-sm transition-all cursor-pointer"
          >
            <HeartHandshake className="w-4 h-4 text-emerald-700" />
            <span>View Support Resources</span>
          </button>
        </div>

        {/* "You're Not Alone" Uplifting Graphic Card with Student Photography */}
        <div className="mt-8 pt-6 border-t border-slate-100 rounded-3xl bg-emerald-900/5 p-4 sm:p-5 text-left overflow-hidden relative">
          <div className="grid grid-cols-1 sm:grid-cols-12 gap-4 items-center">
            <div className="sm:col-span-4 h-32 rounded-2xl overflow-hidden shadow-sm relative">
              <img
                src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80"
                alt="Student feeling supported and empowered"
                className="w-full h-full object-cover object-top"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-emerald-950/60 to-transparent"></div>
              <div className="absolute bottom-2 left-2 text-[10px] font-bold text-white flex items-center gap-1">
                <Heart className="w-3 h-3 text-emerald-300" /> AMEU Care
              </div>
            </div>

            <div className="sm:col-span-8 space-y-1.5">
              <div className="flex items-center gap-1.5">
                <h3 className="text-base font-extrabold text-slate-900">You're Not Alone.</h3>
                <Sparkles className="w-4 h-4 text-amber-500 animate-pulse" />
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                Reaching out takes courage. Whether you chose to remain anonymous or requested a counselor check-in, our campus community stands with you.
              </p>
              <div className="pt-1 flex items-center gap-2 text-[11px] font-bold text-emerald-700">
                <Shield className="w-3.5 h-3.5" />
                <span>Confidential Safeguarding in Partnership with FLY</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
