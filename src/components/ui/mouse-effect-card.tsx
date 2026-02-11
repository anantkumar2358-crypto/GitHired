"use client";

import { motion, useMotionValue, useSpring, useTransform } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

const SPRING_CONFIG = { stiffness: 300, damping: 30, mass: 0.5 };
const OPACITY_DURATION_BASE = 0.8;
const OPACITY_DURATION_VARIATION = 0.2;
const OPACITY_EASE = [0.4, 0, 0.2, 1] as const;
const OPACITY_DELAY_CYCLE = 1.5;
const OPACITY_DELAY_STEP = 0.02;
const MIN_OPACITY_MULTIPLIER = 0.5;
const MAX_OPACITY_MULTIPLIER = 1.5;
const MIN_OPACITY_FALLBACK = 0.3;
const PROXIMITY_MULTIPLIER = 1.2;
const PROXIMITY_OPACITY_BOOST = 0.8;

export interface MouseEffectCardProps {
    className?: string;
    children?: React.ReactNode; // Modified to accept ReactNode
    dotSize?: number;
    dotSpacing?: number;
    repulsionRadius?: number;
    repulsionStrength?: number;
    title?: string;
    subtitle?: string;
    topText?: string;
    topSubtext?: string;
    primaryCtaText?: string;
    primaryCtaUrl?: string;
    secondaryCtaText?: string;
    secondaryCtaUrl?: string;
    footerText?: string;
    fullScreen?: boolean; // Added for full-screen mode
}

interface Dot {
    id: string;
    x: number;
    y: number;
    baseX: number;
    baseY: number;
    opacity: number;
}

interface DotComponentProps {
    dot: Dot;
    index: number;
    dotSize: number;
    mouseX: ReturnType<typeof useMotionValue<number>>;
    mouseY: ReturnType<typeof useMotionValue<number>>;
    repulsionRadius: number;
    repulsionStrength: number;
}

function calculateDistance(
    x1: number,
    y1: number,
    x2: number,
    y2: number
): number {
    const dx = x1 - x2;
    const dy = y1 - y2;
    return Math.sqrt(dx * dx + dy * dy);
}

