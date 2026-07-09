"use client";

import Link from "next/link";
import { Navigation, Share2 } from "lucide-react";
import { TimingsDropdown } from "@/components/TimingsDropdown";

import type { HeroViewModel } from "../types";

interface Props {
  hero: HeroViewModel;
}

export default function HeroBadges({ hero }: Props) {
  return (
    <div className="flex items-center gap-2">
      <TimingsDropdown
        summary={hero.timing}
        buttonClassName="primary-button inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-[11px] font-medium text-white backdrop-blur-md lg:px-4 lg:py-2 lg:text-xs"
        type="Right-most"
/>

      <Link
        href="#"
        aria-label="Get directions"
        className="primary-button flex h-8 w-8 items-center justify-center rounded-full text-white backdrop-blur-md lg:h-9 lg:w-9"
      >
        <Navigation size={14} />
      </Link>

      <Link
        href="#"
        aria-label="Share store"
        className="primary-button flex h-8 w-8 items-center justify-center rounded-full text-white backdrop-blur-md lg:h-9 lg:w-9"
      >
        <Share2 size={14} />
      </Link>
    </div>
  );
}
