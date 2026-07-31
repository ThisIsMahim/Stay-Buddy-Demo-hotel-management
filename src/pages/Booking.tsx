import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ChevronLeft, Star, Gem } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import img1 from "@/assets/img1.avif";
import AuthModal from "@/components/AuthModal";
import DateChangeModal from "@/components/DateChangeModal";
import GuestChangeModal from "@/components/GuestChangeModal";

const Booking = () => {
    const navigate = useNavigate();
    const [currentStep, setCurrentStep] = useState(1);
    const [isDateModalOpen, setIsDateModalOpen] = useState(false);
    const [isGuestModalOpen, setIsGuestModalOpen] = useState(false);
    const [isConfirmed, setIsConfirmed] = useState(false);
    const [paymentGateway, setPaymentGateway] = useState<"bkash" | "nagad" | null>(null);
    const [isGatewayModalOpen, setIsGatewayModalOpen] = useState(false);

    // Mock data based on the PropertyDetails page
    const property = {
        title: "M6 - Deluxe Open Air Bedroom with Queen Bed & AC",
        rating: 4.88,
        reviews: 74,
        image: img1,
        price: 67.27,
        total: 134.54
    };

    if (isConfirmed) {
        return (
            <div className="min-h-screen bg-background flex flex-col items-center justify-center p-6 text-center">
                <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mb-6">
                    <svg viewBox="0 0 24 24" className="w-10 h-10 text-emerald-600 fill-current">
                        <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
                    </svg>
                </div>
                <h1 className="text-3xl font-bold mb-4">Reservation Confirmed!</h1>
                <p className="text-muted-foreground text-lg mb-8 max-w-md">
                    Your stay at <span className="font-semibold text-foreground">{property.title}</span> is booked. We've sent the confirmation details to your email.
                </p>
                <div className="flex gap-4">
                    <Button onClick={() => navigate("/")} size="lg">Go Home</Button>
                    <Button variant="outline" size="lg">View Itinerary</Button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-background text-foreground">
            {/* Simple Navbar */}
            <header className="border-b bg-background h-20 flex items-center">
                <div className="container mx-auto px-6 sm:px-10 lg:px-20">
                    <Link to="/" className="flex items-center gap-2">
                        <svg
                            viewBox="0 0 32 32"
                            className="h-8 w-8 text-[#FF385C] fill-current"
                            aria-label="Airbnb"
                        >
                            <path d="M16 1c2.008 0 3.463.963 4.751 3.269l.533 1.025c1.954 3.83 6.114 12.54 7.1 14.836l.145.353c.667 1.591.91 2.472.96 3.396l.01.415.001.228c0 4.062-2.877 6.478-6.357 6.478-2.224 0-4.556-1.258-6.709-3.386l-.257-.26-.172-.179h-.114l-.257.26c-2.153 2.127-4.485 3.385-6.709 3.385-3.48 0-6.357-2.416-6.357-6.478 0-1.142.308-2.389.92-3.991l.186-.449c.986-2.296 5.146-11.006 7.1-14.836l.533-1.025C12.537 1.963 13.992 1 16 1zm0 2c-1.239 0-2.053.539-2.987 2.21l-.523 1.008c-1.926 3.776-6.06 12.43-7.031 14.692l-.15.362c-.345.852-.49 1.54-.524 2.19l-.007.266c0 2.89 2.057 4.478 4.357 4.478 1.644 0 3.575-1.005 5.429-2.904l.313-.32.313.32c1.854 1.899 3.785 2.904 5.429 2.904 2.3 0 4.357-1.588 4.357-4.478 0-.798-.168-1.618-.536-2.485l-.165-.383c-.971-2.262-5.105-10.916-7.031-14.692l-.523-1.008C18.053 3.539 17.24 3 16 3z" />
                        </svg>
                    </Link>
                </div>
            </header>

            <main className="container mx-auto px-6 sm:px-10 lg:px-20 py-12 max-w-7xl">
                <div className="flex items-center gap-4 mb-8">
                    <Button
                        variant="ghost"
                        size="icon"
                        className="rounded-full hover:bg-neutral-100 -ml-4"
                        onClick={() => navigate(-1)}
                    >
                        <ChevronLeft className="h-5 w-5" />
                    </Button>
                    <h1 className="text-3xl font-semibold">Confirm and pay</h1>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-24 relative">
                    {/* Left Column */}
                    <div>
                        {/* Step 1 */}
                        <div className="mb-8 overflow-hidden">
                            <div className="flex items-center justify-between mb-4">
                                <h2 className={`text-xl font-semibold ${currentStep > 1 ? "opacity-100" : ""}`}>1. Choose when to pay</h2>
                                {currentStep > 1 && (
                                    <Button
                                        variant="outline"
                                        className="rounded-lg h-9 text-sm font-semibold px-4 border-neutral-300 hover:bg-neutral-50"
                                        onClick={() => setCurrentStep(1)}
                                    >
                                        Change
                                    </Button>
                                )}
                            </div>

                            {currentStep === 1 ? (
                                <>
                                    <div className="border rounded-xl p-4 mb-8">
                                        <RadioGroup defaultValue="full">
                                            <div className="flex items-start justify-between space-x-2 py-2">
                                                <div className="flex-1">
                                                    <Label htmlFor="full" className="font-medium text-base cursor-pointer">Pay ৳{property.price} now</Label>
                                                </div>
                                                <RadioGroupItem value="full" id="full" className="mt-1" />
                                            </div>

                                            <Separator className="my-3" />

                                            <div className="flex items-start justify-between space-x-2 py-2">
                                                <div className="flex-1">
                                                    <Label htmlFor="part" className="font-medium text-base cursor-pointer">Pay part now, part later</Label>
                                                    <p className="text-muted-foreground text-sm mt-1">
                                                        ৳15.59 now, ৳62.35 charged on Feb 28. No extra fees. <span className="underline font-medium text-foreground">More info</span>
                                                    </p>
                                                </div>
                                                <RadioGroupItem value="part" id="part" className="mt-1" />
                                            </div>
                                        </RadioGroup>
                                    </div>

                                    <Button
                                        size="lg"
                                        className="w-[160px] h-[52px] text-lg font-semibold bg-black hover:bg-neutral-800 text-white"
                                        onClick={() => setCurrentStep(2)}
                                    >
                                        Next
                                    </Button>
                                </>
                            ) : (
                                <p className="text-sm text-muted-foreground">Pay ৳{property.price} now</p>
                            )}
                        </div>

                        {/* Step 2 */}
                        <div className={`py-8 border-t ${currentStep === 2 ? "opacity-100" : ""}`}>
                            <h2 className={`text-xl font-semibold mb-6 ${currentStep < 2 ? "opacity-30" : ""}`}>2. Add a payment method</h2>

                            {currentStep === 2 && (
                                <div className="space-y-6">
                                    <div className="space-y-4">
                                        <div 
                                            className={`flex items-center justify-between p-6 border rounded-xl cursor-pointer transition-all hover:border-black ${paymentGateway === 'bkash' ? 'border-black bg-neutral-50 ring-1 ring-black' : 'border-neutral-200'}`}
                                            onClick={() => setPaymentGateway('bkash')}
                                        >
                                            <div className="flex items-center gap-4">
                                                <div className="w-12 h-12 flex items-center justify-center overflow-hidden rounded-lg bg-white border p-1">
                                                    <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/e/e7/Bkash_logo.png/512px-Bkash_logo.png" alt="bKash" className="w-full h-full object-contain" />
                                                </div>
                                                <div>
                                                    <span className="font-semibold text-lg block">bKash</span>
                                                    <span className="text-xs text-muted-foreground">Pay securely with your bKash account</span>
                                                </div>
                                            </div>
                                            <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${paymentGateway === 'bkash' ? 'border-black' : 'border-neutral-300'}`}>
                                                {paymentGateway === 'bkash' && <div className="w-3 h-3 rounded-full bg-black"></div>}
                                            </div>
                                        </div>

                                        <div 
                                            className={`flex items-center justify-between p-6 border rounded-xl cursor-pointer transition-all hover:border-black ${paymentGateway === 'nagad' ? 'border-black bg-neutral-50 ring-1 ring-black' : 'border-neutral-200'}`}
                                            onClick={() => setPaymentGateway('nagad')}
                                        >
                                            <div className="flex items-center gap-4">
                                                <div className="w-12 h-12 flex items-center justify-center overflow-hidden rounded-lg bg-white border p-1">
                                                    <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/e/e1/Nagad_logo.png/512px-Nagad_logo.png" alt="Nagad" className="w-full h-full object-contain" />
                                                </div>
                                                <div>
                                                    <span className="font-semibold text-lg block">Nagad</span>
                                                    <span className="text-xs text-muted-foreground">Fast and easy payment via Nagad</span>
                                                </div>
                                            </div>
                                            <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${paymentGateway === 'nagad' ? 'border-black' : 'border-neutral-300'}`}>
                                                {paymentGateway === 'nagad' && <div className="w-3 h-3 rounded-full bg-black"></div>}
                                            </div>
                                        </div>
                                    </div>

                                    <Button
                                        size="lg"
                                        disabled={!paymentGateway}
                                        className="w-full h-[56px] text-lg font-bold bg-[#FF385C] hover:bg-[#E31C5F] text-white mt-8 shadow-md disabled:opacity-50"
                                        onClick={() => setIsGatewayModalOpen(true)}
                                    >
                                        Continue with {paymentGateway === 'bkash' ? 'bKash' : paymentGateway === 'nagad' ? 'Nagad' : 'Payment'}
                                    </Button>
                                </div>
                            )}
                        </div>

                        {/* Step 3 */}
                        <div className="py-8 border-t">
                            <h2 className={`text-xl font-semibold mb-6 ${currentStep < 3 ? "opacity-30" : ""}`}>3. Review your reservation</h2>
                            {currentStep === 3 && (
                                <div className="space-y-6">
                                    <div className="border rounded-xl p-6 bg-neutral-50/50">
                                        <div className="flex gap-4 mb-6">
                                            <div className="w-20 h-20 rounded-lg overflow-hidden shrink-0">
                                                <img src={property.image} alt={property.title} className="w-full h-full object-cover" />
                                            </div>
                                            <div>
                                                <h3 className="font-semibold text-sm leading-tight">{property.title}</h3>
                                                <p className="text-xs text-muted-foreground mt-1">Free selection • High floor</p>
                                            </div>
                                        </div>
                                        
                                        <div className="grid grid-cols-2 gap-8 text-sm pt-4 border-t border-neutral-200">
                                            <div>
                                                <div className="font-bold uppercase text-[10px] text-muted-foreground mb-1">Check-in</div>
                                                <div>Friday, Mar 6, 2026</div>
                                            </div>
                                            <div>
                                                <div className="font-bold uppercase text-[10px] text-muted-foreground mb-1">Checkout</div>
                                                <div>Sunday, Mar 8, 2026</div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="space-y-4">
                                        <h3 className="font-semibold">Guest information</h3>
                                        <div className="p-4 border rounded-xl flex items-center justify-between">
                                            <div>
                                                <p className="font-medium text-sm">Toheeb Adedokun</p>
                                                <p className="text-xs text-muted-foreground">td@example.com</p>
                                            </div>
                                            <Button variant="link" size="sm" className="underline font-semibold">Edit</Button>
                                        </div>
                                    </div>

                                    <div className="pt-6 border-t font-semibold">
                                        <div className="flex justify-between text-base mb-2">
                                            <span className="font-normal text-muted-foreground">Payment Method</span>
                                            <div className="flex items-center gap-2">
                                                <img 
                                                    src={paymentGateway === 'bkash' 
                                                        ? "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e7/Bkash_logo.png/512px-Bkash_logo.png" 
                                                        : "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e1/Nagad_logo.png/512px-Nagad_logo.png"} 
                                                    alt={paymentGateway || ''} 
                                                    className="w-5 h-5 object-contain" 
                                                />
                                                <span className="capitalize">{paymentGateway} Wallet</span>
                                            </div>
                                        </div>
                                        <div className="flex justify-between text-lg mb-8">
                                            <span>Total (BDT)</span>
                                            <span>৳{property.total}</span>
                                        </div>
                                        
                                        <Button 
                                            size="lg" 
                                            className="w-full h-14 text-xl font-bold bg-[#FF385C] hover:bg-[#E31C5F] text-white shadow-lg"
                                            onClick={() => setIsConfirmed(true)}
                                        >
                                            Confirm and Pay
                                        </Button>
                                        <p className="text-center text-[11px] text-muted-foreground mt-4 leading-relaxed font-normal">
                                            By selecting the button below, I agree to the <span className="underline">House Rules</span>, <span className="underline">Ground rules for guests</span>, <span className="underline">Cancellation Policy</span>, and that Airbnb can charge my payment method.
                                        </p>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Right Column */}
                    <div className="hidden md:block">
                        <div className="sticky top-28">
                            <div className="border rounded-xl p-6 bg-background shadow-sm">
                                <div className="flex gap-4 mb-6">
                                    <div className="w-[120px] h-[106px] rounded-lg overflow-hidden shrink-0">
                                        <img src={property.image} alt={property.title} className="w-full h-full object-cover" />
                                    </div>
                                    <div className="flex flex-col py-0.5">
                                        <h3 className="text-sm font-medium leading-[1.2] mb-1">{property.title}</h3>
                                        <div className="flex items-center gap-1 text-[12px] mt-auto">
                                            <Star className="w-3 h-3 fill-current" />
                                            <span className="font-semibold">{property.rating} ({property.reviews})</span>
                                            <span className="mx-0.5">•</span>
                                            <div className="flex items-center gap-1">
                                                <svg viewBox="0 0 32 32" className="w-3 h-3 fill-current"><path d="M16 .7c-8.437 0-15.3 6.863-15.3 15.3S7.563 31.3 16 31.3s15.3-6.863 15.3-15.3S24.437.7 16 .7zm0 2c7.345 0 13.3 5.955 13.3 13.3S23.345 29.3 16 29.3 2.7 23.345 2.7 16 8.655 2.7 16 2.7zm-.5 6a1.5 1.5 0 1 0 0 3 1.5 1.5 0 0 0 0-3zm1 14h-1a1 1 0 0 1-1-1v-8a1 1 0 0 1 1-1h1a1 1 0 0 1 1 1v8a1 1 0 0 1-1 1z" /></svg>
                                                <span className="font-medium">Guest favorite</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <Separator className="my-6" />

                                <div className="space-y-6">
                                    <div>
                                        <h3 className="font-semibold text-base mb-1">Free cancellation</h3>
                                        <p className="text-sm text-neutral-600 leading-relaxed">
                                            Cancel before February 26 for a full refund. <Link to="#" className="underline font-semibold text-black">Full policy</Link>
                                        </p>
                                    </div>

                                    <div className="border-t pt-6">
                                        <div className="flex justify-between items-start">
                                            <div>
                                                <h3 className="font-semibold text-base">Dates</h3>
                                                <div className="text-[15px] mt-1">Feb 27 – Mar 1, 2026</div>
                                            </div>
                                            <Button
                                                variant="outline"
                                                className="font-semibold border-neutral-300 rounded-lg h-9 px-4 hover:bg-neutral-50"
                                                onClick={() => setIsDateModalOpen(true)}
                                            >
                                                Change
                                            </Button>
                                        </div>
                                    </div>

                                    <div className="border-t pt-6">
                                        <div className="flex justify-between items-start">
                                            <div>
                                                <h3 className="font-semibold text-base">Guests</h3>
                                                <div className="text-[15px] mt-1">1 adult</div>
                                            </div>
                                            <Button
                                                variant="outline"
                                                className="font-semibold border-neutral-300 rounded-lg h-9 px-4 hover:bg-neutral-50"
                                                onClick={() => setIsGuestModalOpen(true)}
                                            >
                                                Change
                                            </Button>
                                        </div>
                                    </div>
                                </div>

                                <div className="mt-8 pt-8 border-t">
                                    <h3 className="font-semibold text-xl mb-4">Price details</h3>
                                    <div className="space-y-3 text-[15px]">
                                        <div className="flex justify-between">
                                            <span className="underline">২ রাত x ৳{property.price}</span>
                                            <span>৳{property.total}</span>
                                        </div>
                                        <div className="flex justify-between font-bold text-lg pt-2">
                                            <span>Total (BDT)</span>
                                            <span>৳{property.total}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>

        <footer className="border-t py-6 mt-12 bg-background">
          <div className="container mx-auto px-6 sm:px-10 lg:px-20 text-sm text-muted-foreground flex gap-4">
            <span>© 2026 Airbnb, Inc.</span>
            <span>·</span>
            <Link to="#" className="hover:underline">Privacy</Link>
            <span>·</span>
            <Link to="#" className="hover:underline">Terms</Link>
            <span>·</span>
            <Link to="#" className="hover:underline">Sitemap</Link>
          </div>
        </footer>

        {/* Simulated Gateway Modal */}
        <AnimatePresence>
          {isGatewayModalOpen && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-[100] bg-black/60 flex items-center justify-center p-4"
            >
              <motion.div 
                initial={{ scale: 0.9, y: 20 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.9, y: 20 }}
                className="bg-white rounded-2xl w-full max-w-md overflow-hidden shadow-2xl relative"
              >
                {/* Modal Header */}
                <div className={`p-6 flex items-center justify-between ${paymentGateway === 'bkash' ? 'bg-[#D12053]' : 'bg-[#ED1C24]'} text-white`}>
                  <div className="flex items-center gap-3 text-white">
                    <div className="w-10 h-10 bg-white rounded-lg p-1 flex items-center justify-center">
                      <img 
                        src={paymentGateway === 'bkash' 
                          ? "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e7/Bkash_logo.png/512px-Bkash_logo.png" 
                          : "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e1/Nagad_logo.png/512px-Nagad_logo.png"} 
                        alt={paymentGateway || ''} 
                        className="w-full h-full object-contain" 
                      />
                    </div>
                    <span className="font-bold text-xl uppercase tracking-wider text-white">{paymentGateway} Payment</span>
                  </div>
                  <button 
                    onClick={() => setIsGatewayModalOpen(false)} 
                    className="hover:bg-black/10 p-1.5 rounded-full transition-colors text-white"
                  >
                    <svg viewBox="0 0 24 24" className="w-6 h-6 fill-none stroke-current stroke-3 text-white"><path d="M18 6L6 18M6 6l12 12" /></svg>
                  </button>
                </div>

                {/* Modal Body */}
                <div className="p-8 space-y-7">
                  <div className="text-center p-4 bg-neutral-50 rounded-xl border border-dashed border-neutral-300">
                    <p className="text-[10px] text-muted-foreground uppercase tracking-widest mb-1 font-bold">Total Payable Amount</p>
                    <p className="text-3xl font-black text-foreground">৳{property.total}</p>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-xs font-bold text-muted-foreground uppercase mb-2 ml-1">Your Wallet Number</label>
                      <input 
                        type="text" 
                        placeholder="01XXXXXXXXX" 
                        defaultValue="01712345678"
                        className="w-full py-4 px-2 border-2 border-neutral-200 rounded-xl focus:border-red-500 outline-none text-2xl tracking-[0.2em] font-mono text-center transition-colors" 
                      />
                    </div>

                    <div className="bg-neutral-50 p-4 rounded-xl text-[10px] text-center text-muted-foreground leading-relaxed font-medium">
                      An OTP (One-Time Password) will be sent to your mobile. Please verify after clicking "Proceed".
                    </div>
                  </div>

                  <Button 
                    className={`w-full h-14 text-xl font-black rounded-xl ${paymentGateway === 'bkash' ? 'bg-[#D12053] hover:bg-[#b01a45]' : 'bg-[#ED1C24] hover:bg-[#d11a1f]'} text-white shadow-lg transition-transform active:scale-95`}
                    onClick={() => {
                      setIsGatewayModalOpen(false);
                      setCurrentStep(3);
                    }}
                  >
                    Proceed with {paymentGateway}
                  </Button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        <AuthModal
          isOpen={currentStep === 4}
          onClose={() => setCurrentStep(3)}
          title="Log in or sign up to book"
          socialLayout="horizontal"
        />
        <DateChangeModal
          isOpen={isDateModalOpen}
          onClose={() => setIsDateModalOpen(false)}
        />
        <GuestChangeModal
          isOpen={isGuestModalOpen}
          onClose={() => setIsGuestModalOpen(false)}
        />
      </div>
    );
};

export default Booking;
