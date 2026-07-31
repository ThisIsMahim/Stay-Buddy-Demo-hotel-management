import React from "react";
import { Wallet, Bell, Users, RefreshCw, TrendingUp, BarChart3, Loader2, MonitorDot } from "lucide-react";
import { StatCard, Badge } from "../components/OwnerUI";

interface AnalyticsPanelProps {
    totalRevenue: number;
    todayBookingsCount: number;
    online: any[];
    offline: any[];
    wallet: any;
    occupancy: any;
    bookings: any[];
    rooms: any[];
}

const AnalyticsPanel = ({
    totalRevenue,
    todayBookingsCount,
    online,
    offline,
    wallet,
    occupancy,
    bookings,
    rooms
}: AnalyticsPanelProps) => {
    const todayBookings = bookings.filter(b => b.createdAt.startsWith(new Date().toISOString().split("T")[0]));

    return (
        <div className="space-y-12 relative z-10 animate-in fade-in slide-in-from-bottom-5 duration-700">
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
                <StatCard label="Total Revenue" value={`৳${totalRevenue.toLocaleString()}`} color="indigo" icon={<Wallet />} subLabel="Confirmed" />
                <StatCard label="Today's Bookings" value={todayBookingsCount} color="purple" icon={<Bell />} subLabel="New Today" />
                <StatCard label="Online Bookings" value={online.length} color="blue" icon={<Users />} subLabel="Reservations" />
                <StatCard label="Direct Bookings" value={offline.length} color="amber" icon={<RefreshCw />} subLabel="Walk-ins" />
                <StatCard label="Wallet Balance" value={`৳${(wallet?.totalBalance ?? 0).toLocaleString()}`} color="emerald" icon={<TrendingUp />} subLabel="Available" />
            </div>

            {occupancy && (
                <div className="bg-slate-900/40 backdrop-blur-md rounded-[24px] p-6 border border-slate-800 shadow-2xl">
                    <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8 gap-6">
                        <div>
                            <h2 className="text-2xl font-black text-white tracking-tight uppercase flex items-center gap-4">
                                <BarChart3 className="w-6 h-6 text-indigo-500" /> Monthly Performance
                            </h2>
                            <p className="text-slate-500 text-[11px] font-black uppercase tracking-[0.2em] mt-1.5 italic">Occupancy rates & revenue by room type</p>
                        </div>
                        <div className="flex gap-6">
                            <div className="text-right">
                                <p className="text-2xl font-black text-indigo-400 tracking-tighter tabular-nums">৳{occupancy.totalRevenue.toLocaleString()}</p>
                                <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest mt-1">Monthly Revenue</p>
                            </div>
                            <div className="w-px h-6 bg-slate-800 self-center" />
                            <div className="text-right">
                                <p className="text-2xl font-black text-emerald-400 tracking-tighter tabular-nums">{occupancy.avgOccupancyRate}%</p>
                                <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest mt-1">Avg Occupancy</p>
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-16 gap-y-10">
                        {occupancy.roomStats.map((rs: any) => (
                            <div key={rs.roomId} className="space-y-2 group">
                                <div className="flex justify-between items-end">
                                    <div>
                                        <p className="text-[10px] font-black text-slate-600 uppercase tracking-widest mb-1">{rs.roomType}</p>
                                        <p className="text-xl font-black text-slate-200">৳{rs.totalRevenue.toLocaleString()}</p>
                                    </div>
                                    <span className="text-sm font-black text-indigo-400 group-hover:scale-110 transition-transform tabular-nums">{rs.occupancyRate}%</span>
                                </div>
                                <div className="h-2 w-full bg-slate-950 rounded-full overflow-hidden border border-slate-800/50">
                                    <div
                                        className="h-full bg-gradient-to-r from-indigo-600 via-indigo-500 to-purple-600 rounded-full transition-all duration-1000 group-hover:brightness-125 shadow-[0_0_10px_rgba(79,70,229,0.2)]"
                                        style={{ width: `${rs.occupancyRate}%` }}
                                    />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            <div className="bg-slate-900/40 backdrop-blur-md rounded-[32px] border border-slate-800 overflow-hidden shadow-2xl">
                <div className="px-8 py-5 border-b border-slate-800 flex justify-between items-center bg-slate-900/20">
                    <h2 className="text-base font-black text-white uppercase tracking-tight flex items-center gap-2">
                        <RefreshCw className="w-4 h-4 text-purple-500 animate-spin-slow" /> Recent Bookings
                    </h2>
                    <div className="bg-purple-500/10 border border-purple-500/20 px-4 py-1.5 rounded-full">
                        <span className="text-[10px] text-purple-400 font-black uppercase tracking-widest">{todayBookingsCount} Bookings Today</span>
                    </div>
                </div>
                <div className="divide-y divide-slate-800/50">
                    {todayBookings.length === 0 ? (
                        <div className="p-20 text-center text-slate-500">
                            <div className="w-16 h-16 bg-slate-800/50 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-slate-700">
                                <Loader2 className="w-8 h-8 opacity-20" />
                            </div>
                            <p className="text-[10px] font-black uppercase tracking-widest">No bookings today yet</p>
                        </div>
                    ) : (
                        todayBookings.map(b => (
                            <div key={b.id} className="p-3 hover:bg-white/[0.01] flex items-center justify-between transition-all group">
                                <div className="flex items-center gap-3">
                                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center shadow-inner border transition-transform group-hover:scale-105 ${b.type === "ONLINE" ? "bg-blue-600/10 border-blue-500/30 text-blue-400" : "bg-amber-600/10 border-amber-500/30 text-amber-400"}`}>
                                        {b.type === "ONLINE" ? <MonitorDot className="w-3.5 h-3.5" /> : <Users className="w-3.5 h-3.5" />}
                                    </div>
                                    <div>
                                        <p className="font-black text-white text-[10px] uppercase tracking-tight">{b.roomType} · {rooms.find(r => r.id === b.roomId)?.roomNumber || "N/A"}</p>
                                        <p className="text-[8px] text-slate-500 font-bold uppercase tracking-widest mt-0.5">{b.type} · {b.nights}N · <span className="text-emerald-400">৳{b.totalPrice.toLocaleString()}</span></p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <Badge color={b.status === "CONFIRMED" ? "green" : "amber"}>{b.status}</Badge>
                                    <p className="text-[10px] text-slate-600 font-black uppercase tracking-widest mt-1">{new Date(b.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
};

export default AnalyticsPanel;
