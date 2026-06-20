import { CalendarDays, Store } from "lucide-react";
import { Button } from "@/components/Button";

export function TrendingNearbyActions() {
    return (
        <div className="mt-5 flex gap-1">
            <Button
                variant="primary"
                leftIcon={<CalendarDays size={12} />}
                className="
    flex-1 gap-2 rounded-[4px]
    py-1 text-[8px] font-medium
  "
            >
                <span>Book Now</span>
            </Button>

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