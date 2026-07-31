import React, { useState } from "react";
import { createPortal } from "react-dom";
import { Home, Pencil, Trash2, Plus, X, CheckCircle2 } from "lucide-react";
import { api } from "../../../services/api";

export function RoomCardPremium({ room, onDelete, onEdit, onPriceChange, onInventoryChange, onDiscountChange }: {
    room: any;
    onDelete: () => void;
    onEdit: () => void;
    onPriceChange: (price: number) => void;
    onInventoryChange: (total: number, available: number) => void;
    onDiscountChange: (discount: number | null) => void;
}) {
    const totalInv = Math.max(Number(room.totalInventory) || 0, Number(room.availableCount) || 0);
    const availCount = Number(room.availableCount) || 0;
    const bookedCount = Math.max(0, totalInv - availCount);

    const updateInv = (delta: number) => {
        const newTotal = totalInv + delta;
        if (newTotal < bookedCount) {
            alert(`Cannot reduce inventory below already booked rooms (${bookedCount} bookings active)`);
            return;
        }
        const newAvailable = availCount + delta;
        onInventoryChange(newTotal, newAvailable);
    };

    return (
        <div className="bg-slate-950 rounded-3xl border border-slate-800/60 overflow-hidden shadow-2xl hover:border-indigo-500/40 transition-all duration-500 group relative flex flex-col h-[440px] w-full max-w-[320px] mx-auto hover:translate-y-[-8px]">
            <div className="relative h-[180px] shrink-0 p-3">
                <div className="w-full h-full rounded-2xl overflow-hidden relative border border-slate-800/40">
                    {room.images[0] ? (
                        <img src={room.images[0]} alt={room.type} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                    ) : (
                        <div className="w-full h-full bg-slate-900 flex items-center justify-center text-slate-700"><Home className="w-8 h-8" /></div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-b from-transparent to-slate-950/80 opacity-90" />
                    <div className="absolute top-3 left-3 flex flex-col gap-2">
                        <div className="bg-indigo-600/90 text-white text-[10px] font-black px-3 py-1 rounded-lg shadow-lg uppercase tracking-widest w-fit">
                            {room.type}
                        </div>
                    </div>
                    <div className="absolute top-3 right-3 flex gap-2 opacity-0 group-hover:opacity-100 transition-all duration-300">
                        <button onClick={onEdit} className="w-9 h-9 rounded-xl bg-slate-900/80 backdrop-blur-md text-white flex items-center justify-center hover:bg-indigo-600 transition-colors">
                            <Pencil className="w-4 h-4" />
                        </button>
                        <button onClick={onDelete} className="w-9 h-9 rounded-xl bg-slate-900/80 backdrop-blur-md text-white flex items-center justify-center hover:bg-rose-600 transition-colors">
                            <Trash2 className="w-4 h-4" />
                        </button>
                    </div>
                    <div className="absolute inset-x-0 bottom-4 flex flex-col items-center">
                        <h3 className="text-lg font-black text-white leading-tight uppercase tracking-tight drop-shadow-lg">{room.type}</h3>
                    </div>
                </div>
            </div>
            <div className="flex-1 px-6 py-4 flex flex-col justify-between">
                <div className="flex justify-between items-start">
                    <div>
                        <p className="text-[10px] font-black text-indigo-400 uppercase tracking-widest mb-1 opacity-70">Rate</p>
                        <div className="flex items-baseline gap-2 py-1">
                            {room.discountPrice ? (
                                <>
                                    <span className="text-2xl font-black text-emerald-400 tracking-tighter tabular-nums">৳{room.discountPrice}</span>
                                    <span className="text-xs font-black text-slate-600 line-through tabular-nums opacity-60">৳{room.pricePerNight}</span>
                                </>
                            ) : (
                                <span className="text-2xl font-black text-white tracking-tighter tabular-nums">৳{room.pricePerNight}</span>
                            )}
                        </div>
                    </div>
                    <div className="text-right">
                        <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1 opacity-70">Details</p>
                        <div className="flex flex-col items-end">
                            <span className="text-[10px] font-black text-slate-300 uppercase leading-none">Floor {room.floorNumber}</span>
                            <span className="text-[10px] font-bold text-slate-500 uppercase mt-1">{room.viewType || "City View"}</span>
                            <span className="text-[10px] font-bold text-slate-500 uppercase mt-0.5">{room.capacity || "2 Guests"}</span>
                        </div>
                    </div>
                </div>
            </div>
            <div className="bg-slate-900/50 p-2.5 rounded-2xl border border-slate-800/40">
                <div className="flex items-center justify-between gap-3">
                    <div className={`flex-1 h-10 rounded-xl flex flex-col items-center justify-center font-black tabular-nums tracking-tighter leading-none ${room.availableCount > 0 ? "bg-emerald-500/10 text-emerald-400" : "bg-rose-500/10 text-rose-400"}`}>
                        <span className="text-sm">{room.availableCount} Available</span>
                        <span className="text-[8px] uppercase tracking-widest opacity-60">{bookedCount} Selected</span>
                    </div>
                    <div className="flex gap-1.5 pr-1">
                        <button onClick={() => updateInv(-1)} className="w-8 h-8 rounded-lg border border-slate-700/50 flex items-center justify-center text-slate-500 hover:text-white hover:bg-slate-800 transition-all font-black text-sm">-</button>
                        <button onClick={() => updateInv(1)} className="w-8 h-8 rounded-lg border border-slate-700/50 flex items-center justify-center text-slate-500 hover:text-white hover:bg-slate-800 transition-all font-black text-sm">+</button>
                    </div>
                </div>
            </div>
            <div className="space-y-2">
                <div className="flex justify-between items-end">
                    <span className="text-[10px] font-black text-slate-600 uppercase tracking-widest">Occupancy Rate</span>
                    <span className="text-xs font-black text-white tracking-tight">{room.totalInventory > 0 ? Math.min(100, Math.round((bookedCount / room.totalInventory) * 100)) : 0}%</span>
                </div>
                <div className="h-1.5 w-full bg-slate-900 rounded-full overflow-hidden">
                    <div
                        className={`h-full rounded-full transition-all duration-[1000ms] ${room.totalInventory > 0 && (bookedCount / room.totalInventory) * 100 < 50 ? "bg-emerald-500" : room.totalInventory > 0 && (bookedCount / room.totalInventory) * 100 < 80 ? "bg-amber-500" : "bg-rose-500"}`}
                        style={{ width: `${room.totalInventory > 0 ? Math.min(100, (bookedCount / room.totalInventory) * 100) : 0}%` }}
                    />
                </div>
            </div>
            <button onClick={onEdit} className="w-full py-2.5 mt-2 bg-slate-900 hover:bg-slate-800 text-slate-500 hover:text-indigo-400 transition-all rounded-xl text-[10px] font-black uppercase tracking-widest border border-slate-800/50 shadow-md">
                Edit Room Details
            </button>
        </div>
    );
}

export function AddOfflineBtn({ hotelId, rooms, users, onDone }: { hotelId: string; rooms: any[]; users: any[]; onDone: () => void }) {
    const [open, setOpen] = useState(false);
    const [roomId, setRoomId] = useState(rooms[0]?.id ?? "");
    const [nights, setNights] = useState(1);
    const [guestName, setGuestName] = useState("");
    const [linkedUserId, setLinkedUserId] = useState<string>("");

    const submit = async () => {
        if (!roomId) return;
        await api.addOfflineBooking({ hotelId, roomId, nights, guestName, userId: linkedUserId || undefined });
        setOpen(false); setGuestName(""); setNights(1); setLinkedUserId("");
        onDone();
    };

    const selectedRoom = rooms.find(r => r.id === roomId);
    const total = (selectedRoom?.pricePerNight ?? 0) * nights;

    return (
        <>
            <button
                onClick={() => setOpen(true)}
                className="bg-indigo-600 hover:bg-indigo-500 text-white flex items-center gap-2 md:gap-3 px-4 sm:px-6 md:px-8 py-3 md:py-4 rounded-xl sm:rounded-2xl md:rounded-3xl text-[10px] sm:text-xs font-black uppercase tracking-[0.1em] md:tracking-[0.2em] transition-all shadow-xl shadow-indigo-600/20 active:scale-95 shrink-0"
            >
                <Plus className="w-4 h-4 md:w-5 md:h-5" />
                <span className="hidden sm:inline">Log Walk-in</span>
                <span className="sm:hidden">Add</span>
            </button>

            {open && typeof document !== "undefined" && createPortal(
                <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md z-[200] flex items-center justify-center p-4 animate-in fade-in duration-300">
                    <div className="bg-slate-900 border border-slate-800 rounded-[40px] w-full max-w-md shadow-2xl overflow-hidden flex flex-col animate-in zoom-in-95 duration-300">
                        <div className="p-8 border-b border-slate-800 flex justify-between items-center bg-slate-900/50">
                            <div>
                                <h3 className="font-black text-2xl text-white uppercase tracking-tight">Register Walk-in</h3>
                                <p className="text-slate-500 text-[10px] font-black uppercase tracking-widest mt-1 italic">Manually log a direct booking</p>
                            </div>
                            <button onClick={() => setOpen(false)} className="p-3 bg-slate-800 hover:bg-slate-700 rounded-2xl transition text-slate-400 hover:text-white">
                                <X className="w-6 h-6" />
                            </button>
                        </div>
                        <div className="p-10 space-y-8 bg-slate-900/30">
                            <div className="space-y-6">
                                <div>
                                    <label className="block text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] mb-3 ml-1">Guest Identification</label>
                                    <input
                                        className="w-full bg-slate-950/50 border border-slate-800 rounded-2xl px-6 py-4 text-sm font-medium text-white placeholder:text-slate-700 focus:ring-2 focus:ring-indigo-500 outline-none transition shadow-inner"
                                        placeholder="Guest Full Name"
                                        value={guestName}
                                        onChange={e => setGuestName(e.target.value)}
                                    />
                                </div>
                                <div>
                                    <label className="block text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] mb-3 ml-1">Link to System User (Optional)</label>
                                    <select
                                        className="w-full bg-slate-950/50 border border-slate-800 rounded-2xl px-6 py-4 text-sm font-medium text-white focus:ring-2 focus:ring-indigo-500 outline-none transition cursor-pointer"
                                        value={linkedUserId}
                                        onChange={e => setLinkedUserId(e.target.value)}
                                    >
                                        <option value="" className="bg-slate-900">-- Anonymous / Direct --</option>
                                        {users.map(u => <option key={u.userId} value={u.userId} className="bg-slate-900">{u.name} (ID: {u.userId.slice(-4)})</option>)}
                                    </select>
                                </div>
                                <div className="grid grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] mb-3 ml-1">Assigned Room</label>
                                        <select
                                            className="w-full bg-slate-950/50 border border-slate-800 rounded-2xl px-6 py-4 text-sm font-medium text-white focus:ring-2 focus:ring-indigo-500 outline-none transition cursor-pointer"
                                            value={roomId}
                                            onChange={e => setRoomId(e.target.value)}
                                        >
                                            {rooms.map(r => <option key={r.id} value={r.id} className="bg-slate-900">{r.type} (Floor {r.floorNumber})</option>)}
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] mb-3 ml-1">Duration (Nights)</label>
                                        <input
                                            type="number" min={1} max={30}
                                            className="w-full bg-slate-950/50 border border-slate-800 rounded-2xl px-6 py-4 text-sm font-black text-white focus:ring-2 focus:ring-indigo-500 outline-none transition"
                                            value={nights}
                                            onChange={e => setNights(+e.target.value)}
                                        />
                                    </div>
                                </div>
                                <div className="bg-indigo-600/10 rounded-3xl p-6 flex justify-between items-center border border-indigo-500/20 shadow-xl">
                                    <div>
                                        <p className="text-[10px] font-black text-indigo-400 uppercase tracking-widest mb-1">Total Price</p>
                                        <p className="text-[9px] text-slate-500 font-bold uppercase">Based on nights selected</p>
                                    </div>
                                    <span className="text-3xl font-black text-indigo-400 tabular-nums leading-none">৳{total.toLocaleString()}</span>
                                </div>
                            </div>
                        </div>
                        <div className="p-6 border-t border-slate-800 bg-slate-950/50 flex gap-4">
                            <button
                                onClick={() => setOpen(false)}
                                className="flex-1 bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white py-4 rounded-2xl text-[9px] font-black uppercase tracking-widest transition-all active:scale-95 border border-slate-700"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={submit}
                                className="flex-1 bg-indigo-600 hover:bg-indigo-500 text-white py-4 rounded-2xl text-[9px] font-black uppercase tracking-widest transition-all shadow-xl shadow-indigo-600/20 active:scale-95 flex items-center justify-center gap-2"
                            >
                                <CheckCircle2 className="w-4 h-4" /> Log Entry
                            </button>
                        </div>
                    </div>
                </div>,
                document.body
            )}
        </>
    );
}
