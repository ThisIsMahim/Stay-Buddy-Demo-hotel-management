import React from "react";
import { MonitorDot, Users, CheckCircle2, LogOut, X, Sparkles } from "lucide-react";
import { Badge } from "../components/OwnerUI";
import { api } from "../../../services/api";

// Assuming types are available or handled via any for now safely
interface BookingsPanelProps {
    hotel: any;
    rooms: any[];
    guestProfiles: any[];
    filteredBookings: any[];
    bookingTypeFilter: string;
    setBookingTypeFilter: (filter: any) => void;
    bookingStatusFilter: string;
    setBookingStatusFilter: (filter: any) => void;
    online: any[];
    offline: any[];
    reload: () => void;
    AddOfflineBtn: React.ComponentType<any>;
}

const BookingsPanel = ({
    hotel,
    rooms,
    guestProfiles,
    filteredBookings,
    bookingTypeFilter,
    setBookingTypeFilter,
    bookingStatusFilter,
    setBookingStatusFilter,
    online,
    offline,
    reload,
    AddOfflineBtn
}: BookingsPanelProps) => {
    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-5 duration-700">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-slate-900/40 backdrop-blur-md p-5 md:p-6 rounded-[24px] border border-slate-800 shadow-2xl">
                <div>
                    <h2 className="text-3xl font-black text-white tracking-tight uppercase leading-tight">All Bookings</h2>
                    <p className="text-slate-500 text-[11px] font-black uppercase tracking-widest mt-1 italic">Manage all reservations for your property</p>
                </div>
                <AddOfflineBtn hotelId={hotel.id} rooms={rooms} users={guestProfiles} onDone={reload} />
            </div>

            <div className="bg-slate-900/40 backdrop-blur-md rounded-[32px] border border-slate-800 overflow-hidden shadow-2xl">
                <div className="p-6 border-b border-slate-800 flex flex-wrap justify-between items-center bg-slate-900/20 gap-4">
                    <div className="flex gap-3">
                        <div className="bg-indigo-500/10 border border-indigo-500/20 px-3 py-1.5 rounded-xl flex items-center gap-2">
                            <MonitorDot className="w-3.5 h-3.5 text-indigo-400" />
                            <span className="text-[9px] text-white font-black uppercase tracking-widest">{online.length} Cloud</span>
                        </div>
                        <div className="bg-amber-500/10 border border-amber-500/20 px-3 py-1.5 rounded-xl flex items-center gap-2">
                            <Users className="w-3.5 h-3.5 text-amber-400" />
                            <span className="text-[9px] text-white font-black uppercase tracking-widest">{offline.length} Direct</span>
                        </div>
                    </div>
                    <div className="flex gap-3 items-center ml-auto">
                        <div className="flex items-center gap-1.5 bg-slate-950/50 p-1 rounded-xl border border-slate-800">
                            {(["ALL", "ONLINE", "OFFLINE"] as const).map(t => (
                                <button
                                    key={t}
                                    onClick={() => setBookingTypeFilter(t)}
                                    className={`px-3 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-widest transition-all ${bookingTypeFilter === t ? "bg-indigo-600 text-white shadow-lg shadow-indigo-600/20" : "text-slate-500 hover:text-slate-300 hover:bg-white/5"}`}
                                >
                                    {t === "ALL" ? "ALL" : t === "ONLINE" ? "CLOUD" : "DIRECT"}
                                </button>
                            ))}
                        </div>
                        <select
                            value={bookingStatusFilter}
                            onChange={e => setBookingStatusFilter(e.target.value as any)}
                            className="bg-slate-950/50 border border-slate-800 text-white text-[9px] font-black uppercase tracking-widest rounded-xl px-3 py-2 outline-none h-[34px]"
                        >
                            <option value="ALL">ALL STATUS</option>
                            <option value="CONFIRMED">CONFIRMED</option>
                            <option value="PENDING">PENDING</option>
                            <option value="CANCELLED">CANCELLED</option>
                        </select>
                    </div>
                </div>
                <div className="overflow-x-auto custom-scrollbar">
                    <table className="w-full text-left">
                        <thead className="bg-slate-900/50 border-b border-slate-800">
                            <tr>
                                <th className="px-6 py-5 text-xs font-black text-slate-500 uppercase tracking-widest">Booking ID</th>
                                <th className="px-6 py-5 text-xs font-black text-slate-500 uppercase tracking-widest">Room</th>
                                <th className="px-6 py-5 text-xs font-black text-slate-500 uppercase tracking-widest">Stay Dates</th>
                                <th className="px-6 py-5 text-xs font-black text-slate-500 uppercase tracking-widest text-center">Type/Pay</th>
                                <th className="px-6 py-5 text-xs font-black text-slate-500 uppercase tracking-widest text-center">Status</th>
                                <th className="px-6 py-5 text-xs font-black text-slate-500 uppercase tracking-widest text-right">Amount</th>
                                <th className="px-6 py-5 text-xs font-black text-slate-500 uppercase tracking-widest text-center">Actions / Details</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-800/30">
                            {filteredBookings.map(b => (
                                <tr key={b.id} className="hover:bg-white/[0.02] transition-all group">
                                    <td className="px-6 py-5">
                                        <p className="font-black text-white text-sm tracking-tighter tabular-nums mb-1 uppercase">#RES-{b.id.slice(0, 4)}</p>
                                        <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Created {new Date(b.createdAt).toLocaleDateString()}</p>
                                    </td>
                                    <td className="p-6">
                                        <p className="font-black text-white text-sm uppercase tracking-tight">{b.guestName || "Guest User"}</p>
                                        <p className="text-[9px] text-slate-500 font-bold uppercase tracking-widest mt-1 italic">{b.guestEmail || "No Email Provided"}</p>
                                        {b.guestPhone && <p className="text-[9px] text-indigo-400 font-bold uppercase tracking-widest mt-1">{b.guestPhone}</p>}
                                    </td>
                                    <td className="p-6">
                                        <p className="font-black text-white text-sm uppercase tracking-tight">{b.roomType}</p>
                                        <p className="text-[11px] text-indigo-400 font-bold uppercase tracking-widest mt-1.5">Room {rooms.find(r => r.id === b.roomId)?.roomNumber || "N/A"}</p>
                                    </td>
                                    <td className="p-6">
                                        <p className="font-black text-white text-sm uppercase tracking-tighter">{b.checkIn} → {b.checkOut}</p>
                                        <p className="text-[11px] text-slate-500 font-bold uppercase tracking-widest mt-1.5">{b.nights} Night{b.nights > 1 ? 's' : ''}</p>
                                    </td>
                                    <td className="p-6 text-center">
                                        <Badge color={b.type === "ONLINE" ? "blue" : "amber"}>{b.type}</Badge>
                                        <p className="text-[8px] text-slate-500 font-black uppercase mt-1 tracking-tighter">{b.paymentMethod || "UNSET"}</p>
                                    </td>
                                    <td className="p-6 text-center">
                                        <Badge color={b.status === "CONFIRMED" ? "green" : b.status === "PENDING" ? "amber" : "rose"}>{b.status}</Badge>
                                    </td>
                                    <td className="p-6 text-right font-black text-emerald-400 text-lg tabular-nums">৳{b.totalPrice.toLocaleString()}</td>
                                    <td className="p-6 text-center">
                                        <div className="flex justify-center gap-2">
                                            {b.specialRequests && (
                                                <button onClick={() => alert(`Special Requests:\n${b.specialRequests}\n\nArrival Time: ${b.arrivalTime || 'Not specified'}`)} title="View Requests" className="p-2.5 rounded-xl bg-amber-500/10 text-amber-500 border border-amber-500/20 hover:bg-amber-500 hover:text-white transition-all shadow-lg active:scale-95">
                                                    <Sparkles className="w-4 h-4" />
                                                </button>
                                            )}
                                            {b.status === "PENDING" && (
                                                <button onClick={() => api.processCheckIn(b.id).then(reload)} title="Process Check-In" className="p-2.5 rounded-xl bg-indigo-500/10 text-indigo-500 border border-indigo-500/20 hover:bg-indigo-500 hover:text-white transition-all shadow-lg active:scale-95">
                                                    <CheckCircle2 className="w-4 h-4" />
                                                </button>
                                            )}
                                            {b.status === "CONFIRMED" && (
                                                <button onClick={() => api.processCheckOut(b.id).then(reload)} title="Process Check-Out" className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 hover:bg-emerald-500 hover:text-white transition-all shadow-lg active:scale-95">
                                                    <LogOut className="w-4 h-4" />
                                                </button>
                                            )}
                                            {b.status !== "CANCELLED" && (
                                                <button onClick={() => api.cancelBooking(b.id).then(reload)} title="Abort Reservation" className="p-2.5 rounded-xl bg-rose-500/10 text-rose-500 border border-rose-500/20 hover:bg-rose-500 hover:text-white transition-all shadow-lg active:scale-95">
                                                    <X className="w-4 h-4" />
                                                </button>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            ))}
                            {filteredBookings.length === 0 && (
                                <tr>
                                    <td colSpan={7} className="p-12 text-center">
                                        <p className="text-slate-500 font-black uppercase tracking-[0.2em] text-[10px]">No reservations match your filters</p>
                                        <p className="text-slate-600 text-xs mt-3">
                                            Showing: <span className="text-slate-300 font-bold">{bookingTypeFilter}</span> / <span className="text-slate-300 font-bold">{bookingStatusFilter}</span>
                                        </p>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default BookingsPanel;
