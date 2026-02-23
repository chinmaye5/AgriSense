'use client';

import { useState, useEffect } from 'react';

const STORAGE_KEY = 'agrisense-theme';

export function useTheme() {
    const [dark, setDark] = useState(false);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
        const saved = localStorage.getItem(STORAGE_KEY);
        if (saved === 'dark') setDark(true);

        // Listen for changes from other tabs/pages
        const handleStorage = (e: StorageEvent) => {
            if (e.key === STORAGE_KEY) {
                setDark(e.newValue === 'dark');
            }
        };
        window.addEventListener('storage', handleStorage);
        return () => window.removeEventListener('storage', handleStorage);
    }, []);

    const toggleTheme = () => {
        setDark(prev => {
            const next = !prev;
            localStorage.setItem(STORAGE_KEY, next ? 'dark' : 'light');
            // Dispatch a custom event so other components on the same page can react
            window.dispatchEvent(new Event('theme-change'));
            return next;
        });
    };

    return { dark, toggleTheme, mounted };
}
