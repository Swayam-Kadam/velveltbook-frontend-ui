"use client";

import Image from "next/image";
import { Share2 } from "lucide-react";

interface HeroSlideProps {
    image: string;
    title: string;
    description: string;
    time: string;
}

export function HeroSlide({
    image,
    title,
    description,
    time,
}: HeroSlideProps) {
    const titleLines = title.split("\n");

    return (
        <div className="relative overflow-hidden rounded-xl border border-(--border) dark:border-white/10 lg:rounded-[8px]">
            <div className="relative min-h-[200px] w-full lg:min-h-[330px] xl:min-h-[330px]">
                <Image
                    src={image}
                    alt={title}
                    fill
                    sizes="(max-width: 1024px) 100vw, 80vw"
                    priority
                    className="object-cover"
                />

                {/* Light theme white gradient */}
                <div
                    className="
    absolute inset-y-0 left-0 w-[72%]
    bg-[linear-gradient(90deg,rgba(255,255,255,0.98)_0%,rgba(255,255,255,0.82)_48%,rgba(255,255,255,0.35)_72%,transparent_100%)]
    [.dark_&]:hidden
  "
                />

                {/* Dark theme overlays */}
                <div className="absolute inset-0 hidden bg-black/20 [.dark_&]:block" />

                <div
                    className="
    absolute inset-0 hidden
    bg-[rgba(4,1,10,0.18)]
    [.dark_&]:block
  "
                />

                <div
                    className="
    absolute inset-y-0 left-0 hidden w-[68%]
    bg-[linear-gradient(90deg,rgba(10,4,25,0.96)_0%,rgba(35,12,65,0.92)_42%,rgba(7,1,15,0.72)_68%,transparent_100%)]
    [.dark_&]:block
  "
                />

                <div
                    className="
    absolute -left-[12%] top-1/2 hidden
    h-[140%] w-[85%]
    -translate-y-1/2
    rounded-full
    bg-[radial-gradient(circle,#8B5CF6_0%,transparent_68%)]
    opacity-30 blur-[56px]
    [.dark_&]:block
  "
                />

                <div
                    className="
                        absolute inset-y-0 left-[42%] hidden w-[28%]
                        bg-[radial-gradient(ellipse_at_left,rgba(0,0,0,0.18)_0%,transparent_72%)]
                        blur-xl
                        [.dark_&]:block
                    "
                />

                {/* Content */}
                <div className="absolute inset-0 flex flex-col justify-center p-5 lg:p-20">
                    <div className="absolute right-2 top-2 flex items-center justify-between gap-1 lg:hidden">
                        <div className="primary-button rounded-full bg-white/15 px-4 py-1 text-[8px] font-medium text-white backdrop-blur-md">
                            {time}
                        </div>
                        <button className="flex h-5 w-5 items-center justify-center rounded-full bg-white/15 text-white backdrop-blur-md">
                            <Share2 size={12} />
                        </button>
                    </div>

                    <div className="max-w-[55%] min-h-[50px] lg:max-w-[440px]">
                        <h2
                            className="
                                mb-3 whitespace-pre-line
                                text-[24px] font-semibold leading-[24px]
                                text-(--accent-primary)  [.dark_&]:text-[#E6BE78]
                                lg:mb-5 lg:text-[64px] lg:leading-[58px]
                            "
                        >
                            {titleLines.map((line, index) => (
                                <span
                                    key={line}
                                    className={index > 0 ? "lg:text-(--brand-gold)" : ""}
                                >
                                    {line}
                                    {index < titleLines.length - 1 && <br />}
                                </span>
                            ))}
                        </h2>

                        <p className="max-w-[220px] text-[12px] text-var(--accent-primary)] [.dark_&]:text-white lg:max-w-[360px] lg:text-[16px] lg:leading-7 lg:text-(--text-primary)">
                            {description}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
