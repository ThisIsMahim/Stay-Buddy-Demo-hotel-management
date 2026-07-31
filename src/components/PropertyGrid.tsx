import PropertyCard from "./PropertyCard";
import ReviewModal from "./ReviewModal";
import { Hotel, Room } from "../services/api";
import { useTranslation } from "react-i18next";
import { useState } from "react";
import { Link } from "react-router-dom";
import { ChevronRight, MapPin, Star, Wifi, Car, Coffee, Heart } from "lucide-react";
import { motion } from "framer-motion";
import { useSearch } from "@/context/SearchContext";

type PropertyCardItem = {
  id: string;
  images: string[];
  location: string;
  distance: string;
  dates: string;
  price: number;
  rating: number;
  isGuestFavorite: boolean;
  status: "Available" | "Booked" | "Few left";
};

/* ─── Top Stays in Dhaka Compact List ─── */
const TopStaysSection = ({ hotels, rooms }: { hotels: Hotel[], rooms: (Room & { hotelName?: string })[] }) => {
  const { t } = useTranslation();
  const { search: globalSearch } = useSearch();
  const [favorites, setFavorites] = useState<string[]>([]);
  const [reviewHotel, setReviewHotel] = useState<{ id: string, name: string } | null>(null);

  const filteredHotels = hotels.filter(h => {
    // 1. City Check (if searched)
    if (globalSearch.q && !h.city.toLowerCase().includes(globalSearch.q.toLowerCase()) && !h.name.toLowerCase().includes(globalSearch.q.toLowerCase())) {
      return false;
    }

    // 2. Capacity Check
    const hotelRooms = rooms.filter(r => r.hotelId === h.id);
    const adultsPerRoom = Math.ceil(globalSearch.adults / globalSearch.rooms);
    const childrenPerRoom = Math.ceil(globalSearch.children / globalSearch.rooms);

    const hasSuitableRoom = hotelRooms.some(r =>
      (r.maxAdults || 2) >= adultsPerRoom &&
      (r.maxChildren || 0) >= childrenPerRoom
    );

    return hasSuitableRoom;
  });

  const dhakaHotels = filteredHotels.filter(h => h.city.toLowerCase() === "dhaka").slice(0, 3);
  if (dhakaHotels.length === 0) return null;

  const toggleFavorite = (e: React.MouseEvent, id: string) => {
    e.preventDefault();
    e.stopPropagation();
    setFavorites(prev => prev.includes(id) ? prev.filter(f => f !== id) : [...prev, id]);
  };

  return (
    <section className="py-12 border-t border-gray-100">
      <div className="flex items-center justify-between mb-8 px-1">
        <div className="flex items-center gap-4">
          <h2 className="text-2xl font-black text-gray-900 tracking-tight">{t("Top Stays in Dhaka")}</h2>
          <span className="bg-indigo-600/10 text-indigo-600 text-[10px] font-black uppercase tracking-[0.2em] px-3 py-1.5 rounded-lg border border-indigo-200/50">
            Dhaka
          </span>
        </div>
        <Link to="/hotels" className="text-xs font-bold text-slate-400 hover:text-indigo-600 transition-colors uppercase tracking-widest flex items-center gap-1 group">
          {t("View all")} <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {dhakaHotels.map((hotel, index) => {
          const hotelRooms = rooms.filter(r => r.hotelId === hotel.id);
          const roomWithLowestPrice = hotelRooms.length > 0
            ? hotelRooms.reduce((min, r) => (r.discountPrice || r.pricePerNight) < (min.discountPrice || min.pricePerNight) ? r : min, hotelRooms[0])
            : null;
          const minPrice = roomWithLowestPrice ? (roomWithLowestPrice.discountPrice || roomWithLowestPrice.pricePerNight) : 1500;
          const originalPrice = roomWithLowestPrice?.discountPrice ? roomWithLowestPrice.pricePerNight : undefined;
          const isFavorite = favorites.includes(hotel.id);

          return (
            <Link to={`/property/${hotel.id}`} key={hotel.id}>
              <motion.div
                className="group relative bg-white rounded-3xl overflow-hidden hover:shadow-[0_20px_50px_rgba(79,70,229,0.1)] transition-all duration-500 border border-transparent hover:border-indigo-100/50"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1, duration: 0.5, ease: "easeOut" }}
              >
                {/* Image Container */}
                <div className="relative aspect-[4/3] overflow-hidden">
                  <img
                    src={hotel.images[0]}
                    alt={hotel.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                  {/* Floating Elements */}
                  <div className="absolute top-4 left-4 z-10 flex flex-col gap-2">
                    <span className="bg-white/90 backdrop-blur-md text-[9px] font-black uppercase tracking-widest text-indigo-600 px-2.5 py-1.5 rounded-xl shadow-sm border border-white/20">
                      {hotel.rating >= 4.5 ? "Top Choice" : "Popular"}
                    </span>
                  </div>

                  <button
                    onClick={(e) => toggleFavorite(e, hotel.id)}
                    className={`absolute top-4 right-4 z-10 p-2.5 rounded-full backdrop-blur-md transition-all duration-300 ${isFavorite ? "bg-rose-500 text-white" : "bg-black/20 text-white hover:bg-white hover:text-rose-500"
                      }`}
                  >
                    <Heart className={`w-4 h-4 ${isFavorite ? "fill-current" : ""}`} />
                  </button>
                </div>

                {/* Content */}
                <div className="p-5">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{hotel.city || "Dhaka"}</span>
                    <div className="flex items-center gap-1.5">
                      <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                      <span className="text-[13px] font-bold text-slate-800">{hotel.rating.toFixed(1)}</span>
                    </div>
                  </div>

                  <h3 className="text-lg font-bold text-gray-900 group-hover:text-indigo-600 transition-colors mb-4 truncate leading-tight">
                    {hotel.name}
                  </h3>

                  <div className="flex items-center justify-between pt-4 border-t border-slate-50">
                    <p className="text-xs text-slate-400 font-medium flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5" /> {hotel.address?.split(",")[0] || "Gulshan, Dhaka"}
                    </p>
                    <div className="text-right">
                      {originalPrice && (
                        <p className="text-[11px] text-rose-500 line-through font-bold opacity-50 mb-0.5">৳{originalPrice}</p>
                      )}
                      <div className="flex items-baseline gap-1">
                        <span className="text-sm font-bold text-slate-400 uppercase">৳</span>
                        <span className="text-xl font-black text-gray-900 tracking-tight">{minPrice}</span>
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      setReviewHotel({ id: hotel.id, name: hotel.name });
                    }}
                    className="mt-4 w-full bg-slate-50 text-slate-500 text-[10px] font-black py-2 rounded-xl hover:bg-indigo-600 hover:text-white transition-all uppercase tracking-widest"
                  >
                    Write a Review
                  </button>
                </div>
              </motion.div>
            </Link>
          );
        })}
      </div>
      {reviewHotel && (
        <ReviewModal
          isOpen={!!reviewHotel}
          onClose={() => setReviewHotel(null)}
          hotelId={reviewHotel.id}
          hotelName={reviewHotel.name}
        />
      )}
    </section>
  );
};

