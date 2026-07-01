"use client";

import Link from "next/link";
import { Navigation, Share2 } from "lucide-react";

import type { HeroViewModel } from "../types";
import { PillBadge } from "../shared/Badge";

interface Props {
  hero: HeroViewModel;
}

export default function HeroBadges({ hero }: Props) {
  return (
    <div className="flex items-center gap-2">
      <PillBadge label={hero.timing} />

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
