import Image from "next/image";
import { CheckCheck } from "lucide-react";

import { getExpert } from "@/specificexpert/expert.data";
import {
  ChatActionType,
  ChatMessage,
  MenuServiceItem,
} from "../message.types";

interface ChatConversationProps {
  messages: ChatMessage[];
  userAvatar: string;
  expertId: string;
  onAction?: (action: ChatActionType, messageId: string) => void;
}

function ServiceCard({
  service,
  variant,
}: {
  service: MenuServiceItem;
  variant: "incoming" | "outgoing";
}) {
  return (
    <div className="flex items-center gap-2">
      <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-lg">
        <Image
          src={service.image}
          alt={service.name}
          fill
          sizes="40px"
          className="object-cover"
        />
      </div>
      <div className="min-w-0">
        <p
          className={`truncate text-[9px] font-medium ${
            variant === "incoming" ? "text-(--text-primary)" : "text-white"
          }`}
        >
          {service.name}
        </p>
        <p
          className={`text-[9px] font-bold ${
            variant === "incoming" ? "text-(--brand-gold)" : "text-white/90"
          }`}
        >
          {service.price}
        </p>
      </div>
    </div>
  );
}

function BillSummary({
  services,
  totalBill,
}: {
  services: MenuServiceItem[];
  totalBill: string;
}) {
  return (
    <div className="space-y-2">
      {services.map((service, index) => (
        <ServiceCard key={`${service.id}-${index}`} service={service} variant="outgoing" />
      ))}
      <div className="border-t border-white/20 pt-2">
        <p className="text-[9px] font-bold text-white">Total: {totalBill}</p>
      </div>
    </div>
  );
}

function MessageContent({
  message,
  variant,
}: {
  message: ChatMessage;
  variant: "incoming" | "outgoing";
}) {
  if (message.kind === "service" && message.service) {
    return (
      <div className="space-y-1">
        {message.text && (
          <p
            className={`text-[9px] leading-relaxed ${
              variant === "incoming" ? "text-(--text-primary)" : "text-white"
            }`}
          >
            {message.text}
          </p>
        )}
        <ServiceCard service={message.service} variant={variant} />
      </div>
    );
  }

  if (message.kind === "bill" && message.services && message.totalBill) {
    return (
      <div className="space-y-2">
        {message.text && (
          <p
            className={`text-[9px] leading-relaxed ${
              variant === "incoming" ? "text-(--text-primary)" : "text-white"
            }`}
          >
            {message.text}
          </p>
        )}
        <BillSummary services={message.services} totalBill={message.totalBill} />
      </div>
    );
  }

  return (
    <p
      className={`text-[9px] leading-relaxed ${
        variant === "incoming" ? "text-(--text-primary)" : "text-white"
      }`}
    >
      {message.text}
    </p>
  );
}

export function ChatConversation({
  messages,
  userAvatar,
  expertId,
  onAction,
}: ChatConversationProps) {
  const expert = getExpert(expertId);

  return (
    <div className="space-y-2 py-2">
      <div className="flex items-center gap-2 py-1">
        <div className="h-px flex-1 bg-(--border)" />
        <span className="text-[8px] text-(--text-muted)">Today</span>
        <div className="h-px flex-1 bg-(--border)" />
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
                    bg-(--bg-card-hover) px-2.5 py-2
                  "
                >
                  <MessageContent message={message} variant="incoming" />
                  <p className="mt-1 text-right text-[7px] text-(--text-muted)">
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
                <MessageContent message={message} variant="outgoing" />

                {message.actions && message.actions.length > 0 && (
                  <div className="mt-2 flex flex-wrap gap-1">
                    {message.actions.map((action) => (
                      <button
                        key={action.id}
                        type="button"
                        onClick={() => onAction?.(action.id, message.id)}
                        className="
                          rounded-[4px] border border-white/30 bg-white/15
                          px-2 py-0.5 text-[8px] font-medium text-white
                          transition-all duration-200 hover:bg-white/25
                        "
                      >
                        {action.label}
                      </button>
                    ))}
                  </div>
                )}

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
