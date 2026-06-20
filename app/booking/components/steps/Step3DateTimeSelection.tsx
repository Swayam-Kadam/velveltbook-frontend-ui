"use client";

import Image from "next/image";
import {
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  Clock3,
  Info,
  MapPin,
  Pencil,
  Star,
  UserRound,
} from "lucide-react";

import {
  bookingLocation,
  calendarDays,
  calcTotal,
  getService,
  getStaff,
  timeSlots,
} from "../../booking.data";
import { Button } from "@/components/Button";

interface Step3DateTimeSelectionProps {
  serviceId: string;
  staffId: string;
  selectedDate: number;
  selectedTime: string;
  onSelectDate: (date: number) => void;
  onSelectTime: (time: string) => void;
  onBack: () => void;
  onNext: () => void;
}

export function Step3DateTimeSelection({
  serviceId,
  staffId,
  selectedDate,
  selectedTime,
  onSelectDate,
  onSelectTime,
  onBack,
  onNext,
}: Step3DateTimeSelectionProps) {
  const service = getService(serviceId);
  const staff = getStaff(staffId);
  const { subtotal, tax, total } = calcTotal(service.price);

  return (
    <div className="space-y-4">
      <section className="space-y-3">
        <h2 className="text-xs font-medium text-[var(--text-primary)]">
          Select Service
        </h2>
        <article className="feature-card relative rounded-xl p-3">
          <span className="primary-button absolute right-2 top-2 flex h-5 w-5 items-center justify-center rounded-full">
            ✓
          </span>
          <div className="flex gap-3">
            <div className="relative h-14 w-16 shrink-0 overflow-hidden rounded-lg">
              <Image src={service.image} alt={service.name} fill sizes="64px" className="object-cover" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-[10px] font-medium text-[var(--text-primary)]">{service.name}</p>
              <div className="mt-0.5 flex items-center gap-1 text-[8px] text-[var(--text-muted)]">
                <Clock3 size={9} /><span>{service.duration}</span>
              </div>
              <p className="mt-1 text-[10px] font-semibold text-[var(--brand-gold)]">{service.priceLabel}</p>
              <p className="mt-0.5 text-[7px] text-[var(--text-secondary)]">{service.description.slice(0, 60)}...</p>
            </div>
          </div>
          <button type="button" className="mt-2 w-full text-center text-[8px] text-[var(--accent-secondary)]">
            Change Service
          </button>
        </article>

        <h2 className="text-xs font-medium text-[var(--text-primary)]">Selected Therapist</h2>
        <article className="feature-card rounded-xl p-3">
          <div className="flex items-center gap-3">
            <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-full">
              <Image src={staff.image} alt={staff.name} fill sizes="40px" className="object-cover" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-[10px] font-medium text-[var(--text-primary)]">{staff.name}</p>
              <div className="flex items-center gap-1 text-[8px] text-[var(--text-secondary)]">
                <Star size={8} className="fill-[var(--brand-gold)] text-[var(--brand-gold)]" />
                <span>{staff.rating}</span>
                <span>• {staff.experience}</span>
                <span>• 1.2k+ Services</span>
              </div>
            </div>
            <button type="button" className="flex items-center gap-0.5 text-[8px] text-[var(--accent-secondary)]">
              <Pencil size={10} /> Change
            </button>
          </div>
        </article>

        <h2 className="text-xs font-medium text-[var(--text-primary)]">Selected Location</h2>
        <article className="feature-card rounded-xl p-3">
          <div className="flex items-center gap-3">
            <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-lg">
              <Image src={bookingLocation.image} alt={bookingLocation.name} fill sizes="40px" className="object-cover" />
            </div>
            <div>
              <p className="text-[10px] font-medium text-[var(--text-primary)]">{bookingLocation.name}</p>
              <p className="text-[8px] text-[var(--text-muted)]">{bookingLocation.address}</p>
              <p className="text-[8px] text-[var(--success)]">{bookingLocation.status}</p>
            </div>
          </div>
        </article>
      </section>

      <section>
        <h2 className="mb-2 text-xs font-medium text-[var(--text-primary)]">Select Date & Time</h2>

        <article className="feature-card rounded-xl p-3">
          <div className="mb-3 flex items-center justify-between">
            <button type="button" className="text-[var(--text-primary)]"><ChevronLeft size={16} /></button>
            <span className="text-[10px] font-medium text-[var(--text-primary)]">May 2025</span>
            <button type="button" className="text-[var(--text-primary)]"><ChevronRight size={16} /></button>
          </div>

          <div className="mb-1 grid grid-cols-7 gap-1 text-center text-[7px] text-[var(--text-muted)]">
            {["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"].map((d) => (
              <span key={d}>{d}</span>
            ))}
          </div>

          <div className="grid grid-cols-7 gap-1">
            {calendarDays.map((day) => {
              const active = day === selectedDate;
              return (
                <button
                  key={day}
                  type="button"
                  onClick={() => onSelectDate(day)}
                  className={`
                    flex h-7 w-full items-center justify-center rounded-full
                    text-[8px] transition-all duration-200
                    ${
                      active
                        ? "primary-button text-white shadow-none"
                        : "text-[var(--text-primary)] hover:bg-[var(--bg-card-hover)]"
                    }
                  `}
                >
                  {day}
                </button>
              );
            })}
          </div>
        </article>

        <h3 className="mb-2 mt-3 text-[10px] font-medium text-[var(--text-primary)]">
          Available Time Slots
        </h3>
        <div className="grid grid-cols-3 gap-2">
          {timeSlots.map((slot) => {
            const active = slot === selectedTime;
            return (
              <button
                key={slot}
                type="button"
                onClick={() => onSelectTime(slot)}
                className={`
                  rounded-lg py-2 text-[8px] font-medium transition-all duration-200
                  ${
                    active
                      ? "primary-button text-white shadow-none"
                      : "secondary-button text-[var(--text-primary)]"
                  }
                `}
              >
                {slot}
              </button>
            );
          })}
        </div>
      </section>

      <section>
        <h2 className="mb-2 text-xs font-medium text-[var(--text-primary)]">Booking Summary</h2>
        <article className="feature-card space-y-2 rounded-xl p-3 text-[8px]">
          {[
            { icon: CalendarDays, label: "Service", value: service.name },
            { icon: UserRound, label: "Therapist", value: staff.name },
            { icon: CalendarDays, label: "Date", value: `May ${selectedDate}, 2025` },
            { icon: Clock3, label: "Time", value: selectedTime },
            { icon: MapPin, label: "Location", value: `${bookingLocation.name}, ${bookingLocation.address}` },
          ].map(({ icon: Icon, label, value }) => (
            <div key={label} className="flex items-start gap-2">
              <Icon size={12} className="mt-0.5 shrink-0 text-[var(--accent-primary)]" />
              <div className="min-w-0 flex-1">
                <span className="text-[var(--text-muted)]">{label}: </span>
                <span className="text-[var(--text-primary)]">{value}</span>
              </div>
            </div>
          ))}

          <div className="space-y-1 border-t border-[var(--border)] pt-2">
            <div className="flex justify-between text-[var(--text-secondary)]">
              <span>Subtotal</span><span>${subtotal}</span>
            </div>
            <div className="flex justify-between text-[var(--text-secondary)]">
              <span className="flex items-center gap-0.5">Taxes & Fees <Info size={9} /></span>
              <span>${tax}</span>
            </div>
            <div className="flex justify-between text-[11px] font-semibold text-[var(--text-primary)]">
              <span>Total</span><span>${total}</span>
            </div>
          </div>
        </article>
      </section>

      <Button variant="primary" fullWidth onClick={onNext} className="gap-2 rounded-xl py-3 text-[11px] font-medium">
        Continue to Payment
        <ChevronRight size={16} strokeWidth={2} />
      </Button>

      <button type="button" onClick={onBack} className="secondary-button w-full rounded-xl py-2 text-[9px] font-medium">
        BACK
      </button>
    </div>
  );
}
