import React from "react";
import { motion } from "framer-motion";
import { 
  Building2, TrendingUp, Users, Landmark, 
  ArrowRight, CheckCircle2, Award, Globe2 
} from "lucide-react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

const IMPACT_CARDS = [
  {
    icon: Users,
    titleEn: "Citizens & Travelers",
    titleBn: "নাগরিক ও পর্যটক",
    pointsEn: [
      "100% transparency on room rates & real-time vacancy",
      "Immediate booking aligned with traveler budget",
      "Elimination of middlemen fraud and unnecessary hassle",
    ],
    pointsBn: [
      "ভাড়া ও প্রাপ্যতার শতভাগ স্বচ্ছতা",
      "বাজেট অনুযায়ী দ্রুত রুম নিশ্চিতকরণ",
      "মধ্যস্বত্বভোগীদের হয়রানি ও অপ্রয়োজনীয় ভোগান্তি হ্রাস",
    ],
    color: "from-blue-500/10 to-indigo-500/10",
    border: "border-blue-200",
  },
  {
    icon: Building2,
    titleEn: "Hotels & Accommodation Hosts",
    titleBn: "হোটেল ও আবাসন খাত",
    pointsEn: [
      "Direct domestic and international traveler reach",
      "Complete room inventory and occupancy digitization",
      "Revenue protection stopping internal administrative theft",
    ],
    pointsBn: [
      "সরাসরি দেশি-বিদেশি পর্যটকদের নিকট পৌঁছানোর সুযোগ",
      "রুম অকুপেন্সি ও ইনভেন্টরি সম্পূর্ণ ডিজিটাইজেশন",
      "ম্যানেজারিয়াল চুরি রোধে রাজস্ব নিরাপত্তা",
    ],
    color: "from-emerald-500/10 to-teal-500/10",
    border: "border-emerald-200",
  },
  {
    icon: Globe2,
    titleEn: "National Tourism Sector",
    titleBn: "পর্যটন শিল্প সম্প্রসারণ",
    pointsEn: [
      "Seamless discovery and guaranteed traveler safety",
      "Elevated international credibility for Bangladesh hospitality",
      "Promotion of emerging and remote tourist destinations",
    ],
    pointsBn: [
      "সহজ আবাসন অনুসন্ধান ও পর্যটক নিরাপত্তা নিশ্চিতকরণ",
      "আন্তর্জাতিক পর্যটকদের নিকট দেশের ভাবমূর্তি বৃদ্ধি",
      "নতুন ও উদীয়মান পর্যটন স্পটগুলোর ব্যাপক প্রচার ও প্রসার",
    ],
    color: "from-amber-500/10 to-orange-500/10",
    border: "border-amber-200",
  },
  {
    icon: Landmark,
    titleEn: "Government & Regulators",
    titleBn: "সরকার ও প্রশাসন",
    pointsEn: [
      "Standardized data infrastructure across hospitality",
      "Streamlined legal compliance and guest safety oversight",
      "Data-driven analytics for long-term national policy planning",
    ],
    pointsBn: [
      "স্ট্রাকচার্ড হসপিটালিটি সেক্টর তথ্য পরিকাঠামো",
      "আইনি কমপ্লায়েন্স ও সার্বিক নিরাপত্তা তদারকি",
      "জাতীয় পর্যটন নীতি নির্ধারণে নির্ভরযোগ্য অ্যানালিটিক্স",
    ],
    color: "from-purple-500/10 to-indigo-500/10",
    border: "border-purple-200",
  },
  {
    icon: TrendingUp,
    titleEn: "National Digital Economy",
    titleBn: "জাতীয় ডিজিটাল অর্থনীতি",
    pointsEn: [
      "Accelerated cashless transactions and formal tax revenue",
      "Decentralized local job creation in regional tourism",
      "Direct contribution to the Smart Bangladesh vision",
    ],
    pointsBn: [
      "ডিজিটাল লেনদেন ও রাজস্ব আদায়ের স্বচ্ছতা বৃদ্ধি",
      "স্থানীয় পর্যায়ে কর্মসংস্থান ও সেবা খাতের বিকাশ",
      "ক্যাশলেস স্মার্ট বাংলাদেশ রূপকল্পে কার্যকর অবদান",
    ],
    color: "from-cyan-500/10 to-blue-500/10",
    border: "border-cyan-200",
  },
];

