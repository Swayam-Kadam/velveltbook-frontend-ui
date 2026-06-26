"use client";

import { useRouter } from "next/navigation";
import { ArrowLeft, Bell } from "lucide-react";

export function HelpTopNav() {
  const router = useRouter();

  return (
    <div className="relative flex items-center justify-between px-1">
      <button
        type="button"
        onClick={() => router.back()}
        aria-label="Go back"
        className="flex h-8 w-8 items-center justify-center text-(--text-primary)"
      >
        <ArrowLeft size={18} strokeWidth={1.8} />
      </button>

      <h1 className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-sm font-semibold text-(--text-primary)">
        Call Expert at Home
      </h1>

      {/* <button
        type="button"
        aria-label="Notifications"
        className="relative flex h-8 w-8 items-center justify-center text-(--text-primary)"
      >
        <Bell size={16} strokeWidth={1.6} />
        <span
          className="
            absolute -right-0.5 -top-0.5 flex h-3.5 w-3.5 items-center justify-center
            rounded-full bg-(--accent-primary) text-[8px] font-semibold text-white
          "
        >
          2
        </span>
      </button> */}
    </div>
  );
}
