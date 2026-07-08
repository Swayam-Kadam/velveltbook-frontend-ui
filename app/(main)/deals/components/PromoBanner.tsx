"use client";

import { Bell, Percent } from "lucide-react";
import type { DealType } from "../deals.types";

interface PromoBannerProps {
  dealType: DealType;
}

const bannerContent = {
  single: {
    title: "Exclusive Deals Every Week!",
    subtitle: "New offers on your favorite services. Don't miss out!",
  },
  package: {
    title: "Exclusive Packages, Exclusive You!",
    subtitle: "Save more with our curated packages.",
  },
};

export function PromoBanner({ dealType }: PromoBannerProps) {
  const { title, subtitle } = bannerContent[dealType];

  return (
    <section
      className="
        mx-1 flex items-center gap-3
        rounded-2xl border border-(--border)
        bg-[color-mix(in_srgb,var(--accent-primary)_8%,var(--bg-card))]
        p-3
      "
    >
      <div
        className="
          primary-button
          flex h-10 w-10 shrink-0 items-center justify-center
          rounded-full text-white
        "
      >
        <Percent size={18} strokeWidth={1.5} />
      </div>

      <div className="min-w-0 flex-1">
        <p className="text-[11px] font-semibold text-(--text-primary)">{title}</p>
        <p className="mt-0.5 text-[9px] leading-snug text-(--text-secondary)">
          {subtitle}
        </p>
      </div>

      <button
        type="button"
        className="
          primary-button
          flex shrink-0 items-center gap-1
          rounded-xl px-3 py-2
          text-[9px] font-medium text-white
          transition-transform active:scale-[0.98]
        "
      >
        <Bell size={12} strokeWidth={1.5} />
        Notify Me
      </button>
    </section>
  );
}
