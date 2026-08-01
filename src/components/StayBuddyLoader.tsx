import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Building2, Sparkles, Compass, Key, Star, ShieldCheck, 
  Zap, Award, MapPin, CheckCircle2, HeartHandshake, Waves
} from "lucide-react";

interface StayBuddyLoaderProps {
  message?: string;
  subtext?: string;
}

const STEPS = [
  {
    title: "গ্লোবাল সার্ভারে কানেক্ট করা হচ্ছে...",
    titleEn: "Connecting to StayBuddy Network...",
    icon: Compass,
    badge: "NETWORK",
    color: "from-cyan-500 to-blue-500"
  },
  {
    title: "ভেরিফাইড ফাইভ স্টার হোটেল ও স্যুট খোঁজা হচ্ছে...",
    titleEn: "Searching 5-Star Verified Stays & Luxury Suites...",
    icon: Building2,
    badge: "VERIFIED",
    color: "from-rose-500 to-pink-500"
  },
  {
    title: "বেস্ট ডিসকাউন্ট ও স্পেশাল অফার ফিল্টার করা হচ্ছে...",
    titleEn: "Applying Best Rates & Up to 50% Flash Sale Discounts...",
    icon: Zap,
    badge: "OFFERS",
    color: "from-amber-400 to-orange-500"
  },
  {
    title: "স্মার্ট AI এক্সপেরিয়েন্স ও সার্ভিস তৈরি হচ্ছে...",
    titleEn: "Personalizing Your Stay Experience...",
    icon: Sparkles,
    badge: "READY",
    color: "from-emerald-400 to-teal-500"
  }
];

const FLOATING_FEATURES = [
  { icon: ShieldCheck, text: "100% Verified Stays", pos: "top-16 left-8 md:left-24", delay: 0 },
  { icon: Zap, text: "Instant Confirmation", pos: "top-28 right-6 md:right-24", delay: 1.5 },
  { icon: Award, text: "Best Price Guarantee", pos: "bottom-24 left-6 md:left-28", delay: 3 },
  { icon: Star, text: "Premium 5-Star Comfort", pos: "bottom-16 right-8 md:right-28", delay: 4.5 }
];

