import Link from "next/link";
import { CalendarDays } from "lucide-react";

interface ServiceBottomBookingBarProps {
  price: string;
}

export function ServiceBottomBookingBar({
  price,
}: ServiceBottomBookingBarProps) {
  return (
    <div
      className="
         left-2 right-2 z-40 mx-2 mt-3
        overflow-hidden rounded-xs
        border border-[color-mix(in_srgb,var(--accent-primary)_20%,var(--border))]
        primary-button shadow-(--shadow-glow)
      "
    >
      <div className="grid grid-cols-2">
        <Link
          href="/booking"
          className="
            flex items-center justify-center gap-2
            py-3.5 text-[11px] font-medium text-white
            transition-opacity duration-200 hover:opacity-90
          "
        >
          <CalendarDays size={16} strokeWidth={1.8} />
          <span>Book Now</span>
        </Link>

        <button
          type="button"
          className="
            relative flex items-center justify-center
            py-3.5 text-[11px] font-semibold text-white
            transition-opacity duration-200 hover:opacity-90
            before:absolute before:left-0 before:top-2 before:bottom-2
            before:w-px before:bg-white/25
          "
        >
          {price}
        </button>
      </div>
    </div>
  );
}
