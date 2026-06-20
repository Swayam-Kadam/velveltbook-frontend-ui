import Image from "next/image";
import { MapPin, Star } from "lucide-react";

import { ExpertProvider } from "./expert-providers.types";

interface ExpertProviderCardProps {
    provider: ExpertProvider;
}

export function ExpertProviderCard({
    provider,
}: ExpertProviderCardProps) {
    return (
        <article
            className="
    w-full
    flex items-center gap-3
    rounded-[var(--radius-md)]
    border border-[var(--border)]
    bg-[var(--bg-card)]
    p-3
    shadow-[var(--shadow-card)]
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
                <p className="truncate text-[10px] font-medium text-[var(--text-primary)]">
                    {provider.name}
                </p>

                <p className="mt-0.5 text-[8px] text-[var(--text-secondary)]">
                    {provider.specialist}
                </p>

                <div className="mt-1 flex items-center gap-3 text-[8px] text-[var(--text-muted)]">
                    <div className="flex items-center gap-1">
                        <MapPin size={8} />

                        <span>{provider.distance}</span>
                    </div>

                    <div className="flex items-center gap-1">
                        <Star
                            size={8}
                            className="fill-[var(--brand-gold)] text-[var(--brand-gold)]"
                        />

                        <span>
                            {provider.rating} ({provider.reviews} reviews)
                        </span>
                    </div>
                </div>
            </div>

            <span className="shrink-0 text-xs font-semibold text-[var(--accent-secondary)]">
                {provider.price}
            </span>
        </article>
    );
}