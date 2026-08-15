"use client";

import { useState } from "react";
import { MapPin, Search, SlidersHorizontal } from "lucide-react";

import { EnableLocationModal } from "./EnableLocationModal";

interface SearchBarProps {
  className?: string;
  placeholder?: string;
  value?: string;
  onChange?: (value: string) => void;
  onFilterClick?: () => void;
}

export function SearchBar({
  className = "",
  placeholder = "Search services, salons, spas...",
  value,
  onChange,
  onFilterClick,
}: SearchBarProps) {
  const [locationModalOpen, setLocationModalOpen] = useState(false);
  const [locationLabel, setLocationLabel] = useState("Enable location");

  const handleEnableLocation = () => {
    if (typeof navigator === "undefined" || !navigator.geolocation) {
      setLocationLabel("Location unavailable");
      setLocationModalOpen(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      () => {
        setLocationLabel("Near you");
        setLocationModalOpen(false);
      },
      () => {
        setLocationLabel("Enable location");
        setLocationModalOpen(false);
      },
      { enableHighAccuracy: false, timeout: 8000, maximumAge: 60000 },
    );
  };

  return (
    <>
      <div
        className={`
          search-glass
          mt-3 flex h-12 w-full items-center rounded-sm border
          px-3 backdrop-blur-2xl transition-all duration-300
          hover:border-[color-mix(in_srgb,var(--accent-glow)_18%,transparent)]
          lg:mt-0
          ${className}
        `}
      >
        <div className="flex min-w-0 flex-1 items-center gap-2.5 pl-1.5">
          <Search
            className="h-4 w-4 shrink-0 text-(--text-secondary)"
            strokeWidth={1.6}
          />
          <input
            type="text"
            value={value ?? ""}
            onChange={(e) => onChange?.(e.target.value)}
            placeholder={placeholder}
            className="
              min-w-0 flex-1 bg-transparent text-[12px] text-(--text-primary)
              placeholder:text-(--text-muted) focus:outline-none
            "
          />
        </div>

        <span
          className=" h-5 w-px shrink-0 bg-(--border)"
          aria-hidden
        />

        <button
          type="button"
          onClick={() => setLocationModalOpen(true)}
          aria-label="Enable location"
          className="
            inline-flex shrink-0 items-center gap-1.5 px-1.5
            text-(--accent-primary) transition-opacity hover:opacity-80
          "
        >
          <MapPin className="h-3.5 w-3.5 shrink-0" strokeWidth={2} />
          <span className="whitespace-nowrap text-[11px] font-semibold">
            {locationLabel}
          </span>
        </button>

        <span
          className=" h-5 w-px shrink-0 bg-(--border)"
          aria-hidden
        />

        <button
          type="button"
          onClick={onFilterClick}
          aria-label="Open filters"
          className="
            flex h-8 w-8 shrink-0 items-center justify-center
            text-(--accent-primary) transition-transform duration-300
            hover:rotate-90
          "
        >
          <SlidersHorizontal className="h-4 w-4" strokeWidth={1.8} />
        </button>
      </div>

      <EnableLocationModal
        open={locationModalOpen}
        onClose={() => setLocationModalOpen(false)}
        onEnable={handleEnableLocation}
      />
    </>
  );
}
