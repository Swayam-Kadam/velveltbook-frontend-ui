import Image from "next/image";
import Link from "next/link";
import { MapPin, Star } from "lucide-react";

import { ExpertProvider } from "./expert-providers.types";

interface ExpertProviderCardProps {
    provider: ExpertProvider;
}

export function ExpertProviderCard({
    provider,
}: ExpertProviderCardProps) {
    return (
        <Link
            href={`/specificorganization/${provider.organizationId}`}
            className="block transition-transform duration-200 active:scale-[0.98] border border-(--brand-gold) rounded-(--radius-md)"
        >
        <article
            className="
    w-full
    flex items-center gap-3
    rounded-(--radius-md)
    border border-(--border)
    bg-(--bg-card)
    p-3
    shadow-(--shadow-card)
  "
        >
            <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-xl">
                <Image
                    src={provider.image}
                    alt={provider.name}
                    fill
                    sizes="80px"
                    className="object-cover"
                />
            </div>

            <div className="min-w-0 flex-1">
                <p className="truncate text-[10px] font-medium text-(--text-primary)">
                    {provider.name}
                </p>

                <p className="mt-0.5 text-[8px] text-(--text-secondary)">
                    {provider.specialist}
                </p>

                <div className="mt-1 flex items-center gap-3 text-[8px] text-(--text-muted)">
                    <div className="flex items-center gap-1">
                        <MapPin size={8} />

                        <span>{provider.distance}</span>
                    </div>

                    <div className="flex items-center gap-1">
                        <Star
                            size={8}
                            className="fill-(--brand-gold) text-(--brand-gold)"
                        />

                        <span>
                            {provider.rating} ({provider.reviews} reviews)
                        </span>
                    </div>
                </div>
            </div>

            <span className="shrink-0 text-xs font-semibold text-(--accent-secondary)">
                {provider.price}
            </span>
        </article>
        </Link>
    );
}