"use client";

import Image from "next/image";
import { useState } from "react";
import {
  CalendarDays,
  CheckCircle2,
  Clock3,
  CreditCard,
  Lock,
  MapPin,
  Pencil,
  ShieldCheck,
  Tag,
  UserRound,
  Zap,
} from "lucide-react";
import {
  FaApplePay,
  FaCcMastercard,
  FaCcVisa,
  FaGooglePay,
  FaPaypal,
} from "react-icons/fa6";
import { FaCcAmex } from "react-icons/fa";
import { SiRazorpay } from "react-icons/si";

import {
  bookingLocation,
  calcServicesTotal,
  calcTotal,
  getService,
  getStaff,
} from "../../booking.data";

interface Step4PaymentConfirmationProps {
  serviceId: string;
  staffId: string;
  selectedDate: number;
  selectedTime: string;
  paymentMethod: string;
  promoCode: string;
  billingName: string;
  billingEmail: string;
  billingPhone: string;
  onPaymentMethodChange: (id: string) => void;
  onPromoCodeChange: (value: string) => void;
  onBillingChange: (
    field: "billingName" | "billingEmail" | "billingPhone",
    value: string,
  ) => void;
  onBack: () => void;
  onConfirm: () => void;
  onEditService?: () => void;
  onChangeStaff?: () => void;
  onChangeTime?: () => void;
}

const paymentOptions = [
  {
    id: "card",
    label: "Card Payment",
    sublabel: "Visa, MasterCard, Amex & more",
    icon: CreditCard,
  },
  {
    id: "apple",
    label: "Apple Pay",
    sublabel: "Fast & secure checkout",
    icon: FaApplePay,
  },
  {
    id: "google",
    label: "Google Pay",
    sublabel: "Pay with Google",
    icon: FaGooglePay,
  },
  {
    id: "paypal",
    label: "PayPal",
    sublabel: "Pay with PayPal",
    icon: FaPaypal,
  },
  {
    id: "razorpay",
    label: "Razorpay",
    sublabel: "Cards, UPI & wallets",
    icon: SiRazorpay,
  },
] as const;

function CardBrandIcons() {
  return (
    <div className="flex items-center gap-1.5">
      <FaCcVisa className="text-[18px] text-[#1a1f71]" />
      <FaCcMastercard className="text-[18px] text-[#eb001b]" />
      <FaCcAmex className="text-[18px] text-[#006fcf]" />
    </div>
  );
}

