import React from "react";
import { motion } from "framer-motion";
import { 
  ShieldCheck, Banknote, Clock, Sparkles, 
  CheckCircle2, Headphones, RotateCcw, Award 
} from "lucide-react";
import { useTranslation } from "react-i18next";

const PERKS = [
  {
    icon: Banknote,
    titleEn: "100% Price Match Promise",
    titleBn: "১০০% বেস্ট প্রাইস গ্যারান্টি",
    descEn: "Find a lower room rate anywhere online? We refund 110% of the price difference instantly.",
    descBn: "অন্য কোথাও কম ভাড়া পেলে সাথে সাথে ১১০% মূল্যের পার্থক্য রিফান্ড দেওয়া হবে।",
    badgeEn: "Zero Markup",
    badgeBn: "জিরো হিডেন চার্জ",
    color: "from-blue-500/10 to-indigo-500/10",
    iconColor: "text-blue-600 bg-blue-50 border-blue-200",
  },
  {
    icon: RotateCcw,
    titleEn: "Free 24h Easy Cancellation",
    titleBn: "সহজ ও ফ্রি বাতিল সুবিধা",
    descEn: "Plans changed? Enjoy hassle-free 100% full refund cancellation on all Flexi-rate bookings.",
    descBn: "ভ্রমণ পরিকল্পনা পরিবর্তন হলে ২৪ ঘণ্টা পূর্ব পর্যন্ত শতভাগ টাকা রিফান্ডসহ ফ্রি বাতিলের সুবিধা।",
    badgeEn: "Instant Refund",
    badgeBn: "তাৎক্ষণিক রিফান্ড",
    color: "from-emerald-500/10 to-teal-500/10",
    iconColor: "text-emerald-600 bg-emerald-50 border-emerald-200",
  },
  {
    icon: ShieldCheck,
    titleEn: "100% GPS Verified Stays",
    titleBn: "১০০% জিপিএস ও লাইসেন্স যাচাইকৃত",
    descEn: "Every listing is inspected with trade license & geolocation check. Never arrive at a fake hotel.",
    descBn: "ভুয়া হোটেল প্রতিরোধে প্রতিটি হোটেলের ট্রেড লাইসেন্স ও স্যাটেলাইট লোকেশন নিখুঁতভাবে যাচাইকৃত।",
    badgeEn: "Fraud-Free",
    badgeBn: "শতভাগ নিরাপদ",
    color: "from-purple-500/10 to-indigo-500/10",
    iconColor: "text-purple-600 bg-purple-50 border-purple-200",
  },
  {
    icon: Headphones,
    titleEn: "24/7 Bangla & English Concierge",
    titleBn: "২৪/৭ সার্বক্ষণিক অন-গ্রাউন্ড সাপোর্ট",
    descEn: "Dedicated hospitality specialists on WhatsApp and hotline ready to assist at any check-in.",
    descBn: "হোটেল চেক-ইন বা জরুরি প্রয়োজনে হোয়াটসঅ্যাপ ও হটলাইনে সার্বক্ষণিক অভিজ্ঞ কাস্টমার কেয়ার।",
    badgeEn: "64 Districts",
    badgeBn: "৬৪ জেলায় সক্রিয়",
    color: "from-amber-500/10 to-orange-500/10",
    iconColor: "text-amber-600 bg-amber-50 border-amber-200",
  },
];

export const StayBDPerksGuarantee: React.FC = () => {
  const { i18n } = useTranslation();
  const isBn = i18n.language?.startsWith("bn");

  return (
    <section className="py-12 my-6 bg-slate-900 rounded-3xl text-white p-6 md:p-10 relative overflow-hidden shadow-2xl border border-slate-800">
      {/* Subtle Glows */}
      <div className="absolute -top-24 -left-24 w-96 h-96 bg-emerald-500/10 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-blue-500/10 rounded-full blur-[100px] pointer-events-none" />

      <div className="relative z-10 max-w-6xl mx-auto">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 text-xs font-bold uppercase tracking-wider mb-2">
              <Award className="w-3.5 h-3.5" />
              <span>{isBn ? "কেন StayBD সেরা পছন্দ?" : "Why Book with StayBD?"}</span>
            </div>
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-black text-white tracking-tight">
              {isBn ? (
                <>
                  নিশ্চিন্ত ও নিরাপদ বুকিং —{" "}
                  <span className="text-emerald-400">আন্তর্জাতিক স্ট্যান্ডার্ডে স্থানীয় সুবিধা</span>
                </>
              ) : (
                <>
                  The StayBD Advantage —{" "}
                  <span className="text-emerald-400">Global Standards, Local Trust</span>
                </>
              )}
            </h2>
          </div>

          <p className="text-xs md:text-sm text-slate-400 max-w-md">
            {isBn
              ? "MakeMyTrip ও Airbnb-এর সেরা সুবিধাগুলো এখন বাংলাদেশের প্রতিটি প্রান্তে সরাসরি উপভোগ করুন।"
              : "Experience top-tier OTA perks designed specifically for Bangladesh domestic & inbound travelers."}
          </p>
        </div>

        {/* 4 Pillars Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          {PERKS.map((perk, idx) => {
            const Icon = perk.icon;
            return (
              <motion.div
                key={perk.titleEn}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.3, delay: idx * 0.08 }}
                className="bg-slate-800/70 hover:bg-slate-800 border border-slate-700/80 hover:border-emerald-500/50 rounded-2xl p-5 backdrop-blur-md transition-all duration-300 flex flex-col justify-between group shadow-lg"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-11 h-11 rounded-xl bg-slate-900 border border-slate-700 flex items-center justify-center text-emerald-400 group-hover:scale-110 transition-transform">
                      <Icon className="w-5 h-5" />
                    </div>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-900 border border-slate-700 text-slate-300">
                      {isBn ? perk.badgeBn : perk.badgeEn}
                    </span>
                  </div>

                  <h3 className="text-sm md:text-base font-bold text-white group-hover:text-emerald-400 transition-colors">
                    {isBn ? perk.titleBn : perk.titleEn}
                  </h3>

                  <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                    {isBn ? perk.descBn : perk.descEn}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-700/60 flex items-center gap-1.5 text-[11px] font-medium text-emerald-400">
                  <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                  <span>{isBn ? "১০০% নিশ্চয়তা" : "Verified Guarantee"}</span>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default StayBDPerksGuarantee;
