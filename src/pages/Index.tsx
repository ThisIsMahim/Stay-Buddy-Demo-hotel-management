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
import ExploreBangladeshMap from "@/components/ExploreBangladeshMap";
import AgodaFlashDeals from "@/components/AgodaFlashDeals";
import CuratedStayCollections from "@/components/CuratedStayCollections";
import StayBDPerksGuarantee from "@/components/StayBDPerksGuarantee";
import LiveBookingToast from "@/components/LiveBookingToast";
import GeniusVIPBanner from "@/components/GeniusVIPBanner";
import FloatingConciergeWidget from "@/components/FloatingConciergeWidget";
import TripBudgetCalculatorModal from "@/components/TripBudgetCalculatorModal";

import { useState, useEffect, useRef } from "react";
import { api, Hotel, Room } from "../services/api";
import { Loader2, BedDouble, CalendarDays, Users, X, ChevronDown, MapPin, Calculator, Sparkles } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";

const Index = () => {
    const { t, i18n } = useTranslation();
    const isBn = i18n.language?.startsWith("bn");
    const navigate = useNavigate();
    const [hotels, setHotels] = useState<Hotel[]>([]);
    const [rooms, setRooms] = useState<(Room & { hotelName: string })[]>([]);
    const [loading, setLoading] = useState(true);
    const [isBudgetModalOpen, setIsBudgetModalOpen] = useState(false);
    const searchRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        let alive = true;

        // Lightning-fast hosting safeguard: never block homepage for more than 900ms
        const maxLoaderTimer = setTimeout(() => {
            if (alive) setLoading(false);
        }, 900);

        const loadData = () => {
            Promise.all([api.getAllHotels(), api.getAllRooms()])
                .then(([h, r]) => {
                    if (alive) {
                        setHotels(h.filter(hotel => hotel.isVerified && hotel.isActive));
                        setRooms(r);
                        setLoading(false);
                    }
                })
                .catch(() => {
                    if (alive) setLoading(false);
                });
        };
        loadData();

        return () => { 
            alive = false; 
            clearTimeout(maxLoaderTimer);
        };
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

            {/* Offers Ticker Bar & Quick Trip Budget Estimator Button */}
            <div className="max-w-6xl mx-auto px-4 md:px-6 mt-6 mb-2 relative z-20 flex flex-col sm:flex-row items-center gap-3">
                <div className="flex-1 w-full">
                    <OffersTicker />
                </div>
                <button
                    onClick={() => setIsBudgetModalOpen(true)}
                    className="shrink-0 w-full sm:w-auto px-4 py-3 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-500 hover:to-teal-600 text-white font-extrabold text-xs flex items-center justify-center gap-2 shadow-lg shadow-emerald-700/20 active:scale-95 transition-all border border-emerald-500/30"
                >
                    <Calculator className="w-4 h-4 text-emerald-200" />
                    <span>{isBn ? "স্মার্ট বাজেট ক্যালকুলেটর" : "Trip Cost Estimator"}</span>
                    <span className="text-[10px] bg-emerald-400 text-slate-950 font-black px-1.5 py-0.5 rounded-full">
                        NEW
                    </span>
                </button>
            </div>

            {/* ═══════════ MAIN CONTENT ═══════════ */}
            <main className="pb-20 md:pb-0">
                {/* Explore Bangladesh — Tourism & Hotel Map (Slide 19) */}
                <ExploreBangladeshMap />

                {/* ═════ AGODA FLASH DEALS & SECRET RATES BANNER ═════ */}
                <div className="max-w-7xl mx-auto px-4 md:px-6">
                    <AgodaFlashDeals />
                </div>

                <div className="max-w-7xl mx-auto px-4 md:px-6">
                    <RecentlyViewed hotels={hotels} rooms={rooms} />
                </div>

                {/* ═════ AIRBNB THEMATIC CURATED COLLECTIONS ═════ */}
                <div className="max-w-7xl mx-auto px-4 md:px-6">
                    <CuratedStayCollections />
                </div>

                {/* ═════ BOOKING.COM GENIUS VIP LOYALTY PERKS ═════ */}
                <div className="max-w-7xl mx-auto px-4 md:px-6">
                    <GeniusVIPBanner />
                </div>

                <div className="max-w-7xl mx-auto px-4 md:px-6">
                    <PopularHomes hotels={hotels} rooms={rooms} />
                    <PropertyGrid hotels={hotels} rooms={rooms} />
                </div>

                {/* ═════ MAKEMYTRIP & AIRBNB LUXE TRUST & PERKS GUARANTEE ═════ */}
                <div className="max-w-7xl mx-auto px-4 md:px-6">
                    <StayBDPerksGuarantee />
                </div>

                <div className="max-w-7xl mx-auto px-4 md:px-6">
                    <DestinationsGrid />
                    <ExperiencesAISection />
                </div>
            </main>

            <Footer />
            <MobileBottomNav />

            {/* ═════ AGODA / BOOKING.COM LIVE SOCIAL PROOF TOAST ═════ */}
            <LiveBookingToast />

            {/* ═════ 24/7 WHATSAPP & HOTLINE CONCIERGE WIDGET ═════ */}
            <FloatingConciergeWidget />

            {/* ═════ MAKEMYTRIP INTERACTIVE BUDGET CALCULATOR MODAL ═════ */}
            <TripBudgetCalculatorModal
                isOpen={isBudgetModalOpen}
                onClose={() => setIsBudgetModalOpen(false)}
            />
        </div>
    );
};

export default Index;
