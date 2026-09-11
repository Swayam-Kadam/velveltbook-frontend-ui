"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import {
  CalendarDays,
  Check,
  ChevronLeft,
  ChevronRight,
  Clock3,
  Star,
  Trash2,
  UserRound,
  Users,
} from "lucide-react";

import type { ExpertType } from "@/menu/components/ExpertSelection";
import {
  buildBookingDays,
  createDefaultServiceSchedule,
  formatServiceSchedule,
  getAvailableTimeSlots,
  getOrganizationStaff,
  getSelectedServices,
  isServiceScheduleComplete,
  isServiceStaffAssigned,
  timeSlots,
} from "../../booking.data";
import type {
  BookingDay,
  ServiceSchedules,
  ServiceStaffAssignments,
} from "../../booking.types";
import { Step2DateTimeSection } from "./Step2DateTimeSection";

interface ServiceScheduleRowsProps {
  selectedServiceIds: string[];
  organizationId?: string;
  expertType: ExpertType;
  serviceStaff: ServiceStaffAssignments;
  schedules: ServiceSchedules;
  packageName?: string;
  onSelectDay: (serviceId: string, dayId: string) => void;
  onSelectTime: (serviceId: string, time: string) => void;
  onSelectStaff: (serviceId: string, staffId: string) => void;
  onRemoveService?: (serviceId: string) => void;
}

type TimePeriod = "AM" | "PM";

const WEEKDAY_HEADERS = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];
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

function getTimePeriod(time: string): TimePeriod {
  return time.endsWith("PM") ? "PM" : "AM";
}

function parseIso(iso: string) {
  const [year, month, day] = iso.split("-").map(Number);
  return { year, month: month - 1, day };
}

