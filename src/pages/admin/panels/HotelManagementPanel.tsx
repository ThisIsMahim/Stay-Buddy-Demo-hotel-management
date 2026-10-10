import React, { useState } from "react";
import { Building2, Bed, CheckCircle, Trash2, Flag, Ban, Plus, Search, Filter, Sparkles, MapPin } from "lucide-react";
import { api, Hotel, Room, UserProfile, HotelOwner } from "../../../services/api";
import { StatCard, Badge, ActionBtn } from "../components/AdminUIElements";
import { AddHotelModal, AddRoomModal } from "../../owner/components/OwnerModals";

interface HotelManagementPanelProps {
    hotels: Hotel[];
    rooms: (Room & { hotelName: string })[];
    userList: (UserProfile | HotelOwner)[];
    reload: () => void;
}

export default function HotelManagementPanel({ hotels, rooms, userList, reload }: HotelManagementPanelProps) {
    const [subTab, setSubTab] = useState<"hotels" | "rooms">("hotels");
    const [showAddHotel, setShowAddHotel] = useState(false);
    const [selectedHotelForRoom, setSelectedHotelForRoom] = useState<{ id: string; name: string } | null>(null);
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedCity, setSelectedCity] = useState("ALL");

    const owners = userList.filter(u => u.role === "OWNER") as HotelOwner[];
    const defaultOwnerId = owners[0]?.id || userList[0]?.id || "admin_owner";

    const vacantRooms = rooms.reduce((sum, r) => sum + r.availableCount, 0);
    const totalRooms = rooms.reduce((sum, r) => sum + r.totalInventory, 0);

    // Unique cities/spots for filter dropdown
    const cities = ["ALL", ...Array.from(new Set(hotels.map(h => h.city).filter(Boolean)))];

    // Filter hotels
    const filteredHotels = hotels.filter(h => {
        const matchesSearch = !searchTerm || 
            h.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            h.city.toLowerCase().includes(searchTerm.toLowerCase()) ||
            h.address.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesCity = selectedCity === "ALL" || h.city.toLowerCase() === selectedCity.toLowerCase();
        return matchesSearch && matchesCity;
    });

    // Filter rooms
    const filteredRooms = rooms.filter(r => {
        return !searchTerm || 
            r.hotelName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            r.type.toLowerCase().includes(searchTerm.toLowerCase());
    });

    return (
        <div className="space-y-8 relative">
            {/* Overview & Action Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <StatCard label="Total Properties" value={hotels.length} color="slate" icon={<Building2 className="w-4 h-4" />} subLabel="Verified Live Registry" />
                <StatCard label="Room Configurations" value={rooms.length} color="slate" icon={<Bed className="w-4 h-4" />} subLabel="Active Configurations" />
                <StatCard label="Live Vacancy" value={`${vacantRooms} / ${totalRooms}`} color="green" icon={<CheckCircle className="w-4 h-4" />} subLabel="Available Inventory" />
                
                {/* Admin Quick Creation Card */}
                <div className="bg-gradient-to-br from-indigo-950/60 to-slate-900/80 backdrop-blur-xl rounded-2xl p-5 border border-indigo-500/30 flex flex-col justify-between shadow-2xl">
                    <div className="flex items-center justify-between">
                        <span className="text-[10px] font-black uppercase tracking-widest text-indigo-400 flex items-center gap-1.5">
                            <Sparkles className="w-3.5 h-3.5 text-indigo-400" /> Admin Live Control
                        </span>
                        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                    </div>
                    <div className="flex items-center gap-2 mt-3">
                        <button
                            onClick={() => setShowAddHotel(true)}
                            className="flex-1 px-3 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-[11px] font-black uppercase tracking-wider flex items-center justify-center gap-1.5 transition-all shadow-lg shadow-indigo-600/30 active:scale-95"
                        >
                            <Plus className="w-3.5 h-3.5" /> New Hotel
                        </button>
                        {hotels.length > 0 && (
                            <button
                                onClick={() => setSelectedHotelForRoom({ id: hotels[0].id, name: hotels[0].name })}
                                className="px-3 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-indigo-300 border border-indigo-500/20 text-[11px] font-black uppercase tracking-wider flex items-center justify-center gap-1.5 transition-all active:scale-95"
                            >
                                <Plus className="w-3.5 h-3.5" /> Room
                            </button>
                        )}
                    </div>
                </div>
            </div>

            {/* Filter and Control Bar */}
            <div className="bg-slate-900/60 backdrop-blur-xl p-4 rounded-2xl border border-white/5 shadow-2xl flex flex-col lg:flex-row items-center justify-between gap-4">
                {/* SubTab Toggle */}
                <div className="flex gap-2 w-full lg:w-auto">
                    <button 
                        onClick={() => setSubTab("hotels")} 
                        className={`flex-1 lg:flex-none px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider transition-all flex items-center justify-center gap-2 ${
                            subTab === "hotels" 
                                ? "bg-indigo-600 text-white shadow-xl shadow-indigo-600/20" 
                                : "text-slate-400 hover:text-white bg-slate-800/40"
                        }`}
                    >
                        <Building2 className="w-4 h-4" /> Properties ({hotels.length})
                    </button>
                    <button 
                        onClick={() => setSubTab("rooms")} 
                        className={`flex-1 lg:flex-none px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider transition-all flex items-center justify-center gap-2 ${
                            subTab === "rooms" 
                                ? "bg-indigo-600 text-white shadow-xl shadow-indigo-600/20" 
                                : "text-slate-400 hover:text-white bg-slate-800/40"
                        }`}
                    >
                        <Bed className="w-4 h-4" /> Room Configurations ({rooms.length})
                    </button>
                </div>

                {/* Search & City Filter */}
                <div className="flex flex-wrap items-center gap-2.5 w-full lg:w-auto">
                    <div className="relative flex-1 sm:w-64">
                        <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                        <input
                            type="text"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            placeholder="Search by hotel name, city..."
                            className="w-full bg-slate-950/70 border border-slate-800 rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition"
                        />
                    </div>

                    {subTab === "hotels" && cities.length > 1 && (
                        <select
                            value={selectedCity}
                            onChange={(e) => setSelectedCity(e.target.value)}
                            className="bg-slate-950/70 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-300 focus:outline-none focus:border-indigo-500"
                        >
                            {cities.map(c => (
                                <option key={c} value={c} className="bg-slate-900">
                                    {c === "ALL" ? "All Tourist Zones" : c}
                                </option>
                            ))}
                        </select>
                    )}

                    <button
                        onClick={() => subTab === "hotels" ? setShowAddHotel(true) : setSelectedHotelForRoom(hotels[0] ? { id: hotels[0].id, name: hotels[0].name } : null)}
                        className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-black text-xs uppercase tracking-wider flex items-center gap-1.5 transition shadow-lg shadow-emerald-600/20 active:scale-95 shrink-0"
                    >
                        <Plus className="w-3.5 h-3.5 stroke-[3]" />
                        <span>{subTab === "hotels" ? "Add Property" : "Add Room"}</span>
                    </button>
                </div>
            </div>

            {/* Hotels Table */}
            {subTab === "hotels" && (
                <div className="bg-slate-900/40 backdrop-blur-xl rounded-[24px] border border-white/5 overflow-hidden shadow-2xl">
                    <div className="overflow-x-auto">
                        <table className="w-full text-[11px] min-w-[850px]">
                            <thead className="bg-slate-950/50 text-slate-500 uppercase text-[9px] font-black tracking-[0.2em]">
                                <tr>
                                    <th className="py-3.5 px-6 text-left">Property & Image</th>
                                    <th className="py-3.5 px-6 text-left">Destination & Zone</th>
                                    <th className="py-3.5 px-6 text-center">Status</th>
                                    <th className="py-3.5 px-6 text-center">Verification</th>
                                    <th className="py-3.5 px-6 text-center">Protocol</th>
                                    <th className="py-3.5 px-6 text-right">Instant Controls</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-800/50">
                                {filteredHotels.map(h => {
                                    const ownerName = owners.find(o => o.id === h.ownerId)?.name || "Stay Buddy Operator";
                                    return (
                                        <tr key={h.id} className="group hover:bg-slate-800/40 transition-all border-b border-white/[0.02] last:border-0">
                                            <td className="py-4 px-6">
                                                <div className="flex items-center gap-3.5">
                                                    <div className="w-14 h-11 rounded-xl bg-slate-800 border border-white/10 overflow-hidden shadow-lg shrink-0">
                                                        <img 
                                                            src={h.images?.[0] || "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=400"} 
                                                            alt="" 
                                                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" 
                                                        />
                                                    </div>
                                                    <div>
                                                        <p className="font-bold text-white text-[13px] tracking-tight mb-0.5">{h.name}</p>
                                                        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                                                            Operator: {ownerName} · ⭐ {h.rating || 4.5}
                                                        </p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="py-4 px-6">
                                                <div className="flex items-center gap-1.5 text-emerald-400 font-bold text-xs mb-0.5">
                                                    <MapPin className="w-3 h-3 shrink-0" />
                                                    <span>{h.city}</span>
                                                </div>
                                                <p className="text-[10px] text-slate-400 font-medium truncate max-w-[180px]">{h.address}</p>
                                            </td>
                                            <td className="py-4 px-6 text-center uppercase">
                                                <Badge color={h.isActive ? "green" : "red"}>{h.isActive ? "Active" : "Offline"}</Badge>
                                            </td>
                                            <td className="py-4 px-6 text-center uppercase">
                                                <Badge color={h.isVerified ? "blue" : "amber"}>{h.isVerified ? "Verified" : "Pending"}</Badge>
                                            </td>
                                            <td className="py-4 px-6 text-center uppercase">
                                                <Badge color={h.isRedMarked ? "red" : "slate"}>{h.isRedMarked ? "Critical" : "Standard"}</Badge>
                                            </td>
                                            <td className="py-4 px-6">
                                                <div className="flex items-center justify-end gap-2">
                                                    {/* Quick Add Room */}
                                                    <button
                                                        onClick={() => setSelectedHotelForRoom({ id: h.id, name: h.name })}
                                                        title="Add Room to this Hotel"
                                                        className="px-2.5 py-1.5 rounded-lg bg-indigo-500/15 hover:bg-indigo-500 text-indigo-300 hover:text-white border border-indigo-500/30 text-[10px] font-black uppercase tracking-wider transition-all flex items-center gap-1"
                                                    >
                                                        <Plus className="w-3 h-3" /> Room
                                                    </button>

                                                    <ActionBtn 
                                                        color={h.isVerified ? "slate" : "blue"} 
                                                        icon={<CheckCircle className="w-3.5 h-3.5" />} 
                                                        label={h.isVerified ? "Unverify" : "Verify"} 
                                                        onClick={async () => { await api.updateHotel(h.id, { isVerified: !h.isVerified }); reload(); }} 
                                                    />
                                                    <ActionBtn 
                                                        color={h.isRedMarked ? "slate" : "red"} 
                                                        icon={<Flag className="w-3.5 h-3.5" />} 
                                                        label={h.isRedMarked ? "Clear" : "Flag"} 
                                                        onClick={async () => { await api.toggleRedMark(h.id); reload(); }} 
                                                    />
                                                    <ActionBtn 
                                                        color={h.isActive ? "slate" : "green"} 
                                                        icon={<Ban className="w-3.5 h-3.5" />} 
                                                        label={h.isActive ? "Halt" : "Resume"} 
                                                        onClick={async () => { await api.toggleHotelActive(h.id); reload(); }} 
                                                    />
                                                    <button 
                                                        onClick={async () => { 
                                                            if (confirm(`Decommission and remove "${h.name}" from live platform?`)) { 
                                                                await api.deleteHotel(h.id); 
                                                                reload(); 
                                                            } 
                                                        }} 
                                                        className="p-2 rounded-xl bg-rose-500/10 text-rose-500 border border-rose-500/20 hover:bg-rose-500 hover:text-white transition-all shadow-lg"
                                                    >
                                                        <Trash2 className="w-3.5 h-3.5" />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })}
                                {filteredHotels.length === 0 && (
                                    <tr>
                                        <td colSpan={6} className="py-16 text-center">
                                            <Building2 className="w-12 h-12 text-slate-800 mx-auto mb-3" />
                                            <p className="text-slate-400 font-bold uppercase tracking-widest text-xs">
                                                No Matching Properties Found
                                            </p>
                                            <button
                                                onClick={() => setShowAddHotel(true)}
                                                className="mt-3 px-4 py-2 rounded-xl bg-indigo-600 text-white font-bold text-xs"
                                            >
                                                + Register First Property
                                            </button>
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
                <div className="bg-slate-900/40 backdrop-blur-xl rounded-[28px] border border-slate-800 overflow-hidden shadow-2xl">
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm min-w-[900px]">
                            <thead className="bg-slate-950/50 text-slate-500 uppercase text-[10px] font-black tracking-[0.2em]">
                                <tr>
                                    <th className="py-4 px-6 text-left">Parent Hotel</th>
                                    <th className="py-4 px-6 text-left">Room Configuration</th>
                                    <th className="py-4 px-6 text-right">Price / Night</th>
                                    <th className="py-4 px-6 text-center">Total Inventory</th>
                                    <th className="py-4 px-6 text-center">Live Available</th>
                                    <th className="py-4 px-6 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-800/50">
                                {filteredRooms.map(r => (
                                    <tr key={r.id} className="group hover:bg-slate-800/30 transition-colors">
                                        <td className="py-4 px-6 font-bold text-white text-xs uppercase tracking-tight">
                                            {r.hotelName}
                                        </td>
                                        <td className="py-4 px-6">
                                            <div className="bg-slate-800/60 border border-slate-700 px-3 py-1 rounded-xl inline-block">
                                                <span className="text-slate-200 text-xs font-bold uppercase tracking-wider">
                                                    {r.type}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="py-4 px-6 text-right font-black text-emerald-400 text-base">
                                            ৳{r.pricePerNight?.toLocaleString()}
                                        </td>
                                        <td className="py-4 px-6 text-center text-slate-400 font-black text-base">
                                            {r.totalInventory}
                                        </td>
                                        <td className="py-4 px-6 text-center">
                                            <div className={`inline-flex items-center justify-center min-w-[36px] h-8 px-2.5 rounded-xl font-black text-xs border ${
                                                r.availableCount > 0 
                                                    ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" 
                                                    : "bg-rose-500/10 text-rose-400 border-rose-500/20"
                                            }`}>
                                                {r.availableCount}
                                            </div>
                                        </td>
                                        <td className="py-4 px-6 text-right">
                                            <button 
                                                onClick={async () => { 
                                                    if (confirm(`Remove room configuration "${r.type}"?`)) { 
                                                        await api.deleteRoom(r.id); 
                                                        reload(); 
                                                    } 
                                                }} 
                                                className="p-2.5 rounded-xl bg-rose-900/20 text-rose-500 border border-rose-500/20 hover:bg-rose-600 hover:text-white transition-all shadow-xl"
                                            >
                                                <Trash2 className="w-3.5 h-3.5" />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                                {filteredRooms.length === 0 && (
                                    <tr>
                                        <td colSpan={6} className="py-16 text-center">
                                            <Bed className="w-12 h-12 text-slate-800 mx-auto mb-3" />
                                            <p className="text-slate-400 font-bold uppercase tracking-widest text-xs">
                                                No Active Room Configurations
                                            </p>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {/* ═══════════ MODALS ═══════════ */}
            {/* Add Hotel Modal */}
            {showAddHotel && (
                <AddHotelModal
                    ownerId={defaultOwnerId}
                    onClose={() => setShowAddHotel(false)}
                    onDone={() => {
                        setShowAddHotel(false);
                        reload();
                    }}
                />
            )}

            {/* Add Room Modal */}
            {selectedHotelForRoom && (
                <AddRoomModal
                    hotelId={selectedHotelForRoom.id}
                    onClose={() => setSelectedHotelForRoom(null)}
                    onDone={() => {
                        setSelectedHotelForRoom(null);
                        reload();
                    }}
                />
            )}
        </div>
    );
}

