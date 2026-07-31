/**
 * Owner Dashboard — Full Professional Implementation
 * Tabs: Analytics · Rooms · Availability Calendar · Housekeeping · Wallet · Pricing · Guests · Notifications
 */
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { useSearchParams, Link, useNavigate } from "react-router-dom";
import {
  TrendingUp, Plus, BedDouble, Wallet,
  RefreshCw, Trash2, Lock, Bell, Calendar,
  Users, Tag, Brush, BarChart3, Loader2,
  CheckCircle2, WrenchIcon, SparkleIcon, Home, X, LogOut,
  Wifi, Tv, Wind, MonitorDot, Coffee, Utensils, ShieldCheck, Thermometer,
  Waves, Map, Snowflake, Fan, AlertCircle, Ticket, Star, ShieldAlert,
  Clock, CreditCard, ChevronRight, Image as ImageIcon, Zap
} from "lucide-react";
import {
  api, Booking, Hotel, Room, WalletTransaction,
  HousekeepingTask, RoomStatus, Notification,
  GuestProfile, OccupancyReport, DynamicPricingRule, CalendarDay,
  UserProfile, HotelOwner, Offer, ExperienceCard
} from "../services/api";
import MultiImageUploader from "../components/MultiImageUploader";
import { AddHotelModal, AddRoomModal, RoomModal, AddPricingModal, AddOfferModal, AddExperienceModal, AddOfflineBtn } from "./owner/components/OwnerModals";
import { HotelSettingsTab } from "./owner/components/HotelSettingsTab";
import { RoomCardPremium } from "./owner/components/RoomCardPremium";
import { StatCard, Badge, Loading } from "./owner/components/Shared";
import { BookingTableFull } from "./owner/components/BookingTable";

type Tab = "analytics" | "bookings" | "rooms" | "calendar" | "housekeeping" | "wallet" | "pricing" | "guests" | "notifications" | "experiences" | "settings";

type BookingTypeFilter = "ALL" | "ONLINE" | "OFFLINE";
type BookingStatusFilter = "ALL" | Booking["status"];

const DEMO_HOTEL_ID = "hotel_1";

