import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Search,
  X,
  ShieldAlert,
  HeartHandshake,
  FileText,
  PhoneCall,
  Download,
  ExternalLink,
  ArrowRight,
  ShieldCheck,
  Smartphone,
  Lock,
  Sparkles,
  HelpCircle,
} from 'lucide-react';

export interface SearchItem {
  id: string;
  title: string;
  description: string;
  category: 'Guidelines' | 'Emergency & Support' | 'Articles & Safety' | 'Quick Actions';
  icon: React.ElementType;
  tab: string;
  badge?: string;
  actionDetails?: string;
}

const SEARCH_DATABASE: SearchItem[] = [
  // Guidelines
  {
    id: 'report-anon',
    title: 'How to Report Anonymously',
    description: 'Learn how to submit an incident report with zero personal identifiers, no name, and complete privacy.',
    category: 'Guidelines',
    icon: ShieldCheck,
    tab: 'report',
    badge: '100% Confidential',
  },
  {
    id: 'evidence-preservation',
    title: 'Preserving Screenshot Evidence',
    description: 'Step-by-step instructions for capturing uncropped chat evidence with timestamps, sender phone numbers, and handles.',
    category: 'Guidelines',
    icon: Smartphone,
    tab: 'support',
    badge: 'Best Practice',
  },
  {
    id: 'reporting-process',
    title: 'Step-by-Step Reporting Guidelines',
    description: 'Walkthrough of what happens after submitting a report, case triage, and anonymous reference codes.',
    category: 'Guidelines',
    icon: FileText,
    tab: 'report',
  },
  {
    id: 'privacy-policy',
    title: 'Privacy Policy & Data Security',
    description: 'Details on our zero-telemetry policy, encrypted storage, and authorized counselor-only access.',
    category: 'Guidelines',
    icon: Lock,
    tab: 'privacy',
  },

  // Emergency & Support
  {
    id: 'emergency-contacts',
    title: 'Emergency Contacts & Campus Security',
    description: 'Direct dispatch for AMEU Security (+231 77 000 2638), Liberia Police 911, and National GBV Helpline 2883.',
    category: 'Emergency & Support',
    icon: PhoneCall,
    tab: 'support',
    badge: '24/7 Available',
  },
  {
    id: 'peer-counseling',
    title: 'Confidential Peer Counseling',
    description: 'Connect with trained, authorized AMEU peer counselors for emotional and academic psychosocial support.',
    category: 'Emergency & Support',
    icon: HeartHandshake,
    tab: 'support',
  },
  {
    id: 'grounding-exercises',
    title: 'Mental Health & Grounding Exercises',
    description: 'Trauma-informed 5-4-3-2-1 calming technique and slow breathing for acute anxiety, panic, or overwhelm.',
    category: 'Emergency & Support',
    icon: HeartHandshake,
    tab: 'support',
    badge: 'Wellness',
  },

  // Articles & Safety
  {
    id: 'whatsapp-harassment',
    title: 'WhatsApp Class Group Harassment',
    description: 'Guide on handling toxic student group chats, stopping unauthorized group adds, and blocking harassers.',
    category: 'Articles & Safety',
    icon: Smartphone,
    tab: 'support',
  },
  {
    id: 'cyberbullying-types',
    title: 'Recognizing Cyberbullying Types',
    description: 'Learn about doxxing, impersonation, flaming, exclusion, cyberstalking, and non-consensual image sharing.',
    category: 'Articles & Safety',
    icon: ShieldAlert,
    tab: 'about',
  },
  {
    id: 'liberian-cyber-laws',
    title: 'Liberian Cyber Harassment Laws',
    description: 'Overview of national legal frameworks, Penal Code cyber harassment provisions, and Ministry of Justice guidelines.',
    category: 'Articles & Safety',
    icon: FileText,
    tab: 'about',
    badge: 'Legal',
  },

  // Quick Actions
  {
    id: 'action-file-report',
    title: 'File an Incident Report Now',
    description: 'Open the secure 3-step reporting form to document harassment for yourself or a fellow student.',
    category: 'Quick Actions',
    icon: ShieldAlert,
    tab: 'report',
    badge: 'Action',
  },
  {
    id: 'action-download-app',
    title: 'Install Free SafeSpace App (PWA)',
    description: 'Tutorial guide on adding SafeSpace to your Home Screen on Android, iPhone, Mac, or Windows.',
    category: 'Quick Actions',
    icon: Download,
    tab: 'home',
    badge: 'Install',
  },
  {
    id: 'action-about-initiative',
    title: 'About AMEU SafeSpace & Partners',
    description: 'Learn about the partnership with Career Launchpad Liberia, Ministry of Justice, and Federation of Liberian Youth.',
    category: 'Quick Actions',
    icon: HelpCircle,
    tab: 'about',
  },
];

interface GlobalSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (tab: string) => void;
}

