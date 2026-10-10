import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, MapPin, Star, X, CheckCircle2 } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";

interface ActivityItem {
  id: string;
  userName: string;
  userCity: string;
  hotelName: string;
  hotelCity: string;
  minutesAgo: number;
  image: string;
  rating: number;
  hotelId: string;
}

const SAMPLE_ACTIVITIES: ActivityItem[] = [
  {
    id: "1",
    userName: "Tanvir H.",
    userCity: "Dhaka",
    hotelName: "Sayeman Beach Resort",
    hotelCity: "Cox's Bazar",
    minutesAgo: 2,
    image: "https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=200",
    rating: 4.9,
    hotelId: "1",
  },
  {
    id: "2",
    userName: "Nusrat Jahan",
    userCity: "Chittagong",
    hotelName: "Grand Sultan Tea Resort",
    hotelCity: "Sreemangal",
    minutesAgo: 4,
    image: "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=200",
    rating: 4.8,
    hotelId: "2",
  },
  {
    id: "3",
    userName: "Arifur Rahman",
    userCity: "Sylhet",
    hotelName: "Sajek Cloud Eco Resort",
    hotelCity: "Sajek Valley",
    minutesAgo: 7,
    image: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=200",
    rating: 4.9,
    hotelId: "3",
  },
  {
    id: "4",
    userName: "Sadia Islam",
    userCity: "Rajshahi",
    hotelName: "Radisson Blu Chattogram",
    hotelCity: "Chattogram",
    minutesAgo: 11,
    image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=200",
    rating: 4.7,
    hotelId: "4",
  },
];

export const LiveBookingToast: React.FC = () => {
  const { i18n } = useTranslation();
  const isBn = i18n.language?.startsWith("bn");
  const [currentIdx, setCurrentIdx] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);

  useEffect(() => {
    if (isDismissed) return;

    // Initial delay before first toast
    const initialTimer = setTimeout(() => {
      setIsVisible(true);
    }, 4000);

    // Periodic cycling every 12 seconds
    const interval = setInterval(() => {
      setIsVisible(false);
      setTimeout(() => {
        setCurrentIdx((prev) => (prev + 1) % SAMPLE_ACTIVITIES.length);
        setIsVisible(true);
      }, 1000);
    }, 14000);

    return () => {
      clearTimeout(initialTimer);
      clearInterval(interval);
    };
  }, [isDismissed]);

  if (isDismissed) return null;

  const current = SAMPLE_ACTIVITIES[currentIdx];

  return (
    <div className="fixed bottom-20 md:bottom-6 left-4 z-40 max-w-sm pointer-events-none">
      <AnimatePresence>
        {isVisible && (
          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.35, ease: "easeOut" }}
            className="pointer-events-auto bg-white/95 backdrop-blur-xl border border-slate-200/90 rounded-2xl p-3.5 shadow-2xl shadow-slate-900/15 flex items-center gap-3.5"
          >
            {/* Thumbnail */}
            <div className="relative shrink-0">
              <img
                src={current.image}
                alt={current.hotelName}
                className="w-13 h-13 rounded-xl object-cover border border-slate-100 shadow-xs"
              />
              <span className="absolute -top-1 -right-1 w-3 h-3 bg-emerald-500 border-2 border-white rounded-full animate-ping" />
              <span className="absolute -top-1 -right-1 w-3 h-3 bg-emerald-500 border-2 border-white rounded-full" />
            </div>

            {/* Information */}
            <div className="flex-1 min-w-0 pr-1">
              <div className="flex items-center gap-1.5 text-[10px] font-semibold text-slate-500">
                <span className="font-bold text-slate-900">{current.userName}</span>
                <span>({current.userCity})</span>
                <span>•</span>
                <span className="text-emerald-600 font-medium">
                  {isBn ? `${current.minutesAgo} মিনিট আগে বুক করেছেন` : `booked ${current.minutesAgo}m ago`}
                </span>
              </div>

              <div className="text-xs font-black text-slate-900 truncate mt-0.5">
                {current.hotelName}
              </div>

              <div className="flex items-center gap-2 mt-0.5 text-[10px] text-slate-500">
                <span className="flex items-center gap-0.5">
                  <MapPin className="w-3 h-3 text-slate-400" />
                  {current.hotelCity}
                </span>
                <span className="flex items-center gap-0.5 font-bold text-amber-500">
                  <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                  {current.rating}
                </span>
              </div>
            </div>

            {/* Dismiss Button */}
            <button
              onClick={() => setIsDismissed(true)}
              className="p-1 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors shrink-0"
              title="Close"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default LiveBookingToast;
