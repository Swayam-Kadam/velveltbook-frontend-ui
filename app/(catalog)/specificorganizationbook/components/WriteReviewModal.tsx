"use client";

import { useState } from "react";
import { Star, X } from "lucide-react";

interface WriteReviewModalProps {
  organizationName: string;
  onClose: () => void;
  onSubmit: (review: {
    rating: number;
    text: string;
    name: string;
  }) => void;
}

export function WriteReviewModal({
  organizationName,
  onClose,
  onSubmit,
}: WriteReviewModalProps) {
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [name, setName] = useState("");
  const [text, setText] = useState("");

  const displayRating = hoverRating || rating;

  const handleSubmit = () => {
    if (rating < 1 || !text.trim()) return;
    onSubmit({
      rating,
      text: text.trim(),
      name: name.trim() || "Guest",
    });
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center  bg-black/50 p-3"
      onClick={onClose}
      role="presentation"
    >
      <div
        className="
          w-full max-w-md overflow-hidden rounded-2xl border border-(--border)
          bg-(--bg-card) shadow-[var(--shadow-card)] mt-[-2rem]
        "
        onClick={(event) => event.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="write-review-title"
      >
        <div className="flex items-start justify-between gap-3 border-b border-(--border) px-4 py-4">
          <div>
            <h2
              id="write-review-title"
              className="text-[18px] font-semibold text-(--text-primary)"
            >
              Write a review
            </h2>
            <p className="mt-0.5 text-[12px] text-(--text-muted)">
              Share your experience at {organizationName}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close review form"
            className="flex h-8 w-8 items-center justify-center rounded-full border border-(--border) text-(--text-muted) transition-colors hover:text-(--text-primary)"
          >
            <X size={16} />
          </button>
        </div>

        <div className="space-y-4 px-4 py-4">
          <div>
            <p className="mb-2 text-[12px] font-semibold text-(--text-primary)">
              Your rating
            </p>
            <div className="flex items-center gap-1">
              {Array.from({ length: 5 }).map((_, index) => {
                const starValue = index + 1;
                const active = starValue <= displayRating;

                return (
                  <button
                    key={starValue}
                    type="button"
                    aria-label={`Rate ${starValue} star${starValue === 1 ? "" : "s"}`}
                    onClick={() => setRating(starValue)}
                    onMouseEnter={() => setHoverRating(starValue)}
                    onMouseLeave={() => setHoverRating(0)}
                    className="rounded p-0.5 transition-transform hover:scale-110"
                  >
                    <Star
                      size={28}
                      className={
                        active
                          ? "fill-(--brand-gold) text-(--brand-gold)"
                          : "text-(--border)"
                      }
                    />
                  </button>
                );
              })}
            </div>
            <p className="mt-1.5 text-[11px] text-(--text-muted)">
              {rating > 0
                ? `${rating} star${rating === 1 ? "" : "s"} selected`
                : "Tap a star to rate"}
            </p>
          </div>

          {/* <div>
            <label
              htmlFor="review-name"
              className="mb-1.5 block text-[12px] font-semibold text-(--text-primary)"
            >
              Your name
            </label>
            <input
              id="review-name"
              type="text"
              value={name}
              onChange={(event) => setName(event.target.value)}
              placeholder="Enter your name"
              className="
                w-full rounded-xl border border-(--border) bg-(--bg-secondary)
                px-3.5 py-2.5 text-[13px] text-(--text-primary) outline-none
                placeholder:text-(--text-muted) focus:border-(--accent-primary)
              "
            />
          </div> */}

          <div>
            <label
              htmlFor="review-text"
              className="mb-1.5 block text-[12px] font-semibold text-(--text-primary)"
            >
              Your review
            </label>
            <textarea
              id="review-text"
              value={text}
              onChange={(event) => setText(event.target.value)}
              placeholder="Tell others about your visit..."
              rows={4}
              className="
                w-full resize-none rounded-xl border border-(--border)
                bg-(--bg-secondary) px-3.5 py-2.5 text-[13px] text-(--text-primary)
                outline-none placeholder:text-(--text-muted)
                focus:border-(--accent-primary)
              "
            />
          </div>
        </div>

        <div className="flex gap-2.5 border-t border-(--border) px-4 py-4">
          <button
            type="button"
            onClick={onClose}
            className="
              secondary-button inline-flex h-11 flex-1 items-center justify-center
              rounded-xl text-[13px] font-semibold
            "
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            disabled={rating < 1 || !text.trim()}
            className="
              primary-button inline-flex h-11 flex-1 items-center justify-center
              rounded-xl text-[13px] font-semibold text-white
              disabled:cursor-not-allowed disabled:opacity-50
            "
          >
            Submit review
          </button>
        </div>
      </div>
    </div>
  );
}