export function MonthDateCalendar({
  days,
  activeDayId,
  onSelectDay,
  compact = false,
}: {
  days: BookingDay[];
  activeDayId: string;
  onSelectDay: (id: string) => void;
  compact?: boolean;
}) {
  const firstAvailable = days[0];
  const lastAvailable = days[days.length - 1];
  const initial = parseIso(
    days.find((d) => d.id === activeDayId)?.iso ?? firstAvailable?.iso ?? "",
  );
  const [view, setView] = useState({
    year: initial.year,
    month: initial.month,
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

  return (
    <div
      className={`flex flex-col rounded-2xl border border-(--border) bg-(--bg-card) ${
        compact ? "h-[240px] p-2.5" : "p-4"
      }`}
    >
      {!compact ? (
        <div className="mb-3 flex items-center gap-2">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-(--accent-primary)/10">
            <CalendarDays size={15} className="text-(--accent-primary)" />
          </span>
          <p className="text-[14px] font-semibold text-(--text-primary)">
            Select Date
          </p>
        </div>
      ) : null}

      <div
        className={`flex shrink-0 items-center justify-between ${
          compact ? "mb-2" : "mb-3"
        }`}
      >
        <button
          type="button"
          onClick={goPrev}
          disabled={!canPrev}
          aria-label="Previous month"
          className={`
            flex items-center justify-center rounded-lg border
            border-(--border) text-(--text-primary) transition-colors
            hover:bg-(--bg-secondary) disabled:cursor-not-allowed
            disabled:opacity-35
            ${compact ? "h-7 w-7" : "h-8 w-8"}
          `}
        >
          <ChevronLeft size={compact ? 14 : 16} />
        </button>
        <p
          className={`font-semibold text-(--text-primary) ${
            compact ? "text-[13px]" : "text-[14px]"
          }`}
        >
          {MONTH_NAMES[view.month]} {view.year}
        </p>
        <button
          type="button"
          onClick={goNext}
          disabled={!canNext}
          aria-label="Next month"
          className={`
            flex items-center justify-center rounded-lg border
            border-(--border) text-(--text-primary) transition-colors
            hover:bg-(--bg-secondary) disabled:cursor-not-allowed
            disabled:opacity-35
            ${compact ? "h-7 w-7" : "h-8 w-8"}
          `}
        >
          <ChevronRight size={compact ? 14 : 16} />
        </button>
      </div>

      <div className={`grid shrink-0 grid-cols-7 gap-px ${compact ? "mb-1" : "mb-1"}`}>
        {WEEKDAY_HEADERS.map((label, index) => (
          <span
            key={`${label}-${index}`}
            className={`text-center font-semibold uppercase tracking-wide text-(--text-muted) ${
              compact ? "py-0.5 text-[10px]" : "py-1 text-[10px]"
            }`}
          >
            {label}
          </span>
        ))}
      </div>

      <div className={`grid flex-1 grid-cols-7 gap-px content-start ${compact ? "min-h-0" : ""}`}>
        {cells.map((dayNum, index) => {
          if (dayNum === null) {
            return (
              <span
                key={`empty-${index}`}
                className={compact ? "h-7" : "h-10"}
              />
            );
          }

          const iso = `${view.year}-${String(view.month + 1).padStart(2, "0")}-${String(dayNum).padStart(2, "0")}`;
          const bookingDay = dayByIso.get(iso);
          const selectable = Boolean(bookingDay);
          const active = bookingDay?.id === activeDayId;

          return (
            <button
              key={iso}
              type="button"
              disabled={!selectable}
              onClick={() => {
                if (bookingDay) onSelectDay(bookingDay.id);
              }}
              className={`
                relative flex flex-col items-center justify-center rounded-full
                font-semibold transition-all
                ${compact ? "h-7 text-[12px]" : "h-10 text-[13px]"}
                ${
                  active
                    ? "bg-(--accent-primary) text-white"
                    : selectable
                      ? "text-(--text-primary) hover:bg-(--bg-secondary)"
                      : "cursor-not-allowed text-(--text-muted)/35"
                }
              `}
            >
              {dayNum}
              {selectable && !active ? (
                <span
                  className={`absolute rounded-full bg-(--accent-primary) ${
                    compact ? "bottom-0.5 h-1 w-1" : "bottom-1 h-1 w-1"
                  }`}
                />
              ) : null}
            </button>
          );
        })}
      </div>

      {firstAvailable && !compact ? (
        <div className="mt-3 flex justify-center">
          <button
            type="button"
            onClick={() => {
              onSelectDay(firstAvailable.id);
              const parsed = parseIso(firstAvailable.iso);
              setView({ year: parsed.year, month: parsed.month });
            }}
            className="
              inline-flex items-center gap-1.5 rounded-full border border-(--border)
              bg-(--bg-secondary) px-3.5 py-1.5 text-[12px] font-semibold
              text-(--text-primary) transition-colors hover:border-(--accent-primary)/40
            "
          >
            <CalendarDays size={13} className="text-(--accent-primary)" />
            Today
          </button>
        </div>
      ) : null}
    </div>
  );
}

export function TimeSlotPicker({
  activeDayId,
  activeTime,
  onSelectTime,
  compact = false,
}: {
  activeDayId: string;
  activeTime: string;
  onSelectTime: (time: string) => void;
  compact?: boolean;
}) {
  const [timePeriod, setTimePeriod] = useState<TimePeriod>(() =>
    getTimePeriod(activeTime),
  );

  const availableTimes = useMemo(
    () => getAvailableTimeSlots(activeDayId, timeSlots),
    [activeDayId],
  );

  const filteredTimes = useMemo(
    () => availableTimes.filter((time) => getTimePeriod(time) === timePeriod),
    [availableTimes, timePeriod],
  );

  useEffect(() => {
    setTimePeriod(getTimePeriod(activeTime));
  }, [activeTime]);

  useEffect(() => {
    if (availableTimes.includes(activeTime)) return;
    const next =
      availableTimes.find((time) => getTimePeriod(time) === timePeriod) ??
      availableTimes[0];
    if (next) onSelectTime(next);
  }, [activeDayId, activeTime, availableTimes, onSelectTime, timePeriod]);

  const switchPeriod = (period: TimePeriod) => {
    setTimePeriod(period);
    const inPeriod = availableTimes.filter(
      (time) => getTimePeriod(time) === period,
    );
    if (!inPeriod.includes(activeTime) && inPeriod[0]) {
      onSelectTime(inPeriod[0]);
    }
  };

  return (
    <div
      className={`flex flex-col rounded-2xl border border-(--border) bg-(--bg-card) ${
        compact ? "h-[240px] p-2.5" : "p-4"
      }`}
    >
      <div
        className={`flex shrink-0 items-center justify-between gap-2 ${
          compact ? "mb-2" : "mb-3"
        }`}
      >
        {!compact ? (
          <div className="flex items-center gap-2">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-(--accent-primary)/10">
              <Clock3 size={15} className="text-(--accent-primary)" />
            </span>
            <p className="text-[14px] font-semibold text-(--text-primary)">
              Select Time
            </p>
          </div>
        ) : (
          <p className="text-[13px] font-semibold text-(--text-primary)">Time</p>
        )}

        <div
          className="inline-flex rounded-full border border-(--border) bg-(--bg-secondary) p-0.5"
          role="group"
          aria-label="Time period"
        >
          {(["AM", "PM"] as const).map((period) => (
            <button
              key={period}
              type="button"
              onClick={() => switchPeriod(period)}
              aria-pressed={timePeriod === period}
              className={`
                rounded-full font-semibold transition-colors
                ${compact ? "px-3 py-1 text-[11px]" : "px-3.5 py-1.5 text-[12px]"}
                ${
                  timePeriod === period
                    ? "bg-(--accent-primary) text-white"
                    : "text-(--text-secondary) hover:text-(--text-primary)"
                }
              `}
            >
              {period}
            </button>
          ))}
        </div>
      </div>

      <div
        className={`grid min-h-0 flex-1 content-start gap-1.5 overflow-y-auto pr-0.5 scrollbar-thin scrollbar-thumb-(--accent-primary) scrollbar-track-(--bg-secondary) grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 ${
          compact ? "" : "max-h-[280px] gap-2"
        }`}
      >
        {filteredTimes.length > 0 ? (
          filteredTimes.map((time) => {
            const active = time === activeTime;
            return (
              <button
                key={time}
                type="button"
                onClick={() => onSelectTime(time)}
                className={`
                  rounded-lg border font-semibold tabular-nums transition-all
                  ${compact ? "px-1.5 py-2 text-[12px]" : "px-2 py-2.5 text-[12px]"}
                  ${
                    active
                      ? "border-transparent bg-(--accent-primary) text-white"
                      : "border-(--border) bg-(--bg-card) text-(--text-primary) hover:border-(--accent-primary)/40"
                  }
                `}
              >
                {time}
              </button>
            );
          })
        ) : (
          <p
            className={`col-span-full text-center text-(--text-muted) ${
              compact ? "py-6 text-[12px]" : "py-6 text-[13px]"
            }`}
          >
            No {timePeriod} slots available
          </p>
        )}
      </div>
    </div>
  );
}

export function ServiceScheduleRows({
  selectedServiceIds,
  organizationId,
  expertType,
  serviceStaff,
  schedules,
  packageName,
  onSelectDay,
  onSelectTime,
  onSelectStaff,
  onRemoveService,
}: ServiceScheduleRowsProps) {
  const isPackageFlow = Boolean(packageName);
  const selectedServices = getSelectedServices(
    selectedServiceIds,
    organizationId,
  );
  const bookingDays = useMemo(() => buildBookingDays(new Date()), []);
  const [activeServiceId, setActiveServiceId] = useState(
    () => selectedServiceIds[0] ?? "",
  );
  const [dateTimeOpen, setDateTimeOpen] = useState(isPackageFlow);
  useEffect(() => {
    if (selectedServiceIds.length === 0) {
      setActiveServiceId("");
      return;
    }
    setActiveServiceId((current) =>
      selectedServiceIds.includes(current)
        ? current
        : (selectedServiceIds[0] ?? ""),
    );
  }, [selectedServiceIds]);

  const availableStaff = useMemo(() => {
    let therapists = getOrganizationStaff(organizationId);
    if (expertType === "male" || expertType === "female") {
      therapists = therapists.filter(
        (therapist) => therapist.gender === expertType,
      );
    }
    return therapists;
  }, [expertType, organizationId]);

  const activeService =
    selectedServices.find((service) => service.id === activeServiceId) ??
    selectedServices[0];

  if (selectedServices.length === 0 || !activeService) {
    return (
      <div className="flex min-h-[200px] flex-col items-center justify-center rounded-2xl border border-dashed border-(--border) bg-(--bg-card) px-4 text-center">
        <p className="text-[15px] font-semibold text-(--text-primary)">
          No services selected
        </p>
        <p className="mt-1 text-[13px] text-(--text-muted)">
          Go back to add services before scheduling.
        </p>
      </div>
    );
  }

  const schedule =
    schedules[activeService.id] ?? createDefaultServiceSchedule();
  const isScheduled = isServiceScheduleComplete(schedules[activeService.id]);
  const staffId = serviceStaff[activeService.id];
  const noPreference = staffId === "any";

  return (
    <>
      <div className="overflow-hidden rounded-2xl border border-(--border) bg-(--bg-card) shadow-[var(--shadow-card)]">
        {/* Package name OR service tabs */}
        <div className="border-b border-(--border) bg-(--bg-secondary) px-3 py-3">
          {isPackageFlow ? (
            <div className="inline-flex items-center gap-1.5 rounded-full bg-[#2D1659] px-3.5 py-2 text-[13px] font-semibold text-white">
              <Check size={13} strokeWidth={2.5} />
              {packageName}
            </div>
          ) : (
            <div
              className="flex flex-wrap gap-2"
              role="tablist"
              aria-label="Services"
            >
              {selectedServices.map((service, index) => {
                const scheduled = isServiceScheduleComplete(schedules[service.id]);
                const hasStaff = isServiceStaffAssigned(
                  serviceStaff,
                  service.id,
                );
                const isComplete = scheduled && hasStaff;
                const isActive = service.id === activeService.id;

                return (
                  <button
                    key={service.id}
                    type="button"
                    role="tab"
                    aria-selected={isActive}
                    onClick={() => setActiveServiceId(service.id)}
                    className={`
                      inline-flex items-center gap-1.5 rounded-sm px-3.5 py-2
                      text-[13px] font-semibold transition-all
                      ${
                        isComplete
                          ? "bg-(--success) text-white"
                          : "bg-[#eab308] text-[#1a1a1a]"
                      }
                      ${
                        isActive
                          ? "ring-2 ring-(--text-primary)/25 ring-offset-2 ring-offset-(--bg-secondary)"
                          : "opacity-90 hover:opacity-100"
                      }
                    `}
                  >
                    {isComplete && <Check size={13} strokeWidth={2.5} />}
                    Service {index + 1}
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {isPackageFlow ? (
          <>
            <div className="flex flex-col gap-4 border-b border-(--border) p-4 xl:flex-row xl:items-center xl:justify-between">
              <div className="flex min-w-0 items-center gap-3.5">
                <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-xl">
                  <Image
                    src={activeService.image}
                    alt={packageName!}
                    fill
                    sizes="64px"
                    className="object-cover"
                  />
                </div>
                <div className="min-w-0">
                  <p className="truncate text-[16px] font-semibold text-(--text-primary)">
                    {packageName}
                  </p>
                  <p className="mt-1 text-[13px] text-(--text-secondary)">
                    {selectedServices.length} service
                    {selectedServices.length === 1 ? "" : "s"} included
                  </p>
                  {isScheduled && (
                    <p className="mt-1 inline-flex items-center gap-1 text-[12px] font-medium text-(--success)">
                      <Check size={12} strokeWidth={2.5} />
                      {formatServiceSchedule(schedule)}
                    </p>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-3 rounded-xl border border-(--border) bg-(--bg-secondary) px-3 py-2.5 xl:min-w-[280px]">
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-(--border) bg-(--bg-card)">
                  <UserRound size={18} className="text-(--text-muted)" />
                </span>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-[13px] font-semibold text-(--text-primary)">
                    Auto
                  </p>
                  <p className="text-[11px] text-(--text-muted)">
                    Staff assigned automatically
                  </p>
                </div>
                <button
                  type="button"
                  disabled
                  className="
                    shrink-0 cursor-not-allowed rounded-sm border border-(--border)
                    bg-(--bg-card) px-3 py-1.5 text-[12px] font-semibold
                    text-(--text-muted) opacity-60
                  "
                >
                  Change
                </button>
              </div>
            </div>

            <div className="space-y-3 bg-(--bg-secondary) p-4">
              <button
                type="button"
                onClick={() => setDateTimeOpen((open) => !open)}
                className="
                  flex w-full items-center justify-between gap-3 rounded-xl
                  border border-(--border) bg-(--bg-card) px-3.5 py-3 text-left
                  transition-colors hover:border-(--brand-gold)/50
                "
              >
                <div className="flex min-w-0 items-center gap-2.5">
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-(--accent-primary)/10">
                    <CalendarDays size={16} className="text-(--accent-primary)" />
                  </span>
                  <div className="min-w-0">
                    <p className="text-[13px] font-semibold text-(--text-primary)">
                      Date &amp; Time
                    </p>
                    <p className="truncate text-[11px] text-(--text-muted)">
                      {isScheduled
                        ? formatServiceSchedule(schedule)
                        : "Tap to choose date and time"}
                    </p>
                  </div>
                </div>
                <Clock3
                  size={16}
                  className={`shrink-0 text-(--text-muted) transition-transform ${
                    dateTimeOpen ? "rotate-90 text-(--accent-primary)" : ""
                  }`}
                />
              </button>

              {dateTimeOpen && (
                <div className="rounded-xl border border-(--border) bg-(--bg-card) p-3">
                  <Step2DateTimeSection
                    embedded
                    days={bookingDays}
                    times={timeSlots}
                    activeDayId={schedule.dayId}
                    activeTime={schedule.time}
                    onSelectDay={(dayId) => onSelectDay(activeService.id, dayId)}
                    onSelectTime={(time) => onSelectTime(activeService.id, time)}
                  />
                </div>
              )}
            </div>
          </>
        ) : (
          <>
            <div className="flex items-center justify-between gap-3 border-b border-(--border) px-4 py-3">
              <div className="flex min-w-0 items-center gap-3">
                <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-xl">
                  <Image
                    src={activeService.image}
                    alt={activeService.name}
                    fill
                    sizes="48px"
                    className="object-cover"
                  />
                </div>
                <div className="min-w-0">
                  <p className="truncate text-[15px] font-semibold text-(--text-primary)">
                    {activeService.name}
                  </p>
                  <p className="mt-0.5 text-[12px] text-(--text-secondary)">
                    {activeService.duration} ·{" "}
                    <span className="font-semibold text-(--brand-gold)">
                      {activeService.priceLabel}
                    </span>
                    {isScheduled ? (
                      <span className="ml-2 inline-flex items-center gap-1 font-medium text-(--success)">
                        <Check size={12} strokeWidth={2.5} />
                        {formatServiceSchedule(schedule)}
                      </span>
                    ) : null}
                  </p>
                </div>
              </div>
              {onRemoveService ? (
                <button
                  type="button"
                  onClick={() => onRemoveService(activeService.id)}
                  aria-label={`Remove ${activeService.name}`}
                  className="
                    flex h-8 w-8 shrink-0 items-center justify-center rounded-full
                    border border-(--border) text-red-500 transition-colors
                    hover:text-red-600
                  "
                >
                  <Trash2 size={14} strokeWidth={2.5} />
                </button>
              ) : null}
            </div>

            <div className="border-b border-(--border) p-4">
              <div className="mb-3 flex items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-(--accent-primary)/10">
                    <UserRound size={15} className="text-(--accent-primary)" />
                  </span>
                  <p className="text-[14px] font-semibold text-(--text-primary)">
                    Select Staff{" "}
                    <span className="font-normal text-(--text-muted)">
                      (Optional)
                    </span>
                  </p>
                </div>

                <div className="inline-flex items-center gap-2">
                  <span className="text-[12px] font-medium text-(--text-secondary)">
                    No Preference
                  </span>
                  <button
                    type="button"
                    role="switch"
                    aria-checked={noPreference}
                    aria-label="No staff preference"
                    onClick={() => {
                      if (noPreference) {
                        const fallback = availableStaff[0]?.id;
                        if (fallback) onSelectStaff(activeService.id, fallback);
                      } else {
                        onSelectStaff(activeService.id, "any");
                      }
                    }}
                    className={`
                      relative h-6 w-11 rounded-full transition-colors
                      ${noPreference ? "bg-(--accent-primary)" : "bg-(--border)"}
                    `}
                  >
                    <span
                      className={`
                        absolute top-0.5 left-0.5 h-5 w-5 rounded-full bg-white
                        shadow transition-transform
                        ${noPreference ? "translate-x-5" : "translate-x-0"}
                      `}
                    />
                  </button>
                </div>
              </div>

              <div className="flex gap-3 overflow-x-auto pb-1 scrollbar-thin scrollbar-thumb-(--accent-primary) scrollbar-track-(--bg-secondary)">
                {availableStaff.map((therapist) => {
                  const active = !noPreference && staffId === therapist.id;
                  return (
                    <button
                      key={therapist.id}
                      type="button"
                      onClick={() =>
                        onSelectStaff(activeService.id, therapist.id)
                      }
                      className={`
                        relative flex w-[248px] shrink-0 items-start gap-3
                        rounded-2xl border p-3 text-left transition-all
                        ${
                          active
                            ? "border-(--accent-primary) bg-[color-mix(in_srgb,var(--accent-primary)_8%,var(--bg-card))]"
                            : "border-(--border) bg-(--bg-card) hover:border-(--accent-primary)/40"
                        }
                      `}
                    >
                      <span
                        className={`
                          absolute right-2.5 top-2.5 flex h-5 w-5 items-center
                          justify-center rounded-full border
                          ${
                            active
                              ? "border-(--accent-primary) bg-(--accent-primary) text-white"
                              : "border-(--border) bg-(--bg-card)"
                          }
                        `}
                      >
                        {active ? <Check size={12} strokeWidth={2.5} /> : null}
                      </span>

                      <div className="relative h-[72px] w-[72px] shrink-0 overflow-hidden rounded-xl bg-(--bg-secondary)">
                        <Image
                          src={therapist.image}
                          alt={therapist.name}
                          fill
                          sizes="72px"
                          className="object-cover"
                        />
                      </div>

                      <div className="min-w-0 flex-1 pr-5">
                        <p className="truncate text-[14px] font-semibold text-(--text-primary)">
                          {therapist.name}
                        </p>
                        <p className="mt-0.5 truncate text-[12px] text-(--text-muted)">
                          Therapist
                        </p>
                        <div className="mt-1.5 flex items-center gap-1 text-[12px] text-(--text-secondary)">
                          <Star
                            size={12}
                            className="fill-(--brand-gold) text-(--brand-gold)"
                          />
                          <span className="font-medium text-(--text-primary)">
                            {therapist.rating}
                          </span>
                          <span className="text-(--text-muted)">
                            ({therapist.reviews})
                          </span>
                        </div>
                        <p className="mt-1 truncate text-[11px] text-(--text-muted)">
                          {therapist.experience}
                        </p>
                      </div>
                    </button>
                  );
                })}

                <button
                  type="button"
                  onClick={() => onSelectStaff(activeService.id, "any")}
                  className={`
                    relative flex w-[248px] shrink-0 items-start gap-3
                    rounded-2xl border p-3 text-left transition-all
                    ${
                      noPreference
                        ? "border-(--accent-primary) bg-[color-mix(in_srgb,var(--accent-primary)_8%,var(--bg-card))]"
                        : "border-(--border) bg-(--bg-card) hover:border-(--accent-primary)/40"
                    }
                  `}
                >
                  <span
                    className={`
                      absolute right-2.5 top-2.5 flex h-5 w-5 items-center
                      justify-center rounded-full border
                      ${
                        noPreference
                          ? "border-(--accent-primary) bg-(--accent-primary) text-white"
                          : "border-(--border) bg-(--bg-card)"
                      }
                    `}
                  >
                    {noPreference ? (
                      <Check size={12} strokeWidth={2.5} />
                    ) : null}
                  </span>

                  <span className="flex h-[72px] w-[72px] shrink-0 items-center justify-center rounded-xl bg-(--accent-primary)/10">
                    <Users size={26} className="text-(--accent-primary)" />
                  </span>

                  <div className="min-w-0 flex-1 pr-5 pt-1">
                    <p className="text-[14px] font-semibold leading-snug text-(--text-primary)">
                      Any Available Staff
                    </p>
                    <p className="mt-1 text-[12px] leading-snug text-(--text-muted)">
                      We&apos;ll assign the best available.
                    </p>
                  </div>
                </button>
              </div>
            </div>

            <div className="grid gap-4 bg-(--bg-secondary) p-4 lg:grid-cols-2">
              <MonthDateCalendar
                key={`date-${activeService.id}`}
                days={bookingDays}
                activeDayId={schedule.dayId}
                onSelectDay={(dayId) => onSelectDay(activeService.id, dayId)}
              />
              <TimeSlotPicker
                key={`time-${activeService.id}`}
                activeDayId={schedule.dayId}
                activeTime={schedule.time}
                onSelectTime={(time) => onSelectTime(activeService.id, time)}
              />
            </div>
          </>
        )}
      </div>
    </>
  );
}
