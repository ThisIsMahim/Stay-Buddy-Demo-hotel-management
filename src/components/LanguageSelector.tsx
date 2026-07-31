import { useState, useRef, useEffect } from "react";
import { Globe, Check } from "lucide-react";
import { useTranslation } from "react-i18next";

interface LanguageSelectorProps {
    className?: string;
}

const languages = [
    { code: "en", name: "English", nativeName: "English" },
    { code: "bn", name: "Bangla", nativeName: "বাংলা" },
];

const LanguageSelector = ({ className = "" }: LanguageSelectorProps) => {
    const { i18n, t } = useTranslation();
    const [isOpen, setIsOpen] = useState(false);
    const [selectedLanguage, setSelectedLanguage] = useState(i18n.language || "en");
    const dropdownRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (i18n.language) {
            setSelectedLanguage(i18n.language.split('-')[0]); // Handle cases like en-US -> en
        }
    }, [i18n.language]);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };

        if (isOpen) {
            document.addEventListener("mousedown", handleClickOutside);
        }

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [isOpen]);

    const handleLanguageSelect = (code: string) => {
        setSelectedLanguage(code);
        setIsOpen(false);
        i18n.changeLanguage(code);
    };

    return (
        <div className={`relative ${className}`} ref={dropdownRef}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                aria-label="Select language"
            >
                <Globe className="h-4 w-4" />
            </button>

            {isOpen && (
                <div className="absolute right-0 top-full mt-2 w-[280px] bg-white border border-gray-100 rounded-xl shadow-[0_6px_20px_rgba(0,0,0,0.2)] py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                    <div className="px-4 py-3 border-b border-gray-100">
                        <h3 className="font-semibold text-sm">{t("Choose a language")}</h3>
                    </div>

                    <div className="py-2">
                        {languages.map((lang) => (
                            <button
                                key={lang.code}
                                onClick={() => handleLanguageSelect(lang.code)}
                                className="w-full px-4 py-3 hover:bg-gray-50 transition-colors flex items-center justify-between group"
                            >
                                <div className="text-left">
                                    <div className="font-medium text-sm text-gray-900">
                                        {lang.nativeName}
                                    </div>
                                    <div className="text-xs text-gray-500">{lang.name}</div>
                                </div>
                                {selectedLanguage === lang.code && (
                                    <Check className="w-5 h-5 text-gray-900" strokeWidth={2.5} />
                                )}
                            </button>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default LanguageSelector;
