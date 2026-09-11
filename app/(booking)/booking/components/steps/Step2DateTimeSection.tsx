"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Calendar, ChevronDown, ChevronLeft, ChevronRight, Clock3 } from "lucide-react";

import { getAvailableTimeSlots } from "../../booking.data";
import type { BookingDay } from "../../booking.types";
import { DatePickerPopover } from "../DatePickerPopover";

const MONTH_FULL = [
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

function useHorizontalScrollControls<T extends HTMLElement>() {
  const scrollRef = useRef<T>(null);
  const dragState = useRef({ active: false, startX: 0, scrollLeft: 0 });
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  const updateScrollState = useCallback(() => {
    const container = scrollRef.current;
    if (!container) return;

    const maxScrollLeft = container.scrollWidth - container.clientWidth;
    setCanScrollLeft(container.scrollLeft > 1);
    setCanScrollRight(container.scrollLeft < maxScrollLeft - 1);
  }, []);

  const scrollByPage = useCallback(
    (direction: "left" | "right") => {
      const container = scrollRef.current;
      if (!container) return;

      const step = container.clientWidth / VISIBLE_DAY_COUNT;
      container.scrollBy({
        left: direction === "left" ? -step : step,
        behavior: "smooth",
      });
    },
    [],
  );

  const handleWheel = useCallback((event: React.WheelEvent) => {
    const container = scrollRef.current;
    if (!container) return;

    const delta =
      Math.abs(event.deltaX) > Math.abs(event.deltaY)
        ? event.deltaX
        : event.deltaY;

    if (delta === 0) return;

    event.preventDefault();
    container.scrollLeft += delta;
  }, []);

  const handlePointerDown = useCallback((event: React.PointerEvent) => {
    const container = scrollRef.current;
    if (!container) return;

    dragState.current = {
      active: true,
      startX: event.clientX,
      scrollLeft: container.scrollLeft,
    };
    container.setPointerCapture(event.pointerId);
    container.style.cursor = "grabbing";
  }, []);

  const handlePointerMove = useCallback((event: React.PointerEvent) => {
    const container = scrollRef.current;
    if (!container || !dragState.current.active) return;

    container.scrollLeft =
      dragState.current.scrollLeft - (event.clientX - dragState.current.startX);
  }, []);

  const endDrag = useCallback((event: React.PointerEvent) => {
    const container = scrollRef.current;
    if (!container || !dragState.current.active) return;

    dragState.current.active = false;
    container.releasePointerCapture(event.pointerId);
    container.style.cursor = "grab";
    updateScrollState();
  }, [updateScrollState]);

  const scrollItemIntoView = useCallback((index: number) => {
    const container = scrollRef.current;
    if (!container || index < 0) return;

    const item = container.children[index] as HTMLElement | undefined;
    item?.scrollIntoView({
      behavior: "smooth",
      inline: "nearest",
      block: "nearest",
    });
  }, []);

  const resetScroll = useCallback(() => {
    const container = scrollRef.current;
    if (!container) return;
    container.scrollTo({ left: 0, behavior: "smooth" });
  }, []);

  useEffect(() => {
    const container = scrollRef.current;
    if (!container) return;

    updateScrollState();

    const onScroll = () => updateScrollState();
    container.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", updateScrollState);

    return () => {
      container.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", updateScrollState);
    };
  }, [updateScrollState]);

  return {
    scrollRef,
    canScrollLeft,
    canScrollRight,
    scrollByPage,
    handleWheel,
    handlePointerDown,
    handlePointerMove,
    endDrag,
    scrollItemIntoView,
    resetScroll,
    updateScrollState,
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
  embedded?: boolean;
  ShowTitle?: boolean;
}

export function Step2DateTimeSection({
  days,
  times,
  activeDayId,
  activeTime,
  onSelectDay,
  onSelectTime,
  embedded = false,
  ShowTitle = true,
}: Step2DateTimeSectionProps) {
  const calendarAnchorRef = useRef<HTMLDivElement>(null);
  const [showCalendar, setShowCalendar] = useState(false);
  const [timePeriod, setTimePeriod] = useState<TimePeriod>(() =>
    getTimePeriod(activeTime),
  );

  const daysScroll = useHorizontalScrollControls<HTMLDivElement>();
  const timesScroll = useHorizontalScrollControls<HTMLDivElement>();

  const availableTimes = useMemo(
    () => getAvailableTimeSlots(activeDayId, times),
    [activeDayId, times],
  );

  const filteredTimes = useMemo(
    () => availableTimes.filter((time) => getTimePeriod(time) === timePeriod),
    [availableTimes, timePeriod],
  );

  const activeDay = days.find((d) => d.id === activeDayId) ?? days[0];
  const activeMonth = activeDay
    ? parseDayMonth(activeDay.iso)
    : { year: new Date().getFullYear(), month: new Date().getMonth() };

  useEffect(() => {
    const idx = days.findIndex((d) => d.id === activeDayId);
    if (idx < 0) return;
    daysScroll.scrollItemIntoView(idx);
  }, [activeDayId, days, daysScroll.scrollItemIntoView]);

  useEffect(() => {
    const idx = filteredTimes.findIndex((t) => t === activeTime);
    if (idx < 0) return;
    timesScroll.scrollItemIntoView(idx);
  }, [activeTime, filteredTimes, timesScroll.scrollItemIntoView]);

  useEffect(() => {
    setTimePeriod(getTimePeriod(activeTime));
  }, [activeTime]);

  useEffect(() => {
    if (availableTimes.includes(activeTime)) return;

    const nextTime =
      availableTimes.find((time) => getTimePeriod(time) === timePeriod) ??
      availableTimes[0];

    if (nextTime) {
      onSelectTime(nextTime);
    }
  }, [activeDayId, activeTime, availableTimes, onSelectTime, timePeriod]);

  useEffect(() => {
    daysScroll.updateScrollState();
  }, [days, daysScroll.updateScrollState]);

  useEffect(() => {
    timesScroll.updateScrollState();
  }, [filteredTimes, timesScroll.updateScrollState]);

  const switchTimePeriod = (period: TimePeriod) => {
    if (period === timePeriod) return;
    setTimePeriod(period);
    timesScroll.resetScroll();
    const inPeriod = availableTimes.filter((time) => getTimePeriod(time) === period);
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
      if (idx >= 0) daysScroll.scrollItemIntoView(idx);
    }
  };

  const canPrevMonth =
    monthIndex(activeMonth.year, activeMonth.month) >
    monthIndex(bookingStartMonth.year, bookingStartMonth.month);
  const canNextMonth =
    monthIndex(activeMonth.year, activeMonth.month) <
    monthIndex(bookingEndMonth.year, bookingEndMonth.month);

  const dayPill = (active: boolean) =>
    `flex h-8 w-full flex-col items-center justify-center rounded-2xl border px-1 py-1 transition-all duration-200 ${
      active
        ? "border-transparent bg-(--accent-primary) text-white shadow-none"
        : "border border-(--border) bg-(--bg-card) text-(--text-primary)"
    }`;

  const timePill = (active: boolean) =>
    `flex h-8 w-full items-center justify-center rounded-full border px-0.5 text-center font-medium leading-none whitespace-nowrap tabular-nums transition-all duration-200 ${
      active
        ? "border-transparent bg-(--accent-primary) text-white shadow-none"
        : "border border-(--border) bg-(--bg-card) text-(--text-primary)"
    }`;

  const periodToggle = (active: boolean) =>
    `rounded-md px-2 py-0.5 text-[9px] font-semibold transition-colors ${
      active
        ? "bg-(--accent-primary) text-white"
        : "text-(--text-secondary) hover:text-(--accent-primary)"
    }`;

  const scrollTrackProps = (
    controls: ReturnType<typeof useHorizontalScrollControls<HTMLDivElement>>,
  ) => ({
    ref: controls.scrollRef,
    onWheel: controls.handleWheel,
    onPointerDown: controls.handlePointerDown,
    onPointerMove: controls.handlePointerMove,
    onPointerUp: controls.endDrag,
    onPointerCancel: controls.endDrag,
    className:
      "scrollbar-none flex min-w-0 flex-1 cursor-grab gap-1 overflow-x-auto select-none touch-pan-x",
  });

  const scrollItemClass = "shrink-0 basis-[calc((100%-0.75rem)/4)]";

  const dateScroller = (
    <div className="flex items-center gap-1.5">
      <RoundChevron
        dir="left"
        label="Previous dates"
        onClick={() => daysScroll.scrollByPage("left")}
        disabled={!daysScroll.canScrollLeft}
      />

      <div {...scrollTrackProps(daysScroll)}>
        {days.map((day) => {
          const active = day.id === activeDayId;
          return (
            <button
              key={day.id}
              type="button"
              onPointerDown={(event) => event.stopPropagation()}
              onClick={() => onSelectDay(day.id)}
              className={`${dayPill(active)} ${scrollItemClass} min-w-12`}
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
        onClick={() => daysScroll.scrollByPage("right")}
        disabled={!daysScroll.canScrollRight}
      />
    </div>
  );

  const timeScroller = (
    <div className="flex items-center gap-1.5">
      <RoundChevron
        dir="left"
        label="Earlier times"
        onClick={() => timesScroll.scrollByPage("left")}
        disabled={!timesScroll.canScrollLeft}
      />

      <div {...scrollTrackProps(timesScroll)}>
        {filteredTimes.map((time) => {
          const active = time === activeTime;
          return (
            <button
              key={time}
              type="button"
              onPointerDown={(event) => event.stopPropagation()}
              onClick={() => onSelectTime(time)}
              className={`${timePill(active)} ${scrollItemClass} min-w-12`}
            >
              <span className="text-[9px] font-semibold">{time}</span>
            </button>
          );
        })}
      </div>

      <RoundChevron
        dir="right"
        label="More times"
        onClick={() => timesScroll.scrollByPage("right")}
        disabled={!timesScroll.canScrollRight}
      />
    </div>
  );

  const amPmToggle = (
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
  );

  if (embedded) {
    return (
      <section className="overflow-hidden rounded-xl border border-(--border) bg-(--bg-card)">
        <div ref={calendarAnchorRef} className="relative">
          <button
            type="button"
            onClick={() => setShowCalendar((open) => !open)}
            aria-label="Open calendar"
            aria-expanded={showCalendar}
            className="
              flex w-full items-center gap-2 bg-(--accent-primary)
              px-2.5 py-2 text-left text-white
            "
          >
            <div className="min-w-0 flex-1">
              <p className="text-[7px] font-semibold uppercase tracking-wide text-white/80">
                Month
              </p>
              <span className="inline-flex items-center gap-0.5">
                <span className="truncate text-[10px] font-bold leading-tight">
                  {MONTH_FULL[activeMonth.month]}
                </span>
                <ChevronDown
                  size={11}
                  className={`shrink-0 transition-transform ${showCalendar ? "rotate-180" : ""}`}
                />
              </span>
            </div>

            <span className="h-5 w-px shrink-0 bg-white/35" />

            <div className="min-w-0 shrink-0 pr-1">
              <p className="text-[7px] font-semibold uppercase tracking-wide text-white/80">
                Year
              </p>
              <p className="text-[10px] font-bold leading-tight">
                {activeMonth.year}
              </p>
            </div>

            <Calendar size={15} className="ml-auto shrink-0 text-white" />
          </button>

          {showCalendar && (
            <DatePickerPopover
              days={days}
              activeDayId={activeDayId}
              onSelect={(dayId) => {
                onSelectDay(dayId);
                setShowCalendar(false);
              }}
              onClose={() => setShowCalendar(false)}
              align="center"
              anchorRef={calendarAnchorRef}
            />
          )}
        </div>

        <div className="space-y-5 p-2.5 pb-3">
          {dateScroller}

          <div className="flex items-center justify-between gap-2">
            <p className="text-[9px] font-semibold text-(--text-secondary)">
              Select Time
            </p>
            {amPmToggle}
          </div>

          {timeScroller}
        </div>
      </section>
    );
  }

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

        <div ref={calendarAnchorRef} className="relative shrink-0">
          <button
            type="button"
            onClick={() => setShowCalendar((open) => !open)}
            aria-label="Open date picker"
            aria-expanded={showCalendar}
            className="
              flex h-6 items-center gap-1 rounded-lg border border-(--border)
              bg-(--bg-card) px-1.5 text-[8px] font-semibold text-(--text-primary)
              transition-colors hover:border-(--accent-primary)
            "
          >
            <Calendar size={11} className="text-(--accent-primary)" />
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
              align="end"
              anchorRef={calendarAnchorRef}
            />
          )}
        </div>
      </div>

      <div>
        <div className="mb-2 flex items-center gap-2">
          {ShowTitle && (
            <p className="shrink-0 text-[9px] font-semibold text-(--text-secondary)">
              Select Date
            </p>
          )}
          <div className="ml-auto flex shrink-0 items-center gap-1">
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

        {dateScroller}
      </div>

      <div className="my-2.5 h-px w-full bg-(--border)" />

      <div>
        <div className="mb-2 flex items-center justify-between gap-2">
          <p className="text-[9px] font-semibold text-(--text-secondary)">
            Select Time
          </p>
          {amPmToggle}
        </div>

        {timeScroller}
      </div>
    </section>
  );
}
