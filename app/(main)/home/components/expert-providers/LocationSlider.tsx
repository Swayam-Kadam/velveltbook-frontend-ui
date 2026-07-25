"use client";

import Image from "next/image";

import type {
  ExpertLocationId,
  ExpertLocationOption,
} from "./expert-providers.types";

interface LocationSliderProps {
  locations: ExpertLocationOption[];
  selectedLocation: ExpertLocationId | null;
  onSelectLocation: (location: ExpertLocationId) => void;
}

export function LocationSlider({
  locations,
  selectedLocation,
  onSelectLocation,
}: LocationSliderProps) {
  return (
    <div
      className="
        scrollbar-hide flex gap-3 overflow-x-auto px-0.5 pb-1
        [-ms-overflow-style:none] [scrollbar-width:none]
        lg:grid lg:grid-cols-11 lg:gap-2.5 lg:overflow-visible lg:pb-0
      "
    >
      {locations.map((location) => {
        const active = selectedLocation === location.id;

        return (
          <button
            key={location.id}
            type="button"
            onClick={() => onSelectLocation(location.id)}
            className={`
              group flex w-[64px] shrink-0 flex-col items-center gap-1.5
              lg:h-auto lg:w-full lg:justify-center lg:gap-2
              lg:rounded-[8px] lg:border lg:bg-(--bg-card) lg:p-3
              lg:shadow-(--shadow-card) lg:transition-all lg:duration-300
              lg:hover:-translate-y-[1px] lg:hover:border-(--brand-gold)
              ${
                active
                  ? "lg:border-(--brand-gold)"
                  : "lg:border-(--border)"
              }
            `}
          >
            <span
              className={`
                relative h-12 w-12 overflow-hidden rounded-full border-2
                transition-all duration-200
                lg:aspect-square lg:h-auto lg:w-full lg:rounded-[6px] lg:border
                ${
                  active
                    ? "border-(--brand-gold) shadow-[0_0_0_2px_color-mix(in_srgb,var(--brand-gold)_35%,transparent)] lg:shadow-none"
                    : "border-(--border) group-hover:border-(--brand-gold)/60"
                }
              `}
            >
              <Image
                src={location.image}
                alt={location.label}
                fill
                sizes="(min-width: 1024px) 80px, 48px"
                className="object-cover"
              />
            </span>

            <span
              className={`
                line-clamp-2 text-center text-[9px] leading-tight transition-colors
                lg:line-clamp-1 lg:text-[11px] lg:font-medium
                ${
                  active
                    ? "font-medium text-(--text-primary)"
                    : "text-(--text-secondary) group-hover:text-(--text-primary)"
                }
              `}
            >
              {location.label}
            </span>
          </button>
        );
      })}
    </div>
  );
}
