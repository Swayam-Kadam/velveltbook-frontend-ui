"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowRight,
  BadgeCheck,
  ChevronDown,
  CircleHelp,
  Clock3,
  Lock,
  MapPin,
  Minus,
  Plus,
  ShieldCheck,
  Sparkles,
  Truck,
} from "lucide-react";

import {
  activeMyServiceSession,
  type MyServiceItem,
  type MyServiceSession,
} from "@/data/booking/my-services";
import { buildBookingUrl } from "@/booking/booking.navigation";

function money(value: number) {
  return value.toFixed(2);
}

function parseDurationMinutes(description: string): number {
  const match = description.match(/(\d+)\s*min/i);
  return match ? Number(match[1]) : 60;
}

function parseTimeToMinutes(time: string): number | null {
  const match = time.trim().match(/^(\d{1,2}):(\d{2})\s*(AM|PM)$/i);
  if (!match) return null;
  let hour = Number(match[1]);
  const minute = Number(match[2]);
  const period = match[3].toUpperCase();
  if (period === "PM" && hour !== 12) hour += 12;
  if (period === "AM" && hour === 12) hour = 0;
  return hour * 60 + minute;
}

function formatMinutesToTime(totalMinutes: number): string {
  const minutesInDay = 24 * 60;
  const normalized =
    ((Math.round(totalMinutes) % minutesInDay) + minutesInDay) % minutesInDay;
  let hour = Math.floor(normalized / 60);
  const minute = normalized % 60;
  const period = hour >= 12 ? "PM" : "AM";
  hour = hour % 12;
  if (hour === 0) hour = 12;
  return `${String(hour).padStart(2, "0")}:${String(minute).padStart(2, "0")} ${period}`;
}

function getServiceEndTime(service: MyServiceItem): string {
  const startMinutes = parseTimeToMinutes(service.timeLabel);
  if (startMinutes == null) return service.timeLabel;
  const duration = parseDurationMinutes(service.description);
  return formatMinutesToTime(startMinutes + duration);
}

function ServiceRow({ service }: { service: MyServiceItem }) {
  return (
    <article className="bg-(--bg-card) px-4 py-4">
      <div className="flex items-center gap-3">
        <div className="relative h-[84px] w-[84px] shrink-0 overflow-hidden rounded-xs bg-(--bg-secondary)">
          <Image
            src={service.image}
            alt={service.name}
            fill
            sizes="84px"
            className="object-cover"
          />
        </div>

        <div className="min-w-0 w-[250px] shrink-0">
          <h3 className=" text-[18px] font-bold text-(--text-primary)">
            {service.name}
          </h3>
          <p className="mt-0.5 text-[14px] leading-snug font-semibold text-(--text-primary)">
            {service.description}
          </p>
          <p className="mt-1.5 text-[18px] font-bold text-(--text-primary)">
            {service.priceLabel}
          </p>
        </div>

        {/* <div className="inline-flex h-9 shrink-0 items-center rounded-lg border border-(--border) bg-(--bg-card) px-1">
          <span className="flex h-7 w-7 items-center justify-center text-(--text-muted)">
            <Minus size={13} />
          </span>
          <span className="min-w-[20px] text-center text-[13px] font-semibold text-(--text-primary)">
            {service.quantity}
          </span>
          <span className="flex h-7 w-7 items-center justify-center text-(--text-muted)">
            <Plus size={13} />
          </span>
        </div> */}

        <div className="ml-auto flex min-w-0 flex-1 items-center justify-end gap-4">
          <div className="flex flex-col items-center gap-1.5">
            <div className="relative h-12 w-12 overflow-hidden rounded-xs">
              <Image
                src={service.staffImage}
                alt={service.staffName}
                fill
                sizes="40px"
                className="object-cover"
              />
              {/* {service.staffOnline ? (
                <span className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full border-2 border-white bg-(--success)" />
              ) : null} */}
            </div>
            <p className="text-[14px] font-semibold text-(--text-primary)">
              {service.staffName}
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Clock3 size={20} className="shrink-0 text-(--accent-primary)" />
            <div className="flex overflow-hidden rounded-sm border border-(--border) bg-(--bg-card)">
              <div className="flex min-w-[58px] flex-col items-center justify-center border-r border-(--border) bg-[color-mix(in_srgb,var(--accent-primary)_8%,white)] px-2 py-2">
                <p className="text-[14px] font-bold leading-tight text-(--accent-primary)">
                  {service.monthLabel} {service.dateLabel}
                </p>
                <p className="text-[14px] font-semibold text-(--brand-gold)">
                  {service.weekdayLabel}
                </p>
              </div>
              <div className="flex min-w-[110px] flex-col justify-center gap-0.5 px-3 py-2">
                <p className="text-[14px] font-bold leading-tight text-(--text-primary)">
                  <span className="font-medium text-(--brand-gold)">Start</span>{" "}
                  {service.timeLabel}
                </p>
                <p className="text-[14px] font-bold leading-tight text-(--text-primary)">
                  <span className="font-medium text-(--brand-gold) mr-1.5">End</span>{" "}
                  {getServiceEndTime(service)}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </article>
  );
}

