import React from "react";
import { Plus } from "lucide-react";

interface RoomsPanelProps {
    hotel: any;
    rooms: any[];
    setShowAddRoom: (show: boolean) => void;
    RoomCardPremium: React.ComponentType<any>;
    api: any;
    reload: () => void;
    setEditingRoom: (room: any) => void;
}

const RoomsPanel = ({
    hotel,
    rooms,
    setShowAddRoom,
    RoomCardPremium,
    api,
    reload,
    setEditingRoom
}: RoomsPanelProps) => {
    return (
        <div className="space-y-12 animate-in fade-in slide-in-from-bottom-5 duration-700">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-slate-900/40 backdrop-blur-md p-6 md:p-8 rounded-[24px] border border-slate-800 shadow-2xl">
                <div>
                    <h2 className="text-2xl font-black text-white tracking-tight uppercase">Your Rooms</h2>
                    <p className="text-slate-500 text-[11px] font-black uppercase tracking-[0.2em] mt-1.5 italic">Manage your rooms and inventory</p>
                </div>
                <button onClick={() => setShowAddRoom(true)} className="bg-indigo-600 hover:bg-indigo-500 text-white flex items-center gap-3 px-6 py-3 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] transition-all shadow-xl shadow-indigo-600/20 active:scale-95 w-full sm:w-auto justify-center">
                    <Plus className="w-4 h-4 transition-transform" /> Add Room
                </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {rooms.map(room => (
                    <RoomCardPremium
                        key={room.id}
                        room={room}
                        onDelete={() => api.deleteRoom(room.id).then(reload)}
                        onEdit={() => setEditingRoom(room)}
                        onPriceChange={(p: number) => api.updateRoomPrice(room.id, p).then(reload)}
                        onInventoryChange={(total: number, available: number) => api.updateRoomInventory(room.id, total, available).then(reload)}
                        onDiscountChange={(d: number | null) => api.updateRoomDiscount(room.id, d).then(reload)}
                    />
                ))}
                <button onClick={() => setShowAddRoom(true)} className="aspect-[3/4] rounded-3xl border border-slate-800/60 bg-slate-900/10 flex flex-col items-center justify-center p-8 text-center group hover:border-indigo-500/50 hover:bg-indigo-500/[0.02] transition-all duration-500 relative overflow-hidden h-[440px] w-full max-w-[320px] mx-auto">
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900/20 to-transparent" />
                    <div className="w-16 h-16 bg-slate-900 rounded-2xl flex items-center justify-center mb-6 border border-slate-800 group-hover:scale-110 group-hover:bg-indigo-600 group-hover:text-white transition-all duration-500 relative z-10 shadow-xl">
                        <Plus className="w-8 h-8" />
                    </div>
                    <p className="text-white font-black text-sm uppercase tracking-tight mb-2 relative z-10">Add New Room</p>
                    <p className="text-slate-500 text-[10px] font-bold uppercase tracking-widest leading-relaxed relative z-10">New room configuration</p>
                </button>
            </div>
        </div>
    );
};

export default RoomsPanel;
