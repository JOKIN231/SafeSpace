import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { AuthProvider, useAuth } from './hooks/useAuth';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { OfflineBanner } from './components/OfflineBanner';
import { PWAInstallModal } from './components/PWAInstallModal';
import { LandingPage } from './pages/LandingPage';
import { ReportPage } from './pages/ReportPage';
import { SupportPage } from './pages/SupportPage';
import { AboutPage } from './pages/AboutPage';
import { PrivacyPage } from './pages/PrivacyPage';
import { InternalAccessPage } from './pages/InternalAccessPage';
import { DashboardPage } from './pages/DashboardPage';

function AppContent() {
  const { isAuthenticated, signOut } = useAuth();
  const [currentTab, setCurrentTab] = useState<string>('home');

  // Handle URL hash or path routing for discreet routes like /internal-access
  useEffect(() => {
    const handleUrlRoute = () => {
      const path = window.location.pathname;
      const hash = window.location.hash.replace('#', '');

      if (path.includes('internal-access') || hash === 'internal-access') {
        setCurrentTab('internal-access');
      } else if (path.includes('report') || hash === 'report') {
        setCurrentTab('report');
      } else if (path.includes('support') || hash === 'support') {
        setCurrentTab('support');
      } else if (path.includes('about') || hash === 'about') {
        setCurrentTab('about');
      } else if (path.includes('privacy') || hash === 'privacy') {
        setCurrentTab('privacy');
      }
    };

    handleUrlRoute();
    window.addEventListener('hashchange', handleUrlRoute);
    return () => window.removeEventListener('hashchange', handleUrlRoute);
  }, []);

  const navigateTo = (tab: string) => {
    setCurrentTab(tab);
    window.location.hash = tab;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // If authenticated counselor is on internal-access or dashboard, show DashboardPage
  if (isAuthenticated && (currentTab === 'internal-access' || currentTab === 'dashboard')) {
    return (
      <div className="min-h-screen bg-slate-100 flex flex-col font-sans">
        <OfflineBanner />
        <DashboardPage
          onSignOut={async () => {
            await signOut();
            navigateTo('home');
          }}
          onGoHome={() => navigateTo('home')}
        />
      </div>
    );
  }

  // If user navigated to discreet internal access login
  if (currentTab === 'internal-access') {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
        <OfflineBanner />
        <InternalAccessPage
          onSuccess={() => setCurrentTab('dashboard')}
          onBack={() => navigateTo('home')}
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans text-slate-900">
      <OfflineBanner />
      <PWAInstallModal currentTab={currentTab} />
      <Navbar currentTab={currentTab} onNavigate={navigateTo} />

      <main className="flex-1 overflow-hidden">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentTab}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
          >
            {currentTab === 'home' && <LandingPage onNavigate={navigateTo} />}
            {currentTab === 'report' && (
              <ReportPage
                onHome={() => navigateTo('home')}
                onSupport={() => navigateTo('support')}
              />
            )}
            {currentTab === 'support' && <SupportPage onNavigate={navigateTo} />}
            {currentTab === 'about' && <AboutPage onNavigate={navigateTo} />}
            {currentTab === 'privacy' && <PrivacyPage />}
          </motion.div>
        </AnimatePresence>
      </main>

      <Footer onNavigate={navigateTo} />
    </div>
  );
}

export function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;
