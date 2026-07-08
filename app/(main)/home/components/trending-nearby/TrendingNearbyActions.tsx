import { CalendarDays, Store } from "lucide-react";
import Link from "next/link";

interface TrendingNearbyActionsProps {
    orgHref: string;
}

export function TrendingNearbyActions({ orgHref }: TrendingNearbyActionsProps) {
    return (
        <div className="mt-5 flex gap-1 lg:mt-4 lg:gap-4">
            <Link
                href="/specificorganizationbook/store-1"
                className="
    primary-button inline-flex flex-1 items-center justify-center gap-2
    rounded-[4px] py-1 text-[8px] font-medium text-white
    lg:py-2 lg:text-[11px]
  "
            >
                <CalendarDays size={12} />
                <span>Book Now</span>
            </Link>

            <Link
                href={orgHref}
                className="
    secondary-button inline-flex flex-1 items-center justify-center gap-2
    rounded-[4px] py-1 text-[8px] font-medium
    text-(--text-primary) transition-all duration-300
    lg:py-2 lg:text-[11px]
  "
            >
                <Store size={12} strokeWidth={1.8} />
                <span>View</span>
            </Link>
        </div>
    );
}
