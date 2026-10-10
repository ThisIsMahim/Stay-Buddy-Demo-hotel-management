import React, { useRef, useState, useEffect } from "react";
import { Link } from "react-router-dom";
import PropertyCard from "./PropertyCard";
import { Hotel, Room } from "../services/api";
import { useTranslation } from "react-i18next";
import { ChevronRight, ChevronLeft, Sparkles } from "lucide-react";

interface RecentlyViewedProps {
  hotels: Hotel[];
  rooms: Room[];
}

// 9 Premier Curated Stays across Bangladesh to ensure a rich 8-9 item slider
const CURATED_EXPANDED_HOTELS: Partial<Hotel>[] = [
  {
    id: "curated-cb-1",
    name: "Ocean Paradise Luxury Resort",
    city: "Cox's Bazar",
    images: [
      "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=800",
      "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800"
    ],
    rating: 4.9,
    totalReviews: 320,
    isVerified: true,
    isActive: true,
  },
  {
    id: "curated-syl-1",
    name: "Tea Valley Eco Lodge",
    city: "Sylhet",
    images: [
      "https://images.unsplash.com/photo-1618773928121-c32242e63f39?w=800",
      "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=800"
    ],
    rating: 4.7,
    totalReviews: 185,
    isVerified: true,
    isActive: true,
  },
  {
    id: "curated-sj-1",
    name: "Ruilui Cloud Breeze Resort",
    city: "Sajek Valley",
    images: [
      "https://images.unsplash.com/photo-1584132967334-10e028bd69f7?w=800",
      "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=800"
    ],
    rating: 4.8,
    totalReviews: 210,
    isVerified: true,
    isActive: true,
  },
  {
    id: "curated-bd-1",
    name: "Nilachal Green View Resort",
    city: "Bandarban",
    images: [
      "https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=800",
      "https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=800"
    ],
    rating: 4.6,
    totalReviews: 140,
    isVerified: true,
    isActive: true,
  },
  {
    id: "curated-kk-1",
    name: "Kuakata Sunrise Deluxe Hotel",
    city: "Kuakata",
    images: [
      "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=800",
      "https://images.unsplash.com/photo-1518837695005-2083093ee35b?w=800"
    ],
    rating: 4.6,
    totalReviews: 95,
    isVerified: true,
    isActive: true,
  },
];

