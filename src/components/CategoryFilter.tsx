import { useState, useRef } from "react";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight, Home, Waves, Mountain, TreePine, Building2, Tent, Castle, Sailboat, UtensilsCrossed, Palmtree, Snowflake, Flame } from "lucide-react";

const categories = [
  { id: "icons", label: "Icons", icon: Home },
  { id: "beachfront", label: "Beachfront", icon: Waves },
  { id: "mountains", label: "Mountains", icon: Mountain },
  { id: "cabins", label: "Cabins", icon: TreePine },
  { id: "cities", label: "Cities", icon: Building2 },
  { id: "camping", label: "Camping", icon: Tent },
  { id: "castles", label: "Castles", icon: Castle },
  { id: "boats", label: "Boats", icon: Sailboat },
  { id: "chefs", label: "Chef's Kitchen", icon: UtensilsCrossed },
  { id: "tropical", label: "Tropical", icon: Palmtree },
  { id: "arctic", label: "Arctic", icon: Snowflake },
  { id: "trending", label: "Trending", icon: Flame },
];

const CategoryFilter = () => {
  const [activeCategory, setActiveCategory] = useState("icons");
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: "left" | "right") => {
    if (scrollRef.current) {
      const scrollAmount = 300;
      scrollRef.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
    }
  };

  return (
    <div className="sticky top-[73px] z-40 bg-background border-b border-border">
      <div className="container mx-auto px-6 py-4">
        <div className="relative flex items-center gap-4">
          {/* Left Arrow */}
          <button
            onClick={() => scroll("left")}
            className="absolute left-0 z-10 p-1.5 rounded-full border border-border bg-background hover:shadow-card transition-shadow hidden md:flex"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>

          {/* Categories */}
          <div
            ref={scrollRef}
            className="flex gap-8 overflow-x-auto scrollbar-hide px-8 md:px-12"
            style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
          >
            {categories.map((category, index) => {
              const Icon = category.icon;
              const isActive = activeCategory === category.id;
              
              return (
                <motion.button
                  key={category.id}
                  onClick={() => setActiveCategory(category.id)}
                  className={`category-pill flex-shrink-0 ${isActive ? "active" : ""}`}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Icon className={`h-6 w-6 ${isActive ? "text-foreground" : "text-muted-foreground"}`} />
                  <span className={`text-xs whitespace-nowrap ${isActive ? "text-foreground font-medium" : "text-muted-foreground"}`}>
                    {category.label}
                  </span>
                </motion.button>
              );
            })}
          </div>

          {/* Right Arrow */}
          <button
            onClick={() => scroll("right")}
            className="absolute right-0 z-10 p-1.5 rounded-full border border-border bg-background hover:shadow-card transition-shadow hidden md:flex"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default CategoryFilter;