/* ─── Featured Properties (Large Cards) ─── */
const FeaturedSection = ({ hotels, rooms }: { hotels: Hotel[], rooms: (Room & { hotelName?: string })[] }) => {
  const { t } = useTranslation();
  const { search: globalSearch } = useSearch();
  const [reviewHotel, setReviewHotel] = useState<{ id: string, name: string } | null>(null);

  const filteredHotels = hotels.filter(h => {
    // 1. City Check
    if (globalSearch.q && !h.city.toLowerCase().includes(globalSearch.q.toLowerCase()) && !h.name.toLowerCase().includes(globalSearch.q.toLowerCase())) {
      return false;
    }

    // 2. Capacity Check
    const hotelRooms = rooms.filter(r => r.hotelId === h.id);
    const adultsPerRoom = Math.ceil(globalSearch.adults / globalSearch.rooms);
    const childrenPerRoom = Math.ceil(globalSearch.children / globalSearch.rooms);

    const hasSuitableRoom = hotelRooms.some(r =>
      (r.maxAdults || 2) >= adultsPerRoom &&
      (r.maxChildren || 0) >= childrenPerRoom
    );

    return hasSuitableRoom;
  });

  const featured = filteredHotels.slice(0, 4);
  if (featured.length === 0) return null;

  const amenityIcons: Record<string, any> = {
    "wifi": Wifi,
    "parking": Car,
    "restaurant": Coffee,
  };

  return (
    <section className="py-16 border-t border-gray-100">
      <div className="flex flex-col mb-10 text-center md:text-left">
        <h2 className="text-3xl font-black text-gray-900 tracking-tight mb-2 italic uppercase">{t("Featured Properties")}</h2>
        <p className="text-slate-400 text-sm font-medium tracking-wide">{t("Handpicked premium stays for an unforgettable experience")}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 px-1">
        {featured.map((hotel, index) => {
          const hotelRooms = rooms.filter(r => r.hotelId === hotel.id);
          const roomWithLowestPrice = hotelRooms.length > 0
            ? hotelRooms.reduce((min, r) => (r.discountPrice || r.pricePerNight) < (min.discountPrice || min.pricePerNight) ? r : min, hotelRooms[0])
            : null;
          const minPrice = roomWithLowestPrice ? (roomWithLowestPrice.discountPrice || roomWithLowestPrice.pricePerNight) : 1500;
          const originalPrice = roomWithLowestPrice?.discountPrice ? roomWithLowestPrice.pricePerNight : undefined;

          return (
            <Link to={`/property/${hotel.id}`} key={hotel.id}>
              <motion.div
                className="relative group rounded-[32px] overflow-hidden min-h-[380px] md:min-h-[420px] shadow-[0_30px_60px_-15px_rgba(0,0,0,0.1)] hover:shadow-[0_45px_70px_-20px_rgba(0,0,0,0.2)] transition-all duration-700"
                initial={{ opacity: 0, scale: 0.98 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: index * 0.2 }}
              >
                {/* Background Image with Ken Burns Effect on hover */}
                <img
                  src={hotel.images[0]}
                  alt={hotel.name}
                  className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-[3s] ease-out"
                />

                {/* Dynamic Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-gray-950 via-gray-950/20 to-transparent group-hover:via-gray-950/40 transition-all duration-500" />
                <div className="absolute inset-0 bg-gradient-to-r from-gray-950/60 to-transparent opacity-60" />

                {/* Content Overlay */}
                <div className="absolute inset-x-0 bottom-0 p-8 pt-20 flex flex-col justify-end">
                  {/* Category Chip */}
                  <div className="mb-4">
                    <span className="bg-white/10 backdrop-blur-xl border border-white/20 text-[10px] font-black uppercase tracking-[0.3em] text-white px-4 py-2 rounded-2xl">
                      {hotel.rating >= 4.5 ? "Signature Selection" : "Featured Stay"}
                    </span>
                  </div>

                  <h3 className="text-3xl font-black text-white mb-3 tracking-tighter group-hover:translate-x-1 transition-transform duration-500 uppercase italic">
                    {hotel.name}
                  </h3>

                  <div className="flex items-center gap-6 text-white/70 text-[11px] font-bold uppercase tracking-widest mb-6">
                    {hotel.amenities?.slice(0, 2).map((amenity, i) => {
                      const IconComp = amenityIcons[amenity.toLowerCase()];
                      return (
                        <span key={i} className="flex items-center gap-2">
                          <span className="p-1.5 bg-white/10 rounded-lg group-hover:bg-indigo-500/30 transition-colors">
                            {IconComp ? <IconComp className="w-3.5 h-3.5 text-white" /> : null}
                          </span>
                          {amenity}
                        </span>
                      );
                    })}
                  </div>

                  <div className="flex items-end justify-between border-t border-white/10 pt-6">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 text-white">
                        <div className="flex text-amber-400">
                          {[...Array(5)].map((_, i) => (
                            <Star key={i} className={`w-3 h-3 ${i < Math.floor(hotel.rating) ? "fill-current" : "text-white/20"}`} />
                          ))}
                        </div>
                        <span className="text-sm font-black italic">{hotel.rating.toFixed(1)}</span>
                      </div>
                      <p className="text-[10px] text-white/40 uppercase tracking-[0.2em] font-black italic">{hotel.totalReviews} {t("Verified Reviews")}</p>
                    </div>

                    <div className="text-right">
                      {originalPrice && (
                        <span className="block text-rose-400 text-xs font-bold line-through opacity-70 mb-1 leading-none italic">৳{originalPrice.toLocaleString()}</span>
                      )}
                      <div className="text-white flex items-baseline gap-1.5">
                        <span className="text-sm font-bold text-white/50 italic uppercase">৳</span>
                        <span className="text-4xl font-black tracking-tighter italic">
                          {minPrice.toLocaleString()}
                        </span>
                        <span className="text-[10px] text-white/40 font-black uppercase tracking-widest ml-1">{t("per night")}</span>
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      setReviewHotel({ id: hotel.id, name: hotel.name });
                    }}
                    className="mt-6 w-full bg-white/10 backdrop-blur-md border border-white/20 text-white text-[11px] font-black py-3 rounded-2xl hover:bg-white hover:text-black transition-all uppercase tracking-[0.2em]"
                  >
                    Share Experience
                  </button>
                </div>

                {/* View Details Button (appears on hover) */}
                <div className="absolute top-8 right-8 opacity-0 group-hover:opacity-100 transition-all duration-500 translate-y-4 group-hover:translate-y-0">
                  <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center text-gray-900 shadow-xl group-hover:rotate-12 transition-transform">
                    <ChevronRight className="w-6 h-6" />
                  </div>
                </div>
              </motion.div>
            </Link>
          );
        })}
      </div>
      {reviewHotel && (
        <ReviewModal
          isOpen={!!reviewHotel}
          onClose={() => setReviewHotel(null)}
          hotelId={reviewHotel.id}
          hotelName={reviewHotel.name}
        />
      )}
    </section>
  );
};

