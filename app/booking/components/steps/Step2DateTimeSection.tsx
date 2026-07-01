"use client";

import { useEffect, useMemo, useState } from "react";
import { Calendar, ChevronDown, ChevronLeft, ChevronRight, Clock3 } from "lucide-react";

import type { BookingDay } from "../../booking.types";
import { DatePickerPopover } from "../DatePickerPopover";

const MONTH_LABELS = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

const VISIBLE_DAY_COUNT = 4;
const VISIBLE_TIME_COUNT = 4;

type TimePeriod = "AM" | "PM";

function parseDayMonth(iso: string) {
  const [year, month] = iso.split("-").map(Number);
  return { year, month: month - 1 };
}

function getTimePeriod(time: string): TimePeriod {
  return time.endsWith("PM") ? "PM" : "AM";
}

function formatTimeParts(time: string) {
  const match = time.match(/^(.+?) (AM|PM)$/);
  return {
    clock: match?.[1] ?? time,
    period: (match?.[2] ?? getTimePeriod(time)) as TimePeriod,
  };
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
        flex h-6 w-6 shrink-0 items-center justify-center rounded-full
        border border-(--border) text-(--text-primary) transition-colors
        hover:bg-(--bg-card-hover) disabled:cursor-not-allowed disabled:opacity-40
      "
    >
      {dir === "left" ? (
        <ChevronLeft size={12} strokeWidth={2} />
      ) : (
        <ChevronRight size={12} strokeWidth={2} />
      )}
    </button>
  );
}

interface Step2DateTimeSectionProps {
  days: BookingDay[];
  times: string[];
  activeDayId: string;
  activeTime: string;
  onSelectDay: (id: string) => void;
  onSelectTime: (time: string) => void;
}

