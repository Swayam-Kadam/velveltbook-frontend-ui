"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  CalendarDays,
  CalendarPlus,
  Clock3,
  MapPin,
  RotateCcw,
  Star,
  UserRound,
  X,
} from "lucide-react";

type BookingTab = "upcoming" | "completed" | "cancelled";

interface Booking {
  id: string;
  service: string;
  therapist: string;
  date: string;
  time: string;
  location: string;
  price: string;
  image: string;
}

const tabs: { id: BookingTab; label: string }[] = [
  { id: "upcoming", label: "Upcoming" },
  { id: "completed", label: "Completed" },
  { id: "cancelled", label: "Cancelled" },
];

const bookingData: Record<BookingTab, Booking[]> = {
  upcoming: [
    {
      id: "u1",
      service: "Swedish Massage",
      therapist: "Sony",
      date: "May 22, 2025",
      time: "11:00 AM",
      location: "Lomi Massage, Melbourne",
      price: "$88",
      image:
        "https://images.unsplash.com/photo-1544161515-4ab6ce6db874?w=400&h=300&fit=crop",
    },
    {
      id: "u2",
      service: "Aromatherapy Massage",
      therapist: "Samar",
      date: "May 28, 2025",
      time: "02:00 PM",
      location: "Lomi Massage, Melbourne",
      price: "$99",
      image:
        "https://images.unsplash.com/photo-1600334089648-b0d9d3028eb2?w=400&h=300&fit=crop",
    },
  ],
  completed: [
    {
      id: "c1",
      service: "Hot Stone Massage",
      therapist: "Sami",
      date: "Apr 12, 2025",
      time: "10:00 AM",
      location: "Lomi Massage, Melbourne",
      price: "$129",
      image:
        "https://images.unsplash.com/photo-1519823551278-64ac92734fb1?w=400&h=300&fit=crop",
    },
    {
      id: "c2",
      service: "Deep Tissue Massage",
      therapist: "Jesai",
      date: "Mar 30, 2025",
      time: "04:00 PM",
      location: "Lomi Massage, Melbourne",
      price: "$119",
      image:
        "https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=400&h=300&fit=crop",
    },
  ],
  cancelled: [
    {
      id: "x1",
      service: "Couples Massage",
      therapist: "Samar",
      date: "Apr 02, 2025",
      time: "01:00 PM",
      location: "Lomi Massage, Melbourne",
      price: "$189",
      image:
        "https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=400&h=300&fit=crop",
    },
  ],
};

const statusStyles: Record<
  BookingTab,
  { label: string; color: string; bg: string }
> = {
  upcoming: {
    label: "Upcoming",
    color: "var(--accent-secondary)",
    bg: "color-mix(in srgb, var(--accent-primary) 12%, transparent)",
  },
  completed: {
    label: "Completed",
    color: "var(--success)",
    bg: "color-mix(in srgb, var(--success) 14%, transparent)",
  },
  cancelled: {
    label: "Cancelled",
    color: "#e2536b",
    bg: "color-mix(in srgb, #e2536b 14%, transparent)",
  },
};

