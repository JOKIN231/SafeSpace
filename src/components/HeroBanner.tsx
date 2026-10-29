import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  ChevronLeft,
  ChevronRight,
  Lock,
  UserCheck,
  Pause,
  Play
} from 'lucide-react';

import heroImg1 from '../assets/images/ameu_students_hero_1791965236517.jpg';
import heroImg2 from '../assets/images/ameu_peer_counseling_1791965255372.jpg';
import heroImg3 from '../assets/images/ameu_digital_safety_1791965274348.jpg';
import heroImg4 from '../assets/images/ameu_friends_walk_campus_1791965333645.jpg';
import heroImg5 from '../assets/images/ameu_counselors_welcome_1791965313941.jpg';

interface SlideItem {
  id: number;
  image: string;
  alt: string;
  captionTitle: string;
  captionSubtitle: string;
  tag: string;
}

const SLIDES: SlideItem[] = [
  {
    id: 0,
    image: heroImg1,
    alt: 'Liberian university students on campus lawn supporting each other',
    captionTitle: 'A Community of Empathy & Respect',
    captionSubtitle: 'AMEU students standing united against digital harassment on campus',
    tag: 'Campus Wellbeing',
  },
  {
    id: 1,
    image: heroImg2,
    alt: 'One-on-one confidential peer counseling session under campus shade trees',
    captionTitle: 'Confidential Peer Listening',
    captionSubtitle: 'Talk privately with trained fellow students who understand your world',
    tag: 'Peer Support',
  },
  {
    id: 2,
    image: heroImg3,
    alt: 'African female university student smiling safely with smartphone in library',
    captionTitle: 'Peace of Mind Online',
    captionSubtitle: 'Safe reporting options without exposing your identity or student ID',
    tag: 'Digital Safety',
  },
  {
    id: 3,
    image: heroImg4,
    alt: 'Cheerful university students walking together through campus breezeway',
    captionTitle: 'Together for Student Welfare',
    captionSubtitle: 'Strong peer networks creating a bully-free collegiate environment',
    tag: 'Solidarity',
  },
  {
    id: 4,
    image: heroImg5,
    alt: 'Trained AMEU peer counselors welcoming students at student center',
    captionTitle: 'Here When You Need Us',
    captionSubtitle: 'Supervised peer counselors ready for confidential check-ins',
    tag: 'AMEU Counselors',
  },
];

const MENTAL_HEALTH_QUOTES = [
  {
    quote: 'Your peace of mind matters. You are never alone on this journey.',
    source: 'AMEU Student Wellbeing',
  },
  {
    quote: 'Speaking up is the first courageous step toward reclaiming your digital peace.',
    source: 'Peer Counseling Unit',
  },
  {
    quote: 'Digital spaces should empower and uplift you, not make you feel unsafe.',
    source: 'Digital Safety Network',
  },
  {
    quote: 'Reaching out for help is not a weakness; it is an act of deep personal courage.',
    source: 'Campus Safeguarding',
  },
  {
    quote: 'One conversation can change everything. AMEU peer counselors are here to listen without judgment.',
    source: 'SafeSpace Mentors',
  },
  {
    quote: 'You have the inherent right to study, connect, and thrive free from online intimidation.',
    source: 'Ministry of Justice Youth Charter',
  },
  {
    quote: 'Take a deep breath: your worth is never defined by malicious online comments.',
    source: 'Mental Health Affirmation',
  },
];