function generateDots(width: number, height: number, spacing: number): Dot[] {
    const dots: Dot[] = [];
    const cols = Math.ceil(width / spacing);
    const rows = Math.ceil(height / spacing);
    const centerX = width / 2;
    const centerY = height / 2;
    const maxDistance = Math.sqrt(centerX * centerX + centerY * centerY);

    // Define the login box dimensions (matching visible container)
    const boxWidth = 592; // Increased by additional 30px (total 80px from 512px)
    const boxHeight = 700; // Square dimensions
    const boxLeft = centerX - boxWidth / 2;
    const boxRight = centerX + boxWidth / 2;
    const boxTop = centerY - boxHeight / 2;
    const boxBottom = centerY + boxHeight / 2;
    const borderThickness = 80; // Thickness of the border area

    for (let row = 0; row <= rows; row++) {
        for (let col = 0; col <= cols; col++) {
            const x = col * spacing;
            const y = row * spacing;

            // Check if particle is inside the rounded box (excluding edges)
            const cornerRadius = 12; // Match the visual border radius (updated to 12px)
            const fadeDistance = 100; // Distance over which to fade particles to zero
            const innerBoxLeft = boxLeft + borderThickness;
            const innerBoxRight = boxRight - borderThickness;
            const innerBoxTop = boxTop + borderThickness;
            const innerBoxBottom = boxBottom - borderThickness;

            // Check if point is in the main rectangular area
            let isInsideBox = x > innerBoxLeft && x < innerBoxRight
                && y > innerBoxTop && y < innerBoxBottom;

            // For rounded corners, check if point is in corner radius areas
            if (isInsideBox) {
                // Top-left corner
                if (x < innerBoxLeft + cornerRadius && y < innerBoxTop + cornerRadius) {
                    const dx = x - (innerBoxLeft + cornerRadius);
                    const dy = y - (innerBoxTop + cornerRadius);
                    if (dx * dx + dy * dy > cornerRadius * cornerRadius) {
                        isInsideBox = false;
                    }
                }
                // Top-right corner
                else if (x > innerBoxRight - cornerRadius && y < innerBoxTop + cornerRadius) {
                    const dx = x - (innerBoxRight - cornerRadius);
                    const dy = y - (innerBoxTop + cornerRadius);
                    if (dx * dx + dy * dy > cornerRadius * cornerRadius) {
                        isInsideBox = false;
                    }
                }
                // Bottom-left corner
                else if (x < innerBoxLeft + cornerRadius && y > innerBoxBottom - cornerRadius) {
                    const dx = x - (innerBoxLeft + cornerRadius);
                    const dy = y - (innerBoxBottom - cornerRadius);
                    if (dx * dx + dy * dy > cornerRadius * cornerRadius) {
                        isInsideBox = false;
                    }
                }
                // Bottom-right corner
                else if (x > innerBoxRight - cornerRadius && y > innerBoxBottom - cornerRadius) {
                    const dx = x - (innerBoxRight - cornerRadius);
                    const dy = y - (innerBoxBottom - cornerRadius);
                    if (dx * dx + dy * dy > cornerRadius * cornerRadius) {
                        isInsideBox = false;
                    }
                }
            }

            // Skip particles inside the rounded box
            if (isInsideBox) {
                continue;
            }

            // Calculate distance from center
            const dx = x - centerX;
            const dy = y - centerY;
            const distanceFromCenter = Math.sqrt(dx * dx + dy * dy);

            // Exponential density falloff: dots are densest at center
            const normalizedDistance = distanceFromCenter / maxDistance;
            let densityProbability = Math.exp(-normalizedDistance * 2.5); // Reduced from 3.5 for slower falloff

            // Calculate distance from the particle-free border for gradient fade
            let distanceFromBoxBorder = Math.min(
                x - innerBoxLeft,
                innerBoxRight - x,
                y - innerBoxTop,
                innerBoxBottom - y
            );

            // Adjust for rounded corners
            if (x < innerBoxLeft + cornerRadius && y < innerBoxTop + cornerRadius) {
                const dx = x - (innerBoxLeft + cornerRadius);
                const dy = y - (innerBoxTop + cornerRadius);
                distanceFromBoxBorder = Math.sqrt(dx * dx + dy * dy) - cornerRadius;
            } else if (x > innerBoxRight - cornerRadius && y < innerBoxTop + cornerRadius) {
                const dx = x - (innerBoxRight - cornerRadius);
                const dy = y - (innerBoxTop + cornerRadius);
                distanceFromBoxBorder = Math.sqrt(dx * dx + dy * dy) - cornerRadius;
            } else if (x < innerBoxLeft + cornerRadius && y > innerBoxBottom - cornerRadius) {
                const dx = x - (innerBoxLeft + cornerRadius);
                const dy = y - (innerBoxBottom - cornerRadius);
                distanceFromBoxBorder = Math.sqrt(dx * dx + dy * dy) - cornerRadius;
            } else if (x > innerBoxRight - cornerRadius && y > innerBoxBottom - cornerRadius) {
                const dx = x - (innerBoxRight - cornerRadius);
                const dy = y - (innerBoxBottom - cornerRadius);
                distanceFromBoxBorder = Math.sqrt(dx * dx + dy * dy) - cornerRadius;
            }

            // Apply gradient fade near the border (0 to fadeDistance)
            if (distanceFromBoxBorder > 0 && distanceFromBoxBorder < fadeDistance) {
                const fadeFactor = distanceFromBoxBorder / fadeDistance; // 0 at border, 1 at fadeDistance
                densityProbability *= fadeFactor; // Gradually reduce density
            }

            // Boost density along the rectangular edges of the login box
            const distanceFromLeftEdge = Math.abs(x - boxLeft);
            const distanceFromRightEdge = Math.abs(x - boxRight);
            const distanceFromTopEdge = Math.abs(y - boxTop);
            const distanceFromBottomEdge = Math.abs(y - boxBottom);

            // Check if point is near any edge
            const isNearVerticalEdge = (distanceFromLeftEdge < borderThickness || distanceFromRightEdge < borderThickness)
                && y >= boxTop - borderThickness && y <= boxBottom + borderThickness;
            const isNearHorizontalEdge = (distanceFromTopEdge < borderThickness || distanceFromBottomEdge < borderThickness)
                && x >= boxLeft - borderThickness && x <= boxRight + borderThickness;

            if (isNearVerticalEdge || isNearHorizontalEdge) {
                // Calculate edge proximity factor
                const minEdgeDistance = Math.min(
                    distanceFromLeftEdge,
                    distanceFromRightEdge,
                    distanceFromTopEdge,
                    distanceFromBottomEdge
                );
                const edgeFactor = 1 - (minEdgeDistance / borderThickness);
                densityProbability = Math.max(densityProbability, edgeFactor * 0.45); // Reduced from 0.6 for fewer edge particles
            }

            // Skip dots based on probability
            if (Math.random() > densityProbability) {
                continue;
            }

            const pattern = (row + col) % 3;
            const baseOpacities = [0.7, 0.85, 1.0]; // Maximum brightness
            const opacity = baseOpacities[pattern] * densityProbability;

            dots.push({
                id: `dot-${row}-${col}`,
                x,
                y,
                baseX: x,
                baseY: y,
                opacity,
            });
        }
    }

    return dots;
}

