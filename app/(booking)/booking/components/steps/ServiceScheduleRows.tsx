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
  X,
} from "lucide-react";

import type { ExpertType } from "@/menu/components/ExpertSelection";
import {
  buildBookingDays,
  createDefaultServiceSchedule,
  formatServiceSchedule,
  getAvailableTimeSlots,
  getOrganizationStaff,
  getSelectedServices,
  getStaff,
  isServiceScheduleComplete,
  isServiceStaffAssigned,
  timeSlots,
} from "../../booking.data";
import type {
  BookingDay,
  ServiceSchedules,
  ServiceStaffAssignments,
} from "../../booking.types";
import { useRouter } from "next/navigation";

interface ServiceScheduleRowsProps {
  selectedServiceIds: string[];
  organizationId?: string;
  expertType: ExpertType;
  serviceStaff: ServiceStaffAssignments;
  schedules: ServiceSchedules;
  onSelectDay: (serviceId: string, dayId: string) => void;
  onSelectTime: (serviceId: string, time: string) => void;
  onSelectStaff: (serviceId: string, staffId: string) => void;
  onRemoveService?: (serviceId: string) => void;
}

type TimePeriod = "AM" | "PM";

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

function getTimePeriod(time: string): TimePeriod {
  return time.endsWith("PM") ? "PM" : "AM";
}

function parseIso(iso: string) {
  const [year, month, day] = iso.split("-").map(Number);
  return { year, month: month - 1, day };
}

