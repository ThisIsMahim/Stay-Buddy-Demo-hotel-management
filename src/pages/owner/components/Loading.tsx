import React from "react";
import { SparkleIcon } from "lucide-react";

export default function Loading() {
    return (
        <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center gap-6 text-center px-6">
            <div className="relative">
                <div className="w-20 h-20 border-4 border-indigo-500/20 rounded-full animate-spin border-t-indigo-500 shadow-[0_0_30px_rgba(79,70,229,0.2)]" />
                <div className="absolute inset-0 flex items-center justify-center">
                    <SparkleIcon className="w-6 h-6 text-indigo-400 animate-pulse" />
                </div>
            </div>
            <div>
                <p className="text-white font-black text-xs uppercase tracking-[0.4em] animate-pulse">Reservation bd Dashboard</p>
                <p className="text-slate-500 text-[10px] uppercase font-bold mt-2 tracking-widest leading-loose">Loading property data...</p>
            </div>
        </div>
    );
}
