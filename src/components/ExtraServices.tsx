/**
 * ExtraServices.tsx
 * ──────────────────────────────────────────────────────────────────────────────
 * Customer-facing "Extra Services & Add-ons" module for Reservation bd.
 *
 * Features:
 *   • Fetches all available hotel services from api.getHotelServices(hotelId)
 *   • Categorised tab navigation (All, Food, Spa, Transport, Gym, Other)
 *   • Animated service cards with FREE / price badge
 *   • "Request Service" modal — date-time picker + special notes (flight number etc.)
 *   • Booking selector so user can link the request to an active stay
 *   • My Requests history drawer for the selected booking
 *   • Status chips with color coding (Pending / Confirmed / Completed / Cancelled)
 * ──────────────────────────────────────────────────────────────────────────────
 */

import { useEffect, useState, useCallback } from "react";
import {
  api,
  HotelService,
  ServiceRequest,
  ServiceCategory,
  Booking,
} from "../services/api";
import {
  X,
  ChevronRight,
  Loader2,
  CheckCircle2,
  Clock,
  XCircle,
  BadgeCheck,
  Receipt,
  CalendarClock,
  StickyNote,
  Info,
  LayoutGrid,
  Headphones,
  Star
} from "lucide-react";

// ─── types ──────────────────────────────────────────────────────────────────

interface Props {
  /** The hotel whose services we are displaying */
  hotelId: string;
  hotelName: string;
  /** The current user's ID */
  userId: string;
  /** The user's confirmed bookings — pre-filtered to this hotel */
  bookings: Booking[];
}

// ─── constants ───────────────────────────────────────────────────────────────

const CATEGORIES: { key: "All" | ServiceCategory; label: string; icon: React.ReactNode }[] = [
  { key: "All", label: "All Services", icon: <LayoutGrid className="w-4 h-4" /> },
  { key: "Food", label: "Room Service", icon: <Headphones className="w-4 h-4" /> },
  { key: "Spa", label: "Spa & Wellness", icon: <Star className="w-4 h-4" /> },
  { key: "Gym", label: "Gym & Fitness", icon: <CheckCircle2 className="w-4 h-4" /> },
  { key: "Transport", label: "Transport", icon: <CalendarClock className="w-4 h-4" /> },
  { key: "Other", label: "Other", icon: <StickyNote className="w-4 h-4" /> },
];

const STATUS_META: Record<string, { label: string; color: string; icon: React.ReactNode }> = {
  Pending: { label: "Pending", color: "bg-amber-100 text-amber-700 border border-amber-200", icon: <Clock className="w-3 h-3" /> },
  Confirmed: { label: "Confirmed", color: "bg-blue-100 text-blue-700 border border-blue-200", icon: <BadgeCheck className="w-3 h-3" /> },
  Completed: { label: "Completed", color: "bg-green-100 text-green-700 border border-green-200", icon: <CheckCircle2 className="w-3 h-3" /> },
  Cancelled: { label: "Cancelled", color: "bg-red-100 text-red-600 border border-red-200", icon: <XCircle className="w-3 h-3" /> },
};

// ─── helpers ─────────────────────────────────────────────────────────────────

const fmtPrice = (price: number, currency: string) =>
  price === 0 ? "FREE" : `৳${price.toLocaleString()}`;

const fmtDateTime = (iso: string) =>
  new Date(iso).toLocaleString("en-BD", {
    dateStyle: "medium",
    timeStyle: "short",
  });

// Min datetime string for the picker (now + 30 min)
const minDateTime = () => {
  const d = new Date(Date.now() + 30 * 60 * 1000);
  return d.toISOString().slice(0, 16);
};

// ─── sub-components ──────────────────────────────────────────────────────────

function Badge({ service }: { service: HotelService }) {
  const isFree = service.price === 0;
  return (
    <span
      className={`absolute top-3 right-3 text-[11px] font-bold px-2 py-0.5 rounded-full shadow-sm ${isFree
        ? "bg-emerald-500 text-white"
        : "bg-indigo-600 text-white"
        }`}
    >
      {fmtPrice(service.price, service.currency)}
    </span>
  );
}

