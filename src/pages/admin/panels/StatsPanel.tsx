import React from "react";
import { Users, Building2, AlertTriangle, BookOpen, CreditCard, CheckCircle, X, LogIn, Shield, Flag, LogOut } from "lucide-react";
import { StatCard } from "../components/AdminUIElements";
import { Hotel, Booking } from "../../../services/api";

interface StatsPanelProps {
    stats: any;
    bookings: Booking[];
    hotels: Hotel[];
}

export default function StatsPanel({ stats, bookings, hotels }: StatsPanelProps) {
    if (!stats) return null;

    return (
        <div className="space-y-8 relative animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
                <StatCard label="Total Intelligence" value={stats.totalUsers} color="indigo" icon={<Users className="w-5 h-5" />} subLabel="Registered Endpoints" />
                <StatCard label="Business Partners" value={stats.totalOwners} color="purple" icon={<Building2 className="w-5 h-5" />} subLabel="Property Operators" />
                <StatCard label="Active Nodes" value={stats.activeHotels} color="emerald" icon={<Building2 className="w-5 h-5" />} subLabel="Verified Hospitality" />
                <StatCard label="Security Alerts" value={stats.pending} color="amber" icon={<AlertTriangle className="w-5 h-5" />} subLabel="Awaiting Review" alert />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
                <StatCard label="Flow Transactions" value={stats.totalBookings || 0} color="blue" icon={<BookOpen className="w-5 h-5" />} subLabel="Lifetime Interactions" />
                <StatCard label="Daily Velocity" value={stats.todayBookings || 0} color="purple" icon={<BookOpen className="w-5 h-5" />} subLabel="Today's Momentum" />
                <StatCard label="Capital Accrual" value={`৳${(stats.totalRevenuePlatform || 0).toLocaleString()}`} color="green" icon={<CreditCard className="w-5 h-5" />} subLabel="Platform Yield (10%)" />
                <StatCard label="Discord Reports" value={stats.complaints || 0} color="red" icon={<AlertTriangle className="w-5 h-5" />} subLabel="Unresolved Disputes" />
            </div>

            {/* Visual Breakdown Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-slate-900/60 backdrop-blur-xl rounded-[24px] border border-slate-800 p-6 shadow-2xl relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-48 h-48 bg-blue-600/5 -mr-12 -mt-12 rounded-full blur-3xl transition-transform group-hover:scale-125" />
                    <h3 className="text-xs font-black text-slate-500 uppercase tracking-[0.2em] mb-6 flex items-center gap-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.5)]" />
                        Booking Distribution
                    </h3>
                    <div className="space-y-4">
                        {[
                            { label: "Confirmed", count: bookings.filter(b => b.status === "CONFIRMED").length, color: "bg-emerald-500", icon: <CheckCircle className="w-4 h-4" /> },
                            { label: "Cancelled", count: bookings.filter(b => b.status === "CANCELLED").length, color: "bg-rose-500", icon: <X className="w-4 h-4" /> },
                            { label: "Direct Online", count: bookings.filter(b => b.type === "ONLINE").length, color: "bg-blue-500", icon: <CreditCard className="w-4 h-4" /> },
                            { label: "Manual Walk-in", count: bookings.filter(b => b.type === "OFFLINE").length, color: "bg-amber-500", icon: <LogIn className="w-4 h-4" /> },
                        ].map(row => (
                            <div key={row.label} className="flex items-center group/item text-sm">
                                <div className={`w-10 h-10 rounded-lg ${row.color}/10 flex items-center justify-center mr-4 transition-colors group-hover/item:${row.color}/20`}>
                                    <span className={row.color.replace('bg-', 'text-')}>{row.icon}</span>
                                </div>
                                <span className="text-slate-400 font-bold uppercase tracking-wider flex-1 text-xs">{row.label}</span>
                                <div className="text-right">
                                    <span className="text-white font-black text-xl">{row.count}</span>
                                    <div className="w-32 h-1.5 bg-slate-800 rounded-full mt-1 overflow-hidden">
                                        <div
                                            className={`h-full ${row.color} rounded-full transition-all duration-1000`}
                                            style={{ width: `${(row.count / (bookings.length || 1)) * 100}%` }}
                                        />
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="bg-slate-900/60 backdrop-blur-xl rounded-[24px] border border-slate-800 p-6 shadow-2xl relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-48 h-48 bg-purple-600/5 -mr-12 -mt-12 rounded-full blur-3xl transition-transform group-hover:scale-125" />
                    <h3 className="text-xs font-black text-slate-500 uppercase tracking-[0.2em] mb-6 flex items-center gap-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-purple-500 shadow-[0_0_8px_rgba(168,85,247,0.5)]" />
                        Network Health
                    </h3>
                    <div className="space-y-4">
                        {[
                            { label: "Verified & Operational", count: hotels.filter(h => h.isActive && h.isVerified).length, color: "bg-emerald-500", icon: <Shield className="w-4 h-4" /> },
                            { label: "High Risk Flags", count: hotels.filter(h => h.isRedMarked).length, color: "bg-rose-500", icon: <Flag className="w-4 h-4" /> },
                            { label: "Passive Nodes", count: hotels.filter(h => !h.isActive).length, color: "bg-slate-600", icon: <LogOut className="w-4 h-4" /> },
                            { label: "Verification Queue", count: hotels.filter(h => !h.isVerified).length, color: "bg-amber-500", icon: <AlertTriangle className="w-4 h-4" /> },
                        ].map(row => (
                            <div key={row.label} className="flex items-center group/item text-sm">
                                <div className={`w-10 h-10 rounded-lg ${row.color}/10 flex items-center justify-center mr-4 transition-colors group-hover/item:${row.color}/20`}>
                                    <span className={row.color.replace('bg-', 'text-')}>{row.icon}</span>
                                </div>
                                <span className="text-slate-400 font-bold uppercase tracking-wider flex-1 text-xs">{row.label}</span>
                                <div className="text-right">
                                    <span className="text-white font-black text-xl">{row.count}</span>
                                    <div className="w-32 h-1.5 bg-slate-800 rounded-full mt-1 overflow-hidden">
                                        <div
                                            className={`h-full ${row.color} rounded-full transition-all duration-1000`}
                                            style={{ width: `${(row.count / (hotels.length || 1)) * 100}%` }}
                                        />
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
