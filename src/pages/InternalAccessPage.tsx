import React, { useState } from 'react';
import { Lock, Shield, AlertCircle, ArrowLeft, KeyRound } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { SafeSpaceBrandLogo } from '../components/Logos';

interface InternalAccessPageProps {
  onSuccess: () => void;
  onBack: () => void;
}

export const InternalAccessPage: React.FC<InternalAccessPageProps> = ({ onSuccess, onBack }) => {
  const { signIn, isAuthenticated } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // If already authenticated, redirect
  React.useEffect(() => {
    if (isAuthenticated) {
      onSuccess();
    }
  }, [isAuthenticated, onSuccess]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      const res = await signIn(email.trim(), password);
      if (res.success) {
        onSuccess();
      } else {
        setError(res.error || 'Authentication failed. Please verify your credentials.');
      }
    } catch {
      setError('An error occurred during sign-in. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md space-y-6">
        <button
          onClick={onBack}
          className="inline-flex items-center gap-2 text-xs font-semibold text-slate-500 hover:text-slate-800 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Return to Student Portal</span>
        </button>

        <div className="rounded-3xl bg-white border border-slate-200/90 shadow-xl p-8 space-y-6">
          <div className="text-center space-y-3">
            <div className="mx-auto flex justify-center">
              <SafeSpaceBrandLogo iconOnly />
            </div>
            <h1 className="text-2xl font-black text-slate-900 tracking-tight">
              Authorized Access
            </h1>
            <p className="text-xs text-slate-600 leading-relaxed">
              Sign in with your approved account to access the reporting and case-management dashboard.
            </p>
          </div>

          {error && (
            <div className="rounded-xl bg-rose-50 border border-rose-200 p-3.5 text-xs text-rose-800 flex items-start gap-2.5 animate-in fade-in-50">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
                Authorized Email
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="counselor@ame.edu.lr"
                className="w-full rounded-xl border border-slate-300 px-3.5 py-2.5 text-sm text-slate-900 focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600 focus:outline-hidden"
              />
            </div>

            <div className="space-y-1">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
                Password
              </label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full rounded-xl border border-slate-300 px-3.5 py-2.5 text-sm text-slate-900 focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600 focus:outline-hidden"
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full rounded-xl bg-emerald-800 hover:bg-emerald-900 active:scale-98 py-3 text-sm font-bold text-white shadow-md shadow-emerald-800/20 transition-all disabled:opacity-50 flex items-center justify-center gap-2 cursor-pointer"
            >
              <Lock className="w-4 h-4" />
              <span>{isSubmitting ? 'Authenticating...' : 'SIGN IN'}</span>
            </button>
          </form>

          <div className="rounded-xl bg-slate-50 border border-slate-200/80 p-3.5 space-y-1.5 text-xs text-slate-600">
            <div className="flex items-center gap-1.5 font-bold text-slate-800">
              <Shield className="w-4 h-4 text-emerald-700" />
              <span>Restricted University System</span>
            </div>
            <p className="text-[11px] text-slate-500 leading-relaxed">
              Access is strictly restricted to designated AMEU peer counselors and safeguarding administrators with pre-provisioned institutional credentials. All sessions are audited.
            </p>
          </div>

          <div className="pt-2 text-center text-[11px] text-slate-400 flex items-center justify-center gap-1.5">
            <Lock className="w-3.5 h-3.5 text-slate-400" />
            <span>Encrypted transmission • Zero public registration</span>
          </div>
        </div>
      </div>
    </div>
  );
};
