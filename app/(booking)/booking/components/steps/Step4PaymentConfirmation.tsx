"use client";

import { useState } from "react";
import Image from "next/image";
import {
  BadgeCheck,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  CircleHelp,
  ClipboardCheck,
  Clock3,
  CreditCard,
  Info,
  Lock,
  MapPin,
  Minus,
  Pencil,
  Plus,
  ShieldCheck,
  Sparkles,
  Star,
  Store,
  Tag,
  UserRound,
  X,
  Zap,
  Truck,
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
  calcProductsTotal,
  calcServicesTotal,
  formatServiceSchedule,
  getBookingDay,
  getSelectedProducts,
  getSelectedServices,
  getStaff,
  isServiceScheduleComplete,
  TAX_RATE,
} from "../../booking.data";
import type {
  ServiceSchedules,
  ServiceStaffAssignments,
} from "../../booking.types";
import type { BookingService } from "@/types/booking";
import {
  type BookingOrganizationBannerInfo,
} from "../BookingOrganizationBanner";
import { BookingSelectedServicesPanel } from "../BookingSelectedServicesPanel";
import type { ProductDeliveryAddress } from "./ProductAddressFields";
import type { BookingProduct } from "@/data/booking/booking";

interface Step4PaymentConfirmationProps {
  selectedServiceIds: string[];
  selectedProductIds?: string[];
  productQuantities?: Record<string, number>;
  productDeliveryAddress?: ProductDeliveryAddress;
  organizationBanner?: BookingOrganizationBannerInfo;
  organizationId?: string;
  staffId: string;
  serviceStaff: ServiceStaffAssignments;
  serviceSchedules: ServiceSchedules;
  packageName?: string;
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
  onRemoveService?: (id: string) => void;
  onRemoveProduct?: (id: string) => void;
}

