import Image from "next/image";
import { ArrowRight, MoreHorizontal, Star } from "lucide-react";

import { ExtendedReview } from "../organization.types";

interface ReviewsSectionProps {
  reviews: ExtendedReview[];
}

export function ReviewsSection({ reviews }: ReviewsSectionProps) {
  return (
    <section>
      <div className="mb-3 flex items-center justify-between">
        <h2 className="text-xs font-medium text-(--text-primary)">Reviews</h2>
        <button
          type="button"
          className="primary-button flex items-center gap-0.5 text-[9px] font-bold text-(--brand-gold) bg-(--bg-primary) rounded-xs px-2 py-1"
        >
          <span>View All</span>
          <ArrowRight size={10} strokeWidth={2} />
        </button>
      </div>

      {reviews.map((review) => (
        <article key={review.id} className="feature-card rounded-xl p-3">
          <div className="flex items-start gap-2">
            <div className="relative h-8 w-8 shrink-0 overflow-hidden rounded-full bg-(--bg-card-hover)">
              <Image
                src={review.avatar}
                alt={review.name}
                fill
                sizes="32px"
                className="object-cover"
              />
            </div>

            <div className="min-w-0 flex-1">
              <div className="flex items-center justify-between gap-2">
                <p className="text-[10px] font-medium text-(--text-primary)">
                  {review.name}
                </p>
                <button type="button" aria-label="More options">
                  <MoreHorizontal size={14} className="text-(--text-muted)" />
                </button>
              </div>

              <div className="mt-0.5 flex items-center gap-2">
                <div className="flex items-center gap-0.5">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      size={8}
                      className={
                        i < Math.floor(review.rating)
                          ? "fill-(--brand-gold) text-(--brand-gold)"
                          : "text-(--border)"
                      }
                    />
                  ))}
                </div>
                <span className="text-[7px] text-(--text-muted)">
                  {review.date}
                </span>
              </div>
            </div>
          </div>

          <p className="mt-2 text-[8px] leading-relaxed text-(--text-secondary)">
            {review.text}
          </p>
        </article>
      ))}
    </section>
  );
}
