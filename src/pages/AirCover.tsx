import { Search, Globe, Menu, User, ChevronRight } from "lucide-react";
import Footer from "../components/Footer";
import { Link } from "react-router-dom";

const AirCover = () => {
    return (
        <div className="min-h-screen bg-white font-sans text-[#222222]">
            {/* Header */}
            <header className="border-b border-gray-100 py-4 px-6 md:px-20 flex items-center justify-between sticky top-0 bg-white z-50">
                <div className="flex items-center gap-2">
                    <Link to="/help" className="flex items-center gap-2">
                        <svg
                            viewBox="0 0 32 32"
                            xmlns="http://www.w3.org/2000/svg"
                            className="w-8 h-8 text-[#FF385C]"
                            fill="currentColor"
                        >
                            <path d="M16 1c2.008 0 3.463.963 4.751 3.269l.533 1.025c1.954 3.83 6.114 12.54 7.1 14.836l.145.353c.667 1.591.91 2.472.96 3.396l.01.415.001.228c0 4.062-2.877 6.478-6.357 6.478-2.224 0-4.556-1.258-6.709-3.386l-.257-.26-.172-.179h-.011l-.176.185c-2.044 2.1-4.392 3.42-6.72 3.42-3.481 0-6.358-2.416-6.358-6.478l.002-.485c.046-.925.295-1.815.976-3.446l.156-.37c.99-2.291 5.15-11.003 7.103-14.833l.533-1.025C12.537 1.963 13.992 1 16 1zm0 2c-1.239 0-2.053.539-2.987 2.21l-.523 1.008c-1.965 3.849-6.139 12.583-7.012 14.6l-.161.378c-.542 1.29-.773 2.11-.806 2.805l-.008.343v.228c0 2.861 2.023 4.478 4.357 4.478 1.61 0 3.542-1.013 5.341-2.86l1.205-1.239 1.205 1.239c1.799 1.847 3.731 2.86 5.341 2.86 2.333 0 4.357-1.617 4.357-4.478v-.228l-.008-.343c-.033-.695-.264-1.515-.807-2.805l-.161-.378c-.873-2.017-5.047-10.751-7.012-14.6l-.523-1.008C18.053 3.539 17.24 3 16 3zm0 13.5a3.5 3.5 0 1 1 0 7 3.5 3.5 0 0 1 0-7zm0 2a1.5 1.5 0 1 0 0 3 1.5 1.5 0 0 0 0-3z" />
                        </svg>
                        <span className="text-[18px] font-bold tracking-tight">Help Center</span>
                    </Link>
                </div>
                <div className="flex-grow max-w-[500px] mx-8 hidden md:block">
                    <div className="relative">
                        <input
                            type="text"
                            placeholder="Search how-tos and more"
                            className="w-full py-2.5 px-10 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#FF385C] text-[14px]"
                        />
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                        <div className="absolute right-1 top-1/2 -translate-y-1/2 bg-[#FF385C] p-1.5 rounded-full text-white">
                            <Search className="w-3.5 h-3.5" />
                        </div>
                    </div>
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

            <main className="max-w-[1080px] mx-auto px-6 py-8">
                {/* Breadcrumbs */}
                <nav className="flex items-center gap-2 text-[12px] text-gray-500 mb-8 whitespace-nowrap overflow-x-auto no-scrollbar">
                    <Link to="/" className="hover:underline">Home</Link>
                    <ChevronRight className="w-3 h-3" />
                    <Link to="/help" className="hover:underline">Help</Link>
                    <ChevronRight className="w-3 h-3" />
                    <span>Booking and traveling</span>
                    <ChevronRight className="w-3 h-3" />
                    <span>Taking a home stay</span>
                    <ChevronRight className="w-3 h-3" />
                    <span>Booking help</span>
                    <ChevronRight className="w-3 h-3" />
                    <span className="text-black font-semibold">AirCover for guests</span>
                </nav>

                <div className="flex flex-col lg:flex-row gap-16">
                    {/* Content Column */}
                    <article className="flex-grow max-w-[680px]">
                        <div className="mb-4 text-[12px] font-semibold text-gray-500">Guide • Guest</div>
                        <h1 className="text-[32px] font-semibold mb-6">AirCover for guests</h1>

                        {/* AirCover Banner */}
                        <div className="bg-[#1A1A1A] rounded-2xl p-12 mb-10 flex items-center justify-center aspect-[16/9]">
                            <div className="flex flex-col items-center">
                                <span className="text-white text-[60px] font-bold tracking-tighter flex items-center">
                                    air<span className="text-[#FF385C]">cover</span>
                                </span>
                            </div>
                        </div>

                        <p className="text-[16px] leading-relaxed mb-8">
                            Every home booking comes with <Link to="#" className="underline font-semibold">AirCover for guests</Link>. If there's a serious issue with your Airbnb home that your host can't resolve, we're here to help.
                        </p>

                        <section className="mb-10">
                            <h2 className="text-[22px] font-semibold mb-4">We'll help you get rebooked or give you a full or partial refund</h2>
                            <p className="text-[16px] mb-4">Here's when we can help:</p>
                            <ul className="list-disc pl-6 space-y-3 text-[16px]">
                                <li>If your <Link to="#" className="underline font-semibold text-[#006AFF]">host cancels before check-in</Link></li>
                                <li>If there's a serious problem and you can't get in touch with your host</li>
                                <li>If the listing is <Link to="#" className="underline font-semibold text-[#006AFF]">significantly different</Link> than advertised, and your host can't resolve the issue</li>
                            </ul>
                            <p className="text-[16px] mt-6 leading-relaxed">
                                Our team can help you find a similar place, considering location and amenities, based on availability at <Link to="#" className="underline font-semibold text-[#006AFF]">comparable pricing</Link>. If a similar placement isn't available or you'd prefer not to rebook, we'll give you a full or partial refund, including service fees.
                            </p>
                        </section>

                        <section className="mb-10">
                            <h2 className="text-[22px] font-semibold mb-4">How AirCover for guests works</h2>
                            <p className="text-[16px] mb-4">AirCover for guests provides support for serious issues with your home booking, for example:</p>
                            <ul className="list-disc pl-6 space-y-3 text-[16px]">
                                <li>Host cancels your reservation prior to check-in</li>
                                <li>The heating isn't working in winter</li>
                                <li>The listing has fewer bedrooms than listed</li>
                                <li>It's the <Link to="#" className="underline font-semibold text-[#006AFF]">wrong type of home</Link>—a private room instead of an entire home</li>
                                <li>A major amenity described, like a pool or kitchen, is missing</li>
                            </ul>
                            <p className="text-[14px] text-gray-500 mt-4 leading-relaxed italic">
                                AirCover for guests doesn't include minor inconveniences, like a broken toaster.
                            </p>
                        </section>

                        <section className="mb-10 border-t border-gray-100 pt-10">
                            <h2 className="text-[22px] font-semibold mb-4">Resolving issues during your stay</h2>
                            <p className="text-[16px] mb-6 leading-relaxed">
                                Your Host is your best point of contact for help if anything comes up. You can message your host <Link to="#" className="underline font-semibold text-black">directly from your Inbox</Link> to let them know what's going on. If an issue comes up during your stay:
                            </p>
                            <div className="space-y-6">
                                <div className="flex gap-4">
                                    <span className="font-bold text-[16px] shrink-0">1.</span>
                                    <p className="text-[16px]">
                                        <span className="font-bold">Document the issue:</span> Take <Link to="#" className="underline text-black font-semibold">photos or videos as evidence</Link>.
                                    </p>
                                </div>
                                <div className="flex gap-4">
                                    <span className="font-bold text-[16px] shrink-0">2.</span>
                                    <p className="text-[16px]">
                                        <span className="font-bold">Contact your host:</span> Notify your host <Link to="#" className="underline text-black font-semibold">within 72 hours of discovery</Link>, describing the problem and how you'd like it fixed.
                                    </p>
                                </div>
                                <div className="flex gap-4">
                                    <span className="font-bold text-[16px] shrink-0">3.</span>
                                    <p className="text-[16px]">
                                        <Link to="#" className="underline text-black font-semibold">Contact us</Link> if your host is unresponsive or unable to resolve the issue contact <Link to="#" className="underline text-[#006AFF] font-semibold">us immediately</Link>.
                                    </p>
                                </div>
                                <div className="flex gap-4">
                                    <span className="font-bold text-[16px] shrink-0">4.</span>
                                    <p className="text-[16px]">
                                        <span className="font-bold">AirCover for guests support:</span> If there's an issue covered by AirCover for guests and we're notified within 72 hours, we'll help you find comparable accommodation based on availability and pricing. If comparable accommodation isn't available or you prefer not to rebook, you'll receive a full or partial refund.
                                    </p>
                                </div>
                            </div>
                        </section>

                        <section className="mb-10 border-t border-gray-100 pt-10">
                            <h2 className="text-[22px] font-semibold mb-4">24-hour safety line</h2>
                            <p className="text-[16px] mb-4">
                                Need to reach us? <Link to="#" className="underline font-semibold text-black">Contact us</Link> by phone, email, or chat.
                            </p>
                            <p className="text-[16px] leading-relaxed mb-6">
                                If you ever feel unsafe, we're here to help you get priority access to specially trained safety agents who will assist you with your safety issue or directly connect you to local emergency authorities, day or night.
                            </p>

                            <div className="bg-[#FFF8F1] p-6 rounded-xl border border-[#FFE7CC] flex gap-4">
                                <div className="text-[#E07912] shrink-0 mt-1">
                                    <svg viewBox="0 0 16 16" className="w-5 h-5 fill-current">
                                        <path d="M8 0a8 8 0 1 1 0 16A8 8 0 0 1 8 0zm0 12a1 1 0 1 0 0 2 1 1 0 0 0 0-2zm1-8H7v6h2V4z" />
                                    </svg>
                                </div>
                                <p className="text-[14px] leading-relaxed text-[#484848]">
                                    AirCover for guests, which is free for you, is <span className="font-semibold underline">different for our long-term stays</span>. For example, if it's a long-stay and you have to find an alternative home because yours is not as advertised, learn more about <Link to="#" className="underline font-semibold text-[#006AFF]">AirCover for guests and traveling and rebooking/refund protection for guests</Link>.
                                </p>
                            </div>
                        </section>

                        <p className="text-[14px] text-gray-500 mb-8 mt-12">
                            If you're a host, learn more about <Link to="#" className="underline font-semibold text-[#006AFF]">AirCover for Hosts</Link> and <Link to="#" className="underline font-semibold text-[#006AFF]">how improvements were made</Link>.
                        </p>

                        <div className="border-t border-gray-200 pt-8 mb-12 flex items-center gap-4">
                            <span className="text-[16px] font-semibold">Did this article help?</span>
                            <div className="flex gap-4">
                                <button className="underline font-semibold">Yes</button>
                                <button className="underline font-semibold">No</button>
                            </div>
                        </div>

                        {/* Related Articles */}
                        <section className="mb-16">
                            <h3 className="text-[18px] font-semibold mb-4">Related articles</h3>
                            <ul className="space-y-4">
                                <li><Link to="#" className="text-[16px] underline decoration-gray-300 hover:decoration-black">Community policy</Link></li>
                                <li><Link to="#" className="text-[16px] underline decoration-gray-300 hover:decoration-black">Ground rules for home hosts</Link></li>
                                <li><Link to="#" className="text-[16px] underline decoration-gray-300 hover:decoration-black">Please review our ground rules for home hosts.</Link></li>
                            </ul>

                            <div className="mt-12 space-y-8">
                                <div>
                                    <div className="text-[12px] text-gray-500 font-semibold mb-2">Guide • Guest</div>
                                    <h4 className="text-[18px] font-semibold mb-1">When you'll get your refund</h4>
                                    <p className="text-gray-500 text-[14px]">While the refund is processed immediately, most refunds arrive within 10 days, but for some payment methods it might take longer.</p>
                                </div>
                                <div>
                                    <div className="text-[12px] text-gray-500 font-semibold mb-2">Guide • Host</div>
                                    <h4 className="text-[18px] font-semibold mb-1">AirCover for hosts</h4>
                                    <p className="text-gray-500 text-[14px]">AirCover for hosts is a program that includes guest identity verification, reservation screening, ৳3M Host damage protection, $1M Host liability insurance, $1M Experiences liability insurance, an...</p>
                                </div>
                            </div>
                        </section>
                    </article>

                    {/* Sidebar Column */}
                    <aside className="lg:w-[350px] shrink-0 sticky top-24 h-fit">
                        <div className="border border-gray-200 rounded-2xl p-8 flex flex-col bg-white">
                            <h3 className="text-[20px] font-semibold mb-2">Need to get in touch?</h3>
                            <p className="text-gray-500 text-[14px] mb-6 leading-relaxed">
                                We'll start with some questions and get you to the right place.
                            </p>
                            <button className="w-full py-3 px-6 border border-black rounded-lg font-semibold hover:bg-gray-50 transition-colors mb-4 text-[14px]">
                                Contact us
                            </button>
                            <p className="text-[14px] text-gray-500">
                                You can also <Link to="#" className="underline font-semibold text-black">give us feedback</Link>.
                            </p>
                        </div>
                    </aside>
                </div>
            </main>

            <Footer />
        </div>
    );
};

export default AirCover;
