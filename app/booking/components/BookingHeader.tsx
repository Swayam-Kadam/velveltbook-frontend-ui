"use client";

import { useRouter } from "next/navigation";
import { ArrowLeft, X } from "lucide-react";

interface BookingHeaderProps {
  showClose?: boolean;
}

export function BookingHeader({ showClose = true }: BookingHeaderProps) {
  const router = useRouter();

  return (
    <div className="relative">
      <div className="flex items-center justify-between">
        <button
          type="button"
          onClick={() => router.back()}
          aria-label="Go back"
          className="flex h-8 w-8 items-center justify-center text-[var(--text-primary)]"
        >
          <ArrowLeft size={18} strokeWidth={1.8} />
        </button>

        {showClose && (
          <button
            type="button"
            onClick={() => router.push("/home")}
            aria-label="Close booking"
            className="flex h-8 w-8 items-center justify-center text-[var(--text-primary)]"
          >
            <X size={18} strokeWidth={1.8} />
          </button>
        )}
      </div>

      <div className="mt-1 text-center">
        <h1 className="text-base font-semibold text-[var(--text-primary)]">
          Book Your Appointment
        </h1>
        <p className="mt-0.5 text-[9px] text-[var(--text-muted)]">
          Relax, Rejuvenate & Refresh your mind and body
        </p>
      </div>
    </div>
  );
}
