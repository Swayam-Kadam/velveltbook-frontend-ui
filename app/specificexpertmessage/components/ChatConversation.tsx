import Image from "next/image";
import { CheckCheck } from "lucide-react";

import { getExpert } from "@/specificexpert/expert.data";
import { ChatMessage } from "../message.types";

interface ChatConversationProps {
  messages: ChatMessage[];
  userAvatar: string;
  expertId: string;
}

export function ChatConversation({
  messages,
  userAvatar,
  expertId,
}: ChatConversationProps) {
  const expert = getExpert(expertId);

  return (
    <div className="space-y-2 py-2">
      <div className="flex items-center gap-2 py-1">
        <div className="h-px flex-1 bg-[var(--border)]" />
        <span className="text-[8px] text-[var(--text-muted)]">Today</span>
        <div className="h-px flex-1 bg-[var(--border)]" />
      </div>

      <div className="space-y-2">
        {messages.map((message) => {
          if (message.type === "incoming") {
            return (
              <div key={message.id} className="flex items-end gap-1.5">
                {message.showAvatar ? (
                  <div className="relative h-6 w-6 shrink-0 overflow-hidden rounded-full">
                    <Image
                      src={userAvatar}
                      alt="User"
                      fill
                      sizes="24px"
                      className="object-cover"
                    />
                  </div>
                ) : (
                  <div className="h-6 w-6 shrink-0" />
                )}

                <div
                  className="
                    max-w-[75%] rounded-xl rounded-bl-sm
                    bg-[var(--bg-card-hover)] px-2.5 py-2
                  "
                >
                  <p className="text-[9px] leading-relaxed text-[var(--text-primary)]">
                    {message.text}
                  </p>
                  <p className="mt-1 text-right text-[7px] text-[var(--text-muted)]">
                    {message.time}
                  </p>
                </div>
              </div>
            );
          }

          return (
            <div key={message.id} className="flex items-end justify-end gap-1.5">
              <div
                className="
                  primary-button max-w-[75%] rounded-xl rounded-br-sm
                  px-2.5 py-2 shadow-none
                "
              >
                <p className="text-[9px] leading-relaxed text-white">
                  {message.text}
                </p>
                <div className="mt-1 flex items-center justify-end gap-1">
                  <span className="text-[7px] text-white/80">{message.time}</span>
                  <CheckCheck size={10} className="text-white/90" strokeWidth={2} />
                </div>
              </div>

              {message.showAvatar ? (
                <div className="relative h-6 w-6 shrink-0 overflow-hidden rounded-full">
                  <Image
                    src={expert.image}
                    alt={expert.name}
                    fill
                    sizes="24px"
                    className="object-cover"
                  />
                </div>
              ) : (
                <div className="h-6 w-6 shrink-0" />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
