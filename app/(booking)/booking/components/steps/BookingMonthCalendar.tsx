"use client";

import { useEffect, useMemo, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

import type { BookingDay } from "../../booking.types";

const WEEKDAY_HEADERS = ["S", "M", "T", "W", "T", "F", "S"];
const MONTH_NAMES = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

function parseIso(iso: string) {
  const [year, month, day] = iso.split("-").map(Number);
  return { year, month: month - 1, day };
}

interface BookingMonthCalendarProps {
  days: BookingDay[];
  activeDayId: string;
  onSelectDay: (id: string) => void;
}

export function BookingMonthCalendar({
  days,
  activeDayId,
  onSelectDay,
}: BookingMonthCalendarProps) {
  const firstAvailable = days[0];
  const lastAvailable = days[days.length - 1];
  const initial = parseIso(
    days.find((d) => d.id === activeDayId)?.iso ?? firstAvailable?.iso ?? "",
  );
  const [view, setView] = useState({
    year: initial.year || new Date().getFullYear(),
    month: Number.isFinite(initial.month)
      ? initial.month
      : new Date().getMonth(),
  });

  useEffect(() => {
    const selected = days.find((d) => d.id === activeDayId);
    if (!selected) return;
    const parsed = parseIso(selected.iso);
    setView({ year: parsed.year, month: parsed.month });
  }, [activeDayId, days]);

  const firstBound = firstAvailable ? parseIso(firstAvailable.iso) : null;
  const lastBound = lastAvailable ? parseIso(lastAvailable.iso) : null;

  const canPrev =
    firstBound !== null &&
    (view.year > firstBound.year ||
      (view.year === firstBound.year && view.month > firstBound.month));
  const canNext =
    lastBound !== null &&
    (view.year < lastBound.year ||
      (view.year === lastBound.year && view.month < lastBound.month));

  const goPrev = () => {
    if (!canPrev) return;
    setView(({ year, month }) =>
      month === 0 ? { year: year - 1, month: 11 } : { year, month: month - 1 },
    );
  };

  const goNext = () => {
    if (!canNext) return;
    setView(({ year, month }) =>
      month === 11 ? { year: year + 1, month: 0 } : { year, month: month + 1 },
    );
  };

  const cells = useMemo(() => {
    const firstWeekday = new Date(view.year, view.month, 1).getDay();
    const daysInMonth = new Date(view.year, view.month + 1, 0).getDate();
    const result: (number | null)[] = Array.from(
      { length: firstWeekday },
      () => null,
    );
    for (let d = 1; d <= daysInMonth; d += 1) result.push(d);
    return result;
  }, [view]);

  const dayByIso = useMemo(() => {
    const map = new Map<string, BookingDay>();
    for (const day of days) map.set(day.iso, day);
    return map;
  }, [days]);

  const todayIso = useMemo(() => {
    const now = new Date();
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}`;
  }, []);

  return (
    <div className="rounded-xl border border-(--border) bg-(--bg-card) p-2.5">
      <div className="mb-2 flex items-center justify-between">
        <button
          type="button"
          onClick={goPrev}
          disabled={!canPrev}
          aria-label="Previous month"
          className="
            flex h-7 w-7 items-center justify-center rounded-lg border
            border-(--border) text-(--text-primary) transition-colors
            hover:bg-(--bg-secondary) disabled:cursor-not-allowed
            disabled:opacity-35
          "
        >
          <ChevronLeft size={14} />
        </button>
        <p className="text-[12px] font-semibold text-(--text-primary)">
          {MONTH_NAMES[view.month]} {view.year}
        </p>
        <button
          type="button"
          onClick={goNext}
          disabled={!canNext}
          aria-label="Next month"
          className="
            flex h-7 w-7 items-center justify-center rounded-lg border
            border-(--border) text-(--text-primary) transition-colors
            hover:bg-(--bg-secondary) disabled:cursor-not-allowed
            disabled:opacity-35
          "
        >
          <ChevronRight size={14} />
        </button>
      </div>

      <div className="mb-1 grid grid-cols-7 gap-0.5">
        {WEEKDAY_HEADERS.map((label, index) => (
          <span
            key={`${label}-${index}`}
            className="py-0.5 text-center text-[9px] font-semibold text-(--text-muted)"
          >
            {label}
          </span>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-0.5">
        {cells.map((dayNum, index) => {
          if (dayNum === null) {
            return <span key={`empty-${index}`} className="h-8" />;
          }

          const iso = `${view.year}-${String(view.month + 1).padStart(2, "0")}-${String(dayNum).padStart(2, "0")}`;
          const bookingDay = dayByIso.get(iso);
          const selectable = Boolean(bookingDay);
          const active = bookingDay?.id === activeDayId;
          const isToday = iso === todayIso;

          return (
            <button
              key={iso}
              type="button"
              disabled={!selectable}
              onClick={() => {
                if (bookingDay) onSelectDay(bookingDay.id);
              }}
              className={`
                flex h-5 items-center justify-center rounded-xs text-[11px]
                font-semibold transition-all
                ${
                  active
                    ? "primary-button text-white"
                    : selectable
                      ? `text-(--text-primary) hover:bg-(--bg-secondary) ${
                          isToday
                            ? "ring-1 ring-(--brand-gold)"
                            : ""
                        }`
                      : "cursor-not-allowed text-(--text-muted)/35"
                }
              `}
            >
              {dayNum}
            </button>
          );
        })}
      </div>
    </div>
  );
}