export const GlobalSearchModal: React.FC<GlobalSearchModalProps> = ({
  isOpen,
  onClose,
  onNavigate,
}) => {
  const [query, setQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
    } else {
      setQuery('');
      setSelectedCategory('All');
    }
  }, [isOpen]);

  // Keyboard navigation & Esc to close
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  const categories = ['All', 'Guidelines', 'Emergency & Support', 'Articles & Safety', 'Quick Actions'];

  const filteredResults = SEARCH_DATABASE.filter((item) => {
    const matchesCategory = selectedCategory === 'All' || item.category === selectedCategory;
    if (!matchesCategory) return false;

    if (!query.trim()) return true;

    const q = query.toLowerCase();
    return (
      item.title.toLowerCase().includes(q) ||
      item.description.toLowerCase().includes(q) ||
      item.category.toLowerCase().includes(q)
    );
  });

  const handleSelect = (tab: string) => {
    onNavigate(tab);
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-start justify-center pt-12 sm:pt-20 px-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-slate-950/70 backdrop-blur-xs cursor-pointer"
          />

          {/* Search Card Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -16 }}
            transition={{ type: 'spring', damping: 28, stiffness: 350 }}
            className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden z-10 flex flex-col max-h-[82vh]"
            role="dialog"
            aria-modal="true"
            aria-label="Global SafeSpace Search"
          >
            {/* Search Input Bar */}
            <div className="p-4 sm:p-5 border-b border-slate-100 flex items-center gap-3 bg-white">
              <Search className="w-5 h-5 text-emerald-700 shrink-0" />
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search resources, articles, guidelines, hotlines..."
                className="w-full text-base sm:text-lg text-slate-900 placeholder:text-slate-400 bg-transparent outline-hidden font-medium"
              />
              {query && (
                <button
                  onClick={() => setQuery('')}
                  className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 cursor-pointer"
                  title="Clear query"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
              <button
                onClick={onClose}
                className="px-2.5 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 text-xs font-bold transition-colors cursor-pointer shrink-0"
              >
                Esc
              </button>
            </div>

            {/* Category Filter Chips */}
            <div className="px-4 py-2 bg-slate-50 border-b border-slate-100 flex items-center gap-1.5 overflow-x-auto no-scrollbar shrink-0">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3 py-1 rounded-xl text-xs font-bold transition-all shrink-0 cursor-pointer ${
                    selectedCategory === cat
                      ? 'bg-emerald-800 text-white shadow-2xs'
                      : 'bg-white text-slate-600 border border-slate-200 hover:border-emerald-300 hover:text-emerald-900'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Search Results List */}
            <div className="flex-1 overflow-y-auto p-3 sm:p-4 divide-y divide-slate-100">
              {filteredResults.length > 0 ? (
                filteredResults.map((item) => {
                  const Icon = item.icon;
                  return (
                    <button
                      key={item.id}
                      onClick={() => handleSelect(item.tab)}
                      className="w-full text-left p-3 sm:p-3.5 rounded-2xl hover:bg-emerald-50/70 transition-all group flex items-start gap-3.5 cursor-pointer"
                    >
                      <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center shrink-0 group-hover:bg-emerald-800 group-hover:text-white transition-colors mt-0.5">
                        <Icon className="w-4 h-4" />
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <h4 className="text-sm font-bold text-slate-900 group-hover:text-emerald-900 transition-colors">
                            {item.title}
                          </h4>
                          {item.badge && (
                            <span className="px-1.5 py-0.5 rounded-md bg-emerald-100 text-emerald-800 text-[10px] font-black uppercase tracking-wider">
                              {item.badge}
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-slate-500 mt-0.5 line-clamp-2 leading-relaxed">
                          {item.description}
                        </p>
                        <span className="inline-block mt-1 text-[11px] font-semibold text-slate-400 group-hover:text-emerald-700 transition-colors">
                          {item.category} • Tap to view
                        </span>
                      </div>

                      <ArrowRight className="w-4 h-4 text-slate-300 group-hover:text-emerald-700 group-hover:translate-x-1 transition-all shrink-0 mt-2.5" />
                    </button>
                  );
                })
              ) : (
                <div className="py-12 text-center space-y-2">
                  <HelpCircle className="w-10 h-10 text-slate-300 mx-auto" />
                  <p className="text-sm font-bold text-slate-700">No resources found for "{query}"</p>
                  <p className="text-xs text-slate-500 max-w-sm mx-auto">
                    Try searching for "anonymous", "whatsapp", "screenshot", "hotline", or "counselor".
                  </p>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="p-3 bg-slate-50 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500 shrink-0">
              <span className="flex items-center gap-1.5 font-medium">
                <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
                AMEU SafeSpace Quick Finder
              </span>
              <span>Press <kbd className="px-1.5 py-0.5 bg-white border border-slate-200 rounded text-[11px] font-mono">Esc</kbd> to exit</span>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
