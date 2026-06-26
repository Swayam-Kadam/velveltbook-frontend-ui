"use client";

import Image from "next/image";
import Link from "next/link";
import {
  ArrowLeft,
  CalendarDays,
  Check,
  ChevronRight,
  Clock3,
  ShieldCheck,
  Star,
} from "lucide-react";

import {
  bookingStaff,
  getService,
  getStaff,
} from "../../booking.data";
import { Button } from "@/components/Button";
import { WhyChooseUs } from "../WhyChooseUs";

interface Step2StaffSelectionProps {
  serviceId: string;
  staffId: string;
  onSelectStaff: (id: string) => void;
  onBack: () => void;
  onNext: () => void;
}

export function Step2StaffSelection({
  serviceId,
  staffId,
  onSelectStaff,
  onBack,
  onNext,
}: Step2StaffSelectionProps) {
  const service = getService(serviceId);
  const staff = getStaff(staffId);

  return (
    <div className="space-y-4">
      <div>
        <div className="mb-2 flex items-start justify-between gap-2">
          <div>
            <h2 className="text-sm font-bold text-(--text-primary)">
              Select Your Preferred Therapist
            </h2>
            <p className="mt-0.5 text-[8px] text-(--text-muted)">
              Our professional therapists are here to provide you the best
              experience
            </p>
          </div>
          <button
            type="button"
            className="
              secondary-button shrink-0 rounded-md px-2 py-1
              text-[7px] font-medium text-(--text-primary)
            "
          >
            view more
          </button>
        </div>

        <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
          {bookingStaff.map((therapist) => {
            const active = therapist.id === staffId;

            return (
              <article
                key={therapist.id}
                className={`
                  feature-card w-[118px] shrink-0 rounded-xl p-2
                  ${active ? "border-(--accent-primary)" : ""}
                `}
              >
                <button
                  type="button"
                  onClick={() => onSelectStaff(therapist.id)}
                  className="w-full text-left"
                >
                  <div className="relative h-[100px] overflow-hidden rounded-sm">
                    <Image
                      src={therapist.image}
                      alt={therapist.name}
                      fill
                      sizes="118px"
                      className="object-cover"
                    />
                    <span
                      className={`
                        absolute right-1 top-1 flex h-4 w-4 items-center text-white justify-center
                        rounded-full border
                        ${
                          active
                            ? "primary-button border-transparent"
                            : "border-(--border) bg-(--bg-card)"
                        }
                      `}
                    >
                      {active && <Check size={10} strokeWidth={2.5} />}
                    </span>
                  </div>

                  <p className="mt-2 text-[13px] font-bold text-(--text-primary)">
                    {therapist.name}
                  </p>
                  <p className="text-[10px] font-semibold text-(--text-primary)">
                    {therapist.experience}
                  </p>

                  <div className="mt-1 flex items-center gap-0.5">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        size={10}
                        className="fill-(--brand-gold) text-(--brand-gold)"
                      />
                    ))}
                    <span className="ml-0.5 text-[10px] text-(--text-primary)">
                      ({therapist.reviews})
                    </span>
                  </div>

                  <p className="mt-1 h-10 rounded-md bg-(--bg-card-hover) p-1 text-[9px] font-semibold leading-tight text-(--text-primary)">
                    {therapist.specialties}
                  </p>
                </button>

                <Link
                  href={`/specificexpert/e1`}
                  className="
                    secondary-button mt-2 flex w-full items-center justify-center
                    rounded-md py-1 text-[9px] font-bold
                    text-(--text-primary)
                  "
                >
                  View Profile
                </Link>
              </article>
            );
          })}

          <button
            type="button"
            className="
              flex h-8 w-8 shrink-0 items-center justify-center self-center
              rounded-full border border-(--border) bg-(--bg-card)
            "
          >
            <ChevronRight size={14} className="text-(--text-primary)" />
          </button>
        </div>
      </div>

      <div
        className="
          flex items-start gap-2 rounded-xl
          bg-[color-mix(in_srgb,var(--accent-primary)_8%,var(--bg-card))]
          p-3
        "
      >
        <ShieldCheck size={16} className="shrink-0 text-(--accent-primary)" />
        <p className="text-[8px] leading-relaxed text-(--text-secondary)">
          All our therapists are certified, experienced and committed to your
          comfort and well-being.
        </p>
      </div>

      <button
        type="button"
        onClick={onBack}
        className="
          secondary-button inline-flex items-center gap-1 rounded-lg
          px-3 py-2 text-[9px] font-medium text-(--text-primary)
        "
      >
        <ArrowLeft size={12} />
        Back: Select Service
      </button>

      <section>
        <h2 className="mb-2 text-xs font-medium text-(--text-primary)">
          Your Booking
        </h2>

        <article className="feature-card space-y-2 rounded-xl p-3">
          <div className="flex items-center gap-3">
            <div className="relative h-12 w-14 shrink-0 overflow-hidden rounded-sm">
              <Image
                src={service.image}
                alt={service.name}
                fill
                sizes="56px"
                className="object-cover"
              />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-[12px] font-bold text-(--text-primary)">
                {service.name}
              </p>
              <div className="flex items-center gap-1 text-[10px] font-bold text-(--text-primary)">
                <Clock3 size={10} />
                <span>{service.duration}</span>
              </div>
            </div>
            <span className="text-[14px] font-bold text-(--text-primary)">
              {service.priceLabel}
            </span>
          </div>

          <button
            type="button"
            onClick={onNext}
            className="
              flex w-full items-center justify-between rounded-lg
              border border-(--border) bg-(--bg-card-hover) px-3 py-2
            "
          >
            <div className="flex items-center gap-2">
              <CalendarDays size={14} className="text-(--accent-primary)" />
              <span className="text-[10px] font-bold text-(--text-primary)">
                Select Date & Time
              </span>
            </div>
            <ChevronRight size={14} className="text-(--text-muted)" />
          </button>

          <div className="flex items-center gap-2 border-t border-(--border) pt-2">
            <div className="relative h-8 w-8 shrink-0 overflow-hidden rounded-full">
              <Image
                src={staff.image}
                alt={staff.name}
                fill
                sizes="32px"
                className="object-cover"
              />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-[13px] font-bold text-(--text-primary)">
                {staff.name}
              </p>
              <p className="text-[10px] font-bold text-(--text-primary)">
                {staff.experience}
              </p>
            </div>
            <button type="button" className="text-[10px] font-bold text-(--accent-secondary)">
              Change
            </button>
          </div>
        </article>
      </section>

      <Button
        variant="primary"
        fullWidth
        onClick={onNext}
        className="relative gap-2 rounded-xl py-3 text-[11px] font-medium"
      >
        <CalendarDays size={14} className="absolute left-4" strokeWidth={1.8} />
        Next: Book & Pay
        <ChevronRight size={16} className="absolute right-4" strokeWidth={2} />
      </Button>

      <WhyChooseUs />
    </div>
  );
}
