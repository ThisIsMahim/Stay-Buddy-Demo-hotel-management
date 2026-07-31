import React, { cloneElement } from "react";
import { LogOut } from "lucide-react";

interface TabNav {
    id: string;
    label: string;
    icon: React.ReactNode;
    badge?: number;
}

interface OwnerSidebarProps {
    tab: string;
    setTab: (tab: string) => void;
    isSidebarOpen: boolean;
    setIsSidebarOpen: (open: boolean) => void;
    tabNav: TabNav[];
    currentUser: any;
    signOut: () => void;
}

const OwnerSidebar = ({
    tab,
    setTab,
    isSidebarOpen,
    setIsSidebarOpen,
    tabNav,
    currentUser,
    signOut
}: OwnerSidebarProps) => {
    return (
        <>
            {/* Mobile Overlay */}
            {isSidebarOpen && (
                <div
                    className="fixed inset-0 bg-black/60 z-[40] md:hidden backdrop-blur-sm transition-opacity"
                    onClick={() => setIsSidebarOpen(false)}
                />
            )}

            {/* Sidebar */}
            <aside className={`w-[260px] bg-slate-950/90 md:bg-slate-950/50 backdrop-blur-3xl border-r border-slate-800 flex flex-col fixed top-[64px] bottom-0 z-50 transition-transform duration-300 ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"} md:translate-x-0`}>
                <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto custom-scrollbar">
                    <p className="px-3 text-[11px] font-black text-slate-600 uppercase tracking-[0.2em] mb-5">Operations</p>
                    {tabNav.map(t => {
                        const isActive = tab === t.id;
                        return (
                            <button key={t.id} onClick={() => { setTab(t.id); setIsSidebarOpen(false); }}
                                className={`w-full flex items-center gap-3 px-3 py-3 rounded-xl text-sm transition-all relative group ${isActive ? "bg-indigo-600 text-white shadow-lg shadow-indigo-600/10" : "text-slate-500 hover:text-white hover:bg-white/5"}`}>
                                <span className={`${isActive ? "text-white" : "text-slate-500 group-hover:text-indigo-400"} transition-colors shrink-0`}>{cloneElement(t.icon as React.ReactElement, { className: "w-5 h-5" })}</span>
                                <span className="font-black uppercase tracking-widest text-[10px] truncate">{t.label}</span>
                                {t.badge ? (
                                    <span className="ml-auto bg-rose-600 text-white text-[9px] font-black min-w-[18px] h-[18px] flex items-center justify-center rounded-md px-1">{t.badge}</span>
                                ) : null}
                                {isActive && (
                                    <div className="absolute left-0 w-1.5 h-5 bg-white rounded-r-full" />
                                )}
                            </button>
                        );
                    })}
                </nav>

                {/* User Info + Logout */}
                <div className="p-6 border-t border-slate-800/50 bg-slate-900/20">
                    <div className="flex items-center gap-4 mb-6 px-1">
                        <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-indigo-600 to-purple-600 text-white flex items-center justify-center font-black text-sm uppercase shadow-md shadow-indigo-500/20">
                            {currentUser?.name?.charAt(0)}
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-black text-white truncate leading-none mb-1.5">{currentUser?.name}</p>
                            <p className="text-[11px] font-black text-slate-500 truncate uppercase tracking-widest">Property Admin</p>
                        </div>
                    </div>
                    <button onClick={() => signOut()} className="w-full flex items-center justify-center gap-3 text-rose-500 hover:text-white text-xs font-black uppercase tracking-widest py-4 border border-rose-500/20 rounded-2xl hover:bg-rose-600 transition-all duration-300">
                        <LogOut className="w-4 h-4" /> Sign Out
                    </button>
                </div>
            </aside>
        </>
    );
};

export default OwnerSidebar;
