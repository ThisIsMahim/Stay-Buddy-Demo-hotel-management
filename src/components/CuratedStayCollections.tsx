import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Palmtree, Waves, CloudSun, Coffee, 
  Building, Sparkles, Compass, ArrowUpRight, Flame, MapPin 
} from "lucide-react";
import { useTranslation } from "react-i18next";
import { Link, useNavigate } from "react-router-dom";

interface CollectionItem {
  id: string;
  category: string;
  titleEn: string;
  titleBn: string;
  taglineEn: string;
  taglineBn: string;
  destinations: string;
  priceFrom: string;
  image: string;
  badge: string;
  badgeColor: string;
  queryParam: string;
  stats: string;
}

const COLLECTIONS: CollectionItem[] = [
  {
    id: "beachfront",
    category: "beach",
    titleEn: "Sea View & Beachfront Stays",
    titleBn: "সমুদ্র সৈকত ও সি-ভিউ রিসোর্ট",
    taglineEn: "Step straight onto the golden shores of Cox's Bazar & Kuakata",
    taglineBn: "কক্সবাজার ও কুয়াকাটার মনোরম সমুদ্র সৈকতের একদম কাছে",
    destinations: "Cox's Bazar, Kuakata, Saint Martin",
    priceFrom: "৳3,500",
    image: "https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=800",
    badge: "Trending 🌊",
    badgeColor: "bg-blue-600 text-white shadow-blue-500/30",
    queryParam: "Cox's Bazar",
    stats: "28 Verified Resorts",
  },
  {
    id: "tea-resorts",
    category: "nature",
    titleEn: "Tea Garden & Rainforest Retreats",
    titleBn: "চা বাগান ও রেইনফরেস্ট ইকো-রিসোর্ট",
    taglineEn: "Wake up to misty morning tea plantations in Sreemangal & Sylhet",
    taglineBn: "শ্রীমঙ্গল ও সিলেটের সবুজ চা বাগানের মাঝে শান্ত স্নিগ্ধ পরিবেশ",
    destinations: "Sreemangal, Sylhet, Jaflong",
    priceFrom: "৳2,800",
    image: "https://images.unsplash.com/photo-1596394516093-501ba68a0ba6?w=800",
    badge: "Eco-Luxe 🌿",
    badgeColor: "bg-emerald-600 text-white shadow-emerald-500/30",
    queryParam: "Sylhet",
    stats: "19 Verified Stays",
  },
  {
    id: "cloud-valley",
    category: "hills",
    titleEn: "Above-the-Clouds Hill Cottages",
    titleBn: "মেঘের উপত্যকা ও পাহাড়ি কটেজ",
    taglineEn: "Experience breathtaking sunrise above clouds in Sajek & Bandarban",
    taglineBn: "সাজেক ও বান্দরবানের মেঘের ওপর কাঠের নান্দনিক কটেজে রাত্রিযাপন",
    destinations: "Sajek Valley, Nilgiri, Bandarban",
    priceFrom: "৳3,200",
    image: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=800",
    badge: "Most Loved ☁️",
    badgeColor: "bg-purple-600 text-white shadow-purple-500/30",
    queryParam: "Chittagong",
    stats: "24 Cloud Cottages",
  },
  {
    id: "pool-villas",
    category: "luxury",
    titleEn: "Private Swimming Pool Villas",
    titleBn: "প্রাইভেট সুইমিং পুল ও লাক্সারি ভিলা",
    taglineEn: "Exclusive weekend staycations for family & group reunions",
    taglineBn: "পরিবার ও বন্ধুদের সাথে একান্ত সময় কাটানোর এক্সক্লুসিভ ভিলা",
    destinations: "Gazipur, Mawna, Dhaka Outskirts",
    priceFrom: "৳6,000",
    image: "https://images.unsplash.com/photo-1580587771525-78b9dba3b914?w=800",
    badge: "VIP Stay 🏊",
    badgeColor: "bg-amber-500 text-slate-950 shadow-amber-500/30",
    queryParam: "Dhaka",
    stats: "15 Private Villas",
  },
];

