"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import {
  ArrowLeft,
  CheckCheck,
  File,
  Image as ImageIcon,
  Mic,
  Paperclip,
  Plus,
  Send,
} from "lucide-react";

import {
  ChatServicePicker,
  formatSelectedServicesMessage,
  type SelectedChatService,
} from "@/service-category/ChatServicePicker";

interface ChatMessage {
  id: string;
  text: string;
  time: string;
  outgoing: boolean;
}

interface BookingStoreChatProps {
  storeName: string;
  storeImage: string;
  onBack: () => void;
}

function formatMessageTime(date = new Date()) {
  return date.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
}

export function BookingStoreChat({
  storeName,
  storeImage,
  onBack,
}: BookingStoreChatProps) {
  const [text, setText] = useState("");
  const [attachOpen, setAttachOpen] = useState(false);
  const [showServicePicker, setShowServicePicker] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "welcome",
      text: `Hi! Thanks for your booking with ${storeName}. How can we help?`,
      time: formatMessageTime(),
      outgoing: false,
    },
  ]);
  const listRef = useRef<HTMLDivElement>(null);
  const composerRef = useRef<HTMLDivElement>(null);
  const photoInputRef = useRef<HTMLInputElement>(null);
  const documentInputRef = useRef<HTMLInputElement>(null);
  const hasText = text.trim().length > 0;

  useEffect(() => {
    listRef.current?.scrollTo({
      top: listRef.current.scrollHeight,
      behavior: "smooth",
    });
  }, [messages.length]);

  useEffect(() => {
    if (!attachOpen) return;

    const handleClickOutside = (event: MouseEvent) => {
      if (
        composerRef.current &&
        !composerRef.current.contains(event.target as Node)
      ) {
        setAttachOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [attachOpen]);

  const sendMessage = () => {
    const next = text.trim();
    if (!next) return;
    setMessages((current) => [
      ...current,
      {
        id: `out-${Date.now()}`,
        text: next,
        time: formatMessageTime(),
        outgoing: true,
      },
    ]);
    setText("");
    setAttachOpen(false);
  };

  const sendAttachment = (label: string) => {
    setMessages((current) => [
      ...current,
      {
        id: `out-${Date.now()}`,
        text: label,
        time: formatMessageTime(),
        outgoing: true,
      },
    ]);
    setAttachOpen(false);
  };

  const handlePhotoSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      sendAttachment(`Photo: ${file.name}`);
    }
    event.target.value = "";
  };

  const handleDocumentSelect = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = event.target.files?.[0];
    if (file) {
      sendAttachment(`Document: ${file.name}`);
    }
    event.target.value = "";
  };

  const handleSendServices = (services: SelectedChatService[]) => {
    setMessages((current) => [
      ...current,
      {
        id: `services-${Date.now()}`,
        text: formatSelectedServicesMessage(services),
        time: formatMessageTime(),
        outgoing: true,
      },
    ]);
    setShowServicePicker(false);
  };

  return (
    <section className="overflow-hidden rounded-xl border border-(--border) bg-(--bg-card)">
      <header className="flex items-center gap-2 border-b border-(--border) px-2.5 py-2">
        <button
          type="button"
          onClick={onBack}
          aria-label="Back to booking"
          className="flex h-8 w-8 items-center justify-center rounded-full text-(--text-primary)"
        >
          <ArrowLeft size={16} />
        </button>
        <div className="relative h-8 w-8 shrink-0 overflow-hidden rounded-full">
          <Image
            src={storeImage}
            alt={storeName}
            fill
            sizes="32px"
            className="object-cover"
          />
        </div>
        <div className="min-w-0 flex-1">
          <p className="truncate text-[13px] font-bold text-(--text-primary)">
            {storeName}
          </p>
          <p className="text-[10px] font-medium text-(--success)">Online</p>
        </div>
      </header>

      <div
        ref={listRef}
        className="h-[280px] space-y-3 overflow-y-auto bg-(--bg-primary) px-2.5 py-3"
      >
        {messages.map((message) => {
          const isUser = message.outgoing;

          return (
            <div
              key={message.id}
              className={`flex items-end gap-1.5 ${isUser ? "justify-end" : "justify-start"}`}
            >
              {!isUser ? (
                <div className="relative h-6 w-6 shrink-0">
                  <div className="relative h-6 w-6 overflow-hidden rounded-full">
                    <Image
                      src={storeImage}
                      alt={storeName}
                      fill
                      sizes="24px"
                      className="object-cover"
                    />
                  </div>
                  <span className="absolute bottom-0 right-0 h-2 w-2 rounded-full border border-(--bg-primary) bg-(--success)" />
                </div>
              ) : null}

              <div
                className={`flex max-w-[88%] flex-col ${isUser ? "items-end" : "items-start"}`}
              >
                <div
                  className={`
                    rounded-2xl px-3 py-2 text-[11px] leading-5
                    ${
                      isUser
                        ? "primary-button rounded-br-sm text-white shadow-(--shadow-glow)"
                        : "rounded-bl-sm border border-(--border) bg-(--bg-card) text-(--text-primary) shadow-(--shadow-card)"
                    }
                  `}
                >
                  <span className="whitespace-pre-line">{message.text}</span>
                </div>
                <div
                  className={`mt-0.5 flex items-center gap-1 px-0.5 ${isUser ? "flex-row-reverse" : ""}`}
                >
                  <span className="text-[9px] text-(--text-muted)">
                    {message.time}
                  </span>
                  {isUser ? (
                    <CheckCheck
                      className="h-3 w-3 text-(--accent-primary)"
                      strokeWidth={2.2}
                    />
                  ) : null}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="relative m-2 pt-4">
        <button
          type="button"
          aria-label="Open services menu"
          onClick={() => {
            setAttachOpen(false);
            setShowServicePicker(true);
          }}
          className="primary-button absolute -top-6 right-2 z-10 flex h-9 w-9 items-center justify-center rounded-full text-white shadow-(--shadow-glow)"
        >
          <Plus className="h-[18px] w-[18px]" strokeWidth={2.2} />
        </button>

        <div
          ref={composerRef}
          className="relative rounded-2xl border border-(--border) bg-(--bg-card) px-2.5 py-2.5 shadow-(--shadow-card)"
        >
          {attachOpen ? (
            <div
              className="
                absolute bottom-full left-0 z-50 mb-2 min-w-[9.5rem]
                overflow-hidden rounded-xl border border-(--border) bg-(--bg-card)
                py-1 shadow-(--shadow-card)
              "
              role="menu"
            >
              <button
                type="button"
                role="menuitem"
                onClick={() => photoInputRef.current?.click()}
                className="
                  flex w-full items-center gap-2.5 px-3 py-2 text-left text-[11px]
                  text-(--text-primary) transition-colors hover:bg-(--bg-card-hover)
                "
              >
                <span className="flex h-7 w-7 items-center justify-center rounded-full bg-(--bg-card-hover) text-(--accent-primary)">
                  <ImageIcon className="h-3.5 w-3.5" strokeWidth={1.8} />
                </span>
                Photo
              </button>
              <button
                type="button"
                role="menuitem"
                onClick={() => documentInputRef.current?.click()}
                className="
                  flex w-full items-center gap-2.5 px-3 py-2 text-left text-[11px]
                  text-(--text-primary) transition-colors hover:bg-(--bg-card-hover)
                "
              >
                <span className="flex h-7 w-7 items-center justify-center rounded-full bg-(--bg-card-hover) text-(--accent-primary)">
                  <File className="h-3.5 w-3.5" strokeWidth={1.8} />
                </span>
                File
              </button>
            </div>
          ) : null}

          <div className="flex min-w-0 items-center gap-1.5">
            <button
              type="button"
              aria-expanded={attachOpen}
              aria-label="Attach file"
              onClick={() => setAttachOpen((open) => !open)}
              className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-(--bg-card-hover) text-(--text-primary) transition-colors"
            >
              <Paperclip className="h-3.5 w-3.5" strokeWidth={1.8} />
            </button>

            <input
              type="text"
              value={text}
              onChange={(event) => setText(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === "Enter" && hasText) {
                  event.preventDefault();
                  sendMessage();
                }
              }}
              placeholder="Type your message..."
              className="min-w-0 flex-1 bg-transparent text-[11px] text-(--text-primary) placeholder:text-(--text-muted) focus:outline-none"
            />

            <button
              type="button"
              aria-label={hasText ? "Send message" : "Record audio"}
              onClick={() => {
                if (hasText) sendMessage();
              }}
              className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-(--bg-card-hover) text-(--text-primary) transition-colors"
            >
              {hasText ? (
                <Send className="h-3.5 w-3.5" strokeWidth={2} />
              ) : (
                <Mic className="h-3.5 w-3.5" strokeWidth={2} />
              )}
            </button>
          </div>

          <input
            ref={photoInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handlePhotoSelect}
          />
          <input
            ref={documentInputRef}
            type="file"
            accept=".pdf,.doc,.docx,.txt,.xls,.xlsx,.ppt,.pptx,application/pdf,application/msword"
            className="hidden"
            onChange={handleDocumentSelect}
          />
        </div>

        {showServicePicker ? (
          <ChatServicePicker
            onClose={() => setShowServicePicker(false)}
            onSend={handleSendServices}
          />
        ) : null}
      </div>
    </section>
  );
}
