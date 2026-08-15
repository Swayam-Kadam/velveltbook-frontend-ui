"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { ChevronDown } from "lucide-react";

export interface FilterChipOption {
  id: string;
  label: string;
  image: string;
}

interface LocationSliderProps {
  locations: FilterChipOption[];
  selectedLocation: string | null;
  onSelectLocation: (location: string) => void;
  filterLabel: string;
}

export function LocationSlider({
  locations,
  selectedLocation,
  onSelectLocation,
  filterLabel,
}: LocationSliderProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setMenuOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <>
      <div ref={menuRef} className="relative lg:hidden">
        <div className="scrollbar-none flex items-center gap-2 overflow-x-auto pb-0.5">
          <button
            type="button"
            onClick={() => setMenuOpen((open) => !open)}
            className="inline-flex shrink-0 items-center gap-1 rounded-md bg-[#2D1659] px-3 py-2 text-[11px] font-semibold text-white"
          >
            {filterLabel}
            <ChevronDown
              size={12}
              className={`transition-transform ${menuOpen ? "rotate-180" : ""}`}
            />
          </button>

          {locations.map((location) => {
            const active = selectedLocation === location.id;

            return (
              <button
                key={location.id}
                type="button"
                onClick={() => onSelectLocation(location.id)}
                className={`
                  shrink-0 rounded-md border px-3 py-2 text-[11px] font-medium
                  whitespace-nowrap
                  ${
                    active
                      ? "border-[#2D1659] bg-[#2D1659] text-white"
                      : "border-(--border) bg-white text-(--text-primary)"
                  }
                `}
              >
                {location.label}
              </button>
            );
          })}
        </div>

        {menuOpen && (
          <div className="absolute top-[calc(100%+6px)] left-0 z-20 min-w-[160px] overflow-hidden rounded-lg border border-(--border) bg-(--bg-card) py-1 shadow-(--shadow-card)">
            {locations.map((location) => {
              const active = selectedLocation === location.id;
              return (
                <button
                  key={location.id}
                  type="button"
                  onClick={() => {
                    onSelectLocation(location.id);
                    setMenuOpen(false);
                  }}
                  className={`
                    flex w-full px-3 py-2 text-left text-[11px] font-medium
                    ${
                      active
                        ? "bg-[#2D1659] text-white"
                        : "text-(--text-primary) hover:bg-(--bg-secondary)"
                    }
                  `}
                >
                  {location.label}
                </button>
              );
            })}
          </div>
        )}
      </div>

      <div className="hidden lg:grid lg:grid-cols-12 lg:gap-2">
        {locations.map((location) => {
          const active = selectedLocation === location.id;

          return (
            <button
              key={location.id}
              type="button"
              onClick={() => onSelectLocation(location.id)}
              className={`
                group flex min-w-0 w-full flex-col items-center justify-center gap-1.5
                rounded-[8px] border bg-(--bg-card) px-1.5 py-2 shadow-(--shadow-card)
                transition-all duration-300 hover:-translate-y-[1px]
                hover:border-(--brand-gold)
                ${active ? "border-(--brand-gold)" : "border-(--border)"}
              `}
            >
              <span
                className={`
                  relative aspect-square w-full overflow-hidden rounded-[6px] border
                  ${active ? "border-(--brand-gold)" : "border-(--border) group-hover:border-(--brand-gold)/60"}
                `}
              >
                <Image
                  src={location.image}
                  alt={location.label}
                  fill
                  sizes="80px"
                  className="object-cover"
                />
              </span>

              <span
                className={`
                  w-full truncate text-center text-[10px] font-medium
                  ${
                    active
                      ? "text-(--text-primary)"
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
    </>
  );
}
