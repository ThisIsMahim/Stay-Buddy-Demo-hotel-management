import React, { useState, useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Building2, ShieldCheck, CheckCircle2, TrendingUp, Users, 
  CreditCard, Zap, Award, ArrowRight, PhoneCall, MessageSquare, 
  HelpCircle, ChevronDown, ChevronUp, Star, Check, Sparkles, 
  Globe, Calculator, MapPin, BedDouble, SlidersHorizontal, 
  Clock, DollarSign, X, ExternalLink, ArrowUpRight, Search,
  Calendar, Layers, Shield, RefreshCw, Smartphone, Laptop
} from "lucide-react";
import { useUser } from "@clerk/react";
import { useTranslation } from "react-i18next";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { api } from "../services/api";

// ══════════════════════════════════════════════════════════════════
// DYNAMIC BANGLADESH DIVISIONS & DISTRICTS MAPPING
// ══════════════════════════════════════════════════════════════════
const BD_DIVISIONS_DISTRICTS: Record<string, string[]> = {
  "Chittagong": ["Cox's Bazar", "Bandarban", "Rangamati", "Sajek (Khagrachhari)", "Chattogram City", "Cumilla", "Feni", "Noakhali", "Chandpur", "Brahmanbaria", "Lakshmipur"],
  "Sylhet": ["Sreemangal", "Moulvibazar", "Sylhet Sadar", "Jaflong / Gowainghat", "Tanguar Haor (Sunamganj)", "Habiganj"],
  "Dhaka": ["Dhaka City", "Gazipur (Resort Zone)", "Savar", "Narayanganj", "Munshiganj", "Manikganj", "Tangail", "Narsingdi", "Faridpur", "Gopalganj", "Kishoreganj"],
  "Khulna": ["Sundarbans (Mongla / Bagerhat)", "Khulna City", "Satkhira", "Jessore", "Kushtia", "Jhenaidah", "Magura", "Narail", "Meherpur", "Chuadanga"],
  "Barisal": ["Kuakata Beach (Patuakhali)", "Barisal City", "Bhola Island", "Barguna", "Pirojpur", "Jhalokati"],
  "Rajshahi": ["Rajshahi City", "Bogura", "Pabna", "Natore", "Naogaon", "Chapai Nawabganj", "Sirajganj", "Joypurhat"],
  "Rangpur": ["Panchagarh (Tetulia)", "Dinajpur", "Rangpur City", "Kurigram", "Gaibandha", "Nilphamari", "Lalmonirhat", "Thakurgaon"],
  "Mymensingh": ["Netrokona (Birishiri)", "Mymensingh Sadar", "Sherpur (Garo Hills)", "Jamalpur"]
};

// ══════════════════════════════════════════════════════════════════
// PROPERTY TYPE INTELLIGENT PRESETS FOR REVENUE CALCULATOR
// ══════════════════════════════════════════════════════════════════
const PROPERTY_TYPE_PRESETS: Record<string, { rooms: number; rate: number; occupancy: number; labelBn: string }> = {
  "Resort": { rooms: 16, rate: 4200, occupancy: 70, labelBn: "রিসোর্ট (Resort)" },
  "Boutique Hotel": { rooms: 22, rate: 3200, occupancy: 65, labelBn: "হোটেল (Hotel)" },
  "Eco Cottage": { rooms: 6, rate: 2600, occupancy: 60, labelBn: "ইকো কটেজ (Eco Cottage)" },
  "Hill Lodge": { rooms: 10, rate: 3500, occupancy: 75, labelBn: "হিল লজ (Hill Lodge)" },
  "Guest House / Homestay": { rooms: 4, rate: 1800, occupancy: 80, labelBn: "গেস্ট হাউস / হোমস্টে" },
  "Houseboat / Haor Cruise": { rooms: 8, rate: 6000, occupancy: 55, labelBn: "হাউসবোট (Houseboat)" }
};

interface PartnerApplication {
  id: string;
  propertyName: string;
  propertyType: string;
  division: string;
  district: string;
  totalRooms: number;
  ownerName: string;
  phone: string;
  email: string;
  plan: string;
  status: "Pending" | "Verified";
  appliedAt: string;
}

