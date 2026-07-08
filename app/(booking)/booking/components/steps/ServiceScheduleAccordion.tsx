"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import { CalendarDays, Check, ChevronDown, Clock3 } from "lucide-react";

import {
  bookingDays,
  countScheduledServices,
  formatServiceSchedule,
  getSelectedServices,
  isServiceScheduleComplete,
  timeSlots,
} from "../../booking.data";
import type { ServiceSchedules } from "../../booking.types";
import { Step2DateTimeSection } from "./Step2DateTimeSection";

interface ServiceScheduleAccordionProps {
  selectedServiceIds: string[];
  schedules: ServiceSchedules;
  onSelectDay: (serviceId: string, dayId: string) => void;
  onSelectTime: (serviceId: string, time: string) => void;
}

export function ServiceScheduleAccordion({
  selectedServiceIds,
  schedules,
  onSelectDay,
  onSelectTime,
}: ServiceScheduleAccordionProps) {
  const selectedServices = getSelectedServices(selectedServiceIds);
  const scheduledCount = countScheduledServices(schedules, selectedServiceIds);

  const firstPendingId = useMemo(
    () =>
      selectedServiceIds.find(
        (id) => !isServiceScheduleComplete(schedules[id]),
      ),
    [selectedServiceIds, schedules],
  );

  const [openServiceId, setOpenServiceId] = useState<string | null>(null);

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
  }, [selectedServiceIds, firstPendingId]);

  const toggleService = (serviceId: string) => {
    setOpenServiceId((current) => (current === serviceId ? null : serviceId));
  };

  return (
    <section className="feature-card overflow-hidden rounded-xl">
      <div className="border-b border-(--border) px-3 py-2.5">
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-center gap-1.5">
            <span className="flex h-5 w-5 items-center justify-center rounded-full bg-(--accent-primary)/10">
              <CalendarDays size={11} className="text-(--accent-primary)" />
            </span>
            <div>
              <h3 className="text-xs font-bold text-(--text-primary)">
                Schedule Date &amp; Time
              </h3>
              <p className="text-[8px] font-semibold text-(--text-muted)">
                Set a slot for each service
              </p>
            </div>
          </div>

          {/* <div className="text-right">
            <p className="text-[8px] font-semibold text-(--text-secondary)">
              {scheduledCount} of {selectedServiceIds.length} scheduled
            </p>
            <div className="mt-1 flex justify-end gap-1">
              {selectedServiceIds.map((id) => {
                const done = isServiceScheduleComplete(schedules[id]);
                return (
                  <span
                    key={id}
                    className={`h-1.5 w-1.5 rounded-full ${
                      done ? "bg-(--success)" : "bg-(--border)"
                    }`}
                  />
                );
              })}
            </div>
          </div> */}
        </div>
      </div>

      <div>
        {selectedServices.map((service) => {
          const schedule = schedules[service.id];
          const isOpen = openServiceId === service.id;
          const isScheduled = isServiceScheduleComplete(schedule);

          return (
            <div
              key={service.id}
              className="border-b border-(--border) last:border-b-0"
            >
              <button
                type="button"
                onClick={() => toggleService(service.id)}
                aria-expanded={isOpen}
                className="
                  flex w-full items-center gap-2 px-3 py-2.5 text-left
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
                  <div className="mt-1 flex items-center gap-1">
                    {isScheduled ? (
                      <>
                        <Clock3 size={9} className="shrink-0 text-(--accent-primary)" />
                        <span className="truncate text-[8px] font-semibold text-(--text-secondary)">
                          {formatServiceSchedule(schedule)}
                        </span>
                      </>
                    ) : (
                      <span className="text-[8px] font-semibold text-(--text-muted)">
                        Select date &amp; time
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex shrink-0 flex-col items-end gap-1">
                  <span
                    className={`text-[7px] font-semibold ${
                      isScheduled ? "text-(--success)" : "text-(--text-muted)"
                    }`}
                  >
                    {isScheduled ? (
                      <span className="flex items-center gap-0.5">
                        <Check size={8} strokeWidth={2.5} />
                        Scheduled
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

              {isOpen && schedule && (
                <div
                  className="
                    border-t border-(--border)/50 px-3 pb-3 pt-2
                    bg-[color-mix(in_srgb,var(--accent-primary)_4%,transparent)]
                  "
                >
                  <Step2DateTimeSection
                    embedded
                    days={bookingDays}
                    times={timeSlots}
                    activeDayId={schedule.dayId}
                    activeTime={schedule.time}
                    onSelectDay={(dayId) => onSelectDay(service.id, dayId)}
                    onSelectTime={(time) => onSelectTime(service.id, time)}
                  />
                </div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}
