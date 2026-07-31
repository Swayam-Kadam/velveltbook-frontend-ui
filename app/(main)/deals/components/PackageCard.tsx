import Image from "next/image";
import { MapPin, Star, Store } from "lucide-react";
import type { PackageDeal } from "../deals.types";

interface PackageCardProps {
  deal: PackageDeal;
  onBookClick?: (deal: PackageDeal) => void;
  desktop?: boolean;
}

function formatPrice(amount: number) {
  return `$${amount.toFixed(2)}`;
}

export function PackageCard({
  deal,
  onBookClick,
  desktop = false,
}: PackageCardProps) {
  if (desktop) {
    return (
      <article className="feature-card flex h-full flex-col overflow-hidden rounded-2xl border border-(--border) bg-(--bg-card) shadow-[var(--shadow-card)]">
        <div className="relative h-[148px] overflow-hidden">
          <Image
            src={deal.image}
            alt={deal.title}
            fill
            sizes="320px"
            className="object-cover"
          />

          <span className="primary-button absolute left-3 top-3 rounded-md px-2.5 py-1 text-[11px] font-semibold text-white">
            -{deal.discountPercent}%
          </span>

          {deal.isStore && (
            <span className="absolute right-3 top-3 flex items-center gap-1 rounded-full border border-(--border) bg-white/95 px-2.5 py-1 text-[10px] font-medium text-(--text-primary) backdrop-blur-sm">
              <Store size={11} strokeWidth={1.5} />
              Store
            </span>
          )}
        </div>

        <div className="flex flex-1 flex-col gap-2 p-3.5">
          <h3 className="line-clamp-1 text-[16px] font-semibold text-(--text-primary)">
            {deal.title}
          </h3>

          <div className="flex items-center justify-between gap-2 text-[11px]">
            <div className="flex min-w-0 items-center gap-1 text-(--text-secondary)">
              <Store size={12} strokeWidth={1.5} className="shrink-0" />
              <span className="truncate">{deal.salonName}</span>
            </div>
            <div className="flex shrink-0 items-center gap-1">
              <Star size={12} className="fill-(--brand-gold) text-(--brand-gold)" />
              <span className="font-medium text-(--text-primary)">{deal.rating}</span>
              <span className="text-(--text-secondary)">({deal.reviewCount})</span>
            </div>
          </div>

          <div className="flex items-start gap-1 text-[11px] leading-snug text-(--text-secondary)">
            <MapPin size={12} className="mt-0.5 shrink-0" strokeWidth={1.5} />
            <span className="line-clamp-1">{deal.location}</span>
          </div>

          <div className="flex flex-wrap gap-1.5">
            {deal.includedServices.slice(0, 4).map((service) => (
              <span
                key={service.label}
                className="rounded-full border border-(--border) bg-[color-mix(in_srgb,var(--accent-primary)_6%,var(--bg-card))] px-2 py-0.5 text-[10px] font-medium text-(--text-secondary)"
              >
                {service.label}
              </span>
            ))}
          </div>

          <div className="mt-auto flex items-center justify-between gap-3 pt-1">
            <div className="flex items-baseline gap-1.5">
              <span className="text-[22px] font-bold text-(--brand-gold)">
                {formatPrice(deal.currentPrice)}
              </span>
              <span className="text-[12px] text-(--text-muted) line-through">
                {formatPrice(deal.originalPrice)}
              </span>
            </div>

            <button
              type="button"
              onClick={() => onBookClick?.(deal)}
              className="primary-button inline-flex h-9 shrink-0 items-center justify-center rounded-xl px-4 text-[12px] font-semibold text-white transition-transform active:scale-[0.98]"
            >
              Book Package
            </button>
          </div>
        </div>
      </article>
    );
  }

  return (
    <article className="feature-card overflow-hidden rounded-xl">
      <div className="relative h-[110px] overflow-hidden">
        <Image
          src={deal.image}
          alt={deal.title}
          fill
          sizes="(max-width: 768px) 50vw, 300px"
          className="object-cover"
        />

        <span className="primary-button absolute left-2 top-2 rounded-md px-2 py-0.5 text-[9px] font-semibold text-white">
          -{deal.discountPercent}%
        </span>

        {deal.isStore && (
          <span className="absolute right-2 top-2 flex items-center gap-0.5 rounded-md border border-(--border) bg-(--bg-card)/90 px-1.5 py-0.5 text-[8px] font-medium text-(--text-primary) backdrop-blur-sm">
            <Store size={8} strokeWidth={1.5} />
            Store
          </span>
        )}
      </div>

      <div className="space-y-1.5 p-2">
        <h3 className="line-clamp-2 text-[11px] font-semibold leading-tight text-(--text-primary)">
          {deal.title}
        </h3>

        <div className="flex items-center justify-between gap-1">
          <div className="flex min-w-0 items-center gap-1 text-[8px] text-(--text-secondary)">
            <Store size={8} strokeWidth={1.5} className="shrink-0" />
            <span className="truncate">{deal.salonName}</span>
          </div>

          <div className="flex shrink-0 items-center gap-1 text-[8px]">
            <Star size={8} className="fill-(--brand-gold) text-(--brand-gold)" />
            <span className="font-medium text-(--text-primary)">{deal.rating}</span>
            <span className="text-(--text-secondary)">({deal.reviewCount})</span>
          </div>
        </div>

        <div className="flex items-start gap-1 text-[8px] leading-tight text-(--text-primary)">
          <MapPin size={8} className="mt-0.5 shrink-0" strokeWidth={1.5} />
          <span className="line-clamp-2">{deal.location}</span>
        </div>

        <div className="grid grid-cols-2 gap-1">
          {deal.includedServices.slice(0, 4).map((service) => (
            <span
              key={service.label}
              className="truncate rounded-full border border-(--border) bg-[color-mix(in_srgb,var(--accent-primary)_6%,var(--bg-card))] px-1.5 py-0.5 text-center text-[9px] font-bold text-(--text-secondary)"
            >
              {service.label}
            </span>
          ))}
        </div>

        <div className="flex items-baseline gap-1.5 pt-0.5">
          <span className="text-[14px] font-bold text-(--brand-gold)">
            {formatPrice(deal.currentPrice)}
          </span>
          <span className="text-[9px] text-(--text-muted) line-through">
            {formatPrice(deal.originalPrice)}
          </span>
        </div>

        <div className="pt-1">
          <button
            type="button"
            onClick={() => onBookClick?.(deal)}
            className="primary-button flex h-8 w-full items-center justify-center rounded-lg text-[10px] font-medium text-white transition-transform active:scale-[0.98]"
          >
            Book Package
          </button>
        </div>
      </div>
    </article>
  );
}
