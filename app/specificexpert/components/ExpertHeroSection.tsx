import Image from "next/image";
import { BadgeCheck, Clock3, Play, Star } from "lucide-react";

import { ExpertProfile } from "../expert.types";

interface ExpertHeroSectionProps {
  expert: ExpertProfile;
}

export function ExpertHeroSection({ expert }: ExpertHeroSectionProps) {
  return (
    <section
      className="
        relative overflow-hidden rounded-xl px-2 pb-4 pt-2
        bg-[var(--bg-card)]
      "
    >
      <div
        className="
          pointer-events-none absolute inset-0 opacity-40
          bg-[radial-gradient(ellipse_at_top,rgba(193,154,107,0.12)_0%,transparent_55%)]
        "
      />
      <div
        className="
          pointer-events-none absolute inset-x-0 top-8 h-24
          bg-[repeating-linear-gradient(90deg,transparent,transparent_18px,rgba(193,154,107,0.08)_18px,rgba(193,154,107,0.08)_19px)]
        "
      />

      <div className="relative flex flex-col items-center">
        <div className="relative">
          <div
            className="
              relative h-24 w-24 overflow-hidden rounded-full
              border-2 border-[var(--brand-gold)]
            "
          >
            <Image
              src={expert.image}
              alt={expert.name}
              fill
              sizes="96px"
              className="object-cover"
              priority
            />
          </div>

          <button
            type="button"
            aria-label="Play expert video"
            className="
              primary-button absolute -bottom-1 left-1/2 flex h-7 w-7
              -translate-x-1/2 items-center justify-center rounded-full
            "
          >
            <Play size={12} className="ml-0.5 fill-white text-white" />
          </button>
        </div>

        <div className="mt-3 flex items-center gap-1">
          <h1 className="text-lg font-semibold text-[var(--text-primary)]">
            {expert.name}
          </h1>
          <BadgeCheck
            size={16}
            className="text-[var(--brand-gold)]"
            strokeWidth={1.8}
          />
        </div>

        <div className="mt-1.5 flex w-full items-center gap-2 px-4">
          <div className="h-px flex-1 bg-[var(--border)]" />
          <span className="shrink-0 text-[9px] text-[var(--text-muted)]">
            {expert.title}
          </span>
          <div className="h-px flex-1 bg-[var(--border)]" />
        </div>

        <div className="mt-3 flex items-center gap-3 text-[9px] text-[var(--text-secondary)]">
          <div className="flex items-center gap-0.5">
            <Star
              size={10}
              className="fill-[var(--brand-gold)] text-[var(--brand-gold)]"
            />
            <span className="font-medium text-[var(--text-primary)]">
              {expert.rating}
            </span>
          </div>

          <span className="h-3 w-px bg-[var(--border)]" />

          <span>{expert.reviews} Reviews</span>

          <span className="h-3 w-px bg-[var(--border)]" />

          <div className="flex items-center gap-0.5">
            <Clock3 size={10} strokeWidth={1.6} className="text-[var(--brand-gold)]" />
            <span>{expert.experience}</span>
          </div>
        </div>
      </div>
    </section>
  );
}
