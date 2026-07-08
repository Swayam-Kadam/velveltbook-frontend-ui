"use client";

import Link from "next/link";
import { CalendarDays, PlayCircle } from "lucide-react";

import type { HeroViewModel } from "../types";

interface Props {
  hero: HeroViewModel;
}

export default function HeroActions({ hero }: Props) {
  return (
    <div className="flex w-full flex-nowrap items-center gap-1.5 sm:mt-1 sm:gap-2">
      <Link
        href={hero.bookNowHref}
        className="primary-button inline-flex h-8 min-w-0 flex-1 items-center justify-center gap-1 rounded-lg px-2 text-[8px] font-medium text-white sm:gap-1.5 sm:text-[11px] lg:h-9 lg:text-xs"
      >
        <CalendarDays size={12} className="shrink-0 lg:size-3.5" />
        <span className="truncate">{hero.bookNowLabel}</span>
      </Link>

      <Link
        href={hero.videoUrl}
        className="inline-flex h-8 min-w-0 flex-1 items-center justify-center gap-1 rounded-lg border border-(--border) bg-(--bg-secondary) px-2 text-[8px] font-medium text-(--text-primary) shadow-[var(--shadow-card)] transition-colors hover:bg-(--bg-card-hover) sm:gap-1.5 sm:text-[11px] lg:h-9 lg:text-xs"
      >
        <PlayCircle size={12} className="shrink-0 text-(--accent-primary) lg:size-3.5" />
        <span className="truncate">{hero.watchVideoLabel}</span>
      </Link>
    </div>
  );
}