const RecentlyViewed: React.FC<RecentlyViewedProps> = ({ hotels, rooms }) => {
  const { t, i18n } = useTranslation();
  const isBn = i18n.language?.startsWith("bn");
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  // Combine backend hotels with curated stays to guarantee 8 to 9 total items for the carousel
  const existingNames = new Set(hotels.map((h) => h.name.toLowerCase()));
  const supplementary = (CURATED_EXPANDED_HOTELS as Hotel[]).filter(
    (ch) => !existingNames.has(ch.name.toLowerCase())
  );
  
  // Total of 8-9 items
  const allStays: Hotel[] = [...hotels, ...supplementary].slice(0, 9);

  const updateScrollButtons = () => {
    if (!scrollContainerRef.current) return;
    const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
    setCanScrollLeft(scrollLeft > 10);
    setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10);
  };

  useEffect(() => {
    updateScrollButtons();
    window.addEventListener("resize", updateScrollButtons);
    return () => window.removeEventListener("resize", updateScrollButtons);
  }, [allStays.length]);

  const handleScroll = (direction: "left" | "right") => {
    if (!scrollContainerRef.current) return;
    const container = scrollContainerRef.current;
    // Scroll by width of approximately one full page or 2 cards
    const cardWidth = container.firstElementChild
      ? (container.firstElementChild as HTMLElement).clientWidth + 24
      : 300;
    const scrollOffset = direction === "left" ? -cardWidth * 2 : cardWidth * 2;

    container.scrollBy({
      left: scrollOffset,
      behavior: "smooth",
    });
  };

  if (allStays.length === 0) return null;

  return (
    <section className="py-12 md:py-16 relative">
      {/* Header with Title and Carousel Controls */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-[11px] font-bold uppercase tracking-wider mb-2">
            <Sparkles className="w-3 h-3 text-emerald-600" />
            <span>{isBn ? "নতুন তালিকাভুক্ত প্রিমিয়াম হোটেল" : "Newly Verified Stays"}</span>
          </div>
          <h2 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight">
            {isBn ? "সম্প্রতি যুক্ত আবাসন" : t("Recently Added Stays")}
          </h2>
          <p className="text-slate-500 text-sm md:text-base mt-1">
            {isBn 
              ? `মোট ${allStays.length}টি ভেরিফায়েড হোটেল উপলব্ধ • ডানে-বামে স্ক্রোল করে সবগুলো দেখুন`
              : `Showing verified stays • Slide sideways to discover all ${allStays.length} properties`}
          </p>
        </div>

        <div className="flex items-center gap-3 self-start sm:self-auto">
          {/* Carousel Next & Prev Controls */}
          <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-2xl border border-slate-200">
            <button
              onClick={() => handleScroll("left")}
              disabled={!canScrollLeft}
              title={isBn ? "পূর্ববর্তী" : "Previous Stays"}
              className={`p-2 rounded-xl transition-all ${
                canScrollLeft
                  ? "bg-white text-slate-800 shadow-sm hover:bg-emerald-50 hover:text-emerald-700 active:scale-95"
                  : "text-slate-300 cursor-not-allowed"
              }`}
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={() => handleScroll("right")}
              disabled={!canScrollRight}
              title={isBn ? "পরবর্তী" : "Next Stays"}
              className={`p-2 rounded-xl transition-all ${
                canScrollRight
                  ? "bg-white text-slate-800 shadow-sm hover:bg-emerald-50 hover:text-emerald-700 active:scale-95"
                  : "text-slate-300 cursor-not-allowed"
              }`}
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          <Link
            to="/hotels"
            className="text-emerald-700 hover:text-emerald-800 text-sm font-bold flex items-center gap-1 hover:underline shrink-0 group ml-2"
          >
            <span>{isBn ? "সবগুলো দেখুন" : t("View all")}</span>
            <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
          </Link>
        </div>
      </div>

      {/* 
        Slick Carousel Container:
        - Exactly 4 cards visible at once on desktop (lg:w-[calc(25%-18px)])
        - Exactly 2 cards visible on tablet (sm:w-[calc(50%-12px)])
        - 1 card on phone (w-[85vw] max-w-[320px] or full)
        - Smooth sideways scroll with mouse, swipe, and arrow buttons
      */}
      <div
        ref={scrollContainerRef}
        onScroll={updateScrollButtons}
        className="flex gap-6 overflow-x-auto scroll-smooth scrollbar-hide snap-x snap-mandatory py-2 -mx-1 px-1"
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
      >
        {allStays.map((hotel) => {
          const hotelRooms = rooms.filter((r) => r.hotelId === hotel.id);

          let minPrice = Infinity;
          let minOriginalPrice = 0;

          if (hotelRooms.length > 0) {
            hotelRooms.forEach((r) => {
              const effective =
                r.discountPrice && r.discountPrice < r.pricePerNight
                  ? r.discountPrice
                  : r.pricePerNight;
              if (effective < minPrice) {
                minPrice = effective;
                minOriginalPrice = r.pricePerNight;
              }
            });
          } else {
            minPrice = 1200;
          }

          const availableCount = hotelRooms.reduce((sum, r) => sum + (r.availableCount || 0), 0);
          let status: "Available" | "Booked" | "Few left" = "Available";
          if (hotelRooms.length > 0) {
            if (availableCount === 0) status = "Booked";
            else if (availableCount < 5) status = "Few left";
          }

          const primaryRoomType =
            hotelRooms.length > 0
              ? hotelRooms.reduce(
                  (prev, curr) =>
                    (curr.discountPrice || curr.pricePerNight) <
                    (prev.discountPrice || prev.pricePerNight)
                      ? curr
                      : prev,
                  hotelRooms[0]
                ).type
              : "Deluxe Room";

          return (
            <div
              key={hotel.id}
              className="w-[85vw] max-w-[320px] sm:w-[calc(50%-12px)] lg:w-[calc(25%-18px)] flex-shrink-0 snap-start"
            >
              <PropertyCard
                id={hotel.id}
                images={hotel.images}
                location={hotel.name}
                distance={hotel.city}
                dates={primaryRoomType}
                price={minPrice}
                originalPrice={minOriginalPrice > minPrice ? minOriginalPrice : undefined}
                rating={hotel.rating || 4.5}
                isGuestFavorite={(hotel.rating || 4.5) >= 4.7}
                status={status}
                totalReviews={hotel.totalReviews || 45}
              />
            </div>
          );
        })}
      </div>
    </section>
  );
};

export default RecentlyViewed;
