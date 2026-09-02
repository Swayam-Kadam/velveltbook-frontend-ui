"use client";

import { Crosshair, MapPin, Store, Truck } from "lucide-react";

export type ProductDeliveryType = "deliver" | "pickup";

export interface ProductDeliveryAddress {
  deliveryType: ProductDeliveryType;
  fullName: string;
  countryCode: string;
  mobile: string;
  addressLine1: string;
  addressLine2: string;
  suburb: string;
  postcode: string;
}

export const DEFAULT_PRODUCT_ADDRESS: ProductDeliveryAddress = {
  deliveryType: "deliver",
  fullName: "",
  countryCode: "+61",
  mobile: "",
  addressLine1: "",
  addressLine2: "",
  suburb: "",
  postcode: "",
};

export const PRODUCT_COUNTRY_CODES = [
  { code: "+61", flag: "🇦🇺", label: "AU" },
  { code: "+91", flag: "🇮🇳", label: "IN" },
  { code: "+1", flag: "🇺🇸", label: "US" },
  { code: "+44", flag: "🇬🇧", label: "UK" },
] as const;

function FieldLabel({ children }: { children: React.ReactNode }) {
  return (
    <label className="mb-1.5 block text-[12px] font-semibold text-(--text-primary)">
      {children}
    </label>
  );
}

function TextInput({
  value,
  onChange,
  placeholder,
  type = "text",
  endAdornment,
}: {
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  type?: string;
  endAdornment?: React.ReactNode;
}) {
  return (
    <div className="relative">
      <input
        type={type}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        className={`
          w-full rounded-xl border border-(--border) bg-(--bg-card)
          px-3.5 py-3 text-[13px] text-(--text-primary) outline-none
          placeholder:text-(--text-muted)
          focus:border-(--accent-primary)
          ${endAdornment ? "pr-11" : ""}
        `}
      />
      {endAdornment ? (
        <div className="absolute top-1/2 right-3 -translate-y-1/2">
          {endAdornment}
        </div>
      ) : null}
    </div>
  );
}

export function validateProductDeliveryAddress(
  address: ProductDeliveryAddress,
): string | null {
  if (address.deliveryType === "pickup") return null;

  if (
    !address.fullName.trim() ||
    !address.mobile.trim() ||
    !address.addressLine1.trim() ||
    !address.suburb.trim() ||
    !address.postcode.trim()
  ) {
    return "Please fill in name, mobile, address, suburb, and postcode.";
  }

  return null;
}

interface ProductDeliverySectionsProps {
  address: ProductDeliveryAddress;
  onChange: (address: ProductDeliveryAddress) => void;
  storeName: string;
  storeAddress: string;
}

