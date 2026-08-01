import Header from "@/components/Header";
import PropertyGrid from "@/components/PropertyGrid";
import DestinationsGrid from "@/components/DestinationsGrid";
import Footer from "@/components/Footer";
import MobileBottomNav from "@/components/MobileBottomNav";
import RecentlyViewed from "@/components/RecentlyViewed";
import PopularHomes from "@/components/PopularHomes";
import OffersTicker from "@/components/OffersTicker";
import SearchBar from "@/components/SearchBar";
import ExperiencesAISection from "@/components/ExperiencesAISection";
import StayBuddyLoader from "@/components/StayBuddyLoader";
import HeroSection from "@/components/HeroSection";

import { useState, useEffect, useRef } from "react";
import { api, Hotel, Room } from "../services/api";
import { Loader2, BedDouble, CalendarDays, Users, X, ChevronDown, MapPin } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";

const Index = () => {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const [hotels, setHotels] = useState<Hotel[]>([]);
    const [rooms, setRooms] = useState<(Room & { hotelName: string })[]>([]);
    const [loading, setLoading] = useState(true);
    const searchRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        let alive = true;
        const loadData = () => {
            Promise.all([api.getAllHotels(), api.getAllRooms()])
                .then(([h, r]) => {
                    if (alive) {
                        setHotels(h.filter(hotel => hotel.isVerified && hotel.isActive));
                        setRooms(r);
                        setLoading(false);
                    }
                });
        };
        loadData();
        return () => { alive = false; };
    }, []);

    if (loading) return <StayBuddyLoader />;

    return (
        <div className="min-h-screen bg-[#FAFAFA]">
            <Header />

            {/* ═══════════ HERO SECTION ═══════════ */}
            <HeroSection />

            <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.3 }}
                className="relative z-30 -mt-12 md:-mt-16 max-w-6xl mx-auto px-4 md:px-6"
            >
                <SearchBar className="shadow-2xl border border-white/60 backdrop-blur-2xl rounded-3xl" />
            </motion.div>

            {/* ═══════════ MAIN CONTENT ═══════════ */}
            <main className="pb-20 md:pb-0 max-w-7xl mx-auto px-4 md:px-6">
                <OffersTicker />
                <RecentlyViewed hotels={hotels} rooms={rooms} />
                <PopularHomes hotels={hotels} rooms={rooms} />
                <PropertyGrid hotels={hotels} rooms={rooms} />
                <DestinationsGrid />
                <ExperiencesAISection />
            </main>

            <Footer />
            <MobileBottomNav />
        </div>
    );
};

export default Index;
