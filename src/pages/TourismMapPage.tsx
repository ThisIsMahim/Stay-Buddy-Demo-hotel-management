import React, { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  MapPin, Compass, Waves, Trees, Mountain, Landmark, 
  Coffee, ArrowRight, BedDouble, ShieldCheck, Sparkles, 
  Search, SlidersHorizontal, PhoneCall, CheckCircle2, 
  ChevronRight, ArrowUpRight, Building2, Star, Eye
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import MobileBottomNav from "@/components/MobileBottomNav";
import SpotHotelsModal from "@/components/SpotHotelsModal";
import { TouristSpot } from "@/components/ExploreBangladeshMap";

// All 8 Administrative Divisions of Bangladesh
const DIVISIONS = [
  { id: "all", labelEn: "All Divisions", labelBn: "সব বিভাগ" },
  { id: "chattogram", labelEn: "Chattogram", labelBn: "চট্টগ্রাম", spots: 6, tag: "Sea & Hills" },
  { id: "sylhet", labelEn: "Sylhet", labelBn: "সিলেট", spots: 4, tag: "Tea & Wetlands" },
  { id: "dhaka", labelEn: "Dhaka", labelBn: "ঢাকা", spots: 3, tag: "Capital & Heritage" },
  { id: "khulna", labelEn: "Khulna", labelBn: "খুলনা", spots: 2, tag: "Sundarbans & Coast" },
  { id: "barishal", labelEn: "Barishal", labelBn: "বরিশাল", spots: 2, tag: "Kuakata & Rivers" },
  { id: "rajshahi", labelEn: "Rajshahi", labelBn: "রাজশাহী", spots: 2, tag: "Silk & Archaeology" },
  { id: "rangpur", labelEn: "Rangpur", labelBn: "রংপুর", spots: 1, tag: "Teesta & Palaces" },
  { id: "mymensingh", labelEn: "Mymensingh", labelBn: "ময়মনসিংহ", spots: 1, tag: "Garo Hills & Haor" },
];

const CATEGORIES = [
  { id: "all", label: "All Landscapes", labelBn: "সকল ভূপ্রকৃতি", icon: Compass },
  { id: "sea", label: "Sea & Beach", labelBn: "সৈকত ও সমুদ্র", icon: Waves },
  { id: "forest", label: "Forest & Nature", labelBn: "বন ও প্রকৃতি", icon: Trees },
  { id: "hill", label: "Hill & Adventure", labelBn: "পাহাড় ও ট্র্যাকিং", icon: Mountain },
  { id: "heritage", label: "Heritage & History", labelBn: "ঐতিহ্য ও ইতিহাস", icon: Landmark },
  { id: "tea", label: "Tea & Haor", labelBn: "চা বাগান ও হাওর", icon: Coffee },
];

// Rich Database of Verified Tourist Spots Across Bangladesh
export const EXPANDED_TOURIST_SPOTS: (TouristSpot & { divisionId: string })[] = [
  // Chattogram Division
  {
    id: "coxs-bazar",
    name: "Cox's Bazar",
    nameBn: "কক্সবাজার সমুদ্র সৈকত",
    region: "Chittagong Division",
    regionBn: "চট্টগ্রাম বিভাগ",
    divisionId: "chattogram",
    category: "sea",
    image: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80",
    description: "World's longest unbroken natural sandy sea beach (120 km) with Laboni, Kolatoli & Inani Point.",
    descriptionBn: "বিশ্বের দীর্ঘতম অবিচ্ছিন্ন প্রাকৃতিক বালুকাময় সমুদ্র সৈকত (১২০ কিমি)।",
    nearbyHotelsCount: 42,
    startingPrice: 850,
    highlightTag: "World's Longest Beach",
    highlightTagBn: "দীর্ঘতম সমুদ্র সৈকত",
  },
  {
    id: "saint-martins",
    name: "Saint Martin's Island",
    nameBn: "সেন্ট মার্টিন দ্বীপ (নারিকেল জিঞ্জিরা)",
    region: "Bay of Bengal",
    regionBn: "বঙ্গোপসাগর অঞ্চল",
    divisionId: "chattogram",
    category: "sea",
    image: "https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=800&q=80",
    description: "Only coral island of Bangladesh featuring crystal clear turquoise water and coconut groves.",
    descriptionBn: "স্বচ্ছ নীল জলরাশি ও প্রবাল দ্বীপের অপরূপ প্রাকৃতিক সৌন্দর্য।",
    nearbyHotelsCount: 18,
    startingPrice: 1200,
    highlightTag: "Coral Island Sanctuary",
    highlightTagBn: "একমাত্র প্রবাল দ্বীপ",
  },
  {
    id: "sajek-valley",
    name: "Sajek Valley",
    nameBn: "সাজেক ভ্যালি (মেঘের উপত্যকা)",
    region: "Rangamati / Baghaichhari",
    regionBn: "রাঙ্গামাটি / বাঘাইছড়ি",
    divisionId: "chattogram",
    category: "hill",
    image: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=800&q=80",
    description: "Queen of Hills floating atop clouds at 1,800 ft with Ruilui Para and Konglak Peak.",
    descriptionBn: "মেঘের উপত্যকা খ্যাত পাহাড়ের চূড়ায় অবস্থিত অপূর্ব সাজেক ও কংলাক পাহাড়।",
    nearbyHotelsCount: 35,
    startingPrice: 1000,
    highlightTag: "Kingdom of Clouds",
    highlightTagBn: "মেঘের রাজ্য",
  },
  {
    id: "bandarban",
    name: "Bandarban & Nilgiri",
    nameBn: "বান্দরবান ও নীলগিরি পিক",
    region: "Chittagong Hill Tracts",
    regionBn: "পার্বত্য চট্টগ্রাম",
    divisionId: "chattogram",
    category: "hill",
    image: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80",
    description: "High altitude hills (2,200 ft), clouds beneath your feet, waterfalls, and tribal villages.",
    descriptionBn: "উঁচু পাহাড়ি শৃঙ্গ, মেঘের মিতালী, ঝরনা ও পাহাড়ি সংস্কৃতির মেলবন্ধন।",
    nearbyHotelsCount: 30,
    startingPrice: 800,
    highlightTag: "Hilltop Sanctuary",
    highlightTagBn: "শীর্ষ পাহাড় চূড়া",
  },
  {
    id: "rangamati",
    name: "Kaptai Lake & Rangamati",
    nameBn: "কাপ্তাই লেক ও রাঙ্গামাটি",
    region: "Rangamati Hill District",
    regionBn: "রাঙ্গামাটি পার্বত্য জেলা",
    divisionId: "chattogram",
    category: "hill",
    image: "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=800&q=80",
    description: "Largest artificial lake in South Asia surrounded by serene emerald mountains.",
    descriptionBn: "দক্ষিণ এশিয়ার বৃহত্তম কৃত্রিম হ্রদ ও ঝুলন্ত সেতুর নয়নাভিরাম রূপ।",
    nearbyHotelsCount: 20,
    startingPrice: 750,
    highlightTag: "Lake Paradise",
    highlightTagBn: "লেক প্যারাডাইস",
  },
  // Sylhet Division
  {
    id: "sreemangal",
    name: "Sreemangal Tea Gardens",
    nameBn: "শ্রীমঙ্গল চা বাগান ও লাউয়াছড়া",
    region: "Moulvibazar, Sylhet",
    regionBn: "মৌলভীবাজার, সিলেট",
    divisionId: "sylhet",
    category: "tea",
    image: "https://images.unsplash.com/photo-1544787219-7f47ccb76574?auto=format&fit=crop&w=800&q=80",
    description: "Tea Capital of Bangladesh, rolling emerald tea slopes, Lawachara Rainforest, and 7-layer tea.",
    descriptionBn: "চা-কন্যা খ্যাত সুবিশাল সবুজ চা বাগান ও লাউয়াছড়া জাতীয় উদ্যান।",
    nearbyHotelsCount: 38,
    startingPrice: 750,
    highlightTag: "Tea Capital",
    highlightTagBn: "চায়ের রাজধানী",
  },
  {
    id: "tanguar-haor",
    name: "Tanguar Haor",
    nameBn: "টাঙ্গুয়ার হাওর ও যাদুকাটা",
    region: "Sunamganj",
    regionBn: "সুনামগঞ্জ জেলা",
    divisionId: "sylhet",
    category: "tea",
    image: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80",
    description: "Ramsar wetland site, crystal clear waters, premium houseboats under the Meghalaya hills.",
    descriptionBn: "স্বচ্ছ মিঠাপানি, হাউসবোট ক্রুজিং ও মেঘালয়ের পাহাড়ঘেরা রামসার সাইট।",
    nearbyHotelsCount: 22,
    startingPrice: 1100,
    highlightTag: "Houseboat Living",
    highlightTagBn: "হাউসবোট লাইফ",
  },
  {
    id: "ratargul",
    name: "Ratargul Swamp Forest",
    nameBn: "রাতারগুল সোয়াম্প ফরেস্ট",
    region: "Sylhet",
    regionBn: "সিলেট জেলা",
    divisionId: "sylhet",
    category: "forest",
    image: "https://images.unsplash.com/photo-1542273917363-3b1817f69a2d?auto=format&fit=crop&w=800&q=80",
    description: "Only freshwater swamp forest in Bangladesh celebrated as the Amazon of BD.",
    descriptionBn: "বাংলার আমাজন খ্যাত দেশের একমাত্র মিঠাপানির সুবিশাল জলাবন।",
    nearbyHotelsCount: 28,
    startingPrice: 650,
    highlightTag: "Amazon of BD",
    highlightTagBn: "বাংলার আমাজন",
  },
  {
    id: "jaflong",
    name: "Jaflong & Lalakhal",
    nameBn: "জাফলং ও লালাখাল",
    region: "Sylhet Border Region",
    regionBn: "সিলেট সীমান্ত অঞ্চল",
    divisionId: "sylhet",
    category: "tea",
    image: "https://images.unsplash.com/photo-1518837695005-2083093ee35b?auto=format&fit=crop&w=800&q=80",
    description: "Piyain River stone extraction, emerald blue water of Lalakhal, and betel leaf gardens.",
    descriptionBn: "পিয়াইন নদীর স্বচ্ছ জলধারা, পাথরের খেলা ও লালাখালের নীল নদী।",
    nearbyHotelsCount: 16,
    startingPrice: 600,
    highlightTag: "Emerald Waters",
    highlightTagBn: "পান্না সবুজ নদী",
  },
  // Barishal Division
  {
    id: "kuakata",
    name: "Kuakata Sea Beach",
    nameBn: "কুয়াকাটা সাগরকন্যা",
    region: "Patuakhali",
    regionBn: "পটুয়াখালী জেলা",
    divisionId: "barishal",
    category: "sea",
    image: "https://images.unsplash.com/photo-1518837695005-2083093ee35b?auto=format&fit=crop&w=800&q=80",
    description: "Daughter of the sea offering panoramic sunrise and sunset from the exact same beach.",
    descriptionBn: "একই স্থানে সূর্যোদয় ও সূর্যাস্ত অবলোকনের অপরূপ সৈকত।",
    nearbyHotelsCount: 24,
    startingPrice: 700,
    highlightTag: "Sunrise & Sunset",
    highlightTagBn: "সূর্যোদয় ও সূর্যাস্ত",
  },
  // Khulna Division
  {
    id: "sundarbans",
    name: "Sundarbans Mangrove",
    nameBn: "সুন্দরবন বিশ্ব ঐতিহ্য",
    region: "Khulna / Bagerhat / Satkhira",
    regionBn: "খুলনা / বাগেরহাট / সাতক্ষীরা",
    divisionId: "khulna",
    category: "forest",
    image: "https://images.unsplash.com/photo-1448375240586-882707db888b?auto=format&fit=crop&w=800&q=80",
    description: "Largest tidal halophytic mangrove forest in the world & Royal Bengal Tiger habitat.",
    descriptionBn: "বিশ্বের সর্ববৃহৎ ম্যানগ্রোভ বন ও রয়েল বেঙ্গল টাইগারের বিশ্বখ্যাত আবাসভূমি।",
    nearbyHotelsCount: 15,
    startingPrice: 1500,
    highlightTag: "UNESCO Heritage",
    highlightTagBn: "ইউনেস্কো বিশ্ব ঐতিহ্য",
  },
  {
    id: "bagerhat",
    name: "Sixty Dome Mosque",
    nameBn: "ষাট গম্বুজ মসজিদ",
    region: "Bagerhat",
    regionBn: "বাগেরহাট জেলা",
    divisionId: "khulna",
    category: "heritage",
    image: "https://images.unsplash.com/photo-1564507592333-c60657eea523?auto=format&fit=crop&w=800&q=80",
    description: "15th-century historic Sultanate architectural masterpiece founded by Khan Jahan Ali.",
    descriptionBn: "খান জাহান আলীর পঞ্চদশ শতাব্দীর ঐতিহাসিক ইসলামিক স্থাপত্য (ইউনেস্কো)।",
    nearbyHotelsCount: 14,
    startingPrice: 550,
    highlightTag: "Historic Landmark",
    highlightTagBn: "ঐতিহাসিক নিদর্শন",
  },
  // Rajshahi Division
  {
    id: "paharpur",
    name: "Somapura Mahavihara",
    nameBn: "সোমপুর মহাবিহার (পাহাড়পুর)",
    region: "Naogaon, Rajshahi",
    regionBn: "নওগাঁ, রাজশাহী",
    divisionId: "rajshahi",
    category: "heritage",
    image: "https://images.unsplash.com/photo-1548013146-72479768bada?auto=format&fit=crop&w=800&q=80",
    description: "Greatest Buddhist monastery of ancient South Asia dating back to 8th century.",
    descriptionBn: "৮ম শতাব্দীর পাল সাম্রাজ্যের দক্ষিণ এশিয়ার সর্বশ্রেষ্ঠ বৌদ্ধ বিহার।",
    nearbyHotelsCount: 12,
    startingPrice: 500,
    highlightTag: "Ancient Wonder",
    highlightTagBn: "প্রাচীন ঐতিহ্য",
  },
  // Dhaka Division
  {
    id: "lalbagh-fort",
    name: "Lalbagh Fort & Old Dhaka",
    nameBn: "লালবাগ কেল্লা ও পুরান ঢাকা",
    region: "Dhaka Central",
    regionBn: "ঢাকা মহানগরী",
    divisionId: "dhaka",
    category: "heritage",
    image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=800&q=80",
    description: "17th-century Mughal fort complex, Ahsan Manzil, and heritage culinary district.",
    descriptionBn: "১৭শ শতাব্দীর মোঘল স্থাপত্য, আহসান মঞ্জিল ও পুরান ঢাকার ঐতিহ্য।",
    nearbyHotelsCount: 45,
    startingPrice: 600,
    highlightTag: "Mughal Heritage",
    highlightTagBn: "মোঘল ঐতিহ্য",
  },
  {
    id: "panam-city",
    name: "Panam City & Sonargaon",
    nameBn: "পানাম নগর ও সোনারগাঁও",
    region: "Narayanganj, Dhaka",
    regionBn: "নারায়ণগঞ্জ, ঢাকা",
    divisionId: "dhaka",
    category: "heritage",
    image: "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=800&q=80",
    description: "Ancient historic capital of Bengal with preserved 19th-century colonial merchants street.",
    descriptionBn: "বাংলার প্রাচীন রাজধানী ও ১৯ শতকের ব্রিটিশ ঔপনিবেশিক বণিক নগরী।",
    nearbyHotelsCount: 18,
    startingPrice: 700,
    highlightTag: "Lost City",
    highlightTagBn: "প্রাচীন হারানো নগরী",
  },
];

const TourismMapPage: React.FC = () => {
  const { i18n } = useTranslation();
  const isBn = i18n.language?.startsWith("bn");
  const navigate = useNavigate();

  // Filter States
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDivision, setSelectedDivision] = useState("all");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [maxBudget, setMaxBudget] = useState<number>(10000);

  // Modal State
  const [activeModalSpot, setActiveModalSpot] = useState<TouristSpot | null>(null);

  // Filtered Spots Logic
  const filteredSpots = useMemo(() => {
    return EXPANDED_TOURIST_SPOTS.filter((spot) => {
      // Division filter
      if (selectedDivision !== "all" && spot.divisionId !== selectedDivision) {
        return false;
      }
      // Landscape Category filter
      if (selectedCategory !== "all" && spot.category !== selectedCategory) {
        return false;
      }
      // Budget filter
      if (spot.startingPrice > maxBudget) {
        return false;
      }
      // Text search
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchesName = spot.name.toLowerCase().includes(q);
        const matchesNameBn = spot.nameBn.toLowerCase().includes(q);
        const matchesRegion = spot.region.toLowerCase().includes(q);
        const matchesDesc = spot.description.toLowerCase().includes(q);
        if (!matchesName && !matchesNameBn && !matchesRegion && !matchesDesc) {
          return false;
        }
      }
      return true;
    });
  }, [searchQuery, selectedDivision, selectedCategory, maxBudget]);

  return (
    <div className="min-h-screen bg-[#FAFAFA] flex flex-col justify-between">
      <Header />

      <main className="flex-1">
        {/* ═══════════ HERO BANNER SECTION ═══════════ */}
        <section className="relative pt-12 pb-16 md:py-20 bg-gradient-to-b from-slate-900 via-slate-900 to-slate-950 text-white overflow-hidden">
          {/* Subtle Ambient Decorative Glow */}
          <div className="absolute top-0 right-1/4 w-96 h-96 bg-emerald-500/10 rounded-full blur-[140px] pointer-events-none" />
          <div className="absolute bottom-0 left-10 w-96 h-96 bg-cyan-500/10 rounded-full blur-[160px] pointer-events-none" />

          <div className="max-w-7xl mx-auto px-4 md:px-6 relative z-10">
            <div className="flex flex-col items-center text-center max-w-4xl mx-auto">
              {/* Official Badge */}
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-semibold uppercase tracking-wider mb-4 shadow-xs">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>
                  {isBn ? "জাতীয় ডিজিটাল পর্যটন ও হোটেল নেটওয়ার্ক মানচিত্র" : "Official National Tourism Initiative • Bangladesh"}
                </span>
              </div>

              {/* Title */}
              <h1 className="text-3xl md:text-6xl font-black tracking-tight text-white leading-tight">
                {isBn ? (
                  <>
                    বাংলাদেশ অন্বেষণ —{" "}
                    <span className="bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400 bg-clip-text text-transparent">
                      পর্যটন ও হোটেল মানচিত্র
                    </span>
                  </>
                ) : (
                  <>
                    Explore Bangladesh —{" "}
                    <span className="bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400 bg-clip-text text-transparent">
                      Tourism & Hotel Map
                    </span>
                  </>
                )}
              </h1>

              {/* Subtitle */}
              <p className="text-slate-300 text-sm md:text-lg mt-4 max-w-2xl font-normal leading-relaxed">
                {isBn
                  ? "দেশের ৬৪ জেলার প্রতিটি পর্যটন কেন্দ্র, প্রাকৃতিক আকর্ষণ, যাচাইকৃত নিকটস্থ হোটেল ও রিয়েল-টাইম রুম প্রাপ্যতা এক ক্লিকে অন্বেষণ করুন।"
                  : "Verified hotels and real-time room availability across every tourism region in Bangladesh. Whatever your budget, find and book available rooms instantly!"}
              </p>

              {/* Live Statistics Counter Bar */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 w-full mt-10 pt-8 border-t border-slate-800">
                <div className="bg-slate-800/50 backdrop-blur-md p-4 rounded-2xl border border-slate-700/60">
                  <div className="text-2xl md:text-3xl font-black text-emerald-400">৬৪</div>
                  <div className="text-xs text-slate-300 font-medium mt-0.5">{isBn ? "জেলা সংযুক্ত" : "Districts Mapped"}</div>
                </div>
                <div className="bg-slate-800/50 backdrop-blur-md p-4 rounded-2xl border border-slate-700/60">
                  <div className="text-2xl md:text-3xl font-black text-teal-300">১৫০+</div>
                  <div className="text-xs text-slate-300 font-medium mt-0.5">{isBn ? "অনুমোদিত পর্যটন স্পট" : "Verified Attractions"}</div>
                </div>
                <div className="bg-slate-800/50 backdrop-blur-md p-4 rounded-2xl border border-slate-700/60">
                  <div className="text-2xl md:text-3xl font-black text-cyan-400">১,২০০+</div>
                  <div className="text-xs text-slate-300 font-medium mt-0.5">{isBn ? "ভেরিফায়েড আবাসন" : "Direct Stays"}</div>
                </div>
                <div className="bg-slate-800/50 backdrop-blur-md p-4 rounded-2xl border border-slate-700/60">
                  <div className="text-2xl md:text-3xl font-black text-amber-400">০%</div>
                  <div className="text-xs text-slate-300 font-medium mt-0.5">{isBn ? "হিডেন প্ল্যাটফর্ম ফি" : "Middleman Fee"}</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ═══════════ SEARCH & ADVANCED FILTER CONTROLS ═══════════ */}
        <section className="relative z-30 -mt-8 max-w-7xl mx-auto px-4 md:px-6">
          <div className="bg-white rounded-3xl p-5 md:p-6 shadow-2xl border border-slate-200">
            {/* Search Input */}
            <div className="relative mb-5">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={
                  isBn
                    ? "যেকোনো পর্যটন স্পট, জেলা বা আকর্ষণ খুঁজুন (যেমন: কক্সবাজার, সাজেক, সুন্দরবন, সোমপুর)..."
                    : "Search any tourist spot, district or landmark (e.g., Cox's Bazar, Sajek, Sundarbans)..."
                }
                className="w-full pl-12 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-medium text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white transition-all"
              />
            </div>

            {/* Division Pills */}
            <div className="mb-4">
              <div className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2 flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-emerald-600" />
                <span>{isBn ? "প্রশাসনিক বিভাগ নির্বাচন করুন:" : "Filter by Division:"}</span>
              </div>
              <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-hide -mx-1 px-1">
                {DIVISIONS.map((div) => {
                  const isSelected = selectedDivision === div.id;
                  return (
                    <button
                      key={div.id}
                      onClick={() => setSelectedDivision(div.id)}
                      className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                        isSelected
                          ? "bg-emerald-600 text-white shadow-md shadow-emerald-600/20 font-bold"
                          : "bg-slate-100 text-slate-700 hover:bg-slate-200 border border-slate-200"
                      }`}
                    >
                      <span>{isBn ? div.labelBn : div.labelEn}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Landscape Category Pills */}
            <div className="pt-3 border-t border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-hide">
                {CATEGORIES.map((cat) => {
                  const Icon = cat.icon;
                  const isSelected = selectedCategory === cat.id;
                  return (
                    <button
                      key={cat.id}
                      onClick={() => setSelectedCategory(cat.id)}
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium whitespace-nowrap transition-all ${
                        isSelected
                          ? "bg-slate-900 text-white font-bold shadow-xs"
                          : "bg-white text-slate-600 hover:bg-slate-50 border border-slate-200"
                      }`}
                    >
                      <Icon className={`w-3.5 h-3.5 ${isSelected ? "text-emerald-400" : "text-slate-400"}`} />
                      <span>{isBn ? cat.labelBn : cat.label}</span>
                    </button>
                  );
                })}
              </div>

              {/* Reset Filter Button */}
              {(selectedDivision !== "all" || selectedCategory !== "all" || searchQuery) && (
                <button
                  onClick={() => {
                    setSelectedDivision("all");
                    setSelectedCategory("all");
                    setSearchQuery("");
                  }}
                  className="text-xs font-bold text-rose-600 hover:text-rose-700 hover:underline shrink-0 self-start md:self-auto"
                >
                  {isBn ? "ফিল্টার রিসেট করুন" : "Reset Filters"}
                </button>
              )}
            </div>
          </div>
        </section>

        {/* ═══════════ TOURIST SPOTS GRID ═══════════ */}
        <section className="py-12 md:py-16 max-w-7xl mx-auto px-4 md:px-6">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl font-black text-slate-900 tracking-tight">
                {isBn ? "উপলব্ধ পর্যটন স্পটসমূহ" : "Verified Tourist Spots"}
              </h2>
              <p className="text-xs md:text-sm text-slate-500 mt-0.5">
                {isBn 
                  ? `মোট ${filteredSpots.length}টি পর্যটন গন্তব্য পাওয়া গেছে`
                  : `Showing ${filteredSpots.length} tourism destinations`}
              </p>
            </div>

            <div className="hidden sm:flex items-center gap-2 text-xs font-medium text-emerald-800 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
              <span>{isBn ? "লাইভ রুম যাচাইকৃত" : "Verified Live Inventory"}</span>
            </div>
          </div>

          {filteredSpots.length === 0 ? (
            <div className="py-16 text-center bg-white rounded-3xl border border-dashed border-slate-300">
              <Compass className="w-12 h-12 text-slate-400 mx-auto mb-3" />
              <h3 className="text-base font-bold text-slate-800">
                {isBn ? "কোনো পর্যটন স্পট খুঁজে পাওয়া যায়নি" : "No tourist destinations found"}
              </h3>
              <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
                {isBn 
                  ? "অনুসন্ধানের শব্দ পরিবর্তন করুন বা অন্য কোনো বিভাগ/ক্যাটাগরি ফিল্টার নির্বাচন করুন।"
                  : "Try clearing your search query or adjusting your filters."}
              </p>
              <button
                onClick={() => {
                  setSelectedDivision("all");
                  setSelectedCategory("all");
                  setSearchQuery("");
                }}
                className="mt-4 px-4 py-2 rounded-xl bg-emerald-600 text-white font-bold text-xs"
              >
                {isBn ? "সব স্পট দেখুন" : "View All Spots"}
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredSpots.map((spot) => (
                <div
                  key={spot.id}
                  className="group relative bg-white rounded-3xl overflow-hidden border border-slate-200 shadow-sm hover:shadow-2xl hover:-translate-y-1.5 transition-all duration-300 flex flex-col justify-between"
                >
                  {/* Photo & Overlays */}
                  <div className="relative h-48 w-full overflow-hidden bg-slate-100">
                    <img
                      src={spot.image}
                      alt={spot.name}
                      className="w-full h-full object-cover group-hover:scale-106 transition-transform duration-700 ease-out"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-black/20" />

                    {/* Tag badge */}
                    <div className="absolute top-3 left-3 bg-white/95 backdrop-blur-md text-emerald-800 px-2.5 py-1 rounded-full text-[11px] font-bold border border-emerald-200 shadow-xs flex items-center gap-1">
                      <Sparkles className="w-3 h-3 text-amber-500" />
                      <span>{isBn ? spot.highlightTagBn : spot.highlightTag}</span>
                    </div>

                    {/* Region Pill */}
                    <div className="absolute bottom-3 left-3 text-white">
                      <div className="flex items-center gap-1 text-[11px] font-medium text-slate-200">
                        <MapPin className="w-3 h-3 text-emerald-400" />
                        <span>{isBn ? spot.regionBn : spot.region}</span>
                      </div>
                      <h3 className="text-lg font-black tracking-tight text-white mt-0.5">
                        {isBn ? spot.nameBn : spot.name}
                      </h3>
                    </div>
                  </div>

                  {/* Body Content */}
                  <div className="p-4 flex-1 flex flex-col justify-between">
                    <p className="text-xs text-slate-600 line-clamp-2 mb-4 leading-relaxed font-normal">
                      {isBn ? spot.descriptionBn : spot.description}
                    </p>

                    <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                      <div>
                        <div className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
                          {isBn ? "ভেরিফায়েড হোটেল" : "Verified Stays"}
                        </div>
                        <div className="flex items-center gap-1 text-xs font-bold text-slate-800">
                          <BedDouble className="w-3.5 h-3.5 text-emerald-600" />
                          <span>
                            {isBn ? `${spot.nearbyHotelsCount}টি প্রস্তুত` : `${spot.nearbyHotelsCount} Listed`}
                          </span>
                        </div>
                      </div>

                      <div className="text-right">
                        <div className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
                          {isBn ? "শুরু" : "From"}
                        </div>
                        <div className="text-sm font-extrabold text-emerald-600">
                          ৳{spot.startingPrice}{" "}
                          <span className="text-[10px] font-normal text-slate-400">
                            {isBn ? "/ রাত" : "/ night"}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* View Hotels Action Button */}
                    <button
                      onClick={() => navigate(`/spot/${spot.id}`)}
                      className="w-full mt-4 py-2.5 px-4 rounded-xl bg-slate-900 group-hover:bg-emerald-600 text-white font-bold text-xs transition-colors flex items-center justify-center gap-1.5 shadow-sm active:scale-98"
                    >
                      <span>{isBn ? "উপলব্ধ হোটেল দেখুন" : "View Verified Hotels"}</span>
                      <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* ═══════════ INTEGRATED BOOKING SIMULATOR ═══════════ */}
        <TouristSpotToBooking />

        {/* ═══════════ NATIONAL TOURIST SAFETY & HELPLINE BANNER ═══════════ */}
        <section className="py-12 bg-white border-t border-slate-200">
          <div className="max-w-7xl mx-auto px-4 md:px-6">
            <div className="bg-gradient-to-r from-emerald-50 via-teal-50 to-blue-50 border border-emerald-200/80 rounded-3xl p-6 md:p-8 flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-emerald-600 text-white flex items-center justify-center shrink-0 shadow-md">
                  <PhoneCall className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="text-base md:text-lg font-black text-slate-900">
                    {isBn ? "২৪/৭ পর্যটক সুরক্ষা ও হেল্পলাইন" : "24/7 National Tourist Helpline & Safety"}
                  </h4>
                  <p className="text-xs md:text-sm text-slate-600 mt-0.5">
                    {isBn 
                      ? "ট্যুরিস্ট পুলিশ বাংলাদেশ হটলাইন: ০১৩২০-১৬০১৬০ • জাতীয় জরুরি সেবা: ৯৯৯" 
                      : "Tourist Police Hotline: 01320-160160 • National Emergency: 999"}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <a
                  href="tel:01320160160"
                  className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md transition-all active:scale-95"
                >
                  {isBn ? "ট্যুরিস্ট পুলিশ কল করুন" : "Call Tourist Police"}
                </a>
                <button
                  onClick={() => navigate("/safety-help")}
                  className="px-4 py-2.5 rounded-xl bg-white border border-slate-300 text-slate-700 font-bold text-xs hover:bg-slate-50 transition-all"
                >
                  {isBn ? "নিরাপত্তা গাইডলাইন" : "Safety Advisory"}
                </button>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
      <MobileBottomNav />

      {/* Spot Hotels Detail Modal */}
      <SpotHotelsModal
        spot={activeModalSpot}
        onClose={() => setActiveModalSpot(null)}
      />
    </div>
  );
};

export default TourismMapPage;
