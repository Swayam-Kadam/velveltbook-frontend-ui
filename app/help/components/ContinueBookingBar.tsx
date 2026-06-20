import Link from "next/link";
import { CalendarDays, ChevronRight } from "lucide-react";

export function ContinueBookingBar() {
  return (
    <div
      className="
         left-2 right-2 z-40 mx-2 mt-3
        overflow-hidden rounded-xl
        border border-[color-mix(in_srgb,var(--accent-primary)_20%,var(--border))]
        primary-button shadow-[var(--shadow-glow)]
      "
    >
      <Link
        href="/booking"
        className="
          relative flex items-center justify-center gap-2
          py-3.5 text-[11px] font-medium text-white
        "
      >
        <CalendarDays
          size={16}
          strokeWidth={1.8}
          className="absolute left-4"
        />
        <span>Continue to Booking</span>
        <ChevronRight
          size={16}
          strokeWidth={2}
          className="absolute right-4"
        />
      </Link>
    </div>
  );
}
