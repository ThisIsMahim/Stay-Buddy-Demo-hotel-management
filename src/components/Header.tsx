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
            <div className="relative w-12 h-12 md:w-14 md:h-14 bg-gradient-to-tr from-emerald-500/10 via-amber-50 to-blue-500/10 p-1 rounded-2xl shadow-sm border border-slate-200/80 group-hover:shadow-md transition-all group-hover:scale-105 duration-300 flex items-center justify-center">
              <img src="/Logo.png" alt="StayBD" className="w-full h-full object-contain rounded-xl" />
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-emerald-500 border-2 border-white rounded-full ring-2 ring-emerald-500/20" title="National Verified Platform" />
            </div>
            <div className="flex flex-col">
              <div className="flex items-center gap-2">
                <span className="text-[19px] md:text-[22px] font-black text-slate-900 tracking-tight leading-none">
                  STAY<span className="text-emerald-600">BD</span>
                </span>
                <span className="hidden lg:inline-flex items-center gap-1 text-[9px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200/80 px-2 py-0.5 rounded-full uppercase tracking-wider">
                  {t("National Platform")}
                </span>
              </div>
              <span className="text-[9px] md:text-[10px] font-bold text-slate-500 tracking-wider uppercase mt-1">
                {t("Stay Smart. Book Easy.")}
              </span>
            </div>
          </Link>

          {/* Center Navigation */}
          <nav className="flex items-center gap-1">
            {navItems.map((item) => (
              <button
                key={item.key}
                onClick={() => navigate(item.path)}
                className={`px-3.5 py-2 text-[14px] font-medium rounded-full transition-all duration-200 ${activeTab === item.key
                  ? "text-gray-900 bg-gray-100 shadow-sm"
                  : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                  }`}
              >
                {t(item.key)}
              </button>
            ))}
            <Link
              to="/tourism-map"
              className="px-3.5 py-2 text-[14px] font-medium text-slate-700 hover:text-emerald-700 hover:bg-emerald-50/70 rounded-full transition-all duration-200 flex items-center gap-1.5"
            >
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              {t("Tourism Map")}
            </Link>
            <Link
              to="/national-initiative"
              className="px-3.5 py-2 text-[13px] font-semibold text-blue-700 bg-blue-50/80 hover:bg-blue-100/80 border border-blue-200/60 rounded-full transition-all duration-200 shadow-xs"
            >
              {t("Govt Initiative")}
            </Link>
            <Link
              to="/become-a-host"
              className="px-3.5 py-2 text-[13px] font-medium text-amber-700 hover:text-amber-800 hover:bg-amber-50 rounded-full transition-all duration-200"
            >
              {t("Partner Hotel")}
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
              <div className="w-9 h-9 p-1 rounded-xl bg-gradient-to-tr from-emerald-500/10 to-amber-50 border border-slate-200 flex items-center justify-center">
                <img src="/Logo.png" alt="StayBD" className="w-full h-full object-contain rounded-lg" />
              </div>
              <div className="flex flex-col">
                <span className="text-[17px] font-black text-slate-900 tracking-tight leading-none">
                  STAY<span className="text-emerald-600">BD</span>
                </span>
                <span className="text-[8px] font-bold text-slate-500 uppercase tracking-widest">{t("National Platform")}</span>
              </div>
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
