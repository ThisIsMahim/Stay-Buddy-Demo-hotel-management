import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  X, MapPin, Star, ShieldCheck, CheckCircle2, BedDouble, 
  SlidersHorizontal, Sparkles, ArrowRight, Zap, Coffee, 
  Wifi, Waves, Wind, PhoneCall, ExternalLink, Calendar,
  Users, CreditCard, QrCode, Check, Printer, ChevronRight,
  Phone, Mail, Loader2, Eye
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { TouristSpot } from "./ExploreBangladeshMap";
import { api, Hotel, Room } from "../services/api";

export interface SpotHotel {
  id: string;
  name: string;
  nameBn: string;
  distance: string;
  distanceBn: string;
  rating: number;
  reviews: number;
  price: number;
  originalPrice?: number;
  roomType: string;
  roomTypeBn: string;
  image: string;
  features: string[];
  featuresBn: string[];
  tag: string;
  tagBn: string;
  availableRooms: number;
  destinationCity: string;
}

export const SPOT_HOTELS: Record<string, SpotHotel[]> = {
  "coxs-bazar": [
    {
      id: "cb-1",
      name: "Sea View Guest House",
      nameBn: "সি ভিউ গেস্ট হাউস",
      distance: "250m from Laboni Beach Point",
      distanceBn: "লাবণী বিচ পয়েন্ট থেকে ২৫০ মিটার",
      rating: 4.5,
      reviews: 340,
      price: 500,
      originalPrice: 750,
      roomType: "Economy Double Room",
      roomTypeBn: "ইকোনমি ডাবল রুম",
      features: ["Free Wi-Fi", "Attached Bath", "24/7 Security"],
      featuresBn: ["ফ্রি ওয়াই-ফাই", "সংযুক্ত বাথরুম", "২৪/৭ নিরাপত্তা"],
      tag: "Best Budget Choice",
      tagBn: "সেরা বাজেট চয়েস",
      image: "https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=600&q=80",
      availableRooms: 4,
      destinationCity: "Cox's Bazar"
    },
    {
      id: "cb-2",
      name: "Ocean Wave Hotel & Suites",
      nameBn: "ওশান ওয়েভ হোটেল অ্যান্ড স্যুট",
      distance: "500m from Kolatoli Main Point",
      distanceBn: "কলাতলী মোড় থেকে ৫০০ মিটার",
      rating: 4.7,
      reviews: 620,
      price: 1200,
      originalPrice: 1600,
      roomType: "Deluxe Sea-Breeze AC Twin",
      roomTypeBn: "ডিলাক্স সি-ব্রিজ এসি টুইন রুম",
      features: ["AC", "Breakfast Included", "Balcony View"],
      featuresBn: ["শীতাতপ নিয়ন্ত্রিত", "কমপ্লিমেন্টারি নাস্তা", "ব্যালকনি ভিউ"],
      tag: "Top Value Deal",
      tagBn: "টপ ভ্যালু ডিল",
      image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=600&q=80",
      availableRooms: 2,
      destinationCity: "Cox's Bazar"
    },
    {
      id: "cb-3",
      name: "Ocean Paradise Luxury Beach Resort",
      nameBn: "ওশান প্যারাডাইস লাক্সারি বিচ রিসোর্ট",
      distance: "Beachfront Marine Drive",
      distanceBn: "সরাসরি মেরিন ড্রাইভ বিচফ্রন্ট",
      rating: 4.9,
      reviews: 1540,
      price: 5500,
      originalPrice: 7000,
      roomType: "Executive Panoramic Sea Suite",
      roomTypeBn: "এক্সিকিউটিভ প্যানোরামিক সি স্যুট",
      features: ["Infinity Pool", "Buffet Breakfast", "Spa & Gym", "Airport Pickup"],
      featuresBn: ["ইনফিনিটি পুল", "বুফে ব্রেকফাস্ট", "স্পা ও জিম", "এয়ারপোর্ট পিকআপ"],
      tag: "5-Star Luxury",
      tagBn: "৫-তারকা লাক্সারি",
      image: "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=600&q=80",
      availableRooms: 5,
      destinationCity: "Cox's Bazar"
    }
  ],
  "saint-martins": [
    {
      id: "sm-1",
      name: "Coral Cove Budget Eco Lodge",
      nameBn: "কোরাল কোভ বাজেট ইকো লজ",
      distance: "150m from West Beach",
      distanceBn: "পশ্চিম সৈকত থেকে ১৫০ মিটার",
      rating: 4.4,
      reviews: 180,
      price: 600,
      roomType: "Traditional Coconut Shade Cottage",
      roomTypeBn: "ঐতিহ্যবাহী নারিকেল কুঞ্জ কটেজ",
      features: ["Solar Power", "Fresh Water", "Attached Bath"],
      featuresBn: ["সৌর বিদ্যুৎ", "মিঠা পানি", "সংযুক্ত বাথরুম"],
      tag: "Eco Friendly",
      tagBn: "পরিবেশবান্ধব স্টে",
      image: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=600&q=80",
      availableRooms: 3,
      destinationCity: "Cox's Bazar"
    },
    {
      id: "sm-2",
      name: "Blue Marine Coral Beach Resort",
      nameBn: "ব্লু মেরিন কোরাল বিচ রিসোর্ট",
      distance: "Direct Oceanfront Point",
      distanceBn: "সরাসরি সমুদ্র সৈকত সংলগ্ন",
      rating: 4.7,
      reviews: 490,
      price: 1400,
      originalPrice: 1800,
      roomType: "Deluxe Sea-Facing Cottage",
      roomTypeBn: "ডিলাক্স সি-ফেসিং কটেজ",
      features: ["Sea View", "BBQ Facility", "Breakfast"],
      featuresBn: ["সরাসরি সি-ভিউ", "বারবিকিউ সুবিধা", "সকালের নাস্তা"],
      tag: "Top Rated Island Stay",
      tagBn: "দ্বীপের সেরা রেটেড রিসোর্ট",
      image: "https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=600&q=80",
      availableRooms: 4,
      destinationCity: "Cox's Bazar"
    },
    {
      id: "sm-3",
      name: "Saint Martin's Luxury Island Chalet",
      nameBn: "সেন্ট মার্টিন লাক্সারি আইল্যান্ড চালে",
      distance: "Private Coral Reef Shore",
      distanceBn: "প্রাইভেট প্রবাল সৈকত তীর",
      rating: 4.9,
      reviews: 730,
      price: 5200,
      roomType: "Presidential Island Villa",
      roomTypeBn: "প্রেসিডেন্সিয়াল আইল্যান্ড ভিলা",
      features: ["Private Sundeck", "Seafood Buffet", "Snorkeling Tour"],
      featuresBn: ["প্রাইভেট সানডেক", "সিফুড বুফে", "স্নরকেলিং গাইড"],
      tag: "Exclusive Luxury",
      tagBn: "এক্সক্লুসিভ লাক্সারি",
      image: "https://images.unsplash.com/photo-1571896349842-33c89424de2d?auto=format&fit=crop&w=600&q=80",
      availableRooms: 2,
      destinationCity: "Cox's Bazar"
    }
  ],
  "kuakata": [
    {
      id: "kk-1",
      name: "Sagar Konna Budget Rest House",
      nameBn: "সাগর কন্যা বাজেট রেস্ট হাউস",
      distance: "250m from Zero Point",
      distanceBn: "জিরো পয়েন্ট থেকে ২৫০ মিটার",
      rating: 4.3,
      reviews: 160,
      price: 500,
      roomType: "Standard Twin Room",
      roomTypeBn: "স্ট্যান্ডার্ড টুইন রুম",
      features: ["Wi-Fi", "Attached Bath", "Sea Breeze"],
      featuresBn: ["ওয়াই-ফাই", "সংযুক্ত বাথ", "সৈকতের বাতাস"],
      tag: "Budget Friendly",
      tagBn: "সাশ্রয়ী আবাসন",
      image: "https://images.unsplash.com/photo-1518837695005-2083093ee35b?auto=format&fit=crop&w=600&q=80",
      availableRooms: 5,
      destinationCity: "Barisal"
    },
    {
      id: "kk-2",
      name: "Kuakata Sunrise Deluxe Hotel",
      nameBn: "কুয়াকাটা সানরাইজ ডিলাক্স হোটেল",
      distance: "Beachfront East End",
      distanceBn: "পূর্ব সৈকত বিচফ্রন্ট",
      rating: 4.6,
      reviews: 380,
      price: 1250,
      originalPrice: 1600,
      roomType: "Deluxe Sea-Facing Room",
      roomTypeBn: "ডিলাক্স সি-ফেসিং রুম",
      features: ["AC", "Breakfast", "Sunrise Balcony"],
      featuresBn: ["শীতাতপ নিয়ন্ত্রিত", "সকালের নাস্তা", "সানরাইজ ব্যালকনি"],
      tag: "Sunrise & Sunset",
      tagBn: "সূর্যোদয় ও সূর্যাস্ত",
      image: "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?auto=format&fit=crop&w=600&q=80",
      availableRooms: 3,
      destinationCity: "Barisal"
    },
    {
      id: "kk-3",
      name: "Kuakata Grand Beachfront Resort",
      nameBn: "কুয়াকাটা গ্র্যান্ড বিচফ্রন্ট রিসোর্ট",
      distance: "Direct Oceanfront Private Access",
      distanceBn: "সরাসরি নিজস্ব সমুদ্র সৈকত",
      rating: 4.9,
      reviews: 820,
      price: 5000,
      roomType: "Presidential Ocean Villa",
      roomTypeBn: "প্রেসিডেন্সিয়াল ওশান ভিলা",
      features: ["Swimming Pool", "Seafood Buffet", "Spa & Lawn"],
      featuresBn: ["সুইমিং পুল", "সি-ফুড বুফে", "স্পা ও লন লাউঞ্জ"],
      tag: "5-Star Oceanfront",
      tagBn: "৫-তারকা বিচফ্রন্ট",
      image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=600&q=80",
      availableRooms: 4,
      destinationCity: "Barisal"
    }
  ],
  "sundarbans": [
    {
      id: "sb-1",
      name: "Mangrove River Forest Rest Inn",
      nameBn: "ম্যানগ্রোভ রিভার ফরেস্ট রেস্ট ইন",
      distance: "300m from Forest Entry Ghat",
      distanceBn: "বন বিভাগ ঘাট থেকে ৩০০ মিটার",
      rating: 4.4,
      reviews: 210,
      price: 650,
      roomType: "Eco Timber Room",
      roomTypeBn: "ইকো কাঠের ঘর",
      features: ["River View", "Clean Bath", "Forest Guide"],
      featuresBn: ["নদী ভিউ", "পরিচ্ছন্ন বাথ", "ফরেস্ট গাইড"],
      tag: "Wild Forest Entry",
      tagBn: "ম্যানগ্রোভ প্রবেশদ্বার",
      image: "https://images.unsplash.com/photo-1448375240586-882707db888b?auto=format&fit=crop&w=600&q=80",
      availableRooms: 4,
      destinationCity: "Khulna"
    },
    {
      id: "sb-2",
      name: "Sundarbans Eco Village Resort",
      nameBn: "সুন্দরবন ইকো ভিলেজ রিসোর্ট",
      distance: "Canal Bank Sanctuary",
      distanceBn: "পশু খালে অবস্থিত প্রাকৃতিক লজ",
      rating: 4.7,
      reviews: 510,
      price: 1500,
      roomType: "Cottage with Creek Balcony",
      roomTypeBn: "খাল ভিউ ব্যালকনি কটেজ",
      features: ["Canal Safari", "Organic Food", "Hot Water"],
      featuresBn: ["ক্যানেল ক্রুজ", "দেশি খাবার", "গরম পানি"],
      tag: "UNESCO Mangrove",
      tagBn: "ইউনেস্কো ইকো রিসোর্ট",
      image: "https://images.unsplash.com/photo-1518495973542-4542c06a5843?auto=format&fit=crop&w=600&q=80",
      availableRooms: 3,
      destinationCity: "Khulna"
    },
    {
      id: "sb-3",
      name: "Royal Bengal Luxury Cruise Houseboat",
      nameBn: "রয়েল বেঙ্গল লাক্সারি ক্রুজ হাউসবোট",
      distance: "Deep Mangrove Waterway",
      distanceBn: "গভীর সুন্দরবন নদী চ্যানেল",
      rating: 4.9,
      reviews: 680,
      price: 5800,
      roomType: "VIP Floating Cabin Suite",
      roomTypeBn: "ভিআইপি ভাসমান কেবিন স্যুট",
      features: ["Full AC", "Chef Onboard", "Armed Forest Guard", "Wildlife Safari"],
      featuresBn: ["সম্পূর্ণ এসি", "অনবোর্ড শেফ", "সশস্ত্র বনরক্ষী", "ওয়াইল্ডলাইফ সাফারি"],
      tag: "5-Star Cruise",
      tagBn: "৫-তারকা ক্রুজ",
      image: "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=600&q=80",
      availableRooms: 2,
      destinationCity: "Khulna"
    }
  ],
  "ratargul": [
    {
      id: "rt-1",
      name: "Ratargul Swamp Eco Lodge",
      nameBn: "রাতারগুল সোয়াম্প ইকো লজ",
      distance: "250m from Boat Terminal",
      distanceBn: "নৌকা ঘাট থেকে ২৫০ মিটার",
      rating: 4.5,
      reviews: 240,
      price: 550,
      roomType: "Bamboo Swamp View Room",
      roomTypeBn: "বাঁশের সোয়াম্প ভিউ রুম",
      features: ["Free Wi-Fi", "Fresh Lake Water", "Boat Guide"],
      featuresBn: ["ফ্রি ওয়াই-ফাই", "ঝরনার পানি", "নৌকা চালক সহায়তা"],
      tag: "Amazon of BD",
      tagBn: "বাংলার আমাজন স্টে",
      image: "https://images.unsplash.com/photo-1542273917363-3b1817f69a2d?auto=format&fit=crop&w=600&q=80",
      availableRooms: 4,
      destinationCity: "Sylhet"
    },
    {
      id: "rt-2",
      name: "Forest Breeze Green Resort Sylhet",
      nameBn: "ফরেস্ট ব্রিজ গ্রিন রিসোর্ট সিলেট",
      distance: "1.2 km from Swamp Entrance",
      distanceBn: "সোয়াম্প প্রবেশদ্বার থেকে ১.২ কিমি",
      rating: 4.7,
      reviews: 430,
      price: 1300,
      originalPrice: 1700,
      roomType: "Deluxe Nature Cottage",
      roomTypeBn: "ডিলাক্স নেচার কটেজ",
      features: ["AC", "Breakfast", "Tea Garden View"],
      featuresBn: ["শীতাতপ নিয়ন্ত্রিত", "সকালের নাস্তা", "চা বাগান ভিউ"],
      tag: "Eco Retreat",
      tagBn: "ইকো রিট্রিট",
      image: "https://images.unsplash.com/photo-1618773928121-c32242e63f39?auto=format&fit=crop&w=600&q=80",
      availableRooms: 3,
      destinationCity: "Sylhet"
    },
    {
      id: "rt-3",
      name: "Shanti Valley Luxury Resort & Spa",
      nameBn: "শান্তি ভ্যালি লাক্সারি রিসোর্ট অ্যান্ড স্পা",
      distance: "Private Lakefront Estate",
      distanceBn: "প্রাইভেট লেক সংলগ্ন লাক্সারি এস্টেট",
      rating: 4.9,
      reviews: 890,
      price: 5400,
      roomType: "Presidential Water Villa",
      roomTypeBn: "প্রেসিডেন্সিয়াল ওয়াটার ভিলা",
      features: ["Infinity Pool", "Helipad Access", "Fine Dining", "Spa"],
      featuresBn: ["ইনফিনিটি পুল", "হেলিপ্যাড সুবিধা", "ফাইন ডাইনিং", "লাক্সারি স্পা"],
      tag: "5-Star Sanctuary",
      tagBn: "৫-তারকা স্যাংচুয়ারি",
      image: "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=600&q=80",
      availableRooms: 2,
      destinationCity: "Sylhet"
    }
  ],
  "sajek-valley": [
    {
      id: "sj-1",
      name: "Megh Roddur Hill Cottage",
      nameBn: "মেঘ রোদ্দুর হিল কটেজ",
      distance: "Ruilui Para, Sajek Ridge",
      distanceBn: "রুইলুই পাড়া, সাজেক মূল শৈলশিরা",
      rating: 4.4,
      reviews: 290,
      price: 600,
      roomType: "Traditional Wooden Hill Room",
      roomTypeBn: "ঐতিহ্যবাহী কাঠের হিল রুম",
      features: ["Sunrise View", "Fresh Mountain Water", "Solar Power"],
      featuresBn: ["সূর্যোদয় ভিউ", "পাহাড়ি মিষ্টি পানি", "সৌর বিদ্যুৎ"],
      tag: "Authentic Sajek",
      tagBn: "আসল সাজেক কটেজ",
      image: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=600&q=80",
      availableRooms: 3,
      destinationCity: "Chittagong"
    },
    {
      id: "sj-2",
      name: "Ruilui Cloud Breeze Resort",
      nameBn: "রুইলুই ক্লাউড ব্রিজ রিসোর্ট",
      distance: "Main Sajek Viewpoint",
      distanceBn: "সাজেক মূল ভিউপয়েন্ট",
      rating: 4.7,
      reviews: 670,
      price: 1500,
      originalPrice: 2000,
      roomType: "Premium Cloud Balcony Suite",
      roomTypeBn: "প্রিমিয়াম ক্লাউড ব্যালকনি স্যুট",
      features: ["Open Sky Balcony", "Breakfast", "24/7 Power", "Wi-Fi"],
      featuresBn: ["ওপেন স্কাই ব্যালকনি", "সকালের নাস্তা", "২৪ ঘণ্টা বিদ্যুৎ", "ওয়াই-ফাই"],
      tag: "Kingdom of Clouds",
      tagBn: "মেঘের রাজ্য চয়েস",
      image: "https://images.unsplash.com/photo-1584132967334-10e028bd69f7?auto=format&fit=crop&w=600&q=80",
      availableRooms: 2,
      destinationCity: "Chittagong"
    },
    {
      id: "sj-3",
      name: "Sajek Sky High Cloud Villa",
      nameBn: "সাজেক স্কাই হাই ক্লাউড ভিলা",
      distance: "Konglak Peak Trailhead",
      distanceBn: "কংলাক পাহাড় চূড়া ট্রেইলহেড",
      rating: 4.9,
      reviews: 910,
      price: 5200,
      roomType: "Luxury Cloud Duplex Chalet",
      roomTypeBn: "লাক্সারি ক্লাউড ডুপ্লেক্স চালে",
      features: ["Infinity Cloud Jacuzzi", "Private Chef", "Barbecue Lawn", "Heated Bed"],
      featuresBn: ["ইনফিনিটি ক্লাউড জাকুজি", "ব্যক্তিগত শেফ", "বারবিকিউ লন", "হিটেড বেড"],
      tag: "Ultra Luxury Cloud",
      tagBn: "আল্ট্রা লাক্সারি ক্লাউড",
      image: "https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?auto=format&fit=crop&w=600&q=80",
      availableRooms: 2,
      destinationCity: "Chittagong"
    }
  ],
  "bandarban": [
    {
      id: "bd-1",
      name: "Sangu River Eco Cottage",
      nameBn: "সাঙ্গু রিভার ইকো কটেজ",
      distance: "350m from Sangu River Bank",
      distanceBn: "সাঙ্গু নদীর তীর থেকে ৩৫০ মিটার",
      rating: 4.4,
      reviews: 230,
      price: 580,
      roomType: "Bamboo River Room",
      roomTypeBn: "বাঁশের নদী ভিউ রুম",
      features: ["River Breeze", "Clean Bath", "Local Tribal Food"],
      featuresBn: ["নদীর নির্মল বাতাস", "পরিচ্ছন্ন বাথ", "আদিবাসী খাবার"],
      tag: "Riverside Budget",
      tagBn: "নদী তীরবর্তী বাজেট",
      image: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=600&q=80",
      availableRooms: 4,
      destinationCity: "Chittagong"
    },
    {
      id: "bd-2",
      name: "Nilachal Green View Resort",
      nameBn: "নীলাচল গ্রিন ভিউ রিসোর্ট",
      distance: "1.5 km from Nilachal Peak",
      distanceBn: "নীলাচল চূড়া থেকে ১.৫ কিমি",
      rating: 4.6,
      reviews: 520,
      price: 1350,
      roomType: "Mountain Deluxe Suite",
      roomTypeBn: "মাউন্টেন ভিউ ডিলাক্স স্যুট",
      features: ["Panoramic Hill View", "Breakfast", "Campfire"],
      featuresBn: ["পাহাড়ের প্যানোরামিক ভিউ", "সকালের নাস্তা", "ক্যাম্পফায়ার"],
      tag: "Hill Adventure",
      tagBn: "পাহাড়ি অ্যাডভেঞ্চার",
      image: "https://images.unsplash.com/photo-1571896349842-33c89424de2d?auto=format&fit=crop&w=600&q=80",
      availableRooms: 3,
      destinationCity: "Chittagong"
    },
    {
      id: "bd-3",
      name: "Nilgiri Peak Cloud Haven Resort",
      nameBn: "নীলগিরি পিক ক্লাউড হেভেন রিসোর্ট",
      distance: "Nilgiri Hilltop Sanctuary (2,200ft)",
      distanceBn: "নীলগিরি চূড়া (২২০০ ফুট উচ্চতা)",
      rating: 4.9,
      reviews: 1180,
      price: 5800,
      roomType: "VIP Cloud Chalet",
      roomTypeBn: "ভিআইপি ক্লাউড চালে",
      features: ["360° Cloud View", "Helipad Access", "Fine Dining", "Security"],
      featuresBn: ["৩৬০° মেঘের ভিউ", "হেলিপ্যাড সুবিধা", "ফাইন ডাইনিং", "নিরাপত্তা"],
      tag: "Top of Bangladesh",
      tagBn: "দেশের শীর্ষ চূড়া",
      image: "https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=600&q=80",
      availableRooms: 2,
      destinationCity: "Chittagong"
    }
  ],
  "paharpur": [
    {
      id: "ph-1",
      name: "Mahavihara Heritage Rest House",
      nameBn: "মহাবিহার হেরিটেজ রেস্ট হাউস",
      distance: "200m from Ancient Somapura Stupa",
      distanceBn: "প্রাচীন সোমপুর স্তূপ থেকে ২০০ মিটার",
      rating: 4.3,
      reviews: 140,
      price: 500,
      roomType: "Standard Heritage Room",
      roomTypeBn: "ঐতিহাসিক স্ট্যান্ডার্ড রুম",
      features: ["Quiet Environment", "Attached Bath", "Museum Guide"],
      featuresBn: ["শান্ত পরিবেশ", "সংযুক্ত বাথ", "জাদুঘর গাইড"],
      tag: "UNESCO Ancient",
      tagBn: "ইউনেস্কো ঐতিহ্য",
      image: "https://images.unsplash.com/photo-1548013146-72479768bada?auto=format&fit=crop&w=600&q=80",
      availableRooms: 3,
      destinationCity: "Rajshahi"
    },
    {
      id: "ph-2",
      name: "Paharpur Green Archaeological Lodge",
      nameBn: "পাহাড়পুর গ্রিন আর্কিওলজিক্যাল লজ",
      distance: "600m from Archaeological Park",
      distanceBn: "প্রত্নতাত্ত্বিক পার্ক থেকে ৬০০ মিটার",
      rating: 4.6,
      reviews: 290,
      price: 1100,
      roomType: "Deluxe Garden View Room",
      roomTypeBn: "ডিলাক্স গার্ডেন ভিউ রুম",
      features: ["AC", "Breakfast", "Garden Yard"],
      featuresBn: ["শীতাতপ নিয়ন্ত্রিত", "সকালের নাস্তা", "বাগান চত্বর"],
      tag: "Historic Stay",
      tagBn: "ঐতিহাসিক আবাসন",
      image: "https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=600&q=80",
      availableRooms: 4,
      destinationCity: "Rajshahi"
    },
    {
      id: "ph-3",
      name: "Rajshahi Royal Silk Heritage Hotel",
      nameBn: "রাজশাহী রয়েল সিল্ক হেরিটেজ হোটেল",
      distance: "Historic Padma River Area",
      distanceBn: "ঐতিহাসিক পদ্মা নদী এলাকা",
      rating: 4.8,
      reviews: 620,
      price: 4800,
      roomType: "Executive Royal Suite",
      roomTypeBn: "এক্সিকিউটিভ রয়েল স্যুট",
      features: ["Swimming Pool", "Silk City Dining", "Gym", "Chauffeur"],
      featuresBn: ["সুইমিং পুল", "ঐতিহ্যবাহী ডাইনিং", "জিম", "কার সার্ভিস"],
      tag: "Royal Heritage",
      tagBn: "রয়েল হেরিটেজ",
      image: "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=600&q=80",
      availableRooms: 3,
      destinationCity: "Rajshahi"
    }
  ],
  "bagerhat": [
    {
      id: "bg-1",
      name: "Sixty Dome Heritage Guest House",
      nameBn: "ষাট গম্বুজ হেরিটেজ গেস্ট হাউস",
      distance: "250m from Historic Mosque",
      distanceBn: "ঐতিহাসিক মসজিদ থেকে ২৫০ মিটার",
      rating: 4.3,
      reviews: 150,
      price: 500,
      roomType: "Standard Room",
      roomTypeBn: "স্ট্যান্ডার্ড রুম",
      features: ["Clean Bath", "Wi-Fi", "Mosque Guide"],
      featuresBn: ["পরিচ্ছন্ন বাথ", "ওয়াই-ফাই", "হেরিটেজ গাইড"],
      tag: "Sultanate Landmark",
      tagBn: "সুলতানি আমলের নিদর্শন",
      image: "https://images.unsplash.com/photo-1564507592333-c60657eea523?auto=format&fit=crop&w=600&q=80",
      availableRooms: 4,
      destinationCity: "Khulna"
    },
    {
      id: "bg-2",
      name: "Khan Jahan Ali Deluxe Inn",
      nameBn: "খান জাহান আলী ডিলাক্স ইন",
      distance: "500m from Khan Jahan Dighi",
      distanceBn: "খান জাহান দিঘি থেকে ৫০০ মিটার",
      rating: 4.6,
      reviews: 310,
      price: 1200,
      roomType: "Deluxe AC Heritage Room",
      roomTypeBn: "ডিলাক্স এসি হেরিটেজ রুম",
      features: ["AC", "Breakfast", "Lake Breeze"],
      featuresBn: ["শীতাতপ নিয়ন্ত্রিত", "সকালের নাস্তা", "দিঘির বাতাস"],
      tag: "Top Historic Value",
      tagBn: "টপ হেরিটেজ ভ্যালু",
      image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=600&q=80",
      availableRooms: 3,
      destinationCity: "Khulna"
    },
    {
      id: "bg-3",
      name: "Sundarbans Gateway Heritage Palace",
      nameBn: "সুন্দরবন গেটওয়ে হেরিটেজ প্যালেস",
      distance: "Riverfront Gateway Estate",
      distanceBn: "নদী তীরবর্তী গেটওয়ে এস্টেট",
      rating: 4.8,
      reviews: 580,
      price: 4500,
      roomType: "Palace Executive Suite",
      roomTypeBn: "প্যালেস এক্সিকিউটিভ স্যুট",
      features: ["River View", "Fine Dining", "Sundarbans Safari Desk"],
      featuresBn: ["নদী ভিউ", "ফাইন ডাইনিং", "সাফারি বুকিং ডেস্ক"],
      tag: "Premium Heritage",
      tagBn: "প্রিমিয়াম হেরিটেজ",
      image: "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=600&q=80",
      availableRooms: 2,
      destinationCity: "Khulna"
    }
  ],
  "sreemangal": [
    {
      id: "srm-1",
      name: "Tea Garden Budget Dorm & Inn",
      nameBn: "টি গার্ডেন বাজেট ডর্ম অ্যান্ড ইন",
      distance: "400m from Emerald Tea Slopes",
      distanceBn: "সবুজ চা বাগান থেকে ৪০০ মিটার",
      rating: 4.4,
      reviews: 260,
      price: 550,
      roomType: "Eco Cottage Room",
      roomTypeBn: "ইকো কটেজ রুম",
      features: ["Garden Air", "Clean Bath", "Cycling Rent"],
      featuresBn: ["চা বাগানের বাতাস", "পরিচ্ছন্ন বাথ", "সাইকেল ভাড়া"],
      tag: "Tea Capital Budget",
      tagBn: "চা-কন্যার সাশ্রয়ী কটেজ",
      image: "https://images.unsplash.com/photo-1544787219-7f47ccb76574?auto=format&fit=crop&w=600&q=80",
      availableRooms: 5,
      destinationCity: "Sylhet"
    },
    {
      id: "srm-2",
      name: "Tea Valley Eco Cottage Sreemangal",
      nameBn: "টি ভ্যালি ইকো কটেজ শ্রীমঙ্গল",
      distance: "Near Malnicherra Tea Estate",
      distanceBn: "মালনীছড়া চা বাগানের সন্নিকটে",
      rating: 4.7,
      reviews: 490,
      price: 1400,
      roomType: "Deluxe Tea Garden Cottage",
      roomTypeBn: "ডিলাক্স টি গার্ডেন কটেজ",
      features: ["AC", "Breakfast", "Tea Tasting Tour"],
      featuresBn: ["শীতাতপ নিয়ন্ত্রিত", "সকালের নাস্তা", "চা টেস্টিং ট্যুর"],
      tag: "Scenic Tea Estate",
      tagBn: "মনোরম চা বাগান স্টে",
      image: "https://images.unsplash.com/photo-1618773928121-c32242e63f39?auto=format&fit=crop&w=600&q=80",
      availableRooms: 3,
      destinationCity: "Sylhet"
    },
    {
      id: "srm-3",
      name: "Grand Sultan Tea Resort & Golf",
      nameBn: "গ্র্যান্ড সুলতান টি রিসোর্ট অ্যান্ড গলফ",
      distance: "Exclusive Rain Forest Valley",
      distanceBn: "এক্সক্লুসিভ রেইনফরেস্ট ভ্যালি",
      rating: 4.9,
      reviews: 1420,
      price: 6500,
      roomType: "Presidential Tea Valley Suite",
      roomTypeBn: "প্রেসিডেন্সিয়াল টি ভ্যালি স্যুট",
      features: ["Golf Course", "3 Swimming Pools", "Spa", "Helipad"],
      featuresBn: ["গলফ কোর্স", "৩টি সুইমিং পুল", "লাক্সারি স্পা", "হেলিপ্যাড"],
      tag: "5-Star Tea Palace",
      tagBn: "৫-তারকা টি প্যালেস",
      image: "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=600&q=80",
      availableRooms: 4,
      destinationCity: "Sylhet"
    }
  ],
  "tanguar-haor": [
    {
      id: "th-1",
      name: "Haor Konna Budget Houseboat",
      nameBn: "হাওর কন্যা বাজেট হাউসবোট",
      distance: "Sunamganj Haor Ghat",
      distanceBn: "সুনামগঞ্জ হাওর ঘাট",
      rating: 4.4,
      reviews: 210,
      price: 650,
      roomType: "Standard Floating Cabin",
      roomTypeBn: "স্ট্যান্ডার্ড ভাসমান কেবিন",
      features: ["Haor Fish Meal", "Clean Toilet", "Life Jacket"],
      featuresBn: ["হাওরের তাজা মাছ", "পরিচ্ছন্ন টয়লেট", "লাইফ জ্যাকেট"],
      tag: "Ramsar Site Stay",
      tagBn: "রামসার সাইট স্টে",
      image: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=600&q=80",
      availableRooms: 4,
      destinationCity: "Sylhet"
    },
    {
      id: "th-2",
      name: "Blue Water Premium Haor Cruiser",
      nameBn: "ব্লু ওয়াটার প্রিমিয়াম হাওর ক্রুজার",
      distance: "Middle of Tanguar Haor Basin",
      distanceBn: "টাঙ্গুয়ার হাওর মূল জলরাশি",
      rating: 4.7,
      reviews: 480,
      price: 1600,
      roomType: "Deluxe Window View Cabin",
      roomTypeBn: "ডিলাক্স উইন্ডো ভিউ কেবিন",
      features: ["Solar Power", "All Meals Included", "Watchtower Tour"],
      featuresBn: ["সৌর বিদ্যুৎ", "৩ বেলার খাবার অন্তর্ভুক্ত", "ওয়াচটাওয়ার ভ্রমণ"],
      tag: "Pure Haor Living",
      tagBn: "আসল হাওর হাউসবোট",
      image: "https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&w=600&q=80",
      availableRooms: 3,
      destinationCity: "Sylhet"
    },
    {
      id: "th-3",
      name: "Royal Haor Floating Palace",
      nameBn: "রয়েল হাওর ফ্লোটিং প্যালেস",
      distance: "Exclusive Open Haor Waters",
      distanceBn: "এক্সক্লুসিভ উন্মুক্ত হাওর জলরাশি",
      rating: 4.9,
      reviews: 690,
      price: 5500,
      roomType: "VIP Air-Conditioned Suite Houseboat",
      roomTypeBn: "ভিআইপি এসি স্যুট হাউসবোট",
      features: ["AC Cabins", "Private Chef", "Rooftop Stargazing", "Speedboat Escort"],
      featuresBn: ["শীতাতপ নিয়ন্ত্রিত", "প্রাইভেট শেফ", "রুফটপ স্টারগেজিং", "স্পিডবোট এসকর্ট"],
      tag: "Luxury Houseboat",
      tagBn: "লাক্সারি হাউসবোট",
      image: "https://images.unsplash.com/photo-1571896349842-33c89424de2d?auto=format&fit=crop&w=600&q=80",
      availableRooms: 2,
      destinationCity: "Sylhet"
    }
  ]
};

