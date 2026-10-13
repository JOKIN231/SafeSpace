import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Shuffle,
  ChevronLeft,
  ChevronRight,
  Heart,
  Sparkles,
  Lock,
  UserCheck,
  Pause,
  Play
} from 'lucide-react';

import heroImg1 from '../assets/images/liberian_students_hero_1791895133515.jpg';
import heroImg2 from '../assets/images/peer_counseling_support_1791895153439.jpg';
import heroImg3 from '../assets/images/digital_safety_phone_1791895170634.jpg';
import heroImg4 from '../assets/images/liberian_friends_walk_1791895190189.jpg';
import heroImg5 from '../assets/images/counselors_welcome_1791895210046.jpg';

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
    source: 'Digital Safety Initiative',
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
  const [isTransitioning, setIsTransitioning] = useState(false);

  // Auto-rotate every 6 seconds with a 1-second transition
  useEffect(() => {
    if (isPaused) return;

    const interval = setInterval(() => {
      advanceSlide(1);
    }, 6000);

    return () => clearInterval(interval);
  }, [currentIndex, isPaused]);

  const advanceSlide = (direction: number) => {
    setIsTransitioning(true);
    setCurrentIndex((prev) => {
      const next = prev + direction;
      if (next < 0) return SLIDES.length - 1;
      if (next >= SLIDES.length) return 0;
      return next;
    });

    setQuoteIndex((prev) => (prev + 1) % MENTAL_HEALTH_QUOTES.length);

    setTimeout(() => {
      setIsTransitioning(false);
    }, 1000); // 1-second transition state
  };

  const randomizeSlide = () => {
    setIsTransitioning(true);
    let nextIdx: number;
    do {
      nextIdx = Math.floor(Math.random() * SLIDES.length);
    } while (nextIdx === currentIndex && SLIDES.length > 1);

    setCurrentIndex(nextIdx);
    setQuoteIndex((prev) => (prev + 1) % MENTAL_HEALTH_QUOTES.length);

    setTimeout(() => {
      setIsTransitioning(false);
    }, 1000);
  };

  const currentSlide = SLIDES[currentIndex];
  const currentQuote = MENTAL_HEALTH_QUOTES[quoteIndex];

  return (
    <div className="relative mx-auto max-w-md lg:max-w-none select-none">
      {/* Decorative ambient glow */}
      <div className="absolute -inset-2 bg-gradient-to-tr from-emerald-600/30 via-teal-500/20 to-emerald-400/20 rounded-3xl blur-xl"></div>

      <div className="relative overflow-hidden rounded-3xl bg-slate-900 border border-emerald-700/40 shadow-2xl">
        {/* Main Image Container with 1.0s Smooth Animation Transition */}
        <div className="relative h-80 sm:h-96 w-full overflow-hidden bg-slate-950">
          <AnimatePresence mode="sync">
            <motion.div
              key={currentSlide.id}
              initial={{ opacity: 0, scale: 1.04 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              transition={{
                duration: 1.0, // EXACT 1-SECOND ANIMATION / TRANSITION
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
              {/* Gradient overlays for contrast */}
              <div className="absolute inset-0 bg-gradient-to-t from-emerald-950 via-emerald-950/45 to-transparent"></div>
              <div className="absolute inset-0 bg-gradient-to-r from-emerald-950/60 via-transparent to-transparent"></div>
            </motion.div>
          </AnimatePresence>

          {/* Top Floating Pill Badges */}
          <div className="absolute top-4 left-4 right-4 flex items-center justify-between gap-2 z-10">
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 text-[11px] font-bold bg-white/95 backdrop-blur-md px-3 py-1 rounded-full text-emerald-900 shadow-md">
                <Lock className="w-3 h-3 text-emerald-700" />
                <span>100% Confidential</span>
              </span>
              <span className="inline-flex items-center gap-1 text-[10px] font-bold bg-emerald-900/90 text-emerald-200 border border-emerald-600/50 px-2.5 py-1 rounded-full shadow-md backdrop-blur-md">
                <UserCheck className="w-3 h-3 text-emerald-400" />
                <span>{currentSlide.tag}</span>
              </span>
            </div>

            {/* Randomize / Shuffle Button */}
            <button
              onClick={randomizeSlide}
              title="Randomize Hero Banner Image (1s transition)"
              className="inline-flex items-center gap-1 text-[10px] font-bold bg-black/60 hover:bg-black/80 text-emerald-300 border border-emerald-500/40 px-2.5 py-1 rounded-full backdrop-blur-md transition-all active:scale-90 cursor-pointer"
            >
              <Shuffle className={`w-3 h-3 ${isTransitioning ? 'animate-spin' : ''}`} />
              <span className="hidden sm:inline">Randomize</span>
            </button>
          </div>

          {/* Bottom Slide Title */}
          <div className="absolute bottom-4 left-4 right-4 text-white z-10 space-y-1">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-300 flex items-center gap-1">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                Photo {currentIndex + 1} of {SLIDES.length} • African Youth SafeSpace
              </span>

              {/* Transition status indicator */}
              <span className="text-[10px] text-emerald-200/80 bg-emerald-950/80 px-2 py-0.5 rounded-full border border-emerald-700/50 backdrop-blur-xs font-mono">
                1s Transition
              </span>
            </div>
            <h3 className="text-lg sm:text-xl font-black leading-snug drop-shadow-md text-white">
              {currentSlide.captionTitle}
            </h3>
            <p className="text-xs text-emerald-100/90 line-clamp-1">
              {currentSlide.captionSubtitle}
            </p>
          </div>
        </div>

        {/* Mental Health Quotes Rotating Section (1-Second Synchronized Transition) */}
        <div className="p-4 sm:p-5 bg-emerald-950 text-white border-t border-emerald-800/80 space-y-3 relative">
          <div className="flex items-center justify-between text-xs text-emerald-300 pb-1.5 border-b border-emerald-900/80">
            <div className="flex items-center gap-1.5 font-bold tracking-wide">
              <Heart className="w-3.5 h-3.5 text-rose-400 fill-rose-400" />
              <span>MENTAL HEALTH & WELLBEING AFFIRMATION</span>
            </div>

            <div className="flex items-center gap-1 text-[10px] text-emerald-400">
              <Sparkles className="w-3 h-3 text-amber-300" />
              <span>Rotating Support</span>
            </div>
          </div>

          {/* Animated Quote Container with 1.0s Transition */}
          <div className="min-h-[58px] flex items-center relative overflow-hidden">
            <AnimatePresence mode="wait">
              <motion.div
                key={quoteIndex}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{
                  duration: 1.0, // EXACT 1-SECOND ANIMATION / TRANSITION
                  ease: [0.22, 1, 0.36, 1],
                }}
                className="w-full"
              >
                <p className="text-xs sm:text-sm font-medium italic text-emerald-100 leading-relaxed">
                  &ldquo;{currentQuote.quote}&rdquo;
                </p>
                <p className="text-[11px] font-semibold text-emerald-400 text-right mt-1">
                  — {currentQuote.source}
                </p>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Navigation Controls: Dots, Prev/Next, Play/Pause */}
          <div className="flex items-center justify-between pt-2 border-t border-emerald-900/60 text-xs">
            {/* Indicators */}
            <div className="flex items-center gap-1.5">
              {SLIDES.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    setIsTransitioning(true);
                    setCurrentIndex(idx);
                    setQuoteIndex((prev) => (prev + 1) % MENTAL_HEALTH_QUOTES.length);
                    setTimeout(() => setIsTransitioning(false), 1000);
                  }}
                  className={`h-2 rounded-full transition-all duration-300 cursor-pointer ${
                    currentIndex === idx
                      ? 'w-6 bg-emerald-400'
                      : 'w-2 bg-emerald-800 hover:bg-emerald-600'
                  }`}
                  aria-label={`Go to slide ${idx + 1}`}
                />
              ))}
            </div>

            {/* Prev / Next & Pause Controls */}
            <div className="flex items-center gap-1">
              <button
                onClick={() => setIsPaused(!isPaused)}
                className="p-1.5 rounded-lg text-emerald-300 hover:bg-emerald-900/80 transition-colors cursor-pointer"
                title={isPaused ? 'Resume auto-play' : 'Pause auto-play'}
              >
                {isPaused ? <Play className="w-3.5 h-3.5" /> : <Pause className="w-3.5 h-3.5" />}
              </button>
              <button
                onClick={() => advanceSlide(-1)}
                className="p-1.5 rounded-lg text-emerald-300 hover:bg-emerald-900/80 transition-colors cursor-pointer active:scale-95"
                title="Previous slide"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                onClick={() => advanceSlide(1)}
                className="p-1.5 rounded-lg text-emerald-300 hover:bg-emerald-900/80 transition-colors cursor-pointer active:scale-95"
                title="Next slide"
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
