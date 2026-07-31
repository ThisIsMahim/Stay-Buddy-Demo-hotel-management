import React, { useState } from "react";
import { Building2, Bed, CheckCircle, Trash2, Flag, Ban } from "lucide-react";
import { api, Hotel, Room, UserProfile, HotelOwner } from "../../../services/api";
import { StatCard, Badge, ActionBtn } from "../components/AdminUIElements";

interface HotelManagementPanelProps {
    hotels: Hotel[];
    rooms: (Room & { hotelName: string })[];
    userList: (UserProfile | HotelOwner)[];
    reload: () => void;
}

export default function HotelManagementPanel({ hotels, rooms, userList, reload }: HotelManagementPanelProps) {
    const [subTab, setSubTab] = useState<"hotels" | "rooms">("hotels");

    const owners = userList.filter(u => u.role === "OWNER") as HotelOwner[];
    const vacantRooms = rooms.reduce((sum, r) => sum + r.availableCount, 0);
    const totalRooms = rooms.reduce((sum, r) => sum + r.totalInventory, 0);

    return (
        <div className="space-y-10 relative">
            {/* Overview Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
                <StatCard label="Total Assets" value={hotels.length} color="slate" icon={<Building2 className="w-4 h-4" />} subLabel="Property Registry" />
                <StatCard label="Configurations" value={rooms.length} color="slate" icon={<Bed className="w-4 h-4" />} subLabel="Room Archetypes" />
                <StatCard label="Live Vacancy" value={`${vacantRooms} / ${totalRooms}`} color="green" icon={<CheckCircle className="w-4 h-4" />} subLabel="Active Inventory" />
                <div className="bg-slate-900/60 backdrop-blur-xl rounded-2xl p-6 border border-white/5 flex items-center justify-center text-center shadow-2xl transition-all hover:scale-[1.02]">
                    <p className="text-[10px] font-black text-indigo-400 uppercase tracking-widest leading-tight bg-indigo-500/10 px-4 py-2 rounded-xl border border-indigo-500/20 shadow-[0_0_15px_rgba(99,102,241,0.15)]">System Read-Only Mode</p>
                </div>
            </div>

            {/* Control Bar */}
            <div className="bg-slate-900/40 backdrop-blur-xl p-1.5 rounded-2xl border border-white/5 shadow-2xl flex items-center justify-between w-full relative">
                <div className="flex gap-1.5">
                    <button onClick={() => setSubTab("hotels")} className={`px-8 py-3 rounded-xl text-[11px] font-black uppercase tracking-[0.1em] transition-all ${subTab === "hotels" ? "bg-indigo-600 text-white shadow-xl shadow-indigo-600/20" : "text-slate-400 hover:text-white"}`}>
                        <Building2 className="w-4 h-4 inline mr-2.5" /> Asset Directory
                    </button>
                    <button onClick={() => setSubTab("rooms")} className={`px-8 py-3 rounded-xl text-[11px] font-black uppercase tracking-[0.1em] transition-all ${subTab === "rooms" ? "bg-indigo-600 text-white shadow-xl shadow-indigo-600/20" : "text-slate-400 hover:text-white"}`}>
                        <Bed className="w-4 h-4 inline mr-2.5" /> Inventory Control
                    </button>
                </div>
            </div>

            {/* Hotels Table */}
            {subTab === "hotels" && (
                <div className="bg-slate-900/40 backdrop-blur-xl rounded-[24px] border border-white/5 overflow-hidden shadow-2xl">
                    <div className="overflow-x-auto">
                        <table className="w-full text-[11px] min-w-[800px]">
                            <thead className="bg-slate-950/30 text-slate-500 uppercase text-[9px] font-black tracking-[0.2em]">
                                <tr>
                                    <th className="py-3 px-6 text-left">Asset</th>
                                    <th className="py-3 px-6 text-left">Zone</th>
                                    <th className="py-3 px-6 text-center">Status</th>
                                    <th className="py-3 px-6 text-center">Verification</th>
                                    <th className="py-3 px-6 text-center">Protocol</th>
                                    <th className="py-3 px-6 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-800/50">
                                {hotels.map(h => {
                                    const ownerName = owners.find(o => o.id === h.ownerId)?.name || "Unknown Operator";
                                    return (
                                        <tr key={h.id} className="group hover:bg-slate-800/40 transition-all border-b border-white/[0.02] last:border-0">
                                            <td className="py-4 px-8">
                                                <div className="flex items-center gap-4">
                                                    <div className="w-14 h-10 rounded-xl bg-slate-800 border border-white/10 overflow-hidden shadow-lg">
                                                        <img src={h.images[0]} alt="" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                                                    </div>
                                                    <div>
                                                        <p className="font-bold text-white text-[13px] tracking-tight mb-0.5">{h.name}</p>
                                                        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Op: {ownerName} · ⭐ {h.rating}</p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="py-4 px-8">
                                                <p className="text-white font-bold text-xs mb-0.5">{h.city}</p>
                                                <p className="text-[10px] text-slate-400 font-medium truncate max-w-[150px]">{h.address}</p>
                                            </td>
                                            <td className="py-4 px-8 text-center uppercase">
                                                <Badge color={h.isActive ? "green" : "red"}>{h.isActive ? "Active" : "Offline"}</Badge>
                                            </td>
                                            <td className="py-4 px-8 text-center uppercase">
                                                <Badge color={h.isVerified ? "blue" : "amber"}>{h.isVerified ? "Verified" : "Pending"}</Badge>
                                            </td>
                                            <td className="py-4 px-8 text-center uppercase">
                                                <Badge color={h.isRedMarked ? "red" : "slate"}>{h.isRedMarked ? "Critical" : "Standard"}</Badge>
                                            </td>
                                            <td className="py-4 px-8">
                                                <div className="flex justify-end gap-3">
                                                    <ActionBtn color={h.isVerified ? "slate" : "blue"} icon={<CheckCircle className="w-3.5 h-3.5" />} label={h.isVerified ? "Unverify" : "Verify"} onClick={async () => { await api.updateHotel(h.id, { isVerified: !h.isVerified }); reload(); }} />
                                                    <ActionBtn color={h.isRedMarked ? "slate" : "red"} icon={<Flag className="w-3.5 h-3.5" />} label={h.isRedMarked ? "Clear" : "Flag"} onClick={async () => { await api.toggleRedMark(h.id); reload(); }} />
                                                    <ActionBtn color={h.isActive ? "slate" : "green"} icon={<Ban className="w-3.5 h-3.5" />} label={h.isActive ? "Halt" : "Resume"} onClick={async () => { await api.toggleHotelActive(h.id); reload(); }} />
                                                    <button onClick={async () => { if (confirm("Decommission asset?")) { await api.deleteHotel(h.id); reload(); } }} className="p-2.5 rounded-xl bg-rose-500/10 text-rose-500 border border-rose-500/20 hover:bg-rose-500 hover:text-white transition-all shadow-lg">
                                                        <Trash2 className="w-4 h-4" />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    )
                                })}
                                {hotels.length === 0 && (
                                    <tr>
                                        <td colSpan={5} className="py-20 text-center">
                                            <Building2 className="w-12 h-12 text-slate-800 mx-auto mb-4" />
                                            <p className="text-slate-500 font-bold uppercase tracking-[0.2em] text-[10px]">No Active Assets</p>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {/* Rooms Table */}
            {subTab === "rooms" && (
                <div className="bg-slate-900/40 backdrop-blur-xl rounded-[32px] border border-slate-800 overflow-hidden shadow-2xl">
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm min-w-[900px]">
                            <thead className="bg-slate-950/30 text-slate-500 uppercase text-[10px] font-black tracking-[0.2em]">
                                <tr>
                                    <th className="py-5 px-8 text-left">Parent Asset</th>
                                    <th className="py-5 px-8 text-left">Configuration</th>
                                    <th className="py-5 px-8 text-right">Yield/Cycle</th>
                                    <th className="py-5 px-8 text-center">Total Load</th>
                                    <th className="py-5 px-8 text-center">Available Capacity</th>
                                    <th className="py-5 px-8 text-right">Moderation</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-800/50">
                                {rooms.map(r => (
                                    <tr key={r.id} className="group hover:bg-slate-800/30 transition-colors">
                                        <td className="py-5 px-8 font-black text-white text-sm uppercase tracking-tight">{r.hotelName}</td>
                                        <td className="py-5 px-8">
                                            <div className="bg-slate-800/50 border border-slate-700 px-3 py-1.5 rounded-xl inline-block">
                                                <span className="text-slate-300 text-[10px] font-black uppercase tracking-widest">{r.type}</span>
                                            </div>
                                        </td>
                                        <td className="py-5 px-8 text-right font-black text-emerald-400 text-lg">৳{r.pricePerNight.toLocaleString()}</td>
                                        <td className="py-5 px-8 text-center text-slate-400 font-black text-lg">{r.totalInventory}</td>
                                        <td className="py-5 px-8 text-center">
                                            <div className={`inline-flex items-center justify-center min-w-[40px] h-10 px-3 rounded-2xl font-black text-sm border ${r.availableCount > 0 ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" : "bg-rose-500/10 text-rose-400 border-rose-500/20"}`}>
                                                {r.availableCount}
                                            </div>
                                        </td>
                                        <td className="py-5 px-8">
                                            <div className="flex justify-end">
                                                <button onClick={async () => { if (confirm("Remove room configuration?")) { await api.deleteRoom(r.id); reload(); } }} className="p-3 rounded-2xl bg-rose-900/20 text-rose-500 border border-rose-500/20 hover:bg-rose-600 hover:text-white transition-all shadow-xl">
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                                {rooms.length === 0 && (
                                    <tr>
                                        <td colSpan={6} className="py-20 text-center">
                                            <Bed className="w-12 h-12 text-slate-800 mx-auto mb-4" />
                                            <p className="text-slate-500 font-bold uppercase tracking-[0.2em] text-[10px]">No Active Configurations</p>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </div>
    );
}
