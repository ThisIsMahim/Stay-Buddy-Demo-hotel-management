import React from "react";
import { motion } from "framer-motion";
import { 
  ShieldCheck, FileCheck, MapPin, Layers, 
  MessageSquare, Building2, Scale, Lock, CheckCircle2 
} from "lucide-react";
import { useTranslation } from "react-i18next";

const PILLARS = [
  {
    icon: FileCheck,
    titleEn: "Hotel Onboarding Verification",
    titleBn: "আইনি নথি ও লাইসেন্স যাচাই",
    descEn: "Verification of Trade License, National ID (NID), and tourism registration before granting live platform access.",
    descBn: "ভুয়া হোটেল প্রোফাইল ঠেকাতে মালিকের NID ও ব্যবসার বৈধ কাগজপত্র যাচাই করে অ্যাকাউন্ট অ্যাক্টিভেশন।",
    featureEn: "Strict legal registration checks for every host",
    featureBn: "প্রতিটি হোটেলের ক্ষেত্রে আইনি ট্রেড লাইসেন্স বাধ্যতামূলক",
    badgeEn: "100% Verified Docs",
    badgeBn: "১০০% যাচাইকৃত নথি",
    color: "from-blue-500 to-indigo-600",
  },
  {
    icon: MapPin,
    titleEn: "GPS & Map Geofence Verification",
    titleBn: "স্যাটেলাইট ও জিপিএস লোকেশন ভেরিফিকেশন",
    descEn: "Precise latitude/longitude mapping ensuring travelers never arrive at nonexistent or misleading locations.",
    descBn: "মানচিত্রে সঠিক অবস্থান ও দূরত্ব যাচাই করে পর্যটকদের নিখুঁত গন্তব্যের নিশ্চয়তা।",
    featureEn: "Geotagged coordinates prevent phantom properties",
    featureBn: "সরাসরি জিপিএস পিন দিয়ে অস্তিত্ব নিশ্চিতকরণ",
    badgeEn: "Geotagged",
    badgeBn: "জিওট্যাগড",
    color: "from-emerald-500 to-teal-600",
  },
  {
    icon: Layers,
    titleEn: "Anti-Theft Inventory Auditing",
    titleBn: "লাইভ রুম ইনভেন্টরি ও অডিট মেকানিজম",
    descEn: "Real-time room occupancy sync preventing double bookings and managerial revenue leakage.",
    descBn: "অফলাইন ও অনলাইন রুমের রিয়েল-টাইম হিসাব, যা রাজস্ব গোপন বা ভুল তথ্য প্রদান রোধ করে।",
    featureEn: "Automated digital ledger eliminates inventory fraud",
    featureBn: "স্বয়ংক্রিয় ডিজিটাল লেজারে ভাড়ার হিসাব সুরক্ষিত",
    badgeEn: "Live Audited",
    badgeBn: "লাইভ অডিট",
    color: "from-amber-500 to-orange-600",
  },
  {
    icon: MessageSquare,
    titleEn: "Booking-Linked Verified Reviews",
    titleBn: "প্রকৃত অতিথির রিভিউ যাচাই",
    descEn: "Only guests with confirmed check-outs can post ratings and reviews—eradicating fake marketing ratings.",
    descBn: "হোটেল স্টে সম্পন্ন করার পরেই কেবল রিভিউ দেওয়া সম্ভব; ফলে কোনো পেইড বা ভুয়া রিভিউ থাকবে না।",
    featureEn: "Checkout-authenticated feedback prevents paid ratings",
    featureBn: "প্রকৃত অবস্থানকারী ছাড়া অন্য কেউ রিভিউ দিতে পারে না",
    badgeEn: "No Fake Reviews",
    badgeBn: "প্রকৃত রিভিউ",
    color: "from-purple-500 to-pink-600",
  },
  {
    icon: Scale,
    titleEn: "Structured Dispute & Resolution",
    titleBn: "অভিযোগ ও দ্রুত সমাধান কাঠামো",
    descEn: "Direct complaint resolution workflow escalating service disputes to platform mediation.",
    descBn: "ভোক্তা অধিকার সুরক্ষায় যে কোনো অসঙ্গতির দ্রুত ও স্বচ্ছ প্রশাসনিক বিচার এবং সমাধান।",
    featureEn: "Transparent mediation workflow protecting consumer rights",
    featureBn: "ভোক্তা ও হোটেল উভয়ের অধিকার রক্ষায় মধ্যস্থতা",
    badgeEn: "Mediation SLA",
    badgeBn: "দ্রুত সমাধান",
    color: "from-rose-500 to-red-600",
  },
  {
    icon: Building2,
    titleEn: "Regulatory & Govt Oversight",
    titleBn: "সরকারি ও নিয়ন্ত্রক তদারকি ব্যবস্থা",
    descEn: "Dedicated oversight interfaces for authorized tourism bodies to ensure safety compliance.",
    descBn: "প্রয়োজন অনুযায়ী সংশ্লিষ্ট সরকারি ও পর্যটন কর্তৃপক্ষের জন্য সামগ্রিক তদারকি ড্যাশবোর্ড।",
    featureEn: "Data compliance aligned with national tourism directives",
    featureBn: "জাতীয় পর্যটন নীতিমালার সাথে সামঞ্জস্যপূর্ণ ডাটা সিস্টেম",
    badgeEn: "Govt Oversight",
    badgeBn: "সরকারি তদারকি",
    color: "from-cyan-500 to-blue-600",
  },
];

