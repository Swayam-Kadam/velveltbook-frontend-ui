"use client";

import { useRouter } from "next/navigation";
import { ArrowLeft, Bell, MoreVertical } from "lucide-react";

export function ChatTopNav() {
  const router = useRouter();

  return (
    <div className="flex items-center justify-between px-1">
      <button
        type="button"
        onClick={() => router.back()}
        aria-label="Go back"
        className="
          flex h-8 w-8 items-center justify-center
          text-(--text-primary) transition-opacity duration-200
          hover:opacity-70
        "
      >
        <ArrowLeft size={18} strokeWidth={1.8} />
      </button>

     
    </div>
  );
}
