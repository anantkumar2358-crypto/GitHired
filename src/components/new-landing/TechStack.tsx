"use client";

import { SlidingLogoMarquee, SlidingLogoMarqueeItem } from "./SlidingLogoMarquee";

const techStackItems: SlidingLogoMarqueeItem[] = [
    {
        id: "nextjs",
        content: (
            <div className="flex flex-col items-center justify-center gap-2 p-4">
                <svg className="w-16 h-16" viewBox="0 0 180 180" fill="none">
                    <mask id="mask0_408_139" style={{ maskType: 'alpha' }} maskUnits="userSpaceOnUse" x="0" y="0" width="180" height="180">
                        <circle cx="90" cy="90" r="90" fill="black" />
                    </mask>
                    <g mask="url(#mask0_408_139)">
                        <circle cx="90" cy="90" r="90" fill="currentColor" className="text-gray-900 dark:text-white" />
                        <path d="M149.508 157.52L69.142 54H54V125.97H66.1136V69.3836L139.999 164.845C143.333 162.614 146.509 160.165 149.508 157.52Z" fill="url(#paint0_linear_408_139)" />
                        <rect x="115" y="54" width="12" height="72" fill="url(#paint1_linear_408_139)" />
                    </g>
                    <defs>
                        <linearGradient id="paint0_linear_408_139" x1="109" y1="116.5" x2="144.5" y2="160.5" gradientUnits="userSpaceOnUse">
                            <stop stopColor="white" />
                            <stop offset="1" stopColor="white" stopOpacity="0" />
                        </linearGradient>
                        <linearGradient id="paint1_linear_408_139" x1="121" y1="54" x2="120.799" y2="106.875" gradientUnits="userSpaceOnUse">
                            <stop stopColor="white" />
                            <stop offset="1" stopColor="white" stopOpacity="0" />
                        </linearGradient>
                    </defs>
                </svg>
                <span className="text-sm font-semibold text-gray-900 dark:text-white">Next.js</span>
            </div>
        ),
        href: "https://nextjs.org"
    },
    {
        id: "react",
        content: (
            <div className="flex flex-col items-center justify-center gap-2 p-4">
                <svg className="w-16 h-16" viewBox="0 0 24 24" fill="none">
                    <circle cx="12" cy="12" r="2" fill="#61DAFB" />
                    <ellipse cx="12" cy="12" rx="10" ry="4" stroke="#61DAFB" strokeWidth="1" fill="none" />
                    <ellipse cx="12" cy="12" rx="10" ry="4" stroke="#61DAFB" strokeWidth="1" fill="none" transform="rotate(60 12 12)" />
                    <ellipse cx="12" cy="12" rx="10" ry="4" stroke="#61DAFB" strokeWidth="1" fill="none" transform="rotate(120 12 12)" />
                </svg>
                <span className="text-sm font-semibold text-gray-900 dark:text-white">React</span>
            </div>
        ),
        href: "https://react.dev"
    },
    {
        id: "typescript",
        content: (
            <div className="flex flex-col items-center justify-center gap-2 p-4">
                <svg className="w-16 h-16" viewBox="0 0 24 24" fill="none">
                    <rect width="24" height="24" rx="3" fill="#3178C6" />
                    <path d="M13.5 16.5V18h4.5v-1.5h-1.5v-9h1.5V6h-4.5v1.5h1.5v9h-1.5z" fill="white" />
                    <path d="M6 16.5h3v-1.5H7.5v-9H9V4.5H6v1.5h1.5v9H6v1.5z" fill="white" />
                </svg>
                <span className="text-sm font-semibold text-gray-900 dark:text-white">TypeScript</span>
            </div>
        ),
        href: "https://www.typescriptlang.org"
    },
    {
        id: "tailwind",
        content: (
            <div className="flex flex-col items-center justify-center gap-2 p-4">
                <svg className="w-16 h-16" viewBox="0 0 24 24" fill="none">
                    <path d="M12 6C9.33 6 7.67 7.33 7 10C8 8 9.17 7.5 10.5 8.17C11.27 8.55 11.82 9.1 12.43 9.72C13.55 10.85 14.85 12.17 18 12.17C20.67 12.17 22.33 10.83 23 8C22 10 20.83 10.5 19.5 9.83C18.73 9.45 18.18 8.9 17.57 8.28C16.45 7.15 15.15 5.83 12 5.83V6ZM7 12C4.33 12 2.67 13.33 2 16C3 14 4.17 13.5 5.5 14.17C6.27 14.55 6.82 15.1 7.43 15.72C8.55 16.85 9.85 18.17 13 18.17C15.67 18.17 17.33 16.83 18 14C17 16 15.83 16.5 14.5 15.83C13.73 15.45 13.18 14.9 12.57 14.28C11.45 13.15 10.15 11.83 7 11.83V12Z" fill="#06B6D4" />
                </svg>
                <span className="text-sm font-semibold text-gray-900 dark:text-white">Tailwind CSS</span>
            </div>
        ),
        href: "https://tailwindcss.com"
    },
    {
        id: "postgresql",
        content: (
            <div className="flex flex-col items-center justify-center gap-2 p-4">
                <svg className="w-16 h-16" viewBox="0 0 24 24" fill="none">
                    <path d="M17.128 0C15.606 0 14.4 1.206 14.4 2.728V21.272C14.4 22.794 15.606 24 17.128 24C18.65 24 19.856 22.794 19.856 21.272V2.728C19.856 1.206 18.65 0 17.128 0Z" fill="#336791" />
                    <path d="M6.872 0C5.35 0 4.144 1.206 4.144 2.728V21.272C4.144 22.794 5.35 24 6.872 24C8.394 24 9.6 22.794 9.6 21.272V2.728C9.6 1.206 8.394 0 6.872 0Z" fill="#336791" />
                </svg>
                <span className="text-sm font-semibold text-gray-900 dark:text-white">PostgreSQL</span>
            </div>
        ),
        href: "https://www.postgresql.org"
    },
    {
        id: "clerk",
        content: (
            <div className="flex flex-col items-center justify-center gap-2 p-4">
                <svg className="w-16 h-16" viewBox="0 0 24 24" fill="none">
                    <rect width="24" height="24" rx="6" fill="#6C47FF" />
                    <path d="M12 6L18 12L12 18L6 12L12 6Z" fill="white" />
                </svg>
                <span className="text-sm font-semibold text-gray-900 dark:text-white">Clerk</span>
            </div>
        ),
        href: "https://clerk.com"
    },
    {
        id: "gemini",
        content: (
            <div className="flex flex-col items-center justify-center gap-2 p-4">
                <svg className="w-16 h-16" viewBox="0 0 24 24" fill="none">
                    <circle cx="12" cy="12" r="10" fill="url(#gemini-gradient)" />
                    <path d="M12 6L15 12L12 18L9 12L12 6Z" fill="white" />
                    <defs>
                        <linearGradient id="gemini-gradient" x1="0" y1="0" x2="24" y2="24">
                            <stop offset="0%" stopColor="#4285F4" />
                            <stop offset="100%" stopColor="#9B72CB" />
                        </linearGradient>
                    </defs>
                </svg>
                <span className="text-sm font-semibold text-gray-900 dark:text-white">Gemini AI</span>
            </div>
        ),
        href: "https://ai.google.dev"
    }
];

export function TechStack() {
    return (
        <section className="py-16 bg-transparent relative z-10">
            <div className="container mx-auto px-4">
                <div className="text-center mb-12">
                    <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
                        Built With Modern Technologies
                    </h2>
                    <p className="text-gray-600 dark:text-gray-400 text-lg">
                        Powered by industry-leading frameworks and services
                    </p>
                </div>

                <SlidingLogoMarquee
                    items={techStackItems}
                    speed={20}
                    pauseOnHover={true}
                    enableBlur={true}
                    blurIntensity={2}
                    height="180px"
                    gap="3rem"
                    showControls={false}
                    backgroundColor="transparent"
                />
            </div>
        </section>
    );
}
