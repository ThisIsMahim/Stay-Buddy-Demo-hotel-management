import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Star, MapPin, Clock, Sparkles, ChevronRight, Loader2 } from "lucide-react";
import { motion } from "framer-motion";
import { api, ExperienceCard } from "../services/api";
import { useTranslation } from "react-i18next";

const ExperiencesAISection = () => {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const [experiences, setExperiences] = useState<ExperienceCard[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        api.getExperiences({ isActive: true }).then(data => {
            setExperiences(data.slice(0, 4)); // Show only 4 recommendations
            setLoading(false);
        });
    }, []);

    if (loading) return (
        <div className="flex justify-center py-20">
            <Loader2 className="w-8 h-8 animate-spin text-[#FF385C]" />
        </div>
    );

    if (experiences.length === 0) return null;

    return (
        <section className="py-16 container mx-auto px-4 max-w-[1400px]">
            <div className="flex items-end justify-between mb-8">
                <div className="space-y-2">
                    <div className="inline-flex items-center gap-2 bg-indigo-50 px-3 py-1 rounded-full border border-indigo-100">
                        <Sparkles className="w-3.5 h-3.5 text-indigo-600 fill-indigo-600" />
                        <span className="text-[11px] font-black text-indigo-600 uppercase tracking-widest">AI Recommended Experiences</span>
                    </div>
                    <h2 className="text-3xl font-black text-slate-900 tracking-tight">
                        Perfect Activities for Your Stay
                    </h2>
                    <p className="text-slate-500 text-sm font-medium">
                        Hand-picked experiences tailored to your interests and location
                    </p>
                </div>
                <button 
                    onClick={() => navigate('/experiences')}
                    className="group flex items-center gap-2 text-sm font-black text-[#FF385C] hover:text-slate-900 transition-colors bg-white border border-rose-100 px-6 py-3 rounded-2xl shadow-sm hover:shadow-md"
                >
                    Explore all <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {experiences.map((exp, idx) => (
                    <motion.div
                        key={exp.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: idx * 0.1 }}
                        className="group cursor-pointer bg-white rounded-[24px] border border-slate-100 shadow-sm hover:shadow-2xl hover:shadow-rose-100/50 transition-all duration-500 overflow-hidden"
                        onClick={() => navigate(`/experiences/${exp.id}`)}
                    >
                        {/* Image */}
                        <div className="relative aspect-[4/5] overflow-hidden">
                            <img
                                src={exp.images?.[0] || exp.image}
                                alt={exp.title}
                                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-60" />
                            
                            {/* Badge */}
                            <div className="absolute top-4 left-4">
                                <span className="bg-white/90 backdrop-blur-md text-slate-900 text-[10px] font-black px-3 py-1.5 rounded-full shadow-lg uppercase tracking-wider border border-white/50">
                                    {exp.category === "original" ? "Bespoke" : "Local Expert"}
                                </span>
                            </div>

                            {/* Price chip */}
                            <div className="absolute bottom-4 left-4">
                                <div className="bg-white/10 backdrop-blur-xl border border-white/20 p-2 px-3 rounded-xl text-white">
                                    <p className="text-[10px] font-bold opacity-80 uppercase tracking-widest leading-none mb-0.5">From</p>
                                    <p className="text-lg font-black leading-none">৳{exp.price.toLocaleString()}</p>
                                </div>
                            </div>
                        </div>

                        {/* Content */}
                        <div className="p-5">
                            <div className="flex items-center gap-1.5 mb-2">
                                <div className="flex items-center gap-1 text-amber-500">
                                    <Star className="w-3.5 h-3.5 fill-current" />
                                    <span className="text-xs font-black text-slate-900">{exp.rating}</span>
                                </div>
                                <span className="text-slate-300">•</span>
                                <span className="text-[11px] font-bold text-slate-400 uppercase">{exp.city}</span>
                            </div>

                            <h3 className="font-black text-slate-900 group-hover:text-[#FF385C] transition-colors line-clamp-2 leading-tight mb-3">
                                {exp.title}
                            </h3>

                            <div className="flex items-center gap-3 pt-3 border-t border-slate-50">
                                <div className="flex items-center gap-1.5 text-slate-500 text-[11px] font-bold">
                                    <Clock className="w-3.5 h-3.5" /> {exp.duration || "2-3 hours"}
                                </div>
                                <div className="flex items-center gap-1.5 text-slate-500 text-[11px] font-bold">
                                    <MapPin className="w-3.5 h-3.5" /> {exp.location.split(',')[0]}
                                </div>
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>
        </section>
    );
};

export default ExperiencesAISection;
