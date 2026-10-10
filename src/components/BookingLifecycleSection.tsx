import React, { useState } from "react";
import { motion } from "framer-motion";
import { 
  Search, SlidersHorizontal, BedDouble, ShieldCheck, 
  FileCheck, QrCode, Star, ArrowRight, Sparkles, CheckCircle2 
} from "lucide-react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";

const STAGES = [
  {
    step: "01",
    id: "search",
    icon: Search,
    titleEn: "Search & Filter",
    titleBn: "অনুসন্ধান ও ফিল্টারিং",
    subtitleEn: "Destination + Dates + Guests + Exact Budget",
    subtitleBn: "গন্তব্য + তারিখ + অতিথি + বাজেট সীমা",
    descEn: "Select your desired travel spot across 64 districts. Set budget limits from ৳500 economy rooms to luxury resorts with zero hidden fees.",
    descBn: "দেশের ৬৪ জেলার যেকোনো পর্যটন স্পট বা শহর নির্বাচন করুন। ৳৫০০ থেকে শুরু করে বিলাসবহুল রিসোর্ট পর্যন্ত কোনো লুকানো চার্জ ছাড়াই খুঁজুন।",
    badgeEn: "Precision Search",
    badgeBn: "নিখুঁত অনুসন্ধান",
    color: "from-blue-500 to-cyan-500",
    border: "border-blue-500/30",
    accent: "text-blue-500",
    bg: "bg-blue-500/10"
  },
  {
    step: "02",
    id: "compare",
    icon: SlidersHorizontal,
    titleEn: "Compare Transparently",
    titleBn: "তুলনামূলক স্বচ্ছ যাচাই",
    subtitleEn: "Pricing + Live Vacancy + Authentic Reviews",
    subtitleBn: "নির্ধারিত ভাড়া + লাইভ প্রাপ্যতা + রেটিং",
    descEn: "Compare real-time verified prices side-by-side. Inspect authentic property photos, GPS distances, and amenity checklists.",
    descBn: "এক নজরে একাধিক হোটেলের বাস্তব ভাড়া ও খালি রুমের তথ্য তুলনা করুন। স্যাটেলাইট জিপিএস দূরত্ব ও আসল ছবি যাচাই করুন।",
    badgeEn: "Zero Information Asymmetry",
    badgeBn: "১০০% স্বচ্ছ তুলনা",
    color: "from-cyan-500 to-teal-500",
    border: "border-cyan-500/30",
    accent: "text-cyan-500",
    bg: "bg-cyan-500/10"
  },
  {
    step: "03",
    id: "select",
    icon: BedDouble,
    titleEn: "Select Room & Policy",
    titleBn: "রুম টাইপ ও নীতিমালা নির্বাচন",
    subtitleEn: "Single / Double / Suite + Cancellation Rules",
    subtitleBn: "সিঙ্গেল / ডাবল / স্যুট + রিফান্ড পলিসি",
    descEn: "Choose exact room categories matching group size. Review complimentary breakfast, sea-view guarantees, and transparent refund policies.",
    descBn: "নিজের সুবিধাজনক রুম টাইপ নির্বাচন করুন। কমপ্লিমেন্টারি নাস্তা, সি-ভিউ এবং ফ্রি ক্যান্সেলেশন নীতিমালা স্পষ্টভাবে দেখে নিন।",
    badgeEn: "Guaranteed Inventory",
    badgeBn: "রুম নিশ্চিতকরণ",
    color: "from-teal-500 to-emerald-500",
    border: "border-teal-500/30",
    accent: "text-teal-500",
    bg: "bg-teal-500/10"
  },
  {
    step: "04",
    id: "book",
    icon: ShieldCheck,
    titleEn: "Secure Booking",
    titleBn: "নিরাপদ বুকিং প্রটোকল",
    subtitleEn: "OTP Authentication + bKash/Card or Pay-at-Hotel",
    subtitleBn: "ওটিপি ভেরিফিকেশন + অনলাইন বা পে-অ্যাট-হোটেল",
    descEn: "Secure instant reservations using bKash, Nagad, cards, or choose Pay-at-Hotel. Verified through two-factor mobile OTP.",
    descBn: "বিকাশ, নগদ, ডেবিট/ক্রেডিট কার্ড অথবা সরাসরি হোটেলে গিয়ে পরিশোধের সুযোগ। মোবাইল ওটিপির মাধ্যমে সর্বোচ্চ নিরাপত্তা নিশ্চিত।",
    badgeEn: "PCI-DSS Safe Payment",
    badgeBn: "নিরাপদ পেমেন্ট গেটওয়ে",
    color: "from-emerald-500 to-green-500",
    border: "border-emerald-500/30",
    accent: "text-emerald-500",
    bg: "bg-emerald-500/10"
  },
  {
    step: "05",
    id: "confirm",
    icon: FileCheck,
    titleEn: "Instant Digital Voucher",
    titleBn: "তাৎক্ষণিক ডিজিটাল ভাউচার",
    subtitleEn: "Encrypted QR Confirmation via SMS & Email",
    subtitleBn: "এসএমএস ও ইমেইলে এনক্রিপ্টেড কিউআর রসিদ",
    descEn: "The hotel management ledger locks your room instantly. Receive an official digital confirmation voucher with an encrypted check-in QR code.",
    descBn: "হোটেলের ডিজিটাল লেজারে রুম সাথে সাথে লক হয়ে যায়। মোবাইলে ও ইমেইলে কিউআর কোডসহ অফিসিয়াল ডিজিটাল কনফার্মেশন ভাউচার পৌঁছে যায়।",
    badgeEn: "Instant Lock-in",
    badgeBn: "তাৎক্ষণিক রুম বুকড",
    color: "from-amber-500 to-orange-500",
    border: "border-amber-500/30",
    accent: "text-amber-500",
    bg: "bg-amber-500/10"
  },
  {
    step: "06",
    id: "stay",
    icon: QrCode,
    titleEn: "Seamless QR Check-in",
    titleBn: "কনট্যাক্টলেস কিউআর চেক-ইন",
    subtitleEn: "Fast Front-Desk Verification & Hospitality",
    subtitleBn: "ঝামেলাহীন ফ্রন্ট-ডেস্ক আগমন ও নিরাপদ অবস্থান",
    descEn: "Arrive at the property and show your mobile QR code. Front desk scans to authenticate identity instantly—zero paper delays.",
    descBn: "হোটেলে পৌঁছে মোবাইল ভাউচারের কিউআর কোড প্রদর্শন করুন। ফ্রন্ট-ডেস্ক মুহূর্তেই স্ক্যান করে রুম হস্তান্তর করবে—কোনো অপ্রয়োজনীয় বিলম্ব নেই।",
    badgeEn: "Frictionless Arrival",
    badgeBn: "দ্রুত চেক-ইন",
    color: "from-purple-500 to-indigo-500",
    border: "border-purple-500/30",
    accent: "text-purple-500",
    bg: "bg-purple-500/10"
  },
  {
    step: "07",
    id: "review",
    icon: Star,
    titleEn: "Verified Guest Review",
    titleBn: "যাচাইকৃত অতিথির মূল্যায়ন",
    subtitleEn: "Checkout-Authenticated Feedback (No Fake Reviews)",
    subtitleBn: "স্টে সম্পন্নকারী অতিথির সত্য মতামত ও রেটিং",
    descEn: "Upon checkout, submit ratings on cleanliness, safety, and service. Only real checked-out guests can rate—eliminating biased fake marketing.",
    descBn: "অবস্থান শেষে পরিচ্ছন্নতা, নিরাপত্তা ও স্টাফদের ব্যবহার নিয়ে রেটিং দিন। শুধুমাত্র প্রকৃত অবস্থানকারীই রিভিউ দিতে পারায় ভুয়া রেটিং অসম্ভব।",
    badgeEn: "100% Authentic Feedback",
    badgeBn: "প্রতারণামুক্ত সৎ রিভিউ",
    color: "from-rose-500 to-pink-500",
    border: "border-rose-500/30",
    accent: "text-rose-500",
    bg: "bg-rose-500/10"
  }
];

