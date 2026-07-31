import React, { useState } from 'react';
import { Loader2, Trash2, Edit3, Image as ImageIcon, Zap, ChevronRight, CheckCircle2 } from 'lucide-react';
import { api, Room } from '../../../services/api';

export function RoomCardPremium({ room, onUpdate }: { room: Room; onUpdate: () => void }) {
    const [editing, setEditing] = useState(false);
    const [price, setPrice] = useState(room.pricePerNight);
    const [inventory, setInventory] = useState(room.totalInventory);
    const [discount, setDiscount] = useState(room.discountPrice || 0);
    const [loading, setLoading] = useState(false);

    const handleUpdate = async () => {
        setLoading(true);
        try {
            await api.updateRoom(room.id, {
                pricePerNight: price,
                totalInventory: inventory,
                discountPrice: discount || undefined
            });
            setEditing(false);
            onUpdate();
        } catch (e: any) {
            alert("Error: " + e.message);
        }
        setLoading(false);
    };

    const handleDelete = async () => {
        if (!confirm("Delete this room category?")) return;
        setLoading(true);
        try {
            await api.deleteRoom(room.id);
            onUpdate();
        } catch (e: any) {
            alert("Error: " + e.message);
        }
        setLoading(false);
    };

    return (
        <div className="bg-slate-900/60 border border-slate-800 rounded-[32px] overflow-hidden group hover:border-indigo-500/30 transition-all duration-500 shadow-xl">
            <div className="relative h-48 sm:h-56 overflow-hidden">
                <img src={room.images?.[0] || "https://images.unsplash.com/photo-1590490360182-c33d57733427?w=800"} alt={room.type} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent opacity-60" />
                <div className="absolute top-4 right-4 flex gap-2">
                    <button onClick={() => setEditing(!editing)} className="p-2.5 bg-slate-900/80 backdrop-blur-md rounded-xl text-slate-300 hover:text-white transition-all hover:scale-105 active:scale-95 border border-slate-700/50 shadow-lg">
                        <Edit3 className="w-4 h-4" />
                    </button>
                    <button onClick={handleDelete} className="p-2.5 bg-rose-500/10 backdrop-blur-md rounded-xl text-rose-400 hover:bg-rose-500 hover:text-white transition-all hover:scale-105 active:scale-95 border border-rose-500/20 shadow-lg">
                        <Trash2 className="w-4 h-4" />
                    </button>
                </div>
                <div className="absolute bottom-4 left-6">
                    <span className="bg-indigo-600 text-white text-[10px] font-black uppercase tracking-widest px-3 py-1.5 rounded-lg shadow-xl shadow-indigo-600/40">{room.category}</span>
                </div>
            </div>

            <div className="p-8">
                <div className="flex justify-between items-start mb-6">
                    <div>
                        <h4 className="text-xl font-black text-white uppercase tracking-tight mb-1">{room.type}</h4>
                        <p className="text-xs text-slate-500 font-bold uppercase tracking-widest flex items-center gap-2">
                            <Zap className="w-3 h-3 text-indigo-500" /> Floor {room.floorNumber} • {room.capacity}
                        </p>
                    </div>
                    <div className="text-right">
                        <div className="text-2xl font-black text-emerald-400 leading-none">৳{room.pricePerNight.toLocaleString()}</div>
                        <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mt-1">per night</p>
                    </div>
                </div>

                {editing ? (
                    <div className="bg-slate-950/50 rounded-2xl p-6 border border-slate-800 space-y-4 animate-in slide-in-from-top-4 duration-300">
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1.5 ml-1">Daily Rate</label>
                                <input type="number" value={price} onChange={e => setPrice(+e.target.value)} className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-2.5 text-sm font-black text-white focus:ring-2 focus:ring-indigo-500 outline-none" />
                            </div>
                            <div>
                                <label className="block text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1.5 ml-1">Inventory</label>
                                <input type="number" value={inventory} onChange={e => setInventory(+e.target.value)} className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-2.5 text-sm font-black text-white focus:ring-2 focus:ring-indigo-500 outline-none" />
                            </div>
                        </div>
                        <div className="flex gap-3 pt-2">
                            <button onClick={() => setEditing(false)} className="flex-1 py-2.5 rounded-xl border border-slate-700 text-slate-400 text-[10px] font-black uppercase tracking-widest hover:bg-slate-800 transition">Cancel</button>
                            <button onClick={handleUpdate} disabled={loading} className="flex-1 py-2.5 rounded-xl bg-indigo-600 text-white text-[10px] font-black uppercase tracking-widest hover:bg-indigo-500 transition shadow-lg shadow-indigo-600/20 active:scale-95 flex items-center justify-center gap-2">
                                {loading ? <Loader2 className="w-3 h-3 animate-spin" /> : <CheckCircle2 className="w-3 h-3" />} Save
                            </button>
                        </div>
                    </div>
                ) : (
                    <div className="flex items-center justify-between pt-2">
                        <div className="flex items-center gap-2">
                            <div className="w-10 h-10 rounded-xl bg-slate-800 flex items-center justify-center border border-slate-700">
                                <ImageIcon className="w-5 h-5 text-slate-400" />
                            </div>
                            <div>
                                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Inventory</p>
                                <p className="text-sm font-black text-white">{room.totalInventory} Units</p>
                            </div>
                        </div>
                        <button
                            className="group/btn flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-indigo-400 hover:text-white transition-colors"
                            onClick={() => setEditing(true)}
                        >
                            Quick Edit <ChevronRight className="w-4 h-4 transition-transform group-hover/btn:translate-x-1" />
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}
