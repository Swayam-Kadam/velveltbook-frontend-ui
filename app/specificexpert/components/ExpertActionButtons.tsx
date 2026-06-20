import Link from "next/link";
import { CalendarDays, MessageCircle } from "lucide-react";

interface ExpertActionButtonsProps {
  expertId: string;
}

export function ExpertActionButtons({ expertId }: ExpertActionButtonsProps) {
  return (
    <div className="grid grid-cols-2 gap-2">
      <Link
        href="/booking"
        className="
          primary-button inline-flex items-center justify-center gap-2
          rounded-xl py-2.5 text-[10px] font-medium text-white
        "
      >
        <CalendarDays size={14} strokeWidth={1.8} />
        Book Now
      </Link>

      <Link
        href={`/specificexpertmessage/${expertId}`}
        className="
          secondary-button inline-flex items-center justify-center gap-2
          rounded-xl py-2.5 text-[10px] font-medium
          text-[var(--text-primary)] transition-all duration-300
        "
      >
        <MessageCircle size={14} strokeWidth={1.8} />
        Message Now
      </Link>
    </div>
  );
}
