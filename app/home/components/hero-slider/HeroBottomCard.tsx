"use client";

import Image from "next/image";
import Link from "next/link";
import { Calendar, Navigation, MapPin, Play, Store } from "lucide-react";

import { Button } from "../../../components/Button";

interface HeroBottomCardProps {
    store: {
        id: string;
        name: string;
        image: string;
        location: string;
        status: string;
    };
}

export function HeroBottomCard({ store }: HeroBottomCardProps) {
    const organizationHref = `/extendedspecificorganization/${store.id}`;

    return (
        <div
            className="
        mt-2 relative z-10
        rounded-xl
        border border-(--brand-gold)
        bg-(--bg-card)/95
        p-2 backdrop-blur-xl
      "
        >
            <Link
                href={organizationHref}
                className="flex items-center gap-4 transition-opacity duration-200 hover:opacity-90"
            >
                <div className="relative h-10 w-10 overflow-hidden rounded-xl">
                    <Image
                        src={store.image}
                        alt={store.name}
                        fill
                        sizes="80px"
                        className="object-cover"
                    />
                </div>

                <div className="min-w-0 flex-1">
                    <p className="truncate text-[10px] font-medium text-(--text-primary)">
                        {store.name}
                    </p>

                    <div className="mt-1 flex items-center gap-2 text-[8px]">
                        <span className="h-1 w-1 rounded-full bg-green-500" />

                        <span className="text-green-400">
                            {store.status}
                        </span>
                    </div>

                    <div className="mt-1 flex items-center gap-1 text-[8px] text-(--text-secondary)">
                        <MapPin size={8} />
                        <span>{store.location}</span>
                    </div>
                </div>

                <Button
                    variant="icon"
                    className="
    relative
    h-8 w-8
    p-0
    rotate-45
    rounded-lg
    border border-purple-500/20
    bg-purple-500/10
    text-purple-400
    hover:bg-purple-500/20
    transition-all duration-300
  "
                >
                    <Navigation
                        size={12}
                        className="-rotate-45 shrink-0"
                    />
                </Button>
            </Link>

            <div className="mt-4 grid grid-cols-3 gap-3">
                <Link
                    href={organizationHref}
                    className="
    secondary-button inline-flex flex-1 items-center justify-center gap-2
    rounded-[4px] py-1 text-[10px] font-medium
    text-(--text-primary) transition-all duration-300
  "
                >
                    <Store size={12} strokeWidth={1.8} />
                    View Store
                </Link>

                <Button
                    variant="secondary"
                    leftIcon={<Play size={12} strokeWidth={1.8} />}
                    className="
    flex-1 gap-2 rounded-[4px]
    py-1 text-[10px] font-medium
  "
                >
                    Store Tour
                </Button>

                <Link
                    href="/booking"
                    className="
    primary-button inline-flex flex-1 items-center justify-center gap-2
    rounded-[4px] py-1 text-[10px] font-medium text-white
  "
                >
                    <Calendar size={12} strokeWidth={1.8} />
                    Book Now
                </Link>
            </div>
        </div>
    );
}