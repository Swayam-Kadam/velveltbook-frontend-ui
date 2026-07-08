"use client";

import { useEffect, useState } from "react";
import {
  Armchair,
  ArrowRight,
  Check,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

import { BookingSeat } from "../../booking.types";

const VISIBLE_SEAT_COUNT = 4;

interface SeatSelectionSectionProps {
  seats: BookingSeat[];
  selectedSeatId: string;
  seatConfirmed: boolean;
  onSelectSeat: (id: string) => void;
  onConfirmSeat: () => void;
}

function SeatIcon({
  variant,
  size = 18,
}: {
  variant: "selected" | "available" | "unavailable";
  size?: number;
}) {
  if (variant === "selected") {
    return (
      <Armchair size={size} className="text-white" strokeWidth={1.6} />
    );
  }

  if (variant === "available") {
    return (
      <Armchair
        size={size}
        className="text-(--brand-gold)"
        strokeWidth={1.6}
      />
    );
  }

  return (
    <Armchair
      size={size}
      className="text-(--text-muted)"
      strokeWidth={1.6}
      fill="color-mix(in srgb, var(--text-muted) 35%, transparent)"
    />
  );
}

function RoundChevron({
  dir,
  onClick,
  label,
  disabled = false,
}: {
  dir: "left" | "right";
  onClick: () => void;
  label: string;
  disabled?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={label}
      className="
        flex h-7 w-7 shrink-0 items-center justify-center rounded-full
        border border-(--border) bg-(--bg-card) text-(--text-primary)
        transition-colors hover:bg-(--bg-card-hover)
        disabled:cursor-not-allowed disabled:opacity-40
      "
    >
      {dir === "left" ? (
        <ChevronLeft size={14} strokeWidth={2} />
      ) : (
        <ChevronRight size={14} strokeWidth={2} />
      )}
    </button>
  );
}

export function SeatSelectionSection({
  seats,
  selectedSeatId,
  seatConfirmed,
  onSelectSeat,
  onConfirmSeat,
}: SeatSelectionSectionProps) {
  const [offset, setOffset] = useState(0);

  const selectedSeat =
    seats.find((seat) => seat.id === selectedSeatId) ?? seats[0];

  useEffect(() => {
    const idx = seats.findIndex((seat) => seat.id === selectedSeatId);
    if (idx < 0) return;

    setOffset((prev) => {
      if (idx < prev) return idx;
      if (idx >= prev + VISIBLE_SEAT_COUNT) {
        return Math.max(0, idx - VISIBLE_SEAT_COUNT + 1);
      }
      return prev;
    });
  }, [selectedSeatId, seats]);

  const visibleSeats = seats.slice(offset, offset + VISIBLE_SEAT_COUNT);
  const canScrollLeft = offset > 0;
  const canScrollRight = offset + VISIBLE_SEAT_COUNT < seats.length;

  const scrollWindow = (dir: 1 | -1) => {
    setOffset((prev) =>
      Math.max(0, Math.min(seats.length - VISIBLE_SEAT_COUNT, prev + dir)),
    );
  };

  const handleSelectSeat = (seat: BookingSeat) => {
    if (seat.status === "unavailable") return;
    onSelectSeat(seat.id);
  };

  return (
    <section className="feature-card rounded-xl p-3">
      <div className="mb-3 flex items-start gap-2">
        <span
          className="
            flex h-8 w-8 shrink-0 items-center justify-center rounded-lg
            bg-[color-mix(in_srgb,var(--brand-gold)_18%,transparent)]
          "
        >
          <Armchair size={16} className="text-(--accent-primary)" strokeWidth={1.6} />
        </span>
        <div>
          <h3 className="text-sm font-bold text-(--text-primary)">
            Select Your Seat
          </h3>
          <p className="text-[9px] font-semibold text-(--text-muted)">
            Choose your preferred seat for the selected time
          </p>
        </div>
      </div>

      <div
        className="
          mb-3 flex flex-wrap items-center justify-center gap-x-4 gap-y-1
          rounded-lg border border-(--border) px-3 py-2
        "
      >
        <div className="flex items-center gap-1.5">
          <SeatIcon variant="selected" size={14} />
          <span className="text-[9px] font-semibold text-(--text-primary)">
            Selected
          </span>
        </div>
        <div className="flex items-center gap-1.5">
          <SeatIcon variant="available" size={14} />
          <span className="text-[9px] font-semibold text-(--text-primary)">
            Available
          </span>
        </div>
        <div className="flex items-center gap-1.5">
          <SeatIcon variant="unavailable" size={14} />
          <span className="text-[9px] font-semibold text-(--text-primary)">
            Unavailable
          </span>
        </div>
      </div>

      <div className="rounded-xl border border-(--border) bg-(--bg-card) p-2.5">
        <div className="flex items-center gap-1.5">
          <RoundChevron
            dir="left"
            label="Previous seats"
            onClick={() => scrollWindow(-1)}
            disabled={!canScrollLeft}
          />

          <div className="grid min-w-0 flex-1 grid-cols-4 gap-1">
            {visibleSeats.map((seat) => {
              const selected = seat.id === selectedSeatId;
              const unavailable = seat.status === "unavailable";

              return (
                <button
                  key={seat.id}
                  type="button"
                  disabled={unavailable}
                  onClick={() => handleSelectSeat(seat)}
                  className="
                    flex flex-col items-center gap-1.5 rounded-lg p-1
                    transition-all duration-200
                    disabled:cursor-not-allowed
                  "
                >
                  <div
                    className={`
                      relative flex h-14 w-full items-center justify-center
                      rounded-lg transition-all duration-200
                      ${
                        selected
                          ? "primary-button shadow-(--shadow-glow)"
                          : unavailable
                            ? "bg-[color-mix(in_srgb,var(--text-muted)_12%,transparent)]"
                            : "border border-[color-mix(in_srgb,var(--brand-gold)_45%,var(--border))] bg-(--bg-primary)"
                      }
                    `}
                  >
                    <SeatIcon
                      variant={
                        selected
                          ? "selected"
                          : unavailable
                            ? "unavailable"
                            : "available"
                      }
                      size={selected ? 24 : 22}
                    />
                    {selected && (
                      <span
                        className="
                          absolute -right-0.5 -top-0.5 flex h-4 w-4 items-center
                          justify-center rounded-full border-2 border-white
                          bg-(--accent-primary) text-white
                        "
                      >
                        <Check size={9} strokeWidth={3} />
                      </span>
                    )}
                  </div>
                  <span
                    className={`text-[10px] font-bold ${
                      selected
                        ? "text-(--accent-primary)"
                        : unavailable
                          ? "text-(--text-muted)"
                          : "text-(--text-secondary)"
                    }`}
                  >
                    {seat.label}
                  </span>
                </button>
              );
            })}
          </div>

          <RoundChevron
            dir="right"
            label="Next seats"
            onClick={() => scrollWindow(1)}
            disabled={!canScrollRight}
          />
        </div>
      </div>

      <div
        className="
          mt-3 flex items-center justify-between gap-2 rounded-xl
          border border-(--border) bg-(--bg-card) p-2.5
        "
      >
        <div className="flex min-w-0 items-center gap-2">
          <span
            className="
              flex h-9 w-9 shrink-0 items-center justify-center rounded-full
              bg-[color-mix(in_srgb,var(--brand-gold)_18%,transparent)]
            "
          >
            <Armchair size={16} className="text-(--accent-primary)" strokeWidth={1.6} />
          </span>
          <div className="min-w-0">
            <p className="text-[8px] font-semibold text-(--text-muted)">
              Selected Seat
            </p>
            <p className="text-lg font-bold leading-tight text-(--accent-primary)">
              {selectedSeat?.label ?? "—"}
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={onConfirmSeat}
          disabled={!selectedSeat || selectedSeat.status === "unavailable"}
          className="
            primary-button flex shrink-0 items-center gap-1.5 rounded-xl
            px-4 py-2.5 text-[10px] font-semibold text-white
            disabled:cursor-not-allowed disabled:opacity-50
          "
        >
          {seatConfirmed ? "Seat Confirmed" : "Confirm Seat"}
          {!seatConfirmed && <ArrowRight size={14} strokeWidth={2} />}
        </button>
      </div>
    </section>
  );
}
