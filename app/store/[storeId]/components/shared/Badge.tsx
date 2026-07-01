import type { ReactNode } from "react";
import { ArrowRight, ChevronRight } from "lucide-react";
import Link from "next/link";

interface SidebarHeaderProps {
  title: string;
  actionLabel?: string;
  actionHref?: string;
}

export function SidebarHeader({
  title,
  actionLabel,
  actionHref = "#",
}: SidebarHeaderProps) {
  return (
    <div className="mb-4 flex items-center justify-between">
      <h2 className="text-base font-semibold text-(--text-primary) lg:text-lg">
        {title}
      </h2>

      {actionLabel && (
        <Link
          href={actionHref}
          className="flex items-center gap-1 text-[11px] font-medium text-(--accent-secondary) transition-colors hover:text-(--accent-primary) lg:text-xs"
        >
          <span>{actionLabel}</span>
          <ArrowRight size={12} strokeWidth={2} />
        </Link>
      )}
    </div>
  );
}

interface SidebarFooterProps {
  label: string;
  href?: string;
}

export function SidebarFooter({ label, href = "#" }: SidebarFooterProps) {
  return (
    <Link
      href={href}
      className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl border border-(--border) bg-(--bg-secondary) py-3 text-xs font-medium text-(--text-primary) transition-all hover:border-(--accent-primary) hover:shadow-[var(--shadow-card)] lg:text-sm"
    >
      <span>{label}</span>
      <ChevronRight size={14} />
    </Link>
  );
}

interface StatusBadgeProps {
  label: string;
  status?: "online" | "offline";
  icon?: ReactNode;
  variant?: "default" | "overlay";
}

export function StatusBadge({
  label,
  status,
  icon,
  variant = "default",
}: StatusBadgeProps) {
  const overlayStyles =
    "border-white/20 bg-white/10 text-white/90 backdrop-blur-md";
  const defaultStyles =
    "border-(--border) bg-(--bg-card) text-(--text-secondary)";

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-[11px] font-medium lg:text-xs ${variant === "overlay" ? overlayStyles : defaultStyles}`}
    >
      {status === "online" && (
        <span className="h-2 w-2 rounded-full bg-(--success)" />
      )}
      {status === "offline" && (
        <span className="h-2 w-2 rounded-full bg-(--danger)" />
      )}
      {icon}
      {label}
    </span>
  );
}

interface PillBadgeProps {
  label: string;
  icon?: ReactNode;
}

export function PillBadge({ label, icon }: PillBadgeProps) {
  return (
    <span className="primary-button inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-[11px] font-medium text-white backdrop-blur-md lg:px-4 lg:py-2 lg:text-xs">
      {icon}
      {label}
    </span>
  );
}
