import type {
  PaymentMethodTab,
  SavedPaymentMethod,
} from "./payment-method.types";

export const paymentMethodTabs: PaymentMethodTab[] = [
  { id: "card", label: "Card" },
  { id: "gpay", label: "GPay" },
  { id: "applepay", label: "Apple Pay" },
  { id: "paypal", label: "PayPal" },
];

export const initialSavedPaymentMethods: SavedPaymentMethod[] = [
  {
    id: "saved-mastercard-9444",
    tab: "card",
    brand: "mastercard",
    label: "Mastercard",
    last4: "9444",
    expiry: "08/28",
    isDefault: true,
  },
];
