import { useEffect, useState } from "react";
import { useUser, RedirectToSignIn, useClerk } from "@clerk/react";
import { useNavigate } from "react-router-dom";
import { api, Booking, Hotel, Notification } from "../services/api";
import {
  MapPin, Calendar, Star, Send, Loader2, Bell, CheckCircle, Ban, Trash2,
  ChevronRight, MessageSquare, ShieldCheck, Gift, LifeBuoy, CreditCard,
  ChevronLeft, LayoutGrid, Compass, BookText, Headphones
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

import Header from "../components/Header";
import Footer from "../components/Footer";
import ComplaintBox from "../components/ComplaintBox";
import ExtraServices from "../components/ExtraServices";

export default function UserDashboard() {
  const { isSignedIn, isLoaded, user } = useUser();
  const { signOut } = useClerk();
  const navigate = useNavigate();

  const [bookings, setBookings] = useState<Booking[]>([]);
  const [hotels, setHotels] = useState<Record<string, Hotel>>({});
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [access, setAccess] = useState<{ hasAccess: boolean; reason?: string } | null>(null);
  const [loading, setLoading] = useState(true);
  const [mongoUser, setMongoUser] = useState<any>(null);

  // Review form
  const [comment, setComment] = useState("");
  const [rating, setRating] = useState(5);
  const [hoverStar, setHoverStar] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    if (user && user.id) {
      api.syncUser({
        clerkId: user.id,
        email: user.primaryEmailAddress?.emailAddress || "",
        name: user.fullName || "Guest",
        avatar: user.imageUrl,
      }).then(mu => {
        setMongoUser(mu);
        if (mu.status === "BLOCKED" || mu.status === "SUSPENDED") {
          setAccess({ hasAccess: false, reason: `Account is ${mu.status.toLowerCase()}. Please contact support.` });
        } else {
          setAccess({ hasAccess: true });
        }
      });
    }
  }, [user]);

  useEffect(() => {
    if (access && !access.hasAccess && access.reason?.includes("blocked")) {
      signOut();
    }
  }, [access, signOut]);

  useEffect(() => {
    if (!access?.hasAccess || !mongoUser) return;
    setLoading(true);
    api.getUserBookings(mongoUser.id).then(async (res) => {
      setBookings(res);

      // Fetch hotel details for images
      const hotelIds = Array.from(new Set(res.map(b => b.hotelId)));
      const hotelData: Record<string, Hotel> = {};
      await Promise.all(hotelIds.map(async (id) => {
        const h = await api.getHotelById(id);
        if (h) hotelData[id] = h;
      }));
      setHotels(hotelData);
      setLoading(false);
    });
    api.getNotifications(mongoUser.id).then(setNotifications);
  }, [access, mongoUser]);

  if (!isLoaded || access === null) return <div className="flex items-center justify-center min-h-screen bg-[#FAFAFA]"><Loader2 className="w-8 h-8 animate-spin text-indigo-500" /></div>;
  if (!isSignedIn) return <RedirectToSignIn />;

  if (!access.hasAccess) {
    return (
      <div className="min-h-screen bg-[#FAFAFA] flex flex-col items-center justify-center p-8 text-center relative">
        <button onClick={() => signOut()} className="absolute top-8 right-8 text-gray-500 hover:text-gray-900 font-semibold px-4 py-2 border rounded-full text-sm flex gap-2 items-center">
          <Trash2 className="w-4 h-4" /> Sign Out
        </button>
        <Ban className="w-20 h-20 text-red-500 mb-6" />
        <h1 className="text-3xl font-bold text-gray-800 mb-3">Account Restricted</h1>
        <p className="text-gray-500 mb-6 max-w-sm">{access.reason}</p>
        <button onClick={() => navigate("/")} className="bg-indigo-600 text-white px-8 py-3 rounded-full font-semibold hover:bg-indigo-700">
          Go to Home
        </button>
      </div>
    );
  }

  const confirmedBookings = bookings.filter(b => b.status === "CONFIRMED");
  const upcoming = confirmedBookings.filter(b => new Date(b.checkIn) >= new Date()).sort((a, b) => new Date(a.checkIn).getTime() - new Date(b.checkIn).getTime());
  const past = confirmedBookings.filter(b => new Date(b.checkIn) < new Date()).sort((a, b) => new Date(b.checkIn).getTime() - new Date(a.checkIn).getTime());

  // Derive the "active hotel" from the first upcoming/recent confirmed booking
  // — used to show the Extra Services catalog relevant to the user's current stay.
  const activeHotelBooking = upcoming[0] ?? past[0] ?? null;
  const activeHotelBookings = activeHotelBooking
    ? bookings.filter(b => b.hotelId === activeHotelBooking.hotelId && b.status === "CONFIRMED")
    : [];

  const now = new Date();
  const currentMonth = now.toLocaleString('default', { month: 'long', year: 'numeric' }).toUpperCase();
  const daysInMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();
  const bookingDays = upcoming.map(b => new Date(b.checkIn).getDate());

  const handleSubmitReview = async () => {
    if (!comment.trim() || !mongoUser) return;
    setSubmitting(true);
    const review: any = {
      userId: mongoUser.id,
      userName: user?.fullName || "Guest",
      hotelId: bookings[0]?.hotelId ?? "hotel_1",
      rating,
      comment,
      type: "REVIEW",
    };
    await api.addReview(review);
    setComment("");
    setSubmitted(true);
    setSubmitting(false);
    setTimeout(() => setSubmitted(false), 3000);
  };

  return (
    <div className="min-h-screen bg-white font-['Outfit', 'Inter', sans-serif]">
      <Header />

      <main className="max-w-7xl mx-auto px-4 md:px-6 py-6 space-y-10">

        {/* ── HERO SECTION ── */}
        <section className="space-y-1">
          <motion.h1
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="text-3xl font-bold text-slate-900"
          >
            Welcome back, {user?.firstName ?? "Traveller"}
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="text-base text-slate-500 font-medium"
          >
            Every stay is a story. Where will your next chapter take you?
          </motion.p>
        </section>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 pt-4">

          <div className="lg:col-span-2 space-y-12">
            {/* ── PAST ADVENTURES ── */}
            <section className="space-y-4">
              <div className="flex justify-between items-center">
                <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2 uppercase tracking-[0.2em] border-l-2 border-indigo-600 pl-3">
                  Your Past Adventures
                </h2>
                <button className="text-[10px] font-bold text-indigo-600 hover:underline uppercase tracking-widest">View Full Gallery</button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {loading ? (
                  [1, 2].map(i => <div key={i} className="aspect-[16/10] bg-slate-50 animate-pulse rounded-2xl" />)
                ) : past.length === 0 ? (
                  <div className="md:col-span-2 aspect-[16/6] bg-slate-50 border border-dashed border-slate-200 rounded-2xl flex flex-col items-center justify-center p-6 text-center">
                    <div className="w-12 h-12 bg-indigo-50 rounded-full flex items-center justify-center mb-3">
                      <Compass className="w-6 h-6 text-indigo-400" />
                    </div>
                    <h3 className="text-base font-bold text-slate-900">Plan Next Adventure</h3>
                    <p className="text-slate-500 text-sm">Create new memories with Stay Buddy.</p>
                    <button onClick={() => navigate("/hotels")} className="mt-3 text-indigo-600 text-sm font-bold hover:underline underline-offset-4">Explore stays</button>
                  </div>
                ) : (
                  <>
                    {past.slice(0, 1).map((b, idx) => (
                      <motion.div
                        key={b.id}
                        initial={{ opacity: 0, scale: 0.98 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: idx * 0.1 }}
                        className="group relative aspect-[16/10] rounded-2xl overflow-hidden shadow-sm cursor-pointer"
                        onClick={() => navigate(`/property/${b.hotelId}`)}
                      >
                        <img
                          src={hotels[b.hotelId]?.images[0] || "https://images.unsplash.com/photo-1566073771259-6a8506099945"}
                          alt={b.hotelName}
                          className="w-full h-full object-cover transition duration-700 group-hover:scale-105"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
                        <div className="absolute bottom-4 left-4 right-4 space-y-1">
                          <p className="text-[9px] uppercase tracking-widest text-white/70 font-bold">
                            {new Intl.DateTimeFormat('en-US', { month: 'long', year: 'numeric' }).format(new Date(b.checkIn))}
                          </p>
                          <h3 className="text-lg font-bold text-white leading-tight">{hotels[b.hotelId]?.name || b.hotelName}</h3>
                          <div className="flex gap-2 pt-1">
                            <span className="text-[8px] px-2 py-0.5 bg-white/10 backdrop-blur-md rounded-md text-white font-bold uppercase tracking-wider">Managed</span>
                            <span className="text-[8px] px-2 py-0.5 bg-white/10 backdrop-blur-md rounded-md text-white font-bold uppercase tracking-wider">Nature</span>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                    <div className="aspect-[16/10] bg-slate-50 border border-dashed border-slate-200 rounded-2xl flex flex-col items-center justify-center p-6 text-center group cursor-pointer hover:border-indigo-200 transition" onClick={() => navigate("/hotels")}>
                      <div className="w-9 h-9 bg-indigo-50 rounded-full flex items-center justify-center mb-2 group-hover:bg-indigo-100 transition">
                        <span className="text-xl text-indigo-600 leading-none">+</span>
                      </div>
                      <h3 className="text-sm font-bold text-slate-900">Plan Next Adventure</h3>
                      <p className="text-slate-400 text-[10px]">Create new memories</p>
                    </div>
                  </>
                )}
              </div>
            </section>

            {/* ── UPCOMING STAYS ── */}
            <section className="space-y-4">
              <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2 uppercase tracking-wide">
                <Calendar className="w-4 h-4 text-indigo-600" /> Upcoming Stays
              </h2>

              <div className="flex flex-col md:flex-row gap-6">
                {/* Mini Calendar */}
                <div className="w-full md:w-72 bg-[#F8FAFF] border border-blue-50 rounded-2xl p-5 shadow-sm">
                  <div className="flex justify-between items-center mb-4">
                    <span className="text-xs font-bold text-slate-900 tracking-wider">{currentMonth}</span>
                    <div className="flex gap-2">
                      <ChevronLeft className="w-3.5 h-3.5 text-slate-400 cursor-pointer hover:text-indigo-600 transition" />
                      <ChevronRight className="w-3.5 h-3.5 text-slate-400 cursor-pointer hover:text-indigo-600 transition" />
                    </div>
                  </div>
                  <div className="grid grid-cols-7 gap-1.5 text-center text-[9px] font-bold text-slate-400 mb-1.5">
                    {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map(d => <span key={d}>{d}</span>)}
                  </div>
                  <div className="grid grid-cols-7 gap-1">
                    {Array.from({ length: daysInMonth }, (_, i) => i + 1).map(d => {
                      const isStay = bookingDays.includes(d);
                      const isToday = d === now.getDate();
                      return (
                        <div key={d} className={`aspect-square flex items-center justify-center text-[10px] rounded-full cursor-pointer transition
                          ${isStay ? "bg-indigo-600 text-white font-bold" : isToday ? "bg-slate-100 text-slate-900 border border-slate-200" : "text-slate-600 hover:bg-white hover:shadow-sm"}`}>
                          {d}
                        </div>
                      )
                    })}
                  </div>
                </div>

                {/* Booking Preview */}
                <div className="flex-1 bg-blue-50/30 border border-blue-100 rounded-2xl flex flex-col items-center justify-center p-6 text-center">
                  {upcoming.length === 0 ? (
                    <>
                      <p className="text-slate-900 font-bold mb-2">No bookings scheduled</p>
                      <button onClick={() => navigate("/hotels")} className="text-indigo-600 font-bold text-xs flex items-center gap-1 hover:underline decoration-2">
                        Discover Destinations <ChevronRight className="w-3 h-3" />
                      </button>
                    </>
                  ) : (
                    <div className="w-full text-left space-y-3">
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="font-bold text-slate-900 text-base">{hotels[upcoming[0].hotelId]?.name || upcoming[0].hotelName}</h4>
                          <p className="text-slate-400 text-xs font-medium uppercase tracking-tight">{upcoming[0].roomType}</p>
                        </div>
                        <span className="bg-white px-2 py-0.5 rounded-md text-[9px] font-bold text-indigo-600 border border-blue-100 shadow-sm uppercase tracking-widest">Confirmed</span>
                      </div>
                      <div className="flex items-center gap-4 text-xs text-slate-600">
                        <div className="flex flex-col">
                          <span className="text-[9px] text-slate-400 font-bold uppercase tracking-wider">Check In</span>
                          <span className="font-bold text-slate-800">{upcoming[0].checkIn}</span>
                        </div>
                        <ChevronRight className="w-3 h-3 text-slate-300" />
                        <div className="flex flex-col">
                          <span className="text-[9px] text-slate-400 font-bold uppercase tracking-wider">Check Out</span>
                          <span className="font-bold text-slate-800">{upcoming[0].checkOut}</span>
                        </div>
                      </div>
                      <button onClick={() => navigate(`/property/${upcoming[0].hotelId}`)} className="w-full bg-white text-indigo-600 font-bold text-xs py-2.5 rounded-xl border border-indigo-50 shadow-sm hover:shadow-md transition">
                        Manage Booking
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </section>

            {/* ── ASSISTANCE BANNER ── */}
            <section className="bg-slate-900 rounded-[32px] p-8 relative overflow-hidden text-white group">
              <div className="relative z-10 max-w-md space-y-3">
                <h2 className="text-2xl font-bold tracking-tight">Need Assistance?</h2>
                <p className="text-slate-400 text-sm leading-relaxed">
                  Our dedicated concierge and support teams are available 24/7 to ensure your travels are seamless.
                </p>
                <div className="flex flex-wrap gap-3 pt-2">
                  <button onClick={() => navigate("/help")} className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-sm px-6 py-2.5 rounded-xl transition shadow-lg shadow-indigo-900/40">
                    Support Center
                  </button>
                  <button className="bg-white/5 hover:bg-white/10 backdrop-blur-md text-white font-bold text-sm px-6 py-2.5 rounded-xl border border-white/10 transition">
                    Submit Feedback
                  </button>
                </div>
              </div>
              <div className="absolute -top-10 -right-10 opacity-5 group-hover:opacity-10 transition duration-1000">
                <LifeBuoy className="w-64 h-64 rotate-12" />
              </div>
            </section>

            {/* ── EXTRA SERVICES ── */}
            {activeHotelBooking && (
              <section className="bg-white border border-slate-50 rounded-[32px] p-6 space-y-4">
                <ExtraServices
                  hotelId={activeHotelBooking.hotelId}
                  hotelName={hotels[activeHotelBooking.hotelId]?.name || activeHotelBooking.hotelName}
                  userId={mongoUser.id}
                  bookings={activeHotelBookings}
                />
              </section>
            )}
          </div>

          <div className="space-y-8">
            {/* ── ALERTS ── */}
            <div className="bg-white border border-slate-50 rounded-3xl p-6 shadow-sm space-y-5">
              <div className="flex justify-between items-center">
                <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Alerts</h3>
                <span className="text-[9px] font-bold text-indigo-600 bg-blue-50 px-2 py-0.5 rounded text-center uppercase tracking-tighter">2 new</span>
              </div>
              <div className="space-y-4">
                <div className="flex gap-3.5 items-start">
                  <div className="w-9 h-9 bg-yellow-50 rounded-xl flex items-center justify-center shrink-0">
                    <Star className="w-4.5 h-4.5 text-yellow-600 fill-yellow-600" />
                  </div>
                  <div className="flex-1">
                    <p className="text-xs font-bold text-slate-800">Points Expiring</p>
                    <p className="text-[11px] text-slate-500">500 bonus points expire in 2 days</p>
                  </div>
                </div>
                <div className="flex gap-3.5 items-start">
                  <div className="w-9 h-9 bg-blue-50 rounded-xl flex items-center justify-center shrink-0">
                    <MessageSquare className="w-4.5 h-4.5 text-indigo-600" />
                  </div>
                  <div className="flex-1">
                    <p className="text-xs font-bold text-slate-800">Review Stay</p>
                    <p className="text-[11px] text-slate-500">How was your stay at Eco Suite?</p>
                  </div>
                </div>
              </div>
            </div>

            {/* ── ENHANCE YOUR STAY ── */}
            <div className="bg-white border border-slate-50 rounded-3xl p-3.5 shadow-sm group cursor-pointer overflow-hidden">
              <div className="flex items-center gap-2 mb-3 px-1">
                <LayoutGrid className="w-3.5 h-3.5 text-indigo-600" />
                <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Enhance Your Stay</h3>
              </div>
              <div className="relative aspect-[16/8] rounded-2xl overflow-hidden mb-3">
                <img
                  src="https://images.unsplash.com/photo-1544161515-4ab6ce6db874"
                  alt="Spa"
                  className="w-full h-full object-cover group-hover:scale-105 transition duration-700"
                />
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                  <span className="text-white text-xs font-bold tracking-wider uppercase">Spa & Wellness</span>
                </div>
              </div>
              <button className="w-full py-2 text-[10px] font-bold text-indigo-600 hover:bg-slate-50 rounded-xl transition uppercase tracking-widest border border-transparent hover:border-indigo-100">
                Explore All Services
              </button>
            </div>

            {/* ── SUPPORT & FEEDBACK ── */}
            <div className="bg-slate-50 border border-slate-100 rounded-3xl p-6 space-y-3">
              <h3 className="text-sm font-bold text-slate-900">Support & Feedback</h3>
              <p className="text-[11px] text-slate-500 leading-relaxed font-medium">
                Report an issue or leave a review for past stays to help us improve your experience.
              </p>
              <button onClick={() => navigate("/help")} className="text-[10px] font-bold text-indigo-600 flex items-center gap-1.5 uppercase tracking-widest hover:underline underline-offset-4">
                Go to support center <ChevronRight className="w-3 h-3" />
              </button>
            </div>
          </div>

        </div>

        {/* ── FOOTER ── */}
        <div className="pt-10">
          <Footer />
        </div>

      </main>
    </div>
  );
}

// ── Sub-components ──

function StatCard({ label, value, color }: { label: string; value: string | number; color: string }) {
  const colors: Record<string, string> = { indigo: "border-indigo-400", blue: "border-blue-400", green: "border-green-400", gray: "border-gray-300" };
  return (
    <div className={`bg-white rounded-xl shadow p-5 border-l-4 ${colors[color]}`}>
      <p className="text-xs text-gray-500 font-medium">{label}</p>
      <p className="text-2xl font-bold text-gray-800 mt-1">{value}</p>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="bg-white rounded-2xl shadow p-6">
      <h2 className="text-lg font-bold text-gray-800 mb-5">{title}</h2>
      {children}
    </div>
  );
}

function EmptyState({ message, cta, onCta }: { message: string; cta?: string; onCta?: () => void }) {
  return (
    <div className="text-center py-10 text-gray-400">
      <p className="mb-2">{message}</p>
      {cta && onCta && (
        <button onClick={onCta} className="text-indigo-600 underline text-sm">{cta}</button>
      )}
    </div>
  );
}

function BookingList({ bookings }: { bookings: Booking[] }) {
  return (
    <div className="space-y-3">
      {bookings.map(b => (
        <div key={b.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl border hover:shadow-sm transition">
          <div className="flex items-center gap-4">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center ${b.paymentMethod === "bkash" ? "bg-pink-100" : "bg-indigo-100"}`}>
              <CreditCard className={`w-5 h-5 ${b.paymentMethod === "bkash" ? "text-pink-600" : "text-indigo-600"}`} />
            </div>
            <div>
              <p className="font-semibold text-gray-800">{b.hotelName}</p>
              <p className="text-xs text-gray-500">{b.roomType}</p>
              <p className="text-xs text-gray-400 flex items-center gap-1 mt-0.5">
                <Calendar className="w-3 h-3" /> {b.checkIn} → {b.checkOut} ({b.nights} nights)
              </p>
            </div>
          </div>
          <div className="text-right">
            <p className="font-bold text-green-600 text-lg">৳{b.totalPrice}</p>
            <span className={`text-xs px-2 py-0.5 rounded-full font-semibold ${b.status === "CONFIRMED" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-600"}`}>
              {b.status}
            </span>
            <p className="text-xs text-gray-400 mt-0.5">via {b.paymentMethod ?? "–"}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
