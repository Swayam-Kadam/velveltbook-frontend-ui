"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import {
  Calendar,
  Check,
  ChevronDown,
  ChevronUp,
  Clock3,
  Star,
  Trash2,
  UserRound,
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

type PanelTab = "staff" | "datetime";
type TimePeriod = "AM" | "PM";

interface ServiceBookingAccordionProps {
  selectedServiceIds: string[];
  organizationId?: string;
  expertType: ExpertType;
  assignments: ServiceStaffAssignments;
  schedules: ServiceSchedules;
  lockStaffSelection?: boolean;
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

function  tabClassName(complete: boolean, active: boolean) {
  const fill = complete
    ? "bg-(--success) text-white"
    : "bg-yellow-500 text-(--text-primary)";

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
  onSelectStaff,
  onSelectDay,
  onSelectTime,
  onRemoveService,
}: ServiceBookingAccordionProps) {
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

  const toggleService = (serviceId: string) => {
    setOpenServiceId((current) => (current === serviceId ? null : serviceId));
  };

  const handleRemoveService = (serviceId: string) => {
    onRemoveService(serviceId);
    setOpenServiceId(null);
  };

  const handlePickStaff = (serviceId: string, staffId: string) => {
    if (lockStaffSelection) return;
    onSelectStaff(serviceId, staffId);
  };

  const assignedCount = selectedServiceIds.filter((id) =>
    isServiceStaffAssigned(assignments, id),
  ).length;
  const scheduledCount = selectedServiceIds.filter((id) =>
    isServiceScheduleComplete(schedules[id]),
  ).length;

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
                Staff &amp; Schedule
              </h3>
              <p className="text-[8px] font-semibold text-(--text-muted)">
                Pick therapist, date and time per service
              </p>
            </div>
          </div>

          <div className="text-right">
            <h3 className="text-[11px] font-bold text-(--text-primary)">
              {assignedCount}/{selectedServiceIds.length} staff ·{" "}
              {scheduledCount}/{selectedServiceIds.length} scheduled
            </h3>
          </div>
        </div>
      </div>

      <div>
        {selectedServices.map((service) => {
          const assignedStaffId = assignments[service.id];
          const assignedStaff = assignedStaffId
            ? getStaff(assignedStaffId)
            : null;
          const schedule =
            schedules[service.id] ?? createDefaultServiceSchedule();
          const isOpen = openServiceId === service.id;
          const staffDone = isServiceStaffAssigned(assignments, service.id);
          const scheduleDone = isServiceScheduleComplete(schedule);
          const activeTab = getActiveTab(service.id);

          const staffForService = lockStaffSelection
            ? visibleStaff.filter(
                (therapist) =>
                  !assignedStaffId || therapist.id === assignedStaffId,
              )
            : visibleStaff;

          return (
            <div
              key={service.id}
              className="border-b border-(--border) last:border-b-0"
            >
              <div className="relative">
                <button
                  type="button"
                  onClick={() => handleRemoveService(service.id)}
                  aria-label={`Remove ${service.name}`}
                  className="
                    absolute top-2 right-2 z-10 flex h-7 w-7 items-center
                    justify-center rounded-full text-red-500
                    transition-colors hover:bg-red-500/10
                  "
                >
                  <Trash2 size={15} />
                </button>

                <button
                  type="button"
                  onClick={() => toggleService(service.id)}
                  aria-expanded={isOpen}
                  className="
                    flex w-full items-center gap-2 px-3 py-2.5 pr-10 text-left
                    transition-colors hover:bg-(--bg-card-hover)
                  "
                >
                  <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-lg">
                    <Image
                      src={service.image}
                      alt={service.name}
                      fill
                      sizes="40px"
                      className="object-cover"
                    />
                  </div>

                  <div className="min-w-0 flex-1">
                    <p className="truncate text-[11px] font-bold text-(--text-primary)">
                      {service.name}
                    </p>
                    <p className="text-[8px] font-semibold text-(--text-muted)">
                      {service.duration} · {service.priceLabel}
                    </p>
                    <div className="mt-1 flex flex-wrap items-center gap-x-2 gap-y-0.5">
                      <span className="inline-flex items-center gap-1 text-[8px] font-semibold text-(--text-secondary)">
                        <UserRound
                          size={9}
                          className="shrink-0 text-(--accent-primary)"
                        />
                        {staffDone && assignedStaff
                          ? assignedStaff.name
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
                      className={`text-[7px] font-semibold ${
                        staffDone && scheduleDone
                          ? "text-(--success)"
                          : "text-(--text-muted)"
                      }`}
                    >
                      {staffDone && scheduleDone ? (
                        <span className="flex items-center gap-0.5">
                          <Check size={8} strokeWidth={2.5} />
                          Ready
                        </span>
                      ) : (
                        "Pending"
                      )}
                    </span>
                    <ChevronDown
                      size={14}
                      className={`text-(--text-muted) transition-transform duration-200 ${
                        isOpen ? "rotate-180" : ""
                      }`}
                    />
                  </div>
                </button>
              </div>

              {isOpen && (
                <div
                  className="
                    border-t border-(--border)/50 px-3 pb-3 pt-2
                    bg-[color-mix(in_srgb,var(--accent-primary)_4%,transparent)]
                  "
                >
                  <div className="mb-2.5 flex gap-1.5">
                    <button
                      type="button"
                      onClick={() => setActiveTab(service.id, "staff")}
                      className={tabClassName(
                        staffDone,
                        activeTab === "staff",
                      )}
                    >
                      <span className="flex items-center gap-1">
                        <UserRound size={11} />
                        <span> {staffDone && assignedStaff
                          ? assignedStaff.name
                          : "Select Staff"}</span>
                      </span>
                      {activeTab !== "staff" ? <ChevronDown size={11} /> : <ChevronUp size={11} />}
                    </button>
                    <button
                      type="button"
                      onClick={() => setActiveTab(service.id, "datetime")}
                      className={tabClassName(
                        scheduleDone,
                        activeTab === "datetime",
                      )}
                    >
                      <span className="flex items-center gap-1">
                      <Calendar size={11} />
                      <span> {scheduleDone ? formatServiceSchedule(schedule) : "Select Date & Time"}</span>
                      </span>
                      {activeTab !== "datetime" ? <ChevronDown size={11} /> : <ChevronUp size={11} />}
                    </button>
                  </div>

                  {activeTab === "staff" ? (
                    <div className="scrollbar-none flex gap-2 overflow-x-auto pb-1">
                      {staffForService.map((therapist) => {
                        const active = therapist.id === assignedStaffId;

                        return (
                          <button
                            key={therapist.id}
                            type="button"
                            onClick={() =>
                              handlePickStaff(service.id, therapist.id)
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

                            {/* <div className="mt-0.5 flex items-center gap-0.5">
                              <Star
                                size={9}
                                className="fill-(--brand-gold) text-(--brand-gold)"
                              />
                              <span className="text-[10px] font-bold text-(--text-primary)">
                                {therapist.rating}
                              </span>
                              <span className="text-[10px] text-(--text-muted)">
                                ({therapist.reviews})
                              </span>
                            </div> */}

                            <p className="mt-0.5 text-[10px] font-semibold text-(--text-muted)">
                              {therapist.experience}
                            </p>
                          </button>
                        );
                      })}
                    </div>
                  ) : (
                    <div className="space-y-2.5">
                      <BookingMonthCalendar
                        days={bookingDays}
                        activeDayId={schedule.dayId}
                        onSelectDay={(dayId) =>
                          onSelectDay(service.id, dayId)
                        }
                      />
                      <MobileTimeSlots
                        activeDayId={schedule.dayId}
                        activeTime={schedule.time}
                        onSelectTime={(time) =>
                          onSelectTime(service.id, time)
                        }
                      />
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}
