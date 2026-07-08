"use client";

import { ArrowRight, Bell } from "lucide-react";

import type { AppNotification } from "./notifications.data";

const PREVIEW_COUNT = 5;

interface NotificationDropdownProps {
  open: boolean;
  notifications: AppNotification[];
  onViewMore: () => void;
}

export function NotificationDropdown({
  open,
  notifications,
  onViewMore,
}: NotificationDropdownProps) {
  if (!open) return null;

  const preview = notifications.slice(0, PREVIEW_COUNT);

  return (
    <div
      role="menu"
      aria-label="Notifications"
      className="
        absolute right-[-40px] top-[calc(100%+8px)] z-50 w-[min(20rem,calc(100vw-1rem))]
        overflow-hidden rounded-xl border border-(--border) bg-(--bg-card)
        shadow-[0_10px_40px_rgba(0,0,0,0.18)] backdrop-blur-2xl
      "
    >
      <div className="border-b border-(--border) px-3 py-2.5">
        <p className="text-[12px] font-semibold text-(--text-primary)">
          Notifications
        </p>
        <p className="text-[10px] text-(--text-muted)">
          Your latest updates
        </p>
      </div>

      <div className="max-h-[min(18rem,50dvh)] overflow-y-auto scrollbar-none">
        {preview.length > 0 ? (
          <ul className="divide-y divide-(--border)">
            {preview.map((notification) => (
              <li key={notification.id}>
                <button
                  type="button"
                  role="menuitem"
                  className="
                    flex w-full gap-2.5 px-3 py-2.5 text-left transition-colors
                    hover:bg-(--bg-card-hover)
                  "
                >
                  <span
                    className="
                      mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center
                      rounded-full bg-[color-mix(in_srgb,var(--accent-primary)_12%,transparent)]
                      text-(--accent-primary)
                    "
                  >
                    <Bell size={13} strokeWidth={1.8} />
                  </span>

                  <span className="min-w-0 flex-1">
                    <span className="flex items-start justify-between gap-2">
                      <span className="truncate text-[11px] font-semibold text-(--text-primary)">
                        {notification.title}
                      </span>
                      <span className="shrink-0 text-[9px] text-(--text-muted)">
                        {notification.time}
                      </span>
                    </span>
                    <span className="mt-0.5 line-clamp-2 text-[10px] leading-snug text-(--text-secondary)">
                      {notification.message}
                    </span>
                  </span>

                  {!notification.read && (
                    <span
                      className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-(--accent-primary)"
                      aria-hidden
                    />
                  )}
                </button>
              </li>
            ))}
          </ul>
        ) : (
          <p className="px-3 py-8 text-center text-[11px] text-(--text-muted)">
            No notifications yet
          </p>
        )}
      </div>

      {notifications.length > 0 && (
        <div className="border-t border-(--border) p-2">
          <button
            type="button"
            onClick={onViewMore}
            className="
              flex w-full items-center justify-center gap-1 rounded-lg py-2
              text-[11px] font-semibold text-(--accent-secondary)
              transition-colors hover:bg-(--bg-card-hover)
            "
          >
            View more
            <ArrowRight size={13} strokeWidth={2} />
          </button>
        </div>
      )}
    </div>
  );
}
