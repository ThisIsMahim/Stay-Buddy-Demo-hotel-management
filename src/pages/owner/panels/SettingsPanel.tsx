import React, { useState } from "react";
import { WrenchIcon, CheckCircle2, Loader2 } from "lucide-react";
import { api } from "../../../services/api";

interface SettingsPanelProps {
    hotel: any;
    onDone: () => void;
    HOTEL_AMENITIES: any[];
    PAYMENT_OPTIONS: string[];
    MultiImageUploader: React.ComponentType<any>;
}

const SettingsPanel = ({
    hotel,
    onDone,
    HOTEL_AMENITIES,
    PAYMENT_OPTIONS,
    MultiImageUploader
}: SettingsPanelProps) => {
    const [loading, setLoading] = useState(false);
    const [name, setName] = useState(hotel.name);
    const [description, setDescription] = useState(hotel.description);
    const [city, setCity] = useState(hotel.city);
    const [address, setAddress] = useState(hotel.address);
    const [lat, setLat] = useState(hotel.locationLat || 23.7);
    const [lng, setLng] = useState(hotel.locationLng || 90.4);
    const [mapUrl, setMapUrl] = useState("");
    const [checkInTime, setCheckInTime] = useState(hotel.checkInTime || "14:00 PM");
    const [checkOutTime, setCheckOutTime] = useState(hotel.checkOutTime || "12:00 PM");
    const [images, setImages] = useState(hotel.images || []);
    const [selectedAmenities, setSelectedAmenities] = useState(hotel.amenities || []);
    const [selectedPayments, setSelectedPayments] = useState(hotel.acceptedPayments || []);

    const toggleAmenity = (id: string) => {
        setSelectedAmenities(prev => prev.includes(id) ? prev.filter(a => a !== id) : [...prev, id]);
    };
    const togglePayment = (id: string) => {
        setSelectedPayments(prev => prev.includes(id) ? prev.filter(p => p !== id) : [...prev, id]);
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);
        try {
            await api.updateHotel(hotel.id, {
                name, description, city, address, mapUrl,
                locationLat: lat, locationLng: lng, images,
                amenities: selectedAmenities, checkInTime, checkOutTime,
                acceptedPayments: selectedPayments,
            });
            alert("Settings saved successfully!");
            onDone();
        } catch (e: any) {
            alert("Failed to save: " + e.message);
        }
        setLoading(false);
    };

    return (
        <div className="bg-slate-900/40 backdrop-blur-md rounded-3xl border border-slate-800 overflow-hidden shadow-2xl relative z-10 animate-in fade-in duration-700 p-6 md:p-8 mb-6">
            <div className="flex justify-between items-center mb-6 border-b border-slate-800/50 pb-4">
                <div>
                    <h2 className="text-xl font-black text-white tracking-tight uppercase flex items-center gap-2.5">
                        <WrenchIcon className="w-5 h-5 text-indigo-500" /> Settings
                    </h2>
                    <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mt-1">Configure {hotel.name}</p>
                </div>
            </div>
            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-[8px] font-black text-slate-500 uppercase tracking-widest mb-1.5 px-1">Hotel Name</label>
                        <input value={name} onChange={e => setName(e.target.value)} required className="w-full bg-slate-950/50 border border-slate-800 rounded-xl px-4 py-3 text-xs font-black text-white focus:ring-2 focus:ring-indigo-500 outline-none transition" />
                    </div>
                    <div>
                        <label className="block text-[8px] font-black text-slate-500 uppercase tracking-widest mb-1.5 px-1">City</label>
                        <input value={city} onChange={e => setCity(e.target.value)} required className="w-full bg-slate-950/50 border border-slate-800 rounded-xl px-4 py-3 text-xs font-black text-white focus:ring-2 focus:ring-indigo-500 outline-none transition" />
                    </div>
                </div>

                <div>
                    <label className="block text-[8px] font-black text-slate-500 uppercase tracking-widest mb-1.5 px-1">Description</label>
                    <textarea value={description} onChange={e => setDescription(e.target.value)} rows={3} required className="w-full bg-slate-950/50 border border-slate-800 rounded-xl px-4 py-3 text-xs font-medium text-slate-300 focus:ring-2 focus:ring-indigo-500 outline-none transition resize-none" />
                </div>

                <div>
                    <label className="block text-[8px] font-black text-slate-500 uppercase tracking-widest mb-1.5 px-1">Full Address</label>
                    <input value={address} onChange={e => setAddress(e.target.value)} required className="w-full bg-slate-950/50 border border-slate-800 rounded-xl px-4 py-3 text-xs font-black text-white focus:ring-2 focus:ring-indigo-500 outline-none transition" />
                </div>

                <div className="bg-indigo-600/5 p-4 rounded-2xl border border-indigo-500/10">
                    <label className="block text-[9px] font-black text-indigo-400 uppercase tracking-widest mb-2 px-1">Maps Location</label>
                    <p className="text-[9px] text-slate-500 mb-3 px-1 font-medium">Lat {lat?.toFixed(4)} / Lng {lng?.toFixed(4)} • Paste link to update</p>
                    <input value={mapUrl} onChange={e => setMapUrl(e.target.value)} type="url" placeholder="https://maps.app.goo.gl/..." className="w-full bg-slate-950/50 border border-slate-800 rounded-xl px-4 py-3 text-xs font-black text-white focus:ring-2 focus:ring-indigo-500 outline-none transition" />
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-[8px] font-black text-slate-500 uppercase tracking-widest mb-1.5 px-1">Check-in</label>
                        <input value={checkInTime} onChange={e => setCheckInTime(e.target.value)} className="w-full bg-slate-950/50 border border-slate-800 rounded-xl px-4 py-3 text-xs font-black text-white focus:ring-2 focus:ring-indigo-500 outline-none transition" />
                    </div>
                    <div>
                        <label className="block text-[8px] font-black text-slate-500 uppercase tracking-widest mb-1.5 px-1">Check-out</label>
                        <input value={checkOutTime} onChange={e => setCheckOutTime(e.target.value)} className="w-full bg-slate-950/50 border border-slate-800 rounded-xl px-4 py-3 text-xs font-black text-white focus:ring-2 focus:ring-indigo-500 outline-none transition" />
                    </div>
                </div>

                <div>
                    <label className="block text-[8px] font-black text-slate-500 uppercase tracking-widest mb-2.5 px-1">Hotel Amenities</label>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
                        {HOTEL_AMENITIES.map((a: any) => (
                            <button key={a.id} type="button" onClick={() => toggleAmenity(a.id)}
                                className={`flex items-center gap-2 px-3 py-2.5 rounded-xl text-[10px] font-bold transition-all border ${selectedAmenities.includes(a.id)
                                    ? "bg-indigo-600/20 border-indigo-500/40 text-indigo-300 shadow-sm"
                                    : "bg-slate-950/30 border-slate-800 text-slate-500 hover:border-slate-600 hover:text-slate-300"
                                    }`}>
                                <span className="text-xs">{a.icon}</span>
                                <span className="uppercase tracking-widest truncate">{a.label}</span>
                                {selectedAmenities.includes(a.id) && <CheckCircle2 className="w-3 h-3 text-indigo-400 ml-auto shrink-0" />}
                            </button>
                        ))}
                    </div>
                </div>

                <div>
                    <label className="block text-[8px] font-black text-slate-500 uppercase tracking-widest mb-2.5 px-1">Payments</label>
                    <div className="flex flex-wrap gap-2">
                        {PAYMENT_OPTIONS.map((p: string) => (
                            <button key={p} type="button" onClick={() => togglePayment(p)}
                                className={`px-3 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all border ${selectedPayments.includes(p)
                                    ? "bg-emerald-600/20 border-emerald-500/40 text-emerald-300 shadow-sm flex items-center gap-1.5"
                                    : "bg-slate-950/30 border-slate-800 text-slate-500 hover:border-slate-600 hover:text-slate-300"
                                    }`}>
                                {p}
                                {selectedPayments.includes(p) && <CheckCircle2 className="w-3 h-3 text-emerald-400" />}
                            </button>
                        ))}
                    </div>
                </div>

                <div>
                    <label className="block text-[8px] font-black text-slate-500 uppercase tracking-widest mb-3 px-1">Hotel Photos</label>
                    <div className="p-2 border border-slate-800 rounded-2xl bg-slate-950/20">
                        <MultiImageUploader initialImages={images} onChange={setImages} maxImages={5} dark />
                    </div>
                </div>

                <button disabled={loading} type="submit" className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-black py-4 rounded-2xl text-xs uppercase tracking-widest transition-all shadow-xl shadow-indigo-600/20 active:translate-y-0.5 mt-4 disabled:opacity-50">
                    {loading ? <Loader2 className="w-5 h-5 animate-spin mx-auto" /> : "Save Changes"}
                </button>
            </form>
        </div>
    );
};

export default SettingsPanel;
