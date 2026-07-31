import { useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import DestinationCard from "./DestinationCard";

interface Listing {
  id: number;
  images: string[];
  title: string;
  price: number;
  originalPrice?: number;
  rating: number;
  isGuestFavorite?: boolean;
}

interface DestinationSectionProps {
  title: string;
  listings: Listing[];
}

const DestinationSection = ({ title, listings }: DestinationSectionProps) => {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: "left" | "right") => {
    if (scrollRef.current) {
      const scrollAmount = 240;
      scrollRef.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
    }
  };

  return (
    <div className="mb-8">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-[22px] font-bold text-foreground">
          {title}
        </h2>
        <div className="flex items-center gap-4">
          <a href="#" className="text-sm font-medium underline underline-offset-2 hover:no-underline hidden md:block">
            Show all ({listings.length})
          </a>
          <div className="hidden sm:flex items-center gap-2">
            <button
              onClick={() => scroll("left")}
              className="p-2 rounded-full border border-gray-300 hover:shadow-md transition-shadow disabled:opacity-50 bg-white"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={() => scroll("right")}
              className="p-2 rounded-full border border-gray-300 hover:shadow-md transition-shadow bg-white"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      <div
        ref={scrollRef}
        className="flex gap-4 overflow-x-auto scrollbar-hide pb-2 -mx-2 px-2"
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
      >
        {listings.map((listing) => (
          <DestinationCard
            key={listing.id}
            images={listing.images}
            title={listing.title}
            price={listing.price}
            originalPrice={listing.originalPrice}
            rating={listing.rating}
            isGuestFavorite={listing.isGuestFavorite}
          />
        ))}
      </div>
    </div>
  );
};

export default DestinationSection;
