"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
    CircleHelp,
    LayoutGrid,
    Home,
    ShoppingBag,
    UserRound,
} from "lucide-react";

const items = [
    { label: "Home", icon: Home, href: "/home" },
    { label: "Menu", icon: LayoutGrid, href: "/menu" },
    { label: "Service", icon: ShoppingBag, href: null },
    { label: "Experts", icon: UserRound, href: null },
    { label: "Help", icon: CircleHelp, href: "/help" },
];

export function BottomNavigation() {
    const pathname = usePathname();

    return (
        <nav
            className="
        search-glass
        fixed bottom-4 left-2 right-2 z-50
        rounded-2xl border
        px-4 py-3
        backdrop-blur-2xl
        lg:hidden
      "
        >
            <ul className="flex items-center justify-between">
                {items.map(({ label, icon: Icon, href }) => {
                    const active = href !== null && pathname === href;

                    const content = (
                        <>
                            <Icon
                                strokeWidth={1.4}
                                className={`h-4 w-4 transition-all duration-300 ${active
                                    ? "text-(--accent-glow) drop-shadow-[0_0_12px_color-mix(in_srgb,var(--accent-glow)_45%,transparent)]"
                                    : "text-(--text-secondary) group-hover:text-(--text-primary)"
                                    }`}
                            />

                            <span
                                className={`text-[10px] transition-colors duration-300 ${active
                                    ? "text-(--accent-glow)"
                                    : "text-(--text-secondary) group-hover:text-(--text-primary)"
                                    }`}
                            >
                                {label}
                            </span>
                        </>
                    );

                    const sharedClassName =
                        "group flex flex-col items-center gap-1 transition-all duration-200 hover:-translate-y-0.5";

                    return (
                        <li key={label}>
                            {href !== null ? (
                                <Link href={href} className={sharedClassName}>
                                    {content}
                                </Link>
                            ) : (
                                <span className={sharedClassName}>{content}</span>
                            )}
                        </li>
                    );
                })}
            </ul>
        </nav>
    );
}