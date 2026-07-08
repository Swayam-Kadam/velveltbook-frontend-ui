"use client";

import { Package, Tag } from "lucide-react";
import type { DealType } from "../deals.types";

interface DealTypeToggleProps {
  value: DealType;
  onChange: (type: DealType) => void;
}

interface ToggleOptionProps {
  active: boolean;
  icon: typeof Tag;
  title: string;
  subtitle: string;
  onClick: () => void;
}

function ToggleOption({
  active,
  icon: Icon,
  title,
  subtitle,
  onClick,
}: ToggleOptionProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`
        relative z-10 flex flex-1 items-center gap-2
        rounded-xl px-2 py-2 text-left
        transition-all duration-300
        ${active
          ? "primary-button text-white shadow-(--shadow-glow)"
          : "border border-(--border) bg-(--bg-card) text-(--text-primary)"
        }
      `}
    >
      <div
        className={`
          flex h-8 w-8 shrink-0 items-center justify-center rounded-full
          ${active
            ? "border border-(--brand-gold) bg-[color-mix(in_srgb,var(--accent-primary)_85%,#000)]"
            : "border border-(--border) bg-(--bg-card)"
          }
        `}
      >
        <Icon
          size={14}
          strokeWidth={1.5}
          className={active ? "text-white" : "text-(--accent-primary)"}
        />
      </div>

      <div className="min-w-0 flex-1">
        <span className="block text-[11px] font-semibold leading-tight">{title}</span>
        <span
          className={`block text-[7.5px] leading-snug ${active ? "text-white/70" : "text-(--text-muted)"}`}
        >
          {subtitle}
        </span>
      </div>
    </button>
  );
}

export function DealTypeToggle({ value, onChange }: DealTypeToggleProps) {
  return (
    <div className="relative flex items-stretch gap-1 px-1">
      <ToggleOption
        active={value === "single"}
        icon={Tag}
        title="Single Deals"
        subtitle="Best services at unbeatable prices"
        onClick={() => onChange("single")}
      />

      <div
        className="
          pointer-events-none absolute left-1/2 top-1/2 z-20
          flex h-6 w-6 -translate-x-1/2 -translate-y-1/2 items-center justify-center
          rounded-full border border-(--border)
          bg-(--bg-card) text-[7px] font-bold text-(--text-secondary)
          shadow-sm
        "
      >
        OR
      </div>

      <ToggleOption
        active={value === "package"}
        icon={Package}
        title="Packages"
        subtitle="Curated combos for complete care"
        onClick={() => onChange("package")}
      />
    </div>
  );
}
