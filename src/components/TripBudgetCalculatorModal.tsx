import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Calculator, X, MapPin, Calendar, Users, 
  Sparkles, CheckCircle2, ArrowRight, Banknote, Coffee, Car 
} from "lucide-react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";

interface DestinationCostData {
  nameEn: string;
  nameBn: string;
  avgHotelBudgetPerNight: number; // in BDT
  avgHotelLuxuryPerNight: number;
  avgDailyFoodPerPerson: number;
  avgTransportCost: number;
}

const DESTINATION_RATES: Record<string, DestinationCostData> = {
  "Cox's Bazar": {
    nameEn: "Cox's Bazar",
    nameBn: "কক্সবাজার",
    avgHotelBudgetPerNight: 2200,
    avgHotelLuxuryPerNight: 7500,
    avgDailyFoodPerPerson: 800,
    avgTransportCost: 2000,
  },
  "Sylhet & Sreemangal": {
    nameEn: "Sylhet & Sreemangal",
    nameBn: "সিলেট ও শ্রীমঙ্গল",
    avgHotelBudgetPerNight: 1800,
    avgHotelLuxuryPerNight: 6500,
    avgDailyFoodPerPerson: 700,
    avgTransportCost: 1600,
  },
  "Sajek Valley": {
    nameEn: "Sajek Valley",
    nameBn: "সাজেক ভ্যালি",
    avgHotelBudgetPerNight: 2500,
    avgHotelLuxuryPerNight: 5500,
    avgDailyFoodPerPerson: 650,
    avgTransportCost: 2400,
  },
  "Kuakata": {
    nameEn: "Kuakata",
    nameBn: "কুয়াকাটা",
    avgHotelBudgetPerNight: 1800,
    avgHotelLuxuryPerNight: 4800,
    avgDailyFoodPerPerson: 600,
    avgTransportCost: 1800,
  },
  "Bandarban": {
    nameEn: "Bandarban",
    nameBn: "বান্দরবান",
    avgHotelBudgetPerNight: 1900,
    avgHotelLuxuryPerNight: 5200,
    avgDailyFoodPerPerson: 650,
    avgTransportCost: 2200,
  },
};

