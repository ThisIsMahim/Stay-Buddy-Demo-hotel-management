import React from "react";


interface AdminTopBarProps {
    setIsSidebarOpen: (open: boolean) => void;
}

export default function AdminTopBar({ setIsSidebarOpen }: AdminTopBarProps) {
    return (
        <div className="flex flex-col lg:flex-row items-center gap-4 mb-8">
            <div className="md:hidden flex items-center w-full">
                <button
                    className="p-2 bg-slate-900 border border-slate-800 rounded-xl text-slate-400 hover:text-white mr-4"
                    onClick={() => setIsSidebarOpen(true)}
                >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                    </svg>
                </button>
                <h1 className="text-xl font-black text-white tracking-tight uppercase truncate">System Command</h1>
            </div>


            <div className="hidden lg:flex items-center gap-3 ml-auto">
                <div className="bg-emerald-500/10 border border-emerald-500/20 px-3 py-1.5 rounded-full flex items-center gap-2">
                    <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
                    <span className="text-[10px] font-black text-emerald-500 uppercase tracking-widest">Network Stable</span>
                </div>
            </div>
        </div>
    );
}