function DotComponent({
    dot,
    index,
    dotSize,
    mouseX,
    mouseY,
    repulsionRadius,
    repulsionStrength,
}: DotComponentProps) {
    const posX = useTransform([mouseX, mouseY], () => {
        const mx = mouseX.get();
        const my = mouseY.get();

        if (!(Number.isFinite(mx) && Number.isFinite(my))) {
            return 0;
        }

        const dx = dot.baseX - mx;
        const dy = dot.baseY - my;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < repulsionRadius) {
            const force = (1 - distance / repulsionRadius) * repulsionStrength;
            const angle = Math.atan2(dy, dx);
            return Math.cos(angle) * force;
        }

        return 0;
    });

    const posY = useTransform([mouseX, mouseY], () => {
        const mx = mouseX.get();
        const my = mouseY.get();

        if (!(Number.isFinite(mx) && Number.isFinite(my))) {
            return 0;
        }

        const dx = dot.baseX - mx;
        const dy = dot.baseY - my;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < repulsionRadius) {
            const force = (1 - distance / repulsionRadius) * repulsionStrength;
            const angle = Math.atan2(dy, dx);
            return Math.sin(angle) * force;
        }

        return 0;
    });

    const opacityBoost = useTransform([mouseX, mouseY], () => {
        const mx = mouseX.get();
        const my = mouseY.get();

        if (!(Number.isFinite(mx) && Number.isFinite(my))) return 0;

        const distance = calculateDistance(dot.baseX, dot.baseY, mx, my);
        const maxDistance = repulsionRadius * PROXIMITY_MULTIPLIER;

        if (distance < maxDistance) {
            const proximityFactor = 1 - distance / maxDistance;
            return proximityFactor * PROXIMITY_OPACITY_BOOST;
        }

        return 0;
    });

    const x = useSpring(posX, SPRING_CONFIG);
    const y = useSpring(posY, SPRING_CONFIG);

    const baseMinOpacity = Math.max(
        dot.opacity * MIN_OPACITY_MULTIPLIER,
        MIN_OPACITY_FALLBACK
    );
    const baseMaxOpacity = Math.min(dot.opacity * MAX_OPACITY_MULTIPLIER, 1);

    const minOpacityWithBoost = useTransform(opacityBoost, (boost) =>
        Math.min(baseMinOpacity + boost, 1)
    );

    const delay = (index * OPACITY_DELAY_STEP) % OPACITY_DELAY_CYCLE;

    // Random drift for organic movement
    const driftX = (Math.random() - 0.5) * 20; // Random drift between -10 and 10
    const driftY = (Math.random() - 0.5) * 20;
    const driftDuration = 3 + Math.random() * 4; // Random duration between 3-7 seconds

    return (
        <motion.div
            animate={{
                opacity: [baseMinOpacity, baseMaxOpacity, baseMinOpacity],
                x: [0, driftX, -driftX, 0],
                y: [0, driftY, -driftY, 0],
            }}
            className="absolute rounded-full bg-white will-change-transform"
            initial={{ opacity: baseMinOpacity, x: 0, y: 0 }}
            style={{
                width: dotSize,
                height: dotSize,
                left: dot.baseX,
                top: dot.baseY,
                x,
                y,
                opacity: useSpring(minOpacityWithBoost, {
                    stiffness: 150,
                    damping: 25,
                }),
            }}
            transition={{
                opacity: {
                    duration:
                        OPACITY_DURATION_BASE + (index % 4) * OPACITY_DURATION_VARIATION,
                    repeat: Number.POSITIVE_INFINITY,
                    ease: OPACITY_EASE,
                    delay,
                    times: [0, 0.5, 1],
                },
                x: {
                    duration: driftDuration,
                    repeat: Number.POSITIVE_INFINITY,
                    ease: "easeInOut",
                    times: [0, 0.33, 0.66, 1],
                },
                y: {
                    duration: driftDuration,
                    repeat: Number.POSITIVE_INFINITY,
                    ease: "easeInOut",
                    times: [0, 0.33, 0.66, 1],
                },
            }}
        />
    );
}