export const TripBudgetCalculatorModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
}> = ({ isOpen, onClose }) => {
  const { i18n } = useTranslation();
  const isBn = i18n.language?.startsWith("bn");
  const navigate = useNavigate();

  const [destination, setDestination] = useState("Cox's Bazar");
  const [nights, setNights] = useState(2);
  const [guests, setGuests] = useState(2);
  const [tier, setTier] = useState<"budget" | "luxury">("budget");

  if (!isOpen) return null;

  const destData = DESTINATION_RATES[destination] || DESTINATION_RATES["Cox's Bazar"];
  const hotelRatePerNight = tier === "budget" ? destData.avgHotelBudgetPerNight : destData.avgHotelLuxuryPerNight;
  
  // Calculate rooms needed (assume 2 guests per room)
  const roomsNeeded = Math.ceil(guests / 2);
  const totalHotelCost = hotelRatePerNight * nights * roomsNeeded;
  const totalFoodCost = destData.avgDailyFoodPerPerson * (nights + 1) * guests;
  const totalTransportCost = destData.avgTransportCost * guests;
  const grandTotal = totalHotelCost + totalFoodCost + totalTransportCost;
  const perPersonCost = Math.round(grandTotal / guests);

  const handleExploreStays = () => {
    onClose();
    const destQuery = destination.split(" ")[0]; // "Cox's" or "Sylhet"
    navigate(`/hotels?destination=${encodeURIComponent(destQuery)}`);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className="bg-white rounded-3xl shadow-2xl border border-slate-100 max-w-xl w-full overflow-hidden text-slate-900 flex flex-col max-h-[90vh]"
      >
        {/* Modal Header */}
        <div className="bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-800 p-6 text-white flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center border border-white/20">
              <Calculator className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-lg md:text-xl font-black text-white">
                {isBn ? "স্মার্ট ভ্রমণ বাজেট ক্যালকুলেটর" : "Smart Trip Cost Estimator"}
              </h2>
              <p className="text-xs text-emerald-100">
                {isBn ? "হোটেল + খাবার + ট্রান্সপোর্টের নিখুঁত হিসাব" : "MakeMyTrip-Style Hotel & Travel Budget Planner"}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-full bg-black/15 hover:bg-black/25 text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-5">
          {/* 1. Destination Select */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              {isBn ? "গন্তব্য নির্বাচন করুন" : "Select Destination"}
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {Object.keys(DESTINATION_RATES).map((dest) => (
                <button
                  key={dest}
                  onClick={() => setDestination(dest)}
                  className={`py-2 px-3 rounded-xl text-xs font-bold transition-all border text-left flex items-center justify-between ${
                    destination === dest
                      ? "bg-emerald-500 text-white border-emerald-500 shadow-md shadow-emerald-500/20"
                      : "bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200"
                  }`}
                >
                  <span className="truncate">
                    {isBn ? DESTINATION_RATES[dest].nameBn : DESTINATION_RATES[dest].nameEn}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* 2. Nights & Guests */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                {isBn ? "রাত্রির সংখ্যা" : "Nights to Stay"}
              </label>
              <div className="flex items-center gap-2">
                {[1, 2, 3, 4, 5].map((n) => (
                  <button
                    key={n}
                    onClick={() => setNights(n)}
                    className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all border ${
                      nights === n
                        ? "bg-slate-900 text-white border-slate-900"
                        : "bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100"
                    }`}
                  >
                    {n} {isBn ? "রাত" : "N"}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                {isBn ? "ভ্রমণকারী সংখ্যা" : "Travelers"}
              </label>
              <div className="flex items-center gap-2">
                {[1, 2, 4, 6].map((g) => (
                  <button
                    key={g}
                    onClick={() => setGuests(g)}
                    className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all border ${
                      guests === g
                        ? "bg-slate-900 text-white border-slate-900"
                        : "bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100"
                    }`}
                  >
                    {g} {isBn ? "জন" : "P"}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* 3. Style Tier */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              {isBn ? "আবাসনের ক্যাটাগরি" : "Stay Style"}
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => setTier("budget")}
                className={`p-3 rounded-2xl border text-left transition-all ${
                  tier === "budget"
                    ? "bg-emerald-50 border-emerald-500 ring-2 ring-emerald-500/20"
                    : "bg-slate-50 border-slate-200 hover:bg-slate-100"
                }`}
              >
                <div className="text-xs font-bold text-slate-900">
                  {isBn ? "বাজেট ও ফ্যামিলি স্টে" : "Comfort / Budget Stay"}
                </div>
                <div className="text-[11px] text-slate-500 mt-0.5">
                  ~৳{destData.avgHotelBudgetPerNight.toLocaleString()}/night
                </div>
              </button>

              <button
                onClick={() => setTier("luxury")}
                className={`p-3 rounded-2xl border text-left transition-all ${
                  tier === "luxury"
                    ? "bg-emerald-50 border-emerald-500 ring-2 ring-emerald-500/20"
                    : "bg-slate-50 border-slate-200 hover:bg-slate-100"
                }`}
              >
                <div className="text-xs font-bold text-slate-900">
                  {isBn ? "৪/৫ স্টার লাক্সারি রিসোর্ট" : "4/5-Star Luxury Resort"}
                </div>
                <div className="text-[11px] text-slate-500 mt-0.5">
                  ~৳{destData.avgHotelLuxuryPerNight.toLocaleString()}/night
                </div>
              </button>
            </div>
          </div>

          {/* Cost Breakdown Card */}
          <div className="bg-slate-900 text-white rounded-2xl p-5 border border-slate-800">
            <div className="text-xs font-bold text-emerald-400 uppercase tracking-wider mb-3">
              {isBn ? "আনুমানিক খরচের বিবরণ" : "Estimated Cost Breakdown"}
            </div>

            <div className="space-y-2 text-xs">
              <div className="flex items-center justify-between text-slate-300">
                <span className="flex items-center gap-1.5">
                  <Banknote className="w-3.5 h-3.5 text-emerald-400" />
                  {isBn ? `হোটেল ও রিসোর্ট (${nights} রাত, ${roomsNeeded} রুম):` : `Hotel & Resort (${nights}n, ${roomsNeeded} rm):`}
                </span>
                <span className="font-bold text-white">৳{totalHotelCost.toLocaleString()}</span>
              </div>

              <div className="flex items-center justify-between text-slate-300">
                <span className="flex items-center gap-1.5">
                  <Coffee className="w-3.5 h-3.5 text-amber-400" />
                  {isBn ? `খাবার ও ডাইনিং (${guests} জন):` : `Food & Dining (${guests} guests):`}
                </span>
                <span className="font-bold text-white">৳{totalFoodCost.toLocaleString()}</span>
              </div>

              <div className="flex items-center justify-between text-slate-300">
                <span className="flex items-center gap-1.5">
                  <Car className="w-3.5 h-3.5 text-cyan-400" />
                  {isBn ? `যাতায়াত ও লোকাল সাইটসিয়িং:` : `Local Transport & Travel:`}
                </span>
                <span className="font-bold text-white">৳{totalTransportCost.toLocaleString()}</span>
              </div>

              <div className="pt-3 border-t border-slate-800 flex items-center justify-between text-sm mt-2">
                <span className="font-black text-white">{isBn ? "মোট সম্ভাব্য বাজেট:" : "Total Estimated Budget:"}</span>
                <span className="text-lg font-black text-emerald-400">৳{grandTotal.toLocaleString()}</span>
              </div>

              <div className="text-right text-[11px] text-slate-400">
                {isBn ? `(মাথাপিছু প্রায় ৳${perPersonCost.toLocaleString()})` : `(~৳${perPersonCost.toLocaleString()} per person)`}
              </div>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between shrink-0">
          <button
            onClick={onClose}
            className="px-4 py-2.5 rounded-xl border border-slate-200 text-slate-700 font-bold text-xs hover:bg-slate-100 transition-colors"
          >
            {isBn ? "বন্ধ করুন" : "Close"}
          </button>

          <button
            onClick={handleExploreStays}
            className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-xs flex items-center gap-2 shadow-md shadow-emerald-600/20 active:scale-95 transition-all"
          >
            <span>{isBn ? `${destination}-এর হোটেলগুলো দেখুন` : `View Hotels in ${destination}`}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default TripBudgetCalculatorModal;
