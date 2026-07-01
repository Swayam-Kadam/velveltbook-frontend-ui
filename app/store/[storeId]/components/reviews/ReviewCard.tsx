import Image from "next/image";
import { Quote, Star } from "lucide-react";

import type { Review } from "../types";

interface Props {
  review: Review;
}

export default function ReviewCard({ review }: Props) {
  return (
    <article className="relative flex h-full w-full flex-col overflow-hidden rounded-[var(--radius-md)] border border-(--border) bg-(--bg-card) p-3 shadow-[var(--shadow-card)] transition-all duration-300 hover:-translate-y-0.5 lg:p-5">
      <div className="flex items-start gap-3">
        <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-full border border-(--border)">
          <Image
            src={review.avatar}
            alt={review.name}
            fill
            sizes="40px"
            className="object-cover"
          />
        </div>

        <div className="flex min-w-0 flex-1 flex-col">
          <h3 className="text-sm font-semibold text-(--text-primary)">
            {review.name}
          </h3>

          <div className="mt-0.5 flex items-center gap-2">
            <div className="flex items-center gap-0.5">
              {Array.from({ length: 5 }).map((_, index) => (
                <Star
                  key={index}
                  size={12}
                  className={
                    index < review.rating
                      ? "fill-(--brand-gold) text-(--brand-gold)"
                      : "text-(--border)"
                  }
                />
              ))}
            </div>

            <span className="text-[10px] text-(--text-muted) lg:text-xs">
              {review.date}
            </span>
          </div>
        </div>
      </div>

      <p className="mt-3 flex-1 text-xs leading-relaxed text-(--text-secondary) lg:text-sm">
        {review.comment}
      </p>

      <Quote
        size={28}
        className="absolute bottom-3 right-3 text-(--border) lg:bottom-4 lg:right-4 lg:size-10"
        strokeWidth={1}
      />
    </article>
  );
}
