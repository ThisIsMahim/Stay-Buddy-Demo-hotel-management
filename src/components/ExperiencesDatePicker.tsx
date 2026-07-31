import { useState } from "react";
import { ChevronLeft, ChevronRight, Calendar } from "lucide-react";

interface ExperiencesDatePickerProps {
    isOpen: boolean;
    onClose: () => void;
}

const ExperiencesDatePicker = ({ isOpen, onClose }: ExperiencesDatePickerProps) => {
    const [selectedTab, setSelectedTab] = useState("Dates");
    const [selectedFlexibility, setSelectedFlexibility] = useState("Exact dates");
    const [numMonths, setNumMonths] = useState(3);
    const [stayDuration, setStayDuration] = useState("Weekend");
    const [selectedMonths, setSelectedMonths] = useState<string[]>(["May 2026"]);

    if (!isOpen) return null;

    const daysOfWeek = ["S", "M", "T", "W", "T", "F", "S"];

    const getDays = (year: number, month: number) => {
        const firstDay = new Date(year, month, 1).getDay();
        const daysInMonth = new Date(year, month + 1, 0).getDate();
        const days = [];
        for (let i = 0; i < firstDay; i++) {
            days.push(null);
        }
        for (let i = 1; i <= daysInMonth; i++) {
            days.push(i);
        }
        return days;
    };

    const janDays = getDays(2026, 0);
    const febDays = getDays(2026, 1);

    const flexibleOptions = [
        "Exact dates",
        "± 1 day",
        "± 2 days",
        "± 3 days",
        "± 7 days",
        "± 14 days",
    ];

    const monthsList = [
        "January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"
    ];

    const toggleMonth = (month: string) => {
        if (selectedMonths.includes(month)) {
            setSelectedMonths(selectedMonths.filter(m => m !== month));
        } else {
            setSelectedMonths([...selectedMonths, month]);
        }
    };

    return (
        <div
            className="fixed inset-0 z-[110] flex items-center justify-center bg-transparent pt-20"
            onClick={onClose}
        >
            <div className="absolute inset-0 bg-transparent" onClick={onClose} />

            <div
                className="bg-white rounded-[32px] shadow-[0_0_20px_rgba(0,0,0,0.08),0_0_40px_rgba(0,0,0,0.06)] w-[850px] max-w-[95vw] p-8 pb-10 relative animate-in fade-in zoom-in-95 duration-200 border border-neutral-100"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Tabs */}
                <div className="flex justify-center mb-10">
                    <div className="bg-[#EBEBEB] p-1 rounded-full flex gap-1">
                        {["Dates", "Months", "Flexible"].map((tab) => (
                            <button
                                key={tab}
                                onClick={() => setSelectedTab(tab)}
                                className={`px-8 py-2.5 rounded-full text-sm font-semibold transition-all ${selectedTab === tab
                                        ? "bg-white text-black shadow-[0_1px_4px_rgba(0,0,0,0.12)]"
                                        : "text-[#484848] hover:bg-gray-200/50"
                                    }`}
                            >
                                {tab}
                            </button>
                        ))}
                    </div>
                </div>

                {selectedTab === "Dates" && (
                    <div className="relative px-4">
                        <div className="flex gap-12">
                            <div className="flex-1">
                                <div className="flex justify-between items-center mb-8">
                                    <button className="p-2 hover:bg-neutral-100 rounded-full transition-colors">
                                        <ChevronLeft className="w-5 h-5 text-neutral-300" />
                                    </button>
                                    <h3 className="text-base font-semibold text-[#222222]">January 2026</h3>
                                    <div className="w-9" />
                                </div>
                                <div className="grid grid-cols-7 gap-y-6 mb-2">
                                    {daysOfWeek.map((d, i) => (
                                        <div key={i} className="text-center text-[12px] font-bold text-[#717171]">{d}</div>
                                    ))}
                                </div>
                                <div className="grid grid-cols-7 gap-y-1">
                                    {janDays.map((day, i) => (
                                        <div key={i} className="aspect-square flex items-center justify-center relative">
                                            {day && (
                                                <button
                                                    className={`w-10 h-10 flex items-center justify-center text-[14px] font-semibold rounded-full transition-all ${day < 23 ? "text-neutral-300 cursor-default" : "text-[#222222] hover:border hover:border-[#222222]"}`}
                                                    disabled={day < 23}
                                                >
                                                    {day}
                                                </button>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="flex-1">
                                <div className="flex justify-between items-center mb-8">
                                    <div className="w-9" />
                                    <h3 className="text-base font-semibold text-[#222222]">February 2026</h3>
                                    <button className="p-2 hover:bg-neutral-100 rounded-full transition-colors">
                                        <ChevronRight className="w-5 h-5 text-[#222222]" />
                                    </button>
                                </div>
                                <div className="grid grid-cols-7 gap-y-6 mb-2">
                                    {daysOfWeek.map((d, i) => (
                                        <div key={i} className="text-center text-[12px] font-bold text-[#717171]">{d}</div>
                                    ))}
                                </div>
                                <div className="grid grid-cols-7 gap-y-1">
                                    {febDays.map((day, i) => (
                                        <div key={i} className="aspect-square flex items-center justify-center relative">
                                            {day && (
                                                <button className="w-10 h-10 flex items-center justify-center text-[14px] font-semibold text-[#222222] rounded-full hover:border hover:border-[#222222] transition-all">
                                                    {day}
                                                </button>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        <div className="flex gap-2.5 mt-8 px-4 overflow-x-auto no-scrollbar scroll-smooth">
                            {flexibleOptions.map((option) => (
                                <button
                                    key={option}
                                    onClick={() => setSelectedFlexibility(option)}
                                    className={`px-4 py-2 rounded-full border text-[13px] font-semibold whitespace-nowrap transition-all ${selectedFlexibility === option ? "border-[#222222] bg-white ring-1 ring-[#222222]" : "border-[#DDDDDD] text-[#222222] hover:border-[#222222]"}`}
                                >
                                    {option}
                                </button>
                            ))}
                        </div>
                    </div>
                )}

                {selectedTab === "Months" && (
                    <div className="flex flex-col items-center py-4">
                        <h2 className="text-2xl font-semibold mb-10 text-[#222222]">When's your trip?</h2>

                        <div className="relative w-72 h-72 mb-12 flex items-center justify-center">
                            <div className="absolute inset-0 rounded-full border-[1.5px] border-[#EBEBEB] shadow-[0_4px_24px_rgba(0,0,0,0.06)]" />

                            {[...Array(12)].map((_, i) => {
                                const angle = (i * 30) - 90;
                                return (
                                    <div
                                        key={i}
                                        className="absolute w-1 h-1 bg-gray-400 rounded-full"
                                        style={{
                                            transform: `rotate(${angle}deg) translate(144px) rotate(-${angle}deg)`
                                        }}
                                    />
                                );
                            })}

                            <svg className="absolute inset-0 w-full h-full -rotate-90 pointer-events-none">
                                <circle
                                    cx="144"
                                    cy="144"
                                    r="144"
                                    fill="transparent"
                                    stroke="url(#gradient)"
                                    strokeWidth="48"
                                    strokeDasharray={2 * Math.PI * 144}
                                    strokeDashoffset={2 * Math.PI * 144 * (1 - (numMonths / 12))}
                                    strokeLinecap="round"
                                    className="transition-all duration-300 ease-out"
                                />
                                <defs>
                                    <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                                        <stop offset="0%" stopColor="#FF385C" />
                                        <stop offset="100%" stopColor="#D70466" />
                                    </linearGradient>
                                </defs>
                            </svg>

                            <div className="z-10 bg-white w-40 h-40 rounded-full shadow-[0_8px_32px_rgba(0,0,0,0.12)] border border-gray-100 flex flex-col items-center justify-center">
                                <span className="text-7xl font-bold text-[#222222]">{numMonths}</span>
                                <span className="text-sm font-semibold text-[#222222] mt-1">months</span>
                            </div>

                            <input
                                type="range"
                                min="1"
                                max="12"
                                value={numMonths}
                                onChange={(e) => setNumMonths(parseInt(e.target.value))}
                                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-20"
                            />

                            <div
                                className="absolute w-10 h-10 bg-white rounded-full shadow-[0_4px_12px_rgba(0,0,0,0.15)] border border-gray-100 z-10 pointer-events-none"
                                style={{
                                    transform: `rotate(${(numMonths * 30) - 90}deg) translate(144px) rotate(-${(numMonths * 30) - 90}deg)`
                                }}
                            />
                        </div>

                        <div className="flex items-center gap-2 text-base font-semibold text-[#222222]">
                            <span className="border-b-2 border-black pb-0.5">Sun, Feb 1</span>
                            <span className="text-gray-500 font-normal">to</span>
                            <span className="border-b-2 border-black pb-0.5">
                                {new Intl.DateTimeFormat('en-US', { weekday: 'short', month: 'short', day: 'numeric' }).format(new Date(2026, 1 + numMonths - 1, 1))}
                            </span>
                        </div>
                    </div>
                )}

                {selectedTab === "Flexible" && (
                    <div className="flex flex-col items-center py-4 overflow-hidden w-full">
                        <h2 className="text-[22px] font-semibold mb-6 text-[#222222]">How long we would you like to stay?</h2>

                        <div className="flex gap-3 mb-12">
                            {["Weekend", "Week", "Month"].map((duration) => (
                                <button
                                    key={duration}
                                    onClick={() => setStayDuration(duration)}
                                    className={`px-8 py-2.5 rounded-full border text-base font-semibold transition-all ${stayDuration === duration
                                            ? "border-[#222222] bg-white ring-1 ring-[#222222]"
                                            : "border-[#DDDDDD] text-[#222222] hover:border-[#222222]"
                                        }`}
                                >
                                    {duration}
                                </button>
                            ))}
                        </div>

                        <h3 className="text-[22px] font-semibold mb-8 text-[#222222]">Go anytime</h3>

                        <div className="relative w-full overflow-hidden">
                            <div className="flex gap-4 overflow-x-auto no-scrollbar scroll-smooth px-8 pb-4">
                                {monthsList.map((month) => {
                                    const fullMonth = `${month} 2026`;
                                    const isSelected = selectedMonths.includes(fullMonth);
                                    return (
                                        <button
                                            key={month}
                                            onClick={() => toggleMonth(fullMonth)}
                                            className={`flex-shrink-0 w-[122px] h-[132px] rounded-[16px] border flex flex-col items-center justify-center transition-all ${isSelected
                                                    ? "border-[#222222] bg-[#F7F7F7] ring-1 ring-[#222222]"
                                                    : "border-[#DDDDDD] bg-white hover:border-[#222222]"
                                                }`}
                                        >
                                            <Calendar className={`w-8 h-8 mb-2 ${isSelected ? 'text-[#222222]' : 'text-[#717171]'} stroke-[1.5px]`} />
                                            <div className="text-[14px] font-semibold text-[#222222]">{month}</div>
                                            <div className="text-[12px] text-[#717171]">2026</div>
                                        </button>
                                    );
                                })}
                            </div>

                            <button className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 bg-white rounded-full border border-gray-200 shadow-md flex items-center justify-center hover:scale-105 transition-transform">
                                <ChevronRight className="w-4 h-4 text-black" />
                            </button>
                        </div>
                    </div>
                )}
            </div>

            <style>{`
                .no-scrollbar::-webkit-scrollbar { display: none; }
                .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
            `}</style>
        </div>
    );
};

export default ExperiencesDatePicker;
