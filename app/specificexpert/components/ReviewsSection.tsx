import Image from "next/image";
import { ArrowRight, Star } from "lucide-react";

import { ExpertReview } from "../expert.types";

interface ReviewsSectionProps {
  reviews: ExpertReview[];
  totalReviews: number;
}

export function ReviewsSection({ reviews, totalReviews }: ReviewsSectionProps) {
  return (
    <article className="feature-card rounded-xl p-3">
      <div className="mb-2.5 flex items-center justify-between gap-2">
        <h2 className="text-xs font-medium text-(--text-primary)">
          Reviews ({totalReviews})
        </h2>

        <button
          type="button"
          className="
            flex items-center gap-0.5 text-[8px]
            text-(--accent-secondary) transition-opacity duration-200
            hover:opacity-80
          "
        >
          <span>View All Reviews</span>
          <ArrowRight size={10} strokeWidth={2} />
        </button>
      </div>

      <div
        className="
          flex gap-2 overflow-x-auto pb-1
          snap-x snap-mandatory scrollbar-none
        "
      >
        {reviews.map((review) => (
          <article
            key={review.id}
            className="
              w-[160px] shrink-0 snap-start rounded-sm
              border border-(--border) bg-(--bg-card-hover) p-2
            "
          >
            <div className="flex items-center gap-2">
              <div className="relative h-7 w-7 shrink-0 overflow-hidden rounded-full">
                <Image
                  src={review.avatar}
                  alt={review.name}
                  fill
                  sizes="28px"
                  className="object-cover"
                />
              </div>

              <div className="min-w-0 flex-1">
                <p className="truncate text-[8px] font-medium text-(--text-primary)">
                  {review.name}
                </p>
                <p className="text-[7px] text-(--text-muted)">
                  {review.rating.toFixed(1)}
                </p>
              </div>
            </div>

            <div className="mt-1 flex items-center gap-0.5">
              {Array.from({ length: 5 }).map((_, index) => (
                <Star
                  key={index}
                  size={8}
                  className="fill-(--brand-gold) text-(--brand-gold)"
                />
              ))}
            </div>

            <p className="mt-1.5 line-clamp-3 text-[8px] font-semibold leading-relaxed text-(--text-secondary)">
              {review.text}
            </p>
          </article>
        ))}
      </div>
    </article>
  );
}
