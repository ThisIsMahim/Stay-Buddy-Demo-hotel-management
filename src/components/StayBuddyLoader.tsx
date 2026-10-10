import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Building2, Sparkles, Compass, Zap, Waves
} from "lucide-react";

interface StayBuddyLoaderProps {
  message?: string;
  subtext?: string;
}

const STEPS = [
  {
    title: "Connecting to StayBD National Network...",
    icon: Compass,
    color: "from-slate-600 to-slate-800"
  },
  {
    title: "Searching Verified Stays Across 64 Districts...",
    icon: Building2,
    color: "from-teal-500 to-teal-700"
  },
  {
    title: "Comparing Real-Time Rates & Citizen Budget Options...",
    icon: Zap,
    color: "from-amber-500 to-orange-600"
  },
  {
    title: "Personalizing Your Stay Experience...",
    icon: Sparkles,
    color: "from-indigo-500 to-purple-600"
  }
];

export const StayBuddyLoader: React.FC<StayBuddyLoaderProps> = ({
  message,
  subtext = "StayBD — National Hotel Discovery & Booking Platform"
}) => {
  const [progress, setProgress] = useState(0);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);

  // Ultra-fast responsive progress counter
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
    <div className="relative min-h-screen w-full flex flex-col items-center justify-center overflow-hidden bg-white text-slate-900 select-none">
      
      {/* Central Badge Area */}
      <div className="relative z-10 flex flex-col items-center max-w-lg px-6 text-center">
        
        {/* Minimalist Spinning Ring Container */}
        <div className="relative flex items-center justify-center w-32 h-32 mb-8">
          
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 12, repeat: Infinity, ease: "linear" }}
            className="absolute inset-0 rounded-full border border-slate-200 border-dashed"
          />

          {/* Core Badge */}
          <div className="absolute inset-[15px] bg-white rounded-full flex flex-col items-center justify-center border border-slate-100 shadow-xl shadow-slate-200/50">
            <motion.div
              animate={{ scale: [0.95, 1.05, 0.95] }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
              className="relative p-4 rounded-full bg-slate-50 border border-slate-100"
            >
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentStepIndex}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  transition={{ duration: 0.3 }}
                >
                  <StepIcon className="w-10 h-10 text-slate-800" />
                </motion.div>
              </AnimatePresence>
            </motion.div>

            {/* Percentage Badge */}
            <div className="absolute -bottom-2 bg-slate-900 text-white font-bold text-[11px] px-3 py-0.5 rounded-full shadow-md tracking-wider z-10">
              {progress}%
            </div>
          </div>
        </div>

        {/* ═══════════ BRAND HEADER ═══════════ */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-center gap-2 mb-4"
        >
          <span className="text-3xl font-black tracking-tight text-slate-900">
            STAY<span className="text-emerald-600">BD</span>
          </span>
          <span className="text-[10px] font-bold tracking-widest text-emerald-800 uppercase bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded-full shadow-xs">
            National Platform
          </span>
        </motion.div>

        {/* ═══════════ STEP TIMELINE DOTS ═══════════ */}
        <div className="flex items-center gap-2 mb-6">
          {STEPS.map((s, idx) => (
            <div
              key={idx}
              className={`h-1.5 rounded-full transition-all duration-500 ${
                idx === currentStepIndex
                  ? "w-8 bg-slate-800"
                  : idx < currentStepIndex
                  ? "w-2.5 bg-slate-400"
                  : "w-2 bg-slate-200"
              }`}
            />
          ))}
        </div>

        {/* ═══════════ DYNAMIC PHRASE SWITCHER ═══════════ */}
        <div className="h-12 flex flex-col items-center justify-center mb-6 px-4">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentStepIndex}
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -5 }}
              transition={{ duration: 0.3 }}
            >
              <p className="text-base font-semibold text-slate-700 tracking-wide text-center">
                {message || currentStep.title}
              </p>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* ═══════════ PROGRESS BAR ═══════════ */}
        <div className="w-72 md:w-80 h-1.5 bg-slate-100 rounded-full overflow-hidden relative mb-6">
          <motion.div
            style={{ width: `${progress}%` }}
            transition={{ ease: "easeOut" }}
            className="h-full bg-slate-800 rounded-full relative"
          />
        </div>

        {/* Footer Subtext */}
        <p className="text-[11px] text-slate-500 font-medium tracking-wide flex items-center justify-center gap-1.5">
          <Waves className="w-3.5 h-3.5 text-slate-400 animate-pulse" />
          <span>{subtext}</span>
        </p>

      </div>
    </div>
  );
};

export default StayBuddyLoader;
