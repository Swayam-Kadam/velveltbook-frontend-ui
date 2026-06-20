import Image from "next/image";
import Link from "next/link";
import {
    MapPin,
    PlayCircle,
    Share2,
} from "lucide-react";

import { TrendingNearbyActions } from "./TrendingNearbyActions";
import { TrendingNearbyItem } from "./trending-nearby.types";

interface TrendingNearbyCardProps {
    item: TrendingNearbyItem;
}

export function TrendingNearbyCard({
    item,
}: TrendingNearbyCardProps) {
    return (
        <Link
            href={`/specificorganization/${item.organizationId}`}
            className="block transition-transform duration-200 active:scale-[0.98]"
        >
        <article className="feature-card overflow-hidden rounded-xl">
            <div className="relative h-[150px] overflow-hidden">
                <Image
                    src={item.image}
                    alt={item.name}
                    fill
                    sizes="(max-width: 768px) 100vw, 50vw"
                    className="object-cover"
                />

                <div className="feature-overlay absolute inset-0 hidden dark:block" />

                <div className="absolute left-2 top-2 h-[6px] w-[6px] rounded-full bg-[#22C55E]" />

                <div className="absolute right-2 top-2 flex items-center justify-between gap-1">
                    <div className="primary-button rounded-full bg-white/15 px-4 py-1 text-[8px] font-medium text-white backdrop-blur-md">
                        {item.availability}
                    </div>

                    <button className="flex h-5 w-5 items-center justify-center rounded-full bg-white/15 text-white backdrop-blur-md">
                        <PlayCircle size={12} />
                    </button>

                    <button className="flex h-5 w-5 items-center justify-center rounded-full bg-white/15 text-white backdrop-blur-md">
                        <Share2 size={12} />
                    </button>
                </div>

                {/* <button className="absolute bottom-4 right-4 text-white">
                    <Heart size={12} />
                </button> */}
            </div>

            <div className="p-2">
                <div className="flex items-start gap-3">
                    <div className="relative h-10 w-10 overflow-hidden rounded-xl">
                        <Image
                            src={item.avatar}
                            alt={item.name}
                            fill
                            sizes="80px"
                            className="object-cover"
                        />
                    </div>

                    <div className="flex-1">
                        <p className="text-[10px] font-medium text-[var(--text-primary)]">
                            {item.name}
                        </p>
                        <p className="text-[8px] text-[var(--text-secondary)]">
                            {item.service}
                        </p>

                        {item.distance && (
                            <div className="mt-1 flex items-center gap-0.5 text-[8px] text-[var(--text-muted)]">
                                <MapPin size={8} />

                                <span>{item.distance}</span>
                            </div>
                        )}


                    </div>
                </div>



                <TrendingNearbyActions />
            </div>
        </article>
        </Link>
    );
}