export const BookingLifecycleSection: React.FC = () => {
  const { i18n } = useTranslation();
  const isBn = i18n.language?.startsWith("bn");
  const [activeStepIndex, setActiveStepIndex] = useState(0);
  const navigate = useNavigate();

  const currentStage = STAGES[activeStepIndex];
  const CurrentIcon = currentStage.icon;

  return (
    <section className="py-16 md:py-24 bg-gradient-to-b from-white via-slate-50 to-white border-t border-slate-200/80">
      <div className="max-w-7xl mx-auto px-4 md:px-6">
        
        {/* Header Badge & Title */}
        <div className="flex flex-col items-center text-center mb-14">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold uppercase tracking-wider mb-3 shadow-xs">
            <Sparkles className="w-4 h-4 text-emerald-600" />
            <span>
              {isBn 
                ? "৭-ধাপের এন্ড-টু-এন্ড ডিজিটাল বুকিং লাইফসাইকেল" 
                : "7-Stage End-to-End Digital Booking Journey"}
            </span>
          </div>

          <h2 className="text-3xl md:text-5xl font-black text-slate-900 tracking-tight max-w-3xl leading-tight">
            {isBn ? (
              <>
                অনুসন্ধান থেকে চেক-আউট —{" "}
                <span className="bg-gradient-to-r from-emerald-600 via-teal-600 to-blue-600 bg-clip-text text-transparent">
                  শতভাগ স্বচ্ছ ও ঝামেলামুক্ত বুকিং
                </span>
              </>
            ) : (
              <>
                From Discovery to Checkout —{" "}
                <span className="bg-gradient-to-r from-emerald-600 via-teal-600 to-blue-600 bg-clip-text text-transparent">
                  A Frictionless 7-Step Experience
                </span>
              </>
            )}
          </h2>

          <p className="text-slate-600 text-sm md:text-base max-w-2xl mt-3 font-normal">
            {isBn
              ? "StayBD-এর সমন্বিত প্রযুক্তি কাঠামোতে কীভাবে একজন সাধারণ নাগরিক মাত্র কয়েকটি ধাপে নিশ্চিত হোটেল বুক করতে পারেন এবং স্বচ্ছ সেবা পান।"
              : "Experience how StayBD's national digital infrastructure transforms hotel discovery into an intuitive, secure, and authenticated journey."}
          </p>
        </div>

        {/* 7 Interactive Stage Stepper Pills */}
        <div className="flex flex-wrap items-center justify-center gap-2 mb-10">
          {STAGES.map((s, idx) => {
            const Icon = s.icon;
            const isSelected = activeStepIndex === idx;
            return (
              <button
                key={s.id}
                onClick={() => setActiveStepIndex(idx)}
                className={`px-3.5 py-2 rounded-2xl text-xs font-bold transition-all flex items-center gap-2 border ${
                  isSelected
                    ? "bg-slate-900 text-white border-slate-900 shadow-lg shadow-slate-900/10 ring-2 ring-emerald-500/40"
                    : "bg-white text-slate-600 hover:text-slate-900 border-slate-200 hover:bg-slate-50"
                }`}
              >
                <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-black ${
                  isSelected ? "bg-emerald-400 text-slate-950" : "bg-slate-100 text-slate-500"
                }`}>
                  {s.step}
                </span>
                <span className="hidden sm:inline">
                  {isBn ? s.titleBn : s.titleEn}
                </span>
              </button>
            );
          })}
        </div>

        {/* Active Stage Interactive Showcase Card */}
        <motion.div
          key={currentStage.id}
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35 }}
          className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-10 shadow-xl max-w-4xl mx-auto relative overflow-hidden"
        >
          {/* Top Accent Strip */}
          <div className={`absolute top-0 left-0 right-0 h-2 bg-gradient-to-r ${currentStage.color}`} />

          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 pb-6 border-b border-slate-100">
            <div className="flex items-center gap-4">
              <div className={`w-14 h-14 rounded-2xl ${currentStage.bg} ${currentStage.accent} flex items-center justify-center shadow-inner`}>
                <CurrentIcon className="w-7 h-7" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-black text-emerald-600 uppercase tracking-widest">
                    {isBn ? `ধাপ ${currentStage.step}` : `Step ${currentStage.step}`}
                  </span>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 border border-slate-200">
                    {isBn ? currentStage.badgeBn : currentStage.badgeEn}
                  </span>
                </div>
                <h3 className="text-2xl font-black text-slate-900 mt-0.5">
                  {isBn ? currentStage.titleBn : currentStage.titleEn}
                </h3>
              </div>
            </div>

            <button
              onClick={() => navigate("/hotels")}
              className="px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs transition-all flex items-center gap-2 shadow-md active:scale-95"
            >
              <span>{isBn ? "এখনই যাচাই করুন" : "Try Live Workflow"}</span>
              <ArrowRight className="w-3.5 h-3.5 text-emerald-400" />
            </button>
          </div>

          <div className="pt-6 grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
            <div className="md:col-span-8">
              <h4 className="text-sm font-bold text-emerald-700 mb-2">
                {isBn ? currentStage.subtitleBn : currentStage.subtitleEn}
              </h4>
              <p className="text-slate-600 text-xs sm:text-sm leading-relaxed font-normal">
                {isBn ? currentStage.descBn : currentStage.descEn}
              </p>
            </div>

            <div className="md:col-span-4 bg-slate-50 border border-slate-200/80 rounded-2xl p-4 text-xs text-slate-600 space-y-2">
              <div className="flex items-center gap-2 text-slate-900 font-bold">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>{isBn ? "ডিজিটাল সুরক্ষা:" : "Digital Guarantee:"}</span>
              </div>
              <p className="text-[11px] text-slate-500 leading-normal">
                {isBn 
                  ? "হোটেলের সাথে সরাসরি রিয়েল-টাইম ডেটা সিঙ্ক। কোনো ভুয়া ব্রোকার ফি নেই।" 
                  : "Direct real-time inventory locking with zero unauthorized broker margins."}
              </p>
            </div>
          </div>

          {/* Quick Stage Slider Controls */}
          <div className="mt-8 pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500 font-semibold">
            <button
              onClick={() => setActiveStepIndex(prev => Math.max(prev - 1, 0))}
              disabled={activeStepIndex === 0}
              className="text-slate-600 hover:text-slate-950 disabled:opacity-30 flex items-center gap-1"
            >
              ← {isBn ? "আগের ধাপ" : "Previous Step"}
            </button>

            <span className="text-[11px] text-slate-400">
              {isBn ? `৭টির মধ্যে ${activeStepIndex + 1}তম ধাপ` : `Stage ${activeStepIndex + 1} of 7`}
            </span>

            <button
              onClick={() => setActiveStepIndex(prev => Math.min(prev + 1, STAGES.length - 1))}
              disabled={activeStepIndex === STAGES.length - 1}
              className="text-emerald-600 hover:text-emerald-700 disabled:opacity-30 font-bold flex items-center gap-1"
            >
              {isBn ? "পরবর্তী ধাপ" : "Next Step"} →
            </button>
          </div>
        </motion.div>

      </div>
    </section>
  );
};

export default BookingLifecycleSection;
