import React from "react";
import { Bell, Ticket, Wallet, ShieldAlert } from "lucide-react";
import { api, Notification, UserProfile, HotelOwner } from "../../../services/api";

interface NotificationsPanelProps {
    notifications: Notification[];
    currentUser: UserProfile | HotelOwner | null;
    reload: () => void;
}

export default function NotificationsPanel({ notifications, currentUser, reload }: NotificationsPanelProps) {
    const unreadNotif = (Array.isArray(notifications) ? notifications : []).filter(n => !n.isRead).length;

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h3 className="text-slate-500 text-[10px] font-black uppercase tracking-widest">Global Feed</h3>
                {unreadNotif > 0 && currentUser && (
                    <button onClick={async () => { await api.markAllNotificationsRead(currentUser.id); reload(); }}
                        className="text-[10px] font-black uppercase tracking-widest text-indigo-400 hover:text-indigo-300 transition-colors bg-indigo-500/10 px-4 py-2 rounded-xl border border-indigo-500/20">
                        Purge Unread Pulse
                    </button>
                )}
            </div>

            <div className="grid grid-cols-1 gap-4">
                {notifications.length === 0 && (
                    <div className="py-40 text-center">
                        <Bell className="w-16 h-16 text-slate-800 mx-auto mb-6 opacity-20" />
                        <p className="text-slate-500 font-black uppercase tracking-[0.3em] text-xs">Awaiting System Transmission</p>
                    </div>
                )}
                {notifications.map(n => (
                    <div key={n.id}
                        className={`group flex gap-6 items-center p-6 rounded-[32px] border transition-all cursor-pointer relative overflow-hidden ${n.isRead ? "bg-slate-900/40 border-slate-800 hover:bg-slate-800/40" : "bg-indigo-600/5 border-indigo-500/20 hover:bg-indigo-600/10 shadow-xl shadow-indigo-600/5"}`}
                        onClick={async () => { await api.markNotificationRead(n.id); reload(); }}
                    >
                        <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-2xl shadow-xl transition-transform group-hover:scale-110 ${n.isRead ? "bg-slate-800 text-slate-500" : "bg-indigo-600 text-white"}`}>
                            {n.type === "BOOKING" ? <Ticket className="w-6 h-6" /> : n.type === "PAYMENT" ? <Wallet className="w-6 h-6" /> : n.type === "COMPLAINT" ? <ShieldAlert className="w-6 h-6" /> : <Bell className="w-6 h-6" />}
                        </div>
                        <div className="flex-1">
                            <div className="flex justify-between items-start">
                                <p className={`font-black uppercase tracking-tight ${n.isRead ? "text-slate-400" : "text-white text-lg"}`}>{n.title}</p>
                                <p className="text-[10px] text-slate-500 font-black font-mono uppercase tracking-widest">{new Date(n.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                            </div>
                            <p className="text-slate-500 text-sm font-medium mt-1 leading-relaxed">{n.message}</p>
                        </div>
                        {!n.isRead && (
                            <div className="absolute top-0 right-0 w-2 h-full bg-indigo-500 shadow-[0_0_20px_rgba(99,102,241,0.5)]" />
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
}
