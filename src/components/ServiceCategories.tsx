import { Camera, ChefHat, Hand, Utensils, Dumbbell, Sparkles, Scissors, Cake, Soup } from "lucide-react";

const categories = [
    { icon: Camera, label: "Photography" },
    { icon: ChefHat, label: "Chefs" },
    { icon: Hand, label: "Massage" },
    { icon: Utensils, label: "Prepared meals" },
    { icon: Dumbbell, label: "Training" },
    { icon: Sparkles, label: "Makeup" },
    { icon: Scissors, label: "Hair" },
    { icon: Soup, label: "Spa treatments" },
    { icon: Cake, label: "Catering" },
    { icon: Sparkles, label: "Nails" },
];

const ServiceCategories = () => {
    return (
        <div className="py-8 px-6 sm:px-12 border-b">
            <div className="max-w-7xl mx-auto">
                <div className="flex flex-wrap gap-3">
                    {categories.map((category, idx) => {
                        const Icon = category.icon;
                        return (
                            <button
                                key={idx}
                                className="flex items-center gap-2 px-5 py-3 border border-gray-300 rounded-full hover:border-gray-900 transition-all hover:shadow-sm bg-white"
                            >
                                <Icon className="w-5 h-5" />
                                <span className="text-sm font-medium">{category.label}</span>
                            </button>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};

export default ServiceCategories;
