"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  CalendarDays,
  CalendarPlus,
  Clock3,
  MapPin,
  Navigation2,
  RotateCcw,
  Sparkles,
  Star,
  UserRound,
} from "lucide-react";

type BookingTab = "upcoming" | "completed" | "cancelled";

interface BookingOrganization {
  id: string;
  name: string;
  banner: string;
  thumbnail: string;
  status: string;
}

interface Booking {
  id: string;
  service: string;
  therapist: string;
  date: string;
  time: string;
  location: string;
  price: string;
  image: string;
  organization: BookingOrganization;
}

const organizations: Record<string, BookingOrganization> = {
  "lomi-melbourne": {
    id: "lomi-melbourne",
    name: "Lomi Massage, Melbourne",
    banner:
      "https://images.unsplash.com/photo-1519823551278-64ac92734fb1?w=800&h=400&fit=crop",
    thumbnail:
      "https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=200&h=200&fit=crop",
    status: "Open now",
  },
  "glamour-salon": {
    id: "glamour-salon",
    name: "Glamour Salon",
    banner:
      "https://images.unsplash.com/photo-1560066984-138dadb4c035?w=800&h=400&fit=crop",
    thumbnail:
      "https://images.unsplash.com/photo-1560066984-138dadb4c035?w=200&h=200&fit=crop",
    status: "Open now",
  },
};

interface SuggestedService {
  id: string;
  title: string;
  price: string;
  duration: string;
  image: string;
}

const tabs: { id: BookingTab; label: string }[] = [
  { id: "upcoming", label: "Ongoing" },
  { id: "completed", label: "Completed" },
  { id: "cancelled", label: "Cancelled" },
];

const bookingData: Record<BookingTab, Booking[]> = {
  upcoming: [
    {
      id: "u1",
      service: "Swedish Massage",
      therapist: "Sony",
      date: "May 22, 2026",
      time: "11:00 AM",
      location: "Lomi Massage, Melbourne",
      price: "$88",
      image:
        "https://images.unsplash.com/photo-1544161515-4ab6ce6db874?w=400&h=300&fit=crop",
      organization: organizations["lomi-melbourne"],
    },
    {
      id: "u2",
      service: "Aromatherapy Massage",
      therapist: "Samar",
      date: "May 28, 2026",
      time: "02:00 PM",
      location: "Glamour Salon, Sydney",
      price: "$99",
      image:
        "https://images.unsplash.com/photo-1600334089648-b0d9d3028eb2?w=400&h=300&fit=crop",
      organization: organizations["glamour-salon"],
    },
  ],
  completed: [
    {
      id: "c1",
      service: "Hot Stone Massage",
      therapist: "Sami",
      date: "Apr 12, 2026",
      time: "10:00 AM",
      location: "Lomi Massage, Melbourne",
      price: "$129",
      image:
        "https://images.unsplash.com/photo-1519823551278-64ac92734fb1?w=400&h=300&fit=crop",
      organization: organizations["lomi-melbourne"],
    },
    {
      id: "c2",
      service: "Deep Tissue Massage",
      therapist: "Jesai",
      date: "Mar 30, 2026",
      time: "04:00 PM",
      location: "Lomi Massage, Melbourne",
      price: "$119",
      image:
        "https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=400&h=300&fit=crop",
      organization: organizations["lomi-melbourne"],
    },
  ],
  cancelled: [
    {
      id: "x1",
      service: "Couples Massage",
      therapist: "Samar",
      date: "Apr 02, 2026",
      time: "01:00 PM",
      location: "Lomi Massage, Melbourne",
      price: "$189",
      image:
        "https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=400&h=300&fit=crop",
      organization: organizations["lomi-melbourne"],
    },
  ],
};

const suggestedServicesByTab: Record<BookingTab, SuggestedService[]> = {
  upcoming: [
    {
      id: "s-u1",
      title: "Hot Stone Massage",
      price: "$129",
      duration: "90 min",
      image:
        "https://images.unsplash.com/photo-1519823551278-64ac92734fb1?w=400&h=300&fit=crop",
    },
    {
      id: "s-u2",
      title: "Indian Head Massage",
      price: "$69",
      duration: "30 min",
      image:
        "https://images.unsplash.com/photo-1544161515-4ab6ce6db874?w=400&h=300&fit=crop",
    },
    {
      id: "s-u3",
      title: "Reflexology",
      price: "$79",
      duration: "45 min",
      image:
        "https://images.unsplash.com/photo-1519823551278-64ac92734fb1?w=400&h=300&fit=crop",
    },
  ],
  completed: [
    {
      id: "s-c1",
      title: "Couples Massage",
      price: "$189",
      duration: "90 min",
      image:
        "https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=400&h=300&fit=crop",
    },
    {
      id: "s-c2",
      title: "Lymphatic Drainage",
      price: "$99",
      duration: "60 min",
      image:
        "https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=400&h=300&fit=crop",
    },
    {
      id: "s-c3",
      title: "Aromatherapy Massage",
      price: "$99",
      duration: "60 min",
      image:
        "https://images.unsplash.com/photo-1600334089648-b0d9d3028eb2?w=400&h=300&fit=crop",
    },
  ],
  cancelled: [
    {
      id: "s-x1",
      title: "Swedish Massage",
      price: "$99",
      duration: "60 min",
      image:
        "https://images.unsplash.com/photo-1544161515-4ab6ce6db874?w=400&h=300&fit=crop",
    },
    {
      id: "s-x2",
      title: "Prenatal Massage",
      price: "$109",
      duration: "60 min",
      image:
        "https://images.unsplash.com/photo-1544161515-4ab6ce6db874?w=400&h=300&fit=crop",
    },
    {
      id: "s-x3",
      title: "Deep Tissue Massage",
      price: "$119",
      duration: "75 min",
      image:
        "https://images.unsplash.com/photo-1600334089648-b0d9d3028eb2?w=400&h=300&fit=crop",
    },
  ],
};

