"use client";

import { useEffect, useMemo, useState } from "react";
import { X } from "lucide-react";

import {
  buildBookingDays,
  getAvailableTimeSlots,
  timeSlots,
} from "@/booking/booking.data";
import { BookingMonthCalendar } from "@/booking/components/steps/BookingMonthCalendar";

type TimePeriod = "AM" | "PM";

function getTimePeriod(time: string): TimePeriod {
  return time.endsWith("PM") ? "PM" : "AM";
}

interface ServiceDateTimeModalProps {
  isOpen: boolean;
  serviceName?: string;
  initialDayId?: string;
  initialTime?: string;
  onClose: () => void;
  onConfirm: (dayId: string, time: string) => void;
}

export function ServiceDateTimeModal({
  isOpen,
  serviceName,
  initialDayId,
  initialTime,
  onClose,
  onConfirm,
}: ServiceDateTimeModalProps) {
  const days = useMemo(() => buildBookingDays(new Date()), []);
  const [dayId, setDayId] = useState(
    () => initialDayId || days[0]?.id || "",
  );
  const [time, setTime] = useState(() => initialTime || "");
  const [timePeriod, setTimePeriod] = useState<TimePeriod>("AM");

  useEffect(() => {
    if (!isOpen) return;
    const nextDay = initialDayId || days[0]?.id || "";
    setDayId(nextDay);
    const available = getAvailableTimeSlots(nextDay, timeSlots);
    const nextTime =
      (initialTime && available.includes(initialTime)
        ? initialTime
        : available[0]) || "";
    setTime(nextTime);
    if (nextTime) setTimePeriod(getTimePeriod(nextTime));
  }, [days, initialDayId, initialTime, isOpen]);

  useEffect(() => {
    if (!isOpen) return;
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    document.body.style.overflow = "hidden";
    document.addEventListener("keydown", handleEscape);
    return () => {
      document.body.style.overflow = "";
      document.removeEventListener("keydown", handleEscape);
    };
  }, [isOpen, onClose]);

  const availableTimes = useMemo(
    () => getAvailableTimeSlots(dayId, timeSlots),
    [dayId],
  );

  const filteredTimes = useMemo(
    () => availableTimes.filter((slot) => getTimePeriod(slot) === timePeriod),
    [availableTimes, timePeriod],
  );

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-[70] flex items-center justify-center bg-black/50 p-4"
      role="dialog"
      aria-modal="true"
      aria-label="Choose date and time"
      onClick={onClose}
    >
      <div
        className="
          w-full max-w-md overflow-hidden rounded-[22px] border border-(--border)
          bg-(--bg-card) shadow-(--shadow-card)
        "
        onClick={(event) => event.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b border-(--border) px-4 py-3">
          <div className="min-w-0">
            <h2 className="text-[16px] font-semibold text-(--text-primary)">
              Choose Date &amp; Time
            </h2>
            {serviceName && (
              <p className="mt-0.5 truncate text-[12px] text-(--text-muted)">
                {serviceName}
              </p>
            )}
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="
              flex h-8 w-8 items-center justify-center rounded-full
              text-(--text-muted) transition-colors hover:bg-(--bg-secondary)
              hover:text-(--text-primary)
            "
          >
            <X size={18} />
          </button>
        </div>

        <div className="space-y-3 p-4">
          <BookingMonthCalendar
            days={days}
            activeDayId={dayId}
            onSelectDay={(nextDayId) => {
              setDayId(nextDayId);
              const available = getAvailableTimeSlots(nextDayId, timeSlots);
              const inPeriod = available.filter(
                (slot) => getTimePeriod(slot) === timePeriod,
              );
              setTime(inPeriod[0] ?? available[0] ?? "");
            }}
          />

          <div>
            <div className="mb-2 flex items-center justify-between gap-2">
              <p className="text-[12px] font-semibold text-(--text-secondary)">
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
                    onClick={() => {
                      setTimePeriod(period);
                      const inPeriod = availableTimes.filter(
                        (slot) => getTimePeriod(slot) === period,
                      );
                      if (!inPeriod.includes(time) && inPeriod[0]) {
                        setTime(inPeriod[0]);
                      }
                    }}
                    aria-pressed={timePeriod === period}
                    className={`
                      rounded-md px-2.5 py-1 text-[11px] font-semibold transition-colors
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

            <div className="grid max-h-[160px] grid-cols-3 gap-2 overflow-y-auto pr-1 scrollbar-thin scrollbar-thumb-(--accent-primary) scrollbar-track-(--bg-secondary)">
              {filteredTimes.map((slot) => {
                const active = slot === time;
                return (
                  <button
                    key={slot}
                    type="button"
                    onClick={() => setTime(slot)}
                    className={`
                      rounded-xl border px-2 py-2.5 text-[12px] font-semibold
                      tabular-nums transition-all
                      ${
                        active
                          ? "primary-button border-transparent text-white"
                          : "border-(--border) bg-(--bg-secondary) text-(--text-primary) hover:border-(--accent-primary)/40"
                      }
                    `}
                  >
                    {slot}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        <div className="flex gap-2 border-t border-(--border) px-4 py-3">
          <button
            type="button"
            onClick={onClose}
            className="secondary-button h-11 flex-1 rounded-xl text-[13px] font-semibold"
          >
            Cancel
          </button>
          <button
            type="button"
            disabled={!dayId || !time}
            onClick={() => onConfirm(dayId, time)}
            className="
              primary-button h-11 flex-1 rounded-xl text-[13px] font-semibold
              text-white disabled:cursor-not-allowed disabled:opacity-50
            "
          >
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
}
