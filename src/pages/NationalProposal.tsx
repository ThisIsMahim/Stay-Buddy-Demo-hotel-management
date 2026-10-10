import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Building2, ShieldCheck, ArrowLeft, CheckCircle2, 
  Layers, Lock, Users, Landmark, ChevronRight, ChevronLeft, 
  Download, Monitor, ArrowRight, MapPin, SlidersHorizontal, 
  Star, CreditCard, Waves, Trees, Mountain, Coffee, Globe,
  Shield, Check, Printer, Scale, DollarSign,
  BarChart3, X, Compass, Briefcase
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useTranslation } from "react-i18next";

// ── SLIDE DECK METADATA (For the Executive Pitch Deck Modal) ──
interface SlideInfo {
  number: number;
  title: string;
  titleBn: string;
  category: string;
  tag: string;
}

const SLIDE_METADATA: SlideInfo[] = [
  { number: 1, title: "Cover & Title Proposal", titleBn: "প্রকল্পের শিরোনাম ও প্রস্তাবনা", category: "identity", tag: "Identity" },
  { number: 2, title: "Executive Summary", titleBn: "১. প্রকল্পের সারসংক্ষেপ", category: "summary", tag: "Summary" },
  { number: 3, title: "Current Problems & Citizen Friction", titleBn: "২. বর্তমান সমস্যাটি কোথায়?", category: "problem", tag: "Problem" },
  { number: 4, title: "Real-Life User Personas", titleBn: "৩. বাস্তব ব্যবহারকারীর উদাহরণ", category: "persona", tag: "Simulation" },
  { number: 5, title: "Core Platform Features", titleBn: "৪. প্ল্যাটফর্মের মূল সুবিধা", category: "features", tag: "Features" },
  { number: 6, title: "Hotel Owner/Manager Dashboard", titleBn: "৫. হোটেল মালিক/ম্যানেজারের ড্যাশবোর্ড", category: "dashboard", tag: "Owner" },
  { number: 7, title: "Importance for Government", titleBn: "৬. সরকারের জন্য কেন গুরুত্বপূর্ণ?", category: "government", tag: "Government" },
  { number: 8, title: "Verification & Trust Framework", titleBn: "৭. ভেরিফিকেশন ও ট্রাস্ট ফ্রেমওয়ার্ক", category: "trust", tag: "Security" },
  { number: 9, title: "Booking Workflow (7 Steps)", titleBn: "৮. বুকিং ওয়ার্কফ্লো (৭ ধাপ)", category: "workflow", tag: "Process" },
  { number: 10, title: "Proposed Digital Architecture", titleBn: "৯. প্রস্তাবিত ডিজিটাল আর্কিটেকচার", category: "architecture", tag: "Tech" },
  { number: 11, title: "Data Privacy & Security-by-Design", titleBn: "১০. ডেটা প্রাইভেসি ও নিরাপত্তা", category: "security", tag: "Compliance" },
  { number: 12, title: "Business & Sustainability Model", titleBn: "১১. ব্যবসায়িক ও টেকসই মডেল", category: "business", tag: "Finance" },
  { number: 13, title: "4-Phase Rollout Plan", titleBn: "১২. বাস্তবায়ন পরিকল্পনা (৪ ধাপ)", category: "roadmap", tag: "Roadmap" },
  { number: 14, title: "Expected National Impact", titleBn: "১৩. প্রত্যাশিত জাতীয় প্রভাব", category: "impact", tag: "Impact" },
  { number: 15, title: "Proposed Government Collaboration", titleBn: "১৪. সরকারের নিকট প্রস্তাবিত সহযোগিতা", category: "partnership", tag: "Proposal" },
  { number: 16, title: "Project Recap & Acknowledgement", titleBn: "ধন্যবাদ ও প্রকল্প রিক্যাপ", category: "summary", tag: "Closing" },
  { number: 17, title: "Financial Framework & Government Role", titleBn: "১১. আর্থিক কাঠামো ও সরকারের ভূমিকা", category: "business", tag: "Sustainability" },
  { number: 18, title: "Proposed Project Identity (StayBD)", titleBn: "প্রস্তাবিত Project Identity", category: "identity", tag: "Branding" },
  { number: 19, title: "Explore Bangladesh — Tourism Map", titleBn: "১৩. Explore Bangladesh — Tourism Map", category: "tourism", tag: "Tourism" },
  { number: 20, title: "Tourist Spot → Nearby Hotels → Booking", titleBn: "১৪. Tourist Spot → Nearby Hotels → Booking", category: "tourism", tag: "Flow" },
  { number: 21, title: "StayBD = Hotel Booking + Tourism Discovery", titleBn: "StayBD = Hotel Booking + Tourism Discovery", category: "summary", tag: "Vision" },
];

