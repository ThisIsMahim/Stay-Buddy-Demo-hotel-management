import { Menu, Home, Plus } from "lucide-react";


interface Hotel {
    id: string;
    name: string;
    city: string;
    isVerified: boolean;
}

interface OwnerTopBarProps {
    isSidebarOpen: boolean;
    setIsSidebarOpen: (open: boolean) => void;
    hotel: Hotel | null;
    hotels: Hotel[];
    setHotel: (hotel: Hotel | null) => void;
    setShowAddHotel: (show: boolean) => void;
}

const OwnerTopBar = ({
    isSidebarOpen,
    setIsSidebarOpen,
    hotel,
    hotels,
    setHotel,
    setShowAddHotel
}: OwnerTopBarProps) => {
    return (
        <header className="h-[64px] border-b border-slate-800 bg-slate-950/80 backdrop-blur-3xl fixed top-0 left-0 right-0 z-[110] px-4 md:px-8">
            <div className="h-full flex items-center justify-between">
                {/* Left: Branding & Mobile Toggle */}
                <div className="flex items-center gap-6">
                    <button
                        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                        className="md:hidden p-2 rounded-xl bg-slate-800/50 text-slate-400 hover:text-white transition-colors"
                    >
                        <Menu className="w-6 h-6" />
                    </button>
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-indigo-600 rounded-2xl flex items-center justify-center shadow-[0_0_20px_rgba(79,70,229,0.3)]">
                            <Home className="w-5 h-5 text-white" />
                        </div>
                        <div className="hidden sm:block">
                            <p className="font-black text-white text-lg tracking-tighter uppercase leading-none">Reservation bd</p>
                            <p className="text-[11px] text-slate-500 font-bold uppercase tracking-widest mt-1">Owner Dashboard</p>
                        </div>
                    </div>
                </div>


                {/* Center: Hotel Selector */}
                <div className="flex items-center gap-4">
                    {hotel && (
                        <div className="flex items-center gap-3 bg-slate-900/60 border border-slate-800 rounded-2xl px-5 py-3">
                            <div className={`w-2.5 h-2.5 rounded-full ${hotel.isVerified ? "bg-emerald-500" : "bg-amber-500"} animate-pulse flex-shrink-0`} />
                            {hotels.length > 1 ? (
                                <select
                                    value={hotel?.id}
                                    onChange={(e) => setHotel(hotels.find(h => h.id === e.target.value) || null)}
                                    className="bg-transparent text-white text-sm font-black uppercase tracking-tight outline-none cursor-pointer pr-2 max-w-[240px]"
                                >
                                    {hotels.map(h => <option key={h.id} value={h.id} className="bg-slate-900">{h.name}</option>)}
                                </select>
                            ) : (
                                <span className="text-white text-sm font-black uppercase tracking-tight truncate max-w-[240px]">{hotel.name}</span>
                            )}
                            <span className="text-[11px] text-slate-500 font-bold uppercase tracking-widest hidden md:inline">
                                · {hotel.city} · {hotel.isVerified ? "Verified" : "Pending Verification"}
                            </span>
                        </div>
                    )}
                </div>

                {/* Right: Register + Clock */}
                <div className="flex items-center gap-4">
                    <button
                        onClick={() => setShowAddHotel(true)}
                        className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white font-black uppercase tracking-widest px-6 py-3 rounded-2xl text-xs transition-all shadow-lg shadow-indigo-600/20 active:scale-95"
                    >
                        <Plus className="w-4 h-4" /> <span className="hidden sm:inline">Register Hotel</span>
                    </button>
                    <div className="hidden lg:flex items-center gap-4 bg-slate-900/50 backdrop-blur-xl border border-slate-800 rounded-2xl px-6 py-2.5 shadow-lg">
                        <div className="text-right">
                            <p className="text-white font-black text-sm tabular-nums">{new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                            <p className="text-slate-500 text-[10px] font-bold uppercase">{new Date().toLocaleDateString(undefined, { weekday: 'short' })}</p>
                        </div>
                        <div className="w-px h-6 bg-slate-800" />
                        <div className="text-left">
                            <p className="text-indigo-400 font-black text-sm">Online</p>
                            <p className="text-slate-500 text-[10px] font-bold uppercase">v1.8.5</p>
                        </div>
                    </div>
                </div>
            </div>
        </header>
    );
};

export default OwnerTopBar;
