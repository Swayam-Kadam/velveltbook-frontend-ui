"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import {
  Calendar,
  Check,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ChevronUp,
  Clock3,
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
  ServiceSchedules,
  ServiceStaffAssignments,
} from "../../booking.types";
import { BookingMonthCalendar } from "./BookingMonthCalendar";
import { ExpertProfileModal } from "../ExpertProfileModal";
import { Step2DateTimeSection } from "./Step2DateTimeSection";

type PanelTab = "staff" | "datetime";
type TimePeriod = "AM" | "PM";

const ANY_STAFF_ID = "any";

interface ServiceBookingAccordionProps {
  selectedServiceIds: string[];
  organizationId?: string;
  expertType: ExpertType;
  assignments: ServiceStaffAssignments;
  schedules: ServiceSchedules;
  lockStaffSelection?: boolean;
  packageName?: string;
  onSelectStaff: (serviceId: string, staffId: string) => void;
  onSelectDay: (serviceId: string, dayId: string) => void;
  onSelectTime: (serviceId: string, time: string) => void;
  onRemoveService: (serviceId: string) => void;
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

function parseDurationMinutes(duration: string): number {
  const value = duration.trim().toLowerCase();
  if (!value) return 0;

  const hoursMatch = value.match(/(\d+(?:\.\d+)?)\s*h/);
  const minutesMatch = value.match(/(\d+(?:\.\d+)?)\s*m/);
  let total = 0;

  if (hoursMatch) total += Number(hoursMatch[1]) * 60;
  if (minutesMatch) total += Number(minutesMatch[1]);

  if (!hoursMatch && !minutesMatch) {
    const numeric = Number(value.replace(/[^0-9.]/g, ""));
    if (Number.isFinite(numeric)) total = numeric;
  }

  return Math.max(0, Math.round(total));
}

function parseTimeToMinutes(time: string): number | null {
  const match = time
    .trim()
    .match(/^(\d{1,2})(?::(\d{2}))?\s*(AM|PM)$/i);
  if (!match) return null;

  let hour = Number(match[1]);
  const minute = Number(match[2] ?? 0);
  const period = match[3].toUpperCase();

  if (!Number.isFinite(hour) || !Number.isFinite(minute)) return null;
  if (period === "PM" && hour !== 12) hour += 12;
  if (period === "AM" && hour === 12) hour = 0;

  return hour * 60 + minute;
}

function formatMinutesToCompactTime(totalMinutes: number): string {
  const minutesInDay = 24 * 60;
  const normalized =
    ((Math.round(totalMinutes) % minutesInDay) + minutesInDay) % minutesInDay;
  let hour = Math.floor(normalized / 60);
  const minute = normalized % 60;
  const period = hour >= 12 ? "PM" : "AM";
  hour = hour % 12;
  if (hour === 0) hour = 12;

  if (minute === 0) return `${hour}${period}`;
  return `${hour}:${String(minute).padStart(2, "0")}${period}`;
}

function formatBookingTimeRange(
  startTime: string | undefined,
  durationMinutes: number,
): string | null {
  if (!startTime || durationMinutes <= 0) return null;
  const startMinutes = parseTimeToMinutes(startTime);
  if (startMinutes == null) return null;

  const startLabel = formatMinutesToCompactTime(startMinutes);
  const endLabel = formatMinutesToCompactTime(startMinutes + durationMinutes);
  return `${startLabel} - ${endLabel}`;
}

function  tabClassName(complete: boolean, active: boolean) {
  const fill = complete
    ? "bg-(--accent-primary) text-white"
    : "bg-(--accent-primary) text-white";

  const border = active
    ? "border-2 border-(--brand-gold) shadow-(--shadow-glow)"
    : "border border-transparent";

  return `
    flex-1 rounded-xs px-2 py-2 text-center text-[10px] font-semibold flex items-center justify-between gap-1
    transition-all duration-200 ${fill} ${border} flex items-center gap-1
  `;
}

function MobileTimeSlots({
  activeDayId,
  activeTime,
  onSelectTime,
}: {
  activeDayId: string;
  activeTime: string;
  onSelectTime: (time: string) => void;
}) {
  const [timePeriod, setTimePeriod] = useState<TimePeriod>(() =>
    getTimePeriod(activeTime || "9:00 AM"),
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
    if (activeTime) setTimePeriod(getTimePeriod(activeTime));
  }, [activeTime]);

