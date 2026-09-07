"use client";

import Image from "next/image";
import Link from "next/link";
import { ChevronRight, MapPin, Star } from "lucide-react";

import { getSuggestionStores } from "./suggestion-stores";
import type { TrendingNearbyItem } from "@/types/home";

interface FavoriteStoresSuggestionsRowProps {
  excludeStoreIds?: string[];
  className?: string;
}

function SuggestionCard({ item }: { item: TrendingNearbyItem }) {
  const bookHref = `/specificorganizationbook/${item.organizationId}`;

  return (
    <article
      className="
        flex h-full min-w-0 flex-col overflow-hidden rounded-2xl
        border border-(--border) bg-(--bg-card) p-2.5
        transition-all hover:border-(--accent-primary)/35
      "
    >
      <Link href={bookHref} className="flex min-h-0 flex-1 items-start gap-2 text-left">
        <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-xl">
          <Image
            src={item.avatar}
            alt={item.name}
            fill
            sizes="48px"
            className="object-cover"
          />
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-1.5">
            <div className="min-w-0">
              <h3 className="truncate text-[13px] font-semibold text-(--text-primary)">
                {item.name}
              </h3>
              <p className="mt-0.5 truncate text-[10px] text-(--text-muted)">
                {item.desktopService ?? item.service}
              </p>
            </div>
            <span className="primary-button shrink-0 rounded-full px-1.5 py-0.5 text-[8px] font-semibold text-white">
              {item.availability}
            </span>
          </div>

          <div className="mt-1 flex flex-wrap items-center gap-x-2 gap-y-0.5 text-[10px] text-(--text-secondary)">
            <span className="inline-flex items-center gap-0.5">
              <Star
                size={10}
                className="fill-(--brand-gold) text-(--brand-gold)"
              />
              <span className="font-medium text-(--text-primary)">
                {item.rating ?? 4.8}
              </span>
            </span>
            <span className="inline-flex items-center gap-0.5">
              <MapPin size={10} />
              {item.distance ?? "1.2km away"}
            </span>
          </div>
        </div>
      </Link>

      <Link
        href={bookHref}
        className="
          primary-button mt-2 flex h-8 w-full shrink-0 items-center justify-between
          rounded-full px-3 text-[12px] font-semibold text-white
        "
      >
        <span>Book Now</span>
        <span className="flex h-5 w-5 items-center justify-center rounded-full bg-white/20">
          <ChevronRight size={12} strokeWidth={2.5} />
        </span>
      </Link>
    </article>
  );
}

export function FavoriteStoresSuggestionsRow({
  excludeStoreIds = [],
  className = "",
}: FavoriteStoresSuggestionsRowProps) {
  const suggestions = getSuggestionStores(excludeStoreIds);

  if (suggestions.length === 0) return null;

  return (
    <section
      className={`
        flex min-h-0 flex-col overflow-hidden rounded-[18px] border border-(--border)
        bg-(--bg-card) shadow-[var(--shadow-card)]
        ${className}
      `}
    >
      <div className="flex shrink-0 items-center justify-between border-b border-(--border) px-3 py-2">
        <h2 className="font-[family-name:var(--font-heading)] text-[15px] font-semibold text-(--text-primary)">
          Suggestions
        </h2>
        <Link
          href="/home"
          className="text-[11px] font-semibold text-(--accent-primary) transition-opacity hover:opacity-80"
        >
          View More &gt;
        </Link>
      </div>

      <div
        className="
          scrollbar-thin scrollbar-thumb-(--accent-primary)/30 scrollbar-track-transparent
          min-h-0 flex-1 overflow-y-auto px-3 py-2.5
        "
      >
        <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-3 lg:grid-cols-4">
          {suggestions.map((item) => (
            <SuggestionCard key={item.id} item={item} />
          ))}
        </div>
      </div>
    </section>
  );
}