function BookingSummaryPanel({ session }: { session: MyServiceSession }) {
  const { services, pricing } = session;

  return (
    <section
      className="
        flex h-full min-h-0 flex-col overflow-hidden rounded-2xl border border-(--border)
        bg-(--bg-card) shadow-[var(--shadow-card)]
      "
    >
      <div className="shrink-0 border-b border-(--border) px-6 py-4">
        <span className="inline-flex rounded-md bg-(--accent-primary) px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-white">
          Service
        </span>
        <div className="mt-3 flex items-center gap-2">
          <Sparkles size={16} className="text-(--accent-primary)" />
          <h2 className="text-[16px] font-semibold text-(--text-primary)">
            Selected Services
          </h2>
        </div>
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-(--accent-primary)/30 scrollbar-track-transparent">
        {services.map((service, index) => (
          <div
            key={service.id}
            className={index > 0 ? "border-t border-(--border)" : ""}
          >
            <ServiceRow service={service} />
          </div>
        ))}
      </div>

      <div className="mt-auto shrink-0 border-t border-(--border) p-5">
        <div className="flex items-start justify-between gap-6 rounded-xl border border-(--border) p-4">
          <div className="min-w-0 flex-1 space-y-2.5 text-[14px]">
            <div className="flex justify-between gap-4 text-(--text-secondary)">
              <span>
                Service Total ({pricing.serviceItemCount} items)
              </span>
              <span className="font-semibold text-(--text-primary)">
                ${money(pricing.serviceTotal)}
              </span>
            </div>
            <div className="flex justify-between gap-4 font-medium text-emerald-600">
              <span>Discount</span>
              <span>-${money(pricing.discount)}</span>
            </div>
            <div className="flex justify-between gap-4 text-(--text-secondary)">
              <span>Platform Fee</span>
              <span className="font-semibold text-(--text-primary)">
                ${money(pricing.platformFee)}
              </span>
            </div>
          </div>

          <div className="w-[168px] shrink-0 rounded-xl bg-[color-mix(in_srgb,var(--accent-primary)_10%,var(--bg-card))] px-4 py-4 text-right">
            <p className="text-[12px] font-medium text-(--text-muted)">Total Amount</p>
            <p className="mt-1 text-[28px] font-bold leading-none text-(--accent-primary)">
              ${money(pricing.total)}
            </p>
            <p className="mt-1.5 text-[11px] text-(--text-muted)">Includes tax</p>
          </div>
        </div>

        <div className="mt-4 flex items-center justify-center gap-2 rounded-xl bg-[color-mix(in_srgb,var(--accent-primary)_8%,var(--bg-card))] px-4 py-3.5">
          <Sparkles size={15} className="shrink-0 text-(--accent-primary)" />
          <p className="text-[13px] text-(--text-primary)">
            You will earn{" "}
            <span className="font-bold text-(--accent-primary)">
              {pricing.velvetPoints} VelvetPoints
            </span>{" "}
            on this booking
          </p>
          <CircleHelp size={14} className="shrink-0 text-(--text-muted)" />
        </div>
      </div>
    </section>
  );
}

