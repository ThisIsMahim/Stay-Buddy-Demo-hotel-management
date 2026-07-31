import { useState } from "react";
import { useTranslation } from "react-i18next";
import { motion, AnimatePresence } from "framer-motion";
import { Heart, Star, ChevronLeft, ChevronRight, Sparkles, MapPin } from "lucide-react";
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
  const { t } = useTranslation();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isFavorite, setIsFavorite] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);

  const nextImage = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setCurrentImageIndex((prev) => (prev + 1) % images.length);
  };

  const prevImage = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  const toggleFavorite = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsFavorite(!isFavorite);
  };

  return (
    <>
      <Link to={`/property/${id}`}>
        <motion.div
          className="property-card cursor-pointer group bg-white rounded-[32px] overflow-hidden shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_30px_60px_-15px_rgba(0,0,0,0.12)] border border-slate-100/50 hover:border-slate-200/60 transition-all"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          whileHover={{ y: -10 }}
          whileTap={{ scale: 0.97 }}
          transition={{ duration: 0.5, ease: [0.23, 1, 0.32, 1] }}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          {/* Image Carousel */}
          <div className="relative aspect-square overflow-hidden">
            <AnimatePresence mode="wait">
              <motion.img
                key={currentImageIndex}
                src={images[currentImageIndex]}
                alt={location}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-in-out"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.5 }}
              />
            </AnimatePresence>

            {/* Status Badge */}
            <div className="absolute top-4 left-4 flex flex-col gap-2 z-10">
              {isGuestFavorite && (
                <span className="bg-white/95 backdrop-blur-xl text-[10px] font-black uppercase tracking-widest text-[#FF385C] px-3.5 py-2 rounded-2xl shadow-[0_4px_12px_rgba(0,0,0,0.1)] border border-white/40 flex items-center gap-1.5 animate-in fade-in zoom-in duration-500">
                  <Sparkles className="w-3 h-3 fill-current" />
                  {t("Guest favorite")}
                </span>
              )}
              <span className={`px-3.5 py-2 rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-[0_4px_12px_rgba(0,0,0,0.1)] border border-white/20 backdrop-blur-xl transition-all duration-300
              ${status === "Available" ? "bg-emerald-500/90 text-white" :
                  status === "Booked" ? "bg-slate-800/90 text-white" :
                    "bg-amber-500/90 text-white"}`}>
                {t(status)}
              </span>
              {originalPrice && originalPrice > price && (
                <span className="bg-[#FF385C] text-white px-3.5 py-2 rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-lg shadow-rose-200 border border-white/20">
                  Save ৳{(originalPrice - price).toLocaleString()}
                </span>
              )}
            </div>

            {/* Favorite Button */}
            <button
              onClick={toggleFavorite}
              className={`absolute top-4 right-4 z-10 p-3 rounded-full backdrop-blur-xl transition-all duration-500 shadow-lg border ${isFavorite ? "bg-rose-500 border-rose-400 text-white animate-bounce-short" : "bg-white/30 border-white/40 text-white hover:bg-white hover:text-rose-500 hover:scale-110"}`}
            >
              <Heart
                className={`h-4.5 w-4.5 transition-colors ${isFavorite
                  ? "fill-current"
                  : ""
                  }`}
              />
            </button>

            {/* Navigation Arrows */}
            <AnimatePresence>
              {isHovered && images.length > 1 && (
                <>
                  <motion.button
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -10 }}
                    onClick={prevImage}
                    className="absolute left-3 top-1/2 -translate-y-1/2 bg-white/90 backdrop-blur-md rounded-full p-2 shadow-xl hover:bg-white transition-colors z-10"
                  >
                    <ChevronLeft className="h-4 w-4 text-gray-900" />
                  </motion.button>
                  <motion.button
                    initial={{ opacity: 0, x: 10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 10 }}
                    onClick={nextImage}
                    className="absolute right-3 top-1/2 -translate-y-1/2 bg-white/90 backdrop-blur-md rounded-full p-2 shadow-xl hover:bg-white transition-colors z-10"
                  >
                    <ChevronRight className="h-4 w-4 text-gray-900" />
                  </motion.button>
                </>
              )}
            </AnimatePresence>

            {/* Carousel Dots */}
            {images.length > 1 && (
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-1.5 z-10">
                {images.slice(0, 5).map((_, index) => (
                  <button
                    key={index}
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      setCurrentImageIndex(index);
                    }}
                    className={`w-1.5 h-1.5 rounded-full transition-all duration-300 ${index === currentImageIndex ? "bg-white w-4" : "bg-white/50"}`}
                  />
                ))}
              </div>
            )}
          </div>
          {/* Property Info */}
          <div className="p-5 flex flex-col h-full bg-gradient-to-b from-transparent to-white/50">
            <div className="flex items-center justify-between mb-3 text-[11px] font-bold uppercase tracking-wider">
              <div className="flex items-center gap-1.5 text-slate-400 bg-slate-50 px-2.5 py-1 rounded-lg">
                Hotel
              </div>
              <div className="flex bg-amber-50 px-2 py-1 rounded-lg gap-0.5 shadow-inner">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className={`w-3 h-3 ${i < Math.round(rating) ? "fill-amber-400 text-amber-400" : "text-slate-200"}`} />
                ))}
              </div>
            </div>

            <div className="flex items-start justify-between gap-3 mb-1">
              <h3 className="font-extrabold text-[19px] text-slate-900 leading-tight group-hover:text-[#FF385C] transition-colors line-clamp-1 flex-1">
                {location}
              </h3>
              <div className="flex items-center gap-1.5 text-slate-500 shrink-0 mt-1">
                <MapPin className="w-3.5 h-3.5 text-slate-300" />
                <span className="text-[13px] font-bold uppercase tracking-wider">{distance}</span>
              </div>
            </div>

            {dates && <p className="text-[11px] font-black text-indigo-500 uppercase tracking-widest mb-4 opacity-80">{dates}</p>}

            <div className="flex items-center gap-3 mb-6 p-3 bg-slate-50/80 rounded-2xl border border-slate-100">
              <div className="bg-[#003580] text-white font-black text-[14px] w-10 h-10 flex items-center justify-center rounded-xl shadow-md shrink-0">
                {rating.toFixed(1)}
              </div>
              <div className="flex flex-col leading-tight min-w-0">
                <span className="text-[14px] font-black text-slate-900 truncate">
                  {rating >= 4.8 ? "Wonderful" : rating >= 4.5 ? "Exceptional" : rating >= 4.0 ? "Excellent" : "Very Good"}
                </span>
                <span className="text-[11px] text-slate-400 font-bold truncate tracking-wide">{totalReviews} verified reviews</span>
              </div>
              <button
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setIsReviewModalOpen(true);
                }}
                className="ml-auto bg-white text-[#FF385C] hover:bg-[#FF385C] hover:text-white text-[10px] font-black px-3.5 py-2.5 rounded-xl transition-all active:scale-95 uppercase tracking-[0.08em] shadow-sm border border-slate-100"
              >
                Review
              </button>
            </div>

            <div className="mt-auto flex items-center justify-between gap-2 pt-5 border-t border-slate-100">
              <div className="flex flex-col">
                <span className="text-[11px] text-slate-400 font-bold uppercase tracking-wider leading-none mb-1">Total Stay</span>
                <div className="flex items-center gap-1.5">
                  <span className="font-black text-slate-900 text-[22px] leading-none tracking-tight">৳{price.toLocaleString()}</span>
                  {originalPrice && originalPrice > price && (
                    <span className="text-[13px] text-slate-400 line-through font-medium">
                      ৳{originalPrice.toLocaleString()}
                    </span>
                  )}
                </div>
              </div>
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
