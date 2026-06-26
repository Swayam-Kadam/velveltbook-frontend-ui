"use client";

import {
  CalendarDays,
  Hand,
  Headphones,
  Tag,
  UserRound,
} from "lucide-react";

const tabs = [
  { id: "services", label: "Services", icon: Hand, active: true },
  { id: "experts", label: "Experts", icon: UserRound, active: false },
  { id: "bookings", label: "My Bookings", icon: CalendarDays, active: false },
  { id: "offers", label: "Offers", icon: Tag, active: false },
  { id: "help", label: "Help & Support", icon: Headphones, active: false },
];

export function HelpTabNav() {
  return (
    <nav className="border-b border-(--border)">
      <div className="flex justify-between gap-1 overflow-x-auto scrollbar-none px-1">
        {tabs.map(({ id, label, icon: Icon, active }) => (
          <button
            key={id}
            type="button"
            className={`
              flex shrink-0 flex-col items-center gap-1 pb-2 pt-1
              ${active ? "border-b-2 border-(--accent-primary)" : "opacity-70"}
            `}
          >
            <Icon
              size={14}
              strokeWidth={1.4}
              className={
                active
                  ? "text-(--accent-primary)"
                  : "text-(--text-secondary)"
              }
            />
            <span
              className={`text-[9px] leading-tight ${
                active
                  ? "font-bold text-(--accent-primary)"
                  : "text-(--text-muted) font-bold"
              }`}
            >
              {label}
            </span>
          </button>
        ))}
      </div>
    </nav>
  );
}
