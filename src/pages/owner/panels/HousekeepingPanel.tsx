import React from "react";
import { CheckCircle2, Brush } from "lucide-react";
import { Badge } from "../components/OwnerUI";
import { api } from "../../../services/api";

interface HousekeepingPanelProps {
    housekeeping: any[];
    reload: () => void;
}

const HousekeepingPanel = ({
    housekeeping,
    reload
}: HousekeepingPanelProps) => {
    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-5 duration-700">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-slate-900/40 backdrop-blur-md p-5 rounded-[24px] border border-slate-800 shadow-2xl">
                <div>
                    <h2 className="text-lg font-black text-white tracking-tight uppercase">Housekeeping</h2>
                    <p className="text-slate-500 text-[9px] font-black uppercase tracking-widest mt-0.5 italic">Room cleaning & maintenance tasks</p>
                </div>
                <div className="flex gap-4">
                    <div className="bg-slate-900 px-6 py-3 rounded-2xl border border-slate-800 flex items-center gap-3">
                        <p className="text-[10px] font-black text-slate-500 uppercase">Active Tasks</p>
                        <p className="text-sm font-black text-white">{housekeeping.filter(t => t.status === "CLEANING").length} Tasks</p>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {housekeeping.map(task => (
                    <div key={task.id} className="bg-slate-900/40 backdrop-blur-md p-4 rounded-2xl border border-slate-800 hover:border-indigo-500/30 transition-all group relative overflow-hidden">
                        <div className="flex justify-between items-center mb-3">
                            <div className={`w-8 h-8 rounded-lg flex items-center justify-center border ${task.status === "AVAILABLE" ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-400" : task.status === "CLEANING" ? "bg-amber-500/10 border-amber-500/20 text-amber-400" : "bg-rose-500/10 border-rose-500/20 text-rose-400"}`}>
                                {task.status === "AVAILABLE" ? <CheckCircle2 className="w-4 h-4" /> : <Brush className="w-4 h-4" />}
                            </div>
                            <Badge color={task.status === "AVAILABLE" ? "green" : task.status === "CLEANING" ? "amber" : "rose"}>{task.status}</Badge>
                        </div>
                        <h3 className="text-base font-black text-white uppercase tracking-tight">Floor {task.floorNumber}</h3>
                        <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest mb-3">{task.roomType}</p>

                        <div className="space-y-3 mb-6">
                            <div className="flex justify-between text-[10px] font-black uppercase tracking-widest">
                                <span className="text-slate-600">Cleaning Progress</span>
                                <span className={task.status === "AVAILABLE" ? "text-emerald-400" : "text-amber-400"}>{task.status === "AVAILABLE" ? "Complete" : "In Progress"}</span>
                            </div>
                            <div className="h-1 w-full bg-slate-800 rounded-full overflow-hidden">
                                <div className={`h-full rounded-full ${task.status === "AVAILABLE" ? "bg-emerald-500 w-full" : "bg-amber-500 w-1/2 animate-pulse"}`} />
                            </div>
                        </div>

                        <button
                            onClick={() => api.updateRoomStatus(task.id, task.status === "AVAILABLE" ? "CLEANING" : "AVAILABLE").then(reload)}
                            className="w-full py-2.5 rounded-xl bg-slate-800/50 hover:bg-slate-800 text-white text-[10px] font-black uppercase tracking-widest border border-slate-700/50 transition-all active:scale-95"
                        >
                            Update Status
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default HousekeepingPanel;
