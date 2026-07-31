import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useUser } from "@clerk/react";
import { api, Hotel, Room } from "../services/api";
import {
  CreditCard, BanknoteIcon, CheckCircle, Loader2, Shield,
  Calendar, BedDouble, Star, Info, Check, Sparkles, Car,
  Coffee, Users, Plane, CreditCard as CardIcon
} from "lucide-react";
import { useSearch } from "../context/SearchContext";

type Step = "SELECT" | "DETAILS" | "SUCCESS";

export default function CheckoutPage() {
  const { hotelId } = useParams<{ hotelId: string }>();
  const navigate = useNavigate();
  const { user } = useUser();

  const [hotel, setHotel] = useState<(Hotel & { rooms: Room[] }) | null>(null);
  const [loading, setLoading] = useState(true);
  const [step, setStep] = useState<Step>("SELECT");
  const { search: globalSearch } = useSearch();
  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);
  const [checkIn, setCheckIn] = useState(globalSearch.checkIn || "");
  const [checkOut, setCheckOut] = useState(globalSearch.checkOut || "");
  const [nights, setNights] = useState(1);

  // Guest Details Form
  const [firstName, setFirstName] = useState(user?.firstName || "");
  const [lastName, setLastName] = useState(user?.lastName || "");
  const [email, setEmail] = useState(user?.primaryEmailAddress?.emailAddress || "");
  const [country, setCountry] = useState("Bangladesh");
  const [phone, setPhone] = useState("");
  const [travelingForWork, setTravelingForWork] = useState(false);
  const [bookingFor, setBookingFor] = useState<"main" | "someone">("main");

  // Requests & Arrival
  const [specialRequests, setSpecialRequests] = useState("");
  const [arrivalTime, setArrivalTime] = useState("I don't know");

  // Payment
  const [paymentMethod, setPaymentMethod] = useState<string>("Cash");
  const [processing, setProcessing] = useState(false);
  const [result, setResult] = useState<{ message: string; booking: any } | null>(null);

  useEffect(() => {
    if (!hotelId) return;
    api.getHotelById(hotelId).then(h => {
      setHotel(h);
      if (h?.acceptedPayments?.length) {
        setPaymentMethod(h.acceptedPayments[0]);
      } else {
        setPaymentMethod("Cash");
      }
      setLoading(false);
    });
  }, [hotelId]);

  useEffect(() => {
    if (checkIn && checkOut) {
      const diff = (new Date(checkOut).getTime() - new Date(checkIn).getTime()) / 86400000;
      setNights(Math.max(1, Math.round(diff)));
    } else if (globalSearch.checkIn && globalSearch.checkOut) {
      setCheckIn(globalSearch.checkIn);
      setCheckOut(globalSearch.checkOut);
    }
  }, [checkIn, checkOut, globalSearch]);

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-[#f5f5f5]">
      <Loader2 className="w-8 h-8 animate-spin text-[#003b95]" />
    </div>
  );

  if (!hotel) return (
    <div className="min-h-screen flex items-center justify-center bg-[#f5f5f5]">
      <div className="bg-white p-8 rounded-lg shadow text-center">
        <h2 className="text-xl font-bold text-gray-800 mb-2">Hotel not found</h2>
        <p className="text-gray-500 mb-6">The property you are looking for is unavailable.</p>
        <button onClick={() => navigate("/")} className="px-6 py-2 bg-[#003b95] text-white rounded font-medium">Go Home</button>
      </div>
    </div>
  );

  const total = selectedRoom ? (selectedRoom.discountPrice || selectedRoom.pricePerNight) * nights : 0;
  const acceptedPayments = hotel.acceptedPayments?.length ? hotel.acceptedPayments : ["Cash", "Credit Card"];

  const handlePay = async () => {
    if (!selectedRoom) return;
    if (!firstName || !lastName || !email) {
      alert("Please fill out the required details (Name, Email).");
      return;
    }

    setProcessing(true);
    try {
      const gName = `${firstName} ${lastName}`;
      // Map frontend payment to strictly accepted backed enum or custom
      const pMethod = paymentMethod.toLowerCase().includes("cash") ? "cash" :
        paymentMethod.toLowerCase().includes("bkash") ? "bkash" :
          paymentMethod.toLowerCase().includes("nagad") ? "nagad" : "card";

      // Allow users to book even if not logged in if offline/cash, or force login
      const actingUserId = user?.id || "guest_" + Date.now();

      const res = await api.processBookingPayment({
        userId: actingUserId,
        hotelId: hotel.id,
        roomId: selectedRoom.id,
        checkIn: checkIn || new Date().toISOString().split("T")[0],
        checkOut: checkOut || new Date(Date.now() + 86400000 * nights).toISOString().split("T")[0],
        nights,
        paymentMethod: pMethod,
        guestName: gName,
        guestEmail: email,
        guestPhone: phone,
        specialRequests,
        arrivalTime,
        travelingForWork,
      });
      setResult(res);
      setStep("SUCCESS");
    } catch (e: any) {
      alert(e.message || "Payment failed. Please try again.");
    } finally {
      setProcessing(false);
    }
  };

  // ---- RENDER: STEP 1 - SELECTION ----
  if (step === "SELECT") {
    return (
      <div className="min-h-screen bg-[#f5f5f5] pb-10">
        <div className="max-w-5xl mx-auto px-4 pt-8">
          <button onClick={() => navigate(-1)} className="text-[#003b95] font-semibold text-sm hover:underline mb-6">← Back to Property</button>
          <div className="bg-white rounded border border-gray-200 shadow-sm p-6 mb-6">
            <h1 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2"><BedDouble className="text-[#003b95]" /> Room Selection</h1>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">Check-in Date</label>
                <input type="date" className="w-full border-2 border-gray-300 rounded px-3 py-2 outline-none focus:border-[#003b95]" value={checkIn} onChange={e => setCheckIn(e.target.value)} min={new Date().toISOString().split("T")[0]} />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">Check-out Date</label>
                <input type="date" className="w-full border-2 border-gray-300 rounded px-3 py-2 outline-none focus:border-[#003b95]" value={checkOut} onChange={e => setCheckOut(e.target.value)} min={checkIn || new Date().toISOString().split("T")[0]} />
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="font-bold text-lg text-gray-800">Available Rooms at {hotel.name}</h3>
              {hotel.rooms.map(room => (
                <label key={room.id} className={`flex flex-col sm:flex-row sm:items-center justify-between p-4 border-2 rounded cursor-pointer transition ${selectedRoom?.id === room.id ? "border-[#003b95] bg-[#f2f6fa]" : "border-gray-200 hover:border-gray-300"} ${room.availableCount === 0 ? "opacity-50 pointer-events-none grayscale" : ""}`}>
                  <div className="flex items-start gap-4 mb-4 sm:mb-0">
                    <div className="pt-1">
                      <input type="radio" checked={selectedRoom?.id === room.id} onChange={() => setSelectedRoom(room)} className="w-5 h-5 accent-[#003b95]" disabled={room.availableCount === 0} />
                    </div>
                    {room.images[0] && <img src={room.images[0]} className="w-24 h-24 rounded object-cover" alt="" />}
                    <div>
                      <p className="font-bold text-gray-900 text-lg">{room.type}</p>
                      <p className="text-sm text-gray-600 mb-1">{room.category} · Floor {room.floorNumber} · {room.availableCount === 0 ? "Sold out" : `${room.availableCount} available`}</p>
                      <div className="flex flex-wrap gap-1 mt-2">
                        {room.amenities.slice(0, 4).map(a => <span key={a} className="text-xs bg-gray-100 text-gray-600 border border-gray-200 px-2 py-0.5 rounded flex items-center"><Check className="w-3 h-3 mr-1 text-green-600" /> {a}</span>)}
                      </div>
                    </div>
                  </div>
                  <div className="text-left sm:text-right shrink-0 ml-9 sm:ml-0">
                    <p className="text-sm text-gray-500 mb-1">Price for 1 night</p>
                    {room.discountPrice && (
                      <p className="text-sm text-red-600 line-through mb-0.5">BDT {room.pricePerNight}</p>
                    )}
                    <p className="font-bold text-black text-2xl">BDT {room.discountPrice || room.pricePerNight}</p>
                    <p className="text-xs text-gray-500 mt-1">Includes taxes and charges</p>
                  </div>
                </label>
              ))}
            </div>

            <div className="mt-8 flex justify-end">
              <button
                onClick={() => {
                  if (!checkIn || !checkOut) { alert("Please select Check-in and Check-out dates."); return; }
                  if (!selectedRoom) { alert("Please select a room."); return; }
                  setStep("DETAILS");
                }}
                className="bg-[#003b95] text-white px-8 py-3 rounded font-bold text-lg hover:bg-[#002f7a] transition-colors"
                disabled={!selectedRoom}
              >
                I'll reserve
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ---- RENDER: SUCCESS ----
  if (step === "SUCCESS" && result) {
    return (
      <div className="min-h-screen bg-[#f5f5f5] pt-12 pb-20">
        <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center">
          <CheckCircle className="w-20 h-20 text-green-600 mx-auto mb-6" />
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Your booking is confirmed!</h2>
          <p className="text-lg text-gray-600 mb-6">{result.message}</p>
          <div className="bg-[#f0f6ff] border border-[#d6e5ff] rounded p-4 mb-8 text-left inline-block w-full">
            <h3 className="font-bold text-[#003b95] text-lg mb-2">Booking ID: {result.booking.id}</h3>
            <p className="text-gray-800 text-sm">We've sent a confirmation email to <strong>{email}</strong>.</p>
          </div>
          <button onClick={() => navigate("/dashboard")} className="bg-[#003b95] text-white px-8 py-3 rounded font-bold hover:bg-[#002f7a]">
            Manage Booking Options
          </button>
        </div>
      </div>
    );
  }

  // ---- RENDER: STEP 2 - DETAILS & PAYMENT ----
  return (
    <div className="min-h-screen bg-[#f5f5f5] pb-12 font-sans text-[14px]">

      {/* Top Steps Indicator */}
      <div className="bg-white border-b border-gray-200 shadow-sm sticky top-0 z-10 hidden md:block">
        <div className="max-w-5xl mx-auto px-4 py-4 flex items-center justify-center gap-8">
          <div className="flex items-center gap-2 text-green-700 font-bold">
            <CheckCircle className="w-5 h-5 fill-white text-green-600" />
            <span>Your selection</span>
          </div>
          <div className="w-12 h-0.5 bg-gray-300" />
          <div className="flex items-center gap-2 text-gray-900 font-bold">
            <div className="w-5 h-5 rounded-full bg-[#003b95] text-white flex items-center justify-center text-xs">2</div>
            <span>Your details</span>
          </div>
          <div className="w-12 h-0.5 bg-gray-300" />
          <div className="flex items-center gap-2 text-gray-400 font-bold">
            <div className="w-5 h-5 rounded-full border-2 border-gray-300 flex items-center justify-center text-xs">3</div>
            <span>Final step</span>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-6 grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">

        {/* ---- LEFT COLUMN: SUMMARY ---- */}
        <div className="lg:col-span-4 space-y-4">

          {/* Property Card */}
          <div className="bg-white rounded border border-gray-200 p-4 shadow-sm">
            <h2 className="text-[12px] text-gray-500 uppercase tracking-wide font-bold mb-1">Hotel</h2>
            <h1 className="text-[20px] font-bold text-gray-900 leading-tight mb-1">{hotel.name}</h1>
            <div className="flex items-center gap-1 mb-2">
              {[...Array(Math.floor(hotel.rating || 5))].map((_, i) => (
                <Star key={i} className="w-3.5 h-3.5 fill-[#febb02] text-[#febb02]" />
              ))}
            </div>
            <p className="text-[13px] text-gray-600 mb-3">{hotel.address}, {hotel.city}</p>
            <div className="bg-[#f2f6fa] rounded p-2 flex items-center gap-2 text-[#003b95]">
              <div className="w-8 h-8 rounded bg-[#003b95] text-white flex items-center justify-center font-bold">{hotel.rating || "9.0"}</div>
              <div>
                <p className="font-bold text-[13px]">Excellent</p>
                <p className="text-[11px] text-gray-500">{hotel.totalReviews} reviews</p>
              </div>
            </div>
          </div>

          {/* Booking Details Card */}
          <div className="bg-white rounded border border-gray-200 p-4 shadow-sm">
            <h3 className="font-bold text-[16px] text-gray-900 mb-4">Your booking details</h3>
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div className="border-r border-gray-200 pr-2">
                <p className="text-[13px] text-gray-600 mb-1">Check-in</p>
                <p className="font-bold text-[15px]">{new Date(checkIn).toLocaleDateString("en-US", { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' })}</p>
                <p className="text-[12px] text-gray-500 mt-1">From 2:00 PM</p>
              </div>
              <div className="pl-2">
                <p className="text-[13px] text-gray-600 mb-1">Check-out</p>
                <p className="font-bold text-[15px]">{new Date(checkOut).toLocaleDateString("en-US", { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' })}</p>
                <p className="text-[12px] text-gray-500 mt-1">Until 12:00 PM</p>
              </div>
            </div>
            <div className="border-t border-gray-200 pt-3 flex flex-col gap-1">
              <p className="text-[13px] text-gray-600">Total length of stay:</p>
              <p className="font-bold text-[14px] text-gray-900">{nights} night{nights > 1 ? "s" : ""}</p>
            </div>
          </div>

          {/* Price Summary Card */}
          <div className="bg-[#ebf3ff] rounded border border-[#003b95]/20 shadow-sm overflow-hidden">
            <div className="p-4 border-b border-[#003b95]/10 bg-white">
              <h3 className="font-bold text-[16px] text-gray-900 mb-2">Your price summary</h3>
              <div className="flex justify-between items-center text-[14px] mb-2 text-gray-600">
                <span>Original price</span>
                <span className="line-through">BDT {selectedRoom?.pricePerNight! * nights}</span>
              </div>
              <div className="flex justify-between items-center text-[14px]">
                <span className="text-gray-900 font-medium">Selected room</span>
                <span className="font-medium text-gray-900">BDT {total}</span>
              </div>
            </div>
            <div className="p-4 bg-[#ebf3ff]">
              <div className="flex justify-between items-start mb-1">
                <span className="text-[32px] font-bold text-[#003b95] leading-none">Total</span>
                <span className="text-[32px] font-bold text-[#003b95] leading-none">BDT {total}</span>
              </div>
              <p className="text-[12px] text-[#003b95] text-right">Includes taxes and charges</p>
            </div>
          </div>

          {/* Cancellation Info */}
          <div className="bg-white rounded border border-gray-200 p-4 shadow-sm">
            <h3 className="font-bold text-[14px] text-gray-900 mb-2">How much will it cost to cancel?</h3>
            <p className="text-[13px] text-green-700 font-medium mb-1">Free cancellation before {new Date(new Date(checkIn).getTime() - 86400000).toLocaleDateString()}</p>
            <div className="flex justify-between text-[13px] text-gray-600 mt-2 pt-2 border-t border-gray-100">
              <span>After 12:00 AM on {new Date(new Date(checkIn).getTime() - 86400000).toLocaleDateString()}</span>
              <span className="font-medium">BDT {total}</span>
            </div>
          </div>
        </div>

        {/* ---- RIGHT COLUMN: FORM DETAILS ---- */}
        <div className="lg:col-span-8 space-y-6">

          {/* User Details */}
          <div className="bg-white rounded border border-gray-200 shadow-sm">
            <div className="p-5 border-b border-gray-200">
              <h2 className="text-[20px] font-bold text-gray-900">Enter your details</h2>
              {!user && (
                <div className="bg-[#f0f6ff] border border-[#cce0ff] rounded p-3 mt-4 flex items-start gap-3">
                  <div className="mt-1"><Users className="w-5 h-5 text-[#003b95]" /></div>
                  <div>
                    <h3 className="font-bold text-[#003b95] text-[14px]">Almost done! Just fill in the * required info</h3>
                    <p className="text-[12px] text-gray-600 mt-0.5">Please sign in to book with your saved details, or enter them below.</p>
                  </div>
                </div>
              )}
            </div>

            <div className="p-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-5">
                <div>
                  <label className="block text-[14px] font-bold text-gray-900 mb-1">First name <span className="text-red-500">*</span></label>
                  <input type="text" value={firstName} onChange={e => setFirstName(e.target.value)} className="w-full border-2 border-gray-300 rounded px-3 py-2 outline-none focus:border-[#003b95] text-[14px]" />
                </div>
                <div>
                  <label className="block text-[14px] font-bold text-gray-900 mb-1">Last name <span className="text-red-500">*</span></label>
                  <input type="text" value={lastName} onChange={e => setLastName(e.target.value)} className="w-full border-2 border-gray-300 rounded px-3 py-2 outline-none focus:border-[#003b95] text-[14px]" />
                </div>
              </div>

              <div className="mb-5">
                <label className="block text-[14px] font-bold text-gray-900 mb-1">Email address <span className="text-red-500">*</span></label>
                <input type="email" value={email} onChange={e => setEmail(e.target.value)} className="w-full sm:w-2/3 border-2 border-gray-300 rounded px-3 py-2 outline-none focus:border-[#003b95] text-[14px]" />
                <p className="text-[12px] text-gray-500 mt-1">Confirmation email goes to this address</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-5">
                <div>
                  <label className="block text-[14px] font-bold text-gray-900 mb-1">Country/Region <span className="text-red-500">*</span></label>
                  <select value={country} onChange={e => setCountry(e.target.value)} className="w-full border-2 border-gray-300 rounded px-3 py-2 outline-none focus:border-[#003b95] bg-white text-[14px]">
                    <option value="Bangladesh">Bangladesh</option>
                    <option value="United States">United States</option>
                    <option value="United Kingdom">United Kingdom</option>
                    <option value="India">India</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[14px] font-bold text-gray-900 mb-1">Telephone <span className="text-gray-500 font-normal">(optional)</span></label>
                  <input type="tel" value={phone} onChange={e => setPhone(e.target.value)} className="w-full border-2 border-gray-300 rounded px-3 py-2 outline-none focus:border-[#003b95] text-[14px]" />
                  <p className="text-[12px] text-gray-500 mt-1">Needed by the property to validate booking</p>
                </div>
              </div>

              <div className="mb-5">
                <label className="flex items-start gap-2 cursor-pointer group">
                  <input type="checkbox" className="w-5 h-5 accent-[#003b95] border-2 border-gray-400 mt-0.5 rounded cursor-pointer" />
                  <div>
                    <span className="text-[14px] text-gray-900 group-hover:text-black">Yes, I want free paperless confirmation (recommended)</span>
                    <p className="text-[12px] text-gray-500">We'll text you a link to download our app</p>
                  </div>
                </label>
              </div>

              <div className="mb-5 border-t border-gray-200 pt-5">
                <h3 className="text-[14px] font-bold text-gray-900 mb-2">Who are you booking for?</h3>
                <div className="space-y-2">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="radio" name="bookingFor" checked={bookingFor === "main"} onChange={() => setBookingFor("main")} className="w-5 h-5 accent-[#003b95]" />
                    <span className="text-[14px] text-gray-900">I am the main guest</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="radio" name="bookingFor" checked={bookingFor === "someone"} onChange={() => setBookingFor("someone")} className="w-5 h-5 accent-[#003b95]" />
                    <span className="text-[14px] text-gray-900">Booking is for someone else</span>
                  </label>
                </div>
              </div>

              <div>
                <h3 className="text-[14px] font-bold text-gray-900 mb-2">Are you traveling for work?</h3>
                <div className="flex gap-6">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="radio" checked={travelingForWork} onChange={() => setTravelingForWork(true)} className="w-5 h-5 accent-[#003b95]" />
                    <span className="text-[14px] text-gray-900">Yes</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="radio" checked={!travelingForWork} onChange={() => setTravelingForWork(false)} className="w-5 h-5 accent-[#003b95]" />
                    <span className="text-[14px] text-gray-900">No</span>
                  </label>
                </div>
              </div>
            </div>
          </div>

          {/* Good to know */}
          <div className="bg-white rounded border border-gray-200 shadow-sm p-4">
            <h2 className="text-[16px] font-bold text-gray-900 mb-3 block">Good to know:</h2>
            <div className="flex items-start gap-3">
              <CheckCircle className="w-5 h-5 text-green-700 shrink-0 mt-0.5" />
              <p className="text-[14px] text-gray-800">
                <span className="font-bold">Stay flexible:</span> You can cancel for free before {new Date(new Date(checkIn).getTime() - 86400000).toLocaleDateString()}, so lock in this great price today.
              </p>
            </div>
          </div>

          {/* Selected Room Details */}
          <div className="bg-white rounded border border-gray-200 shadow-sm p-5">
            <h2 className="text-[20px] font-bold text-gray-900 mb-4">{selectedRoom?.type}</h2>
            <div className="flex flex-col gap-2 border-l-2 border-green-600 pl-3 mb-4">
              {hotel.amenities.includes("Restaurant") && (
                <div className="flex items-center gap-2 text-[14px] text-green-700 font-bold">
                  <Coffee className="w-4 h-4" /> Breakfast included in the price
                </div>
              )}
              <div className="flex items-center gap-2 text-[14px] text-green-700 font-bold">
                <Check className="w-4 h-4" /> Free cancellation before {new Date(new Date(checkIn).getTime() - 86400000).toLocaleDateString()}
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-[14px] text-gray-800">
              <div className="flex items-center gap-2 whitespace-nowrap"><Users className="w-4 h-4 text-gray-500" /> Guests: {selectedRoom?.capacity || "2 adults"}</div>
              <div className="flex items-center gap-2 whitespace-nowrap"><Info className="w-4 h-4 text-gray-500" /> Size: {selectedRoom?.sizeSqFt || 200} m²</div>
              {selectedRoom?.amenities.slice(0, 6).map((am, i) => (
                <div key={i} className="flex items-center gap-2 truncate whitespace-nowrap"><Check className="w-4 h-4 text-gray-500" /> {am}</div>
              ))}
            </div>
          </div>

          {/* Add to your stay (dummy) */}
          <div className="bg-white rounded border border-gray-200 shadow-sm p-5">
            <h2 className="text-[20px] font-bold text-gray-900 mb-4">Add to your stay</h2>
            <div className="space-y-4">
              <label className="flex items-start gap-3 cursor-pointer group p-3 border border-gray-200 rounded hover:bg-gray-50 transition">
                <input type="checkbox" className="w-5 h-5 accent-[#003b95] border-2 border-gray-400 mt-1" />
                <div className="flex-1">
                  <h3 className="text-[15px] font-bold text-gray-900 mb-1">I'm interested in requesting an airport shuttle</h3>
                  <p className="text-[13px] text-gray-600">We'll tell your accommodation what you're interested in so they can provide details and costs.</p>
                </div>
                <Plane className="w-8 h-8 text-gray-400" />
              </label>
              <label className="flex items-start gap-3 cursor-pointer group p-3 border border-gray-200 rounded hover:bg-gray-50 transition">
                <input type="checkbox" className="w-5 h-5 accent-[#003b95] border-2 border-gray-400 mt-1" />
                <div className="flex-1">
                  <h3 className="text-[15px] font-bold text-gray-900 mb-1">I'm interested in renting a car</h3>
                  <p className="text-[13px] text-gray-600">Save 10% on car rental options by adding to your booking.</p>
                </div>
                <Car className="w-8 h-8 text-gray-400" />
              </label>
            </div>
          </div>

          {/* Special Requests */}
          <div className="bg-white rounded border border-gray-200 shadow-sm p-5">
            <h2 className="text-[20px] font-bold text-gray-900 mb-2">Special requests</h2>
            <p className="text-[14px] text-gray-600 mb-4">Special requests cannot be guaranteed – but the property will do its best to meet your needs. You can always make a special request after your booking is complete!</p>
            <label className="block text-[14px] font-bold text-gray-900 mb-2">Please write your requests in English or local language. <span className="font-normal text-gray-500">(optional)</span></label>
            <textarea
              value={specialRequests}
              onChange={(e) => setSpecialRequests(e.target.value)}
              className="w-full border-2 border-gray-300 rounded px-4 py-3 outline-none focus:border-[#003b95] h-28 text-[14px] resize-none"
            />
          </div>

          {/* Arrival Time */}
          <div className="bg-white rounded border border-gray-200 shadow-sm p-5">
            <h2 className="text-[20px] font-bold text-gray-900 mb-2">Your arrival time</h2>
            <div className="flex items-center gap-2 text-green-700 font-medium text-[14px] mb-4">
              <CheckCircle className="w-5 h-5" /> Your room will be ready for check-in between 2:00 PM and 11:30 PM
            </div>
            <label className="block text-[14px] font-bold text-gray-900 mb-2">Add your estimated arrival time <span className="font-normal text-gray-500">(optional)</span></label>
            <select
              value={arrivalTime}
              onChange={e => setArrivalTime(e.target.value)}
              className="w-full sm:w-1/2 border-2 border-gray-300 rounded px-3 py-2 outline-none focus:border-[#003b95] bg-white text-[14px]"
            >
              <option value="I don't know">Please select</option>
              <option value="12:00 PM - 1:00 PM">12:00 PM - 1:00 PM</option>
              <option value="1:00 PM - 2:00 PM">1:00 PM - 2:00 PM</option>
              <option value="2:00 PM - 3:00 PM">2:00 PM - 3:00 PM</option>
              <option value="3:00 PM - 4:00 PM">3:00 PM - 4:00 PM</option>
              <option value="4:00 PM - 5:00 PM">4:00 PM - 5:00 PM</option>
              <option value="Late night">Late night</option>
            </select>
          </div>

          {/* Payment Details */}
          <div className="bg-white rounded border border-[#003b95] shadow-[0_0_0_1px_rgba(0,59,149,1)] p-5 relative overflow-hidden">
            <div className="absolute top-0 right-0 bg-[#003b95] text-white text-[10px] font-bold px-2 py-1 uppercase rounded-bl">Secure</div>
            <h2 className="text-[20px] font-bold text-gray-900 mb-2">How will you pay?</h2>
            <p className="text-[14px] text-gray-600 mb-5">Select a payment method accepted by this property.</p>

            <div className="flex flex-wrap gap-3 mb-6">
              {acceptedPayments.map(m => {
                const isSelected = paymentMethod === m;
                const isCash = m.toLowerCase().includes("cash");
                return (
                  <button
                    key={m}
                    onClick={() => setPaymentMethod(m)}
                    className={`flex items-center gap-2 px-4 py-3 border-2 rounded font-bold transition-all ${isSelected ? "border-[#003b95] bg-blue-50 text-[#003b95]" : "border-gray-200 text-gray-700 hover:border-gray-300 bg-white"
                      }`}
                  >
                    {isCash ? <BanknoteIcon className="w-5 h-5" /> : <CardIcon className="w-5 h-5" />}
                    {m}
                  </button>
                )
              })}
            </div>

            {/* Render conditional payment forms */}
            {paymentMethod.toLowerCase().includes("cash") ? (
              <div className="bg-green-50 border-l-4 border-green-600 p-4 rounded text-[14px]">
                <h4 className="font-bold text-green-800 mb-1 flex items-center gap-2"><CheckCircle className="w-4 h-4" /> Pay at the property</h4>
                <p className="text-green-700">No prepayment needed today. You will pay when you stay at the hotel.</p>
              </div>
            ) : paymentMethod.toLowerCase().includes("bkash") ? (
              <div className="bg-[#e2136e]/10 border border-[#e2136e]/30 rounded p-4 text-[14px]">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="font-bold text-[#e2136e]">bKash Payment Details</h4>
                  <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/d/d1/Bkash_logo_%282%29.svg/1024px-Bkash_logo_%282%29.svg.png" className="h-6" alt="bKash" />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[12px] font-bold text-gray-700 mb-1 uppercase tracking-wider">bKash Account Number *</label>
                    <input type="text" placeholder="e.g. 017XXXXXXXX" className="w-full border-2 border-gray-300 rounded px-3 py-2 outline-none focus:border-[#e2136e]" />
                  </div>
                  <div>
                    <label className="block text-[12px] font-bold text-gray-700 mb-1 uppercase tracking-wider">Transaction ID *</label>
                    <input type="text" placeholder="TrxID" className="w-full border-2 border-gray-300 rounded px-3 py-2 outline-none focus:border-[#e2136e]" />
                  </div>
                </div>
              </div>
            ) : paymentMethod.toLowerCase().includes("nagad") ? (
              <div className="bg-[#f7941d]/10 border border-[#f7941d]/30 rounded p-4 text-[14px]">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="font-bold text-[#d17409]">Nagad Payment Details</h4>
                  <img src="https://download.logo.wine/logo/Nagad/Nagad-Logo.wine.png" className="h-8 object-contain" alt="Nagad" />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[12px] font-bold text-gray-700 mb-1 uppercase tracking-wider">Nagad Account Number *</label>
                    <input type="text" placeholder="e.g. 016XXXXXXXX" className="w-full border-2 border-gray-300 rounded px-3 py-2 outline-none focus:border-[#f7941d]" />
                  </div>
                  <div>
                    <label className="block text-[12px] font-bold text-gray-700 mb-1 uppercase tracking-wider">Transaction ID *</label>
                    <input type="text" placeholder="TrxID" className="w-full border-2 border-gray-300 rounded px-3 py-2 outline-none focus:border-[#f7941d]" />
                  </div>
                </div>
              </div>
            ) : (
              // Default to Card
              <div className="bg-white border rounded p-4 text-[14px]">
                <div className="flex items-center gap-2 mb-4">
                  <div className="h-6 w-10 bg-blue-600 rounded flex items-center justify-center text-white text-[10px] font-bold italic">VISA</div>
                  <div className="h-6 w-10 bg-red-500 rounded flex items-center justify-center text-white text-[10px] font-bold italic">MC</div>
                </div>
                <div className="space-y-4">
                  <div>
                    <label className="block text-[13px] font-bold text-gray-700 mb-1">Cardholder's name *</label>
                    <input type="text" className="w-full border-2 border-gray-300 rounded px-3 py-2 outline-none focus:border-[#003b95]" />
                  </div>
                  <div>
                    <label className="block text-[13px] font-bold text-gray-700 mb-1">Card number *</label>
                    <input type="text" placeholder="0000 0000 0000 0000" className="w-full border-2 border-gray-300 rounded px-3 py-2 outline-none focus:border-[#003b95]" />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[13px] font-bold text-gray-700 mb-1">Expiration date *</label>
                      <input type="text" placeholder="MM/YY" className="w-full border-2 border-gray-300 rounded px-3 py-2 outline-none focus:border-[#003b95]" />
                    </div>
                    <div>
                      <label className="block text-[13px] font-bold text-gray-700 mb-1">CVC *</label>
                      <input type="text" placeholder="123" className="w-full border-2 border-gray-300 rounded px-3 py-2 outline-none focus:border-[#003b95]" />
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* House Rules & Submit */}
          <div>
            <h2 className="text-[16px] font-bold text-gray-900 mb-2">Review house rules</h2>
            <div className="bg-white rounded border border-gray-200 shadow-sm p-4 text-[14px] text-gray-800 mb-6">
              <p className="mb-2">Your host would like you to agree to the following house rules:</p>
              <ul className="list-disc pl-5 mb-4 text-gray-600">
                <li>No smoking allowed</li>
                <li>{selectedRoom?.petsAllowed ? "Pets are allowed" : "Pets are not allowed"}</li>
                <li>Quiet hours are between 10:00 PM and 7:00 AM</li>
              </ul>
              <p className="text-[13px] text-gray-500">By continuing to the next step, you agree to these house rules.</p>
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mt-6">
              <p className="text-[12px] text-gray-500 max-w-sm">We use secure transmission and encrypted storage to protect your personal information.</p>
              <button
                onClick={handlePay}
                disabled={processing}
                className="bg-[#003b95] hover:bg-[#002f7a] text-white px-8 py-4 rounded font-bold text-lg transition-colors flex items-center justify-center min-w-[240px]"
              >
                {processing ? <><Loader2 className="w-5 h-5 animate-spin mr-2" /> Processing...</> : "Next: Final details >"}
              </button>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