function BookingCard({
  booking,
  tab,
}: {
  booking: Booking;
  tab: BookingTab;
}) {
  const status = statusStyles[tab];

  return (
    <article className="feature-card overflow-hidden rounded-xl p-2.5">
      <div className="flex gap-3">
        <div className="relative h-[72px] w-[72px] shrink-0 overflow-hidden rounded-sm">
          <Image
            src={booking.image}
            alt={booking.service}
            fill
            sizes="72px"
            className="object-cover"
          />
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-2">
            <h3 className="truncate text-[13px] font-bold text-(--text-primary)">
              {booking.service}
            </h3>
            <span
              className="shrink-0 rounded-full px-2 py-0.5 text-[8px] font-bold"
              style={{ color: status.color, background: status.bg }}
            >
              {status.label}
            </span>
          </div>

          <div className="mt-1 flex items-center gap-1 text-[10px] font-semibold text-(--text-secondary)">
            <UserRound size={11} className="text-(--accent-primary)" />
            <span className="truncate">with {booking.therapist}</span>
          </div>

          <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-0.5 text-[9px] font-semibold text-(--text-secondary)">
            <span className="flex items-center gap-1">
              <CalendarDays size={10} className="text-(--accent-primary)" />
              {booking.date}
            </span>
            <span className="flex items-center gap-1">
              <Clock3 size={10} className="text-(--accent-primary)" />
              {booking.time}
            </span>
          </div>

          <div className="mt-1 flex items-center justify-between gap-2">
            <span className="flex min-w-0 items-center gap-1 text-[9px] font-semibold text-(--text-muted)">
              <MapPin size={10} className="shrink-0 text-(--accent-primary)" />
              <span className="truncate">{booking.location}</span>
            </span>
            <span className="shrink-0 text-[13px] font-bold text-(--brand-gold)">
              {booking.price}
            </span>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="mt-2.5 flex gap-2 border-t border-(--border) pt-2.5">
        {tab === "upcoming" && (
          <>
            <button
              type="button"
              className="
                flex flex-1 items-center justify-center gap-1 rounded-lg
                border border-(--border) py-1.5 text-[10px] font-bold
                text-(--text-primary) transition-colors hover:bg-(--bg-card-hover)
              "
            >
              <CalendarPlus size={12} />
              Reschedule
            </button>
            <button
              type="button"
              className="
                flex flex-1 items-center justify-center gap-1 rounded-lg
                border border-[color-mix(in_srgb,#e2536b_40%,transparent)] py-1.5
                text-[10px] font-bold text-[#e2536b] transition-colors
                hover:bg-[color-mix(in_srgb,#e2536b_8%,transparent)]
              "
            >
              <X size={12} />
              Cancel
            </button>
          </>
        )}

        {tab === "completed" && (
          <>
            <button
              type="button"
              className="
                flex flex-1 items-center justify-center gap-1 rounded-lg
                border border-(--border) py-1.5 text-[10px] font-bold
                text-(--text-primary) transition-colors hover:bg-(--bg-card-hover)
              "
            >
              <Star size={12} className="text-(--brand-gold)" />
              Rate
            </button>
            <Link
              href="/booking"
              className="
                primary-button flex flex-1 items-center justify-center gap-1
                rounded-lg py-1.5 text-[10px] font-bold text-white
              "
            >
              <RotateCcw size={12} />
              Book Again
            </Link>
          </>
        )}

        {tab === "cancelled" && (
          <Link
            href="/booking"
            className="
              primary-button flex flex-1 items-center justify-center gap-1
              rounded-lg py-1.5 text-[10px] font-bold text-white
            "
          >
            <RotateCcw size={12} />
            Book Again
          </Link>
        )}
      </div>
    </article>
  );
}

function EmptyState({ tab }: { tab: BookingTab }) {
  return (
    <div className="flex flex-col items-center justify-center px-6 py-20 text-center">
      <div
        className="mb-4 flex h-16 w-16 items-center justify-center rounded-full"
        style={{
          background: "color-mix(in srgb, var(--accent-primary) 8%, transparent)",
        }}
      >
        <CalendarDays size={28} className="text-(--text-muted)" strokeWidth={1.6} />
      </div>

      <p className="text-sm font-medium text-(--text-muted)">
        No {tab} bookings found.
      </p>

      <Link
        href="/booking"
        className="
          primary-button mt-5 rounded-full px-6 py-2.5 text-[11px]
          font-bold uppercase tracking-wide text-white
        "
      >
        Book a Service
      </Link>
    </div>
  );
}

export default function MyBookingPage() {
  const [activeTab, setActiveTab] = useState<BookingTab>("upcoming");

  const bookings = bookingData[activeTab];

  return (
    <main className="px-2 pb-20">
      {/* Tabs */}
      <div className="flex border-b border-(--border)">
        {tabs.map((tab) => {
          const active = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className="relative flex-1 py-3 text-center text-[11px] font-bold uppercase tracking-wide transition-colors"
              style={{
                color: active ? "var(--accent-secondary)" : "var(--text-muted)",
              }}
            >
              {tab.label}
              {active && (
                <span
                  className="absolute inset-x-0 -bottom-px mx-auto h-0.5 w-full"
                  style={{ background: "var(--accent-secondary)" }}
                />
              )}
            </button>
          );
        })}
      </div>

      {/* Content */}
      {bookings.length > 0 ? (
        <div className="space-y-2.5 pt-3">
          {bookings.map((booking) => (
            <BookingCard key={booking.id} booking={booking} tab={activeTab} />
          ))}
        </div>
      ) : (
        <EmptyState tab={activeTab} />
      )}
    </main>
  );
}