  useEffect(() => {
    if (!activeDayId) return;
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
          {(["AM", "PM"] as const).map((period) => (
            <button
              key={period}
              type="button"
              onClick={() => switchPeriod(period)}
              aria-pressed={timePeriod === period}
              className={`
                rounded-md px-2 py-0.5 text-[9px] font-semibold transition-colors
                ${
                  timePeriod === period
                    ? "primary-button text-white"
                    : "text-(--text-secondary) hover:text-(--accent-primary)"
                }
              `}
            >
              {period}
            </button>
          ))}
        </div>
      </div>

      <div className="scrollbar-none flex gap-1 overflow-x-auto pb-0.5">
        {filteredTimes.map((time) => {
          const { clock, period } = formatTimeParts(time);
          const active = time === activeTime;

          return (
            <button
              key={time}
              type="button"
              onClick={() => onSelectTime(time)}
              className={`
                flex h-9 w-[4.5rem] shrink-0 flex-col items-center justify-center
                gap-0 rounded-lg border px-0.5 py-1 text-center font-medium
                leading-none tabular-nums transition-all duration-200
                ${
                  active
                    ? "primary-button border-transparent text-white"
                    : "border border-(--border) bg-(--bg-card) text-(--text-primary)"
                }
              `}
            >
              <span className="text-[9px]">{clock}</span>
              <span className="text-[7px] font-semibold">{period}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

export function ServiceBookingAccordion({
  selectedServiceIds,
  organizationId,
  expertType,
  assignments,
  schedules,
  lockStaffSelection = false,
  packageName,
  onSelectStaff,
  onSelectDay,
  onSelectTime,
  onRemoveService,
}: ServiceBookingAccordionProps) {
  const isPackageFlow = Boolean(packageName);
  const selectedServices = getSelectedServices(
    selectedServiceIds,
    organizationId,
  );
  const bookingDays = useMemo(() => buildBookingDays(new Date()), []);
  const visibleStaff = useMemo(() => {
    let therapists = getOrganizationStaff(organizationId);

    if (expertType === "male" || expertType === "female") {
      therapists = therapists.filter(
        (therapist) => therapist.gender === expertType,
      );
    }

    if (lockStaffSelection) {
      const lockedIds = new Set(
        selectedServiceIds
          .map((id) => assignments[id])
          .filter((id): id is string => Boolean(id)),
      );
      if (lockedIds.size > 0) {
        therapists = therapists.filter((therapist) =>
          lockedIds.has(therapist.id),
        );
      }
    }

    return therapists;
  }, [
    assignments,
    expertType,
    lockStaffSelection,
    organizationId,
    selectedServiceIds,
  ]);

  const firstPendingId = useMemo(
    () =>
      selectedServiceIds.find(
        (id) =>
          !isServiceStaffAssigned(assignments, id) ||
          !isServiceScheduleComplete(schedules[id]),
      ),
    [assignments, schedules, selectedServiceIds],
  );

  const [openServiceId, setOpenServiceId] = useState<string | null>(null);
  const [activeTabByService, setActiveTabByService] = useState<
    Record<string, PanelTab>
  >({});
  const [dateTimeModalServiceId, setDateTimeModalServiceId] = useState<
    string | null
  >(null);
  const [viewExpertId, setViewExpertId] = useState<string | null>(null);
  const viewExpert = viewExpertId ? getStaff(viewExpertId) : null;
  const tabsScrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (selectedServiceIds.length === 0) {
      setOpenServiceId(null);
      return;
    }

    setOpenServiceId((current) => {
      if (current && selectedServiceIds.includes(current)) {
        return current;
      }
      return firstPendingId ?? selectedServiceIds[0] ?? null;
    });
  }, [firstPendingId, selectedServiceIds]);

  const getActiveTab = (serviceId: string): PanelTab =>
    activeTabByService[serviceId] ?? "staff";

  const setActiveTab = (serviceId: string, tab: PanelTab) => {
    setActiveTabByService((current) => ({
      ...current,
      [serviceId]: tab,
    }));
  };

  const handleRemoveService = (serviceId: string) => {
    onRemoveService(serviceId);
    setOpenServiceId(null);
  };

  const handlePickStaff = (serviceId: string, staffId: string) => {
    if (lockStaffSelection) return;
    onSelectStaff(serviceId, staffId);
  };

  const scrollTabs = (direction: "left" | "right") => {
    const container = tabsScrollRef.current;
    if (!container) return;
    const delta =
      (direction === "left" ? -1 : 1) *
      Math.max(120, Math.floor(container.clientWidth * 0.6));
    container.scrollTo({
      left: container.scrollLeft + delta,
      behavior: "smooth",
    });
  };

  const selectServiceTab = (serviceId: string) => {
    setOpenServiceId(serviceId);
    const index = selectedServiceIds.indexOf(serviceId);
    const container = tabsScrollRef.current;
    if (!container || index < 0) return;
    const child = container.children[index] as HTMLElement | undefined;
    if (!child) return;
    const containerRect = container.getBoundingClientRect();
    const childRect = child.getBoundingClientRect();
    const delta =
      childRect.left -
      containerRect.left -
      (container.clientWidth - child.clientWidth) / 2;
    container.scrollTo({
      left: container.scrollLeft + delta,
      behavior: "smooth",
    });
  };

  const assignedCount = selectedServiceIds.filter((id) =>
    isServiceStaffAssigned(assignments, id),
  ).length;
  const scheduledCount = selectedServiceIds.filter((id) =>
    isServiceScheduleComplete(schedules[id]),
  ).length;

  const dateTimeModalService = dateTimeModalServiceId
    ? selectedServices.find((service) => service.id === dateTimeModalServiceId)
    : undefined;
  const dateTimeModalSchedule = dateTimeModalServiceId
    ? schedules[dateTimeModalServiceId] ?? createDefaultServiceSchedule()
    : undefined;

  const activeService =
    selectedServices.find((service) => service.id === openServiceId) ??
    selectedServices[0];

  const assignedStaffId = activeService
    ? assignments[activeService.id]
    : undefined;
  const isAnyStaff = assignedStaffId === ANY_STAFF_ID;
  const assignedStaff =
    assignedStaffId && !isAnyStaff ? getStaff(assignedStaffId) : null;
  const assignedStaffLabel = isAnyStaff
    ? "ANY"
    : assignedStaff
      ? assignedStaff.name
      : null;
  const schedule = activeService
    ? schedules[activeService.id] ?? createDefaultServiceSchedule()
    : createDefaultServiceSchedule();
  const staffDone = activeService
    ? isServiceStaffAssigned(assignments, activeService.id)
    : false;
  const scheduleDone = isServiceScheduleComplete(schedule);
  const isReady = staffDone && scheduleDone;
  const activePanel = activeService
    ? getActiveTab(activeService.id)
    : isPackageFlow
      ? "datetime"
      : "staff";

  useEffect(() => {
    if (!isPackageFlow || !activeService) return;
    setActiveTabByService((current) => {
      if (current[activeService.id]) return current;
      return {
        ...current,
        [activeService.id]: "datetime",
      };
    });
  }, [activeService, isPackageFlow]);
  const staffForService = lockStaffSelection
    ? visibleStaff.filter(
        (therapist) => !assignedStaffId || therapist.id === assignedStaffId,
      )
    : visibleStaff;
  const activeServiceIndex = activeService
    ? selectedServices.findIndex((service) => service.id === activeService.id)
    : 0;

  const durationMinutes = useMemo(() => {
    const servicesForDuration = isPackageFlow
      ? selectedServices
      : activeService
        ? [activeService]
        : [];

    return servicesForDuration.reduce(
      (sum, service) => sum + parseDurationMinutes(service.duration),
      0,
    );
  }, [activeService, isPackageFlow, selectedServices]);

  const rangeStartTime = useMemo(() => {
    if (scheduleDone && schedule.time) return schedule.time;

    const firstScheduled = selectedServiceIds
      .map((id) => schedules[id])
      .find((item) => isServiceScheduleComplete(item));

    return firstScheduled?.time;
  }, [schedule.time, scheduleDone, schedules, selectedServiceIds]);

  const bookingTimeRange = formatBookingTimeRange(
    rangeStartTime,
    durationMinutes,
  );

  return (
    <section className="feature-card overflow-hidden rounded-xl">
      <div className="border-b border-(--border) px-3 py-2.5">
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-center gap-1.5">
            <span className="flex h-5 w-5 items-center justify-center rounded-full bg-(--accent-primary)/10">
              <UserRound size={11} className="text-(--accent-primary)" />
            </span>
            <div>
              <h3 className="text-xs font-bold text-(--text-primary)">
                {isPackageFlow ? "Package Schedule" : "Staff & Schedule"}
                <span className="text-[11px] font-bold ml-3">{bookingTimeRange ?? "—"}</span>
              </h3>
              <p className="text-[8px] font-semibold text-(--text-muted)">
                {isPackageFlow
                  ? "Auto staff · pick date and time for your package"
                  : "Pick therapist, date and time per service"}
              </p>
            </div>
          </div>

          {/* <div className="min-w-0 flex-1 px-2 text-center">
            <h3 className="text-[11px] font-bold text-(--text-primary)">
              {bookingTimeRange ?? "—"}
            </h3>
          </div> */}

          <div className="text-right">
            <h3 className="text-[11px] font-bold text-(--text-primary)">
              {!isPackageFlow ? `${assignedCount}/${selectedServiceIds.length} staff ·${" "}` : ""}
              {scheduledCount}/{selectedServiceIds.length} scheduled
            </h3>
          </div>
        </div>
      </div>

      {selectedServices.length > 0 && (
        <div className="relative border-b border-(--border) px-3 py-2.5">
          {isPackageFlow ? (
            <div className="inline-flex items-center gap-1.5 rounded-xl primary-button px-3 py-2 text-[10px] font-semibold text-white">
              <Check size={11} strokeWidth={2.5} />
              {packageName}
            </div>
          ) : (
            <div className="relative px-5">
              {selectedServices.length > 1 && (
                <>
                  <button
                    type="button"
                    onClick={() => scrollTabs("left")}
                    aria-label="Scroll service tabs left"
                    className="
                      absolute left-0 top-1/2 z-10 flex h-7 w-7 -translate-y-1/2
                      items-center justify-center rounded-full border border-(--border)
                      bg-(--bg-card) text-(--text-primary) shadow-[var(--shadow-card)]
                    "
                  >
                    <ChevronLeft size={14} strokeWidth={2.5} />
                  </button>
                  <button
                    type="button"
                    onClick={() => scrollTabs("right")}
                    aria-label="Scroll service tabs right"
                    className="
                      absolute right-0 top-1/2 z-10 flex h-7 w-7 -translate-y-1/2
                      items-center justify-center rounded-full border border-(--border)
                      bg-(--bg-card) text-(--text-primary) shadow-[var(--shadow-card)]
                    "
                  >
                    <ChevronRight size={14} strokeWidth={2.5} />
                  </button>
                </>
              )}

              <div
                ref={tabsScrollRef}
                className="scrollbar-none flex gap-0.5 overflow-x-auto overflow-y-hidden scroll-smooth px-1"
              >
                {selectedServices.map((service, index) => {
                  const ready =
                    isServiceStaffAssigned(assignments, service.id) &&
                    isServiceScheduleComplete(schedules[service.id]);
                  const active = service.id === activeService?.id;

                  return (
                    <button
                      key={service.id}
                      type="button"
                      onClick={() => selectServiceTab(service.id)}
                      aria-pressed={active}
                      className={`
                        relative shrink-0 rounded-xl border px-3 py-2 text-[10px]
                        font-semibold transition-all duration-200
                        ${
                          active
                            ? "primary-button border-transparent text-white"
                            : "border-(--border) bg-(--bg-card) text-(--text-primary)"
                        }
                      `}
                    >
                      <span
                        className={`absolute left-1.5 top-1.5 h-1.5 w-1.5 rounded-full ${
                          ready ? "bg-(--success)" : "bg-(--danger)"
                        }`}
                      />
                      {`Service - ${index + 1}`}
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      )}

      {activeService ? (
        <div className="p-3">
          <div className="relative mb-2.5 overflow-hidden rounded-xl border border-(--border) bg-(--bg-card)">
            {!isPackageFlow && (
              <button
                type="button"
                onClick={() => handleRemoveService(activeService.id)}
                aria-label={`Remove ${activeService.name}`}
                className="
                  absolute top-6 right-2 z-10 flex h-7 w-7 items-center
                  justify-center rounded-full text-red-500
                  transition-colors hover:bg-red-500/10
                "
              >
                <Trash2 size={15} />
              </button>
            )}

            <div
              className={`flex items-center gap-2 px-3 py-2.5 ${
                isPackageFlow ? "" : "pr-10"
              }`}
            >
              <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-xs">
                <Image
                  src={activeService.image}
                  alt={isPackageFlow ? packageName! : activeService.name}
                  fill
                  sizes="48px"
                  className="object-cover"
                />
              </div>

              <div className="min-w-0 flex-1">
                <p className="truncate text-[12px] font-bold text-(--text-primary)">
                  {isPackageFlow ? packageName : activeService.name}
                </p>
                <p className="text-[9px] font-semibold text-(--text-muted)">
                  {isPackageFlow
                    ? `${selectedServices.length} services included`
                    : `${activeService.duration} · ${activeService.priceLabel}`}
                </p>
                <div className="mt-1 flex flex-wrap items-center gap-x-2 gap-y-0.5">
                  <span className="inline-flex items-center gap-1 text-[8px] font-semibold text-(--text-secondary)">
                    <UserRound
                      size={9}
                      className="shrink-0 text-(--accent-primary)"
                    />
                    {isPackageFlow
                      ? "Auto"
                      : staffDone && assignedStaffLabel
                        ? assignedStaffLabel
                        : "Pick staff"}
                  </span>
                  <span className="inline-flex items-center gap-1 text-[8px] font-semibold text-(--text-secondary)">
                    <Clock3
                      size={9}
                      className="shrink-0 text-(--accent-primary)"
                    />
                    {scheduleDone
                      ? formatServiceSchedule(schedule)
                      : "Select date & time"}
                  </span>
                </div>
              </div>

              <div className="flex shrink-0 flex-col items-end gap-1">
                <span
                  className={`
                    rounded-xs px-2 py-1 text-[8px] font-bold
                    ${
                      (isPackageFlow ? scheduleDone : isReady)
                        ? "bg-(--accent-primary) text-(--success) ring-1 ring-(--success)/40"
                        : "bg-(--accent-primary) text-red-500 ring-1 ring-red-500"
                    }
                  `}
                >
                  {(isPackageFlow ? scheduleDone : isReady) ? "Ready" : "Pending"}
                </span>
              </div>
            </div>
          </div>

          <div className="mb-2.5 flex gap-1.5">
            <button
              type="button"
              disabled={isPackageFlow}
              onClick={() => {
                if (isPackageFlow) return;
                setActiveTab(activeService.id, "staff");
              }}
              className={`${tabClassName(
                isPackageFlow || staffDone,
                !isPackageFlow && activePanel === "staff",
              )} ${isPackageFlow ? "cursor-not-allowed opacity-70" : ""}`}
            >
              <span className="flex items-center gap-1">
                <UserRound size={11} />
                <span>
                  {isPackageFlow
                    ? "Auto (Staff)"
                    : staffDone && assignedStaffLabel
                      ? `${assignedStaffLabel} (Staff)`
                      : "Select Staff"}
                </span>
              </span>
              {!isPackageFlow &&
                (activePanel !== "staff" ? (
                  <ChevronDown size={11} />
                ) : (
                  <ChevronUp size={11} />
                ))}
            </button>
            <button
              type="button"
              onClick={() => {
                if (isPackageFlow) {
                  setActiveTab(
                    activeService.id,
                    activePanel === "datetime" ? "staff" : "datetime",
                  );
                  return;
                }
                setActiveTab(activeService.id, "datetime");
                setDateTimeModalServiceId(activeService.id);
              }}
              className={tabClassName(
                scheduleDone,
                activePanel === "datetime",
              )}
            >
              <span className="flex items-center gap-1">
                <Calendar size={11} />
                <span>
                  {scheduleDone
                    ? formatServiceSchedule(schedule)
                    : "Select Date & Time"}
                </span>
              </span>
              {activePanel !== "datetime" ? (
                <ChevronDown size={11} />
              ) : (
                <ChevronUp size={11} />
              )}
            </button>
          </div>

          {isPackageFlow && activePanel === "datetime" && (
            <div className="mb-2 rounded-xl border border-(--border) bg-(--bg-secondary) p-2">
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

          {!isPackageFlow && activePanel === "staff" && (
            <div className="rounded-xl border border-(--border) bg-(--bg-secondary) p-2">
              <div className="scrollbar-none flex gap-2 overflow-x-auto pb-0.5">
                {(() => {
                  const anyActive = assignedStaffId === ANY_STAFF_ID;

                  return (
                    <button
                      type="button"
                      onClick={() =>
                        handlePickStaff(activeService.id, ANY_STAFF_ID)
                      }
                      disabled={lockStaffSelection}
                      className={`
                        feature-card w-[96px] shrink-0 rounded-xl p-1.5 text-left
                        transition-all duration-200
                        ${lockStaffSelection ? "cursor-default" : ""}
                        ${
                          anyActive
                            ? "border-(--accent-primary) shadow-(--shadow-glow)"
                            : "hover:border-[color-mix(in_srgb,var(--accent-primary)_30%,var(--border))]"
                        }
                      `}
                    >
                      <div className="relative flex h-[78px] items-center justify-center overflow-hidden rounded-sm bg-(--bg-card)">
                        <span className="flex h-19 w-20 items-center justify-center rounded-sm border border-(--border) bg-(--bg-secondary)">
                          <UserRound
                            size={55}
                            strokeWidth={1.75}
                            className="text-(--text-muted)"
                          />
                        </span>
                        {anyActive && (
                          <span className="border-3 border-white primary-button absolute right-0 top-0 flex h-4 w-4 items-center justify-center rounded-full text-white">
                            <Check size={10} strokeWidth={2.5} />
                          </span>
                        )}
                      </div>

                      <p className="mt-1.5 truncate text-[13px] font-bold text-(--text-primary)">
                        ANY
                      </p>

                      <div className="mt-1 flex items-center gap-2">
                        <span className="w-full rounded-sm bg-(--accent-primary) px-2 text-center text-[10px] font-semibold uppercase tracking-wide text-white">
                          Staff
                        </span>
                      </div>
                    </button>
                  );
                })()}

                {staffForService.map((therapist) => {
                  const active = therapist.id === assignedStaffId;

                  return (
                    <button
                      key={therapist.id}
                      type="button"
                      onClick={() =>
                        handlePickStaff(activeService.id, therapist.id)
                      }
                      disabled={lockStaffSelection}
                      className={`
                        feature-card w-[96px] shrink-0 rounded-xl p-1.5 text-left
                        transition-all duration-200
                        ${lockStaffSelection ? "cursor-default" : ""}
                        ${
                          active
                            ? "border-(--accent-primary) shadow-(--shadow-glow)"
                            : "hover:border-[color-mix(in_srgb,var(--accent-primary)_30%,var(--border))]"
                        }
                      `}
                    >
                      <div className="relative h-[78px] overflow-hidden rounded-sm">
                        <Image
                          src={therapist.image}
                          alt={therapist.name}
                          fill
                          sizes="96px"
                          className="object-cover"
                        />
                        {active && (
                          <span className="border-3 border-white primary-button absolute right-0 top-0 flex h-4 w-4 items-center justify-center rounded-full text-white">
                            <Check size={10} strokeWidth={2.5} />
                          </span>
                        )}
                      </div>

                      <p className="mt-1.5 truncate text-[13px] font-bold text-(--text-primary)">
                        {therapist.name}
                      </p>

                      <div className="mt-1 flex items-center gap-2">
                        <span
                          role="button"
                          tabIndex={0}
                          onClick={(event) => {
                            event.stopPropagation();
                            setViewExpertId(therapist.id);
                          }}
                          onKeyDown={(event) => {
                            if (event.key === "Enter" || event.key === " ") {
                              event.stopPropagation();
                              setViewExpertId(therapist.id);
                            }
                          }}
                          className="w-full rounded-sm bg-(--accent-primary) px-2 text-center text-[10px] font-semibold uppercase tracking-wide text-white"
                        >
                          View
                        </span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {!isPackageFlow && (
            <p className="mt-2 text-center text-[8px] font-semibold text-(--text-muted)">
              Showing Service - {activeServiceIndex + 1} of{" "}
              {selectedServices.length}
            </p>
          )}
        </div>
      ) : (
        <div className="px-3 py-8 text-center text-[11px] font-medium text-(--text-muted)">
          No services selected
        </div>
      )}

      {dateTimeModalServiceId &&
        !isPackageFlow &&
        dateTimeModalService &&
        dateTimeModalSchedule && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-0 sm:items-center sm:p-3"
            onClick={() => setDateTimeModalServiceId(null)}
            role="presentation"
          >
            <div
              className="
                flex max-h-[92dvh] w-[95%] max-w-md flex-col overflow-hidden
                rounded-2xl bg-(--bg-primary) shadow-(--shadow-glow)
                sm:rounded-2xl
              "
              onClick={(event) => event.stopPropagation()}
              role="dialog"
              aria-modal="true"
              aria-labelledby="service-datetime-title"
            >
              <div className="flex items-center justify-between gap-2 border-b border-(--border) px-4 py-3">
                <div className="min-w-0">
                  <h3
                    id="service-datetime-title"
                    className="truncate text-sm font-bold text-(--text-primary)"
                  >
                    Select Date &amp; Time
                  </h3>
                  <p className="mt-0.5 truncate text-[11px] text-(--text-muted)">
                    {dateTimeModalService.name}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setDateTimeModalServiceId(null)}
                  aria-label="Close"
                  className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-(--border) text-(--text-primary) transition-colors hover:bg-(--bg-card-hover)"
                >
                  <X size={14} strokeWidth={2.5} />
                </button>
              </div>

              <div className="min-h-0 flex-1 space-y-2.5 overflow-y-auto p-4">
                <BookingMonthCalendar
                  days={bookingDays}
                  activeDayId={dateTimeModalSchedule.dayId}
                  onSelectDay={(dayId) =>
                    onSelectDay(dateTimeModalServiceId, dayId)
                  }
                />
                <MobileTimeSlots
                  activeDayId={dateTimeModalSchedule.dayId}
                  activeTime={dateTimeModalSchedule.time}
                  onSelectTime={(time) =>
                    onSelectTime(dateTimeModalServiceId, time)
                  }
                />
              </div>

              <div className="shrink-0 border-t border-(--border) p-3.5">
                <button
                  type="button"
                  onClick={() => setDateTimeModalServiceId(null)}
                  className="
                    primary-button flex h-11 w-full items-center justify-center gap-2
                    rounded-xl text-[14px] font-semibold text-white
                    transition-opacity hover:opacity-90
                  "
                >
                  Done
                </button>
              </div>
            </div>
          </div>
        )}

      {viewExpert && (
        <ExpertProfileModal
          staff={viewExpert}
          onClose={() => setViewExpertId(null)}
        />
      )}
    </section>
  );
}
