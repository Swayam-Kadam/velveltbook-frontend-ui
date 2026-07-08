import { ChevronRight } from "lucide-react";

export function SelectServiceButton() {
  return (
    <button
      type="button"
      className="
        secondary-button flex w-full items-center justify-between
        rounded-xl px-3 py-2.5 text-[10px] font-medium
        text-(--text-primary) transition-all duration-300
      "
    >
      <span className="flex-1 text-center">Select Service</span>
      <ChevronRight size={14} className="text-(--brand-gold)" />
    </button>
  );
}
