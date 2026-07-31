import { Search, Menu, X, Home, Tent, Building2, LayoutGrid } from "lucide-react";
import { Show, UserButton } from "@clerk/react";
import logoImg from '../assets/download.png';
import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Button } from "./ui/button";
import AuthModal from "./AuthModal";
import LanguageSelector from "./LanguageSelector";
import { useTranslation } from "react-i18next";

const Header = () => {
  const { t } = useTranslation();
  const location = useLocation();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  const getActiveTab = () => {
    if (location.pathname === "/experiences") return "Experiences";
    if (location.pathname === "/hotels") return "Hotels";
    return "Home";
  };

  const activeTab = getActiveTab();

  const navItems = [
    { key: "Home", path: "/", icon: Home },
    { key: "Hotels", path: "/hotels", icon: Building2 },
    { key: "Experiences", path: "/experiences", icon: Tent },
  ];

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-gray-100 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 md:px-6">
        {/* Desktop Header */}
        <div className="hidden md:flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 shrink-0 group">
            <div className="relative w-12 h-12 md:w-14 md:h-14 bg-gradient-to-tr from-amber-50 to-white p-1 rounded-full shadow-sm group-hover:shadow-md transition-all group-hover:scale-105 duration-500">
              <img src="/Logo.png" alt="RESERVATION BD" className="w-full h-full object-contain rounded-full" />
            </div>
            <div className="flex flex-col">
              <span className="text-[17px] md:text-[20px] font-black text-slate-900 tracking-tighter leading-none">RESERVATION BD</span>
              <span className="text-[8px] md:text-[10px] font-bold text-amber-600 tracking-[0.2em] uppercase mt-1 opacity-80">Your journey starts here</span>
            </div>
          </Link>

          {/* Center Navigation */}
          <nav className="flex items-center gap-1">
            {navItems.map((item) => (
              <button
                key={item.key}
                onClick={() => navigate(item.path)}
                className={`px-4 py-2 text-[14px] font-medium rounded-full transition-all duration-200 ${activeTab === item.key
                  ? "text-gray-900 bg-gray-100"
                  : "text-gray-500 hover:text-gray-900 hover:bg-gray-50"
                  }`}
              >
                {t(item.key)}
              </button>
            ))}
            <Link
              to="/become-a-host"
              className="px-4 py-2 text-[14px] font-medium text-amber-600 hover:text-amber-700 hover:bg-amber-50 rounded-full transition-all duration-200"
            >
              Become a Partner
            </Link>
          </nav>

          {/* Right Section */}
          <div className="flex items-center gap-3 shrink-0">
            <LanguageSelector />
            <Show when="signed-out">
              <Link to="/login">
                <Button className="bg-[#FF385C] hover:bg-[#E00B41] text-white rounded-full px-6 py-2 text-sm font-semibold transition-all hover:shadow-lg active:scale-95">
                  {t("Login")}
                </Button>
              </Link>
            </Show>
            <Show when="signed-in">
              <UserButton>
                <UserButton.MenuItems>
                  <UserButton.Link
                    label={t("Dashboard")}
                    labelIcon={<LayoutGrid className="w-4 h-4" />}
                    href="/dashboard"
                  />
                </UserButton.MenuItems>
              </UserButton>
            </Show>
          </div>
        </div>

        {/* Mobile Header */}
        <div className="md:hidden flex flex-col gap-3 py-3">
          {/* Top row: Logo + Menu */}
          <div className="flex items-center justify-between">
            <Link to="/" className="flex items-center gap-2">
              <div className="w-10 h-10 p-0.5 rounded-full bg-amber-50">
                <img src="/Logo.png" alt="RESERVATION BD" className="w-full h-full object-contain rounded-full" />
              </div>
              <span className="text-[16px] font-black text-slate-900 tracking-tighter leading-none">RESERVATION BD</span>
            </Link>
            <div className="flex items-center gap-2">
              <LanguageSelector />
              <Show when="signed-out">
                <Link to="/login">
                  <Button size="sm" className="bg-[#FF385C] hover:bg-[#E00B41] text-white rounded-full px-4 text-xs font-semibold">
                    {t("Login")}
                  </Button>
                </Link>
              </Show>
              <Show when="signed-in">
                <UserButton>
                  <UserButton.MenuItems>
                    <UserButton.Link
                      label={t("Dashboard")}
                      labelIcon={<LayoutGrid className="w-4 h-4" />}
                      href="/dashboard"
                    />
                  </UserButton.MenuItems>
                </UserButton>
              </Show>
            </div>
          </div>

          {/* Mobile Category Tabs */}
          <div className="flex items-center gap-1 overflow-x-auto scrollbar-hide -mx-1 px-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.key}
                  onClick={() => navigate(item.path)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-all ${activeTab === item.key
                    ? "bg-gray-900 text-white"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                    }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  {t(item.key)}
                </button>
              );
            })}
          </div>
        </div>
      </div>
      <AuthModal isOpen={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)} />
    </header>
  );
};

export default Header;
