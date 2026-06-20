import { Search, SlidersHorizontal } from "lucide-react";

export function SearchBar() {
    return (
        <div
            className="
        search-glass
        flex h-12 w-full items-center gap-4
        rounded-2xl border
        px-5 backdrop-blur-2xl
        transition-all duration-300
        hover:border-[color-mix(in_srgb,var(--accent-glow)_18%,transparent)]
      "
        >
            <Search
                className="h-4 w-4 shrink-0 text-[var(--text-secondary)]"
                strokeWidth={1.4}
            />

            <input
                type="text"
                placeholder="Search services, salons, spas..."
                className="
          flex-1 bg-transparent
          text-xs text-[var(--text-primary)]
          placeholder:text-[var(--text-muted)]
          focus:outline-none
        "
            />

            <button
                className="
          text-[var(--text-primary)]
          transition-transform duration-300
          hover:rotate-90
        "
            >
                <SlidersHorizontal
                    className="h-4 w-4"
                    strokeWidth={1.4}
                />
            </button>
        </div>
    );
}