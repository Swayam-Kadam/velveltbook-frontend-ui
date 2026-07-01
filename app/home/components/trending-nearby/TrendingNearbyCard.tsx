import Image from "next/image";
import Link from "next/link";
import {
    CalendarDays,
    Store,
    MapPin,
    MessageSquare,
    PlayCircle,
    Share2,
    Star,
    UserRound,
    Navigation,
    Plus,
    Sparkles,
    Flower2,
    HeartHandshake,
    Droplets,
} from "lucide-react";

import { TrendingNearbyActions } from "./TrendingNearbyActions";
import { TrendingNearbyItem } from "./trending-nearby.types";

interface TrendingNearbyCardProps {
    item: TrendingNearbyItem;
}

const icons = [
    Sparkles,
    HeartHandshake,
    Flower2,
    Droplets,
];

export function TrendingNearbyCard({ item }: TrendingNearbyCardProps) {
    const orgHref =
        item.organizationId === "org-trending-2"
            ? `/extendedspecificorganization/${item.organizationId}`
            : `/specificorganization/${item.organizationId}`;

    return (
        <>
            {/* ================= MOBILE ================= */}

            <article className="feature-card overflow-hidden rounded-xl lg:hidden">
                <Link
                    href={orgHref}
                    className="block transition-transform duration-200 active:scale-[0.98]"
                >
                    <div className="relative h-[150px] overflow-hidden">
                        <Image
                            src={item.image}
                            alt={item.name}
                            fill
                            className="object-cover"
                        />

                        <div className="feature-overlay absolute inset-0 hidden [.dark_&]:block" />

                        <div className="absolute left-2 top-2 h-[6px] w-[6px] rounded-full bg-[#22C55E]" />

                        <div className="absolute right-2 top-2 flex gap-1">

                            <div className="primary-button rounded-full bg-white/15 px-4 py-1 text-[8px] text-white backdrop-blur-md">
                                {item.availability}
                            </div>

                            <button className="flex h-5 w-5 items-center justify-center rounded-full bg-white/15 text-white backdrop-blur-md">
                                <PlayCircle size={12} />
                            </button>

                            <button className="flex h-5 w-5 items-center justify-center rounded-full bg-white/15 text-white backdrop-blur-md">
                                <Share2 size={12} />
                            </button>

                        </div>
                    </div>

                    <div className="p-2 pb-0">

                        <div className="flex gap-3">

                            <div className="relative h-10 w-10 overflow-hidden rounded-xl">
                                <Image
                                    src={item.avatar}
                                    alt={item.name}
                                    fill
                                    className="object-cover"
                                />
                            </div>

                            <div>

                                <p className="text-[10px] font-medium h-7">
                                    {item.name}
                                </p>

                                <p className="text-[8px] text-(--text-secondary)">
                                    {item.service}
                                </p>

                                <div className="mt-1 flex items-center gap-1 text-[8px]">
                                    <MapPin size={8} />
                                    {item.distance}
                                </div>

                            </div>

                        </div>

                    </div>
                </Link>

                <div className="p-2 pt-0">
                    <TrendingNearbyActions orgHref={orgHref} />
                </div>
            </article>

            {/* ================= DESKTOP ================= */}

            <article
                className="
        feature-card
        hidden
        lg:block
        overflow-hidden
        rounded-xl
        border
        border-(--border)
        bg-(--bg-card)
        shadow-sm
    "
            >
                {/* Hero */}

                <div className="relative h-[165px] overflow-hidden">

                    <Image
                        src={item.image}
                        alt={item.name}
                        fill
                        className="object-cover transition duration-500 hover:scale-105"
                    />

                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />

                    {/* Top Left */}

                    <div className="absolute left-4 top-4 flex items-center gap-3">

                        <span className="h-2.5 w-2.5 rounded-full bg-green-500" />

                        <div className="rounded-full bg-[#4b2679] px-4 py-1 text-[12px] font-medium text-white">
                            {item.availability}
                        </div>

                    </div>

                    {/* Top Right */}

                    <div className="absolute right-4 top-4 flex gap-2">

                        <Link href="/#"
                            className="
                flex
                h-9
                w-9
                items-center
                justify-center
                rounded-full
                bg-black/35
                backdrop-blur-md
            "
                        >
                            <Share2
                                size={16}
                                className="text-white"
                            />
                        </Link>

                        <Link href="/#"
                            className="
                flex
                h-9
                w-9
                items-center
                justify-center
                rounded-full
                bg-black/35
                backdrop-blur-md
            "
                        >
                            <PlayCircle
                                size={18}
                                className="text-white"
                            />
                        </Link>

                    </div>

                </div>
                {/* Content */}

                <div className="grid grid-cols-[1fr_200px]">

                    {/* Left Content */}

                    <div className="px-4 py-3">

                        <h3 className="text-[20px] font-semibold text-(--text-primary)">
                            {item.name}
                        </h3>

                        <p className="mt-1 text-[13px] text-(--text-secondary)">
                            {item.desktopService ?? item.service}
                        </p>

                        <div className="mt-2 flex items-center gap-3 text-[12px] text-(--text-secondary)">

                            <div className="flex items-center gap-1">

                                <Star
                                    size={13}
                                    className="fill-yellow-400 text-yellow-400"
                                />

                                <span className="font-medium">
                                    {item.rating ?? "4.8"}
                                </span>

                            </div>

                            <span>({item.reviews ?? "120+"})</span>

                            <span>•</span>

                            <div className="flex items-center gap-1">

                                <MapPin size={12} />

                                <span>{item.distance}</span>

                            </div>

                        </div>

                        <p className="mt-3 line-clamp-3 max-w-[320px] text-[12px] leading-5 text-(--text-secondary)">
                            {item.description}
                        </p>

                    </div>

                    {/* Right Actions */}

                    <div className="flex flex-col justify-center gap-4 border-l border-(--border) px-4">

                        <Link href={orgHref} className="flex items-center gap-2 text-[13px] font-medium transition hover:text-(--accent-primary)">

                            <MessageSquare size={16} />

                            <span>Message</span>

                        </Link>

                        <Link href={orgHref} className="flex items-center gap-2 text-[13px] font-medium transition hover:text-(--accent-primary)">

                            <UserRound size={16} />

                            <span>Staff</span>

                        </Link>

                        <Link href={orgHref} className="flex items-center gap-2 text-[13px] font-medium transition hover:text-(--accent-primary)">

                            <Navigation size={16} />

                            <span>Direction</span>

                        </Link>

                    </div>

                </div>
                {/* Services */}

                <div className="border-t border-(--border) px-4 py-3">

                    <div className="grid grid-cols-5 gap-2">

                        {(item.desktopServices ?? []).map((service) => (
                            <div
                                key={service.label}
                                className="
      overflow-hidden
      rounded-sm
      border
      border-(--border)
      bg-(--bg-secondary)
      transition-all
      duration-300
      hover:-translate-y-1
      hover:border-(--accent-primary)
      hover:shadow-lg
    "
                            >
                                <div className="relative h-[60px] w-full overflow-hidden">
                                    <Image
                                        src={service.image}
                                        alt={service.label}
                                        fill
                                        className="object-cover transition duration-500 hover:scale-110"
                                    />
                                </div>

                                <div className="p-1 text-center">
                                    <p className="line-clamp-1 text-[11px] font-medium text-(--text-primary)">
                                        {service.label}
                                    </p>

                                    <span className="block text-[12px] font-semibold text-(--accent-primary)">
                                        {service.price}
                                    </span>
                                </div>
                            </div>
                        ))}

                        <button
                            className="
    flex
    flex-col
    overflow-hidden
    rounded-sm
    border
    border-dashed
    border-(--border)
    bg-(--bg-secondary)
    transition-all
    hover:border-(--accent-primary)
    hover:shadow-lg
  "
                        >
                            <div className="relative h-[60px] w-full overflow-hidden">
                                <Image
                                    src="/massage.webp"
                                    alt="more"
                                    fill
                                    className="object-cover transition duration-500 hover:scale-110"
                                />
                            </div>



                            <div className="p-1">
                                <div className="flex items-center justify-center">
                                    <Plus size={12} className="text-(--accent-primary)" />
                                </div>
                                <span className="text-[11px] font-medium">
                                    More
                                </span>
                            </div>
                        </button>

                    </div>

                </div>

                {/* Bottom Buttons */}

                <div className="flex gap-3 px-4 pb-4">

                    <Link
                        href="/booking"
                        className="
                primary-button
                flex
                h-10
                flex-1
                items-center
                justify-center
                gap-2
                rounded-sm
                text-[12px]
                font-medium
                text-white
            "
                    >

                        <CalendarDays size={15} />

                        Book Now

                    </Link>

                    <Link
                        href={"/store/lori-massage-parlour"}
                        className="
                secondary-button
                flex
                h-10
                gap-2
                flex-1
                items-center
                justify-center
                rounded-sm
                text-[12px]
                font-medium
            "
                    >
                        <Store size={15} />


                        View Store

                    </Link>

                </div>

            </article>
        </>
    );
}
