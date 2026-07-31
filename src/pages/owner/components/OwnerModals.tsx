import React, { useState } from 'react';
import { X, Loader2, CheckCircle2, TrendingUp, Star, Map, ChevronDown, MonitorDot, Users, Ticket, Plus } from 'lucide-react';
import { api, HOTEL_AMENITIES, PAYMENT_OPTIONS, ROOM_AMENITIES, BED_TYPES, ROOM_CATEGORIES, VIEW_TYPES, Hotel } from "../../../services/api";
import MultiImageUploader from "../../../components/MultiImageUploader";

const BD_CITIES = [
    "Bagerhat", "Bandarban", "Barguna", "Barisal", "Bhola", "Bogra", "Brahmanbaria", "Chandpur",
    "Chapai Nawabganj", "Chattogram", "Chuadanga", "Comilla", "Cox's Bazar", "Dhaka", "Dinajpur",
    "Faridpur", "Feni", "Gaibandha", "Gazipur", "Gopalganj", "Habiganj", "Jamalpur", "Jashore",
    "Jhalokati", "Jhenaidah", "Joypurhat", "Khagrachari", "Khulna", "Kishoreganj", "Kurigram", "Kushtia",
    "Lakshmipur", "Lalmonirhat", "Madaripur", "Magura", "Manikganj", "Meherpur", "Moulvibazar",
    "Munshiganj", "Mymensingh", "Naogaon", "Narail", "Narayanganj", "Narsingdi", "Natore",
    "Netrokona", "Nilphamari", "Noakhali", "Pabna", "Panchagarh", "Patuakhali", "Pirojpur",
    "Rajbari", "Rajshahi", "Rangamati", "Rangpur", "Saidpur", "Shariatpur", "Sherpur", "Sirajganj",
    "Sunamganj", "Sylhet", "Tangail", "Thakurgaon"
].sort();

export function AddHotelModal({ ownerId, onClose, onDone }: { ownerId: string; onClose: () => void; onDone: () => void }) {
    const [loading, setLoading] = useState(false);
    const [selectedAmenities, setSelectedAmenities] = useState<string[]>([]);
    const [selectedPayments, setSelectedPayments] = useState<string[]>([]);
    const [images, setImages] = useState<string[]>([]);
    const [mapUrl, setMapUrl] = useState("");

    const [checkInHour, setCheckInHour] = useState("02");
    const [checkInPeriod, setCheckInPeriod] = useState("PM");
    const [checkOutHour, setCheckOutHour] = useState("12");
    const [checkOutPeriod, setCheckOutPeriod] = useState("PM");

    const [citySearch, setCitySearch] = useState("");
    const [showCityDropdown, setShowCityDropdown] = useState(false);
    const filteredCities = BD_CITIES.filter(c => c.toLowerCase().includes(citySearch.toLowerCase()));

    const toggleAmenity = (id: string) => setSelectedAmenities(prev => prev.includes(id) ? prev.filter(a => a !== id) : [...prev, id]);
    const togglePayment = (p: string) => setSelectedPayments(prev => prev.includes(p) ? prev.filter(x => x !== p) : [...prev, p]);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const fd = new FormData(e.currentTarget);
        setLoading(true);
        try {
            await api.createHotel({
                ownerId,
                name: fd.get("name") as string,
                city: fd.get("city") as string,
                address: fd.get("address") as string,
                description: fd.get("description") as string,
                checkInTime: `${checkInHour}:00 ${checkInPeriod}`,
                checkOutTime: `${checkOutHour}:00 ${checkOutPeriod}`,
                amenities: selectedAmenities,
                acceptedPayments: selectedPayments,
                images,
                mapUrl
            });
            onDone();
        } catch (e: any) { alert("Failed: " + e.message); }
        setLoading(false);
    };

    return (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md z-[150] flex items-center justify-center p-6 overflow-y-auto">
            <div className="bg-slate-900 border border-slate-800 rounded-[40px] w-full max-w-2xl shadow-2xl relative my-auto">
                <div className="p-8 border-b border-slate-800 flex justify-between items-center sticky top-0 bg-slate-900 rounded-t-[40px] z-10">
                    <h3 className="font-black text-2xl text-white uppercase tracking-tight">Register New Property</h3>
                    <button onClick={onClose} className="p-3 bg-slate-800 hover:bg-slate-700 rounded-2xl transition text-slate-400 hover:text-white">
                        <X className="w-6 h-6" />
                    </button>
                </div>
                <form onSubmit={handleSubmit} className="p-8 space-y-6 max-h-[75vh] overflow-y-auto custom-scrollbar">
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-[9px] font-black text-slate-500 uppercase tracking-widest mb-1.5 px-0.5">Hotel Name</label>
                            <input name="name" required className="w-full bg-slate-950/50 border border-slate-800 rounded-2xl px-5 py-3.5 text-xs font-black text-white focus:ring-2 focus:ring-indigo-500 outline-none transition" placeholder="e.g. Grand Palace Hotel" />
                        </div>
                        <div>
                            <label className="block text-[9px] font-black text-slate-500 uppercase tracking-widest mb-1.5 px-0.5">City</label>
                            <div className="relative">
                                <input type="hidden" name="city" value={citySearch} />
                                <input
                                    required
                                    value={citySearch}
                                    onChange={(e) => { setCitySearch(e.target.value); setShowCityDropdown(true); }}
                                    onFocus={() => setShowCityDropdown(true)}
                                    // small delay to allow click on option
                                    onBlur={() => setTimeout(() => setShowCityDropdown(false), 200)}
                                    className="w-full bg-slate-950/50 border border-slate-800 rounded-2xl px-5 py-3.5 text-xs font-black text-white focus:ring-2 focus:ring-indigo-500 outline-none transition"
                                    placeholder="Search e.g. Dhaka"
                                />
                                {showCityDropdown && (
                                    <div className="absolute top-full left-0 right-0 mt-2 max-h-48 overflow-y-auto bg-slate-900 border border-slate-700 rounded-2xl z-[200] shadow-2xl p-2 hide-scrollbar">
                                        {filteredCities.length > 0 ? filteredCities.map(c => (
                                            <button
                                                key={c}
                                                type="button"
                                                onClick={() => { setCitySearch(c); setShowCityDropdown(false); }}
                                                className="w-full text-left px-4 py-2 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition"
                                            >
                                                {c}
                                            </button>
                                        )) : (
                                            <div className="px-4 py-3 text-xs text-slate-500 font-medium">No strict match found. It will be saved as typed.</div>
                                        )}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                    <div>
                        <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2 px-1">Description</label>
                        <textarea name="description" rows={3} required className="w-full bg-slate-950/50 border border-slate-800 rounded-2xl px-5 py-4 text-xs font-medium text-white focus:ring-2 focus:ring-indigo-500 outline-none transition resize-none" placeholder="Tell us about your property..." />
                    </div>
                    <div>
                        <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2 px-1">Full Address</label>
                        <input name="address" required className="w-full bg-slate-950/50 border border-slate-800 rounded-2xl px-5 py-4 text-xs font-black text-white focus:ring-2 focus:ring-indigo-500 outline-none transition" placeholder="Street, Block, Area..." />
                    </div>
                    <div>
                        <div className="flex items-center justify-between mb-2">
                            <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest px-1">Google Maps Link</label>
                            <a href="https://maps.google.com/" target="_blank" rel="noopener noreferrer" className="text-[9px] font-bold text-indigo-400 hover:text-indigo-300 uppercase tracking-widest flex items-center gap-1 bg-indigo-500/10 px-2 py-1 rounded-lg transition ml-auto w-fit">
                                <Map className="w-3 h-3" /> Find on Maps
                            </a>
                        </div>
                        <input value={mapUrl} onChange={(e) => setMapUrl(e.target.value)} type="url" className="w-full bg-slate-950/50 border border-slate-800 rounded-2xl px-5 py-4 text-xs font-black text-white focus:ring-2 focus:ring-indigo-500 outline-none transition" placeholder="https://maps.app.goo.gl/..." />
                        <p className="mt-2 text-[10px] text-slate-500 font-medium px-1 italic leading-tight">
                            Go to your property on Maps and click 'Share' to find the short link.
                        </p>
                    </div>
                    <div className="grid grid-cols-2 gap-5">
                        <div>
                            <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2 px-1">Check-in Time</label>
                            <div className="flex gap-2">
                                <select
                                    value={checkInHour}
                                    onChange={(e) => setCheckInHour(e.target.value)}
                                    className="flex-1 bg-slate-950/50 border border-slate-800 rounded-2xl px-4 py-4 text-xs font-black text-white focus:ring-2 focus:ring-indigo-500 outline-none transition cursor-pointer appearance-none"
                                >
                                    {Array.from({ length: 12 }, (_, i) => i + 1).map(h => {
                                        const val = h < 10 ? `0${h}` : `${h}`;
                                        return <option key={val} value={val} className="bg-slate-900">{val}:00</option>
                                    })}
                                </select>
                                <select
                                    value={checkInPeriod}
                                    onChange={(e) => setCheckInPeriod(e.target.value)}
                                    className="w-20 bg-slate-950/50 border border-slate-800 rounded-2xl px-4 py-4 text-xs font-black text-white focus:ring-2 focus:ring-indigo-500 outline-none transition cursor-pointer appearance-none"
                                >
                                    <option value="AM" className="bg-slate-900">AM</option>
                                    <option value="PM" className="bg-slate-900">PM</option>
                                </select>
                            </div>
                        </div>
                        <div>
                            <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2 px-1">Check-out Time</label>
                            <div className="flex gap-2">
                                <select
                                    value={checkOutHour}
                                    onChange={(e) => setCheckOutHour(e.target.value)}
                                    className="flex-1 bg-slate-950/50 border border-slate-800 rounded-2xl px-4 py-4 text-xs font-black text-white focus:ring-2 focus:ring-indigo-500 outline-none transition cursor-pointer appearance-none"
                                >
                                    {Array.from({ length: 12 }, (_, i) => i + 1).map(h => {
                                        const val = h < 10 ? `0${h}` : `${h}`;
                                        return <option key={val} value={val} className="bg-slate-900">{val}:00</option>
                                    })}
                                </select>
                                <select
                                    value={checkOutPeriod}
                                    onChange={(e) => setCheckOutPeriod(e.target.value)}
                                    className="w-20 bg-slate-950/50 border border-slate-800 rounded-2xl px-4 py-4 text-xs font-black text-white focus:ring-2 focus:ring-indigo-500 outline-none transition cursor-pointer appearance-none"
                                >
                                    <option value="AM" className="bg-slate-900">AM</option>
                                    <option value="PM" className="bg-slate-900">PM</option>
                                </select>
                            </div>
                        </div>
                    </div>
                    <div>
                        <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-3 px-1">Hotel Amenities</label>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                            {HOTEL_AMENITIES.map(a => (
                                <button
                                    key={a.id}
                                    type="button"
                                    onClick={() => toggleAmenity(a.id)}
                                    className={`flex items-center gap-2 px-3 py-3 rounded-xl text-[11px] font-bold transition-all border ${selectedAmenities.includes(a.id)
                                        ? "bg-indigo-600/20 border-indigo-500/40 text-indigo-300"
                                        : "bg-slate-950/30 border-slate-800 text-slate-500 hover:border-slate-600 hover:text-slate-300"
                                        }`}
                                >
                                    <span className="text-sm">{a.icon}</span>
                                    <span className="uppercase tracking-wider truncate">{a.label}</span>
                                    {selectedAmenities.includes(a.id) && (
                                        <CheckCircle2 className="w-3.5 h-3.5 text-indigo-400 ml-auto shrink-0" />
                                    )}
                                </button>
                            ))}
                        </div>
                    </div>
                    <div>
                        <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-3 px-1">Accepted Payments</label>
                        <div className="flex flex-wrap gap-2">
                            {PAYMENT_OPTIONS.map(p => (
                                <button
                                    key={p}
                                    type="button"
                                    onClick={() => togglePayment(p)}
                                    className={`px-4 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all border ${selectedPayments.includes(p)
                                        ? "bg-emerald-600/20 border-emerald-500/40 text-emerald-300"
                                        : "bg-slate-950/30 border-slate-800 text-slate-500 hover:border-slate-600 hover:text-slate-300"
                                        }`}
                                >
                                    {p}
                                    {selectedPayments.includes(p) && <span className="ml-1.5">✓</span>}
                                </button>
                            ))}
                        </div>
                    </div>
                    <div>
                        <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-4 px-1">Hotel Photos</label>
                        <MultiImageUploader onChange={setImages} maxImages={5} dark />
                    </div>
                    <button disabled={loading} type="submit" className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-black py-5 rounded-[22px] text-[10px] uppercase tracking-[0.2em] transition shadow-xl shadow-indigo-600/20 active:scale-95 flex justify-center items-center gap-3">
                        {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <>Register Hotel <CheckCircle2 className="w-4 h-4" /></>}
                    </button>
                </form>
            </div>
        </div>
    );
}

