"use client";

import React, {
    useRef,
    useEffect,
    useState,
    TouchEvent,
} from "react";
import { ChevronLeft, ChevronRight, ArrowRight } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { useIsMobile } from "../hooks/use-mobile";

export interface ThreeDCarouselItem {
    id: number;
    title: string;
    brand: string;
    description: string;
    tags: string[];
    imageUrl: string;
    link: string;
}

interface ThreeDCarouselProps {
    items: ThreeDCarouselItem[];
    autoRotate?: boolean;
    rotateInterval?: number;
    cardHeight?: number;
    title?: string;
    subtitle?: string;
    tagline?: string;
    isMobileSwipe?: boolean;
}

const ThreeDCarousel = ({
    items,
    autoRotate = true,
    rotateInterval = 4000,
    cardHeight = 500,
    title = "From Textile to Intelligence",
    subtitle = "Customer Cases",
    tagline = "Explore how our textile sensor technology is revolutionizing multiple industries with intelligent fabric solutions tailored to specific needs.",
    isMobileSwipe = true,
}: ThreeDCarouselProps) => {
    const [active, setActive] = useState(0);
    const carouselRef = useRef<HTMLDivElement>(null);
    const [isInView, setIsInView] = useState(false);
    const [isHovering, setIsHovering] = useState(false);
    const [touchStart, setTouchStart] = useState<number | null>(null);
    const [touchEnd, setTouchEnd] = useState<number | null>(null);
    const isMobile = useIsMobile();
    const minSwipeDistance = 50;

    useEffect(() => {
        if (autoRotate && isInView && !isHovering) {
            const interval = setInterval(() => {
                setActive((prev) => (prev + 1) % items.length);
            }, rotateInterval);
            return () => clearInterval(interval);
        }
    }, [isInView, isHovering, autoRotate, rotateInterval, items.length]);

    useEffect(() => {
        if (!carouselRef.current) return;

        const observer = new IntersectionObserver(
            ([entry]) => setIsInView(entry.isIntersecting),
            { threshold: 0.2 }
        );

        observer.observe(carouselRef.current);

        return () => observer.disconnect();
    }, []);

    const onTouchStart = (e: React.TouchEvent) => {
        setTouchStart(e.targetTouches[0].clientX);
        setTouchEnd(null);
    };

    const onTouchMove = (e: React.TouchEvent) => {
        setTouchEnd(e.targetTouches[0].clientX);
    };

    const onTouchEnd = () => {
        if (!touchStart || !touchEnd) return;
        const distance = touchStart - touchEnd;
        if (distance > minSwipeDistance) {
            setActive((prev) => (prev + 1) % items.length);
        } else if (distance < -minSwipeDistance) {
            setActive((prev) => (prev - 1 + items.length) % items.length);
        }
    };

    const getCardStyle = (index: number) => {
        const total = items.length;

        // If only one item, keep it centered without any transforms
        if (total === 1) {
            return "scale-100 opacity-100 z-20 translate-x-0 blur-0";
        }

        // Calculate relative position based on active index
        // We want to handle wrapping correctly
        let relativeIdx = (index - active + total) % total;

        // Adjust logic to handle "previous" item correctly in circular list
        // If it's the last item relative to active, treat as -1
        if (relativeIdx === total - 1) relativeIdx = -1;

        if (relativeIdx === 0) {
            // Active card
            return "scale-100 opacity-100 z-20 translate-x-0 blur-0";
        } else if (relativeIdx === 1) {
            // Next card
            return "translate-x-[40%] scale-90 opacity-60 z-10 blur-[1px]";
        } else if (relativeIdx === -1) {
            // Previous card
            return "translate-x-[-40%] scale-90 opacity-60 z-10 blur-[1px]";
        } else {
            // Hidden cards
            return "scale-75 opacity-0 z-0 blur-md pointer-events-none"; // Hidden
        }
    };

    return (
        <section
            id="ThreeDCarousel"
            className="bg-transparent min-w-full mx-auto flex items-center justify-center py-12"
        >
            <div
                className="w-full px-4 sm:px-6 lg:px-8 
      min-w-[350px] md:min-w-[1000px] max-w-7xl relative"
            >
                <div
                    className="relative h-[600px] w-full flex items-center justify-center perspective-1000"
                    onMouseEnter={() => setIsHovering(true)}
                    onMouseLeave={() => setIsHovering(false)}
                    onTouchStart={onTouchStart}
                    onTouchMove={onTouchMove}
                    onTouchEnd={onTouchEnd}
                    ref={carouselRef}
                >
                    <div className="absolute inset-x-0 inset-y-0 flex justify-center items-center">
                        {items.map((item, index) => (
                            <div
                                key={item.id}
                                className={`absolute w-full max-w-sm md:max-w-md transition-all duration-700 ease-out origin-center cursor-pointer group ${getCardStyle(index)}`}
                                onClick={() => setActive(index)}
                            >
                                {/* Mesh Gradient Glow Container */}
                                <div className="relative p-[2px] rounded-xl bg-gradient-to-br from-purple-500 via-pink-500 to-blue-500 transition-opacity duration-300">
                                    {/* Animated Mesh Gradient Background */}
                                    <div className="absolute inset-0 rounded-xl opacity-75 blur-xl bg-gradient-to-br from-purple-500 via-pink-500 to-blue-500 animate-pulse"></div>

                                    <Card
                                        className={`relative overflow-hidden bg-white dark:bg-neutral-900 border-neutral-200 dark:border-neutral-800 shadow-lg 
                        hover:shadow-[0_0_40px_rgba(168,85,247,0.6)] hover:scale-105 transition-all duration-300 flex flex-col h-[550px] backdrop-blur-sm rounded-xl`}
                                    >
                                        <div className="relative p-6 flex items-center justify-center h-56 overflow-hidden group shrink-0">
                                            {/* Gradient Background Layer */}
                                            <div
                                                className="absolute inset-0 z-0 transition-transform duration-700 group-hover:scale-110"
                                                style={{
                                                    background: [
                                                        'radial-gradient(at 27% 37%, hsla(215, 98%, 61%, 1) 0px, transparent 50%), radial-gradient(at 97% 21%, hsla(125, 98%, 72%, 1) 0px, transparent 50%), radial-gradient(at 52% 99%, hsla(354, 98%, 61%, 1) 0px, transparent 50%), radial-gradient(at 10% 29%, hsla(256, 96%, 67%, 1) 0px, transparent 50%), radial-gradient(at 97% 96%, hsla(38, 60%, 74%, 1) 0px, transparent 50%), radial-gradient(at 33% 50%, hsla(222, 67%, 73%, 1) 0px, transparent 50%), radial-gradient(at 79% 53%, hsla(343, 68%, 79%, 1) 0px, transparent 50%)',
                                                        'radial-gradient(at 40% 20%, hsla(28, 100%, 74%, 1) 0px, transparent 50%), radial-gradient(at 80% 0%, hsla(189, 100%, 56%, 1) 0px, transparent 50%), radial-gradient(at 0% 50%, hsla(355, 100%, 93%, 1) 0px, transparent 50%), radial-gradient(at 80% 50%, hsla(340, 100%, 76%, 1) 0px, transparent 50%), radial-gradient(at 0% 100%, hsla(22, 100%, 77%, 1) 0px, transparent 50%), radial-gradient(at 80% 100%, hsla(242, 100%, 70%, 1) 0px, transparent 50%), radial-gradient(at 0% 0%, hsla(343, 100%, 76%, 1) 0px, transparent 50%)',
                                                        'radial-gradient(at 27% 37%, hsla(215, 98%, 61%, 1) 0px, transparent 50%), radial-gradient(at 97% 21%, hsla(173, 98%, 72%, 1) 0px, transparent 50%), radial-gradient(at 52% 99%, hsla(354, 98%, 61%, 1) 0px, transparent 50%), radial-gradient(at 10% 29%, hsla(256, 96%, 67%, 1) 0px, transparent 50%), radial-gradient(at 97% 96%, hsla(38, 60%, 74%, 1) 0px, transparent 50%), radial-gradient(at 33% 50%, hsla(222, 67%, 73%, 1) 0px, transparent 50%), radial-gradient(at 79% 53%, hsla(343, 68%, 79%, 1) 0px, transparent 50%)',
                                                        'radial-gradient(at 52% 99%, hsla(125, 98%, 72%, 1) 0px, transparent 50%), radial-gradient(at 10% 29%, hsla(189, 96%, 67%, 1) 0px, transparent 50%), radial-gradient(at 97% 96%, hsla(242, 60%, 74%, 1) 0px, transparent 50%), radial-gradient(at 33% 50%, hsla(222, 67%, 73%, 1) 0px, transparent 50%), radial-gradient(at 79% 53%, hsla(173, 68%, 79%, 1) 0px, transparent 50%), radial-gradient(at 27% 37%, hsla(215, 98%, 61%, 1) 0px, transparent 50%), radial-gradient(at 97% 21%, hsla(354, 98%, 61%, 1) 0px, transparent 50%)',
                                                        'radial-gradient(at 40% 20%, hsla(340, 100%, 76%, 1) 0px, transparent 50%), radial-gradient(at 80% 0%, hsla(189, 100%, 56%, 1) 0px, transparent 50%), radial-gradient(at 0% 50%, hsla(355, 100%, 93%, 1) 0px, transparent 50%), radial-gradient(at 80% 50%, hsla(242, 100%, 70%, 1) 0px, transparent 50%), radial-gradient(at 0% 100%, hsla(22, 100%, 77%, 1) 0px, transparent 50%), radial-gradient(at 80% 100%, hsla(28, 100%, 74%, 1) 0px, transparent 50%), radial-gradient(at 0% 0%, hsla(343, 100%, 76%, 1) 0px, transparent 50%)',
                                                        'radial-gradient(at 27% 37%, hsla(256, 96%, 67%, 1) 0px, transparent 50%), radial-gradient(at 97% 21%, hsla(173, 98%, 72%, 1) 0px, transparent 50%), radial-gradient(at 52% 99%, hsla(354, 98%, 61%, 1) 0px, transparent 50%), radial-gradient(at 10% 29%, hsla(215, 98%, 61%, 1) 0px, transparent 50%), radial-gradient(at 97% 96%, hsla(38, 60%, 74%, 1) 0px, transparent 50%), radial-gradient(at 33% 50%, hsla(222, 67%, 73%, 1) 0px, transparent 50%), radial-gradient(at 79% 53%, hsla(189, 68%, 79%, 1) 0px, transparent 50%)',
                                                        'radial-gradient(at 40% 20%, hsla(189, 100%, 56%, 1) 0px, transparent 50%), radial-gradient(at 80% 0%, hsla(340, 100%, 76%, 1) 0px, transparent 50%), radial-gradient(at 0% 50%, hsla(242, 100%, 70%, 1) 0px, transparent 50%), radial-gradient(at 80% 50%, hsla(355, 100%, 93%, 1) 0px, transparent 50%), radial-gradient(at 0% 100%, hsla(28, 100%, 74%, 1) 0px, transparent 50%), radial-gradient(at 80% 100%, hsla(22, 100%, 77%, 1) 0px, transparent 50%), radial-gradient(at 0% 0%, hsla(343, 100%, 76%, 1) 0px, transparent 50%)',
                                                        'radial-gradient(at 27% 37%, hsla(215, 98%, 61%, 1) 0px, transparent 50%), radial-gradient(at 97% 21%, hsla(125, 98%, 72%, 1) 0px, transparent 50%), radial-gradient(at 52% 99%, hsla(242, 98%, 61%, 1) 0px, transparent 50%), radial-gradient(at 10% 29%, hsla(256, 96%, 67%, 1) 0px, transparent 50%), radial-gradient(at 97% 96%, hsla(173, 60%, 74%, 1) 0px, transparent 50%), radial-gradient(at 33% 50%, hsla(222, 67%, 73%, 1) 0px, transparent 50%), radial-gradient(at 79% 53%, hsla(343, 68%, 79%, 1) 0px, transparent 50%)',
                                                    ][index % 8],
                                                    filter: 'blur(40px) saturate(150%)',
                                                    transform: 'scale(1.2)',
                                                }}
                                            />

                                            {/* Image Pattern Overlay */}
                                            <div
                                                className="absolute inset-0 z-10 opacity-20"
                                                style={{
                                                    backgroundImage: `url(${item.imageUrl})`,
                                                    backgroundSize: "cover",
                                                    backgroundPosition: "center",
                                                }}
                                            />

                                            {/* Dark Overlay for better text contrast */}
                                            <div className="absolute inset-0 z-10 bg-gradient-to-br from-white/10 via-transparent to-black/20 group-hover:from-white/5 group-hover:to-black/10 transition-colors duration-500 backdrop-blur-[1px]" />

                                            {/* Content */}
                                            <div className="relative z-20 text-center text-white drop-shadow-2xl">
                                                <h3 className="text-2xl font-bold mb-2 tracking-tight">
                                                    {item.brand.toUpperCase()}
                                                </h3>
                                                <div className="w-12 h-1 bg-white/90 mx-auto mb-2 rounded-full shadow-2xl" />
                                                <p className="text-sm font-medium text-white">{item.title}</p>
                                            </div>
                                        </div>

                                        <CardContent className="p-6 flex flex-col flex-grow">
                                            <h3 className="text-xl font-bold mb-2 text-neutral-900 dark:text-white line-clamp-1">
                                                {item.title}
                                            </h3>
                                            <p className="text-neutral-700 dark:text-neutral-300 text-sm font-semibold mb-3 uppercase tracking-wider">
                                                {item.brand}
                                            </p>
                                            <p className="text-neutral-600 dark:text-neutral-400 text-sm flex-grow line-clamp-4 leading-relaxed">
                                                {item.description}
                                            </p>

                                            <div className="mt-6 pt-4 border-t border-border">
                                                <div className="flex flex-wrap gap-2 mb-4 h-16 overflow-hidden content-start">
                                                    {item.tags.slice(0, 4).map((tag, idx) => (
                                                        <span
                                                            key={idx}
                                                            className="px-2.5 py-1 bg-secondary text-secondary-foreground rounded-full text-xs font-medium"
                                                        >
                                                            {tag}
                                                        </span>
                                                    ))}
                                                </div>

                                                <a
                                                    href={item.link}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="text-primary flex items-center hover:text-primary/80 font-medium group/link"
                                                >
                                                    <span className="relative z-10">View Project</span>
                                                    <ArrowRight className="ml-2 w-4 h-4 transition-transform group-hover/link:translate-x-1" />
                                                </a>
                                            </div>
                                        </CardContent>
                                    </Card>
                                </div>
                            </div>
                        ))}
                    </div>

                    {!isMobile && (
                        <>
                            <button
                                className="absolute left-4 lg:left-12 top-1/2 -translate-y-1/2 w-12 h-12 bg-background/80 backdrop-blur-sm rounded-full flex items-center justify-center text-foreground hover:bg-background z-30 shadow-lg border border-border transition-all hover:scale-110"
                                onClick={() =>
                                    setActive((prev) => (prev - 1 + items.length) % items.length)
                                }
                                aria-label="Previous"
                            >
                                <ChevronLeft className="w-6 h-6" />
                            </button>
                            <button
                                className="absolute right-4 lg:right-12 top-1/2 -translate-y-1/2 w-12 h-12 bg-background/80 backdrop-blur-sm rounded-full flex items-center justify-center text-foreground hover:bg-background z-30 shadow-lg border border-border transition-all hover:scale-110"
                                onClick={() => setActive((prev) => (prev + 1) % items.length)}
                                aria-label="Next"
                            >
                                <ChevronRight className="w-6 h-6" />
                            </button>
                        </>
                    )}

                    <div className="absolute -bottom-8 left-0 right-0 flex justify-center items-center space-x-3 z-30">
                        {items.map((_, idx) => (
                            <button
                                key={idx}
                                className={`h-2 rounded-full transition-all duration-300 ${active === idx
                                    ? "bg-primary w-8"
                                    : "bg-muted w-2 hover:bg-primary/50"
                                    }`}
                                onClick={() => setActive(idx)}
                                aria-label={`Go to item ${idx + 1}`}
                            />
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
};

export default ThreeDCarousel;
