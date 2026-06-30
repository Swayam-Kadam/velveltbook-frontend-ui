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
        
        <div className="flex items-between gap-2">

        <div className="mb-2 w-full">
        <h2 className="text-sm font-bold text-(--text-primary)">
          Select Service
        </h2>
        <article className="feature-card relative rounded-xl ">
          {/* <span className="primary-button text-white absolute right-2 top-2 flex h-5 w-5 items-center justify-center rounded-full">
            ✓
          </span> */}
          <div className="flex flex-col gap-3">
            <div className="relative h-20 w-full shrink-0 overflow-hidden rounded-t-sm">
              <Image src={service.image} alt={service.name} fill sizes="64px" className="object-cover" />
            </div>
            <div className="min-w-0 flex-1 px-3">
              <p className="text-[13px] font-bold text-(--text-primary)">{service.name}</p>
              <div className="mt-0.5 flex items-center gap-1 text-[10px] font-bold text-(--text-primary)">
                <Clock3 size={10} /><span>{service.duration}</span>
              </div>
              <p className="mt-1 text-[13px] font-semibold text-(--brand-gold)">{service.priceLabel}</p>
              <p className="mt-0.5 text-[10px] font-semibold text-(--text-primary)">{service.description.slice(0, 55)}...</p>
            </div>
          </div>
          <button type="button" className=" pb-3 mt-2 w-full text-center text-[10px] font-bold text-(--accent-primary)">
            Change Service
          </button>
        </article>
        </div>

        <div className="w-full">
        <h2 className="text-sm font-bold text-(--text-primary)">Selected Therapist</h2>
        <article className="feature-card rounded-xl">
          <div className="flex flex-col items-left">
            <div className="relative h-20 w-full shrink-0 overflow-hidden rounded-t-sm">
              <Image src={staff.image} alt={staff.name} fill sizes="40px" className="object-cover" />
            </div>
            <div className="flex-1  pt-3 px-3">
              <p className="text-[14px] font-bold text-(--text-primary)">{staff.name}</p>
              <div className="flex flex-col gap-1 text-left text-[10px] font-bold text-(--text-primary)">
                <div className="flex items-center gap-1">
                <Star size={20} className="fill-(--brand-gold) text-(--brand-gold)" />
                <span>{staff.rating}</span>
                </div>
               
                  <span>• {staff.experience}</span>
                  <span>• 1.2k+ Services</span>
                
              </div>
            </div>
            <button type="button" className="pb-3 pt-5 flex items-center justify-center gap-0.5 text-[10px] font-bold text-(--accent-secondary)">
              <Pencil size={11} /> Change
            </button>
          </div>
        </article>
        </div>
        </div>

        {/* <h2 className="text-sm font-bold text-(--text-primary)">Selected Location</h2>
        <article className="feature-card rounded-xl p-3">
          <div className="flex items-center gap-3">
            <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-lg">
              <Image src={bookingLocation.image} alt={bookingLocation.name} fill sizes="40px" className="object-cover" />
            </div>
            <div>
              <p className="text-[13px] font-bold text-(--text-primary)">{bookingLocation.name}</p>
              <p className="text-[11px] font-semibold text-(--text-primary)">{bookingLocation.address}</p>
              <p className="text-[10px] font-bold text-(--success)">{bookingLocation.status}</p>
            </div>
          </div>
        </article> */}
      </section>

      <section>
        <h2 className="mb-2 text-sm font-bold text-(--text-primary)">Select Date & Time</h2>

        <article className="feature-card rounded-xl p-3">
          <div className="mb-3 flex items-center justify-between">
            <button type="button" className="text-(--text-primary)"><ChevronLeft size={16} /></button>
            <span className="text-[13px] font-bold text-(--text-primary)">May 2025</span>
            <button type="button" className="text-(--text-primary)"><ChevronRight size={16} /></button>
          </div>

          <div className="mb-1 grid grid-cols-7 gap-1 text-center text-[10px] font-bold text-(--text-secondary)">
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
                    text-[10px] font-bold transition-all duration-200
                    ${
                      active
                        ? "primary-button text-white shadow-none"
                        : "text-(--text-primary) hover:bg-(--bg-card-hover)"
                    }
                  `}
                >
                  {day}
                </button>
              );
            })}
          </div>
        </article>

        <h3 className="mb-2 mt-3 text-sm font-bold text-(--text-primary)">
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
                  rounded-lg py-2 text-[10px] font-bold transition-all duration-200
                  ${
                    active
                      ? "primary-button text-white shadow-none"
                      : "secondary-button text-(--text-primary)"
                  }
                `}
              >
                {slot}
              </button>
            );
          })}
        </div>
      </section>

      {/* <section>
        <h2 className="mb-2 text-sm font-bold text-(--text-primary)">Booking Summary</h2>
        <article className="feature-card space-y-2 rounded-xl p-3 text-[12px]">
          {[
            { icon: CalendarDays, label: "Service", value: service.name },
            { icon: UserRound, label: "Therapist", value: staff.name },
            { icon: CalendarDays, label: "Date", value: `May ${selectedDate}, 2025` },
            { icon: Clock3, label: "Time", value: selectedTime },
            { icon: MapPin, label: "Location", value: `${bookingLocation.name}, ${bookingLocation.address}` },
          ].map(({ icon: Icon, label, value }) => (
            <div key={label} className="flex items-start gap-2">
              <Icon size={12} className="mt-0.5 shrink-0 text-(--accent-primary)" />
              <div className="min-w-0 flex-1">
                <span className="text-(--text-secondary) font-bold">{label}: </span>
                <span className="text-(--text-primary) font-bold">{value}</span>
              </div>
            </div>
          ))}

          <div className="space-y-1 border-t border-(--border) pt-2">
            <div className="flex justify-between text-(--text-secondary) font-bold">
              <span>Subtotal</span><span>${subtotal}</span>
            </div>
            <div className="flex justify-between text-(--text-secondary) font-bold">
              <span className="flex items-center gap-0.5">Taxes & Fees <Info size={10} /></span>
              <span>${tax}</span>
            </div>
            <div className="flex justify-between text-[13px] font-bold text-(--text-primary)">
              <span>Total</span><span>${total}</span>
            </div>
          </div>
        </article>
      </section> */}

      {/* <Button variant="primary" fullWidth onClick={onNext} className="gap-2 rounded-xl py-3 text-[11px] font-medium">
        Continue to Payment
        <ChevronRight size={16} strokeWidth={2} />
      </Button> */}

      <button type="button" onClick={onBack} className="secondary-button w-full rounded-xl py-2 text-[9px] font-medium">
        BACK
      </button>
    </div>
  );
}
