import { useParams, useNavigate, Link, useSearchParams } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
    Star, Share, Heart, MapPin, Wifi, Tv,
    CheckCircle2, FileText, Keyboard, Loader2, ChevronLeft,
    Sparkles, Map, AlertTriangle, Coffee, Wind, Info, Shield, Utensils,
    ChevronDown, Flag, Waves, Bus, Dumbbell, ParkingCircle, Headset,
    UtensilsCrossed, Soup, Building2, Layout, BedDouble, Users, LayoutGrid, Calendar
} from "lucide-react";
import { useEffect, useState } from "react";
import { api, Hotel, Room, Review, ROOM_AMENITIES, BED_TYPES } from "../services/api";
import AuthModal from "@/components/AuthModal";
import ShareModal from "@/components/ShareModal";
import { useUser } from "@clerk/react";
import ReportModal from "@/components/ReportModal";
import { useSearch } from "@/context/SearchContext";
import SearchBar from "@/components/SearchBar";

import StayBuddyLoader from "@/components/StayBuddyLoader";

const PropertyDetails = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const [searchParams] = useSearchParams();
    const { search: globalSearch } = useSearch();
    const [isShareModalOpen, setIsShareModalOpen] = useState(false);
    const [isSaveModalOpen, setIsSaveModalOpen] = useState(false);
    const [isReportModalOpen, setIsReportModalOpen] = useState(false);
    const [showAllPhotos, setShowAllPhotos] = useState(false);
    const [hotel, setHotel] = useState<(Hotel & { rooms: Room[] }) | null>(null);
    const [similarHotels, setSimilarHotels] = useState<(Hotel & { rooms: Room[] })[]>([]);
    const [loading, setLoading] = useState(true);
    const [cityCenterDist, setCityCenterDist] = useState<string | null>(null);

    // Reviews state
    const { user } = useUser();
    const [reviews, setReviews] = useState<Review[]>([]);
    const [newReviewRating, setNewReviewRating] = useState(5);
    const [newReviewComment, setNewReviewComment] = useState("");
    const [submittingReview, setSubmittingReview] = useState(false);

    useEffect(() => {
        if (!id) return;
        window.scrollTo(0, 0);
        api.getHotelById(id).then(async data => {
            setHotel(data);
            if (data) {
                // Fetch city coordinates and calculate distance
                if (data.locationLat && data.locationLng) {
                    try {
                        const response = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(data.city)}`);
                        const results = await response.json();
                        if (results && results.length > 0) {
                            const cityLat = parseFloat(results[0].lat);
                            const cityLng = parseFloat(results[0].lon);

                            // Haversine formula
                            const R = 6371;
                            const dLat = (cityLat - data.locationLat) * Math.PI / 180;
                            const dLon = (cityLng - data.locationLng) * Math.PI / 180;
                            const a =
                                Math.sin(dLat / 2) * Math.sin(dLat / 2) +
                                Math.cos(data.locationLat * Math.PI / 180) *
                                Math.cos(cityLat * Math.PI / 180) *
                                Math.sin(dLon / 2) * Math.sin(dLon / 2);
                            const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
                            setCityCenterDist((R * c).toFixed(1));
                        }
                    } catch (err) {
                        console.error("OSM Error:", err);
                    }
                }

                api.searchHotels({ city: data.city, limit: 4 }).then(res => {
                    setSimilarHotels(res.hotels.filter(h => h.id !== id));
                    setLoading(false);
                });
                api.getHotelReviews(id).then(res => {
                    setReviews(res || []);
                });
            } else {
                setLoading(false);
            }
        });
    }, [id]);

    const handleAddReview = async () => {
        if (!user || !id) return setIsSaveModalOpen(true);
        if (!newReviewComment.trim()) return alert("Please enter your review text.");
        setSubmittingReview(true);
        try {
            // Ensure user is synced
            await api.syncUser({
                clerkId: user.id,
                email: user.primaryEmailAddress?.emailAddress || "",
                name: user.fullName || "Valued Guest",
                avatar: user.imageUrl
            });

            const added = await api.submitReview({
                userId: user.id,
                userName: user.fullName || "Valued Guest",
                hotelId: id,
                rating: newReviewRating,
                comment: newReviewComment,
                type: "REVIEW"
            });
            setReviews([added, ...reviews]);
            setNewReviewComment("");
            setNewReviewRating(5);
            // Optionally update hotel average rating locally
            if (hotel) {
                const total = hotel.rating * hotel.totalReviews;
                const newTotalReviews = hotel.totalReviews + 1;
                const newRating = (total + newReviewRating) / newTotalReviews;
                setHotel({ ...hotel, rating: Number(newRating.toFixed(1)), totalReviews: newTotalReviews });
            }
        } catch (e: any) {
            alert(e.message || "Failed to submit review.");
        } finally {
            setSubmittingReview(false);
        }
    };

    if (loading) return <StayBuddyLoader message="Fetching property details..." subtext="StayBuddy Hotel & Room Information" />;

    if (!hotel) return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 p-6 text-center">
            <h1 className="text-3xl font-bold mb-4 text-slate-800">Property Not Found</h1>
            <p className="text-slate-500 mb-8 max-w-md">We couldn't find the property you're looking for. It may have been removed or is temporarily unavailable.</p>
            <Button onClick={() => navigate("/")} className="bg-blue-600 hover:bg-blue-700">Back to Home</Button>
        </div>
    );

    const images = hotel.images.length >= 5 ? hotel.images : [
        hotel.images[0] || "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800",
        "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=800",
        "https://images.unsplash.com/photo-1445019980597-93fa8acb246c?w=800",
        "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=800",
        "https://images.unsplash.com/photo-1618773928121-c32242e63f39?w=800"
    ];

    const cheapestPrice = hotel.rooms.length > 0
        ? Math.min(...hotel.rooms.map(r => r.discountPrice || r.pricePerNight))
        : 1500;

    return (
        <div className="min-h-screen bg-slate-50/30 pb-20 font-sans selection:bg-violet-100">
            <Header />

            <div className="bg-slate-50/50 border-b border-slate-200 sticky top-0 z-40 py-4 hidden md:block">
                <main className="mx-auto px-4 sm:px-6 lg:px-12 max-w-[1280px] flex justify-center">
                    <div className="w-full max-w-[850px]">
                        <SearchBar />
                    </div>
                </main>
            </div>

            {/* Photos Modal */}
            {showAllPhotos && (
                <div className="fixed inset-0 bg-white z-[60] overflow-y-auto">
                    <div className="sticky top-0 bg-white/95 backdrop-blur-md px-6 py-4 flex items-center justify-between border-b shadow-sm">
                        <Button variant="ghost" size="icon" onClick={() => setShowAllPhotos(false)} className="rounded-full hover:bg-slate-100">
                            <ChevronLeft className="w-6 h-6" />
                        </Button>
                        <h2 className="font-bold text-lg text-slate-800">{hotel.name} - Photos</h2>
                        <div className="w-10"></div>
                    </div>
                    <div className="container mx-auto max-w-5xl py-12 px-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {images.map((img, i) => (
                                <img key={i} src={img} alt={`Hotel ${i}`} className="w-full h-80 object-cover rounded-[20px] shadow-sm hover:shadow-md transition-shadow" />
                            ))}
                        </div>
                    </div>
                </div>
            )}

            <main className="flex flex-col mx-auto px-4 sm:px-6 lg:px-12 max-w-[1280px] pt-4 md:pt-8">

                {/* Back Button */}
                <div className="mb-6">
                    <button
                        onClick={() => navigate(-1)}
                        className="flex items-center gap-2 text-slate-500 hover:text-violet-600 transition-colors group"
                    >
                        <div className="w-8 h-8 rounded-full border border-slate-200 flex items-center justify-center group-hover:border-violet-200 group-hover:bg-violet-50 transition-all">
                            <ChevronLeft className="w-4 h-4" />
                        </div>
                        <span className="text-[13px] font-bold uppercase tracking-wider">Back to all properties</span>
                    </button>
                </div>

                {/* Title Section */}
                <div className="flex flex-col md:flex-row md:items-end justify-between mb-6 gap-4">
                    <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-3 overflow-x-auto scrollbar-hide pb-1">
                            <span className="bg-violet-100 text-violet-700 text-[9px] md:text-[10px] font-bold px-2 py-1 rounded uppercase tracking-wider whitespace-nowrap">
                                Guest Favorite
                            </span>
                            <span className="text-slate-800 text-[12px] md:text-[13px] font-bold flex items-center gap-1 whitespace-nowrap">
                                <Star className="w-3.5 h-3.5 text-violet-600 fill-violet-600" />
                                {hotel.rating} <span className="font-normal text-slate-500">({hotel.totalReviews})</span>
                            </span>
                        </div>
                        <h1 className="text-2xl md:text-[34px] leading-tight font-bold text-slate-900 mb-2 truncate md:whitespace-normal">{hotel.name}</h1>
                        <div className="flex items-center gap-2 text-slate-500 text-[13px] md:text-[14px]">
                            <MapPin className="w-4 h-4 shrink-0" />
                            <p className="truncate">{hotel.city}, Bangladesh</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-2 md:gap-3 shrink-0 w-full md:w-auto">
                        <Button variant="outline" className="flex-1 md:flex-none rounded-full font-medium text-slate-700 border-slate-200 hover:bg-slate-50 px-4 md:px-5 py-2 md:py-2.5 h-auto gap-2 text-xs md:text-sm" onClick={() => setIsShareModalOpen(true)}>
                            <Share className="w-3.5 h-3.5" /> Share
                        </Button>
                        <Button variant="outline" className="flex-1 md:flex-none rounded-full font-medium text-slate-700 border-slate-200 hover:bg-slate-50 px-4 md:px-5 py-2 md:py-2.5 h-auto gap-2 text-xs md:text-sm" onClick={() => setIsSaveModalOpen(true)}>
                            <Heart className="w-3.5 h-3.5" /> Save
                        </Button>
                    </div>
                </div>

                <div className="flex flex-col lg:flex-row gap-8 lg:gap-12 mt-8">
                    {/* LEFT COLUMN - Gallery + About */}
                    <div className="flex-1 min-w-0">
                        {/* 3-Part Gallery */}
                        <div className="grid grid-cols-1 lg:grid-cols-12 gap-3 mb-12 h-auto">
                            {/* Left - Main Big Image */}
                            <div className="lg:col-span-8 relative group cursor-pointer overflow-hidden rounded-2xl md:rounded-[20px] h-[240px] md:h-[400px] lg:h-[420px]" onClick={() => setShowAllPhotos(true)}>
                                <img src={images[0]} className="w-full h-full object-cover group-hover:scale-[1.02] transition-transform duration-500" alt="Main" />
                                <div className="absolute bottom-4 right-4 lg:hidden">
                                    <Button className="bg-white/95 text-slate-900 hover:bg-white font-bold px-4 py-2 rounded-xl shadow-lg gap-2 text-xs">
                                        <FileText className="w-3.5 h-3.5" /> {images.length} Photos
                                    </Button>
                                </div>
                            </div>
                            {/* Right - Side Grid (Desktop Only) */}
                            <div className="hidden lg:grid col-span-4 grid-cols-2 grid-rows-2 gap-3">
                                {images.slice(1, 5).map((img, i) => (
                                    <div key={i} className="relative group cursor-pointer overflow-hidden rounded-[20px]" onClick={() => setShowAllPhotos(true)}>
                                        <img src={img} className="w-full h-full object-cover group-hover:scale-[1.02] transition-transform duration-500" alt={`Hotel ${i + 1}`} />
                                    </div>
                                ))}
                            </div>
                        </div>

                        <h2 className="text-[20px] font-bold text-slate-900 mb-4">About this property</h2>

                        <div className="space-y-6 text-[14px] text-slate-700 leading-relaxed mb-10">
                            <p>
                                {hotel.description || `Nestled along the tranquil banks, ${hotel.name} offers a sanctuary of peace in the heart of ${hotel.city}. Our boutique design merges contemporary minimalism with local cultural echoes, providing an editorial-standard experience for the discerning traveler.`}
                            </p>

                            <p className="border-t border-slate-100 pt-6 flex items-center gap-2 text-[14px]">
                                <MapPin className="w-4 h-4 text-violet-600" />
                                {cityCenterDist ? (
                                    <>Located <span className="font-bold text-violet-600">{cityCenterDist} km</span> from {hotel.city} center</>
                                ) : (
                                    <span className="text-slate-400">Calculating distance from city center...</span>
                                )}
                            </p>

                            <p className="text-[12px] text-slate-400 mt-2">
                                Distance in property description is calculated using © OpenStreetMap
                            </p>
                        </div>

                        {/* Mobile Map View */}
                        <div className="lg:hidden mb-10 border border-slate-200 rounded-[20px] bg-white p-5">
                            <h3 className="font-bold text-[16px] text-slate-900 mb-1">Where you'll be</h3>
                            <p className="text-[13px] text-slate-500 mb-4">{hotel.city}, Bangladesh</p>
                            <div className="w-full aspect-video bg-slate-100 rounded-[16px] overflow-hidden relative mb-4">
                                {(hotel.locationLat && hotel.locationLng) ? (
                                    <iframe
                                        src={`https://maps.google.com/maps?q=${hotel.locationLat},${hotel.locationLng}&hl=en&z=14&output=embed`}
                                        className="absolute inset-0 w-full h-full border-0"
                                        allowFullScreen
                                        loading="lazy"
                                    />
                                ) : (
                                    <img src="https://images.unsplash.com/photo-1524661135-423995f22d0b?w=600" className="w-full h-full object-cover opacity-80" alt="Map Preview" />
                                )}
                            </div>
                            <Button variant="outline" className="w-full rounded-xl border-slate-200 text-slate-700 hover:bg-slate-50 font-bold uppercase tracking-wider text-[11px] py-3">
                                <Map className="w-4 h-4 mr-2" /> Open in Google Maps
                            </Button>
                        </div>

                        {/* Most popular facilities */}
                        <div className="mb-12">
                            <h2 className="text-[18px] font-bold mb-6 text-slate-900">Most popular facilities</h2>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-y-6 gap-x-4">
                                {hotel.amenities.slice(0, 10).map(a => (
                                    <div key={a} className="flex items-center gap-2.5 text-slate-700 text-[14px]">
                                        {a.toLowerCase().includes('swimming') || a.toLowerCase().includes('pool') ? <Waves className="w-5 h-5 text-violet-600" /> :
                                            a.toLowerCase().includes('wifi') ? <Wifi className="w-5 h-5 text-violet-600" /> :
                                                a.toLowerCase().includes('airport') || a.toLowerCase().includes('shuttle') ? <Bus className="w-5 h-5 text-violet-600" /> :
                                                    a.toLowerCase().includes('fitness') || a.toLowerCase().includes('gym') ? <Dumbbell className="w-5 h-5 text-violet-600" /> :
                                                        a.toLowerCase().includes('parking') ? <ParkingCircle className="w-5 h-5 text-violet-600" /> :
                                                            a.toLowerCase().includes('room service') ? <Headset className="w-5 h-5 text-violet-600" /> :
                                                                a.toLowerCase().includes('restaurant') ? <UtensilsCrossed className="w-5 h-5 text-violet-600" /> :
                                                                    a.toLowerCase().includes('coffee') || a.toLowerCase().includes('tea') ? <Coffee className="w-5 h-5 text-violet-600" /> :
                                                                        a.toLowerCase().includes('breakfast') ? <Soup className="w-5 h-5 text-violet-600" /> :
                                                                            <CheckCircle2 className="w-5 h-5 text-violet-600" />}
                                        <span className="font-medium text-slate-600">{a}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                    </div>

                    {/* RIGHT COLUMN - Sidebar */}
                    <div className="w-full lg:w-[320px] shrink-0 lg:sticky lg:top-24 h-fit space-y-6">

                        {/* Desktop Map Widget */}
                        <div className="hidden lg:flex flex-col border border-slate-200 rounded-[24px] bg-white p-4 h-auto shadow-sm group hover:shadow-md transition-all duration-300">
                            <div className="flex items-center justify-between mb-3 px-0.5">
                                <h3 className="font-bold text-[14px] text-slate-900 flex items-center gap-2">
                                    <Map className="w-3.5 h-3.5 text-violet-600" /> Where you'll be
                                </h3>
                                <span className="flex items-center gap-1.5 cursor-pointer text-slate-400 hover:text-slate-600 transition-colors text-[10px] font-bold uppercase tracking-wider" onClick={() => { if (!user) return setIsSaveModalOpen(true); setIsReportModalOpen(true); }}>
                                    <Flag className="w-3 h-3" /> Report
                                </span>
                            </div>
                            <p className="text-[12px] text-slate-500 mb-3 truncate px-0.5">{hotel.city}, Bangladesh</p>
                            <div className="w-full h-[150px] bg-slate-100 rounded-[18px] overflow-hidden relative mb-4 border border-slate-100 shadow-inner">
                                {(hotel.locationLat && hotel.locationLng) ? (
                                    <iframe
                                        src={`https://maps.google.com/maps?q=${hotel.locationLat},${hotel.locationLng}&hl=en&z=14&output=embed`}
                                        className="absolute inset-0 w-full h-full border-0 grayscale-[0.2] contrast-[1.1]"
                                        allowFullScreen
                                        loading="lazy"
                                    />
                                ) : (
                                    <>
                                        <img src="https://images.unsplash.com/photo-1524661135-423995f22d0b?w=600" className="w-full h-full object-cover opacity-80" alt="Map Preview" />
                                        <div className="absolute top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%] w-10 h-10 bg-violet-600/20 rounded-full flex items-center justify-center">
                                            <div className="w-5 h-5 bg-violet-600 rounded-full border-2 border-white flex items-center justify-center shadow-lg">
                                                <MapPin className="w-3 h-3 text-white" />
                                            </div>
                                        </div>
                                    </>
                                )}
                            </div>
                            <Button variant="outline" className="w-full h-auto py-2.5 rounded-xl border-slate-100 text-slate-600 hover:bg-slate-50 font-bold uppercase tracking-wider text-[10px] gap-2">
                                <MapPin className="w-3.5 h-3.5" /> Get Directions
                            </Button>
                        </div>

                        {/* Property Highlights - Aligned beside About section */}
                        <div className="bg-violet-50 rounded-[24px] p-6 shadow-sm border border-violet-100 mt-2">
                            <h3 className="font-bold text-[16px] text-slate-900 mb-4">Property highlights</h3>
                            <p className="font-bold text-[14px] text-slate-800 mb-4">Perfect for a 1-night stay!</p>

                            <div className="space-y-4 mb-6">
                                <div className="flex gap-3">
                                    <div className="w-5 shrink-0 flex justify-center"><MapPin className="w-5 h-5 text-slate-600" /></div>
                                    <p className="text-[13px] text-slate-700">Top Location: Highly rated by recent guests ({hotel.rating})</p>
                                </div>
                                <div className="flex gap-3 text-violet-700 bg-violet-100/50 p-3 rounded-xl border border-violet-200">
                                    <div className="w-5 shrink-0 flex justify-center"><Calendar className="w-5 h-5" /></div>
                                    <div>
                                        <p className="text-[13px] font-bold">Your Selection</p>
                                        <p className="text-[12px] font-medium">
                                            {globalSearch.checkIn && globalSearch.checkOut ? (
                                                <>{new Date(globalSearch.checkIn).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} - {new Date(globalSearch.checkOut).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} ({Math.max(1, Math.round((new Date(globalSearch.checkOut).getTime() - new Date(globalSearch.checkIn).getTime()) / 86400000))} night{Math.max(1, Math.round((new Date(globalSearch.checkOut).getTime() - new Date(globalSearch.checkIn).getTime()) / 86400000)) > 1 ? 's' : ''})</>
                                            ) : (
                                                "Select dates to see price"
                                            )}
                                        </p>
                                        <p className="text-[11px] opacity-70 mt-0.5">{globalSearch.adults} adults · {globalSearch.children} children · {globalSearch.rooms} room</p>
                                    </div>
                                </div>
                                <div className="flex gap-3">
                                    <div className="w-5 shrink-0 flex justify-center"><CheckCircle2 className="w-5 h-5 text-slate-600" /></div>
                                    <div>
                                        <p className="text-[13px] font-bold text-slate-800">Check-in / Check-out</p>
                                        <p className="text-[13px] text-slate-700">In: {hotel.checkInTime} • Out: {hotel.checkOutTime}</p>
                                    </div>
                                </div>
                                <div className="flex gap-3">
                                    <div className="w-5 shrink-0 flex justify-center"><Building2 className="w-5 h-5 text-slate-600" /></div>
                                    <div>
                                        <p className="text-[13px] font-bold text-slate-800">Rooms with:</p>
                                        <p className="text-[13px] text-slate-700 flex items-center gap-1.5"><Layout className="w-4 h-4" /> City view</p>
                                    </div>
                                </div>
                                <div className="flex gap-3">
                                    <div className="w-5 shrink-0 flex justify-center"><ParkingCircle className="w-5 h-5 text-slate-600" /></div>
                                    <p className="text-[13px] text-slate-700">Free private parking available at the hotel</p>
                                </div>
                            </div>

                            <Button
                                onClick={() => {
                                    const el = document.getElementById('available-rooms');
                                    if (el) el.scrollIntoView({ behavior: 'smooth' });
                                }}
                                className="w-full bg-violet-600 hover:bg-violet-700 text-white font-bold py-[14px] rounded-full text-[15px] shadow-sm transition-all hover:shadow-md active:scale-[0.98]"
                            >
                                Reserve
                            </Button>
                        </div>
                    </div>
                </div>

                {/* Available Rooms Section */}
                <div id="available-rooms" className="mt-12 pt-12 border-t border-slate-100 mb-12">
                    <div className="flex justify-between items-end mb-8">
                        <h2 className="text-[24px] font-bold text-slate-900">Available Rooms</h2>
                        <a href="#" className="text-[12px] font-bold text-violet-600 hover:underline">FULL PRICING POLICY</a>
                    </div>
                    <div className="space-y-4">
                        {(hotel?.rooms || []).filter(room => {
                            const adults = parseInt(searchParams.get("adults") || globalSearch.adults.toString());
                            const children = parseInt(searchParams.get("children") || globalSearch.children.toString());
                            const roomsCount = parseInt(searchParams.get("rooms") || globalSearch.rooms.toString());
                            const pets = searchParams.get("pets") === "true" || globalSearch.petsAllowed;

                            const adultsPerRoom = Math.ceil(adults / roomsCount);
                            const childrenPerRoom = Math.ceil(children / roomsCount);

                            const fitsAdults = (room.maxAdults || 2) >= adultsPerRoom;
                            const fitsChildren = (room.maxChildren || 0) >= childrenPerRoom;
                            const petCheck = pets ? !!room.petsAllowed : true;

                            return fitsAdults && fitsChildren && petCheck;
                        }).map((room) => (
                            <div key={room.id} className="border border-slate-200 rounded-[24px] bg-white p-5 flex flex-col md:flex-row gap-8 shadow-sm hover:shadow-md transition-all duration-300">
                                {/* Room Image Gallery/Preview */}
                                <div className="w-full md:w-[260px] h-[180px] shrink-0 rounded-[16px] overflow-hidden relative group">
                                    <img src={room.images[0] || "https://images.unsplash.com/photo-1590490360182-c33d597353a0?w=600"} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" alt={room.type} />
                                    <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-[10px] font-bold text-slate-800 uppercase tracking-wider shadow-sm">
                                        Floor {room.floorNumber}
                                    </div>
                                    {room.availableCount === 0 && (
                                        <div className="absolute inset-0 bg-slate-900/60 flex items-center justify-center backdrop-blur-[2px]">
                                            <span className="text-white font-bold text-[12px] uppercase tracking-[0.2em] border-2 border-white/40 px-4 py-2 rounded-lg">Sold Out</span>
                                        </div>
                                    )}
                                </div>

                                {/* Room Content Area */}
                                <div className="flex-1 flex flex-col pt-1">
                                    <div className="flex justify-between items-start mb-4">
                                        <div>
                                            <div className="flex items-center gap-3 mb-1">
                                                <h3 className="font-bold text-[20px] text-slate-900 leading-none">{room.type}</h3>
                                                <div className="inline-flex items-center gap-1.5 bg-indigo-50/70 text-indigo-700 text-[10px] font-black px-2 py-0.5 rounded border border-indigo-100/50 uppercase tracking-widest mt-0.5">
                                                    <LayoutGrid className="w-2.5 h-2.5" /> {room.category || "Standard Room"}
                                                </div>
                                            </div>
                                            <div className="flex flex-wrap items-center gap-x-6 gap-y-2 mt-4 pb-4 border-b border-slate-100/50">
                                                <div className="flex items-center gap-2 text-slate-600 text-[13px] font-bold">
                                                    <Users className="w-4 h-4 text-slate-400" />
                                                    {room.capacity || "2 Guests"}
                                                </div>
                                                <div className="flex items-center gap-2 text-slate-600 text-[13px] font-bold">
                                                    <Layout className="w-4 h-4 text-slate-400" />
                                                    {room.viewType || "City View"}
                                                </div>
                                                <div className="flex items-center gap-2 text-emerald-600 text-[13px] font-black ml-auto">
                                                    <CheckCircle2 className="w-4 h-4" />
                                                    {room.availableCount > 0 ? `${room.availableCount} Rooms left` : 'Sold Out'}
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Order: Beds -> Amenities -> Description */}
                                    <div className="space-y-6 mt-2">
                                        {/* 1. Beds */}
                                        <div className="flex flex-wrap items-center gap-3">
                                            {(() => {
                                                const bedObj = room.beds || {};
                                                const entries = Object.entries(bedObj).filter(([_, c]) => c > 0);
                                                if (entries.length === 0) return <span className="text-[10px] text-slate-300 italic uppercase tracking-widest">No bed details n/a</span>;
                                                return entries.map(([type, count]) => (
                                                    <div key={type} className="flex items-center gap-2.5 bg-indigo-50/50 border border-indigo-100/50 px-3 py-2 rounded-xl">
                                                        <BedDouble className="w-4 h-4 text-indigo-500" />
                                                        <span className="text-[12px] font-black text-indigo-700 tracking-tight">{count}x {type}</span>
                                                    </div>
                                                ));
                                            })()}
                                        </div>

                                        {/* 2. Amenities */}
                                        <div className="flex flex-wrap items-center gap-3">
                                            {room.amenities.slice(0, 6).map(aId => {
                                                const amenity = ROOM_AMENITIES.find(ra => ra.id === aId);
                                                return (
                                                    <div key={aId} className="flex items-center gap-2 text-slate-500 text-[11px] font-bold bg-slate-50/80 px-3 py-1.5 rounded-lg border border-slate-100">
                                                        <span className="text-slate-400">{amenity?.icon || "✓"}</span>
                                                        <span className="uppercase tracking-wider">{amenity?.label || aId}</span>
                                                    </div>
                                                );
                                            })}
                                            {room.amenities.length > 6 && (
                                                <span className="text-[11px] text-violet-600 font-black px-2 uppercase tracking-widest">+{room.amenities.length - 6} more</span>
                                            )}
                                        </div>

                                        {/* 3. Description */}
                                        {room.description && (
                                            <div className="bg-slate-50/30 rounded-2xl p-4 border border-slate-100/50">
                                                <p className="text-slate-500 text-[13px] leading-relaxed italic line-clamp-3">{room.description}</p>
                                            </div>
                                        )}
                                    </div>

                                    <div className="mt-auto pt-6 border-t border-slate-100 flex items-end justify-between">
                                        <div className="flex flex-col">
                                            <span className="text-slate-400 text-[11px] font-bold uppercase tracking-widest mb-1 italic">Total for 1 night</span>
                                            <div className="flex items-baseline gap-2">
                                                {room.discountPrice ? (
                                                    <>
                                                        <span className="text-[26px] font-black text-slate-900 tracking-tight leading-none">৳ {room.discountPrice.toLocaleString()}</span>
                                                        <span className="text-[14px] font-bold text-rose-500 line-through opacity-60">৳ {room.pricePerNight.toLocaleString()}</span>
                                                    </>
                                                ) : (
                                                    <span className="text-[26px] font-black text-slate-900 tracking-tight leading-none">৳ {room.pricePerNight.toLocaleString()}</span>
                                                )}
                                                <span className="text-[13px] text-slate-500 font-medium"> incl. taxes</span>
                                            </div>
                                        </div>
                                        <Button
                                            onClick={() => navigate(`/checkout/${hotel.id}`)}
                                            disabled={room.availableCount === 0}
                                            className={`px-10 py-6 rounded-full font-bold uppercase tracking-[0.15em] text-[12px] transition-all duration-300 shadow-lg ${room.availableCount > 0
                                                ? "bg-violet-600 hover:bg-violet-700 text-white shadow-violet-600/20 active:scale-95"
                                                : "bg-slate-100 text-slate-400 cursor-not-allowed shadow-none"
                                                }`}
                                        >
                                            Select Room
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Guest Reviews */}
                <div id="reviews" className="mb-12 mt-16 pt-12 border-t border-slate-100">
                    <div className="flex items-center gap-3 mb-8">
                        <h2 className="text-[24px] font-bold text-slate-900">Guest Reviews</h2>
                        <span className="text-violet-600 text-[14px] font-bold flex items-center gap-1 ml-2">
                            <Star className="w-4 h-4 fill-violet-600" /> {hotel.rating}
                        </span>
                        <span className="text-slate-500 text-[14px]">- {hotel.totalReviews} reviews</span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                        {!reviews || reviews.length === 0 ? (
                            <>
                                {/* Fallback mock reviews if empty */}
                                <div>
                                    <div className="flex items-center gap-3 mb-3">
                                        <div className="w-10 h-10 rounded-full bg-violet-100 text-violet-700 font-bold flex items-center justify-center text-sm">
                                            MS
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-slate-900 text-[14px] leading-tight">Mahfuz Shuvo</h4>
                                            <p className="text-[10px] uppercase font-bold text-slate-400 mt-1">MAY 2024</p>
                                        </div>
                                    </div>
                                    <p className="text-[14px] text-slate-600 leading-relaxed hover:text-slate-900 transition-colors">"The view from the Deluxe King room is absolutely breathtaking. The staff was incredibly attentive, and the breakfast spread was high-end."</p>
                                </div>
                                <div>
                                    <div className="flex items-center gap-3 mb-3">
                                        <div className="w-10 h-10 rounded-full bg-violet-100 text-violet-700 font-bold flex items-center justify-center text-sm">
                                            RA
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-slate-900 text-[14px] leading-tight">Riya Ahmed</h4>
                                            <p className="text-[10px] uppercase font-bold text-slate-400 mt-1">APRIL 2024</p>
                                        </div>
                                    </div>
                                    <p className="text-[14px] text-slate-600 leading-relaxed hover:text-slate-900 transition-colors">"Immaculate design and comfort. The infinity pool area is world-class. It's rare to find such editorial quality service in the region."</p>
                                </div>
                            </>
                        ) : (
                            reviews.slice(0, 4).map(r => (
                                <div key={r.id}>
                                    <div className="flex items-center gap-4 mb-3">
                                        <div className="w-10 h-10 rounded-full bg-violet-100 text-violet-700 font-bold flex items-center justify-center text-sm uppercase">
                                            {r.userName.charAt(0)}
                                        </div>
                                        <div>
                                            <h4 className="text-[14px] font-bold text-slate-900">{r.userName}</h4>
                                            <p className="text-[11px] text-slate-500 font-medium">{new Date(r.createdAt).toLocaleDateString(undefined, { month: 'short', year: 'numeric' })}</p>
                                        </div>
                                    </div>

                                    <p className="text-[14px] text-slate-600 leading-relaxed">"{r.comment}"</p>
                                </div>
                            ))
                        )}
                    </div>

                    <Button variant="outline" className="rounded-full font-bold text-violet-600 border-violet-200 hover:bg-violet-50 px-8 py-2.5 h-auto text-[14px] transition-colors">
                        Read all {hotel.totalReviews} reviews
                    </Button>

                    {/* Write Review Section */}
                    <div className="mt-12 p-6 bg-white rounded-[24px] border border-slate-200 shadow-sm max-w-[600px]">
                        <h3 className="font-bold text-slate-900 mb-4 text-[16px]">{user ? "Share your experience" : "Log in to leave a review"}</h3>
                        <div className="flex gap-1.5 mb-4">
                            {[1, 2, 3, 4, 5].map(n => (
                                <Star key={n} className={`w-6 h-6 cursor-pointer transition-colors ${n <= newReviewRating ? "text-violet-500 fill-violet-500" : "text-slate-200"}`} onClick={() => setNewReviewRating(n)} />
                            ))}
                        </div>
                        <textarea
                            value={newReviewComment}
                            onChange={(e) => setNewReviewComment(e.target.value)}
                            className="w-full bg-slate-50 border border-slate-200 rounded-[8px] px-4 py-3 text-[14px] focus:border-violet-300 outline-none placeholder:text-slate-400 mb-4 transition-colors min-h-[100px]"
                            placeholder="Write your review here..."
                        />
                        <Button onClick={handleAddReview} disabled={submittingReview} className="bg-violet-600 hover:bg-violet-700 text-white font-bold px-8 py-2.5 rounded-full h-auto text-[14px] shadow-sm transition-all active:scale-[0.98]">
                            {submittingReview ? "Submitting..." : "Post Review"}
                        </Button>
                    </div>
                </div>

            </main>
            <Footer />

            <ShareModal isOpen={isShareModalOpen} onClose={() => setIsShareModalOpen(false)} />
            <AuthModal isOpen={isSaveModalOpen} onClose={() => setIsSaveModalOpen(false)} title="Log in or save to favorites" />

            {hotel && user && (
                <ReportModal
                    isOpen={isReportModalOpen}
                    onClose={() => setIsReportModalOpen(false)}
                    userId={user.id}
                    userName={user.fullName || "Guest"}
                    hotelId={hotel.id}
                    hotelName={hotel.name}
                />
            )}
        </div>
    );
};

export default PropertyDetails;