export const HeroBanner: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [quoteIndex, setQuoteIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  // Auto-rotate every 6 seconds
  useEffect(() => {
    if (isPaused) return;

    const interval = setInterval(() => {
      advanceSlide(1);
    }, 6000);

    return () => clearInterval(interval);
  }, [currentIndex, isPaused]);

  const advanceSlide = (direction: number) => {
    setCurrentIndex((prev) => {
      const next = prev + direction;
      if (next < 0) return SLIDES.length - 1;
      if (next >= SLIDES.length) return 0;
      return next;
    });

    setQuoteIndex((prev) => (prev + 1) % MENTAL_HEALTH_QUOTES.length);
  };

  const currentSlide = SLIDES[currentIndex] || SLIDES[0];
  const currentQuote = MENTAL_HEALTH_QUOTES[quoteIndex] || MENTAL_HEALTH_QUOTES[0];

  return (
    <div className="relative mx-auto max-w-md lg:max-w-none select-none">
      <div className="relative overflow-hidden rounded-3xl bg-slate-900 border border-slate-200/80 shadow-lg">
        {/* Main Image Container */}
        <div className="relative h-80 sm:h-96 w-full overflow-hidden bg-slate-950">
          <AnimatePresence mode="sync">
            <motion.div
              key={currentSlide.id}
              initial={{ opacity: 0, scale: 1.03 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              transition={{
                duration: 0.9,
                ease: [0.25, 0.1, 0.25, 1],
              }}
              className="absolute inset-0 h-full w-full"
            >
              <img
                src={currentSlide.image}
                alt={currentSlide.alt}
                className="h-full w-full object-cover object-center filter brightness-95"
                loading="eager"
              />
              {/* Subtle gradient overlays */}
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/85 via-slate-950/30 to-transparent"></div>
            </motion.div>
          </AnimatePresence>

          {/* Top Floating Badge */}
          <div className="absolute top-4 left-4 right-4 flex items-center justify-between gap-2 z-10">
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 text-[11px] font-bold bg-white/95 backdrop-blur-md px-3 py-1 rounded-full text-emerald-900 shadow-sm">
                <Lock className="w-3 h-3 text-emerald-700" />
                <span>Confidential & Protected</span>
              </span>
              <span className="inline-flex items-center gap-1 text-[10px] font-semibold bg-emerald-950/80 text-emerald-200 border border-emerald-700/40 px-2.5 py-1 rounded-full backdrop-blur-md">
                <UserCheck className="w-3 h-3 text-emerald-400" />
                <span>{currentSlide.tag}</span>
              </span>
            </div>
          </div>

          {/* Bottom Slide Title */}
          <div className="absolute bottom-4 left-4 right-4 text-white z-10 space-y-1">
            <h3 className="text-lg sm:text-xl font-bold leading-snug drop-shadow-md text-white">
              {currentSlide.captionTitle}
            </h3>
            <p className="text-xs text-slate-200 line-clamp-1">
              {currentSlide.captionSubtitle}
            </p>
          </div>
        </div>

        {/* Quotes & Subtle Navigation Section */}
        <div className="p-4 sm:p-5 bg-slate-900 text-white border-t border-slate-800 space-y-2.5 relative">
          <div className="min-h-[46px] flex items-center relative overflow-hidden">
            <AnimatePresence mode="wait">
              <motion.div
                key={quoteIndex}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{
                  duration: 0.6,
                  ease: [0.22, 1, 0.36, 1],
                }}
                className="w-full"
              >
                <p className="text-xs sm:text-sm font-medium italic text-slate-200 leading-relaxed">
                  &ldquo;{currentQuote.quote}&rdquo;
                </p>
                <p className="text-[11px] font-medium text-emerald-400 text-right mt-1">
                  — {currentQuote.source}
                </p>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Navigation Controls: Dots, Play/Pause, Prev/Next */}
          <div className="flex items-center justify-between pt-2 border-t border-slate-800/80 text-xs">
            {/* Slide Dots */}
            <div className="flex items-center gap-1.5">
              {SLIDES.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    setCurrentIndex(idx);
                    setQuoteIndex((prev) => (prev + 1) % MENTAL_HEALTH_QUOTES.length);
                  }}
                  className={`h-1.5 rounded-full transition-all duration-300 cursor-pointer ${
                    currentIndex === idx
                      ? 'w-5 bg-emerald-400'
                      : 'w-1.5 bg-slate-700 hover:bg-slate-500'
                  }`}
                  aria-label={`Go to photo ${idx + 1}`}
                />
              ))}
            </div>

            {/* Prev / Next & Pause Controls */}
            <div className="flex items-center gap-1">
              <button
                onClick={() => setIsPaused(!isPaused)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
                title={isPaused ? 'Resume photo rotation' : 'Pause photo rotation'}
                aria-label={isPaused ? 'Resume' : 'Pause'}
              >
                {isPaused ? <Play className="w-3.5 h-3.5" /> : <Pause className="w-3.5 h-3.5" />}
              </button>
              <button
                onClick={() => advanceSlide(-1)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer active:scale-95"
                title="Previous photo"
                aria-label="Previous photo"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                onClick={() => advanceSlide(1)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer active:scale-95"
                title="Next photo"
                aria-label="Next photo"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
