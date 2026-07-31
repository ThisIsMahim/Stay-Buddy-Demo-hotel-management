import { useNavigate } from "react-router-dom";
import { Search, Globe, Menu, User, ChevronRight, X } from "lucide-react";
import { useState } from "react";
import { motion } from "framer-motion";
import Footer from "../components/Footer";

const tabs = [
    "Guest",
    "Home host",
    "Experience host",
    "Service host",
    "Travel admin",
];

const guides = [
    {
        title: "Getting started as a guest on Airbnb",
        image: "https://images.unsplash.com/photo-1540555700478-4be289aefcf1?auto=format&fit=crop&q=80&w=400",
    },
    {
        title: "Using search features to find a place to stay on Airbnb",
        image: "https://images.unsplash.com/photo-1484154218962-a197022b5858?auto=format&fit=crop&q=80&w=400",
    },
    {
        title: "Verify and edit your personal information on your Airbnb account",
        image: "https://images.unsplash.com/photo-1512428559083-a4019321545d?auto=format&fit=crop&q=80&w=400",
    },
    {
        title: "AirCover for guests",
        image: "https://images.unsplash.com/photo-1557804506-669a67965ba0?auto=format&fit=crop&q=80&w=400",
    },
];

const topArticles = [
    {
        title: "Cancel your home reservation as a guest",
        description: "You can cancel or make changes to your home reservation in your trips.",
    },
    {
        title: "Change the date or time of your service or experience reservation",
        description: "When you book a service or experience, you can update the date or time depending on...",
    },
    {
        title: "If your host cancels your home reservation",
        description: "If your reservation is canceled by your host, you'll get a full refund. If the cancellation...",
    },
    {
        title: "Payment methods accepted",
        description: "We support different payment methods depending on the country your payment...",
    },
    {
        title: "Add or remove a payment method",
        description: "Find out how to manage your payment methods.",
    },
    {
        title: "When you'll pay for your reservation",
        description: "Timing differs by the type of booking you're making, how you're paying, and the location...",
    },
];

const exploreMore = [
    {
        title: "Our community policies",
        subtitle: "How we build a foundation of trust.",
        image: "https://images.unsplash.com/photo-1517048676732-d65bc937f952?auto=format&fit=crop&q=80&w=800",
    },
    {
        title: "Safety tips and guidelines",
        subtitle: "Resources to help travelers stay safe.",
        image: "https://images.unsplash.com/photo-1501503060472-7fe3f1721518?auto=format&fit=crop&q=80&w=800",
    },
];

