import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { LucideIcon } from 'lucide-react';

interface Feature {
    icon: LucideIcon;
    title: string;
    description: string;
    gradient: string;
}

interface FeatureBounceCardsProps {
    className?: string;
    features: Feature[];
    containerWidth?: number;
    containerHeight?: number;
    animationDelay?: number;
    animationStagger?: number;
    easeType?: string;
    transformStyles?: string[];
    enableHover?: boolean;
}

export default function FeatureBounceCards({
    className = '',
    features = [],
    containerWidth = 800,
    containerHeight = 500,
    animationDelay = 0.5,
    animationStagger = 0.06,
    easeType = 'elastic.out(1, 0.8)',
    transformStyles,
    enableHover = true
}: FeatureBounceCardsProps) {
    const containerRef = useRef<HTMLDivElement>(null);

    // Generate default transforms if not provided, for up to 8 items
    const defaultTransforms = [
        'translate(-280px)',
        'translate(-200px)',
        'translate(-120px)',
        'translate(-40px)',
        'translate(40px)',
        'translate(120px)',
        'translate(200px)',
        'translate(280px)'
    ];

    const currentTransforms = transformStyles || defaultTransforms.slice(0, features.length);

    useEffect(() => {
        const ctx = gsap.context(() => {
            gsap.fromTo(
                '.card',
                { scale: 0 },
                {
                    scale: 1,
                    stagger: animationStagger,
                    ease: easeType,
                    delay: animationDelay
                }
            );
        }, containerRef);
        return () => ctx.revert();
    }, [animationDelay, animationStagger, easeType]);

    const getNoRotationTransform = (transformStr: string): string => {
        const hasRotate = /rotate\([\s\S]*?\)/.test(transformStr);
        if (hasRotate) {
            return transformStr.replace(/rotate\([\s\S]*?\)/, 'rotate(0deg)');
        } else if (transformStr === 'none') {
            return 'rotate(0deg)';
        } else {
            return `${transformStr} rotate(0deg)`;
        }
    };

    const getPushedTransform = (baseTransform: string, offsetX: number): string => {
        const translateRegex = /translate\(([-0-9.]+)px\)/;
        const match = baseTransform.match(translateRegex);
        if (match) {
            const currentX = parseFloat(match[1]);
            const newX = currentX + offsetX;
            return baseTransform.replace(translateRegex, `translate(${newX}px)`);
        } else {
            return baseTransform === 'none' ? `translate(${offsetX}px)` : `${baseTransform} translate(${offsetX}px)`;
        }
    };

    const pushSiblings = (hoveredIdx: number) => {
        const q = gsap.utils.selector(containerRef);
        if (!enableHover || !containerRef.current) return;

        features.forEach((_, i) => {
            const selector = q(`.card-${i}`);
            gsap.killTweensOf(selector);

            const baseTransform = currentTransforms[i] || 'none';

            if (i === hoveredIdx) {
                const noRotation = getNoRotationTransform(baseTransform);
                gsap.to(selector, {
                    transform: noRotation,
                    zIndex: 50,
                    scale: 1.1,
                    duration: 0.4,
                    ease: 'back.out(1.4)',
                    overwrite: 'auto'
                });
            } else {
                const offsetX = i < hoveredIdx ? -200 : 200; // Increased push distance
                const pushedTransform = getPushedTransform(baseTransform, offsetX);

                const distance = Math.abs(hoveredIdx - i);
                const delay = distance * 0.05;

                gsap.to(selector, {
                    transform: pushedTransform,
                    zIndex: 10,
                    scale: 1,
                    duration: 0.4,
                    ease: 'back.out(1.4)',
                    delay,
                    overwrite: 'auto'
                });
            }
        });
    };

    const resetSiblings = () => {
        if (!enableHover || !containerRef.current) return;
        const q = gsap.utils.selector(containerRef);

        features.forEach((_, i) => {
            const selector = q(`.card-${i}`);
            gsap.killTweensOf(selector);

            const baseTransform = currentTransforms[i] || 'none';
            gsap.to(selector, {
                transform: baseTransform,
                zIndex: i, // Restore original z-index order
                scale: 1,
                duration: 0.4,
                ease: 'back.out(1.4)',
                overwrite: 'auto'
            });
        });
    };

    return (
        <div
            className={`relative flex items-center justify-center ${className}`}
            ref={containerRef}
            style={{
                width: '100%',
                height: containerHeight,
                maxWidth: containerWidth
            }}
        >
            {features.map((feature, idx) => {
                const Icon = feature.icon;
                return (
                    <div
                        key={idx}
                        className={`card card-${idx} absolute w-[240px] h-[320px] rounded-[30px] overflow-hidden bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 shadow-xl cursor-pointer`}
                        style={{
                            boxShadow: '-10px 0 20px rgba(0, 0, 0, 0.1), 0 4px 10px rgba(0, 0, 0, 0.2)',
                            transform: currentTransforms[idx] || 'none',
                            zIndex: idx
                        }}
                        onMouseEnter={() => pushSiblings(idx)}
                        onMouseLeave={resetSiblings}
                    >
                        <div className={`absolute inset-0 bg-gradient-to-br ${feature.gradient} opacity-5 group-hover:opacity-10 transition-opacity`} />

                        <div className="p-6 flex flex-col h-full relative z-10">
                            <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${feature.gradient} flex items-center justify-center mb-6 shadow-lg shrink-0`}>
                                <Icon className="w-6 h-6 text-white" />
                            </div>

                            <h3 className="text-xl font-bold mb-3 leading-tight">{feature.title}</h3>
                            <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                                {feature.description}
                            </p>

                            {/* Decorative circle */}
                            <div className={`absolute -bottom-10 -right-10 w-32 h-32 rounded-full bg-gradient-to-tr ${feature.gradient} opacity-20 blur-2xl`} />
                        </div>
                    </div>
                );
            })}
        </div>
    );
}
