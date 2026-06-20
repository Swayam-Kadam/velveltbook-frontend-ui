import { CalendarDays, Store } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/Button";

export function TrendingNearbyActions() {
    return (
        <div className="mt-5 flex gap-1">
            <Link
                href="/booking"
                className="
    primary-button inline-flex flex-1 items-center justify-center gap-2
    rounded-[4px] py-1 text-[8px] font-medium text-white
  "
            >
                <CalendarDays size={12} />
                <span>Book Now</span>
            </Link>

            <Button
                variant="secondary"
                leftIcon={<Store size={12} strokeWidth={1.8} />}
                className="
    flex-1 gap-2 rounded-[4px]
    py-1 text-[8px] font-medium
  "
            >
                View
            </Button>
        </div>
    );
}