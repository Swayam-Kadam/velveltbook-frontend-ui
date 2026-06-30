"use client";

import Image from "next/image";
import { Check, Clock3 } from "lucide-react";

import { MenuService } from "../menu.data";

interface ServiceCardProps {
  service: MenuService;
  selected?: boolean;
  onSelect?: (service: MenuService) => void;
}

export function ServiceCard({ service, selected, onSelect }: ServiceCardProps) {
  return (
    <article
      onClick={() => onSelect?.(service)}
      className={`
        feature-card group relative cursor-pointer overflow-hidden rounded-xl
        transition-all duration-300
        hover:border-[color-mix(in_srgb,var(--accent-secondary)_25%,var(--border))]
        hover:shadow-(--shadow-glow)
        active:scale-[0.98]
        ${
          selected
            ? "border-(--accent-secondary) shadow-(--shadow-glow)"
            : ""
        }
      `}
    >
      {selected && (
        <span
          className="
            absolute right-1 top-1 z-10 flex h-5 w-5 items-center justify-center
            rounded-full bg-(--accent-primary) text-white
            shadow-[0_0_8px_color-mix(in_srgb,var(--accent-glow)_45%,transparent)]
          "
        >
          <Check size={11} strokeWidth={2.5} />
        </span>
      )}

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
            rounded-full bg-(--bg-card)/80 backdrop-blur-sm
            transition-colors duration-200
            hover:text-(--accent-secondary)
          "
        >
          <Heart
            size={10}
            strokeWidth={1.8}
            className="text-(--brand-gold)"
          />
        </button> */}
      </div>

      <div className="space-y-0.5 p-1.5">
        <h3 className="line-clamp-2 text-[12px] font-bold leading-tight text-(--text-primary) h-8">
          {service.title}
        </h3>

        <p className="text-[12px] font-bold text-(--brand-gold)">
          {service.price}
        </p>

        <div className="flex items-center gap-0.5 text-[9px] font-bold text-(--text-primary)">
          <Clock3 size={9} strokeWidth={3} />
          <span>{service.duration}</span>
        </div>
      </div>
    </article>
  );
}