export function AddRoomModal({ hotelId, onClose, onDone }: { hotelId: string; onClose: () => void; onDone: () => void }) {
    const [loading, setLoading] = useState(false);
    const [images, setImages] = useState<string[]>([]);
    const [selectedAmenities, setSelectedAmenities] = useState<string[]>([]);
    const [petsAllowed, setPetsAllowed] = useState(false);
    const [category, setCategory] = useState(ROOM_CATEGORIES[4]); // Deluxe Room
    const [viewType, setViewType] = useState('City View');
    const [showCategoryDropdown, setShowCategoryDropdown] = useState(false);
    const [showViewTypeDropdown, setShowViewTypeDropdown] = useState(false);

    const toggleAmenity = (id: string) => setSelectedAmenities(prev =>
        prev.includes(id) ? prev.filter(a => a !== id) : [...prev, id]
    );

    const [maxAdults, setMaxAdults] = useState(2);
    const [maxChildren, setMaxChildren] = useState(0);
    const [inventory, setInventory] = useState(1);
    const [floor, setFloor] = useState(1);
    const [beds, setBeds] = useState<Record<string, number>>({});

    const updateBedCount = (type: string, delta: number) => {
        setBeds(prev => ({ ...prev, [type]: Math.max(0, (prev[type] || 0) + delta) }));
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const fd = new FormData(e.currentTarget);
        setLoading(true);
        try {
            await api.addRoom({
                hotelId,
                type: fd.get('type') as string,
                category,
                pricePerNight: Number(fd.get('price')),
                totalInventory: inventory,
                availableCount: inventory,
                floorNumber: floor,
                description: fd.get('description') as string,
                capacity: `${maxAdults + maxChildren} Guests`,
                viewType,
                sizeSqFt: Number(fd.get('sizeSqFt')) || undefined,
                maxAdults,
                maxChildren,
                petsAllowed,
                beds,
                images,
                amenities: selectedAmenities
            });
            onDone();
        } catch (e: any) { alert('Failed: ' + e.message); }
        setLoading(false);
    };

    return (
        <div className='fixed inset-0 bg-slate-950/80 backdrop-blur-md z-[150] flex items-center justify-center p-6'>
            <div className='bg-slate-900 border border-slate-800 rounded-[40px] w-full max-w-xl shadow-2xl overflow-hidden relative'>
                <div className='p-8 border-b border-slate-800 flex justify-between items-center bg-slate-900/50'>
                    <h3 className='font-black text-2xl text-white uppercase tracking-tight'>Add New Room</h3>
                    <button onClick={onClose} className='p-3 bg-slate-800 hover:bg-slate-700 rounded-2xl transition text-slate-400 hover:text-white'>
                        <X className='w-6 h-6' />
                    </button>
                </div>
                <form onSubmit={handleSubmit} className='p-8 space-y-6 max-h-[75vh] overflow-y-auto custom-scrollbar'>
                    <div className='grid grid-cols-2 gap-4'>
                        <div className='relative'>
                            <label className='block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1.5 px-0.5'>Room Category</label>
                            <div className='relative'>
                                <button
                                    type='button'
                                    onClick={() => setShowCategoryDropdown(!showCategoryDropdown)}
                                    className='w-full bg-slate-950/50 border border-slate-800 rounded-2xl px-5 py-3.5 text-xs font-black text-white flex items-center justify-between hover:border-slate-700 transition'
                                >
                                    <span>{category}</span>
                                    <ChevronDown className={`w-4 h-4 text-slate-500 transition-transform ${showCategoryDropdown ? 'rotate-180' : ''}`} />
                                </button>
                                {showCategoryDropdown && (
                                    <div className='absolute top-full left-0 right-0 mt-2 max-h-48 overflow-y-auto bg-slate-900 border border-slate-800 rounded-2xl z-[200] shadow-2xl p-2 custom-scrollbar'>
                                        {ROOM_CATEGORIES.map(c => (
                                            <button
                                                key={c}
                                                type='button'
                                                onClick={() => { setCategory(c); setShowCategoryDropdown(false); }}
                                                className={`w-full text-left px-4 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-wider transition mb-0.5 ${category === c ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}`}
                                            >
                                                {c}
                                            </button>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                        <div>
                            <label className='block text-[9px] font-black text-slate-500 uppercase tracking-widest mb-1.5 px-0.5'>Room Name</label>
                            <input name='type' required className='w-full bg-slate-950/50 border border-slate-800 rounded-2xl px-5 py-3.5 text-xs font-black text-white focus:ring-2 focus:ring-indigo-500 outline-none transition' placeholder='e.g. Delulu' />
                        </div>
                    </div>
                    <div>
                        <label className='block text-[9px] font-black text-slate-500 uppercase tracking-widest mb-1.5 px-0.5'>Floor Number</label>
                        <div className='flex items-center gap-1 bg-slate-950/50 border border-slate-800 rounded-2xl p-1'>
                            <button type='button' onClick={() => setFloor(Math.max(0, floor - 1))} className='w-9 h-9 flex items-center justify-center text-slate-400 hover:text-white hover:bg-slate-800 rounded-xl transition font-black text-lg'>−</button>
                            <span className='flex-1 text-center text-xs font-black text-white'>{floor}</span>
                            <button type='button' onClick={() => setFloor(floor + 1)} className='w-9 h-9 flex items-center justify-center text-slate-400 hover:text-white hover:bg-slate-800 rounded-xl transition font-black text-lg'>+</button>
                        </div>
                    </div>
                    <div className='grid grid-cols-2 gap-4'>
                        <div>
                            <label className='block text-[9px] font-black text-slate-500 uppercase tracking-widest mb-1.5 px-0.5'>Base Price / Night</label>
                            <input name='price' type='number' required className='w-full bg-slate-950/50 border border-slate-800 rounded-2xl px-5 py-3.5 text-xs font-black text-emerald-400 focus:ring-2 focus:ring-indigo-500 outline-none transition' placeholder='৳ 4500' />
                        </div>
                        <div>
                            <label className='block text-[9px] font-black text-slate-500 uppercase tracking-widest mb-1.5 px-0.5'>Inventory</label>
                            <div className='flex items-center gap-1 bg-slate-950/50 border border-slate-800 rounded-2xl p-1'>
                                <button type='button' onClick={() => setInventory(Math.max(1, inventory - 1))} className='w-9 h-9 flex items-center justify-center text-slate-400 hover:text-white hover:bg-slate-800 rounded-xl transition font-black text-lg'>−</button>
                                <span className='flex-1 text-center text-xs font-black text-white'>{inventory}</span>
                                <button type='button' onClick={() => setInventory(inventory + 1)} className='w-9 h-9 flex items-center justify-center text-slate-400 hover:text-white hover:bg-slate-800 rounded-xl transition font-black text-lg'>+</button>
                            </div>
                        </div>
                    </div>
                    <div className='grid grid-cols-3 gap-4'>
                        <div>
                            <label className='block text-[9px] font-black text-slate-500 uppercase tracking-widest mb-1.5 px-0.5'>Capacity</label>
                            <div className='w-full bg-slate-800/30 border border-slate-800/50 rounded-2xl px-5 py-3.5 text-xs font-black text-slate-400 cursor-not-allowed'>
                                {maxAdults + maxChildren} Guests
                            </div>
                        </div>
                        <div className='relative'>
                            <label className='block text-[9px] font-black text-slate-500 uppercase tracking-widest mb-1.5 px-0.5'>View Type</label>
                            <div className='relative'>
                                <button
                                    type='button'
                                    onClick={() => setShowViewTypeDropdown(!showViewTypeDropdown)}
                                    className='w-full bg-slate-950/50 border border-slate-800 rounded-2xl px-5 py-3.5 text-xs font-black text-white flex items-center justify-between hover:border-slate-700 transition'
                                >
                                    <span>{viewType}</span>
                                    <ChevronDown className={`w-4 h-4 text-slate-500 transition-transform ${showViewTypeDropdown ? 'rotate-180' : ''}`} />
                                </button>
                                <input type="hidden" name="viewType" value={viewType} />
                                {showViewTypeDropdown && (
                                    <div className="absolute top-full left-0 right-0 mt-2 max-h-48 overflow-y-auto bg-slate-900 border border-slate-800 rounded-2xl z-[200] shadow-2xl p-2 custom-scrollbar">
                                        {VIEW_TYPES.map(v => (
                                            <button
                                                key={v}
                                                type="button"
                                                onClick={() => { setViewType(v); setShowViewTypeDropdown(false); }}
                                                className={`w-full text-left px-4 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-wider transition mb-0.5 ${viewType === v ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}`}
                                            >
                                                {v}
                                            </button>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                        <div>
                            <label className="block text-[9px] font-black text-slate-500 uppercase tracking-widest mb-1.5 px-0.5">Size (SqFt)</label>
                            <input name="sizeSqFt" type="number" className="w-full bg-slate-950/50 border border-slate-800 rounded-2xl px-5 py-3.5 text-xs font-black text-white focus:ring-2 focus:ring-indigo-500 outline-none transition" placeholder="e.g. 250" />
                        </div>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                        <div>
                            <label className="block text-[9px] font-black text-slate-500 uppercase tracking-widest mb-1.5 px-0.5">Max Adults</label>
                            <div className="flex items-center gap-1 bg-slate-950/50 border border-slate-800 rounded-2xl p-1">
                                <button type="button" onClick={() => setMaxAdults(Math.max(1, maxAdults - 1))} className="w-9 h-9 flex items-center justify-center text-slate-400 hover:text-white hover:bg-slate-800 rounded-xl transition font-black text-lg">−</button>
                                <span className="flex-1 text-center text-xs font-black text-white">{maxAdults}</span>
                                <button type="button" onClick={() => setMaxAdults(maxAdults + 1)} className="w-9 h-9 flex items-center justify-center text-slate-400 hover:text-white hover:bg-slate-800 rounded-xl transition font-black text-lg">+</button>
                            </div>
                        </div>
                        <div>
                            <label className="block text-[9px] font-black text-slate-500 uppercase tracking-widest mb-1.5 px-0.5">Max Children</label>
                            <div className="flex items-center gap-1 bg-slate-950/50 border border-slate-800 rounded-2xl p-1">
                                <button type="button" onClick={() => setMaxChildren(Math.max(0, maxChildren - 1))} className="w-9 h-9 flex items-center justify-center text-slate-400 hover:text-white hover:bg-slate-800 rounded-xl transition font-black text-lg">−</button>
                                <span className="flex-1 text-center text-xs font-black text-white">{maxChildren}</span>
                                <button type="button" onClick={() => setMaxChildren(maxChildren + 1)} className="w-9 h-9 flex items-center justify-center text-slate-400 hover:text-white hover:bg-slate-800 rounded-xl transition font-black text-lg">+</button>
                            </div>
                        </div>
                        <div className="flex flex-col justify-center">
                            <label className="block text-[9px] font-black text-slate-500 uppercase tracking-widest mb-1.5 px-0.5">Pets Allowed</label>
                            <button
                                type="button"
                                onClick={() => setPetsAllowed(!petsAllowed)}
                                className={`w-14 h-7 rounded-full transition-colors relative ${petsAllowed ? 'bg-indigo-600' : 'bg-slate-700'}`}
                            >
                                <div className={`absolute top-1 w-5 h-5 bg-white rounded-full transition-all ${petsAllowed ? 'left-8' : 'left-1'}`} />
                            </button>
                        </div>
                    </div>
                    <div>
                        <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-3 px-1">Room Bed Types</label>
                        <div className="grid grid-cols-2 lg:grid-cols-5 gap-2">
                            {BED_TYPES.map(type => (
                                <div key={type} className="flex flex-col gap-1.5 p-3 bg-slate-950/30 border border-slate-800 rounded-2xl transition">
                                    <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest truncate">{type}</span>
                                    <div className="flex items-center gap-1 justify-between">
                                        <button type="button" onClick={() => updateBedCount(type, -1)} className="w-8 h-8 flex items-center justify-center text-slate-400 hover:text-white hover:bg-slate-800 rounded-xl transition font-black text-lg">−</button>
                                        <span className="text-xs font-black text-white">{beds[type] || 0}</span>
                                        <button type="button" onClick={() => updateBedCount(type, 1)} className="w-8 h-8 flex items-center justify-center text-slate-400 hover:text-white hover:bg-slate-800 rounded-xl transition font-black text-lg">+</button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                    <div>
                        <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-3 px-1">Room Amenities</label>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                            {ROOM_AMENITIES.map(a => (
                                <button
                                    key={a.id}
                                    type="button"
                                    onClick={() => toggleAmenity(a.id)}
                                    className={`flex items-center gap-2 px-3 py-2.5 rounded-xl text-[10px] font-bold transition-all border ${selectedAmenities.includes(a.id)
                                        ? "bg-indigo-600/20 border-indigo-500/40 text-indigo-300"
                                        : "bg-slate-950/30 border-slate-800 text-slate-500 hover:border-slate-600 hover:text-slate-300"
                                        }`}
                                >
                                    <span>{a.icon}</span>
                                    <span className="uppercase tracking-wider truncate">{a.label}</span>
                                </button>
                            ))}
                        </div>
                    </div>
                    <div>
                        <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2 px-1">Room Description</label>
                        <textarea name="description" rows={3} required className="w-full bg-slate-950/50 border border-slate-800 rounded-2xl px-5 py-4 text-xs font-medium text-white focus:ring-2 focus:ring-indigo-500 outline-none transition resize-none" placeholder="Features, Bed size, Amenities..." />
                    </div>
                    <div>
                        <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-4 px-1">Room Photos</label>
                        <MultiImageUploader onChange={setImages} maxImages={5} dark />
                    </div>
                    <button disabled={loading} type="submit" className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-black py-5 rounded-[22px] text-[10px] uppercase tracking-[0.2em] transition shadow-xl shadow-indigo-600/20 active:scale-95 flex justify-center items-center gap-3">
                        {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <>Add Room <CheckCircle2 className="w-4 h-4" /></>}
                    </button>
                </form>
            </div>
        </div>
    );
}

export function RoomModal({ room, onClose, onDone }: { room: any; onClose: () => void; onDone: () => void }) {
    const [loading, setLoading] = useState(false);
    const [images, setImages] = useState<string[]>(room?.images || []);
    const [selectedAmenities, setSelectedAmenities] = useState<string[]>(room?.amenities || []);
    const [petsAllowed, setPetsAllowed] = useState(room?.petsAllowed || false);
    const [category, setCategory] = useState(room?.category || ROOM_CATEGORIES[4]);
    const [viewType, setViewType] = useState(room?.viewType || 'City View');
    const [showCategoryDropdown, setShowCategoryDropdown] = useState(false);
    const [showViewTypeDropdown, setShowViewTypeDropdown] = useState(false);
    const [maxAdults, setMaxAdults] = useState(room?.maxAdults || 2);
    const [maxChildren, setMaxChildren] = useState(room?.maxChildren || 0);
    const [inventory, setInventory] = useState(room?.totalInventory || 1);
    const [floor, setFloor] = useState(room?.floorNumber || 1);
    const [beds, setBeds] = useState<Record<string, number>>(room?.beds || {});

    const updateBedCount = (type: string, delta: number) => {
        setBeds(prev => ({ ...prev, [type]: Math.max(0, (prev[type] || 0) + delta) }));
    };

    const toggleAmenity = (id: string) => setSelectedAmenities(prev =>
        prev.includes(id) ? prev.filter(a => a !== id) : [...prev, id]
    );

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const fd = new FormData(e.currentTarget);
        setLoading(true);
        try {
            await api.updateRoom(room.id, {
                type: fd.get("type") as any,
                category,
                pricePerNight: Number(fd.get("price")),
                totalInventory: inventory,
                availableCount: inventory,
                floorNumber: floor,
                description: fd.get("description") as string,
                capacity: `${maxAdults + maxChildren} Guests`,
                viewType: fd.get("viewType") as string,
                sizeSqFt: Number(fd.get("sizeSqFt")) || undefined,
                maxAdults,
                maxChildren,
                petsAllowed,
                beds,
                images,
                amenities: selectedAmenities
            });
            onDone();
        } catch (e: any) { alert("Failed: " + e.message); }
        setLoading(false);
    };

    return (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md z-[150] flex items-center justify-center p-6">
            <div className="bg-slate-900 border border-slate-800 rounded-[40px] w-full max-w-xl shadow-2xl overflow-hidden relative">
                <div className="p-8 border-b border-slate-800 flex justify-between items-center bg-slate-900/50">
                    <h3 className="font-black text-2xl text-white uppercase tracking-tight">Edit Room Details</h3>
                    <button onClick={onClose} className="p-3 bg-slate-800 hover:bg-slate-700 rounded-2xl transition text-slate-400 hover:text-white">
                        <X className="w-6 h-6" />
                    </button>
                </div>
                <form onSubmit={handleSubmit} className="p-8 space-y-6 max-h-[75vh] overflow-y-auto custom-scrollbar">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="relative">
                            <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1.5 px-0.5">Room Category</label>
                            <div className="relative">
                                <button
                                    type="button"
                                    onClick={() => setShowCategoryDropdown(!showCategoryDropdown)}
                                    className="w-full bg-slate-950/50 border border-slate-800 rounded-2xl px-5 py-3.5 text-xs font-black text-white flex items-center justify-between hover:border-slate-700 transition"
                                >
                                    <span>{category}</span>
                                    <ChevronDown className={`w-4 h-4 text-slate-500 transition-transform ${showCategoryDropdown ? "rotate-180" : ""}`} />
                                </button>
                                {showCategoryDropdown && (
                                    <div className="absolute top-full left-0 right-0 mt-2 max-h-48 overflow-y-auto bg-slate-900 border border-slate-800 rounded-2xl z-[200] shadow-2xl p-2 custom-scrollbar">
                                        {ROOM_CATEGORIES.map(c => (
                                            <button
                                                key={c}
                                                type="button"
                                                onClick={() => { setCategory(c); setShowCategoryDropdown(false); }}
                                                className={`w-full text-left px-4 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-wider transition mb-0.5 ${category === c ? "bg-indigo-600 text-white" : "text-slate-400 hover:bg-slate-800 hover:text-white"}`}
                                            >
                                                {c}
                                            </button>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                        <div>
                            <label className="block text-[9px] font-black text-slate-500 uppercase tracking-widest mb-1.5 px-0.5">Room Name</label>
                            <input name="type" required defaultValue={room?.type} className="w-full bg-slate-950/50 border border-slate-800 rounded-2xl px-5 py-3.5 text-xs font-black text-white focus:ring-2 focus:ring-indigo-500 outline-none transition" />
                        </div>
                    </div>
                    <div>
                        <label className="block text-[9px] font-black text-slate-500 uppercase tracking-widest mb-1.5 px-0.5">Floor Number</label>
                        <div className="flex items-center gap-1 bg-slate-950/50 border border-slate-800 rounded-2xl p-1">
                            <button type="button" onClick={() => setFloor(Math.max(0, floor - 1))} className="w-9 h-9 flex items-center justify-center text-slate-400 hover:text-white hover:bg-slate-800 rounded-xl transition font-black text-lg">−</button>
                            <span className="flex-1 text-center text-xs font-black text-white">{floor}</span>
                            <button type="button" onClick={() => setFloor(floor + 1)} className="w-9 h-9 flex items-center justify-center text-slate-400 hover:text-white hover:bg-slate-800 rounded-xl transition font-black text-lg">+</button>
                        </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-[9px] font-black text-slate-500 uppercase tracking-widest mb-1.5 px-0.5">Price / Night</label>
                            <input name="price" type="number" required defaultValue={room?.pricePerNight} className="w-full bg-slate-950/50 border border-slate-800 rounded-2xl px-5 py-3.5 text-xs font-black text-emerald-400 focus:ring-2 focus:ring-indigo-500 outline-none transition" />
                        </div>
                        <div>
                            <label className="block text-[9px] font-black text-slate-500 uppercase tracking-widest mb-1.5 px-0.5">Total Rooms</label>
                            <div className="flex items-center gap-1 bg-slate-950/50 border border-slate-800 rounded-2xl p-1">
                                <button type="button" onClick={() => setInventory(Math.max(1, inventory - 1))} className="w-9 h-9 flex items-center justify-center text-slate-400 hover:text-white hover:bg-slate-800 rounded-xl transition font-black text-lg">−</button>
                                <span className="flex-1 text-center text-xs font-black text-white">{inventory}</span>
                                <button type="button" onClick={() => setInventory(inventory + 1)} className="w-9 h-9 flex items-center justify-center text-slate-400 hover:text-white hover:bg-slate-800 rounded-xl transition font-black text-lg">+</button>
                            </div>
                        </div>
                    </div>
                    <div className="grid grid-cols-3 gap-4">
                        <div>
                            <label className="block text-[9px] font-black text-slate-500 uppercase tracking-widest mb-1.5 px-0.5">Capacity</label>
                            <div className="w-full bg-slate-800/30 border border-slate-800/50 rounded-2xl px-5 py-3.5 text-xs font-black text-slate-400 cursor-not-allowed">
                                {maxAdults + maxChildren} Guests
                            </div>
                        </div>
                        <div className="relative">
                            <label className="block text-[9px] font-black text-slate-500 uppercase tracking-widest mb-1.5 px-0.5">View Type</label>
                            <div className="relative">
                                <button
                                    type="button"
                                    onClick={() => setShowViewTypeDropdown(!showViewTypeDropdown)}
                                    className="w-full bg-slate-950/50 border border-slate-800 rounded-2xl px-5 py-3.5 text-xs font-black text-white flex items-center justify-between hover:border-slate-700 transition"
                                >
                                    <span>{viewType}</span>
                                    <ChevronDown className={`w-4 h-4 text-slate-500 transition-transform ${showViewTypeDropdown ? 'rotate-180' : ''}`} />
                                </button>
                                <input type="hidden" name="viewType" value={viewType} />
                                {showViewTypeDropdown && (
                                    <div className="absolute top-full left-0 right-0 mt-2 max-h-48 overflow-y-auto bg-slate-900 border border-slate-800 rounded-2xl z-[200] shadow-2xl p-2 custom-scrollbar">
                                        {VIEW_TYPES.map(v => (
                                            <button
                                                key={v}
                                                type="button"
                                                onClick={() => { setViewType(v); setShowViewTypeDropdown(false); }}
                                                className={`w-full text-left px-4 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-wider transition mb-0.5 ${viewType === v ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}`}
                                            >
                                                {v}
                                            </button>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                        <div>
                            <label className="block text-[9px] font-black text-slate-500 uppercase tracking-widest mb-1.5 px-0.5">Size (SqFt)</label>
                            <input name="sizeSqFt" type="number" defaultValue={room?.sizeSqFt} className="w-full bg-slate-950/50 border border-slate-800 rounded-2xl px-5 py-3.5 text-xs font-black text-white focus:ring-2 focus:ring-indigo-500 outline-none transition" />
                        </div>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                        <div>
                            <label className="block text-[9px] font-black text-slate-500 uppercase tracking-widest mb-1.5 px-0.5">Max Adults</label>
                            <div className="flex items-center gap-1 bg-slate-950/50 border border-slate-800 rounded-2xl p-1">
                                <button type="button" onClick={() => setMaxAdults(Math.max(1, maxAdults - 1))} className="w-9 h-9 flex items-center justify-center text-slate-400 hover:text-white hover:bg-slate-800 rounded-xl transition font-black text-lg">−</button>
                                <span className="flex-1 text-center text-xs font-black text-white">{maxAdults}</span>
                                <button type="button" onClick={() => setMaxAdults(maxAdults + 1)} className="w-9 h-9 flex items-center justify-center text-slate-400 hover:text-white hover:bg-slate-800 rounded-xl transition font-black text-lg">+</button>
                            </div>
                        </div>
                        <div>
                            <label className="block text-[9px] font-black text-slate-500 uppercase tracking-widest mb-1.5 px-0.5">Max Children</label>
                            <div className="flex items-center gap-1 bg-slate-950/50 border border-slate-800 rounded-2xl p-1">
                                <button type="button" onClick={() => setMaxChildren(Math.max(0, maxChildren - 1))} className="w-9 h-9 flex items-center justify-center text-slate-400 hover:text-white hover:bg-slate-800 rounded-xl transition font-black text-lg">−</button>
                                <span className="flex-1 text-center text-xs font-black text-white">{maxChildren}</span>
                                <button type="button" onClick={() => setMaxChildren(maxChildren + 1)} className="w-9 h-9 flex items-center justify-center text-slate-400 hover:text-white hover:bg-slate-800 rounded-xl transition font-black text-lg">+</button>
                            </div>
                        </div>
                        <div className="flex flex-col justify-center">
                            <label className="block text-[9px] font-black text-slate-500 uppercase tracking-widest mb-1.5 px-0.5">Pets Allowed</label>
                            <button
                                type="button"
                                onClick={() => setPetsAllowed(!petsAllowed)}
                                className={`w-14 h-7 rounded-full transition-colors relative ${petsAllowed ? 'bg-indigo-600' : 'bg-slate-700'}`}
                            >
                                <div className={`absolute top-1 w-5 h-5 bg-white rounded-full transition-all ${petsAllowed ? 'left-8' : 'left-1'}`} />
                            </button>
                        </div>
                    </div>
                    <div>
                        <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-3 px-1">Room Bed Types</label>
                        <div className="grid grid-cols-2 lg:grid-cols-5 gap-2">
                            {BED_TYPES.map(type => (
                                <div key={type} className="flex flex-col gap-1.5 p-3 bg-slate-950/30 border border-slate-800 rounded-2xl transition">
                                    <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest truncate">{type}</span>
                                    <div className="flex items-center gap-1 justify-between">
                                        <button type="button" onClick={() => updateBedCount(type, -1)} className="w-8 h-8 flex items-center justify-center text-slate-400 hover:text-white hover:bg-slate-800 rounded-xl transition font-black text-lg">−</button>
                                        <span className="text-xs font-black text-white">{beds[type] || 0}</span>
                                        <button type="button" onClick={() => updateBedCount(type, 1)} className="w-8 h-8 flex items-center justify-center text-slate-400 hover:text-white hover:bg-slate-800 rounded-xl transition font-black text-lg">+</button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                    <div>
                        <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-3 px-1">Update Amenities</label>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                            {ROOM_AMENITIES.map(a => (
                                <button
                                    key={a.id}
                                    type="button"
                                    onClick={() => toggleAmenity(a.id)}
                                    className={`flex items-center gap-2 px-3 py-2.5 rounded-xl text-[10px] font-bold transition-all border ${selectedAmenities.includes(a.id)
                                        ? "bg-indigo-600/20 border-indigo-500/40 text-indigo-300"
                                        : "bg-slate-950/30 border-slate-800 text-slate-500 hover:border-slate-600 hover:text-slate-300"
                                        }`}
                                >
                                    <span>{a.icon}</span>
                                    <span className="uppercase tracking-wider truncate">{a.label}</span>
                                </button>
                            ))}
                        </div>
                    </div>
                    <div>
                        <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2 px-1">Description</label>
                        <textarea name="description" rows={3} required defaultValue={room?.description} className="w-full bg-slate-950/50 border border-slate-800 rounded-2xl px-5 py-4 text-xs font-medium text-white focus:ring-2 focus:ring-indigo-500 outline-none transition resize-none" />
                    </div>
                    <div>
                        <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-4 px-1">Update Photos</label>
                        <MultiImageUploader initialImages={images} onChange={setImages} maxImages={5} dark />
                    </div>
                    <button disabled={loading} type="submit" className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-black py-5 rounded-[22px] text-[10px] uppercase tracking-[0.2em] transition shadow-xl shadow-indigo-600/20 active:scale-95 flex justify-center items-center gap-3">
                        {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <>Save Changes <CheckCircle2 className="w-4 h-4" /></>}
                    </button>
                </form>
            </div>
        </div>
    );
}

export function AddPricingModal({ hotelId, rooms, onClose, onDone }: {
    hotelId: string;
    rooms: any[];
    onClose: () => void;
    onDone: () => void;
}) {
    const [label, setLabel] = useState("");
    const [roomId, setRoomId] = useState(rooms[0]?.id || "");
    const [multiplier, setMultiplier] = useState(1.2);
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");
    const [loading, setLoading] = useState(false);

    const submit = async () => {
        if (!label || !startDate || !endDate) return;
        setLoading(true);
        await api.addPricingRule({ hotelId, roomId, label, multiplier, startDate, endDate, isActive: true });
        setLoading(false);
        onDone();
    };

    return (
        <div className="fixed inset-0 bg-black/70 z-[150] flex justify-center items-center p-4 backdrop-blur-sm">
            <div className="bg-slate-900 border border-slate-700 rounded-[32px] w-full max-w-md shadow-2xl overflow-hidden">
                <div className="flex justify-between items-center p-6 border-b border-slate-800">
                    <div>
                        <h2 className="text-lg font-black text-white uppercase tracking-tight">New Pricing Rule</h2>
                        <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mt-1">Configure rate multiplier for a period</p>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-slate-800 rounded-2xl transition text-slate-400 hover:text-white">
                        <X className="w-5 h-5" />
                    </button>
                </div>
                <div className="p-8 space-y-6">
                    <div>
                        <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">Rule Label</label>
                        <input
                            value={label} onChange={e => setLabel(e.target.value)}
                            className="w-full bg-slate-800 border border-slate-700 rounded-2xl px-4 py-3 text-sm text-white placeholder:text-slate-600 focus:ring-2 focus:ring-indigo-500 outline-none"
                            placeholder="e.g. Weekend Special, Eid Offer..."
                        />
                    </div>
                    <div>
                        <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">Target Room</label>
                        <select
                            value={roomId} onChange={e => setRoomId(e.target.value)}
                            className="w-full bg-slate-800 border border-slate-700 rounded-2xl px-4 py-3 text-sm text-white outline-none focus:ring-2 focus:ring-indigo-500"
                        >
                            {rooms.map(r => <option key={r.id} value={r.id} className="bg-slate-900">{r.type} — Floor {r.floorNumber}</option>)}
                        </select>
                    </div>
                    <div>
                        <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">Price Multiplier: <span className="text-indigo-400">{multiplier}x</span></label>
                        <input
                            type="range" min={0.5} max={3} step={0.05}
                            value={multiplier} onChange={e => setMultiplier(+e.target.value)}
                            className="w-full accent-indigo-500"
                        />
                        <div className="flex justify-between text-[9px] text-slate-600 font-bold uppercase mt-1">
                            <span>50% off</span><span>Normal (1x)</span><span>3x Premium</span>
                        </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">Start Date</label>
                            <input type="date" value={startDate} onChange={e => setStartDate(e.target.value)}
                                className="w-full bg-slate-800 border border-slate-700 rounded-2xl px-4 py-3 text-sm text-white outline-none focus:ring-2 focus:ring-indigo-500"
                            />
                        </div>
                        <div>
                            <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">End Date</label>
                            <input type="date" value={endDate} onChange={e => setEndDate(e.target.value)}
                                className="w-full bg-slate-800 border border-slate-700 rounded-2xl px-4 py-3 text-sm text-white outline-none focus:ring-2 focus:ring-indigo-500"
                            />
                        </div>
                    </div>

                    <div className="bg-slate-800/50 rounded-2xl p-4 border border-slate-700">
                        <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">Price Preview</p>
                        <p className="text-white font-black text-lg">
                            {rooms.find(r => r.id === roomId)
                                ? <>৳{Math.round((rooms.find(r => r.id === roomId)?.pricePerNight || 0) * multiplier).toLocaleString()}<span className="text-slate-500 text-sm font-bold"> /night</span></>
                                : "—"
                            }
                        </p>
                    </div>

                    <div className="flex gap-4">
                        <button onClick={onClose} className="flex-1 py-4 rounded-2xl bg-slate-800 text-slate-400 text-[10px] font-black uppercase tracking-widest hover:bg-slate-700 border border-slate-700 transition">Cancel</button>
                        <button onClick={submit} disabled={loading || !label || !startDate || !endDate}
                            className="flex-1 py-4 rounded-2xl bg-indigo-600 text-white text-[10px] font-black uppercase tracking-widest hover:bg-indigo-500 transition shadow-xl shadow-indigo-600/20 active:scale-95 disabled:opacity-50"
                        >
                            {loading ? <Loader2 className="w-4 h-4 animate-spin mx-auto" /> : "Apply Rule"}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export function AddExperienceModal({
    ownerId,
    hotelId,
    hotelName,
    onClose,
    onDone,
}: {
    ownerId: string;
    hotelId?: string;
    hotelName?: string;
    onClose: () => void;
    onDone: () => void;
}) {
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [city, setCity] = useState("");
    const [location, setLocation] = useState("");
    const [category, setCategory] = useState<"original" | "standard">("standard");
    const [badge, setBadge] = useState("Popular");
    const [price, setPrice] = useState(25);
    const [rating, setRating] = useState(4.8);
    const [reviews, setReviews] = useState(0);
    const [duration, setDuration] = useState("2 hours");
    const [maxGuests, setMaxGuests] = useState(6);
    const [isActive, setIsActive] = useState(true);
    const [uploadedImages, setUploadedImages] = useState<string[]>([]);
    const [meetingPoint, setMeetingPoint] = useState("");
    const [hostName, setHostName] = useState("");
    const [amenitiesStr, setAmenitiesStr] = useState("");
    const [servicesStr, setServicesStr] = useState("");
    const [whatIncludesStr, setWhatIncludesStr] = useState("");
    const [tagsStr, setTagsStr] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const submit = async () => {
        setError("");
        if (!title.trim()) { setError("Title is required"); return; }
        if (!city.trim()) { setError("City is required"); return; }
        if (!location.trim()) { setError("Location is required"); return; }
        if (price <= 0) { setError("Price must be greater than 0"); return; }
        setLoading(true);
        try {
            const coverImage = uploadedImages[0] || "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600";
            await api.addExperience({
                ownerId, hotelId, hotelName,
                title: title.trim(), description: description.trim(),
                city: city.trim(), location: location.trim(), category,
                badge: badge.trim() || (category === "original" ? "Original" : "Popular"),
                price, rating, reviews, duration: duration.trim() || undefined,
                maxGuests, image: coverImage,
                images: uploadedImages.length > 0 ? uploadedImages : [coverImage],
                meetingPoint: meetingPoint.trim() || undefined,
                hostName: hostName.trim() || undefined,
                amenities: amenitiesStr.split(",").map(s => s.trim()).filter(Boolean),
                services: servicesStr.split(",").map(s => s.trim()).filter(Boolean),
                whatIncludes: whatIncludesStr.split(",").map(s => s.trim()).filter(Boolean),
                tags: tagsStr.split(",").map(s => s.trim()).filter(Boolean),
                isActive,
            });
            onDone();
        } catch { setError("Failed to publish. Try again."); }
        setLoading(false);
    };

    return (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-[150] flex items-center justify-center p-6 animate-in fade-in duration-300">
            <div className="bg-slate-900 border border-slate-800 rounded-[40px] w-full max-w-2xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
                <div className="p-8 border-b border-slate-800 flex justify-between items-center bg-slate-900/50 shrink-0">
                    <div>
                        <h3 className="font-black text-2xl text-white uppercase tracking-tight">Publish Experience</h3>
                        <p className="text-slate-500 text-[10px] font-black uppercase tracking-widest mt-1 italic">Card will appear live on the public Experiences page</p>
                    </div>
                    <button onClick={onClose} className="p-3 bg-slate-800 hover:bg-slate-700 rounded-2xl transition text-slate-400 hover:text-white">
                        <X className="w-6 h-6" />
                    </button>
                </div>
                <div className="p-8 space-y-6 overflow-y-auto custom-scrollbar">
                    {error && (
                        <div className="bg-rose-500/10 p-4 rounded-2xl border border-rose-500/20">
                            <p className="text-rose-400 text-xs font-black uppercase tracking-widest">{error}</p>
                        </div>
                    )}
                    <div>
                        <label className="block text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] mb-3 ml-1">Experience Photos <span className="ml-2 text-indigo-400 normal-case font-bold">(Max 5 photos)</span></label>
                        <div className="bg-slate-950/50 border border-slate-800 rounded-2xl p-4">
                            <MultiImageUploader onChange={setUploadedImages} maxImages={5} dark />
                            {uploadedImages.length === 0 && (
                                <p className="text-[10px] text-slate-600 font-bold uppercase tracking-widest mt-3 text-center">First photo will be used as the Cover Image</p>
                            )}
                        </div>
                    </div>
                    <div className="grid grid-cols-1 gap-4">
                        <div>
                            <label className="block text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] mb-2 ml-1">Experience Title *</label>
                            <input className="w-full bg-slate-950/50 border border-slate-800 rounded-2xl px-5 py-4 text-sm font-medium text-white placeholder:text-slate-700 focus:ring-2 focus:ring-indigo-500 outline-none transition" placeholder="e.g. Traditional Tea Ceremony..." value={title} onChange={e => setTitle(e.target.value)} />
                        </div>
                        <div>
                            <label className="block text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] mb-2 ml-1">Description</label>
                            <textarea rows={3} className="w-full bg-slate-950/50 border border-slate-800 rounded-2xl px-5 py-4 text-sm font-medium text-white placeholder:text-slate-700 focus:ring-2 focus:ring-indigo-500 outline-none transition resize-none" placeholder="Describe what guests will experience..." value={description} onChange={e => setDescription(e.target.value)} />
                        </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] mb-2 ml-1">City *</label>
                            <input className="w-full bg-slate-950/50 border border-slate-800 rounded-2xl px-5 py-4 text-sm font-medium text-white placeholder:text-slate-700 focus:ring-2 focus:ring-indigo-500 outline-none transition" placeholder="e.g. Dhaka" value={city} onChange={e => setCity(e.target.value)} />
                        </div>
                        <div>
                            <label className="block text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] mb-2 ml-1">Location *</label>
                            <input className="w-full bg-slate-950/50 border border-slate-800 rounded-2xl px-5 py-4 text-sm font-medium text-white placeholder:text-slate-700 focus:ring-2 focus:ring-indigo-500 outline-none transition" placeholder="e.g. Gulshan, Dhaka" value={location} onChange={e => setLocation(e.target.value)} />
                        </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] mb-2 ml-1">Category</label>
                            <div className="flex gap-2">
                                {(["standard", "original"] as const).map(c => (
                                    <button key={c} type="button" onClick={() => { setCategory(c); setBadge(c === "original" ? "Original" : "Popular"); }} className={`flex-1 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest border transition-all ${category === c ? "bg-indigo-600 border-indigo-500 text-white shadow-lg shadow-indigo-600/20" : "bg-slate-950/30 border-slate-800 text-slate-500 hover:text-white hover:border-slate-700"}`}>
                                        {c}
                                    </button>
                                ))}
                            </div>
                        </div>
                        <div>
                            <label className="block text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] mb-2 ml-1">Badge Label</label>
                            <input className="w-full bg-slate-950/50 border border-slate-800 rounded-2xl px-5 py-4 text-sm font-medium text-white placeholder:text-slate-700 focus:ring-2 focus:ring-indigo-500 outline-none transition" placeholder="e.g. Popular, Original, New" value={badge} onChange={e => setBadge(e.target.value)} />
                        </div>
                    </div>
                    <div>
                        <label className="block text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] mb-2 ml-1">Tags (Comma Separated)</label>
                        <input className="w-full bg-slate-950/50 border border-slate-800 rounded-2xl px-5 py-4 text-sm font-medium text-white placeholder:text-slate-700 focus:ring-2 focus:ring-indigo-500 outline-none transition" placeholder="e.g. Chef, Massage, Training, Food" value={tagsStr} onChange={e => setTagsStr(e.target.value)} />
                    </div>
                    <div className="grid grid-cols-3 gap-4">
                        <div>
                            <label className="block text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] mb-2 ml-1">Price (৳/guest) *</label>
                            <input type="number" min={1} className="w-full bg-slate-950/50 border border-slate-800 rounded-2xl px-5 py-4 text-sm font-black text-emerald-400 focus:ring-2 focus:ring-indigo-500 outline-none transition" value={price} onChange={e => setPrice(+e.target.value)} />
                        </div>
                        <div>
                            <label className="block text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] mb-2 ml-1">Rating (0-5)</label>
                            <input type="number" min={0} max={5} step={0.01} className="w-full bg-slate-950/50 border border-slate-800 rounded-2xl px-5 py-4 text-sm font-black text-amber-400 focus:ring-2 focus:ring-indigo-500 outline-none transition" value={rating} onChange={e => setRating(+e.target.value)} />
                        </div>
                        <div>
                            <label className="block text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] mb-2 ml-1">Review Count</label>
                            <input type="number" min={0} className="w-full bg-slate-950/50 border border-slate-800 rounded-2xl px-5 py-4 text-sm font-black text-white focus:ring-2 focus:ring-indigo-500 outline-none transition" value={reviews} onChange={e => setReviews(+e.target.value)} />
                        </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] mb-2 ml-1">Duration</label>
                            <input className="w-full bg-slate-950/50 border border-slate-800 rounded-2xl px-5 py-4 text-sm font-medium text-white placeholder:text-slate-700 focus:ring-2 focus:ring-indigo-500 outline-none transition" placeholder="e.g. 2 hours" value={duration} onChange={e => setDuration(e.target.value)} />
                        </div>
                        <div>
                            <label className="block text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] mb-2 ml-1">Max Guests</label>
                            <input type="number" min={1} max={50} className="w-full bg-slate-950/50 border border-slate-800 rounded-2xl px-5 py-4 text-sm font-black text-white focus:ring-2 focus:ring-indigo-500 outline-none transition" value={maxGuests} onChange={e => setMaxGuests(+e.target.value)} />
                        </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] mb-2 ml-1">Meeting Point</label>
                            <input className="w-full bg-slate-950/50 border border-slate-800 rounded-2xl px-5 py-4 text-sm font-medium text-white placeholder:text-slate-700 focus:ring-2 focus:ring-indigo-500 outline-none transition" placeholder="e.g. Hotel Lobby" value={meetingPoint} onChange={e => setMeetingPoint(e.target.value)} />
                        </div>
                        <div>
                            <label className="block text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] mb-2 ml-1">Host Name</label>
                            <input className="w-full bg-slate-950/50 border border-slate-800 rounded-2xl px-5 py-4 text-sm font-medium text-white placeholder:text-slate-700 focus:ring-2 focus:ring-indigo-500 outline-none transition" placeholder="e.g. Habib Usta" value={hostName} onChange={e => setHostName(e.target.value)} />
                        </div>
                    </div>
                    <div>
                        <label className="block text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] mb-2 ml-1">Amenities (comma separated)</label>
                        <input className="w-full bg-slate-950/50 border border-slate-800 rounded-2xl px-5 py-4 text-sm font-medium text-white placeholder:text-slate-700 focus:ring-2 focus:ring-indigo-500 outline-none transition" placeholder="e.g. WiFi, Air Conditioning..." value={amenitiesStr} onChange={e => setAmenitiesStr(e.target.value)} />
                    </div>
                    <div className="bg-indigo-600/10 rounded-3xl p-5 border border-indigo-500/20 flex items-center justify-between">
                        <div>
                            <p className="text-[10px] font-black text-indigo-400 uppercase tracking-widest mb-1">Publish Immediately</p>
                            <p className="text-slate-400 text-xs font-medium">Card goes live on Experiences page right away</p>
                        </div>
                        <button type="button" onClick={() => setIsActive(!isActive)} className={`w-14 h-7 rounded-full transition-colors duration-300 relative ${isActive ? "bg-indigo-600" : "bg-slate-700"}`}>
                            <span className={`absolute top-0.5 w-6 h-6 bg-white rounded-full shadow-md transition-all duration-300 ${isActive ? "left-7" : "left-0.5"}`} />
                        </button>
                    </div>
                </div>
                <div className="p-8 border-t border-slate-800 bg-slate-950/50 flex gap-4 shrink-0">
                    <button onClick={onClose} className="flex-1 bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white py-5 rounded-[22px] text-[10px] font-black uppercase tracking-widest transition-all active:scale-95 border border-slate-700">Cancel</button>
                    <button disabled={loading} onClick={submit} className="flex-1 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-60 text-white py-5 rounded-[22px] text-[10px] font-black uppercase tracking-widest transition-all shadow-xl shadow-indigo-600/20 active:scale-95 flex items-center justify-center gap-3">
                        {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Star className="w-4 h-4" />}
                        Publish Experience
                    </button>
                </div>
            </div>
        </div>
    );
}

export function AddOfferModal({ hotel, onClose, onDone }: { hotel: Hotel; onClose: () => void; onDone: () => void }) {
    const [title, setTitle] = useState("");
    const [discountPercent, setDiscountPercent] = useState(25);
    const [imageUrl, setImageUrl] = useState("");
    const [imageName, setImageName] = useState("");
    const [startDate, setStartDate] = useState<string>("");
    const [endDate, setEndDate] = useState<string>("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const onPickImage: React.ChangeEventHandler<HTMLInputElement> = (e) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setError("");
        if (!file.type.startsWith("image/")) {
            setError("Please select an image file");
            return;
        }

        const maxBytes = 1024 * 1024;
        if (file.size > maxBytes) {
            setError("Image is too large (max 1MB)");
            return;
        }

        setImageName(file.name);
        const reader = new FileReader();
        reader.onload = () => {
            const result = typeof reader.result === "string" ? reader.result : "";
            setImageUrl(result);
        };
        reader.onerror = () => {
            setError("Failed to read image");
        };
        reader.readAsDataURL(file);
    };

    const submit = async () => {
        setError("");
        if (!title.trim()) {
            setError("Offer title is required");
            return;
        }
        if (discountPercent <= 0 || discountPercent > 100) {
            setError("Discount must be between 1 and 100");
            return;
        }
        setLoading(true);
        try {
            await api.addOffer({
                hotelId: hotel.id,
                hotelName: hotel.name,
                title: title.trim().toUpperCase(),
                discountPercent,
                imageUrl: imageUrl.trim() || undefined,
                isActive: true,
                startDate: startDate || undefined,
                endDate: endDate || undefined,
            });
            onDone();
        } catch (e: any) {
            setError(e.message || "Failed to create offer");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-[150] flex items-center justify-center p-6 animate-in fade-in duration-300">
            <div className="bg-slate-900 border border-slate-800 rounded-[40px] w-full max-w-md shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
                <div className="p-8 border-b border-slate-800 flex justify-between items-center bg-slate-900/50">
                    <div>
                        <h3 className="font-black text-2xl text-white uppercase tracking-tight">Create Offer</h3>
                        <p className="text-slate-500 text-[10px] font-black uppercase tracking-widest mt-1 italic">Publish discount banner to user terminal</p>
                    </div>
                    <button onClick={onClose} className="p-3 bg-slate-800 hover:bg-slate-700 rounded-2xl transition text-slate-400 hover:text-white">
                        <X className="w-6 h-6" />
                    </button>
                </div>

                <div className="p-10 space-y-6 bg-slate-900/30 overflow-y-auto custom-scrollbar">
                    {error && (
                        <div className="bg-rose-500/10 p-4 rounded-2xl border border-rose-500/20">
                            <p className="text-rose-400 text-xs font-black uppercase tracking-widest">{error}</p>
                        </div>
                    )}
                    <div>
                        <label className="block text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] mb-3 ml-1">Offer Title</label>
                        <input
                            className="w-full bg-slate-950/50 border border-slate-800 rounded-2xl px-6 py-4 text-sm font-medium text-white placeholder:text-slate-700 focus:ring-2 focus:ring-indigo-500 outline-none transition"
                            placeholder="e.g. EID DEAL / SUMMER SALE"
                            value={title}
                            onChange={e => setTitle(e.target.value)}
                        />
                    </div>

                    <div>
                        <label className="block text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] mb-3 ml-1">Discount Percent</label>
                        <input
                            type="number"
                            min={1}
                            max={100}
                            className="w-full bg-slate-950/50 border border-slate-800 rounded-2xl px-6 py-4 text-sm font-black text-white focus:ring-2 focus:ring-indigo-500 outline-none transition"
                            value={discountPercent}
                            onChange={e => setDiscountPercent(+e.target.value)}
                        />
                    </div>

                    <div>
                        <label className="block text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] mb-3 ml-1">Offer Image (Optional)</label>
                        <div className="w-full bg-slate-950/50 border border-slate-800 rounded-2xl px-6 py-4">
                            <div className="flex items-center justify-between gap-4">
                                <div className="min-w-0">
                                    <p className="text-xs font-black text-white uppercase tracking-tight truncate">{imageName || "No image selected"}</p>
                                    <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">PNG/JPG • max 1MB</p>
                                </div>
                                <label className="px-4 py-2 rounded-xl bg-slate-800/60 text-slate-300 border border-slate-700/60 hover:bg-slate-800 hover:text-white transition-all text-[10px] font-black uppercase tracking-widest cursor-pointer shrink-0">
                                    Choose
                                    <input type="file" accept="image/*" className="hidden" onChange={onPickImage} />
                                </label>
                            </div>

                            {imageUrl && (
                                <div className="mt-4 flex items-center gap-4">
                                    <img src={imageUrl} alt="Offer" className="w-14 h-14 rounded-2xl object-cover border border-slate-800" />
                                    <button
                                        type="button"
                                        onClick={() => { setImageUrl(""); setImageName(""); }}
                                        className="px-4 py-2 rounded-xl bg-rose-500/10 text-rose-400 border border-rose-500/20 hover:bg-rose-500 hover:text-white transition-all text-[10px] font-black uppercase tracking-widest active:scale-95"
                                    >
                                        Remove
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-6">
                        <div>
                            <label className="block text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] mb-3 ml-1">Start Date (Optional)</label>
                            <input
                                type="date"
                                className="w-full bg-slate-950/50 border border-slate-800 rounded-2xl px-6 py-4 text-sm font-black text-white focus:ring-2 focus:ring-indigo-500 outline-none transition"
                                value={startDate}
                                onChange={e => setStartDate(e.target.value)}
                            />
                        </div>
                        <div>
                            <label className="block text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] mb-3 ml-1">End Date (Optional)</label>
                            <input
                                type="date"
                                className="w-full bg-slate-950/50 border border-slate-800 rounded-2xl px-6 py-4 text-sm font-black text-white focus:ring-2 focus:ring-indigo-500 outline-none transition"
                                value={endDate}
                                onChange={e => setEndDate(e.target.value)}
                            />
                        </div>
                    </div>
                </div>

                <div className="p-8 border-t border-slate-800 bg-slate-950/50 flex gap-6 sticky bottom-0">
                    <button onClick={onClose} className="flex-1 bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white py-5 rounded-[22px] text-[10px] font-black uppercase tracking-widest transition-all active:scale-95 border border-slate-700">
                        Cancel
                    </button>
                    <button
                        disabled={loading}
                        onClick={submit}
                        className="flex-1 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-60 text-white py-5 rounded-[22px] text-[10px] font-black uppercase tracking-widest transition-all shadow-xl shadow-indigo-600/20 active:scale-95 flex items-center justify-center gap-3"
                    >
                        {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle2 className="w-4 h-4" />} Create
                    </button>
                </div>
            </div>
        </div>
    );
}

export function AddOfflineBtn({ hotelId, rooms, users, onDone }: { hotelId: string; rooms: any[]; users: any[]; onDone: () => void }) {
    const [open, setOpen] = useState(false);
    const [roomId, setRoomId] = useState(rooms[0]?.id ?? "");
    const [nights, setNights] = useState(1);
    const [guestName, setGuestName] = useState("");
    const [linkedUserId, setLinkedUserId] = useState<string>("");

    const submit = async () => {
        if (!roomId) return;
        try {
            await api.addOfflineBooking({ hotelId, roomId, nights, guestName, userId: linkedUserId || undefined });
            setOpen(false); setGuestName(""); setNights(1); setLinkedUserId("");
            onDone();
        } catch (e: any) { alert("Failed: " + e.message); }
    };

    const selectedRoom = rooms.find(r => r.id === roomId);
    const total = (selectedRoom?.pricePerNight ?? 0) * nights;

    return (
        <>
            <button
                onClick={() => setOpen(true)}
                className="bg-indigo-600 hover:bg-indigo-500 text-white flex items-center gap-2 md:gap-3 px-4 sm:px-6 md:px-8 py-3 md:py-4 rounded-xl sm:rounded-2xl md:rounded-3xl text-[10px] sm:text-xs font-black uppercase tracking-[0.1em] md:tracking-[0.2em] transition-all shadow-xl shadow-indigo-600/20 active:scale-95 shrink-0"
            >
                <Plus className="w-4 h-4 md:w-5 md:h-5" />
                <span className="hidden sm:inline">Log Walk-in</span>
                <span className="sm:hidden">Add</span>
            </button>

            {open && (
                <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md z-[200] flex items-center justify-center p-4 animate-in fade-in duration-300">
                    <div className="bg-slate-900 border border-slate-800 rounded-[40px] w-full max-w-md shadow-2xl overflow-hidden flex flex-col animate-in zoom-in-95 duration-300">
                        <div className="p-8 border-b border-slate-800 flex justify-between items-center bg-slate-900/50">
                            <div>
                                <h3 className="font-black text-2xl text-white uppercase tracking-tight">Register Walk-in</h3>
                                <p className="text-slate-500 text-[10px] font-black uppercase tracking-widest mt-1 italic">Manually log a direct booking</p>
                            </div>
                            <button onClick={() => setOpen(false)} className="p-3 bg-slate-800 hover:bg-slate-700 rounded-2xl transition text-slate-400 hover:text-white">
                                <X className="w-6 h-6" />
                            </button>
                        </div>

                        <div className="p-10 space-y-8 bg-slate-900/30">
                            <div className="space-y-6">
                                <div>
                                    <label className="block text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] mb-3 ml-1">Guest Identification</label>
                                    <input
                                        className="w-full bg-slate-950/50 border border-slate-800 rounded-2xl px-6 py-4 text-sm font-medium text-white placeholder:text-slate-700 focus:ring-2 focus:ring-indigo-500 outline-none transition shadow-inner"
                                        placeholder="Guest Full Name"
                                        value={guestName}
                                        onChange={e => setGuestName(e.target.value)}
                                    />
                                </div>

                                <div>
                                    <label className="block text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] mb-3 ml-1">Link to System User (Optional)</label>
                                    <select
                                        className="w-full bg-slate-950/50 border border-slate-800 rounded-2xl px-6 py-4 text-sm font-medium text-white focus:ring-2 focus:ring-indigo-500 outline-none transition cursor-pointer"
                                        value={linkedUserId}
                                        onChange={e => setLinkedUserId(e.target.value)}
                                    >
                                        <option value="" className="bg-slate-900">-- Anonymous / Direct --</option>
                                        {users.map(u => <option key={u.userId} value={u.userId} className="bg-slate-900">{u.name} (ID: {u.userId.slice(-4)})</option>)}
                                    </select>
                                </div>

                                <div className="grid grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] mb-3 ml-1">Assigned Room</label>
                                        <select
                                            className="w-full bg-slate-950/50 border border-slate-800 rounded-2xl px-6 py-4 text-sm font-medium text-white focus:ring-2 focus:ring-indigo-500 outline-none transition cursor-pointer"
                                            value={roomId}
                                            onChange={e => setRoomId(e.target.value)}
                                        >
                                            <option value="" className="bg-slate-900">-- Select Room --</option>
                                            {rooms.map(r => <option key={r.id} value={r.id} className="bg-slate-900">{r.type} {r.roomNumber}</option>)}
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] mb-3 ml-1">Duration (Nights)</label>
                                        <input
                                            type="number" min={1} max={30}
                                            className="w-full bg-slate-950/50 border border-slate-800 rounded-2xl px-6 py-4 text-sm font-black text-white focus:ring-2 focus:ring-indigo-500 outline-none transition"
                                            value={nights}
                                            onChange={e => setNights(+e.target.value)}
                                        />
                                    </div>
                                </div>

                                <div className="bg-indigo-600/10 rounded-3xl p-6 flex justify-between items-center border border-indigo-500/20 shadow-xl">
                                    <div>
                                        <p className="text-[10px] font-black text-indigo-400 uppercase tracking-widest mb-1">Total Price</p>
                                        <p className="text-[9px] text-slate-500 font-bold uppercase">Based on nights selected</p>
                                    </div>
                                    <span className="text-3xl font-black text-indigo-400 tabular-nums leading-none">৳{total.toLocaleString()}</span>
                                </div>
                            </div>
                        </div>

                        <div className="p-8 border-t border-slate-800 bg-slate-950/50 flex gap-6">
                            <button
                                onClick={() => setOpen(false)}
                                className="flex-1 bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white py-5 rounded-[22px] text-[10px] font-black uppercase tracking-widest transition-all active:scale-95 border border-slate-700"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={submit}
                                className="flex-1 bg-indigo-600 hover:bg-indigo-500 text-white py-5 rounded-[22px] text-[10px] font-black uppercase tracking-widest transition-all shadow-xl shadow-indigo-600/20 active:scale-95 flex items-center justify-center gap-3"
                            >
                                <CheckCircle2 className="w-4 h-4" /> Log Entry
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