export const CuratedStayCollections: React.FC = () => {
  const { i18n } = useTranslation();
  const isBn = i18n.language?.startsWith("bn");
  const navigate = useNavigate();
  const [selectedFilter, setSelectedFilter] = useState("all");

  const filteredItems = selectedFilter === "all" 
    ? COLLECTIONS 
    : COLLECTIONS.filter(c => c.category === selectedFilter);

  const handleCollectionClick = (dest: string) => {
    navigate(`/hotels?destination=${encodeURIComponent(dest)}`);
  };

  return (
    <section className="py-8 my-4">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-100 border border-slate-200 text-slate-800 text-xs font-bold uppercase tracking-wider mb-2">
            <Compass className="w-3.5 h-3.5 text-emerald-600" />
            <span>{isBn ? "থিমভিত্তিক ভ্রমণ কালেকশন" : "Curated Stay Collections"}</span>
          </div>
          <h2 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight">
            {isBn ? (
              <>
                ভ্রমণের মেজাজ অনুযায়ী সেরা আবাসন —{" "}
                <span className="text-emerald-600">এয়ারবিএনবি স্টাইল কিউরেশন</span>
              </>
            ) : (
              <>
                Handcrafted for Every Travel Mood —{" "}
                <span className="text-emerald-600">Airbnb-Style Discovery</span>
              </>
            )}
          </h2>
        </div>

        {/* Filter Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
          {[
            { id: "all", labelEn: "All Themes", labelBn: "সকল কালেকশন" },
            { id: "beach", labelEn: "Beachfront 🌊", labelBn: "সমুদ্র সৈকত 🌊" },
            { id: "nature", labelEn: "Tea Resorts 🌿", labelBn: "চা বাগান 🌿" },
            { id: "hills", labelEn: "Cloud Valley ☁️", labelBn: "মেঘের উপত্যকা ☁️" },
            { id: "luxury", labelEn: "Pool Villas 🏊", labelBn: "পুল ভিলা 🏊" },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setSelectedFilter(tab.id)}
              className={`px-3 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-all ${
                selectedFilter === tab.id
                  ? "bg-slate-900 text-white shadow-md shadow-slate-900/20"
                  : "bg-slate-100 hover:bg-slate-200 text-slate-600"
              }`}
            >
              {isBn ? tab.labelBn : tab.labelEn}
            </button>
          ))}
        </div>
      </div>

      {/* 4 Thematic Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <AnimatePresence mode="popLayout">
          {filteredItems.map((item, idx) => (
            <motion.div
              key={item.id}
              layout
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.3, delay: idx * 0.05 }}
              onClick={() => handleCollectionClick(item.queryParam)}
              className="group relative h-96 rounded-3xl overflow-hidden cursor-pointer shadow-md hover:shadow-2xl transition-all duration-300 flex flex-col justify-between p-5 border border-slate-200/80"
            >
              {/* Background Image with Zoom on Hover */}
              <img
                src={item.image}
                alt={item.titleEn}
                className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
                loading="lazy"
              />

              {/* Dark Overlay Gradient */}
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-black/25 group-hover:via-slate-950/50 transition-colors" />

              {/* Top Badge */}
              <div className="relative z-10 flex items-center justify-between">
                <span className={`text-[10px] font-black px-2.5 py-1 rounded-full shadow-lg ${item.badgeColor}`}>
                  {item.badge}
                </span>
                <span className="text-[11px] font-bold text-white/90 bg-black/50 backdrop-blur-md px-2.5 py-1 rounded-full border border-white/20">
                  {isBn ? `শুরু ${item.priceFrom}` : `From ${item.priceFrom}`}
                </span>
              </div>

              {/* Bottom Info */}
              <div className="relative z-10 text-white">
                <div className="text-[11px] font-semibold text-emerald-300 mb-1 flex items-center justify-between">
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3 h-3 text-emerald-400" />
                    {item.destinations}
                  </span>
                  <span className="text-[10px] bg-white/20 px-1.5 py-0.5 rounded text-white font-medium">
                    {item.stats}
                  </span>
                </div>
                <h3 className="text-base font-black text-white leading-snug group-hover:text-emerald-300 transition-colors">
                  {isBn ? item.titleBn : item.titleEn}
                </h3>
                <p className="text-[11px] text-white/80 mt-1 line-clamp-2 leading-relaxed">
                  {isBn ? item.taglineBn : item.taglineEn}
                </p>

                <div className="mt-3.5 inline-flex items-center gap-1.5 text-xs font-black text-emerald-400 group-hover:text-emerald-300 transition-colors">
                  <span>{isBn ? "হোটেল ও ভিলাগুলো দেখুন" : "Explore Verified Stays"}</span>
                  <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </section>
  );
};

export default CuratedStayCollections;
