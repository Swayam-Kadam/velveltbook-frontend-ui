"use client";

import { ShoppingCart } from "lucide-react";

interface OrganizationBookingCartProps {
  itemCount: number;
  onClick: () => void;
}

export function OrganizationBookingCart({
  itemCount,
  onClick,
}: OrganizationBookingCartProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={`Book ${itemCount} selected service${itemCount !== 1 ? "s" : ""}`}
      className="
        primary-button fixed bottom-[88px] right-3 z-40 flex h-12 w-12
        items-center justify-center rounded-full shadow-(--shadow-glow)
        transition-transform duration-200 hover:scale-105 active:scale-95
        md:bottom-6
      "
    >
      <ShoppingCart size={20} strokeWidth={2} className="text-white" />
      <span
        className="
          absolute -right-0.5 -top-0.5 flex h-5 min-w-5 items-center
          justify-center rounded-full bg-(--brand-gold) px-1
          text-[9px] font-bold text-(--text-primary)
        "
      >
        {itemCount}
      </span>
    </button>
  );
}
