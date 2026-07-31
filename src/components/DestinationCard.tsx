import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Heart, Star, ChevronLeft, ChevronRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";

interface DestinationCardProps {
  images: string[];
  title: string;
  price: number;
  originalPrice?: number;
  rating: number;
  isGuestFavorite?: boolean;
}

const DestinationCard = ({
  images,
  title,
  price,
  originalPrice,
  rating,
  isGuestFavorite = false,
}: DestinationCardProps) => {
  const { t } = useTranslation();
  const [isFavorite, setIsFavorite] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  const nextImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentImageIndex((prev) => (prev + 1) % images.length);
  };

  const prevImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  return (
    <Link to="/hotels" className="flex-shrink-0 w-[44vw] sm:w-[220px]">
      <motion.div
        className="w-full cursor-pointer group"
        whileHover={{ y: -4 }}
        transition={{ duration: 0.2 }}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
      <div className="relative aspect-square rounded-xl overflow-hidden mb-2">
        {/* Image Carousel */}
        <AnimatePresence mode="wait">
          <motion.img
            key={currentImageIndex}
            src={images[currentImageIndex]}
            alt={title}
            className="w-full h-full object-cover"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          />
        </AnimatePresence>

        {/* Guest Favorite Badge */}
        {isGuestFavorite && (
          <div className="absolute top-3 left-3 bg-white px-2 py-1 rounded-full text-xs font-medium border border-gray-200 shadow-sm">
            {t("Guest favorite")}
          </div>
        )}

        {/* Heart Icon */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            setIsFavorite(!isFavorite);
          }}
          className="absolute top-3 right-3 p-1.5 rounded-full hover:scale-110 transition-transform"
        >
          <Heart
            className={`w-5 h-5 ${isFavorite
              ? "fill-favorite text-favorite"
              : "text-white fill-black/30 stroke-white"
              }`}
          />
        </button>

        {/* Navigation Arrows */}
        {isHovered && images.length > 1 && (
          <>
            {currentImageIndex > 0 && (
              <button
                onClick={prevImage}
                className="absolute left-2 top-1/2 -translate-y-1/2 w-7 h-7 rounded-full bg-white/90 hover:bg-white flex items-center justify-center shadow-md transition-all hover:scale-105"
              >
                <ChevronLeft className="w-4 h-4 text-foreground" />
              </button>
            )}
            {currentImageIndex < images.length - 1 && (
              <button
                onClick={nextImage}
                className="absolute right-2 top-1/2 -translate-y-1/2 w-7 h-7 rounded-full bg-white/90 hover:bg-white flex items-center justify-center shadow-md transition-all hover:scale-105"
              >
                <ChevronRight className="w-4 h-4 text-foreground" />
              </button>
            )}
          </>
        )}

        {/* Carousel Dots */}
        {images.length > 1 && (
          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1">
            {images.map((_, index) => (
              <div
                key={index}
                className={`w-1.5 h-1.5 rounded-full transition-colors ${index === currentImageIndex
                  ? "bg-white"
                  : "bg-white/50"
                  }`}
              />
            ))}
          </div>
        )}
      </div>

      <div className="mt-2 flex flex-col gap-0.5">
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-semibold text-[15px] text-foreground truncate">{title}</h3>
          <div className="flex items-center gap-1 shrink-0">
            <Star className="w-3 h-3 fill-foreground text-foreground" />
            <span className="text-sm text-foreground">{rating.toFixed(2)}</span>
          </div>
        </div>
        <div className="flex items-baseline gap-1 mt-1 flex-wrap">
          {originalPrice && originalPrice > price && (
            <span className="text-xs text-rose-500 line-through opacity-70 mr-1">৳{originalPrice}</span>
          )}
          <span className="font-semibold text-foreground">৳{price}</span>
          <span className="text-foreground">/ {t("night")}</span>
        </div>
      </div>
      </motion.div>
    </Link>
  );
};

export default DestinationCard;
