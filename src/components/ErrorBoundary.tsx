import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RefreshCw, Home } from 'lucide-react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('AMEU SafeSpace Uncaught Application Error:', error, errorInfo);
  }

  private handleHardReload = () => {
    try {
      if ('serviceWorker' in navigator) {
        navigator.serviceWorker.getRegistrations().then((registrations) => {
          registrations.forEach((registration) => registration.unregister());
        });
      }
      if ('caches' in window) {
        caches.keys().then((keys) => {
          keys.forEach((key) => caches.delete(key));
        });
      }
      sessionStorage.clear();
    } catch {
      // ignore
    }
    window.location.href = '/';
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4 font-sans text-slate-900">
          <div className="max-w-md w-full bg-white rounded-3xl border border-slate-200/90 shadow-xl p-6 sm:p-8 text-center space-y-5">
            <div className="h-16 w-16 mx-auto rounded-2xl bg-amber-100 flex items-center justify-center text-amber-700 shadow-inner">
              <AlertTriangle className="w-8 h-8" />
            </div>

            <div className="space-y-2">
              <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                Temporary Loading Issue
              </h1>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                The SafeSpace application encountered an unexpected state while loading campus resources. A quick refresh will restore the interface.
              </p>
            </div>

            <div className="pt-2 flex flex-col gap-2.5">
              <button
                onClick={this.handleHardReload}
                className="w-full inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white font-bold text-sm shadow-md transition-all cursor-pointer"
              >
                <RefreshCw className="w-4 h-4" />
                <span>Reload Application</span>
              </button>

              <button
                onClick={() => {
                  this.setState({ hasError: false, error: null });
                  window.location.hash = '';
                }}
                className="w-full inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl border border-slate-300 bg-white hover:bg-slate-50 text-slate-700 font-semibold text-xs transition-all cursor-pointer"
              >
                <Home className="w-4 h-4 text-emerald-700" />
                <span>Return to Home</span>
              </button>
            </div>

            {this.state.error?.message && (
              <p className="text-[10px] text-slate-400 font-mono break-all pt-2 border-t border-slate-100">
                {this.state.error.message}
              </p>
            )}
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
