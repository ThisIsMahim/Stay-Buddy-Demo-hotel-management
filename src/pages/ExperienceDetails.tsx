/**
 * ExperienceDetails — Dynamic, API-Driven Detail Page
 * Loads experience data from backend (localStorage mock)
 * Shows: photo gallery, all amenities/services, host info,
 *        what's included, reviews, and sticky booking panel.
 * Route: /experiences/:id
 */
import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import {
  Star, MapPin, Clock, Users, Globe2, ChevronLeft, ChevronRight,
  Heart, Share2, CheckCircle2, XCircle, Loader2, X,
  Wifi, Tv, Wind, Coffee, ShieldCheck, Package, User,
  CreditCard, Smartphone, Banknote, CalendarDays, Info,
  AlertCircle, ChevronDown
} from "lucide-react";
import { useUser, useClerk } from "@clerk/react";
import { api, ExperienceCard, ExperienceBooking, ExperienceReview } from "../services/api";
import { motion, AnimatePresence } from "framer-motion";

// ── Amenity Icon Map ─────────────────────────────────────────────────────────
const AMENITY_ICONS: Record<string, React.ReactNode> = {
  "WiFi": <Wifi className="w-5 h-5" />,
  "TV": <Tv className="w-5 h-5" />,
  "Air Conditioning": <Wind className="w-5 h-5" />,
  "Tea & Snacks": <Coffee className="w-5 h-5" />,
  "First Aid": <ShieldCheck className="w-5 h-5" />,
  "Life jackets": <ShieldCheck className="w-5 h-5" />,
  "Complimentary Wine": <Coffee className="w-5 h-5" />,
};
const amenityIcon = (name: string) => AMENITY_ICONS[name] ?? <Package className="w-5 h-5" />;