/* ─── Special Deals Section (Discounted Stays) ─── */
const SpecialDealsSection = ({ hotels, rooms }: { hotels: Hotel[], rooms: (Room & { hotelName?: string })[] }) => {
  const { t } = useTranslation();

  // Find hotels with at least one room having a discountPrice
  const discountedHotels = hotels
    .map(hotel => {
      const hotelRooms = rooms.filter(r => r.hotelId === hotel.id);
      const roomsWithDiscount = hotelRooms.filter(r => r.discountPrice && r.discountPrice < r.pricePerNight);

      if (roomsWithDiscount.length === 0) return null;

      // Find best discount percentage for this hotel
      let maxDiscountPct = 0;
      let bestRoom = roomsWithDiscount[0];

      roomsWithDiscount.forEach(r => {
        const pct = Math.round(((r.pricePerNight - (r.discountPrice || r.pricePerNight)) / r.pricePerNight) * 100);
        if (pct > maxDiscountPct) {
          maxDiscountPct = pct;
          bestRoom = r;
        }
      });

      return {
        hotel,
        bestRoom,
        discountPct: maxDiscountPct
      };
    })
    .filter((item): item is NonNullable<typeof item> => item !== null)
    .sort((a, b) => b.discountPct - a.discountPct)
    .slice(0, 4);

  if (discountedHotels.length === 0) return null;

  return (
    <section className="py-16">
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4 px-1">
        <div className="space-y-4">
          <div className="inline-flex items-center gap-2.5 px-4 py-2 bg-rose-50 rounded-2xl border border-rose-100/50">
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-rose-500"></span>
            </span>
            <span className="text-[10px] font-black text-rose-600 uppercase tracking-[0.2em]">{t("Limited Offers")}</span>
          </div>
          <div>
            <h2 className="text-4xl font-black text-gray-900 tracking-tighter mb-2 italic uppercase">
              {t("Exclusive Deals")}
            </h2>
            <p className="text-slate-400 text-sm font-medium max-w-md leading-relaxed">{t("Premium experiences with handpicked discounts. Available for a limited time only.")}</p>
          </div>
        </div>
        <Link to="/hotels" className="group flex items-center gap-2 bg-gray-900 text-white px-6 py-3.5 rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-rose-600 transition-all duration-300 shadow-xl shadow-gray-200">
          {t("Explore all deals")}
          <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {discountedHotels.map(({ hotel, bestRoom, discountPct }) => (
          <div key={hotel.id} className="relative group">
            <PropertyCard
              id={hotel.id}
              images={hotel.images}
              location={hotel.name}
              distance={hotel.city}
              dates={bestRoom.type}
              price={bestRoom.discountPrice || bestRoom.pricePerNight}
              originalPrice={bestRoom.pricePerNight}
              rating={hotel.rating}
              isGuestFavorite={hotel.rating >= 4.8}
              status="Available"
              totalReviews={hotel.totalReviews}
            />
            <div className="absolute top-4 right-4 z-10">
              <span className="bg-rose-600 text-white text-[11px] font-black px-3 py-1.5 rounded-full shadow-lg border border-white/20 animate-pulse">
                {discountPct}% OFF
              </span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

/* ─── Main PropertyGrid ─── */
const PropertyGrid = ({ hotels, rooms }: { hotels: Hotel[], rooms: (Room & { hotelName?: string })[] }) => {
  if (hotels.length === 0) {
    return (
      <div className="text-center py-20 bg-gray-50 rounded-2xl border-2 border-dashed mt-8">
        <p className="text-gray-400">No hotels found. Try adjusting your filters.</p>
      </div>
    );
  }

  return (
    <div>
      <SpecialDealsSection hotels={hotels} rooms={rooms} />
      <TopStaysSection hotels={hotels} rooms={rooms} />
      <FeaturedSection hotels={hotels} rooms={rooms} />
    </div>
  );
};

export default PropertyGrid;