function MiniCardIllustration() {
  return (
    <div className="relative h-10 w-14 shrink-0">
      <div
        className="
          absolute right-0 top-0 h-9 w-12 rounded-md
          bg-linear-to-br from-[#6b3fa0] to-[#4a2560]
          shadow-md
        "
      />
      <div
        className="
          absolute left-0 top-1 h-9 w-12 rounded-md
          bg-linear-to-br from-[#8b5fbf] to-[#5c3578]
          shadow-md
        "
      />
    </div>
  );
}

export function Step4PaymentConfirmation({
  serviceId,
  staffId,
  selectedDate,
  selectedTime,
  paymentMethod,
  billingName,
  onPaymentMethodChange,
  onBillingChange,
  onBack,
  onEditService,
  onChangeStaff,
  onChangeTime,
}: Step4PaymentConfirmationProps) {
  const service = getService(serviceId);
  const staff = getStaff(staffId);
  const { subtotal, tax, total } = calcTotal(service.price);

  const [cardNumber, setCardNumber] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvv, setCvv] = useState("");

  const quickActions = [
    {
      icon: Pencil,
      title: "Edit Service",
      subtitle: "Change treatment",
      onClick: onEditService ?? onBack,
    },
    {
      icon: UserRound,
      title: "Change Staff",
      subtitle: "Choose another therapist",
      onClick: onChangeStaff ?? onBack,
    },
    {
      icon: CalendarDays,
      title: "Change Time",
      subtitle: "Reschedule appointment",
      onClick: onChangeTime ?? onBack,
    },
  ];

  return (
    <div className="space-y-3 pb-2">
      {/* Service Summary Header */}
      <section className="overflow-hidden rounded-2xl shadow-[0_8px_32px_rgba(61,28,77,0.18)]">
        <div className="relative min-h-[148px] bg-linear-to-r from-[#2d1540] via-[#3d1c4d] to-[#4a2560]">
          <div className="absolute inset-y-0 left-0 w-[42%] overflow-hidden">
            <Image
              src="/spa-header.png"
              alt=""
              fill
              className="object-cover object-left opacity-90"
              sizes="180px"
              priority
            />
            <div
              className="
                absolute inset-0 bg-linear-to-r
                from-transparent via-[#3d1c4d]/40 to-[#3d1c4d]
              "
            />
          </div>

          <div className="relative flex min-h-[148px] flex-col justify-between p-3 pl-[38%]">
            <div>
              <div className="flex items-start justify-between gap-2">
                <h2 className="text-base font-semibold leading-tight text-white">
                  {service.name}
                </h2>
                <button
                  type="button"
                  onClick={onEditService ?? onBack}
                  className="
                    flex shrink-0 items-center gap-1 rounded-full border
                    border-white/35 px-2 py-0.5 text-[7px] font-medium
                    text-white transition-colors hover:bg-white/10
                  "
                >
                  <Pencil size={8} strokeWidth={2} />
                  Edit Service
                </button>
              </div>

              <ul className="mt-2 space-y-1">
                {[
                  { icon: UserRound, text: `Therapist: ${staff.name}` },
                  { icon: CalendarDays, text: `May ${selectedDate}, 2025` },
                  {
                    icon: Clock3,
                    text: `${selectedTime} • ${service.duration}`,
                  },
                  { icon: MapPin, text: bookingLocation.name },
                ].map(({ icon: Icon, text }) => (
                  <li
                    key={text}
                    className="flex items-center gap-1.5 text-[8px] text-white/90"
                  >
                    <Icon size={10} strokeWidth={2} className="shrink-0" />
                    <span>{text}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-3 divide-x divide-white/15 bg-[#2a1238]/95">
          {quickActions.map(({ icon: Icon, title, subtitle, onClick }) => (
            <button
              key={title}
              type="button"
              onClick={onClick}
              className="
                flex flex-col items-center gap-0.5 px-1 py-2.5
                text-center transition-colors hover:bg-white/5
              "
            >
              <Icon size={14} strokeWidth={1.8} className="text-white/90" />
              <span className="text-[8px] font-semibold text-white">
                {title}
              </span>
              <span className="text-[6px] leading-tight text-white/55">
                {subtitle}
              </span>
            </button>
          ))}
        </div>
      </section>

      {/* Pricing + Security */}
      <div className="grid grid-cols-2 gap-2">
        <section className="feature-card rounded-xl p-2.5">
          <div className="mb-2 flex items-center gap-1.5">
            <Tag size={12} className="text-(--accent-primary)" strokeWidth={2} />
            <h3 className="text-[9px] font-semibold text-(--text-primary)">
              Pricing Summary
            </h3>
          </div>

          <div className="space-y-1 text-[8px]">
            <div className="flex justify-between text-(--text-secondary)">
              <span>Service Cost</span>
              <span>${subtotal}</span>
            </div>
            <div className="flex justify-between text-(--text-secondary)">
              <span>Taxes & Fees</span>
              <span>${tax}</span>
            </div>
            <div className="flex justify-between text-(--text-secondary)">
              <span>Additional Charges</span>
              <span>$0</span>
            </div>
          </div>

          <div
            className="
              mt-2 flex items-center justify-between border-t
              border-(--border) pt-2
            "
          >
            <span className="text-[9px] font-semibold text-(--text-primary)">
              Total Amount
            </span>
            <span className="text-lg font-bold text-(--accent-primary)">
              ${total}
            </span>
          </div>
        </section>

        <section
          className="
            feature-card flex flex-col items-center justify-center
            rounded-xl p-2.5 text-center
          "
        >
          <div
            className="
              mb-1.5 flex h-10 w-10 items-center justify-center rounded-full
              bg-[color-mix(in_srgb,var(--accent-primary)_12%,transparent)]
            "
          >
            <ShieldCheck
              size={20}
              className="text-(--accent-primary)"
              strokeWidth={1.8}
            />
          </div>
          <p className="text-[8px] font-semibold text-(--text-primary)">
            Secure & Trusted
          </p>
          <p className="mt-0.5 text-[6px] leading-snug text-(--text-muted)">
            Your payment is protected with 256-bit encryption
          </p>
          <div className="mt-1.5 flex items-center gap-1.5">
            {["PCI DSS", "SSL", "VISA"].map((badge) => (
              <span
                key={badge}
                className="
                  rounded border border-(--border) px-1 py-0.5
                  text-[5px] font-bold tracking-wide text-(--text-muted)
                "
              >
                {badge}
              </span>
            ))}
          </div>
        </section>
      </div>

      {/* Payment Method Selection */}
      <section>
        <div className="mb-2 flex items-center gap-1.5">
          <CreditCard
            size={12}
            className="text-(--accent-primary)"
            strokeWidth={2}
          />
          <h3 className="text-[9px] font-semibold text-(--text-primary)">
            Choose Payment Method
          </h3>
        </div>

        <div className="scrollbar-none flex gap-2 overflow-x-auto pb-1">
          {paymentOptions.map((option) => {
            const active = paymentMethod === option.id;
            const Icon = "icon" in option ? option.icon : null;

            return (
              <button
                key={option.id}
                type="button"
                onClick={() => onPaymentMethodChange(option.id)}
                className={`
                  feature-card flex min-w-[108px] shrink-0 flex-col rounded-xl
                  p-2 text-left transition-all duration-200
                  ${
                    active
                      ? "border-(--accent-primary) shadow-(--shadow-glow)"
                      : "hover:border-[color-mix(in_srgb,var(--accent-primary)_30%,var(--border))]"
                  }
                `}
              >
                <div className="mb-1.5 flex items-start justify-between gap-1">
                  <span
                    className={`
                      flex h-3 w-3 shrink-0 items-center justify-center
                      rounded-full border-2
                      ${
                        active
                          ? "border-(--accent-primary) bg-(--accent-primary)"
                          : "border-(--text-muted)"
                      }
                    `}
                  >
                    {active && (
                      <span className="h-1 w-1 rounded-full bg-white" />
                    )}
                  </span>
                  {Icon && <Icon className="text-xl text-(--text-primary)" />}
                </div>

                <span className="text-[8px] font-semibold text-(--text-primary)">
                  {option.label}
                </span>
                <span className="mt-0.5 text-[6px] leading-tight text-(--text-muted)">
                  {option.sublabel}
                </span>
              </button>
            );
          })}
        </div>
      </section>

      {/* Card Details Form */}
      {paymentMethod === "card" && (
        <section className="feature-card rounded-xl p-3">
          <div className="mb-2.5 flex items-center gap-1.5">
            <CreditCard
              size={12}
              className="text-(--accent-primary)"
              strokeWidth={2}
            />
            <h3 className="text-[9px] font-semibold text-(--text-primary)">
              Enter Card Details
            </h3>
          </div>

          <div className="space-y-2">
            <div className="relative">
              <input
                type="text"
                value={cardNumber}
                onChange={(e) => setCardNumber(e.target.value)}
                placeholder="Card Number"
                maxLength={19}
                className="
                  search-glass w-full rounded-lg border py-2 pl-3 pr-24
                  text-[9px] text-(--text-primary) placeholder:text-(--text-muted)
                  focus:outline-none focus:ring-1 focus:ring-(--accent-primary)/30
                "
              />
              <div className="absolute right-4 top-1/2 -translate-y-1/2">
                <CardBrandIcons />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div className="relative">
                <CalendarDays
                  size={11}
                  className="
                    absolute left-2.5 top-1/2 -translate-y-1/2
                    text-(--text-muted)
                  "
                  strokeWidth={2}
                />
                <input
                  type="text"
                  value={expiry}
                  onChange={(e) => setExpiry(e.target.value)}
                  placeholder="MM / YY"
                  maxLength={7}
                  className="
                    search-glass w-full rounded-lg border py-2 pl-8 pr-2
                    text-[9px] text-(--text-primary) placeholder:text-(--text-muted)
                    focus:outline-none focus:ring-1 focus:ring-(--accent-primary)/30
                  "
                />
              </div>

              <div className="relative">
                <Lock
                  size={11}
                  className="
                    absolute left-2.5 top-1/2 -translate-y-1/2
                    text-(--text-muted)
                  "
                  strokeWidth={2}
                />
                <input
                  type="password"
                  value={cvv}
                  onChange={(e) => setCvv(e.target.value)}
                  placeholder="CVV"
                  maxLength={4}
                  className="
                    search-glass w-full rounded-lg border py-2 pl-8 pr-2
                    text-[9px] text-(--text-primary) placeholder:text-(--text-muted)
                    focus:outline-none focus:ring-1 focus:ring-(--accent-primary)/30
                  "
                />
              </div>
            </div>

            <div className="relative">
              <UserRound
                size={11}
                className="
                  absolute left-2.5 top-1/2 -translate-y-1/2
                  text-(--text-muted)
                "
                strokeWidth={2}
              />
              <input
                type="text"
                value={billingName}
                onChange={(e) => onBillingChange("billingName", e.target.value)}
                placeholder="Cardholder Name"
                className="
                  search-glass w-full rounded-lg border py-2 pl-8 pr-2
                  text-[9px] text-(--text-primary) placeholder:text-(--text-muted)
                  focus:outline-none focus:ring-1 focus:ring-(--accent-primary)/30
                "
              />
            </div>
          </div>
        </section>
      )}

      {/* Cancellation + Instant Confirmation */}
      <section
        className="
          flex items-center justify-between gap-2 rounded-xl
          bg-[color-mix(in_srgb,var(--accent-primary)_8%,var(--bg-card))]
          px-3 py-2
        "
      >
        <div className="flex items-center gap-1.5">
          <CheckCircle2
            size={12}
            className="shrink-0 text-(--success)"
            strokeWidth={2}
          />
          <p className="text-[7px] leading-snug text-(--text-secondary)">
            Free cancellation up to 24 hours before appointment
          </p>
        </div>

        <div
          className="
            flex shrink-0 items-center gap-1 rounded-full
            bg-(--accent-primary) px-2 py-1
          "
        >
          <Zap size={9} className="text-white" fill="white" strokeWidth={0} />
          <span className="text-[6px] font-semibold text-white">
            Instant Confirmation
          </span>
        </div>
      </section>
    </div>
  );
}

export function getStep4Total(serviceIds: string[]) {
  return calcServicesTotal(serviceIds).total;
}
