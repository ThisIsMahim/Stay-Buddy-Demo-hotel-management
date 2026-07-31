import React from "react";
import { Bell, CheckSquare, Info, History } from "lucide-react";

interface NotificationsPanelProps {
    notifications: any[];
}

const NotificationsPanel = ({
    notifications
}: NotificationsPanelProps) => {
    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-5 duration-700">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-slate-900/40 backdrop-blur-md p-6 md:p-8 rounded-[24px] border border-slate-800 shadow-2xl">
                <div>
                    <h2 className="text-2xl font-black text-white tracking-tight uppercase flex items-center gap-4">
                        <Bell className="w-6 h-6 text-indigo-500" /> Notifications
                    </h2>
                    <p className="text-slate-500 text-[11px] font-black uppercase tracking-[0.2em] mt-1.5 italic">Real-time updates about your property and bookings</p>
                </div>
                <button className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-500 hover:text-white transition-colors">
                    <CheckSquare className="w-4 h-4" /> Mark all as read
                </button>
            </div>

            <div className="bg-slate-900/40 backdrop-blur-md rounded-[32px] border border-slate-800 overflow-hidden shadow-2xl">
                <div className="divide-y divide-slate-800/50">
                    {notifications.length === 0 ? (
                        <div className="p-20 text-center">
                            <div className="w-16 h-16 bg-slate-800/20 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-slate-700/50">
                                <Info className="w-8 h-8 opacity-10" />
                            </div>
                            <p className="text-[10px] font-black uppercase tracking-widest text-slate-600">No new notifications</p>
                        </div>
                    ) : (
                        notifications.map(n => (
                            <div key={n.id} className={`p-8 hover:bg-white/[0.01] transition-all flex items-start gap-6 group ${!n.isRead ? "bg-indigo-600/[0.02]" : ""}`}>
                                <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 border transition-all group-hover:scale-110 ${!n.isRead ? "bg-indigo-600 border-indigo-500 text-white shadow-lg shadow-indigo-600/20" : "bg-slate-900 border-slate-800 text-slate-500"}`}>
                                    <Bell className="w-5 h-5" />
                                </div>
                                <div className="flex-1">
                                    <div className="flex justify-between items-start mb-1.5">
                                        <p className={`font-black uppercase tracking-tight ${!n.isRead ? "text-white" : "text-slate-400"}`}>{n.title}</p>
                                        <span className="text-[10px] text-slate-600 font-bold uppercase tracking-widest flex items-center gap-1">
                                            <History className="w-3 h-3" /> {new Date(n.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                        </span>
                                    </div>
                                    <p className="text-sm font-medium text-slate-500 leading-relaxed italic">{n.message}</p>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
};

export default NotificationsPanel;
