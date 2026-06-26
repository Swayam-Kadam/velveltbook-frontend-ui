"use client";

import { Button } from "@/components/Button";
import { Check, ChevronRight, Mars, Venus } from "lucide-react";

export type ExpertType = "male" | "female";

interface ExpertSelectionProps {
  selected: ExpertType;
  onSelect: (type: ExpertType) => void;
}

export function ExpertSelection({
  selected,
  onSelect,
}: ExpertSelectionProps) {
  const options: {
    type: ExpertType;
    label: string;
    icon: typeof Mars;
    iconClass: string;
  }[] = [
    {
      type: "male",
      label: "Male Expert",
      icon: Mars,
      iconClass: "text-(--accent-secondary)",
    },
    {
      type: "female",
      label: "Female Expert",
      icon: Venus,
      iconClass: "text-pink-400",
    },
  ];

  return (
    <section className="mt-4 px-2 pb-4">
      <h2 className="text-sm font-medium text-(--text-primary)">
        Select an Expert
      </h2>

      <p className="mt-0.5 text-[8px] text-(--text-muted)">
        Choose your preferred expert type
      </p>

      <div className="mt-3 flex gap-2">
        {options.map(({ type, label, icon: Icon, iconClass }) => {
          const active = selected === type;

          return (
            <button
              key={type}
              type="button"
              onClick={() => onSelect(type)}
              className={`
                relative flex flex-1 items-center gap-2 rounded-xl
                border bg-(--bg-card) px-3 py-3
                transition-all duration-300
                ${
                  active
                    ? "border-(--accent-secondary) shadow-(--shadow-glow)"
                    : "border-(--border) hover:border-[color-mix(in_srgb,var(--accent-secondary)_20%,var(--border))]"
                }
              `}
            >
              <Icon size={18} strokeWidth={1.6} className={iconClass} />

              <span className="text-[9px] font-medium text-(--text-primary)">
                {label}
              </span>

              {active && (
                <span
                  className="
                    absolute right-2 top-1/2 flex h-4 w-4 -translate-y-1/2
                    items-center justify-center rounded-full
                    bg-(--accent-primary) text-white
                    shadow-[0_0_8px_color-mix(in_srgb,var(--accent-glow)_45%,transparent)]
                  "
                >
                  <Check size={10} strokeWidth={2.5} />
                </span>
              )}
            </button>
          );
        })}
      </div>
      <div
        className="
          mt-1 bottom-[72px] left-0 right-0 z-40
          border-t border-(--border)
          bg-(--bg-secondary)/95 backdrop-blur-xl
        "
      >
        <Button
          variant="primary"
          fullWidth
          className="
            relative rounded-xs py-3.5 text-sm font-medium
            hover:opacity-95 active:scale-[0.99]
          "
        >
          <span>Next</span>

          <ChevronRight
            size={18}
            strokeWidth={2}
            className="absolute right-4"
          />
        </Button>
      </div>
    </section>
  );
}
