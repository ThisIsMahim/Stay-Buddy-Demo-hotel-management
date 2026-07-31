import React from "react";
import { TrendingUp, Plus, Calendar, Coins, History, Ban, CheckCircle2 } from "lucide-react";
import { api } from "../../../services/api";
import { Badge } from "../components/OwnerUI";

interface PricingPanelProps {
    hotel: any;
    rooms: any[];
    pricingRules: any[];
    offers: any[];
    setShowAddPricing: (show: boolean) => void;
    setShowAddOffer: (show: boolean) => void;
    reload: () => void;
}

const PricingPanel = ({
    hotel,
    rooms,
    pricingRules,
    offers,
    setShowAddPricing,
    setShowAddOffer,
    reload
}: PricingPanelProps) => {
    return (
        <div className="space-y-12 animate-in fade-in slide-in-from-bottom-5 duration-700">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-slate-900/40 backdrop-blur-md p-6 md:p-8 rounded-[24px] border border-slate-800 shadow-2xl">
                <div>
                    <h2 className="text-2xl font-black text-white tracking-tight uppercase flex items-center gap-4">
                        <TrendingUp className="w-6 h-6 text-indigo-500" /> Revenue Management
                    </h2>
                    <p className="text-slate-500 text-[11px] font-black uppercase tracking-[0.2em] mt-1.5 italic">Configure seasonal pricing and special multipliers</p>
                </div>
                <button onClick={() => setShowAddPricing(true)} className="bg-indigo-600 hover:bg-indigo-500 text-white flex items-center gap-3 px-6 py-3 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] transition-all shadow-xl shadow-indigo-600/20 active:scale-95">
                    <Plus className="w-4 h-4" /> New Pricing Rule
                </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="bg-slate-900/40 backdrop-blur-md rounded-[32px] border border-slate-800 overflow-hidden shadow-2xl">
                    <div className="px-8 py-6 border-b border-slate-800 bg-slate-900/20">
                        <h3 className="text-sm font-black text-white uppercase tracking-widest flex items-center gap-2">
                            <Calendar className="w-4 h-4 text-indigo-400" /> Active Rate Modifiers
                        </h3>
                    </div>
                    <div className="divide-y divide-slate-800/50">
                        {pricingRules.filter(r => r.isActive).length === 0 ? (
                            <div className="p-16 text-center">
                                <div className="w-16 h-16 bg-slate-800/50 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-slate-700">
                                    <Coins className="w-8 h-8 opacity-20" />
                                </div>
                                <p className="text-[10px] font-black uppercase tracking-widest text-slate-500">No active modifiers</p>
                            </div>
                        ) : (
                            pricingRules.filter(r => r.isActive).map(rule => (
                                <div key={rule.id} className="p-6 hover:bg-white/[0.01] transition-all group flex items-center justify-between">
                                    <div className="flex items-center gap-4">
                                        <div className={`w-12 h-12 rounded-xl border flex flex-col items-center justify-center font-black ${rule.multiplier > 1 ? "bg-rose-500/10 border-rose-500/30 text-rose-400" : "bg-emerald-500/10 border-emerald-500/30 text-emerald-400"}`}>
                                            <span className="text-lg leading-none">{rule.multiplier}x</span>
                                        </div>
                                        <div>
                                            <p className="font-black text-white text-sm uppercase tracking-tight">{rule.label}</p>
                                            <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mt-1">
                                                {new Date(rule.startDate).toLocaleDateString()} → {new Date(rule.endDate).toLocaleDateString()}
                                            </p>
                                        </div>
                                    </div>
                                    <button onClick={() => api.togglePricingRule(rule.id).then(reload)} className="p-3 bg-slate-800/50 hover:bg-rose-500/20 rounded-xl transition text-slate-500 hover:text-rose-400 border border-slate-700/50">
                                        <Ban className="w-4 h-4" />
                                    </button>
                                </div>
                            ))
                        )}
                    </div>
                </div>

                <div className="bg-slate-900/40 backdrop-blur-md rounded-[32px] border border-slate-800 overflow-hidden shadow-2xl">
                    <div className="px-8 py-6 border-b border-slate-800 bg-slate-900/20">
                        <h3 className="text-sm font-black text-white uppercase tracking-widest flex items-center gap-2">
                            <History className="w-4 h-4 text-slate-500" /> Rule History
                        </h3>
                    </div>
                    <div className="divide-y divide-slate-800/50">
                        {pricingRules.filter(r => !r.isActive).length === 0 ? (
                            <div className="p-16 text-center text-slate-600 font-black uppercase tracking-widest text-[9px]">Empty history</div>
                        ) : (
                            pricingRules.filter(r => !r.isActive).map(rule => (
                                <div key={rule.id} className="p-6 opacity-40 grayscale hover:opacity-100 hover:grayscale-0 transition-all flex items-center justify-between">
                                    <div>
                                        <p className="font-black text-white text-xs uppercase tracking-tight">{rule.label}</p>
                                        <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mt-1">{rule.multiplier}x multiplier</p>
                                    </div>
                                    <button onClick={() => api.togglePricingRule(rule.id).then(reload)} className="p-3 hover:bg-emerald-500/20 rounded-xl transition text-slate-600 hover:text-emerald-400">
                                        <CheckCircle2 className="w-4 h-4" />
                                    </button>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </div>
            <div className="flex justify-between items-center bg-slate-900/40 backdrop-blur-md p-6 rounded-[24px] border border-slate-800 shadow-2xl">
                <div>
                    <h2 className="text-2xl font-black text-white tracking-tight uppercase">Discount Offers</h2>
                    <p className="text-slate-500 text-[11px] font-black uppercase tracking-widest mt-1.5 italic">Broadcast time-limited promotions to guests</p>
                </div>
                <button onClick={() => setShowAddOffer(true)} className="bg-indigo-600 hover:bg-indigo-500 text-white flex items-center gap-4 px-8 py-4 rounded-3xl text-sm font-black uppercase tracking-[0.2em] transition-all shadow-xl shadow-indigo-600/20 active:scale-95">
                    <Plus className="w-5 h-5" /> Add Offer
                </button>
            </div>

            <div className="bg-slate-900/40 backdrop-blur-md rounded-[28px] border border-slate-800 overflow-hidden shadow-2xl">
                {offers.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-10 text-center text-slate-500 font-black text-[11px] uppercase tracking-widest">No offers configured</div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="bg-slate-900/50 border-b border-slate-800">
                                <tr>
                                    <th className="p-6 text-xs font-black text-slate-500 uppercase tracking-widest">Offer Title</th>
                                    <th className="p-6 text-xs font-black text-slate-500 uppercase tracking-widest text-center">Discount</th>
                                    <th className="p-6 text-xs font-black text-slate-500 uppercase tracking-widest text-center">Status</th>
                                    <th className="p-6 text-xs font-black text-slate-500 uppercase tracking-widest text-center">Action</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-800/30">
                                {offers.map(o => (
                                    <tr key={o.id} className="hover:bg-white/[0.02] transition-all">
                                        <td className="p-6 font-black text-white text-sm uppercase tracking-tight">{o.title}</td>
                                        <td className="p-6 text-center">
                                            <span className="bg-indigo-500/10 text-indigo-400 px-4 py-1.5 rounded-xl text-xs font-black">{o.discountPercent}% OFF</span>
                                        </td>
                                        <td className="p-6 text-center">
                                            <Badge color={o.isActive ? "green" : "amber"}>{o.isActive ? "ACTIVE" : "INACTIVE"}</Badge>
                                        </td>
                                        <td className="p-6 text-center">
                                            <button onClick={() => api.deleteOffer(o.id).then(reload)} className="p-2.5 rounded-xl bg-rose-500/10 text-rose-500 border border-rose-500/20 hover:bg-rose-500 hover:text-white transition-all">
                                                <Ban className="w-4 h-4" />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
};

export default PricingPanel;
