"use client";

import Image from "next/image";
import { Clock3, Heart } from "lucide-react";

import { MenuService } from "../menu.data";

interface ServiceCardProps {
  service: MenuService;
}

export function ServiceCard({ service }: ServiceCardProps) {
  return (
    <article
      className="
        feature-card group cursor-pointer overflow-hidden rounded-xl
        transition-all duration-300
        hover:border-[color-mix(in_srgb,var(--accent-secondary)_25%,var(--border))]
        hover:shadow-[var(--shadow-glow)]
        active:scale-[0.98]
      "
    >
      <div className="relative h-[72px] overflow-hidden">
        <Image
          src={service.image}
          alt={service.title}
          fill
          sizes="100px"
          className="object-cover transition-transform duration-300 group-hover:scale-105"
        />

        {/* <button
          type="button"
          aria-label={`Save ${service.title}`}
          className="
            absolute right-1 top-1 flex h-5 w-5 items-center justify-center
            rounded-full bg-[var(--bg-card)]/80 backdrop-blur-sm
            transition-colors duration-200
            hover:text-[var(--accent-secondary)]
          "
        >
          <Heart
            size={10}
            strokeWidth={1.8}
            className="text-[var(--brand-gold)]"
          />
        </button> */}
      </div>

      <div className="space-y-0.5 p-1.5">
        <h3 className="line-clamp-2 text-[9px] font-bold leading-tight text-[var(--text-primary)]">
          {service.title}
        </h3>

        <p className="text-[9px] font-semibold text-[var(--brand-gold)]">
          {service.price}
        </p>

        <div className="flex items-center gap-0.5 text-[7px] text-[var(--text-muted)]">
          <Clock3 size={8} strokeWidth={1.6} />
          <span>{service.duration}</span>
        </div>
      </div>
    </article>
  );
}
