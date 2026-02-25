'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Languages, ChevronDown, Check } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import { LANGUAGES } from '@/lib/translations';

export default function LanguageSwitcher({ dark }: { dark: boolean }) {
    const [isOpen, setIsOpen] = useState(false);
    const { language, setLanguage, currentLanguageName } = useLanguage();
    const dropdownRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const t = {
        button: dark
            ? 'bg-[#2e2f42] text-gray-300 hover:bg-[#3a3b50] border-[#3a3b50]'
            : 'bg-gray-100 text-gray-700 hover:bg-gray-200 border-transparent',
        dropdown: dark
            ? 'bg-[#252636] border-[#33344a] shadow-2xl'
            : 'bg-white border-gray-200 shadow-xl',
        item: dark
            ? 'hover:bg-[#2e2f42] text-gray-300'
            : 'hover:bg-gray-50 text-gray-700',
        activeItem: dark
            ? 'bg-green-900/40 text-green-400'
            : 'bg-green-50 text-green-700',
        nativeName: dark ? 'text-gray-400' : 'text-gray-500'
    };

    return (
        <div className="relative" ref={dropdownRef}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border transition-all text-sm font-medium ${t.button}`}
            >
                <Languages className="w-4 h-4" />
                <span className="hidden sm:inline">{currentLanguageName}</span>
                <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
            </button>

            {isOpen && (
                <div className={`absolute right-0 mt-2 w-56 rounded-xl border z-[100] overflow-hidden py-1.5 ${t.dropdown}`}>
                    <div className="px-3 py-1.5 mb-1 border-b border-inherit">
                        <span className={`text-[10px] font-bold uppercase tracking-widest ${dark ? 'text-gray-500' : 'text-gray-400'}`}>
                            Select Language
                        </span>
                    </div>
                    <div className="max-h-[300px] overflow-y-auto custom-scrollbar">
                        {LANGUAGES.map((lang) => (
                            <button
                                key={lang.code}
                                onClick={() => {
                                    setLanguage(lang.code);
                                    setIsOpen(false);
                                }}
                                className={`w-full flex items-center justify-between px-3 py-2.5 text-sm transition-colors ${language === lang.code ? t.activeItem : t.item
                                    }`}
                            >
                                <div className="flex flex-col items-start">
                                    <span className="font-bold">{lang.nativeName}</span>
                                    <span className={`text-[10px] ${t.nativeName}`}>{lang.name}</span>
                                </div>
                                {language === lang.code && <Check className="w-4 h-4 text-green-500" />}
                            </button>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}
