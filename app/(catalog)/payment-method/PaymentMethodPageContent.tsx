"use client";

import { useMemo, useState } from "react";
import { ChevronDown, ChevronRight, CreditCard } from "lucide-react";
import {
  FaApplePay,
  FaCcAmex,
  FaCcMastercard,
  FaCcVisa,
  FaGooglePay,
  FaPaypal,
} from "react-icons/fa6";

import {
  initialSavedPaymentMethods,
  paymentMethodTabs,
} from "./payment-method.data";
import type {
  PaymentMethodTabId,
  SavedPaymentBrand,
  SavedPaymentMethod,
} from "./payment-method.types";

function formatCardNumber(value: string) {
  const digits = value.replace(/\D/g, "").slice(0, 16);
  return digits.replace(/(.{4})/g, "$1 ").trim();
}

function formatExpiry(value: string) {
  const digits = value.replace(/\D/g, "").slice(0, 4);
  if (digits.length <= 2) return digits;
  return `${digits.slice(0, 2)}/${digits.slice(2)}`;
}

function formatCvc(value: string) {
  return value.replace(/\D/g, "").slice(0, 4);
}

function detectCardBrand(cardNumber: string): SavedPaymentBrand {
  const digits = cardNumber.replace(/\D/g, "");
  if (digits.startsWith("4")) return "visa";
  if (/^3[47]/.test(digits)) return "amex";
  if (/^(5[1-5]|2[2-7])/.test(digits)) return "mastercard";
  return "card";
}

function isCardFormValid(cardNumber: string, expiry: string, cvc: string) {
  const digits = cardNumber.replace(/\D/g, "");
  const expiryDigits = expiry.replace(/\D/g, "");
  const month = Number(expiryDigits.slice(0, 2));
  const validMonth = month >= 1 && month <= 12;

  return (
    digits.length >= 15 &&
    expiryDigits.length === 4 &&
    validMonth &&
    cvc.length >= 3
  );
}

function isEmailValid(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
}

function BrandMark({ brand }: { brand: SavedPaymentBrand }) {
  const iconClass = "text-[28px] leading-none";

  if (brand === "visa") {
    return <FaCcVisa className={`${iconClass} text-[#1a1f71]`} />;
  }
  if (brand === "mastercard") {
    return <FaCcMastercard className={`${iconClass} text-[#eb001b]`} />;
  }
  if (brand === "amex") {
    return <FaCcAmex className={`${iconClass} text-[#006fcf]`} />;
  }
  if (brand === "gpay") {
    return <FaGooglePay className={`${iconClass} text-(--text-primary)`} />;
  }
  if (brand === "applepay") {
    return <FaApplePay className={`${iconClass} text-(--text-primary)`} />;
  }
  if (brand === "paypal") {
    return <FaPaypal className={`${iconClass} text-[#003087]`} />;
  }

  return <CreditCard size={22} className="text-(--text-secondary)" />;
}

function SavedMethodRow({
  method,
  isOpen,
  onToggle,
  onMakeDefault,
  onRemove,
}: {
  method: SavedPaymentMethod;
  isOpen: boolean;
  onToggle: () => void;
  onMakeDefault: () => void;
  onRemove: () => void;
}) {
  const suffix = method.isDefault ? " (Default)" : "";
  const previewLabel = method.last4
    ? `****${method.last4}${suffix}`
    : `${method.email ?? method.label}${suffix}`;

  return (
    <div className="border-b border-(--border) last:border-b-0">
      <button
        type="button"
        onClick={onToggle}
        className="flex w-full items-center gap-3 py-3.5 text-left"
      >
        <span className="flex h-8 w-11 shrink-0 items-center justify-start">
          <BrandMark brand={method.brand} />
        </span>

        <span className="min-w-0 flex-1 text-[13px] font-medium text-(--text-primary)">
          {previewLabel}
        </span>

        <ChevronRight
          size={16}
          className={`shrink-0 text-(--text-muted) transition-transform ${
            isOpen ? "rotate-90" : ""
          }`}
        />
      </button>

      {isOpen && (
        <div className="flex items-center gap-2 pb-3 pl-[3.5rem]">
          {!method.isDefault && (
            <button
              type="button"
              onClick={onMakeDefault}
              className="rounded-full border border-(--border) px-3 py-1.5 text-[11px] font-medium text-(--text-primary) hover:bg-(--bg-card-hover)"
            >
              Set as default
            </button>
          )}
          <button
            type="button"
            onClick={onRemove}
            className="rounded-full border border-(--border) px-3 py-1.5 text-[11px] font-medium text-(--danger) hover:bg-(--bg-card-hover)"
          >
            Remove
          </button>
        </div>
      )}
    </div>
  );
}