export function ProductDeliverySections({
  address,
  onChange,
  storeName,
  storeAddress,
}: ProductDeliverySectionsProps) {
  const updateField = <K extends keyof ProductDeliveryAddress>(
    key: K,
    value: ProductDeliveryAddress[K],
  ) => {
    onChange({ ...address, [key]: value });
  };

  const deliveryOptionClass = (active: boolean) =>
    `flex w-full items-start gap-2.5 rounded-xl border px-3 py-3 text-left transition-colors ${
      active
        ? "border-(--accent-primary) bg-[color-mix(in_srgb,var(--accent-primary)_8%,white)]"
        : "border-(--border) bg-(--bg-card)"
    }`;

  const deliveryTypeSection = (
    <div className="grid grid-cols-2 gap-2.5">
      <button
        type="button"
        onClick={() => updateField("deliveryType", "deliver")}
        className={deliveryOptionClass(address.deliveryType === "deliver")}
      >
        <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-(--accent-primary)/10">
          <Truck size={16} className="text-(--accent-primary)" />
        </span>
        <div className="min-w-0 flex-1">
          <p className="text-[12px] font-bold text-(--text-primary)">
            Deliver to me
          </p>
          <p className="mt-0.5 text-[10px] leading-snug text-(--text-muted)">
            We will deliver your order to your address.
          </p>
        </div>
        <span
          className={`mt-1 h-4 w-4 shrink-0 rounded-full border-2 ${
            address.deliveryType === "deliver"
              ? "border-(--accent-primary) bg-(--accent-primary) shadow-[inset_0_0_0_3px_white]"
              : "border-(--border) bg-(--bg-card)"
          }`}
        />
      </button>

      <button
        type="button"
        onClick={() => updateField("deliveryType", "pickup")}
        className={deliveryOptionClass(address.deliveryType === "pickup")}
      >
        <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-(--bg-secondary)">
          <Store size={16} className="text-(--text-secondary)" />
        </span>
        <div className="min-w-0 flex-1">
          <p className="text-[12px] font-bold text-(--text-primary)">
            Pick up from store
          </p>
          <p className="mt-0.5 text-[10px] leading-snug text-(--text-muted)">
            Pick up your order from the store.
          </p>
        </div>
        <span
          className={`mt-1 h-4 w-4 shrink-0 rounded-full border-2 ${
            address.deliveryType === "pickup"
              ? "border-(--accent-primary) bg-(--accent-primary) shadow-[inset_0_0_0_3px_white]"
              : "border-(--border) bg-(--bg-card)"
          }`}
        />
      </button>
    </div>
  );

  const addressForm =
    address.deliveryType === "deliver" ? (
      <section className="rounded-2xl border border-(--border) bg-(--bg-card) p-3.5 sm:p-4">
        <div className="mb-3.5 flex items-center gap-2">
          <span className="primary-button flex h-7 w-7 items-center justify-center rounded-lg">
            <MapPin size={14} className="text-white" />
          </span>
          <h2 className="text-[14px] font-bold text-(--text-primary)">
            Delivery Address
          </h2>
        </div>

        <div className="space-y-3">
          <div>
            <FieldLabel>Full Name</FieldLabel>
            <TextInput
              value={address.fullName}
              onChange={(value) => updateField("fullName", value)}
              placeholder="Enter your full name"
            />
          </div>

          <div>
            <FieldLabel>Mobile Number</FieldLabel>
            <div className="flex gap-2">
              <div className="relative w-[108px] shrink-0">
                <select
                  value={address.countryCode}
                  onChange={(event) =>
                    updateField("countryCode", event.target.value)
                  }
                  className="
                    h-full w-full appearance-none rounded-xl border border-(--border)
                    bg-(--bg-card) py-3 pr-7 pl-2.5 text-[12px] font-semibold
                    text-(--text-primary) outline-none focus:border-(--accent-primary)
                  "
                >
                  {PRODUCT_COUNTRY_CODES.map((item) => (
                    <option key={item.code} value={item.code}>
                      {item.flag} {item.code}
                    </option>
                  ))}
                </select>
              </div>
              <div className="min-w-0 flex-1">
                <TextInput
                  value={address.mobile}
                  onChange={(value) => updateField("mobile", value)}
                  placeholder="Enter mobile number"
                  type="tel"
                />
              </div>
            </div>
          </div>

          <div>
            <FieldLabel>Address Line 1</FieldLabel>
            <TextInput
              value={address.addressLine1}
              onChange={(value) => updateField("addressLine1", value)}
              placeholder="House no., street name, suburb"
              endAdornment={
                <button
                  type="button"
                  aria-label="Locate me"
                  className="flex h-7 w-7 items-center justify-center rounded-full text-(--accent-primary)"
                >
                  <Crosshair size={15} />
                </button>
              }
            />
          </div>

          <div>
            <FieldLabel>Address Line 2 (Optional)</FieldLabel>
            <TextInput
              value={address.addressLine2}
              onChange={(value) => updateField("addressLine2", value)}
              placeholder="Apartment, unit, building, etc."
            />
          </div>

          <div className="grid grid-cols-2 gap-2.5">
            <div>
              <FieldLabel>Suburb</FieldLabel>
              <TextInput
                value={address.suburb}
                onChange={(value) => updateField("suburb", value)}
                placeholder="Enter suburb"
              />
            </div>
            <div>
              <FieldLabel>Postcode</FieldLabel>
              <TextInput
                value={address.postcode}
                onChange={(value) => updateField("postcode", value)}
                placeholder="Enter postcode"
              />
            </div>
          </div>

          <div className="flex items-center gap-2 rounded-xl bg-[color-mix(in_srgb,var(--accent-primary)_10%,white)] px-3 py-2.5">
            <Truck size={15} className="shrink-0 text-(--accent-primary)" />
            <p className="text-[11px] font-medium text-(--text-primary)">
              We usually deliver within 1-3 business days.
            </p>
          </div>
        </div>
      </section>
    ) : (
      <section className="rounded-2xl border border-(--border) bg-(--bg-card) p-4">
        <div className="flex items-start gap-3">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-(--accent-primary)/10">
            <Store size={18} className="text-(--accent-primary)" />
          </span>
          <div className="min-w-0">
            <p className="text-[14px] font-bold text-(--text-primary)">
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
      </section>
    );

  return (
    <>
      {deliveryTypeSection}
      {addressForm}
    </>
  );
}
