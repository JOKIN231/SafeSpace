import React, { useState } from 'react';
import { Menu, X, ShieldAlert, HeartHandshake, Home, Info } from 'lucide-react';
import { SafeSpaceBrandLogo } from './Logos';
import { PWAInstallButton } from './PWAInstallButton';

interface NavbarProps {
  currentTab: string;
  onNavigate: (tab: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ currentTab, onNavigate }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

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
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-emerald-950/10 shadow-xs">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          {/* Brand Logo */}
          <button
            onClick={() => handleNav('home')}
            className="flex items-center gap-3 text-left focus:outline-hidden group"
          >
            <SafeSpaceBrandLogo />
          </button>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-1 sm:gap-2">
            {navLinks.map((link) => {
              const isActive = currentTab === link.id;
              if (link.highlight) {
                return (
                  <button
                    key={link.id}
                    onClick={() => handleNav(link.id)}
                    className={`ml-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all shadow-xs ${
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
                  className={`px-3.5 py-2 rounded-lg text-sm font-medium transition-colors ${
                    isActive
                      ? 'text-emerald-900 bg-emerald-50 font-semibold'
                      : 'text-slate-700 hover:text-emerald-800 hover:bg-slate-100/60'
                  }`}
                >
                  {link.label}
                </button>
              );
            })}

            <div className="ml-3 pl-3 border-l border-slate-200">
              <PWAInstallButton compact />
            </div>
          </nav>

          {/* Mobile Right Bar: PWA Button + Hamburger */}
          <div className="flex md:hidden items-center gap-2">
            <PWAInstallButton compact />
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-slate-700 hover:text-emerald-800 hover:bg-emerald-50 focus:outline-hidden"
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
        </div>
      )}
    </header>
  );
};
