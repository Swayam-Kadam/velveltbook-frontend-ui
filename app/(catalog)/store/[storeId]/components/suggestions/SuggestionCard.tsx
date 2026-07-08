import Link from "next/link";
import Image from "next/image";
import { ChevronRight, MapPin, Star } from "lucide-react";

import type { Suggestion } from "../types";

interface Props {
  suggestion: Suggestion;
  bookNowLabel: string;
}

export default function SuggestionCard({ suggestion, bookNowLabel }: Props) {
  return (
    <article className="group rounded-[var(--radius-md)] border border-(--border) bg-(--bg-card) p-3 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[var(--shadow-card)]">
      <div className="flex items-start gap-3">
        <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-xl">
          <Image
            src={suggestion.image}
            alt={suggestion.name}
            fill
            sizes="48px"
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-2">
            <h3 className="truncate text-sm font-semibold text-(--text-primary)">
              {suggestion.name}
            </h3>

            <span className="primary-button shrink-0 rounded-full px-2.5 py-0.5 text-[9px] font-medium text-white">
              {suggestion.timing}
            </span>
          </div>

          <p className="mt-0.5 truncate text-[11px] font-medium text-(--brand-gold)">
            {suggestion.subtitle}
          </p>

          <div className="mt-1.5 flex flex-wrap items-center gap-x-3 gap-y-1 text-[10px] text-(--text-secondary)">
            <div className="flex items-center gap-1">
              <Star
                size={11}
                className="fill-(--brand-gold) text-(--brand-gold)"
              />
              <span className="font-medium text-(--text-primary)">
                {suggestion.rating}
              </span>
              <span>({suggestion.reviewsLabel})</span>
            </div>

            <div className="flex items-center gap-1">
              <MapPin size={11} />
              <span>{suggestion.distance}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-3 flex items-center gap-2">
        <Link
          href={`/store/${suggestion.storeId}`}
          className="primary-button flex h-9 flex-1 items-center justify-center rounded-lg text-xs font-medium text-white"
        >
          {bookNowLabel}
        </Link>

        <Link
          href={`/store/${suggestion.storeId}`}
          aria-label={`View ${suggestion.name}`}
          className="secondary-button flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-(--border) text-(--text-primary) transition-colors hover:border-(--accent-primary)"
        >
          <ChevronRight size={16} />
        </Link>
      </div>
    </article>
  );
}