export const StayBuddyLoader: React.FC<StayBuddyLoaderProps> = ({
  message,
  subtext = "StayBuddy Luxury Hotel & Resort Network"
}) => {
  const [progress, setProgress] = useState(0);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);

  // Ultra-fast responsive progress counter (0 -> 100 in ~300ms)
  useEffect(() => {
    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(timer);
          return 100;
        }
        const diff = Math.floor(Math.random() * 12) + 12;
        return Math.min(prev + diff, 100);
      });
    }, 25);

    return () => clearInterval(timer);
  }, []);

  // Fast step switching sync with progress
  useEffect(() => {
    if (progress < 25) setCurrentStepIndex(0);
    else if (progress < 55) setCurrentStepIndex(1);
    else if (progress < 80) setCurrentStepIndex(2);
    else setCurrentStepIndex(3);
  }, [progress]);

  const currentStep = STEPS[currentStepIndex];
  const StepIcon = currentStep.icon;

  return (
    <div className="relative min-h-screen w-full flex flex-col items-center justify-center overflow-hidden bg-[#071318] text-white select-none">
      
      {/* ═══════════ AURORA BACKGROUND GRADIENT ORBS ═══════════ */}
      <motion.div
        animate={{
          scale: [1, 1.3, 1],
          opacity: [0.25, 0.5, 0.25],
          rotate: [0, 45, 0],
        }}
        transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
        className="absolute -top-32 -left-32 w-[34rem] h-[34rem] bg-gradient-to-r from-emerald-600/30 to-teal-500/20 rounded-full blur-[140px] pointer-events-none"
      />
      <motion.div
        animate={{
          scale: [1.3, 1, 1.3],
          opacity: [0.3, 0.6, 0.3],
          rotate: [0, -45, 0],
        }}
        transition={{ duration: 14, repeat: Infinity, ease: "easeInOut" }}
        className="absolute -bottom-32 -right-32 w-[38rem] h-[38rem] bg-gradient-to-r from-rose-600/30 to-amber-500/20 rounded-full blur-[150px] pointer-events-none"
      />

      {/* Central Radar Pulse Web */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-20">
        {[200, 360, 520, 680].map((size, idx) => (
          <motion.div
            key={idx}
            animate={{
              scale: [0.95, 1.05, 0.95],
              opacity: [0.2, 0.4, 0.2]
            }}
            transition={{ duration: 4 + idx * 2, repeat: Infinity, ease: "easeInOut" }}
            style={{ width: size, height: size }}
            className="absolute rounded-full border border-teal-500/30 border-dashed"
          />
        ))}
      </div>

      {/* ═══════════ FLOATING FEATURE CARDS ═══════════ */}
      <div className="absolute inset-0 max-w-6xl mx-auto pointer-events-none hidden sm:block">
        {FLOATING_FEATURES.map((feat, idx) => {
          const IconComp = feat.icon;
          return (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              animate={{
                opacity: [0.4, 0.85, 0.4],
                y: [-10, 10, -10],
              }}
              transition={{
                duration: 6,
                repeat: Infinity,
                delay: feat.delay,
                ease: "easeInOut",
              }}
              className={`absolute ${feat.pos} flex items-center gap-2.5 px-4 py-2 rounded-2xl bg-white/[0.04] backdrop-blur-md border border-white/10 shadow-xl`}
            >
              <div className="p-1.5 rounded-xl bg-gradient-to-br from-rose-500/20 to-teal-500/20 text-teal-300">
                <IconComp className="w-4 h-4" />
              </div>
              <span className="text-xs font-semibold text-slate-200 tracking-wide">
                {feat.text}
              </span>
            </motion.div>
          );
        })}
      </div>

      {/* ═══════════ FLOATING SPARKLE PARTICLES ═══════════ */}
      {[...Array(12)].map((_, i) => (
        <motion.div
          key={i}
          initial={{
            opacity: 0,
            y: 60,
            x: (i - 6) * 70 + (Math.random() * 40 - 20),
            scale: 0.4,
          }}
          animate={{
            opacity: [0, 0.9, 0],
            y: [-30, -180],
            scale: [0.4, 1.2, 0.2],
          }}
          transition={{
            duration: 4 + (i % 4),
            repeat: Infinity,
            delay: i * 0.4,
            ease: "easeOut",
          }}
          className="absolute pointer-events-none"
        >
          <Sparkles className="w-4 h-4 text-amber-300/80 drop-shadow-[0_0_8px_rgba(245,158,11,0.8)]" />
        </motion.div>
      ))}

      {/* ═══════════ CENTRAL HOLOGRAPHIC BADGE ═══════════ */}
      <div className="relative z-10 flex flex-col items-center max-w-lg px-6 text-center">
        
        {/* Holographic Glowing Ring Container */}
        <div className="relative flex items-center justify-center w-44 h-44 mb-8">
          
          {/* Outer Pulsing Wave Rings */}
          <motion.div
            animate={{ scale: [1, 1.25, 1], opacity: [0.6, 0, 0.6] }}
            transition={{ duration: 2.5, repeat: Infinity, ease: "easeOut" }}
            className="absolute inset-0 rounded-full border-2 border-rose-500/40"
          />
          <motion.div
            animate={{ scale: [1, 1.4, 1], opacity: [0.4, 0, 0.4] }}
            transition={{ duration: 2.5, repeat: Infinity, delay: 0.5, ease: "easeOut" }}
            className="absolute inset-0 rounded-full border border-teal-400/40"
          />

          {/* Rotating Dual Gradient Rings */}
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
            className="absolute inset-1 rounded-full p-[2px] bg-gradient-to-r from-rose-500 via-amber-400 via-emerald-400 to-teal-500 opacity-90 shadow-[0_0_25px_rgba(244,63,94,0.4)]"
          />
          <motion.div
            animate={{ rotate: -360 }}
            transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
            className="absolute inset-3 rounded-full p-[2px] bg-gradient-to-r from-teal-400 via-cyan-300 to-rose-400 opacity-70"
          />

          {/* Orbiting Satellite Dot */}
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
            className="absolute inset-0 rounded-full pointer-events-none"
          >
            <div className="w-3.5 h-3.5 bg-amber-300 rounded-full shadow-[0_0_12px_#f59e0b] -top-1.5 left-1/2 -translate-x-1/2 absolute" />
          </motion.div>

          {/* Glassmorphic Core Badge */}
          <div className="absolute inset-[10px] bg-slate-900/85 backdrop-blur-2xl rounded-full flex flex-col items-center justify-center border border-white/15 shadow-2xl shadow-teal-500/20">
            <motion.div
              animate={{
                scale: [0.94, 1.06, 0.94],
              }}
              transition={{ duration: 2.8, repeat: Infinity, ease: "easeInOut" }}
              className="relative p-4 rounded-full bg-gradient-to-br from-rose-500/15 via-teal-500/15 to-amber-500/15 border border-white/10 shadow-inner"
            >
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentStepIndex}
                  initial={{ opacity: 0, scale: 0.6, rotate: -20 }}
                  animate={{ opacity: 1, scale: 1, rotate: 0 }}
                  exit={{ opacity: 0, scale: 0.6, rotate: 20 }}
                  transition={{ duration: 0.3 }}
                >
                  <StepIcon className="w-12 h-12 text-teal-300 drop-shadow-[0_0_15px_rgba(45,212,191,0.8)]" />
                </motion.div>
              </AnimatePresence>
            </motion.div>

            {/* Percentage Badge */}
            <div className="absolute -bottom-2 bg-slate-950/90 border border-teal-500/40 text-teal-300 font-extrabold text-[11px] px-3 py-0.5 rounded-full shadow-lg backdrop-blur-md tracking-wider">
              {progress}%
            </div>
          </div>
        </div>

        {/* ═══════════ BRAND HEADER ═══════════ */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-center gap-2 mb-3"
        >
          <span className="text-3xl font-black tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-rose-400 via-amber-300 via-teal-300 to-cyan-400 drop-shadow">
            StayBuddy
          </span>
          <span className="text-[10px] font-bold tracking-widest text-rose-300 uppercase bg-rose-500/20 border border-rose-500/40 px-2.5 py-1 rounded-full shadow-sm">
            Luxury Stays
          </span>
        </motion.div>

        {/* ═══════════ STEP TIMELINE DOTS ═══════════ */}
        <div className="flex items-center gap-2 mb-4">
          {STEPS.map((s, idx) => (
            <div
              key={idx}
              className={`h-1.5 rounded-full transition-all duration-500 ${
                idx === currentStepIndex
                  ? "w-8 bg-gradient-to-r " + s.color + " shadow-[0_0_10px_rgba(244,63,94,0.6)]"
                  : idx < currentStepIndex
                  ? "w-2.5 bg-teal-500/60"
                  : "w-2 bg-slate-800"
              }`}
            />
          ))}
        </div>

        {/* ═══════════ DYNAMIC BILINGUAL PHRASE SWITCHER ═══════════ */}
        <div className="h-16 flex flex-col items-center justify-center mb-4">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentStepIndex}
              initial={{ opacity: 0, y: 10, filter: "blur(6px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              exit={{ opacity: 0, y: -10, filter: "blur(6px)" }}
              transition={{ duration: 0.35 }}
              className="space-y-1"
            >
              <p className="text-lg md:text-xl font-bold text-white tracking-wide drop-shadow">
                {message || currentStep.title}
              </p>
              <p className="text-xs font-medium text-slate-400 tracking-wider">
                {currentStep.titleEn}
              </p>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* ═══════════ ADVANCED PROGRESS BAR WITH GLOW TRAIL ═══════════ */}
        <div className="w-72 md:w-80 h-2 bg-slate-900/90 rounded-full overflow-hidden border border-white/10 shadow-inner relative mb-4">
          {/* Shimmer Background Line */}
          <motion.div
            style={{ width: `${progress}%` }}
            transition={{ ease: "easeOut" }}
            className="h-full bg-gradient-to-r from-rose-500 via-amber-400 to-teal-400 rounded-full relative shadow-[0_0_15px_rgba(244,63,94,0.9)]"
          >
            {/* Glowing Leading Head Light */}
            <div className="absolute right-0 top-0 bottom-0 w-3 bg-white rounded-full shadow-[0_0_12px_#ffffff] animate-pulse" />
          </motion.div>
        </div>

        {/* Footer Subtext */}
        <p className="text-[11px] text-slate-400 font-light tracking-wide flex items-center justify-center gap-1.5">
          <Waves className="w-3.5 h-3.5 text-teal-400 animate-pulse" />
          <span>{subtext}</span>
          <span className="text-slate-600">•</span>
          <span className="text-teal-300 font-medium">প্লিজ অপেক্ষা করুন...</span>
        </p>

      </div>
    </div>
  );
};

export default StayBuddyLoader;