interface SpotHotelsModalProps {
  spot: TouristSpot | null;
  onClose: () => void;
}

export const SpotHotelsModal: React.FC<SpotHotelsModalProps> = ({ spot, onClose }) => {
  const { i18n } = useTranslation();
  const isBn = i18n.language?.startsWith("bn");
  const navigate = useNavigate();
  const [budgetTierIndex, setBudgetTierIndex] = useState(0);
  const [dbHotels, setDbHotels] = useState<SpotHotel[]>([]);

  // Booking Date Range (Passed seamlessly into checkout)
  const [checkIn, setCheckIn] = useState<string>(() => new Date().toISOString().split("T")[0]);
  const [checkOut, setCheckOut] = useState<string>(() => new Date(Date.now() + 86400000).toISOString().split("T")[0]);

  // Close on ESC key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  // Fetch dynamic database hotels matching this spot
  useEffect(() => {
    if (!spot) return;
    api.getAllHotels().then(hotels => {
      if (!hotels || !Array.isArray(hotels)) return;
      const spotTerms = [spot.name.toLowerCase(), spot.region.toLowerCase(), spot.id.toLowerCase()];
      
      const matched = hotels.filter(h => {
        const text = `${h.name} ${h.city} ${h.address || ""}`.toLowerCase();
        return spotTerms.some(term => text.includes(term)) ||
          (spot.id === "coxs-bazar" && text.includes("cox")) ||
          (spot.id === "saint-martins" && (text.includes("martin") || text.includes("coral"))) ||
          (spot.id === "kuakata" && (text.includes("kuakata") || text.includes("patuakhali"))) ||
          (spot.id === "sundarbans" && (text.includes("sundarban") || text.includes("khulna") || text.includes("mangrove"))) ||
          (spot.id === "sajek-valley" && (text.includes("sajek") || text.includes("rangamati"))) ||
          (spot.id === "sreemangal" && (text.includes("sreemangal") || text.includes("moulvi") || text.includes("tea"))) ||
          (spot.id === "tanguar-haor" && (text.includes("haor") || text.includes("sunamganj"))) ||
          (spot.id === "ratargul" && (text.includes("ratargul") || text.includes("sylhet")));
      });

      if (matched.length > 0) {
        const converted: SpotHotel[] = matched.map((h, i) => ({
          id: h.id,
          name: h.name,
          nameBn: h.name,
          distance: `${h.city} • Prime Tourism Hub`,
          distanceBn: `${h.city} • প্রধান পর্যটন জোন`,
          rating: h.rating || 4.7,
          reviews: h.totalReviews || 110,
          price: 1100 + (i * 400),
          originalPrice: 1500 + (i * 400),
          roomType: "Executive AC Deluxe Room",
          roomTypeBn: "এক্সিকিউটিভ এসি ডিলাক্স রুম",
          features: h.amenities?.length ? h.amenities.slice(0, 4) : ["Free Wi-Fi", "AC", "24/7 Security"],
          featuresBn: ["ফ্রি ওয়াই-ফাই", "শীতাতপ নিয়ন্ত্রিত", "২৪/৭ নিরাপত্তা"],
          tag: h.isVerified ? "Admin Verified" : "Live Host Asset",
          tagBn: h.isVerified ? "অ্যাডমিন ভেরিফায়েড" : "লাইভ প্রপার্টি",
          image: h.images?.[0] || "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=600",
          availableRooms: 3,
          destinationCity: h.city
        }));
        setDbHotels(converted);
      }
    }).catch(err => console.error("Error loading live hotels for spot:", err));
  }, [spot]);

  if (!spot) return null;

  // Combine dynamic live database hotels with curated verified spot options
  const baseSpotHotels = SPOT_HOTELS[spot.id] || SPOT_HOTELS["coxs-bazar"] || [];
  const spotHotels = [...dbHotels, ...baseSpotHotels.filter(sh => !dbHotels.some(dh => dh.id === sh.id))];

  const BUDGET_FILTER_TIERS = [
    { labelEn: "All Budgets", labelBn: "সকল বাজেট", maxPrice: 99999 },
    { labelEn: "৳500 Economy", labelBn: "৳৫০০ ইকোনমি", maxPrice: 650 },
    { labelEn: "৳1,000 Standard", labelBn: "৳১,০০০ স্ট্যান্ডার্ড", maxPrice: 1600 },
    { labelEn: "৳5,000+ Luxury", labelBn: "৳৫,০০০+ লাক্সারি", maxPrice: 99999 },
  ];

  const maxPrice = BUDGET_FILTER_TIERS[budgetTierIndex].maxPrice;
  const filteredHotels = spotHotels.filter(h => h.price <= maxPrice);

  const nights = Math.max(1, Math.round((new Date(checkOut).getTime() - new Date(checkIn).getTime()) / 86400000) || 1);



  const handleFullSearch = () => {
    onClose();
    navigate(`/hotels?destination=${encodeURIComponent(spot.region)}&q=${encodeURIComponent(spot.name)}`);
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 md:p-6 overflow-y-auto">
        
        {/* Darkened Glassmorphism Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-slate-950/65 backdrop-blur-md transition-opacity"
        />

        {/* Modal Window — Expanded Full Display & Project-Matching Background */}
        <motion.div
          initial={{ opacity: 0, scale: 0.96, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.96, y: 15 }}
          transition={{ type: "spring", damping: 25, stiffness: 280 }}
          className="relative w-full max-w-6xl xl:max-w-7xl h-[94vh] sm:h-[90vh] bg-[#FAFAFA] border border-slate-200/90 rounded-3xl shadow-2xl overflow-hidden flex flex-col z-10 my-auto"
        >
          {/* ═══════════ SPOT HERO BANNER ═══════════ */}
          <div className="relative h-48 sm:h-56 md:h-64 w-full overflow-hidden shrink-0">
            <img 
              src={spot.image} 
              alt={isBn ? spot.nameBn : spot.name} 
              className="w-full h-full object-cover brightness-95" 
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/45 to-slate-950/20" />

            {/* Top Bar with Badge and Close button */}
            <div className="absolute top-4 left-4 sm:left-6 right-4 sm:right-6 flex items-center justify-between z-10">
              <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-emerald-500 text-slate-950 text-xs font-black uppercase tracking-wider shadow-lg">
                <ShieldCheck className="w-4 h-4 stroke-[2.5]" />
                <span>{isBn ? "যাচাইকৃত পর্যটন স্পট" : "Verified Tourism Spot"}</span>
              </div>

              <button
                onClick={onClose}
                className="w-10 h-10 rounded-full bg-white/90 hover:bg-white text-slate-800 hover:text-black flex items-center justify-center transition-all hover:scale-105 active:scale-95 shadow-lg border border-white/50 cursor-pointer"
                aria-label="Close modal"
              >
                <X className="w-5 h-5 stroke-[2.5]" />
              </button>
            </div>

            {/* Spot Details Header */}
            <div className="absolute bottom-4 sm:bottom-6 left-4 sm:left-6 right-4 sm:right-6 text-white">
              <div className="flex items-center gap-2 text-xs sm:text-sm text-emerald-300 font-bold mb-1.5 drop-shadow-sm">
                <MapPin className="w-4 h-4" />
                <span>{isBn ? spot.regionBn : spot.region}</span>
                <span>•</span>
                <span>{isBn ? spot.highlightTagBn : spot.highlightTag}</span>
              </div>
              <h3 className="text-2xl sm:text-3xl md:text-4xl font-black tracking-tight text-white drop-shadow-lg">
                {isBn ? spot.nameBn : spot.name}
              </h3>
              <p className="text-xs sm:text-sm text-slate-200 line-clamp-2 max-w-2xl mt-1 font-medium drop-shadow-sm">
                {isBn ? spot.descriptionBn : spot.description}
              </p>
            </div>
          </div>

          {/* ═══════════ FILTER & STATUS BAR (Matching Project Aesthetic) ═══════════ */}
          <div className="bg-white border-b border-slate-200/90 px-4 sm:px-6 py-3.5 flex flex-wrap items-center justify-between gap-3 shrink-0 shadow-2xs">
            <div className="flex items-center gap-2.5">
              <span className="flex h-2.5 w-2.5 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-600" />
              </span>
              <span className="text-xs sm:text-sm font-bold text-slate-800">
                {isBn 
                  ? `${filteredHotels.length}টি লাইভ খালি রুম পাওয়া গেছে` 
                  : `${filteredHotels.length} Live Stays Available Right Now`}
              </span>
            </div>

            {/* Budget Pill Selector */}
            <div className="flex items-center gap-2 overflow-x-auto scrollbar-hide py-0.5">
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
          </div>

          {/* ═══════════ HOTEL LISTINGS CONTAINER (Spacious 2-Col Grid) ═══════════ */}
          <div className="p-4 sm:p-6 md:p-8 overflow-y-auto flex-1 bg-[#FAFAFA]">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-6">
              {filteredHotels.map((hotel) => (
                <motion.div
                  key={hotel.id}
                  initial={{ opacity: 0, y: 14 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  className="bg-white rounded-2xl border border-slate-200/90 hover:border-emerald-500/50 hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300 p-4 sm:p-5 flex flex-col justify-between group shadow-xs"
                >
                  <div>
                    {/* Hotel Thumbnail */}
                    <div className="relative w-full h-48 sm:h-52 rounded-xl overflow-hidden shrink-0 bg-slate-100 border border-slate-200/80 mb-4">
                      <img
                        src={hotel.image}
                        alt={isBn ? hotel.nameBn : hotel.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        loading="lazy"
                      />
                      <div className="absolute top-3 left-3 bg-slate-900/85 backdrop-blur-md border border-emerald-500/40 text-emerald-400 text-[11px] font-black px-2.5 py-1 rounded-full shadow-sm">
                        {isBn ? hotel.tagBn : hotel.tag}
                      </div>
                      
                      <div className="absolute top-3 right-3 bg-white/95 backdrop-blur-md border border-emerald-200 text-emerald-700 text-[11px] font-bold px-2 py-0.5 rounded-full shadow-sm flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                        <span>{isBn ? "যাচাইকৃত" : "Verified"}</span>
                      </div>

                      <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-xs text-white">
                        <span className="flex items-center gap-1 font-black text-amber-400 bg-slate-950/80 px-2 py-1 rounded-lg backdrop-blur-xs">
                          <Star className="w-3.5 h-3.5 fill-amber-400" />
                          {hotel.rating}
                        </span>
                        <span className="text-[11px] bg-emerald-500 text-slate-950 font-black px-2 py-1 rounded-lg shadow-sm">
                          {isBn ? `${hotel.availableRooms}টি রুম খালি` : `${hotel.availableRooms} Rooms Left`}
                        </span>
                      </div>
                    </div>

                    {/* Hotel Info & Details */}
                    <div>
                      <h4 className="text-lg sm:text-xl font-bold text-slate-900 group-hover:text-emerald-700 transition-colors leading-snug">
                        {isBn ? hotel.nameBn : hotel.name}
                      </h4>
                      <div className="flex items-center gap-1.5 text-xs text-slate-500 mt-1 font-medium">
                        <MapPin className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                        <span>{isBn ? hotel.distanceBn : hotel.distance}</span>
                      </div>

                      <p className="text-xs sm:text-sm font-semibold text-slate-700 mt-2.5">
                        {isBn ? hotel.roomTypeBn : hotel.roomType}
                      </p>

                      {/* Features Badges */}
                      <div className="flex flex-wrap gap-1.5 mt-2.5">
                        {(isBn ? hotel.featuresBn : hotel.features).map((f) => (
                          <span
                            key={f}
                            className="text-[11px] font-medium bg-slate-100 text-slate-600 px-2.5 py-0.5 rounded-md border border-slate-200/70"
                          >
                            {f}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Price and Action Buttons */}
                  <div className="flex items-center justify-between pt-4 mt-4 border-t border-slate-100">
                    <div>
                      <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                        {isBn ? "প্রতি রাত (০% লুকানো ফি)" : "Per Night (0% Hidden Fee)"}
                      </div>
                      <div className="flex items-baseline gap-2">
                        <span className="text-2xl font-black text-slate-900">
                          ৳{hotel.price.toLocaleString()}
                        </span>
                        {hotel.originalPrice ? (
                          <span className="text-xs text-rose-500 line-through font-semibold">
                            ৳{hotel.originalPrice.toLocaleString()}
                          </span>
                        ) : null}
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => {
                          onClose();
                          navigate(`/property/${hotel.id}`);
                        }}
                        className="px-3.5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 hover:text-slate-900 font-bold text-xs transition-all border border-slate-200 flex items-center gap-1.5 shadow-xs cursor-pointer"
                      >
                        <Eye className="w-3.5 h-3.5 text-slate-500" />
                        <span>{isBn ? "বিস্তারিত" : "Details"}</span>
                      </button>

                      <button
                        onClick={() => {
                          onClose();
                          navigate(`/checkout/${hotel.id}?step=details&roomId=${hotel.id}_r1&checkIn=${checkIn}&checkOut=${checkOut}`);
                        }}
                        className="px-4.5 py-2.5 rounded-xl bg-violet-600 hover:bg-violet-700 text-white font-black text-xs transition-all flex items-center gap-1.5 shadow-md shadow-violet-600/25 active:scale-95 cursor-pointer"
                      >
                        <BedDouble className="w-3.5 h-3.5" />
                        <span>{isBn ? "রুম বুক করুন" : "Select Room"}</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            {filteredHotels.length === 0 && (
              <div className="py-16 text-center bg-white rounded-2xl border border-slate-200 p-8">
                <p className="text-sm font-medium text-slate-500">
                  {isBn 
                    ? "এই বাজেট রেঞ্জে কোনো রুম পাওয়া যায়নি। অনুগ্রহ করে অন্য বাজেট ফিল্টার নির্বাচন করুন।" 
                    : "No verified rooms found matching this exact budget tier. Please select 'All Budgets'."}
                </p>
                <button
                  onClick={() => setBudgetTierIndex(0)}
                  className="mt-3.5 px-4.5 py-2 rounded-xl bg-slate-900 text-white text-xs font-bold shadow-sm cursor-pointer"
                >
                  {isBn ? "সকল বাজেট দেখুন" : "View All Budgets"}
                </button>
              </div>
            )}
          </div>

          {/* ═══════════ MODAL FOOTER (Matching Project Theme) ═══════════ */}
          <div className="bg-white px-4 sm:px-6 py-3.5 border-t border-slate-200 flex items-center justify-between text-xs text-slate-500 shrink-0">
            <span className="hidden sm:inline font-medium">
              {isBn 
                ? "🔒 ১০০% জাতীয় নিরাপত্তা ও ভোক্তা সুরক্ষা কমপ্লায়েন্স" 
                : "🔒 100% Direct Hotel Tariff & Consumer Protection"}
            </span>

            <button
              onClick={handleFullSearch}
              className="inline-flex items-center gap-1.5 text-emerald-700 hover:text-emerald-800 font-bold ml-auto cursor-pointer"
            >
              <span>{isBn ? `${spot.region}-এর সকল হোটেল দেখুন` : `Explore all stays in ${spot.region}`}</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </button>
          </div>

        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default SpotHotelsModal;
