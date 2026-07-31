import { useEffect, useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Star, ChevronLeft, ChevronRight, Heart, Loader2 } from "lucide-react";
import { Link } from "react-router-dom";
import { api, ExperienceCard as Experience } from "@/services/api";
import { useTranslation } from "react-i18next";

const ServiceCard = ({ item }: { item: Experience }) => (
    <Link to={`/experiences/${item.id}`} className="shrink-0 w-[270px] cursor-pointer group block">
        <div className="relative overflow-hidden rounded-xl aspect-[5/4] mb-3">
            <img
                src={item.image}
                alt={item.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                onError={(e) => { (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=600"; }}
            />
            {item.badge && (
                <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm px-2.5 py-1 rounded-md text-xs font-semibold shadow-sm">
                    {item.badge}
                </div>
            )}
            <button 
                className="absolute top-3 right-3 p-1.5 hover:bg-white/10 rounded-full transition-colors z-10"
                onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    api.toggleWishlist(item.id);
                }}
            >
                <Heart className="w-6 h-6 text-white drop-shadow-md stroke-[2px]" />
            </button>
        </div>

        <div className="space-y-1">
            <div className="flex justify-between items-start gap-2">
                <h3 className="font-semibold text-gray-900 leading-tight group-hover:underline line-clamp-1">
                    {item.title}
                </h3>
            </div>
            <p className="text-sm text-gray-500 truncate">From ৳{item.price} {item.duration ? `· ${item.duration}` : "/ guest"}</p>
            {item.rating && (
                <div className="flex items-center gap-1 text-xs font-medium mt-1">
                    <Star className="w-3 h-3 fill-black text-black" />
                    <span>{item.rating}</span>
                    <span className="text-gray-400">({item.reviews})</span>
                </div>
            )}
        </div>
    </Link>
);

const Section = ({ title, items }: { title: string, items: Experience[] }) => {
    const { t } = useTranslation();
    if (items.length === 0) return null;
    
    return (
        <div className="py-8 px-6 sm:px-12 border-t border-gray-100 first:border-0">
            <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900">{t(title)}</h2>
                <div className="hidden sm:flex items-center gap-2">
                    <button className="p-2 border border-gray-200 rounded-full hover:bg-gray-100 disabled:opacity-50 transition-colors">
                        <ChevronLeft className="w-4 h-4" />
                    </button>
                    <button className="p-2 border border-black rounded-full hover:bg-gray-100 transition-colors">
                        <ChevronRight className="w-4 h-4" />
                    </button>
                </div>
            </div>

            <div className="flex gap-6 overflow-x-auto pb-4 scrollbar-hide -mx-6 px-6 sm:mx-0 sm:px-0">
                {items.map((item) => (
                    <ServiceCard key={item.id} item={item} />
                ))}
            </div>
        </div>
    );
};

const Services = () => {
    const { t } = useTranslation();
    const [experiences, setExperiences] = useState<Experience[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        api.getExperiences({ isActive: true }).then(data => {
            setExperiences(data);
            setLoading(false);
        });
    }, []);

    // Filter logic based on tags or title keywords
    const chefs = experiences.filter(e => 
        e.tags?.some(t => t.toLowerCase().includes('chef') || t.toLowerCase().includes('food') || t.toLowerCase().includes('cook')) ||
        e.title.toLowerCase().includes('chef') || e.title.toLowerCase().includes('cook') || e.title.toLowerCase().includes('meal')
    );

    const training = experiences.filter(e => 
        e.tags?.some(t => t.toLowerCase().includes('train') || t.toLowerCase().includes('wellness') || t.toLowerCase().includes('fitness') || t.toLowerCase().includes('yoga')) ||
        e.title.toLowerCase().includes('train') || e.title.toLowerCase().includes('fitness') || e.title.toLowerCase().includes('yoga')
    );

    const massage = experiences.filter(e => 
        e.tags?.some(t => t.toLowerCase().includes('massage') || t.toLowerCase().includes('spa') || t.toLowerCase().includes('recover')) ||
        e.title.toLowerCase().includes('massage') || e.title.toLowerCase().includes('spa')
    );

    // Any other experiences that don't fall into the main categories above
    const otherExperiences = experiences.filter(e => !chefs.includes(e) && !training.includes(e) && !massage.includes(e));

    if (loading) {
        return (
            <div className="min-h-screen bg-white flex flex-col items-center justify-center">
                <Header />
                <div className="flex-1 flex flex-col items-center justify-center mt-20">
                    <Loader2 className="w-8 h-8 animate-spin text-rose-500 mb-4" />
                    <p className="text-gray-500">{t("Loading services...")}</p>
                </div>
                <Footer />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-white">
            <Header />
            <main className="pt-6 pb-20">
                <Section title="Chefs" items={chefs} />
                <Section title="Personal Training & Wellness" items={training} />
                <Section title="Massage" items={massage} />
                
                {/* Dynamically render anything else if present */}
                {otherExperiences.length > 0 && (
                    <Section title="Other Services & Experiences" items={otherExperiences} />
                )}

                {experiences.length === 0 && (
                    <div className="text-center py-20 text-gray-500">
                        {t("No services available at the moment.")}
                    </div>
                )}
            </main>
            <Footer />
        </div>
    );
};

export default Services;