// ── Photo Gallery ─────────────────────────────────────────────────────────────
function PhotoGallery({ images, title }: { images: string[]; title: string }) {
  const [lightbox, setLightbox] = useState<number | null>(null);
  const allImgs = images.length > 0 ? images : ["/placeholder.jpg"];

  const prev = () => setLightbox(i => i === null ? null : (i - 1 + allImgs.length) % allImgs.length);
  const next = () => setLightbox(i => i === null ? null : (i + 1) % allImgs.length);

  return (
    <>
      {/* Grid Layout */}
      <div className={`grid gap-2 rounded-2xl overflow-hidden h-[420px] sm:h-[480px] ${allImgs.length >= 3 ? "grid-cols-2" : "grid-cols-1"}`}>
        {/* Main/Left Image */}
        <div
          className="relative cursor-pointer overflow-hidden bg-gray-100 col-span-1 row-span-2"
          onClick={() => setLightbox(0)}
        >
          <img src={allImgs[0]} alt={title} className="w-full h-full object-cover hover:scale-105 transition-transform duration-700" onError={e => { (e.target as any).src = "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800"; }} />
          <div className="absolute inset-0 bg-black/0 hover:bg-black/10 transition-colors" />
        </div>

        {/* Right column — up to 4 smaller images */}
        {allImgs.length >= 2 && (
          <div className={`grid gap-2 ${allImgs.length >= 3 ? "grid-rows-2" : "grid-rows-1"}`}>
            {allImgs.slice(1, 5).map((src, i) => (
              <div
                key={i}
                className="relative cursor-pointer overflow-hidden bg-gray-100"
                onClick={() => setLightbox(i + 1)}
              >
                <img src={src} alt={`${title} ${i + 2}`} className="w-full h-full object-cover hover:scale-105 transition-transform duration-700" onError={e => { (e.target as any).src = "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=600"; }} />
                {/* "Show all" overlay on last thumb */}
                {i === Math.min(allImgs.length - 2, 3) && allImgs.length > 5 && (
                  <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                    <span className="text-white font-bold text-sm">+{allImgs.length - 5} more</span>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* "Show all photos" button */}
        {allImgs.length > 1 && (
          <button onClick={() => setLightbox(0)} className="absolute right-4 bottom-4 bg-white border border-gray-900 px-4 py-2 rounded-xl text-sm font-semibold shadow-md hover:bg-gray-50 transition-colors z-10 flex items-center gap-2">
            <svg viewBox="0 0 16 16" className="w-4 h-4" fill="currentColor"><path d="M11 1.5l1.5 1.5v11.5l-1.5 1.5h-10l-1.5-1.5v-11.5l1.5-1.5h10zm-1 2h-8v10h8v-10z" /></svg>
            Show all photos
          </button>
        )}
      </div>

      {/* Lightbox */}
      <AnimatePresence>
        {lightbox !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/95 z-[300] flex items-center justify-center"
            onClick={() => setLightbox(null)}
          >
            <button onClick={() => setLightbox(null)} className="absolute top-4 right-4 p-2 bg-white/10 hover:bg-white/20 rounded-full text-white transition-colors z-10">
              <X className="w-6 h-6" />
            </button>
            <button onClick={e => { e.stopPropagation(); prev(); }} className="absolute left-4 p-3 bg-white/10 hover:bg-white/20 rounded-full text-white transition-colors z-10">
              <ChevronLeft className="w-6 h-6" />
            </button>
            <div className="max-w-5xl max-h-[85vh] w-full px-16" onClick={e => e.stopPropagation()}>
              <img src={allImgs[lightbox]} alt={`${title} ${lightbox + 1}`} className="w-full h-full object-contain rounded-xl" />
              <p className="text-white/60 text-center text-sm mt-3">{lightbox + 1} / {allImgs.length}</p>
            </div>
            <button onClick={e => { e.stopPropagation(); next(); }} className="absolute right-4 p-3 bg-white/10 hover:bg-white/20 rounded-full text-white transition-colors z-10">
              <ChevronRight className="w-6 h-6" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

// ── Booking Panel (Sticky sidebar) ────────────────────────────────────────────
function BookingPanel({ exp, mongoUser }: { exp: ExperienceCard; mongoUser?: any }) {
  const { openSignIn } = useClerk();
  const today = new Date().toISOString().split("T")[0];
  const [date, setDate] = useState(today);
  const [guests, setGuests] = useState(1);
  const [payment, setPayment] = useState<"bkash" | "card" | "cash">("bkash");
  const [booking, setBooking] = useState<ExperienceBooking | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const totalPrice = exp.price * guests;

  const handleBook = async () => {
    if (!mongoUser) { openSignIn(); return; }
    if (!date) { setError("Please select a date."); return; }
    setLoading(true); setError("");
    try {
      const result = await api.bookExperience({
        experienceId: exp.id,
        userId: mongoUser.id,
        userName: mongoUser.name || "Guest User",
        userEmail: mongoUser.email || "guest@reservationbd.com",
        date, guests, paymentMethod: payment,
      });
      setBooking(result);
    } catch { setError("Booking failed. Please try again."); }
    setLoading(false);
  };

  if (booking) return (
    <div className="border border-gray-200 rounded-3xl p-6 shadow-lg text-center space-y-4">
      <div className="w-16 h-16 bg-green-50 rounded-full flex items-center justify-center mx-auto">
        <CheckCircle2 className="w-8 h-8 text-green-500" />
      </div>
      <h3 className="font-bold text-gray-900 text-lg">Booking Confirmed!</h3>
      <p className="text-sm text-gray-500">Booking ID: <span className="font-mono font-bold bg-gray-100 px-2 py-0.5 rounded text-gray-800">#{booking.id.slice(0, 8).toUpperCase()}</span></p>
      <div className="bg-gray-50 rounded-2xl p-4 text-left space-y-2 text-sm">
        <div className="flex justify-between"><span className="text-gray-500">Date</span><span className="font-medium">{booking.date}</span></div>
        <div className="flex justify-between"><span className="text-gray-500">Guests</span><span className="font-medium">{booking.guests}</span></div>
        <div className="flex justify-between font-bold text-gray-900 border-t border-gray-200 pt-2 mt-1"><span>Total Paid</span><span>৳{booking.totalPrice}</span></div>
      </div>
      <button onClick={() => setBooking(null)} className="w-full border border-gray-200 rounded-2xl py-3 text-sm font-semibold hover:bg-gray-50 transition-colors">
        Book Another Date
      </button>
    </div>
  );

  return (
    <div className="border border-gray-200 rounded-3xl p-6 shadow-xl">
      {/* Price */}
      <div className="flex items-baseline gap-1 mb-5">
        <span className="text-2xl font-bold text-gray-900">৳{exp.price}</span>
        <span className="text-gray-500 text-sm font-normal">/ guest</span>
      </div>

      {/* Date & Guests */}
      <div className="border border-gray-200 rounded-2xl overflow-hidden mb-4">
        <div className="p-3 border-b border-gray-200">
          <label className="block text-[10px] font-bold text-gray-700 uppercase tracking-widest mb-1">Date</label>
          <input
            type="date"
            value={date}
            min={today}
            onChange={e => setDate(e.target.value)}
            className="w-full text-sm font-medium text-gray-900 outline-none"
          />
        </div>
        <div className="p-3">
          <label className="block text-[10px] font-bold text-gray-700 uppercase tracking-widest mb-1">Guests</label>
          <div className="flex items-center gap-3">
            <button onClick={() => setGuests(g => Math.max(1, g - 1))} className="w-7 h-7 rounded-full border border-gray-300 flex items-center justify-center text-gray-600 hover:border-gray-900 transition-colors text-lg font-medium">−</button>
            <span className="text-sm font-semibold flex-1 text-center">{guests} guest{guests > 1 ? "s" : ""}</span>
            <button onClick={() => setGuests(g => Math.min(exp.maxGuests || 20, g + 1))} className="w-7 h-7 rounded-full border border-gray-300 flex items-center justify-center text-gray-600 hover:border-gray-900 transition-colors text-lg font-medium">+</button>
          </div>
          {exp.maxGuests && <p className="text-[10px] text-gray-400 mt-1">Max {exp.maxGuests} guests</p>}
        </div>
      </div>

      {/* Payment */}
      <div className="mb-4">
        <label className="block text-[10px] font-bold text-gray-700 uppercase tracking-widest mb-2">Payment</label>
        <div className="grid grid-cols-3 gap-2">
          {[
            { key: "bkash", label: "bKash", icon: <Smartphone className="w-4 h-4" />, color: "border-pink-400 bg-pink-50 text-pink-600" },
            { key: "card", label: "Card", icon: <CreditCard className="w-4 h-4" />, color: "border-blue-400 bg-blue-50 text-blue-600" },
            { key: "cash", label: "Cash", icon: <Banknote className="w-4 h-4" />, color: "border-green-400 bg-green-50 text-green-600" },
          ].map(opt => (
            <button key={opt.key} onClick={() => setPayment(opt.key as any)}
              className={`flex flex-col items-center gap-1 p-2.5 rounded-xl border-2 text-[11px] font-bold transition-all ${payment === opt.key ? opt.color : "border-gray-200 text-gray-400 hover:border-gray-300"}`}
            >
              {opt.icon}{opt.label}
            </button>
          ))}
        </div>
      </div>

      {error && <p className="text-rose-500 text-xs mb-3">{error}</p>}

      {/* Price breakdown */}
      <div className="space-y-1.5 mb-4 text-sm">
        <div className="flex justify-between text-gray-500"><span>৳{exp.price} × {guests} guest{guests > 1 ? "s" : ""}</span><span>৳{totalPrice}</span></div>
        <div className="flex justify-between font-bold text-gray-900 border-t border-gray-100 pt-1.5"><span>Total</span><span>৳{totalPrice}</span></div>
      </div>

      <button
        onClick={handleBook}
        disabled={loading || !date || exp.isSoldOut}
        className={`w-full font-bold py-4 rounded-2xl transition-all shadow-lg active:scale-[0.98] flex items-center justify-center gap-2 ${exp.isSoldOut ? "bg-gray-200 text-gray-500 shadow-none cursor-not-allowed" : "bg-rose-500 hover:bg-rose-600 disabled:opacity-60 text-white shadow-rose-100"}`}
      >
        {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : exp.isSoldOut ? "Fully Booked" : "Book This Experience"}
      </button>
      <p className="text-center text-xs text-gray-400 mt-2">{exp.cancellationPolicy || "Contact host for cancellation policy"}</p>
    </div>
  );
}

// ── Reviews Section ───────────────────────────────────────────────────────────
function ReviewsSection({ exp, mongoUser }: { exp: ExperienceCard; mongoUser?: any }) {
  const { openSignIn } = useClerk();
  const [reviews, setReviews] = useState<ExperienceReview[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [newRating, setNewRating] = useState(5);
  const [newComment, setNewComment] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [showAll, setShowAll] = useState(false);

  useEffect(() => {
    api.getExperienceReviews(exp.id).then(r => { setReviews(r); setLoading(false); });
  }, [exp.id]);

  const submitReview = async () => {
    if (!mongoUser) { openSignIn(); return; }
    if (!newComment.trim()) return;
    setSubmitting(true);
    const r = await api.addExperienceReview({
      experienceId: exp.id, userId: mongoUser.id,
      userName: mongoUser.name || "Guest User", rating: newRating, comment: newComment.trim(),
    });
    setReviews(prev => [r, ...prev]);
    setNewComment(""); setSubmitted(true); setSubmitting(false); setShowForm(false);
  };

  const displayed = showAll ? reviews : reviews.slice(0, 6);

  return (
    <div className="border-t border-gray-100 pt-10">
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
          <Star className="w-5 h-5 fill-black" />
          {exp.rating} · {reviews.length} review{reviews.length !== 1 ? "s" : ""}
        </h2>
        <button onClick={() => setShowForm(!showForm)} className="px-4 py-2 border border-gray-300 rounded-xl text-sm font-semibold hover:bg-gray-50 transition-colors">
          {showForm ? "Cancel" : "Write a Review"}
        </button>
      </div>

      {/* Review Form */}
      <AnimatePresence>
        {showForm && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden mb-8">
            <div className="bg-gray-50 rounded-2xl p-5 space-y-4">
              <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map(s => (
                  <button key={s} onClick={() => setNewRating(s)}>
                    <Star className={`w-7 h-7 transition-colors cursor-pointer ${s <= newRating ? "fill-amber-400 text-amber-400" : "text-gray-300 fill-gray-100 hover:fill-amber-200"}`} />
                  </button>
                ))}
              </div>
              <textarea className="w-full border border-gray-200 rounded-xl p-3 text-sm resize-none focus:ring-2 focus:ring-gray-900 outline-none bg-white" rows={4} placeholder="Share your experience..." value={newComment} onChange={e => setNewComment(e.target.value)} />
              {submitted && <p className="text-green-600 text-sm font-semibold flex items-center gap-1"><CheckCircle2 className="w-4 h-4" /> Thanks for your review!</p>}
              <button onClick={submitReview} disabled={submitting || !newComment.trim()} className="px-6 py-3 bg-gray-900 text-white rounded-xl text-sm font-bold hover:bg-black disabled:opacity-50 transition-colors flex items-center gap-2">
                {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : "Submit Review"}
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {loading ? (
        <div className="flex justify-center py-8"><Loader2 className="w-6 h-6 animate-spin text-gray-300" /></div>
      ) : reviews.length === 0 ? (
        <p className="text-gray-400 py-8 text-center">No reviews yet. Be the first to share your experience!</p>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-8">
            {displayed.map(r => (
              <div key={r.id} className="space-y-2">
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-full bg-gradient-to-br from-rose-400 to-purple-500 flex items-center justify-center text-white font-bold">
                    {r.userName[0]}
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900 text-sm">{r.userName}</p>
                    <p className="text-xs text-gray-400">{new Date(r.createdAt).toLocaleDateString("en-BD", { year: "numeric", month: "long" })}</p>
                  </div>
                </div>
                <div className="flex gap-0.5">
                  {[1, 2, 3, 4, 5].map(s => <Star key={s} className={`w-3.5 h-3.5 ${s <= r.rating ? "fill-amber-400 text-amber-400" : "fill-gray-100 text-gray-200"}`} />)}
                </div>
                <p className="text-gray-700 text-sm leading-relaxed">{r.comment}</p>
              </div>
            ))}
          </div>
          {reviews.length > 6 && (
            <button onClick={() => setShowAll(!showAll)} className="mt-8 px-6 py-3 border border-gray-900 rounded-xl text-sm font-semibold hover:bg-gray-50 transition-colors flex items-center gap-2">
              {showAll ? "Show less" : `Show all ${reviews.length} reviews`}
              <ChevronDown className={`w-4 h-4 transition-transform ${showAll ? "rotate-180" : ""}`} />
            </button>
          )}
        </>
      )}
    </div>
  );
}

// ── Main Page ─────────────────────────────────────────────────────────────────
const ExperienceDetails = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useUser();
  const [exp, setExp] = useState<ExperienceCard | null>(null);
  const [loading, setLoading] = useState(true);
  const [wishlisted, setWishlisted] = useState(false);
  const [showMobileBook, setShowMobileBook] = useState(false);
  const [mongoUser, setMongoUser] = useState<any>(null);

  useEffect(() => {
    if (user && user.id) {
      api.syncUser({
        clerkId: user.id,
        email: user.primaryEmailAddress?.emailAddress || "",
        name: user.fullName || "Guest",
        avatar: user.imageUrl,
      }).then(setMongoUser);
    } else {
      setMongoUser(null);
    }
  }, [user]);

  useEffect(() => {
    if (!id) return;
    api.getExperienceById(id).then(data => {
      setExp(data);
      setLoading(false);
    });
    api.getWishlist().then(w => setWishlisted(w.includes(id ?? "")));

    const handler = () => api.getExperienceById(id).then(setExp);
    window.addEventListener("sb:data_changed", handler);
    return () => window.removeEventListener("sb:data_changed", handler);
  }, [id]);

  const toggleWishlist = async () => {
    if (!id) return;
    const added = await api.toggleWishlist(id);
    setWishlisted(added);
  };

  if (loading) return (
    <div className="min-h-screen bg-white">
      <Header />
      <div className="flex flex-col items-center justify-center py-48 gap-4">
        <Loader2 className="w-8 h-8 animate-spin text-rose-400" />
        <p className="text-gray-400">Loading experience details…</p>
      </div>
      <Footer />
    </div>
  );

  if (!exp) return (
    <div className="min-h-screen bg-white">
      <Header />
      <div className="flex flex-col items-center justify-center py-48 gap-4 text-center px-6">
        <AlertCircle className="w-12 h-12 text-gray-300" />
        <h2 className="text-xl font-bold text-gray-600">Experience not found</h2>
        <p className="text-gray-400">This experience may have been removed or is no longer available.</p>
        <button onClick={() => navigate("/experiences")} className="mt-4 px-6 py-3 bg-gray-900 text-white rounded-2xl font-semibold hover:bg-black transition-colors">
          Back to Experiences
        </button>
      </div>
      <Footer />
    </div>
  );

  const allImages = exp.images && exp.images.length > 0 ? exp.images : [exp.image];

  return (
    <div className="min-h-screen bg-white">
      <Header />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
        {/* ── Breadcrumb ── */}
        <nav className="flex items-center gap-2 text-sm text-gray-500 mb-5">
          <Link to="/experiences" className="hover:underline font-medium">Experiences</Link>
          <span>/</span>
          <span className="text-gray-800 font-medium truncate">{exp.title}</span>
        </nav>

        {/* ── Title Row ── */}
        <div className="flex items-start justify-between mb-5 gap-4">
          <div className="flex-1 min-w-0">
            <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 leading-tight mb-2">{exp.title}</h1>
            <div className="flex flex-wrap items-center gap-3 text-sm text-gray-600">
              <span className="flex items-center gap-1"><Star className="w-4 h-4 fill-black text-black" /><span className="font-semibold text-gray-900">{exp.rating}</span> ({exp.reviews} reviews)</span>
              <span className="text-gray-300">·</span>
              <span className="flex items-center gap-1"><MapPin className="w-4 h-4" />{exp.location}</span>
              {exp.hotelName && <><span className="text-gray-300">·</span><span className="font-medium text-gray-800">{exp.hotelName}</span></>}
            </div>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <button className="flex items-center gap-1.5 text-sm font-semibold hover:bg-gray-100 px-3 py-2 rounded-xl transition-colors text-gray-700 underline">
              <Share2 className="w-4 h-4" /> Share
            </button>
            <button onClick={toggleWishlist} className={`flex items-center gap-1.5 text-sm font-semibold px-3 py-2 rounded-xl transition-colors underline ${wishlisted ? "text-rose-500" : "text-gray-700 hover:bg-gray-100"}`}>
              <Heart className={`w-4 h-4 ${wishlisted ? "fill-rose-500" : ""}`} /> {wishlisted ? "Saved" : "Save"}
            </button>
          </div>
        </div>

        {/* ── Photo Gallery ── */}
        <div className="relative mb-10">
          <PhotoGallery images={allImages} title={exp.title} />
        </div>

        {/* ── Main Content ── */}
        <div className="flex flex-col lg:flex-row gap-12">
          {/* Left Column */}
          <div className="flex-1 min-w-0 space-y-10">

            {/* Experience hosted by */}
            <div className="flex items-center justify-between border-b border-gray-100 pb-8">
              <div>
                <h2 className="text-xl font-bold text-gray-900">
                  {exp.category === "original" ? "Reservation bd Original" : "Experience"} hosted by {exp.hostName || exp.hotelName || "Host"}
                </h2>
                <div className="flex flex-wrap gap-3 mt-2 text-sm text-gray-500">
                  {exp.duration && <span className="flex items-center gap-1"><Clock className="w-4 h-4" />{exp.duration}</span>}
                  {exp.maxGuests && <span className="flex items-center gap-1"><Users className="w-4 h-4" />Up to {exp.maxGuests} guests</span>}
                  {exp.spokenLanguages && <span className="flex items-center gap-1"><Globe2 className="w-4 h-4" />{exp.spokenLanguages.join(", ")}</span>}
                </div>
              </div>
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-rose-400 to-amber-400 flex items-center justify-center text-white font-black text-xl shrink-0">
                {(exp.hostName || exp.hotelName || "H")[0]}
              </div>
            </div>

            {/* Highlights */}
            {exp.highlights && exp.highlights.length > 0 && (
              <div className="space-y-4">
                {exp.highlights.map((h, i) => {
                  const icons = [<ShieldCheck className="w-7 h-7 text-gray-800" />, <Star className="w-7 h-7 text-gray-800" />, <CheckCircle2 className="w-7 h-7 text-gray-800" />];
                  return (
                    <div key={i} className="flex gap-4 items-start">
                      <div className="shrink-0 mt-0.5">{icons[i % 3]}</div>
                      <div><p className="font-semibold text-gray-900">{h}</p></div>
                    </div>
                  );
                })}
              </div>
            )}

            <div className="border-t border-gray-100" />

            {/* Description */}
            <div>
              <h2 className="text-xl font-bold text-gray-900 mb-3">About this experience</h2>
              <p className="text-gray-700 text-[15px] leading-relaxed whitespace-pre-line">{exp.description}</p>
            </div>

            {/* Amenities */}
            {exp.amenities && exp.amenities.length > 0 && (
              <div className="border-t border-gray-100 pt-8">
                <h2 className="text-xl font-bold text-gray-900 mb-5">What's provided</h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                  {exp.amenities.map(a => (
                    <div key={a} className="flex items-center gap-3 p-3 rounded-xl border border-gray-100 hover:border-gray-200 transition-colors">
                      <span className="text-gray-600">{amenityIcon(a)}</span>
                      <span className="text-sm font-medium text-gray-700">{a}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Services */}
            {exp.services && exp.services.length > 0 && (
              <div className="border-t border-gray-100 pt-8">
                <h2 className="text-xl font-bold text-gray-900 mb-5">Services included</h2>
                <div className="space-y-2">
                  {exp.services.map(s => (
                    <div key={s} className="flex items-center gap-2 text-sm text-gray-700">
                      <CheckCircle2 className="w-4 h-4 text-green-500 shrink-0" />{s}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* What's Included / What to Bring */}
            {((exp.whatIncludes && exp.whatIncludes.length > 0) || (exp.whatToBring && exp.whatToBring.length > 0) || (exp.whatNotIncluded && exp.whatNotIncluded.length > 0)) && (
              <div className="border-t border-gray-100 pt-8">
                <h2 className="text-xl font-bold text-gray-900 mb-6">What to expect</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                  {exp.whatIncludes && exp.whatIncludes.length > 0 && (
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-green-500" /> Included
                      </h3>
                      <ul className="space-y-1.5">
                        {exp.whatIncludes.map(item => <li key={item} className="text-sm text-gray-600 flex items-start gap-2"><span className="text-green-400 mt-0.5">✓</span>{item}</li>)}
                      </ul>
                    </div>
                  )}
                  {exp.whatToBring && exp.whatToBring.length > 0 && (
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                        <Package className="w-4 h-4 text-amber-500" /> What to bring
                      </h3>
                      <ul className="space-y-1.5">
                        {exp.whatToBring.map(item => <li key={item} className="text-sm text-gray-600 flex items-start gap-2"><span className="text-amber-400 mt-0.5">→</span>{item}</li>)}
                      </ul>
                    </div>
                  )}
                  {exp.whatNotIncluded && exp.whatNotIncluded.length > 0 && (
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                        <XCircle className="w-4 h-4 text-rose-400" /> Not included
                      </h3>
                      <ul className="space-y-1.5">
                        {exp.whatNotIncluded.map(item => <li key={item} className="text-sm text-gray-600 flex items-start gap-2"><span className="text-rose-400 mt-0.5">✗</span>{item}</li>)}
                      </ul>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Tags */}
            {exp.tags && exp.tags.length > 0 && (
              <div className="border-t border-gray-100 pt-8">
                <h2 className="text-xl font-bold text-gray-900 mb-4">Categories</h2>
                <div className="flex flex-wrap gap-2">
                  {exp.tags.map(t => (
                    <span key={t} className="px-4 py-2 bg-gray-50 border border-gray-200 rounded-full text-sm font-medium text-gray-700">{t}</span>
                  ))}
                </div>
              </div>
            )}

            {/* Meeting Point */}
            {exp.meetingPoint && (
              <div className="border-t border-gray-100 pt-8">
                <h2 className="text-xl font-bold text-gray-900 mb-4">Where we'll meet</h2>
                <div className="flex items-start gap-3 mb-4">
                  <MapPin className="w-5 h-5 text-gray-600 mt-0.5 shrink-0" />
                  <p className="text-gray-700">{exp.meetingPoint}</p>
                </div>
                <div className="w-full h-[280px] bg-gray-100 rounded-2xl overflow-hidden">
                  <iframe
                    src={`https://www.google.com/maps/embed/v1/search?key=AIzaSyD-9tSrke72PouQMnMX-a7eZSW0jkFMBWY&q=${encodeURIComponent(exp.meetingPoint)}`}
                    width="100%" height="100%" style={{ border: 0 }} loading="lazy"
                    title="Meeting point map"
                  />
                </div>
              </div>
            )}

            {/* Host Section */}
            {(exp.hostName || exp.hostBio) && (
              <div className="border-t border-gray-100 pt-8">
                <h2 className="text-xl font-bold text-gray-900 mb-6">About your host</h2>
                <div className="flex gap-5 items-start">
                  <div className="w-20 h-20 rounded-full bg-gradient-to-br from-rose-400 to-amber-400 flex items-center justify-center text-white font-black text-3xl shrink-0">
                    {(exp.hostName || "H")[0]}
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-gray-900">{exp.hostName || exp.hotelName}</h3>
                    {exp.hotelName && <p className="text-gray-500 text-sm mb-3">Host at {exp.hotelName}</p>}
                    {exp.hostBio && <p className="text-gray-700 text-[15px] leading-relaxed">{exp.hostBio}</p>}
                    {exp.spokenLanguages && (
                      <p className="text-sm text-gray-500 mt-2 flex items-center gap-1"><Globe2 className="w-3.5 h-3.5" /> Speaks: {exp.spokenLanguages.join(", ")}</p>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Things to Know */}
            <div className="border-t border-gray-100 pt-8">
              <h2 className="text-xl font-bold text-gray-900 mb-6">Things to know</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {exp.cancellationPolicy && (
                  <div className="flex gap-3">
                    <Info className="w-5 h-5 text-gray-600 shrink-0 mt-0.5" />
                    <div><h4 className="font-semibold text-gray-900 mb-1">Cancellation Policy</h4><p className="text-sm text-gray-600">{exp.cancellationPolicy}</p></div>
                  </div>
                )}
                {exp.ageRequirement && (
                  <div className="flex gap-3">
                    <User className="w-5 h-5 text-gray-600 shrink-0 mt-0.5" />
                    <div><h4 className="font-semibold text-gray-900 mb-1">Guest Requirements</h4><p className="text-sm text-gray-600">{exp.ageRequirement}</p></div>
                  </div>
                )}
              </div>
            </div>

            {/* Reviews */}
            <ReviewsSection exp={exp} mongoUser={mongoUser} />
          </div>

          {/* Right Column — Sticky Booking */}
          <div className="hidden lg:block w-[380px] shrink-0">
            <div className="sticky top-28">
              <BookingPanel exp={exp} mongoUser={mongoUser} />
              {exp.hotelId && (
                <div className="mt-4 p-4 bg-gray-50 rounded-2xl text-center">
                  <p className="text-xs text-gray-400 mb-2">Part of</p>
                  <p className="font-semibold text-gray-800 text-sm">{exp.hotelName}</p>
                  <Link to={`/property/${exp.hotelId}`} className="text-xs text-rose-500 hover:underline mt-1 block">View Hotel →</Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      {/* ── Mobile Booking Bar ── */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 flex items-center justify-between z-50 shadow-2xl">
        <div>
          <span className="font-bold text-gray-900">৳{exp.price}</span>
          <span className="text-gray-500 text-sm"> / guest</span>
          <div className="flex items-center gap-1 text-xs text-gray-500 mt-0.5">
            <Star className="w-3 h-3 fill-amber-400 text-amber-400" /> {exp.rating} · {exp.reviews} reviews
          </div>
        </div>
        <button
          onClick={() => !exp.isSoldOut && setShowMobileBook(true)}
          disabled={exp.isSoldOut}
          className={`font-bold px-6 py-3 rounded-2xl transition-all shadow-lg active:scale-95 ${exp.isSoldOut ? "bg-gray-200 text-gray-500 shadow-none cursor-not-allowed" : "bg-rose-500 hover:bg-rose-600 text-white shadow-rose-100"}`}
        >
          {exp.isSoldOut ? "Fully Booked" : "Book Now"}
        </button>
      </div>

      {/* Mobile Bottom Sheet */}
      <AnimatePresence>
        {showMobileBook && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-[150] lg:hidden"
            onClick={() => setShowMobileBook(false)}
          >
            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 30, stiffness: 300 }}
              className="absolute bottom-0 left-0 right-0 bg-white rounded-t-3xl p-6 max-h-[90vh] overflow-y-auto"
              onClick={e => e.stopPropagation()}
            >
              <div className="w-10 h-1 bg-gray-300 rounded-full mx-auto mb-5" />
              <BookingPanel exp={exp} mongoUser={mongoUser} />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="pb-24 lg:pb-0">
        <Footer />
      </div>
    </div>
  );
};

export default ExperienceDetails;
