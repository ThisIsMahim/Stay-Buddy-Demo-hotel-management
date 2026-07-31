import { useUser, RedirectToSignIn } from "@clerk/react";
import { useEffect, useState } from "react";
import { api, Booking } from "../services/api";
import { Calendar, CreditCard, Loader2 } from "lucide-react";
import MobileBottomNav from "../components/MobileBottomNav";
import Header from "../components/Header";

export default function Trips() {
  const { isSignedIn, isLoaded, user } = useUser();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [mongoUser, setMongoUser] = useState<any>(null);

  useEffect(() => {
    if (user && user.id) {
       api.syncUser({ 
         clerkId: user.id, 
         email: user.primaryEmailAddress?.emailAddress || "", 
         name: user.fullName || "Guest", 
         avatar: user.imageUrl 
       }).then(mu => {
         setMongoUser(mu);
       });
    }
  }, [user]);

  useEffect(() => {
    if (!mongoUser) return;
    api.getUserBookings(mongoUser.id).then(res => {
      setBookings(res);
      setLoading(false);
    });
  }, [mongoUser]);

  if (!isLoaded) return <div className="flex justify-center min-h-screen items-center"><Loader2 className="w-8 h-8 animate-spin text-indigo-500" /></div>;
  if (!isSignedIn) return <RedirectToSignIn />;

  const upcoming = bookings.filter(b => b.status === "CONFIRMED" && new Date(b.checkIn) >= new Date());
  const past = bookings.filter(b => b.status === "CONFIRMED" && new Date(b.checkIn) < new Date());

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <Header />
      <div className="bg-white border-b px-6 py-8 shadow-sm">
        <h1 className="text-3xl font-bold text-gray-800 max-w-4xl mx-auto">Your Trips</h1>
        <p className="text-gray-500 max-w-4xl mx-auto mt-2">Manage your upcoming and past bookings</p>
      </div>
      
      <div className="max-w-4xl mx-auto px-6 py-8 space-y-10">
        <section>
          <h2 className="text-xl font-bold text-gray-800 mb-5">🗓️ Upcoming Stays</h2>
          {loading ? (
            <Loader2 className="w-6 h-6 animate-spin text-indigo-500" />
          ) : upcoming.length === 0 ? (
            <div className="bg-white p-8 rounded-2xl border border-gray-100 text-center">
              <p className="text-gray-500">No upcoming trips.</p>
            </div>
          ) : (
            <BookingList bookings={upcoming} />
          )}
        </section>
        
        <section>
          <h2 className="text-xl font-bold text-gray-800 mb-5">📋 Past Stays</h2>
          {loading ? (
            <Loader2 className="w-6 h-6 animate-spin text-indigo-500" />
          ) : past.length === 0 ? (
            <div className="bg-white p-8 rounded-2xl border border-gray-100 text-center">
              <p className="text-gray-500">No past trips.</p>
            </div>
          ) : (
            <BookingList bookings={past} />
          )}
        </section>
      </div>
      <MobileBottomNav />
    </div>
  );
}

function BookingList({ bookings }: { bookings: Booking[] }) {
  return (
    <div className="space-y-4">
      {bookings.map(b => (
        <div key={b.id} className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-5 bg-white rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition gap-4">
          <div className="flex items-center gap-4">
            <div className={`w-12 h-12 rounded-full flex items-center justify-center shrink-0 ${b.paymentMethod === "bkash" ? "bg-pink-100" : "bg-indigo-100"}`}>
              <CreditCard className={`w-6 h-6 ${b.paymentMethod === "bkash" ? "text-pink-600" : "text-indigo-600"}`} />
            </div>
            <div>
              <p className="font-semibold text-gray-800 text-lg">{b.hotelName}</p>
              <p className="text-sm text-gray-500">{b.roomType}</p>
              <p className="text-sm text-gray-400 flex items-center gap-1 mt-1 font-medium">
                <Calendar className="w-4 h-4" /> {b.checkIn} → {b.checkOut} ({b.nights} nights)
              </p>
            </div>
          </div>
          <div className="text-left sm:text-right w-full sm:w-auto p-3 sm:p-0 bg-gray-50 sm:bg-transparent rounded-lg">
            <p className="font-bold text-green-600 text-xl">৳{b.totalPrice}</p>
            <span className={`text-xs px-2.5 py-1 rounded-full font-bold inline-block mt-1 ${b.status === "CONFIRMED" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-600"}`}>
              {b.status}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
}