export default function BecomeAHost() {
  const navigate = useNavigate();
  const { user } = useUser();
  const { i18n } = useTranslation();
  const isBn = i18n.language?.startsWith("bn");

  // Dynamic Form State
  const [propertyName, setPropertyName] = useState("");
  const [propertyType, setPropertyType] = useState("Resort");
  const [division, setDivision] = useState("Chittagong");
  const [district, setDistrict] = useState("Cox's Bazar");
  const [totalRooms, setTotalRooms] = useState(16);
  const [ownerName, setOwnerName] = useState(user?.fullName || "");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState(user?.primaryEmailAddress?.emailAddress || "");
  const [selectedPlan, setSelectedPlan] = useState("Pro Partner");
  const [loading, setLoading] = useState(false);
  const [successApplication, setSuccessApplication] = useState<PartnerApplication | null>(null);

  // Dynamic Revenue Calculator State
  const [calcRooms, setCalcRooms] = useState<number>(16);
  const [calcRate, setCalcRate] = useState<number>(4200);
  const [calcOccupancy, setCalcOccupancy] = useState<number>(70);

  // Dynamic Billing Frequency State (Annual vs Monthly)
  const [billingCycle, setBillingCycle] = useState<"annual" | "monthly">("annual");

  // Dynamic Feature Tabs State
  const [activeFeatureTab, setActiveFeatureTab] = useState<number>(0);

  // Dynamic FAQ State: Search & Filter Category
  const [faqCategory, setFaqCategory] = useState<string>("all");
  const [faqSearch, setFaqSearch] = useState<string>("");
  const [activeFaq, setActiveFaq] = useState<number | null>(0);

  // Update District list dynamically when Division changes
  const availableDistricts = useMemo(() => {
    return BD_DIVISIONS_DISTRICTS[division] || ["Cox's Bazar"];
  }, [division]);

  // Handle Division Change
  const handleDivisionChange = (newDivision: string) => {
    setDivision(newDivision);
    const districts = BD_DIVISIONS_DISTRICTS[newDivision];
    if (districts && districts.length > 0) {
      setDistrict(districts[0]);
    }
  };

  // Handle Property Type Change (Auto updates Calculator Preset)
  const handlePropertyTypeChange = (newType: string) => {
    setPropertyType(newType);
    const preset = PROPERTY_TYPE_PRESETS[newType];
    if (preset) {
      setTotalRooms(preset.rooms);
      setCalcRooms(preset.rooms);
      setCalcRate(preset.rate);
      setCalcOccupancy(preset.occupancy);
    }
  };

  // Dynamic Revenue Calculations
  const calculatedMonthly = useMemo(() => {
    return Math.round(calcRooms * calcRate * (calcOccupancy / 100) * 30);
  }, [calcRooms, calcRate, calcOccupancy]);

  const calculatedCommissionSaved = useMemo(() => {
    // 20% typical OTA commission saved with StayBD 0% direct tariff
    return Math.round(calculatedMonthly * 0.20);
  }, [calculatedMonthly]);

  // Handle Form Submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!propertyName.trim() || !ownerName.trim() || !phone.trim() || !email.trim()) {
      alert(isBn ? "অনুগ্রহ করে সকল আবশ্যকীয় তথ্য পূরণ করুন।" : "Please fill in all required fields.");
      return;
    }

    setLoading(true);
    const newApp: PartnerApplication = {
      id: `STAYBD-P${Math.floor(1000 + Math.random() * 9000)}`,
      propertyName: propertyName.trim(),
      propertyType,
      division,
      district,
      totalRooms: Number(totalRooms),
      ownerName: ownerName.trim(),
      phone: phone.trim(),
      email: email.trim(),
      plan: selectedPlan,
      status: "Pending",
      appliedAt: new Date().toISOString()
    };

    try {
      // Save locally to simulate instant registration
      const existing = JSON.parse(localStorage.getItem("staybd_partner_applications") || "[]");
      existing.unshift(newApp);
      localStorage.setItem("staybd_partner_applications", JSON.stringify(existing));

      // Also pre-seed the Owner Session for seamless demo dashboard testing
      localStorage.setItem("ownerUser", JSON.stringify({
        id: newApp.id,
        name: newApp.ownerName,
        email: newApp.email,
        phone: newApp.phone,
        propertyName: newApp.propertyName,
        plan: newApp.plan,
        role: "owner"
      }));
      localStorage.setItem("ownerToken", `demo-token-${Date.now()}`);

      // Attempt API sync if backend is active
      try {
        await api.addOwner({
          name: ownerName,
          email: email,
          avatar: user?.imageUrl
        });
      } catch (e) {
        // Safe fallback
      }

      setSuccessApplication(newApp);
    } catch (err) {
      alert("Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Scroll to application form with specific plan pre-selected
  const selectPlanAndScroll = (planName: string) => {
    setSelectedPlan(planName);
    const formElement = document.getElementById("partner-application-form");
    if (formElement) {
      formElement.scrollIntoView({ behavior: "smooth" });
    }
  };

  // Live Live-Ticker of Verified Host Activity
  const liveRecentPartners = [
    { name: "🌊 Sea Pearl Eco Resort", loc: "Cox's Bazar", time: isBn ? "২ মিনিট আগে যুক্ত হয়েছেন" : "Joined 2 mins ago", badge: "Pro" },
    { name: "🌲 Sreemangal Tea Cottage", loc: "Sylhet", time: isBn ? "৮ মিনিট আগে ভেরিফাইড" : "Verified 8 mins ago", badge: "Gold" },
    { name: "☁️ Sajek Cloud Haven", loc: "Bandarban", time: isBn ? "১৪ মিনিট আগে যুক্ত হয়েছেন" : "Joined 14 mins ago", badge: "Pro" },
    { name: "⛵ Tanguar Haor Luxury Houseboat", loc: "Sunamganj", time: isBn ? "২৫ মিনিট আগে যুক্ত হয়েছেন" : "Joined 25 mins ago", badge: "Enterprise" },
    { name: "🌴 Kuakata Sunset Palms", loc: "Patuakhali", time: isBn ? "৪২ মিনিট আগে ভেরিফাইড" : "Verified 42 mins ago", badge: "Gold" }
  ];

  // Dynamic Pricing Tiers Calculation
  const pricingPlans = useMemo(() => [
    {
      name: "Standard",
      nameBn: "স্ট্যান্ডার্ড পার্টনার",
      price: "Free",
      priceBn: "বিনামূল্যে (০ টাকা)",
      period: "Zero setup fee",
      periodBn: "০ টাকা সেটআপ ফি",
      desc: "Ideal for independent eco-cottages, rest houses, and boutique lodges starting out.",
      descBn: "স্বতন্ত্র কটেজ ও সাশ্রয়ী রেস্ট হাউসের জন্য সেরা প্রারম্ভিক সমাধান।",
      features: [
        "1 Verified Property Listing",
        "0% Commission on Direct Bookings",
        "Standard Tourism Directory Placement",
        "Basic Reservation & Guest Management",
        "Community & Email Support"
      ],
      featuresBn: [
        "১টি ভেরিফায়েড হোটেল লিস্টিং",
        "ডিরেক্ট বুকিংয়ে ০% কমিশন",
        "স্ট্যান্ডার্ড পর্যটন ডিরেক্টরি প্লেসমেন্ট",
        "মৌলিক বুকিং ও গেস্ট ম্যানেজমেন্ট",
        "ইমেইল ও কমিউনিটি সহায়তা"
      ],
      isPopular: false,
      badge: null
    },
    {
      name: "Pro Partner",
      nameBn: "প্রো পার্টনার (ভেরিফায়েড)",
      price: billingCycle === "annual" ? "৳4,000" : "৳499",
      priceBn: billingCycle === "annual" ? "৳৪,০০০" : "৳৪৯৯",
      period: billingCycle === "annual" ? "per year (Save 20%)" : "per month",
      periodBn: billingCycle === "annual" ? "প্রতি বছর (২০% সাশ্রয়)" : "প্রতি মাসে",
      desc: "The premier choice for reputable hotels & resorts aiming to dominate regional bookings.",
      descBn: "শীর্ষ হোটেল ও রিসোর্টের বুকিং বৃদ্ধি ও ভেরিফায়েড ব্র্যান্ডিংয়ের সেরা প্যাকেজ।",
      features: [
        "Unlimited Room Tiers & Inventory Sync",
        "Verified Gold Partner Badge (3.4x conversion)",
        "Priority Top-3 Feature in District & Map",
        "Advanced PMS Analytics & Occupancy Radar",
        "Direct Instant bKash / Bank Payout Gateway",
        "Dedicated Account Executive & 24/7 Phone Line"
      ],
      featuresBn: [
        "আনলিমিটেড রুম ক্যাটাগরি ও ইনভেন্টরি সিঙ্ক",
        "ভেরিফায়েড গোল্ড পার্টনার ব্যাজ (৩.৪ গুণ বেশি বুকিং)",
        "জেলা ও পর্যটন মানচিত্রে টপ-৩ প্রায়োরিটি প্লেসমেন্ট",
        "উন্নত PMS অ্যানালিটিক্স ও ড্যাশবোর্ড",
        "সরাসরি বিকাশ, নগদ ও ব্যাংক ইনস্ট্যান্ট পে-আউট",
        "ডেডিকেটেড একাউন্ট ম্যানেজার ও ২৪/৭ ফোন সহায়তা"
      ],
      isPopular: true,
      badge: isBn ? "হোটেল মালিকদের সেরা পছন্দ" : "Most Popular Choice"
    },
    {
      name: "Enterprise",
      nameBn: "এন্টারপ্রাইজ চেইন",
      price: "Custom",
      priceBn: "কাস্টম কোটেশন",
      period: "for hotel chains",
      periodBn: "মাল্টি-হোটেল চেইন",
      desc: "Tailored multi-property infrastructure for luxury resort groups and hospitality chains.",
      descBn: "বৃহৎ রিসোর্ট চেইন ও মাল্টি-ব্রাঞ্চ হোটেলের জন্য বিশেষ প্রাতিষ্ঠানিক সমাধান।",
      features: [
        "Multi-Branch Centralized PMS Dashboard",
        "Channel Manager & Global API Integrations",
        "Custom Corporate Invoicing & VAT Compliance",
        "Staff Roles & Multi-Level Permission Access",
        "24/7 VIP Phone Concierge & On-site Onboarding"
      ],
      featuresBn: [
        "মাল্টি-ব্রাঞ্চ সেন্ট্রালাইজড ম্যানেজমেন্ট ড্যাশবোর্ড",
        "চ্যানেল ম্যানেজার ও গ্লোবাল API ইন্টিগ্রেশন",
        "কাস্টম কর্পোরেট চালান ও ভ্যাট কমপ্লায়েন্স",
        "মাল্টি-লেভেল স্টাফ পারমিশন ও রোলস",
        "২৪/৭ ভিআইপি কনসিয়ার্জ ও অন-সাইট সহায়তা"
      ],
      isPopular: false,
      badge: null
    }
  ], [billingCycle, isBn]);

  const comparisonPoints = [
    {
      feature: isBn ? "প্ল্যাটফর্ম বুকিং কমিশন" : "Booking Commission",
      staybd: isBn ? "০% ডিরেক্ট ট্যারিফ (সম্পূর্ণ আয় আপনার)" : "0% Direct Tariff (You keep 100%)",
      others: isBn ? "১৮% - ২৫% উচ্চ কমিশন কাটা হয়" : "18% - 25% Heavy Commission Cut",
      highlight: true
    },
    {
      feature: isBn ? "পেমেন্ট পে-আউট গতি" : "Payout Timeline",
      staybd: isBn ? "তাৎক্ষণিক (বিকাশ / নগদ / BEFTN ব্যাংক)" : "Instant (bKash / Nagad / Bank EFT)",
      others: isBn ? "৩০ থেকে ৪৫ দিন আটকে রাখা হয়" : "30 to 45 Days Delayed Withholding",
      highlight: true
    },
    {
      feature: isBn ? "মূল্য নির্ধারণের স্বাধীনতা" : "Room Rate Freedom",
      staybd: isBn ? "১০০% আপনার ইচ্ছামতো নির্ধারণ" : "100% Owner Controlled (No Force)",
      others: isBn ? "জোরপূর্বক ডিসকাউন্ট ও রেট প্যারিটি" : "Forced Rate Parity Penalties",
      highlight: false
    },
    {
      feature: isBn ? "জাতীয় নিরাপত্তা ও ট্যুরিস্ট পুলিশ" : "National Security & Police Link",
      staybd: isBn ? "ট্যুরিস্ট পুলিশ ও জাতীয় ডাটাবেজ সংযুক্ত" : "Aligned with Bangladesh Tourist Police",
      others: isBn ? "অনিশ্চিত বিদেশি অটোমেশন" : "Overseas Automated Disconnected Bots",
      highlight: true
    },
    {
      feature: isBn ? "হোটেল সহায়তার মাধ্যম" : "Host Support Channel",
      staybd: isBn ? "২৪/৭ সরাসরি বাংলা ফোন ও হোয়াটসঅ্যাপ" : "24/7 Direct Bangla Hotline & WhatsApp",
      others: isBn ? "শুধু বিদেশি রোবট ইমেইল টিকিট" : "Automated Robot Email Tickets Only",
      highlight: false
    }
  ];

  // Dynamic Feature Tabs
  const platformFeatures = [
    {
      id: "payouts",
      title: isBn ? "ইনস্ট্যান্ট পেমেন্ট সেটেলমেন্ট" : "Instant Digital Payouts",
      icon: CreditCard,
      badge: "0% Commission",
      heading: isBn ? "গেস্ট বুকিংয়ের টাকা সরাসরি আপনার বিকাশ বা ব্যাংকে" : "Same-Day Settlements via bKash, Nagad & BEFTN",
      description: isBn
        ? "বিদেশি ওটিএ-র মতো মাসব্যাপী টাকা আটকে রাখা হবে না। গেস্ট চেক-ইন করার সাথে সাথেই ডিজিটাল ওয়ালেট বা ব্যাংক একাউন্টে ১০০% টাকা পৌঁছে যাবে।"
        : "No 45-day payment withholdings. Direct gateway transfers directly credit your hotel's designated merchant account immediately.",
      stats: [
        { label: isBn ? "সেটেলমেন্ট সময়" : "Settlement Time", value: "< 24 Hours" },
        { label: isBn ? "প্ল্যাটফর্ম কমিশন" : "Platform Cut", value: "0% Commission" },
        { label: isBn ? "পেমেন্ট মাধ্যম" : "Supported Rails", value: "bKash / Bank / Nagad" }
      ]
    },
    {
      id: "pms",
      title: isBn ? "স্মার্ট PMS ও ক্যালেন্ডার সিঙ্ক" : "Smart PMS & Inventory",
      icon: Calendar,
      badge: "Real-time Control",
      heading: isBn ? "যেকোনো ডিভাইস থেকে রুমের ভাড়া ও প্রাপ্যতা নিয়ন্ত্রণ" : "Real-time Multi-Room Availability Manager",
      description: isBn
        ? "মোবাইল বা ল্যাপটপ থেকে ১ ক্লিকে ছুটির দিনের স্পেশাল রেট নির্ধারণ, রুম লক বা আনলক এবং অফ-সিজন ডিল চালু করুন।"
        : "Adjust seasonal tariffs, lock booked rooms, and configure weekend surges instantly from your responsive host console.",
      stats: [
        { label: isBn ? "ডিভাইস সাপোর্ট" : "Cross-Device", value: "Mobile + PC" },
        { label: isBn ? "সিঙ্কিং গতি" : "Sync Latency", value: "Instant (Live)" },
        { label: isBn ? "রুম ক্যাটাগরি" : "Room Tiers", value: "Unlimited" }
      ]
    },
    {
      id: "security",
      title: isBn ? "ট্যুরিস্ট পুলিশ ও এনআইডি ভেরিফিকেশন" : "Police & NID Verification",
      icon: ShieldCheck,
      badge: "Safe Host",
      heading: isBn ? "নিরাপদ পর্যটন ও নির্ভরযোগ্য অতিথি নেটওয়ার্ক" : "Automated Guest Identity & Security Compliance",
      description: isBn
        ? "প্রতিটি গেস্টের এনআইডি এবং মোবাইল নম্বর স্বয়ংক্রিয়ভাবে যাচাই করা থাকে, যা বাংলাদেশ ট্যুরিস্ট পুলিশের নিরাপত্তা মানদণ্ড নিশ্চিত করে।"
        : "Built-in guest NID verification and digital check-in records ensure total compliance with regional law enforcement safety standards.",
      stats: [
        { label: isBn ? "এনআইডি ভেরিফিকেশন" : "NID Checks", value: "100% Automated" },
        { label: isBn ? "নিরাপত্তা ইনডেক্স" : "Trust Index", value: "4.9 / 5.0" },
        { label: isBn ? "জরুরি সহায়তা" : "Emergency Link", value: "Direct 999 / TP" }
      ]
    },
    {
      id: "tourism-spot",
      title: isBn ? "ট্যুরিজম স্পট ডিরেক্ট ট্রাফিক" : "Spot-to-Hotel Traffic",
      icon: MapPin,
      badge: "High Conversion",
      heading: isBn ? "বাংলাদেশের জনপ্রিয় দর্শনীয় স্থান থেকে সরাসরি বুকিং" : "Direct Placement on 64 District Tourism Maps",
      description: isBn
        ? "কক্সবাজার, সাজেক বা শ্রীমঙ্গলের মতো দর্শনীয় স্থান দেখতে আসা লাখো পর্যটকের সামনে আপনার হোটেলকে সরাসরি প্রদর্শন করা হয়।"
        : "When travellers browse national attractions like Nilgiri, Inani Beach, or Tea Gardens, your property is featured right on the destination radar.",
      stats: [
        { label: isBn ? "মাসিক ট্রাভেলার" : "Monthly Reach", value: "500K+ Tourists" },
        { label: isBn ? "লোকেশন ম্যাপিং" : "Geo-Targeting", value: "64 Districts" },
        { label: isBn ? "বুকিং বৃদ্ধি" : "Traffic Multiplier", value: "3.4x Uplift" }
      ]
    }
  ];

  // Raw FAQs list with categories
  const rawFaqs = [
    {
      category: "payouts",
      q: isBn ? "অতিথিরা বুকিং করলে আমি কীভাবে টাকা পাব?" : "How and when do I receive guest booking payments?",
      a: isBn
        ? "অতিথিদের অগ্রিম বা নিশ্চিত বুকিংয়ের টাকা আপনার সরাসরি পছন্দের বিকাশ, নগদ বা ব্যাংক একাউন্টে তাৎক্ষণিকভাবে জমা হয়। অন্যান্য বিদেশি এজেন্সির মতো কোনো দীর্ঘমেয়াদি পেমেন্ট আটকে রাখা হয় না।"
        : "Payments are directly deposited into your chosen bKash, Nagad, or Bangladeshi Bank Account via BEFTN/NPSB. There is zero delay and zero payment withholding."
    },
    {
      category: "verification",
      q: isBn ? "StayBD-তে আমার হোটেল বা কটেজ কীভাবে ভেরিফাইড হবে?" : "How does my hotel get verified on StayBD?",
      a: isBn
        ? "আবেদন সাবমিট করার পর আমাদের জেলা পার্টনারশিপ টিম আপনার হোটেলের ট্রেড লাইসেন্স বা মালিকের এনআইডি এবং প্রপার্টি প্রস্তুতি দ্রুত পর্যবেক্ষণ করে। সাধারণ কার্যদিবসে ৬ থেকে ১২ ঘণ্টার মধ্যে 'Verified Partner' স্ট্যাটাস সক্রিয় হয়।"
        : "Once you submit your application, our district partnership team verifies your trade license or owner NID and property readiness. Accounts are typically reviewed and granted the 'Verified Partner' badge within 6-12 hours."
    },
    {
      category: "pms",
      q: isBn ? "আমি কি রুমের ভাড়া এবং প্রাপ্যতা যেকোনো সময় পরিবর্তন করতে পারব?" : "Can I change room tariffs and availability dynamically anytime?",
      a: isBn
        ? "হ্যাঁ, আপনার ওনার ড্যাশবোর্ডে আপনি যেকোনো সময় ১-ক্লিকে রুমের ভাড়া পরিবর্তন, অফ-সিজন ডিসকাউন্ট ঘোষণা, কিংবা রুম বুকড/খালি হিসেবে আপডেট করতে পারবেন।"
        : "Yes! Your dedicated Owner Dashboard gives you real-time control to adjust nightly rates, declare weekend/off-season promotions, and block or release inventory on the fly."
    },
    {
      category: "plans",
      q: isBn ? "আমার যদি একাধিক রিসোর্ট বা ব্রাঞ্চ থাকে, সব কি একসাথে নিয়ন্ত্রণ করা যাবে?" : "Can I manage multiple properties or branches from one single login?",
      a: isBn
        ? "অবশ্যই। আমাদের এন্টারপ্রাইজ ও প্রো পার্টনার সিস্টেমে এক ক্লিকেই মাল্টি-প্রপার্টি সুইচ করার সুবিধা রয়েছে, যার মাধ্যমে পুরো বাংলাদেশ জুড়ে আপনার সকল হোটেল এক ড্যাশবোর্ড থেকে দেখতে পারবেন।"
        : "Absolutely. Our multi-property infrastructure lets you switch between branches seamlessly, managing all locations across Bangladesh from a single portal."
    },
    {
      category: "support",
      q: isBn ? "কোনো সমস্যা বা সহায়তার জন্য কীভাবে যোগাযোগ করব?" : "How do I reach the StayBD Host Support team?",
      a: isBn
        ? "আমাদের ডেডিকেটেড পার্টনার হটলাইন 09612-STAYBD অথবা অফিসিয়াল হোয়াটসঅ্যাপ +880 1700-STAYBD এ ২৪/৭ যেকোনো সময় কল ও মেসেজ করতে পারেন।"
        : "You can reach our dedicated onboarding team 24/7 via phone hotline 09612-STAYBD or official WhatsApp at +880 1700-STAYBD."
    },
    {
      category: "payouts",
      q: isBn ? "০% কমিশন কীভাবে সম্ভব? StayBD কীভাবে আয় করে?" : "How is 0% commission possible? How does StayBD operate?",
      a: isBn
        ? "StayBD সরাসরি বাৎসরিক সাবস্ক্রিপশন মডেলে পরিচালিত হয়। আমরা কোনো হোটেল মালিকের প্রতিটি বুকিং থেকে ২০-২৫% অংশ কাটি না, ফলে পুরো আয় সরাসরি আপনার থাকে।"
        : "StayBD runs on a predictable transparent membership model. We never charge booking commission fees on guest reservations, saving you tens of thousands monthly."
    }
  ];

  // Dynamic FAQ Filtering
  const filteredFaqs = useMemo(() => {
    return rawFaqs.filter((f) => {
      const matchCat = faqCategory === "all" || f.category === faqCategory;
      const matchSearch = faqSearch.trim() === "" || 
        f.q.toLowerCase().includes(faqSearch.toLowerCase()) || 
        f.a.toLowerCase().includes(faqSearch.toLowerCase());
      return matchCat && matchSearch;
    });
  }, [faqCategory, faqSearch, isBn]);

  return (
    <div className="min-h-screen bg-[#FAFAFA] font-sans text-slate-900 selection:bg-indigo-500 selection:text-white">
      <Header />

      {/* ═══════════════════════════════════════════════════════
          REAL-TIME LIVE TICKER: RECENT BANGLADESH HOST ACTIVITY
      ══════════════════════════════════════════════════════════ */}
      <div className="bg-slate-900 text-slate-300 py-2.5 px-4 overflow-hidden border-b border-slate-800 text-xs font-semibold">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          <div className="flex items-center gap-2 shrink-0">
            <span className="flex h-2 w-2 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span className="text-emerald-400 font-bold uppercase tracking-wider text-[10px]">
              {isBn ? "লাইভ পার্টনার আপডেট" : "Live Host Activity"}:
            </span>
          </div>

          <div className="flex-1 overflow-hidden whitespace-nowrap">
            <div className="inline-flex items-center gap-8 animate-[marquee_25s_linear_infinite]">
              {liveRecentPartners.map((item, idx) => (
                <div key={idx} className="inline-flex items-center gap-2">
                  <span className="text-white font-medium">{item.name}</span>
                  <span className="text-slate-500">({item.loc})</span>
                  <span className="text-slate-400 text-[11px]">{item.time}</span>
                  <span className="bg-indigo-950 text-indigo-300 border border-indigo-700/50 text-[9px] px-1.5 py-0.2 rounded font-bold uppercase">
                    {item.badge}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="hidden sm:flex items-center gap-1.5 text-[11px] text-slate-400 shrink-0">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span>{isBn ? "৬৪ জেলায় ১৫,০০০+ সক্রিয় হোটেল" : "15,000+ Hosts in 64 Districts"}</span>
          </div>
        </div>
      </div>

      <main>
        {/* ═══════════════════════════════════════════════════════
            HERO SECTION: VALUE PROPOSITION & DYNAMIC APPLICATION
        ══════════════════════════════════════════════════════════ */}
        <section className="relative px-4 sm:px-6 md:px-12 lg:px-20 pt-12 md:pt-16 pb-20 md:pb-28 overflow-hidden bg-gradient-to-b from-white via-indigo-50/20 to-[#FAFAFA]">
          {/* Subtle Ambient Background Orbs */}
          <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-indigo-500/5 rounded-full blur-[140px] pointer-events-none -z-10 translate-x-1/3 -translate-y-1/3" />
          <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-emerald-500/5 rounded-full blur-[120px] pointer-events-none -z-10 -translate-x-1/3 translate-y-1/3" />

          <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center gap-12 lg:gap-16">
            
            {/* Left Column: Inspiring Headline & Live Stats */}
            <div className="flex-1 text-center lg:text-left">
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-emerald-50 border border-emerald-200/80 rounded-full mb-6 shadow-2xs"
              >
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span className="text-[11px] font-black text-emerald-800 uppercase tracking-wider">
                  {isBn ? "জাতীয় হোটেল ও রিসোর্ট পার্টনারশিপ পোর্টাল" : "National Hospitality Partnership Portal"}
                </span>
              </motion.div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-slate-900 tracking-tight leading-[1.12]">
                {isBn ? (
                  <>
                    আপনার হোটেল ও রিসোর্টকে রূপান্তর করুন <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-indigo-800 italic">লাভজনক ব্র্যান্ডে।</span>
                  </>
                ) : (
                  <>
                    Turn your property into <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-indigo-800 italic">a thriving business.</span>
                  </>
                )}
              </h1>

              <p className="mt-6 text-slate-600 text-base sm:text-lg max-w-xl mx-auto lg:mx-0 font-medium leading-relaxed">
                {isBn
                  ? "বিদেশি অনলাইন ট্রাভেল এজেন্সিকে আর ২০-২৫% উচ্চ কমিশন দিতে হবে না। সরাসরি মেহমান পান, বিকাশ ও ব্যাংকে ইনস্ট্যান্ট টাকা বুঝে নিন এবং ৬৪ জেলার পর্যটন মানচিত্রে নিজের প্রপার্টি তুলে ধরুন।"
                  : "Say goodbye to 20% foreign OTA commissions. Connect with millions of domestic & international travellers, receive instant digital payouts, and manage bookings across 64 districts under national security protocols."}
              </p>

              {/* Dynamic Live Trust Statistics */}
              <div className="grid grid-cols-3 gap-4 sm:gap-6 my-8 max-w-md mx-auto lg:mx-0">
                <div className="p-3.5 bg-white rounded-2xl border border-slate-200/80 shadow-2xs">
                  <div className="text-2xl sm:text-3xl font-black text-slate-900">15,000+</div>
                  <div className="text-[11px] text-slate-500 font-bold uppercase tracking-wider mt-0.5">
                    {isBn ? "সক্রিয় পার্টনার" : "Active Hosts"}
                  </div>
                </div>
                <div className="p-3.5 bg-white rounded-2xl border border-slate-200/80 shadow-2xs">
                  <div className="text-2xl sm:text-3xl font-black text-emerald-600">0%</div>
                  <div className="text-[11px] text-slate-500 font-bold uppercase tracking-wider mt-0.5">
                    {isBn ? "বুকিং কমিশন" : "Commission"}
                  </div>
                </div>
                <div className="p-3.5 bg-white rounded-2xl border border-slate-200/80 shadow-2xs">
                  <div className="text-2xl sm:text-3xl font-black text-indigo-600">64</div>
                  <div className="text-[11px] text-slate-500 font-bold uppercase tracking-wider mt-0.5">
                    {isBn ? "জেলায় নেটওয়ার্ক" : "Districts"}
                  </div>
                </div>
              </div>

              {/* Instant Hotline and WhatsApp Buttons */}
              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-3.5 text-xs font-bold">
                <a
                  href="tel:09612782923"
                  className="inline-flex items-center gap-2 bg-white px-4 py-2.5 rounded-xl border border-slate-200 shadow-2xs hover:border-indigo-400 transition"
                >
                  <PhoneCall className="w-4 h-4 text-indigo-600" />
                  <span>{isBn ? "পার্টনার হটলাইন: ০৯৬১২-STAYBD" : "Host Hotline: 09612-STAYBD"}</span>
                </a>
                <a
                  href="https://wa.me/8801700000000"
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 bg-emerald-50 px-4 py-2.5 rounded-xl border border-emerald-200 text-emerald-800 shadow-2xs hover:bg-emerald-100 transition"
                >
                  <MessageSquare className="w-4 h-4 text-emerald-600" />
                  <span>{isBn ? "হোয়াটসঅ্যাপ অনবোর্ডিং" : "WhatsApp Support"}</span>
                </a>
              </div>
            </div>

            {/* Right Column: High-Conversion Dynamic Application Form */}
            <div id="partner-application-form" className="flex-1 w-full max-w-xl">
              <div className="bg-white p-6 sm:p-8 md:p-10 rounded-3xl sm:rounded-[36px] shadow-2xl shadow-indigo-100/60 border border-slate-200/90 relative">
                
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h2 className="text-2xl font-black text-slate-900 leading-tight">
                      {isBn ? "হোটেল পার্টনারশিপ আবেদন" : "Host Partnership Application"}
                    </h2>
                    <p className="text-xs text-slate-500 font-medium mt-1">
                      {isBn ? "২ মিনিটে তথ্য পূরণ করে আপনার প্রপার্টি যুক্ত করুন।" : "Join in 2 minutes. Start accepting direct bookings."}
                    </p>
                  </div>
                  <span className="bg-indigo-50 text-indigo-700 text-xs font-black px-3 py-1 rounded-full border border-indigo-200">
                    Step 1 of 2
                  </span>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                  {/* Property Name */}
                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 uppercase tracking-wider mb-1">
                      {isBn ? "হোটেল / রিসোর্টের নাম" : "Property Name"} <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={propertyName}
                      onChange={(e) => setPropertyName(e.target.value)}
                      placeholder={isBn ? "যেমন: কোরাল সি রিসোর্ট, সেন্ট মার্টিন" : "e.g., Coral Sea Beach Resort"}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-900 text-sm outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 transition"
                    />
                  </div>

                  {/* Property Type & Total Rooms (Dynamic Presets) */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                    <div>
                      <label className="block text-[11px] font-bold text-slate-600 uppercase tracking-wider mb-1">
                        {isBn ? "প্রপার্টির ধরন (স্মার্ট প্রিসেট)" : "Property Category"}
                      </label>
                      <select
                        value={propertyType}
                        onChange={(e) => handlePropertyTypeChange(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-3 text-slate-900 text-sm outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 transition cursor-pointer"
                      >
                        {Object.entries(PROPERTY_TYPE_PRESETS).map(([key, val]) => (
                          <option key={key} value={key}>
                            {isBn ? val.labelBn : key}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-slate-600 uppercase tracking-wider mb-1">
                        {isBn ? "মোট রুমের সংখ্যা" : "Total Rooms"}
                      </label>
                      <input
                        type="number"
                        min="1"
                        max="200"
                        value={totalRooms}
                        onChange={(e) => {
                          const val = Number(e.target.value);
                          setTotalRooms(val);
                          setCalcRooms(val);
                        }}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-900 text-sm outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 transition"
                      />
                    </div>
                  </div>

                  {/* Dynamic Cascading Division & District Selector */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                    <div>
                      <label className="block text-[11px] font-bold text-slate-600 uppercase tracking-wider mb-1">
                        {isBn ? "বিভাগ" : "Division"}
                      </label>
                      <select
                        value={division}
                        onChange={(e) => handleDivisionChange(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-3 text-slate-900 text-sm outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 transition cursor-pointer"
                      >
                        {Object.keys(BD_DIVISIONS_DISTRICTS).map((divName) => (
                          <option key={divName} value={divName}>
                            {divName}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-slate-600 uppercase tracking-wider mb-1">
                        {isBn ? "জেলা / পর্যটন এলাকা (ডায়নামিক)" : "District / Tourism Hub"}
                      </label>
                      <select
                        value={district}
                        onChange={(e) => setDistrict(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-3 text-slate-900 text-sm outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 transition cursor-pointer"
                      >
                        {availableDistricts.map((dist) => (
                          <option key={dist} value={dist}>
                            {dist}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* Owner Name & Phone */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                    <div>
                      <label className="block text-[11px] font-bold text-slate-600 uppercase tracking-wider mb-1">
                        {isBn ? "মালিক / ম্যানেজারের নাম" : "Representative Name"} <span className="text-rose-500">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        value={ownerName}
                        onChange={(e) => setOwnerName(e.target.value)}
                        placeholder="John Doe"
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-900 text-sm outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 transition"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-slate-600 uppercase tracking-wider mb-1">
                        {isBn ? "মোবাইল নম্বর" : "Contact Phone"} <span className="text-rose-500">*</span>
                      </label>
                      <input
                        type="tel"
                        required
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="017XXXXXXXX"
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-900 text-sm outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 transition"
                      />
                    </div>
                  </div>

                  {/* Business Email */}
                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 uppercase tracking-wider mb-1">
                      {isBn ? "বিজনেস ইমেইল" : "Business Email"} <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="resort@example.com"
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-900 text-sm outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 transition"
                    />
                  </div>

                  {/* Selected Plan Selector Pills */}
                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 uppercase tracking-wider mb-1.5">
                      {isBn ? "নির্বাচিত সদস্যপদ প্যাকেজ" : "Selected Membership Plan"}
                    </label>
                    <div className="grid grid-cols-3 gap-2">
                      {["Standard", "Pro Partner", "Enterprise"].map((plan) => (
                        <button
                          key={plan}
                          type="button"
                          onClick={() => setSelectedPlan(plan)}
                          className={`py-2 px-1 text-xs font-bold rounded-xl border transition cursor-pointer ${
                            selectedPlan === plan
                              ? "bg-indigo-600 text-white border-indigo-600 shadow-xs"
                              : "bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100"
                          }`}
                        >
                          {plan}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Submit CTA */}
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-4 rounded-xl font-black text-sm shadow-xl shadow-indigo-600/25 active:scale-95 transition flex items-center justify-center gap-2 mt-2 cursor-pointer"
                  >
                    {loading ? (
                      <span className="flex items-center gap-2">
                        <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        <span>{isBn ? "আবেদন জমা হচ্ছে..." : "Submitting Application..."}</span>
                      </span>
                    ) : (
                      <>
                        <span>{isBn ? "পার্টনারশিপের জন্য আবেদন করুন" : "Request Partner Verification"}</span>
                        <ArrowRight className="w-4 h-4" />
                      </>
                    )}
                  </button>

                  <p className="text-[11px] text-slate-400 text-center leading-relaxed font-medium">
                    {isBn
                      ? "* নতুন অ্যাকাউন্ট যাচাইকরণে ৬–১২ ঘণ্টা সময় লাগে। ০% কমিশন ও সরাসরি ব্যাংক পেমেন্ট নিশ্চিত।"
                      : "* Account verification usually completes within 6–12 hours. Zero hidden onboarding fees."}
                  </p>
                </form>

              </div>
            </div>

          </div>
        </section>

        {/* ═══════════════════════════════════════════════════════
            DYNAMIC HOST REVENUE & COMMISSION SAVINGS CALCULATOR
        ══════════════════════════════════════════════════════════ */}
        <section className="py-20 px-4 sm:px-6 md:px-12 lg:px-20 bg-white border-y border-slate-200/90">
          <div className="max-w-6xl mx-auto">
            
            <div className="text-center max-w-2xl mx-auto mb-14">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-full text-xs font-bold uppercase tracking-wider mb-3">
                <Calculator className="w-3.5 h-3.5" />
                <span>{isBn ? "লাইভ রেভিনিউ ক্যালকুলেটর" : "Interactive Earnings Calculator"}</span>
              </div>
              <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
                {isBn ? "দেখুন আপনার হোটেল প্রতি মাসে কত আয় করবে" : "Calculate Your Monthly Direct Earnings"}
              </h2>
              <p className="text-slate-500 text-sm sm:text-base mt-2 font-medium">
                {isBn
                  ? "স্লাইডার পরিবর্তন করে দেখুন StayBD-এর ০% ডিরেক্ট মডেলে আপনি কত টাকা বাড়তি আয় করবেন।"
                  : "Slide to adjust your room count, nightly rate, and occupancy to see your net direct profit."}
              </p>
            </div>

            <div className="bg-[#F8FAFF] rounded-3xl border border-indigo-100 p-6 sm:p-10 shadow-lg shadow-indigo-100/40 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              
              {/* Sliders Column */}
              <div className="lg:col-span-7 space-y-7">
                
                {/* Rooms Slider */}
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-bold text-slate-700">
                      {isBn ? "মোট রুমের সংখ্যা" : "Number of Available Rooms"}:
                    </span>
                    <span className="text-base font-black text-indigo-600 bg-white px-3 py-1 rounded-lg border border-indigo-100 shadow-2xs">
                      {calcRooms} {isBn ? "টি রুম" : "Rooms"}
                    </span>
                  </div>
                  <input
                    type="range"
                    min="2"
                    max="60"
                    step="1"
                    value={calcRooms}
                    onChange={(e) => setCalcRooms(Number(e.target.value))}
                    className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                  />
                  <div className="flex justify-between text-[11px] text-slate-400 font-semibold mt-1">
                    <span>2 Rooms</span>
                    <span>30 Rooms</span>
                    <span>60 Rooms</span>
                  </div>
                </div>

                {/* Nightly Rate Slider */}
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-bold text-slate-700">
                      {isBn ? "গড় প্রতি রাতের ভাড়া (ট্যারিফ)" : "Average Nightly Tariff"}:
                    </span>
                    <span className="text-base font-black text-indigo-600 bg-white px-3 py-1 rounded-lg border border-indigo-100 shadow-2xs">
                      ৳{calcRate.toLocaleString()} / night
                    </span>
                  </div>
                  <input
                    type="range"
                    min="500"
                    max="15000"
                    step="100"
                    value={calcRate}
                    onChange={(e) => setCalcRate(Number(e.target.value))}
                    className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                  />
                  <div className="flex justify-between text-[11px] text-slate-400 font-semibold mt-1">
                    <span>৳500</span>
                    <span>৳7,500</span>
                    <span>৳15,000</span>
                  </div>
                </div>

                {/* Occupancy Rate Slider */}
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-bold text-slate-700">
                      {isBn ? "আনুমানিক অকুপেন্সি রেট" : "Estimated Occupancy Rate"}:
                    </span>
                    <span className="text-base font-black text-indigo-600 bg-white px-3 py-1 rounded-lg border border-indigo-100 shadow-2xs">
                      {calcOccupancy}%
                    </span>
                  </div>
                  <input
                    type="range"
                    min="30"
                    max="95"
                    step="5"
                    value={calcOccupancy}
                    onChange={(e) => setCalcOccupancy(Number(e.target.value))}
                    className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                  />
                  <div className="flex justify-between text-[11px] text-slate-400 font-semibold mt-1">
                    <span>30% Low</span>
                    <span>65% Standard</span>
                    <span>95% Peak</span>
                  </div>
                </div>

              </div>

              {/* Earnings Result Display */}
              <div className="lg:col-span-5 bg-white p-6 sm:p-8 rounded-2xl border border-indigo-100 shadow-sm flex flex-col justify-between space-y-6">
                <div>
                  <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-1">
                    {isBn ? "আপনার আনুমানিক মাসিক মোট আয়" : "Estimated Monthly Revenue"}
                  </span>
                  <div className="text-3xl sm:text-4xl font-black text-slate-900 leading-tight">
                    ৳{calculatedMonthly.toLocaleString()}
                  </div>
                  <span className="text-xs text-slate-500 font-medium">
                    {isBn ? "বার্ষিক আয় প্রায়" : "Annual Projection:"} ৳{(calculatedMonthly * 12).toLocaleString()}
                  </span>
                </div>

                {/* Commission Saved Highlight */}
                <div className="bg-emerald-50 border border-emerald-200 p-4 rounded-xl">
                  <div className="flex items-center gap-2 text-emerald-800 font-bold text-xs mb-1">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>{isBn ? "বিদেশি OTA কমিশন সাশ্রয় (২০%)" : "Saved vs Traditional 20% OTAs"}</span>
                  </div>
                  <div className="text-2xl font-black text-emerald-700">
                    +৳{calculatedCommissionSaved.toLocaleString()} <span className="text-xs font-semibold text-emerald-800">{isBn ? "/ মাস অতিরিক্ত সাশ্রয়" : "/ mo Extra Retained"}</span>
                  </div>
                  <p className="text-[11px] text-emerald-700 mt-1 leading-snug">
                    {isBn 
                      ? "এই টাকাটি কোনো বিদেশি এজেন্সির পকেটে না গিয়ে সরাসরি আপনার নিজস্ব ব্যাংক অ্যাকাউন্টে থাকবে।" 
                      : "Zero commission deducted. 100% of tariff goes directly to your account."}
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => selectPlanAndScroll("Pro Partner")}
                  className="w-full py-3.5 bg-slate-900 hover:bg-indigo-600 text-white font-bold text-xs uppercase tracking-wider rounded-xl transition cursor-pointer flex items-center justify-center gap-2"
                >
                  <span>{isBn ? "এই আয়ের জন্য প্রপার্টি রেজিস্টার করুন" : "Start Earning With This Setup"}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>

            </div>

          </div>
        </section>

        {/* ═══════════════════════════════════════════════════════
            DYNAMIC PLATFORM CAPABILITIES INTERACTIVE TABS
        ══════════════════════════════════════════════════════════ */}
        <section className="py-20 px-4 sm:px-6 md:px-12 lg:px-20 max-w-7xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="text-xs font-bold text-indigo-600 uppercase tracking-widest mb-2">
              {isBn ? "আধুনিক প্রযুক্তি পরিকাঠামো" : "Next-Gen Host Infrastructure"}
            </h2>
            <h3 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
              {isBn ? "আপনার হোটেল পরিচালনার প্রতিটি ধাপ আরও সহজ" : "Engineered Specifically for Bangladeshi Hoteliers"}
            </h3>
          </div>

          {/* Interactive Tab Buttons */}
          <div className="flex flex-wrap justify-center gap-2 sm:gap-3 mb-10">
            {platformFeatures.map((feat, idx) => {
              const Icon = feat.icon;
              const isActive = activeFeatureTab === idx;
              return (
                <button
                  key={feat.id}
                  onClick={() => setActiveFeatureTab(idx)}
                  className={`flex items-center gap-2 px-5 py-3 rounded-2xl text-xs sm:text-sm font-bold transition cursor-pointer ${
                    isActive
                      ? "bg-indigo-600 text-white shadow-lg shadow-indigo-600/25 scale-[1.02]"
                      : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-50"
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? "text-white" : "text-indigo-600"}`} />
                  <span>{feat.title}</span>
                </button>
              );
            })}
          </div>

          {/* Tab Content Display */}
          <div className="bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-10 shadow-xl shadow-slate-100">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              <div className="lg:col-span-7 space-y-5">
                <span className="bg-indigo-50 text-indigo-700 text-xs font-black px-3 py-1 rounded-full border border-indigo-200 inline-block">
                  {platformFeatures[activeFeatureTab].badge}
                </span>
                <h4 className="text-2xl sm:text-3xl font-black text-slate-900 leading-tight">
                  {platformFeatures[activeFeatureTab].heading}
                </h4>
                <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
                  {platformFeatures[activeFeatureTab].description}
                </p>

                <div className="grid grid-cols-3 gap-3 pt-4 border-t border-slate-100">
                  {platformFeatures[activeFeatureTab].stats.map((st, i) => (
                    <div key={i} className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                      <span className="text-[10px] text-slate-400 font-bold uppercase block">{st.label}</span>
                      <span className="text-xs sm:text-sm font-black text-slate-900 mt-0.5 block">{st.value}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="lg:col-span-5 bg-gradient-to-br from-indigo-900 to-slate-900 p-6 rounded-2xl text-white shadow-lg relative overflow-hidden">
                <div className="flex items-center justify-between border-b border-indigo-800/80 pb-3 mb-4">
                  <span className="text-xs font-mono font-bold text-indigo-300">STAYBD / LIVE CONSOLE</span>
                  <span className="flex items-center gap-1.5 text-[11px] text-emerald-400 font-bold">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                    Live Active
                  </span>
                </div>
                <div className="space-y-3 font-mono text-xs">
                  <div className="p-2.5 bg-white/5 rounded-lg border border-white/10 flex justify-between">
                    <span className="text-slate-400">Current Payout:</span>
                    <span className="text-emerald-400 font-bold">৳142,500 Direct bKash</span>
                  </div>
                  <div className="p-2.5 bg-white/5 rounded-lg border border-white/10 flex justify-between">
                    <span className="text-slate-400">Occupancy Sync:</span>
                    <span className="text-indigo-300 font-bold">92% High Season</span>
                  </div>
                  <div className="p-2.5 bg-white/5 rounded-lg border border-white/10 flex justify-between">
                    <span className="text-slate-400">Police NID Audit:</span>
                    <span className="text-emerald-400 font-bold">Verified (All Guests)</span>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => navigate("/owner/login")}
                  className="mt-5 w-full py-2.5 bg-indigo-500 hover:bg-indigo-400 text-white rounded-xl text-xs font-bold transition flex items-center justify-center gap-2 cursor-pointer"
                >
                  <span>{isBn ? "হোস্ট কনসোল প্রিভিউ দেখুন" : "Preview Host Console"}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* ═══════════════════════════════════════════════════════
            STAYBD VS TRADITIONAL OTAs COMPARISON TABLE
        ═══════════════════════════════════════════════════════ */}
        <section className="py-20 px-4 sm:px-6 md:px-12 lg:px-20 max-w-5xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="text-xs font-bold text-indigo-600 uppercase tracking-widest mb-2">
              {isBn ? "তুলনামূলক সুবিধা" : "Unfair Advantage"}
            </h2>
            <h3 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
              {isBn ? "StayBD বনাম প্রচলিত বিদেশি অনলাইন ট্রাভেল এজেন্সি" : "StayBD vs Traditional Online Travel Agencies"}
            </h3>
            <p className="text-slate-500 text-sm mt-2">
              {isBn 
                ? "কেন বাংলাদেশের হাজারো হোটেল মালিক এখন StayBD-কে বেছে নিচ্ছেন" 
                : "Transparent direct hospitality architecture built specifically for Bangladesh."}
            </p>
          </div>

          <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm">
            <div className="grid grid-cols-12 bg-slate-50 p-4 border-b border-slate-200 text-xs font-bold text-slate-600 uppercase tracking-wider">
              <div className="col-span-5 sm:col-span-4">{isBn ? "বৈশিষ্ট্য" : "Feature / Policy"}</div>
              <div className="col-span-4 sm:col-span-4 text-emerald-700 flex items-center gap-1 font-black">
                <span>StayBD</span>
                <span className="bg-emerald-100 text-emerald-800 text-[9px] px-1.5 py-0.2 rounded font-black">DIRECT</span>
              </div>
              <div className="col-span-3 sm:col-span-4 text-slate-400">{isBn ? "অন্যান্য প্রচলিত OTA" : "Foreign OTAs"}</div>
            </div>

            <div className="divide-y divide-slate-100">
              {comparisonPoints.map((pt, i) => (
                <div key={i} className="grid grid-cols-12 p-4 sm:p-5 items-center text-xs sm:text-sm hover:bg-slate-50/50 transition">
                  <div className="col-span-5 sm:col-span-4 font-bold text-slate-900">
                    {pt.feature}
                  </div>
                  <div className="col-span-4 sm:col-span-4 font-bold text-emerald-700 flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>{pt.staybd}</span>
                  </div>
                  <div className="col-span-3 sm:col-span-4 text-slate-500 font-medium">
                    {pt.others}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ═══════════════════════════════════════════════════════
            THE 3 SUBSCRIPTION PLANS (WITH DYNAMIC BILLING TOGGLE)
        ═══════════════════════════════════════════════════════ */}
        <section className="py-24 px-4 sm:px-6 md:px-12 lg:px-20 bg-slate-50 border-t border-slate-200">
          <div className="max-w-7xl mx-auto">
            
            <div className="text-center max-w-2xl mx-auto mb-10">
              <h2 className="text-xs font-bold text-indigo-600 uppercase tracking-widest mb-2">
                {isBn ? "স্বচ্ছ মেম্বারশিপ প্ল্যান" : "Transparent Subscription"}
              </h2>
              <h3 className="text-3xl sm:text-5xl font-black text-slate-900 tracking-tight">
                {isBn ? "সকল আকারের হোটেলের জন্য সহজ প্যাকেজ" : "Simple, predictable plans for every scale"}
              </h3>
              <p className="text-slate-500 text-sm sm:text-base mt-2">
                {isBn ? "কোনো লুকানো ফি নেই। যেকোনো প্ল্যানে ক্লিক করে সরাসরি আবেদন করুন।" : "Zero hidden costs. Click any plan to auto-populate your application."}
              </p>
            </div>

            {/* Dynamic Billing Frequency Switch (Monthly vs Annual 20% Off) */}
            <div className="flex justify-center items-center gap-3 mb-14">
              <span className={`text-xs font-bold ${billingCycle === "monthly" ? "text-slate-900" : "text-slate-500"}`}>
                {isBn ? "মাসিক বিলিং" : "Monthly Billing"}
              </span>
              <button
                type="button"
                onClick={() => setBillingCycle(billingCycle === "annual" ? "monthly" : "annual")}
                className="w-14 h-7 bg-indigo-600 rounded-full p-1 transition cursor-pointer relative"
              >
                <div
                  className={`w-5 h-5 bg-white rounded-full transition-transform ${
                    billingCycle === "annual" ? "translate-x-7" : "translate-x-0"
                  }`}
                />
              </button>
              <div className="flex items-center gap-1.5">
                <span className={`text-xs font-bold ${billingCycle === "annual" ? "text-slate-900" : "text-slate-500"}`}>
                  {isBn ? "বার্ষিক বিলিং" : "Annual Billing"}
                </span>
                <span className="bg-emerald-100 text-emerald-800 text-[10px] font-black px-2 py-0.5 rounded-full border border-emerald-200">
                  {isBn ? "২০% ছাড়" : "SAVE 20%"}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-6xl mx-auto items-stretch">
              {pricingPlans.map((plan) => (
                <div
                  key={plan.name}
                  className={`rounded-3xl p-6 sm:p-8 flex flex-col justify-between transition-all duration-300 relative ${
                    plan.isPopular
                      ? "bg-white border-2 border-indigo-600 shadow-2xl shadow-indigo-100 lg:-translate-y-2"
                      : "bg-white border border-slate-200 shadow-sm hover:border-slate-300"
                  }`}
                >
                  {plan.badge && (
                    <div className="absolute -top-3.5 right-6 bg-indigo-600 text-white text-[10px] font-black uppercase tracking-wider px-3 py-1 rounded-full shadow-md">
                      {plan.badge}
                    </div>
                  )}

                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                        {isBn ? plan.nameBn : plan.name}
                      </span>
                      {plan.isPopular ? (
                        <Zap className="w-5 h-5 text-indigo-600" />
                      ) : (
                        <Award className="w-5 h-5 text-slate-400" />
                      )}
                    </div>

                    <div className="flex items-baseline gap-2 mb-3">
                      <span className="text-4xl font-black text-slate-900">
                        {isBn ? plan.priceBn : plan.price}
                      </span>
                      <span className="text-xs font-bold text-slate-500 uppercase">
                        {isBn ? plan.periodBn : plan.period}
                      </span>
                    </div>

                    <p className="text-xs text-slate-600 font-medium mb-6 leading-relaxed">
                      {isBn ? plan.descBn : plan.desc}
                    </p>

                    <div className="space-y-3 pt-6 border-t border-slate-100 mb-8">
                      {(isBn ? plan.featuresBn : plan.features).map((feat, fIdx) => (
                        <div key={fIdx} className="flex items-start gap-2.5 text-xs text-slate-700 font-medium">
                          <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                          <span>{feat}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => selectPlanAndScroll(plan.name)}
                    className={`w-full py-3.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${
                      plan.isPopular
                        ? "bg-indigo-600 hover:bg-indigo-700 text-white shadow-lg shadow-indigo-600/20"
                        : "bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-200"
                    }`}
                  >
                    {isBn ? `${plan.name} নির্বাচন করুন` : `Choose ${plan.name}`}
                  </button>
                </div>
              ))}
            </div>

          </div>
        </section>

        {/* ═══════════════════════════════════════════════════════
            ONBOARDING WORKFLOW (APPLICATION TO 1ST BOOKING)
        ═══════════════════════════════════════════════════════ */}
        <section className="py-24 px-4 sm:px-6 md:px-12 lg:px-20 max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            
            <div className="space-y-8">
              <div>
                <span className="text-xs font-bold uppercase tracking-widest text-indigo-600 block mb-2">
                  {isBn ? "অনবোর্ডিং ধাপসমূহ" : "The Host Journey"}
                </span>
                <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight leading-tight">
                  {isBn ? "আবেদন থেকে আপনার প্রথম নিশ্চিত বুকিং" : "From online registration to your first verified guest"}
                </h2>
              </div>

              <div className="space-y-6">
                {[
                  {
                    num: "01",
                    title: isBn ? "অনলাইন আবেদন সম্পন্ন করুন" : "Submit Online Application",
                    desc: isBn ? "হোটেল ও যোগাযোগের প্রাথমিক তথ্য দিয়ে ২ মিনিটে আবেদন করুন।" : "Provide property name, room count, and contact credentials."
                  },
                  {
                    num: "02",
                    title: isBn ? "এনআইডি ও প্রপার্টি ভেরিফিকেশন" : "Fast-Track Credentials Review",
                    desc: isBn ? "আমাদের জেলা টিম ৬-১২ ঘণ্টার মধ্যে হোটেলের নিরাপত্তা ও তথ্য যাচাই করে।" : "Our local district team audits readiness within 6–12 hours."
                  },
                  {
                    num: "03",
                    title: isBn ? "রুমের ছবি ও ভাড়া সেটআপ" : "Publish Rooms & Dynamic Tariffs",
                    desc: isBn ? "ড্যাশবোর্ডে রুমের ছবি, সুযোগ-সুবিধা ও প্রতি রাতের ভাড়া নির্ধারণ করুন।" : "Upload photos, set seasonal rates, and sync live inventory."
                  },
                  {
                    num: "04",
                    title: isBn ? "ডিরেক্ট বুকিং ও তাৎক্ষণিক পে-আউট" : "Receive Direct Guests & Instant Cash",
                    desc: isBn ? "অতিথিরা বুকিং করলেই বিকাশ ও ব্যাংকে সম্পূর্ণ টাকা সরাসরি জমা হবে।" : "Watch your calendar fill with verified travellers. Zero commission cuts."
                  }
                ].map((step) => (
                  <div key={step.num} className="flex gap-4 items-start group">
                    <span className="text-2xl font-black text-indigo-600 bg-indigo-50 w-10 h-10 rounded-xl flex items-center justify-center shrink-0">
                      {step.num}
                    </span>
                    <div>
                      <h4 className="text-base font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">
                        {step.title}
                      </h4>
                      <p className="text-xs sm:text-sm text-slate-500 font-medium mt-0.5">
                        {step.desc}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Visual Hospitality Headquarters Showcase */}
            <div className="relative">
              <div className="rounded-3xl overflow-hidden border-4 border-white shadow-2xl relative group">
                <img
                  src="https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&q=80&w=1000"
                  alt="Luxury Hotel"
                  className="w-full h-[400px] object-cover group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent flex flex-col justify-end p-8 text-white">
                  <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider mb-1">
                    StayBD Hospitality Alliance
                  </span>
                  <h4 className="text-xl font-bold">Connecting Bangladesh's Best Accommodations</h4>
                  <p className="text-xs text-slate-300 mt-1">From Saint Martin's Island to Sajek Valley clouds.</p>
                </div>
              </div>

              {/* Floating Verified Trust Pill */}
              <div className="absolute -bottom-6 -left-6 bg-white p-4 sm:p-5 rounded-2xl shadow-xl border border-slate-100 flex items-center gap-3.5 hidden sm:flex">
                <div className="w-12 h-12 bg-emerald-50 rounded-xl flex items-center justify-center">
                  <ShieldCheck className="w-6 h-6 text-emerald-600" />
                </div>
                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">Trust Index</span>
                  <span className="text-base font-black text-slate-900">4.9 / 5 Verified Host Network</span>
                </div>
              </div>
            </div>

          </div>
        </section>

        {/* ═══════════════════════════════════════════════════════
            DYNAMIC FREQUENTLY ASKED QUESTIONS (FILTER & SEARCH)
        ═══════════════════════════════════════════════════════ */}
        <section className="py-20 px-4 sm:px-6 md:px-12 lg:px-20 bg-slate-50 border-t border-slate-200">
          <div className="max-w-4xl mx-auto">
            
            <div className="text-center mb-10">
              <h2 className="text-xs font-bold uppercase tracking-widest text-indigo-600 mb-2">FAQ</h2>
              <h3 className="text-3xl font-black text-slate-900 tracking-tight">
                {isBn ? "সাধারণ জিজ্ঞাসা ও উত্তর" : "Frequently Asked Questions by Property Owners"}
              </h3>
            </div>

            {/* Dynamic Search Bar & Category Filters */}
            <div className="space-y-4 mb-8">
              <div className="relative">
                <Search className="w-4 h-4 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={faqSearch}
                  onChange={(e) => setFaqSearch(e.target.value)}
                  placeholder={isBn ? "প্রশ্ন বা বিষয় দিয়ে অনুসন্ধান করুন (যেমন: কমিশন, পে-আউট, ভেরিফিকেশন)..." : "Search questions (e.g. commission, payouts, verification)..."}
                  className="w-full bg-white border border-slate-200 rounded-2xl pl-11 pr-4 py-3.5 text-xs sm:text-sm outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 shadow-2xs transition"
                />
              </div>

              {/* Category Pills */}
              <div className="flex flex-wrap gap-2 justify-center">
                {[
                  { id: "all", label: isBn ? "সকল প্রশ্ন" : "All" },
                  { id: "payouts", label: isBn ? "পেমেন্ট ও কমিশন" : "Payouts & Cut" },
                  { id: "verification", label: isBn ? "ভেরিফিকেশন" : "Verification" },
                  { id: "pms", label: isBn ? "PMS ও রুম কন্ট্রোল" : "PMS Controls" },
                  { id: "plans", label: isBn ? "প্ল্যান ও মাল্টি-ব্রাঞ্চ" : "Plans & Chains" },
                  { id: "support", label: isBn ? "সাপোর্ট ও যোগাযোগ" : "Support" }
                ].map((cat) => (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => setFaqCategory(cat.id)}
                    className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition cursor-pointer ${
                      faqCategory === cat.id
                        ? "bg-indigo-600 text-white shadow-xs"
                        : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-100"
                    }`}
                  >
                    {cat.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Filtered FAQs Accordion */}
            <div className="space-y-3">
              {filteredFaqs.length === 0 ? (
                <div className="text-center py-10 bg-white rounded-2xl border border-slate-200 p-6">
                  <p className="text-xs sm:text-sm text-slate-500 font-medium">
                    {isBn ? "কোনো প্রশ্ন খুঁজে পাওয়া যায়নি। দয়া করে অন্য শব্দ দিয়ে চেষ্টা করুন।" : "No matching questions found. Try a different search term."}
                  </p>
                </div>
              ) : (
                filteredFaqs.map((faq, idx) => {
                  const isOpen = activeFaq === idx;
                  return (
                    <div
                      key={idx}
                      className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-2xs transition"
                    >
                      <button
                        onClick={() => setActiveFaq(isOpen ? null : idx)}
                        className="w-full p-5 text-left flex items-center justify-between gap-4 font-bold text-slate-900 text-sm sm:text-base cursor-pointer hover:text-indigo-600 transition"
                      >
                        <span>{faq.q}</span>
                        {isOpen ? (
                          <ChevronUp className="w-5 h-5 text-indigo-600 shrink-0" />
                        ) : (
                          <ChevronDown className="w-5 h-5 text-slate-400 shrink-0" />
                        )}
                      </button>
                      {isOpen && (
                        <div className="px-5 pb-5 pt-1 text-xs sm:text-sm text-slate-600 leading-relaxed font-medium border-t border-slate-100">
                          {faq.a}
                        </div>
                      )}
                    </div>
                  );
                })
              )}
            </div>

          </div>
        </section>

        {/* ═══════════════════════════════════════════════════════
            CALL TO ACTION: OWNER PORTAL LOGIN DIRECT LINK
        ═══════════════════════════════════════════════════════ */}
        <section className="py-16 px-4 sm:px-6 md:px-12 lg:px-20 bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white text-center">
          <div className="max-w-3xl mx-auto">
            <h3 className="text-2xl sm:text-4xl font-black mb-4">
              {isBn ? "ইতিমধ্যে রেজিস্টার্ড পার্টনার?" : "Already an Approved Partner?"}
            </h3>
            <p className="text-slate-300 text-sm sm:text-base mb-8 max-w-xl mx-auto">
              {isBn
                ? "আপনার ওনার ড্যাশবোর্ডে লগইন করে লাইভ বুকিং, রুম ইনভেন্টরি ও আর্থিক স্টেটমেন্ট পর্যবেক্ষণ করুন।"
                : "Sign in to your dedicated Owner Dashboard to inspect real-time reservations, calendar dates, and wallet payouts."}
            </p>
            <div className="flex flex-wrap items-center justify-center gap-4">
              <Link
                to="/owner/login"
                className="px-8 py-3.5 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-sm rounded-xl shadow-lg shadow-indigo-600/30 transition flex items-center gap-2"
              >
                <span>{isBn ? "ওনার ড্যাশবোর্ডে লগইন করুন" : "Access Owner Dashboard"}</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <a
                href="tel:09612782923"
                className="px-8 py-3.5 bg-white/10 hover:bg-white/20 text-white border border-white/20 font-bold text-sm rounded-xl transition flex items-center gap-2"
              >
                <PhoneCall className="w-4 h-4 text-emerald-400" />
                <span>{isBn ? "হটলাইন সহায়তা: ০৯৬১২-STAYBD" : "Hotline: 09612-STAYBD"}</span>
              </a>
            </div>
          </div>
        </section>

      </main>

      {/* ═══════════════════════════════════════════════════════
          SUCCESSFUL REGISTRATION INTERACTIVE MODAL
      ═══════════════════════════════════════════════════════ */}
      <AnimatePresence>
        {successApplication && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              className="bg-white rounded-3xl p-6 sm:p-10 max-w-lg w-full shadow-2xl border border-slate-200 text-center relative"
            >
              <button
                onClick={() => setSuccessApplication(null)}
                className="absolute top-4 right-4 text-slate-400 hover:text-slate-700 w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>

              <div className="w-16 h-16 bg-emerald-100 text-emerald-700 rounded-2xl flex items-center justify-center mx-auto mb-5 shadow-sm">
                <CheckCircle2 className="w-8 h-8" />
              </div>

              <span className="text-xs font-bold text-emerald-700 uppercase tracking-widest bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
                Application Submitted Successfully
              </span>

              <h3 className="text-2xl font-black text-slate-900 mt-3 mb-2">
                {isBn ? "অভিনন্দন! আপনার আবেদন গৃহীত হয়েছে" : "Welcome to the StayBD Network!"}
              </h3>

              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed mb-6">
                {isBn
                  ? `আপনার প্রপার্টি "${successApplication.propertyName}" (${successApplication.district}) এর আবেদন সফলভাবে সিস্টেমে যুক্ত হয়েছে।`
                  : `Your property "${successApplication.propertyName}" (${successApplication.district}) is registered.`}
              </p>

              <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 text-left space-y-2 mb-6 text-xs">
                <div className="flex justify-between">
                  <span className="text-slate-500">Application Reference:</span>
                  <span className="font-mono font-bold text-indigo-700">{successApplication.id}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Selected Plan:</span>
                  <span className="font-bold text-slate-900">{successApplication.plan}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Property Type & Location:</span>
                  <span className="font-bold text-slate-800">{successApplication.propertyType} • {successApplication.district}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Status:</span>
                  <span className="font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                    ⏳ Pending Review (6-12h)
                  </span>
                </div>
              </div>

              <div className="space-y-2.5">
                <button
                  onClick={() => navigate("/owner")}
                  className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs uppercase tracking-wider rounded-xl shadow-lg shadow-indigo-600/25 transition cursor-pointer flex items-center justify-center gap-2"
                >
                  <span>{isBn ? "ওনার ড্যাশবোর্ডে প্রবেশ করুন" : "Open Owner Dashboard"}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setSuccessApplication(null)}
                  className="w-full py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl transition cursor-pointer"
                >
                  {isBn ? "ঠিক আছে, পেজে থাকুন" : "Done, Close"}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <Footer />
    </div>
  );
}
