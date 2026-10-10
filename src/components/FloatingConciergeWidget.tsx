import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Headphones, MessageCircle, Phone, HelpCircle, 
  X, Sparkles, CheckCircle2, ChevronRight, ShieldCheck 
} from "lucide-react";
import { useTranslation } from "react-i18next";

export const FloatingConciergeWidget: React.FC = () => {
  const { i18n } = useTranslation();
  const isBn = i18n.language?.startsWith("bn");
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            className="mb-3 w-80 sm:w-96 bg-white/95 backdrop-blur-2xl rounded-3xl shadow-2xl border border-slate-200/90 overflow-hidden text-slate-900"
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-emerald-600 via-emerald-700 to-teal-800 p-5 text-white relative">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-10 h-10 rounded-2xl bg-white/15 backdrop-blur-md flex items-center justify-center border border-white/20">
                    <Headphones className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h3 className="font-extrabold text-sm text-white flex items-center gap-1.5">
                      <span>{isBn ? "StayBD ট্রাভেল হেল্পডেস্ক" : "StayBD 24/7 Concierge"}</span>
                      <span className="w-2 h-2 rounded-full bg-emerald-300 animate-ping" />
                    </h3>
                    <p className="text-[11px] text-emerald-100">
                      {isBn ? "গড় রেসপন্স টাইম: ২ মিনিট" : "Avg response time: ~2 mins"}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-1.5 rounded-full bg-black/10 hover:bg-black/20 text-white transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Content Body */}
            <div className="p-4 space-y-3">
              <div className="text-xs text-slate-600 font-medium">
                {isBn
                  ? "হোটেল বুকিং, বিকাশ পেমেন্ট বা ভ্রমণ সংক্রান্ত যেকোনো সহায়তায় আমাদের প্রতিনিধি প্রস্তুত আছেন:"
                  : "Need help with hotel bookings, bKash payments, or customized tour packages? Connect with us:"}
              </div>

              {/* Action 1: WhatsApp Support */}
              <a
                href="https://wa.me/8801700000000?text=Hi%20StayBD%2C%20I%20need%20assistance%20with%20hotel%20booking"
                target="_blank"
                rel="noreferrer"
                className="flex items-center justify-between p-3 rounded-2xl bg-emerald-50 hover:bg-emerald-100 border border-emerald-200/80 transition-all group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-emerald-500 text-white flex items-center justify-center shrink-0 shadow-sm">
                    <MessageCircle className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-slate-900 group-hover:text-emerald-800 transition-colors">
                      {isBn ? "হোয়াটসঅ্যাপ লাইভ চ্যাট" : "WhatsApp Live Chat"}
                    </div>
                    <div className="text-[10px] text-slate-500">
                      {isBn ? "সরাসরি এক্সপার্টের সাথে কথা বলুন" : "Instant chat with travel specialist"}
                    </div>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-emerald-600 group-hover:translate-x-1 transition-transform" />
              </a>

              {/* Action 2: Phone Hotline */}
              <a
                href="tel:+8809612000000"
                className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 hover:bg-slate-100 border border-slate-200/80 transition-all group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-blue-600 text-white flex items-center justify-center shrink-0 shadow-sm">
                    <Phone className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-slate-900 group-hover:text-blue-700 transition-colors">
                      {isBn ? "২৪/৭ জরুরি হটলাইন" : "24/7 Dedicated Hotline"}
                    </div>
                    <div className="text-[10px] text-slate-500">
                      09612-STAYBD (+880 9612-000000)
                    </div>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-400 group-hover:translate-x-1 transition-transform" />
              </a>

              {/* Action 3: bKash / Payment Help */}
              <div className="p-3 rounded-2xl bg-amber-50/70 border border-amber-200/80 flex items-start gap-2.5">
                <ShieldCheck className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                <div className="text-[11px] text-amber-900">
                  <span className="font-bold">{isBn ? "পেমেন্ট নিরাপত্তা:" : "Payment Assurance:"}</span>{" "}
                  {isBn
                    ? "সকল বিকাশ, নগদ ও কার্ড পেমেন্ট ১০০% এসক্রো দ্বারা সুরক্ষিত।"
                    : "All bKash, Nagad & Card transactions protected by 100% escrow guarantee."}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Trigger Button */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen((prev) => !prev)}
        className="flex items-center gap-2.5 px-4 py-3.5 rounded-full bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs shadow-2xl shadow-slate-900/30 border border-slate-700 transition-all group"
      >
        <div className="relative">
          <Headphones className="w-4 h-4 text-emerald-400 group-hover:rotate-12 transition-transform" />
          <span className="absolute -top-1 -right-1 w-2 h-2 bg-emerald-400 rounded-full animate-ping" />
        </div>
        <span>{isBn ? "২৪/৭ সহায়তা" : "24/7 Concierge"}</span>
      </motion.button>
    </div>
  );
};

export default FloatingConciergeWidget;
