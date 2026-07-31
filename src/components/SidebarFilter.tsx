import React, { useState } from "react";
import {
  Search, ChevronDown, ChevronUp, Star, X,
  CreditCard, Wind, BedDouble, Shield, Sparkles, Filter, LayoutGrid
} from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { ROOM_CATEGORIES } from "@/services/api";

// ─────────────── Types ───────────────
export interface FilterState {
  searchQuery: string;
  checkIn: string;
  checkOut: string;
  adults: number;
  children: number;
  roomsCount: number;
  priceRange: [number, number];
  stars: number[];
  roomTypes: string[];
  amenities: string[];
  category: string;
  hasOffers: boolean;
  payAtHotel: boolean;
  petsAllowed: boolean;
  sortBy: string;
}

interface SidebarFilterProps {
  filters: FilterState;
  onChange: (patch: Partial<FilterState>) => void;
  hotelCounts: {
    stars: (s: number) => number;
    roomTypes: (rt: string) => number;
    amenities: (a: string) => number;
  };
  onReset: () => void;
}

const AMENITY_LIST = ["WiFi", "Pool", "Gym", "Spa", "Parking", "Restaurant", "AC", "Breakfast"];

const SidebarFilter: React.FC<SidebarFilterProps> = ({
  filters,
  onChange,
  hotelCounts,
  onReset
}) => {
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({
    price: true,
    stars: true,
    rooms: true,
    amenities: true
  });

  const toggleSection = (section: string) => {
    setOpenSections(prev => ({ ...prev, [section]: !prev[section] }));
  };

  const toggleArray = <T,>(arr: T[], val: T): T[] =>
    arr.includes(val) ? arr.filter(x => x !== val) : [...arr, val];

  return (
    <aside className="w-full lg:w-[280px] bg-white border border-slate-200/80 p-4 space-y-5 h-fit lg:sticky lg:top-24 rounded-2xl shadow-lg">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-100">
        <h2 className="text-[15px] font-bold flex items-center gap-2 text-slate-800 uppercase tracking-wide">
          <Filter className="w-4 h-4 text-indigo-500" /> Filters
        </h2>
        <button
          onClick={onReset}
          className="text-[10px] font-bold text-slate-400 hover:text-rose-500 flex items-center gap-1 uppercase tracking-widest transition-colors"
        >
          <X className="w-3 h-3" /> Reset
        </button>
      </div>

      {/* Search */}
      <div className="relative group">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 group-focus-within:text-indigo-500 transition-colors" />
        <input
          type="text"
          placeholder="Search property..."
          className="w-full pl-9 pr-8 py-2 md:py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all shadow-sm"
          value={filters.searchQuery}
          onChange={(e) => onChange({ searchQuery: e.target.value })}
        />
        {filters.searchQuery && (
          <button
            onClick={() => onChange({ searchQuery: "" })}
            className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>

      {/* Price Filter */}
      <div className="space-y-2.5">
        <button
          onClick={() => toggleSection('price')}
          className="flex items-center justify-between w-full group"
        >
          <h3 className="font-semibold text-[13px] text-slate-800 uppercase tracking-widest flex items-center gap-2">
            <CreditCard className="w-3.5 h-3.5 text-indigo-500" /> Budget
          </h3>
          {openSections.price ? <ChevronUp className="h-4 w-4 text-slate-400" /> : <ChevronDown className="h-4 w-4 text-slate-400" />}
        </button>

        {openSections.price && (
          <div className="space-y-4 px-1 pb-1">
            <div className="flex justify-between items-end">
              <div className="flex flex-col">
                <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Min</span>
                <span className="text-xs font-bold text-slate-800">৳{filters.priceRange[0].toLocaleString()}</span>
              </div>
              <div className="flex flex-col items-end">
                <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Max</span>
                <span className="text-xs font-bold text-indigo-600">৳{filters.priceRange[1].toLocaleString()}{filters.priceRange[1] === 100000 ? "+" : ""}</span>
              </div>
            </div>
            <Slider
              defaultValue={[100, 100000]}
              max={100000}
              min={100}
              step={100}
              value={[filters.priceRange[0], filters.priceRange[1]]}
              onValueChange={(val) => onChange({ priceRange: val as [number, number] })}
              className="py-1"
            />
          </div>
        )}
      </div>

      <Separator className="opacity-50" />

      {/* Stars Filter */}
      <div className="space-y-2.5">
        <button
          onClick={() => toggleSection('stars')}
          className="flex items-center justify-between w-full group"
        >
          <h3 className="font-semibold text-[13px] text-slate-800 uppercase tracking-widest flex items-center gap-2">
            <Star className="w-3.5 h-3.5 text-amber-500" /> Rating
          </h3>
          {openSections.stars ? <ChevronUp className="h-4 w-4 text-slate-400" /> : <ChevronDown className="h-4 w-4 text-slate-400" />}
        </button>

        {openSections.stars && (
          <div className="flex gap-1.5 pb-1">
            {[5, 4, 3].map((star) => (
              <button
                key={star}
                onClick={() => onChange({ stars: toggleArray(filters.stars, star) })}
                className={`flex-1 py-1.5 rounded-lg border flex items-center justify-center gap-1 transition-all
                                    ${filters.stars.includes(star)
                    ? 'bg-amber-500 border-amber-500 text-white shadow-sm'
                    : 'bg-white border-slate-200 text-slate-600 hover:border-amber-200'}`}
              >
                <span className="font-bold text-[13px]">{star}</span>
                <Star className={`h-3 w-3 ${filters.stars.includes(star) ? 'fill-current' : ''}`} />
              </button>
            ))}
          </div>
        )}
      </div>

      <Separator className="opacity-50" />

      {/* Room Category */}
      <div className="space-y-2.5">
        <button
          onClick={() => toggleSection('rooms')}
          className="flex items-center justify-between w-full group"
        >
          <h3 className="font-semibold text-[13px] text-slate-800 uppercase tracking-widest flex items-center gap-2">
            <LayoutGrid className="w-3.5 h-3.5 text-purple-500" /> Room Categories
          </h3>
          {openSections.rooms ? <ChevronUp className="h-4 w-4 text-slate-400" /> : <ChevronDown className="h-4 w-4 text-slate-400" />}
        </button>

        {openSections.rooms && (
          <div className="grid grid-cols-2 gap-1.5 pb-1 max-h-[300px] overflow-y-auto pr-1 custom-scrollbar">
            {ROOM_CATEGORIES.map(rc => (
              <button
                key={rc}
                onClick={() => onChange({ roomTypes: toggleArray(filters.roomTypes, rc) })}
                className={`px-2 py-1.5 rounded-lg text-[10px] font-bold border transition-all uppercase tracking-wide text-left
                                    ${filters.roomTypes.includes(rc)
                    ? "bg-indigo-600 border-indigo-600 text-white shadow-sm"
                    : "bg-slate-50 border-slate-200 text-slate-600 hover:border-indigo-300"
                  }`}
              >
                {rc}
              </button>
            ))}
          </div>
        )}
      </div>

      <Separator className="opacity-50" />

      {/* Amenities */}
      <div className="space-y-2.5">
        <button
          onClick={() => toggleSection('amenities')}
          className="flex items-center justify-between w-full group"
        >
          <h3 className="font-semibold text-[13px] text-slate-800 uppercase tracking-widest flex items-center gap-2">
            <Wind className="w-3.5 h-3.5 text-emerald-500" /> Facilities
          </h3>
          {openSections.amenities ? <ChevronUp className="h-4 w-4 text-slate-400" /> : <ChevronDown className="h-4 w-4 text-slate-400" />}
        </button>

        {openSections.amenities && (
          <div className="grid grid-cols-1 gap-1 pb-1 max-h-[220px] overflow-y-auto pr-1 custom-scrollbar">
            {AMENITY_LIST.map(a => (
              <label key={a} className="flex items-center gap-2.5 cursor-pointer group py-1.5 px-2 hover:bg-slate-50/80 rounded-lg transition-colors border border-transparent hover:border-slate-200/50">
                <Checkbox
                  checked={filters.amenities.includes(a)}
                  onCheckedChange={() => onChange({ amenities: toggleArray(filters.amenities, a) })}
                  className="w-4 h-4 rounded-sm border-slate-300"
                />
                <span className="text-xs font-semibold text-slate-600 group-hover:text-slate-900 transition-colors tracking-wide">{a}</span>
                <span className="ml-auto text-[9px] text-slate-400 font-bold bg-slate-100 px-1.5 rounded-md border border-slate-200/50">{hotelCounts.amenities(a)}</span>
              </label>
            ))}
          </div>
        )}
      </div>

      {/* Quick Toggles */}
      <div className="pt-2 space-y-2">
        <label className="flex items-center gap-2.5 cursor-pointer group p-2.5 bg-indigo-50/60 rounded-xl border border-indigo-100/60 transition-all hover:bg-indigo-50">
          <Checkbox
            checked={filters.hasOffers}
            onCheckedChange={() => onChange({ hasOffers: !filters.hasOffers })}
            className="w-4 h-4 border-indigo-300"
          />
          <div className="flex flex-col">
            <span className="text-[11px] font-bold text-indigo-900 uppercase tracking-widest">Super Deals</span>
          </div>
          <Sparkles className="ml-auto w-3.5 h-3.5 text-indigo-500" />
        </label>

        <label className="flex items-center gap-2.5 cursor-pointer group p-2.5 bg-emerald-50/60 rounded-xl border border-emerald-100/60 transition-all hover:bg-emerald-50">
          <Checkbox
            checked={filters.petsAllowed}
            onCheckedChange={() => onChange({ petsAllowed: !filters.petsAllowed })}
            className="w-4 h-4 border-emerald-300"
          />
          <div className="flex flex-col">
            <span className="text-[11px] font-bold text-emerald-900 uppercase tracking-widest">Pet Friendly</span>
          </div>
        </label>
      </div>
    </aside>
  );
};

export default SidebarFilter;
