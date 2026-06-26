"use client";

import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";
import {
    Scissors,
    Sparkles,
    Flower,
    Droplets,
    Star,
    Heart,
    Crown,
    Gem,
    Wind,
    Moon,
    Feather,
    Sun,
    Brush,
    Eye,
    Flame
} from "lucide-react";

type LuxuryLoaderProps = {
    duration?: number;
};

interface Particle {
    id: number;
    left: number;
    top: number;
    size: number;
    duration: number;
}

// Removed delay properties to ensure everything is visible immediately
const backgroundIcons = [
    { icon: Scissors, top: "12%", left: "8%", duration: 15 },
    { icon: Flower, top: "25%", left: "75%", duration: 18 },
    { icon: Sparkles, top: "45%", left: "10%", duration: 12 },
    { icon: Droplets, top: "60%", left: "82%", duration: 20 },
    { icon: Flame, top: "80%", left: "15%", duration: 16 },
    { icon: Sun, top: "15%", left: "60%", duration: 14 },
    { icon: Feather, top: "35%", left: "25%", duration: 19 },
    { icon: Eye, top: "75%", left: "65%", duration: 17 },
    { icon: Crown, top: "50%", left: "55%", duration: 21 },
    { icon: Heart, top: "85%", left: "45%", duration: 13 },
    { icon: Brush, top: "8%", left: "35%", duration: 16 },
    { icon: Moon, top: "55%", left: "20%", duration: 15 },
    { icon: Gem, top: "88%", left: "75%", duration: 18 },
    { icon: Wind, top: "30%", left: "45%", duration: 14 },
    { icon: Star, top: "68%", left: "5%", duration: 22 },
];

