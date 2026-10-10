import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  MapPin, Compass, Waves, Trees, Mountain, Landmark, 
  Coffee, ArrowRight, BedDouble, ShieldCheck, Sparkles, ExternalLink 
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import SpotHotelsModal from "./SpotHotelsModal";
import { 
  TouristSpot, 
  DEFAULT_TOURIST_SPOTS, 
  getStoredTouristSpots 
} from "../services/touristSpotsData";

// Re-export TouristSpot & TOURIST_SPOTS for seamless compatibility across the app
export type { TouristSpot };
export const TOURIST_SPOTS: TouristSpot[] = DEFAULT_TOURIST_SPOTS;

const CATEGORIES = [
  { id: "all", label: "All Regions", labelBn: "সব অঞ্চল", icon: Compass },
  { id: "sea", label: "Sea & Beach", labelBn: "সৈকত ও সমুদ্র", icon: Waves },
  { id: "forest", label: "Forest & Nature", labelBn: "বন ও প্রকৃতি", icon: Trees },
  { id: "hill", label: "Hill & Adventure", labelBn: "পাহাড় ও ট্র্যাকিং", icon: Mountain },
  { id: "heritage", label: "Heritage & History", labelBn: "ঐতিহ্য ও ইতিহাস", icon: Landmark },
  { id: "tea", label: "Tea & Haor", labelBn: "চা বাগান ও হাওর", icon: Coffee },
];