function ServiceCard({
  service,
  onRequest,
}: {
  service: HotelService;
  onRequest: (s: HotelService) => void;
}) {
  return (
    <div
      className="relative bg-white rounded-xl border border-slate-100 shadow-sm hover:shadow-md transition-all p-4 flex flex-col gap-2 group"
    >
      <Badge service={service} />

      {/* Icon circle */}
      <div className="w-9 h-9 rounded-lg bg-indigo-50 flex items-center justify-center text-lg border border-indigo-100">
        {service.icon}
      </div>

      <div>
        <p className="font-bold text-slate-800 text-[13px] leading-tight pr-12">{service.name}</p>
        <p className="text-[11px] text-slate-500 mt-1 line-clamp-1">{service.description}</p>
      </div>

      <div className="flex items-center gap-2 mt-2 pt-2 border-t border-slate-50">
        <span className="text-[9px] uppercase tracking-wider font-bold text-indigo-400 bg-indigo-50 px-2 py-0.5 rounded">
          {service.category}
        </span>
        <button
          onClick={() => onRequest(service)}
          className="ml-auto flex items-center gap-1 bg-indigo-600 hover:bg-indigo-700 text-white text-[10px] font-bold px-3 py-1.5 rounded-lg transition-all"
        >
          Request <ChevronRight className="w-2.5 h-2.5" />
        </button>
      </div>
    </div>
  );
}

function RequestStatusChip({ status }: { status: string }) {
  const meta = STATUS_META[status] ?? STATUS_META.Pending;
  return (
    <span className={`inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-full ${meta.color}`}>
      {meta.icon} {meta.label}
    </span>
  );
}

// ─── main component ───────────────────────────────────────────────────────────

