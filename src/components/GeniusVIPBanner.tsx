import React, { useState } from "react";
import { motion } from "framer-motion";
import { 
  Sparkles, Gift, Percent, Utensils, 
  Crown, ArrowRight, Check, ShieldCheck 
} from "lucide-react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";

export const GeniusVIPBanner: React.FC = () => {
  const { i18n } = useTranslation();
  const isBn = i18n.language?.startsWith("bn");

  return (
    <section className="py-6 my-2">
      <div className="bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 rounded-3xl p-6 md:p-8 text-white shadow-xl relative overflow-hidden border border-blue-800/40">
        {/* Ambient background glows */}
        <div className="absolute top-0 right-0 w-72 h-72 bg-blue-500/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-indigo-500/15 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-6">
          {/* Left: Info */}
          <div className="flex-1 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/20 border border-blue-400/30 text-blue-300 text-xs font-bold uppercase tracking-wider mb-3">
              <Crown className="w-3.5 h-3.5 text-amber-400" />
              <span>{isBn ? "StayBD জেনিয়াস রিওয়ার্ড প্রোগ্রাম" : "StayBD Genius VIP Loyalty"}</span>
            </div>

            <h2 className="text-2xl md:text-3xl font-black text-white tracking-tight">
              {isBn ? (
                <>
                  প্রতিটি ট্রিপে আনলক করুন{" "}
                  <span className="text-amber-300">১০-২০% অতিরিক্ত লাইফটাইম ছাড়</span>
                </>
              ) : (
                <>
                  Unlock <span className="text-amber-300">10-20% Lifetime VIP Discounts</span> on Every Trip
                </>
              )}
            </h2>

            <p className="text-blue-200/90 text-xs md:text-sm mt-2 max-w-xl">
              {isBn
                ? "Booking.com-এর বিশ্বখ্যাত জেনিয়াস সুবিধার মতোই—কোনো সাবস্ক্রিপশন ফি ছাড়াই মাত্র ২টি বুকিং সম্পন্ন করলেই ফ্রি ব্রেকফাস্ট ও এক্সক্লুসিভ রুম আপগ্রেড।"
                : "Just complete 2 stays within 2 years to unlock Genius Level 2 perks: Free hotel breakfast, 15% discount & priority check-in."}
            </p>

            {/* Perks Badges */}
            <div className="mt-4 flex flex-wrap items-center justify-center lg:justify-start gap-2.5">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-white/10 border border-white/15 text-xs text-white">
                <Percent className="w-3.5 h-3.5 text-amber-400" />
                {isBn ? "১০-২০% মেম্বার রেট" : "10-20% Member Rates"}
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-white/10 border border-white/15 text-xs text-white">
                <Utensils className="w-3.5 h-3.5 text-emerald-400" />
                {isBn ? "ফ্রি কমপ্লিমেন্টারি ব্রেকফাস্ট" : "Free Breakfast Included"}
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-white/10 border border-white/15 text-xs text-white">
                <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                {isBn ? "ফ্রি রুম আপগ্রেড" : "Free Room Upgrades"}
              </span>
            </div>
          </div>

          {/* Right: Progress Card */}
          <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-5 w-full sm:w-80 shrink-0 text-left">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-amber-300 uppercase">
                {isBn ? "আপনার বর্তমান লেভেল" : "Your Tier"}
              </span>
              <span className="text-xs font-black bg-amber-400 text-slate-950 px-2 py-0.5 rounded-full">
                GENIUS LVL 1
              </span>
            </div>

            <div className="text-sm font-bold text-white mb-1">
              {isBn ? "লেভেল ২ আনলক করতে বাকি ১টি ট্রিপ" : "1 more stay to unlock Level 2"}
            </div>

            {/* Progress Bar */}
            <div className="w-full h-2.5 bg-black/30 rounded-full overflow-hidden my-2.5">
              <div className="h-full bg-gradient-to-r from-amber-400 to-emerald-400 rounded-full w-2/3 animate-pulse" />
            </div>

            <div className="flex items-center justify-between text-[11px] text-blue-200 mb-3">
              <span>{isBn ? "১টি বুকিং সম্পন্ন" : "1 Completed"}</span>
              <span>{isBn ? "লক্ষ্য: ২টি" : "Target: 2"}</span>
            </div>

            <Link
              to="/search"
              className="w-full py-2.5 px-4 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-xs flex items-center justify-center gap-1.5 transition-all active:scale-95 shadow-lg shadow-amber-400/20"
            >
              <span>{isBn ? "জেনিয়াস হোটেলগুলো দেখুন" : "Explore Genius Hotels"}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default GeniusVIPBanner;
