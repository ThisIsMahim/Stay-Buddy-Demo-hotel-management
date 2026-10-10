import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Flame, Clock, Tag, Copy, Check, Sparkles, Percent, ShieldCheck, ArrowRight } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";

export const AgodaFlashDeals: React.FC = () => {
  const { i18n } = useTranslation();
  const isBn = i18n.language?.startsWith("bn");

  // 24hr countdown timer calculation
  const [timeLeft, setTimeLeft] = useState({
    hours: 5,
    minutes: 43,
    seconds: 20,
  });

  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev.seconds > 0) {
          return { ...prev, seconds: prev.seconds - 1 };
        } else if (prev.minutes > 0) {
          return { ...prev, minutes: 59, seconds: 59 };
        } else if (prev.hours > 0) {
          return { hours: prev.hours - 1, minutes: 59, seconds: 59 };
        } else {
          return { hours: 12, minutes: 0, seconds: 0 };
        }
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const handleCopy = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2500);
  };

  const formatDigit = (num: number) => num.toString().padStart(2, "0");

  return (
    <section className="py-6 my-4">
      <div className="bg-gradient-to-r from-rose-600 via-rose-500 to-amber-600 rounded-3xl p-6 md:p-8 text-white shadow-xl relative overflow-hidden">
        {/* Ambient background decorations */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-white/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20" />
        <div className="absolute bottom-0 left-1/3 w-64 h-64 bg-amber-400/20 rounded-full blur-2xl pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-6">
          {/* Left Column: Heading & Timer */}
          <div className="flex-1 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-white text-xs font-bold uppercase tracking-wider mb-3">
              <Flame className="w-4 h-4 text-amber-300 animate-bounce" />
              <span>{isBn ? "সীমিত সময়ের সিক্রেট ডিল" : "Agoda-Style 24h Flash Deals"}</span>
            </div>

            <h2 className="text-2xl md:text-3xl lg:text-4xl font-black text-white tracking-tight">
              {isBn ? (
                <>
                  আজকের এক্সক্লুসিভ ছাড় —{" "}
                  <span className="text-amber-200">সর্বোচ্চ ৫০% পর্যন্ত সেভ করুন!</span>
                </>
              ) : (
                <>
                  Exclusive Member Rates —{" "}
                  <span className="text-amber-200">Save Up to 50% Tonight!</span>
                </>
              )}
            </h2>

            <p className="text-white/90 text-xs md:text-sm mt-2 max-w-xl">
              {isBn
                ? "কক্সবাজার, সিলেট ও সাজেকের শীর্ষ ভেরিফায়েড হোটেল ও রিসোর্টে বিশেষ অফার। অফার শেষ হওয়ার আগেই বুক করুন!"
                : "Top verified luxury hotels & eco-resorts across Cox's Bazar, Sylhet & Sajek with secret member discounts."}
            </p>

            {/* Countdown Clock */}
            <div className="mt-4 flex items-center justify-center lg:justify-start gap-2.5">
              <span className="text-xs font-semibold text-rose-100 flex items-center gap-1">
                <Clock className="w-3.5 h-3.5" />
                {isBn ? "অফার শেষ হতে বাকি:" : "Deals Expire In:"}
              </span>

              <div className="flex items-center gap-1.5 font-mono text-sm md:text-base font-black">
                <div className="bg-black/30 backdrop-blur-md px-2.5 py-1 rounded-lg border border-white/20">
                  {formatDigit(timeLeft.hours)}
                  <span className="text-[9px] block text-white/70 font-sans font-normal">
                    {isBn ? "ঘণ্টা" : "HRS"}
                  </span>
                </div>
                <span>:</span>
                <div className="bg-black/30 backdrop-blur-md px-2.5 py-1 rounded-lg border border-white/20">
                  {formatDigit(timeLeft.minutes)}
                  <span className="text-[9px] block text-white/70 font-sans font-normal">
                    {isBn ? "মিনিট" : "MIN"}
                  </span>
                </div>
                <span>:</span>
                <div className="bg-black/30 backdrop-blur-md px-2.5 py-1 rounded-lg border border-white/20 text-amber-300">
                  {formatDigit(timeLeft.seconds)}
                  <span className="text-[9px] block text-white/70 font-sans font-normal">
                    {isBn ? "সেকেন্ড" : "SEC"}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Coupon Cards & Action */}
          <div className="flex flex-col sm:flex-row items-center gap-3 w-full lg:w-auto">
            {/* Coupon Card 1 */}
            <div className="bg-white/10 hover:bg-white/15 backdrop-blur-md border border-white/25 rounded-2xl p-4 w-full sm:w-56 transition-all">
              <div className="flex items-center justify-between text-xs text-amber-200 font-bold mb-1">
                <span>{isBn ? "ফ্ল্যাট ১৫% ছাড়" : "FLAT 15% OFF"}</span>
                <span className="text-[10px] bg-amber-400 text-slate-900 px-1.5 py-0.5 rounded font-black">
                  POPULAR
                </span>
              </div>
              <div className="text-xs text-white/80 mb-2">
                {isBn ? "সকল প্রিমিয়াম রিসোর্টে প্রযোজ্য" : "On all Luxury Resorts"}
              </div>
              <button
                onClick={() => handleCopy("STAYBDVIP")}
                className="w-full py-2 px-3 rounded-xl bg-white text-rose-600 font-extrabold text-xs flex items-center justify-center gap-1.5 shadow-md hover:bg-rose-50 active:scale-95 transition-all"
              >
                {copiedCode === "STAYBDVIP" ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-600" />
                    <span>{isBn ? "কপিকৃত!" : "COPIED!"}</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>STAYBDVIP</span>
                  </>
                )}
              </button>
            </div>

            {/* Coupon Card 2 */}
            <div className="bg-white/10 hover:bg-white/15 backdrop-blur-md border border-white/25 rounded-2xl p-4 w-full sm:w-56 transition-all">
              <div className="flex items-center justify-between text-xs text-amber-200 font-bold mb-1">
                <span>{isBn ? "৳১,০০০ ক্যাশব্যাক" : "৳1,000 CASHBACK"}</span>
                <span className="text-[10px] bg-emerald-400 text-slate-900 px-1.5 py-0.5 rounded font-black">
                  bKash/Nagad
                </span>
              </div>
              <div className="text-xs text-white/80 mb-2">
                {isBn ? "মিনিমাম ৳৫,০০০ বুকিংয়ে" : "Min booking ৳5,000"}
              </div>
              <button
                onClick={() => handleCopy("SUMMERBD")}
                className="w-full py-2 px-3 rounded-xl bg-amber-300 hover:bg-amber-200 text-slate-950 font-extrabold text-xs flex items-center justify-center gap-1.5 shadow-md active:scale-95 transition-all"
              >
                {copiedCode === "SUMMERBD" ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-700" />
                    <span>{isBn ? "কপিকৃত!" : "COPIED!"}</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>SUMMERBD</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AgodaFlashDeals;
