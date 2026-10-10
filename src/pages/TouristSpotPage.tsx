import React, { useState, useEffect, useMemo } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { 
  MapPin, Star, ShieldCheck, CheckCircle2, BedDouble, 
  SlidersHorizontal, Sparkles, ArrowRight, Zap, Coffee, 
  Wifi, Waves, Wind, PhoneCall, ExternalLink, Calendar,
  Users, CreditCard, Check, ChevronRight, Eye,
  Compass, ArrowLeft, ArrowUpRight, Trees, Mountain, Landmark, Building2
} from "lucide-react";
import { useTranslation } from "react-i18next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import MobileBottomNav from "@/components/MobileBottomNav";
import { EXPANDED_TOURIST_SPOTS } from "./TourismMapPage";
import { SPOT_HOTELS, SpotHotel } from "@/components/SpotHotelsModal";
import { api } from "@/services/api";

const BUDGET_FILTER_TIERS = [
  { labelEn: "All Budgets", labelBn: "সকল বাজেট", maxPrice: 99999 },
  { labelEn: "৳500 Economy", labelBn: "৳৫০০ ইকোনমি", maxPrice: 700 },
  { labelEn: "৳1,000–৳1,500 Standard", labelBn: "৳১,০০০–৳১,৫০০ স্ট্যান্ডার্ড", maxPrice: 1800 },
  { labelEn: "৳5,000+ Luxury", labelBn: "৳৫,০০০+ লাক্সারি", maxPrice: 99999 },
];

