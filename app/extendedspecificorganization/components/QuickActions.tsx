import Link from "next/link";
import { CalendarDays, Phone, PlayCircle } from "lucide-react";

export function QuickActions() {
  return (
    <div className="grid grid-cols-3 gap-2 mt-2 px-2 pb-2">
      <button
        type="button"
        className="
          secondary-button flex items-center justify-center gap-1
          rounded-xs py-2 text-[8px] font-medium text-(--text-primary)
        "
      >
        <Phone size={12} strokeWidth={1.6} />
        Call Now
      </button>

      <button
        type="button"
        className="
          secondary-button flex items-center justify-center gap-1
          rounded-xs py-2 text-[8px] font-medium text-(--text-primary)
        "
      >
        <PlayCircle size={12} strokeWidth={1.6} />
        Watch Video
      </button>

      <Link
        href={`/specificorganization/store-1`}
        className="
          primary-button flex items-center justify-center gap-1
          rounded-xs py-2 text-[8px] font-medium text-white
        "
      >
        <CalendarDays size={12} strokeWidth={1.6} />
        Book Now
      </Link>
    </div>
  );
}
