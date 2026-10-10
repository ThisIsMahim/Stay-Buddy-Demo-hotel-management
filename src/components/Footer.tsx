import { motion } from "framer-motion";
import { Facebook, Twitter, Instagram, Globe } from "lucide-react";
import logoImg from '../assets/download.png';
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";

const footerSections = [
  {
    title: "Support",
    links: [
      { text: "Help Center", href: "/help" },
      { text: "AirCover", href: "/aircover" },
      { text: "Safety information", href: "/safety-help" },
      { text: "Cancellation options", href: "#" },
    ],
  },
  {
    title: "Hosting",
    links: [
      { text: "List your hotel", href: "/become-a-host" },
      { text: "Owner Dashboard", href: "/owner" },
      { text: "Hosting resources", href: "#" },
    ],
  },
  {
    title: "Explore",
    links: [
      { text: "All Hotels", href: "/hotels" },
      { text: "Experiences", href: "/experiences" },
      { text: "Services", href: "/services" },
    ],
  },
  {
    title: "StayBD Platform",
    links: [
      { text: "National Initiative", href: "/national-initiative" },
      { text: "Tourism Map", href: "/tourism-map" },
      { text: "About Us", href: "/help" },
    ],
  },
];


const Footer = () => {
  const { t } = useTranslation();
  return (
    <footer className="bg-white border-t border-gray-200 mt-12 pb-24 md:pb-0">
      <div className="max-w-7xl mx-auto px-6 py-12">
        <motion.div
          className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-10 md:gap-8 pb-10"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          {/* Brand Column */}
          <div>
            <Link to="/" className="flex items-center gap-3 mb-4 group">
              <div className="w-11 h-11 p-1 rounded-2xl bg-gradient-to-tr from-emerald-500/10 via-amber-50 to-blue-500/10 border border-slate-200 flex items-center justify-center">
                <img src="/Logo.png" alt="StayBD" className="w-full h-full object-contain rounded-xl shadow-xs" />
              </div>
              <div className="flex flex-col">
                <span className="text-xl font-black text-slate-900 tracking-tight leading-none">
                  STAY<span className="text-emerald-600">BD</span>
                </span>
                <span className="text-[9px] font-bold text-slate-500 uppercase tracking-wider mt-0.5">Stay Smart. Book Easy.</span>
              </div>
            </Link>
            <p className="text-xs text-gray-500 leading-relaxed mb-4">
              National Hotel Discovery & Booking Platform. Connecting citizens, verified hotels, and tourism hubs nationwide.
            </p>
            <div className="text-[11px] font-medium text-emerald-800 bg-emerald-50 border border-emerald-200 px-3 py-1.5 rounded-xl mb-5">
              Aligned with Civil Aviation & Tourism + BPC
            </div>
            <div className="flex items-center gap-3">
              <a href="#" className="w-9 h-9 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors">
                <Facebook className="w-4 h-4 text-gray-600" />
              </a>
              <a href="#" className="w-9 h-9 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors">
                <Twitter className="w-4 h-4 text-gray-600" />
              </a>
              <a href="#" className="w-9 h-9 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors">
                <Instagram className="w-4 h-4 text-gray-600" />
              </a>
            </div>
          </div>

          {/* Link Columns */}
          {footerSections.map((section) => (
            <div key={section.title}>
              <h3 className="font-bold text-gray-900 mb-4 text-sm uppercase tracking-wider">{t(section.title)}</h3>
              <ul className="space-y-2.5">
                {section.links.map((link) => (
                  <li key={link.text}>
                    <a
                      href={link.href}
                      className="text-[14px] text-gray-500 hover:text-gray-900 transition-colors"
                    >
                      {t(link.text)}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </motion.div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-100 pt-8 mt-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6 md:gap-4 text-center md:text-left">
            <div className="flex flex-col md:flex-row items-center gap-2 md:gap-4 text-[13px] text-gray-400 font-medium">
              <span>© 2026 StayBD National Platform. All rights reserved.</span>
              <div className="flex items-center gap-3">
                <a href="#" className="hover:text-gray-900 transition-colors">Privacy</a>
                <span>·</span>
                <a href="#" className="hover:text-gray-900 transition-colors">Terms</a>
                <span>·</span>
                <a href="#" className="hover:text-gray-900 transition-colors">Sitemap</a>
              </div>
            </div>

            <div className="flex items-center gap-5">
              <button className="flex items-center gap-1.5 text-[13px] font-bold text-gray-600 hover:text-gray-900 transition-colors">
                <Globe className="w-4 h-4" />
                <span>English (US)</span>
              </button>
              <span className="text-gray-200 hidden md:inline">|</span>
              <button className="text-[13px] font-bold text-gray-600 hover:text-gray-900 transition-colors">৳ BDT</button>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