const ExploreBangladeshMap: React.FC = () => {
  const { i18n } = useTranslation();
  const isBn = i18n.language?.startsWith("bn");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [spots, setSpots] = useState<TouristSpot[]>(() => getStoredTouristSpots());
  const [activeModalSpot, setActiveModalSpot] = useState<TouristSpot | null>(null);
  const navigate = useNavigate();

  // Listen for admin changes dynamically
  useEffect(() => {
    const handleUpdate = () => {
      setSpots(getStoredTouristSpots());
    };
    window.addEventListener("staybd_spots_updated", handleUpdate);
    return () => window.removeEventListener("staybd_spots_updated", handleUpdate);
  }, []);

  const filteredSpots = selectedCategory === "all" 
    ? spots 
    : spots.filter(spot => spot.category === selectedCategory);

  // Show up to 8 spots on the home section preview
  const displayedSpots = filteredSpots.slice(0, 8);

  const handleSpotClick = (spot: TouristSpot) => {
    navigate(`/spot/${spot.id}`);
  };

  return (
    <section id="tourism-map" className="py-14 md:py-24 border-t border-slate-100 bg-gradient-to-b from-white via-slate-50/50 to-white relative overflow-hidden">
      {/* Decorative Ambient Background Glows */}
      <div className="absolute top-10 right-1/4 w-96 h-96 bg-emerald-500/5 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-10 left-10 w-96 h-96 bg-teal-500/5 rounded-full blur-[160px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 relative z-10">
        
        {/* Government / Institutional Header Badge */}
        <div className="flex flex-col items-center text-center mb-10">
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-3.5 sm:px-4 py-1.5 rounded-full bg-emerald-50/90 border border-emerald-200/80 text-emerald-800 text-[11px] sm:text-xs font-bold uppercase tracking-wider mb-4 shadow-xs backdrop-blur-sm"
          >
            <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>
              {isBn ? "জাতীয় ডিজিটাল পর্যটন উদ্যোগ • বাংলাদেশ" : "Official National Tourism Initiative • Bangladesh"}
            </span>
            <span className="text-emerald-300 hidden md:inline">•</span>
            <span className="text-emerald-700 font-semibold lowercase hidden md:inline">
              {isBn ? "বেসামরিক বিমান পরিবহন ও পর্যটন মন্ত্রণালয় + বিপিসি সমন্বিত" : "Civil Aviation & Tourism Ministry + BPC Aligned"}
            </span>
          </motion.div>

          <h2 className="text-2xl sm:text-4xl md:text-5xl font-black text-slate-900 tracking-tight max-w-4xl leading-[1.2] text-center">
            <span>{isBn ? "বাংলাদেশ অন্বেষণ" : "Explore Bangladesh"}</span>
            <span className="hidden sm:inline text-slate-300 font-light mx-2.5">—</span>
            <br className="sm:hidden" />
            <span className="bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 bg-clip-text text-transparent inline-block">
              {isBn ? "পর্যটন ও হোটেল মানচিত্র" : "Tourism & Hotel Map"}
            </span>
          </h2>
          <p className="text-slate-600 text-xs sm:text-sm md:text-base max-w-2xl mt-3 font-normal leading-relaxed px-2">
            {isBn 
              ? "দেশের প্রতিটি পর্যটন অঞ্চলে ভেরিফায়েড হোটেল ও রিয়েল-টাইম রুম প্রাপ্যতা। আপনার যেকোনো বাজেটে তাৎক্ষণিকভাবে পছন্দের রুম খুঁজুন এবং বুকিং করুন!"
              : "Verified hotels and real-time room availability across every tourism region in Bangladesh. Whatever your budget, find and book available rooms instantly!"}
          </p>
        </div>

        {/* Category Pill Filters (Tactile, Dynamic Counts & Phone-Optimized with Active Indicator) */}
        <div className="flex items-center justify-start md:justify-center gap-2 sm:gap-2.5 overflow-x-auto pb-4 mb-10 scrollbar-hide -mx-4 px-4 sm:mx-0 sm:px-0 snap-x snap-mandatory">
          {CATEGORIES.map((cat) => {
            const Icon = cat.icon;
            const isSelected = selectedCategory === cat.id;
            const count = cat.id === "all" 
              ? spots.length 
              : spots.filter(s => s.category === cat.id).length;

            return (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`relative flex items-center gap-2 px-4 py-2.5 rounded-full text-xs sm:text-sm font-semibold transition-colors shrink-0 snap-start active:scale-95 cursor-pointer ${
                  isSelected ? "text-white font-bold" : "text-slate-600 hover:text-slate-900 bg-white border border-slate-200/90 shadow-2xs hover:bg-slate-50"
                }`}
              >
                {/* Smooth Animated Background Pill */}
                {isSelected && (
                  <motion.div
                    layoutId="activeCategoryIndicator"
                    className="absolute inset-0 bg-gradient-to-r from-emerald-600 to-teal-600 rounded-full shadow-md shadow-emerald-600/25 ring-2 ring-emerald-500/20"
                    transition={{ type: "spring", stiffness: 450, damping: 32 }}
                  />
                )}

                <span className="relative z-10 flex items-center gap-2">
                  <Icon className={`w-3.5 sm:w-4 h-3.5 sm:h-4 ${isSelected ? "text-white" : "text-slate-400"}`} />
                  <span>{isBn ? cat.labelBn : cat.label}</span>
                  <span className={`text-[10px] px-2 py-0.5 rounded-full font-black ${
                    isSelected ? "bg-white/20 text-white" : "bg-slate-100 text-slate-500"
                  }`}>
                    {count}
                  </span>
                </span>
              </button>
            );
          })}
        </div>

        {/* Interactive Tourism Spots Grid with Staggered Fluid PopLayout Animations */}
        <motion.div 
          layout
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
        >
          <AnimatePresence mode="popLayout">
            {displayedSpots.map((spot, idx) => (
              <motion.div
                key={spot.id}
                layout
                initial={{ opacity: 0, scale: 0.92, y: 18 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.92, y: -10 }}
                transition={{ 
                  layout: { type: "spring", stiffness: 350, damping: 28 },
                  opacity: { duration: 0.2 },
                  duration: 0.35,
                  delay: idx * 0.035
                }}
                className="group relative bg-white rounded-3xl overflow-hidden border border-slate-200/90 shadow-sm hover:shadow-xl hover:border-emerald-400/60 hover:-translate-y-1.5 transition-all duration-300 flex flex-col justify-between"
              >
                {/* Image & Badges */}
                <div className="relative h-48 w-full overflow-hidden bg-slate-100">
                  <img
                    src={spot.image}
                    alt={spot.name}
                    className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-700 ease-out"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/85 via-slate-950/20 to-black/15" />

                  {/* Highlight Pill */}
                  <div className="absolute top-3 left-3 bg-slate-900/85 backdrop-blur-md border border-white/20 text-emerald-400 px-2.5 py-1 rounded-full text-[11px] font-bold tracking-wide shadow-sm flex items-center gap-1">
                    <Sparkles className="w-3 h-3 text-amber-400" />
                    <span>{isBn ? spot.highlightTagBn : spot.highlightTag}</span>
                  </div>

                  {/* Region Pill */}
                  <div className="absolute bottom-3 left-3 right-3 text-white">
                    <div className="flex items-center gap-1 text-xs font-medium text-slate-200">
                      <MapPin className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                      <span className="truncate">{isBn ? spot.regionBn : spot.region}</span>
                    </div>
                    <h3 className="text-lg font-black tracking-tight text-white mt-0.5 leading-tight">
                      {isBn ? spot.nameBn : spot.name}
                    </h3>
                  </div>
                </div>

                {/* Body Content */}
                <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between space-y-4">
                  <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed font-normal">
                    {isBn ? spot.descriptionBn : spot.description}
                  </p>

                  <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                    <div>
                      <div className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider">
                        {isBn ? "ভেরিফায়েড হোটেল" : "Verified Stays"}
                      </div>
                      <div className="flex items-center gap-1 text-xs font-bold text-slate-800 mt-0.5">
                        <BedDouble className="w-3.5 h-3.5 text-emerald-600" />
                        <span>
                          {isBn ? `${spot.nearbyHotelsCount}টি হোটেল রয়েছে` : `${spot.nearbyHotelsCount} Hotels Listed`}
                        </span>
                      </div>
                    </div>

                    <div className="text-right">
                      <div className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider">
                        {isBn ? "শুরু" : "From"}
                      </div>
                      <div className="text-sm font-black text-emerald-600 mt-0.5">
                        ৳{spot.startingPrice.toLocaleString()} <span className="text-[10px] font-normal text-slate-500">{isBn ? "/ রাত" : "/ night"}</span>
                      </div>
                    </div>
                  </div>

                  {/* 1-Click Search CTA */}
                  <button
                    onClick={() => handleSpotClick(spot)}
                    className="w-full py-2.5 px-4 rounded-xl bg-slate-900 group-hover:bg-emerald-600 text-white font-bold text-xs transition-colors flex items-center justify-center gap-1.5 shadow-sm active:scale-95 cursor-pointer"
                  >
                    <span>{isBn ? "উপলব্ধ হোটেল দেখুন" : "View Available Hotels"}</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                  </button>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>

        {/* View All Button Navigating to /tourism-map */}
        <div className="mt-12 flex flex-col items-center justify-center text-center">
          <button
            onClick={() => navigate("/tourism-map")}
            className="px-8 py-3.5 rounded-2xl bg-slate-900 hover:bg-emerald-600 text-white font-bold text-xs md:text-sm shadow-xl shadow-slate-900/10 hover:shadow-emerald-600/25 transition-all flex items-center gap-2 group active:scale-95 cursor-pointer"
          >
            <span>
              {isBn 
                ? "সবগুলো পর্যটন স্পট ও সম্পূর্ণ মানচিত্র দেখুন (View All)" 
                : "View All Tourism Spots & Full Map"}
            </span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>
          <p className="text-xs text-slate-500 mt-2.5 font-medium">
            {isBn 
              ? "৬৪ জেলার সকল দর্শনীয় স্থান, বিভাগীয় ফিল্টারিং ও পর্যটন পুলিশের সহায়তা দেখতে প্রবেশ করুন" 
              : "Discover all destinations across 64 districts with division filters & safety helpline"}
          </p>
        </div>

        {/* Footnote matching Slide 19 */}
        <div className="mt-8 text-center text-xs text-slate-400 font-medium">
          <span>
            {isBn 
              ? "* সমস্ত মানচিত্রের তথ্য, লাইভ রুম প্রাপ্যতা এবং যাচাইকৃত হোটেল রেট নিয়মিত পর্যবেক্ষণ ও হালনাগাদ করা হয়।" 
              : "* All map data, live room availability, and verified hotel rates are monitored and updated continuously."}
          </span>
        </div>

      </div>

      {/* Production-Grade Spot Hotels Modal */}
      <SpotHotelsModal
        spot={activeModalSpot}
        onClose={() => setActiveModalSpot(null)}
      />
    </section>
  );
};

export default ExploreBangladeshMap;