function StoreOrderSidebar({
  session,
  onContinue,
}: {
  session: MyServiceSession;
  onContinue: () => void;
}) {
  const { store, orderSummary } = session;

  return (
    <aside className="flex h-full min-h-0 flex-col gap-4">
      <section className="shrink-0 overflow-hidden rounded-2xl border border-(--border) bg-(--bg-card) shadow-[var(--shadow-card)]">
        <div className="relative h-[160px] w-full">
          <Image
            src={store.banner}
            alt={store.name}
            fill
            sizes="400px"
            className="object-cover"
          />
          <div className="absolute inset-0 bg-linear-to-t from-black/40 to-transparent" />
          <div className="absolute right-3 top-3">
            <button
              type="button"
              className="primary-button inline-flex items-center gap-1 rounded-lg px-3 py-1.5 text-[11px] font-semibold text-white"
            >
              View Store
              <ChevronDown size={13} />
            </button>
          </div>
        </div>

        <div className="border-t-4 border-(--accent-primary) px-4 py-4">
          <div className="flex items-start gap-3">
            <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-xl border-2 border-(--border)">
              <Image
                src={store.thumbnail}
                alt={store.name}
                fill
                sizes="56px"
                className="object-cover"
              />
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-1">
                <h3 className="truncate font-[family-name:var(--font-heading)] text-[15px] font-bold text-(--text-primary)">
                  {store.name}
                </h3>
                {store.isVerified ? (
                  <BadgeCheck size={14} className="shrink-0 text-(--accent-primary)" />
                ) : null}
              </div>
              <p className="mt-0.5 text-[11px] font-medium text-(--text-muted)">
                {store.tagline}
              </p>
              <p className="mt-1 flex items-center gap-1 text-[11px] text-(--text-secondary)">
                <MapPin size={11} className="text-(--accent-primary)" />
                {store.address}
              </p>
            </div>
          </div>

          <div className="mt-3 flex flex-wrap gap-2">
            <span className="inline-flex items-center gap-1 rounded-full border border-(--border) bg-(--bg-secondary) px-2.5 py-1 text-[10px] font-semibold text-(--text-secondary)">
              <Lock size={11} className="text-(--accent-primary)" />
              Secure Packaging
            </span>
            <span className="inline-flex items-center gap-1 rounded-full border border-(--border) bg-(--bg-secondary) px-2.5 py-1 text-[10px] font-semibold text-(--text-secondary)">
              <Truck size={11} className="text-(--accent-primary)" />
              Fast Delivery
            </span>
          </div>
        </div>
      </section>

      <section
        className="
          flex min-h-0 flex-1 flex-col overflow-hidden rounded-2xl border border-(--border)
          bg-(--bg-card) p-5 shadow-[var(--shadow-card)]
        "
      >
        <h3 className="shrink-0 font-serif text-[20px] font-semibold text-(--text-primary)">
          Order Summary
        </h3>

        <div className="mt-4 shrink-0 space-y-2.5 text-[14px]">
          <div className="flex justify-between text-(--text-secondary)">
            <span>Subtotal ({orderSummary.itemCount} items)</span>
            <span className="font-medium text-(--text-primary)">
              ${money(orderSummary.subtotal)}
            </span>
          </div>
          <div className="flex justify-between font-medium text-emerald-600">
            <span>Discount</span>
            <span>-${money(orderSummary.discount)}</span>
          </div>
          <div className="flex justify-between text-(--text-secondary)">
            <span>Shipping Fee</span>
            <span className="font-medium text-(--text-primary)">
              ${money(orderSummary.shippingFee)}
            </span>
          </div>
        </div>

        <div className="mt-auto shrink-0 border-t border-(--border) pt-4">
          <div className="flex items-end justify-between">
            <div>
              <p className="text-[13px] font-semibold text-(--text-primary)">
                Total Amount
              </p>
              <p className="text-[11px] text-(--text-muted)">Includes tax</p>
            </div>
            <p className="text-[28px] font-bold leading-none text-(--accent-primary)">
              ${money(orderSummary.total)}
            </p>
          </div>

          {/* <button
            type="button"
            onClick={onContinue}
            className="
              primary-button mt-5 flex w-full items-center justify-center gap-2
              rounded-xl py-3.5 text-[14px] font-semibold text-white
              transition-opacity hover:opacity-90
            "
          >
            Continue to Payment
            <ArrowRight size={16} strokeWidth={2.5} />
          </button> */}

          <p className="mt-3 flex items-center justify-center gap-1.5 text-[12px] text-(--text-muted)">
            <ShieldCheck size={14} className="text-(--accent-primary)" />
            Secure & Encrypted Checkout
          </p>
        </div>
      </section>
    </aside>
  );
}

export function MyServicesPageContent() {
  const router = useRouter();
  const session = activeMyServiceSession;

  const paymentHref = buildBookingUrl({
    serviceIds: session.services.map((service) => service.id),
    organizationId: session.store.id,
    step: 4,
  });

  const handleContinue = () => {
    router.push(paymentHref);
  };

  return (
    <main className="min-h-screen bg-(--bg-primary)">
      {/* Desktop */}
      <div className="hidden lg:block">
        <div className="mx-auto flex h-[calc(100vh-2rem)] max-w-[1440px] flex-col px-6 py-6">
          <div className="mb-5 shrink-0">
            <h1 className="text-[32px] font-bold tracking-tight text-(--text-primary)">
              My Services
            </h1>
            <p className="mt-1.5 text-[15px] text-(--text-muted)">
              Review your selected services and continue to checkout when ready.
            </p>
          </div>

          <div className="grid min-h-0 flex-1 grid-cols-[minmax(0,1fr)_360px] items-stretch gap-6 xl:grid-cols-[minmax(0,1fr)_480px]">
            <BookingSummaryPanel session={session} />
            <StoreOrderSidebar session={session} onContinue={handleContinue} />
          </div>
        </div>
      </div>

      {/* Mobile fallback */}
      <div className="flex min-h-[70vh] flex-col items-center justify-center px-6 py-16 text-center lg:hidden">
        <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-[color-mix(in_srgb,var(--accent-primary)_10%,transparent)]">
          <Sparkles size={28} className="text-(--accent-primary)" />
        </div>
        <h2 className="text-[20px] font-bold text-(--text-primary)">My Services</h2>
        <p className="mt-2 max-w-sm text-[14px] leading-relaxed text-(--text-muted)">
          Open this page on desktop for the full service review and checkout
          experience.
        </p>
        <Link
          href="/booking"
          className="primary-button mt-6 inline-flex items-center gap-2 rounded-xl px-6 py-3 text-[14px] font-semibold text-white"
        >
          Continue Booking
          <ArrowRight size={16} />
        </Link>
      </div>
    </main>
  );
}
