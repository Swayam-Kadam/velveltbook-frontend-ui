export type PaymentMethodTabId = "card" | "gpay" | "applepay" | "paypal";

export type SavedPaymentBrand =
  | "visa"
  | "mastercard"
  | "amex"
  | "gpay"
  | "applepay"
  | "paypal"
  | "card";

export interface SavedPaymentMethod {
  id: string;
  tab: PaymentMethodTabId;
  brand: SavedPaymentBrand;
  label: string;
  last4?: string;
  expiry?: string;
  email?: string;
  isDefault: boolean;
}

export interface PaymentMethodTab {
  id: PaymentMethodTabId;
  label: string;
}