const HelpCenter = () => {
    const [activeTab, setActiveTab] = useState("Guest");
    const navigate = useNavigate();

    return (
        <div className="min-h-screen bg-white font-sans text-[#222222]">
            {/* Header */}
            <header className="border-b border-gray-100 py-4 px-6 md:px-20 flex items-center justify-between sticky top-0 bg-white z-50">
                <div className="flex items-center gap-2">
                    <svg
                        viewBox="0 0 32 32"
                        xmlns="http://www.w3.org/2000/svg"
                        className="w-8 h-8 text-[#FF385C]"
                        fill="currentColor"
                    >
                        <path d="M16 1c2.008 0 3.463.963 4.751 3.269l.533 1.025c1.954 3.83 6.114 12.54 7.1 14.836l.145.353c.667 1.591.91 2.472.96 3.396l.01.415.001.228c0 4.062-2.877 6.478-6.357 6.478-2.224 0-4.556-1.258-6.709-3.386l-.257-.26-.172-.179h-.011l-.176.185c-2.044 2.1-4.392 3.42-6.72 3.42-3.481 0-6.358-2.416-6.358-6.478l.002-.485c.046-.925.295-1.815.976-3.446l.156-.37c.99-2.291 5.15-11.003 7.103-14.833l.533-1.025C12.537 1.963 13.992 1 16 1zm0 2c-1.239 0-2.053.539-2.987 2.21l-.523 1.008c-1.965 3.849-6.139 12.583-7.012 14.6l-.161.378c-.542 1.29-.773 2.11-.806 2.805l-.008.343v.228c0 2.861 2.023 4.478 4.357 4.478 1.61 0 3.542-1.013 5.341-2.86l1.205-1.239 1.205 1.239c1.799 1.847 3.731 2.86 5.341 2.86 2.333 0 4.357-1.617 4.357-4.478v-.228l-.008-.343c-.033-.695-.264-1.515-.807-2.805l-.161-.378c-.873-2.017-5.047-10.751-7.012-14.6l-.523-1.008C18.053 3.539 17.24 3 16 3zm0 13.5a3.5 3.5 0 1 1 0 7 3.5 3.5 0 0 1 0-7zm0 2a1.5 1.5 0 1 0 0 3 1.5 1.5 0 0 0 0-3z" />
                    </svg>
                    <span className="text-[18px] font-bold tracking-tight">Help Center</span>
                </div>
                <div className="flex items-center gap-4">
                    <button className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                        <Globe className="w-4 h-4" />
                    </button>
                    <button className="flex items-center gap-2 border border-gray-300 rounded-full py-1.5 px-3 hover:shadow-md transition-all">
                        <Menu className="w-4 h-4" />
                        <div className="w-7 h-7 bg-gray-500 rounded-full flex items-center justify-center text-white">
                            <User className="w-4 h-4" />
                        </div>
                    </button>
                </div>
            </header>

            <main className="max-w-[1080px] mx-auto px-6 py-12">
                {/* Hero Section */}
                <section className="text-center mb-16">
                    <h1 className="text-4xl md:text-[44px] font-semibold mb-8">
                        Hi Md Tohidul, how can we help?
                    </h1>
                    <div className="relative max-w-[720px] mx-auto">
                        <input
                            type="text"
                            placeholder="Search how-tos and more"
                            className="w-full py-4 px-12 rounded-full border border-gray-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-[#FF385C] focus:border-transparent text-[16px]"
                        />
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                        <button className="absolute right-2 top-1/2 -translate-y-1/2 bg-[#FF385C] p-2.5 rounded-full text-white hover:bg-[#E31C5F] transition-colors">
                            <Search className="w-5 h-5" />
                        </button>
                    </div>
                </section>

                {/* Tabs */}
                <nav className="border-b border-gray-200 mb-12">
                    <div className="flex gap-8 overflow-x-auto no-scrollbar">
                        {tabs.map((tab) => (
                            <button
                                key={tab}
                                onClick={() => setActiveTab(tab)}
                                className={`pb-4 text-[14px] font-semibold whitespace-nowrap transition-colors relative ${activeTab === tab ? "text-black" : "text-gray-500 hover:text-black"
                                    }`}
                            >
                                {tab}
                                {activeTab === tab && (
                                    <motion.div
                                        layoutId="activeTab"
                                        className="absolute bottom-0 left-0 right-0 h-[2px] bg-black"
                                    />
                                )}
                            </button>
                        ))}
                    </div>
                </nav>

                {/* Recommended for you */}
                <section className="mb-16">
                    <h2 className="text-[22px] font-semibold mb-6">Recommended for you</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="border border-gray-200 rounded-xl p-6 hover:shadow-lg transition-shadow cursor-pointer relative overflow-hidden group">
                            <span className="text-[12px] font-bold text-[#E31C5F] uppercase tracking-wider mb-2 block">
                                Action Required
                            </span>
                            <h3 className="text-[18px] font-semibold mb-2">Your identity is not fully verified</h3>
                            <p className="text-gray-500 text-[14px] mb-6 leading-relaxed">
                                Identity verification helps us check that you're really you. It's one of the ways we keep Airbnb secure.
                            </p>
                            <div className="flex flex-col gap-3">
                                <button className="flex items-center justify-between text-[14px] font-semibold text-black hover:underline group-hover:underline">
                                    Check identity verification status
                                    <ChevronRight className="w-4 h-4" />
                                </button>
                                <div className="w-full h-[1px] bg-gray-100" />
                                <button className="flex items-center justify-between text-[14px] font-semibold text-black hover:underline group-hover:underline">
                                    Learn more
                                    <ChevronRight className="w-4 h-4" />
                                </button>
                            </div>
                        </div>

                        <div className="border border-gray-200 rounded-xl p-6 hover:shadow-lg transition-shadow cursor-pointer flex flex-col justify-between group">
                            <div>
                                <span className="text-[12px] font-bold text-gray-500 uppercase tracking-wider mb-2 block">
                                    Quick link
                                </span>
                                <h3 className="text-[18px] font-semibold mb-2">Finding reservation details</h3>
                                <p className="text-gray-500 text-[14px] mb-6 leading-relaxed">
                                    Your Trips tab has full details, receipts, and Host contact info for each of your reservations.
                                </p>
                            </div>
                            <div>
                                <div className="w-full h-[1px] bg-gray-100 mb-4" />
                                <button className="flex items-center justify-between w-full text-[14px] font-semibold text-black hover:underline group-hover:underline">
                                    Go to Trips
                                    <ChevronRight className="w-4 h-4" />
                                </button>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Guides Section */}
                <section className="mb-16">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-[22px] font-semibold">Guides for getting started</h2>
                        <button className="text-[14px] font-semibold hover:underline flex items-center gap-1">
                            Browse all topics <ChevronRight className="w-3 h-3" />
                        </button>
                    </div>
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
                        {guides.map((guide, index) => (
                            <div
                                key={index}
                                className="group cursor-pointer"
                                onClick={() => {
                                    if (guide.title === "AirCover for guests") {
                                        navigate("/aircover");
                                    }
                                }}
                            >
                                <div className="aspect-[4/3] rounded-xl overflow-hidden mb-3">
                                    <img
                                        src={guide.image}
                                        alt={guide.title}
                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                    />
                                </div>
                                <h3 className="text-[14px] font-semibold group-hover:underline leading-snug">
                                    {guide.title}
                                </h3>
                            </div>
                        ))}
                    </div>
                </section>

                {/* Top Articles Section */}
                <section className="mb-16">
                    <h2 className="text-[22px] font-semibold mb-8">Top articles</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-x-12 gap-y-10">
                        {topArticles.map((article, index) => (
                            <div key={index} className="cursor-pointer group">
                                <h3 className="text-[16px] font-semibold mb-1 group-hover:underline border-b border-black inline-block">
                                    {article.title}
                                </h3>
                                <p className="text-gray-500 text-[14px] leading-relaxed mt-2">
                                    {article.description}
                                </p>
                            </div>
                        ))}
                    </div>
                </section>

                {/* Explore More and Contact Section */}
                <section className="mb-16">
                    <div className="flex flex-col lg:flex-row gap-12">
                        <div className="flex-grow">
                            <h2 className="text-[22px] font-semibold mb-6">Explore more</h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {exploreMore.map((item, index) => (
                                    <div key={index} className="relative aspect-[4/3] rounded-2xl overflow-hidden group cursor-pointer">
                                        <img
                                            src={item.image}
                                            alt={item.title}
                                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                        />
                                        <div className="absolute inset-x-0 bottom-0 p-6 bg-gradient-to-t from-black/80 to-transparent text-white">
                                            <h3 className="text-[18px] font-semibold mb-1">{item.title}</h3>
                                            <p className="text-[13px] opacity-90">{item.subtitle}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="lg:w-[320px] shrink-0">
                            <div className="border border-gray-200 rounded-2xl p-8 flex flex-col bg-white shadow-sm mt-[52px]">
                                <h3 className="text-[20px] font-semibold mb-2">Need to get in touch?</h3>
                                <p className="text-gray-500 text-[14px] mb-6 leading-relaxed">
                                    We'll start with some questions and get you to the right place.
                                </p>
                                <button className="w-full py-3 px-6 border border-black rounded-lg font-semibold hover:bg-gray-50 transition-colors mb-4 text-[14px]">
                                    Contact us
                                </button>
                                <p className="text-[14px] text-gray-500">
                                    You can also <a href="#" className="underline font-semibold text-black">give us feedback</a>.
                                </p>
                            </div>
                        </div>
                    </div>
                </section>
            </main>

            <Footer />
        </div>
    );
};

export default HelpCenter;
