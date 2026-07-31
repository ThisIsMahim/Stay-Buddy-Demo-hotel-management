import { useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { Home, Balloon, ConciergeBell } from "lucide-react";
import clsx from "clsx";
import { useAuth } from "../hooks/useAuth";

const options = [
  {
    type: "home",
    label: "Home",
    icon: <Home className="w-8 h-8" />,
  },
  {
    type: "experience",
    label: "Experience",
    icon: <Balloon className="w-8 h-8" />,
  },
  {
    type: "service",
    label: "Service",
    icon: <ConciergeBell className="w-8 h-8" />,
  },
];

export default function ListingTypeSelection() {
  const [selectedType, setSelectedType] = useState<string | null>(null);
  const router = useRouter();
  const pathname = typeof window !== 'undefined' ? window.location.pathname : '';
  useAuth(pathname);

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-white z-50">
      <div className="w-full max-w-xl mx-auto p-6 flex flex-col min-h-[80vh]">
        <h2 className="text-2xl font-bold text-center mb-8">What would you like to host?</h2>
        <div className="flex flex-1 items-center justify-center gap-6">
          {options.map((opt) => (
            <button
              type="button"
              key={opt.type}
              onClick={() => setSelectedType(opt.type)}
              className={clsx(
                "flex flex-col items-center p-6 rounded-2xl transition-all cursor-pointer border-2 bg-white",
                selectedType === opt.type
                  ? "border-black shadow-lg"
                  : "border-gray-200 hover:shadow-md"
              )}
              style={{ minWidth: 140 }}
            >
              {opt.icon}
              <span className="mt-3 font-medium text-lg">{opt.label}</span>
            </button>
          ))}
        </div>
        <div className="sticky bottom-0 left-0 w-full flex justify-end mt-auto pt-8 bg-white">
          <button
            className={clsx(
              "px-8 py-3 rounded-full font-semibold text-white transition-all",
              selectedType
                ? "bg-black hover:bg-neutral-800 cursor-pointer"
                : "bg-gray-300 cursor-not-allowed"
            )}
            disabled={!selectedType}
            onClick={() => {
              if (!selectedType) return;
              if (selectedType === "home") router.push("/become-a-host/property-info");
              if (selectedType === "experience") router.push("/become-a-host/experience-info");
              if (selectedType === "service") router.push("/become-a-host/service-info");
            }}
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}