export function Step2DateTimeSection({
  days,
  times,
  activeDayId,
  activeTime,
  onSelectDay,
  onSelectTime,
}: Step2DateTimeSectionProps) {
  const [showCalendar, setShowCalendar] = useState(false);
  const [dayOffset, setDayOffset] = useState(0);
  const [timeOffset, setTimeOffset] = useState(0);
  const [timePeriod, setTimePeriod] = useState<TimePeriod>(() =>
    getTimePeriod(activeTime),
  );

  const filteredTimes = useMemo(
    () => times.filter((time) => getTimePeriod(time) === timePeriod),
    [times, timePeriod],
  );

  const activeDay = days.find((d) => d.id === activeDayId) ?? days[0];
  const activeMonth = activeDay
    ? parseDayMonth(activeDay.iso)
    : { year: new Date().getFullYear(), month: new Date().getMonth() };

  useEffect(() => {
    const idx = days.findIndex((d) => d.id === activeDayId);
    if (idx < 0) return;
    setDayOffset((prev) => {
      if (idx < prev) return idx;
      if (idx >= prev + VISIBLE_DAY_COUNT) {
        return Math.max(0, idx - VISIBLE_DAY_COUNT + 1);
      }
      return prev;
    });
  }, [activeDayId, days]);

  useEffect(() => {
    const idx = filteredTimes.findIndex((t) => t === activeTime);
    if (idx < 0) return;
    setTimeOffset((prev) => {
      if (idx < prev) return idx;
      if (idx >= prev + VISIBLE_TIME_COUNT) {
        return Math.max(0, idx - VISIBLE_TIME_COUNT + 1);
      }
      return prev;
    });
  }, [activeTime, filteredTimes]);

  useEffect(() => {
    setTimePeriod(getTimePeriod(activeTime));
  }, [activeTime]);

  const visibleDays = days.slice(dayOffset, dayOffset + VISIBLE_DAY_COUNT);
  const visibleTimes = filteredTimes.slice(
    timeOffset,
    timeOffset + VISIBLE_TIME_COUNT,
  );

  const canScrollDaysLeft = dayOffset > 0;
  const canScrollDaysRight = dayOffset + VISIBLE_DAY_COUNT < days.length;
  const canScrollTimesLeft = timeOffset > 0;
  const canScrollTimesRight =
    timeOffset + VISIBLE_TIME_COUNT < filteredTimes.length;

  const scrollDaysWindow = (dir: 1 | -1) => {
    setDayOffset((prev) =>
      Math.max(0, Math.min(days.length - VISIBLE_DAY_COUNT, prev + dir)),
    );
  };

  const scrollTimesWindow = (dir: 1 | -1) => {
    setTimeOffset((prev) =>
      Math.max(
        0,
        Math.min(filteredTimes.length - VISIBLE_TIME_COUNT, prev + dir),
      ),
    );
  };

  const switchTimePeriod = (period: TimePeriod) => {
    if (period === timePeriod) return;
    setTimePeriod(period);
    setTimeOffset(0);
    const inPeriod = times.filter((time) => getTimePeriod(time) === period);
    if (!inPeriod.includes(activeTime) && inPeriod[0]) {
      onSelectTime(inPeriod[0]);
    }
  };

  const monthIndex = (year: number, month: number) => year * 12 + month;

  const bookingStartMonth = days[0]
    ? parseDayMonth(days[0].iso)
    : activeMonth;
  const bookingEndMonth = days[days.length - 1]
    ? parseDayMonth(days[days.length - 1].iso)
    : activeMonth;

  const shiftMonth = (dir: -1 | 1) => {
    let { year, month } = activeMonth;
    month += dir;
    if (month < 0) {
      month = 11;
      year -= 1;
    } else if (month > 11) {
      month = 0;
      year += 1;
    }

    if (
      monthIndex(year, month) <
        monthIndex(bookingStartMonth.year, bookingStartMonth.month) ||
      monthIndex(year, month) >
        monthIndex(bookingEndMonth.year, bookingEndMonth.month)
    ) {
      return;
    }

    const firstInMonth = days.find((d) => {
      const parsed = parseDayMonth(d.iso);
      return parsed.year === year && parsed.month === month;
    });
    if (firstInMonth) {
      onSelectDay(firstInMonth.id);
      const idx = days.findIndex((d) => d.id === firstInMonth.id);
      if (idx >= 0) setDayOffset(idx);
    }
  };

  const canPrevMonth =
    monthIndex(activeMonth.year, activeMonth.month) >
    monthIndex(bookingStartMonth.year, bookingStartMonth.month);
  const canNextMonth =
    monthIndex(activeMonth.year, activeMonth.month) <
    monthIndex(bookingEndMonth.year, bookingEndMonth.month);

  const dayPill = (active: boolean) =>
    `flex h-8 w-full flex-col items-center justify-center rounded-lg border px-1 py-1 transition-all duration-200 ${
      active
        ? "primary-button border-transparent text-white shadow-none"
        : "border border-(--border) bg-(--bg-card) text-(--text-primary)"
    }`;

  const timePill = (active: boolean) =>
    `flex h-9 w-full flex-col items-center justify-center gap-0 rounded-lg border px-0.5 py-1 text-center font-medium leading-none whitespace-nowrap tabular-nums transition-all duration-200 ${
      active
        ? "primary-button border-transparent text-white shadow-none"
        : "border border-(--border) bg-(--bg-card) text-(--text-primary)"
    }`;

  const periodToggle = (active: boolean) =>
    `rounded-md px-2 py-0.5 text-[9px] font-semibold transition-colors ${
      active
        ? "primary-button text-white"
        : "text-(--text-secondary) hover:text-(--accent-primary)"
    }`;

  return (
    <section className="feature-card rounded-xl p-3">
      <div className="mb-2.5 flex items-center justify-between gap-2">
        <div className="flex items-center gap-1.5">
          <span className="flex h-5 w-5 items-center justify-center rounded-full bg-(--accent-primary)/10">
            <Clock3 size={11} className="text-(--accent-primary)" />
          </span>
          <h3 className="text-xs font-bold text-(--text-primary)">
            Choose Date &amp; Time
          </h3>
        </div>

        <div className="relative shrink-0">
          <button
            type="button"
            onClick={() => setShowCalendar((open) => !open)}
            aria-label="Open date picker"
            aria-expanded={showCalendar}
            className="
              flex h-7 items-center gap-1 rounded-lg border border-(--border)
              bg-(--bg-card) px-2 text-[8px] font-semibold text-(--text-primary)
              transition-colors hover:border-(--accent-primary)
            "
          >
            <Calendar size={11} className="text-(--accent-primary)" />
            <span>Select date</span>
            <ChevronDown
              size={11}
              className={`text-(--text-secondary) transition-transform ${showCalendar ? "rotate-180" : ""}`}
            />
          </button>

          {showCalendar && (
            <DatePickerPopover
              days={days}
              activeDayId={activeDayId}
              onSelect={onSelectDay}
              onClose={() => setShowCalendar(false)}
            />
          )}
        </div>
      </div>

      {/* Date */}
      <div>
        <div className="mb-2 flex items-center justify-between gap-2">
          <p className="text-[9px] font-semibold text-(--text-secondary)">
            Select Date
          </p>
          <div className="flex items-center gap-1">
            <RoundChevron
              dir="left"
              label="Previous month"
              onClick={() => shiftMonth(-1)}
              disabled={!canPrevMonth}
            />
            <span className="min-w-[3rem] text-center text-[8px] font-medium text-(--text-secondary)">
              {MONTH_LABELS[activeMonth.month]} {activeMonth.year}
            </span>
            <RoundChevron
              dir="right"
              label="Next month"
              onClick={() => shiftMonth(1)}
              disabled={!canNextMonth}
            />
          </div>
        </div>

        <div className="flex items-center gap-1.5">
          <RoundChevron
            dir="left"
            label="Previous dates"
            onClick={() => scrollDaysWindow(-1)}
            disabled={!canScrollDaysLeft}
          />

          <div className="grid min-w-0 flex-1 grid-cols-4 gap-1">
            {visibleDays.map((day) => {
              const active = day.id === activeDayId;
              return (
                <button
                  key={day.id}
                  type="button"
                  onClick={() => onSelectDay(day.id)}
                  className={dayPill(active)}
                >
                  <span className="text-[7px] font-semibold">{day.weekday}</span>
                  <span className="text-[8px] font-bold">{day.date}</span>
                </button>
              );
            })}
          </div>

          <RoundChevron
            dir="right"
            label="Next dates"
            onClick={() => scrollDaysWindow(1)}
            disabled={!canScrollDaysRight}
          />
        </div>
      </div>

      <div className="my-2.5 h-px w-full bg-(--border)" />

      {/* Time */}
      <div>
        <div className="mb-2 flex items-center justify-between gap-2">
          <p className="text-[9px] font-semibold text-(--text-secondary)">
            Select Time
          </p>
          <div
            className="flex items-center gap-0.5 rounded-lg border border-(--border) p-0.5"
            role="group"
            aria-label="Time period"
          >
            <button
              type="button"
              onClick={() => switchTimePeriod("AM")}
              aria-pressed={timePeriod === "AM"}
              className={periodToggle(timePeriod === "AM")}
            >
              AM
            </button>
            <span className="px-0.5 text-[8px] text-(--text-muted)">|</span>
            <button
              type="button"
              onClick={() => switchTimePeriod("PM")}
              aria-pressed={timePeriod === "PM"}
              className={periodToggle(timePeriod === "PM")}
            >
              PM
            </button>
          </div>
        </div>

        <div className="flex items-center gap-1.5">
          <RoundChevron
            dir="left"
            label="Earlier times"
            onClick={() => scrollTimesWindow(-1)}
            disabled={!canScrollTimesLeft}
          />

          <div className="grid min-w-0 flex-1 grid-cols-4 gap-1">
            {visibleTimes.map((time) => {
              const { clock, period } = formatTimeParts(time);
              const active = time === activeTime;
              return (
                <button
                  key={time}
                  type="button"
                  onClick={() => onSelectTime(time)}
                  className={timePill(active)}
                >
                  <span className="text-[9px]">{clock}</span>
                  <span className="text-[7px] font-semibold">{period}</span>
                </button>
              );
            })}
          </div>

          <RoundChevron
            dir="right"
            label="More times"
            onClick={() => scrollTimesWindow(1)}
            disabled={!canScrollTimesRight}
          />
        </div>
      </div>
    </section>
  );
}
