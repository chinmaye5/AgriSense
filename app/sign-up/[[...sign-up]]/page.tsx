'use client';

import { SignUp } from '@clerk/nextjs';

export default function SignUpPage() {
    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#1a1b26] via-[#1e1f2b] to-[#252636]">
            <div className="absolute inset-0 pointer-events-none overflow-hidden">
                <div className="absolute -top-24 -right-24 w-96 h-96 rounded-full blur-[120px] opacity-20 bg-green-500 animate-pulse" />
                <div className="absolute top-1/2 -left-24 w-80 h-80 rounded-full blur-[100px] opacity-15 bg-blue-500" />
                <div className="absolute -bottom-24 right-1/4 w-96 h-96 rounded-full blur-[120px] opacity-10 bg-emerald-600" />
            </div>
            <div className="relative z-10">
                <SignUp
                    appearance={{
                        elements: {
                            rootBox: 'mx-auto',
                            card: 'bg-[#252636] border border-[#33344a] shadow-2xl',
                        },
                    }}
                />
            </div>
        </div>
    );
}
