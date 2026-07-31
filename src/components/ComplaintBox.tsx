import React, { useState } from "react";
import { Booking, api } from "../services/api";
import { Send, Image, Loader2, AlertCircle } from "lucide-react";

interface ComplaintBoxProps {
  userId: string;
  userName: string;
  bookings: Booking[];
}

export default function ComplaintBox({ userId, userName, bookings }: ComplaintBoxProps) {
  const [selectedBookingId, setSelectedBookingId] = useState("");
  const [description, setDescription] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Extract unique hotels from past bookings to allow reporting a hotel
  const uniqueHotels = Array.from(new Set(bookings.map(b => b.hotelId))).map(id => {
    return bookings.find(b => b.hotelId === id)!;
  });

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedBookingId || !description.trim()) {
      setError("Please select a hotel/booking and provide a description.");
      return;
    }

    try {
      setSubmitting(true);
      setError(null);

      const booking = bookings.find(b => b.id === selectedBookingId);
      if (!booking) throw new Error("Booking not found");

      // In a real app, you would upload the imageFile using FormData to your Express backend
      // and get the secure URL from Cloudinary or similar service.
      // Here, we simulate that step via our mock API:
      
      let finalImageUrl = undefined;
      if (previewUrl) {
         // Using the base64 URL as mock image URL
         finalImageUrl = previewUrl;
      }

      await api.submitComplaint({
        userId,
        userName,
        hotelId: booking.hotelId,
        hotelName: booking.hotelName,
        bookingId: booking.id,
        description,
        imageUrl: finalImageUrl,
      });

      setSubmitted(true);
      setDescription("");
      setImageFile(null);
      setPreviewUrl(null);
      setSelectedBookingId("");
      setTimeout(() => setSubmitted(false), 4000);
    } catch (err: any) {
      setError(err.message || "Failed to submit complaint.");
    } finally {
      setSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <div className="bg-green-50 border border-green-200 text-green-700 rounded-xl p-6 text-center shadow-sm">
        <h3 className="font-bold text-lg mb-2">Complaint Submitted Successfully</h3>
        <p className="text-sm">Our admin team has received your report and will investigate the issue. You can track the status in your dashboard.</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-sm border p-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="bg-red-100 p-3 rounded-full">
          <AlertCircle className="w-6 h-6 text-red-600" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-gray-800">Report an Issue</h2>
          <p className="text-sm text-gray-500">File a complaint against a recent stay</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        {error && (
          <div className="p-3 bg-red-50 text-red-600 text-sm rounded-lg border border-red-200">
            {error}
          </div>
        )}

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">Select Hotel / Booking *</label>
          <select
            value={selectedBookingId}
            onChange={(e) => setSelectedBookingId(e.target.value)}
            className="w-full border rounded-xl p-3 text-sm focus:outline-none focus:ring-2 focus:ring-red-400 bg-gray-50"
            required
          >
            <option value="" disabled>-- Select a past booking --</option>
            {bookings.map((b) => (
              <option key={b.id} value={b.id}>
                {b.hotelName} ({b.roomType}) - Stayed on {b.checkIn}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">Description of the Issue *</label>
          <textarea
            rows={4}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full border rounded-xl p-4 text-sm focus:outline-none focus:ring-2 focus:ring-red-400 bg-gray-50 resize-none"
            placeholder="Please provide details about your complaint..."
            required
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">Attach Proof (Optional)</label>
          <div className="flex items-center gap-4">
            <label className="flex items-center justify-center gap-2 px-4 py-2 border-2 border-dashed border-gray-300 rounded-xl cursor-pointer hover:border-red-400 transition bg-gray-50 hover:bg-red-50 text-sm font-medium text-gray-600 w-full md:w-auto h-12">
              <Image className="w-5 h-5" />
              Upload Image
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleImageChange}
              />
            </label>
            {previewUrl && (
              <div className="relative w-12 h-12 rounded-lg overflow-hidden border">
                <img src={previewUrl} alt="Preview" className="w-full h-full object-cover" />
              </div>
            )}
            {imageFile && <span className="text-xs text-gray-500 truncate max-w-[150px]">{imageFile.name}</span>}
          </div>
        </div>

        <button
          type="submit"
          disabled={submitting}
          className="w-full flex items-center justify-center gap-2 bg-red-600 text-white px-6 py-3 rounded-xl font-bold hover:bg-red-700 transition shadow-md disabled:bg-red-300"
        >
          {submitting ? (
            <><Loader2 className="w-5 h-5 animate-spin" /> Submitting Report...</>
          ) : (
            <><Send className="w-5 h-5" /> Submit Complaint</>
          )}
        </button>
      </form>
    </div>
  );
}
