import React from "react";
import { Shield, Plus, RefreshCw } from "lucide-react";

type Tab = "stats" | "users" | "hotels" | "bookings" | "complaints" | "notifications" | "experiences";

interface TabNavItem {
    id: Tab;
    label: string;
    icon: React.ReactNode;
    badge?: number;
}

interface AdminSidebarProps {
    tab: Tab;
    setTab: (tab: Tab) => void;
    isSidebarOpen: boolean;
    setIsSidebarOpen: (open: boolean) => void;
    tabNav: TabNavItem[];
    setShowAddOwner: (show: boolean) => void;
    reload: () => void;
}

export default function AdminSidebar({
    tab,
    setTab,
    isSidebarOpen,
    setIsSidebarOpen,
    tabNav,
    setShowAddOwner,
    reload
}: AdminSidebarProps) {
    return (
        <aside className={`fixed inset-y-0 left-0 w-56 bg-slate-950/80 backdrop-blur-2xl border-r border-white/5 z-50 flex flex-col transition-transform duration-300 ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"} md:translate-x-0 shadow-2xl`}>
            <div className="absolute inset-0 bg-gradient-to-b from-indigo-500/5 to-transparent pointer-events-none" />
            <div className="p-6 border-b border-white/5">
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center shadow-lg shadow-indigo-600/30">
                        <Shield className="w-5 h-5 text-white" />
                    </div>
                    <span className="font-black text-white text-base tracking-tighter uppercase">Super Admin</span>
                </div>
            </div>
            <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
                {tabNav.map(item => (
                    <button key={item.id} onClick={() => { setTab(item.id); setIsSidebarOpen(false); }}
                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm transition font-bold ${tab === item.id ? "bg-indigo-600 text-white shadow-lg shadow-indigo-600/20" : "text-slate-400 hover:bg-slate-800"}`}>
                        {item.icon} {item.label}
                        {item.badge ? <span className="ml-auto bg-red-500 text-white text-[10px] w-5 h-5 flex items-center justify-center rounded-full font-black">{item.badge}</span> : null}
                    </button>
                ))}
            </nav>

            <div className="p-4 space-y-3">
                <button
                    onClick={() => { setTab("users"); setShowAddOwner(true); }}
                    className="w-full flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white font-black uppercase tracking-widest py-3 rounded-xl text-[10px] transition shadow-lg shadow-indigo-600/20"
                >
                    <Plus className="w-4 h-4" /> Register Owner
                </button>
                <div className="h-px bg-slate-800 mx-2" />
                <button onClick={reload} className="w-full flex items-center justify-center gap-2 text-slate-500 hover:text-slate-300 text-xs py-2">
                    <RefreshCw className="w-3 h-3" /> Refresh System
                </button>
            </div>
        </aside>
    );
}