const paymentOptions = [
  {
    id: "visa",
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

const AU_STATES = ["VIC", "NSW", "QLD", "SA", "WA", "TAS", "ACT", "NT"];
const PLATFORM_FEE = 4.95;
const SERVICE_DISCOUNT_RATE = 0.1;

const desktopPaymentBrands = [
  {
    id: "visa",
    label: "Visa",
    form: "card" as const,
    icon: FaCcVisa,
    iconClass: "text-[#1a1f71]",
  },
  {
    id: "mastercard",
    label: "Mastercard",
    form: "card" as const,
    icon: FaCcMastercard,
    iconClass: "text-[#eb001b]",
  },
  {
    id: "amex",
    label: "Amex",
    form: "card" as const,
    icon: FaCcAmex,
    iconClass: "text-[#006fcf]",
  },
  {
    id: "apple",
    label: "Apple Pay",
    form: "apple" as const,
    icon: FaApplePay,
    iconClass: "text-(--text-primary)",
  },
  {
    id: "google",
    label: "Google Pay",
    form: "google" as const,
    icon: FaGooglePay,
    iconClass: "text-(--text-primary)",
  },
] as const;

type DesktopPaymentBrandId = (typeof desktopPaymentBrands)[number]["id"];

function money(amount: number) {
  return amount.toFixed(2);
}

function hasDeliverableAddress(address?: ProductDeliveryAddress) {
  if (!address || address.deliveryType !== "deliver") return false;
  return Boolean(
    address.addressLine1.trim() &&
      address.suburb.trim() &&
      address.postcode.trim(),
  );
}

function ProductMobileOrderSummary({
  products,
  productQuantities,
  promoCode,
  onPromoCodeChange,
  productDeliveryAddress,
  subtotal,
  taxAmount,
  discountPercent,
  grandTotal,
}: {
  products: BookingProduct[];
  productQuantities: Record<string, number>;
  promoCode: string;
  onPromoCodeChange: (value: string) => void;
  productDeliveryAddress?: ProductDeliveryAddress;
  subtotal: number;
  taxAmount: number;
  discountPercent: number;
  grandTotal: number;
}) {
  const [expanded, setExpanded] = useState(true);
  const [discountInput, setDiscountInput] = useState(promoCode);

  const itemCount = products.reduce(
    (sum, product) => sum + Math.max(1, productQuantities[product.id] ?? 1),
    0,
  );

  const isPickup = productDeliveryAddress?.deliveryType === "pickup";
  const hasAddress = hasDeliverableAddress(productDeliveryAddress);
  const shipping =
    isPickup ? 0 : hasAddress ? 8 : null;
  const orderTotal = grandTotal + (shipping ?? 0);
  const discountAmount = Number(
    (((subtotal + taxAmount) * discountPercent) / 100).toFixed(2),
  );

  return (
    <section className="overflow-hidden rounded-xl border border-(--border) bg-(--bg-card) shadow-[var(--shadow-card)]">
      <button
        type="button"
        onClick={() => setExpanded((open) => !open)}
        aria-expanded={expanded}
        className="
          flex w-full items-center justify-between gap-3
          bg-[color-mix(in_srgb,var(--brand-gold)_14%,var(--bg-card))]
          px-4 py-3.5 text-left
        "
      >
        <span className="flex items-center gap-2">
          <span className="text-[14px] font-semibold text-(--brand-gold)">
            Order summary
          </span>
          {expanded ? (
            <ChevronUp size={16} className="text-(--brand-gold)" strokeWidth={2} />
          ) : (
            <ChevronDown size={16} className="text-(--brand-gold)" strokeWidth={2} />
          )}
        </span>
        <span className="text-[16px] font-bold text-(--text-primary)">
          ${money(orderTotal)}
        </span>
      </button>

      {expanded ? (
        <div className="px-4 pb-4 pt-3">
          <ul className="space-y-4">
            {products.map((product) => {
              const qty = Math.max(1, productQuantities[product.id] ?? 1);

              return (
                <li key={product.id} className="flex items-start gap-3">
                  <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-xl bg-(--bg-secondary)">
                    <Image
                      src={product.image}
                      alt={product.name}
                      fill
                      sizes="64px"
                      className="object-cover"
                    />
                    <span
                      className="
                        absolute -right-1 -top-1 flex h-5 min-w-5 items-center
                        justify-center rounded-full bg-(--text-primary) px-1
                        text-[10px] font-bold text-white
                      "
                    >
                      {qty}
                    </span>
                  </div>

                  <div className="min-w-0 flex-1 pt-0.5">
                    <p className="text-[14px] font-medium leading-snug text-(--text-primary)">
                      {product.name}
                      {product.quantity ? (
                        <span className="text-(--text-secondary)">
                          {" "}
                          | {product.quantity}
                        </span>
                      ) : null}
                    </p>
                  </div>

                  <p className="shrink-0 pt-0.5 text-[14px] font-medium text-(--text-primary)">
                    ${money(product.price * qty)}
                  </p>
                </li>
              );
            })}
          </ul>

          <div className="mt-4 flex gap-2">
            <input
              type="text"
              value={discountInput}
              onChange={(event) => setDiscountInput(event.target.value)}
              placeholder="Discount code"
              className="
                min-w-0 flex-1 rounded-xl border border-(--border) bg-(--bg-card)
                px-3.5 py-2.5 text-[13px] text-(--text-primary)
                placeholder:text-(--text-muted)
                focus:border-(--accent-primary) focus:outline-none focus:ring-1
                focus:ring-(--accent-primary)/25
              "
            />
            <button
              type="button"
              onClick={() => onPromoCodeChange(discountInput.trim())}
              className="
                shrink-0 rounded-xl border border-(--border) bg-[color-mix(in_srgb,var(--bg-secondary)_80%,var(--bg-card))]
                px-4 py-2.5 text-[13px] font-semibold text-(--text-secondary)
                transition-colors hover:border-(--accent-primary)/30 hover:text-(--text-primary)
              "
            >
              Apply
            </button>
          </div>

          <div className="mt-4 space-y-2.5 border-t border-(--border) pt-4 text-[13px]">
            <div className="flex items-center justify-between text-(--text-secondary)">
              <span>
                Subtotal · {itemCount} item{itemCount === 1 ? "" : "s"}
              </span>
              <span className="font-medium text-(--text-primary)">
                ${money(subtotal)}
              </span>
            </div>

            {discountAmount > 0 ? (
              <div className="flex items-center justify-between text-emerald-600">
                <span>Discount ({discountPercent}%)</span>
                <span className="font-medium">-${money(discountAmount)}</span>
              </div>
            ) : null}

            <div className="flex items-center justify-between gap-3 text-(--text-secondary)">
              <span className="flex items-center gap-1.5">
                Shipping
                <Info size={14} className="text-(--text-muted)" strokeWidth={2} />
              </span>
              {shipping === null ? (
                <span className="text-right text-[12px] text-(--text-muted)">
                  Enter shipping address
                </span>
              ) : (
                <span className="font-medium text-(--text-primary)">
                  {shipping === 0 ? "Free" : `$${money(shipping)}`}
                </span>
              )}
            </div>
          </div>

          <div className="mt-4 flex items-end justify-between border-t border-(--border) pt-4">
            <span className="text-[15px] font-bold text-(--text-primary)">
              Total
            </span>
            <div className="flex items-baseline gap-1.5">
              <span className="text-[11px] font-medium uppercase tracking-wide text-(--text-muted)">
                AUD
              </span>
              <span className="text-[22px] font-bold leading-none text-(--text-primary)">
                ${money(orderTotal)}
              </span>
            </div>
          </div>
        </div>
      ) : null}
    </section>
  );
}

function formatDeliveryAddress(address: ProductDeliveryAddress) {
  const lines = [
    address.addressLine1.trim(),
    address.addressLine2.trim(),
    [address.suburb.trim(), address.postcode.trim()].filter(Boolean).join(" "),
  ].filter(Boolean);

  return lines;
}

function ProductMobileDeliveryPreview({
  address,
  storeName,
  storeAddress,
  onChangeDelivery,
}: {
  address?: ProductDeliveryAddress;
  storeName: string;
  storeAddress: string;
  onChangeDelivery?: () => void;
}) {
  const isPickup = address?.deliveryType === "pickup";
  const isDeliver = address?.deliveryType === "deliver";

  return (
    <section className="overflow-hidden rounded-xl border border-(--border) bg-(--bg-card) shadow-[var(--shadow-card)]">
      <div className="flex items-center justify-between gap-3 border-b border-(--border) px-4 py-3">
        <h3 className="text-[14px] font-semibold text-(--text-primary)">
          Mode of Delivery
        </h3>
        {onChangeDelivery ? (
          <button
            type="button"
            onClick={onChangeDelivery}
            className="text-[12px] font-semibold text-(--accent-primary) transition-opacity hover:opacity-80"
          >
            Change
          </button>
        ) : null}
      </div>

      <div className="p-4">
        {!address ? (
          <p className="text-[13px] text-(--text-muted)">
            No delivery option selected yet.
          </p>
        ) : (
          <div
            className={`
              rounded-xl border px-3.5 py-3
              ${
                isDeliver
                  ? "border-(--accent-primary) bg-[color-mix(in_srgb,var(--accent-primary)_8%,white)]"
                  : "border-(--border) bg-(--bg-secondary)"
              }
            `}
          >
            <div className="flex items-start gap-3">
              <span
                className={`
                  flex h-9 w-9 shrink-0 items-center justify-center rounded-lg
                  ${
                    isDeliver
                      ? "bg-(--accent-primary)/10"
                      : "bg-[color-mix(in_srgb,var(--accent-primary)_10%,white)]"
                  }
                `}
              >
                {isDeliver ? (
                  <Truck size={17} className="text-(--accent-primary)" />
                ) : (
                  <Store size={17} className="text-(--accent-primary)" />
                )}
              </span>

              <div className="min-w-0 flex-1">
                <p className="text-[13px] font-bold text-(--text-primary)">
                  {isDeliver ? "Deliver to me" : "Pick up from store"}
                </p>
                <p className="mt-0.5 text-[11px] leading-snug text-(--text-muted)">
                  {isDeliver
                    ? "We will deliver your order to your address."
                    : "Pick up your order from the store."}
                </p>
              </div>

              <span
                className={`
                  mt-0.5 h-4 w-4 shrink-0 rounded-full border-2
                  border-(--accent-primary) bg-(--accent-primary)
                  shadow-[inset_0_0_0_3px_white]
                `}
                aria-hidden
              />
            </div>
          </div>
        )}

        {isDeliver && address ? (
          <div className="mt-3.5 space-y-2.5 rounded-xl border border-(--border) bg-(--bg-card) p-3.5">
            <div className="flex items-center gap-2">
              <MapPin size={14} className="text-(--accent-primary)" />
              <p className="text-[12px] font-bold text-(--text-primary)">
                Delivery Address
              </p>
            </div>

            <div className="space-y-1 text-[12px] leading-relaxed text-(--text-secondary)">
              <p className="font-semibold text-(--text-primary)">
                {address.fullName}
              </p>
              <p>
                {address.countryCode} {address.mobile}
              </p>
              {formatDeliveryAddress(address).map((line) => (
                <p key={line}>{line}</p>
              ))}
            </div>

            <div className="flex items-center gap-2 rounded-lg bg-[color-mix(in_srgb,var(--accent-primary)_10%,white)] px-3 py-2">
              <Truck size={14} className="shrink-0 text-(--accent-primary)" />
              <p className="text-[11px] font-medium text-(--text-primary)">
                Estimated delivery within 1–3 business days
              </p>
            </div>
          </div>
        ) : null}

        {isPickup && address ? (
          <div className="mt-3.5 rounded-xl border border-(--border) bg-(--bg-card) p-3.5">
            <div className="flex items-start gap-3">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-(--accent-primary)/10">
                <Store size={18} className="text-(--accent-primary)" />
              </span>
              <div className="min-w-0">
                <p className="text-[13px] font-bold text-(--text-primary)">
                  {storeName}
                </p>
                <p className="mt-1 flex items-start gap-1 text-[12px] text-(--text-secondary)">
                  <MapPin
                    size={13}
                    className="mt-0.5 shrink-0 text-(--accent-primary)"
                  />
                  <span>{storeAddress}</span>
                </p>
                <p className="mt-2 text-[11px] text-(--text-muted)">
                  Collect your order from the store during opening hours.
                </p>
              </div>
            </div>
          </div>
        ) : null}
      </div>
    </section>
  );
}

function CardBrandIcons() {
  return (
    <div className="flex items-center gap-1.5">
      <FaCcVisa className="text-[18px] text-[#1a1f71]" />
      <FaCcMastercard className="text-[18px] text-[#eb001b]" />
      <FaCcAmex className="text-[18px] text-[#006fcf]" />
    </div>
  );
}

const fieldClass = `
  w-full rounded-lg border border-(--border) bg-(--bg-card)
  px-3.5 py-3 text-[13px] text-(--text-primary)
  placeholder:text-(--text-muted)
  focus:border-(--accent-primary) focus:outline-none focus:ring-1
  focus:ring-(--accent-primary)/25
`;

const labelClass = "mb-1.5 block text-[12px] font-medium text-(--text-secondary)";

function ServiceAppointmentBlock({
  dayId,
  time,
}: {
  dayId: string;
  time: string;
}) {
  const day = getBookingDay(dayId);
  const [monthName, dayNumber = ""] = day.date.split(" ");
  const monthAbbr = monthName.slice(0, 3).toUpperCase();
  const year = new Date().getFullYear();

  return (
    <div className="flex shrink-0 items-center gap-2">
      <Clock3 size={14} className="shrink-0 text-(--accent-primary)" />
      <div className="flex items-stretch overflow-hidden rounded-sm border border-(--border) bg-(--bg-card)">
        <div className="flex min-w-[52px] flex-col items-center justify-center border-r border-(--border) bg-[color-mix(in_srgb,var(--accent-primary)_8%,white)] px-2 py-1.5">
          <p className="text-[9px] font-bold leading-tight text-(--accent-primary)">
            {monthAbbr} {dayNumber}
          </p>
          <p className="text-[9px] font-semibold text-(--text-secondary)">
            {day.weekday}
          </p>
        </div>
        <div className="flex min-w-[78px] flex-col justify-center px-2.5 py-1.5">
          <p className="text-[12px] font-bold leading-none text-(--text-primary)">
            {time}
          </p>
          <p className="mt-0.5 text-[9px] text-(--text-muted)">
            {monthName} {year}
          </p>
        </div>
      </div>
    </div>
  );
}

function ServiceDesktopBookingSummary({
  selectedServices,
  serviceStaff,
  serviceSchedules,
  staffId,
  org,
  isPackageFlow,
  onEditService,
}: {
  selectedServices: BookingService[];
  serviceStaff: ServiceStaffAssignments;
  serviceSchedules: ServiceSchedules;
  staffId: string;
  org: BookingOrganizationBannerInfo;
  isPackageFlow: boolean;
  onEditService?: () => void;
}) {
  const serviceItemsTotal = selectedServices.reduce(
    (sum, service) => sum + service.price,
    0,
  );
  const serviceDiscount = Number(
    (serviceItemsTotal * SERVICE_DISCOUNT_RATE).toFixed(2),
  );
  const serviceGrandTotal = Number(
    (serviceItemsTotal - serviceDiscount + PLATFORM_FEE).toFixed(2),
  );
  const velvetPoints = Math.max(
    10,
    Math.round(serviceGrandTotal / 10),
  );

  return (
    <section className="rounded-2xl border border-(--border) bg-(--bg-card) p-6 shadow-[var(--shadow-card)]">
      <div className="mb-5 flex items-start justify-between gap-3">
        <div className="flex items-start gap-3">
          <span className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-(--accent-primary)/10">
            <ClipboardCheck
              size={20}
              className="text-(--accent-primary)"
              strokeWidth={2}
            />
          </span>
          <div>
            <h2 className="text-[22px] font-semibold text-(--text-primary)">
              Your Booking Summary
            </h2>
            <p className="mt-0.5 text-[13px] text-(--text-muted)">
              Review your selection
            </p>
          </div>
        </div>
        {onEditService ? (
          <button
            type="button"
            onClick={onEditService}
            className="
              primary-button inline-flex shrink-0 items-center gap-1.5 rounded-lg
              px-4 py-2 text-[11px] font-bold tracking-wide text-white
            "
          >
            <Pencil size={12} />
            EDIT
          </button>
        ) : null}
      </div>

      <div className="mb-3 flex items-center gap-2">
        <Sparkles size={15} className="text-(--accent-primary)" />
        <p className="text-[13px] font-semibold text-(--text-primary)">
          Selected Services
        </p>
      </div>

      <div className="overflow-hidden rounded-xl border border-(--border)">
        {selectedServices.map((service, index) => {
          const assignedStaffId = serviceStaff[service.id];
          const assigned = assignedStaffId
            ? getStaff(assignedStaffId)
            : getStaff(staffId);
          const schedule = serviceSchedules[service.id];
          const scheduled = isServiceScheduleComplete(schedule);

          return (
            <article
              key={service.id}
              className={`bg-(--bg-card) px-3 py-3.5 ${
                index > 0 ? "border-t border-(--border)" : ""
              }`}
            >
              <div className="flex items-center gap-3">
                <div className="relative h-[60px] w-[76px] shrink-0 overflow-hidden rounded-sm bg-(--bg-secondary)">
                  <Image
                    src={service.image}
                    alt={service.name}
                    fill
                    sizes="76px"
                    className="object-cover"
                  />
                </div>

                <div className="min-w-0 w-[130px] shrink-0">
                  <p className="truncate text-[13px] font-bold text-(--text-primary)">
                    {service.name}
                  </p>
                  <p className="mt-0.5 text-[11px] leading-snug text-(--text-muted)">
                    {service.duration}
                    {service.duration ? " • " : ""}
                    Relaxing &amp; Safe
                  </p>
                  <p className="mt-1 text-[13px] font-bold text-(--text-primary)">
                    ${money(service.price)}
                  </p>
                </div>

                <div className="inline-flex h-8 shrink-0 items-center rounded-lg border border-(--border) bg-(--bg-card) px-1">
                  <span className="flex h-6 w-6 items-center justify-center text-(--text-muted)">
                    <Minus size={12} />
                  </span>
                  <span className="min-w-5 text-center text-[12px] font-semibold text-(--text-primary)">
                    1
                  </span>
                  <span className="flex h-6 w-6 items-center justify-center text-(--text-muted)">
                    <Plus size={12} />
                  </span>
                </div>

                <div className="flex min-w-0 flex-1 items-center justify-end gap-3">
                  <div className="flex flex-col min-w-0 items-center gap-2">
                    <div className="relative h-9 w-9 shrink-0 overflow-hidden rounded-sm">
                      {isPackageFlow ? (
                        <div className="flex h-full w-full items-center justify-center bg-(--bg-secondary)">
                          <UserRound
                            size={16}
                            className="text-(--text-muted)"
                          />
                        </div>
                      ) : (
                        <Image
                          src={assigned.image}
                          alt={assigned.name}
                          fill
                          sizes="36px"
                          className="object-cover"
                        />
                      )}
                      <span className="absolute right-0 bottom-0 h-2.5 w-2.5 rounded-full border border-white bg-(--success)" />
                    </div>
                    <p className="truncate text-[12px] font-semibold text-(--text-primary)">
                      {isPackageFlow ? "Auto" : assigned.name}
                    </p>
                  </div>

                  {scheduled && schedule ? (
                    <ServiceAppointmentBlock
                      dayId={schedule.dayId}
                      time={schedule.time}
                    />
                  ) : null}
                </div>
              </div>
            </article>
          );
        })}
      </div>

      <div className="mt-4 flex items-center gap-3 rounded-xl border border-(--border) bg-[color-mix(in_srgb,var(--accent-primary)_6%,white)] p-3.5">
        <div className="relative h-14 w-[72px] shrink-0 overflow-hidden rounded-lg">
          <Image
            src={org.thumbnail ?? org.banner}
            alt={org.name}
            fill
            sizes="72px"
            className="object-cover"
          />
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-1">
            <p className="truncate text-[14px] font-bold text-(--text-primary)">
              {org.name}
            </p>
            <BadgeCheck
              size={14}
              className="shrink-0 text-(--accent-primary)"
              strokeWidth={2}
            />
          </div>
          <p className="mt-0.5 flex items-center gap-1 truncate text-[11px] text-(--text-secondary)">
            <MapPin size={11} className="shrink-0 text-(--accent-primary)" />
            <span>{org.address ?? bookingLocation.address}</span>
          </p>
        </div>
        <div className="shrink-0 border-l border-(--border) pl-4 text-right">
          <p className="text-[10px] font-medium text-(--text-muted)">
            Booking Type
          </p>
          <p className="mt-0.5 text-[13px] font-bold text-(--accent-primary)">
            Visit Salon
          </p>
        </div>
      </div>

      <div className="mt-4 rounded-xl border border-(--border) p-4">
        <div className="flex items-start justify-between gap-5">
          <div className="min-w-0 flex-1 space-y-2.5 text-[13px]">
            <div className="flex items-center justify-between gap-4 text-(--text-secondary)">
              <span>
                Service Total ({selectedServices.length} item
                {selectedServices.length === 1 ? "" : "s"})
              </span>
              <span className="font-semibold text-(--text-primary)">
                ${money(serviceItemsTotal)}
              </span>
            </div>
            <div className="flex items-center justify-between gap-4 font-medium text-emerald-600">
              <span>Discount</span>
              <span>-${money(serviceDiscount)}</span>
            </div>
            <div className="flex items-center justify-between gap-4 text-(--text-secondary)">
              <span>Platform Fee</span>
              <span className="font-semibold text-(--text-primary)">
                ${money(PLATFORM_FEE)}
              </span>
            </div>
          </div>

          <div className="w-[156px] shrink-0 rounded-xl bg-[color-mix(in_srgb,var(--accent-primary)_10%,white)] px-4 py-3.5 text-right">
            <p className="text-[11px] font-medium text-(--text-muted)">
              Total Amount
            </p>
            <p className="mt-1 text-[26px] font-bold leading-none text-(--accent-primary)">
              ${money(serviceGrandTotal)}
            </p>
            <p className="mt-1.5 text-[10px] text-(--text-muted)">Includes GST</p>
          </div>
        </div>
      </div>

      <div className="mt-4 flex items-center justify-center gap-2 rounded-xl bg-[color-mix(in_srgb,var(--accent-primary)_10%,white)] px-4 py-3">
        <ShieldCheck size={14} className="shrink-0 text-(--accent-primary)" />
        <p className="text-[12px] text-(--text-primary)">
          You will earn{" "}
          <span className="font-bold text-(--accent-primary)">
            {velvetPoints} VelvetPoints
          </span>{" "}
          on this booking
        </p>
        <CircleHelp size={13} className="shrink-0 text-(--text-muted)" />
      </div>
    </section>
  );
}

export function Step4PaymentConfirmation({
  selectedServiceIds,
  selectedProductIds = [],
  productQuantities = {},
  productDeliveryAddress,
  organizationBanner,
  organizationId,
  staffId,
  serviceStaff,
  serviceSchedules,
  packageName,
  paymentMethod,
  promoCode,
  billingName,
  onPaymentMethodChange,
  onPromoCodeChange,
  onBillingChange,
  onBack,
  onConfirm,
  onEditService,
  onRemoveService,
  onRemoveProduct,
}: Step4PaymentConfirmationProps) {
  const selectedServices = getSelectedServices(
    selectedServiceIds,
    organizationId,
  );
  const selectedProducts = getSelectedProducts(selectedProductIds);
  const isProductOnly =
    selectedProductIds.length > 0 && selectedServiceIds.length === 0;

  const serviceTotals = calcServicesTotal(selectedServiceIds, organizationId);
  const productTotals = calcProductsTotal(
    selectedProductIds,
    productQuantities,
  );
  const mobileSubtotal = serviceTotals.subtotal + productTotals.subtotal;
  const mobileTax = Math.round(mobileSubtotal * TAX_RATE);
  const mobileTotal = mobileSubtotal + mobileTax;

  const isPackageFlow = Boolean(packageName);

  const [cardNumber, setCardNumber] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvv, setCvv] = useState("");
  const [country, setCountry] = useState("Australia");
  const [address1, setAddress1] = useState("");
  const [address2, setAddress2] = useState("");
  const [suburb, setSuburb] = useState("");
  const [state, setState] = useState("VIC");
  const [postcode, setPostcode] = useState("");
  const [saveCard, setSaveCard] = useState(false);
  const [appleEmail, setAppleEmail] = useState("");
  const [upiId, setUpiId] = useState("");
  const [googlePhone, setGooglePhone] = useState("");

  const selectedBrand: DesktopPaymentBrandId =
    desktopPaymentBrands.some((brand) => brand.id === paymentMethod)
      ? (paymentMethod as DesktopPaymentBrandId)
      : "visa";

  const selectedBrandMeta =
    desktopPaymentBrands.find((brand) => brand.id === selectedBrand) ??
    desktopPaymentBrands[0];

  const handleSelectBrand = (id: DesktopPaymentBrandId) => {
    onPaymentMethodChange(id);
  };

  const showMobileCardForm = ["card", "visa", "mastercard", "amex"].includes(
    paymentMethod,
  );

  const org = organizationBanner ?? {
    name: bookingLocation.name,
    banner: bookingLocation.banner,
    availability: bookingLocation.availability,
    status: bookingLocation.status,
    thumbnail: bookingLocation.image,
    address: bookingLocation.address,
  };

  const servicesTotal = selectedServices.reduce((sum, s) => sum + s.price, 0);
  const productsTotal = selectedProducts.reduce((sum, p) => {
    const qty = Math.max(1, productQuantities[p.id] ?? 1);
    return sum + p.price * qty;
  }, 0);
  const addOnsTotal = 0;
  const lineSubtotal = servicesTotal + productsTotal + addOnsTotal;
  const taxAmount = Number((lineSubtotal * TAX_RATE).toFixed(2));
  const discount = 20;
  const grandTotal = Number(
    (lineSubtotal + taxAmount - ((lineSubtotal + taxAmount) * discount) / 100).toFixed(
      2,
    ),
  );

  const serviceItemsTotal = servicesTotal;
  const serviceDiscount = Number(
    (serviceItemsTotal * SERVICE_DISCOUNT_RATE).toFixed(2),
  );
  const serviceGrandTotal = Number(
    (serviceItemsTotal - serviceDiscount + PLATFORM_FEE).toFixed(2),
  );
  const desktopPayTotal = isProductOnly ? grandTotal : serviceGrandTotal;

  const pricingRows = (
    <>
      {selectedServices.map((service) => {
        const schedule = serviceSchedules[service.id];
        const scheduled = isServiceScheduleComplete(schedule);
        const assignedStaffId = serviceStaff[service.id];
        const assignedStaff = assignedStaffId
          ? getStaff(assignedStaffId)
          : getStaff(staffId);

  return (
          <div key={service.id} className="space-y-0.5">
            <div className="flex justify-between gap-2 text-(--text-secondary)">
              <span className="min-w-0 truncate">{service.name}</span>
              <span className="shrink-0">{service.priceLabel}</span>
            </div>
            <p className="text-[7px] font-semibold text-(--text-muted)">
              Therapist: {isPackageFlow ? "packages" : assignedStaff.name}
            </p>
            {scheduled && (
              <p className="text-[7px] font-semibold text-(--text-muted)">
                {formatServiceSchedule(schedule)}
              </p>
            )}
          </div>
        );
      })}
      {selectedProducts.map((product) => {
        const qty = Math.max(1, productQuantities[product.id] ?? 1);
        return (
          <div
            key={product.id}
            className="flex justify-between gap-2 text-(--text-secondary)"
          >
            <span className="min-w-0 truncate">
              {product.name} × {qty}
            </span>
            <span className="shrink-0">
              ${(product.price * qty).toFixed(2)}
            </span>
          </div>
        );
      })}
    </>
  );

  return (
    <>
      {/* ================= MOBILE ================= */}
      <div className="space-y-3 pb-2 lg:hidden">
        {isProductOnly ? (
          <>
            <ProductMobileOrderSummary
              products={selectedProducts}
              productQuantities={productQuantities}
              promoCode={promoCode}
              onPromoCodeChange={onPromoCodeChange}
              productDeliveryAddress={productDeliveryAddress}
              subtotal={lineSubtotal}
              taxAmount={taxAmount}
              discountPercent={discount}
              grandTotal={grandTotal}
            />
            <ProductMobileDeliveryPreview
              address={productDeliveryAddress}
              storeName={org.name}
              storeAddress={org.address ?? bookingLocation.address}
              onChangeDelivery={onBack}
            />
          </>
        ) : (
          <>
            <BookingSelectedServicesPanel
              selectedServiceIds={selectedServiceIds}
              organization={organizationBanner}
              organizationId={organizationId}
              serviceStaff={serviceStaff}
              serviceSchedules={serviceSchedules}
              packageName={packageName}
              onRemoveService={onRemoveService}
              showOrganizationBanner={false}
            />

            {selectedProducts.length > 0 && (
              <section className="feature-card overflow-hidden rounded-xl">
                <div className="border-b border-(--border) px-3 py-2.5">
                  <p className="text-[11px] font-bold text-(--text-primary)">
                    Selected Products
                  </p>
                  <p className="text-[8px] font-semibold text-(--text-muted)">
                    {selectedProducts.length} item
                    {selectedProducts.length === 1 ? "" : "s"}
                  </p>
                </div>
                <div className="grid grid-cols-4 gap-2 p-3">
                  {selectedProducts.map((product) => {
                    const qty = Math.max(1, productQuantities[product.id] ?? 1);

                    return (
                      <article
                        key={product.id}
                        className="relative overflow-hidden rounded-sm border border-(--border) bg-[color-mix(in_srgb,var(--accent-primary)_4%,transparent)]"
                      >
                        {onRemoveProduct && (
                          <button
                            type="button"
                            onClick={() => onRemoveProduct(product.id)}
                            aria-label={`Remove ${product.name}`}
                            className="
                              absolute right-1 top-1 z-10 flex h-4 w-4 items-center
                              justify-center rounded-full border border-(--border)
                              bg-(--bg-card) text-(--text-muted)
                              transition-colors hover:text-(--accent-primary)
                            "
                          >
                            <X size={9} strokeWidth={2.5} />
                          </button>
                        )}

                        <div className="relative h-14 w-full overflow-hidden">
                          <Image
                            src={product.image}
                            alt={product.name}
                            fill
                            sizes="80px"
                            className="object-cover"
                          />
                        </div>
                        <div className="p-1">
                          <p className=" h-10 text-[10px] font-bold text-(--text-primary)">
                            {product.name}
                          </p>
                          <p className="mt-0.5 text-[9px] font-semibold text-(--text-secondary)">
                            Qty {qty}
                          </p>
                          <p className="mt-0.5 text-[10px] font-bold text-(--brand-gold)">
                            ${(product.price * qty).toFixed(2)}
                          </p>
                        </div>
                      </article>
                    );
                  })}
                </div>
              </section>
            )}

            <div className="grid grid-cols-2 gap-2">
              <section className="feature-card rounded-xl p-2.5">
                <div className="mb-2 flex items-center gap-1.5">
                  <Tag
                    size={12}
                    className="text-(--accent-primary)"
                    strokeWidth={2}
                  />
                  <h3 className="text-[9px] font-semibold text-(--text-primary)">
                    Pricing Summary
                  </h3>
                </div>

                <div className="space-y-1 text-[8px]">
                  {pricingRows}
                  <div className="flex justify-between border-t border-(--border) pt-1 text-(--text-secondary)">
                    <span>Subtotal</span>
                    <span>${mobileSubtotal}</span>
                  </div>
                  <div className="flex justify-between text-(--text-secondary)">
                    <span>Taxes & Fees</span>
                    <span>${mobileTax}</span>
                  </div>
                  <div className="flex justify-between text-(--text-secondary)">
                    <span>Additional Charges</span>
                    <span>$0</span>
                  </div>
                </div>

                <div className="mt-2 flex items-center justify-between border-t border-(--border) pt-2">
                  <span className="text-[9px] font-semibold text-(--text-primary)">
                    Total Amount
                  </span>
                  <span className="text-lg font-bold text-(--accent-primary)">
                    ${mobileTotal}
                  </span>
                </div>
              </section>

              <section className="feature-card flex flex-col items-center justify-center rounded-xl p-2.5 text-center">
                <div className="mb-1.5 flex h-10 w-10 items-center justify-center rounded-full bg-[color-mix(in_srgb,var(--accent-primary)_12%,transparent)]">
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
                      className="rounded border border-(--border) px-1 py-0.5 text-[5px] font-bold tracking-wide text-(--text-muted)"
                    >
                      {badge}
                    </span>
                  ))}
                </div>
              </section>
            </div>
          </>
        )}

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
              const Icon = option.icon;

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
                    <Icon className="text-xl text-(--text-primary)" />
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

        {showMobileCardForm && (
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
                  className="search-glass w-full rounded-lg border py-2 pr-24 pl-3 text-[9px] text-(--text-primary) placeholder:text-(--text-muted) focus:ring-1 focus:ring-(--accent-primary)/30 focus:outline-none"
                />
                <div className="absolute top-1/2 right-4 -translate-y-1/2">
                <CardBrandIcons />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2">
                <input
                  type="text"
                  value={expiry}
                  onChange={(e) => setExpiry(e.target.value)}
                  placeholder="MM / YY"
                  maxLength={7}
                  className="search-glass w-full rounded-lg border px-2 py-2 text-[9px] text-(--text-primary) placeholder:text-(--text-muted) focus:ring-1 focus:ring-(--accent-primary)/30 focus:outline-none"
                />
                <input
                  type="password"
                  value={cvv}
                  onChange={(e) => setCvv(e.target.value)}
                  placeholder="CVV"
                  maxLength={4}
                  className="search-glass w-full rounded-lg border px-2 py-2 text-[9px] text-(--text-primary) placeholder:text-(--text-muted) focus:ring-1 focus:ring-(--accent-primary)/30 focus:outline-none"
                />
            </div>

              <input
                type="text"
                value={billingName}
                onChange={(e) => onBillingChange("billingName", e.target.value)}
                placeholder="Cardholder Name"
                className="search-glass w-full rounded-lg border px-2 py-2 text-[9px] text-(--text-primary) placeholder:text-(--text-muted) focus:ring-1 focus:ring-(--accent-primary)/30 focus:outline-none"
              />
          </div>
        </section>
      )}

        {!isProductOnly ? (
        <section className="flex items-center justify-between gap-2 rounded-xl bg-[color-mix(in_srgb,var(--accent-primary)_8%,var(--bg-card))] px-3 py-2">
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
          <div className="flex shrink-0 items-center gap-1 rounded-full bg-(--accent-primary) px-2 py-1">
          <Zap size={9} className="text-white" fill="white" strokeWidth={0} />
          <span className="text-[6px] font-semibold text-white">
            Instant Confirmation
          </span>
        </div>
      </section>
        ) : (
          <p className="flex items-center justify-center gap-1.5 text-[10px] text-(--text-muted)">
            <ShieldCheck size={13} className="text-(--accent-primary)" />
            Secure SSL encrypted payment
          </p>
        )}

      <button
        type="button"
        onClick={onBack}
        className="secondary-button w-full rounded-xl py-2 text-[9px] font-medium"
      >
        BACK
      </button>
      </div>

      {/* ================= DESKTOP (matches reference) ================= */}
      <div className="hidden lg:block">
        <div className="grid grid-cols-2 gap-5 xl:gap-6">
          {/* LEFT — Booking Summary */}
          {!isProductOnly ? (
            <ServiceDesktopBookingSummary
              selectedServices={selectedServices}
              serviceStaff={serviceStaff}
              serviceSchedules={serviceSchedules}
              staffId={staffId}
              org={org}
              isPackageFlow={isPackageFlow}
              onEditService={onEditService}
            />
          ) : (
          <section className="rounded-2xl border border-(--border) bg-(--bg-card) p-6 shadow-[var(--shadow-card)]">
            <div className="mb-5 flex items-start gap-3">
              <span className="mt-0.5 flex h-9 w-9 items-center justify-center rounded-xl bg-(--accent-primary)/10">
                <ClipboardCheck
                  size={18}
                  className="text-(--accent-primary)"
                />
              </span>
              <div>
                <h2 className="text-[22px] font-semibold text-(--text-primary)">
                  Your Order Summary
                </h2>
                <p className="mt-0.5 text-[13px] text-(--text-muted)">
                  Review your selection.
                </p>
              </div>
            </div>

            {selectedProducts.length > 0 && (
            <div className="mb-5 space-y-2.5">
                {selectedProducts.map((product) => {
                  const qty = Math.max(1, productQuantities[product.id] ?? 1);

                  return (
                    <div
                      key={product.id}
                      className="relative flex items-center gap-3 rounded-xl border border-(--border) bg-(--bg-secondary) p-3 pr-10"
                    >
                      {onRemoveProduct && (
                        <button
                          type="button"
                          onClick={() => onRemoveProduct(product.id)}
                          aria-label={`Remove ${product.name}`}
                          className="
                            absolute right-2 top-2 flex h-7 w-7 shrink-0 items-center
                            justify-center rounded-full border border-(--border)
                            text-(--text-muted) transition-colors
                            hover:text-(--accent-primary)
                          "
                        >
                          <X size={13} strokeWidth={2.5} />
                        </button>
                      )}

                      <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-lg">
                        <Image
                          src={product.image}
                          alt={product.name}
                          fill
                          sizes="56px"
                          className="object-cover"
                        />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-[14px] font-semibold text-(--text-primary)">
                          {product.name}
                        </p>
                        <p className="mt-0.5 text-[12px] text-(--text-muted)">
                          {product.quantity} · Qty {qty}
                        </p>
                      </div>
                      <p className="shrink-0 text-[15px] font-bold text-(--text-primary)">
                        ${money(product.price * qty)}
                      </p>
                    </div>
                  );
                })}
            </div>
            )}

            <div className="rounded-xl border border-(--border) bg-[color-mix(in_srgb,var(--accent-primary)_6%,var(--bg-card))] p-4">
              <div className="space-y-1.5 text-[13px]">
                <div className="flex justify-between text-(--text-secondary)">
                  <span>Subtotal</span>
                  <span>${money(lineSubtotal)}</span>
                </div>
                <div className="flex justify-between text-(--text-secondary)">
                  <span>Tax ({Math.round(TAX_RATE * 100)}%)</span>
                  <span>${money(taxAmount)}</span>
                </div>
                <div className="flex justify-between font-medium text-(--success)">
                  <span>Discount({discount}%)</span>
                  <span>-${money(((lineSubtotal + taxAmount) * discount) / 100)}</span>
                </div>
                <div className="flex items-baseline justify-between border-t border-(--border) pt-2">
                  <span className="text-[14px] font-semibold text-(--text-primary)">
                    Total
                  </span>
                  <span className="text-[22px] font-bold text-(--accent-primary)">
                    ${money(grandTotal)}{" "}
                    <span className="text-[13px] font-semibold">AUD</span>
                  </span>
                </div>
              </div>
            </div>
          </section>
          )}

          {/* RIGHT — Payment Details */}
          <section className="rounded-2xl border border-(--border) bg-(--bg-card) p-6 shadow-[var(--shadow-card)]">
            <div className="mb-5 flex items-start justify-between gap-3">
              <div className="flex items-start gap-3">
                <span className="mt-0.5 flex h-9 w-9 items-center justify-center rounded-xl bg-(--accent-primary)/10">
                  <CreditCard size={18} className="text-(--accent-primary)" />
                </span>
                <div>
                  <h2 className="text-[22px] font-semibold text-(--text-primary)">
                    Payment Details
                  </h2>
                  <p className="mt-0.5 inline-flex items-center gap-1.5 text-[13px] text-(--text-muted)">
                    <Lock size={12} />
                    All transactions are secure and encrypted.
                  </p>
                </div>
              </div>
            </div>

            <div className="mb-5">
              <p className="mb-2.5 text-[12px] font-medium text-(--text-secondary)">
                Choose payment method
              </p>
              <div className="grid grid-cols-5 gap-2.5">
                {desktopPaymentBrands.map((brand) => {
                  const active = selectedBrand === brand.id;
                  const Icon = brand.icon;

                  return (
                    <button
                      key={brand.id}
                      type="button"
                      onClick={() => handleSelectBrand(brand.id)}
                      aria-pressed={active}
                      className={`
                        flex flex-col items-center gap-1.5 rounded-xl border px-2 py-3
                        transition-all duration-200
                        ${
                          active
                            ? "border-(--accent-primary) bg-[color-mix(in_srgb,var(--accent-primary)_8%,var(--bg-card))] shadow-(--shadow-glow)"
                            : "border-(--border) bg-(--bg-secondary) hover:border-(--accent-primary)/40"
                        }
                      `}
                    >
                      <Icon className={`text-[30px] ${brand.iconClass}`} />
                      <span
                        className={`text-[11px] font-semibold ${
                          active
                            ? "text-(--accent-primary)"
                            : "text-(--text-secondary)"
                        }`}
                      >
                        {brand.label}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="space-y-3.5">
              {selectedBrandMeta.form === "card" && (
                <>
                  <div>
                    <label className={labelClass} htmlFor="card-number">
                      Card Number
                    </label>
                    <div className="relative">
                      <input
                        id="card-number"
                        type="text"
                        value={cardNumber}
                        onChange={(e) => setCardNumber(e.target.value)}
                        placeholder="4242 4242 4242 4242"
                        maxLength={19}
                        className={`${fieldClass} pr-12`}
                      />
                      <CreditCard
                        size={16}
                        className="absolute top-1/2 right-3.5 -translate-y-1/2 text-(--text-muted)"
                      />
                    </div>
                    <p className="mt-1.5 text-[11px] text-(--text-muted)">
                      Paying with {selectedBrandMeta.label}
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className={labelClass} htmlFor="card-expiry">
                        Expiry Date
                      </label>
                      <input
                        id="card-expiry"
                        type="text"
                        value={expiry}
                        onChange={(e) => setExpiry(e.target.value)}
                        placeholder="MM / YY"
                        maxLength={7}
                        className={fieldClass}
                      />
                    </div>
                    <div>
                      <label className={labelClass} htmlFor="card-cvv">
                        <span className="inline-flex items-center gap-1">
                          CVV
                          <CircleHelp
                            size={12}
                            className="text-(--text-muted)"
                          />
                        </span>
                      </label>
                      <input
                        id="card-cvv"
                        type="password"
                        value={cvv}
                        onChange={(e) => setCvv(e.target.value)}
                        placeholder="123"
                        maxLength={4}
                        className={fieldClass}
                      />
                    </div>
                  </div>

                  <div>
                    <label className={labelClass} htmlFor="card-name">
                      Cardholder Name
                    </label>
                    <input
                      id="card-name"
                      type="text"
                      value={billingName}
                      onChange={(e) =>
                        onBillingChange("billingName", e.target.value)
                      }
                      placeholder="Name on card"
                      className={fieldClass}
                    />
                  </div>

                  {/* <div>
                    <label className={labelClass} htmlFor="card-country">
                      Country / Region
                    </label>
                    <select
                      id="card-country"
                      value={country}
                      onChange={(e) => setCountry(e.target.value)}
                      className={fieldClass}
                    >
                      <option value="Australia">🇦🇺 Australia</option>
                      <option value="New Zealand">🇳🇿 New Zealand</option>
                      <option value="India">🇮🇳 India</option>
                      <option value="United States">🇺🇸 United States</option>
                      <option value="United Kingdom">🇬🇧 United Kingdom</option>
                    </select>
                  </div> */}

                  <div className="pt-1">
                    <p className="mb-2.5 text-[13px] font-semibold text-(--text-primary)">
                      Billing Address
                    </p>
                    <div className="space-y-3">
                      <div>
                        <label className={labelClass} htmlFor="addr1">
                          Address
                        </label>
                        <input
                          id="addr1"
                          type="text"
                          value={address1}
                          onChange={(e) => setAddress1(e.target.value)}
                          placeholder="Street address"
                          className={fieldClass}
                        />
                      </div>
                      {/* <div>
                        <label className={labelClass} htmlFor="addr2">
                          Address Line 2 (Optional)
                        </label>
                        <input
                          id="addr2"
                          type="text"
                          value={address2}
                          onChange={(e) => setAddress2(e.target.value)}
                          placeholder="Apartment, suite, etc."
                          className={fieldClass}
                        />
                      </div> */}
                      <div className="grid grid-cols-3 gap-3">
                        <div>
                          <label className={labelClass} htmlFor="suburb">
                            Suburb
                          </label>
                          <input
                            id="suburb"
                            type="text"
                            value={suburb}
                            onChange={(e) => setSuburb(e.target.value)}
                            className={fieldClass}
                          />
                        </div>
                        <div>
                          <label className={labelClass} htmlFor="state">
                            State
                          </label>
                          <select
                            id="state"
                            value={state}
                            onChange={(e) => setState(e.target.value)}
                            className={fieldClass}
                          >
                            {AU_STATES.map((s) => (
                              <option key={s} value={s}>
                                {s}
                              </option>
                            ))}
                          </select>
                        </div>
                        <div>
                          <label className={labelClass} htmlFor="postcode">
                            Postcode
                          </label>
                          <input
                            id="postcode"
                            type="text"
                            value={postcode}
                            onChange={(e) => setPostcode(e.target.value)}
                            className={fieldClass}
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  <label className="flex cursor-pointer items-center gap-2.5 pt-1 text-[13px] text-(--text-secondary)">
                    <input
                      type="checkbox"
                      checked={saveCard}
                      onChange={(e) => setSaveCard(e.target.checked)}
                      className="h-4 w-4 rounded border-(--border) accent-(--accent-primary)"
                    />
                    <span className="inline-flex items-center gap-1">
                      Save card for faster checkout
                      <CircleHelp size={13} className="text-(--text-muted)" />
                    </span>
                  </label>
                </>
              )}

              {selectedBrandMeta.form === "apple" && (
                <div className="space-y-3.5 rounded-xl border border-(--border) bg-(--bg-secondary) p-4">
                  <div className="flex items-center gap-2.5">
                    <FaApplePay className="text-[36px] text-(--text-primary)" />
                    <div>
                      <p className="text-[15px] font-semibold text-(--text-primary)">
                        Pay with Apple Pay
                      </p>
                      <p className="text-[12px] text-(--text-muted)">
                        Confirm with Face ID, Touch ID, or your passcode
                      </p>
                    </div>
                  </div>

                  <div>
                    <label className={labelClass} htmlFor="apple-email">
                      Apple ID Email
                    </label>
                    <input
                      id="apple-email"
                      type="email"
                      value={appleEmail}
                      onChange={(e) => setAppleEmail(e.target.value)}
                      placeholder="name@icloud.com"
                      className={fieldClass}
                    />
                  </div>

                  <div>
                    <label className={labelClass} htmlFor="apple-name">
                      Name on Apple Account
                    </label>
                    <input
                      id="apple-name"
                      type="text"
                      value={billingName}
                      onChange={(e) =>
                        onBillingChange("billingName", e.target.value)
                      }
                      placeholder="Full name"
                      className={fieldClass}
                    />
                  </div>

                  <div className="rounded-lg border border-dashed border-(--border) bg-(--bg-card) px-3.5 py-3 text-[12px] leading-relaxed text-(--text-secondary)">
                    You&apos;ll approve this payment on your Apple device. No
                    card number is shared with the merchant.
                  </div>
                </div>
              )}

              {selectedBrandMeta.form === "google" && (
                <div className="space-y-3.5 rounded-xl border border-(--border) bg-(--bg-secondary) p-4">
                  <div className="flex items-center gap-2.5">
                    <FaGooglePay className="text-[36px] text-(--text-primary)" />
                    <div>
                      <p className="text-[15px] font-semibold text-(--text-primary)">
                        Pay with Google Pay / UPI
                      </p>
                      <p className="text-[12px] text-(--text-muted)">
                        Use UPI ID or linked Google account
                      </p>
                    </div>
                  </div>

                  <div>
                    <label className={labelClass} htmlFor="upi-id">
                      UPI ID
                    </label>
                    <input
                      id="upi-id"
                      type="text"
                      value={upiId}
                      onChange={(e) => setUpiId(e.target.value)}
                      placeholder="username@upi"
                      className={fieldClass}
                    />
                  </div>

                  <div>
                    <label className={labelClass} htmlFor="google-phone">
                      Mobile Number
                    </label>
                    <input
                      id="google-phone"
                      type="tel"
                      value={googlePhone}
                      onChange={(e) => setGooglePhone(e.target.value)}
                      placeholder="+61 400 000 000"
                      className={fieldClass}
                    />
                  </div>

                  <div>
                    <label className={labelClass} htmlFor="google-name">
                      Account Name
                    </label>
                    <input
                      id="google-name"
                      type="text"
                      value={billingName}
                      onChange={(e) =>
                        onBillingChange("billingName", e.target.value)
                      }
                      placeholder="Name linked to Google Pay"
                      className={fieldClass}
                    />
                  </div>

                  <div className="rounded-lg border border-dashed border-(--border) bg-(--bg-card) px-3.5 py-3 text-[12px] leading-relaxed text-(--text-secondary)">
                    Complete payment in the Google Pay / UPI app after you
                    confirm. A payment request will be sent to your UPI ID.
                  </div>
                </div>
              )}

              <button
                type="button"
                onClick={onConfirm}
                className="
                  primary-button mt-2 flex h-[52px] w-full items-center justify-center
                  gap-2 rounded-xl text-[15px] font-semibold text-white
                  transition-opacity hover:opacity-90
                "
              >
                <Lock size={16} strokeWidth={2.2} />
                {selectedBrandMeta.form === "apple"
                  ? `Pay with Apple Pay $${money(desktopPayTotal)}`
                  : selectedBrandMeta.form === "google"
                    ? `Pay with Google Pay $${money(desktopPayTotal)}`
                    : `Pay $${money(desktopPayTotal)} Securely`}
              </button>

              <p className="flex items-center justify-center gap-1.5 text-[12px] text-(--text-muted)">
                <ShieldCheck size={14} className="text-(--accent-primary)" />
                Secure SSL encrypted payment
              </p>
            </div>
          </section>
        </div>

        {isProductOnly ? (
        <div className="mt-5 grid grid-cols-4 gap-4 rounded-2xl border border-(--border) bg-(--bg-card) px-5 py-4 shadow-[var(--shadow-card)]">
          {[
            {
              icon: ShieldCheck,
              title: "Free Cancellation",
              text: "Up to 24 hours before booking",
            },
            {
              icon: BadgeCheck,
              title: "Best Price Guarantee",
              text: "Find a better price? We'll match it",
            },
            {
              icon: ShieldCheck,
              title: "Trusted Professionals",
              text: "All experts are verified & rated",
            },
            {
              icon: Lock,
              title: "Secure Payments",
              text: "PCI DSS compliant & protected",
            },
          ].map(({ icon: Icon, title, text }) => (
            <div key={title} className="flex items-start gap-3">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-(--accent-primary)/30 text-(--accent-primary)">
                <Icon size={18} strokeWidth={1.7} />
              </span>
              <div>
                <p className="text-[13px] font-semibold text-(--text-primary)">
                  {title}
                </p>
                <p className="mt-0.5 text-[12px] leading-snug text-(--text-muted)">
                  {text}
                </p>
              </div>
            </div>
          ))}
        </div>
        ) : null}
      </div>
    </>
  );
}

export function getStep4Total(
  serviceIds: string[],
  productIds: string[] = [],
  productQuantities: Record<string, number> = {},
) {
  const subtotal =
    calcServicesTotal(serviceIds).subtotal +
    calcProductsTotal(productIds, productQuantities).subtotal;
  return subtotal + Math.round(subtotal * TAX_RATE);
}
