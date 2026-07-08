import Link from "next/link";
import { CalendarDays, MessageCircle } from "lucide-react";

import { Button } from "@/components/Button";

export function OrganizationActions() {
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
        Book Marked
      </Link>

      <Button
        variant="secondary"
        leftIcon={<MessageCircle size={14} strokeWidth={1.8} />}
        className="gap-2 rounded-xl py-2.5 text-[10px] font-medium"
      >
        Message
      </Button>
    </div>
  );
}
