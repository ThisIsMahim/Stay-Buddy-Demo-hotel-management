import React from "react";
import { Loader2 } from "lucide-react";

export function Loading() {
    return (
        <div className="flex items-center justify-center min-h-screen bg-slate-950">
            <Loader2 className="w-8 h-8 animate-spin text-indigo-500" />
        </div>
    );
}

export function StatCard({ label, value, color, icon, subLabel, alert }: {
    label: string;
    value: string | number;
    color: string;
    icon: React.ReactNode;
    subLabel?: string;
    alert?: boolean
}) {
    const colors: Record<string, string> = {
        indigo: "bg-gradient-to-br from-indigo-600/20 to-indigo-950/40 border-indigo-500/20",
        purple: "bg-gradient-to-br from-purple-600/20 to-purple-950/40 border-purple-500/20",
        emerald: "bg-gradient-to-br from-emerald-600/20 to-emerald-950/40 border-emerald-500/20",
        amber: "bg-gradient-to-br from-amber-600/20 to-amber-950/40 border-amber-500/20",
        blue: "bg-gradient-to-br from-blue-600/20 to-blue-950/40 border-blue-500/20",
        green: "bg-gradient-to-br from-emerald-600/20 to-emerald-950/40 border-emerald-500/20",
        red: "bg-gradient-to-br from-rose-600/20 to-rose-950/40 border-rose-500/20",
        slate: "bg-gradient-to-br from-slate-600/20 to-slate-950/40 border-slate-500/20",
    };

    return (
        <div className={`relative group bg-slate-900/60 backdrop-blur-xl rounded-2xl p-6 border ${colors[color] ?? colors.slate} transition-all duration-300 hover:scale-[1.02] shadow-2xl`}>
            <div className="flex justify-between items-start mb-4">
                <div className="w-12 h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-white/80 group-hover:rotate-6 transition-transform">
                    {icon}
                </div>
                <div className="text-right">
                    <p className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] mb-1">{label}</p>
                    <h4 className="text-4xl font-black text-white tracking-tight leading-none">{value}</h4>
                </div>
            </div>

            {subLabel && (
                <div className="flex items-center gap-2 pt-3 border-t border-white/5">
                    <div className={`w-1.5 h-1.5 rounded-full ${color === 'red' ? 'bg-rose-500' : 'bg-emerald-500'} shadow-[0_0_8px_rgba(16,185,129,0.5)]`} />
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">{subLabel}</p>
                </div>
            )}
        </div>
    );
}

export function Badge({ children, color }: { children: React.ReactNode; color: string }) {
    const colors: Record<string, string> = {
        green: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20 shadow-[0_0_12px_rgba(16,185,129,0.15)]",
        red: "bg-rose-500/10 text-rose-400 border-rose-500/20 shadow-[0_0_12px_rgba(244,63,94,0.15)]",
        amber: "bg-amber-500/10 text-amber-400 border-amber-500/20 shadow-[0_0_12px_rgba(245,158,11,0.15)]",
        blue: "bg-indigo-500/10 text-indigo-400 border-indigo-500/20 shadow-[0_0_12px_rgba(99,102,241,0.15)]",
        purple: "bg-purple-500/10 text-purple-400 border-purple-500/20 shadow-[0_0_12px_rgba(168,85,247,0.15)]",
        slate: "bg-slate-500/10 text-slate-400 border-slate-500/20 shadow-[0_0_12px_rgba(100,116,139,0.15)]",
    };
    return <span className={`text-xs px-3 py-1.5 rounded-lg border font-black uppercase tracking-widest transition-all ${colors[color] ?? colors.slate}`}>{children}</span>;
}

export function ActionBtn({ onClick, color, icon, label }: { onClick: () => void; color: string; icon: React.ReactNode; label: string }) {
    const colors: Record<string, string> = {
        green: "bg-emerald-600 hover:bg-emerald-500 shadow-emerald-500/20",
        red: "bg-rose-600 hover:bg-rose-500 shadow-rose-500/20",
        amber: "bg-amber-600 hover:bg-amber-500 shadow-amber-500/20",
        slate: "bg-slate-700 hover:bg-slate-600 shadow-slate-900/20",
    };
    return (
        <button onClick={onClick} className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-white text-[10px] font-black uppercase tracking-widest transition-all shadow-lg hover:-translate-y-0.5 active:translate-y-0 ${colors[color] ?? colors.slate}`}>
            {icon} {label}
        </button>
    );
}
