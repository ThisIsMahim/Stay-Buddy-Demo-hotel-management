import { Home, Briefcase, Heart, Compass, UserCircle } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { useUser } from "@clerk/react";

const MobileBottomNav = () => {
  const location = useLocation();
  const { isSignedIn } = useUser();

  const navItems = [
    { path: "/", id: "home", label: "Home", icon: Home },
    { path: "/wishlist", id: "wishlists", label: "Wishlists", icon: Heart },
    { path: "/experiences", id: "experiences", label: "Experiences", icon: Compass },
    { path: isSignedIn ? "/dashboard" : "/login", id: "profile", label: "Profile", icon: UserCircle },
  ];

  const isActive = (path: string, id: string) => {
    if (id === "profile") {
      return location.pathname === "/dashboard" || location.pathname === "/login";
    }
    return location.pathname === path;
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 py-2 px-3 md:hidden z-50 shadow-[0_-2px_10px_rgba(0,0,0,0.08)]">
      <div className="flex justify-between items-center max-w-md mx-auto">
        {navItems.map(({ path, id, label, icon: Icon }) => (
          <Link key={id} to={path} className="flex flex-col items-center gap-1 group flex-1">
            <div className={`p-1.5 rounded-full transition ${isActive(path, id) ? "bg-rose-50" : "group-hover:bg-gray-100"}`}>
              <Icon
                className={`w-5 h-5 ${isActive(path, id) ? "text-[#FF385C]" : "text-gray-500 group-hover:text-gray-700"}`}
                strokeWidth={isActive(path, id) ? 2.5 : 2}
              />
            </div>
            <span className={`text-[10px] font-medium transition-colors ${isActive(path, id) ? "text-[#FF385C]" : "text-gray-400"}`}>
              {label}
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default MobileBottomNav;
