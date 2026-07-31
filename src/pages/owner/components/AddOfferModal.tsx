import React, { useState } from "react";
import { X, Loader2, CheckCircle2 } from "lucide-react";
import { api } from "../../../services/api";

export function AddOfferModal({ hotel, onClose, onDone }: { hotel: any; onClose: () => void; onDone: () => void }) {
    const [loading, setLoading] = useState(false);
    const [title, setTitle] = useState("");
    const [discountPercent, setDiscountPercent] = useState(10);
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");

    const submit = async () => {
        if (!title || !startDate) return;
        setLoading(true);
        try {
            await api.createOffer({
                hotelId: hotel.id,
                hotelName: hotel.name,
                title,
                discountPercent,
                startDate,
                endDate,
                isActive: true
            });
            onDone();
        } catch (e: any) { alert("Failed: " + e.message); }
        setLoading(false);
    };

    return (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md z-[150] flex items-center justify-center p-6">
            <div className="bg-slate-900 border border-slate-800 rounded-[40px] w-full max-w-md shadow-2xl overflow-hidden flex flex-col">
                <div className="p-8 border-b border-slate-800 flex justify-between items-center bg-slate-900/50">
                    <div>
                        <h3 className="font-black text-2xl text-white uppercase tracking-tight">Create Limited Offer</h3>
                        <p className="text-slate-500 text-[10px] font-black uppercase tracking-widest mt-1 italic">Broadcast a discount to all visitors</p>
                    </div>
                    <button onClick={onClose} className="p-3 bg-slate-800 hover:bg-slate-700 rounded-2xl transition text-slate-400 hover:text-white">
                        <X className="w-6 h-6" />
                    </button>
                </div>

                <div className="p-10 space-y-8 bg-slate-900/30 overflow-y-auto">
                    <div className="space-y-6">
                        <div>
                            <label className="block text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] mb-3 ml-1">Offer Title</label>
                            <input
                                className="w-full bg-slate-950/50 border border-slate-800 rounded-2xl px-6 py-4 text-sm font-black text-white placeholder:text-slate-700 focus:ring-2 focus:ring-indigo-500 outline-none transition uppercase tracking-tight"
                                placeholder="e.g. Eid Mega Sale"
                                value={title}
                                onChange={e => setTitle(e.target.value)}
                            />
                        </div>
                        <div>
                            <label className="block text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] mb-3 ml-1">Discount Percentage (%)</label>
                            <div className="flex items-center gap-6">
                                <input
                                    type="range" min={5} max={70} step={5}
                                    className="flex-1 accent-indigo-500"
                                    value={discountPercent}
                                    onChange={e => setDiscountPercent(+e.target.value)}
                                />
                                <span className="text-2xl font-black text-white w-16 text-right tabular-nums">{discountPercent}%</span>
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-6">
                            <div>
                                <label className="block text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] mb-3 ml-1">Start Date</label>
                                <input
                                    type="date"
                                    className="w-full bg-slate-950/50 border border-slate-800 rounded-2xl px-6 py-4 text-sm font-black text-white focus:ring-2 focus:ring-indigo-500 outline-none transition"
                                    value={startDate}
                                    onChange={e => setStartDate(e.target.value)}
                                />
                            </div>
                            <div>
                                <label className="block text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] mb-3 ml-1">End Date (Optional)</label>
                                <input
                                    type="date"
                                    className="w-full bg-slate-950/50 border border-slate-800 rounded-2xl px-6 py-4 text-sm font-black text-white focus:ring-2 focus:ring-indigo-500 outline-none transition"
                                    value={endDate}
                                    onChange={e => setEndDate(e.target.value)}
                                />
                            </div>
                        </div>

                        <div className="bg-indigo-600/10 rounded-3xl p-6 border border-indigo-500/20">
                            <p className="text-[10px] font-black text-indigo-400 uppercase tracking-widest mb-1">Target</p>
                            <p className="text-slate-300 text-xs font-black uppercase tracking-tight">{hotel.name}</p>
                        </div>
                    </div>
                </div>

                <div className="p-8 border-t border-slate-800 bg-slate-950/50 flex gap-6 sticky bottom-0">
                    <button onClick={onClose} className="flex-1 bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white py-5 rounded-[22px] text-[10px] font-black uppercase tracking-widest transition-all active:scale-95 border border-slate-700">
                        Cancel
                    </button>
                    <button
                        disabled={loading}
                        onClick={submit}
                        className="flex-1 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-60 text-white py-5 rounded-[22px] text-[10px] font-black uppercase tracking-widest transition-all shadow-xl shadow-indigo-600/20 active:scale-95 flex items-center justify-center gap-3"
                    >
                        {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle2 className="w-4 h-4" />} Create
                    </button>
                </div>
            </div>
        </div>
    );
}