export default function MouseEffectCard({
    className,
    children,
    dotSize = 2,
    dotSpacing = 20, // Increased default spacing for better performance on large screens
    repulsionRadius = 100, // Slightly larger radius
    repulsionStrength = 20,
    title = "Acme",
    subtitle = "Build interfaces with interactive patterns",
    topText = "Case Study",
    topSubtext = "Discover something new",
    primaryCtaText,
    primaryCtaUrl = "#",
    secondaryCtaText,
    secondaryCtaUrl = "#",
    footerText,
    fullScreen = false, // New prop
}: MouseEffectCardProps & { fullScreen?: boolean }) {
    const innerContainerRef = useRef<HTMLDivElement>(null);
    const mouseX = useMotionValue(Number.POSITIVE_INFINITY);
    const mouseY = useMotionValue(Number.POSITIVE_INFINITY);
    const [dots, setDots] = useState<Dot[]>([]);

    useEffect(() => {
        const updateDots = () => {
            if (!innerContainerRef.current) return;
            const rect = innerContainerRef.current.getBoundingClientRect();
            const newDots = generateDots(rect.width, rect.height, dotSpacing);
            setDots(newDots);
        };

        updateDots();

        const resizeObserver = new ResizeObserver(updateDots);
        if (innerContainerRef.current) {
            resizeObserver.observe(innerContainerRef.current);
        }

        return () => {
            resizeObserver.disconnect();
        };
    }, [dotSpacing]);

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        if (!innerContainerRef.current) return;

        const rect = innerContainerRef.current.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        mouseX.set(x);
        mouseY.set(y);
    };

    const handleMouseLeave = () => {
        mouseX.set(Number.POSITIVE_INFINITY);
        mouseY.set(Number.POSITIVE_INFINITY);
    };



    return (
        <Card
            className={cn(
                "relative overflow-hidden border border-white/40 shadow-none dark:border-white/10",
                fullScreen
                    ? "fixed inset-0 w-full h-full max-w-none rounded-none border-0 bg-neutral-950"
                    : "w-full max-w-md rounded-2xl mx-auto",
                className
            )}
        >
            <CardContent
                className={cn(
                    "relative w-full overflow-hidden p-0",
                    fullScreen ? "h-full" : "min-h-[500px]"
                )}
                onMouseLeave={handleMouseLeave}
                onMouseMove={handleMouseMove}
                ref={innerContainerRef}
            >
                {/* Dots layer - above content */}
                <div className="absolute inset-0 z-20 pointer-events-none">
                    {dots.map((dot, index) => (
                        <DotComponent
                            dot={dot}
                            dotSize={dotSize}
                            index={index}
                            key={dot.id}
                            mouseX={mouseX}
                            mouseY={mouseY}
                            repulsionRadius={repulsionRadius}
                            repulsionStrength={repulsionStrength}
                        />
                    ))}
                </div>

                {topText && (
                    <div className="absolute top-6 left-6 z-10">
                        <div className="relative p-2 rounded-lg bg-white/10 backdrop-blur-md border border-white/10">
                            <div className="relative flex flex-col gap-1">
                                <p className="font-bold text-sm text-white">
                                    {topText}
                                </p>
                                {topSubtext && (
                                    <p className="font-medium text-xs text-zinc-300">
                                        {topSubtext}
                                    </p>
                                )}
                            </div>
                        </div>
                    </div>
                )}

                <div className="relative z-10 flex h-full flex-col items-center justify-center px-4">
                    {/* Content Container - Solid black background with glassmorphism */}
                    <div className="flex flex-col items-center gap-6 w-full max-w-lg p-8 bg-black backdrop-blur-xl border-0 shadow-2xl" style={{ borderRadius: '12px' }}>
                        <div className="relative">
                            <div className="absolute inset-0 rounded-full bg-white/20 blur-2xl" />
                            <h2 className="relative text-center font-bold text-4xl text-white tracking-tight">
                                {title}
                            </h2>
                        </div>

                        {children ? (
                            <div className="relative w-full z-20">
                                {children}
                            </div>
                        ) : (
                            subtitle && (
                                <div className="relative">
                                    <p className="relative max-w-sm text-center font-medium text-base text-zinc-300 leading-relaxed">
                                        {subtitle}
                                    </p>
                                </div>
                            )
                        )}

                        {(primaryCtaText || secondaryCtaText) && (
                            <div className="mt-2 flex items-center gap-3">
                                {primaryCtaText && (
                                    <Button asChild className="rounded-full shadow-lg" size="lg">
                                        <a href={primaryCtaUrl} onClick={(e) => primaryCtaUrl === "#" && e.preventDefault()}>
                                            {primaryCtaText}
                                        </a>
                                    </Button>
                                )}
                                {secondaryCtaText && (
                                    <Button asChild className="rounded-full" size="lg" variant="outline">
                                        <a href={secondaryCtaUrl} onClick={(e) => secondaryCtaUrl === "#" && e.preventDefault()}>
                                            {secondaryCtaText}
                                        </a>
                                    </Button>
                                )}
                            </div>
                        )}
                    </div>
                </div>

                {footerText && (
                    <div className="absolute right-0 bottom-6 left-0 z-10 flex justify-center">
                        <div className="relative px-4 py-2 rounded-full bg-black/20 backdrop-blur-sm border border-white/5">
                            <p className="relative font-medium text-xs text-zinc-400">
                                {footerText}
                            </p>
                        </div>
                    </div>
                )}
            </CardContent>
        </Card>
    );
}
