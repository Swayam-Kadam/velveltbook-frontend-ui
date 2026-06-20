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
    return (
        <div className="relative overflow-hidden rounded-xl border border-white/10">
            <div className="relative min-h-[200px] w-full">
                <Image
                    src={image}
                    alt={title}
                    fill
                    sizes="(max-width: 768px) 100vw, 50vw"
                    priority
                    className="object-cover"
                />

                {/* Dark overlay */}
                <div className="absolute inset-0 bg-black/20" />

                {/* Base dark overlay */}
                <div
                    className="
    absolute inset-0
    bg-[rgba(4,1,10,0.18)]
  "
                />

                {/* Main left gradient */}
                <div
                    className="
    absolute inset-y-0 left-0 w-[68%]
    bg-[linear-gradient(90deg,rgba(10,4,25,0.96)_0%,rgba(35,12,65,0.92)_42%,rgba(7,1,15,0.72)_68%,transparent_100%)]
  "
                />

                {/* Purple bloom */}
                <div
                    className="
    absolute -left-[12%] top-1/2
    h-[140%] w-[85%]
    -translate-y-1/2
    rounded-full
    bg-[radial-gradient(circle,#8B5CF6_0%,transparent_68%)]
    opacity-30 blur-[56px]
  "
                />

                {/* Soft center fade */}
                <div
                    className="
    absolute inset-y-0 left-[42%] w-[28%]
    bg-[radial-gradient(ellipse_at_left,rgba(0,0,0,0.18)_0%,transparent_72%)]
    blur-xl
  "
                />

                {/* Content */}
                <div className="absolute inset-0 flex flex-col justify-center p-5">
                    <div className="absolute right-2 top-2 flex items-center justify-between gap-1">
                        <div className="primary-button rounded-full bg-white/15 px-4 py-1 text-[8px] font-medium text-white backdrop-blur-md">
                            {time}
                        </div>
                        <button className="flex h-5 w-5 items-center justify-center rounded-full bg-white/15 text-white backdrop-blur-md">
                            <Share2 size={12} />
                        </button>
                    </div>

                    <div className="max-w-[55%] min-h-[50px]">
                        <h2
                            className="
        mb-3 whitespace-pre-line
        text-[24px] font-semibold leading-[24px]
        text-[#E6BE78]
    "
                        >
                            {title}
                        </h2>

                        <p className="max-w-[220px] text-[12px] text-white">
                            {description}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}