const NationalValueSection: React.FC = () => {
  const { i18n } = useTranslation();
  const isBn = i18n.language?.startsWith("bn");

  return (
    <section className="py-16 md:py-24 bg-gradient-to-b from-slate-900 via-slate-950 to-slate-900 text-white relative overflow-hidden">
      {/* Background Glows */}
      <div className="absolute top-1/2 left-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-blue-500/10 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 md:px-6 relative z-10">
        
        {/* Header Badge & Title */}
        <div className="flex flex-col items-center text-center mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-semibold uppercase tracking-wider mb-4 shadow-sm">
            <Award className="w-4 h-4 text-emerald-400" />
            <span>
              {isBn ? "জাতীয় মূল্য ও কৌশলগত প্রভাব" : "National Value & Strategic Impact"}
            </span>
          </div>

          <h2 className="text-3xl md:text-5xl font-black tracking-tight text-white max-w-3xl leading-tight">
            {isBn ? (
              <>
                সরকারের জন্য কেন গুরুত্বপূর্ণ? —{" "}
                <span className="text-emerald-400">স্মার্ট হসপিটালিটি ইকোসিস্টেম</span>
              </>
            ) : (
              <>
                Strategic National Value —{" "}
                <span className="text-emerald-400">Smart Hospitality Ecosystem</span>
              </>
            )}
          </h2>
          <p className="text-slate-400 text-sm md:text-base max-w-2xl mt-3 font-normal">
            {isBn
              ? "শুধু একটি বুকিং প্ল্যাটফর্ম নয়—এটি বাংলাদেশের সমগ্র হসপিটালিটি সেক্টরের একটি সমন্বিত ডিজিটাল ইনফরমেশন লেয়ার।"
              : "More than a booking app—StayBD serves as an integrated digital layer and real-time oversight ecosystem for Bangladesh's hospitality industry."}
          </p>

          <div className="mt-4 inline-flex items-center gap-2 text-xs font-medium text-slate-300 bg-slate-800/80 px-4 py-1.5 rounded-full border border-slate-700">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>
              {isBn
                ? "প্রস্তাবিত প্রাতিষ্ঠানিক সমন্বয়: বেসামরিক বিমান পরিবহন ও পর্যটন মন্ত্রণালয় + বাংলাদেশ পর্যটন কর্পোরেশন (বিপিসি)"
                : "Proposed Institutional Collaboration: Ministry of Civil Aviation & Tourism + Bangladesh Parjatan Corporation (BPC)"}
            </span>
          </div>
        </div>

        {/* 5 Impact Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-14">
          {IMPACT_CARDS.map((card, idx) => {
            const Icon = card.icon;
            const points = isBn ? card.pointsBn : card.pointsEn;
            return (
              <motion.div
                key={card.titleEn}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: idx * 0.08 }}
                className={`bg-slate-900/80 border ${card.border} rounded-2xl p-6 backdrop-blur-md flex flex-col justify-between hover:border-emerald-400/60 transition-all duration-300`}
              >
                <div>
                  <div className="w-12 h-12 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center text-emerald-400 mb-4">
                    <Icon className="w-6 h-6" />
                  </div>
                  <h3 className="text-base font-bold text-white mb-3">
                    {isBn ? card.titleBn : card.titleEn}
                  </h3>
                  <div className="space-y-2">
                    {points.map((pt) => (
                      <div key={pt} className="flex items-start gap-2 text-xs text-slate-300">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                        <span>{pt}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            );
          })}

          {/* Quick Stats Summary Card */}
          <div className="bg-gradient-to-br from-emerald-950/40 via-slate-900 to-slate-900 border border-emerald-500/40 rounded-2xl p-6 flex flex-col justify-between">
            <div>
              <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-widest">
                {isBn ? "জাতীয় সম্প্রসারণ লক্ষ্য" : "National Coverage Goal"}
              </span>
              <h3 className="text-xl font-black text-white mt-1">
                {isBn ? "৬৪ জেলায় সম্পূর্ণ সম্প্রসারণ" : "Full 64-District Rollout"}
              </h3>
              <p className="text-xs text-slate-400 mt-2">
                {isBn
                  ? "প্রথম পর্যায়ে ঢাকা ও প্রধান পর্যটন শহর (কক্সবাজার, সিলেট, সাজেক); পরবর্তী পর্যায়ে দেশব্যাপী সম্প্রসারণ।"
                  : "Phase 1: Dhaka & key tourist hubs (Cox's Bazar, Sylhet, Sajek); subsequent phases scaling nationwide."}
              </p>
            </div>

            <div className="pt-4 border-t border-slate-800 mt-4 flex items-center justify-between">
              <div>
                <div className="text-xl font-black text-emerald-400">
                  {isBn ? "৪টি ধাপ" : "4 Phases"}
                </div>
                <div className="text-[10px] text-slate-400">
                  {isBn ? "বাস্তবায়ন পরিকল্পনা" : "Rollout Roadmap"}
                </div>
              </div>
              <div>
                <div className="text-xl font-black text-white">
                  {isBn ? "১০০%" : "100%"}
                </div>
                <div className="text-[10px] text-slate-400">
                  {isBn ? "ডিজিটাল ও স্বচ্ছ" : "Digital & Audited"}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Call to action for full proposal presentation */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8 flex flex-col lg:flex-row items-center justify-between gap-6 shadow-2xl">
          <div>
            <h3 className="text-xl md:text-2xl font-black text-white">
              {isBn 
                ? "StayBD প্রাতিষ্ঠানিক ও সরকারি প্রস্তাবনা বিস্তারিত দেখুন" 
                : "Explore the Full StayBD National Concept Proposal"}
            </h3>
            <p className="text-xs md:text-sm text-slate-400 mt-1 max-w-2xl">
              {isBn
                ? "ডিজিটাল আর্কিটেকচার, টেকসই ব্যবসায়িক মডেল, ডাটা প্রাইভেসি এবং ৪-ধাপের পাইলট থেকে জাতীয় সম্প্রসারণ রোডম্যাপ।"
                : "Complete technical architecture, sustainable revenue models, data privacy safeguards, and 4-phase rollout roadmap."}
            </p>
          </div>

          <Link
            to="/national-initiative"
            className="shrink-0 px-6 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-extrabold text-sm transition-all flex items-center gap-2 shadow-lg shadow-emerald-500/20 active:scale-95"
          >
            <span>{isBn ? "সম্পূর্ণ কনসেপ্ট প্রপোজাল দেখুন" : "View Full Concept Proposal"}</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

      </div>
    </section>
  );
};

export default NationalValueSection;
