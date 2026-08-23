"use client";

import { useEffect, useRef, useState } from "react";
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

function LocationTab({
  location,
  active,
  onSelect,
  fit,
}: {
  location: FilterChipOption;
  active: boolean;
  onSelect: (id: string) => void;
  fit?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={() => onSelect(location.id)}
      className={`
        rounded-sm border px-3 py-2 text-[11px] font-medium
        ${fit ? "min-w-0 flex-1 truncate text-center" : "shrink-0 whitespace-nowrap"}
        ${
          active
            ? "border-[#2D1659] border-(--text-primary) text-(--text-primary)"
            : "border-(--border) bg-white text-(--text-primary)"
        }
      `}
    >
      {location.label}
    </button>
  );
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
            // onClick={() => setMenuOpen((open) => !open)}
            className="inline-flex shrink-0 items-center gap-1 rounded-sm primary-button px-3 py-2 text-[14px] font-semibold text-white"
          >
            {filterLabel}
            <ChevronDown
              size={12}
              className={`transition-transform ${menuOpen ? "rotate-180" : ""}`}
            />
          </button>

          {locations.map((location) => (
            <LocationTab
              key={location.id}
              location={location}
              active={selectedLocation === location.id}
              onSelect={onSelectLocation}
            />
          ))}
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

      <div className="hidden w-full items-center gap-2 overflow-hidden lg:flex">
        <button
          type="button"
          className="inline-flex shrink-0 items-center gap-1 rounded-sm primary-button px-3 py-2 text-[14px] font-semibold text-white"
        >
          {filterLabel}
          <ChevronDown size={12} />
        </button>

        {locations.map((location) => (
          <LocationTab
            key={location.id}
            location={location}
            active={selectedLocation === location.id}
            onSelect={onSelectLocation}
            fit
          />
        ))}
      </div>
    </>
  );
}
