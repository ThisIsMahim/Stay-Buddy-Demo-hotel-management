import React from 'react';
import { Badge } from './Shared';
import { Booking } from '../../../services/api';

export function BookingTableFull({ bookings }: { bookings: Booking[] }) {
    return (
        <div className="overflow-x-auto custom-scrollbar">
            <table className="w-full text-left border-separate border-spacing-y-3">
                <thead>
                    <tr className="text-[10px] font-black text-slate-500 uppercase tracking-widest">
                        <th className="px-6 py-4">Guest</th>
                        <th className="px-6 py-4">Room Type</th>
                        <th className="px-6 py-4">Dates</th>
                        <th className="px-6 py-4">Status</th>
                        <th className="px-6 py-4 text-right">Revenue</th>
                    </tr>
                </thead>
                <tbody>
                    {bookings.map(book => (
                        <tr key={book.id} className="bg-slate-900/40 hover:bg-slate-800/50 transition-colors group">
                            <td className="px-6 py-5 rounded-l-[24px] border-y border-l border-slate-800/50 group-hover:border-indigo-500/20">
                                <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500/20 to-purple-500/20 border border-indigo-500/20 flex items-center justify-center font-black text-indigo-400">
                                        {book.guestName?.[0] || 'G'}
                                    </div>
                                    <div>
                                        <p className="text-sm font-black text-white uppercase tracking-tight">{book.guestName || "Direct Guest"}</p>
                                        <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">{book.type}</p>
                                    </div>
                                </div>
                            </td>
                            <td className="px-6 py-5 border-y border-slate-800/50 group-hover:border-indigo-500/20">
                                <p className="text-xs font-black text-slate-300 uppercase tracking-widest">{book.roomType}</p>
                            </td>
                            <td className="px-6 py-5 border-y border-slate-800/50 group-hover:border-indigo-500/20">
                                <p className="text-xs font-black text-white">{new Date(book.checkIn).toLocaleDateString()} — {new Date(book.checkOut).toLocaleDateString()}</p>
                            </td>
                            <td className="px-6 py-5 border-y border-slate-800/50 group-hover:border-indigo-500/20">
                                <Badge color={book.status === 'CONFIRMED' ? 'emerald' : book.status === 'CANCELLED' ? 'rose' : 'amber'}>
                                    {book.status}
                                </Badge>
                            </td>
                            <td className="px-6 py-5 rounded-r-[24px] border-y border-r border-slate-800/50 group-hover:border-indigo-500/20 text-right">
                                <p className="text-sm font-black text-emerald-400 uppercase tracking-tight">৳{book.totalPrice.toLocaleString()}</p>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
