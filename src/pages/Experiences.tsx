/**
 * Experiences Page — Listing with filters
 * Card click → navigates to /experiences/:id (detail page)
 * No direct booking from card — booking happens on detail page
 */
import { useEffect, useState, useCallback, useRef } from "react";
import { useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import {
  Star, Heart, MapPin, Clock, Users, Loader2,
  ChevronLeft, ChevronRight, Search, SlidersHorizontal,
  ArrowUpDown, Globe2
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { api, ExperienceCard } from "../services/api";
import { useTranslation } from "react-i18next";

// ── Constants ─────────────────────────────────────────────────────────────────
const CATEGORIES = [
  { label: "All",        value: "All",         emoji: "✨" },
  { label: "Cultural",   value: "Cultural",    emoji: "🏛️" },
  { label: "Food & Drink", value: "Food & Drink", emoji: "🍽️" },
  { label: "Adventure",  value: "Adventure",   emoji: "🧗" },
  { label: "Art",        value: "Art",         emoji: "🎨" },
  { label: "Wellness",   value: "Wellness",    emoji: "🧘" },
  { label: "Nature",     value: "Nature",      emoji: "🌿" },
  { label: "Outdoor",    value: "Outdoor",     emoji: "🏕️" },
];

const SORT_OPTIONS = [
  { label: "Recommended",        value: "recommended" },
  { label: "Top Rated",          value: "rating" },
  { label: "Price: Low to High", value: "price_asc" },
  { label: "Price: High to Low", value: "price_desc" },
  { label: "Newest",             value: "newest" },
] as const;

// ── Image Carousel for card ───────────────────────────────────────────────────
function CardCarousel({ images, title }: { images: string[]; title: string }) {
  const [idx, setIdx] = useState(0);
  const [hovered, setHovered] = useState(false);
  const all = images.length > 0 ? images : ["https://images.unsplash.com/photo-1566073771259-6a8506099945?w=600"];

  const prev = (e: React.MouseEvent) => { e.preventDefault(); e.stopPropagation(); setIdx(i => (i - 1 + all.length) % all.length); };
  const next = (e: React.MouseEvent) => { e.preventDefault(); e.stopPropagation(); setIdx(i => (i + 1) % all.length); };

  return (
    <div
      className="relative w-full aspect-[3/4] overflow-hidden rounded-2xl bg-gray-100"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <AnimatePresence mode="wait">
        <motion.img
          key={idx}
          src={all[idx]}
          alt={title}
          className="w-full h-full object-cover"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.22 }}
          onError={e => { (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=600"; }}
        />
      </AnimatePresence>

      {hovered && all.length > 1 && (
        <>
          {idx > 0 && (
            <button onClick={prev} className="absolute left-2 top-1/2 -translate-y-1/2 w-7 h-7 rounded-full bg-white/90 hover:bg-white flex items-center justify-center shadow-md z-10 hover:scale-105 transition-all">
              <ChevronLeft className="w-4 h-4 text-gray-800" />
            </button>
          )}
          {idx < all.length - 1 && (
            <button onClick={next} className="absolute right-2 top-1/2 -translate-y-1/2 w-7 h-7 rounded-full bg-white/90 hover:bg-white flex items-center justify-center shadow-md z-10 hover:scale-105 transition-all">
              <ChevronRight className="w-4 h-4 text-gray-800" />
            </button>
          )}
        </>
      )}

      {all.length > 1 && (
        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1 z-10">
          {all.map((_, i) => (
            <span key={i} className={`w-1.5 h-1.5 rounded-full transition-all ${i === idx ? "bg-white scale-110" : "bg-white/60"}`} />
          ))}
        </div>
      )}
    </div>
  );
}

// ── Experience Card ────────────────────────────────────────────────────────────
function ExperienceCardUI({
  exp,
  isWishlisted,
  onToggleWishlist,
}: {
  exp: ExperienceCard;
  isWishlisted: boolean;
  onToggleWishlist: (id: string) => void;
}) {
  const navigate = useNavigate();
  const allImages = exp.images && exp.images.length > 0 ? exp.images : [exp.image];

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      className="group cursor-pointer"
      onClick={() => navigate(`/experiences/${exp.id}`)}
    >
      {/* Image Carousel */}
      <div className="relative mb-3">
        <CardCarousel images={allImages} title={exp.title} />

        {/* Badge */}
        {exp.badge && !exp.isSoldOut && (
          <div className="absolute top-3 left-3 z-10 bg-white/95 backdrop-blur-sm px-2.5 py-1 rounded-full text-xs font-bold shadow-sm pointer-events-none">
            {exp.category === "original" && <span className="text-amber-600 mr-1">✎</span>}
            {exp.badge}
          </div>
        )}

        {/* Sold out overlay */}
        {exp.isSoldOut && (
          <div className="absolute inset-0 bg-white/30 backdrop-blur-[2px] z-10 flex items-center justify-center pointer-events-none rounded-2xl">
            <span className="bg-rose-500 text-white font-black uppercase tracking-widest px-4 py-2 rounded-xl text-xs shadow-xl -rotate-12 border-2 border-rose-400">
              Fully Booked
            </span>
          </div>
        )}

        {/* Wishlist */}
        <button
          onClick={e => { e.stopPropagation(); onToggleWishlist(exp.id); }}
          className="absolute top-3 right-3 z-10 p-1.5 rounded-full hover:scale-110 transition-transform"
        >
          <Heart className={`w-5 h-5 transition-all drop-shadow ${isWishlisted ? "fill-rose-500 text-rose-500" : "text-white fill-black/20 stroke-white"}`} />
        </button>

        {/* Duration */}
        {exp.duration && (
          <div className="absolute bottom-3 left-3 z-10 bg-black/55 backdrop-blur-sm text-white text-[10px] font-bold px-2 py-1 rounded-full flex items-center gap-1 pointer-events-none">
            <Clock className="w-2.5 h-2.5" /> {exp.duration}
          </div>
        )}
      </div>

      {/* Info */}
      <div className="space-y-1">
        <div className="flex items-center gap-1 text-sm">
          <Star className="w-3.5 h-3.5 fill-gray-900 text-gray-900 shrink-0" />
          <span className="font-semibold text-gray-900">{exp.rating}</span>
          <span className="text-gray-400 text-xs">({exp.reviews})</span>
          <span className="text-gray-200 mx-0.5">·</span>
          <span className="text-gray-500 text-xs truncate">{exp.location}</span>
        </div>

        <h3 className="font-semibold text-gray-900 group-hover:underline line-clamp-2 text-sm leading-snug">
          {exp.title}
        </h3>

        {exp.tags && exp.tags.length > 0 && (
          <div className="flex gap-1.5 flex-wrap">
            {exp.tags.slice(0, 2).map(tag => (
              <span key={tag} className="text-[10px] bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full font-medium">
                {tag}
              </span>
            ))}
          </div>
        )}

        <div className="flex items-center justify-between pt-0.5">
          <div>
            <span className="font-semibold text-gray-900 text-sm">From ৳{exp.price}</span>
            <span className="text-gray-400 text-xs"> / guest</span>
          </div>
          {exp.maxGuests && (
            <span className="text-gray-400 text-xs flex items-center gap-0.5">
              <Users className="w-3 h-3" />{exp.maxGuests}
            </span>
          )}
        </div>
      </div>
    </motion.div>
  );
}

// ── Main Page ──────────────────────────────────────────────────────────────────
const Experiences = () => {
  const { t } = useTranslation();
  const [allExp, setAllExp] = useState<ExperienceCard[]>([]);
  const [displayed, setDisplayed] = useState<ExperienceCard[]>([]);
  const [loading, setLoading] = useState(true);
  const [wishlist, setWishlist] = useState<string[]>([]);

  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("All");
  const [city, setCity] = useState("All");
  const [sortBy, setSortBy] = useState<"recommended" | "rating" | "price_asc" | "price_desc" | "newest">("recommended");
  const [maxPrice, setMaxPrice] = useState(500);
  const [showFilters, setShowFilters] = useState(false);

  const debounceRef = useRef<ReturnType<typeof setTimeout>>();

  useEffect(() => {
    api.getExperiences({ isActive: true }).then(data => {
      setAllExp(data);
      setDisplayed(data);
      setLoading(false);
    });
    api.getWishlist().then(setWishlist);

    const handler = () => api.getExperiences({ isActive: true }).then(setAllExp);
    window.addEventListener("sb:data_changed", handler);
    return () => window.removeEventListener("sb:data_changed", handler);
  }, []);

  const applyFilters = useCallback(() => {
    api.searchExperiences({
      query: query || undefined,
      city: city !== "All" ? city : undefined,
      category: category !== "All" ? category : undefined,
      maxPrice,
      sortBy,
    }).then(setDisplayed);
  }, [query, city, category, maxPrice, sortBy]);

  useEffect(() => {
    clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(applyFilters, 280);
    return () => clearTimeout(debounceRef.current);
  }, [applyFilters]);

  const toggleWishlist = async (id: string) => {
    const added = await api.toggleWishlist(id);
    setWishlist(prev => added ? [...prev, id] : prev.filter(x => x !== id));
  };

  const cities = ["All", ...Array.from(new Set(allExp.map(e => e.city)))];
  const originals = displayed.filter(e => e.category === "original");
  const standards = displayed.filter(e => e.category === "standard");

  if (loading) return (
    <div className="min-h-screen bg-white">
      <Header />
      <div className="flex flex-col items-center justify-center py-40 gap-4">
        <Loader2 className="w-8 h-8 animate-spin text-rose-400" />
        <p className="text-gray-400 font-medium">Loading experiences...</p>
      </div>
      <Footer />
    </div>
  );

  return (
    <div className="min-h-screen bg-white">
      <Header />

      {/* ── Hero Banner ── */}
      <div className="relative bg-gradient-to-r from-rose-500 via-rose-400 to-orange-400 text-white py-14 px-6 sm:px-12 overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="w-[600px] h-[600px] rounded-full bg-white absolute -top-48 -right-48" />
          <div className="w-[400px] h-[400px] rounded-full bg-white absolute -bottom-32 -left-24" />
        </div>
        <div className="relative z-10 max-w-2xl">
          <p className="text-sm font-semibold uppercase tracking-widest opacity-80 mb-2">{t("Reservation bd Originals")}</p>
          <h1 className="text-4xl sm:text-5xl font-black tracking-tight leading-tight mb-3">
            {t("Unique activities")}<br/>{t("hosted by locals")}
          </h1>
          <p className="text-white/80">{t("Cooking classes, tours, art workshops & more across Bangladesh.")}</p>
        </div>
      </div>

      {/* ── Search + Filter Bar ── */}
      <div className="sticky top-0 z-50 bg-white border-b border-gray-100 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3">
          <div className="flex items-center gap-3">
            <div className="flex-1 relative">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input type="text" placeholder={t("Search experiences, locations...")} value={query}
                onChange={e => setQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-2xl text-sm focus:ring-2 focus:ring-gray-900 outline-none bg-gray-50 focus:bg-white transition-all" />
            </div>

            <div className="relative hidden sm:block">
              <Globe2 className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <select value={city} onChange={e => setCity(e.target.value)}
                className="pl-9 pr-8 py-2.5 border border-gray-200 rounded-2xl text-sm font-medium focus:ring-2 focus:ring-gray-900 outline-none bg-gray-50 appearance-none cursor-pointer">
                {cities.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>

            <div className="relative hidden sm:block">
              <ArrowUpDown className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <select value={sortBy} onChange={e => setSortBy(e.target.value as any)}
                className="pl-9 pr-8 py-2.5 border border-gray-200 rounded-2xl text-sm font-medium focus:ring-2 focus:ring-gray-900 outline-none bg-gray-50 appearance-none cursor-pointer">
                {SORT_OPTIONS.map(o => <option key={o.value} value={o.value}>{t(o.label)}</option>)}
              </select>
            </div>

            <button onClick={() => setShowFilters(f => !f)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl border text-sm font-semibold transition-all ${showFilters ? "bg-gray-900 text-white border-gray-900" : "border-gray-200 text-gray-600 hover:border-gray-400 bg-gray-50"}`}>
              <SlidersHorizontal className="w-4 h-4" /> {t("Filters")}
            </button>
          </div>

          <AnimatePresence>
            {showFilters && (
              <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
                <div className="pt-3 pb-2 grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="sm:hidden">
                    <label className="text-xs font-bold text-gray-500 uppercase tracking-wide block mb-1">{t("City")}</label>
                    <select value={city} onChange={e => setCity(e.target.value)} className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-gray-900">
                      {cities.map(c => <option key={c}>{c}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="text-xs font-bold text-gray-500 uppercase tracking-wide block mb-1">{t("Max Price")}: ৳{maxPrice}</label>
                    <input type="range" min={10} max={500} step={10} value={maxPrice} onChange={e => setMaxPrice(+e.target.value)} className="w-full accent-rose-500" />
                    <div className="flex justify-between text-[10px] text-gray-400 mt-0.5"><span>৳10</span><span>৳500+</span></div>
                  </div>
                  <div className="sm:hidden">
                    <label className="text-xs font-bold text-gray-500 uppercase tracking-wide block mb-1">{t("Sort By")}</label>
                    <select value={sortBy} onChange={e => setSortBy(e.target.value as any)} className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-gray-900">
                      {SORT_OPTIONS.map(o => <option key={o.value} value={o.value}>{t(o.label)}</option>)}
                    </select>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Category Tabs */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex gap-1 overflow-x-auto pb-3 scrollbar-hide">
            {CATEGORIES.map(cat => (
              <button key={cat.value} onClick={() => setCategory(cat.value)}
                className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-semibold whitespace-nowrap transition-all ${category === cat.value ? "bg-gray-900 text-white shadow-sm" : "text-gray-600 hover:bg-gray-100"}`}>
                <span>{cat.emoji}</span>{t(cat.label)}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ── Content ── */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 pb-20 pt-6">
        <p className="text-sm text-gray-500 mb-6">
          {displayed.length === 0 ? t("No experiences found") : <><span className="font-semibold text-gray-900">{displayed.length}</span> {displayed.length !== 1 ? t("experiences found") : t("experience found")} </>}
          {category !== "All" && <span className="ml-1">in <span className="font-semibold text-rose-500">{t(category)}</span></span>}
          {city !== "All" && <span className="ml-1">· <span className="font-semibold">{city}</span></span>}
        </p>

        {displayed.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-32 text-center">
            <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mb-4 border border-gray-100">
              <Search className="w-8 h-8 text-gray-300" />
            </div>
            <h2 className="text-lg font-bold text-gray-600 mb-2">{t("No experiences found")}</h2>
            <p className="text-gray-400 text-sm max-w-xs">{t("Try adjusting your filters or search terms.")}</p>
            <button onClick={() => { setQuery(""); setCategory("All"); setCity("All"); setMaxPrice(500); setSortBy("recommended"); }}
              className="mt-6 px-6 py-2.5 bg-gray-900 text-white rounded-2xl text-sm font-semibold hover:bg-black transition-colors">
              {t("Clear all filters")}
            </button>
          </div>
        ) : (
          <>
            {originals.length > 0 && (
              <section className="mb-12">
                <div className="flex items-end justify-between mb-5">
                  <div>
                    <h2 className="text-2xl font-black text-gray-900">{t("Reservation bd Originals")}</h2>
                    <p className="text-gray-500 text-sm mt-1">{t("Unique experiences designed exclusively for Reservation bd")}</p>
                  </div>
                  <span className="text-xs text-gray-400 font-medium">{originals.length} {t("experiences")}</span>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                  {originals.map(exp => (
                    <ExperienceCardUI key={exp.id} exp={exp} isWishlisted={wishlist.includes(exp.id)} onToggleWishlist={toggleWishlist} />
                  ))}
                </div>
              </section>
            )}

            {standards.length > 0 && (
              <section>
                <div className="flex items-end justify-between mb-5">
                  <div>
                    <h2 className="text-2xl font-black text-gray-900">
                      {city !== "All" ? `${t("Experiences in")} ${city}` : t("All Experiences")}
                    </h2>
                    <p className="text-gray-500 text-sm mt-1">{t("Hosted by local experts and enthusiasts")}</p>
                  </div>
                  <span className="text-xs text-gray-400 font-medium">{standards.length} {t("experiences")}</span>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                  {standards.map(exp => (
                    <ExperienceCardUI key={exp.id} exp={exp} isWishlisted={wishlist.includes(exp.id)} onToggleWishlist={toggleWishlist} />
                  ))}
                </div>
              </section>
            )}
          </>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default Experiences;
