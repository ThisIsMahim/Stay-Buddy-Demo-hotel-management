import { useState } from "react";
import { useTranslation } from "react-i18next";
import { motion, AnimatePresence } from "framer-motion";
import { Heart, Star, ChevronLeft, ChevronRight, Sparkles, MapPin, Building2, Check } from "lucide-react";
import { Link } from "react-router-dom";
import ReviewModal from "./ReviewModal";

interface PropertyCardProps {
  id: string;
  images: string[];
  location: string;
  distance: string;
  dates: string; // Used for Room Name/Type
  price: number;
  originalPrice?: number;
  rating: number;
  isGuestFavorite?: boolean;
  status?: "Available" | "Booked" | "Few left";
  totalReviews?: number;
}

const DEFAULT_IMAGES = [
  "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800",
  "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=800",
  "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=800"
];

const PropertyCard = ({
  id,
  images,
  location,
  distance,
  dates,
  price,
  originalPrice,
  rating,
  isGuestFavorite = false,
  status = "Available",
  totalReviews = 0,
}: PropertyCardProps) => {
  const { t, i18n } = useTranslation();
  const isBn = i18n.language?.startsWith("bn");
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);

  // Persistent dynamic favorite state
  const [isFavorite, setIsFavorite] = useState(() => {
    try {
      const saved = localStorage.getItem("stay_buddy_favorites");
      if (saved) {
        const favList = JSON.parse(saved);
        return Array.isArray(favList) && favList.includes(id);
      }
    } catch {
      // ignore
    }
    return false;
  });

  // Filter out any broken images or promo flyer banners with text
  const safeImages = (images && images.length > 0)
    ? images.map((img) => {
        if (
          !img ||
          img.includes("fixtq7dx5qlhlzewy2wn") ||
          img.includes("skybridgesystems") ||
          img.includes("undefined")
        ) {
          return "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=800";
        }
        return img;
      })
    : DEFAULT_IMAGES;

  const nextImage = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setCurrentImageIndex((prev) => (prev + 1) % safeImages.length);
  };

  const prevImage = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setCurrentImageIndex((prev) => (prev - 1 + safeImages.length) % safeImages.length);
  };

  const toggleFavorite = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsFavorite((prev) => {
      const next = !prev;
      try {
        const saved = localStorage.getItem("stay_buddy_favorites");
        let favList: string[] = saved ? JSON.parse(saved) : [];
        if (next) {
          if (!favList.includes(id)) favList.push(id);
        } else {
          favList = favList.filter((fId) => fId !== id);
        }
        localStorage.setItem("stay_buddy_favorites", JSON.stringify(favList));
      } catch {
        // ignore
      }
      return next;
    });
  };

  const getRatingLabel = (score: number) => {
    if (score >= 4.8) return isBn ? "চমৎকার" : "Wonderful";
    if (score >= 4.5) return isBn ? "অনবদ্য" : "Exceptional";
    if (score >= 4.0) return isBn ? "দারুণ" : "Excellent";
    return isBn ? "ভালো" : "Very Good";
  };

  return (
    <>
      <Link to={`/property/${id}`} className="block h-full select-none">
        <motion.div
          className="property-card h-full cursor-pointer group bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-2xl border border-slate-200/80 hover:border-emerald-500/40 transition-all duration-300 flex flex-col justify-between"
          whileHover={{ y: -6 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          {/* Image & Overlays */}
          <div className="relative aspect-[4/3] w-full overflow-hidden bg-slate-100">
            <AnimatePresence mode="wait">
              <motion.img
                key={currentImageIndex}
                src={safeImages[currentImageIndex]}
                alt={location}
                className="w-full h-full object-cover group-hover:scale-106 transition-transform duration-700 ease-out"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
              />
            </AnimatePresence>

            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/40 via-transparent to-black/10 pointer-events-none" />

            {/* Badges Overlay */}
            <div className="absolute top-3 left-3 flex flex-col gap-1.5 z-10">
              {isGuestFavorite && (
                <span className="bg-white/95 backdrop-blur-md text-[10px] font-black uppercase tracking-wider text-[#FF385C] px-2.5 py-1 rounded-full shadow-sm border border-rose-100 flex items-center gap-1">
                  <Sparkles className="w-3 h-3 fill-current" />
                  {isBn ? "গেস্ট ফেভারিট" : t("Guest favorite")}
                </span>
              )}
              <span
                className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider shadow-sm backdrop-blur-md flex items-center gap-1 ${
                  status === "Available"
                    ? "bg-emerald-600/90 text-white"
                    : status === "Booked"
                    ? "bg-slate-800/90 text-white"
                    : "bg-amber-600/90 text-white"
                }`}
              >
                <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                {t(status)}
              </span>
              {originalPrice && originalPrice > price && (
                <span className="bg-[#FF385C] text-white px-2.5 py-1 rounded-full text-[10px] font-black tracking-wider shadow-sm">
                  {isBn ? `৳${(originalPrice - price).toLocaleString()} ছাড়` : `Save ৳${(originalPrice - price).toLocaleString()}`}
                </span>
              )}
            </div>

            {/* Dynamic Wishlist Heart Button */}
            <button
              onClick={toggleFavorite}
              title={isFavorite ? (isBn ? "পছন্দ থেকে সরান" : "Remove from favorites") : (isBn ? "পছন্দে যোগ করুন" : "Add to favorites")}
              className={`absolute top-3 right-3 z-10 p-2.5 rounded-full backdrop-blur-md transition-all shadow-md border ${
                isFavorite
                  ? "bg-rose-500 border-rose-400 text-white scale-105"
                  : "bg-white/70 border-white/50 text-slate-700 hover:bg-white hover:text-rose-500 hover:scale-110"
              }`}
            >
              <Heart className={`h-4 w-4 transition-colors ${isFavorite ? "fill-current" : ""}`} />
            </button>

            {/* Navigation Arrows on Hover */}
            <AnimatePresence>
              {isHovered && safeImages.length > 1 && (
                <>
                  <motion.button
                    initial={{ opacity: 0, x: -8 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -8 }}
                    onClick={prevImage}
                    className="absolute left-2.5 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white text-slate-800 rounded-full p-1.5 shadow-lg backdrop-blur-md transition-all z-10"
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </motion.button>
                  <motion.button
                    initial={{ opacity: 0, x: 8 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 8 }}
                    onClick={nextImage}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white text-slate-800 rounded-full p-1.5 shadow-lg backdrop-blur-md transition-all z-10"
                  >
                    <ChevronRight className="h-4 w-4" />
                  </motion.button>
                </>
              )}
            </AnimatePresence>

            {/* Dots */}
            {safeImages.length > 1 && (
              <div className="absolute bottom-2.5 left-1/2 -translate-x-1/2 flex gap-1 z-10">
                {safeImages.slice(0, 5).map((_, index) => (
                  <span
                    key={index}
                    className={`h-1.5 rounded-full transition-all duration-300 ${
                      index === currentImageIndex ? "bg-white w-4" : "bg-white/50 w-1.5"
                    }`}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Details Content */}
          <div className="p-4 md:p-5 flex-1 flex flex-col justify-between">
            <div>
              {/* Category & Stars */}
              <div className="flex items-center justify-between mb-2 text-[11px] font-bold">
                <span className="text-slate-500 bg-slate-100 px-2.5 py-0.5 rounded-md flex items-center gap-1">
                  <Building2 className="w-3 h-3 text-slate-400" />
                  {isBn ? "হোটেল" : "Hotel"}
                </span>
                <div className="flex items-center gap-0.5 text-amber-500">
                  <Star className="w-3.5 h-3.5 fill-amber-400" />
                  <span className="text-xs font-bold text-slate-700">{rating.toFixed(1)}</span>
                </div>
              </div>

              {/* Hotel Name & Location */}
              <div className="flex items-start justify-between gap-2 mb-1">
                <h3 className="font-extrabold text-base md:text-lg text-slate-900 group-hover:text-emerald-700 transition-colors line-clamp-1 flex-1">
                  {location}
                </h3>
              </div>

              <div className="flex items-center gap-1 text-slate-500 text-xs font-medium mb-3">
                <MapPin className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <span className="uppercase tracking-wider font-bold text-slate-600">{distance}</span>
                {dates && <span className="text-slate-400">• {dates}</span>}
              </div>

              {/* Clean Rating & Review Pill (No squished ellipsis) */}
              <div className="flex items-center justify-between gap-2 p-2.5 bg-slate-50 rounded-2xl border border-slate-100 mb-4">
                <div className="flex items-center gap-2 min-w-0">
                  <div className="bg-[#003580] text-white font-black text-xs w-7 h-7 flex items-center justify-center rounded-lg shadow-xs shrink-0">
                    {rating.toFixed(1)}
                  </div>
                  <div className="flex flex-col leading-tight min-w-0">
                    <span className="text-xs font-bold text-slate-800 truncate">
                      {getRatingLabel(rating)}
                    </span>
                    <span className="text-[10px] text-slate-400 font-medium truncate">
                      {totalReviews} {isBn ? "রিভিউ" : "reviews"}
                    </span>
                  </div>
                </div>

                <button
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    setIsReviewModalOpen(true);
                  }}
                  className="shrink-0 bg-white hover:bg-[#FF385C] text-[#FF385C] hover:text-white border border-rose-100 text-[10px] font-bold px-2.5 py-1.5 rounded-xl transition-all shadow-xs active:scale-95"
                >
                  {isBn ? "রিভিউ দিন" : t("Review")}
                </button>
              </div>
            </div>

            {/* Price Footer */}
            <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
              <div>
                <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">
                  {isBn ? "মোট ভাড়া" : "Total Stay"}
                </span>
                <div className="flex items-baseline gap-1.5">
                  <span className="font-black text-slate-900 text-xl leading-none">
                    ৳{price.toLocaleString()}
                  </span>
                  {originalPrice && originalPrice > price && (
                    <span className="text-xs text-slate-400 line-through font-medium">
                      ৳{originalPrice.toLocaleString()}
                    </span>
                  )}
                  <span className="text-[11px] text-slate-500 font-normal">
                    {isBn ? "/ রাত" : "/ night"}
                  </span>
                </div>
              </div>

              <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-3 py-1.5 rounded-xl border border-emerald-200 group-hover:bg-emerald-600 group-hover:text-white transition-colors">
                {isBn ? "দেখুন" : "View"}
              </span>
            </div>
          </div>
        </motion.div>
      </Link>

      <ReviewModal
        isOpen={isReviewModalOpen}
        onClose={() => setIsReviewModalOpen(false)}
        hotelId={id}
        hotelName={location}
      />
    </>
  );
};

export default PropertyCard;
