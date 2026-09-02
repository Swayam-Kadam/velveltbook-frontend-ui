"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  BadgeCheck,
  CalendarDays,
  ChevronDown,
  CreditCard,
  Gift,
  Headphones,
  Heart,
  LayoutDashboard,
  MapPin,
  MessageSquare,
  Settings,
  ShoppingBag,
  Sparkles,
  Star,
  Tag,
  UserRound,
} from "lucide-react";

import {
  FAVORITE_STORES_EVENT,
  getFavoriteStores,
  type FavoriteStore,
} from "@/lib/favorite-stores";
import type { ProfileFormState } from "@/data/account/profile";

const NAV_ITEMS = [
  { id: "dashboard", label: "Dashboard", href: "/home", icon: LayoutDashboard },
  { id: "bookings", label: "My Bookings", href: "/mybooking", icon: CalendarDays },
  { id: "favourites", label: "Favourites", href: "/favoritestore", icon: Heart },
  { id: "orders", label: "My Orders", href: "/mybooking", icon: ShoppingBag },
  { id: "messages", label: "Messages", href: "/help", icon: MessageSquare },
  { id: "reviews", label: "Reviews", href: "/help", icon: Star },
  { id: "payments", label: "Payments", href: "/payment-method", icon: CreditCard },
  { id: "deals", label: "Deals & Offers", href: "/deals", icon: Tag },
  { id: "profile", label: "Profile", href: "/profile", icon: UserRound },
  { id: "settings", label: "Settings", href: "/help", icon: Settings },
  { id: "help", label: "Help & Support", href: "/help", icon: Headphones },
] as const;

interface AccountSidebarProps {
  activeId: (typeof NAV_ITEMS)[number]["id"];
  user: Pick<ProfileFormState, "fullName" | "email">;
}

export function AccountSidebar({ activeId, user }: AccountSidebarProps) {
  const pathname = usePathname();
  const [favoriteStore, setFavoriteStore] = useState<FavoriteStore | null>(null);

  useEffect(() => {
    const sync = () => {
      const stores = getFavoriteStores();
      setFavoriteStore(stores[0] ?? null);
    };

    sync();
    window.addEventListener(FAVORITE_STORES_EVENT, sync);
    return () => window.removeEventListener(FAVORITE_STORES_EVENT, sync);
  }, []);

  const isActive = (href: string, id: string) =>
    id === activeId || pathname === href || pathname.startsWith(`${href}/`);

  return (
    <aside className="flex h-screen w-[272px] shrink-0 flex-col border-r border-(--border) bg-(--bg-card)">
      <div className="border-b border-(--border) px-5 py-5">
        <Link href="/home" className="flex items-center gap-3">
          <Image
            src="/vb-logo.png"
            alt="VelvetBook"
            width={40}
            height={40}
            className="h-10 w-10 object-contain"
          />
          <div>
            <p className="font-[family-name:var(--font-heading)] text-[18px] font-semibold tracking-[0.08em] text-(--text-primary)">
              VELVET
              <span className="text-(--brand-gold)">BOOK</span>
            </p>
            <p className="text-[9px] font-semibold uppercase tracking-[0.28em] text-(--text-muted)">
              Beauty • Wellness
            </p>
          </div>
        </Link>
      </div>

      <nav className="min-h-0 flex-1 space-y-1 overflow-y-auto px-3 py-4 scrollbar-thin scrollbar-thumb-(--accent-primary)/20 scrollbar-track-transparent">
        {NAV_ITEMS.map(({ id, label, href, icon: Icon }) => {
          const active = isActive(href, id);

          return (
            <Link
              key={id}
              href={href}
              className={`
                flex items-center gap-3 rounded-xl px-3 py-2.5 text-[13px] font-medium
                transition-colors
                ${
                  active
                    ? "bg-[color-mix(in_srgb,var(--accent-primary)_12%,white)] text-(--accent-primary)"
                    : "text-(--text-secondary) hover:bg-(--bg-secondary) hover:text-(--text-primary)"
                }
              `}
            >
              <Icon size={16} strokeWidth={1.8} />
              {label}
            </Link>
          );
        })}
      </nav>

      <div className="space-y-3 border-t border-(--border) px-3 py-4">
        <div className="rounded-2xl border border-(--border) bg-(--bg-secondary) p-3">
          <div className="mb-2 flex items-center justify-between">
            <p className="text-[11px] font-semibold text-(--text-primary)">
              Your Favourite Store
            </p>
            <Heart size={14} className="text-(--accent-primary)" />
          </div>

          {favoriteStore ? (
            <>
              <div className="flex items-start gap-2.5">
                <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-lg">
                  <Image
                    src={favoriteStore.avatar}
                    alt={favoriteStore.name}
                    fill
                    sizes="48px"
                    className="object-cover"
                  />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-1">
                    <p className="truncate text-[12px] font-bold text-(--text-primary)">
                      {favoriteStore.name}
                    </p>
                    <BadgeCheck size={12} className="shrink-0 text-(--accent-primary)" />
                  </div>
                  <p className="mt-0.5 flex items-center gap-1 truncate text-[10px] text-(--text-secondary)">
                    <MapPin size={10} />
                    {favoriteStore.address ?? favoriteStore.service}
                  </p>
                  <p className="mt-0.5 flex items-center gap-1 text-[10px] text-(--text-secondary)">
                    <Star
                      size={10}
                      className="fill-(--brand-gold) text-(--brand-gold)"
                    />
                    {favoriteStore.rating ?? 4.8} ({favoriteStore.reviews ?? "120+"})
                  </p>
                </div>
              </div>
              <Link
                href={`/specificorganizationbook/${favoriteStore.organizationId}`}
                className="mt-3 inline-flex items-center gap-1 text-[11px] font-semibold text-(--accent-primary)"
              >
                View Store
                <Sparkles size={12} />
              </Link>
            </>
          ) : (
            <Link
              href="/favoritestore"
              className="text-[11px] font-medium text-(--accent-primary)"
            >
              Save a store to see it here
            </Link>
          )}
        </div>

        <div className="overflow-hidden rounded-2xl bg-(--accent-primary) p-4 text-white">
          <div className="flex items-start justify-between gap-2">
            <div>
              <p className="text-[13px] font-bold leading-snug">
                Exclusive Offers Just for You!
              </p>
              <Link
                href="/deals"
                className="mt-3 inline-flex items-center rounded-full bg-(--brand-gold) px-3 py-1.5 text-[11px] font-semibold text-(--text-primary)"
              >
                Explore Deals
              </Link>
            </div>
            <Gift size={42} className="shrink-0 opacity-90" />
          </div>
        </div>

        <button
          type="button"
          className="flex w-full items-center gap-3 rounded-xl border border-(--border) bg-(--bg-secondary) px-3 py-2.5 text-left"
        >
          <div className="relative h-9 w-9 shrink-0 overflow-hidden rounded-full">
            <Image
              src="/profile.jpeg"
              alt={user.fullName}
              fill
              sizes="36px"
              className="object-cover"
            />
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate text-[12px] font-semibold text-(--text-primary)">
              {user.fullName}
            </p>
            <p className="truncate text-[10px] text-(--text-muted)">{user.email}</p>
          </div>
          <ChevronDown size={14} className="shrink-0 text-(--text-muted)" />
        </button>
      </div>
    </aside>
  );
}