export default function OwnerDashboard() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('ownerToken');
    localStorage.removeItem('ownerUser');
    navigate('/owner/login');
  };

  const [access, setAccess] = useState<{ hasAccess: boolean; reason?: string } | null>(null);
  const [currentUser, setCurrentUser] = useState<UserProfile | HotelOwner | null>(null);
  const [hotel, setHotel] = useState<Hotel | null>(null);
  const [hotels, setHotels] = useState<Hotel[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [rooms, setRooms] = useState<Room[]>([]);
  const [wallet, setWallet] = useState<{ transactions: WalletTransaction[]; totalBalance: number } | null>(null);
  const [housekeeping, setHousekeeping] = useState<HousekeepingTask[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [guestProfiles, setGuestProfiles] = useState<GuestProfile[]>([]);
  const [occupancy, setOccupancy] = useState<OccupancyReport | null>(null);
  const [pricingRules, setPricingRules] = useState<DynamicPricingRule[]>([]);
  const [offers, setOffers] = useState<Offer[]>([]);
  const [calendarDays, setCalendarDays] = useState<CalendarDay[]>([]);
  const [todayBookingsCount, setTodayBookingsCount] = useState(0);
  const [ownerExperiences, setOwnerExperiences] = useState<ExperienceCard[]>([]);
  const [showAddExperience, setShowAddExperience] = useState(false);
  const [selectedCalRoom, setSelectedCalRoom] = useState<string>("");
  const [tab, setTab] = useState<Tab>("analytics");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [refresh, setRefresh] = useState(0);
  const [authenticatedOwnerId, setAuthenticatedOwnerId] = useState<string | null>(null);
  const [showAddRoom, setShowAddRoom] = useState(false);
  const [showAddHotel, setShowAddHotel] = useState(false);
  const [showAddPricing, setShowAddPricing] = useState(false);
  const [showAddOffer, setShowAddOffer] = useState(false);
  const [bookingTypeFilter, setBookingTypeFilter] = useState<BookingTypeFilter>("ALL");
  const [bookingStatusFilter, setBookingStatusFilter] = useState<BookingStatusFilter>("ALL");
  const unread = notifications.filter(n => !n.isRead).length;

  useEffect(() => {
    const ownerToken = localStorage.getItem('ownerToken');
    const ownerData = localStorage.getItem('ownerUser');

    if (!ownerToken || !ownerData) {
      navigate('/owner/login');
      return;
    }

    try {
      const u = JSON.parse(ownerData);
      setCurrentUser(u);
      setAuthenticatedOwnerId(u.id);
      setAccess({ hasAccess: true });
    } catch (e) {
      console.error("Auth error:", e);
      handleLogout();
    }
  }, [refresh]);

  useEffect(() => {
    if (access?.reason?.includes("blocked")) {
      handleLogout();
    }
  }, [access, refresh]);

  useEffect(() => {
    if (!access?.hasAccess || !authenticatedOwnerId) return;
    const now = new Date();
    api.getOwnerHotels(authenticatedOwnerId).then(h => {
      setHotels(h);
      if (!hotel && h.length > 0) setHotel(h[0]);
    });
    api.getOwnerWallet(authenticatedOwnerId).then(setWallet);
    api.getNotifications(authenticatedOwnerId).then(setNotifications);
  }, [access, refresh, hotel, authenticatedOwnerId]); // Added hotel to dependencies to ensure it runs when hotel is set initially

  useEffect(() => {
    if (!hotel) return;
    api.getHotelBookings(hotel.id).then(setBookings);
    api.getHotelRooms(hotel.id).then(setRooms);
    api.getHotelWallet(hotel.id).then(setWallet);
    api.getHousekeepingTasks(hotel.id).then(setHousekeeping);
    api.getNotifications(authenticatedOwnerId!).then(setNotifications);
    api.getHotelGuestProfiles(hotel.id).then(setGuestProfiles);
    api.getOccupancyReportByMonth(hotel.id, new Date().getFullYear(), new Date().getMonth() + 1).then(setOccupancy);
    api.getCalendarDays?.(hotel.id, selectedCalRoom || undefined).then(setCalendarDays);
    api.getPricingRules(hotel.id).then(setPricingRules);
    api.getHotelOffers(hotel.id).then(setOffers);
    // ...
    if (authenticatedOwnerId) api.getOwnerExperiences(authenticatedOwnerId).then(setOwnerExperiences);
  }, [hotel, refresh, selectedCalRoom, authenticatedOwnerId]);

  // Calendar: load when room or tab changes
  useEffect(() => {
    if (!selectedCalRoom && rooms[0]) setSelectedCalRoom(rooms[0].id);
    if (selectedCalRoom) {
      const now = new Date();
      api.getRoomCalendar(selectedCalRoom, now.getFullYear(), now.getMonth() + 1).then(setCalendarDays);
    }
  }, [selectedCalRoom, rooms, refresh]);

  // Auth handled in useEffect

  // â”€â”€ ACCESS GUARD â”€â”€
  if (!access) return <Loading />;

  if (!access.hasAccess) {
    const isExpired = access.reason?.includes("expired");
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-8 text-center relative overflow-hidden">
        {/* Background Glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-indigo-600/10 rounded-full blur-[120px] pointer-events-none" />

        <button
          onClick={() => handleLogout()}
          className="absolute top-12 right-12 bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white font-black uppercase tracking-[0.2em] px-8 py-4 rounded-full text-[10px] flex gap-3 items-center border border-slate-800 transition-all shadow-xl active:scale-95"
        >
          <LogOut className="w-4 h-4" /> Sign Out
        </button>

        <div className="relative z-10 animate-in zoom-in-95 fade-in duration-500">
          <div className="w-24 h-24 bg-rose-500/10 rounded-[32px] border border-rose-500/20 flex items-center justify-center mx-auto mb-8 shadow-2xl shadow-rose-900/20">
            <ShieldAlert className="w-12 h-12 text-rose-500" />
          </div>
          <h1 className="text-4xl font-black text-white mb-4 uppercase tracking-tight">Access Restricted</h1>
          <p className="text-slate-400 mb-10 max-w-sm mx-auto font-medium leading-relaxed">{access.reason}</p>

          {isExpired && (
            <div className="bg-slate-900/60 backdrop-blur-xl p-10 rounded-[40px] shadow-2xl border border-slate-800 max-w-md w-full animate-in slide-in-from-bottom-5 duration-700">
              <div className="flex items-center gap-3 mb-6 bg-amber-500/10 px-4 py-2 rounded-xl border border-amber-500/20 w-max mx-auto">
                <Clock className="w-4 h-4 text-amber-500" />
                <span className="text-[10px] text-amber-500 font-black uppercase tracking-widest">Subscription Expired</span>
              </div>
              <h2 className="text-2xl font-black text-white mb-2 uppercase tracking-tight">Renew Subscription</h2>
              <p className="text-sm text-slate-500 mb-8 font-medium italic">Your subscription has expired. Renew to regain full access to your property management tools.</p>

              <div className="flex flex-col gap-4">
                <button
                  onClick={async () => {
                    alert("Redirecting to payment...");
                    await api.extendSubscription(authenticatedOwnerId!, 12);
                    reload();
                  }}
                  className="bg-indigo-600 hover:bg-indigo-500 text-white w-full py-5 rounded-[22px] font-black uppercase tracking-widest text-xs transition shadow-xl shadow-indigo-600/20 active:scale-95 flex items-center justify-center gap-3"
                >
                  <CreditCard className="w-5 h-5" /> Pay Now (৳5,000/yr)
                </button>
                <button className="text-[10px] text-slate-600 font-black uppercase tracking-widest hover:text-slate-400 mt-2 transition-colors">
                  Contact Support
                </button>
              </div>
            </div>
          )}
        </div>

        <p className="absolute bottom-12 left-1/2 -translate-x-1/2 text-slate-700 text-[10px] font-black uppercase tracking-[0.3em]">
          Reservation bd · v4.2
        </p>
      </div>
    );
  }

  const reload = () => setRefresh(p => p + 1);

  const online = bookings.filter(b => b.type === "ONLINE");
  const offline = bookings.filter(b => b.type === "OFFLINE");
  const totalRevenue = bookings.filter(b => b.status === "CONFIRMED").reduce((s, b) => s + b.totalPrice, 0);

  const filteredBookings = bookings
    .filter(b => bookingTypeFilter === "ALL" ? true : b.type === bookingTypeFilter)
    .filter(b => bookingStatusFilter === "ALL" ? true : b.status === bookingStatusFilter);

  const tabNav: { id: Tab; label: string; icon: React.ReactNode; badge?: number }[] = [
    { id: "analytics", label: "Analytics", icon: <BarChart3 className="w-4 h-4" /> },
    { id: "bookings", label: "Bookings", icon: <BedDouble className="w-4 h-4" /> },
    { id: "rooms", label: "Rooms", icon: <BedDouble className="w-4 h-4" /> },
    { id: "calendar", label: "Calendar", icon: <Calendar className="w-4 h-4" /> },
    { id: "housekeeping", label: "Housekeeping", icon: <Brush className="w-4 h-4" /> },
    { id: "wallet", label: "Wallet", icon: <Wallet className="w-4 h-4" /> },
    { id: "pricing", label: "Pricing", icon: <Tag className="w-4 h-4" /> },
    { id: "settings", label: "Settings", icon: <WrenchIcon className="w-4 h-4" /> },
    { id: "guests", label: "Guests (CRM)", icon: <Users className="w-4 h-4" /> },
    { id: "experiences", label: "Experiences", icon: <Star className="w-4 h-4" />, badge: ownerExperiences.length || undefined },
    { id: "notifications", label: "Alerts", icon: <Bell className="w-4 h-4" />, badge: unread },
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 font-sans selection:bg-indigo-500/30 selection:text-indigo-200 flex flex-col overflow-hidden">

      {/* â•â•â• TOP BAR â•â•â• */}
      <header className="fixed top-0 left-0 right-0 z-[60] bg-slate-950/80 backdrop-blur-2xl border-b border-slate-800/60">
        <div className="flex items-center justify-between px-6 md:px-10 h-[72px]">
          {/* Left: Logo + Mobile Toggle */}
          <div className="flex items-center gap-4">
            <button
              className="p-2 bg-slate-900 border border-slate-800 rounded-xl text-slate-400 hover:text-white md:hidden"
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" /></svg>
            </button>
            <div className="flex items-center gap-3 group cursor-pointer" onClick={() => (window.location.href = "/")}>
              <div className="w-10 h-10 bg-indigo-600 rounded-2xl flex items-center justify-center shadow-lg shadow-indigo-600/20 group-hover:scale-110 transition-transform">
                <Home className="w-5 h-5 text-white" />
              </div>
              <div className="hidden sm:block">
                <p className="font-black text-white text-base tracking-tighter uppercase leading-none">Reservation bd</p>
                <p className="text-[9px] text-slate-500 font-bold uppercase tracking-widest mt-0.5">Owner Dashboard</p>
              </div>
            </div>
          </div>

          {/* Center: Hotel Selector */}
          <div className="flex items-center gap-4">
            {hotel && (
              <div className="flex items-center gap-3 bg-slate-900/60 border border-slate-800 rounded-2xl px-4 py-2.5">
                <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse flex-shrink-0" />
                {hotels.length > 1 ? (
                  <select
                    value={hotel?.id}
                    onChange={(e) => setHotel(hotels.find(h => h.id === e.target.value) || null)}
                    className="bg-transparent text-white text-xs font-black uppercase tracking-tight outline-none cursor-pointer pr-2 max-w-[200px]"
                  >
                    {hotels.map(h => <option key={h.id} value={h.id} className="bg-slate-900">{h.name}</option>)}
                  </select>
                ) : (
                  <span className="text-white text-xs font-black uppercase tracking-tight truncate max-w-[200px]">{hotel.name}</span>
                )}
                <span className="text-[9px] text-slate-500 font-bold uppercase tracking-widest hidden md:inline">· {hotel.city} · Verified</span>
              </div>
            )}
          </div>

          {/* Right: Register + Clock */}
          <div className="flex items-center gap-4">
            <button
              onClick={() => setShowAddHotel(true)}
              className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white font-black uppercase tracking-widest px-5 py-2.5 rounded-2xl text-[10px] transition-all shadow-lg shadow-indigo-600/20 active:scale-95"
            >
              <Plus className="w-4 h-4" /> <span className="hidden sm:inline">Register Hotel</span>
            </button>
            <div className="hidden lg:flex items-center gap-4 bg-slate-900/50 backdrop-blur-xl border border-slate-800 rounded-2xl px-5 py-2 shadow-lg">
              <div className="text-right">
                <p className="text-white font-black text-xs tabular-nums">{new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                <p className="text-slate-500 text-[8px] font-bold uppercase">{new Date().toLocaleDateString(undefined, { weekday: 'short' })}</p>
              </div>
              <div className="w-px h-6 bg-slate-800" />
              <div className="text-left">
                <p className="text-indigo-400 font-black text-xs">Online</p>
                <p className="text-slate-500 text-[8px] font-bold uppercase">v1.8.5</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* â•â•â• BODY (SIDEBAR + MAIN) â•â•â• */}
      <div className="flex flex-1 pt-[72px]">

        {/* Mobile Overlay */}
        {isSidebarOpen && (
          <div
            className="fixed inset-0 bg-black/60 z-[40] md:hidden backdrop-blur-sm transition-opacity"
            onClick={() => setIsSidebarOpen(false)}
          />
        )}

        {/* Sidebar — Navigation Only */}
        <aside className={`w-[240px] bg-slate-950/90 md:bg-slate-950/50 backdrop-blur-3xl border-r border-slate-800 flex flex-col fixed top-[72px] bottom-0 z-50 transition-transform duration-300 ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"} md:translate-x-0`}>
          <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto custom-scrollbar">
            <p className="px-4 text-[10px] font-black text-slate-600 uppercase tracking-[0.2em] mb-4">Navigation</p>
            {tabNav.map(t => {
              const isActive = tab === t.id;
              return (
                <button key={t.id} onClick={() => { setTab(t.id); setIsSidebarOpen(false); }}
                  className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-2xl text-xs transition-all relative group ${isActive ? "bg-indigo-600 text-white shadow-xl shadow-indigo-600/20" : "text-slate-500 hover:text-white hover:bg-white/5"}`}>
                  <span className={`${isActive ? "text-white" : "text-slate-500 group-hover:text-indigo-400"} transition-colors`}>{t.icon}</span>
                  <span className="font-black uppercase tracking-widest text-[10px]">{t.label}</span>
                  {t.badge ? (
                    <span className="ml-auto bg-rose-600 text-white text-[10px] font-black min-w-[18px] h-[18px] flex items-center justify-center rounded-lg shadow-lg shadow-rose-600/20">{t.badge}</span>
                  ) : null}
                  {isActive && (
                    <div className="absolute left-0 w-1 h-6 bg-white rounded-r-full" />
                  )}
                </button>
              );
            })}
          </nav>

          {/* User Info + Logout */}
          <div className="p-5 border-t border-slate-800/50 bg-slate-900/20">
            <div className="flex items-center gap-3 mb-5 px-1">
              <div className="w-9 h-9 rounded-2xl bg-gradient-to-tr from-indigo-600 to-purple-600 text-white flex items-center justify-center font-black text-xs uppercase shadow-md shadow-indigo-500/20">
                {currentUser?.name.charAt(0)}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-black text-white truncate leading-none mb-1">{currentUser?.name}</p>
                <p className="text-[9px] font-black text-slate-500 truncate uppercase tracking-widest">Property Admin</p>
              </div>
            </div>
            <button onClick={handleLogout} className="w-full flex items-center justify-center gap-3 text-rose-500 hover:text-white text-[10px] font-black uppercase tracking-widest py-3 border border-rose-500/20 rounded-2xl hover:bg-rose-600 transition-all duration-300">
              <LogOut className="w-3.5 h-3.5" /> Sign Out
            </button>
          </div>
        </aside>

        {/* Main Content */}
        <main className="md:ml-[240px] flex-1 p-4 md:p-10 max-w-full overflow-x-hidden relative">
          {/* Header Decor */}
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-indigo-600/5 blur-[120px] rounded-full pointer-events-none" />

          <div className="flex flex-col xl:flex-row xl:items-end justify-between gap-6 mb-12 relative">
            <div>
              <div className="flex items-center gap-3 text-slate-500 font-black text-[10px] uppercase tracking-[0.3em] mb-3 mt-4 md:mt-0">
                <TrendingUp className="w-3 h-3 text-indigo-400" />
                Dashboard Overview
              </div>
              <h1 className="text-3xl md:text-4xl font-black text-white tracking-tight uppercase break-words">
                {tabNav.find(t => t.id === tab)?.label}
              </h1>
              <p className="text-slate-400 font-medium mt-1">Managing · {hotel?.name}</p>
            </div>
          </div>

          {/* â”€â”€ ANALYTICS â”€â”€ */}
          {tab === "analytics" && hotel && (
            <div className="space-y-12 relative z-10 animate-in fade-in slide-in-from-bottom-5 duration-700">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                <StatCard label="Total Revenue" value={`৳${totalRevenue.toLocaleString()}`} color="indigo" icon={<Wallet className="w-6 h-6" />} subLabel="Confirmed Bookings" />
                <StatCard label="Today's Bookings" value={todayBookingsCount} color="purple" icon={<Bell className="w-6 h-6" />} subLabel="New Today" />
                <StatCard label="Online Bookings" value={online.length} color="blue" icon={<Users className="w-6 h-6" />} subLabel="Online Reservations" />
                <StatCard label="Walk-in Bookings" value={offline.length} color="amber" icon={<RefreshCw className="w-6 h-6" />} subLabel="Offline Reservations" />
                <StatCard label="Wallet Balance" value={`৳${(wallet?.totalBalance ?? 0).toLocaleString()}`} color="emerald" icon={<TrendingUp className="w-6 h-6" />} subLabel="Available for Payout" />
              </div>

              {occupancy && (
                <div className="bg-slate-900/40 backdrop-blur-md rounded-[40px] p-10 border border-slate-800 shadow-2xl">
                  <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-12 gap-6">
                    <div>
                      <h2 className="text-2xl font-black text-white tracking-tight uppercase flex items-center gap-3">
                        <BarChart3 className="w-7 h-7 text-indigo-500" /> Monthly Performance
                      </h2>
                      <p className="text-slate-500 text-[10px] font-black uppercase tracking-[0.2em] mt-2 italic">Occupancy rates & revenue by room type</p>
                    </div>
                    <div className="flex gap-10">
                      <div className="text-right">
                        <p className="text-4xl font-black text-indigo-400 tracking-tighter tabular-nums">৳{occupancy.totalRevenue.toLocaleString()}</p>
                        <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mt-1">Monthly Revenue</p>
                      </div>
                      <div className="w-px h-12 bg-slate-800" />
                      <div className="text-right">
                        <p className="text-4xl font-black text-emerald-400 tracking-tighter tabular-nums">{occupancy.avgOccupancyRate}%</p>
                        <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mt-1">Average Occupancy</p>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-x-16 gap-y-10">
                    {occupancy.roomStats.map(rs => (
                      <div key={rs.roomId} className="space-y-4 group">
                        <div className="flex justify-between items-end">
                          <div>
                            <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">{rs.roomType}</p>
                            <p className="text-lg font-black text-slate-200">৳{rs.totalRevenue.toLocaleString()}</p>
                          </div>
                          <span className="text-sm font-black text-indigo-400 group-hover:scale-110 transition-transform tabular-nums">{rs.occupancyRate}%</span>
                        </div>
                        <div className="h-3 w-full bg-slate-800 rounded-full overflow-hidden border border-slate-700/50">
                          <div
                            className="h-full bg-gradient-to-r from-indigo-600 via-indigo-500 to-purple-600 rounded-full transition-all duration-1000 group-hover:brightness-125 shadow-[0_0_15px_rgba(79,70,229,0.3)]"
                            style={{ width: `${rs.occupancyRate}%` }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="bg-slate-900/40 backdrop-blur-md rounded-[40px] border border-slate-800 overflow-hidden shadow-2xl">
                <div className="px-10 py-6 border-b border-slate-800 flex justify-between items-center bg-slate-900/20">
                  <h2 className="font-black text-white uppercase tracking-tight flex items-center gap-3">
                    <RefreshCw className="w-5 h-5 text-purple-500 animate-spin-slow" /> Recent Bookings
                  </h2>
                  <div className="bg-purple-500/10 border border-purple-500/20 px-4 py-1.5 rounded-full">
                    <span className="text-[10px] text-purple-400 font-black uppercase tracking-widest">{todayBookingsCount} Bookings Today</span>
                  </div>
                </div>
                <div className="divide-y divide-slate-800/50">
                  {bookings.filter(b => b.createdAt.startsWith(new Date().toISOString().split("T")[0])).length === 0 ? (
                    <div className="p-20 text-center text-slate-500">
                      <div className="w-16 h-16 bg-slate-800/50 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-slate-700">
                        <Loader2 className="w-8 h-8 opacity-20" />
                      </div>
                      <p className="text-[10px] font-black uppercase tracking-widest">No bookings today yet</p>
                    </div>
                  ) : (
                    bookings.filter(b => b.createdAt.startsWith(new Date().toISOString().split("T")[0])).map(b => (
                      <div key={b.id} className="p-6 hover:bg-white/[0.02] flex items-center justify-between transition-all group">
                        <div className="flex items-center gap-6">
                          <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shadow-inner border transition-transform group-hover:scale-110 ${b.type === "ONLINE" ? "bg-blue-600/10 border-blue-500/30 text-blue-400" : "bg-amber-600/10 border-amber-500/30 text-amber-400"}`}>
                            {b.type === "ONLINE" ? <MonitorDot className="w-6 h-6" /> : <Users className="w-6 h-6" />}
                          </div>
                          <div>
                            <p className="font-black text-white text-base uppercase tracking-tight">{b.roomType} · Room {rooms.find(r => r.id === b.roomId)?.roomNumber || "N/A"}</p>
                            <p className="text-[11px] text-slate-500 font-bold uppercase tracking-widest mt-1">{b.type} · {b.nights} Night{b.nights > 1 ? 's' : ''} · <span className="text-emerald-400">৳{b.totalPrice.toLocaleString()}</span></p>
                          </div>
                        </div>
                        <div className="text-right">
                          <Badge color={b.status === "CONFIRMED" ? "green" : "amber"}>{b.status}</Badge>
                          <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest mt-2">{new Date(b.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          )}

          {/* â”€â”€ BOOKINGS â”€â”€ */}
          {tab === "bookings" && hotel && (
            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-5 duration-700">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-slate-900/40 backdrop-blur-md p-6 md:p-8 rounded-[32px] border border-slate-800 shadow-2xl">
                <div>
                  <h2 className="text-2xl font-black text-white tracking-tight uppercase">All Bookings</h2>
                  <p className="text-slate-500 text-[10px] font-black uppercase tracking-widest mt-1 italic">Manage all reservations for your property</p>
                </div>
                <AddOfflineBtn hotelId={hotel.id} rooms={rooms} users={guestProfiles} onDone={reload} />
              </div>

              <div className="bg-slate-900/40 backdrop-blur-md rounded-[40px] border border-slate-800 overflow-hidden shadow-2xl">
                <div className="p-8 border-b border-slate-800 flex justify-between items-center bg-slate-900/20">
                  <div className="flex gap-4">
                    <div className="bg-indigo-500/10 border border-indigo-500/20 px-4 py-2 rounded-2xl flex items-center gap-2">
                      <MonitorDot className="w-4 h-4 text-indigo-400" />
                      <span className="text-[10px] text-white font-black uppercase tracking-widest">{online.length} Cloud</span>
                    </div>
                    <div className="bg-amber-500/10 border border-amber-500/20 px-4 py-2 rounded-2xl flex items-center gap-2">
                      <Users className="w-4 h-4 text-amber-400" />
                      <span className="text-[10px] text-white font-black uppercase tracking-widest">{offline.length} Direct</span>
                    </div>
                  </div>
                  <div className="flex gap-3 items-center">
                    <div className="flex items-center gap-2 bg-slate-950/50 p-1.5 rounded-2xl border border-slate-800">
                      {(["ALL", "ONLINE", "OFFLINE"] as const).map(t => (
                        <button
                          key={t}
                          onClick={() => setBookingTypeFilter(t)}
                          className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${bookingTypeFilter === t ? "bg-indigo-600 text-white shadow-lg shadow-indigo-600/20" : "text-slate-500 hover:text-slate-300 hover:bg-white/5"}`}
                        >
                          {t === "ALL" ? "ALL" : t === "ONLINE" ? "CLOUD" : "DIRECT"}
                        </button>
                      ))}
                    </div>
                    <select
                      value={bookingStatusFilter}
                      onChange={e => setBookingStatusFilter(e.target.value as BookingStatusFilter)}
                      className="bg-slate-950/50 border border-slate-800 text-white text-[10px] font-black uppercase tracking-widest rounded-2xl px-4 py-3"
                    >
                      <option value="ALL">ALL STATUS</option>
                      <option value="CONFIRMED">CONFIRMED</option>
                      <option value="PENDING">PENDING</option>
                      <option value="CANCELLED">CANCELLED</option>
                    </select>
                  </div>
                </div>
                <div className="overflow-x-auto custom-scrollbar">
                  <table className="w-full text-left">
                    <thead className="bg-slate-900/50 border-b border-slate-800">
                      <tr>
                        <th className="p-6 text-[10px] font-black text-slate-500 uppercase tracking-widest">Booking ID</th>
                        <th className="p-6 text-[10px] font-black text-slate-500 uppercase tracking-widest">Room</th>
                        <th className="p-6 text-[10px] font-black text-slate-500 uppercase tracking-widest">Stay Dates</th>
                        <th className="p-6 text-[10px] font-black text-slate-500 uppercase tracking-widest text-center">Type</th>
                        <th className="p-6 text-[10px] font-black text-slate-500 uppercase tracking-widest text-center">Status</th>
                        <th className="p-6 text-[10px] font-black text-slate-500 uppercase tracking-widest text-right">Amount</th>
                        <th className="p-6 text-[10px] font-black text-slate-500 uppercase tracking-widest text-center">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/30">
                      {filteredBookings.map(b => (
                        <tr key={b.id} className="hover:bg-white/[0.02] transition-all group">
                          <td className="p-6">
                            <p className="font-black text-white text-xs tracking-tighter tabular-nums mb-1 uppercase">#RES-{b.id.slice(0, 4)}</p>
                            <p className="text-[9px] text-slate-500 font-bold uppercase tracking-widest">Created {new Date(b.createdAt).toLocaleDateString()}</p>
                          </td>
                          <td className="p-6">
                            <p className="font-black text-white text-xs uppercase tracking-tight">{b.roomType}</p>
                            <p className="text-[10px] text-indigo-400 font-bold uppercase tracking-widest mt-1">Room {rooms.find(r => r.id === b.roomId)?.roomNumber || "N/A"}</p>
                          </td>
                          <td className="p-6">
                            <p className="font-black text-white text-xs uppercase tracking-tighter">{b.checkIn} → {b.checkOut}</p>
                            <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mt-1">{b.nights} Night{b.nights > 1 ? 's' : ''}</p>
                          </td>
                          <td className="p-6 text-center">
                            <Badge color={b.type === "ONLINE" ? "blue" : "amber"}>{b.type}</Badge>
                          </td>
                          <td className="p-6 text-center">
                            <Badge color={b.status === "CONFIRMED" ? "green" : b.status === "PENDING" ? "amber" : "rose"}>{b.status}</Badge>
                          </td>
                          <td className="p-6 text-right font-black text-emerald-400 text-sm tabular-nums">৳{b.totalPrice.toLocaleString()}</td>
                          <td className="p-6 text-center">
                            <div className="flex justify-center gap-2">
                              {b.status === "PENDING" && (
                                <button onClick={() => api.processCheckIn(b.id).then(reload)} title="Process Check-In" className="p-2.5 rounded-xl bg-indigo-500/10 text-indigo-500 border border-indigo-500/20 hover:bg-indigo-500 hover:text-white transition-all shadow-lg active:scale-95">
                                  <CheckCircle2 className="w-4 h-4" />
                                </button>
                              )}
                              {b.status === "CONFIRMED" && (
                                <button onClick={() => api.processCheckOut(b.id).then(reload)} title="Process Check-Out" className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 hover:bg-emerald-500 hover:text-white transition-all shadow-lg active:scale-95">
                                  <LogOut className="w-4 h-4" />
                                </button>
                              )}
                              {b.status !== "CANCELLED" && (
                                <button onClick={() => api.cancelBooking(b.id).then(reload)} title="Abort Reservation" className="p-2.5 rounded-xl bg-rose-500/10 text-rose-500 border border-rose-500/20 hover:bg-rose-500 hover:text-white transition-all shadow-lg active:scale-95">
                                  <X className="w-4 h-4" />
                                </button>
                              )}
                            </div>
                          </td>
                        </tr>
                      ))}
                      {filteredBookings.length === 0 && (
                        <tr>
                          <td colSpan={7} className="p-12 text-center">
                            <p className="text-slate-500 font-black uppercase tracking-[0.2em] text-[10px]">No reservations match your filters</p>
                            <p className="text-slate-600 text-xs mt-3">
                              Showing: <span className="text-slate-300 font-bold">{bookingTypeFilter}</span> / <span className="text-slate-300 font-bold">{bookingStatusFilter}</span>
                            </p>
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* â”€â”€ ROOMS â”€â”€ */}
          {tab === "rooms" && hotel && (
            <div className="space-y-12 animate-in fade-in slide-in-from-bottom-5 duration-700">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-slate-900/40 backdrop-blur-md p-6 md:p-10 rounded-[32px] md:rounded-[40px] border border-slate-800 shadow-2xl">
                <div>
                  <h2 className="text-2xl md:text-3xl font-black text-white tracking-tight uppercase">Your Rooms</h2>
                  <p className="text-slate-500 text-[10px] font-black uppercase tracking-[0.2em] mt-2 italic">Manage your rooms and inventory</p>
                </div>
                <button onClick={() => setShowAddRoom(true)} className="bg-indigo-600 hover:bg-indigo-500 text-white flex items-center gap-3 px-6 md:px-8 py-3 md:py-4 rounded-2xl md:rounded-3xl text-xs font-black uppercase tracking-[0.2em] transition-all shadow-xl shadow-indigo-600/20 active:scale-95 w-full sm:w-auto justify-center">
                  <Plus className="w-5 h-5 transition-transform" /> Add Room
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8">
                {rooms.map(room => (
                  <RoomCardPremium
                    key={room.id}
                    room={room}
                    onUpdate={reload}
                  />
                ))}
                <button onClick={() => setShowAddRoom(true)} className="aspect-[4/5] rounded-[32px] md:rounded-[40px] border-2 border-dashed border-slate-800 flex flex-col items-center justify-center p-8 md:p-12 text-center group hover:border-indigo-500/50 hover:bg-indigo-500/[0.02] transition-all duration-500">
                  <div className="w-20 h-20 bg-slate-900 rounded-3xl flex items-center justify-center mb-6 border border-slate-800 group-hover:scale-110 group-hover:bg-indigo-600 group-hover:text-white transition-all duration-500">
                    <Plus className="w-10 h-10" />
                  </div>
                  <p className="text-white font-black text-sm uppercase tracking-tight mb-2">Add New Room</p>
                  <p className="text-slate-500 text-[10px] font-bold uppercase tracking-widest leading-relaxed">Add a new room type to your property</p>
                </button>
              </div>
            </div>
          )}

          {/* â”€â”€ CALENDAR â”€â”€ */}
          {tab === "calendar" && hotel && (
            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-5 duration-700">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-slate-900/40 backdrop-blur-md p-6 md:p-8 rounded-[32px] border border-slate-800 shadow-2xl">
                <div>
                  <h2 className="text-2xl font-black text-white tracking-tight uppercase">Availability Calendar</h2>
                  <p className="text-slate-500 text-[10px] font-black uppercase tracking-widest mt-1 italic">View room availability by date</p>
                </div>
                <div className="flex gap-4">
                  <select
                    value={selectedCalRoom}
                    onChange={e => setSelectedCalRoom(e.target.value)}
                    className="bg-slate-900 border border-slate-700 text-white text-xs font-black uppercase tracking-widest rounded-xl px-4 py-2"
                  >
                    <option value="">All Rooms</option>
                    {rooms.map(r => <option key={r.id} value={r.id}>{r.type} {r.roomNumber}</option>)}
                  </select>
                </div>
              </div>

              <div className="bg-slate-900/40 backdrop-blur-md rounded-[40px] border border-slate-800 p-8 shadow-2xl overflow-x-auto">
                <div className="grid grid-cols-7 gap-4 min-w-[800px]">
                  {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map(d => (
                    <div key={d} className="text-center text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] pb-4">{d}</div>
                  ))}
                  {calendarDays.map((day, idx) => {
                    const isToday = day.date === new Date().toISOString().split("T")[0];
                    return (
                      <div key={idx} className={`aspect-square rounded-3xl border p-3 transition-all hover:scale-105 group relative flex flex-col ${isToday ? "bg-indigo-600/20 border-indigo-500 shadow-[0_0_20px_rgba(79,70,229,0.2)]" : day.isBooked ? "bg-rose-600/10 border-rose-500/30" : "bg-slate-900/30 border-slate-800 hover:border-slate-700"}`}>
                        <span className={`text-xs font-black tabular-nums ${isToday ? "text-white" : "text-slate-500"}`}>{day.date.split("-")[2]}</span>
                        <div className="mt-2 flex-1 flex flex-col gap-1">
                          {day.isBooked ? (
                            <div className="h-1.5 w-full rounded-full bg-rose-500" />
                          ) : (
                            <div className="h-1.5 w-full rounded-full bg-emerald-500/40" />
                          )}
                          {day.guestName && (
                            <p className="text-[8px] text-rose-400 font-bold truncate leading-tight">{day.guestName}</p>
                          )}
                        </div>
                        <div className="text-center">
                          <span className={`text-[7px] font-black uppercase tracking-wider ${day.isBooked ? "text-rose-400" : "text-emerald-400"}`}>
                            {day.availableCount}/{day.totalCount}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* â”€â”€ HOUSEKEEPING â”€â”€ */}
          {tab === "housekeeping" && hotel && (
            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-5 duration-700">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-slate-900/40 backdrop-blur-md p-6 md:p-8 rounded-[32px] border border-slate-800 shadow-2xl">
                <div>
                  <h2 className="text-2xl font-black text-white tracking-tight uppercase">Housekeeping</h2>
                  <p className="text-slate-500 text-[10px] font-black uppercase tracking-widest mt-1 italic">Room cleaning & maintenance tasks</p>
                </div>
                <div className="flex gap-4">
                  <div className="bg-slate-900 px-6 py-3 rounded-2xl border border-slate-800 flex items-center gap-3">
                    <p className="text-[10px] font-black text-slate-500 uppercase">Active Tasks</p>
                    <p className="text-sm font-black text-white">{housekeeping.filter(t => t.status === "CLEANING").length} Tasks</p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {housekeeping.map(task => (
                  <div key={task.id} className="bg-slate-900/40 backdrop-blur-md p-8 rounded-[32px] border border-slate-800 hover:border-indigo-500/30 transition-all group relative overflow-hidden">
                    <div className="flex justify-between items-start mb-6">
                      <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shadow-inner border ${task.status === "AVAILABLE" ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-400" : task.status === "CLEANING" ? "bg-amber-500/10 border-amber-500/20 text-amber-400" : "bg-rose-500/10 border-rose-500/20 text-rose-400"}`}>
                        {task.status === "AVAILABLE" ? <CheckCircle2 className="w-6 h-6" /> : <Brush className="w-6 h-6" />}
                      </div>
                      <Badge color={task.status === "AVAILABLE" ? "green" : task.status === "CLEANING" ? "amber" : "rose"}>{task.status}</Badge>
                    </div>
                    <h3 className="text-lg font-black text-white uppercase tracking-tight mb-1">Floor {task.floorNumber}</h3>
                    <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest mb-6">Type: {task.roomType}</p>

                    <div className="space-y-4 mb-8">
                      <div className="flex justify-between text-[10px] font-black uppercase tracking-widest">
                        <span className="text-slate-600">Cleaning Status</span>
                        <span className={task.status === "AVAILABLE" ? "text-emerald-400" : "text-amber-400"}>{task.status}</span>
                      </div>
                      <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
                        <div className={`h-full rounded-full ${task.status === "AVAILABLE" ? "bg-emerald-500 w-full" : "bg-amber-500 w-1/2 animate-pulse"}`} />
                      </div>
                    </div>

                    <button
                      onClick={() => api.updateRoomStatus(task.id, task.status === "AVAILABLE" ? "CLEANING" : "AVAILABLE").then(reload)}
                      className="w-full py-4 rounded-2xl bg-slate-800/50 hover:bg-slate-800 text-white text-[10px] font-black uppercase tracking-widest border border-slate-700 transition-all active:scale-95"
                    >
                      Toggle Status
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* â”€â”€ WALLET â”€â”€ */}
          {tab === "wallet" && (
            <div className="space-y-10 animate-in fade-in slide-in-from-bottom-5 duration-700">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-8">
                  <div className="bg-gradient-to-br from-indigo-600 to-indigo-800 p-12 rounded-[48px] shadow-2xl relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-[80px] -mr-48 -mt-48 group-hover:scale-110 transition-transform duration-1000" />
                    <div className="relative z-10 flex flex-col h-full justify-between">
                      <div>
                        <p className="text-white/60 font-black text-[10px] uppercase tracking-[0.4em] mb-4">Wallet Balance</p>
                        <h2 className="text-6xl font-black text-white tracking-tighter tabular-nums mb-8 flex items-baseline gap-2">
                          <span className="text-3xl opacity-60">৳</span>{wallet?.totalBalance.toLocaleString()}
                        </h2>
                      </div>
                      <div className="flex gap-4">
                        <button className="bg-white text-indigo-600 px-8 py-4 rounded-3xl font-black text-xs uppercase tracking-widest hover:bg-slate-100 transition shadow-xl active:scale-95 disabled:opacity-50" disabled>Initiate Payout</button>
                        <button className="bg-white/10 backdrop-blur-md text-white border border-white/20 px-8 py-4 rounded-3xl font-black text-xs uppercase tracking-widest hover:bg-white/20 transition active:scale-95">Refresh</button>
                      </div>
                    </div>
                  </div>

                  <div className="bg-slate-900/40 backdrop-blur-md p-10 rounded-[48px] border border-slate-800 shadow-2xl">
                    <h3 className="text-xl font-black text-white uppercase tracking-tight mb-8">Transaction History</h3>
                    <div className="space-y-2">
                      {wallet?.transactions.map(tx => (
                        <div key={tx.id} className="flex items-center justify-between p-6 hover:bg-white/[0.02] rounded-3xl transition-all group border border-transparent hover:border-slate-800">
                          <div className="flex items-center gap-6">
                            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${tx.type === "CREDIT" ? "bg-emerald-500/10 text-emerald-400" : "bg-rose-500/10 text-rose-400"}`}>
                              {tx.type === "CREDIT" ? <TrendingUp className="w-5 h-5" /> : <Wallet className="w-5 h-5" />}
                            </div>
                            <div>
                              <p className="text-white font-black text-xs uppercase tracking-tight">{tx.description}</p>
                              <p className="text-[9px] text-slate-500 font-bold uppercase tracking-widest mt-1">{new Date(tx.createdAt).toLocaleDateString()} · Hash {tx.id.slice(0, 8)}</p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className={`font-black text-sm tabular-nums ${tx.type === "CREDIT" ? "text-emerald-400" : "text-rose-400"}`}>
                              {tx.type === "CREDIT" ? "+" : "-"} ৳{tx.amount.toLocaleString()}
                            </p>
                            <Badge color={tx.type === "CREDIT" ? "green" : "rose"}>{tx.type}</Badge>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="space-y-8">
                  <div className="bg-slate-900/40 backdrop-blur-md p-10 rounded-[48px] border border-slate-800 shadow-2xl">
                    <h3 className="text-lg font-black text-white uppercase tracking-tight mb-8">Subscription</h3>
                    <div className="space-y-6">
                      <div className="p-6 bg-slate-950/50 rounded-3xl border border-slate-800 border-l-4 border-l-indigo-600">
                        <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">Current Tier</p>
                        <p className="text-white font-black text-2xl uppercase tracking-tighter">Reservation bd Prime</p>
                        <div className="flex justify-between items-end mt-6">
                          <div>
                            <p className="text-[9px] text-slate-500 font-black uppercase tracking-widest">Expires In</p>
                            <p className="text-indigo-400 font-black text-sm uppercase">21 Days</p>
                          </div>
                          <button className="text-[10px] bg-indigo-600 text-white font-black uppercase tracking-widest px-4 py-2 rounded-xl scale-90 hover:scale-100 transition-all">Extend</button>
                        </div>
                      </div>

                      <div className="space-y-4">
                        <p className="text-[10px] font-black text-slate-600 uppercase tracking-[0.3em]">Plan Features</p>
                        {[
                          "Unlimited Rooms",
                          "Advanced Analytics",
                          "Direct Payout",
                          "24/7 Priority Support"
                        ].map((p, i) => (
                          <div key={i} className="flex items-center gap-3 text-slate-400 text-[11px] font-medium">
                            <CheckCircle2 className="w-4 h-4 text-emerald-500" /> {p}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* â”€â”€ PRICING â”€â”€ */}
          {tab === "pricing" && hotel && (
            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-5 duration-700">
              <div className="flex justify-between items-center bg-slate-900/40 backdrop-blur-md p-8 rounded-[32px] border border-slate-800 shadow-2xl">
                <div>
                  <h2 className="text-2xl font-black text-white tracking-tight uppercase">Dynamic Pricing Engine</h2>
                  <p className="text-slate-500 text-[10px] font-black uppercase tracking-widest mt-1 italic">Rate adjustment rules across room types</p>
                </div>
                <button onClick={() => setShowAddPricing(true)} className="bg-indigo-600 hover:bg-indigo-500 text-white flex items-center gap-3 px-8 py-4 rounded-3xl text-xs font-black uppercase tracking-[0.2em] transition-all shadow-xl shadow-indigo-600/20 active:scale-95">
                  <Plus className="w-5 h-5" /> Add Rule
                </button>
              </div>

              <div className="bg-slate-900/40 backdrop-blur-md rounded-[40px] border border-slate-800 overflow-hidden shadow-2xl">
                {pricingRules.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-20 text-center">
                    <Tag className="w-12 h-12 text-slate-700 mb-4" />
                    <p className="text-slate-500 font-black text-xs uppercase tracking-widest">No pricing rules configured</p>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-left">
                      <thead className="bg-slate-900/50 border-b border-slate-800">
                        <tr>
                          <th className="p-6 text-[10px] font-black text-slate-500 uppercase tracking-widest">Rule Label</th>
                          <th className="p-6 text-[10px] font-black text-slate-500 uppercase tracking-widest">Room</th>
                          <th className="p-6 text-[10px] font-black text-slate-500 uppercase tracking-widest text-center">Multiplier</th>
                          <th className="p-6 text-[10px] font-black text-slate-500 uppercase tracking-widest">Active Period</th>
                          <th className="p-6 text-[10px] font-black text-slate-500 uppercase tracking-widest text-center">Status</th>
                          <th className="p-6 text-[10px] font-black text-slate-500 uppercase tracking-widest text-center">Action</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-800/30">
                        {pricingRules.map(rule => (
                          <tr key={rule.id} className="hover:bg-white/[0.02] transition-all">
                            <td className="p-6">
                              <p className="font-black text-white text-sm uppercase tracking-tight">{rule.label}</p>
                            </td>
                            <td className="p-6">
                              <p className="font-black text-slate-400 text-xs uppercase">{rooms.find(r => r.id === rule.roomId)?.type || "All"}</p>
                            </td>
                            <td className="p-6 text-center">
                              <span className="bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 px-4 py-1.5 rounded-xl text-xs font-black uppercase tracking-widest">{rule.multiplier}x</span>
                            </td>
                            <td className="p-6">
                              <p className="text-slate-400 text-xs font-bold">{rule.startDate} → {rule.endDate}</p>
                            </td>
                            <td className="p-6 text-center">
                              <Badge color={rule.isActive ? "green" : "amber"}>{rule.isActive ? "ACTIVE" : "INACTIVE"}</Badge>
                            </td>
                            <td className="p-6 text-center">
                              <button onClick={() => api.deletePricingRule(rule.id).then(reload)} className="p-2.5 rounded-xl bg-rose-500/10 text-rose-500 border border-rose-500/20 hover:bg-rose-500 hover:text-white transition-all active:scale-95">
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>

              <div className="flex justify-between items-center bg-slate-900/40 backdrop-blur-md p-8 rounded-[32px] border border-slate-800 shadow-2xl">
                <div>
                  <h2 className="text-2xl font-black text-white tracking-tight uppercase">Discount Offers</h2>
                  <p className="text-slate-500 text-[10px] font-black uppercase tracking-widest mt-1 italic">Broadcast time-limited promotions to guests</p>
                </div>
                <button onClick={() => setShowAddOffer(true)} className="bg-indigo-600 hover:bg-indigo-500 text-white flex items-center gap-3 px-8 py-4 rounded-3xl text-xs font-black uppercase tracking-[0.2em] transition-all shadow-xl shadow-indigo-600/20 active:scale-95">
                  <Plus className="w-5 h-5" /> Add Offer
                </button>
              </div>

              <div className="bg-slate-900/40 backdrop-blur-md rounded-[40px] border border-slate-800 overflow-hidden shadow-2xl">
                {offers.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-20 text-center">
                    <Ticket className="w-12 h-12 text-slate-700 mb-4" />
                    <p className="text-slate-500 font-black text-xs uppercase tracking-widest">No offers configured</p>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-left">
                      <thead className="bg-slate-900/50 border-b border-slate-800">
                        <tr>
                          <th className="p-6 text-[10px] font-black text-slate-500 uppercase tracking-widest">Offer Title</th>
                          <th className="p-6 text-[10px] font-black text-slate-500 uppercase tracking-widest text-center">Discount</th>
                          <th className="p-6 text-[10px] font-black text-slate-500 uppercase tracking-widest">Window</th>
                          <th className="p-6 text-[10px] font-black text-slate-500 uppercase tracking-widest text-center">Status</th>
                          <th className="p-6 text-[10px] font-black text-slate-500 uppercase tracking-widest text-center">Action</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-800/30">
                        {offers.map(o => (
                          <tr key={o.id} className="hover:bg-white/[0.02] transition-all">
                            <td className="p-6">
                              <p className="font-black text-white text-sm uppercase tracking-tight">{o.title}</p>
                              <p className="text-[9px] text-slate-500 font-bold tracking-widest">{o.hotelName}</p>
                            </td>
                            <td className="p-6 text-center">
                              <span className="bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 px-4 py-1.5 rounded-xl text-xs font-black uppercase tracking-widest">{o.discountPercent}%</span>
                            </td>
                            <td className="p-6">
                              <p className="text-slate-400 text-xs font-bold">
                                {o.startDate ? o.startDate : "—"} → {o.endDate ? o.endDate : "—"}
                              </p>
                            </td>
                            <td className="p-6 text-center">
                              <Badge color={o.isActive ? "green" : "amber"}>{o.isActive ? "ACTIVE" : "INACTIVE"}</Badge>
                            </td>
                            <td className="p-6 text-center">
                              <div className="flex items-center justify-center gap-3">
                                <button
                                  onClick={() => api.updateOffer(o.id, { isActive: !o.isActive }).then(reload)}
                                  className="px-4 py-2 rounded-xl bg-slate-800/50 text-slate-300 border border-slate-700/60 hover:bg-slate-800 hover:text-white transition-all text-[10px] font-black uppercase tracking-widest active:scale-95"
                                >
                                  {o.isActive ? "Disable" : "Enable"}
                                </button>
                                <button onClick={() => api.deleteOffer(o.id).then(reload)} className="p-2.5 rounded-xl bg-rose-500/10 text-rose-500 border border-rose-500/20 hover:bg-rose-500 hover:text-white transition-all active:scale-95">
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* â”€â”€ GUESTS (CRM) â”€â”€ */}
          {tab === "guests" && hotel && (
            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-5 duration-700">
              <div className="bg-slate-900/40 backdrop-blur-md p-8 rounded-[32px] border border-slate-800 shadow-2xl">
                <h2 className="text-2xl font-black text-white tracking-tight uppercase">Guest Management</h2>
                <p className="text-slate-500 text-[10px] font-black uppercase tracking-widest mt-1 italic">View all guest profiles and booking history</p>
              </div>

              <div className="bg-slate-900/40 backdrop-blur-md rounded-[40px] border border-slate-800 overflow-hidden shadow-2xl">
                {guestProfiles.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-20 text-center">
                    <Users className="w-12 h-12 text-slate-700 mb-4" />
                    <p className="text-slate-500 font-black text-xs uppercase tracking-widest">No guests registered yet</p>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-left">
                      <thead className="bg-slate-900/50 border-b border-slate-800">
                        <tr>
                          <th className="p-6 text-[10px] font-black text-slate-500 uppercase tracking-widest">Guest Identity</th>
                          <th className="p-6 text-[10px] font-black text-slate-500 uppercase tracking-widest text-center">Total Stays</th>
                          <th className="p-6 text-[10px] font-black text-slate-500 uppercase tracking-widest text-right">Lifetime Value</th>
                          <th className="p-6 text-[10px] font-black text-slate-500 uppercase tracking-widest">Last Visit</th>
                          <th className="p-6 text-[10px] font-black text-slate-500 uppercase tracking-widest">Preference</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-800/30">
                        {guestProfiles.map(g => (
                          <tr key={g.userId} className="hover:bg-white/[0.02] transition-all group">
                            <td className="p-6">
                              <div className="flex items-center gap-4">
                                <div className="w-10 h-10 bg-gradient-to-tr from-indigo-600 to-purple-600 rounded-2xl flex items-center justify-center font-black text-white text-sm shadow-lg">
                                  {g.name.charAt(0).toUpperCase()}
                                </div>
                                <div>
                                  <p className="font-black text-white text-sm uppercase tracking-tight">{g.name}</p>
                                  <p className="text-[9px] text-slate-500 font-bold tracking-widest">{g.email}</p>
                                </div>
                              </div>
                            </td>
                            <td className="p-6 text-center">
                              <span className="text-white font-black text-lg tabular-nums">{g.totalBookings}</span>
                            </td>
                            <td className="p-6 text-right">
                              <span className="text-emerald-400 font-black text-sm tabular-nums">৳{g.totalSpent.toLocaleString()}</span>
                            </td>
                            <td className="p-6">
                              <span className="text-slate-400 text-xs font-bold">{g.lastStay || "—"}</span>
                            </td>
                            <td className="p-6">
                              <Badge color="indigo">{g.preferredRoomType || "Any"}</Badge>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* â”€â”€ NOTIFICATIONS â”€â”€ */}
          {tab === "notifications" && (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-5 duration-700">
              <div className="flex justify-between items-center bg-slate-900/40 backdrop-blur-md p-8 rounded-[32px] border border-slate-800 shadow-2xl">
                <div>
                  <h2 className="text-2xl font-black text-white tracking-tight uppercase">System Alerts</h2>
                  <p className="text-slate-500 text-[10px] font-black uppercase tracking-widest mt-1 italic">{unread} unread notifications</p>
                </div>
                {unread > 0 && (
                  <button onClick={() => api.markAllNotificationsRead(authenticatedOwnerId!).then(reload)} className="bg-slate-800 hover:bg-slate-700 text-white px-6 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest border border-slate-700 transition-all active:scale-95">
                    Mark All Read
                  </button>
                )}
              </div>

              <div className="bg-slate-900/40 backdrop-blur-md rounded-[40px] border border-slate-800 overflow-hidden shadow-2xl divide-y divide-slate-800/30">
                {notifications.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-20 text-center">
                    <Bell className="w-12 h-12 text-slate-700 mb-4" />
                    <p className="text-slate-500 font-black text-xs uppercase tracking-widest">No alerts detected</p>
                  </div>
                ) : notifications.map(n => (
                  <div key={n.id} className={`flex items-start gap-6 p-8 hover:bg-white/[0.02] transition-all group ${!n.isRead ? "bg-indigo-500/[0.02] border-l-2 border-l-indigo-500" : ""}`}>
                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 border ${n.type === "BOOKING" ? "bg-indigo-500/10 border-indigo-500/20 text-indigo-400" : n.type === "PAYMENT" ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-400" : n.type === "COMPLAINT" ? "bg-rose-500/10 border-rose-500/20 text-rose-400" : n.type === "CHECKIN" ? "bg-blue-500/10 border-blue-500/20 text-blue-400" : "bg-slate-700 border-slate-600 text-slate-400"}`}>
                      {n.type === "BOOKING" ? <Bell className="w-5 h-5" /> : n.type === "PAYMENT" ? <Wallet className="w-5 h-5" /> : n.type === "COMPLAINT" ? <AlertCircle className="w-5 h-5" /> : n.type === "CHECKIN" ? <CheckCircle2 className="w-5 h-5" /> : <SparkleIcon className="w-5 h-5" />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-4 mb-1">
                        <p className="font-black text-white text-sm uppercase tracking-tight">{n.title}</p>
                        {!n.isRead && <span className="w-2 h-2 rounded-full bg-indigo-500 shrink-0 animate-pulse" />}
                      </div>
                      <p className="text-slate-400 text-xs font-medium leading-relaxed">{n.message}</p>
                      <p className="text-[9px] text-slate-600 font-black uppercase tracking-widest mt-2">{new Date(n.createdAt).toLocaleString()}</p>
                    </div>
                    <button onClick={() => api.markNotificationRead(n.id).then(reload)} className="opacity-0 group-hover:opacity-100 transition-opacity p-2 rounded-xl bg-slate-800 text-slate-400 hover:text-white border border-slate-700">
                      <CheckCircle2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* â”€â”€ EXPERIENCES â”€â”€ */}
          {tab === "experiences" && (
            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-5 duration-700">
              <div className="flex justify-between items-center bg-slate-900/40 backdrop-blur-md p-8 rounded-[32px] border border-slate-800 shadow-2xl">
                <div>
                  <h2 className="text-2xl font-black text-white tracking-tight uppercase">Experience Cards</h2>
                  <p className="text-slate-500 text-[10px] font-black uppercase tracking-widest mt-1 italic">Publish activity cards visible on the public Experiences page</p>
                </div>
                <button
                  onClick={() => setShowAddExperience(true)}
                  className="bg-indigo-600 hover:bg-indigo-500 text-white flex items-center gap-3 px-8 py-4 rounded-3xl text-xs font-black uppercase tracking-[0.2em] transition-all shadow-xl shadow-indigo-600/20 active:scale-95"
                >
                  <Plus className="w-5 h-5" /> Publish Card
                </button>
              </div>

              {ownerExperiences.length === 0 ? (
                <div className="bg-slate-900/40 backdrop-blur-md rounded-[40px] border border-slate-800 flex flex-col items-center justify-center py-24 text-center shadow-2xl gap-4">
                  <div className="w-20 h-20 rounded-[28px] bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center">
                    <Star className="w-10 h-10 text-indigo-400" />
                  </div>
                  <p className="text-white font-black text-sm uppercase tracking-tight">No Experience Cards Yet</p>
                  <p className="text-slate-500 text-xs font-medium max-w-xs">Publish your first experience card. It will appear on the public Experiences page immediately.</p>
                  <button
                    onClick={() => setShowAddExperience(true)}
                    className="mt-2 bg-indigo-600 hover:bg-indigo-500 text-white px-8 py-4 rounded-2xl text-xs font-black uppercase tracking-widest transition-all shadow-xl shadow-indigo-600/20 active:scale-95 flex items-center gap-2"
                  >
                    <Plus className="w-4 h-4" /> Create First Card
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {ownerExperiences.map(exp => (
                    <div key={exp.id} className="bg-slate-900/40 backdrop-blur-md rounded-[32px] border border-slate-800 overflow-hidden shadow-2xl hover:border-indigo-500/30 transition-all duration-500 group">
                      <div className="relative h-52 overflow-hidden">
                        <img
                          src={exp.image}
                          alt={exp.title}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                          onError={(e) => { (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=600"; }}
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent opacity-80" />
                        <div className="absolute top-4 left-4 flex gap-2">
                          <span className={`text-[9px] font-black px-2.5 py-1 rounded-lg uppercase tracking-widest ${exp.category === "original" ? "bg-amber-500/90 text-white" : "bg-indigo-600/90 text-white"}`}>
                            {exp.badge}
                          </span>
                          <span className={`text-[9px] font-black px-2.5 py-1 rounded-lg uppercase tracking-widest border ${exp.isActive ? "bg-emerald-500/20 text-emerald-400 border-emerald-500/30" : "bg-slate-700/80 text-slate-400 border-slate-600"}`}>
                            {exp.isActive ? "Live" : "Hidden"}
                          </span>
                          {exp.isSoldOut && (
                            <span className="text-[9px] font-black px-2.5 py-1 rounded-lg uppercase tracking-widest border bg-rose-500/20 text-rose-400 border-rose-500/30">
                              Booked
                            </span>
                          )}
                        </div>
                        <div className="absolute bottom-4 left-4">
                          <p className="text-white font-black text-sm uppercase tracking-tight line-clamp-2">{exp.title}</p>
                          <p className="text-slate-400 text-[10px] font-bold mt-1">{exp.city} · ৳{exp.price}/guest</p>
                        </div>
                      </div>

                      <div className="p-6 space-y-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-1">
                            <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                            <span className="text-white font-black text-xs">{exp.rating}</span>
                            <span className="text-slate-500 text-[10px] font-bold">({exp.reviews} reviews)</span>
                          </div>
                          {exp.duration && (
                            <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest flex items-center gap-1">
                              <Clock className="w-3 h-3" /> {exp.duration}
                            </span>
                          )}
                        </div>

                        <div className="flex gap-2">
                          <button
                            onClick={() => api.toggleExperienceSoldOut(exp.id).then(reload)}
                            className={`flex-1 py-2.5 rounded-xl text-[9px] font-black uppercase tracking-widest border transition-all active:scale-95 ${exp.isSoldOut
                              ? "bg-amber-500/10 text-amber-400 border-amber-500/20 hover:bg-amber-500 hover:text-white"
                              : "bg-emerald-500/10 text-emerald-400 border-emerald-500/20 hover:bg-emerald-500 hover:text-white"
                              }`}
                          >
                            {exp.isSoldOut ? "Mark Avail." : "Mark Booked"}
                          </button>
                          <button
                            onClick={() => api.toggleExperienceActive(exp.id).then(reload)}
                            className={`flex-1 py-2.5 rounded-xl text-[9px] font-black uppercase tracking-widest border transition-all active:scale-95 ${exp.isActive
                              ? "bg-slate-800/50 text-slate-400 border-slate-700 hover:bg-slate-800 hover:text-white"
                              : "bg-indigo-600/10 text-indigo-400 border-indigo-500/20 hover:bg-indigo-600 hover:text-white"
                              }`}
                          >
                            {exp.isActive ? "Hide" : "Go Live"}
                          </button>
                          <button
                            onClick={() => api.deleteExperience(exp.id).then(reload)}
                            className="px-3 py-2.5 rounded-xl bg-rose-500/10 text-rose-400 border border-rose-500/20 hover:bg-rose-500 hover:text-white transition-all active:scale-95 shrink-0"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* â”€â”€ SETTINGS â”€â”€ */}
          {tab === "settings" && hotel && (
            <div className="space-y-12 relative z-10 animate-in fade-in slide-in-from-bottom-5 duration-700">
              <HotelSettingsTab
                hotel={hotel}
                onDone={reload}
              />
            </div>
          )}

        </main>
      </div>

      {/* â”€â”€ MODALS â”€â”€ */}
      {showAddRoom && hotel && (
        <AddRoomModal
          hotelId={hotel.id}
          onClose={() => setShowAddRoom(false)}
          onDone={() => { setShowAddRoom(false); reload(); }}
        />
      )}
      {showAddHotel && (
        <AddHotelModal
          ownerId={authenticatedOwnerId || ""}
          onClose={() => setShowAddHotel(false)}
          onDone={() => { setShowAddHotel(false); reload(); }}
        />
      )}
      {showAddPricing && hotel && (
        <AddPricingModal
          hotelId={hotel.id}
          rooms={rooms}
          onClose={() => setShowAddPricing(false)}
          onDone={() => { setShowAddPricing(false); reload(); }}
        />
      )}
      {showAddOffer && hotel && (
        <AddOfferModal
          hotel={hotel}
          onClose={() => setShowAddOffer(false)}
          onDone={() => { setShowAddOffer(false); reload(); }}
        />
      )}
      {showAddExperience && authenticatedOwnerId && (
        <AddExperienceModal
          ownerId={authenticatedOwnerId}
          hotelId={hotel?.id}
          hotelName={hotel?.name}
          onClose={() => setShowAddExperience(false)}
          onDone={() => { setShowAddExperience(false); reload(); }}
        />
      )}
    </div>
  );
}
