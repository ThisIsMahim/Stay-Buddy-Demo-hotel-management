import { useState, useRef, useEffect } from "react";
import { Minus, Plus } from "lucide-react";

interface GuestSelectorProps {
    isOpen: boolean;
    onClose: () => void;
    anchorEl?: HTMLElement | null;
}

const GuestSelector = ({ isOpen, onClose, anchorEl }: GuestSelectorProps) => {
    const [adults, setAdults] = useState(1);
    const [children, setChildren] = useState(0);
    const [infants, setInfants] = useState(0);
    const [pets, setPets] = useState(0);
    const popoverRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (
                popoverRef.current &&
                !popoverRef.current.contains(event.target as Node) &&
                anchorEl &&
                !anchorEl.contains(event.target as Node)
            ) {
                onClose();
            }
        };

        if (isOpen) {
            document.addEventListener("mousedown", handleClickOutside);
        }

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [isOpen, onClose, anchorEl]);

    if (!isOpen) return null;

    const guestCategories = [
        {
            title: "Adults",
            subtitle: "Ages 13 or above",
            value: adults,
            setValue: setAdults,
            min: 1,
        },
        {
            title: "Children",
            subtitle: "Ages 2 – 12",
            value: children,
            setValue: setChildren,
            min: 0,
        },
        {
            title: "Infants",
            subtitle: "Under 2",
            value: infants,
            setValue: setInfants,
            min: 0,
        },
        {
            title: "Pets",
            subtitle: "Bringing a service animal?",
            value: pets,
            setValue: setPets,
            min: 0,
            isLink: true,
        },
    ];

    return (
        <div
            ref={popoverRef}
            className="absolute top-full right-0 mt-2 w-[400px] bg-white rounded-2xl shadow-[0_6px_20px_rgba(0,0,0,0.2)] border border-gray-100 z-50 animate-in fade-in slide-in-from-top-2 duration-200"
        >
            <div className="p-6 space-y-6">
                {guestCategories.map((category, idx) => (
                    <div key={idx}>
                        <div className="flex items-center justify-between py-3">
                            <div className="flex-1">
                                <div className="font-medium text-base text-gray-900">
                                    {category.title}
                                </div>
                                <div className="text-sm text-gray-500 mt-0.5">
                                    {category.isLink ? (
                                        <a href="#" className="underline hover:text-gray-700">
                                            {category.subtitle}
                                        </a>
                                    ) : (
                                        category.subtitle
                                    )}
                                </div>
                            </div>

                            <div className="flex items-center gap-4">
                                <button
                                    onClick={() => {
                                        if (category.value > category.min) {
                                            category.setValue(category.value - 1);
                                        }
                                    }}
                                    disabled={category.value <= category.min}
                                    className={`w-8 h-8 rounded-full border flex items-center justify-center transition-all ${category.value <= category.min
                                            ? "border-gray-200 text-gray-300 cursor-not-allowed"
                                            : "border-gray-400 text-gray-700 hover:border-gray-900 hover:text-gray-900"
                                        }`}
                                >
                                    <Minus className="w-4 h-4" strokeWidth={2} />
                                </button>

                                <span className="w-8 text-center font-normal text-gray-900">
                                    {category.value}
                                </span>

                                <button
                                    onClick={() => category.setValue(category.value + 1)}
                                    className="w-8 h-8 rounded-full border border-gray-400 text-gray-700 hover:border-gray-900 hover:text-gray-900 flex items-center justify-center transition-all"
                                >
                                    <Plus className="w-4 h-4" strokeWidth={2} />
                                </button>
                            </div>
                        </div>
                        {idx < guestCategories.length - 1 && (
                            <div className="border-b border-gray-200" />
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default GuestSelector;
