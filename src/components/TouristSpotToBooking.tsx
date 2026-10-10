import React, { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  MapPin, CheckCircle2, SlidersHorizontal, BedDouble, 
  Calendar, Star, CreditCard, ShieldCheck, ArrowRight, Zap, Sparkles,
  X, Scale, QrCode, Check, Building2, Clock, Users, ArrowUpRight,
  Waves, Mountain, Coffee, Trees, ChevronRight, Eye
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { api, Hotel, Room } from "../services/api";

export interface DemoHotel {
  id: string;
  name: string;
  nameBn: string;
  distance: string;
  distanceBn: string;
  rating: number;
  reviews: number;
  price: number;
  roomType: string;
  roomTypeBn: string;
  features: string[];
  featuresBn: string[];
  tag: string;
  tagBn: string;
  image: string;
  availableRooms: number;
  breakfastIncluded: boolean;
  hasAC: boolean;
  freeWifi: boolean;
  cancellationFree: boolean;
}

const DESTINATIONS = [
  { id: "Cox's Bazar", labelEn: "Cox's Bazar", labelBn: "কক্সবাজার", icon: "🌊", badge: "Beachfront" },
  { id: "Sylhet", labelEn: "Sylhet", labelBn: "সিলেট", icon: "🍵", badge: "Tea & Water" },
  { id: "Bandarban", labelEn: "Bandarban", labelBn: "বান্দরবান", icon: "⛰️", badge: "Hill Sanctuary" },
  { id: "Sajek Valley", labelEn: "Sajek Valley", labelBn: "সাজেক ভ্যালি", icon: "☁️", badge: "Above Clouds" },
  { id: "Kuakata", labelEn: "Kuakata", labelBn: "কুয়াকাটা", icon: "🌅", badge: "Sunrise & Sunset" },
  { id: "Sreemangal", labelEn: "Sreemangal", labelBn: "শ্রীমঙ্গল", icon: "🍃", badge: "Rainforest" },
];

const BUDGET_TIERS = [
  { labelEn: "All Budgets", labelBn: "সকল বাজেট", minPrice: 0, maxPrice: 99999 },
  { labelEn: "৳500 (Economy)", labelBn: "৳৫০০ (ইকোনমি)", minPrice: 0, maxPrice: 900 },
  { labelEn: "৳1,000–৳2,500 (Standard)", labelBn: "৳১,০০০–৳২,৫০০ (স্ট্যান্ডার্ড)", minPrice: 901, maxPrice: 3000 },
  { labelEn: "৳5,000+ (Luxury / Resort)", labelBn: "৳৫,০০০+ (লাক্সারি রিসোর্ট)", minPrice: 3001, maxPrice: 99999 },
];

// Fallback curated hotels per destination with rich details
const FALLBACK_HOTELS: Record<string, DemoHotel[]> = {
  "Cox's Bazar": [
    {
      id: "cb-1",
      name: "Sea View Guest House",
      nameBn: "সি ভিউ গেস্ট হাউস",
      distance: "250m from Laboni Beach",
      distanceBn: "লাবণী বিচ থেকে ২৫০ মিটার",
      rating: 4.5,
      reviews: 320,
      price: 500,
      roomType: "Economy Double",
      roomTypeBn: "ইকোনমি ডাবল রুম",
      features: ["Free Wi-Fi", "Attached Bath", "24/7 Security"],
      featuresBn: ["ফ্রি ওয়াই-ফাই", "সংযুক্ত বাথরুম", "২৪/৭ নিরাপত্তা"],
      tag: "Best Budget Choice",
      tagBn: "সেরা বাজেট চয়েস",
      image: "https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=600&q=80",
      availableRooms: 4,
      breakfastIncluded: false,
      hasAC: false,
      freeWifi: true,
      cancellationFree: true,
    },
    {
      id: "cb-2",
      name: "Ocean Wave Hotel & Suites",
      nameBn: "ওশান ওয়েভ হোটেল অ্যান্ড স্যুট",
      distance: "500m from Kolatoli Point",
      distanceBn: "কলাতলী পয়েন্ট থেকে ৫০০ মিটার",
      rating: 4.7,
      reviews: 580,
      price: 1200,
      roomType: "Deluxe AC Twin",
      roomTypeBn: "ডিলাক্স এসি টুইন রুম",
      features: ["AC", "Breakfast Included", "Balcony View"],
      featuresBn: ["শীতাতপ নিয়ন্ত্রিত", "কমপ্লিমেন্টারি নাস্তা", "ব্যালকনি ভিউ"],
      tag: "Top Value Deal",
      tagBn: "টপ ভ্যালু ডিল",
      image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=600&q=80",
      availableRooms: 3,
      breakfastIncluded: true,
      hasAC: true,
      freeWifi: true,
      cancellationFree: true,
    },
    {
      id: "cb-3",
      name: "Ocean Paradise Luxury Resort",
      nameBn: "ওশান প্যারাডাইস লাক্সারি রিসোর্ট",
      distance: "Beachfront / Marine Drive",
      distanceBn: "সরাসরি মেরিন ড্রাইভ বিচফ্রন্ট",
      rating: 4.9,
      reviews: 1420,
      price: 5500,
      roomType: "Executive Sea-Facing Suite",
      roomTypeBn: "এক্সিকিউটিভ সি-ফেসিং স্যুট",
      features: ["Infinity Pool", "Buffet Breakfast", "Spa & Gym", "Airport Shuttle"],
      featuresBn: ["ইনফিনিটি পুল", "বুফে ব্রেকফাস্ট", "স্পা ও জিম", "ফ্রি পিকআপ"],
      tag: "5-Star Premium",
      tagBn: "৫-স্টার প্রিমিয়াম",
      image: "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=600&q=80",
      availableRooms: 5,
      breakfastIncluded: true,
      hasAC: true,
      freeWifi: true,
      cancellationFree: true,
    },
  ],
  "Sylhet": [
    {
      id: "syl-1",
      name: "Surma Budget Inn",
      nameBn: "সুরমা বাজেট ইন",
      distance: "1.2 km from Railway Station",
      distanceBn: "সিলেট রেলওয়ে স্টেশন থেকে ১.২ কিমি",
      rating: 4.3,
      reviews: 190,
      price: 550,
      roomType: "Standard Room",
      roomTypeBn: "স্ট্যান্ডার্ড রুম",
      features: ["Wi-Fi", "Hot Water", "24hr Reception"],
      featuresBn: ["ফ্রি ওয়াই-ফাই", "গরম পানির গিজার", "২৪ ঘণ্টা ফ্রন্ট ডেস্ক"],
      tag: "City Transit Stay",
      tagBn: "সিটি ট্রানজিট",
      image: "https://images.unsplash.com/photo-1591088398332-8a7791972843?auto=format&fit=crop&w=600&q=80",
      availableRooms: 4,
      breakfastIncluded: false,
      hasAC: false,
      freeWifi: true,
      cancellationFree: true,
    },
    {
      id: "syl-2",
      name: "Tea Valley Eco Lodge",
      nameBn: "টি ভ্যালি ইকো লজ",
      distance: "Near Malnicherra Tea Estate",
      distanceBn: "মালনীছড়া চা বাগানের সন্নিকটে",
      rating: 4.7,
      reviews: 410,
      price: 1400,
      roomType: "Cottage Deluxe",
      roomTypeBn: "কটেজ ডিলাক্স",
      features: ["Garden View", "Breakfast", "Tea Tour Guide"],
      featuresBn: ["বাগান ভিউ", "সকালের নাস্তা", "চা বাগান গাইড"],
      tag: "Eco Nature Living",
      tagBn: "ইকো নেচার স্টে",
      image: "https://images.unsplash.com/photo-1618773928121-c32242e63f39?auto=format&fit=crop&w=600&q=80",
      availableRooms: 2,
      breakfastIncluded: true,
      hasAC: true,
      freeWifi: true,
      cancellationFree: true,
    },
    {
      id: "syl-3",
      name: "Grand Sylhet Palace & Resort",
      nameBn: "গ্র্যান্ড সিলেট প্যালেস রিসোর্ট",
      distance: "Airport Road, Sylhet",
      distanceBn: "এয়ারপোর্ট রোড, সিলেট",
      rating: 4.9,
      reviews: 980,
      price: 6200,
      roomType: "Presidential Sky Villa",
      roomTypeBn: "প্রেসিডেন্সিয়াল স্কাই ভিলা",
      features: ["Infinity Pool", "Fine Dining", "Golf Course", "Spa"],
      featuresBn: ["ইনফিনিটি পুল", "ফাইন ডাইনিং", "গলফ কোর্স", "লাক্সারি স্পা"],
      tag: "Luxury Sanctuary",
      tagBn: "লাক্সারি স্যাংচুয়ারি",
      image: "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=600&q=80",
      availableRooms: 3,
      breakfastIncluded: true,
      hasAC: true,
      freeWifi: true,
      cancellationFree: true,
    },
  ],
  "Bandarban": [
    {
      id: "bd-1",
      name: "Sangu River Eco Cottage",
      nameBn: "সাঙ্গু রিভার ইকো কটেজ",
      distance: "400m from Sangu River Bank",
      distanceBn: "সাঙ্গু নদীর তীর থেকে ৪০০ মিটার",
      rating: 4.4,
      reviews: 210,
      price: 580,
      roomType: "Bamboo Eco Room",
      roomTypeBn: "বাঁশের ইকো রুম",
      features: ["River Breeze", "Clean Bath", "Local Tour Help"],
      featuresBn: ["নদীর মনোরম বাতাস", "পরিচ্ছন্ন বাথ", "ট্যুর গাইড সহায়তা"],
      tag: "Nature Budget",
      tagBn: "বাজেট নেচার কটেজ",
      image: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=600&q=80",
      availableRooms: 3,
      breakfastIncluded: false,
      hasAC: false,
      freeWifi: true,
      cancellationFree: true,
    },
    {
      id: "bd-2",
      name: "Nilachal Green View Resort",
      nameBn: "নীলাচল গ্রিন ভিউ রিসোর্ট",
      distance: "1.5 km from Nilachal Viewpoint",
      distanceBn: "নীলাচল ভিউপয়েন্ট থেকে ১.৫ কিমি",
      rating: 4.6,
      reviews: 490,
      price: 1350,
      roomType: "Mountain Deluxe Room",
      roomTypeBn: "মাউন্টেন ভিউ ডিলাক্স",
      features: ["Panoramic Hill View", "Breakfast", "Campfire Yard"],
      featuresBn: ["পাহাড়ের প্যানোরামিক দৃশ্য", "সকালের নাস্তা", "ক্যাম্পফায়ার জোন"],
      tag: "Hill Romance",
      tagBn: "পাহাড়ি আবহ",
      image: "https://images.unsplash.com/photo-1571896349842-33c89424de2d?auto=format&fit=crop&w=600&q=80",
      availableRooms: 2,
      breakfastIncluded: true,
      hasAC: true,
      freeWifi: true,
      cancellationFree: true,
    },
    {
      id: "bd-3",
      name: "Nilgiri Peak Cloud Resort",
      nameBn: "নীলগিরি পিক ক্লাউড রিসোর্ট",
      distance: "Nilgiri Hilltop Sanctuary (2,200ft)",
      distanceBn: "নীলগিরি চূড়া (২২০০ ফুট উচ্চতা)",
      rating: 4.9,
      reviews: 1120,
      price: 5800,
      roomType: "VIP Cloud Chalet",
      roomTypeBn: "ভিআইপি ক্লাউড চালে",
      features: ["360° Cloudscape", "Helipad Access", "Fine Dining", "Security"],
      featuresBn: ["৩৬০° মেঘের খেলা", "হেলিপ্যাড সুবিধা", "ফাইন ডাইনিং", "নিরাপত্তা"],
      tag: "Top of BD",
      tagBn: "দেশের শীর্ষ চূড়া",
      image: "https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=600&q=80",
      availableRooms: 2,
      breakfastIncluded: true,
      hasAC: true,
      freeWifi: true,
      cancellationFree: true,
    },
  ],
  "Sajek Valley": [
    {
      id: "sajek-1",
      name: "Cloud Valley Wooden Cottage",
      nameBn: "ক্লাউড ভ্যালি কাঠের কটেজ",
      distance: "Near Ruilui Para Helipad",
      distanceBn: "রুইলুই পাড়া হেলিপ্যাডের পাশে",
      rating: 4.6,
      reviews: 340,
      price: 750,
      roomType: "Traditional Pine Cottage",
      roomTypeBn: "ঐতিহ্যবাহী পাইন কাঠের কটেজ",
      features: ["Cloud View Balcony", "Attached Bath", "Solar Power"],
      featuresBn: ["মেঘের ব্যালকনি ভিউ", "সংযুক্ত বাথরুম", "সোলার বিদ্যুৎ"],
      tag: "Authentic Stay",
      tagBn: "আসল মেঘের ঘর",
      image: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=600&q=80",
      availableRooms: 3,
      breakfastIncluded: false,
      hasAC: false,
      freeWifi: false,
      cancellationFree: true,
    },
    {
      id: "sajek-2",
      name: "Runmoy Luxury Eco Resort",
      nameBn: "রুনময় লাক্সারি ইকো রিসোর্ট",
      distance: "Sajek Peak, Ruilui Para",
      distanceBn: "সাজেক চূড়া, রুইলুই পাড়া",
      rating: 4.8,
      reviews: 720,
      price: 4500,
      roomType: "Glass Panorama Chalet",
      roomTypeBn: "গ্লাস প্যানোরামা চালে",
      features: ["360° Glass Wall", "Breakfast", "BBQ Facility", "VIP Security"],
      featuresBn: ["৩৬০° গ্লাস ভিউ", "সকালের নাস্তা", "বারবিকিউ সুবিধা", "ভিআইপি গার্ড"],
      tag: "Queen of Clouds",
      tagBn: "মেঘের রানি",
      image: "https://images.unsplash.com/photo-1510798831971-661eb04b3739?auto=format&fit=crop&w=600&q=80",
      availableRooms: 2,
      breakfastIncluded: true,
      hasAC: true,
      freeWifi: true,
      cancellationFree: true,
    }
  ],
  "Kuakata": [
    {
      id: "kua-1",
      name: "Sunset Beach Inn",
      nameBn: "সানসেট বিচ ইন",
      distance: "100m from Zero Point Beach",
      distanceBn: "জিরো পয়েন্ট বিচ থেকে ১০০ মিটার",
      rating: 4.4,
      reviews: 180,
      price: 600,
      roomType: "Standard Twin",
      roomTypeBn: "স্ট্যান্ডার্ড টুইন রুম",
      features: ["Sea Breeze", "Attached Bath", "24/7 Power"],
      featuresBn: ["সমুদ্রের বাতাস", "সংযুক্ত বাথ", "২৪ ঘণ্টা বিদ্যুৎ"],
      tag: "Closest to Beach",
      tagBn: "সৈকতের সবচেয়ে কাছে",
      image: "https://images.unsplash.com/photo-1518837695005-2083093ee35b?auto=format&fit=crop&w=600&q=80",
      availableRooms: 4,
      breakfastIncluded: false,
      hasAC: false,
      freeWifi: true,
      cancellationFree: true,
    },
    {
      id: "kua-2",
      name: "Kuakata Grand Hotel & Sea Resort",
      nameBn: "কুয়াকাটা গ্র্যান্ড হোটেল ও সি রিসোর্ট",
      distance: "Beachfront Marine Promenade",
      distanceBn: "সরাসরি বিচফ্রন্ট মেরিন ড্রাইভ",
      rating: 4.8,
      reviews: 650,
      price: 3800,
      roomType: "Panoramic Ocean Suite",
      roomTypeBn: "প্যানোরামিক ওশান স্যুট",
      features: ["Swimming Pool", "Seafood Restaurant", "Buffet Breakfast"],
      featuresBn: ["সুইমিং পুল", "সিফুড রেস্তোরাঁ", "বুফে নাস্তা"],
      tag: "Beach Luxury",
      tagBn: "বিচ লাক্সারি",
      image: "https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=600&q=80",
      availableRooms: 3,
      breakfastIncluded: true,
      hasAC: true,
      freeWifi: true,
      cancellationFree: true,
    }
  ],
  "Sreemangal": [
    {
      id: "sree-1",
      name: "Lemon Grass Eco Cottage",
      nameBn: "লেমন গ্রাস ইকো কটেজ",
      distance: "Inside Radhanagar Tea Estate",
      distanceBn: "রাধানগর চা বাগানের অভ্যন্তরে",
      rating: 4.7,
      reviews: 420,
      price: 850,
      roomType: "Wooden Eco Cabin",
      roomTypeBn: "কাঠের ইকো কেবিন",
      features: ["Tea Garden View", "Organic Tea Tour", "Breakfast"],
      featuresBn: ["চা বাগান ভিউ", "অর্গানিক টি ট্যুর", "সকালের নাস্তা"],
      tag: "Pure Serenity",
      tagBn: "অনাবিল প্রশান্তি",
      image: "https://images.unsplash.com/photo-1544787219-7f47ccb76574?auto=format&fit=crop&w=600&q=80",
      availableRooms: 3,
      breakfastIncluded: true,
      hasAC: false,
      freeWifi: true,
      cancellationFree: true,
    },
    {
      id: "sree-2",
      name: "Grand Sultan Tea Resort & Golf",
      nameBn: "গ্র্যান্ড সুলতান টি রিসোর্ট ও গলফ",
      distance: "Sreemangal Luxury Zone",
      distanceBn: "শ্রীমঙ্গল লাক্সারি জোন",
      rating: 4.9,
      reviews: 1850,
      price: 8500,
      roomType: "Royal Tea Suite",
      roomTypeBn: "রয়্যাল টি স্যুট",
      features: ["9-Hole Golf Course", "3 Temperature Pools", "Spa & Sauna"],
      featuresBn: ["গলফ কোর্স", "৩টি টেম্পারেচার সুইমিং পুল", "স্পা ও সনা"],
      tag: "5-Star Icon",
      tagBn: "৫-স্টার আইকন",
      image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=600&q=80",
      availableRooms: 4,
      breakfastIncluded: true,
      hasAC: true,
      freeWifi: true,
      cancellationFree: true,
    }
  ]
};

export default function TouristSpotToBooking() {
  const { i18n } = useTranslation();
  const isBn = i18n.language?.startsWith("bn");
  const navigate = useNavigate();

  const [selectedDestination, setSelectedDestination] = useState<string>("Cox's Bazar");
  const [selectedBudgetIndex, setSelectedBudgetIndex] = useState<number>(0);
  const [onlyImmediateAvailable, setOnlyImmediateAvailable] = useState<boolean>(false);
  const [activeStep, setActiveStep] = useState<number>(4);
  const [isCompareOpen, setIsCompareOpen] = useState<boolean>(false);
  const [bookingSuccessModal, setBookingSuccessModal] = useState<DemoHotel | null>(null);

  // Dynamic real hotels sync
  const [realHotels, setRealHotels] = useState<Hotel[]>([]);
  const [realRooms, setRealRooms] = useState<Room[]>([]);

  useEffect(() => {
    Promise.all([api.getAllHotels(), api.getAllRooms()])
      .then(([hList, rList]) => {
        if (Array.isArray(hList) && hList.length > 0) {
          setRealHotels(hList.filter(h => h.isActive));
        }
        if (Array.isArray(rList) && rList.length > 0) {
          setRealRooms(rList);
        }
      })
      .catch(() => {});
  }, []);

  // Compute combined dynamic hotels for selected destination
  const destinationHotels = useMemo(() => {
    const fallback = FALLBACK_HOTELS[selectedDestination] || FALLBACK_HOTELS["Cox's Bazar"];
    
    // Check if any real hotels from database match this destination
    const matchedReal = realHotels.filter(h => {
      const query = selectedDestination.toLowerCase();
      return (
        h.city?.toLowerCase().includes(query) ||
        h.address?.toLowerCase().includes(query) ||
        h.name?.toLowerCase().includes(query)
      );
    });

    if (matchedReal.length > 0) {
      const mappedReal: DemoHotel[] = matchedReal.map(h => {
        const hotelRooms = realRooms.filter(r => r.hotelId === h.id);
        const minPrice = hotelRooms.length > 0 
          ? Math.min(...hotelRooms.map(r => r.pricePerNight)) 
          : 1200;
        const totalAvail = hotelRooms.reduce((acc, r) => acc + (r.availableCount || 1), 0) || 3;

        return {
          id: h.id,
          name: h.name,
          nameBn: h.name,
          distance: h.address || `Central ${selectedDestination}`,
          distanceBn: h.address || `${selectedDestination} কেন্দ্রস্থলে`,
          rating: h.rating || 4.7,
          reviews: h.totalReviews || 120,
          price: minPrice,
          roomType: hotelRooms[0]?.type || "Standard Room",
          roomTypeBn: hotelRooms[0]?.type || "স্ট্যান্ডার্ড রুম",
          features: h.amenities?.slice(0, 4) || ["Free Wi-Fi", "Air Conditioning", "24/7 Support"],
          featuresBn: h.amenities?.slice(0, 4) || ["ফ্রি ওয়াই-ফাই", "শীতাতপ নিয়ন্ত্রিত", "২৪/৭ সার্ভিস"],
          tag: h.isVerified ? "Verified Stay" : "Top Choice",
          tagBn: h.isVerified ? "ভেরিফায়েড হোটেল" : "টপ চয়েস",
          image: h.images?.[0] || fallback[0]?.image || "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=600&q=80",
          availableRooms: totalAvail,
          breakfastIncluded: h.amenities?.some(a => a.toLowerCase().includes("breakfast")) || false,
          hasAC: h.amenities?.some(a => a.toLowerCase().includes("ac")) || true,
          freeWifi: true,
          cancellationFree: true
        };
      });

      // Combine real + fallback (avoiding duplicate names)
      return [...mappedReal, ...fallback.filter(f => !mappedReal.some(m => m.name.toLowerCase() === f.name.toLowerCase()))];
    }

    return fallback;
  }, [selectedDestination, realHotels, realRooms]);

  // Filter hotels by Budget Tier and live availability
  const filteredHotels = useMemo(() => {
    const tier = BUDGET_TIERS[selectedBudgetIndex];
    return destinationHotels.filter(hotel => {
      const matchBudget = hotel.price >= tier.minPrice && hotel.price <= tier.maxPrice;
      const matchAvail = !onlyImmediateAvailable || hotel.availableRooms > 0;
      return matchBudget && matchAvail;
    });
  }, [destinationHotels, selectedBudgetIndex, onlyImmediateAvailable]);

  // Handle direct booking CTA
  const handleBookClick = (hotel: DemoHotel) => {
    // If it's a real hotel ID in system, navigate directly
    if (realHotels.some(h => h.id === hotel.id)) {
      navigate(`/hotel/${hotel.id}`);
    } else {
      setBookingSuccessModal(hotel);
    }
  };

  const steps = [
    { num: "01", title: "Destination", titleBn: "গন্তব্য", desc: "Select tourist spot", descBn: "স্পট নির্বাচন", action: () => setActiveStep(1) },
    { num: "02", title: "Nearby Stays", titleBn: "নিকটবর্তী হোটেল", desc: "Map distance verified", descBn: "সরাসরি দূরত্ব", action: () => setActiveStep(2) },
    { num: "03", title: "Budget Filter", titleBn: "বাজেট ফিল্টার", desc: "৳500 / ৳1,000 / ৳5,000+", descBn: "বাজেট অনুযায়ী", action: () => setActiveStep(3) },
    { num: "04", title: "Live Rooms", titleBn: "লাইভ রুম", desc: "Real-time room count", descBn: "খালি রুমের সংখ্যা", action: () => setActiveStep(4) },
    { num: "05", title: "Compare", titleBn: "তুলনা করুন", desc: "Side-by-side specs", descBn: "পাশাপাশি সুবিধা", action: () => { setActiveStep(5); setIsCompareOpen(true); } },
    { num: "06", title: "Instant Book", titleBn: "তাৎক্ষণিক বুকিং", desc: "Zero markup token", descBn: "০% ফি সহ নিশ্চিত", action: () => setActiveStep(6) },
  ];

  return (
    <section className="py-16 md:py-24 bg-gradient-to-b from-[#FAFAFA] via-white to-[#FAFAFA] border-t border-slate-200/80 relative overflow-hidden">
      {/* Subtle Ambient Decorative Glows */}
      <div className="absolute top-1/3 left-0 w-80 h-80 bg-emerald-500/5 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-10 right-0 w-80 h-80 bg-indigo-500/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-10 md:mb-14">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-black uppercase tracking-wider mb-4 shadow-2xs">
            <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
            <span>{isBn ? "স্মার্ট বাজেট ও স্পট ভিত্তিক হোটেল ফাইন্ডার" : "Direct Destination Stays & Live Room Radar"}</span>
          </div>

          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-slate-900 tracking-tight leading-[1.15]">
            <span>{isBn ? "ট্যুরিস্ট স্পট" : "Tourist Spot"}</span>
            <span className="text-emerald-600 mx-2">→</span>
            <span>{isBn ? "কাছের হোটেল" : "Nearby Hotels"}</span>
            <span className="text-emerald-600 mx-2">→</span>
            <span className="bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
              {isBn ? "ইনস্ট্যান্ট বুকিং" : "Instant Booking"}
            </span>
          </h2>

          <p className="text-slate-600 text-xs sm:text-sm md:text-base mt-3 font-normal leading-relaxed">
            {isBn 
              ? "যেকোনো পর্যটন গন্তব্য নির্বাচন করলেই মধ্যস্বত্বভোগী ছাড়া তাৎক্ষণিকভাবে যাচাইকৃত হোটেল, দূরত্ব, লাইভ রুম প্রাপ্যতা এবং বাজেট তুলনা করে সরাসরি বুকিং করুন।"
              : "Select any tourist destination to instantly discover verified nearby hotels, map distance, live room availability, and budget comparisons without middleman markup."}
          </p>
        </div>

        {/* 6-Stage Interactive Discovery Flow Indicator */}
        <div className="mb-8 md:mb-10">
          <div className="flex items-center justify-between mb-3 px-1">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span>{isBn ? "৬-ধাপের ভেরিফায়েড বুকিং প্রক্রিয়া:" : "6-Stage Verified Discovery Pipeline:"}</span>
            </span>
            <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
              {isBn ? `সক্রিয় ধাপ: ০${activeStep}` : `Active Stage: 0${activeStep}`}
            </span>
          </div>

          <div className="flex lg:grid lg:grid-cols-6 gap-2.5 sm:gap-3 overflow-x-auto pb-3 pt-1 scrollbar-hide -mx-4 px-4 sm:mx-0 sm:px-0 snap-x snap-mandatory">
            {steps.map((st, idx) => {
              const stepNumber = idx + 1;
              const isCurrent = activeStep === stepNumber;
              const isPassed = activeStep > stepNumber;

              return (
                <div
                  key={st.num}
                  onClick={st.action}
                  className={`p-3 sm:p-3.5 rounded-2xl border transition-all cursor-pointer text-left select-none relative group min-w-[140px] sm:min-w-0 flex-shrink-0 snap-start lg:flex-shrink ${
                    isCurrent
                      ? "bg-white border-emerald-500 shadow-md shadow-emerald-500/10 ring-2 ring-emerald-500/20"
                      : isPassed
                      ? "bg-emerald-50/40 border-emerald-200/80 hover:bg-white hover:border-emerald-300"
                      : "bg-white/90 border-slate-200 hover:border-slate-300 shadow-2xs"
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className={`text-[10px] font-black px-2 py-0.5 rounded ${
                      isCurrent
                        ? "bg-emerald-600 text-white"
                        : isPassed
                        ? "bg-emerald-100 text-emerald-800"
                        : "bg-slate-100 text-slate-600 group-hover:bg-slate-200"
                    }`}>
                      {st.num}
                    </span>
                    <CheckCircle2 className={`w-3.5 h-3.5 transition-colors ${
                      isCurrent || isPassed ? "text-emerald-600" : "text-slate-300"
                    }`} />
                  </div>
                  <h4 className={`text-xs md:text-sm font-bold leading-tight ${
                    isCurrent ? "text-slate-900 font-black" : "text-slate-700"
                  }`}>
                    {isBn ? st.titleBn : st.title}
                  </h4>
                  <p className="text-[10px] text-slate-500 mt-1 line-clamp-1">
                    {isBn ? st.descBn : st.desc}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Main Interactive Controls & Live Hotel Radar Canvas */}
        <div className="bg-white border border-slate-200/90 rounded-3xl p-5 md:p-8 shadow-xl shadow-slate-100">
          
          {/* Controls Bar: Destination & Budget */}
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-6 border-b border-slate-200">
            
            {/* Step 1 Selector: Destination */}
            <div className="flex flex-col gap-2.5">
              <label className="text-xs font-bold text-slate-600 uppercase tracking-wider flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-emerald-600" />
                <span>{isBn ? "১. পর্যটন গন্তব্য নির্বাচন করুন:" : "1. Select Tourist Destination:"}</span>
              </label>
              <div className="flex items-center gap-2 flex-wrap">
                {DESTINATIONS.map((dest) => {
                  const isSelected = selectedDestination === dest.id;
                  return (
                    <button
                      key={dest.id}
                      onClick={() => {
                        setSelectedDestination(dest.id);
                        setActiveStep(2);
                      }}
                      className={`relative px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 active:scale-95 cursor-pointer ${
                        isSelected
                          ? "text-white font-black"
                          : "bg-slate-100 text-slate-700 hover:bg-slate-200 border border-slate-200"
                      }`}
                    >
                      {isSelected && (
                        <motion.div
                          layoutId="activeDestinationPill"
                          className="absolute inset-0 bg-emerald-600 rounded-xl shadow-md shadow-emerald-600/25 ring-2 ring-emerald-500/20"
                          transition={{ type: "spring", stiffness: 450, damping: 32 }}
                        />
                      )}
                      <span className="relative z-10">{dest.icon}</span>
                      <span className="relative z-10">{isBn ? dest.labelBn : dest.labelEn}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Step 3 Selector: Budget Filter */}
            <div className="flex flex-col gap-2.5">
              <label className="text-xs font-bold text-slate-600 uppercase tracking-wider flex items-center gap-1.5">
                <SlidersHorizontal className="w-3.5 h-3.5 text-emerald-600" />
                <span>{isBn ? "২. নাগরিকের বাজেট ফিল্টার:" : "2. Filter by Citizen Budget:"}</span>
              </label>
              <div className="flex items-center gap-2 flex-wrap">
                {BUDGET_TIERS.map((tier, idx) => {
                  const isSelected = selectedBudgetIndex === idx;
                  return (
                    <button
                      key={tier.labelEn}
                      onClick={() => {
                        setSelectedBudgetIndex(idx);
                        setActiveStep(3);
                      }}
                      className={`relative px-3.5 py-2 rounded-xl text-xs font-bold transition-all active:scale-95 cursor-pointer ${
                        isSelected
                          ? "text-white font-black"
                          : "bg-slate-100 text-slate-700 hover:bg-slate-200 border border-slate-200"
                      }`}
                    >
                      {isSelected && (
                        <motion.div
                          layoutId="activeBudgetPill"
                          className="absolute inset-0 bg-slate-900 rounded-xl shadow-md shadow-slate-900/20"
                          transition={{ type: "spring", stiffness: 450, damping: 32 }}
                        />
                      )}
                      <span className="relative z-10">{isBn ? tier.labelBn : tier.labelEn}</span>
                    </button>
                  );
                })}
              </div>
            </div>

          </div>

          {/* Sub-bar: Status, Live availability toggle & Compare action */}
          <div className="mt-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4">
            <div className="flex items-center gap-2.5 flex-wrap">
              <span className="relative flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
              </span>
              <h4 className="text-sm md:text-base font-bold text-slate-900">
                {isBn 
                  ? `${DESTINATIONS.find(d => d.id === selectedDestination)?.labelBn || selectedDestination}-এ ভেরিফায়েড হোটেল`
                  : `Verified Stays in ${selectedDestination}`}
              </h4>
              <span className="text-xs bg-emerald-50 text-emerald-800 border border-emerald-200 px-2.5 py-0.5 rounded-full font-bold">
                {isBn 
                  ? `${filteredHotels.length}টি রুম প্রস্তুত`
                  : `${filteredHotels.length} stays available`}
              </span>
            </div>

            <div className="flex items-center gap-2.5 flex-wrap">
              {/* Quick toggle for Live Available Rooms only */}
              <button
                onClick={() => {
                  setOnlyImmediateAvailable(!onlyImmediateAvailable);
                  setActiveStep(4);
                }}
                className={`text-xs px-3.5 py-2 rounded-xl font-bold border transition-all flex items-center gap-1.5 cursor-pointer ${
                  onlyImmediateAvailable
                    ? "bg-emerald-600 text-white border-emerald-600 shadow-sm"
                    : "bg-white text-slate-600 border-slate-200 hover:border-slate-300"
                }`}
              >
                <Zap className={`w-3.5 h-3.5 ${onlyImmediateAvailable ? "text-white" : "text-amber-500"}`} />
                <span>{isBn ? "শুধু খালি রুম দেখুন" : "Instant Live Rooms Only"}</span>
              </button>

              {/* Compare Side-by-Side Modal CTA */}
              <button
                onClick={() => {
                  setActiveStep(5);
                  setIsCompareOpen(true);
                }}
                className="text-xs px-3.5 py-2 rounded-xl font-bold border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 transition-all flex items-center gap-1.5 shadow-2xs cursor-pointer"
              >
                <Scale className="w-3.5 h-3.5 text-indigo-600" />
                <span>{isBn ? "পাশাপাশি তুলনা করুন" : "Compare Side-by-Side"}</span>
              </button>
            </div>
          </div>

          {/* Dynamic Stays Grid with Fluid Morphing */}
          <motion.div 
            layout
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-4"
          >
            <AnimatePresence mode="popLayout">
              {filteredHotels.length === 0 ? (
                <motion.div 
                  key="empty"
                  layout
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="col-span-full text-center py-12 bg-slate-50 rounded-2xl border border-slate-200 p-6"
                >
                  <p className="text-sm text-slate-600 font-semibold">
                    {isBn 
                      ? "এই বাজেটে কোনো হোটেল পাওয়া যায়নি। অনুগ্রহ করে 'সকল বাজেট' নির্বাচন করুন।" 
                      : "No hotels match this budget filter. Please select 'All Budgets' to view all verified stays."}
                  </p>
                  <button
                    onClick={() => setSelectedBudgetIndex(0)}
                    className="mt-3 text-xs bg-slate-900 text-white px-4 py-2 rounded-xl font-bold"
                  >
                    {isBn ? "সকল বাজেট দেখুন" : "View All Budgets"}
                  </button>
                </motion.div>
              ) : (
                filteredHotels.map((hotel, idx) => (
                  <motion.div
                    key={hotel.id}
                    layout
                    initial={{ opacity: 0, scale: 0.92, y: 15 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.92, y: -10 }}
                    transition={{
                      layout: { type: "spring", stiffness: 350, damping: 28 },
                      opacity: { duration: 0.2 },
                      duration: 0.35,
                      delay: idx * 0.04
                    }}
                    className="group bg-white rounded-2xl border border-slate-200/90 overflow-hidden shadow-sm hover:shadow-xl hover:border-emerald-400/50 hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between"
                  >
                    {/* Image & Quick Distance/Badge */}
                    <div className="relative h-44 w-full overflow-hidden bg-slate-100">
                      <img
                        src={hotel.image}
                        alt={hotel.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        loading="lazy"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-black/20" />
                      
                      {/* Top Badges */}
                      <div className="absolute top-3 left-3 right-3 flex items-center justify-between">
                        <span className="bg-white/90 backdrop-blur-md text-slate-900 text-[10px] font-black px-2.5 py-1 rounded-full shadow-2xs border border-white/40">
                          {isBn ? hotel.tagBn : hotel.tag}
                        </span>
                        
                        <span className="bg-slate-950/80 text-emerald-400 text-[10px] font-black px-2.5 py-1 rounded-full border border-emerald-500/30 flex items-center gap-1 shadow-sm">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                          <span>{hotel.availableRooms} {isBn ? "রুম খালি" : "rooms left"}</span>
                        </span>
                      </div>

                      {/* Bottom Image Distance Pill */}
                      <div className="absolute bottom-2.5 left-3 right-3 flex items-center justify-between text-white text-xs">
                        <div className="flex items-center gap-1 font-medium truncate">
                          <MapPin className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                          <span className="truncate">{isBn ? hotel.distanceBn : hotel.distance}</span>
                        </div>
                        <div className="flex items-center gap-1 bg-black/40 px-2 py-0.5 rounded-md text-[11px] font-bold shrink-0">
                          <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
                          <span>{hotel.rating}</span>
                        </div>
                      </div>
                    </div>

                    {/* Card Details */}
                    <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                      <div>
                        <h4 className="font-bold text-slate-900 text-base leading-tight group-hover:text-emerald-700 transition-colors">
                          {isBn ? hotel.nameBn : hotel.name}
                        </h4>
                        <div className="flex items-center gap-1 text-xs text-slate-500 font-medium mt-1">
                          <BedDouble className="w-3.5 h-3.5 text-slate-400" />
                          <span>{isBn ? hotel.roomTypeBn : hotel.roomType}</span>
                        </div>

                        {/* Feature Badges */}
                        <div className="flex flex-wrap gap-1.5 mt-3">
                          {(isBn ? hotel.featuresBn : hotel.features).map((feat, fIdx) => (
                            <span
                              key={fIdx}
                              className="text-[10px] bg-slate-100 text-slate-700 px-2 py-0.5 rounded-md font-medium"
                            >
                              {feat}
                            </span>
                          ))}
                        </div>
                      </div>

                      {/* Pricing & CTA */}
                      <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                        <div>
                          <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                            {isBn ? "সরাসরি রেট" : "Direct Rate"}
                          </div>
                          <div className="text-base sm:text-lg font-black text-emerald-600">
                            ৳{hotel.price.toLocaleString()} <span className="text-[10px] font-normal text-slate-500">{isBn ? "/ রাত" : "/ night"}</span>
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => {
                              setActiveStep(5);
                              setIsCompareOpen(true);
                            }}
                            className="p-2.5 rounded-xl border border-slate-200 hover:bg-slate-100 text-slate-600 transition cursor-pointer"
                            title="Compare hotel"
                          >
                            <Scale className="w-4 h-4" />
                          </button>
                          
                          <button
                            onClick={() => handleBookClick(hotel)}
                            className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl transition flex items-center gap-1.5 shadow-md shadow-emerald-600/20 active:scale-95 cursor-pointer"
                          >
                            <span>{isBn ? "বুক করুন" : "Book"}</span>
                            <ArrowRight className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>

                    </div>
                  </motion.div>
                ))
              )}
            </AnimatePresence>
          </motion.div>

          {/* Footer Note and Direct Link */}
          <div className="mt-8 pt-4 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-2">
            <div className="flex items-center gap-1.5 font-medium">
              <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>
                {isBn 
                  ? "১০০% ভেরিফায়েড • কোনো মধ্যস্বত্বভোগী বা হিডেন কমিশন ছাড়া সরাসরি হোটেল প্রাইসিং।" 
                  : "100% Verified • Direct Hotel Pricing with Zero Hidden Platform Markup."}
              </span>
            </div>
            <button
              onClick={() => navigate(`/spot/${selectedDestination.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`)}
              className="font-bold text-emerald-700 hover:text-emerald-800 flex items-center gap-1 cursor-pointer"
            >
              <span>{isBn ? `${selectedDestination}-এর সকল হোটেল দেখুন` : `Explore all stays in ${selectedDestination}`}</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>

        </div>

      </div>

      {/* Side-by-Side Comparison Drawer Modal */}
      <AnimatePresence>
        {isCompareOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              className="bg-white rounded-3xl p-6 sm:p-8 max-w-4xl w-full shadow-2xl border border-slate-200 relative max-h-[90vh] overflow-y-auto"
            >
              <button
                onClick={() => setIsCompareOpen(false)}
                className="absolute top-5 right-5 text-slate-400 hover:text-slate-700 w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>

              <div className="flex items-center gap-2.5 mb-6">
                <span className="p-2 bg-indigo-50 text-indigo-600 rounded-xl border border-indigo-100">
                  <Scale className="w-5 h-5" />
                </span>
                <div>
                  <h3 className="text-xl sm:text-2xl font-black text-slate-900">
                    {isBn ? `${selectedDestination} হোটেল তুলনা (Side-by-Side)` : `Side-by-Side Hotel Comparison (${selectedDestination})`}
                  </h3>
                  <p className="text-xs text-slate-500">Compare distance, verified room amenities, and zero-markup direct pricing</p>
                </div>
              </div>

              {/* Comparison Table */}
              <div className="overflow-x-auto border border-slate-200 rounded-2xl">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-200">
                      <th className="p-3.5 font-bold text-slate-600">Feature</th>
                      {filteredHotels.slice(0, 3).map(h => (
                        <th key={h.id} className="p-3.5 font-bold text-slate-900 min-w-[160px]">
                          {isBn ? h.nameBn : h.name}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    <tr>
                      <td className="p-3.5 font-semibold text-slate-500">Nightly Rate</td>
                      {filteredHotels.slice(0, 3).map(h => (
                        <td key={h.id} className="p-3.5 font-black text-emerald-600 text-sm">
                          ৳{h.price.toLocaleString()} / night
                        </td>
                      ))}
                    </tr>
                    <tr>
                      <td className="p-3.5 font-semibold text-slate-500">Distance from Attraction</td>
                      {filteredHotels.slice(0, 3).map(h => (
                        <td key={h.id} className="p-3.5 font-medium text-slate-800">
                          {isBn ? h.distanceBn : h.distance}
                        </td>
                      ))}
                    </tr>
                    <tr>
                      <td className="p-3.5 font-semibold text-slate-500">Room Category</td>
                      {filteredHotels.slice(0, 3).map(h => (
                        <td key={h.id} className="p-3.5 font-medium text-slate-700">
                          {isBn ? h.roomTypeBn : h.roomType}
                        </td>
                      ))}
                    </tr>
                    <tr>
                      <td className="p-3.5 font-semibold text-slate-500">Breakfast Included</td>
                      {filteredHotels.slice(0, 3).map(h => (
                        <td key={h.id} className="p-3.5">
                          {h.breakfastIncluded ? (
                            <span className="text-emerald-700 font-bold flex items-center gap-1">
                              <Check className="w-3.5 h-3.5 text-emerald-600" /> Free Breakfast
                            </span>
                          ) : (
                            <span className="text-slate-400">Not Included</span>
                          )}
                        </td>
                      ))}
                    </tr>
                    <tr>
                      <td className="p-3.5 font-semibold text-slate-500">Air Conditioning (AC)</td>
                      {filteredHotels.slice(0, 3).map(h => (
                        <td key={h.id} className="p-3.5">
                          {h.hasAC ? (
                            <span className="text-indigo-600 font-bold flex items-center gap-1">
                              <Check className="w-3.5 h-3.5 text-indigo-600" /> Yes (AC)
                            </span>
                          ) : (
                            <span className="text-slate-400">Non-AC Room</span>
                          )}
                        </td>
                      ))}
                    </tr>
                    <tr>
                      <td className="p-3.5 font-semibold text-slate-500">Live Available Count</td>
                      {filteredHotels.slice(0, 3).map(h => (
                        <td key={h.id} className="p-3.5 font-bold text-slate-900">
                          {h.availableRooms} rooms available
                        </td>
                      ))}
                    </tr>
                    <tr>
                      <td className="p-3.5 font-semibold text-slate-500">Direct Booking</td>
                      {filteredHotels.slice(0, 3).map(h => (
                        <td key={h.id} className="p-3.5">
                          <button
                            onClick={() => {
                              setIsCompareOpen(false);
                              handleBookClick(h);
                            }}
                            className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold text-xs transition"
                          >
                            Book at ৳{h.price}
                          </button>
                        </td>
                      ))}
                    </tr>
                  </tbody>
                </table>
              </div>

            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Booking QR / Success Modal */}
      <AnimatePresence>
        {bookingSuccessModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl border border-slate-200 text-center relative"
            >
              <button
                onClick={() => setBookingSuccessModal(null)}
                className="absolute top-4 right-4 text-slate-400 hover:text-slate-700 w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>

              <div className="w-16 h-16 bg-emerald-100 text-emerald-700 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-sm">
                <QrCode className="w-8 h-8" />
              </div>

              <span className="text-xs font-bold text-emerald-700 uppercase tracking-wider bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
                Direct Reservation Access
              </span>

              <h3 className="text-2xl font-black text-slate-900 mt-3 mb-1">
                {isBn ? bookingSuccessModal.nameBn : bookingSuccessModal.name}
              </h3>

              <p className="text-xs text-slate-500 mb-5">
                {isBn ? bookingSuccessModal.distanceBn : bookingSuccessModal.distance}
              </p>

              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 text-left space-y-2 text-xs mb-6">
                <div className="flex justify-between">
                  <span className="text-slate-500">Room Type:</span>
                  <span className="font-bold text-slate-900">{isBn ? bookingSuccessModal.roomTypeBn : bookingSuccessModal.roomType}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Tariff per Night:</span>
                  <span className="font-black text-emerald-600">৳{bookingSuccessModal.price.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Commission / Hidden Markup:</span>
                  <span className="font-bold text-emerald-700">৳০ (Zero Middleman)</span>
                </div>
              </div>

              <button
                onClick={() => {
                  setBookingSuccessModal(null);
                  navigate(`/hotel/${bookingSuccessModal.id}`);
                }}
                className="w-full py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs uppercase tracking-wider rounded-xl shadow-lg shadow-emerald-600/25 transition flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>{isBn ? "হোটেল ডিটেইলসে যান" : "View Full Hotel Details"}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </section>
  );
}
