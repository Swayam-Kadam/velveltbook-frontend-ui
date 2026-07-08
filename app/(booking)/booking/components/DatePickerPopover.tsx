"use client";

import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
  type RefObject,
} from "react";
import { createPortal } from "react-dom";
import { ChevronLeft, ChevronRight } from "lucide-react";

import type { BookingDay } from "../booking.types";

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

const POPOVER_WIDTH = 240;
const VIEWPORT_PADDING = 16;

interface DatePickerPopoverProps {
  days: BookingDay[];
  activeDayId: string;
  onSelect: (dayId: string) => void;
  onClose: () => void;
  align?: "start" | "center" | "end";
  anchorRef?: RefObject<HTMLElement | null>;
}

function parseIso(iso: string) {
  const [year, month, day] = iso.split("-").map(Number);
  return { year, month: month - 1, day };
}

function getPopoverWidth() {
  if (typeof window === "undefined") return POPOVER_WIDTH;
  return Math.min(POPOVER_WIDTH, window.innerWidth - VIEWPORT_PADDING * 2);
}

export function DatePickerPopover({
  days,
  activeDayId,
  onSelect,
  onClose,
  align = "end",
  anchorRef,
}: DatePickerPopoverProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState({ top: 0, left: 0 });
  const usePortal = Boolean(anchorRef);

  const updatePosition = useCallback(() => {
    if (!anchorRef?.current) return;

    const rect = anchorRef.current.getBoundingClientRect();
    const width = getPopoverWidth();
    const gap = 8;

    let left = rect.left;
    if (align === "center") {
      left = rect.left + rect.width / 2 - width / 2;
    } else if (align === "end") {
      left = rect.right - width;
    }

    left = Math.max(
      VIEWPORT_PADDING,
      Math.min(left, window.innerWidth - width - VIEWPORT_PADDING),
    );

    setPosition({
      top: rect.bottom + gap,
      left,
    });
  }, [align, anchorRef]);

  const availableByIso = useMemo(() => {
    const map = new Map<string, BookingDay>();
    days.forEach((day) => map.set(day.iso, day));
    return map;
  }, [days]);

  const firstAvailable = days[0];
  const lastAvailable = days[days.length - 1];

  const initial = parseIso(
    days.find((d) => d.id === activeDayId)?.iso ?? firstAvailable?.iso ?? "",
  );
  const [view, setView] = useState({ year: initial.year, month: initial.month });

  useLayoutEffect(() => {
    if (!usePortal) return;
    updatePosition();
  }, [usePortal, updatePosition, view]);

  useEffect(() => {
    if (!usePortal) return;

    const handleReposition = () => updatePosition();
    window.addEventListener("scroll", handleReposition, true);
    window.addEventListener("resize", handleReposition);

    return () => {
      window.removeEventListener("scroll", handleReposition, true);
      window.removeEventListener("resize", handleReposition);
    };
  }, [usePortal, updatePosition]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      const target = event.target as Node;
      if (containerRef.current?.contains(target)) return;
      if (anchorRef?.current?.contains(target)) return;
      onClose();
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [anchorRef, onClose]);

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

  const alignClass =
    align === "center"
      ? "left-1/2 -translate-x-1/2"
      : align === "start"
        ? "left-0"
        : "right-0";

  const popover = (
    <div
      ref={containerRef}
      role="dialog"
      aria-label="Choose a date"
      style={
        usePortal
          ? {
              position: "fixed",
              top: position.top,
              left: position.left,
              width: getPopoverWidth(),
              zIndex: 9999,
            }
          : undefined
      }
      className={
        usePortal
          ? `
            overflow-hidden rounded-xl border border-(--border) bg-(--bg-card)
            p-2 shadow-(--shadow-card)
          `
          : `
            absolute top-full z-50 mt-2 w-[min(15rem,calc(100vw-2rem))]
            overflow-hidden rounded-xl border border-(--border) bg-(--bg-card)
            p-2 shadow-(--shadow-card) ${alignClass}
          `
      }
    >
      <div className="flex items-center justify-between gap-1">
        <button
          type="button"
          onClick={goPrev}
          disabled={!canPrev}
          aria-label="Previous month"
          className="
            flex h-7 w-7 shrink-0 items-center justify-center rounded-full
            border border-(--border) text-(--text-secondary) transition-colors
            hover:border-(--accent-primary) hover:text-(--accent-primary)
            disabled:cursor-not-allowed disabled:opacity-40
          "
        >
          <ChevronLeft size={14} strokeWidth={2} />
        </button>
        <span className="truncate text-xs font-semibold text-(--text-primary)">
          {MONTH_NAMES[view.month]} {view.year}
        </span>
        <button
          type="button"
          onClick={goNext}
          disabled={!canNext}
          aria-label="Next month"
          className="
            flex h-7 w-7 shrink-0 items-center justify-center rounded-full
            border border-(--border) text-(--text-secondary) transition-colors
            hover:border-(--accent-primary) hover:text-(--accent-primary)
            disabled:cursor-not-allowed disabled:opacity-40
          "
        >
          <ChevronRight size={14} strokeWidth={2} />
        </button>
      </div>

      <div className="mt-2">
        <div className="grid grid-cols-7 gap-0.5">
          {WEEKDAY_HEADERS.map((label, index) => (
            <span
              key={`${label}-${index}`}
              className="flex h-5 items-center justify-center text-[9px] font-semibold text-(--text-muted)"
            >
              {label}
            </span>
          ))}

          {cells.map((day, index) => {
            if (day === null) return <span key={`blank-${index}`} />;

            const iso = `${view.year}-${String(view.month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
            const match = availableByIso.get(iso);
            const disabled = !match;
            const active = match?.id === activeDayId;

            return (
              <button
                key={iso}
                type="button"
                disabled={disabled}
                onClick={() => {
                  if (!match) return;
                  onSelect(match.id);
                  onClose();
                }}
                className={`mx-auto flex h-7 w-7 items-center justify-center rounded-full text-[11px] transition-colors ${
                  active
                    ? "primary-button font-semibold text-white"
                    : disabled
                      ? "cursor-not-allowed text-(--text-muted)/40"
                      : "text-(--text-primary) hover:bg-(--bg-secondary)"
                }`}
              >
                {day}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );

  if (usePortal) {
    return createPortal(popover, document.body);
  }

  return popover;
}
