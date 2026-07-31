import React from "react";
import { ShieldAlert, AlertCircle } from "lucide-react";
import { api, Complaint } from "../../../services/api";
import { Badge } from "../components/AdminUIElements";

interface ComplaintsPanelProps {
    complaints: Complaint[];
    reload: () => void;
}

export default function ComplaintsPanel({ complaints, reload }: ComplaintsPanelProps) {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {complaints.length === 0 && (
                <div className="col-span-full py-40 text-center">
                    <ShieldAlert className="w-16 h-16 text-slate-800 mx-auto mb-6" />
                    <p className="text-slate-500 font-black uppercase tracking-[0.3em] text-xs">No Integrity Violations Detected</p>
                </div>
            )}
            {complaints.map(c => (
                <div key={c.id} className="bg-slate-900/60 backdrop-blur-xl border border-rose-500/20 rounded-[32px] p-8 shadow-2xl relative overflow-hidden group flex flex-col justify-between">
                    <div className="absolute top-0 right-0 p-6 flex gap-2">
                        <Badge color={c.status === "Pending" ? "amber" : c.status === "In Progress" ? "blue" : "green"}>{c.status}</Badge>
                    </div>
                    <div>
                        <div className="flex gap-5 items-start mb-6">
                            <div className="w-12 h-12 rounded-2xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-500 shrink-0">
                                <AlertCircle className="w-6 h-6" />
                            </div>
                            <div>
                                <h4 className="text-white font-black text-lg uppercase tracking-tight">{c.userName}</h4>
                                <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mt-0.5">Hotel: {c.hotelName} (ID: {c.hotelId})</p>
                                <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">{new Date(c.createdAt).toLocaleDateString()}</p>
                            </div>
                        </div>
                        <p className="text-slate-300 text-sm leading-relaxed font-medium mb-4">"{c.description}"</p>

                        {c.imageUrl && (
                            <div className="mb-4 rounded-xl overflow-hidden border border-slate-800">
                                <img src={c.imageUrl} alt="Complaint Evidence" className="w-full h-40 object-cover" />
                            </div>
                        )}
                    </div>

                    <div className="mt-4 pt-6 border-t border-slate-800 flex justify-end gap-2">
                        {c.status !== "Resolved" && (
                            <>
                                <button
                                    onClick={async () => { await api.updateComplaintStatus(c.id, "In Progress"); reload(); }}
                                    className="px-4 py-2 rounded-xl bg-indigo-600 text-white text-[10px] font-black uppercase tracking-widest hover:bg-indigo-500 transition-colors"
                                >
                                    Investigate
                                </button>
                                <button
                                    onClick={async () => { await api.updateComplaintStatus(c.id, "Resolved"); reload(); }}
                                    className="px-4 py-2 rounded-xl bg-emerald-600 text-white text-[10px] font-black uppercase tracking-widest hover:bg-emerald-500 transition-colors"
                                >
                                    Resolve
                                </button>
                            </>
                        )}
                    </div>
                </div>
            ))}
        </div>
    );
}
