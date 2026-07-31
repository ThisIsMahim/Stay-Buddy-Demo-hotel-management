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

import { useState, useEffect, useRef } from "react";
import { api, Hotel, Room } from "../services/api";
import { Loader2, BedDouble, CalendarDays, Users, X, ChevronDown, MapPin } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";

import heroImg from "../assets/pexels-aj-ahamad-767001191-30554296.jpg";

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

    if (loading) return (
        <div className="min-h-screen bg-background flex flex-col items-center justify-center">
            <Loader2 className="w-12 h-12 animate-spin text-[#FF385C] mb-4" />
            <p className="text-slate-500 font-medium">Loading amazing stays...</p>
        </div>
    );

    return (
        <div className="min-h-screen bg-[#FAFAFA]">
            <Header />

            {/* ═══════════ HERO SECTION ═══════════ */}
            <section className="hero-section relative">
                {/* Background image with overlay */}
                <div className="absolute inset-0">
                    <img
                        src={heroImg}
                        alt="Hero"
                        className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-r from-[#0D4F48]/90 via-[#1A8A7D]/75 to-[#0D4F48]/60" />
                </div>

                <div className="relative z-10 max-w-7xl mx-auto px-4 md:px-6 py-12 md:py-24">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        className="max-w-2xl text-center md:text-left"
                    >
                        <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-md px-3 py-1 rounded-full border border-white/30 mb-4 animate-in fade-in slide-in-from-top-4 duration-700">
                            <span className="w-2 h-2 bg-rose-500 rounded-full animate-pulse" />
                            <span className="text-[10px] md:text-[11px] font-bold text-white uppercase tracking-wider">Flash Sale: Up to 50% Off</span>
                        </div>
                        <h1 className="text-2xl md:text-5xl font-extrabold text-white leading-tight mb-3">
                            {t("Find Your Perfect")} <br className="hidden md:block" />
                            <span className="text-[#FFD700]">{t("Stay")}</span> {t("in Bangladesh")}
                        </h1>
                        <p className="text-white/70 text-xs md:text-base max-w-lg mx-auto md:mx-0">
                            {t("Discover handpicked hotels, resorts, and homes with exclusive discounts. Book your dream stay today.")}
                        </p>
                    </motion.div>
                </div>
            </section>

            <SearchBar
                className="-mt-6 md:-mt-9 max-w-5xl mx-auto px-4 md:px-6 z-20"
            />

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
