"use client";

import Image from "next/image";
import Link from "next/link";
import { ChevronRight, MapPin, Settings2, Star } from "lucide-react";

import { trendingNearbyData } from "@/home/components/trending-nearby/trending-nearby.data";
import type { TrendingNearbyItem } from "@/types/home";

const DESKTOP_PANEL_HEIGHT = "h-[calc(100vh-7rem)]";

interface FavoriteStoresSuggestionsSidebarProps {
  excludeStoreIds?: string[];
}

function SuggestionCard({ item }: { item: TrendingNearbyItem }) {
  const bookHref = `/specificorganizationbook/${item.organizationId}`;

  return (
    <article className="rounded-2xl border border-(--border) bg-(--bg-card) p-3 transition-all hover:border-(--accent-primary)/35">
      <Link href={bookHref} className="flex w-full items-start gap-2.5 text-left">
        <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-xl">
          <Image
            src={item.avatar}
            alt={item.name}
            fill
            sizes="56px"
            className="object-cover"
          />
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0">
              <h3 className="truncate text-[14px] font-semibold text-(--text-primary)">
                {item.name}
              </h3>
              <p className="mt-0.5 truncate text-[11px] text-(--text-muted)">
                {item.desktopService ?? item.service}
              </p>
            </div>
            <span className="primary-button shrink-0 rounded-full px-2 py-0.5 text-[9px] font-semibold text-white">
              {item.availability}
            </span>
          </div>

          <div className="mt-1.5 flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] text-(--text-secondary)">
            <span className="inline-flex items-center gap-1">
              <Star
                size={11}
                className="fill-(--brand-gold) text-(--brand-gold)"
              />
              <span className="font-medium text-(--text-primary)">
                {item.rating ?? 4.8}
              </span>
              <span>({item.reviews ?? "120+"})</span>
            </span>
            <span className="inline-flex items-center gap-1">
              <MapPin size={11} />
              {item.distance ?? "1.2km away"}
            </span>
          </div>
        </div>
      </Link>

      <Link
        href={bookHref}
        className="
          primary-button mt-3 flex h-10 w-full items-center justify-between
          rounded-full px-4 text-[13px] font-semibold text-white
        "
      >
        <span>Book Now</span>
        <span className="flex h-6 w-6 items-center justify-center rounded-full bg-white/20">
          <ChevronRight size={14} strokeWidth={2.5} />
        </span>
      </Link>
    </article>
  );
}

export function FavoriteStoresSuggestionsSidebar({
  excludeStoreIds = [],
}: FavoriteStoresSuggestionsSidebarProps) {
  const excluded = new Set(excludeStoreIds);
  const suggestions = trendingNearbyData.filter((item) => !excluded.has(item.id));

  return (
    <aside className="hidden w-[320px] shrink-0 lg:sticky lg:top-24 lg:flex lg:flex-col lg:self-start">
      <div
        className={`
          flex ${DESKTOP_PANEL_HEIGHT} flex-col overflow-hidden rounded-[22px]
          border border-(--border) bg-(--bg-card) shadow-[var(--shadow-card)]
        `}
      >
        <div className="flex shrink-0 items-center justify-between border-b border-(--border) px-4 py-4">
          <h2 className="font-[family-name:var(--font-heading)] text-[20px] font-semibold text-(--text-primary)">
            Suggestions
          </h2>
          <button
            type="button"
            aria-label="Filter suggestions"
            className="flex h-9 w-9 items-center justify-center rounded-xl border border-(--border) text-(--text-muted) transition-colors hover:text-(--text-primary)"
          >
            <Settings2 size={16} />
          </button>
        </div>

        <div className="min-h-0 flex-1 space-y-3 overflow-y-auto px-3 py-3 scrollbar-thin scrollbar-thumb-(--accent-primary)/30 scrollbar-track-transparent">
          {suggestions.length > 0 ? (
            suggestions.map((item) => (
              <SuggestionCard key={item.id} item={item} />
            ))
          ) : (
            <p className="py-8 text-center text-sm text-(--text-muted)">
              No suggestions right now.
            </p>
          )}
        </div>

        <div className="shrink-0 border-t border-(--border) px-4 py-3 text-center">
          <Link
            href="/home"
            className="text-[13px] font-semibold text-(--accent-primary) transition-opacity hover:opacity-80"
          >
            View More &gt;
          </Link>
        </div>
      </div>
    </aside>
  );
}
