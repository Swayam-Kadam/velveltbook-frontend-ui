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
    className?: string;
}

export function HeroBottomCard({ store, className = "" }: HeroBottomCardProps) {
    const organizationHref = `/extendedspecificorganization/${store.id}`;

    return (
        <div
            className={`
        mt-2 relative z-10
        rounded-xl
        border border-(--brand-gold)
        bg-(--bg-card)/95
        p-2 backdrop-blur-xl
        lg:rounded-[10px] lg:p-4 lg:shadow-(--shadow-card)
        ${className}
      `}
        >
            <Link
                href={organizationHref}
                className="flex items-center gap-4 transition-opacity duration-200 hover:opacity-90 lg:gap-3"
            >
                <div className="relative h-10 w-10 overflow-hidden rounded-xl lg:h-14 lg:w-14 lg:rounded-[8px]">
                    <Image
                        src={store.image}
                        alt={store.name}
                        fill
                        sizes="80px"
                        className="object-cover"
                    />
                </div>

                <div className="min-w-0 flex-1">
                    <p className="truncate text-[10px] font-medium text-(--text-primary) lg:text-[12px]">
                        {store.name}
                    </p>

                    <div className="mt-1 flex items-center gap-2 text-[8px] lg:text-[10px]">
                        <span className="h-1 w-1 rounded-full bg-green-500" />

                        <span className="text-green-400">
                            {store.status}
                        </span>
                    </div>

                    <div className="mt-1 flex items-center gap-1 text-[8px] text-(--text-secondary) lg:text-[10px]">
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
    lg:h-10 lg:w-10
  "
                >
                    <Navigation
                        size={12}
                        className="-rotate-45 shrink-0"
                    />
                </Button>
            </Link>
                {/* Mobile View */}
                <div className="block lg:hidden">
            <div className="mt-4 grid grid-cols-3 gap-3 lg:grid-cols-2 lg:gap-2">
                <Link
                    href={organizationHref}
                    className="
    secondary-button inline-flex flex-1 items-center justify-center gap-2
    rounded-[4px] py-1 text-[10px] font-medium
    text-(--text-primary) transition-all duration-300
    lg:py-2 lg:text-[11px]
  "
                >
                    <Store size={12} strokeWidth={1.8} />
                    View Store
                </Link>

                <Link href={organizationHref} className="
    secondary-button inline-flex flex-1 items-center justify-center gap-2
    rounded-[4px] py-1 text-[10px] font-medium
    text-(--text-primary) transition-all duration-300
    lg:py-2 lg:text-[11px]
  ">
                    <Play size={12} strokeWidth={1.8} />
                    Store Tour

                </Link>

                <Link
                    href="/booking"
                    className="
    primary-button inline-flex flex-1 items-center justify-center gap-2
    rounded-[4px] py-1 text-[10px] font-medium text-white
    lg:col-span-2 lg:py-2 lg:text-[11px]
  "
                >
                    <Calendar size={12} strokeWidth={1.8} />
                    Book Now
                </Link>
            </div>
            </div>

                {/* Desktop View */}
                <div className="hidden lg:block">
                <div className="mt-4 grid grid-cols-3 gap-3 lg:grid-cols-2 lg:gap-2">
                <Link
                    href={"/store/lori-massage-parlour"}
                    className="
    secondary-button inline-flex flex-1 items-center justify-center gap-2
    rounded-[4px] py-1 text-[10px] font-medium
    text-(--text-primary) transition-all duration-300
    lg:py-2 lg:text-[11px]
  "
                >
                    <Store size={12} strokeWidth={1.8} />
                    View Store
                </Link>

                <Link href={organizationHref} className="
    secondary-button inline-flex flex-1 items-center justify-center gap-2
    rounded-[4px] py-1 text-[10px] font-medium
    text-(--text-primary) transition-all duration-300
    lg:py-2 lg:text-[11px]
  ">
                    <Play size={12} strokeWidth={1.8} />
                    Store Tour

                </Link>

                <Link
                    href="/booking"
                    className="
    primary-button inline-flex flex-1 items-center justify-center gap-2
    rounded-[4px] py-1 text-[10px] font-medium text-white
    lg:col-span-2 lg:py-2 lg:text-[11px]
  "
                >
                    <Calendar size={12} strokeWidth={1.8} />
                    Book Now
                </Link>
            </div>
            </div>
            
        </div>
    );
}
