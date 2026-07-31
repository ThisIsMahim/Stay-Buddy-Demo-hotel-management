import React from "react";
import { Star, Trash2, Ban } from "lucide-react";
import { api, ExperienceCard, UserProfile, HotelOwner } from "../../../services/api";
import { Badge, ActionBtn } from "../components/AdminUIElements";

interface ExperienceManagementPanelProps {
    experiences: ExperienceCard[];
    userList: (UserProfile | HotelOwner)[];
    reload: () => void;
}

export default function ExperienceManagementPanel({ experiences, userList, reload }: ExperienceManagementPanelProps) {
    const owners = userList.filter(u => u.role === "OWNER") as HotelOwner[];
    const activeExp = experiences.filter(e => e.isActive).length;

    return (
        <div className="space-y-10 relative">
            <div className="grid grid-cols-2 gap-4">
                <div className="bg-slate-900/60 backdrop-blur-xl rounded-2xl p-6 border border-slate-800 shadow-xl relative overflow-hidden group">
                    <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">Total Experiences</p>
                    <p className="text-3xl font-black text-white leading-none">{experiences.length}</p>
                </div>
                <div className="bg-emerald-500/10 backdrop-blur-xl rounded-2xl p-6 border border-emerald-500/20 shadow-xl relative overflow-hidden group">
                    <p className="text-[10px] font-black text-emerald-500 uppercase tracking-widest mb-2">Active Offerings</p>
                    <p className="text-3xl font-black text-white leading-none">{activeExp} <span className="text-sm text-slate-500 font-bold ml-1">/ {experiences.length}</span></p>
                </div>
            </div>

            <div className="bg-slate-900/40 backdrop-blur-xl rounded-[32px] border border-slate-800 overflow-hidden shadow-2xl">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm min-w-[900px]">
                        <thead className="bg-slate-950/30 text-slate-500 uppercase text-[10px] font-black tracking-[0.2em]">
                            <tr>
                                <th className="py-5 px-8 text-left">Experience Asset</th>
                                <th className="py-5 px-8 text-left">Location & Scope</th>
                                <th className="py-5 px-8 text-center">Status</th>
                                <th className="py-5 px-8 text-center">Price</th>
                                <th className="py-5 px-8 text-right">Moderation</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-800/50">
                            {experiences.map(exp => {
                                const ownerName = owners.find(o => o.id === exp.ownerId)?.name || "Unknown Operator";
                                return (
                                    <tr key={exp.id} className="group hover:bg-slate-800/30 transition-colors">
                                        <td className="py-5 px-8">
                                            <div className="flex items-center gap-4">
                                                <div className="w-14 h-10 rounded-xl overflow-hidden bg-slate-800 border border-slate-700">
                                                    <img src={exp.image} alt="" className="w-full h-full object-cover group-hover:scale-110 transition-transform" />
                                                </div>
                                                <div>
                                                    <p className="font-black text-white text-sm uppercase tracking-tight">{exp.title}</p>
                                                    <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Operator: {ownerName} · ⭐ {exp.rating}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="py-5 px-8">
                                            <p className="text-white font-bold text-xs">{exp.city}</p>
                                            <p className="text-[10px] text-slate-500 font-medium font-mono truncate max-w-[150px]">{exp.duration}</p>
                                        </td>
                                        <td className="py-5 px-8 text-center">
                                            <Badge color={exp.isActive ? "green" : "red"}>{exp.isActive ? "Operational" : "Offline"}</Badge>
                                        </td>
                                        <td className="py-5 px-8 text-center font-black text-emerald-400 text-lg">
                                            ৳{exp.price}
                                        </td>
                                        <td className="py-5 px-8">
                                            <div className="flex justify-end gap-3">
                                                <ActionBtn color={exp.isActive ? "slate" : "green"} icon={<Ban className="w-3.5 h-3.5" />} label={exp.isActive ? "Halt" : "Resume"} onClick={async () => { await api.toggleExperienceActive(exp.id); reload(); }} />
                                                <button onClick={async () => { if (confirm("Decommission experience?")) { await api.deleteExperience(exp.id); reload(); } }} className="p-3 rounded-2xl bg-rose-900/20 text-rose-500 border border-rose-500/20 hover:bg-rose-600 hover:text-white transition-all shadow-xl">
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                )
                            })}
                            {experiences.length === 0 && (
                                <tr>
                                    <td colSpan={5} className="py-20 text-center">
                                        <Star className="w-12 h-12 text-slate-800 mx-auto mb-4" />
                                        <p className="text-slate-500 font-bold uppercase tracking-[0.2em] text-[10px]">No Experiences Found</p>
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
