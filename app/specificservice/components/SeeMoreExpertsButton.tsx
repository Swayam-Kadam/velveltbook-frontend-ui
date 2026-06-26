import { Users } from "lucide-react";

export function SeeMoreExpertsButton() {
  return (
    <button
      type="button"
      className="
        secondary-button flex w-full items-center justify-center gap-2
        rounded-xs py-2.5 text-[10px] font-medium
        text-(--text-primary) transition-all duration-300
        hover:border-[color-mix(in_srgb,var(--brand-gold)_45%,var(--border))]
      "
    >
      <Users size={14} strokeWidth={1.6} className="text-(--brand-gold)" />
      <span>See More Experts</span>
    </button>
  );
}