const statusStyles: Record<
  BookingTab,
  { label: string; color: string; bg: string }
> = {
  upcoming: {
    label: "Upcoming",
    // color: "var(--accent-secondary)",
    // bg: "color-mix(in srgb, var(--accent-primary) 12%, transparent)",
    color: "#e2536b",
    bg: "color-mix(in srgb, #e2536b 14%, transparent)"
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

function OrganizationBanner({
  organization,
}: {
  organization: BookingOrganization;
}) {
  return (
    <div className="border-b border-(--border)">
      <div className="relative h-[88px] w-full">
        <Image
          src={organization.banner}
          alt={organization.name}
          fill
          sizes="100vw"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-linear-to-t from-black/45 to-transparent" />
      </div>

      <div className="flex items-center gap-3 px-2.5 py-2">
        <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-xl">
          <Image
            src={organization.thumbnail}
            alt={organization.name}
            fill
            sizes="40px"
            className="object-cover"
          />
        </div>

        <div className="min-w-0 flex-1">
          <p className="truncate text-[12px] font-bold text-(--text-primary)">
            {organization.name}
          </p>
          <div className="mt-0.5 flex items-center gap-1 text-[10px] font-semibold">
            <MapPin size={9} className="text-(--success)" />
            <span className="text-(--success)">{organization.status}</span>
          </div>
        </div>

        <button
          type="button"
          aria-label="Get directions"
          className="
            flex h-8 w-8 shrink-0 items-center justify-center rounded-full
            border border-(--border) bg-(--bg-card)
            text-(--accent-primary)
          "
        >
          <Navigation2 size={14} strokeWidth={1.6} />
        </button>
      </div>
    </div>
  );
}

function BookingCard({
  booking,
  tab,
}: {
  booking: Booking;
  tab: BookingTab;
}) {
  const status = statusStyles[tab];

  return (
    <article className="feature-card overflow-hidden rounded-xl">
      <OrganizationBanner organization={booking.organization} />

      <div className="p-2.5">
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
              {status.label === "Upcoming" ? "Cancel" : status.label}
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
              {/* <CalendarPlus size={12} /> */}
              Ongoing
            </button>
            <button
              type="button"
              className="
                flex flex-1 items-center justify-center gap-1 rounded-lg
                border border-(--border) py-1.5 text-[10px] font-bold
                text-(--text-primary) transition-colors hover:bg-(--bg-card-hover)
              "
            >
              <CalendarPlus size={12} />
              Change
            </button>
            {/* <button
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
            </button> */}
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
      </div>
    </article>
  );
}

function SuggestedServiceCard({ service }: { service: SuggestedService }) {
  return (
    <Link
      href="/booking"
      className="
        feature-card group block overflow-hidden rounded-xl
        transition-all duration-300
        hover:border-[color-mix(in_srgb,var(--accent-secondary)_25%,var(--border))]
        hover:shadow-(--shadow-glow)
        active:scale-[0.98]
      "
    >
      <div className="relative h-[72px] overflow-hidden">
        <Image
          src={service.image}
          alt={service.title}
          fill
          sizes="120px"
          className="object-cover transition-transform duration-300 group-hover:scale-105"
        />
      </div>

      <div className="space-y-0.5 p-1.5">
        <h4 className="line-clamp-2 h-8 text-[10px] font-bold leading-tight text-(--text-primary)">
          {service.title}
        </h4>
        <p className="text-[11px] font-bold text-(--brand-gold)">{service.price}</p>
        <div className="flex items-center gap-0.5 text-[8px] font-bold text-(--text-primary)">
          <Clock3 size={9} strokeWidth={3} />
          <span>{service.duration}</span>
        </div>
      </div>
    </Link>
  );
}

function SuggestedServices({ tab }: { tab: BookingTab }) {
  const services = suggestedServicesByTab[tab];

  return (
    <section className="mt-4 border-t border-(--border) pt-4">
      <div className="mb-2.5 flex items-center justify-between">
        <div className="flex items-center gap-1.5">
          <Sparkles size={14} className="text-(--brand-gold)" strokeWidth={2} />
          <h3 className="text-xs font-bold text-(--text-primary)">
            Suggested Services
          </h3>
        </div>

        <Link
          href="/menu"
          className="
            flex items-center gap-0.5 text-[9px] font-semibold
            text-(--brand-gold) transition-opacity duration-200 hover:opacity-80
          "
        >
          <span>View all</span>
          <ArrowRight size={10} strokeWidth={2} />
        </Link>
      </div>

      <div className="grid grid-cols-3 gap-1.5">
        {services.map((service) => (
          <SuggestedServiceCard key={service.id} service={service} />
        ))}
      </div>
    </section>
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
      <div className="pt-3">
        {bookings.length > 0 ? (
          <div className="space-y-2.5">
            {bookings.map((booking) => (
              <BookingCard key={booking.id} booking={booking} tab={activeTab} />
            ))}
          </div>
        ) : (
          <EmptyState tab={activeTab} />
        )}

        <SuggestedServices tab={activeTab} />
      </div>
    </main>
  );
}
