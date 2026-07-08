import type { PaymentMethod } from "@/types/booking";

export const PAYMENT_METHODS: PaymentMethod[] = [
  { id: "card", label: "Credit / Debit Card" },
  { id: "apple", label: "Apple Pay" },
  { id: "google", label: "Google Pay" },
  { id: "paypal", label: "PayPal" },
  { id: "razorpay", label: "Razorpay" },
];

/** Payment options for step 4 confirmation UI (includes icon keys). */
export const PAYMENT_OPTIONS = [
  { id: "card", label: "Credit / Debit Card", icon: "credit-card" },
  { id: "apple", label: "Apple Pay", icon: "apple" },
  { id: "google", label: "Google Pay", icon: "google" },
  { id: "paypal", label: "PayPal", icon: "paypal" },
  { id: "razorpay", label: "Razorpay", icon: "razorpay" },
] as const;
