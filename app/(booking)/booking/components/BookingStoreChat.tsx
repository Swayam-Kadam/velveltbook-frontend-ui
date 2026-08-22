"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { ArrowLeft, CheckCheck, FileText, ImageIcon, Plus, Send } from "lucide-react";
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

export function BookingStoreChat({
  storeName,
  storeImage,
  onBack,
}: BookingStoreChatProps) {
  const [text, setText] = useState("");
  const [attachOpen, setAttachOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([    {
      id: "welcome",
      text: `Hi! Thanks for your booking with ${storeName}. How can we help?`,
      time: "now",
      outgoing: false,
    },
  ]);
  const listRef = useRef<HTMLDivElement>(null);
  const attachRef = useRef<HTMLDivElement>(null);
  const photoInputRef = useRef<HTMLInputElement>(null);
  const documentInputRef = useRef<HTMLInputElement>(null);

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
        attachRef.current &&
        !attachRef.current.contains(event.target as Node)
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
        time: "now",
        outgoing: true,
      },
    ]);
    setText("");
  };

  const sendAttachment = (label: string) => {
    setMessages((current) => [
      ...current,
      {
        id: `out-${Date.now()}`,
        text: label,
        time: "now",
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

  return (    <section className="overflow-hidden rounded-xl border border-(--border) bg-(--bg-card)">
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
        className="h-[280px] space-y-3 overflow-y-auto bg-(--bg-secondary) px-2.5 py-3"
      >
        {messages.map((message) =>
          message.outgoing ? (
            <div key={message.id} className="flex justify-end">
              <div className="max-w-[80%] rounded-2xl rounded-br-sm bg-[#2D1659] px-3 py-2 text-white">
                <p className="text-[12px] leading-relaxed">{message.text}</p>
                <span className="mt-1 flex items-center justify-end gap-1 text-[9px] text-white/70">
                  {message.time}
                  <CheckCheck size={12} />
                </span>
              </div>
            </div>
          ) : (
            <div key={message.id} className="flex items-end gap-1.5">
              <div className="relative h-6 w-6 shrink-0 overflow-hidden rounded-full">
                <Image
                  src={storeImage}
                  alt={storeName}
                  fill
                  sizes="24px"
                  className="object-cover"
                />
              </div>
              <div className="max-w-[80%] rounded-2xl rounded-bl-sm bg-white px-3 py-2">
                <p className="text-[12px] leading-relaxed text-(--text-primary)">
                  {message.text}
                </p>
                <span className="mt-1 block text-right text-[9px] text-(--text-muted)">
                  {message.time}
                </span>
              </div>
            </div>
          ),
        )}
      </div>

      <div className="flex items-center gap-2 border-t border-(--border) p-2">
        <div className="relative min-w-0 flex-1 ">
          <input
            type="text"
            value={text}
            onChange={(event) => setText(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === "Enter") sendMessage();
            }}
            placeholder="Type a message..."
            className="h-10 w-full max-w-full min-w-0 rounded-lg border border-(--border) bg-(--bg-primary) pr-3 text-[12px] text-(--text-primary) outline-none"
            style={{
              paddingLeft: "35px",
            }}
          />

          <div ref={attachRef} className="absolute left-1 top-1/2 -translate-y-1/2">
            <button
              type="button"
              onClick={() => setAttachOpen((current) => !current)}
              aria-label="Attach file"
              aria-expanded={attachOpen}
              className="flex h-7 w-7 items-center justify-center rounded-md text-(--text-primary)   transition-colors hover:bg-(--bg-secondary) hover:text-(--text-primary)"
            >
              <Plus size={20} />
            </button>

            {attachOpen && (
              <div
                className="absolute bottom-full left-0 z-20 mb-1.5 min-w-[140px] overflow-hidden rounded-xl border border-(--border) bg-(--bg-card) py-1 shadow-(--shadow-card)"
                role="menu"
              >
                <button
                  type="button"
                  role="menuitem"
                  onClick={() => photoInputRef.current?.click()}
                  className="flex w-full items-center gap-2.5 px-3 py-2.5 text-left text-[12px] font-medium text-(--text-primary) transition-colors hover:bg-(--bg-secondary)"
                >
                  <ImageIcon size={15} className="text-(--accent-primary)" />
                  Photos
                </button>
                <button
                  type="button"
                  role="menuitem"
                  onClick={() => documentInputRef.current?.click()}
                  className="flex w-full items-center gap-2.5 px-3 py-2.5 text-left text-[12px] font-medium text-(--text-primary) transition-colors hover:bg-(--bg-secondary)"
                >
                  <FileText size={15} className="text-(--accent-primary)" />
                  Document
                </button>
              </div>
            )}

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
        </div>        <button
          type="button"
          onClick={sendMessage}
          aria-label="Send message"
          className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#2D1659] text-white"
        >
          <Send size={14} />
        </button>
      </div>
    </section>
  );
}