export default function ExtraServices({ hotelId, hotelName, userId, bookings }: Props) {
  // Data
  const [services, setServices] = useState<HotelService[]>([]);
  const [myRequests, setMyRequests] = useState<ServiceRequest[]>([]);

  // UI state
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"All" | ServiceCategory>("All");
  const [selectedService, setSelectedService] = useState<HotelService | null>(null);
  const [showRequests, setShowRequests] = useState(false);

  // Form state
  const [selectedBookingId, setSelectedBookingId] = useState(bookings[0]?.id ?? "");
  const [requestedDateTime, setRequestedDateTime] = useState(minDateTime());
  const [specialNotes, setSpecialNotes] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [submitSuccess, setSubmitSuccess] = useState(false);

  // Load services
  useEffect(() => {
    setLoading(true);
    api.getHotelServices(hotelId).then(({ services }) => {
      setServices(services);
      setLoading(false);
    });
  }, [hotelId]);

  // Load requests for selected booking
  const refreshRequests = useCallback(async (bookingId: string) => {
    if (!bookingId) return;
    const reqs = await api.getMyServiceRequests(bookingId, userId);
    setMyRequests(reqs);
  }, [userId]);

  useEffect(() => {
    if (selectedBookingId) refreshRequests(selectedBookingId);
  }, [selectedBookingId, refreshRequests]);

  // Derived: filtered services by tab
  const filtered =
    activeTab === "All" ? services : services.filter((s) => s.category === activeTab);

  // Active categories that actually have services (for tab visibility)
  const usedCategories = CATEGORIES.filter(
    (c) => c.key === "All" || services.some((s) => s.category === c.key)
  );

  // ── modal handlers ──────────────────────────────────────────────────────

  const openModal = (s: HotelService) => {
    setSelectedService(s);
    setSubmitError("");
    setSubmitSuccess(false);
    setSpecialNotes("");
    setRequestedDateTime(minDateTime());
  };

  const closeModal = () => {
    setSelectedService(null);
    setSubmitError("");
    setSubmitSuccess(false);
  };

  const handleSubmit = async () => {
    if (!selectedService || !selectedBookingId) return;
    setSubmitting(true);
    setSubmitError("");
    try {
      await api.submitServiceRequest({
        userId,
        bookingId: selectedBookingId,
        hotelId,
        serviceId: selectedService.id,
        requestedDateTime,
        specialNotes,
      });
      setSubmitSuccess(true);
      await refreshRequests(selectedBookingId);
      setTimeout(() => {
        closeModal();
        setShowRequests(true);
      }, 1800);
    } catch (err: any) {
      setSubmitError(err.message ?? "Failed to submit request. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  // ─── RENDER ─────────────────────────────────────────────────────────────

  if (loading) {
    return (
      <div className="flex items-center justify-center py-16">
        <Loader2 className="w-8 h-8 animate-spin text-indigo-400" />
      </div>
    );
  }

  if (services.length === 0) {
    return (
      <div className="text-center py-12 text-gray-400">
        <span className="text-4xl mb-3 block">🏨</span>
        <p className="font-medium">No extra services available at this hotel yet.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* ── Header ── */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
            <LayoutGrid className="w-5 h-5 text-indigo-600" /> Extra Services & Add-ons
          </h2>
          <p className="text-sm text-gray-500 mt-0.5">
            Exclusive services available during your stay at <strong>{hotelName}</strong>
          </p>
        </div>
        {myRequests.length > 0 && (
          <button
            onClick={() => setShowRequests(!showRequests)}
            className="flex items-center gap-2 text-sm bg-indigo-50 text-indigo-600 hover:bg-indigo-100 border border-indigo-200 px-4 py-2 rounded-xl font-semibold transition"
          >
            <Receipt className="w-4 h-4" />
            My Requests ({myRequests.length})
          </button>
        )}
      </div>

      {/* ── Booking selector (when user has multiple confirmed bookings) ── */}
      {bookings.length > 1 && (
        <div className="bg-blue-50 border border-blue-200 rounded-xl px-4 py-3 flex flex-wrap items-center gap-3">
          <Info className="w-4 h-4 text-blue-500 shrink-0" />
          <span className="text-sm text-blue-700 font-medium">Select your booking to attach requests to:</span>
          <select
            value={selectedBookingId}
            onChange={(e) => setSelectedBookingId(e.target.value)}
            className="text-sm border border-blue-300 rounded-lg px-3 py-1.5 bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-300"
          >
            {bookings.map((b) => (
              <option key={b.id} value={b.id}>
                {b.hotelName} · {b.roomType} · {b.checkIn} → {b.checkOut}
              </option>
            ))}
          </select>
        </div>
      )}

      {/* ── No active booking warning ── */}
      {bookings.length === 0 && (
        <div className="bg-amber-50 border border-amber-200 rounded-xl px-4 py-3 flex items-start gap-3">
          <Info className="w-4 h-4 text-amber-600 mt-0.5 shrink-0" />
          <p className="text-sm text-amber-700">
            <strong>Heads up:</strong> Extra service requests require a confirmed booking at this hotel.
            You can browse the catalog, but submitting a request requires a valid reservation.
          </p>
        </div>
      )}

      {/* ── Category Tabs ── */}
      <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
        {usedCategories.map((cat) => (
          <button
            key={cat.key}
            onClick={() => setActiveTab(cat.key)}
            className={`flex items-center gap-2 whitespace-nowrap px-4 py-2 rounded-xl text-[11px] font-bold transition-all border uppercase tracking-wider ${activeTab === cat.key
              ? "bg-indigo-600 text-white border-indigo-600 shadow-sm"
              : "bg-white border-slate-100 text-slate-500 hover:border-indigo-200 hover:text-indigo-600 font-bold"
              }`}
          >
            {cat.icon} {cat.label}
            {cat.key !== "All" && (
              <span className={`text-[9px] px-1.5 py-0.5 rounded-md font-black ${activeTab === cat.key ? "bg-white/20 text-white" : "bg-slate-100 text-slate-400"}`}>
                {services.filter((s) => s.category === cat.key).length}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* ── Service Cards Grid ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((svc) => (
          <ServiceCard key={svc.id} service={svc} onRequest={openModal} />
        ))}
      </div>

      {/* ── My Requests Accordion ── */}
      {showRequests && myRequests.length > 0 && (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
            <h3 className="font-bold text-gray-800 flex items-center gap-2">
              <Receipt className="w-4 h-4 text-indigo-500" /> My Service Requests
            </h3>
            <button onClick={() => setShowRequests(false)} className="text-gray-400 hover:text-gray-600">
              <X className="w-4 h-4" />
            </button>
          </div>
          <div className="divide-y divide-gray-50">
            {myRequests.map((req) => (
              <div key={req.id} className="flex flex-wrap items-start justify-between gap-3 px-5 py-4">
                <div className="flex items-start gap-3">
                  <span className="text-2xl">{req.serviceIcon}</span>
                  <div>
                    <p className="font-semibold text-gray-800 text-sm">{req.serviceName}</p>
                    <div className="flex items-center gap-2 mt-1 flex-wrap">
                      <span className="text-xs text-gray-500 flex items-center gap-1">
                        <CalendarClock className="w-3 h-3" /> {fmtDateTime(req.requestedDateTime)}
                      </span>
                      {req.specialNotes && (
                        <span className="text-xs text-gray-400 flex items-center gap-1">
                          <StickyNote className="w-3 h-3" /> {req.specialNotes}
                        </span>
                      )}
                    </div>
                    {req.hotelNotes && (
                      <p className="text-xs text-blue-600 mt-1 italic">Hotel: {req.hotelNotes}</p>
                    )}
                  </div>
                </div>
                <div className="flex flex-col items-end gap-1.5">
                  <RequestStatusChip status={req.status} />
                  <span className="text-sm font-bold text-gray-700">
                    {req.priceAtRequest === 0 ? (
                      <span className="text-emerald-600">FREE</span>
                    ) : (
                      `৳${req.priceAtRequest.toLocaleString()}`
                    )}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── REQUEST MODAL ── */}
      {selectedService && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={closeModal}
          />

          {/* Modal card */}
          <div className="relative bg-white rounded-3xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-y-auto z-10">
            {/* Gradient top bar */}
            <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-t-3xl p-5 text-white relative">
              <button
                onClick={closeModal}
                className="absolute top-4 right-4 w-8 h-8 bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center transition"
              >
                <X className="w-4 h-4" />
              </button>
              <div className="text-3xl mb-2">{selectedService.icon}</div>
              <h3 className="text-lg font-bold leading-snug">{selectedService.name}</h3>
              <p className="text-white/80 text-xs mt-1">{selectedService.description}</p>
              <div className="mt-3 flex items-center gap-2">
                <span className="bg-white/20 text-white text-xs font-semibold px-2 py-0.5 rounded-full">
                  {selectedService.category}
                </span>
                <span className={`text-sm font-bold px-3 py-0.5 rounded-full ${selectedService.price === 0
                  ? "bg-emerald-400 text-white"
                  : "bg-white text-indigo-700"
                  }`}>
                  {fmtPrice(selectedService.price, selectedService.currency)}
                </span>
              </div>
            </div>

            <div className="p-5 space-y-5">
              {/* Success state */}
              {submitSuccess ? (
                <div className="text-center py-8">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <CheckCircle2 className="w-8 h-8 text-green-500" />
                  </div>
                  <h4 className="text-lg font-bold text-gray-800">Request Submitted!</h4>
                  <p className="text-sm text-gray-500 mt-1">
                    The hotel will confirm your request shortly.
                  </p>
                </div>
              ) : (
                <>
                  {/* Booking selector (if multiple bookings) */}
                  {bookings.length === 0 ? (
                    <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 text-xs text-amber-700">
                      ⚠️ You need a confirmed booking at this hotel to request this service.
                    </div>
                  ) : (
                    bookings.length > 1 && (
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                          Attach to Booking
                        </label>
                        <select
                          value={selectedBookingId}
                          onChange={(e) => setSelectedBookingId(e.target.value)}
                          className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300"
                        >
                          {bookings.map((b) => (
                            <option key={b.id} value={b.id}>
                              Room {b.roomType} · {b.checkIn} → {b.checkOut}
                            </option>
                          ))}
                        </select>
                      </div>
                    )
                  )}

                  {/* Date & Time */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1.5 flex items-center gap-1.5">
                      <CalendarClock className="w-4 h-4 text-indigo-500" />
                      Preferred Date & Time
                    </label>
                    <input
                      type="datetime-local"
                      min={minDateTime()}
                      value={requestedDateTime}
                      onChange={(e) => setRequestedDateTime(e.target.value)}
                      className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300"
                    />
                  </div>

                  {/* Special Notes */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1.5 flex items-center gap-1.5">
                      <StickyNote className="w-4 h-4 text-indigo-500" />
                      Special Instructions
                      <span className="text-gray-400 font-normal">(optional)</span>
                    </label>
                    <textarea
                      rows={3}
                      value={specialNotes}
                      onChange={(e) => setSpecialNotes(e.target.value)}
                      placeholder={
                        selectedService.category === "Transport"
                          ? "e.g. Flight number: BG 123, Arrival at 3:00 PM, Terminal 1"
                          : selectedService.category === "Food"
                            ? "e.g. Vegetarian meal, no nuts please"
                            : selectedService.category === "Spa"
                              ? "e.g. No deep tissue, prefer aromatherapy"
                              : "e.g. Any special requirements..."
                      }
                      className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300 resize-none"
                    />
                  </div>

                  {/* Pricing summary */}
                  {selectedService.price > 0 && (
                    <div className="bg-indigo-50 border border-indigo-100 rounded-xl p-4">
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-indigo-700 font-medium">Service charge</span>
                        <span className="text-lg font-bold text-indigo-700">
                          ৳{selectedService.price.toLocaleString()}
                        </span>
                      </div>
                      <p className="text-[11px] text-indigo-500 mt-1">
                        This amount will be added to your final invoice.
                      </p>
                    </div>
                  )}

                  {/* Error */}
                  {submitError && (
                    <div className="bg-red-50 border border-red-200 text-red-600 text-sm rounded-xl px-4 py-3">
                      {submitError}
                    </div>
                  )}

                  {/* Submit */}
                  <button
                    onClick={handleSubmit}
                    disabled={submitting || bookings.length === 0}
                    className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 rounded-xl text-sm transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-md shadow-indigo-100"
                  >
                    {submitting ? (
                      <><Loader2 className="w-4 h-4 animate-spin" /> Submitting...</>
                    ) : (
                      <>Confirm Request</>
                    )}
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
