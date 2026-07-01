"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const navigationItems = [
  { label: "Home", href: "/home" },
  { label: "Menu", href: "/menu" },
  { label: "Service", href: "/services" },
  { label: "Experts", href: "/experts" },
  { label: "Bookings", href: "/booking" },
  { label: "Offers", href: "/offers" },
];

interface NavigationMenuProps {
  className?: string;
}

export function NavigationMenu({ className = "" }: NavigationMenuProps) {
  const pathname = usePathname();

  return (
    <nav
      className={`hidden items-stretch justify-center gap-8 lg:flex ${className}`}
      aria-label="Primary navigation"
    >
      {navigationItems.map((item) => {
        const active =
          pathname === item.href ||
          (item.href !== "/home" && pathname.startsWith(item.href));

        return (
          <Link
            key={item.label}
            href={item.href}
            className={`
              flex h-12 items-center border-b-2 px-1 text-[13px] font-medium
              transition-colors duration-200
              ${
                active
                  ? "border-(--brand-gold) text-(--text-primary)"
                  : "border-transparent text-(--text-primary) hover:text-(--accent-secondary)"
              }
            `}
          >
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}
