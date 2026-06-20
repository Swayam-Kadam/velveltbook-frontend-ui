import Link from "next/link";
import { CalendarDays, ChevronRight } from "lucide-react";

export function BottomBookingBar() {
  return (
    <div
      className="
         bottom-[72px] left-2 right-2 z-40
        overflow-hidden rounded-sm mx-1
        border border-[color-mix(in_srgb,var(--accent-primary)_20%,var(--border))]
        primary-button shadow-[var(--shadow-glow)]
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
            relative flex items-center justify-center gap-1
            py-3.5 text-[11px] font-medium text-white
            transition-opacity duration-200 hover:opacity-90
            before:absolute before:left-0 before:top-2 before:bottom-2
            before:w-px before:bg-white/25
          "
        >
          <span>View Booking</span>
          <ChevronRight size={16} strokeWidth={2} />
        </button>
      </div>
    </div>
  );
}
