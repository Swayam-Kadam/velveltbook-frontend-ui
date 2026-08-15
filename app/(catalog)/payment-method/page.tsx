import type { Metadata } from "next";

import { PaymentMethodPageContent } from "./PaymentMethodPageContent";

export const metadata: Metadata = {
  title: "Payment Methods | VelvetBook",
  description: "Add and manage your credit cards, Google Pay, Apple Pay, and PayPal.",
};

export default function PaymentMethodPage() {
  return <PaymentMethodPageContent />;
}
