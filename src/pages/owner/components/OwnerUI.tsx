import React, { cloneElement } from "react";

export function StatCard({ label, value, subLabel, color, icon }: { label: string; value: string | number; subLabel: string; color: string; icon: React.ReactNode }) {
    const colors: Record<string, { ring: string, bg: string, text: string, icon: string, shadow: string, glow: string }> = {
        indigo: { ring: "border-indigo-500/20", bg: "bg-indigo-500/10", text: "text-white", icon: "text-indigo-300", shadow: "shadow-indigo-500/10", glow: "group-hover:shadow-indigo-500/30" },
        purple: { ring: "border-purple-500/20", bg: "bg-purple-500/10", text: "text-white", icon: "text-purple-300", shadow: "shadow-purple-500/10", glow: "group-hover:shadow-purple-500/30" },
        blue: { ring: "border-blue-500/20", bg: "bg-blue-500/10", text: "text-white", icon: "text-blue-300", shadow: "shadow-blue-500/10", glow: "group-hover:shadow-blue-500/30" },
        amber: { ring: "border-amber-500/20", bg: "bg-amber-500/10", text: "text-white", icon: "text-amber-300", shadow: "shadow-amber-500/10", glow: "group-hover:shadow-amber-500/30" },
        emerald: { ring: "border-emerald-500/20", bg: "bg-emerald-500/10", text: "text-white", icon: "text-emerald-300", shadow: "shadow-emerald-500/10", glow: "group-hover:shadow-emerald-500/30" }
    };
    const c = colors[color] || colors.indigo;

    return (
        <div className={`p-4 rounded-[24px] border ${c.ring} bg-slate-900/30 backdrop-blur-xl hover:translate-y-[-4px] transition-all duration-300 group shadow-md ${c.shadow} ${c.glow} cursor-default overflow-hidden relative`}>
            <div className="absolute top-0 right-0 w-12 h-12 bg-gradient-to-br from-white/5 to-transparent rounded-bl-full pointer-events-none" />
            <div className="flex justify-between items-center mb-3">
                <div className={`p-2 rounded-xl ${c.bg} ${c.icon} group-hover:scale-110 transition-transform shadow-inner`}>
                    {cloneElement(icon as React.ReactElement, { className: "w-5 h-5" })}
                </div>
                <div className="h-1 w-5 bg-slate-800/50 rounded-full group-hover:bg-indigo-500 transition-colors" />
            </div>
            <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1.5">{label}</p>
            <h3 className={`text-lg font-black ${c.text} tracking-tight mb-1 tabular-nums`}>{value}</h3>
            <p className="text-[9px] font-bold text-slate-600 uppercase tracking-widest opacity-80">{subLabel}</p>
        </div>
    );
}

export function Badge({ children, color = "indigo" }: { children: React.ReactNode; color?: string }) {
    const colors: Record<string, string> = {
        green: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
        amber: "bg-amber-500/10 text-amber-400 border-amber-500/20",
        rose: "bg-rose-500/10 text-rose-400 border-rose-500/20",
        indigo: "bg-indigo-500/10 text-indigo-400 border-indigo-500/20",
        blue: "bg-blue-500/10 text-blue-400 border-blue-500/20",
    };
    return (
        <span className={`px-4 py-1.5 rounded-xl text-xs font-black uppercase tracking-widest border ${colors[color] || colors.indigo}`}>
            {children}
        </span>
    );
}
