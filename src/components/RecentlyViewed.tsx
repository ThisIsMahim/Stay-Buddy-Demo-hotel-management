import { Link } from "react-router-dom";
import PropertyCard from "./PropertyCard";
import { Hotel, Room } from "../services/api";
import { useTranslation } from "react-i18next";
import { ChevronRight } from "lucide-react";

const RecentlyViewed = ({ hotels, rooms }: { hotels: Hotel[], rooms: Room[] }) => {
    const { t } = useTranslation();
    const recentHotels = hotels.slice(0, 5);

    if (recentHotels.length === 0) return null;

    return (
        <section className="py-10">
            <div className="flex items-end justify-between mb-2">
                <div>
                    <h2 className="section-heading">{t("Recently Added Stays")}</h2>
                    <p className="section-subtitle">{t("Discover our most recently listed properties")}</p>
                </div>
                <Link
                    to="/hotels"
                    className="text-[#FF385C] text-sm font-semibold flex items-center gap-1 hover:underline shrink-0"
                >
                    {t("View all")}
                    <ChevronRight className="w-4 h-4" />
                </Link>
            </div>

            <div className="flex gap-4 overflow-x-auto scrollbar-hide pb-4 pt-4 -mx-1 px-1">
                {recentHotels.map((hotel) => {
                    const hotelRooms = rooms.filter(r => r.hotelId === hotel.id);

                    let minPrice = Infinity;
                    let minOriginalPrice = 0;

                    if (hotelRooms.length > 0) {
                        hotelRooms.forEach(r => {
                            const effective = r.discountPrice && r.discountPrice < r.pricePerNight ? r.discountPrice : r.pricePerNight;
                            if (effective < minPrice) {
                                minPrice = effective;
                                minOriginalPrice = r.pricePerNight;
                            }
                        });
                    } else {
                        minPrice = 1500;
                    }

                    const availableCount = hotelRooms.reduce((sum, r) => sum + r.availableCount, 0);
                    let status: "Available" | "Booked" | "Few left" = "Available";
                    if (hotelRooms.length > 0) {
                        if (availableCount === 0) status = "Booked";
                        else if (availableCount < 5) status = "Few left";
                    }

                    return (
                        <div
                            key={hotel.id}
                            className="bg-white rounded-2xl shadow-[0_2px_12px_rgba(0,0,0,0.08)] hover:shadow-[0_4px_20px_rgba(0,0,0,0.12)] transition-shadow flex-shrink-0 w-[75%] sm:w-[260px] overflow-hidden"
                        >
                            <PropertyCard
                                id={hotel.id}
                                images={hotel.images}
                                location={hotel.name}
                                distance={hotel.city}
                                dates={hotelRooms.length > 0
                                    ? hotelRooms.reduce((prev, curr) => (curr.discountPrice || curr.pricePerNight) < (prev.discountPrice || prev.pricePerNight) ? curr : prev, hotelRooms[0]).type
                                    : ""
                                }
                                price={minPrice}
                                originalPrice={minOriginalPrice > minPrice ? minOriginalPrice : undefined}
                                rating={hotel.rating}
                                isGuestFavorite={hotel.rating >= 4.8}
                                status={status}
                                totalReviews={hotel.totalReviews}
                            />
                        </div>
                    );
                })}
            </div>
        </section>
    );
};

export default RecentlyViewed;
