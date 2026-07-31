import React from "react";
import { Ticket, LogIn, LogOut, Ban, Info, Sparkles } from "lucide-react";
import { api, Booking } from "../../../services/api";
import { Badge, ActionBtn } from "../components/AdminUIElements";

interface BookingsPanelProps {
    bookings: Booking[];
    reload: () => void;
}

export default function BookingsPanel({ bookings, reload }: BookingsPanelProps) {
    return (
        <div className="space-y-6">
            <div className="bg-indigo-600/10 border border-indigo-500/20 p-4 rounded-2xl flex items-center gap-4">
                <div className="bg-indigo-600 p-2 rounded-xl">
                    <Ticket className="w-5 h-5 text-white" />
                </div>
                <p className="text-slate-400 text-xs font-bold uppercase tracking-wider">
                    Full command over global reservations. Execute front-desk check-in/out protocols.
                </p>
            </div>
            <div className="bg-slate-900/40 backdrop-blur-xl rounded-[32px] border border-slate-800 overflow-hidden shadow-2xl">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm min-w-[850px]">
                        <thead className="bg-slate-950/30 text-slate-500 uppercase text-[10px] font-black tracking-[0.2em]">
                            <tr>
                                <th className="py-5 px-6 text-left">Internal Registry</th>
                                <th className="py-5 px-6 text-left">Guest / Customer</th>
                                <th className="py-5 px-6 text-left">Target Asset</th>
                                <th className="py-5 px-6 text-center">Entry/Exit</th>
                                <th className="py-5 px-6 text-center">Status</th>
                                <th className="py-5 px-6 text-right">Yield</th>
                                <th className="py-5 px-6 text-right">Oversight</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-800/50">
                            {bookings.map(b => (
                                <tr key={b.id} className="group hover:bg-slate-800/30 transition-colors">
                                    <td className="py-3 px-6">
                                        <p className="font-mono text-[9px] text-indigo-400 font-black tracking-widest uppercase">{b.id}</p>
                                        <Badge color={b.type === "ONLINE" ? "blue" : "amber"}>{b.type}</Badge>
                                        <p className="text-[8px] text-slate-500 font-bold uppercase mt-1">{b.paymentMethod || "CASH"}</p>
                                    </td>
                                    <td className="py-3 px-6">
                                        <p className="text-white font-black text-[12px] uppercase leading-none mb-1">{b.guestName || "ANONYMOUS"}</p>
                                        <p className="text-[9px] text-slate-500 font-bold uppercase tracking-tight">{b.guestEmail || "NO EMAIL"}</p>
                                        {b.guestPhone && <p className="text-[9px] text-indigo-400 font-bold mt-0.5">{b.guestPhone}</p>}
                                    </td>
                                    <td className="py-3 px-6">
                                        <p className="text-white font-black text-xs uppercase tracking-tight">{b.hotelName}</p>
                                        <p className="text-[9px] text-slate-500 font-bold uppercase tracking-widest">{b.roomType}</p>
                                    </td>
                                    <td className="py-3 px-6 text-center">
                                        <div className="flex flex-col items-center">
                                            <p className="text-white font-bold text-[11px]">{b.checkIn}</p>
                                            <div className="w-px h-2 bg-slate-800 my-0.5" />
                                            <p className="text-slate-500 font-bold text-[11px]">{b.checkOut}</p>
                                        </div>
                                    </td>
                                    <td className="py-3 px-6 text-center">
                                        <Badge color={b.status === "CONFIRMED" ? "green" : b.status === "PENDING" ? "amber" : "red"}>{b.status}</Badge>
                                    </td>
                                    <td className="py-3 px-6 text-right text-emerald-400 font-black text-base">৳{(b.totalPrice || 0).toLocaleString()}</td>
                                    <td className="py-3 px-6">
                                        <div className="flex justify-end gap-2">
                                            {b.status === "CONFIRMED" && (
                                                <>
                                                    <ActionBtn icon={<LogIn className="w-3.5 h-3.5" />} label="Arrival" color="green" onClick={async () => { await api.processCheckIn(b.id); reload(); }} />
                                                    <ActionBtn icon={<LogOut className="w-3.5 h-3.5" />} label="Departure" color="slate" onClick={async () => { await api.processCheckOut(b.id); reload(); }} />
                                                </>
                                            )}
                                            {b.status === "CONFIRMED" && (
                                                <button onClick={async () => { await api.cancelBooking(b.id); reload(); }} className="p-3 rounded-2xl bg-rose-900/20 text-rose-500 border border-rose-500/20 hover:bg-rose-600 hover:text-white transition-all shadow-xl">
                                                    <Ban className="w-4 h-4" />
                                                </button>
                                            )}
                                            {b.specialRequests && (
                                                <button onClick={() => alert(`Special Requests: ${b.specialRequests}`)} className="p-3 rounded-2xl bg-amber-900/20 text-amber-500 border border-amber-500/20 hover:bg-amber-600 hover:text-white transition-all shadow-xl">
                                                    <Sparkles className="w-4 h-4" />
                                                </button>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            ))}
                            {bookings.length === 0 && (
                                <tr>
                                    <td colSpan={6} className="py-20 text-center">
                                        <Ticket className="w-12 h-12 text-slate-800 mx-auto mb-4" />
                                        <p className="text-slate-500 font-bold uppercase tracking-[0.2em] text-[10px]">No Global Reservations</p>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
