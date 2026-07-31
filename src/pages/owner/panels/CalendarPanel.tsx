import React from "react";

interface CalendarPanelProps {
    hotel: any;
    rooms: any[];
    calendarDays: any[];
    selectedCalRoom: string;
    setSelectedCalRoom: (roomId: string) => void;
}

const CalendarPanel = ({
    hotel,
    rooms,
    calendarDays,
    selectedCalRoom,
    setSelectedCalRoom
}: CalendarPanelProps) => {
    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-5 duration-700">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-slate-900/40 backdrop-blur-md p-5 rounded-[24px] border border-slate-800 shadow-2xl">
                <div>
                    <h2 className="text-lg font-black text-white tracking-tight uppercase">Availability Calendar</h2>
                    <p className="text-slate-500 text-[9px] font-black uppercase tracking-widest mt-0.5 italic">View room availability by date</p>
                </div>
                <div className="flex gap-4">
                    <select
                        value={selectedCalRoom}
                        onChange={e => setSelectedCalRoom(e.target.value)}
                        className="bg-slate-900 border border-slate-700 text-white text-xs font-black uppercase tracking-widest rounded-xl px-4 py-2"
                    >
                        <option value="">All Rooms</option>
                        {rooms.map(r => <option key={r.id} value={r.id}>{r.type} {r.roomNumber}</option>)}
                    </select>
                </div>
            </div>

            <div className="bg-slate-900/40 backdrop-blur-md rounded-[28px] border border-slate-800 p-6 shadow-2xl overflow-x-auto">
                <div className="grid grid-cols-7 gap-4 min-w-[800px]">
                    {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map(d => (
                        <div key={d} className="text-center text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] pb-4">{d}</div>
                    ))}
                    {calendarDays.map((day, idx) => {
                        const isToday = day.date === new Date().toISOString().split("T")[0];
                        return (
                            <div key={idx} className={`aspect-square rounded-3xl border p-3 transition-all hover:scale-105 group relative flex flex-col ${isToday ? "bg-indigo-600/20 border-indigo-500 shadow-[0_0_20px_rgba(79,70,229,0.2)]" : day.isBooked ? "bg-rose-600/10 border-rose-500/30" : "bg-slate-900/30 border-slate-800 hover:border-slate-700"}`}>
                                <span className={`text-xs font-black tabular-nums ${isToday ? "text-white" : "text-slate-500"}`}>{day.date.split("-")[2]}</span>
                                <div className="mt-2 flex-1 flex flex-col gap-1">
                                    {day.isBooked ? (
                                        <div className="h-1.5 w-full rounded-full bg-rose-500" />
                                    ) : (
                                        <div className="h-1.5 w-full rounded-full bg-emerald-500/40" />
                                    )}
                                    {day.guestName && (
                                        <p className="text-[8px] text-rose-400 font-bold truncate leading-tight">{day.guestName}</p>
                                    )}
                                </div>
                                <div className="text-center">
                                    <span className={`text-[10px] font-black uppercase tracking-wider ${day.isBooked ? "text-rose-400" : "text-emerald-400"}`}>
                                        {day.availableCount}/{day.totalCount}
                                    </span>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};

export default CalendarPanel;