export default function TouristSpotPage() {
  const { spotId } = useParams<{ spotId: string }>();
  const navigate = useNavigate();
  const { i18n } = useTranslation();
  const isBn = i18n.language?.startsWith("bn");

  // Date selection state
  const [checkIn, setCheckIn] = useState<string>(() => new Date().toISOString().split("T")[0]);
  const [checkOut, setCheckOut] = useState<string>(() => new Date(Date.now() + 86400000).toISOString().split("T")[0]);
  const [nights, setNights] = useState<number>(1);
  const [budgetTierIndex, setBudgetTierIndex] = useState<number>(0);
  const [sortBy, setSortBy] = useState<"recommended" | "price_asc" | "price_desc" | "rating">("recommended");
  const [dbHotels, setDbHotels] = useState<SpotHotel[]>([]);

  // Calculate nights
  useEffect(() => {
    if (checkIn && checkOut) {
      const diff = (new Date(checkOut).getTime() - new Date(checkIn).getTime()) / 86400000;
      setNights(Math.max(1, Math.round(diff)));
    }
  }, [checkIn, checkOut]);

  // Clean and find the spot
  const cleanSpotId = (spotId || "saint-martins").toLowerCase().trim();
  const normalizedSpotId = cleanSpotId.replace(/[-_ ]/g, "");

  const spot = useMemo(() => {
    const found = EXPANDED_TOURIST_SPOTS.find(
      (s) =>
        s.id.toLowerCase() === cleanSpotId ||
        s.id.replace(/[-_ ]/g, "").toLowerCase() === normalizedSpotId ||
        cleanSpotId.includes(s.id.toLowerCase())
    );
    if (found) return found;

    // Default fallback spot if not explicitly in static array
    const prettyName = cleanSpotId.replace(/[-_]/g, " ").replace(/\b\w/g, (l) => l.toUpperCase());
    return {
      id: cleanSpotId,
      name: prettyName,
      nameBn: prettyName,
      region: "Bangladesh Tourism District",
      regionBn: "বাংলাদেশ পর্যটন অঞ্চল",
      divisionId: "chattogram",
      category: "sea" as const,
      image: "https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=1200&q=80",
      description: "Iconic tourism sanctuary in Bangladesh featuring serene landscapes and verified local accommodations.",
      descriptionBn: "বাংলাদেশের অন্যতম জনপ্রিয় পর্যটন স্থান যেখানে রয়েছে মনোরম প্রাকৃতিক পরিবেশ ও যাচাইকৃত হোটেল সুবিধা।",
      nearbyHotelsCount: 12,
      startingPrice: 600,
      highlightTag: "National Tourist Sanctuary",
      highlightTagBn: "জাতীয় পর্যটন স্পট"
    };
  }, [cleanSpotId, normalizedSpotId]);

  // Fetch dynamic database hotels matching this spot
  useEffect(() => {
    if (!spot) return;
    api.getAllHotels().then((hotels) => {
      if (!hotels || !Array.isArray(hotels)) return;
      const spotTerms = [spot.name.toLowerCase(), spot.region.toLowerCase(), spot.id.toLowerCase()];

      const matched = hotels.filter((h) => {
        const text = `${h.name} ${h.city} ${h.address || ""}`.toLowerCase();
        return (
          spotTerms.some((term) => text.includes(term)) ||
          (spot.id === "coxs-bazar" && text.includes("cox")) ||
          (spot.id === "saint-martins" && (text.includes("martin") || text.includes("coral"))) ||
          (spot.id === "kuakata" && (text.includes("kuakata") || text.includes("patuakhali"))) ||
          (spot.id === "sundarbans" && (text.includes("sundarban") || text.includes("khulna") || text.includes("mangrove"))) ||
          (spot.id === "sajek-valley" && (text.includes("sajek") || text.includes("rangamati"))) ||
          (spot.id === "sreemangal" && (text.includes("sreemangal") || text.includes("moulvi") || text.includes("tea"))) ||
          (spot.id === "tanguar-haor" && (text.includes("haor") || text.includes("sunamganj"))) ||
          (spot.id === "ratargul" && (text.includes("ratargul") || text.includes("sylhet")))
        );
      });

      const converted: SpotHotel[] = matched.map((h) => ({
        id: h.id,
        name: h.name,
        nameBn: h.name,
        distance: h.address || "Central Tourism Area",
        distanceBn: h.address || "প্রধান পর্যটন কেন্দ্র",
        rating: h.rating || 4.7,
        reviews: h.totalReviews || 120,
        price: h.rooms?.[0]?.discountPrice || h.rooms?.[0]?.pricePerNight || 1200,
        originalPrice: h.rooms?.[0]?.pricePerNight ? h.rooms[0].pricePerNight * 1.2 : undefined,
        roomType: h.rooms?.[0]?.type || "Standard Deluxe Room",
        roomTypeBn: h.rooms?.[0]?.type || "স্ট্যান্ডার্ড ডিলাক্স রুম",
        features: h.amenities?.slice(0, 4) || ["Free Wi-Fi", "Air Conditioning", "Attached Bath"],
        featuresBn: h.amenities?.slice(0, 4) || ["ফ্রি ওয়াই-ফাই", "শীতাতপ নিয়ন্ত্রিত", "সংযুক্ত বাথ"],
        tag: "Verified Stay",
        tagBn: "যাচাইকৃত আবাসন",
        image: h.images?.[0] || "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=600",
        availableRooms: h.rooms?.[0]?.availableCount || 4,
        destinationCity: h.city || "Bangladesh"
      }));

      setDbHotels(converted);
    }).catch(() => {});
  }, [spot]);

  // Combined curated spot hotels & live DB hotels
  const allSpotHotels = useMemo(() => {
    let list: SpotHotel[] = [];
    if (SPOT_HOTELS[cleanSpotId]) {
      list = [...SPOT_HOTELS[cleanSpotId]];
    } else {
      // Fuzzy lookup
      for (const [key, val] of Object.entries(SPOT_HOTELS)) {
        if (key.includes(cleanSpotId) || cleanSpotId.includes(key)) {
          list = [...val];
          break;
        }
      }
    }

    if (list.length === 0) {
      // Fallback 3 hotels
      list = [
        {
          id: `${cleanSpotId}-1`,
          name: `${spot.name} Budget Eco Rest House`,
          nameBn: `${spot.nameBn} বাজেট ইকো রেস্ট হাউস`,
          distance: "200m from Main Tourist Spot",
          distanceBn: "প্রধান পর্যটন কেন্দ্র থেকে ২০০ মিটার",
          rating: 4.4,
          reviews: 210,
          price: 600,
          originalPrice: 850,
          roomType: "Economy Twin Cottage",
          roomTypeBn: "ইকোনমি টুইন কটেজ",
          features: ["Fresh Water", "Attached Bath", "Solar Power"],
          featuresBn: ["মিঠা পানি", "সংযুক্ত বাথ", "সৌর বিদ্যুৎ"],
          tag: "Best Budget Choice",
          tagBn: "সেরা বাজেট চয়েস",
          image: "https://images.unsplash.com/photo-1590490360182-c33d57733427?w=600",
          availableRooms: 3,
          destinationCity: spot.region
        },
        {
          id: `${cleanSpotId}-2`,
          name: `${spot.name} Deluxe Scenic Resort`,
          nameBn: `${spot.nameBn} ডিলাক্স সিনিক রিসোর্ট`,
          distance: "Direct Frontline Scenic View",
          distanceBn: "সরাসরি ফ্রন্টলাইন প্রাকৃতিক ভিউ",
          rating: 4.7,
          reviews: 540,
          price: 1500,
          originalPrice: 1900,
          roomType: "Deluxe View Balcony Room",
          roomTypeBn: "ডিলাক্স ভিউ ব্যালকনি রুম",
          features: ["AC", "Complimentary Breakfast", "Private Balcony"],
          featuresBn: ["শীতাতপ নিয়ন্ত্রিত", "কমপ্লিমেন্টারি নাস্তা", "প্রাইভেট ব্যালকনি"],
          tag: "Top Value Deal",
          tagBn: "টপ ভ্যালু ডিল",
          image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=600",
          availableRooms: 4,
          destinationCity: spot.region
        },
        {
          id: `${cleanSpotId}-3`,
          name: `${spot.name} 5-Star Luxury Sanctuary`,
          nameBn: `${spot.nameBn} ৫-তারকা লাক্সারি স্যাঙ্কচুয়ারি`,
          distance: "Private Sanctuary Ground",
          distanceBn: "প্রাইভেট রিজার্ভ গ্রাউন্ড",
          rating: 4.9,
          reviews: 890,
          price: 5200,
          originalPrice: 6500,
          roomType: "Presidential Island Villa",
          roomTypeBn: "প্রেসিডেন্সিয়াল আইল্যান্ড ভিলা",
          features: ["Infinity Pool", "Buffet Breakfast", "Airport/Boat Shuttle", "Spa Lounge"],
          featuresBn: ["ইনফিনিটি পুল", "বুফে ব্রেকফাস্ট", "স্পিডবোট শাটল", "স্পা লাউঞ্জ"],
          tag: "5-Star Luxury",
          tagBn: "৫-তারকা লাক্সারি",
          image: "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=600",
          availableRooms: 2,
          destinationCity: spot.region
        }
      ];
    }

    // Merge dynamic database hotels if not already in list
    dbHotels.forEach((dbh) => {
      if (!list.some((h) => h.id === dbh.id)) {
        list.push(dbh);
      }
    });

    return list;
  }, [cleanSpotId, spot, dbHotels]);

  // Filter by budget & sort
  const filteredHotels = useMemo(() => {
    let result = [...allSpotHotels];

    const maxBudget = BUDGET_FILTER_TIERS[budgetTierIndex]?.maxPrice || 99999;
    if (budgetTierIndex === 1) {
      result = result.filter((h) => h.price <= maxBudget);
    } else if (budgetTierIndex === 2) {
      result = result.filter((h) => h.price >= 800 && h.price <= maxBudget);
    } else if (budgetTierIndex === 3) {
      result = result.filter((h) => h.price >= 4000);
    }

    if (sortBy === "price_asc") {
      result.sort((a, b) => a.price - b.price);
    } else if (sortBy === "price_desc") {
      result.sort((a, b) => b.price - a.price);
    } else if (sortBy === "rating") {
      result.sort((a, b) => b.rating - a.rating);
    }

    return result;
  }, [allSpotHotels, budgetTierIndex, sortBy]);

  // Other related spots to explore
  const relatedSpots = useMemo(() => {
    return EXPANDED_TOURIST_SPOTS.filter((s) => s.id !== spot.id).slice(0, 4);
  }, [spot]);

  return (
    <div className="min-h-screen bg-[#FAFAFA] flex flex-col font-sans">
      <Header />

      {/* ═══════════ BREADCRUMBS ═══════════ */}
      <div className="bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex items-center gap-2 text-xs text-slate-500 overflow-x-auto">
          <Link to="/" className="hover:text-emerald-700 font-medium transition-colors">
            {isBn ? "হোম" : "Home"}
          </Link>
          <ChevronRight className="w-3.5 h-3.5 text-slate-400 shrink-0" />
          <Link to="/tourism-map" className="hover:text-emerald-700 font-medium transition-colors">
            {isBn ? "পর্যটন মানচিত্র" : "Tourism Map"}
          </Link>
          <ChevronRight className="w-3.5 h-3.5 text-slate-400 shrink-0" />
          <span className="font-bold text-slate-900 truncate">
            {isBn ? spot.nameBn : spot.name}
          </span>
        </div>
      </div>

      <main className="flex-1 pb-20">
        {/* ═══════════ EXPANSIVE DESTINATION HERO SHOWCASE ═══════════ */}
        <section className="relative w-full h-[380px] sm:h-[460px] md:h-[520px] overflow-hidden bg-slate-950">
          <img
            src={spot.image}
            alt={isBn ? spot.nameBn : spot.name}
            className="w-full h-full object-cover brightness-[0.88]"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-slate-950/20" />

          {/* Top Floating Badges */}
          <div className="absolute top-6 left-4 sm:left-8 right-4 sm:right-8 flex items-center justify-between z-10">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/95 text-slate-950 text-xs sm:text-sm font-black uppercase tracking-wider shadow-xl backdrop-blur-md">
              <ShieldCheck className="w-4 h-4 stroke-[2.5]" />
              <span>{isBn ? "যাচাইকৃত জাতীয় পর্যটন স্পট" : "Verified Tourism Sanctuary"}</span>
            </div>

            <button
              onClick={() => navigate("/tourism-map")}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/90 hover:bg-white text-slate-900 font-bold text-xs sm:text-sm shadow-lg border border-white/40 transition-all hover:scale-105 active:scale-95 cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>{isBn ? "সকল স্পট দেখুন" : "View All Spots"}</span>
            </button>
          </div>

          {/* Bottom Destination Info */}
          <div className="absolute bottom-8 left-4 sm:left-8 right-4 sm:right-8 max-w-5xl text-white z-10">
            <div className="flex flex-wrap items-center gap-2.5 text-xs sm:text-sm text-emerald-300 font-bold mb-2">
              <span className="flex items-center gap-1.5 bg-slate-900/75 backdrop-blur-md px-3 py-1 rounded-full border border-emerald-400/30">
                <MapPin className="w-3.5 h-3.5 text-emerald-400" />
                {isBn ? spot.regionBn : spot.region}
              </span>
              <span>•</span>
              <span className="bg-slate-900/75 backdrop-blur-md px-3 py-1 rounded-full border border-white/20">
                {isBn ? spot.highlightTagBn : spot.highlightTag}
              </span>
              <span>•</span>
              <span className="text-amber-300 flex items-center gap-1 bg-slate-900/75 backdrop-blur-md px-2.5 py-1 rounded-full">
                <Star className="w-3.5 h-3.5 fill-amber-300" /> 4.8 / 5 Rating
              </span>
            </div>

            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black tracking-tight text-white drop-shadow-xl leading-tight mb-3">
              {isBn ? spot.nameBn : spot.name}
            </h1>

            <p className="text-sm sm:text-base md:text-lg text-slate-100 max-w-3xl leading-relaxed font-normal drop-shadow-md">
              {isBn ? spot.descriptionBn : spot.description}
            </p>

            {/* Quick Guarantees */}
            <div className="flex flex-wrap items-center gap-4 mt-5 text-xs font-semibold text-slate-200">
              <span className="flex items-center gap-1.5 bg-white/10 backdrop-blur-md px-3 py-1.5 rounded-lg border border-white/15">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" /> 100% Direct Hotel Tariff
              </span>
              <span className="flex items-center gap-1.5 bg-white/10 backdrop-blur-md px-3 py-1.5 rounded-lg border border-white/15">
                <Zap className="w-4 h-4 text-amber-400" /> Instant Room Confirmation
              </span>
              <span className="flex items-center gap-1.5 bg-white/10 backdrop-blur-md px-3 py-1.5 rounded-lg border border-white/15">
                <CreditCard className="w-4 h-4 text-cyan-400" /> 0% Hidden Platform Fee
              </span>
            </div>
          </div>
        </section>

        {/* ═══════════ INTERACTIVE TRAVEL DATES & FILTERS BAR ═══════════ */}
        <section className="sticky top-0 z-30 bg-white border-b border-slate-200 shadow-md">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
              
              {/* Left: Date Pickers & Nights Counter */}
              <div className="flex flex-wrap items-center gap-3">
                <div className="flex items-center gap-2 bg-slate-100 p-1.5 rounded-2xl border border-slate-200">
                  <div className="px-3 py-1">
                    <span className="block text-[10px] uppercase font-bold text-slate-500">Check-In</span>
                    <input
                      type="date"
                      value={checkIn}
                      onChange={(e) => setCheckIn(e.target.value)}
                      min={new Date().toISOString().split("T")[0]}
                      className="bg-transparent text-xs sm:text-sm font-bold text-slate-900 outline-none cursor-pointer"
                    />
                  </div>
                  <div className="h-6 w-px bg-slate-300" />
                  <div className="px-3 py-1">
                    <span className="block text-[10px] uppercase font-bold text-slate-500">Check-Out</span>
                    <input
                      type="date"
                      value={checkOut}
                      onChange={(e) => setCheckOut(e.target.value)}
                      min={checkIn || new Date().toISOString().split("T")[0]}
                      className="bg-transparent text-xs sm:text-sm font-bold text-slate-900 outline-none cursor-pointer"
                    />
                  </div>
                </div>

                <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold px-3 py-2.5 rounded-xl flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-emerald-600" />
                  <span>{nights} {isBn ? "রাত অবস্থান" : `Night${nights > 1 ? "s" : ""} Stay`}</span>
                </div>
              </div>

              {/* Right: Budget Tiers & Sort */}
              <div className="flex flex-wrap items-center gap-3">
                {/* Budget Pills */}
                <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-hide py-1">
                  {BUDGET_FILTER_TIERS.map((tier, idx) => (
                    <button
                      key={tier.labelEn}
                      onClick={() => setBudgetTierIndex(idx)}
                      className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 cursor-pointer ${
                        budgetTierIndex === idx
                          ? "bg-slate-900 text-white shadow-md shadow-slate-900/15"
                          : "bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200"
                      }`}
                    >
                      {isBn ? tier.labelBn : tier.labelEn}
                    </button>
                  ))}
                </div>

                {/* Sort Dropdown */}
                <div className="flex items-center gap-1.5 bg-slate-100 border border-slate-200 rounded-xl px-3 py-1.5 text-xs">
                  <SlidersHorizontal className="w-3.5 h-3.5 text-slate-500" />
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value as any)}
                    className="bg-transparent font-bold text-slate-800 outline-none cursor-pointer"
                  >
                    <option value="recommended">{isBn ? "প্রস্তাবিত" : "Recommended"}</option>
                    <option value="price_asc">{isBn ? "কম মূল্য আগে" : "Price: Low to High"}</option>
                    <option value="price_desc">{isBn ? "বেশি মূল্য আগে" : "Price: High to Low"}</option>
                    <option value="rating">{isBn ? "সর্বোচ্চ রেটিং" : "Highest Rated"}</option>
                  </select>
                </div>
              </div>

            </div>
          </div>
        </section>

        {/* ═══════════ MAIN HOTEL LISTINGS SECTION ═══════════ */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 pt-8 pb-12">
          
          {/* Section Heading & Live Counter */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-6">
            <div>
              <h2 className="text-2xl sm:text-3xl font-black text-slate-900">
                {isBn 
                  ? `${spot.nameBn}-এর যাচাইকৃত হোটেল ও রিসোর্ট` 
                  : `Verified Stays at ${spot.name}`}
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 mt-1 font-medium">
                {isBn 
                  ? "সরাসরি স্থানীয় হোটেল মালিকদের সাথে যাচাইকৃত বুকিং • ০% মধ্যস্বত্বভোগী কমিশন" 
                  : "Verified direct accommodation • 0% intermediary markup • Safe consumer tariffs"}
              </p>
            </div>

            <div className="flex items-center gap-2 bg-white border border-slate-200 px-3.5 py-1.5 rounded-full shadow-2xs self-start sm:self-auto">
              <span className="flex h-2.5 w-2.5 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-600" />
              </span>
              <span className="text-xs font-bold text-slate-800">
                {isBn 
                  ? `${filteredHotels.length}টি রুম প্রস্তুত` 
                  : `${filteredHotels.length} Stays Available Right Now`}
              </span>
            </div>
          </div>

          {/* Hotel Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredHotels.map((hotel) => {
              const stayTotal = hotel.price * nights;
              return (
                <motion.div
                  key={hotel.id}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  className="bg-white rounded-2xl border border-slate-200/90 hover:border-emerald-500/50 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between overflow-hidden group shadow-xs"
                >
                  <div>
                    {/* Thumbnail with interactive badges */}
                    <div className="relative w-full h-52 sm:h-56 overflow-hidden bg-slate-100">
                      <img
                        src={hotel.image}
                        alt={isBn ? hotel.nameBn : hotel.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        loading="lazy"
                      />

                      {/* Tag pill */}
                      <div className="absolute top-3 left-3 bg-slate-900/85 backdrop-blur-md border border-emerald-500/40 text-emerald-400 text-[11px] font-black px-2.5 py-1 rounded-full shadow-sm">
                        {isBn ? hotel.tagBn : hotel.tag}
                      </div>

                      {/* Verified badge */}
                      <div className="absolute top-3 right-3 bg-white/95 backdrop-blur-md border border-emerald-200 text-emerald-700 text-[11px] font-bold px-2 py-0.5 rounded-full shadow-sm flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                        <span>{isBn ? "যাচাইকৃত" : "Verified"}</span>
                      </div>

                      {/* Rating & Rooms Left */}
                      <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-xs text-white">
                        <span className="flex items-center gap-1 font-black text-amber-400 bg-slate-950/80 px-2 py-1 rounded-lg backdrop-blur-xs shadow-sm">
                          <Star className="w-3.5 h-3.5 fill-amber-400" />
                          {hotel.rating} <span className="text-[10px] text-slate-300 font-normal">({hotel.reviews})</span>
                        </span>
                        <span className="text-[11px] bg-emerald-500 text-slate-950 font-black px-2.5 py-1 rounded-lg shadow-sm">
                          {isBn ? `${hotel.availableRooms}টি রুম খালি` : `${hotel.availableRooms} Rooms Left`}
                        </span>
                      </div>
                    </div>

                    {/* Hotel Info Content */}
                    <div className="p-5">
                      <h3 className="text-xl font-bold text-slate-900 group-hover:text-emerald-700 transition-colors leading-tight">
                        {isBn ? hotel.nameBn : hotel.name}
                      </h3>

                      <div className="flex items-center gap-1.5 text-xs text-slate-500 mt-1.5 font-medium">
                        <MapPin className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                        <span>{isBn ? hotel.distanceBn : hotel.distance}</span>
                      </div>

                      <div className="mt-3 p-2.5 bg-slate-50 rounded-xl border border-slate-100">
                        <span className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider">Room Type</span>
                        <span className="text-sm font-bold text-slate-800">
                          {isBn ? hotel.roomTypeBn : hotel.roomType}
                        </span>
                      </div>

                      {/* Features Badges */}
                      <div className="flex flex-wrap gap-1.5 mt-3">
                        {(isBn ? hotel.featuresBn : hotel.features).map((f) => (
                          <span
                            key={f}
                            className="text-[11px] font-medium bg-slate-100 text-slate-600 px-2.5 py-0.5 rounded-md border border-slate-200/60"
                          >
                            {f}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Pricing and Action Footer */}
                  <div className="p-5 pt-3 bg-white border-t border-slate-100">
                    <div className="flex items-baseline justify-between mb-3">
                      <div>
                        <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                          {nights > 1 ? `Total for ${nights} nights` : "Rate Per Night"}
                        </div>
                        <div className="flex items-baseline gap-2">
                          <span className="text-2xl font-black text-slate-900">
                            ৳{nights > 1 ? stayTotal.toLocaleString() : hotel.price.toLocaleString()}
                          </span>
                          {hotel.originalPrice && (
                            <span className="text-xs text-rose-500 line-through font-semibold">
                              ৳{(hotel.originalPrice * (nights > 1 ? nights : 1)).toLocaleString()}
                            </span>
                          )}
                        </div>
                        {nights > 1 && (
                          <span className="text-[11px] text-slate-500 font-medium">
                            (৳{hotel.price.toLocaleString()} / night · incl. taxes)
                          </span>
                        )}
                      </div>

                      <div className="text-right">
                        <span className="inline-block text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                          0% Hidden Fee
                        </span>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <button
                        onClick={() => navigate(`/property/${hotel.id}`)}
                        className="py-2.5 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 hover:text-slate-900 font-bold text-xs transition border border-slate-200 flex items-center justify-center gap-1 cursor-pointer"
                      >
                        <Eye className="w-3.5 h-3.5 text-slate-500" />
                        <span>{isBn ? "বিস্তারিত" : "Details"}</span>
                      </button>

                      <button
                        onClick={() => {
                          navigate(`/checkout/${hotel.id}?step=details&roomId=${hotel.id}_r1&checkIn=${checkIn}&checkOut=${checkOut}`);
                        }}
                        className="py-2.5 px-3 rounded-xl bg-violet-600 hover:bg-violet-700 text-white font-black text-xs transition flex items-center justify-center gap-1 shadow-md shadow-violet-600/25 active:scale-95 cursor-pointer"
                      >
                        <BedDouble className="w-3.5 h-3.5" />
                        <span>{isBn ? "রুম বুক করুন" : "Select Room"}</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>

          {filteredHotels.length === 0 && (
            <div className="py-20 text-center bg-white rounded-3xl border border-slate-200 p-8 shadow-xs">
              <Building2 className="w-12 h-12 text-slate-400 mx-auto mb-3" />
              <h3 className="text-lg font-bold text-slate-800 mb-1">
                {isBn ? "এই বাজেটে কোনো রুম পাওয়া যায়নি" : "No Stays Found Matching This Budget"}
              </h3>
              <p className="text-xs text-slate-500 max-w-md mx-auto mb-4">
                {isBn
                  ? "অনুগ্রহ করে অন্য বাজেট ফিল্টার নির্বাচন করুন অথবা সকল বাজেট দেখতে নিচের বাটনে ক্লিক করুন।"
                  : "Please choose a different budget filter or click below to view all verified stays."}
              </p>
              <button
                onClick={() => setBudgetTierIndex(0)}
                className="px-6 py-2.5 rounded-xl bg-slate-900 text-white font-bold text-xs shadow-md cursor-pointer hover:bg-slate-800"
              >
                {isBn ? "সকল বাজেট দেখুন (View All)" : "View All Budgets"}
              </button>
            </div>
          )}
        </section>

        {/* ═══════════ DESTINATION TRAVEL GUIDE & POLICE SAFETY HELPLINE ═══════════ */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 mb-12">
          <div className="bg-gradient-to-r from-emerald-50 via-teal-50 to-blue-50 border border-emerald-200/80 rounded-3xl p-6 sm:p-8 flex flex-col md:flex-row items-center justify-between gap-6 shadow-xs">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-emerald-600 text-white flex items-center justify-center shadow-lg shadow-emerald-600/20 shrink-0">
                <ShieldCheck className="w-7 h-7" />
              </div>
              <div>
                <span className="text-[11px] font-black uppercase tracking-wider text-emerald-800 bg-emerald-200/60 px-2 py-0.5 rounded">
                  24/7 National Safety Guarantee
                </span>
                <h3 className="text-xl sm:text-2xl font-black text-slate-900 mt-1">
                  {isBn ? `${spot.nameBn}-এ পর্যটক নিরাপত্তা সহায়তা` : `Tourist Protection & Assistance at ${spot.name}`}
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-xl font-medium">
                  {isBn
                    ? "বাংলাদেশ ট্যুরিস্ট পুলিশ ও জাতীয় জরুরি সেবা ৯৯৯ এর সাথে সরাসরি সংযুক্ত। সকল হোটেল ও কটেজ অনুমোদিত।"
                    : "Directly linked with Bangladesh Tourist Police & National Emergency 999. 100% verified tariff."}
                </p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-3 shrink-0">
              <a
                href="tel:999"
                className="px-5 py-3 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs flex items-center gap-2 shadow-lg shadow-rose-600/20 transition-all cursor-pointer"
              >
                <PhoneCall className="w-4 h-4" />
                <span>{isBn ? "জরুরি হেল্পলাইন: ৯৯৯" : "National Hotline: 999"}</span>
              </a>
              <Link
                to="/safety-help"
                className="px-5 py-3 rounded-xl bg-white hover:bg-slate-50 text-slate-800 border border-slate-200 font-bold text-xs flex items-center gap-2 shadow-xs transition-all"
              >
                <span>{isBn ? "নিরাপত্তা নীতি জানুন" : "Safety Policy"}</span>
                <ArrowRight className="w-4 h-4 text-emerald-600" />
              </Link>
            </div>
          </div>
        </section>

        {/* ═══════════ EXPLORE MORE DESTINATIONS ═══════════ */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-xl sm:text-2xl font-bold text-slate-900">
                {isBn ? "অন্যান্য দর্শনীয় স্থান আবিষ্কার করুন" : "Explore More Top Spots in Bangladesh"}
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                {isBn ? "৬৪ জেলার শীর্ষ দর্শনীয় স্থান ও লাইভ হোটেল" : "Discover handpicked spots across 8 divisions"}
              </p>
            </div>

            <Link
              to="/tourism-map"
              className="text-xs font-bold text-emerald-700 hover:text-emerald-800 flex items-center gap-1 hover:underline"
            >
              <span>{isBn ? "সব স্পট দেখুন" : "View All"}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {relatedSpots.map((rSpot) => (
              <div
                key={rSpot.id}
                onClick={() => {
                  navigate(`/spot/${rSpot.id}`);
                  window.scrollTo({ top: 0, behavior: "smooth" });
                }}
                className="group bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-2xs hover:shadow-lg transition-all cursor-pointer"
              >
                <div className="relative h-28 sm:h-36 overflow-hidden">
                  <img
                    src={rSpot.image}
                    alt={isBn ? rSpot.nameBn : rSpot.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent" />
                  <div className="absolute bottom-2 left-2 right-2 text-white">
                    <span className="text-[10px] font-bold text-emerald-300 block">{rSpot.region}</span>
                    <h4 className="text-sm font-bold truncate">{isBn ? rSpot.nameBn : rSpot.name}</h4>
                  </div>
                </div>
                <div className="p-2.5 flex items-center justify-between text-xs text-slate-600 bg-white">
                  <span>৳{rSpot.startingPrice} / রাত</span>
                  <span className="text-emerald-600 font-bold group-hover:translate-x-0.5 transition-transform">→</span>
                </div>
              </div>
            ))}
          </div>
        </section>

      </main>

      <Footer />
      <MobileBottomNav />
    </div>
  );
}
