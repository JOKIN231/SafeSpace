import React, { useState, useEffect } from 'react';
import { Menu, X, ShieldAlert, HeartHandshake, Home, Info, Search } from 'lucide-react';
import { SafeSpaceBrandLogo } from './Logos';
import { PWAInstallButton } from './PWAInstallButton';
import { GlobalSearchModal } from './GlobalSearchModal';

interface NavbarProps {
  currentTab: string;
  onNavigate: (tab: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ currentTab, onNavigate }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);

  // Global Ctrl+K / Cmd+K shortcut listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setSearchOpen((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const navLinks = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'report', label: 'Report an Incident', icon: ShieldAlert, highlight: true },
    { id: 'support', label: 'Get Support', icon: HeartHandshake },
    { id: 'about', label: 'About', icon: Info },
  ];

  const handleNav = (id: string) => {
    onNavigate(id);
    setMobileMenuOpen(false);
  };

  return (
    <>
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-emerald-950/10 shadow-xs">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 sm:h-20 gap-3">
            {/* Brand Logo */}
            <button
              onClick={() => handleNav('home')}
              className="flex items-center gap-3 text-left focus:outline-hidden group shrink-0"
            >
              <SafeSpaceBrandLogo />
            </button>

            {/* Desktop Global Search Bar */}
            <div className="hidden lg:flex items-center flex-1 max-w-xs mx-4">
              <button
                type="button"
                onClick={() => setSearchOpen(true)}
                className="w-full flex items-center justify-between gap-2 px-3 py-2 rounded-xl bg-slate-100/90 hover:bg-slate-200/80 text-slate-500 hover:text-slate-800 text-xs font-medium transition-all border border-slate-200/80 cursor-pointer shadow-2xs group"
                title="Search resources, articles, guidelines (Ctrl+K)"
              >
                <div className="flex items-center gap-2 truncate">
                  <Search className="w-3.5 h-3.5 text-emerald-700 shrink-0 group-hover:scale-110 transition-transform" />
                  <span className="truncate">Search resources, articles...</span>
                </div>
                <kbd className="hidden sm:inline-block px-1.5 py-0.5 rounded-md bg-white text-[10px] text-slate-500 font-mono border border-slate-200 font-bold shrink-0">
                  Ctrl K
                </kbd>
              </button>
            </div>

            {/* Desktop Navigation Links */}
            <nav className="hidden md:flex items-center gap-1 sm:gap-2 shrink-0">
              {/* Tablet/Medium screen search icon */}
              <button
                type="button"
                onClick={() => setSearchOpen(true)}
                className="lg:hidden p-2 rounded-xl text-slate-600 hover:text-emerald-800 hover:bg-slate-100 transition-colors cursor-pointer"
                title="Search (Ctrl+K)"
                aria-label="Open global search"
              >
                <Search className="w-4 h-4 text-emerald-800" />
              </button>

              {navLinks.map((link) => {
                const isActive = currentTab === link.id;
                if (link.highlight) {
                  return (
                    <button
                      key={link.id}
                      onClick={() => handleNav(link.id)}
                      className={`ml-1 px-4 py-2 rounded-xl text-sm font-semibold transition-all shadow-xs cursor-pointer ${
                        isActive
                          ? 'bg-emerald-900 text-white shadow-emerald-900/20'
                          : 'bg-emerald-700 hover:bg-emerald-800 text-white shadow-emerald-700/10'
                      }`}
                    >
                      {link.label}
                    </button>
                  );
                }

                return (
                  <button
                    key={link.id}
                    onClick={() => handleNav(link.id)}
                    className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors cursor-pointer ${
                      isActive
                        ? 'text-emerald-900 bg-emerald-50 font-semibold'
                        : 'text-slate-700 hover:text-emerald-800 hover:bg-slate-100/60'
                    }`}
                  >
                    {link.label}
                  </button>
                );
              })}

              <div className="ml-2 pl-2 border-l border-slate-200">
                <PWAInstallButton compact />
              </div>
            </nav>

            {/* Mobile Right Bar: Search + PWA Button + Hamburger */}
            <div className="flex md:hidden items-center gap-1.5">
              <button
                type="button"
                onClick={() => setSearchOpen(true)}
                className="p-2 rounded-lg text-slate-700 hover:text-emerald-800 hover:bg-emerald-50 focus:outline-hidden cursor-pointer"
                aria-label="Search resources"
              >
                <Search className="w-5 h-5 text-emerald-800" />
              </button>
              <PWAInstallButton compact />
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-2 rounded-lg text-slate-700 hover:text-emerald-800 hover:bg-emerald-50 focus:outline-hidden cursor-pointer"
                aria-label="Toggle Navigation Menu"
              >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-200/80 bg-white px-4 pt-3 pb-5 space-y-1 shadow-lg animate-in slide-in-from-top-2 duration-200">
          {navLinks.map((link) => {
            const Icon = link.icon;
            const isActive = currentTab === link.id;
            return (
              <button
                key={link.id}
                onClick={() => handleNav(link.id)}
                className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-left text-sm font-medium transition-all ${
                  link.highlight
                    ? 'bg-emerald-700 text-white font-semibold'
                    : isActive
                    ? 'bg-emerald-50 text-emerald-900 font-semibold'
                    : 'text-slate-700 hover:bg-slate-100'
                }`}
              >
                <Icon className={`w-4 h-4 ${link.highlight ? 'text-white' : 'text-emerald-700'}`} />
                <span>{link.label}</span>
              </button>
            );
          })}

          {/* Mobile Drawer Install App Action */}
          <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
            <span className="text-xs font-bold text-slate-600">Free SafeSpace App</span>
            <PWAInstallButton />
          </div>
        </div>
      )}
    </header>

    <GlobalSearchModal
      isOpen={searchOpen}
      onClose={() => setSearchOpen(false)}
      onNavigate={onNavigate}
    />
  </>
  );
};