export default function Loader({
    duration = 4000, // Reverted to a slightly shorter duration
}: LuxuryLoaderProps) {
    const [visible, setVisible] = useState(true);
    const [particles, setParticles] = useState<Particle[]>([]);

    useEffect(() => {
        const timer = setTimeout(() => setVisible(false), duration);
        return () => clearTimeout(timer);
    }, [duration]);

    useEffect(() => {
        const generatedParticles = Array.from({ length: 28 }, (_, i) => ({
            id: i,
            left: Math.random() * 100,
            top: Math.random() * 100,
            size: Math.random() * 5 + 2,
            duration: Math.random() * 8 + 6,
        }));
        setParticles(generatedParticles);
    }, []);

    return (
        <AnimatePresence>
            {visible && (
                <motion.div
                    initial={{ opacity: 1 }}
                    exit={{
                        opacity: 0,
                        scale: 1.08,
                        transition: {
                            duration: 0.7,
                            ease: [0.22, 1, 0.36, 1],
                        },
                    }}
                    className="fixed inset-0 z-[999999] overflow-hidden flex items-center justify-center"
                    style={{
                        background: "var(--bg-primary)",
                    }}
                >
                    {/* Animated Background Gradients */}
                    <motion.div
                        className="absolute inset-0"
                        animate={{
                            scale: [1, 1.15, 1],
                            rotate: [0, 5, 0],
                        }}
                        transition={{
                            repeat: Infinity,
                            duration: 12,
                            ease: "linear",
                        }}
                        style={{
                            background: `
radial-gradient(circle at 50% 50%,
    rgba(193, 154, 107, .18),
    transparent 35%),

    radial-gradient(circle at 20% 20%,
        rgba(160, 70, 255, .12),
        transparent 40%),

    radial-gradient(circle at 80% 80%,
        rgba(193, 154, 107, .08),
        transparent 40%)
        `,
                        }}
                    />

                    {/* Grid */}
                    <div
                        className="absolute inset-0 opacity-[0.05]"
                        style={{
                            backgroundImage: `
linear-gradient(rgba(255, 255, 255, .12) 1px, transparent 1px),
    linear-gradient(90deg, rgba(255, 255, 255, .12) 1px, transparent 1px)
        `,
                            backgroundSize: "70px 70px",
                        }}
                    />

                    {/* Floating Background Icons */}
                    {backgroundIcons.map((item, idx) => {
                        const IconComponent = item.icon;
                        return (
                            <motion.div
                                key={idx}
                                className="absolute pointer-events-none select-none z-10" // Added z-10
                                style={{
                                    top: item.top,
                                    left: item.left,
                                    color: "var(--brand-gold)", // Ensure this is a valid color
                                    opacity: 0.4, // Increased from 0.06 to 0.4 for better visibility
                                }}
                                animate={{
                                    y: [0, -35, 0],
                                    x: [0, 15, 0],
                                    rotate: [0, 20, -10, 0],
                                }}
                                transition={{
                                    repeat: Infinity,
                                    duration: item.duration,
                                    ease: "easeInOut",
                                }}
                            >
                                <IconComponent size={20} strokeWidth={2} /> {/* Increased strokeWidth */}
                            </motion.div>
                        );
                    })}

                    {/* Floating Particles - Instant start */}
                    {particles.map((p) => (
                        <motion.span
                            key={p.id}
                            className="absolute rounded-full"
                            style={{
                                width: p.size,
                                height: p.size,
                                left: `${p.left}%`,
                                top: `${p.top}%`,
                                background: "var(--brand-gold)",
                                filter: "blur(.4px)",
                                opacity: 0.5,
                            }}
                            animate={{
                                y: [-20, 20, -20],
                                scale: [0.8, 1.2, 0.8],
                            }}
                            transition={{
                                repeat: Infinity,
                                duration: p.duration,
                                ease: "easeInOut",
                            }}
                        />
                    ))}

                    {/* Center Glow */}
                    <motion.div
                        className="absolute h-[340px] w-[340px] rounded-full blur-[90px]"
                        style={{
                            background: "var(--brand-gold)",
                            opacity: 0.18,
                        }}
                        animate={{
                            scale: [0.7, 1.05, 0.8],
                            opacity: [0.08, 0.25, 0.08],
                        }}
                        transition={{
                            duration: 4,
                            repeat: Infinity,
                        }}
                    />

                    {/* Purple Glow */}
                    <motion.div
                        className="absolute h-[460px] w-[460px] rounded-full blur-[130px]"
                        style={{
                            background: "var(--accent-primary)",
                            opacity: 0.12,
                        }}
                        animate={{
                            scale: [1, 1.15, 1],
                            rotate: [0, 20, 0],
                        }}
                        transition={{
                            duration: 8,
                            repeat: Infinity,
                        }}
                    />

                    {/* Logo Section - Animating concurrently with the background */}
                    <div className="relative flex flex-col items-center">

                        {/* Logo Wrapper with Pure Fade Effect */}
                        <motion.div
                            initial={{
                                opacity: 0,
                            }}
                            animate={{
                                opacity: 1,
                            }}
                            exit={{
                                opacity: 0,
                                transition: { duration: 0.4, ease: "easeInOut" }
                            }}
                            transition={{
                                duration: 0.8,
                                ease: "easeInOut",
                            }}
                            className="relative"
                        >
                            {/* Breathing Glow */}
                            <motion.div
                                className="absolute inset-0 rounded-full blur-3xl"
                                style={{
                                    background: "var(--brand-gold)",
                                    opacity: 0.25,
                                }}
                                animate={{
                                    scale: [0.9, 1.15, 0.95],
                                    opacity: [0.15, 0.3, 0.15],
                                }}
                                transition={{
                                    repeat: Infinity,
                                    duration: 2.5,
                                }}
                            />

                            <Image
                                src="/vb-logo.png"
                                alt="VelvetBook"
                                width={180}
                                height={180}
                                className="relative w-44 h-44 object-contain select-none"
                                priority
                            />

                            {/* Gold Shimmer */}
                            <motion.div
                                className="absolute inset-0 overflow-hidden rounded-full"
                            >
                                <motion.div
                                    className="absolute top-0 left-[-120%] h-full w-20 -skew-x-12"
                                    style={{
                                        background:
                                            "linear-gradient(90deg,transparent,rgba(255,255,255,.85),transparent)",
                                        filter: "blur(8px)",
                                    }}
                                    animate={{
                                        left: ["-120%", "160%"],
                                    }}
                                    transition={{
                                        repeat: Infinity,
                                        repeatDelay: 1,
                                        duration: 1.4,
                                        ease: "easeInOut",
                                        delay: 1,
                                    }}
                                />
                            </motion.div>
                        </motion.div>

                        {/* Sparkle */}
                        <motion.div
                            className="absolute -right-4 top-3"
                            initial={{ opacity: 0, scale: 0 }}
                            animate={{
                                opacity: [0, 1, 1, 0],
                                scale: [0, 1.4, 1, 0],
                                rotate: [0, 180, 360],
                                x: [-10, 10, -5],
                                y: [10, -12, 6],
                            }}
                            transition={{
                                delay: 0.8,
                                duration: 2,
                                repeat: Infinity,
                                repeatDelay: 1,
                            }}
                        >
                            <svg
                                width="22"
                                height="22"
                                viewBox="0 0 24 24"
                                fill="var(--brand-gold)"
                            >
                                <path d="M12 0l2.5 9.5L24 12l-9.5 2.5L12 24l-2.5-9.5L0 12l9.5-2.5z" />
                            </svg>
                        </motion.div>

                        {/* Brand Name */}
                        <motion.h1
                            initial={{
                                opacity: 0,
                                y: 30,
                                filter: "blur(12px)",
                            }}
                            animate={{
                                opacity: 1,
                                y: 0,
                                filter: "blur(0px)",
                            }}
                            transition={{
                                delay: 0.6,
                                duration: 0.8,
                            }}
                            className="mt-5 text-4xl tracking-[7px] font-semibold brand-logo"
                            style={{
                                color: "var(--logo-text)",
                            }}
                        >
                            VELVET
                            <span style={{ color: "var(--brand-gold)" }}>
                                BOOK
                            </span>
                        </motion.h1>

                        {/* Divider */}
                        <motion.div
                            initial={{
                                opacity: 0,
                                scaleX: 0,
                            }}
                            animate={{
                                opacity: 1,
                                scaleX: 1,
                            }}
                            transition={{
                                delay: 1,
                                duration: 0.7,
                            }}
                            className="mt-5 flex items-center gap-4"
                        >
                            <div
                                className="h-px w-20"
                                style={{
                                    background: "var(--brand-gold)",
                                }}
                            />

                            <motion.div
                                animate={{
                                    rotate: 360,
                                    scale: [1, 1.2, 1],
                                }}
                                transition={{
                                    repeat: Infinity,
                                    duration: 6,
                                    ease: "linear",
                                }}
                            >
                                <svg
                                    width="16"
                                    height="16"
                                    viewBox="0 0 24 24"
                                    fill="var(--brand-gold)"
                                >
                                    <path d="M12 0l2.5 9.5L24 12l-9.5 2.5L12 24l-2.5-9.5L0 12l9.5-2.5z" />
                                </svg>
                            </motion.div>

                            <div
                                className="h-px w-20"
                                style={{
                                    background: "var(--brand-gold)",
                                }}
                            />
                        </motion.div>

                        {/* Tagline */}
                        <motion.div
                            initial={{
                                opacity: 0,
                                y: 20,
                            }}
                            animate={{
                                opacity: 1,
                                y: 0,
                            }}
                            transition={{
                                delay: 1.2,
                                duration: 0.8,
                            }}
                            className="mt-4 flex items-center gap-2 uppercase text-[11px] tracking-[0.45em] font-semibold"
                        >
                            <span style={{ color: "var(--text-primary)" }}>
                                Beauty
                            </span>

                            <span
                                className="text-xl"
                                style={{
                                    color: "var(--brand-gold)",
                                }}
                            >
                                •
                            </span>

                            <span style={{ color: "var(--text-primary)" }}>
                                Wellness
                            </span>

                            <span
                                className="text-xl"
                                style={{
                                    color: "var(--brand-gold)",
                                }}
                            >
                                •
                            </span>

                            <span style={{ color: "var(--text-primary)" }}>
                                Yours
                            </span>
                        </motion.div>

                        {/* Loading Bar */}
                        <motion.div
                            initial={{ width: 0, opacity: 0 }}
                            animate={{ width: 220, opacity: 1 }}
                            transition={{
                                delay: 1.2,
                                duration: 0.4,
                            }}
                            className="relative mt-10 h-[3px] rounded-full overflow-hidden"
                            style={{
                                background: "rgba(255,255,255,.08)",
                            }}
                        >
                            <motion.div
                                className="absolute inset-y-0 left-0 rounded-full"
                                style={{
                                    background:
                                        "linear-gradient(90deg,var(--brand-gold),var(--accent-primary),var(--brand-gold))",
                                }}
                                initial={{
                                    width: 0,
                                }}
                                animate={{
                                    width: "100%",
                                }}
                                transition={{
                                    delay: 1.2,
                                    duration: (duration / 1000) - 1.2,
                                    ease: "linear",
                                }}
                            />

                            <motion.div
                                className="absolute top-0 h-full w-16"
                                style={{
                                    background:
                                        "linear-gradient(90deg,transparent,rgba(255,255,255,.9),transparent)",
                                    filter: "blur(4px)",
                                }}
                                animate={{
                                    x: [-40, 260],
                                }}
                                transition={{
                                    repeat: Infinity,
                                    duration: 1.4,
                                    ease: "linear",
                                }}
                            />
                        </motion.div>
                    </div>

                    {/* Corner Glows */}
                    <motion.div
                        className="absolute -top-40 -left-40 h-96 w-96 rounded-full blur-[120px]"
                        style={{
                            background: "var(--accent-primary)",
                            opacity: 0.08,
                        }}
                        animate={{
                            scale: [1, 1.2, 1],
                        }}
                        transition={{
                            repeat: Infinity,
                            duration: 7,
                        }}
                    />

                    <motion.div
                        className="absolute -bottom-40 -right-40 h-96 w-96 rounded-full blur-[120px]"
                        style={{
                            background: "var(--brand-gold)",
                            opacity: 0.08,
                        }}
                        animate={{
                            scale: [1.2, 1, 1.2],
                        }}
                        transition={{
                            repeat: Infinity,
                            duration: 7,
                        }}
                    />
                </motion.div>
            )}
        </AnimatePresence>
    );
}