'use client';

import { useUser, UserButton } from '@clerk/nextjs';
import { History, LogIn } from 'lucide-react';

interface AuthButtonsProps {
    dark: boolean;
}

export default function AuthButtons({ dark }: AuthButtonsProps) {
    const { isSignedIn, isLoaded } = useUser();

    if (!isLoaded) {
        return (
            <div className={`w-8 h-8 rounded-full animate-pulse ${dark ? 'bg-[#33344a]' : 'bg-gray-200'}`} />
        );
    }

    if (isSignedIn) {
        return (
            <>
                <a
                    href="/history"
                    className={`w-8 h-8 sm:w-auto sm:px-3 sm:py-1.5 rounded-lg flex items-center justify-center sm:gap-1.5 text-xs font-semibold transition-colors ${dark
                        ? 'text-gray-400 hover:text-green-400 hover:bg-[#2e2f42]'
                        : 'text-gray-500 hover:text-green-700 hover:bg-green-50'
                        }`}
                    title="History"
                >
                    <History className="w-4 h-4" />
                    <span className="hidden sm:inline">History</span>
                </a>
                <UserButton
                    appearance={{
                        elements: {
                            avatarBox: 'w-8 h-8',
                        },
                    }}
                />
            </>
        );
    }

    return (
        <a
            href="/sign-in"
            className="flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-lg text-xs font-bold hover:from-green-700 hover:to-emerald-700 transition-all shadow-sm"
        >
            <LogIn className="w-3.5 h-3.5" />
            <span>Sign In</span>
        </a>
    );
}
