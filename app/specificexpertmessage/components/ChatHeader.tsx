import Image from "next/image";
import { ArrowLeftRight } from "lucide-react";

interface ChatHeaderProps {
  userName: string;
  userAvatar: string;
}

export function ChatHeader({ userName, userAvatar }: ChatHeaderProps) {
  return (
    <div className="flex items-center justify-between gap-2 border-b border-(--border) pb-2">
      <div className="flex min-w-0 items-center gap-2">
        <div className="relative h-8 w-8 shrink-0">
          <div className="relative h-8 w-8 overflow-hidden rounded-full">
            <Image
              src={userAvatar}
              alt={userName}
              fill
              sizes="32px"
              className="object-cover"
            />
          </div>
          <span
            className="
              absolute bottom-0 right-0 h-2 w-2 rounded-full
              border border-(--bg-card) bg-(--success)
            "
          />
        </div>

        <div>
          <p className="text-[10px] font-medium text-(--text-primary)">
            Hi {userName}
          </p>
          <p className="text-[8px] text-(--success)">Online</p>
        </div>
      </div>

      <button
        type="button"
        className="
          secondary-button inline-flex shrink-0 items-center gap-1
          rounded-lg px-2 py-1 text-[8px] font-medium
          text-(--text-primary)
        "
      >
        <ArrowLeftRight size={10} strokeWidth={1.8} />
        Change Expert
      </button>
    </div>
  );
}
