import React from "react";
import { Users, Mail, Phone, Calendar } from "lucide-react";

interface GuestsPanelProps {
    guestProfiles: any[];
    bookings: any[];
}

const GuestsPanel = ({
    guestProfiles,
    bookings
}: GuestsPanelProps) => {
    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-5 duration-700">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-slate-900/40 backdrop-blur-md p-6 md:p-8 rounded-[24px] border border-slate-800 shadow-2xl">
                <div>
                    <h2 className="text-2xl font-black text-white tracking-tight uppercase flex items-center gap-4">
                        <Users className="w-6 h-6 text-indigo-500" /> Guest Network
                    </h2>
                    <p className="text-slate-500 text-[11px] font-black uppercase tracking-[0.2em] mt-1.5 italic">Detailed profiles of travelers who stayed at your property</p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {guestProfiles.map(gp => {
                    const userBookings = bookings.filter(b => b.userId === gp.userId);
                    const totalSpent = userBookings.reduce((sum, b) => sum + b.totalPrice, 0);
                    return (
                        <div key={gp.userId} className="bg-slate-900/40 backdrop-blur-md rounded-[32px] border border-slate-800 p-8 shadow-2xl hover:border-indigo-500/50 transition-all group">
                            <div className="flex items-center gap-5 mb-8">
                                <div className="w-16 h-16 rounded-[20px] bg-gradient-to-tr from-indigo-600 to-purple-600 flex items-center justify-center font-black text-xl text-white shadow-xl shadow-indigo-600/20 group-hover:scale-110 transition-transform">
                                    {gp.name.charAt(0)}
                                </div>
                                <div>
                                    <h3 className="text-lg font-black text-white uppercase tracking-tight">{gp.name}</h3>
                                    <p className="text-[10px] text-slate-500 font-bold uppercase tracking-[0.2em] mt-1 italic">Guest since {new Date(gp.updatedAt).getFullYear()}</p>
                                </div>
                            </div>

                            <div className="space-y-3 mb-8">
                                <div className="flex items-center gap-3 text-slate-400 group-hover:text-slate-200 transition-colors">
                                    <Mail className="w-3.5 h-3.5 text-indigo-500" />
                                    <span className="text-xs font-medium lowercase italic">{gp.email}</span>
                                </div>
                                {gp.phone && (
                                    <div className="flex items-center gap-3 text-slate-400 group-hover:text-slate-200 transition-colors">
                                        <Phone className="w-3.5 h-3.5 text-indigo-500" />
                                        <span className="text-xs font-black tabular-nums">{gp.phone}</span>
                                    </div>
                                )}
                            </div>

                            <div className="grid grid-cols-2 gap-3 pt-6 border-t border-slate-800/50">
                                <div className="bg-slate-950/50 p-3 rounded-2xl flex flex-col items-center">
                                    <p className="text-[9px] font-black text-slate-600 uppercase mb-1">Bookings</p>
                                    <span className="text-lg font-black text-indigo-400 tabular-nums">{userBookings.length}</span>
                                </div>
                                <div className="bg-slate-950/50 p-3 rounded-2xl flex flex-col items-center">
                                    <p className="text-[9px] font-black text-slate-600 uppercase mb-1">Lifetime</p>
                                    <span className="text-lg font-black text-emerald-400 tabular-nums">৳{totalSpent.toLocaleString()}</span>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default GuestsPanel;
