"use client";

import {
  CalendarDays,
  Clock3,
  MapPin,
  UserRound,
} from "lucide-react";

import {
  bookingLocation,
  calcTotal,
  getService,
  getStaff,
  paymentMethods,
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
  onBillingChange: (field: "billingName" | "billingEmail" | "billingPhone", value: string) => void;
  onBack: () => void;
  onConfirm: () => void;
}

export function Step4PaymentConfirmation({
  serviceId,
  staffId,
  selectedDate,
  selectedTime,
  paymentMethod,
  promoCode,
  billingName,
  billingEmail,
  billingPhone,
  onPaymentMethodChange,
  onPromoCodeChange,
  onBillingChange,
  onBack,
}: Step4PaymentConfirmationProps) {
  const service = getService(serviceId);
  const staff = getStaff(staffId);
  const { subtotal, tax, total } = calcTotal(service.price);

  return (
    <div className="space-y-4">
      <section>
        <h2 className="mb-2 text-xs font-medium text-[var(--text-primary)]">Booking Summary</h2>
        <article className="feature-card space-y-2 rounded-xl p-3 text-[8px]">
          {[
            { icon: CalendarDays, label: "Service", value: service.name },
            { icon: UserRound, label: "Therapist", value: staff.name },
            { icon: CalendarDays, label: "Date", value: `May ${selectedDate}, 2025` },
            { icon: Clock3, label: "Time", value: selectedTime },
            { icon: MapPin, label: "Location", value: bookingLocation.name },
            { icon: Clock3, label: "Duration", value: service.duration },
          ].map(({ icon: Icon, label, value }) => (
            <div key={label} className="flex items-start gap-2">
              <Icon size={12} className="mt-0.5 shrink-0 text-[var(--accent-primary)]" />
              <div>
                <span className="text-[var(--text-muted)]">{label}: </span>
                <span className="text-[var(--text-primary)]">{value}</span>
              </div>
            </div>
          ))}
        </article>
      </section>

      <section>
        <h2 className="mb-2 text-xs font-medium text-[var(--text-primary)]">Pricing Breakdown</h2>
        <article className="feature-card space-y-1 rounded-xl p-3 text-[9px]">
          <div className="flex justify-between text-[var(--text-secondary)]">
            <span>Service Cost</span><span>${subtotal}</span>
          </div>
          <div className="flex justify-between text-[var(--text-secondary)]">
            <span>Taxes & Fees</span><span>${tax}</span>
          </div>
          <div className="flex justify-between text-[var(--text-secondary)]">
            <span>Additional Charges</span><span>$0</span>
          </div>
          <div className="flex justify-between border-t border-[var(--border)] pt-2 text-[11px] font-semibold text-[var(--text-primary)]">
            <span>Total Amount</span><span>${total}</span>
          </div>
        </article>
      </section>

      <section>
        <h2 className="mb-2 text-xs font-medium text-[var(--text-primary)]">Payment Method</h2>
        <article className="feature-card space-y-2 rounded-xl p-3">
          {paymentMethods.map((method) => (
            <label
              key={method.id}
              className="flex cursor-pointer items-center justify-between gap-2 py-1"
            >
              <div className="flex items-center gap-2">
                <input
                  type="radio"
                  name="payment"
                  checked={paymentMethod === method.id}
                  onChange={() => onPaymentMethodChange(method.id)}
                  className="accent-[var(--accent-primary)]"
                />
                <span className="text-[9px] text-[var(--text-primary)]">{method.label}</span>
              </div>
            </label>
          ))}
        </article>
      </section>

      <section>
        <h2 className="mb-2 text-xs font-medium text-[var(--text-primary)]">Promo Code</h2>
        <input
          type="text"
          value={promoCode}
          onChange={(e) => onPromoCodeChange(e.target.value)}
          placeholder="Enter promo code (optional)"
          className="
            search-glass w-full rounded-xl border px-3 py-2.5
            text-[9px] text-[var(--text-primary)] placeholder:text-[var(--text-muted)]
            focus:outline-none
          "
        />
      </section>

      <section>
        <h2 className="mb-2 text-xs font-medium text-[var(--text-primary)]">Billing Information</h2>
        <article className="feature-card space-y-2 rounded-xl p-3">
          <input
            type="text"
            value={billingName}
            onChange={(e) => onBillingChange("billingName", e.target.value)}
            placeholder="Full Name"
            className="search-glass w-full rounded-lg border px-3 py-2 text-[9px] focus:outline-none"
          />
          <input
            type="email"
            value={billingEmail}
            onChange={(e) => onBillingChange("billingEmail", e.target.value)}
            placeholder="Email Address"
            className="search-glass w-full rounded-lg border px-3 py-2 text-[9px] focus:outline-none"
          />
          <input
            type="tel"
            value={billingPhone}
            onChange={(e) => onBillingChange("billingPhone", e.target.value)}
            placeholder="Phone Number"
            className="search-glass w-full rounded-lg border px-3 py-2 text-[9px] focus:outline-none"
          />
        </article>
      </section>

      <button
        type="button"
        onClick={onBack}
        className="secondary-button w-full rounded-xl py-2 text-[9px] font-medium"
      >
        BACK
      </button>
    </div>
  );
}

export function getStep4Total(serviceId: string) {
  return calcTotal(getService(serviceId).price).total;
}