function StaffChangeModal({
  serviceName,
  staffList,
  selectedStaffId,
  onSelect,
  onClose,
}: {
  serviceName: string;
  staffList: ReturnType<typeof getOrganizationStaff>;
  selectedStaffId?: string;
  onSelect: (staffId: string) => void;
  onClose: () => void;
}) {
  const [pendingId, setPendingId] = useState(selectedStaffId);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/55 p-4"
      onClick={onClose}
      role="presentation"
    >
      <div
        className="
          max-h-[88dvh] w-full max-w-2xl overflow-hidden rounded-2xl
          border border-(--border) bg-(--bg-card) shadow-(--shadow-glow)
        "
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="staff-change-title"
      >
        <div className="flex items-center justify-between border-b border-(--border) px-5 py-4">
          <div>
            <h3
              id="staff-change-title"
              className="text-[18px] font-semibold text-(--text-primary)"
            >
              Change staff
            </h3>
            <p className="mt-0.5 text-[13px] text-(--text-muted)">
              Choose a therapist for {serviceName}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="
              flex h-9 w-9 items-center justify-center rounded-full
              border border-(--border) text-(--text-muted)
              transition-colors hover:text-(--text-primary)
            "
          >
            <X size={16} strokeWidth={2} />
          </button>
        </div>

        <div className="max-h-[58vh] overflow-y-auto p-5 scrollbar-thin scrollbar-thumb-(--accent-primary) scrollbar-track-(--bg-secondary)">
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
            {staffList.map((therapist) => {
              const active = pendingId === therapist.id;
              return (
                <button
                  key={therapist.id}
                  type="button"
                  onClick={() => setPendingId(therapist.id)}
                  className={`
                    overflow-hidden rounded-2xl border text-left transition-all
                    ${
                      active
                        ? "border-(--accent-primary) bg-[color-mix(in_srgb,var(--accent-primary)_8%,var(--bg-card))] ring-1 ring-(--accent-primary)"
                        : "border-(--border) bg-(--bg-secondary) hover:border-(--accent-primary)/50"
                    }
                  `}
                >
                  <div className="relative h-[120px]">
                    <Image
                      src={therapist.image}
                      alt={therapist.name}
                      fill
                      sizes="200px"
                      className="object-cover"
                    />
                    {active && (
                      <span className="primary-button absolute right-2 top-2 flex h-6 w-6 items-center justify-center rounded-full text-white">
                        <Check size={14} strokeWidth={2.5} />
                      </span>
                    )}
                  </div>
                  <div className="p-3">
                    <p className="truncate text-[14px] font-semibold text-(--text-primary)">
                      {therapist.name}
                    </p>
                    <div className="mt-1 flex items-center gap-1 text-[12px] text-(--text-secondary)">
                      <Star
                        size={12}
                        className="fill-(--brand-gold) text-(--brand-gold)"
                      />
                      <span>
                        {therapist.rating} ({therapist.reviews})
                      </span>
                    </div>
                    <p className="mt-0.5 text-[11px] text-(--text-muted)">
                      {therapist.experience}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        <div className="flex gap-3 border-t border-(--border) px-5 py-4">
          <button
            type="button"
            onClick={onClose}
            className="secondary-button h-11 flex-1 rounded-xl text-[14px] font-semibold"
          >
            Cancel
          </button>
          <button
            type="button"
            disabled={!pendingId}
            onClick={() => {
              if (!pendingId) return;
              onSelect(pendingId);
              onClose();
            }}
            className="
              primary-button h-11 flex-1 rounded-xl text-[14px] font-semibold
              text-white disabled:cursor-not-allowed disabled:opacity-50
            "
          >
            Confirm staff
          </button>
        </div>
      </div>
    </div>
  );
}

function MonthDateCalendar({
  days,
  activeDayId,
  onSelectDay,
}: {
  days: BookingDay[];
  activeDayId: string;
  onSelectDay: (id: string) => void;
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

  const activeDay = days.find((d) => d.id === activeDayId);

  return (
    <div className="rounded-xl border border-(--border) bg-(--bg-card) p-3.5">
      <div className="mb-3 flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-(--accent-primary)/10">
            <CalendarDays size={15} className="text-(--accent-primary)" />
          </span>
          <div>
            <p className="text-[13px] font-semibold text-(--text-primary)">
              Date
            </p>
            <p className="text-[11px] text-(--text-muted)">
              {activeDay
                ? `${activeDay.weekday}, ${activeDay.date}`
                : "Pick a day"}
            </p>
          </div>
        </div>
      </div>

      <div className="mb-3 flex items-center justify-between">
        <button
          type="button"
          onClick={goPrev}
          disabled={!canPrev}
          aria-label="Previous month"
          className="
            flex h-8 w-8 items-center justify-center rounded-lg border
            border-(--border) text-(--text-primary) transition-colors
            hover:bg-(--bg-secondary) disabled:cursor-not-allowed
            disabled:opacity-35
          "
        >
          <ChevronLeft size={16} />
        </button>
        <p className="text-[14px] font-semibold text-(--text-primary)">
          {MONTH_NAMES[view.month]} {view.year}
        </p>
        <button
          type="button"
          onClick={goNext}
          disabled={!canNext}
          aria-label="Next month"
          className="
            flex h-8 w-8 items-center justify-center rounded-lg border
            border-(--border) text-(--text-primary) transition-colors
            hover:bg-(--bg-secondary) disabled:cursor-not-allowed
            disabled:opacity-35
          "
        >
          <ChevronRight size={16} />
        </button>
      </div>

      <div className="mb-1.5 grid grid-cols-7 gap-1">
        {WEEKDAY_HEADERS.map((label, index) => (
          <span
            key={`${label}-${index}`}
            className="py-1 text-center text-[11px] font-semibold text-(--text-muted)"
          >
            {label}
          </span>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-1">
        {cells.map((dayNum, index) => {
          if (dayNum === null) {
            return <span key={`empty-${index}`} className="h-9" />;
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
                flex h-9 items-center justify-center rounded-lg text-[13px]
                font-semibold transition-all
                ${
                  active
                    ? "primary-button text-white"
                    : selectable
                      ? "text-(--text-primary) hover:bg-(--bg-secondary)"
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

function TimeSlotPicker({
  activeDayId,
  activeTime,
  onSelectTime,
}: {
  activeDayId: string;
  activeTime: string;
  onSelectTime: (time: string) => void;
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
    <div className="rounded-xl border border-(--border) bg-(--bg-card) p-3.5">
      <div className="mb-3 flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-(--accent-primary)/10">
            <Clock3 size={15} className="text-(--accent-primary)" />
          </span>
          <div>
            <p className="text-[13px] font-semibold text-(--text-primary)">
              Time
            </p>
            <p className="text-[11px] text-(--text-muted)">
              {activeTime || "Pick a slot"}
            </p>
          </div>
        </div>

        <div
          className="inline-flex rounded-lg border border-(--border) bg-(--bg-secondary) p-0.5"
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
                rounded-md px-3 py-1.5 text-[12px] font-semibold transition-colors
                ${
                  timePeriod === period
                    ? "primary-button text-white"
                    : "text-(--text-secondary) hover:text-(--text-primary)"
                }
              `}
            >
              {period}
            </button>
          ))}
        </div>
      </div>

      <div className="grid max-h-[220px] grid-cols-2 gap-2 overflow-y-auto pr-1 scrollbar-thin scrollbar-thumb-(--accent-primary) scrollbar-track-(--bg-secondary) sm:grid-cols-3">
        {filteredTimes.length > 0 ? (
          filteredTimes.map((time) => {
            const active = time === activeTime;
            return (
              <button
                key={time}
                type="button"
                onClick={() => onSelectTime(time)}
                className={`
                  rounded-xl border px-2 py-2.5 text-[13px] font-semibold
                  tabular-nums transition-all
                  ${
                    active
                      ? "primary-button border-transparent text-white"
                      : "border-(--border) bg-(--bg-secondary) text-(--text-primary) hover:border-(--accent-primary)/40"
                  }
                `}
              >
                {time}
              </button>
            );
          })
        ) : (
          <p className="col-span-full py-6 text-center text-[13px] text-(--text-muted)">
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
  onSelectDay,
  onSelectTime,
  onSelectStaff,
  onRemoveService,
}: ServiceScheduleRowsProps) {
  const selectedServices = getSelectedServices(
    selectedServiceIds,
    organizationId,
  );
  const bookingDays = useMemo(() => buildBookingDays(new Date()), []);
  const [activeServiceId, setActiveServiceId] = useState(
    () => selectedServiceIds[0] ?? "",
  );
  const [staffModalOpen, setStaffModalOpen] = useState(false);
  const router = useRouter();
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
  const staff = staffId ? getStaff(staffId) : null;

  return (
    <>
      <div className="overflow-hidden rounded-2xl border border-(--border) bg-(--bg-card) shadow-[var(--shadow-card)]">
        {/* Service tabs */}
        <div className="border-b border-(--border) bg-(--bg-secondary) px-3 py-3">
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
                    inline-flex items-center gap-1.5 rounded-full px-3.5 py-2
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
        </div>

        {/* Active service + staff */}
        <div className="flex flex-col gap-4 border-b border-(--border) p-4 xl:flex-row xl:items-center xl:justify-between">
          <div className="flex min-w-0 items-center gap-3.5">
            <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-xl">
              <Image
                src={activeService.image}
                alt={activeService.name}
                fill
                sizes="64px"
                className="object-cover"
              />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <p className="truncate text-[16px] font-semibold text-(--text-primary)">
                  {activeService.name}
                </p>
                {onRemoveService && (
                  <button
                    type="button"
                    onClick={() => onRemoveService(activeService.id)}
                    aria-label={`Remove ${activeService.name}`}
                    className="
                      flex h-7 w-7 shrink-0 items-center justify-center
                      rounded-full border border-(--border) text-red-500
                      transition-colors hover:text-red-600 cursor-pointer
                    "
                  >
                    <Trash2 size={13} strokeWidth={2.5} />
                  </button>
                )}
              </div>
              <p className="mt-1 text-[13px] text-(--text-secondary)">
                {activeService.duration} ·{" "}
                <span className="font-semibold text-(--brand-gold)">
                  {activeService.priceLabel}
                </span>
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
            {staff ? (
              <div className="relative h-11 w-11 shrink-0 overflow-hidden rounded-full">
                <Image
                  src={staff.image}
                  alt={staff.name}
                  fill
                  sizes="44px"
                  className="object-cover"
                />
              </div>
            ) : (
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-dashed border-(--border) bg-(--bg-card)">
                <UserRound size={18} className="text-(--text-muted)" />
              </span>
            )}
            <div className="min-w-0 flex-1">
              <p className="truncate text-[13px] font-semibold text-(--text-primary)">
                {staff ? staff.name : "No staff assigned"}
              </p>
              <p className="text-[11px] text-(--text-muted)">
                {staff
                  ? `${staff.rating} · ${staff.experience}`
                  : "Select a therapist"}
              </p>
            </div>
            <div className="flex items-center gap-2 flex-1">
            <button
              type="button"
              onClick={() => setStaffModalOpen(true)}
              className="
                shrink-0 rounded-sm border border-(--border) bg-(--bg-card)
                px-3 py-1.5 text-[12px] font-semibold text-(--text-primary)
                transition-colors hover:border-(--brand-gold)
                hover:text-(--brand-gold)
              "
            >
              {staff ? "Change" : "Select"}
            </button>
            </div>
          </div>
        </div>

        {/* Month calendar + time */}
        <div className="grid gap-4 bg-(--bg-secondary) p-4 lg:grid-cols-[1.05fr_1fr]">
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
      </div>

      {staffModalOpen && (
        <StaffChangeModal
          serviceName={activeService.name}
          staffList={availableStaff}
          selectedStaffId={serviceStaff[activeService.id]}
          onSelect={(nextStaffId) =>
            onSelectStaff(activeService.id, nextStaffId)
          }
          onClose={() => setStaffModalOpen(false)}
        />
      )}
    </>
  );
}