function Field({
  id,
  label,
  value,
  onChange,
  placeholder,
  inputMode,
  autoComplete,
  maxLength,
}: {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  inputMode?: "numeric" | "email" | "text";
  autoComplete?: string;
  maxLength?: number;
}) {
  return (
    <label htmlFor={id} className="block">
      <span className="mb-1.5 block text-[12px] font-medium text-(--text-secondary)">
        {label}
      </span>
      <input
        id={id}
        type="text"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        inputMode={inputMode}
        autoComplete={autoComplete}
        maxLength={maxLength}
        className="
          w-full rounded-xl border border-(--border) bg-(--bg-card)
          px-3.5 py-3 text-[13px] text-(--text-primary)
          placeholder:text-(--text-muted)
          outline-none focus:border-(--accent-primary)/40 focus:ring-2
          focus:ring-(--accent-primary)/15
        "
      />
    </label>
  );
}

export function PaymentMethodPageContent() {
  const [activeTab, setActiveTab] = useState<PaymentMethodTabId>("card");
  const [savedMethods, setSavedMethods] = useState<SavedPaymentMethod[]>(
    initialSavedPaymentMethods,
  );
  const [openMethodId, setOpenMethodId] = useState<string | null>(null);
  const [formOpen, setFormOpen] = useState(true);

  const [cardNumber, setCardNumber] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvc, setCvc] = useState("");
  const [walletEmail, setWalletEmail] = useState("");

  const methodsForTab = useMemo(
    () => savedMethods.filter((method) => method.tab === activeTab),
    [savedMethods, activeTab],
  );

  const cardValid = isCardFormValid(cardNumber, expiry, cvc);
  const walletValid = isEmailValid(walletEmail);
  const canSubmit = activeTab === "card" ? cardValid : walletValid;

  function resetForm() {
    setCardNumber("");
    setExpiry("");
    setCvc("");
    setWalletEmail("");
  }

  function handleAdd() {
    if (!canSubmit) return;

    const makeDefault = savedMethods.length === 0;

    if (activeTab === "card") {
      const digits = cardNumber.replace(/\D/g, "");
      const brand = detectCardBrand(digits);
      const last4 = digits.slice(-4);

      setSavedMethods((current) => [
        ...current.map((method) =>
          makeDefault ? { ...method, isDefault: false } : method,
        ),
        {
          id: `card-${Date.now()}`,
          tab: "card",
          brand,
          label:
            brand === "visa"
              ? "Visa"
              : brand === "amex"
                ? "Amex"
                : brand === "mastercard"
                  ? "Mastercard"
                  : "Card",
          last4,
          expiry,
          isDefault: makeDefault,
        },
      ]);
    } else {
      const brand: SavedPaymentBrand = activeTab;
      const labels: Record<Exclude<PaymentMethodTabId, "card">, string> = {
        gpay: "Google Pay",
        applepay: "Apple Pay",
        paypal: "PayPal",
      };

      setSavedMethods((current) => [
        ...current.map((method) =>
          makeDefault ? { ...method, isDefault: false } : method,
        ),
        {
          id: `${activeTab}-${Date.now()}`,
          tab: activeTab,
          brand,
          label: labels[activeTab],
          email: walletEmail.trim(),
          isDefault: makeDefault,
        },
      ]);
    }

    resetForm();
    setFormOpen(false);
  }

  function handleMakeDefault(id: string) {
    setSavedMethods((current) =>
      current.map((method) => ({
        ...method,
        isDefault: method.id === id,
      })),
    );
  }

  function handleRemove(id: string) {
    setSavedMethods((current) => {
      const remaining = current.filter((method) => method.id !== id);
      if (remaining.some((method) => method.isDefault) || remaining.length === 0) {
        return remaining;
      }
      return remaining.map((method, index) => ({
        ...method,
        isDefault: index === 0,
      }));
    });
    setOpenMethodId(null);
  }

  const addCopy = {
    card: {
      title: "Add new credit/debit card",
      button: "Add card",
    },
    gpay: {
      title: "Add Google Pay",
      button: "Add Google Pay",
    },
    applepay: {
      title: "Add Apple Pay",
      button: "Add Apple Pay",
    },
    paypal: {
      title: "Add PayPal",
      button: "Add PayPal",
    },
  }[activeTab];

  return (
    <main className="min-h-screen bg-(--bg-primary) px-3 pb-[calc(6rem+env(safe-area-inset-bottom))] sm:px-4">
      <div className="mx-auto w-full max-w-xl pt-2 lg:max-w-2xl lg:pt-4">

        <div className="flex items-center justify-between">
        <h1 className="mb-4 text-[20px] font-semibold flex items-center text-(--text-primary) lg:text-[24px]">
          Payment Methods
        </h1>

        <div className="flex items-center gap-2">

          <button
            type="button"
            onClick={() => setFormOpen((open) => !open)}
            className="flex items-center primary-button text-white p-1 rounded-xs"
          >
            Add card
          </button>

          <button
            type="button"
            onClick={() => setFormOpen((open) => !open)}
            className="flex items-center primary-button text-white p-1 rounded-xs"
          >
            Remove card
          </button>

        </div>
        </div>

        <div className="mb-5 flex border-b border-(--border)">
          {paymentMethodTabs.map((tab) => {
            const active = activeTab === tab.id;

            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => {
                  setActiveTab(tab.id);
                  setFormOpen(true);
                  setOpenMethodId(null);
                  resetForm();
                }}
                className="relative flex-1 py-3 text-center text-[12px] font-semibold tracking-wide transition-colors lg:text-[13px]"
                style={{
                  color: active
                    ? "var(--accent-secondary)"
                    : "var(--text-muted)",
                }}
              >
                {tab.label}
                {active && (
                  <span
                    className="absolute inset-x-0 -bottom-px h-0.5 w-full"
                    style={{ background: "var(--accent-secondary)" }}
                  />
                )}
              </button>
            );
          })}
        </div>

        <section className="rounded-2xl bg-[color-mix(in_srgb,var(--text-muted)_10%,var(--bg-card))] p-4 sm:p-5">
          <button
            type="button"
            onClick={() => setFormOpen((open) => !open)}
            className="flex w-full items-center justify-between gap-3 text-left"
          >
            <span className="text-[14px] font-medium text-(--text-primary)">
              {addCopy.title}
            </span>
            <ChevronDown
              size={16}
              className={`shrink-0 text-(--text-muted) transition-transform ${
                formOpen ? "rotate-180" : ""
              }`}
            />
          </button>

          {formOpen && (
            <div className="mt-4 space-y-3">
              {activeTab === "card" ? (
                <>
                  <Field
                    id="card-number"
                    label="Card Number"
                    value={cardNumber}
                    onChange={(value) => setCardNumber(formatCardNumber(value))}
                    placeholder="Card number"
                    inputMode="numeric"
                    autoComplete="cc-number"
                    maxLength={19}
                  />

                  <div className="grid grid-cols-2 gap-3">
                    <Field
                      id="card-expiry"
                      label="Expiry"
                      value={expiry}
                      onChange={(value) => setExpiry(formatExpiry(value))}
                      placeholder="MM/YY"
                      inputMode="numeric"
                      autoComplete="cc-exp"
                      maxLength={5}
                    />
                    <Field
                      id="card-cvc"
                      label="CVC"
                      value={cvc}
                      onChange={(value) => setCvc(formatCvc(value))}
                      placeholder="Security code"
                      inputMode="numeric"
                      autoComplete="cc-csc"
                      maxLength={4}
                    />
                  </div>
                </>
              ) : (
                <Field
                  id={`${activeTab}-email`}
                  label={
                    activeTab === "gpay"
                      ? "Google account"
                      : activeTab === "applepay"
                        ? "Apple ID"
                        : "PayPal email"
                  }
                  value={walletEmail}
                  onChange={setWalletEmail}
                  placeholder={
                    activeTab === "gpay"
                      ? "name@gmail.com"
                      : activeTab === "applepay"
                        ? "Apple ID email"
                        : "PayPal email"
                  }
                  inputMode="email"
                  autoComplete="email"
                />
              )}

              <button
                type="button"
                onClick={handleAdd}
                disabled={!canSubmit}
                className={`
                  mt-1 w-full rounded-full py-3 text-[14px] font-semibold
                  transition-all duration-200
                  ${
                    canSubmit
                      ? "primary-button text-white"
                      : "cursor-not-allowed bg-[#cfc9d4] text-white"
                  }
                `}
              >
                {addCopy.button}
              </button>
            </div>
          )}
        </section>

        <section className="mt-2 px-1">
          {methodsForTab.length > 0 ? (
            methodsForTab.map((method) => (
              <SavedMethodRow
                key={method.id}
                method={method}
                isOpen={openMethodId === method.id}
                onToggle={() =>
                  setOpenMethodId((current) =>
                    current === method.id ? null : method.id,
                  )
                }
                onMakeDefault={() => handleMakeDefault(method.id)}
                onRemove={() => handleRemove(method.id)}
              />
            ))
          ) : (
            <p className="py-4 text-[13px] text-(--text-muted)">
              {
                {
                  card: "No cards saved yet.",
                  gpay: "No Google Pay accounts saved yet.",
                  applepay: "No Apple Pay accounts saved yet.",
                  paypal: "No PayPal accounts saved yet.",
                }[activeTab]
              }
            </p>
          )}
        </section>
      </div>
    </main>
  );
}
