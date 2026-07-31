import React, { useState } from "react";
import { X, Loader2, Building2, BookOpen, CreditCard, Shield, BarChart3 } from "lucide-react";
import { api, HotelOwner, Hotel, Booking } from "../../../services/api";
import { Badge, ActionBtn } from "./AdminUIElements";

export function AddOwnerModal({ onClose, reload }: { onClose: () => void, reload: () => void }) {
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);
        const fd = new FormData(e.currentTarget);

        await api.addOwner({
            name: fd.get("name") as string,
            email: fd.get("email") as string,
        });

        setLoading(false);
        reload();
        onClose();
    };

    return (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-xl z-50 flex justify-center items-center p-4">
            <div className="bg-slate-900 border border-slate-700 rounded-[28px] w-full max-w-md shadow-2xl overflow-hidden flex flex-col">
                <div className="flex justify-between items-center p-8 border-b border-slate-800/50 bg-slate-800/20">
                    <div>
                        <h2 className="text-xl font-black text-white uppercase tracking-tight">Register Owner</h2>
                        <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mt-1">New Operator Credentials</p>
                    </div>
                    <button onClick={onClose} className="p-2 rounded-full hover:bg-white/5 text-slate-400 hover:text-white transition">
                        <X className="w-6 h-6" />
                    </button>
                </div>
                <form onSubmit={handleSubmit} className="p-8 space-y-6">
                    <div className="space-y-1.5">
                        <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest pl-1">Full Name</label>
                        <input type="text" name="name" required placeholder="John Doe" className="w-full bg-slate-950/50 border border-slate-800 rounded-2xl px-4 py-3 text-white text-sm outline-none focus:ring-2 focus:ring-indigo-500 transition-all" />
                    </div>
                    <div className="space-y-1.5">
                        <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest pl-1">Email Address</label>
                        <input type="email" name="email" required placeholder="owner@example.com" className="w-full bg-slate-950/50 border border-slate-800 rounded-2xl px-4 py-3 text-white text-sm outline-none focus:ring-2 focus:ring-indigo-500 transition-all" />
                    </div>

                    <div className="bg-amber-500/10 border border-amber-500/20 p-4 rounded-2xl">
                        <p className="text-[10px] text-amber-500 font-bold uppercase tracking-wider leading-relaxed">
                            Note: New owners are registered with "Pending" verification status and a 1-year default subscription.
                        </p>
                    </div>

                    <button disabled={loading} type="submit" className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-black uppercase tracking-widest py-4 rounded-2xl transition-all shadow-xl shadow-indigo-600/20 flex justify-center items-center gap-3">
                        {loading ? <Loader2 className="w-6 h-6 animate-spin" /> : "Verify & Create"}
                    </button>
                </form>
            </div>
        </div>
    );
}

