import React, { useState, useEffect } from "react";
import { 
  Compass, Plus, Edit2, Trash2, RotateCcw, MapPin, 
  BedDouble, DollarSign, Search, Check, X, Sparkles, ExternalLink, Image as ImageIcon
} from "lucide-react";
import { 
  TouristSpot, 
  getStoredTouristSpots, 
  addTouristSpot, 
  updateTouristSpot, 
  deleteTouristSpot, 
  resetToDefaultTouristSpots 
} from "../../../services/touristSpotsData";

export default function TouristSpotsPanel() {
  const [spots, setSpots] = useState<TouristSpot[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCat, setSelectedCat] = useState<string>("all");
  
  // Modal states
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingSpot, setEditingSpot] = useState<TouristSpot | null>(null);

  // Form State
  const [formData, setFormData] = useState<Omit<TouristSpot, "id">>({
    name: "",
    nameBn: "",
    region: "",
    regionBn: "",
    category: "sea",
    image: "",
    description: "",
    descriptionBn: "",
    nearbyHotelsCount: 10,
    startingPrice: 800,
    highlightTag: "Popular Destination",
    highlightTagBn: "জনপ্রিয় গন্তব্য"
  });

  const loadSpots = () => {
    setSpots(getStoredTouristSpots());
  };

  useEffect(() => {
    loadSpots();
    const handleUpdate = () => loadSpots();
    window.addEventListener("staybd_spots_updated", handleUpdate);
    return () => window.removeEventListener("staybd_spots_updated", handleUpdate);
  }, []);

  const handleOpenAdd = () => {
    setFormData({
      name: "",
      nameBn: "",
      region: "",
      regionBn: "",
      category: "sea",
      image: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80",
      description: "",
      descriptionBn: "",
      nearbyHotelsCount: 15,
      startingPrice: 900,
      highlightTag: "Must Visit",
      highlightTagBn: "অবশ্যই দর্শনীয়"
    });
    setEditingSpot(null);
    setIsAddModalOpen(true);
  };

  const handleOpenEdit = (spot: TouristSpot) => {
    setEditingSpot(spot);
    setFormData({
      name: spot.name,
      nameBn: spot.nameBn,
      region: spot.region,
      regionBn: spot.regionBn,
      category: spot.category,
      image: spot.image,
      description: spot.description,
      descriptionBn: spot.descriptionBn,
      nearbyHotelsCount: spot.nearbyHotelsCount,
      startingPrice: spot.startingPrice,
      highlightTag: spot.highlightTag,
      highlightTagBn: spot.highlightTagBn
    });
    setIsAddModalOpen(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.region.trim()) {
      alert("Please fill in spot name and region.");
      return;
    }

    if (editingSpot) {
      updateTouristSpot({
        ...formData,
        id: editingSpot.id
      });
    } else {
      addTouristSpot(formData);
    }

    setIsAddModalOpen(false);
    setEditingSpot(null);
    loadSpots();
  };

  const handleDelete = (id: string, name: string) => {
    if (window.confirm(`Are you sure you want to remove tourist spot "${name}"?`)) {
      deleteTouristSpot(id);
      loadSpots();
    }
  };

  const handleReset = () => {
    if (window.confirm("Reset all tourist spots to the original national catalogue?")) {
      resetToDefaultTouristSpots();
      loadSpots();
    }
  };

  const filteredSpots = spots.filter(s => {
    const matchCat = selectedCat === "all" || s.category === selectedCat;
    const matchSearch = searchTerm === "" || 
      s.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
      s.nameBn.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.region.toLowerCase().includes(searchTerm.toLowerCase());
    return matchCat && matchSearch;
  });

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Header & Stats Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-slate-900/60 p-6 rounded-3xl border border-white/10 backdrop-blur-xl">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="p-2 bg-emerald-500/20 text-emerald-400 rounded-xl">
              <Compass className="w-5 h-5" />
            </span>
            <h2 className="text-2xl font-black text-white tracking-tight">Tourist Spots & Region Manager</h2>
          </div>
          <p className="text-xs text-slate-400 font-medium">
            Manage all 64-district tourism spot cards, live prices, hotel count, imagery, and copywriting dynamically.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={handleReset}
            className="px-3.5 py-2.5 bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white rounded-xl border border-white/10 text-xs font-bold transition flex items-center gap-1.5"
            title="Reset to default Bangladesh destinations"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Defaults</span>
          </button>

          <button
            onClick={handleOpenAdd}
            className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-black shadow-lg shadow-emerald-600/30 transition flex items-center gap-1.5 active:scale-95"
          >
            <Plus className="w-4 h-4" />
            <span>Add Tourist Spot</span>
          </button>
        </div>
      </div>

      {/* KPI Counters */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        {[
          { label: "Total Spots", count: spots.length, color: "text-white" },
          { label: "Sea & Beach", count: spots.filter(s => s.category === "sea").length, color: "text-cyan-400" },
          { label: "Forest & Nature", count: spots.filter(s => s.category === "forest").length, color: "text-emerald-400" },
          { label: "Hill & Adventure", count: spots.filter(s => s.category === "hill").length, color: "text-amber-400" },
          { label: "Heritage & History", count: spots.filter(s => s.category === "heritage").length, color: "text-purple-400" },
          { label: "Tea & Haor", count: spots.filter(s => s.category === "tea").length, color: "text-lime-400" },
        ].map((kpi, idx) => (
          <div key={idx} className="bg-slate-900/40 border border-white/5 p-4 rounded-2xl">
            <span className="text-[10px] text-slate-400 font-bold uppercase block">{kpi.label}</span>
            <span className={`text-xl font-black ${kpi.color} mt-0.5 block`}>{kpi.count}</span>
          </div>
        ))}
      </div>

      {/* Search & Category Filter Controls */}
      <div className="flex flex-col md:flex-row gap-3 items-center justify-between">
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search spot name, division..."
            className="w-full bg-slate-900/60 border border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-slate-500 outline-none focus:border-emerald-500 transition"
          />
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto pb-1">
          {[
            { id: "all", label: "All Regions" },
            { id: "sea", label: "Sea & Beach" },
            { id: "forest", label: "Forest & Nature" },
            { id: "hill", label: "Hill & Adventure" },
            { id: "heritage", label: "Heritage & History" },
            { id: "tea", label: "Tea & Haor" },
          ].map(cat => (
            <button
              key={cat.id}
              onClick={() => setSelectedCat(cat.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition whitespace-nowrap ${
                selectedCat === cat.id
                  ? "bg-emerald-600 text-white shadow-md shadow-emerald-600/20"
                  : "bg-slate-900/50 text-slate-400 hover:text-white border border-white/5"
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Tourist Spots Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
        {filteredSpots.map(spot => (
          <div
            key={spot.id}
            className="bg-slate-900/70 rounded-2xl border border-white/10 overflow-hidden shadow-lg flex flex-col justify-between group hover:border-emerald-500/50 transition-all duration-300"
          >
            {/* Card Header & Photo */}
            <div className="relative h-40 w-full overflow-hidden bg-slate-800">
              <img
                src={spot.image}
                alt={spot.name}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent" />
              
              <div className="absolute top-2.5 left-2.5 bg-slate-900/90 backdrop-blur-md px-2.5 py-0.5 rounded-full border border-white/10 text-[10px] font-bold text-emerald-400 flex items-center gap-1">
                <Sparkles className="w-2.5 h-2.5 text-amber-400" />
                <span>{spot.highlightTag}</span>
              </div>

              <div className="absolute bottom-2.5 left-2.5 right-2.5">
                <div className="flex items-center gap-1 text-[11px] text-slate-300">
                  <MapPin className="w-3 h-3 text-emerald-400" />
                  <span>{spot.region}</span>
                </div>
                <h3 className="text-base font-black text-white leading-tight mt-0.5">
                  {spot.name} <span className="text-slate-400 text-xs font-normal">({spot.nameBn})</span>
                </h3>
              </div>
            </div>

            {/* Card Body */}
            <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
              <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
                {spot.description}
              </p>

              <div className="pt-2.5 border-t border-white/5 flex items-center justify-between text-xs">
                <div className="flex items-center gap-1 text-slate-300">
                  <BedDouble className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="font-bold">{spot.nearbyHotelsCount} Hotels</span>
                </div>
                <div className="text-right">
                  <span className="text-slate-400 text-[10px]">From </span>
                  <span className="font-black text-emerald-400">৳{spot.startingPrice}</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2 pt-2">
                <button
                  onClick={() => handleOpenEdit(spot)}
                  className="flex-1 py-2 bg-white/5 hover:bg-white/10 text-white text-xs font-bold rounded-xl border border-white/10 transition flex items-center justify-center gap-1.5"
                >
                  <Edit2 className="w-3 h-3 text-indigo-400" />
                  <span>Edit</span>
                </button>
                <button
                  onClick={() => handleDelete(spot.id, spot.name)}
                  className="p-2 bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 rounded-xl border border-rose-500/20 transition"
                  title="Delete Spot"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Add / Edit Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="bg-slate-900 border border-white/10 rounded-3xl p-6 sm:p-8 max-w-xl w-full shadow-2xl relative max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setIsAddModalOpen(false)}
              className="absolute top-5 right-5 text-slate-400 hover:text-white w-8 h-8 rounded-full bg-white/5 flex items-center justify-center"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="flex items-center gap-2.5 mb-6">
              <span className="p-2 bg-emerald-500/20 text-emerald-400 rounded-xl">
                <Compass className="w-5 h-5" />
              </span>
              <div>
                <h3 className="text-xl font-black text-white">
                  {editingSpot ? "Edit Tourist Spot" : "Add New Tourist Spot"}
                </h3>
                <p className="text-xs text-slate-400">Manage spot card details, Bengali copy, and verified hotels</p>
              </div>
            </div>

            <form onSubmit={handleSave} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-slate-400 uppercase mb-1">Spot Name (English) *</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g. Saint Martin's Island"
                    className="w-full bg-slate-950 border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white outline-none focus:border-emerald-500"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-400 uppercase mb-1">Spot Name (Bangla) *</label>
                  <input
                    type="text"
                    required
                    value={formData.nameBn}
                    onChange={(e) => setFormData({ ...formData, nameBn: e.target.value })}
                    placeholder="যেমন: সেন্ট মার্টিন দ্বীপ"
                    className="w-full bg-slate-950 border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-slate-400 uppercase mb-1">Region / District (English) *</label>
                  <input
                    type="text"
                    required
                    value={formData.region}
                    onChange={(e) => setFormData({ ...formData, region: e.target.value })}
                    placeholder="e.g. Bay of Bengal / Cox's Bazar"
                    className="w-full bg-slate-950 border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white outline-none focus:border-emerald-500"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-400 uppercase mb-1">Region / District (Bangla) *</label>
                  <input
                    type="text"
                    required
                    value={formData.regionBn}
                    onChange={(e) => setFormData({ ...formData, regionBn: e.target.value })}
                    placeholder="যেমন: কক্সবাজার জেলা"
                    className="w-full bg-slate-950 border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-slate-400 uppercase mb-1">Category *</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value as any })}
                    className="w-full bg-slate-950 border border-white/10 rounded-xl px-3 py-2.5 text-xs text-white outline-none focus:border-emerald-500"
                  >
                    <option value="sea">Sea & Beach</option>
                    <option value="forest">Forest & Nature</option>
                    <option value="hill">Hill & Adventure</option>
                    <option value="heritage">Heritage & History</option>
                    <option value="tea">Tea & Haor</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-400 uppercase mb-1">Hotels Count</label>
                  <input
                    type="number"
                    min="1"
                    value={formData.nearbyHotelsCount}
                    onChange={(e) => setFormData({ ...formData, nearbyHotelsCount: Number(e.target.value) })}
                    className="w-full bg-slate-950 border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white outline-none focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-400 uppercase mb-1">Starting Price (৳)</label>
                  <input
                    type="number"
                    min="100"
                    step="50"
                    value={formData.startingPrice}
                    onChange={(e) => setFormData({ ...formData, startingPrice: Number(e.target.value) })}
                    className="w-full bg-slate-950 border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-slate-400 uppercase mb-1">Highlight Tag (English)</label>
                  <input
                    type="text"
                    value={formData.highlightTag}
                    onChange={(e) => setFormData({ ...formData, highlightTag: e.target.value })}
                    placeholder="e.g. Coral Island"
                    className="w-full bg-slate-950 border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white outline-none focus:border-emerald-500"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-400 uppercase mb-1">Highlight Tag (Bangla)</label>
                  <input
                    type="text"
                    value={formData.highlightTagBn}
                    onChange={(e) => setFormData({ ...formData, highlightTagBn: e.target.value })}
                    placeholder="যেমন: প্রবাল দ্বীপ"
                    className="w-full bg-slate-950 border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-400 uppercase mb-1">Photo Image URL</label>
                <input
                  type="url"
                  required
                  value={formData.image}
                  onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                  placeholder="https://images.unsplash.com/..."
                  className="w-full bg-slate-950 border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-400 uppercase mb-1">Description (English)</label>
                <textarea
                  rows={2}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Short engaging description..."
                  className="w-full bg-slate-950 border border-white/10 rounded-xl px-3.5 py-2 text-xs text-white outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-400 uppercase mb-1">Description (Bangla)</label>
                <textarea
                  rows={2}
                  value={formData.descriptionBn}
                  onChange={(e) => setFormData({ ...formData, descriptionBn: e.target.value })}
                  placeholder="সংক্ষিপ্ত বর্ণনা..."
                  className="w-full bg-slate-950 border border-white/10 rounded-xl px-3.5 py-2 text-xs text-white outline-none focus:border-emerald-500"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2.5 bg-white/5 hover:bg-white/10 text-slate-300 rounded-xl text-xs font-bold transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-black shadow-lg shadow-emerald-600/30 transition active:scale-95"
                >
                  {editingSpot ? "Update Spot" : "Save Tourist Spot"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
