/**
 * Admin Dashboard — Full Modular Implementation
 * Tabs: Stats · Users · Hotels · Bookings (Check-in/out) · Complaints · Notifications
 */
import { useEffect, useState } from "react";
import {
  Shield, Users, Building2, AlertTriangle,
  Bell, BookOpen, BarChart3, Star
} from "lucide-react";
import { api, UserProfile, HotelOwner, Hotel, Booking, Notification, Room, ExperienceCard, Complaint } from "../services/api";

// Modular Components
import AdminSidebar from "./admin/components/AdminSidebar";
import AdminTopBar from "./admin/components/AdminTopBar";
import { Loading } from "./admin/components/AdminUIElements";

// Panels
import StatsPanel from "./admin/panels/StatsPanel";
import UserManagementPanel from "./admin/panels/UserManagementPanel";
import HotelManagementPanel from "./admin/panels/HotelManagementPanel";
import BookingsPanel from "./admin/panels/BookingsPanel";
import ComplaintsPanel from "./admin/panels/ComplaintsPanel";
import ExperienceManagementPanel from "./admin/panels/ExperienceManagementPanel";
import NotificationsPanel from "./admin/panels/NotificationsPanel";

type Tab = "stats" | "users" | "hotels" | "bookings" | "complaints" | "notifications" | "experiences";

export default function AdminDashboard() {
  const [currentUser, setCurrentUser] = useState<UserProfile | HotelOwner | null>(null);
  const [authLoading, setAuthLoading] = useState(true);

  const [tab, setTab] = useState<Tab>("stats");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [showAddOwner, setShowAddOwner] = useState(false);
  const [stats, setStats] = useState<any>(null);
  const [users, setUsers] = useState<(UserProfile | HotelOwner)[]>([]);
  const [hotels, setHotels] = useState<Hotel[]>([]);
  const [rooms, setRooms] = useState<(Room & { hotelName: string })[]>([]);
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [experiences, setExperiences] = useState<ExperienceCard[]>([]);
  const [refresh, setRefresh] = useState(0);

  const unreadNotif = (Array.isArray(notifications) ? notifications : []).filter(n => !n.isRead).length;

  useEffect(() => {
    const token = localStorage.getItem('adminToken');
    const userStr = localStorage.getItem('adminUser');
    if (token && userStr) {
      try {
        setCurrentUser(JSON.parse(userStr));
      } catch (e) { }
    } else {
      window.location.href = '/admin/login';
    }
    setAuthLoading(false);
  }, []);

  useEffect(() => {
    if (currentUser?.role !== "ADMIN") return;
    api.getAdminStats().then(setStats);
    api.getAllUsers().then(d => setUsers(Array.isArray(d) ? d : []));
    api.getAllHotels().then(d => setHotels(Array.isArray(d) ? d : []));
    api.getAllRooms().then(d => setRooms(Array.isArray(d) ? d : []));
    api.getAdminComplaints().then(d => setComplaints(Array.isArray(d) ? d : []));
    api.getAllBookings().then(d => setBookings(Array.isArray(d) ? d : []));
    if (currentUser) api.getNotifications(currentUser.id).then(d => setNotifications(Array.isArray(d) ? d : []));
    api.getExperiences().then(d => setExperiences(Array.isArray(d) ? d : []));
  }, [refresh, currentUser]);

  if (authLoading) return <Loading />;
  if (!currentUser) return null; // Or redirect, already handled in useEffect

  if (currentUser?.role !== "ADMIN") {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-8 text-center">
        <Shield className="w-20 h-20 text-red-500 mb-6" />
        <h1 className="text-3xl font-bold text-white mb-2">Access Denied</h1>
        <p className="text-slate-400 max-w-md">This area is for Super Administrators only. Owners and regular users are not allowed to access this panel.</p>
        <button onClick={() => window.location.href = "/"} className="mt-8 bg-indigo-600 text-white px-6 py-2 rounded-full font-bold">Return to Home</button>
      </div>
    );
  }

  const reload = () => setRefresh(p => p + 1);

  const tabNav: { id: Tab; label: string; icon: React.ReactNode; badge?: number }[] = [
    { id: "stats", label: "Dashboard", icon: <BarChart3 className="w-5 h-5" /> },
    { id: "users", label: "Users & Owners", icon: <Users className="w-5 h-5" /> },
    { id: "hotels", label: "Hotels", icon: <Building2 className="w-5 h-5" /> },
    { id: "bookings", label: "Bookings", icon: <BookOpen className="w-5 h-5" /> },
    { id: "complaints", label: "Complaints", icon: <AlertTriangle className="w-5 h-5" />, badge: (Array.isArray(complaints) ? complaints : []).filter(c => c.status !== "Resolved").length },
    { id: "experiences", label: "Experiences", icon: <Star className="w-5 h-5" /> },
    { id: "notifications", label: "Notifications", icon: <Bell className="w-5 h-5" />, badge: unreadNotif },
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-white flex">
      {/* Mobile Overlay */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/60 z-[40] md:hidden backdrop-blur-sm transition-opacity"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      <AdminSidebar
        tab={tab}
        setTab={setTab}
        isSidebarOpen={isSidebarOpen}
        setIsSidebarOpen={setIsSidebarOpen}
        tabNav={tabNav}
        setShowAddOwner={setShowAddOwner}
        reload={reload}
      />

      <main className="md:ml-56 flex-1 p-4 md:p-10 max-w-full overflow-x-hidden relative min-h-screen bg-[#070911]">
        {/* Advanced Background Grid */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808008_1px,transparent_1px),linear-gradient(to_bottom,#80808008_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none" />
        <div className="absolute inset-0 bg-gradient-to-tr from-indigo-500/[0.03] via-transparent to-purple-500/[0.03] pointer-events-none" />

        <AdminTopBar setIsSidebarOpen={setIsSidebarOpen} />

        <div className="h-6 md:h-12" />

        {tab === "stats" && <StatsPanel stats={stats} bookings={bookings} hotels={hotels} />}

        {tab === "users" && (
          <UserManagementPanel
            users={users}
            hotels={hotels}
            bookings={bookings}
            reload={reload}
            showAddOwner={showAddOwner}
            setShowAddOwner={setShowAddOwner}
          />
        )}

        {tab === "hotels" && (
          <HotelManagementPanel
            hotels={hotels}
            rooms={rooms}
            userList={users}
            reload={reload}
          />
        )}

        {tab === "bookings" && <BookingsPanel bookings={bookings} reload={reload} />}

        {tab === "complaints" && <ComplaintsPanel complaints={complaints} reload={reload} />}

        {tab === "experiences" && (
          <ExperienceManagementPanel
            experiences={experiences}
            userList={users}
            reload={reload}
          />
        )}

        {tab === "notifications" && (
          <NotificationsPanel
            notifications={notifications}
            currentUser={currentUser}
            reload={reload}
          />
        )}
      </main>
    </div>
  );
}
