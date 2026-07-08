import Link from "next/link";
import { CalendarDays } from "lucide-react";

interface ChatBottomBookingBarProps {
  totalPrice: string;
}

export function ChatBottomBookingBar({ totalPrice }: ChatBottomBookingBarProps) {
  return (
    <div
      className="
         left-2 right-2 z-40 mx-1 mt-3
        overflow-hidden rounded-sm
        border border-[color-mix(in_srgb,var(--accent-primary)_20%,var(--border))]
        primary-button shadow-(--shadow-glow)
      "
    >
      <div className="flex items-center justify-between px-4 py-3.5">
        <Link
          href="/booking"
          className="
            flex items-center gap-2 text-[11px] font-medium text-white
            transition-opacity duration-200 hover:opacity-90
          "
        >
          <CalendarDays size={16} strokeWidth={1.8} />
          <span>Book & Pay</span>
        </Link>

        <span className="text-sm font-semibold text-white">{totalPrice}</span>
      </div>
    </div>
  );
}