const NationalProposal: React.FC = () => {
  const navigate = useNavigate();
  const { i18n } = useTranslation();
  const isBn = i18n.language?.startsWith("bn");

  // State
  const [activeTab, setActiveTab] = useState<"citizens" | "hotels" | "government" | "economy">("citizens");
  const [activeZone, setActiveZone] = useState<number>(0);
  const [activeTier, setActiveTier] = useState<number>(0);
  const [showPitchModal, setShowPitchModal] = useState<boolean>(false);
  const [currentSlideIndex, setCurrentSlideIndex] = useState<number>(0);

  const toggleLanguage = () => {
    i18n.changeLanguage(isBn ? "en" : "bn");
  };

  // 5 Ecological Tourism Zones
  const TOURISM_ZONES = [
    {
      nameEn: "Sea & Beach",
      nameBn: "সমুদ্র ও সৈকত অঞ্চল",
      tagEn: "120km Coastline",
      tagBn: "১২০ কিমি অবিচ্ছিন্ন সৈকত",
      icon: Waves,
      color: "from-cyan-500 to-blue-600",
      accent: "text-cyan-400",
      border: "border-cyan-500/30",
      bg: "bg-cyan-500/10",
      spotsEn: "Cox's Bazar, Saint Martin's Coral Island, Kuakata Sunrise/Sunset, Patenga Beach",
      spotsBn: "কক্সবাজার সমুদ্র সৈকত, সেন্ট মার্টিন প্রবাল দ্বীপ, কুয়াকাটা ও পতেঙ্গা",
      hotelsCount: "380+ Verified Hotels",
      hotelsCountBn: "৩৮০+ যাচাইকৃত হোটেল",
      descEn: "Connecting travelers to beachfront resorts and budget guest houses with guaranteed genuine sea-view listings.",
      descBn: "সরাসরি সমুদ্রের ভিউ নিশ্চিত করে বিচ রিসোর্ট ও বাজেট কটেজে মধ্যস্বত্বভোগী ছাড়া নিরাপদ বুকিং।",
      destinationQuery: "Cox's Bazar"
    },
    {
      nameEn: "Hills & Highlands",
      nameBn: "পাহাড় ও উপত্যকা",
      tagEn: "Adventure & Cloudscapes",
      tagBn: "মেঘের রাজ্য ও অ্যাডভেঞ্চার",
      icon: Mountain,
      color: "from-emerald-500 to-teal-600",
      accent: "text-emerald-400",
      border: "border-emerald-500/30",
      bg: "bg-emerald-500/10",
      spotsEn: "Sajek Valley (Kingdom of Clouds), Bandarban & Nilgiri Peak, Rangamati Kaptai Lake, Khagrachhari",
      spotsBn: "সাজেক ভ্যালি, বান্দরবান ও নীলগিরি চূড়া, রাঙ্গামাটি কাপ্তাই লেক ও খাগড়াছড়ি",
      hotelsCount: "210+ Verified Resorts",
      hotelsCountBn: "২১০+ যাচাইকৃত রিসোর্ট",
      descEn: "Verified mountain cottages, bamboo eco-villas, and cloud-facing retreats with satellite geofenced coordinates.",
      descBn: "স্যাটেলাইট মানচিত্রে নিখুঁত অবস্থানের নিশ্চয়তাসহ মেঘের কোলে অবস্থিত ইকো-রিসোর্ট ও কাঠের কটেজ।",
      destinationQuery: "Sajek"
    },
    {
      nameEn: "Forests & Mangroves",
      nameBn: "বন, ম্যানগ্রোভ ও প্রকৃতি",
      tagEn: "UNESCO World Heritage",
      tagBn: "ইউনেস্কো বিশ্ব ঐতিহ্য",
      icon: Trees,
      color: "from-amber-500 to-emerald-600",
      accent: "text-amber-400",
      border: "border-amber-500/30",
      bg: "bg-amber-500/10",
      spotsEn: "Sundarbans (World's Largest Mangrove), Ratargul Swamp Forest, Lawachara Rainforest, Madhabkunda",
      spotsBn: "সুন্দরবন ম্যানগ্রোভ, রাতারগুল সোয়াম্প ফরেস্ট, লাউয়াছড়া রেইনফরেস্ট ও মাধবকুণ্ড",
      hotelsCount: "140+ Eco Lodges",
      hotelsCountBn: "১৪০+ ইকো লজ",
      descEn: "Sustainable eco-resorts, river cruise houseboats, and jungle lodges compliant with environmental directives.",
      descBn: "পরিবেশবান্ধব নৌ-ভ্রমণ হাউসবোট এবং বন সংরক্ষণের বিধি মেনে পরিচালিত অথেনটিক জঙ্গল লজ।",
      destinationQuery: "Sundarbans"
    },
    {
      nameEn: "Tea & Freshwater Haor",
      nameBn: "চা বাগান ও হাওর অঞ্চল",
      tagEn: "Wetlands & Houseboats",
      tagBn: "রামসার সাইট ও চা-কন্যা",
      icon: Coffee,
      color: "from-lime-500 to-emerald-600",
      accent: "text-lime-400",
      border: "border-lime-500/30",
      bg: "bg-lime-500/10",
      spotsEn: "Sreemangal Tea Country, Tanguar Haor (Ramsar Site), Sylhet Malnicherra, Sunamganj",
      spotsBn: "শ্রীমঙ্গল চা বাগান, টাঙ্গুয়ার হাওর হাউসবোট, সিলেট মালনীছড়া ও সুনামগঞ্জ",
      hotelsCount: "175+ Verified Stays",
      hotelsCountBn: "১৭৫+ যাচাইকৃত স্টে",
      descEn: "Tea estate bungalows, floating houseboat accommodations, and heritage lake view sanctuaries.",
      descBn: "চা বাগানের ব্রিটিশ হেরিটেজ বাংলো এবং টাঙ্গুয়ার হাওরে প্রিমিয়াম হাউসবোটের রিয়েল-টাইম বুকিং।",
      destinationQuery: "Sylhet"
    },
    {
      nameEn: "Heritage & History",
      nameBn: "প্রত্নতত্ত্ব ও ঐতিহাসিক নিদর্শন",
      tagEn: "Ancient Civilizations",
      tagBn: "প্রাচীন সভ্যতা ও প্রত্নতত্ত্ব",
      icon: Landmark,
      color: "from-purple-500 to-indigo-600",
      accent: "text-purple-400",
      border: "border-purple-500/30",
      bg: "bg-purple-500/10",
      spotsEn: "Paharpur Somapura Mahavihara, Bagerhat Sixty Dome Mosque, Mahasthangarh, Mainamati",
      spotsBn: "পাহাড়পুর সোমপুর মহাবিহার, বাগেরহাট ষাট গম্বুজ মসজিদ, মহাস্থানগড় ও ময়নামতি",
      hotelsCount: "120+ Verified Stays",
      hotelsCountBn: "১২০+ যাচাইকৃত আবাসন",
      descEn: "Cultural heritage trails with verified regional hotels enabling researchers, families, and global visitors.",
      descBn: "ঐতিহাসিক স্থান পরিদর্শনে আসা পরিবার ও আন্তর্জাতিক গবেষকদের জন্য পরিচ্ছন্ন ও নিরাপদ আবাসন।",
      destinationQuery: "Rajshahi"
    }
  ];

  // 4 Tiers of Trust Engine
  const TRUST_TIERS = [
    {
      number: "01",
      titleEn: "Legal License & Identity Verification",
      titleBn: "আইনি ট্রেড লাইসেন্স ও মালিকের পরিচয়পত্র যাচাই",
      descEn: "Zero ghost profiles. Every property must pass manual & automated checks for Municipal Trade License, Owner NID, and Fire/Tourism Department registration before appearing on the public search index.",
      descBn: "কোনো ভুয়া হোটেলের অস্তিত্ব নেই। প্ল্যাটফর্মে যুক্ত হতে প্রতিটি হোটেলের পৌরসভা ট্রেড লাইসেন্স, মালিকের জাতীয় পরিচয়পত্র (NID) এবং প্রয়োজনীয় অনুমোদন যাচাই বাধ্যতামূলক।",
      badgeEn: "Government Legal Vetting",
      badgeBn: "আইনি নথি যাচাই",
      statEn: "100% Host Background Check",
      statBn: "১০০% ভেরিফায়েড স্বত্বাধিকারী",
      icon: ShieldCheck
    },
    {
      number: "02",
      titleEn: "Satellite GPS Geofence Auditing",
      titleBn: "স্যাটেলাইট জিপিএস ও ভৌগোলিক পিনপয়েন্ট যাচাই",
      descEn: "Precise latitude and longitude coordinates are audited against high-resolution satellite imagery to verify physical existence and calculate exact road distances to key attractions.",
      descBn: "স্যাটেলাইট মানচিত্রের মাধ্যমে হোটেলের বাস্তব ভৌগোলিক অবস্থান ও পর্যটন স্পটের সঠিক দূরত্ব যাচাই করা হয়, যেন পর্যটককে মিথ্যা দূরত্ব দিয়ে বিভ্রান্ত না করা যায়।",
      badgeEn: "Geotagged Real Location",
      badgeBn: "জিওট্যাগড বাস্তব অবস্থান",
      statEn: "Zero Misleading Distances",
      statBn: "নিখুঁত দূরত্বের নিশ্চয়তা",
      icon: MapPin
    },
    {
      number: "03",
      titleEn: "Anti-Theft Real-Time Room Ledger",
      titleBn: "চুরি রোধক লাইভ ইনভেন্টরি ও অডিট লেজার",
      descEn: "Both walk-in offline bookings and digital reservations are synchronized in a single tamper-evident digital ledger. Prevents front-desk revenue manipulation and double bookings.",
      descBn: "অফলাইন ও অনলাইন সব বুকিং একটি কেন্দ্রীয় ডিজিটাল লেজারে রিয়েল-টাইমে লিপিবদ্ধ থাকে। এর ফলে হোটেল ম্যানেজারের রাজস্ব চুরি এবং ডাবল বুকিং পুরোপুরি বন্ধ হয়।",
      badgeEn: "Cryptographic Inventory Ledger",
      badgeBn: "স্বয়ংক্রিয় ডিজিটাল অডিট",
      statEn: "Zero Inventory Manipulation",
      statBn: "রাজস্ব ফাঁকি ও জালিয়াতি রোধ",
      icon: Layers
    },
    {
      number: "04",
      titleEn: "Checkout-Linked Authentic Reviews",
      titleBn: "সম্পন্ন অবস্থান-ভিত্তিক নিরপেক্ষ রিভিউ ব্যবস্থা",
      descEn: "Only verified guests who have completed their physical check-in and checkout via digital QR scan are permitted to submit ratings and feedback. Eliminates paid marketing spam and smear campaigns.",
      descBn: "কিউআর কোড স্ক্যান করে অবস্থান সম্পন্ন করা প্রকৃত অতিথি ছাড়া অন্য কারও রিভিউ দেওয়ার সুযোগ নেই। পেইড রিভিউ এবং উদ্দেশ্যমূলক অপপ্রচার সম্পূর্ণ অসম্ভব।",
      badgeEn: "100% Authentic Traveler Feedback",
      badgeBn: "১০০% প্রকৃত অতিথির মতামত",
      statEn: "No Paid Propaganda",
      statBn: "ফেক রিভিউ সম্পূর্ণরূপে নিষিদ্ধ",
      icon: Star
    }
  ];

  // 4 Rollout Phases
  const ROLLOUT_PHASES = [
    {
      phase: isBn ? "১ম পর্যায়" : "Phase 01",
      title: isBn ? "পাইলট প্রজেক্ট (ঢাকা ও মডেল হোটেল)" : "Dhaka Pilot & Selected Models",
      timeline: isBn ? "১ম — ৩য় মাস" : "Months 1 — 3",
      items: isBn ? [
        "ঢাকা মেট্রোপলিটন ও বিমানবন্দর সংলগ্ন ১০০টি মডেল হোটেল অনবোর্ডিং",
        "আইনি ট্রেড লাইসেন্স ও এনআইডি ভেরিফিকেশন প্রটোকল পরীক্ষণ",
        "রিয়েল-টাইম রুম ইনভেন্টরি ও কিউআর চেক-ইন ভাউচার সিস্টেম চালু",
        "ভোক্তা অধিকার সংরক্ষণ ও অপারেশনাল ফিডব্যাক বিশ্লেষণ"
      ] : [
        "Onboarding 100 model hotels across Dhaka Metropolitan & Airport hubs",
        "Validating legal trade license & NID document verification protocols",
        "Deploying live room inventory synchronization & QR check-in vouchers",
        "Calibrating initial consumer rights & operational response metrics"
      ]
    },
    {
      phase: isBn ? "২য় পর্যায়" : "Phase 02",
      title: isBn ? "প্রধান পর্যটন হাব সম্প্রসারণ" : "Premier Tourist Hub Expansion",
      timeline: isBn ? "৪র্থ — ৬ষ্ঠ মাস" : "Months 4 — 6",
      items: isBn ? [
        "কক্সবাজার, সিলেট, শ্রীমঙ্গল ও সাজেক ভ্যালির সকল হোটেল ও রিসোর্ট অন্তর্ভুক্তি",
        "বাংলাদেশ ব্যাংকের অনুমোদিত ক্যাশলেস পেমেন্ট গেটওয়ে (বিকাশ/কার্ড) সংযুক্তি",
        "ট্যুরিজম ম্যাপ থেকে তাৎক্ষণিক নিকটস্থ হোটেল বুকিং ফিচার সক্রিয়করণ",
        "হোটেল মালিকদের জন্য অ্যান্টি-থেফ্ট ও রাজস্ব সুরক্ষা ড্যাশবোর্ড ট্রেনিং"
      ] : [
        "Expanding to all hotels & eco-resorts across Cox's Bazar, Sylhet & Sajek",
        "Full integration of central-bank authorized digital gateways (bKash/Cards)",
        "Activating Tourist Spot → Nearby Verified Hotels instant discovery",
        "Conducting host workshops on anti-theft revenue protection ledgers"
      ]
    },
    {
      phase: isBn ? "৩য় পর্যায়" : "Phase 03",
      title: isBn ? "দেশব্যাপী ৬৪ জেলায় জাতীয় বিস্তার" : "Nationwide 64-District Rollout",
      timeline: isBn ? "৭ম — ১২তম মাস" : "Months 7 — 12",
      items: isBn ? [
        "বাংলাদেশের ৬৪টি জেলার সকল বাণিজ্যিক ও বাজেট হোটেলের সেন্ট্রাল ডেটাবেজ",
        "মন্ত্রণালয় ও পর্যটন কর্পোরেশনের জন্য সেন্ট্রাল রেগুলেটরি তদারকি পোর্টাল",
        "আন্তর্জাতিক পর্যটকদের জন্য বহুভাষিক ইন্টারফেস ও বৈদেশিক মুদ্রা চ্যানেল",
        "জাতীয় পর্যটন প্রচারণায় সরকারি আনুষ্ঠানিক অংশীদারিত্ব ও সচেতনতা ড্রাইভ"
      ] : [
        "Comprehensive database mapping across all 64 districts of Bangladesh",
        "Deploying the dedicated Ministry & BPC regulatory oversight dashboard",
        "Multi-currency & multi-lingual channels for incoming foreign tourists",
        "Official national tourism campaign backing across all state media"
      ]
    },
    {
      phase: isBn ? "৪র্থ পর্যায়" : "Phase 04",
      title: isBn ? "এআই ইনসাইটস ও জাতীয় পলিসি ইঞ্জিন" : "AI Tourism Intelligence & Policy",
      timeline: isBn ? "১৩তম মাস+" : "Month 13 Onwards",
      items: isBn ? [
        "মৌসুমি পর্যটন চাহিদা পূর্বাভাস ও হোটেল অকুপেন্সি প্রেডিক্টিভ এআই",
        "পরিবেশবান্ধব ইকোট্যুরিজম পলিসি প্রণয়নে সরকারকে বেনামে ডেটা সরবরাহ",
        "স্মার্ট হসপিটালিটি ইনফ্রাস্ট্রাকচারে আঞ্চলিক বিনিয়োগ সম্ভাবনা ম্যাপিং",
        "ক্যাশলেস স্মার্ট বাংলাদেশ ২০৪১ রূপকল্পের টেকসই মাইলফলক অর্জন"
      ] : [
        "AI-driven seasonal demand forecasting & room occupancy analytics",
        "Anonymized aggregate hospitality intelligence for national policy formulation",
        "Regional infrastructure investment opportunity heatmaps",
        "Serving as benchmark DPI for Cashless Smart Bangladesh 2041"
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-[#060911] text-slate-100 flex flex-col justify-between selection:bg-emerald-500 selection:text-black">
      
      {/* Universal Header */}
      <Header />

      {/* ═══════════════════════════════════════════════════
          OFFICIAL INSTITUTIONAL TOP BAR
      ═══════════════════════════════════════════════════ */}
      <div className="bg-[#090D18]/95 border-b border-slate-800/80 sticky top-16 z-40 backdrop-blur-xl px-4 py-2.5 shadow-md">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3 text-xs">
          
          <div className="flex items-center gap-3">
            <Link
              to="/"
              className="inline-flex items-center gap-1.5 font-semibold text-slate-300 hover:text-white bg-slate-900 px-3 py-1.5 rounded-xl border border-slate-800 transition-colors shadow-xs"
            >
              <ArrowLeft className="w-3.5 h-3.5 text-emerald-400" />
              <span>{isBn ? "হোম" : "Home"}</span>
            </Link>

            <div className="h-4 w-px bg-slate-800 hidden sm:block" />

            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="font-bold text-slate-200">
                {isBn 
                  ? "গণপ্রজাতন্ত্রী বাংলাদেশ সরকার • বেসামরিক বিমান পরিবহন ও পর্যটন মন্ত্রণালয় প্রস্তাবিত উদ্যোগ" 
                  : "Govt of Bangladesh • Ministry of Civil Aviation & Tourism Proposed Initiative"}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Launch Slide Deck Modal Trigger */}
            <button
              onClick={() => setShowPitchModal(true)}
              className="px-3 py-1.5 rounded-xl text-xs font-bold bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 transition-all flex items-center gap-1.5 shadow-xs"
              title="View the 21-Slide Executive Deck"
            >
              <Monitor className="w-3.5 h-3.5" />
              <span>{isBn ? "প্রেজেন্টেশন ডেক (২১ স্লাইড)" : "Pitch Deck Mode (21 Slides)"}</span>
            </button>

            {/* Print/Save Document */}
            <button
              onClick={() => window.print()}
              className="p-1.5 rounded-xl border border-slate-800 bg-slate-900 hover:bg-slate-800 text-slate-300 transition-colors"
              title="Print Document"
            >
              <Printer className="w-3.5 h-3.5" />
            </button>

            {/* Language Switcher */}
            <button
              onClick={toggleLanguage}
              className="px-2.5 py-1.5 rounded-xl text-xs font-bold border border-slate-800 bg-slate-900 hover:bg-slate-800 text-slate-200 transition-colors flex items-center gap-1.5"
            >
              <Globe className="w-3.5 h-3.5 text-emerald-400" />
              <span>{isBn ? "English" : "বাংলা"}</span>
            </button>
          </div>

        </div>
      </div>

      <main className="flex-1">
        
        {/* ═══════════════════════════════════════════════════
            HERO SECTION: NATIONAL DIGITAL HOSPITALITY INITIATIVE
        ═══════════════════════════════════════════════════ */}
        <section className="relative pt-12 pb-20 px-4 md:px-6 overflow-hidden border-b border-slate-800/80">
          {/* Ambient Glows */}
          <div className="absolute top-0 left-1/4 w-[36rem] h-[36rem] bg-emerald-500/10 rounded-full blur-[140px] pointer-events-none" />
          <div className="absolute bottom-0 right-1/4 w-[36rem] h-[36rem] bg-teal-500/10 rounded-full blur-[140px] pointer-events-none" />

          <div className="max-w-7xl mx-auto relative z-10">
            
            {/* Top Badge */}
            <div className="flex flex-wrap items-center gap-2 mb-6">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 text-xs font-bold uppercase tracking-wider shadow-sm">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>
                  {isBn 
                    ? "জাতীয় ডিজিটাল পাবলিক ইনফ্রাস্ট্রাকচার (DPI) প্রস্তাবনা" 
                    : "National Digital Public Infrastructure (DPI) Initiative"}
                </span>
              </div>

              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-900 border border-slate-800 text-slate-400 text-xs font-medium">
                <Building2 className="w-3.5 h-3.5 text-emerald-400" />
                <span>
                  {isBn 
                    ? "সহযোগিতায়: বেসামরিক বিমান পরিবহন ও পর্যটন মন্ত্রণালয় + বিপিসি" 
                    : "In Alliance: Civil Aviation & Tourism Ministry + BPC"}
                </span>
              </div>
            </div>

            {/* Main Title & Value Prop */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
              
              <div className="lg:col-span-8">
                <h1 className="text-4xl sm:text-6xl md:text-7xl font-black text-white tracking-tight leading-[1.08]">
                  {isBn ? (
                    <>
                      বাংলাদেশের সমন্বিত <br />
                      <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400">
                        জাতীয় হোটেল ও পর্যটন
                      </span> ডিজিটাল প্ল্যাটফর্ম
                    </>
                  ) : (
                    <>
                      National Digital <br />
                      <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400">
                        Hospitality & Tourism
                      </span> Infrastructure
                    </>
                  )}
                </h1>

                <p className="text-base sm:text-lg md:text-xl text-slate-300 mt-6 leading-relaxed max-w-3xl font-normal">
                  {isBn
                    ? "সাধারণ নাগরিক, দেশি-বিদেশি পর্যটক, ভেরিফায়েড হোটেল মালিক এবং বাংলাদেশ সরকারের পর্যটন দপ্তরকে এক ছাতার নিচে নিয়ে আসার জন্য একটি উন্মুক্ত, স্বচ্ছ ও নিরাপদ ডিজিটাল প্ল্যাটফর্ম।"
                    : "A transparent, secure, and unified national digital gateway connecting citizens, foreign tourists, verified hoteliers, and regulatory authorities under one trusted ecosystem."}
                </p>

                {/* Primary Action Buttons */}
                <div className="mt-8 flex flex-wrap items-center gap-4">
                  <a
                    href="#stakeholder-matrix"
                    className="px-6 py-3.5 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-black text-sm transition-all flex items-center gap-2 shadow-lg shadow-emerald-500/25 active:scale-95"
                  >
                    <span>{isBn ? "প্ল্যাটফর্মের মূল সুবিধা ও কাঠামো" : "Explore Strategic Matrix"}</span>
                    <ArrowRight className="w-4 h-4" />
                  </a>

                  <button
                    onClick={() => setShowPitchModal(true)}
                    className="px-6 py-3.5 rounded-2xl bg-slate-900/90 hover:bg-slate-800 text-white font-bold text-sm border border-slate-700/80 transition-all flex items-center gap-2 active:scale-95 shadow-md"
                  >
                    <Monitor className="w-4 h-4 text-emerald-400" />
                    <span>{isBn ? "এক্সিকিউটিভ ডেক দেখুন (২১ স্লাইড)" : "View Executive Pitch Deck"}</span>
                  </button>

                  <Link
                    to="/hotels"
                    className="px-5 py-3.5 rounded-2xl bg-slate-900/60 hover:bg-slate-800/80 text-slate-300 hover:text-white font-semibold text-sm border border-slate-800 transition-all flex items-center gap-2"
                  >
                    <Compass className="w-4 h-4 text-slate-400" />
                    <span>{isBn ? "লাইভ হোটেল পোর্টাল" : "Search Live Stays"}</span>
                  </Link>
                </div>
              </div>

              {/* National Target Card */}
              <div className="lg:col-span-4 bg-gradient-to-br from-[#0F1626] to-[#0A0E18] border border-slate-800/90 rounded-3xl p-6 shadow-2xl relative">
                <div className="flex items-center justify-between pb-4 border-b border-slate-800">
                  <div>
                    <span className="text-[10px] font-black uppercase text-emerald-400 tracking-wider">
                      {isBn ? "প্রকল্প পরিচিতি" : "Project Identity"}
                    </span>
                    <h3 className="text-2xl font-black text-white">
                      Stay<span className="text-emerald-400">BD</span>
                    </h3>
                  </div>
                  <span className="px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-extrabold">
                    {isBn ? "স্মার্ট বাংলাদেশ ২০৪১" : "Smart BD 2041"}
                  </span>
                </div>

                <div className="py-4 space-y-3 text-xs text-slate-300">
                  <div className="flex items-start gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    <span>{isBn ? "৬৪ জেলার সকল অনুমোদিত হোটেল ও কটেজ কভারেজ" : "Full 64-district verified accommodation coverage"}</span>
                  </div>
                  <div className="flex items-start gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    <span>{isBn ? "দালাল ও মধ্যস্বত্বভোগী ছাড়া শতভাগ স্বচ্ছ নির্ধারিত ভাড়া" : "Zero middlemen markups with audited fair pricing"}</span>
                  </div>
                  <div className="flex items-start gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    <span>{isBn ? "হোটেল ম্যানেজারের চুরি রোধে লাইভ ইনভেন্টরি লেজার" : "Anti-theft inventory ledger stopping revenue leaks"}</span>
                  </div>
                  <div className="flex items-start gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    <span>{isBn ? "সরকারি কোষাগারের ওপর কোনো প্রকার আর্থিক চাপ নেই" : "Zero recurring fiscal burden on the state exchequer"}</span>
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
                  <span>{isBn ? "ভিত্তি কাঠামো:" : "Core Standard:"}</span>
                  <span className="text-emerald-400 font-bold">{isBn ? "ডিজিটাল পাবলিক ইনফ্রাস্ট্রাকচার" : "Public Digital Infrastructure"}</span>
                </div>
              </div>

            </div>

            {/* 4 Live Impact KPI Highlights */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-12">
              <div className="bg-[#0B0F1A] border border-slate-800/80 rounded-2xl p-5 text-left">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-1">
                  {isBn ? "জাতীয় পরিসর" : "National Reach"}
                </span>
                <div className="text-2xl sm:text-3xl font-black text-white">
                  {isBn ? "৬৪ জেলা" : "64 Districts"}
                </div>
                <p className="text-xs text-slate-400 mt-1">
                  {isBn ? "দেশব্যাপী সম্পূর্ণ কভারেজ পরিকল্পনা" : "Complete nationwide coverage"}
                </p>
              </div>

              <div className="bg-[#0B0F1A] border border-slate-800/80 rounded-2xl p-5 text-left">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-1">
                  {isBn ? "ভাড়া স্বচ্ছতা" : "Rate Transparency"}
                </span>
                <div className="text-2xl sm:text-3xl font-black text-emerald-400">
                  {isBn ? "১০০% স্বচ্ছ" : "100% Direct"}
                </div>
                <p className="text-xs text-slate-400 mt-1">
                  {isBn ? "কোনো লুকানো বা অতিরিক্ত ফি নেই" : "Zero hidden broker commissions"}
                </p>
              </div>

              <div className="bg-[#0B0F1A] border border-slate-800/80 rounded-2xl p-5 text-left">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-1">
                  {isBn ? "বিশ্বস্ততা নিশ্চিতকরণ" : "Trust Architecture"}
                </span>
                <div className="text-2xl sm:text-3xl font-black text-white">
                  {isBn ? "৪-স্তর যাচাই" : "4-Tier Audit"}
                </div>
                <p className="text-xs text-slate-400 mt-1">
                  {isBn ? "ট্রেড লাইসেন্স ও জিপিএস ভেরিফিকেশন" : "NID, Trade License & Satellite GPS"}
                </p>
              </div>

              <div className="bg-[#0B0F1A] border border-slate-800/80 rounded-2xl p-5 text-left">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-1">
                  {isBn ? "সরকারি পরিচালন ব্যয়" : "Exchequer Cost"}
                </span>
                <div className="text-2xl sm:text-3xl font-black text-emerald-400">
                  {isBn ? "৳ ০ (শূন্য)" : "৳ 0 Burden"}
                </div>
                <p className="text-xs text-slate-400 mt-1">
                  {isBn ? "স্বনির্ভর SaaS সাবস্ক্রিপশন মডেল" : "Self-sustaining operational model"}
                </p>
              </div>
            </div>

          </div>
        </section>

        {/* ═══════════════════════════════════════════════════
            SECTION 2: INTERACTIVE MULTI-STAKEHOLDER MATRIX
        ═══════════════════════════════════════════════════ */}
        <section id="stakeholder-matrix" className="py-20 px-4 md:px-6 bg-[#070B14] border-b border-slate-800/80">
          <div className="max-w-7xl mx-auto">
            
            <div className="text-center max-w-3xl mx-auto mb-12">
              <span className="text-xs font-black uppercase text-emerald-400 tracking-wider">
                {isBn ? "বহুমাত্রিক অংশীজন সুবিধা" : "Multi-Stakeholder Framework"}
              </span>
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-white tracking-tight mt-2">
                {isBn 
                  ? "সকলের জন্য সমান নির্ভরযোগ্য ও স্বচ্ছ সমাধান" 
                  : "Empowering Every Stakeholder in Tourism"}
              </h2>
              <p className="text-slate-400 text-sm sm:text-base mt-3">
                {isBn
                  ? "সাধারণ নাগরিকের বাজেট ভ্রমণ থেকে শুরু করে হোটেল মালিকদের রাজস্ব সুরক্ষা এবং সরকারের জাতীয় নীতি নির্ধারণ—একই প্ল্যাটফর্মে সমন্বিত।"
                  : "From low-budget citizens and luxury travelers to hotel owners and state regulators—served seamlessly on one integrated infrastructure."}
              </p>
            </div>

            {/* 4 Stakeholder Tabs */}
            <div className="flex flex-wrap items-center justify-center gap-2 mb-10">
              {[
                { id: "citizens", labelEn: "Citizens & Travelers", labelBn: "নাগরিক ও পর্যটক", icon: Users },
                { id: "hotels", labelEn: "Hotel Owners & Hosts", labelBn: "হোটেল মালিক ও অপারেটর", icon: Building2 },
                { id: "government", labelEn: "Government & Regulators", labelBn: "সরকার ও প্রশাসন", icon: Landmark },
                { id: "economy", labelEn: "National Digital Economy", labelBn: "জাতীয় ডিজিটাল অর্থনীতি", icon: Briefcase },
              ].map((tab) => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as any)}
                    className={`px-5 py-3 rounded-2xl text-xs sm:text-sm font-bold transition-all flex items-center gap-2 border ${
                      isActive
                        ? "bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 border-emerald-400 shadow-lg shadow-emerald-500/20 font-black"
                        : "bg-slate-900/80 text-slate-400 hover:text-white border-slate-800 hover:bg-slate-800"
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{isBn ? tab.labelBn : tab.labelEn}</span>
                  </button>
                );
              })}
            </div>

            {/* Tab Content Panes */}
            <div className="bg-[#0B0F19] border border-slate-800/90 rounded-3xl p-6 sm:p-10 shadow-2xl">
              
              {/* TAB 1: Citizens */}
              {activeTab === "citizens" && (
                <div>
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-800 mb-8">
                    <div>
                      <span className="text-xs font-bold text-emerald-400 uppercase tracking-widest">
                        {isBn ? "নাগরিকের ভোগান্তিহীন সেবা" : "Frictionless Citizen Service"}
                      </span>
                      <h3 className="text-2xl font-black text-white mt-1">
                        {isBn ? "যেকোনো বাজেটে নিরাপদ ও নিশ্চিত আবাসন" : "Guaranteed Transparent Stays for Every Budget"}
                      </h3>
                    </div>
                    <Link
                      to="/hotels"
                      className="px-4 py-2 rounded-xl bg-emerald-500 text-slate-950 font-bold text-xs flex items-center gap-1.5 self-start md:self-auto hover:bg-emerald-400 transition-colors"
                    >
                      <span>{isBn ? "লাইভ হোটেল খুঁজুন" : "Find Stays Now"}</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800">
                      <div className="w-10 h-10 rounded-xl bg-blue-500/10 text-blue-400 flex items-center justify-center font-black mb-3">
                        ৳
                      </div>
                      <h4 className="text-base font-bold text-white mb-2">
                        {isBn ? "স্বচ্ছ বাজেট ফিল্টারিং (৳০ — ৳১০,০০০+)" : "Exact Budget Filtering (৳0 — ৳10,000+)"}
                      </h4>
                      <p className="text-xs text-slate-400 leading-relaxed">
                        {isBn 
                          ? "শিক্ষার্থী ও একক ভ্রমণকারীর ৳৫০০ বাজেট থেকে শুরু করে পরিবারের বিলাসবহুল ৫-স্টার স্যুট—সবার জন্য এক প্ল্যাটফর্মে তথ্যবহুল অপশন।" 
                          : "From ৳500 student budget rooms to 5-star executive suites—instant precision filtering without hidden fees."}
                      </p>
                    </div>

                    <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800">
                      <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center font-black mb-3">
                        <Check className="w-5 h-5" />
                      </div>
                      <h4 className="text-base font-bold text-white mb-2">
                        {isBn ? "রিয়েল-টাইম রুম প্রাপ্যতা ও বুকিং" : "Real-Time Room Vacancy & QR Vouchers"}
                      </h4>
                      <p className="text-xs text-slate-400 leading-relaxed">
                        {isBn 
                          ? "হোটেলের দরজায় না ঘুরে ঘরে বসেই নিশ্চিত রুম বুকিং। বুকিং সম্পন্ন হওয়ার সাথে সাথে মোবাইলে ডিজিটাল কিউআর ভাউচার প্রদান।" 
                          : "Zero walking hotel to hotel. Confirm genuine vacant rooms and receive encrypted digital QR vouchers instantly."}
                      </p>
                    </div>

                    <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800">
                      <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center font-black mb-3">
                        <Scale className="w-5 h-5" />
                      </div>
                      <h4 className="text-base font-bold text-white mb-2">
                        {isBn ? "ভোক্তা অধিকার ও ২৪ ঘণ্টা সমাধান" : "Consumer Grievance Resolution"}
                      </h4>
                      <p className="text-xs text-slate-400 leading-relaxed">
                        {isBn 
                          ? "কোনো হোটেল প্রতিশ্রুতি অনুযায়ী সেবা না দিলে বা অতিরিক্ত ভাড়া দাবি করলে সরাসরি অ্যাডমিন মধ্যস্থতা ও প্রতিকার পাওয়ার ব্যবস্থা।" 
                          : "Direct structured complaint escalation ensuring 24-hour mediation and consumer compensation mechanisms."}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 2: Hotels */}
              {activeTab === "hotels" && (
                <div>
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-800 mb-8">
                    <div>
                      <span className="text-xs font-bold text-emerald-400 uppercase tracking-widest">
                        {isBn ? "হোটেল ব্যবসায়ীদের জন্য আধুনিকায়ন" : "Modern Host Operations"}
                      </span>
                      <h3 className="text-2xl font-black text-white mt-1">
                        {isBn ? "অ্যান্টি-থেফ্ট রাজস্ব সুরক্ষা ও ডিজিটাল ইনভেন্টরি" : "Anti-Theft Revenue Security & Direct Customer Reach"}
                      </h3>
                    </div>
                    <Link
                      to="/owner-dashboard"
                      className="px-4 py-2 rounded-xl bg-emerald-500 text-slate-950 font-bold text-xs flex items-center gap-1.5 self-start md:self-auto hover:bg-emerald-400 transition-colors"
                    >
                      <span>{isBn ? "মালিকের ড্যাশবোর্ড দেখুন" : "View Host Dashboard"}</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800">
                      <div className="w-10 h-10 rounded-xl bg-purple-500/10 text-purple-400 flex items-center justify-center font-black mb-3">
                        <Layers className="w-5 h-5" />
                      </div>
                      <h4 className="text-base font-bold text-white mb-2">
                        {isBn ? "ম্যানেজারিয়াল চুরি রোধে লাইভ লেজার" : "Anti-Theft Revenue Ledger"}
                      </h4>
                      <p className="text-xs text-slate-400 leading-relaxed">
                        {isBn 
                          ? "অফলাইন বা অনলাইন সব রুম ভাড়ার ডিজিটাল হিসাব রিয়েল-টাইমে মালিকের মোবাইলে সিঙ্ক হয়। ফ্রন্ট-ডেস্কের রাজস্ব গোপন বন্ধ।" 
                          : "Every offline walk-in and online booking syncs directly to the owner's mobile. Eradicates front-desk cashier theft."}
                      </p>
                    </div>

                    <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800">
                      <div className="w-10 h-10 rounded-xl bg-cyan-500/10 text-cyan-400 flex items-center justify-center font-black mb-3">
                        <SlidersHorizontal className="w-5 h-5" />
                      </div>
                      <h4 className="text-base font-bold text-white mb-2">
                        {isBn ? "ডাইনামিক মৌসুমি মূল্য ও অফার" : "Dynamic Seasonal Pricing"}
                      </h4>
                      <p className="text-xs text-slate-400 leading-relaxed">
                        {isBn 
                          ? "ছুটির দিন বা অফ-সিজনে সহজে রুমের ভাড়া পরিবর্তন, বিশেষ প্রোমো কোড এবং ন্যূনতম স্টে পলিসি সেট করার স্বয়ংক্রিয় সুযোগ।" 
                          : "Adjust room tariffs, launch weekend discounts, and set minimum stay rules with instant cross-platform synchronization."}
                      </p>
                    </div>

                    <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800">
                      <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center font-black mb-3">
                        <Star className="w-5 h-5" />
                      </div>
                      <h4 className="text-base font-bold text-white mb-2">
                        {isBn ? "পেইড অপপ্রচারমুক্ত সুনাম সুরক্ষা" : "Protection from Fake Bad Reviews"}
                      </h4>
                      <p className="text-xs text-slate-400 leading-relaxed">
                        {isBn 
                          ? "প্রতিযোগীদের শত্রুভাবাপন্ন ফেক রিভিউ বা ব্ল্যাকমেইলিং বন্ধ। শুধুমাত্র স্টে সম্পন্ন করা ভেরিফায়েড গেস্টই রেটিং দিতে পারে।" 
                          : "Eradicates malicious smear reviews from competitor agencies. Only authenticated checked-out guests can rate."}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 3: Government */}
              {activeTab === "government" && (
                <div>
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-800 mb-8">
                    <div>
                      <span className="text-xs font-bold text-emerald-400 uppercase tracking-widest">
                        {isBn ? "জাতীয় তদারকি ও নিরাপত্তা" : "National Oversight & Security"}
                      </span>
                      <h3 className="text-2xl font-black text-white mt-1">
                        {isBn ? "স্ট্রাকচার্ড পর্যটন ডাটা ও নীতি নির্ধারণ সহায়তা" : "Structured Hospitality Data & Regulatory Visibility"}
                      </h3>
                    </div>
                    <button
                      onClick={() => setShowPitchModal(true)}
                      className="px-4 py-2 rounded-xl bg-emerald-500 text-slate-950 font-bold text-xs flex items-center gap-1.5 self-start md:self-auto hover:bg-emerald-400 transition-colors"
                    >
                      <span>{isBn ? "প্রস্তাবিত পার্টনারশিপ দেখুন" : "View Partnership Plan"}</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800">
                      <div className="w-10 h-10 rounded-xl bg-indigo-500/10 text-indigo-400 flex items-center justify-center font-black mb-3">
                        <Landmark className="w-5 h-5" />
                      </div>
                      <h4 className="text-base font-bold text-white mb-2">
                        {isBn ? "কেন্দ্রীয় নিয়ন্ত্রক তদারকি ড্যাশবোর্ড" : "Central Regulatory Oversight"}
                      </h4>
                      <p className="text-xs text-slate-400 leading-relaxed">
                        {isBn 
                          ? "মন্ত্রণালয় ও পর্যটন কর্পোরেশনের জন্য বিশেষায়িত পোর্টাল—যেখানে ৬৪ জেলার লাইভ হোটেল নিবন্ধন ও নিরাপত্তা কমপ্লায়েন্স দৃশ্যমান।" 
                          : "Dedicated portal for Civil Aviation & Tourism authorities providing live 64-district licensing and compliance oversight."}
                      </p>
                    </div>

                    <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800">
                      <div className="w-10 h-10 rounded-xl bg-teal-500/10 text-teal-400 flex items-center justify-center font-black mb-3">
                        <BarChart3 className="w-5 h-5" />
                      </div>
                      <h4 className="text-base font-bold text-white mb-2">
                        {isBn ? "নীতি নির্ধারণে প্রামাণ্য ডাটা অ্যানালিটিক্স" : "Evidence-Based Policy Intelligence"}
                      </h4>
                      <p className="text-xs text-slate-400 leading-relaxed">
                        {isBn 
                          ? "ব্যক্তিগত তথ্য সম্পূর্ণ অক্ষুণ্ণ রেখে এলাকাভিত্তিক অকুপেন্সি ও চাহিদার ট্রেন্ড বিশ্লেষণ করে নতুন পর্যটন অবকাঠামো পরিকল্পনা প্রণয়ন।" 
                          : "Privacy-safe aggregated metrics on regional room demands, seasonal influxes, and infrastructure investment requirements."}
                      </p>
                    </div>

                    <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800">
                      <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center font-black mb-3">
                        <Shield className="w-5 h-5" />
                      </div>
                      <h4 className="text-base font-bold text-white mb-2">
                        {isBn ? "আইনসম্মত নিরাপত্তা ও অতিথি সুরক্ষা" : "Legal Compliance & Guest Safety"}
                      </h4>
                      <p className="text-xs text-slate-400 leading-relaxed">
                        {isBn 
                          ? "জাতীয় পরিচয়পত্র ও ডিজিটাল ভেরিফিকেশনের মাধ্যমে বিদেশি ও দেশি অতিথিদের সর্বোচ্চ নিরাপত্তা এবং আইনি জবাবদিহিতা নিশ্চিতকরণ।" 
                          : "Standardized guest verification protocols aligned with national cyber safety and law enforcement directives."}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 4: Economy */}
              {activeTab === "economy" && (
                <div>
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-800 mb-8">
                    <div>
                      <span className="text-xs font-bold text-emerald-400 uppercase tracking-widest">
                        {isBn ? "জাতীয় অর্থনৈতিক সমৃদ্ধি" : "National Economic Impact"}
                      </span>
                      <h3 className="text-2xl font-black text-white mt-1">
                        {isBn ? "ক্যাশলেস স্মার্ট বাংলাদেশ ও স্থানীয় কর্মসংস্থান" : "Cashless Smart Economy & Decentralized Job Creation"}
                      </h3>
                    </div>
                    <Link
                      to="/experiences"
                      className="px-4 py-2 rounded-xl bg-emerald-500 text-slate-950 font-bold text-xs flex items-center gap-1.5 self-start md:self-auto hover:bg-emerald-400 transition-colors"
                    >
                      <span>{isBn ? "ট্যুরিজম অভিজ্ঞতা দেখুন" : "Explore Experiences"}</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800">
                      <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center font-black mb-3">
                        <DollarSign className="w-5 h-5" />
                      </div>
                      <h4 className="text-base font-bold text-white mb-2">
                        {isBn ? "ডিজিটাল লেনদেন ও আনুষ্ঠানিক রাজস্ব" : "Digital Transactions & Tax Formalization"}
                      </h4>
                      <p className="text-xs text-slate-400 leading-relaxed">
                        {isBn 
                          ? "বিকাশ, নগদ ও ব্যাংকিং চ্যানেলের মাধ্যমে স্বচ্ছ বুকিং লেনদেনের ফলে কালো টাকা ও রাজস্ব ফাঁকি বন্ধ হয়ে জাতীয় রাজস্ব বৃদ্ধি পায়।" 
                          : "Promotes cashless fintech transactions, bringing informal hotel revenues into the formal banking and taxation network."}
                      </p>
                    </div>

                    <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800">
                      <div className="w-10 h-10 rounded-xl bg-cyan-500/10 text-cyan-400 flex items-center justify-center font-black mb-3">
                        <Briefcase className="w-5 h-5" />
                      </div>
                      <h4 className="text-base font-bold text-white mb-2">
                        {isBn ? "গ্রামাঞ্চলে স্থানীয় কর্মসংস্থান বৃদ্ধি" : "Decentralized Regional Jobs"}
                      </h4>
                      <p className="text-xs text-slate-400 leading-relaxed">
                        {isBn 
                          ? "সাজেক, সুন্দরবন বা হাওর অঞ্চলের ছোট ছোট হোমস্টে ও কটেজ সরাসরি দেশব্যাপী কাস্টমার পাওয়ায় স্থানীয় যুবসমাজের আয় বহুগুণ বাড়ে।" 
                          : "Empowers remote community homestays and regional eco-lodges with direct visibility, driving local tourism employment."}
                      </p>
                    </div>

                    <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800">
                      <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center font-black mb-3">
                        <Globe className="w-5 h-5" />
                      </div>
                      <h4 className="text-base font-bold text-white mb-2">
                        {isBn ? "আন্তর্জাতিক ভাবমূর্তি ও পর্যটন আকর্ষণ" : "Global Credibility & Inbound Tourism"}
                      </h4>
                      <p className="text-xs text-slate-400 leading-relaxed">
                        {isBn 
                          ? "একটি আধুনিক, স্বচ্ছ ও নিরাপদ জাতীয় হোটেল বুকিং পোর্টাল বিদেশি পর্যটকদের কাছে বাংলাদেশের পর্যটনকে অত্যন্ত আকর্ষণীয় করে তোলে।" 
                          : "A modern, authenticated national hotel discovery platform drastically increases trust among international travelers visiting Bangladesh."}
                      </p>
                    </div>
                  </div>
                </div>
              )}

            </div>

          </div>
        </section>

        {/* ═══════════════════════════════════════════════════
            SECTION 3: 4-TIER VERIFICATION & TRUST ENGINE
        ═══════════════════════════════════════════════════ */}
        <section className="py-20 px-4 md:px-6 bg-[#060911] border-b border-slate-800/80">
          <div className="max-w-7xl mx-auto">
            
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
              <div>
                <span className="text-xs font-black uppercase text-emerald-400 tracking-wider">
                  {isBn ? "ভেরিফিকেশন ও বিশ্বাসযোগ্যতা" : "Verification & Trust Engine"}
                </span>
                <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-white tracking-tight mt-2">
                  {isBn 
                    ? "ভুয়া তথ্য ও প্রতারণামুক্ত ৪-স্তর সুরক্ষা ব্যবস্থা" 
                    : "4-Tier Architecture Eradicating Hospitality Fraud"}
                </h2>
              </div>
              <div className="text-xs font-semibold text-slate-400 max-w-md">
                {isBn 
                  ? "ভুয়া হোটেল প্রোফাইল, ফেক রিভিউ এবং অতিরিক্ত ভাড়া আদায় বন্ধে মাল্টি-লেয়ার ডিজিটাল ভেরিফিকেশন।" 
                  : "A military-grade trust pipeline verifying hosts before registration, during live operations, and post-stay."}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {TRUST_TIERS.map((tier, idx) => {
                const Icon = tier.icon;
                const isSelected = activeTier === idx;
                return (
                  <motion.div
                    key={tier.number}
                    onClick={() => setActiveTier(idx)}
                    whileHover={{ y: -4 }}
                    className={`rounded-3xl p-6 border transition-all cursor-pointer flex flex-col justify-between ${
                      isSelected
                        ? "bg-gradient-to-b from-slate-900 to-slate-950 border-emerald-500/80 shadow-xl shadow-emerald-500/10 ring-1 ring-emerald-500/30"
                        : "bg-[#0A0E18] border-slate-800/80 hover:border-slate-700"
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between mb-5">
                        <span className={`text-xs font-black px-2.5 py-1 rounded-lg ${
                          isSelected ? "bg-emerald-500 text-slate-950" : "bg-slate-800 text-slate-400"
                        }`}>
                          TIER {tier.number}
                        </span>
                        <div className="w-10 h-10 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center text-emerald-400">
                          <Icon className="w-5 h-5" />
                        </div>
                      </div>

                      <h3 className="text-base font-bold text-white mb-2 leading-snug">
                        {isBn ? tier.titleBn : tier.titleEn}
                      </h3>

                      <p className="text-xs text-slate-400 leading-relaxed mb-4">
                        {isBn ? tier.descBn : tier.descEn}
                      </p>
                    </div>

                    <div className="pt-4 border-t border-slate-800/80 mt-2">
                      <span className="text-[10px] font-bold text-emerald-400 block uppercase tracking-wider">
                        {isBn ? tier.badgeBn : tier.badgeEn}
                      </span>
                      <span className="text-xs font-extrabold text-slate-200 mt-0.5 block">
                        {isBn ? tier.statBn : tier.statEn}
                      </span>
                    </div>
                  </motion.div>
                );
              })}
            </div>

            {/* Security-by-Design Compliance Strip */}
            <div className="mt-10 p-6 rounded-3xl bg-[#0B0F19] border border-slate-800 flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shrink-0">
                  <Lock className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="text-sm md:text-base font-bold text-white">
                    {isBn ? "ডেটা প্রাইভেসি ও সাইবার নিরাপত্তা আইন ২০২৩ অনুসরণ" : "Cyber Security & Data Privacy Compliance"}
                  </h4>
                  <p className="text-xs text-slate-400 mt-0.5 max-w-2xl">
                    {isBn 
                      ? "প্রয়োজনের অতিরিক্ত ব্যক্তিগত তথ্য সংগ্রহ নয় • এন্ড-টু-এন্ড এনক্রিপশন • বাংলাদেশ ডিজিটাল নিরাপত্তা বিধি ও আন্তর্জাতিক কমপ্লায়েন্স অনুসরণ।" 
                      : "Minimum necessary data collection • 256-Bit SSL Encryption • Full adherence to Bangladesh Cyber Security Act 2023 & global privacy standards."}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <span className="text-[11px] font-mono px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-300">
                  {isBn ? "২৫৬-বিট এনক্রিপশন" : "256-Bit SSL"}
                </span>
                <span className="text-[11px] font-semibold px-3 py-1.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400">
                  {isBn ? "আইনসম্মত সম্মতি" : "Consent-Based"}
                </span>
              </div>
            </div>

          </div>
        </section>

        {/* ═══════════════════════════════════════════════════
            SECTION 4: 5 ECOLOGICAL TOURISM ZONES
        ═══════════════════════════════════════════════════ */}
        <section className="py-20 px-4 md:px-6 bg-[#070B14] border-b border-slate-800/80">
          <div className="max-w-7xl mx-auto">
            
            <div className="text-center max-w-3xl mx-auto mb-12">
              <span className="text-xs font-black uppercase text-emerald-400 tracking-wider">
                {isBn ? "বাংলাদেশ পর্যটন মানচিত্র" : "Explore Bangladesh — 5 Ecological Zones"}
              </span>
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-white tracking-tight mt-2">
                {isBn 
                  ? "পর্যটন অঞ্চল থেকে সরাসরি নিকটস্থ হোটেল অনুসন্ধান" 
                  : "Seamless Spot-to-Stay Discovery"}
              </h2>
              <p className="text-slate-400 text-sm sm:text-base mt-3">
                {isBn
                  ? "দেশের ৫টি প্রধান ইকোলজিক্যাল জোনের প্রতিটি স্পটের সাথে যাচাইকৃত হোটেল ও কটেজ যুক্ত করা হয়েছে।"
                  : "Every scenic destination across all 5 ecological zones is mapped directly to verified, transparent accommodations."}
              </p>
            </div>

            {/* Zone Selector Pills */}
            <div className="flex flex-wrap items-center justify-center gap-2 mb-10">
              {TOURISM_ZONES.map((zone, idx) => {
                const Icon = zone.icon;
                const isSelected = activeZone === idx;
                return (
                  <button
                    key={zone.nameEn}
                    onClick={() => setActiveZone(idx)}
                    className={`px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-bold transition-all flex items-center gap-2 border ${
                      isSelected
                        ? "bg-slate-900 border-emerald-500 text-white shadow-lg shadow-emerald-500/10 ring-1 ring-emerald-500"
                        : "bg-slate-900/60 border-slate-800 text-slate-400 hover:text-white"
                    }`}
                  >
                    <Icon className={`w-4 h-4 ${isSelected ? "text-emerald-400" : "text-slate-500"}`} />
                    <span>{isBn ? zone.nameBn : zone.nameEn}</span>
                  </button>
                );
              })}
            </div>

            {/* Active Zone Interactive Showcase Card */}
            {(() => {
              const currentZone = TOURISM_ZONES[activeZone];
              const Icon = currentZone.icon;
              return (
                <div className="bg-[#0B0F19] border border-slate-800 rounded-3xl p-6 sm:p-10 shadow-2xl grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
                  
                  <div className="lg:col-span-7">
                    <div className="flex items-center gap-3 mb-4">
                      <div className={`w-12 h-12 rounded-2xl ${currentZone.bg} ${currentZone.accent} flex items-center justify-center`}>
                        <Icon className="w-6 h-6" />
                      </div>
                      <div>
                        <span className={`text-[11px] font-black uppercase tracking-wider ${currentZone.accent}`}>
                          {isBn ? currentZone.tagBn : currentZone.tagEn}
                        </span>
                        <h3 className="text-2xl sm:text-3xl font-black text-white">
                          {isBn ? currentZone.nameBn : currentZone.nameEn}
                        </h3>
                      </div>
                    </div>

                    <p className="text-sm sm:text-base text-slate-300 leading-relaxed mb-6 font-normal">
                      {isBn ? currentZone.descBn : currentZone.descEn}
                    </p>

                    <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 mb-6">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                        {isBn ? "প্রধান দর্শনীয় স্থানসমূহ:" : "Prominent Destinations Covered:"}
                      </span>
                      <div className="text-xs sm:text-sm font-semibold text-white">
                        {isBn ? currentZone.spotsBn : currentZone.spotsEn}
                      </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-3">
                      <button
                        onClick={() => navigate(`/hotels?destination=${encodeURIComponent(currentZone.destinationQuery)}`)}
                        className="px-6 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs transition-all flex items-center gap-2 shadow-lg shadow-emerald-500/20 active:scale-95"
                      >
                        <span>{isBn ? "এই জোনের যাচাইকৃত হোটেল দেখুন" : "Explore Verified Hotels"}</span>
                        <ArrowRight className="w-4 h-4" />
                      </button>

                      <Link
                        to="/tourism-map"
                        className="px-5 py-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 font-semibold text-xs border border-slate-800 transition-colors flex items-center gap-1.5"
                      >
                        <Compass className="w-4 h-4 text-emerald-400" />
                        <span>{isBn ? "ইন্টারেক্টিভ মানচিত্র খুলুন" : "Open Tourism Map"}</span>
                      </Link>
                    </div>
                  </div>

                  <div className="lg:col-span-5 bg-slate-900/70 border border-slate-800 rounded-2xl p-6 text-left">
                    <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-widest block mb-2">
                      {isBn ? "লাইভ ইনভেন্টরি স্ট্যাটাস" : "Live Inventory Status"}
                    </span>
                    <div className="text-3xl font-black text-white mb-2">
                      {isBn ? currentZone.hotelsCountBn : currentZone.hotelsCount}
                    </div>
                    <p className="text-xs text-slate-400 leading-relaxed mb-4">
                      {isBn 
                        ? "ট্রেড লাইসেন্স ও স্যাটেলাইট মানচিত্র যাচাই সাপেক্ষে প্ল্যাটফর্মে যুক্ত। প্রতিটি রুমের জন্য রিয়েল-টাইম প্রাপ্যতা দৃশ্যমান।" 
                        : "Geotagged & verified under the national trust framework. Real-time availability refreshed dynamically."}
                    </p>

                    <div className="space-y-2 pt-4 border-t border-slate-800 text-xs text-slate-300">
                      <div className="flex items-center justify-between">
                        <span>{isBn ? "বাজেট সীমা:" : "Budget Range:"}</span>
                        <span className="font-bold text-white">{isBn ? "৳৫০০ — ৳১২,০০০/রাত" : "৳500 — ৳12,000/night"}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span>{isBn ? "বুকিং নিশ্চয়তা:" : "Booking Confirmation:"}</span>
                        <span className="font-bold text-emerald-400">{isBn ? "তাৎক্ষণিক ডিজিটাল ভাউচার" : "Instant QR Mobile Voucher"}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span>{isBn ? "দালাল কমিশন:" : "Middleman Fees:"}</span>
                        <span className="font-bold text-emerald-400">{isBn ? "০% (সম্পূর্ণ নির্মূল)" : "0% (Eliminated)"}</span>
                      </div>
                    </div>
                  </div>

                </div>
              );
            })()}

          </div>
        </section>

        {/* ═══════════════════════════════════════════════════
            SECTION 5: 4-PHASE NATIONAL ROLLOUT ROADMAP
        ═══════════════════════════════════════════════════ */}
        <section className="py-20 px-4 md:px-6 bg-[#060911] border-b border-slate-800/80">
          <div className="max-w-7xl mx-auto">
            
            <div className="text-center max-w-3xl mx-auto mb-14">
              <span className="text-xs font-black uppercase text-emerald-400 tracking-wider">
                {isBn ? "বাস্তবায়ন পরিকল্পনা" : "National Rollout Roadmap"}
              </span>
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-white tracking-tight mt-2">
                {isBn ? "৪-ধাপে দেশব্যাপী বাস্তবায়ন ও সম্প্রসারণ" : "4-Phase Nationwide Execution Strategy"}
              </h2>
              <p className="text-slate-400 text-sm sm:text-base mt-3">
                {isBn
                  ? "আগে নির্ভরযোগ্যতা যাচাই ও ছোট পরিসরে ট্রায়াল, পরবর্তীতে সারাদেশে পর্যায়ক্রমিক স্কেলিং।"
                  : "Prioritizing reliability and legal compliance in pilot trials first, followed by rapid 64-district scale."}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {ROLLOUT_PHASES.map((phaseItem, idx) => (
                <div
                  key={idx}
                  className="bg-[#0B0F19] border border-slate-800/80 rounded-3xl p-6 flex flex-col justify-between hover:border-slate-700 transition-all shadow-xl"
                >
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-xs font-extrabold text-emerald-400 bg-emerald-500/10 border border-emerald-500/30 px-3 py-1 rounded-lg">
                        {phaseItem.phase}
                      </span>
                      <span className="text-[11px] font-semibold text-slate-400">
                        {phaseItem.timeline}
                      </span>
                    </div>

                    <h3 className="text-base font-bold text-white mb-4">
                      {phaseItem.title}
                    </h3>

                    <ul className="space-y-2.5 text-xs text-slate-300">
                      {phaseItem.items.map((it, i) => (
                        <li key={i} className="flex items-start gap-2">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                          <span className="leading-relaxed">{it}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="pt-4 border-t border-slate-800/80 mt-6 text-[11px] text-slate-500 font-semibold">
                    {isBn ? `পর্যায় ০${idx + 1} মাইলফলক` : `Stage 0${idx + 1} Deliverables`}
                  </div>
                </div>
              ))}
            </div>

          </div>
        </section>

        {/* ═══════════════════════════════════════════════════
            SECTION 6: SUSTAINABLE FINANCIAL ARCHITECTURE
        ═══════════════════════════════════════════════════ */}
        <section className="py-20 px-4 md:px-6 bg-[#070B14] border-b border-slate-800/80">
          <div className="max-w-7xl mx-auto">
            
            <div className="max-w-3xl mx-auto text-center mb-14">
              <span className="text-xs font-black uppercase text-emerald-400 tracking-wider">
                {isBn ? "টেকসই ব্যবসায়িক কাঠামো" : "Fiscal & Sustainability Model"}
              </span>
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-white tracking-tight mt-2">
                {isBn 
                  ? "সরকারি কোষাগারের ওপর শূন্য চাপ—সম্পূর্ণ স্বনির্ভর" 
                  : "Zero Recurring Exchequer Cost"}
              </h2>
              <p className="text-slate-400 text-sm sm:text-base mt-3">
                {isBn
                  ? "জনকল্যাণমুখী ডিজিটাল পাবলিক প্ল্যাটফর্ম হওয়া সত্ত্বেও এর অপারেশনাল খরচ সম্পূর্ণ নিজস্ব বাণিজ্যিক রাজস্ব থেকে নির্বাহ হবে।"
                  : "Engineered as a public-interest digital utility that funds all recurring infrastructure through private hospitality subscriptions."}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
              <div className="bg-[#0B0F19] border border-slate-800 rounded-3xl p-6 sm:p-8">
                <div className="w-12 h-12 rounded-2xl bg-blue-500/10 text-blue-400 flex items-center justify-center font-black mb-5">
                  <Building2 className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-white mb-2">
                  {isBn ? "হোটেল SaaS সাবস্ক্রিপশন" : "Hotelier SaaS Subscription"}
                </h3>
                <p className="text-xs text-slate-300 leading-relaxed mb-4">
                  {isBn 
                    ? "হোটেলগুলো তাদের ইনভেন্টরি ম্যানেজমেন্ট, বুকিং ড্যাশবোর্ড, কিউআর চেক-ইন ও অ্যানালিটিক্স ব্যবহারের জন্য নির্ধারিত সুলভ মাসিক/বাৎসরিক ফি প্রদান করবে।" 
                    : "Hotels pay affordable tiered monthly/annual fees for the inventory ledger, front-desk QR management, and occupancy analytics."}
                </p>
                <div className="text-[11px] font-semibold text-blue-400 bg-blue-500/10 p-2.5 rounded-xl border border-blue-500/20">
                  {isBn ? "মূল অপারেশনাল ব্যয় নির্বাহক" : "Primary Recurring Revenue Pillar"}
                </div>
              </div>

              <div className="bg-[#0B0F19] border border-slate-800 rounded-3xl p-6 sm:p-8">
                <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center font-black mb-5">
                  <Landmark className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-white mb-2">
                  {isBn ? "সরকারি প্রাতিষ্ঠানিক প্রচার সহায়তা" : "State Promotional Backing"}
                </h3>
                <p className="text-xs text-slate-300 leading-relaxed mb-4">
                  {isBn 
                    ? "কোনো আর্থিক অনুদানের প্রয়োজন নেই। বেসামরিক বিমান পরিবহন ও পর্যটন মন্ত্রণালয় এবং বিপিসি কেবল আনুষ্ঠানিক প্রচার ও সচেতনতা অভিযানে সহায়তা করবে।" 
                    : "Requires zero state subsidies. The Ministry & BPC provide institutional endorsement and awareness campaign channels."}
                </p>
                <div className="text-[11px] font-semibold text-emerald-400 bg-emerald-500/10 p-2.5 rounded-xl border border-emerald-500/20">
                  {isBn ? "শূন্য সরকারি আর্থিক ব্যয়" : "Zero Exchequer Burden"}
                </div>
              </div>

              <div className="bg-[#0B0F19] border border-slate-800 rounded-3xl p-6 sm:p-8">
                <div className="w-12 h-12 rounded-2xl bg-amber-500/10 text-amber-400 flex items-center justify-center font-black mb-5">
                  <CreditCard className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-white mb-2">
                  {isBn ? "স্বচ্ছ ডিজিটাল লেনদেন ফি" : "Modest Booking Fee"}
                </h3>
                <p className="text-xs text-slate-300 leading-relaxed mb-4">
                  {isBn 
                    ? "অনলাইন বুকিংয়ের ক্ষেত্রে আন্তর্জাতিক ওটিএগুলোর ২০-২৫% উচ্চ Commissions-এর বিপরীতে মাত্র ১-২% অতি পরিমিত গেটওয়ে ফি—যা হোটেল মালিক ও পর্যটক উভয়ের জন্য লাভজনক।" 
                    : "Unlike predatory 20–25% fees charged by foreign OTAs, StayBD leverages a modest 1–2% fee solely covering gateway & security costs."}
                </p>
                <div className="text-[11px] font-semibold text-amber-400 bg-amber-500/10 p-2.5 rounded-xl border border-amber-500/20">
                  {isBn ? "ন্যায্য ও জনবান্ধব হার" : "Pro-Consumer & Pro-Hotelier"}
                </div>
              </div>
            </div>

          </div>
        </section>

        {/* ═══════════════════════════════════════════════════
            SECTION 7: INSTITUTIONAL COLLABORATION & ACTION
        ═══════════════════════════════════════════════════ */}
        <section className="py-20 px-4 md:px-6 bg-[#060911]">
          <div className="max-w-7xl mx-auto">
            
            <div className="bg-gradient-to-br from-[#0F1626] via-[#0B0F1A] to-[#080B12] border border-slate-800 rounded-3xl p-8 sm:p-12 shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/5 rounded-full blur-[140px] pointer-events-none" />

              <div className="relative z-10">
                <div className="flex flex-wrap items-center gap-2 mb-4">
                  <span className="px-3 py-1 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 text-xs font-black uppercase tracking-wider">
                    {isBn ? "প্রস্তাবিত আনুষ্ঠানিক সমঝোতা স্মারক (MoU)" : "Proposed Institutional Action Framework"}
                  </span>
                </div>

                <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-white tracking-tight leading-tight">
                  {isBn 
                    ? "বাংলাদেশ সরকারের নিকট প্রস্তাবিত সহযোগিতা ও নীতিগত অনুমোদন" 
                    : "Institutional Partnership & Regulatory Authorization Request"}
                </h2>

                <p className="text-slate-300 text-sm sm:text-base mt-4 max-w-3xl leading-relaxed">
                  {isBn 
                    ? "একটি জাতীয় ডিজিটাল হসপিটালিটি নেটওয়ার্ক বাস্তবায়নের লক্ষ্যে মন্ত্রণালয় ও বাংলাদেশ পর্যটন কর্পোরেশনের যৌথ তত্ত্বাবধানে পাইলট প্রোগ্রাম চালুর আনুষ্ঠানিক প্রস্তাব।" 
                    : "A formal proposal requesting in-principle approval to initiate a supervised sandbox pilot under the Ministry of Civil Aviation & Tourism and BPC."}
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-8">
                  <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800">
                    <div className="flex items-center gap-2 text-emerald-400 font-bold text-xs mb-1.5">
                      <Check className="w-4 h-4" />
                      <span>{isBn ? "১. নীতিগত পাইলট অনুমোদন" : "1. Pilot Sandbox Approval"}</span>
                    </div>
                    <p className="text-xs text-slate-400">
                      {isBn ? "ঢাকা ও প্রধান পর্যটন স্পটে যৌথ পাইলট ট্রায়ালের অনুমতি।" : "Authorization to pilot live inventory sync with selected model hotels."}
                    </p>
                  </div>

                  <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800">
                    <div className="flex items-center gap-2 text-emerald-400 font-bold text-xs mb-1.5">
                      <Check className="w-4 h-4" />
                      <span>{isBn ? "২. তদারকি ড্যাশবোর্ড সমন্বয়" : "2. Regulatory Dashboard"}</span>
                    </div>
                    <p className="text-xs text-slate-400">
                      {isBn ? "মন্ত্রণালয় ও বিপিসি কর্মকর্তাদের জন্য তদারকি এক্সেস।" : "Dedicated oversight login for authorized government officials."}
                    </p>
                  </div>

                  <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800">
                    <div className="flex items-center gap-2 text-emerald-400 font-bold text-xs mb-1.5">
                      <Check className="w-4 h-4" />
                      <span>{isBn ? "৩. জাতীয় সচেতনতা প্রচার" : "3. Official Awareness Drive"}</span>
                    </div>
                    <p className="text-xs text-slate-400">
                      {isBn ? "সরকারি চ্যানেল ও পর্যটন পোর্টালে প্ল্যাটফর্মের পরিচিতি।" : "Endorsement & visibility across official national tourism outlets."}
                    </p>
                  </div>
                </div>

                <div className="mt-8 pt-8 border-t border-slate-800/80 flex flex-wrap items-center justify-between gap-4">
                  <div className="flex flex-wrap items-center gap-3">
                    <button
                      onClick={() => setShowPitchModal(true)}
                      className="px-6 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs transition-all flex items-center gap-2 shadow-lg shadow-emerald-500/20 active:scale-95"
                    >
                      <Monitor className="w-4 h-4" />
                      <span>{isBn ? "পূর্ণাঙ্গ প্রেজেন্টেশন ডেক চালু করুন (২১ স্লাইড)" : "Launch 21-Slide Presentation Mode"}</span>
                    </button>

                    <button
                      onClick={() => window.print()}
                      className="px-5 py-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 font-bold text-xs border border-slate-800 transition-colors flex items-center gap-2"
                    >
                      <Download className="w-4 h-4 text-emerald-400" />
                      <span>{isBn ? "অফিসিয়াল হোয়াইটপেপার প্রিন্ট / পিডিএফ" : "Download / Print Whitepaper"}</span>
                    </button>
                  </div>

                  <div className="text-xs text-slate-400 font-medium">
                    {isBn ? "প্রস্তাবিত প্রকল্প পরিচয়: StayBD — সহজ অনুসন্ধান। নিরাপদ আবাসন।" : "Project Identity: StayBD — Stay Smart. Book Easy."}
                  </div>
                </div>

              </div>
            </div>

          </div>
        </section>

      </main>

      {/* ═══════════════════════════════════════════════════
          EXECUTIVE PITCH DECK PRESENTATION MODAL (21 SLIDES)
      ═══════════════════════════════════════════════════ */}
      <AnimatePresence>
        {showPitchModal && (
          <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
            <motion.div
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.96 }}
              className="w-full max-w-5xl bg-[#0F1420] border border-slate-800 rounded-3xl shadow-2xl overflow-hidden flex flex-col justify-between max-h-[92vh]"
            >
              {/* Modal Top Bar */}
              <div className="px-6 py-4 border-b border-slate-800 bg-slate-950/80 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="text-xs font-black text-emerald-400 bg-emerald-500/10 border border-emerald-500/30 px-3 py-1 rounded-lg">
                    {isBn ? `স্লাইড ${currentSlideIndex + 1} / ২১` : `SLIDE ${currentSlideIndex + 1} OF 21`}
                  </span>
                  <span className="text-xs font-bold text-slate-300 hidden sm:inline">
                    {isBn ? SLIDE_METADATA[currentSlideIndex].titleBn : SLIDE_METADATA[currentSlideIndex].title}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={toggleLanguage}
                    className="px-2.5 py-1 rounded-lg text-xs font-bold border border-slate-800 bg-slate-900 text-slate-300 hover:text-white"
                  >
                    {isBn ? "English" : "বাংলা"}
                  </button>

                  <button
                    onClick={() => setShowPitchModal(false)}
                    className="p-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Modal Slide Body (Dynamic based on currentSlideIndex) */}
              <div className="p-6 sm:p-10 flex-1 overflow-y-auto">
                <div className="max-w-3xl mx-auto text-left">
                  <span className="text-xs font-extrabold text-emerald-400 uppercase tracking-widest block mb-1">
                    {isBn ? `স্লাইড ০${currentSlideIndex + 1}` : `Slide 0${currentSlideIndex + 1}`}
                  </span>
                  <h2 className="text-2xl sm:text-4xl font-black text-white mb-3">
                    {isBn ? SLIDE_METADATA[currentSlideIndex].titleBn : SLIDE_METADATA[currentSlideIndex].title}
                  </h2>

                  {/* Slide Content Preview Card */}
                  <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 text-sm text-slate-300 leading-relaxed space-y-4">
                    {currentSlideIndex === 0 && (
                      <div>
                        <p className="text-base text-slate-200 font-semibold mb-3">
                          {isBn 
                            ? "StayBD — গণপ্রজাতন্ত্রী বাংলাদেশ সরকারের বেসামরিক বিমান পরিবহন ও পর্যটন মন্ত্রণালয় এবং বাংলাদেশ পর্যটন কর্পোরেশনের সাথে যৌথ অংশীদারিত্বে প্রস্তাবিত জাতীয় হোটেল অনুসন্ধান ও বুকিং প্ল্যাটফর্ম।" 
                            : "StayBD — Proposed National Hotel Discovery & Booking Platform in strategic collaboration with Ministry of Civil Aviation & Tourism and Bangladesh Parjatan Corporation."}
                        </p>
                        <div className="text-xs text-emerald-400 font-bold">
                          {isBn ? "সহজ অনুসন্ধান। নিরাপদ আবাসন।" : "Stay Smart. Book Easy."}
                        </div>
                      </div>
                    )}

                    {currentSlideIndex === 1 && (
                      <div>
                        <p>{isBn ? "একটি জাতীয় ডিজিটাল প্ল্যাটফর্ম—যেখানে হোটেল, পর্যটক, ব্যবসায়ী ও সরকার একই সমন্বিত নেটওয়ার্কে যুক্ত থাকবে।" : "A national digital public platform connecting hotels, travelers, businesses, and the government in one unified, transparent ecosystem."}</p>
                        <div className="mt-3 grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs">
                          <div className="p-2.5 rounded-lg bg-rose-500/10 border border-rose-500/20 text-rose-300">{isBn ? "সমস্যা: দালাল ও অতিরিক্ত ভাড়া" : "Problem: Broker Price Gouging"}</div>
                          <div className="p-2.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-300">{isBn ? "সমাধান: একীভূত স্বচ্ছ পোর্টাল" : "Solution: Unified Transparent Portal"}</div>
                          <div className="p-2.5 rounded-lg bg-blue-500/10 border border-blue-500/20 text-blue-300">{isBn ? "মূল্য: ডিজিটাল হসপিটালিটি" : "Value: Modern Digital Hospitality"}</div>
                        </div>
                      </div>
                    )}

                    {currentSlideIndex > 1 && (
                      <div>
                        <p className="text-slate-300">
                          {isBn 
                            ? `এই স্লাইডে StayBD-এর ${SLIDE_METADATA[currentSlideIndex].titleBn}-এর বিস্তারিত ফ্রেমওয়ার্ক, টেকনিক্যাল স্পেসিফিকেশন ও সরকারি সহযোগিতা নীতিমালা রয়েছে।` 
                            : `This presentation slide outlines the technical architecture, operating model, and institutional requirements for: ${SLIDE_METADATA[currentSlideIndex].title}.`}
                        </p>
                        <div className="mt-4 p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-400">
                          {isBn ? "সম্পূর্ণ ব্লুপ্রিন্ট ও টেক্সট মূল পেজের সেকশনগুলোতে বিস্তারিত দেওয়া আছে।" : "All detailed data points are also available directly on the main interactive web portal page."}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Modal Slide Navigation Bottom Controls */}
              <div className="px-6 py-4 border-t border-slate-800 bg-slate-950/80 flex items-center justify-between">
                <button
                  onClick={() => setCurrentSlideIndex(prev => Math.max(prev - 1, 0))}
                  disabled={currentSlideIndex === 0}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-slate-300 bg-slate-900 hover:bg-slate-800 disabled:opacity-30 border border-slate-800 flex items-center gap-1.5"
                >
                  <ChevronLeft className="w-4 h-4" />
                  <span>{isBn ? "পূর্ববর্তী স্লাইড" : "Previous Slide"}</span>
                </button>

                <div className="hidden sm:flex items-center gap-1">
                  {SLIDE_METADATA.map((_, i) => (
                    <button
                      key={i}
                      onClick={() => setCurrentSlideIndex(i)}
                      className={`h-1.5 rounded-full transition-all ${
                        currentSlideIndex === i ? "w-6 bg-emerald-400" : "w-1.5 bg-slate-700 hover:bg-slate-500"
                      }`}
                    />
                  ))}
                </div>

                <button
                  onClick={() => setCurrentSlideIndex(prev => Math.min(prev + 1, SLIDE_METADATA.length - 1))}
                  disabled={currentSlideIndex === SLIDE_METADATA.length - 1}
                  className="px-4 py-2 rounded-xl text-xs font-black text-slate-950 bg-emerald-400 hover:bg-emerald-300 disabled:opacity-30 flex items-center gap-1.5 shadow-md"
                >
                  <span>{isBn ? "পরবর্তী স্লাইড" : "Next Slide"}</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>

            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Universal Footer */}
      <Footer />

    </div>
  );
};

export default NationalProposal;
