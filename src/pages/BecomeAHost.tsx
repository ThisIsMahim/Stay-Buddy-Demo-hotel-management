import { Search, Globe, Menu, User, ChevronDown, Check, SparkleIcon, ShieldCheck, CreditCard, TrendingUp, Users, Clock, Box, Zap, Gem, ArrowRight, Building2, MapPin } from "lucide-react";
import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useUser, useClerk } from "@clerk/react";
import { api } from "../services/api";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { motion, AnimatePresence } from "framer-motion";

const BecomeAHost = () => {
    const navigate = useNavigate();
    const { user, isSignedIn, isLoaded } = useUser();
    const [loading, setLoading] = useState(false);
    const [submitted, setSubmitted] = useState(false);

    const pricingPlans = [
        {
            name: "Standard",
            price: "Free",
            period: "30-day trial",
            desc: "Perfect for single property owners starting out.",
            features: ["1 Property Listing", "Community Support", "Basic Revenue Tracking", "Standard Visibility"],
            icon: <Box className="w-5 h-5" />,
            isPopular: false
        },
        {
            name: "Pro Partner",
            price: "৳5,000",
            period: "per year",
            desc: "The professional choice for scaling your business.",
            features: ["Unlimited Listings", "Priority Support", "Advanced Analytics Dashboard", "Verified Partner Badge", "Premium Ad Placement"],
            icon: <Zap className="w-5 h-5" />,
            isPopular: true
        },
        {
            name: "Enterprise",
            price: "Custom",
            period: "for chains",
            desc: "Bespoke solutions for large hotel groups.",
            features: ["Multi-Hotel Management", "API Access", "Dedicated Account Manager", "Custom Integrations"],
            icon: <Gem className="w-5 h-5" />,
            isPopular: false
        }
    ];

    const stats = [
        { label: "Active Partners", value: "15,000+", icon: <Users className="w-4 h-4" /> },
        { label: "Rev Increase", value: "+38%", icon: <TrendingUp className="w-4 h-4" /> },
        { label: "Countries", value: "12+", icon: <Globe className="w-4 h-4" /> },
    ];

    const handleRegister = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);
        const fd = new FormData(e.currentTarget);
        try {
            await api.addOwner({
                name: fd.get("name") as string,
                email: fd.get("email") as string,
                avatar: user?.imageUrl
            });
            setSubmitted(true);
        } catch (err) {
            alert("Registration failed. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#FAFAFA] font-['Outfit', 'Inter', sans-serif] text-slate-900 overflow-x-hidden">
            <Header />

            <main>
                {/* ── HERO SECTION ── */}
                <section className="relative px-6 md:px-20 pt-16 pb-24 overflow-hidden">
                    {/* Subtle Background Elements */}
                    <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-indigo-50/50 rounded-full blur-[120px] -z-10 translate-x-1/2 -translate-y-1/2" />
                    <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-amber-50/30 rounded-full blur-[100px] -z-10 -translate-x-1/2 translate-y-1/2" />


                    <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center gap-16 lg:gap-24">
                        <div className="flex-1 text-center lg:text-left">
                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="inline-flex items-center gap-2 px-3 py-1 bg-indigo-50 border border-indigo-100 rounded-full mb-8"
                            >
                                <SparkleIcon className="w-3.5 h-3.5 text-indigo-600" />
                                <span className="text-[10px] font-bold text-indigo-600 uppercase tracking-widest">Growth Powered by Reservation BD</span>
                            </motion.div>

                            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-slate-900 leading-[1.05] tracking-tight mb-8">
                                Turn your space<br />
                                <span className="text-indigo-600 italic">into a business.</span>
                            </h1>
                            <p className="text-slate-500 text-lg md:text-xl font-medium mb-10 max-w-xl mx-auto lg:mx-0 leading-relaxed">
                                Join the most trusted network of independent property owners. Automate your bookings, scale your revenue, and reach millions of travellers.
                            </p>

                            <div className="flex flex-wrap justify-center lg:justify-start gap-10">
                                {stats.map((s, i) => (
                                    <div key={i} className="flex flex-col">
                                        <span className="text-2xl font-bold text-slate-900">{s.value}</span>
                                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{s.label}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="flex-1 w-full max-w-lg">
                            <AnimatePresence mode="wait">
                                {!submitted ? (
                                    <motion.form
                                        initial={{ opacity: 0, scale: 0.98 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        exit={{ opacity: 0, scale: 0.98 }}
                                        onSubmit={handleRegister}
                                        className="bg-white p-8 md:p-10 rounded-[40px] shadow-2xl shadow-indigo-100/50 border border-slate-100 relative"
                                    >
                                        <h3 className="text-2xl font-bold text-slate-900 mb-2">Partner Application</h3>
                                        <p className="text-sm text-slate-400 font-medium mb-8">Tell us about yourself to begin your journey.</p>

                                        <div className="space-y-6">
                                            <div className="space-y-1.5">
                                                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Legal Representative</label>
                                                <input
                                                    name="name"
                                                    required
                                                    type="text"
                                                    defaultValue={user?.fullName || ""}
                                                    placeholder="John Doe"
                                                    className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-5 py-4 text-slate-900 text-sm outline-none focus:ring-2 focus:ring-indigo-500/10 focus:border-indigo-500/30 transition-all"
                                                />
                                            </div>
                                            <div className="space-y-1.5">
                                                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Business Email</label>
                                                <input
                                                    name="email"
                                                    required
                                                    type="email"
                                                    defaultValue={user?.primaryEmailAddress?.emailAddress || ""}
                                                    placeholder="john@example.com"
                                                    className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-5 py-4 text-slate-900 text-sm outline-none focus:ring-2 focus:ring-indigo-500/10 focus:border-indigo-500/30 transition-all"
                                                />
                                            </div>

                                            <button
                                                type="submit"
                                                disabled={loading}
                                                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-4.5 rounded-[20px] font-bold text-sm shadow-xl shadow-indigo-200 active:scale-95 transition-all flex items-center justify-center gap-3 mt-4"
                                            >
                                                {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <>Request Partner Access <ArrowRight className="w-4 h-4" /></>}
                                            </button>
                                        </div>

                                        <p className="mt-8 text-[11px] text-slate-400 text-center leading-relaxed italic">
                                            * New accounts start as <span className="font-bold">"Pending"</span>. Verification typically takes 6-12 hours during business days.
                                        </p>
                                    </motion.form>
                                ) : (
                                    <motion.div
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        className="bg-white p-12 rounded-[48px] text-center shadow-2xl shadow-emerald-100 border border-emerald-50"
                                    >
                                        <div className="w-20 h-20 bg-emerald-50 rounded-3xl flex items-center justify-center mx-auto mb-8">
                                            <Check className="w-10 h-10 text-emerald-600" />
                                        </div>
                                        <h3 className="text-2xl font-bold text-slate-900 mb-4">Application Sent</h3>
                                        <p className="text-slate-500 font-medium mb-10 leading-relaxed">We've received your request. Our partnership team will review your application and email you once verified.</p>
                                        <Link to="/" className="inline-flex items-center gap-2 px-8 py-3.5 bg-[#111111] text-white text-sm font-bold rounded-2xl hover:bg-black transition-all">
                                            Return Home
                                        </Link>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    </div>
                </section>

                {/* ── PRICING SECTION ── */}
                <section className="py-32 bg-white relative">
                    <div className="max-w-7xl mx-auto px-6 md:px-20 text-center mb-20">
                        <h2 className="text-sm font-bold text-indigo-500 uppercase tracking-[0.3em] mb-4">The Subscription System</h2>
                        <h3 className="text-4xl md:text-5xl font-bold text-slate-900 tracking-tight">Simple plans for every scale.</h3>
                    </div>

                    <div className="max-w-6xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-8">
                        {pricingPlans.map((p, i) => (
                            <div
                                key={i}
                                className={`p-8 md:p-10 rounded-[40px] border transition-all duration-500 flex flex-col relative group ${p.isPopular ? "bg-[#F8FAFF] border-indigo-100 shadow-xl shadow-indigo-100/20 scale-105 z-10" : "bg-white border-slate-100 hover:border-indigo-100"}`}
                            >
                                {p.isPopular && (
                                    <div className="absolute -top-4 right-10 bg-indigo-600 text-white text-[9px] font-bold uppercase tracking-widest px-4 py-1.5 rounded-full">
                                        Partner Favorite
                                    </div>
                                )}
                                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-8 ${p.isPopular ? "bg-indigo-600 text-white" : "bg-slate-100 text-slate-400"}`}>
                                    {p.icon}
                                </div>
                                <h4 className="text-xl font-bold text-slate-900 mb-1">{p.name}</h4>
                                <p className="text-xs text-slate-400 font-medium mb-6">{p.desc}</p>

                                <div className="flex items-baseline gap-1.5 mb-8">
                                    <span className="text-4xl font-bold text-slate-900">{p.price}</span>
                                    {p.period && <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{p.period}</span>}
                                </div>

                                <ul className="space-y-4 mb-10 flex-1">
                                    {p.features.map((f, j) => (
                                        <li key={j} className="flex items-center gap-3 text-[13px] text-slate-600 font-medium">
                                            <div className="w-4 h-4 rounded-full bg-emerald-50 flex items-center justify-center border border-emerald-100">
                                                <Check className="w-2.5 h-2.5 text-emerald-600" />
                                            </div>
                                            {f}
                                        </li>
                                    ))}
                                </ul>

                                <button className={`w-full py-4 rounded-2xl text-xs font-bold transition-all active:scale-95 ${p.isPopular ? "bg-indigo-600 text-white hover:bg-indigo-700 shadow-lg shadow-indigo-100" : "bg-white text-slate-900 border border-slate-200 hover:border-indigo-200"}`}>
                                    Get Started
                                </button>
                            </div>
                        ))}
                    </div>
                </section>

                {/* ── OWNER SYSTEM WORKFLOW ── */}
                <section className="py-32 px-6 md:px-20 max-w-7xl mx-auto">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
                        <div className="space-y-12">
                            <div>
                                <h2 className="text-sm font-bold text-slate-400 uppercase tracking-[0.3em] mb-4">The Workflow</h2>
                                <h3 className="text-4xl font-bold text-slate-900 leading-tight">From application to your first verified booking.</h3>
                            </div>

                            <div className="space-y-8">
                                <WorkflowStep
                                    num="01"
                                    title="Submit Application"
                                    desc="Register as an owner by providing basic business details. Your account initially starts in Pending status."
                                />
                                <WorkflowStep
                                    num="02"
                                    title="Internal Review"
                                    desc="Our team verifies your credentials and property readiness. You'll receive a 'Verified' badge upon approval."
                                />
                                <WorkflowStep
                                    num="03"
                                    title="Choose Your Plan"
                                    desc="Select between our Standard (trial) or Pro Partner subscription to unlock full revenue capabilities."
                                />
                                <WorkflowStep
                                    num="04"
                                    title="Start Earning"
                                    desc="Launch your properties and watch your dashboard fill with real-time reservations."
                                />
                            </div>
                        </div>

                        <div className="relative">
                            <div className="absolute inset-0 bg-indigo-100 rounded-[60px] blur-[80px] opacity-30 -z-10" />
                            <div className="aspect-[4/3] rounded-[60px] overflow-hidden shadow-2xl border-8 border-white group">
                                <img
                                    src="https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=1200"
                                    className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
                                    alt="Modern Office"
                                />
                                <div className="absolute inset-x-0 bottom-0 p-10 bg-gradient-to-t from-black/60 to-transparent text-white">
                                    <h4 className="text-xl font-bold mb-1">Stay Buddy HQ</h4>
                                    <p className="text-sm text-white/70 font-medium">Empowering 15k+ hospitality entrepreneurs.</p>
                                </div>
                            </div>

                            {/* Floating Card */}
                            <motion.div
                                initial={{ x: 20, y: 20 }}
                                animate={{ x: 0, y: 0 }}
                                transition={{ repeat: Infinity, repeatType: "reverse", duration: 4 }}
                                className="absolute -bottom-10 -left-10 bg-white p-6 rounded-3xl shadow-xl border border-slate-50 flex items-center gap-4 hidden md:flex"
                            >
                                <div className="w-12 h-12 bg-emerald-50 rounded-2xl flex items-center justify-center">
                                    <ShieldCheck className="w-6 h-6 text-emerald-600" />
                                </div>
                                <div>
                                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Trust Score</p>
                                    <p className="text-lg font-bold text-slate-900">4.9/5 verified</p>
                                </div>
                            </motion.div>
                        </div>
                    </div>
                </section>

                {/* ── FAQ BITS ── */}
                <section className="py-24 px-6 md:px-20 bg-slate-50 relative overflow-hidden">
                    <div className="max-w-4xl mx-auto space-y-12">
                        <div className="text-center">
                            <h2 className="text-3xl font-bold text-slate-900">Frequently Asked</h2>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <FAQItem title="When will I get verified?" desc="Verification takes 6-12 hours. We review legal ID and property documentation to ensure network safety." />
                            <FAQItem title="Can I cancel my subscription?" desc="Yes, Pro Partner plans can be cancelled anytime from your Wallet dashboard. You'll retain access until the period ends." />
                            <FAQItem title="How do I get paid?" desc="All payments are processed via our secure wallet. You can initiate a payout to your bank account or mobile wallet instantly." />
                            <FAQItem title="Is AirCover included?" desc="Yes! Every partner listing is protected by StayCover, covering up to ৳3M in accidental damages." />
                        </div>
                    </div>
                </section>
            </main>

            <Footer />
        </div>
    );
};

const WorkflowStep = ({ num, title, desc }: { num: string; title: string, desc: string }) => (
    <div className="flex gap-6 group">
        <span className="text-3xl font-bold text-slate-100 group-hover:text-indigo-600 transition-colors duration-500 tabular-nums">{num}</span>
        <div className="space-y-1 border-l border-slate-100 group-hover:border-indigo-100 pl-6 transition-colors duration-500">
            <h4 className="text-lg font-bold text-slate-900">{title}</h4>
            <p className="text-sm text-slate-500 font-medium leading-relaxed">{desc}</p>
        </div>
    </div>
);

const FAQItem = ({ title, desc }: { title: string; desc: string }) => (
    <div className="p-8 bg-white rounded-3xl border border-slate-100 hover:shadow-lg transition-shadow">
        <h4 className="font-bold text-slate-900 mb-3">{title}</h4>
        <p className="text-xs text-slate-500 font-medium leading-relaxed">{desc}</p>
    </div>
);

const Loader2 = ({ className }: { className?: string }) => (
    <svg className={`animate-spin ${className}`} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
    </svg>
);

export default BecomeAHost;
