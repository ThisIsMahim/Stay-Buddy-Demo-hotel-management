import React from "react";
import { Star, Plus, Globe, Clock, MapPin, Trash2, CheckCircle2, Ban } from "lucide-react";
import { api } from "../../../services/api";

interface ExperiencesPanelProps {
    hotel: any;
    experiences: any[];
    setShowAddExp: (show: boolean) => void;
    reload: () => void;
}

const ExperiencesPanel = ({
    hotel,
    experiences,
    setShowAddExp,
    reload
}: ExperiencesPanelProps) => {
    return (
        <div className="space-y-12 animate-in fade-in slide-in-from-bottom-5 duration-700">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-slate-900/40 backdrop-blur-md p-6 md:p-8 rounded-[24px] border border-slate-800 shadow-2xl">
                <div>
                    <h2 className="text-2xl font-black text-white tracking-tight uppercase flex items-center gap-4">
                        <Star className="w-6 h-6 text-amber-500" /> Experiences & Tours
                    </h2>
                    <p className="text-slate-500 text-[11px] font-black uppercase tracking-[0.2em] mt-1.5 italic">Manage additional services and local attractions</p>
                </div>
                <button onClick={() => setShowAddExp(true)} className="bg-indigo-600 hover:bg-indigo-500 text-white flex items-center gap-3 px-6 py-3 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] transition-all shadow-xl shadow-indigo-600/20 active:scale-95">
                    <Plus className="w-4 h-4" /> Publish New
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {experiences.map(exp => (
                    <div key={exp._id} className="bg-slate-900/40 backdrop-blur-md rounded-[32px] border border-slate-800 overflow-hidden shadow-2xl flex flex-col group hover:border-indigo-500/50 transition-all duration-300">
                        <div className="relative h-48 overflow-hidden">
                            <img src={exp.image} alt={exp.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 to-transparent" />
                            <div className="absolute top-4 left-4 flex gap-2">
                                <span className={`px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest ${exp.category === "original" ? "bg-indigo-600 text-white shadow-lg shadow-indigo-600/20" : "bg-emerald-600/20 text-emerald-400 border border-emerald-500/30 backdrop-blur-md"}`}>{exp.badge}</span>
                                {!exp.isActive && <span className="px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest bg-rose-500/20 text-rose-400 border border-rose-500/30 backdrop-blur-md">Draft</span>}
                            </div>
                            <div className="absolute bottom-4 left-6 right-6">
                                <h3 className="text-lg font-black text-white uppercase tracking-tight truncate">{exp.title}</h3>
                                <div className="flex items-center gap-2 mt-1">
                                    <Star className="w-3 h-3 text-amber-500 fill-amber-500" />
                                    <span className="text-[10px] text-white font-black">{exp.rating} <span className="text-slate-500">({exp.reviews})</span></span>
                                </div>
                            </div>
                        </div>
                        <div className="p-6 flex flex-col flex-1">
                            <div className="grid grid-cols-2 gap-4 mb-6">
                                <div className="flex items-center gap-2 text-slate-400">
                                    <Clock className="w-3 h-3" />
                                    <span className="text-[10px] font-bold uppercase tracking-widest">{exp.duration}</span>
                                </div>
                                <div className="flex items-center gap-2 text-slate-400">
                                    <MapPin className="w-3 h-3" />
                                    <span className="text-[10px] font-bold uppercase tracking-widest truncate">{exp.city}</span>
                                </div>
                            </div>
                            <div className="flex items-center justify-between mt-auto pt-6 border-t border-slate-800/50">
                                <div className="flex flex-col">
                                    <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">From</span>
                                    <span className="text-xl font-black text-white tabular-nums">৳{exp.price}</span>
                                </div>
                                <div className="flex gap-2">
                                    <button onClick={() => api.toggleExperience(exp._id).then(reload)} title={exp.isActive ? "Deactivate" : "Activate"} className={`p-2.5 rounded-xl border transition-all ${exp.isActive ? "bg-amber-500/10 text-amber-500 border-amber-500/20 hover:bg-amber-500 hover:text-white" : "bg-emerald-500/10 text-emerald-500 border-emerald-500/20 hover:bg-emerald-500 hover:text-white"}`}>
                                        {exp.isActive ? <Ban className="w-4 h-4" /> : <CheckCircle2 className="w-4 h-4" />}
                                    </button>
                                    <button onClick={() => api.deleteExperience(exp._id).then(reload)} title="Delete Forever" className="p-2.5 rounded-xl bg-rose-500/10 text-rose-500 border border-rose-500/20 hover:bg-rose-500 hover:text-white transition-all shadow-lg active:scale-95">
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
                <button onClick={() => setShowAddExp(true)} className="aspect-[3/4] rounded-[32px] border border-slate-800/60 bg-slate-900/10 flex flex-col items-center justify-center p-8 text-center group hover:border-indigo-500/50 hover:bg-indigo-500/[0.02] transition-all duration-500 relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900/20 to-transparent" />
                    <div className="w-16 h-16 bg-slate-900 rounded-2xl flex items-center justify-center mb-6 border border-slate-800 group-hover:scale-110 group-hover:bg-indigo-600 group-hover:text-white transition-all duration-500 relative z-10 shadow-xl shadow-black/40">
                        <Plus className="w-8 h-8" />
                    </div>
                    <p className="text-white font-black text-sm uppercase tracking-tight mb-2 relative z-10">Create Experience</p>
                    <p className="text-slate-500 text-[10px] font-bold uppercase tracking-widest leading-relaxed relative z-10">Add tours, workshops or services</p>
                </button>
            </div>
        </div>
    );
};

export default ExperiencesPanel;
