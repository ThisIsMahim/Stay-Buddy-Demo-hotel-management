import React from 'react';
import { Loader2 } from 'lucide-react';

export function StatCard({ title, value, icon: Icon, trend, color = "indigo" }: any) {
    const colors: any = {
        indigo: "from-indigo-500/10 to-purple-500/10 border-indigo-500/20 text-indigo-400",
        emerald: "from-emerald-500/10 to-teal-500/10 border-emerald-500/20 text-emerald-400",
        amber: "from-amber-500/10 to-orange-500/10 border-amber-500/20 text-amber-400",
        rose: "from-rose-500/10 to-pink-500/10 border-rose-500/20 text-rose-400",
    };

    return (
        <div className={`bg-gradient-to-br ${colors[color]} border rounded-[32px] p-8 relative overflow-hidden group hover:-translate-y-1 transition-all duration-500 shadow-lg shadow-${color}-900/5`}>
            <div className="relative z-10">
                <div className="flex justify-between items-start mb-4">
                    <div className="w-12 h-12 rounded-2xl bg-slate-900/50 border border-current/10 flex items-center justify-center">
                        <Icon className="w-6 h-6" />
                    </div>
                    {trend && (
                        <span className="text-[10px] font-black bg-white/10 px-3 py-1.5 rounded-full uppercase tracking-widest backdrop-blur-md">
                            {trend}
                        </span>
                    )}
                </div>
                <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-1 italic">{title}</p>
                <h3 className="text-3xl font-black text-white tracking-tighter uppercase">{value}</h3>
            </div>
            <div className="absolute top-0 right-0 -mr-8 -mt-8 w-32 h-32 bg-current opacity-5 blur-3xl rounded-full" />
        </div>
    );
}

export function Badge({ children, color = "indigo" }: { children: React.ReactNode; color?: string }) {
    const colors: any = {
        indigo: "bg-indigo-500/10 text-indigo-400 border-indigo-500/20",
        blue: "bg-blue-500/10 text-blue-400 border-blue-500/20",
        emerald: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
        green: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
        amber: "bg-amber-500/10 text-amber-400 border-amber-500/20",
        rose: "bg-rose-500/10 text-rose-400 border-rose-500/20",
        slate: "bg-slate-500/10 text-slate-400 border-slate-500/20",
    };

    return (
        <span className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest border ${colors[color] || colors.indigo} shadow-sm`}>
            {children}
        </span>
    );
}

export function Loading() {
    return (
        <div className="flex flex-col items-center justify-center min-h-[400px] gap-6 animate-in fade-in zoom-in duration-700">
            <div className="relative">
                <Loader2 className="w-16 h-16 text-indigo-500 animate-spin" />
                <div className="absolute inset-0 bg-indigo-500/20 blur-2xl rounded-full animate-pulse" />
            </div>
            <div>
                <h3 className="text-xl font-black text-white uppercase tracking-tighter text-center">Syncing Terminal...</h3>
                <p className="text-[10px] text-slate-500 font-bold uppercase tracking-[0.3em] mt-2 text-center animate-pulse">Establishing Secure Uplink</p>
            </div>
        </div>
    );
}
