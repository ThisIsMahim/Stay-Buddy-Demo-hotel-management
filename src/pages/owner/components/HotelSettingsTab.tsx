import React, { useState } from 'react';
import { Loader2, WrenchIcon, CheckCircle2 } from 'lucide-react';
import { api, HOTEL_AMENITIES, PAYMENT_OPTIONS, Hotel } from '../../../services/api';
import MultiImageUploader from '../../../components/MultiImageUploader';

export function HotelSettingsTab({ hotel, onDone }: { hotel: Hotel; onDone: () => void }) {
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
    const [images, setImages] = useState<string[]>(hotel.images || []);
    const [selectedAmenities, setSelectedAmenities] = useState<string[]>(hotel.amenities || []);
    const [selectedPayments, setSelectedPayments] = useState<string[]>(hotel.acceptedPayments || []);

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
                name,
                description,
                city,
                address,
                mapUrl: mapUrl,
                locationLat: lat,
                locationLng: lng,
                images,
                amenities: selectedAmenities,
                checkInTime,
                checkOutTime,
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
        <div className="bg-slate-900/40 backdrop-blur-md rounded-[40px] border border-slate-800 overflow-hidden shadow-2xl relative z-10 animate-in fade-in duration-700 p-8 md:p-12 mb-10">
            <div className="flex justify-between items-center mb-8 border-b border-slate-800 pb-6">
                <div>
                    <h2 className="text-3xl font-black text-white tracking-tight uppercase flex items-center gap-3">
                        <WrenchIcon className="w-8 h-8 text-indigo-500" /> Settings & Configuration
                    </h2>
                    <p className="text-sm text-slate-500 font-bold uppercase tracking-widest mt-2 italic">Update Settings for {hotel.name}</p>
                </div>
            </div>
            <form onSubmit={handleSubmit} className="space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2 px-1">Hotel Name</label>
                        <input value={name} onChange={e => setName(e.target.value)} required className="w-full bg-slate-950/50 border border-slate-800 rounded-2xl px-6 py-5 text-sm font-black text-white focus:ring-2 focus:ring-indigo-500 outline-none transition" />
                    </div>
                    <div>
                        <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2 px-1">City</label>
                        <input value={city} onChange={e => setCity(e.target.value)} required className="w-full bg-slate-950/50 border border-slate-800 rounded-2xl px-6 py-5 text-sm font-black text-white focus:ring-2 focus:ring-indigo-500 outline-none transition" />
                    </div>
                </div>

                <div>
                    <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2 px-1">Description</label>
                    <textarea value={description} onChange={e => setDescription(e.target.value)} rows={4} required className="w-full bg-slate-950/50 border border-slate-800 rounded-2xl px-6 py-5 text-sm font-medium text-slate-300 focus:ring-2 focus:ring-indigo-500 outline-none transition resize-none" />
                </div>

                <div>
                    <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2 px-1">Full Address</label>
                    <input value={address} onChange={e => setAddress(e.target.value)} required className="w-full bg-slate-950/50 border border-slate-800 rounded-2xl px-6 py-5 text-sm font-black text-white focus:ring-2 focus:ring-indigo-500 outline-none transition" />
                </div>

                <div className="bg-indigo-600/10 p-6 rounded-[24px] border border-indigo-500/20">
                    <label className="block text-[11px] font-black text-indigo-400 uppercase tracking-widest mb-3 px-1">Update Map Location</label>
                    <p className="text-xs text-slate-400 mb-4 px-1 font-medium italic">Current: Lat {lat?.toFixed(5)} / Lng {lng?.toFixed(5)}. Paste a new Google Map Link to update.</p>
                    <input value={mapUrl} onChange={e => setMapUrl(e.target.value)} type="url" placeholder="https://maps.app.goo.gl/..." className="w-full bg-slate-950/50 border border-slate-800 rounded-2xl px-6 py-5 text-sm font-black text-white focus:ring-2 focus:ring-indigo-500 outline-none transition" />
                </div>

                <div className="grid grid-cols-2 gap-6">
                    <div>
                        <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2 px-1">Check-in Time</label>
                        <input value={checkInTime} onChange={e => setCheckInTime(e.target.value)} className="w-full bg-slate-950/50 border border-slate-800 rounded-2xl px-6 py-5 text-sm font-black text-white focus:ring-2 focus:ring-indigo-500 outline-none transition" />
                    </div>
                    <div>
                        <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2 px-1">Check-out Time</label>
                        <input value={checkOutTime} onChange={e => setCheckOutTime(e.target.value)} className="w-full bg-slate-950/50 border border-slate-800 rounded-2xl px-6 py-5 text-sm font-black text-white focus:ring-2 focus:ring-indigo-500 outline-none transition" />
                    </div>
                </div>

                <div>
                    <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-3 px-1">Hotel Amenities</label>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                        {HOTEL_AMENITIES.map(a => (
                            <button key={a.id} type="button" onClick={() => toggleAmenity(a.id)}
                                className={`flex items-center gap-3 px-4 py-4 rounded-[16px] text-xs font-bold transition-all border ${selectedAmenities.includes(a.id)
                                    ? "bg-indigo-600/20 border-indigo-500/40 text-indigo-300 shadow-md"
                                    : "bg-slate-950/30 border-slate-800 text-slate-500 hover:border-slate-600 hover:text-slate-300"
                                    }`}>
                                <span className="text-base">{a.icon}</span>
                                <span className="uppercase tracking-widest truncate">{a.label}</span>
                                {selectedAmenities.includes(a.id) && <CheckCircle2 className="w-4 h-4 text-indigo-400 ml-auto shrink-0" />}
                            </button>
                        ))}
                    </div>
                </div>

                <div>
                    <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-3 px-1">Accepted Payments</label>
                    <div className="flex flex-wrap gap-3">
                        {PAYMENT_OPTIONS.map(p => (
                            <button key={p} type="button" onClick={() => togglePayment(p)}
                                className={`px-5 py-3.5 rounded-[16px] text-xs font-black uppercase tracking-widest transition-all border ${selectedPayments.includes(p)
                                    ? "bg-emerald-600/20 border-emerald-500/40 text-emerald-300 shadow-md flex items-center gap-2"
                                    : "bg-slate-950/30 border-slate-800 text-slate-500 hover:border-slate-600 hover:text-slate-300"
                                    }`}>
                                {p}
                                {selectedPayments.includes(p) && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />}
                            </button>
                        ))}
                    </div>
                </div>

                <div>
                    <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-4 px-1">Hotel Photos</label>
                    <MultiImageUploader initialImages={images} onChange={setImages} maxImages={5} dark />
                </div>

                <button disabled={loading} type="submit" className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-black py-6 rounded-[24px] text-sm uppercase tracking-[0.2em] transition-all shadow-2xl shadow-indigo-600/20 active:-translate-y-1 mt-8 disabled:opacity-50">
                    {loading ? <Loader2 className="w-6 h-6 animate-spin mx-auto" /> : "Save Settings"}
                </button>
            </form>
        </div>
    );
}
