"use client";

import Image from "next/image";
import { Bell, ChevronDown } from "lucide-react";

import { ThemeToggle } from "@/components/ThemeToggle";

export function Header() {
    return (
        <header className="flex flex-col gap-3 px-2 pt-4 sm:px-6 sm:pt-6">
            <div className="flex items-center justify-between">
                <div className="flex min-w-0 items-center">
                    <Image
                        src="/logo.png"
                        alt="Velvetbook"
                        width={48}
                        height={48}
                        priority
                        className="h-10 w-10 shrink-0 sm:h-12 sm:w-12"
                    />

                    <h1 className="hidden min-[331px]:block brand-logo text-[18px] font-semibold leading-none tracking-[0.02em] text-(--brand-gold)">
                        VELVETBOOK
                    </h1>
                </div>

                <div className="flex items-center gap-2">
                    <ThemeToggle />

                    <button
                        className="
    relative flex h-[38px] w-[38px] items-center justify-center
    rounded-full border border-[color-mix(in_srgb,var(--accent-glow)_10%,var(--border))]
    bg-[radial-gradient(circle_at_top,var(--bg-card-hover)_0%,var(--bg-card)_70%)]
    backdrop-blur-2xl
    shadow-[
      inset_0_1px_0_color-mix(in_srgb,var(--accent-glow)_8%,transparent),
      inset_0_0_20px_color-mix(in_srgb,var(--accent-glow)_4%,transparent),
      0_0_0_1px_color-mix(in_srgb,var(--accent-glow)_4%,transparent)
    ]
    transition-all duration-300
    hover:border-[color-mix(in_srgb,var(--accent-glow)_18%,var(--border))]
    hover:shadow-[
      inset_0_1px_0_color-mix(in_srgb,var(--accent-glow)_10%,transparent),
      inset_0_0_24px_color-mix(in_srgb,var(--accent-glow)_6%,transparent),
      0_0_18px_color-mix(in_srgb,var(--accent-glow)_12%,transparent)
    ]
  "
                    >
                        <Bell
                            className="h-4 w-4 text-(--text-primary)"
                            strokeWidth={1.6}
                        />

                        <span
                            className="
      absolute -right-[2px] top-[2px]
      flex h-3 w-3 items-center justify-center
      rounded-full
      bg-(--accent-primary)
      text-[11px] font-semibold text-white
      shadow-[0_0_12px_color-mix(in_srgb,var(--accent-glow)_40%,transparent)]
    "
                        >
                            2
                        </span>
                    </button>

                    <button className="flex items-center gap-1">
                        <div className="relative h-9.5 w-9.5 overflow-hidden rounded-full border-2 border-(--brand-gold)">
                            <Image
                                src="/profile.jpeg"
                                alt="Profile"
                                fill
                                sizes="38px"
                                className="object-cover"
                            />
                        </div>

                        <ChevronDown className="h-4 w-4 text-text-secondary" />
                    </button>
                </div>
            </div>


            
        </header>
    );
}