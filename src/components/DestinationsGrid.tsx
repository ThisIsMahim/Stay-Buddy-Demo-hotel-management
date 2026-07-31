import { useEffect, useState } from "react";
import DestinationSection from "./DestinationSection";
import { api, Hotel, Room } from "../services/api";
import { Loader2 } from "lucide-react";
import { useTranslation } from "react-i18next";

/* Destination images — map city names to local assets */
import img1 from "../assets/pexels-quang-nguyen-vinh-222549-14021931.jpg";
import img2 from "../assets/pexels-vince-28962384.jpg";
import img3 from "../assets/pexels-quang-nguyen-vinh-222549-29000012.jpg";
import img4 from "../assets/pexels-pixabay-164595.jpg";

const cityImages: Record<string, string> = {
  "Dhaka": img1,
  "Cox's Bazar": img2,
  "Sylhet": img3,
  "Rajshahi": img4,
  "Chittagong": img1,
};

const DestinationsGrid = () => {
  const { t } = useTranslation();
  const [hotels, setHotels] = useState<Hotel[]>([]);
  const [rooms, setRooms] = useState<Room[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("");

  useEffect(() => {
    Promise.all([
      api.getAllHotels(),
      api.getAllRooms()
    ]).then(([hotelData, roomData]) => {
      setHotels(hotelData);
      setRooms(roomData);
      if (hotelData.length > 0) {
        const cities = Array.from(new Set(hotelData.map(h => h.city)));
        if (cities.length > 0) setActiveTab(cities[0]);
      }
      setLoading(false);
    });
  }, []);

  if (loading) return (
    <div className="flex justify-center py-10">
      <Loader2 className="w-8 h-8 animate-spin text-primary opacity-20" />
    </div>
  );

  if (hotels.length === 0) return null;

  const cities = Array.from(new Set(hotels.map(h => h.city)));
  const currentCityHotels = hotels.filter(h => h.city === activeTab);

  const listings = currentCityHotels.map(h => {
    const hotelRooms = rooms.filter(r => r.hotelId === h.id);
    const roomWithLowestPrice = hotelRooms.length > 0
      ? hotelRooms.reduce((min, r) => (r.discountPrice || r.pricePerNight) < (min.discountPrice || min.pricePerNight) ? r : min, hotelRooms[0])
      : null;
    const minPrice = roomWithLowestPrice ? (roomWithLowestPrice.discountPrice || roomWithLowestPrice.pricePerNight) : 1500;
    const originalPrice = roomWithLowestPrice?.discountPrice ? roomWithLowestPrice.pricePerNight : undefined;

    return {
      id: h.id as any,
      images: h.images,
      title: h.name,
      price: minPrice,
      originalPrice,
      rating: h.rating,
      isGuestFavorite: h.rating >= 4.8
    };
  });

  return (
    <div className="py-10 border-t border-gray-100">
      {/* Section Header */}
      <div className="mb-6">
        <h2 className="section-heading">{t("Explore Destinations")}</h2>
        <p className="section-subtitle">{t("Discover the beauty of Bangladesh")}</p>
      </div>

      {/* Destination Image Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
        {cities.map((city) => {
          const count = hotels.filter(h => h.city === city).length;
          const image = cityImages[city] || img1;

          return (
            <button
              key={city}
              onClick={() => setActiveTab(city)}
              className={`destination-image-card aspect-[4/3] ${activeTab === city ? "ring-2 ring-[#FF385C] ring-offset-2" : ""
                }`}
            >
              <img
                src={image}
                alt={city}
                className="w-full h-full object-cover"
              />
              <div className="overlay absolute inset-0" />
              <div className="absolute bottom-3 left-3 text-left">
                <h3 className="text-white font-bold text-sm md:text-base">{city}</h3>
                <p className="text-white/70 text-[11px]">{count} {t("Properties")}</p>
              </div>
            </button>
          );
        })}
      </div>

      {/* City Tabs */}
      <div className="flex gap-2 mb-6 overflow-x-auto scrollbar-hide pb-2">
        {cities.map((city) => (
          <button
            key={city}
            onClick={() => setActiveTab(city)}
            className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all ${activeTab === city
                ? "bg-gray-900 text-white"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
          >
            {city}
          </button>
        ))}
      </div>

      {/* Active Section */}
      {activeTab && (
        <DestinationSection
          title={`${t("Stay in")} ${activeTab}`}
          listings={listings}
        />
      )}
    </div>
  );
};

export default DestinationsGrid;