export function OwnerInsightModal({ owner, hotels, bookings, onClose, ask, reload }: {
    owner: HotelOwner;
    hotels: Hotel[];
    bookings: Booking[];
    onClose: () => void;
    ask: (label: string, fn: () => void) => void;
    reload: () => void;
}) {
    const ownerHotelIds = hotels.map(h => h.id);
    const ownerBookings = bookings.filter(b => ownerHotelIds.includes(b.hotelId));
    const totalRevenue = ownerBookings.filter(b => b.status === "CONFIRMED").reduce((s, b) => s + b.totalPrice, 0);
    const subExpired = new Date(owner.subscriptionEndDate) < new Date();

    return (
        <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
            <div className="bg-slate-900 border border-slate-700 rounded-3xl w-full max-w-4xl max-h-[90vh] shadow-2xl overflow-hidden flex flex-col">
                {/* Header */}
                <div className="p-6 border-b border-slate-800 bg-slate-800/40 flex justify-between items-center">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-2xl bg-indigo-600 flex items-center justify-center text-white font-bold text-xl">
                            {owner.name.charAt(0)}
                        </div>
                        <div>
                            <h2 className="text-xl font-bold text-white">{owner.name}</h2>
                            <p className="text-slate-400 text-sm">{owner.email} · Owner ID: <span className="font-mono">{owner.id}</span></p>
                        </div>
                    </div>
                    <button onClick={onClose} className="p-2 rounded-full hover:bg-slate-700 text-slate-400 hover:text-white transition">
                        <X className="w-6 h-6" />
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto p-6 space-y-6">
                    {/* Top KPI row */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <InsightCard label="Registered Hotels" value={hotels.length} icon={<Building2 className="w-4 h-4" />} color="blue" />
                        <InsightCard label="Total Bookings" value={ownerBookings.length} icon={<BookOpen className="w-4 h-4" />} color="indigo" />
                        <InsightCard label="Gross Revenue" value={`৳${totalRevenue.toLocaleString()}`} icon={<CreditCard className="w-4 h-4" />} color="emerald" />
                        <InsightCard label="Avg. Rating" value={`⭐ ${hotels.length > 0 ? (hotels.reduce((s, h) => s + h.rating, 0) / hotels.length).toFixed(1) : "N/A"}`} icon={<Shield className="w-4 h-4" />} color="amber" />
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        {/* Left: Account Management */}
                        <div className="space-y-4">
                            <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wider">Account Controls</h3>

                            <div className="bg-slate-800/40 rounded-2xl p-5 border border-slate-800 space-y-4">
                                <div>
                                    <p className="text-xs text-slate-500 mb-1">Account Status</p>
                                    <div className="flex items-center justify-between">
                                        <Badge color={owner.status === "ACTIVE" ? "green" : "red"}>{owner.status}</Badge>
                                        <button
                                            onClick={() => ask(owner.status === "ACTIVE" ? `Permanently BLOCK "${owner.name}"?` : `ACTIVATE "${owner.name}"?`, async () => { await api.updateUserStatus(owner.id, owner.status === "ACTIVE" ? "BLOCKED" : "ACTIVE"); reload(); })}
                                            className={`text-xs font-bold underline ${owner.status === "ACTIVE" ? "text-red-400" : "text-green-400"}`}
                                        >
                                            {owner.status === "ACTIVE" ? "Block Access" : "Grant Access"}
                                        </button>
                                    </div>
                                </div>

                                <div>
                                    <p className="text-xs text-slate-500 mb-1">Verification Status</p>
                                    <div className="flex items-center justify-between">
                                        <Badge color={owner.verificationStatus === "VERIFIED" ? "green" : owner.verificationStatus === "PENDING" ? "amber" : "red"}>
                                            {owner.verificationStatus}
                                        </Badge>
                                        {owner.verificationStatus !== "VERIFIED" && (
                                            <button
                                                onClick={() => ask(`Approve verification for "${owner.name}"?`, async () => { await api.updateVerificationStatus(owner.id, "VERIFIED"); reload(); })}
                                                className="text-xs font-bold text-indigo-400 underline"
                                            >
                                                Approve Now
                                            </button>
                                        )}
                                    </div>
                                </div>

                                <div>
                                    <p className="text-xs text-slate-500 mb-1">Subscription Plan</p>
                                    <div className="space-y-2">
                                        {owner.hasAdminOverride ? (
                                            <div className="bg-emerald-900/20 border border-emerald-800 rounded-lg p-2 text-center">
                                                <p className="text-emerald-400 text-xs font-bold">LIFETIME ACCESS (ADMIN OVERRIDE)</p>
                                            </div>
                                        ) : (
                                            <>
                                                <div className={`p-2 rounded-lg text-center border ${subExpired ? "bg-red-900/20 border-red-800 text-red-400" : "bg-slate-900 border-slate-700 text-slate-300"}`}>
                                                    <p className="text-xs font-medium">{subExpired ? "PLAN EXPIRED" : `Active until ${new Date(owner.subscriptionEndDate).toLocaleDateString()}`}</p>
                                                </div>
                                                <div className="flex gap-2">
                                                    <button onClick={() => ask(`Grant LIFETIME access to "${owner.name}"?`, async () => { await api.grantAdminOverride(owner.id); reload(); })}
                                                        className="flex-1 bg-slate-700 hover:bg-slate-600 text-white text-[10px] font-bold py-1.5 rounded uppercase">Lifetime</button>
                                                    <button onClick={() => ask(`Extend subscription for "${owner.name}" by 12 months?`, async () => { await api.extendSubscription(owner.id, 12); reload(); })}
                                                        className="flex-1 bg-indigo-600 hover:bg-indigo-50 text-white text-[10px] font-bold py-1.5 rounded uppercase">+1 Year</button>
                                                </div>
                                            </>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Right: Hotels & Recent Activity */}
                        <div className="lg:col-span-2 space-y-4">
                            <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wider">Hotel Portfolio</h3>
                            <div className="bg-slate-800/40 rounded-2xl border border-slate-800 overflow-hidden text-white">
                                <table className="w-full text-sm">
                                    <thead className="bg-slate-800 text-slate-500 text-xs uppercase">
                                        <tr>
                                            <th className="py-2 px-4 text-left">Hotel Name</th>
                                            <th className="py-2 px-4 text-center">Status</th>
                                            <th className="py-2 px-4 text-center">Bookings</th>
                                            <th className="py-2 px-4 text-right">Revenue</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-800">
                                        {hotels.map(h => {
                                            const hBookings = ownerBookings.filter(b => b.hotelId === h.id);
                                            const hRevenue = hBookings.filter(b => b.status === "CONFIRMED").reduce((s, b) => s + b.totalPrice, 0);
                                            return (
                                                <tr key={h.id} className="hover:bg-slate-800/20 transition">
                                                    <td className="py-2.5 px-4 font-medium">{h.name}</td>
                                                    <td className="py-2.5 px-4 text-center">
                                                        <Badge color={h.isActive ? "green" : "red"}>{h.isActive ? "ACTIVE" : "OFF"}</Badge>
                                                    </td>
                                                    <td className="py-2.5 px-4 text-center text-slate-400">{hBookings.length}</td>
                                                    <td className="py-2.5 px-4 text-right text-emerald-400 font-bold">৳{hRevenue.toLocaleString()}</td>
                                                </tr>
                                            );
                                        })}
                                        {hotels.length === 0 && <tr><td colSpan={4} className="py-8 text-center text-slate-600">No hotels registered yet.</td></tr>}
                                    </tbody>
                                </table>
                            </div>

                            <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wider">Recent Transactions</h3>
                            <div className="bg-slate-800/40 rounded-2xl border border-slate-800 overflow-hidden">
                                <div className="max-h-48 overflow-y-auto">
                                    <table className="w-full text-xs">
                                        <tbody className="divide-y divide-slate-800">
                                            {ownerBookings.slice().reverse().slice(0, 5).map(b => (
                                                <tr key={b.id} className="hover:bg-slate-800/20 transition text-slate-300">
                                                    <td className="py-2 px-4 text-slate-500 font-mono">{b.id}</td>
                                                    <td className="py-2 px-4 font-medium text-white">{b.hotelName}</td>
                                                    <td className="py-2 px-4">{b.checkIn}</td>
                                                    <td className="py-2 px-4 text-right text-green-400 font-bold">৳{b.totalPrice.toLocaleString()}</td>
                                                </tr>
                                            ))}
                                            {ownerBookings.length === 0 && <tr><td className="py-6 text-center text-slate-600">No bookings recorded.</td></tr>}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className="p-4 border-t border-slate-800 bg-slate-900 flex justify-between items-center">
                    <p className="text-xs text-slate-500 font-medium">Owner since {new Date(owner.createdAt).toLocaleDateString()}</p>
                    <button
                        onClick={onClose}
                        className="bg-indigo-600 hover:bg-indigo-500 text-white px-6 py-2 rounded-xl text-sm font-bold transition shadow-lg shadow-indigo-500/20"
                    >
                        Finished Review
                    </button>
                </div>
            </div>
        </div>
    );
}

function InsightCard({ label, value, icon, color }: { label: string; value: string | number; icon: React.ReactNode; color: string }) {
    const colors: Record<string, string> = {
        blue: "text-blue-400 bg-blue-400/10 border-blue-400/20",
        indigo: "text-indigo-400 bg-indigo-400/10 border-indigo-400/20",
        emerald: "text-emerald-400 bg-emerald-400/10 border-emerald-400/20",
        amber: "text-amber-400 bg-amber-400/10 border-amber-400/20",
    };
    return (
        <div className={`p-4 rounded-2xl border ${colors[color]} flex flex-col items-center text-center`}>
            <div className="mb-2 p-1.5 rounded-lg bg-white/5">{icon}</div>
            <p className="text-[10px] uppercase font-bold opacity-60 mb-1">{label}</p>
            <p className="text-xl font-bold text-white">{value}</p>
        </div>
    );
}
