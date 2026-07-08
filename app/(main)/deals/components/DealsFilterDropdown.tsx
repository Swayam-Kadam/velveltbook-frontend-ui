"use client";

import { useEffect, useRef, useState, type ComponentType } from "react";
import { ChevronDown } from "lucide-react";

interface DealsFilterDropdownProps<T extends string> {
  icon: ComponentType<{ size?: number; strokeWidth?: number; className?: string }>;
  label: string;
  value: T;
  options: { value: T; label: string }[];
  onChange: (value: T) => void;
}

export function DealsFilterDropdown<T extends string>({
  icon: Icon,
  label,
  value,
  options,
  onChange,
}: DealsFilterDropdownProps<T>) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const activeLabel = options.find((option) => option.value === value)?.label ?? label;

  useEffect(() => {
    if (!isOpen) return;

    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setIsOpen(false);
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEscape);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscape);
    };
  }, [isOpen]);

  return (
    <div ref={containerRef} className="relative">
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        className="
          flex h-10 w-full items-center gap-2
          rounded-full border border-(--border)
          bg-(--bg-card) px-3
          text-left transition-colors duration-200
          hover:border-[color-mix(in_srgb,var(--brand-gold)_35%,var(--border))]
        "
      >
        <span
          className="
            flex h-6 w-6 shrink-0 items-center justify-center rounded-full
            bg-[color-mix(in_srgb,var(--accent-primary)_8%,var(--bg-card))]
          "
        >
          <Icon size={12} strokeWidth={1.5} className="text-(--accent-primary)" />
        </span>

        <span className="min-w-0 flex-1">
          <span className="block text-[8px] text-(--text-muted)">{label}</span>
          <span className="block truncate text-[10px] font-medium text-(--text-primary)">
            {activeLabel}
          </span>
        </span>

        <ChevronDown
          size={14}
          strokeWidth={1.5}
          className={`shrink-0 text-(--text-secondary) transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
        />
      </button>

      {isOpen && (
        <ul
          role="listbox"
          aria-label={label}
          className="
            absolute left-0 right-0 top-[calc(100%+6px)] z-30
            overflow-hidden rounded-xl border border-(--border)
            bg-(--bg-card) py-1
            shadow-[0_4px_16px_rgba(61,28,77,0.12)]
          "
        >
          {options.map((option) => {
            const isActive = option.value === value;

            return (
              <li key={option.value} role="option" aria-selected={isActive}>
                <button
                  type="button"
                  onClick={() => {
                    onChange(option.value);
                    setIsOpen(false);
                  }}
                  className={`
                    w-full px-3 py-2 text-left text-[10px] transition-colors duration-150
                    ${isActive
                      ? "font-semibold text-(--brand-gold)"
                      : "font-medium text-(--text-primary) hover:font-semibold hover:text-(--accent-primary)"
                    }
                  `}
                >
                  {option.label}
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
