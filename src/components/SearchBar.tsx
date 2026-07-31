import { useState, useRef, useEffect } from "react";
import {
  BedDouble, CalendarDays, Users, X, ChevronDown,
  MapPin, Search, Navigation, History, TrendingUp,
  Plus, Minus, Trash2, Sparkles, Dog, Loader2
} from "lucide-react";
import { useTranslation } from "react-i18next";
import { motion, AnimatePresence } from "framer-motion";
import { api, Hotel } from "../services/api";
import { useSearch, RoomConfig } from "@/context/SearchContext";
import { useNavigate, useLocation } from "react-router-dom";

interface SearchBarProps {
  className?: string;
}

const SearchBar = ({ className = "" }: SearchBarProps) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const { search: globalSearch, updateSearch } = useSearch();

  // Local state for immediate UI feedback
  const [searchQuery, setSearchQuery] = useState(globalSearch.q);
  const [checkIn, setCheckIn] = useState(globalSearch.checkIn);
  const [checkOut, setCheckOut] = useState(globalSearch.checkOut);
  const [roomsData, setRoomsData] = useState<RoomConfig[]>(globalSearch.roomsData || [{ adults: 2, children: 0 }]);
  const [petsAllowed, setPetsAllowed] = useState(globalSearch.petsAllowed);

  const [searchFocused, setSearchFocused] = useState(false);
  const [guestsMenuOpen, setGuestsMenuOpen] = useState(false);
  const [hotels, setHotels] = useState<Hotel[]>([]);
  const [isDetectingLocation, setIsDetectingLocation] = useState(false);

  const searchRef = useRef<HTMLDivElement>(null);
  const checkInRef = useRef<HTMLInputElement>(null);
  const checkOutRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    api.getAllHotels().then(data => {
      if (Array.isArray(data)) setHotels(data);
      else if (data && typeof data === 'object' && 'hotels' in data) setHotels((data as any).hotels);
    }).catch(err => console.error(err));
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setSearchFocused(false);
        setGuestsMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const totalAdults = roomsData.reduce((acc, r) => acc + r.adults, 0);
  const totalChildren = roomsData.reduce((acc, r) => acc + r.children, 0);
  const totalRooms = roomsData.length;

  const handleSearchSubmit = () => {
    const searchData = {
      q: searchQuery,
      checkIn,
      checkOut,
      adults: totalAdults,
      children: totalChildren,
      rooms: totalRooms,
      roomsData,
      petsAllowed
    };

    updateSearch(searchData);

    const params = new URLSearchParams(location.search);
    if (searchData.q) params.set("q", searchData.q); else params.delete("q");
    if (searchData.checkIn) params.set("checkIn", searchData.checkIn); else params.delete("checkIn");
    if (searchData.checkOut) params.set("checkOut", searchData.checkOut); else params.delete("checkOut");
    params.set("adults", searchData.adults.toString());
    params.set("children", searchData.children.toString());
    params.set("rooms", searchData.rooms.toString());
    if (searchData.petsAllowed) params.set("pets", "true"); else params.delete("pets");

    if (location.pathname !== "/hotels") navigate(`/hotels?${params.toString()}`);
    else navigate(`${location.pathname}?${params.toString()}`, { replace: true });
  };

  const handleUseCurrentLocation = async () => {
    setIsDetectingLocation(true);
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(async (position) => {
        try {
          const { latitude, longitude } = position.coords;
          const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`);
          const data = await res.json();
          const city = data.address.city || data.address.town || data.address.village || data.address.county || "";
          if (city) {
            setSearchQuery(city);
            setSearchFocused(false);
          }
        } catch (err) {
          console.error("Location error:", err);
        } finally {
          setIsDetectingLocation(false);
        }
      }, () => setIsDetectingLocation(false));
    } else {
      setIsDetectingLocation(false);
    }
  };

  const suggestions = (Array.isArray(hotels) ? hotels : []).reduce((acc, hotel) => {
    if (!hotel) return acc;
    if (hotel.city && !acc.find(item => item.name === hotel.city && item.type === 'City')) {
      acc.push({ name: hotel.city, type: 'City', subText: 'Popular destination' });
    }
    acc.push({ name: hotel.name, type: 'Hotel', subText: hotel.city || 'Property' });
    return acc;
  }, [] as { name: string, type: string, subText?: string }[])
    .filter(item => item.name && item.name.toLowerCase().includes((searchQuery || "").toLowerCase()))
    .sort((a, b) => a.type === 'City' ? -1 : 1)
    .slice(0, 8);

  const addRoom = () => {
    if (roomsData.length < 8) setRoomsData([...roomsData, { adults: 2, children: 0 }]);
  };

  const removeRoom = (index: number) => {
    if (roomsData.length > 1) setRoomsData(roomsData.filter((_, i) => i !== index));
  };

  const updateRoom = (index: number, patch: Partial<RoomConfig>) => {
    const next = [...roomsData];
    next[index] = { ...next[index], ...patch };
    setRoomsData(next);
  };

  return (
    <div ref={searchRef} className={`relative z-30 w-full ${className}`}>
      <motion.div
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white/95 backdrop-blur-md p-1.5 flex flex-col lg:flex-row shadow-lg border border-slate-200/80 rounded-[2rem] lg:rounded-full relative group/bar gap-1"
      >
        {/* Location Input Group */}
        <div className="flex-[1.8] flex items-center px-4 py-2.5 gap-3 rounded-full relative hover:bg-slate-50 transition-colors cursor-text group/loc" onClick={() => setSearchFocused(true)}>
          <div className="p-2 bg-rose-50/50 rounded-xl group-hover/loc:bg-rose-100 transition-colors">
            <MapPin className="w-4 h-4 text-[#FF385C] shrink-0" />
          </div>
          <div className="flex flex-col flex-1 min-w-0">
            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wide leading-none mb-0.5">Location</span>
            <input
              type="text"
              placeholder={t("Where are you going?")}
              className="w-full text-sm font-bold text-slate-900 outline-none placeholder:text-slate-400 bg-transparent pr-6"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onFocus={() => setSearchFocused(true)}
              onKeyDown={(e) => e.key === "Enter" && handleSearchSubmit()}
            />
          </div>
          {searchQuery && (
            <button onClick={(e) => { e.stopPropagation(); setSearchQuery(""); }} className="absolute right-4 p-1 hover:bg-slate-200 rounded-full transition-colors text-slate-400">
              <X className="w-3.5 h-3.5" />
            </button>
          )}

          {/* Suggestions Dropdown */}
          <AnimatePresence>
            {searchFocused && (
              <motion.div
                initial={{ opacity: 0, y: 10, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 10, scale: 0.98 }}
                className="absolute top-full left-0 mt-3 w-full md:min-w-[320px] bg-white/95 backdrop-blur-xl rounded-[1.5rem] shadow-xl border border-slate-100 overflow-hidden z-[60] p-2"
              >
                <div
                  className="flex items-center gap-3 px-4 py-3 hover:bg-indigo-50/50 cursor-pointer rounded-xl transition-all group/near mb-1"
                  onClick={handleUseCurrentLocation}
                >
                  <div className="p-2.5 bg-indigo-50 group-hover/near:bg-indigo-600 group-hover/near:text-white rounded-lg transition-all">
                    {isDetectingLocation ? <Loader2 className="w-4 h-4 animate-spin" /> : <Navigation className="w-4 h-4" />}
                  </div>
                  <div className="font-bold text-sm text-slate-800">Around current location</div>
                </div>

                {searchQuery.length === 0 && (
                  <div className="px-4 py-2 text-[10px] uppercase font-bold text-slate-400 tracking-wider flex items-center gap-2">
                    <TrendingUp className="w-3 h-3" /> Trending
                  </div>
                )}

                <div className="space-y-0.5">
                  {suggestions.map((item, i) => (
                    <div
                      key={i}
                      className="px-4 py-2.5 hover:bg-slate-50 cursor-pointer flex items-center gap-3 rounded-xl transition-all group/item"
                      onClick={(e) => {
                        e.stopPropagation();
                        setSearchQuery(item.name);
                        setSearchFocused(false);
                      }}
                    >
                      <div className="p-2 bg-slate-100 group-hover/item:bg-white group-hover/item:shadow-sm rounded-lg transition-all">
                        {item.type === 'City' ? <MapPin className="w-3.5 h-3.5 text-rose-500" /> : <BedDouble className="w-3.5 h-3.5 text-indigo-500" />}
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="font-semibold text-sm text-slate-900 truncate group-hover/item:text-indigo-600">{item.name}</div>
                        <div className="text-[10px] text-slate-400">
                          {item.type === 'City' ? 'Destination' : `Property in ${item.subText}`}
                        </div>
                      </div>
                      <History className="w-3 h-3 text-slate-300 opacity-0 group-hover/item:opacity-100 transition-opacity" />
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Date Range Group */}
        <div className="flex-[2.2] flex items-center px-4 py-2.5 gap-3 bg-slate-50/60 rounded-full lg:mx-0 border border-slate-100/60 relative group/date hover:bg-slate-100/80 transition-all cursor-pointer" onClick={() => checkInRef.current?.showPicker()}>
          <div className="p-2 bg-indigo-50/50 rounded-xl group-hover/date:bg-indigo-100 transition-colors">
            <CalendarDays className="w-4 h-4 text-indigo-600 shrink-0" />
          </div>
          <div className="flex flex-col flex-1 min-w-0">
            <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wide leading-none mb-0.5">Check-in — Check-out</span>
            <div className="flex items-center gap-2">
              <span className={`text-sm font-bold ${checkIn ? 'text-slate-900' : 'text-slate-400'}`}>
                {checkIn ? new Date(checkIn).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : 'Add date'}
              </span>
              <span className="text-slate-300 font-light text-xs">—</span>
              <span className={`text-sm font-bold ${checkOut ? 'text-slate-900' : 'text-slate-400'}`}>
                {checkOut ? new Date(checkOut).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : 'Add date'}
              </span>
            </div>
          </div>

          <input
            ref={checkInRef}
            type="date"
            className="absolute w-0 h-0 opacity-0 pointer-events-none"
            value={checkIn}
            onChange={e => {
              setCheckIn(e.target.value);
              setTimeout(() => checkOutRef.current?.showPicker(), 300);
            }}
          />
          <input
            ref={checkOutRef}
            type="date"
            className="absolute w-0 h-0 opacity-0 pointer-events-none"
            value={checkOut}
            min={checkIn}
            onChange={e => setCheckOut(e.target.value)}
          />
        </div>

        {/* Multi-Room Guest Config */}
        <div
          className="flex-[2] flex items-center px-4 py-2.5 gap-3 rounded-full relative hover:bg-slate-50 transition-all cursor-pointer group/guests"
          onClick={() => setGuestsMenuOpen(!guestsMenuOpen)}
        >
          <div className="p-2 bg-emerald-50/50 rounded-xl group-hover/guests:bg-emerald-100 transition-colors">
            <Users className="w-4 h-4 text-emerald-600 shrink-0" />
          </div>
          <div className="flex flex-col flex-1 min-w-0">
            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wide leading-none mb-0.5">Travellers</span>
            <span className="text-sm font-bold text-slate-900 truncate">
              {totalAdults + totalChildren} guests · {totalRooms} rooms
            </span>
          </div>
          <ChevronDown className={`w-3.5 h-3.5 text-slate-400 transition-transform duration-200 ${guestsMenuOpen ? 'rotate-180' : ''}`} />

          <AnimatePresence>
            {guestsMenuOpen && (
              <motion.div
                initial={{ opacity: 0, y: 10, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 10, scale: 0.98 }}
                className="absolute top-full right-0 mt-3 bg-white/95 backdrop-blur-xl rounded-[1.5rem] shadow-xl border border-slate-100 w-full lg:w-[320px] p-4 z-[60]"
                onClick={e => e.stopPropagation()}
              >
                <div className="max-h-[60vh] overflow-y-auto custom-scrollbar space-y-4 pr-1">
                  {roomsData.map((room, idx) => (
                    <div key={idx} className="pb-4 border-b border-slate-100/50 last:border-0 last:pb-0">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-2">
                          <div className="w-5 h-5 flex items-center justify-center bg-slate-800 text-white rounded-md text-[10px] font-bold">
                            {idx + 1}
                          </div>
                          <span className="text-[11px] font-bold text-slate-700 uppercase tracking-wide">Room {idx + 1}</span>
                        </div>
                        {roomsData.length > 1 && (
                          <button
                            onClick={() => removeRoom(idx)}
                            className="flex items-center gap-1 text-rose-500 hover:text-rose-600 text-[10px] font-bold uppercase transition-colors"
                          >
                            <Trash2 className="w-3 h-3" /> Remove
                          </button>
                        )}
                      </div>

                      <div className="space-y-2">
                        <div className="flex justify-between items-center bg-slate-50/50 p-2.5 rounded-xl border border-slate-100/50">
                          <div>
                            <p className="font-semibold text-slate-800 text-xs">Adults</p>
                            <p className="text-[9px] text-slate-400">Ages 13+</p>
                          </div>
                          <div className="flex items-center gap-2">
                            <button
                              className="w-7 h-7 rounded-lg bg-white shadow-sm flex items-center justify-center text-slate-500 hover:bg-slate-200 transition-all disabled:opacity-40 border border-slate-200"
                              onClick={() => updateRoom(idx, { adults: Math.max(1, room.adults - 1) })}
                              disabled={room.adults <= 1}
                            ><Minus className="w-3 h-3" /></button>
                            <span className="w-4 text-center font-bold text-sm">{room.adults}</span>
                            <button
                              className="w-7 h-7 rounded-lg bg-white shadow-sm flex items-center justify-center text-slate-500 hover:bg-slate-200 transition-all border border-slate-200"
                              onClick={() => updateRoom(idx, { adults: room.adults + 1 })}
                            ><Plus className="w-3 h-3" /></button>
                          </div>
                        </div>

                        <div className="flex justify-between items-center bg-slate-50/50 p-2.5 rounded-xl border border-slate-100/50">
                          <div>
                            <p className="font-semibold text-slate-800 text-xs">Children</p>
                            <p className="text-[9px] text-slate-400">Ages 0-12</p>
                          </div>
                          <div className="flex items-center gap-2">
                            <button
                              className="w-7 h-7 rounded-lg bg-white shadow-sm flex items-center justify-center text-slate-500 hover:bg-slate-200 transition-all disabled:opacity-40 border border-slate-200"
                              onClick={() => updateRoom(idx, { children: Math.max(0, room.children - 1) })}
                              disabled={room.children <= 0}
                            ><Minus className="w-3 h-3" /></button>
                            <span className="w-4 text-center font-bold text-sm">{room.children}</span>
                            <button
                              className="w-7 h-7 rounded-lg bg-white shadow-sm flex items-center justify-center text-slate-500 hover:bg-slate-200 transition-all border border-slate-200"
                              onClick={() => updateRoom(idx, { children: room.children + 1 })}
                            ><Plus className="w-3 h-3" /></button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-4 pt-4 border-t border-slate-100 flex flex-col gap-3">
                  <button
                    onClick={addRoom}
                    disabled={roomsData.length >= 8}
                    className="w-full flex items-center justify-center gap-1.5 py-2.5 rounded-xl border border-dashed border-slate-300 text-slate-600 font-bold text-[11px] uppercase hover:bg-slate-50 hover:text-indigo-600 transition-all active:scale-[0.98] disabled:opacity-40"
                  >
                    <Plus className="w-3.5 h-3.5" /> Add Room
                  </button>

                  <div className="flex items-center justify-between px-3 py-2 bg-indigo-50/50 rounded-xl">
                    <div className="flex items-center gap-2">
                      <div className="p-1 bg-indigo-100 rounded-md"><Dog className="w-3.5 h-3.5 text-indigo-600" /></div>
                      <span className="text-[10px] font-bold text-slate-700 uppercase">Traveling with pets?</span>
                    </div>
                    <button
                      onClick={() => setPetsAllowed(!petsAllowed)}
                      className={`w-8 h-5 rounded-full relative transition-all duration-300 ${petsAllowed ? 'bg-indigo-600' : 'bg-slate-300'}`}
                    >
                      <motion.div
                        animate={{ x: petsAllowed ? 14 : 2 }}
                        className="absolute top-[2px] w-4 h-4 bg-white rounded-full shadow-sm"
                      />
                    </button>
                  </div>

                  <button
                    className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-bold py-3 rounded-xl shadow-md hover:shadow-lg transition-all active:scale-[0.98] flex items-center justify-center gap-2 text-xs uppercase tracking-wide"
                    onClick={(e) => {
                      e.stopPropagation();
                      setGuestsMenuOpen(false);
                      handleSearchSubmit();
                    }}
                  >
                    <Sparkles className="w-3.5 h-3.5" /> Apply
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Search Primary Button */}
        <button
          onClick={handleSearchSubmit}
          className="bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white text-[13px] font-bold px-8 py-3 lg:py-0 transition-all shrink-0 rounded-full shadow-md hover:shadow-lg active:scale-95 flex items-center justify-center gap-2 uppercase tracking-wide relative overflow-hidden group/btn"
        >
          <div className="absolute inset-0 bg-white/10 translate-y-full group-hover/btn:translate-y-0 transition-transform duration-300" />
          <Search className="w-4 h-4 relative z-10" />
          <span className="relative z-10">{t("Search")}</span>
        </button>
      </motion.div>
    </div>
  );
};

export default SearchBar;
