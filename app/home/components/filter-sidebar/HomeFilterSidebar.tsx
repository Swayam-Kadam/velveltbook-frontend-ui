"use client";
import { useEffect, useMemo, useRef, useState } from "react";
import {
  CalendarDays,
  ChevronDown,
  ChevronRight,
  MapPin,
  X,
} from "lucide-react";

import { Button } from "@/components/Button";


const serviceCategories = [
  "Barber",
  "Salon",
  "Spa",
  "Massage",
  "Tattoo",
  "Nails",
  "Makeup",
];

const priceRanges = [
  "Any Price",
  "$0 - $20",
  "$50 - $100",
  "$100 - $150",
  "$150 & above",
];

const nationality = [
  "Aussie",
  "Vietnamese",
  "Chinesse",
  "Thai",
  "Phillipis",
  "Japaneese",
  "Mix",
];

const locations = [
  "Indore, India",
  "Bhopal, India",
  "Delhi, India",
  "Mumbai, India",
  "Bangalore, India",
];

const availability = ["Anytime", "Today", "Tomorrow"];

interface HomeFilterSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export function HomeFilterSidebar({
  isOpen,
  onClose,
}: HomeFilterSidebarProps) {
  const [selectedLocation, setSelectedLocation] = useState("Indore, India");
  const [locationInput, setLocationInput] = useState("Indore, India");
  const [locationOpen, setLocationOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState("");
  const dateInputRef = useRef<HTMLInputElement>(null);
  const locationRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  const filteredLocations = useMemo(() => {
    const query = locationInput.trim().toLowerCase();
    if (!query || query === selectedLocation.toLowerCase()) return locations;
    return locations.filter((location) =>
      location.toLowerCase().includes(query),
    );
  }, [locationInput, selectedLocation]);

  const commitLocation = (location: string) => {
    setSelectedLocation(location);
    setLocationInput(location);
    setLocationOpen(false);
  };

  useEffect(() => {
    if (!locationOpen) {
      setLocationInput(selectedLocation);
      return;
    }

    const handleClickOutside = (event: MouseEvent) => {
      if (
        locationRef.current &&
        !locationRef.current.contains(event.target as Node)
      ) {
        setLocationOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [locationOpen, selectedLocation]);

  const formatDate = (date: string) => {
    if (!date) return "Select Date";

    return new Date(date).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };
  return (
    <aside
      className={`
        hidden min-w-0 overflow-hidden transition-[opacity,transform] duration-300 ease-out lg:block
        ${isOpen ? "opacity-100" : "pointer-events-none -translate-x-2 opacity-0"}
      `}
      aria-hidden={!isOpen}
    >
      <div
        className={`
          w-[252px] rounded-xl border border-(--border) bg-(--bg-card)
          p-4 shadow-(--shadow-card) transition-transform duration-300 ease-out
          ${isOpen ? "translate-x-0" : "-translate-x-full"}
        `}
      >
        <div className="mb-5 flex items-center justify-between">
          <h2 className="text-[22px] font-semibold text-(--text-primary)">
            Filter
          </h2>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close filters"
            className="flex h-8 w-8 items-center justify-center rounded-full text-(--text-primary) transition-colors duration-200 hover:bg-(--bg-card-hover)"
          >
            <X size={18} strokeWidth={1.5} />
          </button>
        </div>

        <div className="space-y-5">
          <section>
            <div className="mb-3 flex items-center justify-between">
              <p className="text-[11px] font-medium uppercase text-(--text-primary)">
                Select Location
              </p>

              <button
                type="button"
                onClick={() => commitLocation("Indore, India")}
                className="text-[10px] font-semibold text-(--accent-secondary)"
              >
                Reset
              </button>
            </div>

            <div className="relative" ref={locationRef}>
              <div
                className="
        flex
        h-9
        w-full
        items-center
        gap-2
        rounded-[6px]
        border
        border-(--border)
        bg-(--bg-card)
        px-3
        text-[11px]
        text-(--text-primary)
        focus-within:border-(--accent-primary)
      "
              >
                <MapPin size={13} strokeWidth={1.5} className="shrink-0" />

                <input
                  ref={searchInputRef}
                  type="text"
                  value={locationInput}
                  onChange={(e) => {
                    setLocationInput(e.target.value);
                    setLocationOpen(true);
                  }}
                  onFocus={() => setLocationOpen(true)}
                  onKeyDown={(e) => {
                    if (e.key === "Escape") {
                      setLocationOpen(false);
                      setLocationInput(selectedLocation);
                    }
                    if (e.key === "Enter" && filteredLocations.length > 0) {
                      commitLocation(filteredLocations[0]);
                    }
                  }}
                  placeholder="Search location..."
                  aria-autocomplete="list"
                  aria-expanded={locationOpen}
                  aria-controls="location-suggestions"
                  className="min-w-0 flex-1 bg-transparent text-[11px] text-(--text-primary) placeholder:text-(--text-muted) focus:outline-none"
                />

                {locationInput && locationInput !== selectedLocation && (
                  <button
                    type="button"
                    onClick={() => {
                      commitLocation("Indore, India");
                      searchInputRef.current?.focus();
                    }}
                    aria-label="Clear search"
                    className="flex h-4 w-4 shrink-0 items-center justify-center rounded-full text-(--text-muted) transition-colors hover:bg-(--bg-card-hover) hover:text-(--text-primary)"
                  >
                    <X size={11} strokeWidth={2} />
                  </button>
                )}

                <button
                  type="button"
                  onClick={() => setLocationOpen((prev) => !prev)}
                  aria-label="Toggle location suggestions"
                  className="flex shrink-0 items-center justify-center text-(--text-muted)"
                >
                  <ChevronDown
                    size={14}
                    strokeWidth={1.5}
                    className={`transition-transform duration-200 ${locationOpen ? "rotate-180" : ""}`}
                  />
                </button>
              </div>

              {locationOpen && (
                <div
                  id="location-suggestions"
                  role="listbox"
                  className="
          absolute
          z-20
          mt-2
          w-full
          overflow-hidden
          rounded-sm
          border
          border-(--border)
          bg-(--bg-card)
          shadow-lg
        "
                >
                  <div className="max-h-44 overflow-y-auto py-1">
                    {filteredLocations.length > 0 ? (
                      filteredLocations.map((location) => (
                        <button
                          key={location}
                          type="button"
                          role="option"
                          aria-selected={selectedLocation === location}
                          onClick={() => commitLocation(location)}
                          className={`
              flex
              w-full
              items-center
              gap-2
              px-3
              py-2
              text-left
              text-[11px]
              transition-colors
              hover:bg-(--bg-secondary)
              ${selectedLocation === location
                              ? "bg-(--bg-secondary) font-medium text-(--accent-primary)"
                              : "text-(--text-primary)"
                            }
            `}
                        >
                          <MapPin size={12} className="shrink-0" />
                          {location}
                        </button>
                      ))
                    ) : (
                      <p className="px-3 py-3 text-center text-[11px] text-(--text-muted)">
                        No locations found
                      </p>
                    )}
                  </div>
                </div>
              )}
            </div>
          </section>

          <section>
            <p className="mb-3 text-[11px] font-medium uppercase text-(--text-primary)">
              Service Category
            </p>

            <div className="space-y-2">
              {serviceCategories.map((category) => (
                <label
                  key={category}
                  className="flex items-center gap-2 text-[11px] text-(--text-primary)"
                >
                  <input
                    type="checkbox"
                    className="h-3 w-3 rounded border-(--border) accent-(--accent-primary)"
                  />
                  <span>{category}</span>
                </label>
              ))}

              <button
                type="button"
                className="flex items-center gap-2 text-[11px] text-(--text-primary)"
              >
                <ChevronRight size={13} strokeWidth={1.5} />
                <span>More</span>
              </button>
            </div>
          </section>

          <section className="border-t border-(--border) pt-4">
            <p className="mb-3 text-[11px] font-medium uppercase text-(--text-primary)">
              Price Range
            </p>

            <div className="space-y-2">
              {priceRanges.map((range, index) => (
                <label
                  key={range}
                  className="flex items-center gap-2 text-[11px] text-(--text-primary)"
                >
                  <input
                    type="radio"
                    name="price-range"
                    defaultChecked={index === 0}
                    className="h-3 w-3 accent-(--accent-primary)"
                  />
                  <span>{range}</span>
                </label>
              ))}
            </div>

            <div className="mt-3 flex items-center gap-2">
              <input
                type="text"
                placeholder="Min Price"
                className="h-8 min-w-0 flex-1 rounded-[6px] border border-(--border) bg-transparent px-3 text-[11px] text-(--text-primary) placeholder:text-(--text-muted) focus:outline-none"
              />
              <span className="text-(--text-secondary)">-</span>
              <input
                type="text"
                placeholder="Max Price"
                className="h-8 min-w-0 flex-1 rounded-[6px] border border-(--border) bg-transparent px-3 text-[11px] text-(--text-primary) placeholder:text-(--text-muted) focus:outline-none"
              />
            </div>
          </section>

          <section className="border-t border-(--border) pt-4">
            <p className="mb-3 text-[11px] font-medium uppercase text-(--text-primary)">
              Nationality
            </p>

            <div className="space-y-2">
              {nationality.map((nationality, index) => (
                <label
                  key={nationality}
                  className="flex items-center gap-2 text-[11px] text-(--text-primary)"
                >
                  <input
                    type="radio"
                    name="nationality"
                    defaultChecked={index === 0}
                    className="h-3 w-3 accent-(--accent-primary)"
                  />

                  <span>{nationality}</span>
                </label>
              ))}
            </div>
          </section>

          <section className="border-t border-(--border) pt-4">
            <p className="mb-3 text-[11px] font-medium uppercase text-(--text-primary)">
              Availability
            </p>

            <div className="space-y-2">
              {availability.map((item, index) => (
                <label
                  key={item}
                  className="flex items-center gap-2 text-[11px] text-(--text-primary)"
                >
                  <input
                    type="radio"
                    name="availability"
                    defaultChecked={index === 0}
                    className="h-3 w-3 accent-(--accent-primary)"
                  />
                  <span>{item}</span>
                </label>
              ))}
            </div>
            <div className="relative mt-3">
              <input
                ref={dateInputRef}
                type="date"
                value={selectedDate}
                min={new Date().toISOString().split("T")[0]}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
              />

              <button
                type="button"
                onClick={() => {
                  if (dateInputRef.current?.showPicker) {
                    dateInputRef.current.showPicker();
                  } else {
                    dateInputRef.current?.click();
                  }
                }}
                className="
      flex
      h-8
      w-full
      items-center
      gap-2
      rounded-[6px]
      border
      border-(--border)
      bg-(--bg-card)
      px-3
      text-[11px]
      text-(--text-secondary)
      transition-colors
      hover:border-(--accent-primary)
    "
              >
                <span
                  className={`flex-1 text-left ${selectedDate
                    ? "text-(--text-primary)"
                    : "text-(--text-secondary)"
                    }`}
                >
                  {formatDate(selectedDate)}
                </span>

                <CalendarDays size={14} strokeWidth={1.5} />
              </button>
            </div>
          </section>

          <Button
            type="button"
            fullWidth
            className="rounded-[6px] py-3 text-[12px] font-semibold"
          >
            Apply Filters
          </Button>
        </div>
      </div>
    </aside>
  );
}
