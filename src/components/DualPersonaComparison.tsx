import React from "react";
import { motion } from "framer-motion";
import { 
  CheckCircle2, ArrowRight, HeartHandshake 
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

const DualPersonaComparison: React.FC = () => {
  const navigate = useNavigate();
  const { i18n } = useTranslation();
  const isBn = i18n.language?.startsWith("bn");

  return (
    <section className="py-16 md:py-24 bg-gradient-to-b from-slate-50 via-white to-slate-50 border-t border-slate-200/80">
      <div className="max-w-7xl mx-auto px-4 md:px-6">
        
        {/* Header */}
        <div className="flex flex-col items-center text-center mb-14">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50 border border-blue-200 text-blue-800 text-xs font-semibold uppercase tracking-wider mb-3 shadow-xs">
            <HeartHandshake className="w-4 h-4 text-blue-600" />
            <span>
              {isBn 
                ? "অন্তর্ভুক্তিমূলক জাতীয় প্ল্যাটফর্ম • প্রতিটি নাগরিক, প্রতিটি বাজেট" 
                : "Inclusive National Platform • Every Citizen, Every Budget"}
            </span>
          </div>

          <h2 className="text-3xl md:text-5xl font-black text-slate-900 tracking-tight max-w-3xl leading-tight">
            {isBn ? (
              <>
                বাস্তব ব্যবহারকারীর উদাহরণ —{" "}
                <span className="bg-gradient-to-r from-blue-600 via-emerald-600 to-teal-600 bg-clip-text text-transparent">
                  সকল বাজেটের জন্য সমান স্বচ্ছতা
                </span>
              </>
            ) : (
              <>
                Real User Case Studies —{" "}
                <span className="bg-gradient-to-r from-blue-600 via-emerald-600 to-teal-600 bg-clip-text text-transparent">
                  Equal Transparency Across All Budgets
                </span>
              </>
            )}
          </h2>
          <p className="text-slate-600 text-sm md:text-base max-w-2xl mt-3 font-normal">
            {isBn
              ? "দুইজনের জন্য সম্পূর্ণ আলাদা বাজেট—কিন্তু StayBD-এর একই প্ল্যাটফর্মে মিলবে দ্রুত, নির্ভরযোগ্য ও তথ্যবহুল স্বচ্ছ সমাধান।"
              : "Two completely different budgets—yet the same StayBD platform delivers fast, reliable, and transparent solutions for both."}
          </p>
        </div>

        {/* 2 Personas Side by Side Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          
          {/* Persona A: Budget ৳500 */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="bg-white rounded-3xl p-6 md:p-8 border border-blue-200 shadow-xl shadow-blue-500/5 flex flex-col justify-between relative overflow-hidden"
          >
            {/* Top Accent Strip */}
            <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-blue-500 to-cyan-500" />

            <div>
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center font-black text-lg border border-blue-100">
                    A
                  </div>
                  <div>
                    <h3 className="text-lg font-black text-slate-900">
                      {isBn ? "ব্যবহারকারী ক (স্বল্প বাজেটের পর্যটক)" : "User A (Economy Traveler)"}
                    </h3>
                    <p className="text-xs font-semibold text-slate-500">
                      {isBn ? "শিক্ষার্থী / একাকী ভ্রমণকারী / স্বল্প বাজেট" : "Student / Solo Traveler / Low Budget"}
                    </p>
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-[10px] uppercase font-bold text-slate-400">
                    {isBn ? "বাজেট সীমা" : "Budget Range"}
                  </span>
                  <div className="text-xl font-black text-blue-600">
                    {isBn ? "৳ ৫০০" : "৳ 500"}
                  </div>
                </div>
              </div>

              {/* Persona Checklist items */}
              <div className="space-y-3.5 mt-6">
                <div className="flex items-start gap-3 p-3 rounded-xl bg-blue-50/50 border border-blue-100">
                  <CheckCircle2 className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-sm font-bold text-slate-900">
                      {isBn ? "নির্ধারিত বাজেট ফিল্টার: ৳০ — ৳৫০০" : "Exact Budget Filter: ৳0 — ৳500"}
                    </h4>
                    <p className="text-xs text-slate-600">
                      {isBn 
                        ? "অতিরিক্ত খরচ ছাড়া তাৎক্ষণিক নিরাপদ আবাসন ফিল্টারিং" 
                        : "Instant safe stay filtering without hidden markups"}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3 rounded-xl bg-blue-50/50 border border-blue-100">
                  <CheckCircle2 className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-sm font-bold text-slate-900">
                      {isBn ? "আজ রাতের জন্য ফাঁকা রুম" : "Available Room for Tonight"}
                    </h4>
                    <p className="text-xs text-slate-600">
                      {isBn 
                        ? "হোটেলের দরজায় না ঘুরে ঘরে বসেই খালি রুম নিশ্চিত করা" 
                        : "Securing vacant rooms directly without walking hotel to hotel"}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3 rounded-xl bg-blue-50/50 border border-blue-100">
                  <CheckCircle2 className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-sm font-bold text-slate-900">
                      {isBn ? "যাচাইকৃত রিভিউ দেখে সংক্ষিপ্ত তালিকা" : "Shortlist via Verified Reviews"}
                    </h4>
                    <p className="text-xs text-slate-600">
                      {isBn 
                        ? "কম বাজেটেও পরিচ্ছন্নতা ও নিরাপত্তা রিভিউ দ্বারা নিশ্চিত" 
                        : "Ensuring hygiene and safety standards verified by authentic reviews"}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3 rounded-xl bg-blue-50/50 border border-blue-100">
                  <CheckCircle2 className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-sm font-bold text-slate-900">
                      {isBn ? "ইনস্ট্যান্ট বুকিং অথবা হোটেলে সরাসরি পরিশোধ" : "Instant Booking or Pay-at-Hotel Option"}
                    </h4>
                    <p className="text-xs text-slate-600">
                      {isBn 
                        ? "অ্যাপ থেকেই সাথে সাথে ডিজিটাল ভাউচার গ্রহণ" 
                        : "Instant digital voucher directly issued upon booking"}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <button
              onClick={() => navigate("/hotels?maxPrice=600")}
              className="w-full mt-8 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm transition-all flex items-center justify-center gap-2 shadow-lg shadow-blue-500/20 active:scale-98"
            >
              <span>{isBn ? "বাজেট হোটেল খুঁজুন (≤ ৳৬০০)" : "Explore Budget Stays (≤ ৳600)"}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </motion.div>

          {/* Persona B: Budget ৳5,000 */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.15 }}
            className="bg-white rounded-3xl p-6 md:p-8 border border-emerald-200 shadow-xl shadow-emerald-500/5 flex flex-col justify-between relative overflow-hidden"
          >
            {/* Top Accent Strip */}
            <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-emerald-500 to-teal-500" />

            <div>
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-black text-lg border border-emerald-100">
                    B
                  </div>
                  <div>
                    <h3 className="text-lg font-black text-slate-900">
                      {isBn ? "ব্যবহারকারী খ (পারিবারিক ও প্রিমিয়াম পর্যটক)" : "User B (Family & Premium Traveler)"}
                    </h3>
                    <p className="text-xs font-semibold text-slate-500">
                      {isBn ? "পরিবার / কর্পোরেট ট্রাভেলার / প্রিমিয়াম ছুটি" : "Family / Corporate Traveler / Premium Vacation"}
                    </p>
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-[10px] uppercase font-bold text-slate-400">
                    {isBn ? "বাজেট সীমা" : "Budget Range"}
                  </span>
                  <div className="text-xl font-black text-emerald-600">
                    {isBn ? "৳ ৫,০০০+" : "৳ 5,000+"}
                  </div>
                </div>
              </div>

              {/* Persona Checklist items */}
              <div className="space-y-3.5 mt-6">
                <div className="flex items-start gap-3 p-3 rounded-xl bg-emerald-50/50 border border-emerald-100">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-sm font-bold text-slate-900">
                      {isBn ? "বাজেট ফিল্টার: ৳৩,০০০ — ৳৫,০০০+" : "Budget Filter: ৳3,000 — ৳5,000+"}
                    </h4>
                    <p className="text-xs text-slate-600">
                      {isBn 
                        ? "রিসোর্ট, স্কাই ভিলা এবং এক্সিকিউটিভ স্যুটের বিস্তৃত তালিকা" 
                        : "Curated resorts, sky villas, and executive luxury suites"}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3 rounded-xl bg-emerald-50/50 border border-emerald-100">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-sm font-bold text-slate-900">
                      {isBn ? "হোটেল রেটিং, সুযোগ-সুবিধা ও সুনাম" : "Hotel Rating, Amenities & Reputation"}
                    </h4>
                    <p className="text-xs text-slate-600">
                      {isBn 
                        ? "ইনফিনিটি পুল, সৌজন্যমূলক সকালের নাস্তা ও সমুদ্রের ভিউ" 
                        : "Infinity pools, complimentary breakfast, and sea-view assurances"}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3 rounded-xl bg-emerald-50/50 border border-emerald-100">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-sm font-bold text-slate-900">
                      {isBn ? "রুমের ধরন ও বাতিলের নীতিমালা" : "Room Categories & Cancellation Policy"}
                    </h4>
                    <p className="text-xs text-slate-600">
                      {isBn 
                        ? "বিনামূল্যে বাতিল ও স্বচ্ছ রিফান্ড পলিসি যাচাই" 
                        : "Free cancellation and transparent refund policies"}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3 rounded-xl bg-emerald-50/50 border border-emerald-100">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-sm font-bold text-slate-900">
                      {isBn ? "অনলাইন পেমেন্ট ও প্রিমিয়াম ইনভয়েস" : "Online Payment & Corporate Invoicing"}
                    </h4>
                    <p className="text-xs text-slate-600">
                      {isBn 
                        ? "বিকাশ, কার্ড বা কর্পোরেট বিলিং এবং অটোমেটেড রসিদ" 
                        : "bKash, card, or corporate billing with automated GST receipts"}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <button
              onClick={() => navigate("/hotels?minPrice=3000")}
              className="w-full mt-8 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm transition-all flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20 active:scale-98"
            >
              <span>{isBn ? "প্রিমিয়াম হোটেল খুঁজুন (≥ ৳৩,০০০)" : "Explore Luxury Stays (≥ ৳3,000)"}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </motion.div>

        </div>

        {/* Bottom Banner */}
        <div className="mt-12 text-center max-w-3xl mx-auto p-4 rounded-2xl bg-white border border-slate-200 shadow-xs">
          <p className="text-xs md:text-sm font-semibold text-slate-700">
            {isBn ? (
              <>
                💡 <span className="font-bold text-emerald-600">StayBD এর মূল দর্শন:</span> যেকোনো বাজেটের নাগরিকের জন্য হোটেল ভাড়ার অসঙ্গতি দূর করা এবং নিরাপদ আবাসন নিশ্চিত করা।
              </>
            ) : (
              <>
                💡 <span className="font-bold text-emerald-600">StayBD Core Vision:</span> Eliminating unfair pricing disparities and ensuring safe accommodations for all citizens on any budget.
              </>
            )}
          </p>
        </div>

      </div>
    </section>
  );
};

export default DualPersonaComparison;
