import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { SearchProvider } from "./context/SearchContext";
import Index from "./pages/Index";
import Experiences from "./pages/Experiences";
import NotFound from "./pages/NotFound";
import PropertyDetails from "./pages/PropertyDetails";
import Booking from "./pages/Booking";
import ExperienceDetails from "./pages/ExperienceDetails";
import HelpCenter from "./pages/HelpCenter";
import SafetyHelp from "./pages/SafetyHelp";
import AirCover from "./pages/AirCover";
import BecomeAHost from "./pages/BecomeAHost";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import AdminDashboard from "./pages/AdminDashboard";
import AdminLogin from "./pages/AdminLogin";
import OwnerDashboard from "./pages/OwnerDashboard";
import OwnerLogin from "./pages/OwnerLogin";
import UserDashboard from "./pages/UserDashboard";
import HotelSearch from "./pages/HotelSearch";
import CheckoutPage from "./pages/CheckoutPage";
import Services from "./pages/Services";
import Trips from "./pages/Trips";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
        <SearchProvider>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/help" element={<HelpCenter />} />
            <Route path="/safety-help" element={<SafetyHelp />} />
            <Route path="/aircover" element={<AirCover />} />
            <Route path="/become-a-host" element={<BecomeAHost />} />
            <Route path="/experiences" element={<Experiences />} />
            <Route path="/experiences/:id" element={<ExperienceDetails />} />
            <Route path="/property/:id" element={<PropertyDetails />} />
            <Route path="/book/stays/:id" element={<Booking />} />
            <Route path="/login/*" element={<Login />} />
            <Route path="/signup/*" element={<Signup />} />
            <Route path="/admin/login" element={<AdminLogin />} />
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/owner/login" element={<OwnerLogin />} />
            <Route path="/owner" element={<OwnerDashboard />} />
            <Route path="/dashboard" element={<UserDashboard />} />
            <Route path="/hotels" element={<HotelSearch />} />
            <Route path="/services" element={<Services />} />
            <Route path="/wishlist" element={<Services />} /> {/* Using Services as a placeholder for now as it handles wishlist logic */}
            <Route path="/trips" element={<Trips />} />
            <Route path="/checkout/:hotelId" element={<CheckoutPage />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </SearchProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