const TrustFrameworkSection: React.FC = () => {
  const { i18n } = useTranslation();
  const isBn = i18n.language?.startsWith("bn");

  return (
    <section className="py-16 md:py-24 bg-white border-t border-slate-100">
      <div className="max-w-7xl mx-auto px-4 md:px-6">
        
        {/* Header */}
        <div className="flex flex-col items-center text-center mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold uppercase tracking-wider mb-3 shadow-xs">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>
              {isBn ? "বিশ্বাসযোগ্যতা ও আইনি সুরক্ষা কাঠামো" : "Trust & Compliance Infrastructure"}
            </span>
          </div>

          <h2 className="text-3xl md:text-5xl font-black text-slate-900 tracking-tight max-w-3xl leading-tight">
            {isBn ? (
              <>
                যাচাইকরণ ও বিশ্বস্ততা পরিকাঠামো —{" "}
                <span className="text-emerald-600">ভুয়া তথ্য ও প্রতারণামুক্ত পর্যটন</span>
              </>
            ) : (
              <>
                Verification & Trust Framework —{" "}
                <span className="text-emerald-600">Fraud-Free & Authentic Tourism</span>
              </>
            )}
          </h2>
          <p className="text-slate-600 text-sm md:text-base max-w-2xl mt-3 font-normal">
            {isBn
              ? "ভুয়া তথ্য, ফেক হোটেল প্রোফাইল ও বিভ্রান্তিকর রিভিউ দূর করে পর্যটক ও হোটেল মালিক—উভয়ের জন্য সর্বোচ্চ বিশ্বাসযোগ্য পরিবেশ তৈরিতে মাল্টি-লেয়ার ভেরিফিকেশন ব্যবস্থা।"
              : "Multi-layered verification architecture eliminating misleading data, fake hotel listings, and biased reviews to build trust for both travelers and hoteliers."}
          </p>
        </div>

        {/* 6 Pillars Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {PILLARS.map((pillar, idx) => {
            const Icon = pillar.icon;
            return (
              <motion.div
                key={pillar.titleEn}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: idx * 0.08 }}
                className="bg-slate-50/60 hover:bg-white rounded-2xl p-6 border border-slate-200/80 hover:border-slate-300 hover:shadow-xl transition-all duration-300 flex flex-col justify-between group"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 rounded-xl bg-white border border-slate-200 shadow-sm flex items-center justify-center text-slate-900 group-hover:bg-slate-900 group-hover:text-white transition-colors duration-300">
                      <Icon className="w-6 h-6" />
                    </div>
                    <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-white border border-slate-200 text-slate-700 shadow-xs">
                      {isBn ? pillar.badgeBn : pillar.badgeEn}
                    </span>
                  </div>

                  <h3 className="text-base font-bold text-slate-900 group-hover:text-emerald-700 transition-colors">
                    {isBn ? pillar.titleBn : pillar.titleEn}
                  </h3>

                  <p className="text-xs text-slate-600 mt-3 leading-relaxed">
                    {isBn ? pillar.descBn : pillar.descEn}
                  </p>
                </div>

                <div className="mt-5 pt-3 border-t border-slate-200/60 flex items-center gap-1.5 text-[11px] font-medium text-slate-500">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span>{isBn ? pillar.featureBn : pillar.featureEn}</span>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Security by Design Bottom Bar */}
        <div className="mt-12 bg-slate-900 rounded-2xl p-6 text-white flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0 border border-emerald-500/30">
              <Lock className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-sm md:text-base font-bold text-white">
                {isBn ? "তথ্য সুরক্ষা ও সার্বিক নিরাপত্তা" : "Data Privacy & Security-by-Design"}
              </h4>
              <p className="text-xs text-slate-400 mt-0.5 max-w-xl">
                {isBn
                  ? "প্রয়োজনের অতিরিক্ত ব্যক্তিগত তথ্য সংগ্রহ নয় • এন্ড-টু-এন্ড এনক্রিপশন • বাংলাদেশ ডিজিটাল নিরাপত্তা বিধি ও আন্তর্জাতিক কমপ্লায়েন্স অনুসরণ।"
                  : "Minimal personal data collection • End-to-end encryption • Aligned with national cyber safety protocols and international privacy standards."}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <span className="text-[11px] px-3 py-1.5 rounded-lg bg-slate-800 border border-slate-700 text-slate-300 font-mono">
              {isBn ? "২৫৬-বিট এসএসএল এনক্রিপশন" : "256-Bit SSL Encrypted"}
            </span>
            <span className="text-[11px] px-3 py-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 font-semibold">
              {isBn ? "আইনসম্মত সম্মতিভিত্তিক এক্সেস" : "Consent-Based Access"}
            </span>
          </div>
        </div>

      </div>
    </section>
  );
};

export default TrustFrameworkSection;
