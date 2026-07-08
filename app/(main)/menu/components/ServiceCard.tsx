"use client";

import Image from "next/image";
import { Check, Clock3 } from "lucide-react";

import { MenuService } from "../menu.data";

interface ServiceCardProps {
  service: MenuService;
  compact?: boolean;
  selected?: boolean;
  onSelect?: () => void;
}

export function ServiceCard({
  service,
  compact = false,
  selected = false,
  onSelect,
}: ServiceCardProps) {
  if (compact) {
    return (
      <article
        onClick={() => onSelect?.()}
        className={`
          feature-card group flex h-full flex-col overflow-hidden rounded-xl
          transition-all duration-300
          hover:border-[color-mix(in_srgb,var(--accent-secondary)_25%,var(--border))]
          hover:shadow-(--shadow-glow)
          ${selected ? "border-(--accent-primary) shadow-(--shadow-glow)" : ""}
        `}
      >
        <div className="relative h-[88px] shrink-0 overflow-hidden rounded-t-xl">
          <Image
            src={service.image}
            alt={service.title}
            fill
            sizes="80px"
            className="object-cover transition-transform duration-300 group-hover:scale-105"
          />

          {onSelect && (
            <button
              type="button" 
              // onClick={onSelect}
              aria-label={selected ? `Deselect ${service.title}` : `Select ${service.title}`}
              className={`
                absolute right-0.5 top-0.5 z-10 flex h-3.5 w-3.5 items-center
                justify-center rounded-full border-2 transition-all duration-200
                ${
                  selected
                    ? "primary-button border-(--accent-primary) text-white"
                    : "border-white bg-white/90"
                }
              `}
            >
              {selected && <Check size={8} strokeWidth={3} />}
            </button>
           )}
        </div>

        <div className="flex flex-1 flex-col p-1">
          <h3 className="line-clamp-2 min-h-[24px] text-[10px] font-bold leading-tight text-(--text-primary)">
            {service.title}
          </h3>

          <div className="mt-auto flex shrink-0 items-center justify-between gap-0.5">
            <p className="text-[8px] font-bold text-(--brand-gold)">
              {service.price}
            </p>
            <div className="flex shrink-0 items-center gap-0.5 text-[7px] font-bold text-(--text-primary)">
              <Clock3 size={7} strokeWidth={3} />
              <span>{service.duration}</span>
            </div>
          </div>
        </div>
      </article>
    );
  }

  return (
    <button
      type="button"
      onClick={() => onSelect?.()}
      className={`
        feature-card group overflow-hidden rounded-xl text-left
        transition-all duration-300
        hover:border-[color-mix(in_srgb,var(--accent-secondary)_25%,var(--border))]
        hover:shadow-(--shadow-glow)
        active:scale-[0.98]
        ${selected ? "border-(--accent-primary) shadow-(--shadow-glow)" : ""}
      `}
      aria-pressed={selected}
      disabled={!onSelect}
    >
      <div className="relative h-[72px] overflow-hidden">
        <Image
          src={service.image}
          alt={service.title}
          fill
          sizes="100px"
          className="object-cover transition-transform duration-300 group-hover:scale-105"
        />

        {onSelect && (
            <button
              type="button" 
              // onClick={onSelect}
              aria-label={selected ? `Deselect ${service.title}` : `Select ${service.title}`}
              className={`
                absolute right-0.5 top-0.5 z-10 flex h-3.5 w-3.5 items-center
                justify-center rounded-full border-2 transition-all duration-200
                ${
                  selected
                    ? "primary-button border-(--accent-primary) text-white"
                    : "border-white bg-white/90"
                }
              `}
            >
              {selected && <Check size={8} strokeWidth={3} />}
            </button>
           )}
           
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
    </button>
  );
}
