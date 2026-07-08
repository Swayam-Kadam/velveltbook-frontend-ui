"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useRef, useEffect, useState, type ComponentType } from "react";
import {
  ArrowLeft,
  BadgeCheck,
  Bell,
  CheckCheck,
  ChevronDown,
  ChevronRight,
  CircleUserRound,
  EllipsisVertical,
  File,
  Globe,
  Image as ImageIcon,
  MapPin,
  Mic,
  MessageCircle,
  MessageCircleMore,
  Plus,
  Paperclip,
  Phone,
  Search,
  Send,
  Star,
  Store,
  Tag,
} from "lucide-react";

import { SearchBar } from "@/components/header/SearchBar";
import {
  formatStoreMeta,
  formatStoreStatus,
  getServiceCategoryConversations,
  getServiceCategoryStoreById,
  getServiceCategoryStores,
  getServiceCategoryTab,
  getServiceCategoryUnreadCount,
  serviceCategoryFilterOptions,
  serviceCategoryFilters,
  serviceCategoryTabs,
  type ServiceCategoryFilterId,
  type ServiceCategoryConversation,
  type ServiceCategoryStore,
} from "../service-category.data";
import {
  ChatServicePicker,
  formatSelectedServicesMessage,
} from "../ChatServicePicker";

type ContentView = "store" | "messages";

interface ServiceCategoryPageContentProps {
  categoryId: string;
}

function FilterChip({
  icon: Icon,
  label,
  value,
  options,
  isOpen,
  onOpenChange,
  onSelect,
}: {
  icon: ComponentType<{ className?: string; strokeWidth?: number }>;
  label: string;
  value: string;
  options: readonly string[];
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onSelect: (option: string) => void;
}) {
  const chipRef = useRef<HTMLDivElement>(null);
  const [menuRect, setMenuRect] = useState<{ top: number; left: number; width: number } | null>(
    null,
  );

  const updateMenuRect = () => {
    if (!chipRef.current) return;
    const rect = chipRef.current.getBoundingClientRect();
    setMenuRect({
      top: rect.bottom + 4,
      left: rect.left,
      width: rect.width,
    });
  };

  useEffect(() => {
    if (!isOpen) {
      setMenuRect(null);
      return;
    }

    updateMenuRect();

    const handleScrollOrResize = () => updateMenuRect();
    window.addEventListener("scroll", handleScrollOrResize, true);
    window.addEventListener("resize", handleScrollOrResize);

    return () => {
      window.removeEventListener("scroll", handleScrollOrResize, true);
      window.removeEventListener("resize", handleScrollOrResize);
    };
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;

    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;
      if (chipRef.current?.contains(target)) return;
      if (
        target instanceof Element &&
        target.closest("[data-service-category-filter-menu]")
      ) {
        return;
      }
      onOpenChange(false);
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen, onOpenChange]);

  return (
    <>
      <div ref={chipRef} className="relative shrink-0">
        <button
          type="button"
          aria-expanded={isOpen}
          aria-haspopup="listbox"
          onClick={() => onOpenChange(!isOpen)}
          className={`
            search-glass flex min-w-[88px] items-center gap-1.5 rounded-xl
            border px-2 py-1.5 text-left shadow-(--shadow-card)
            sm:min-w-[110px] sm:gap-2 sm:rounded-2xl sm:px-3 sm:py-2
            lg:min-w-[132px]
            ${isOpen ? "border-(--accent-primary)" : ""}
          `}
        >
          <span className="flex h-6 w-6 items-center justify-center rounded-full bg-(--bg-card-hover) sm:h-8 sm:w-8">
            <Icon className="h-3 w-3 text-(--text-primary) sm:h-4 sm:w-4" strokeWidth={1.6} />
          </span>
          <span className="min-w-0 flex-1">
            <span className="block text-[8px] text-(--text-secondary) sm:text-[10px] lg:text-[11px]">
              {label}
            </span>
            <span className="block truncate text-[9px] text-(--text-primary) sm:text-[11px] lg:text-xs">
              {value}
            </span>
          </span>
          <ChevronDown
            className={`h-3 w-3 text-(--text-secondary) transition-transform sm:h-4 sm:w-4 ${isOpen ? "rotate-180" : ""}`}
            strokeWidth={1.8}
          />
        </button>
      </div>

      {isOpen && menuRect && (
        <div
          data-service-category-filter-menu
          role="listbox"
          aria-label={label}
          style={{
            top: menuRect.top,
            left: menuRect.left,
            minWidth: menuRect.width,
          }}
          className="
            fixed z-[100] max-h-44 overflow-y-auto overscroll-y-contain
            rounded-xl border border-(--border) bg-(--bg-card) py-1 shadow-(--shadow-card)
            sm:max-h-52 sm:rounded-2xl
          "
        >
          {options.map((option) => (
            <button
              key={option}
              type="button"
              role="option"
              aria-selected={value === option}
              onClick={() => {
                onSelect(option);
                onOpenChange(false);
              }}
              className={`
                block w-full truncate px-3 py-1.5 text-left text-[9px] transition-colors
                hover:bg-(--bg-card-hover) sm:py-2 sm:text-[11px] lg:text-xs
                ${value === option ? "font-medium text-(--accent-primary)" : "text-(--text-primary)"}
              `}
            >
              {option}
            </button>
          ))}
        </div>
      )}
    </>
  );
}

function CategoryPill({
  id,
  label,
  active,
  icon: Icon,
}: {
  id: string;
  label: string;
  active: boolean;
  icon: ComponentType<{ className?: string; strokeWidth?: number }>;
}) {
  return (
    <Link
      href={`/service-category/${id}`}
      className="group flex w-[52px] shrink-0 flex-col items-center gap-1 sm:w-[60px] sm:gap-1.5 lg:w-auto lg:gap-2"
    >
      <span
        className={`
          flex h-[38px] w-[38px] items-center justify-center rounded-full border
          transition-all duration-300
          lg:h-14 lg:w-14
          ${
            active
              ? "primary-button border-(--brand-gold) text-white shadow-(--shadow-glow)"
              : "bg-(--bg-card) border-(--border) text-(--text-secondary)"
          }
        `}
      >
        <Icon
          className={`h-4 w-4 lg:h-5 lg:w-5 ${active ? "text-(--brand-gold-light)" : ""}`}
          strokeWidth={1.6}
        />
      </span>
      <span
        className={`
          text-center text-[9px] font-medium leading-tight sm:text-[10px] lg:text-[11px]
          ${active ? "text-(--text-primary)" : "text-(--text-secondary)"}
        `}
      >
        {label}
      </span>
      {active && (
        <span className="h-0.5 w-5 rounded-full bg-(--accent-primary) lg:w-6" />
      )}
    </Link>
  );
}

function TopSectionTabs({
  activeView,
  unreadCount,
  onChange,
}: {
  activeView: ContentView;
  unreadCount: number;
  onChange: (view: ContentView) => void;
}) {
  return (
    <div className="grid grid-cols-2 border-b border-(--border)">
      {[
        { id: "store", label: "STORE", icon: Store },
        { id: "messages", label: "MESSAGES", icon: MessageCircleMore },
      ].map((item) => {
        const active = activeView === item.id;
        const Icon = item.icon;
        const showUnread = item.id === "messages" && unreadCount > 0;

        return (
          <button
            key={item.id}
            type="button"
            onClick={() => onChange(item.id as ContentView)}
            className={`
              relative flex items-center justify-center gap-1.5 px-3 py-2.5
              text-[11px] tracking-wide transition-colors duration-200
              sm:gap-2 sm:py-3 sm:text-xs lg:text-sm
              ${active ? "text-(--text-primary)" : "text-(--text-secondary)"}
            `}
          >
            <Icon className="h-3.5 w-3.5 sm:h-4 sm:w-4" strokeWidth={1.8} />
            <span>{item.label}</span>
            {showUnread && (
              <span className="flex h-4 min-w-4 items-center justify-center rounded-full bg-(--accent-primary) px-1 text-[8px] font-bold text-white sm:h-5 sm:min-w-5 sm:text-[10px]">
                {unreadCount}
              </span>
            )}
            {active && (
              <span className="absolute inset-x-4 bottom-0 h-[2px] rounded-full bg-(--accent-primary) sm:inset-x-6" />
            )}
          </button>
        );
      })}
    </div>
  );
}

function StoreCard({
  store,
  onMessage,
}: {
  store: ServiceCategoryStore;
  onMessage: (store: ServiceCategoryStore) => void;
}) {
  return (
    <article className="search-glass overflow-hidden rounded-2xl border p-1.5 shadow-(--shadow-card) sm:p-2 lg:rounded-3xl">
      <div className="flex gap-2 sm:gap-3">
        <div className="relative h-[76px] w-[76px] shrink-0 overflow-hidden rounded-xl sm:h-[88px] sm:w-[88px] sm:rounded-2xl lg:h-[100px] lg:w-[100px]">
          <Image
            src={store.image}
            alt={store.name}
            fill
            sizes="100px"
            className="object-cover"
          />
        </div>

        <div className="flex min-w-0 flex-1 gap-1.5 sm:gap-2">
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-1">
              <h3 className="truncate font-[family-name:var(--font-heading)] text-[13px] font-bold text-(--text-primary) sm:text-sm lg:text-lg">
                {store.name}
              </h3>
              {store.isVerified && (
                <BadgeCheck className="h-3 w-3 shrink-0 text-(--accent-primary) sm:h-3.5 sm:w-3.5" strokeWidth={2} />
              )}
            </div>
            <p className="mt-0.5 truncate text-[9px] text-(--text-secondary) sm:text-[10px] lg:text-sm">
              {store.services.join(" • ")}
            </p>
            <div className="mt-1 flex items-start gap-0.5 text-[9px] text-(--text-secondary) sm:mt-1.5 sm:text-[10px] lg:text-sm">
              <MapPin className="mt-0.5 h-2.5 w-2.5 shrink-0 sm:h-3 sm:w-3" strokeWidth={1.8} />
              <span className="line-clamp-1 leading-snug sm:line-clamp-2">{store.address}</span>
            </div>
            <div className="mt-1 flex flex-wrap items-center gap-1 text-[8px] sm:mt-1.5 sm:text-[9px] lg:text-sm">
              <span className="flex items-center gap-0.5 text-(--text-primary)">
                <Star className="h-2.5 w-2.5 fill-(--brand-gold) text-(--brand-gold) sm:h-3 sm:w-3" />
                {formatStoreMeta(store)}
              </span>
              <span className="text-(--text-muted)">|</span>
              <span className="text-(--success)">Open</span>
              <span className="text-(--text-muted)">|</span>
              <span className="text-(--text-secondary)">Closes {store.closesAt}</span>
            </div>
          </div>

          <button
            type="button"
            onClick={() => onMessage(store)}
            className="
              primary-button my-auto min-w-[92px] shrink-0 self-center whitespace-nowrap
              rounded-lg px-3 py-2 text-[8px] tracking-wide text-white
              shadow-(--shadow-glow) transition-opacity hover:opacity-90
              sm:min-w-[104px] sm:rounded-xl sm:px-3.5 sm:py-2.5 sm:text-[9px]
              lg:min-w-[120px] lg:px-4 lg:py-3 lg:text-[10px]
            "
          >
            BOOK ON MESSAGE
          </button>
        </div>
      </div>
    </article>
  );
}

function MessageRow({
  conversation,
  onOpen,
}: {
  conversation: ServiceCategoryConversation;
  onOpen: (store: ServiceCategoryStore) => void;
}) {
  const previewPrefix =
    conversation.lastMessageFrom === "user"
      ? "You:"
      : `${conversation.name}:`;
  const isUnread = conversation.unreadCount > 0;

  return (
    <button
      type="button"
      onClick={() => onOpen(conversation)}
      className={`
        flex w-full items-center gap-2.5 border-b border-(--border) px-2.5 py-3 text-left
        last:border-b-0 sm:gap-3 sm:px-4 sm:py-3.5
        ${isUnread ? "bg-(--message-unread-bg)" : ""}
      `}
    >
      <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-xl sm:h-16 sm:w-16 sm:rounded-2xl">
        <Image
          src={conversation.image}
          alt={conversation.name}
          fill
          sizes="64px"
          className="object-cover"
        />
      </div>

      <div className="min-w-0 flex-1">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-1">
              <h3 className="truncate font-[family-name:var(--font-heading)] text-[13px] font-bold text-(--text-primary) sm:text-sm">
                {conversation.name}
              </h3>
              {conversation.isVerified && (
                <BadgeCheck className="h-3 w-3 shrink-0 text-(--accent-primary) sm:h-3.5 sm:w-3.5" strokeWidth={2} />
              )}
            </div>
            <p className="mt-0.5 truncate text-[9px] text-(--text-secondary) sm:text-[10px]">
              {conversation.services.join(" • ")}
            </p>
            <p className="mt-1 line-clamp-2 text-[10px] leading-snug text-(--text-secondary) sm:text-[11px]">
              <span className="font-semibold text-(--text-primary)">{previewPrefix}</span>{" "}
              {conversation.lastMessagePreview}
            </p>
          </div>

          <div className="flex shrink-0 flex-col items-end gap-1.5">
            <span className="text-[9px] text-(--text-muted) sm:text-[10px]">
              {conversation.lastMessageTime}
            </span>
            <div className="flex items-center gap-1">
              {conversation.unreadCount > 0 && (
                <span className="flex h-4 min-w-4 items-center justify-center rounded-full bg-(--accent-primary) px-1 text-[9px] font-bold text-white sm:h-5 sm:min-w-5 sm:text-[10px]">
                  {conversation.unreadCount}
                </span>
              )}
              <ChevronRight className="h-3.5 w-3.5 text-(--text-muted) sm:h-4 sm:w-4" strokeWidth={2} />
            </div>
          </div>
        </div>
      </div>
    </button>
  );
}

function MessagesHelpBanner() {
  return (
    <div className="mt-4 rounded-xl border border-(--border) bg-(--help-banner-bg) px-3 py-3 sm:mt-6 sm:rounded-2xl sm:px-4 sm:py-4">
      <div className="flex items-center justify-between gap-2 sm:gap-4">
        <div className="flex min-w-0 items-start gap-2 sm:gap-3">
          <MessageCircle className="mt-0.5 h-4 w-4 shrink-0 text-(--accent-primary) sm:h-5 sm:w-5" strokeWidth={1.8} />
          <div className="min-w-0">
            <p className="text-[11px] font-semibold text-(--text-primary) sm:text-sm">
              Can&apos;t find your conversation?
            </p>
            <p className="mt-0.5 text-[9px] text-(--text-secondary) sm:mt-1 sm:text-xs">
              Your past chats are safe and sorted here.
            </p>
          </div>
        </div>
        <button
          type="button"
          className="shrink-0 rounded-lg border border-(--accent-primary) bg-(--help-banner-bg) px-2.5 py-1.5 text-[10px] text-(--accent-primary) sm:rounded-xl sm:px-4 sm:py-2 sm:text-sm"
        >
          Need Help?
        </button>
      </div>
    </div>
  );
}

function EmptyState({ categoryLabel }: { categoryLabel: string }) {
  return (
    <div className="search-glass rounded-2xl border p-6 text-center shadow-(--shadow-card) sm:p-8">
      <h3 className="text-sm font-semibold text-(--text-primary) sm:text-lg">No stores yet</h3>
      <p className="mt-1.5 text-[11px] text-(--text-secondary) sm:mt-2 sm:text-sm">
        We are still curating the best {categoryLabel.toLowerCase()} options near you.
      </p>
    </div>
  );
}

function formatMessageTime(date = new Date()) {
  return date.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
}

type ChatMessage = {
  id: string;
  from: "user" | "store";
  text: string;
  time: string;
};

function getInitialChatMessages(store: ServiceCategoryStore): ChatMessage[] {
  return [
    { id: "intro", from: "user", text: store.chatIntro, time: "10:30 AM" },
    { id: "reply", from: "store", text: store.providerReply, time: store.providerReplyTime },
    { id: "follow-up", from: "user", text: store.userFollowUp, time: store.userFollowUpTime },
    {
      id: "availability",
      from: "store",
      text: store.providerAvailability,
      time: store.providerAvailabilityTime,
    },
  ];
}

function ChatBubble({
  from,
  text,
  time,
  avatarUrl,
  showOnlineDot,
}: {
  from: "user" | "store";
  text: string;
  time: string;
  avatarUrl?: string;
  showOnlineDot?: boolean;
}) {
  const isUser = from === "user";

  return (
    <div className={`flex items-end gap-1.5 sm:gap-2 ${isUser ? "justify-end" : "justify-start"}`}>
      {!isUser && avatarUrl && (
        <div className="relative h-6 w-6 shrink-0 sm:h-7 sm:w-7">
          <div className="relative h-6 w-6 overflow-hidden rounded-full sm:h-7 sm:w-7">
            <Image
              src={avatarUrl}
              alt=""
              fill
              sizes="28px"
              className="object-cover"
            />
          </div>
          {showOnlineDot && (
            <span className="absolute bottom-0 right-0 h-2 w-2 rounded-full border border-(--bg-primary) bg-(--success) sm:h-2.5 sm:w-2.5" />
          )}
        </div>
      )}

      <div className={`flex max-w-[88%] flex-col sm:max-w-[82%] ${isUser ? "items-end" : "items-start"}`}>
        <div
          className={`
            rounded-2xl px-3 py-2 text-[11px] leading-5 sm:rounded-[20px] sm:px-4 sm:py-3 sm:text-sm sm:leading-6
            ${
              isUser
                ? "primary-button rounded-br-sm text-white shadow-(--shadow-glow)"
                : "rounded-bl-sm border border-(--border) bg-(--bg-card) text-(--text-primary) shadow-(--shadow-card)"
            }
          `}
        >
          <span className="whitespace-pre-line">{text}</span>
        </div>
        <div className={`mt-0.5 flex items-center gap-1 px-0.5 sm:mt-1 sm:px-1 ${isUser ? "flex-row-reverse" : ""}`}>
          <span className="text-[9px] text-(--text-muted) sm:text-[11px]">{time}</span>
          {isUser && (
            <CheckCheck className="h-3 w-3 text-(--accent-primary) sm:h-3.5 sm:w-3.5" strokeWidth={2.2} />
          )}
        </div>
      </div>
    </div>
  );
}

const attachmentOptions = [
  { label: "Photo", icon: ImageIcon },
  { label: "File", icon: File },
] as const;

function MessageComposer({ onSend }: { onSend: (text: string) => void }) {
  const [message, setMessage] = useState("");
  const [showAttachments, setShowAttachments] = useState(false);
  const composerRef = useRef<HTMLDivElement>(null);
  const hasText = message.trim().length > 0;

  const sendMessage = () => {
    const trimmed = message.trim();
    if (!trimmed) return;
    onSend(trimmed);
    setMessage("");
    setShowAttachments(false);
  };

  useEffect(() => {
    if (!showAttachments) return;

    const handleClickOutside = (event: MouseEvent) => {
      if (composerRef.current && !composerRef.current.contains(event.target as Node)) {
        setShowAttachments(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [showAttachments]);

  return (
    <div
      ref={composerRef}
      className="relative mt-3 w-full min-w-0 rounded-2xl border border-(--border) bg-(--bg-card) px-2.5 py-2.5 shadow-(--shadow-card) sm:mt-4 sm:rounded-[24px] sm:px-3 sm:py-3"
    >
      {showAttachments && (
        <div
          className="
            absolute bottom-full left-0 z-50 mb-2 min-w-[9.5rem]
            overflow-hidden rounded-xl border border-(--border) bg-(--bg-card)
            py-1 shadow-(--shadow-card)
          "
          role="menu"
        >
          {attachmentOptions.map(({ label, icon: Icon }) => (
            <button
              key={label}
              type="button"
              role="menuitem"
              onClick={() => setShowAttachments(false)}
              className="
                flex w-full items-center gap-2.5 px-3 py-2 text-left text-[11px]
                text-(--text-primary) transition-colors hover:bg-(--bg-card-hover)
                sm:text-xs
              "
            >
              <span className="flex h-7 w-7 items-center justify-center rounded-full bg-(--bg-card-hover) text-(--accent-primary)">
                <Icon className="h-3.5 w-3.5" strokeWidth={1.8} />
              </span>
              {label}
            </button>
          ))}
        </div>
      )}

      <div className="flex min-w-0 items-center gap-1.5 sm:gap-3">
        <button
          type="button"
          aria-expanded={showAttachments}
          aria-label="Attach file"
          onClick={() => setShowAttachments((open) => !open)}
          className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-(--bg-card-hover) text-(--text-primary) transition-colors sm:h-9 sm:w-9"
        >
          <Paperclip className="h-3.5 w-3.5 sm:h-4 sm:w-4" strokeWidth={1.8} />
        </button>

        <input
          type="text"
          value={message}
          onChange={(event) => setMessage(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === "Enter" && hasText) {
              event.preventDefault();
              sendMessage();
            }
          }}
          placeholder="Type your message..."
          className="min-w-0 flex-1 bg-transparent text-[11px] text-(--text-primary) placeholder:text-(--text-muted) focus:outline-none sm:text-sm"
        />

        <button
          type="button"
          aria-label={hasText ? "Send message" : "Record audio"}
          onClick={() => {
            if (hasText) sendMessage();
          }}
          className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-(--bg-card-hover) text-(--text-primary) transition-colors sm:h-9 sm:w-9"
        >
          {hasText ? (
            <Send className="h-3.5 w-3.5 sm:h-4 sm:w-4" strokeWidth={2} />
          ) : (
            <Mic className="h-3.5 w-3.5 sm:h-4 sm:w-4" strokeWidth={2} />
          )}
        </button>
      </div>
    </div>
  );
}

function StoreChatView({
  store,
  onBack,
}: {
  store: ServiceCategoryStore;
  onBack: () => void;
}) {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [messages, setMessages] = useState<ChatMessage[]>(() => getInitialChatMessages(store));
  const [showServicePicker, setShowServicePicker] = useState(false);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSendMessage = (text: string) => {
    setMessages((current) => [
      ...current,
      {
        id: `user-${Date.now()}`,
        from: "user",
        text,
        time: formatMessageTime(),
      },
    ]);
  };

  const handleSendServices = (services: Parameters<typeof formatSelectedServicesMessage>[0]) => {
    setMessages((current) => [
      ...current,
      {
        id: `user-services-${Date.now()}`,
        from: "user",
        text: formatSelectedServicesMessage(services),
        time: formatMessageTime(),
      },
    ]);
    setShowServicePicker(false);
  };

  return (
    <div className="flex h-full min-h-0 w-full min-w-0 max-w-full flex-1 flex-col overflow-hidden">
      <div className="mb-2 flex shrink-0 items-center gap-1.5 sm:mb-3">
        <button
          type="button"
          onClick={onBack}
          className="flex h-7 w-7 items-center justify-center rounded-full border border-(--border) bg-(--bg-card) sm:h-8 sm:w-8"
        >
          <ArrowLeft className="h-3.5 w-3.5 text-(--text-primary)" strokeWidth={2} />
        </button>

        <span className="text-[10px] text-(--text-secondary) sm:text-xs">Back to conversation</span>
      </div>

      <div className="flex h-0 min-h-0 w-full min-w-0 max-w-full flex-1 flex-col overflow-hidden rounded-xl border border-(--border) bg-(--bg-primary) shadow-(--shadow-card) sm:rounded-2xl lg:h-auto lg:max-h-none">
        <div className="relative h-16 w-full shrink-0 sm:h-20 lg:h-24">
          <Image
            src={store.heroImage}
            alt={store.name}
            fill
            sizes="600px"
            className="object-cover"
            priority
          />

          <span className="absolute top-1.5 left-1.5 h-2.5 w-2.5 rounded-full border-2 border-(--bg-primary) bg-(--success) sm:top-2 sm:left-2 sm:h-3 sm:w-3" />

          <div className="absolute top-1.5 right-1.5 sm:top-2 sm:right-2">
            <span className="primary-button inline-flex items-center rounded-full px-1.5 py-0.5 text-[7px] font-medium text-white shadow-(--shadow-glow) backdrop-blur-sm sm:px-2 sm:py-1 sm:text-[8px]">
              {formatStoreStatus(store)}
            </span>
          </div>
        </div>

        <div className="flex min-h-0 w-full min-w-0 max-w-full flex-1 flex-col px-2 py-2 sm:px-3 sm:py-2.5 lg:p-4">
          <div className="w-full min-w-0 shrink-0">
            <div className="flex min-w-0 items-start gap-2">
            <div className="relative -mt-9 h-14 w-14 shrink-0 sm:-mt-10 sm:h-[4.5rem] sm:w-[4.5rem]">
              <div className="relative h-14 w-14 overflow-hidden rounded-xl border-2 border-(--bg-primary) shadow-(--shadow-card) sm:h-[4.5rem] sm:w-[4.5rem] sm:rounded-2xl sm:border-[3px]">
                <Image
                  src={store.image}
                  alt={store.name}
                  fill
                  sizes="64px"
                  className="object-cover"
                />
              </div>
            </div>

            <div className="min-w-0 flex-1 pt-0.5">
              <div className="flex items-center gap-1">
                <h2 className="truncate font-[family-name:var(--font-heading)] text-sm font-bold text-(--text-primary) sm:text-base">
                  {store.name}
                </h2>
                {store.isVerified && (
                  <BadgeCheck className="h-3.5 w-3.5 shrink-0 text-(--accent-primary)" strokeWidth={2} />
                )}
              </div>
              <p className="mt-0.5 truncate text-[9px] text-(--text-secondary) sm:text-[10px]">
                {store.services.join(" • ")}
              </p>
              <p className="mt-0.5 flex items-center gap-0.5 text-[9px] text-(--text-secondary) sm:text-[10px]">
                <MapPin className="h-2.5 w-2.5 shrink-0" strokeWidth={1.8} />
                <span className="truncate">{store.address}</span>
              </p>
            </div>

            <div className="flex shrink-0 flex-col gap-1 pt-0.5">
              <button
                type="button"
                className="flex items-center gap-1 rounded-full border border-(--border) bg-(--bg-primary) px-2 py-1 text-[7px] text-(--text-primary) shadow-[inset_0_0_0_1px_var(--border)] sm:px-2.5 sm:py-1.5 sm:text-[8px]"
              >
                <Phone className="h-2.5 w-2.5 shrink-0 text-(--accent-primary) sm:h-3 sm:w-3" />
                <span className="whitespace-nowrap">Flexible Booking</span>
              </button>
              <button
                type="button"
                className="flex items-center gap-1 rounded-full border border-(--border) bg-(--bg-primary) px-2 py-1 text-[7px] text-(--text-primary) shadow-[inset_0_0_0_1px_var(--border)] sm:px-2.5 sm:py-1.5 sm:text-[8px]"
              >
                <Bell className="h-2.5 w-2.5 shrink-0 text-(--accent-primary) sm:h-3 sm:w-3" />
                <span className="whitespace-nowrap">Secure & Private</span>
              </button>
            </div>
          </div>

          <div className="mt-2 flex min-w-0 gap-1.5 sm:mt-2.5 sm:gap-2">
            <button
              type="button"
              className="min-w-0 flex-1 rounded-lg border border-(--border) bg-(--bg-card-hover) px-1.5 py-1.5 text-[8px] text-(--text-primary) sm:px-3 sm:py-2 sm:text-[10px]"
            >
              View Profile
            </button>
            <button
              type="button"
              className="primary-button flex min-w-0 flex-1 items-center justify-center gap-1 rounded-lg px-1.5 py-1.5 text-[8px] text-white sm:px-3 sm:py-2 sm:text-[10px]"
            >
              <MessageCircleMore className="h-3 w-3 shrink-0" strokeWidth={1.8} />
              <span className="truncate sm:hidden">Message</span>
              <span className="hidden truncate sm:inline">Message & Negotiate</span>
            </button>
          </div>
          </div>

          <div className="mt-2 min-h-0 w-full min-w-0 flex-1 overflow-x-hidden overflow-y-auto overscroll-y-contain scrollbar-none sm:mt-2.5">
            <div className="space-y-2.5 pb-1 sm:space-y-3">
              <p className="text-center text-[9px] text-(--text-muted) sm:text-xs">Today</p>
              {messages.map((chatMessage) => (
                <ChatBubble
                  key={chatMessage.id}
                  from={chatMessage.from}
                  text={chatMessage.text}
                  time={chatMessage.time}
                  avatarUrl={chatMessage.from === "store" ? store.image : undefined}
                  showOnlineDot={chatMessage.from === "store"}
                />
              ))}
              <div ref={messagesEndRef} />
            </div>
          </div>

          <div className="relative w-full min-w-0 shrink-0 pt-3 sm:pt-4">
            <button
              type="button"
              aria-label="Open services menu"
              onClick={() => setShowServicePicker(true)}
              className="primary-button absolute -top-4 right-0 z-10 flex h-9 w-9 items-center justify-center rounded-full text-white shadow-(--shadow-glow) sm:-top-5 sm:h-10 sm:w-10"
            >
              <Plus className="h-[18px] w-[18px] sm:h-5 sm:w-5" strokeWidth={2.2} />
            </button>

            <MessageComposer onSend={handleSendMessage} />

            {showServicePicker && (
              <ChatServicePicker
                onClose={() => setShowServicePicker(false)}
                onSend={handleSendServices}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export function ServiceCategoryPageContent({
  categoryId,
}: ServiceCategoryPageContentProps) {
  const [activeView, setActiveView] = useState<ContentView>("store");
  const [chatStoreId, setChatStoreId] = useState<string | null>(null);
  const [filterValues, setFilterValues] = useState<Record<ServiceCategoryFilterId, string>>(() =>
    Object.fromEntries(
      serviceCategoryFilters.map((filter) => [filter.id, filter.value]),
    ) as Record<ServiceCategoryFilterId, string>,
  );
  const [openFilterId, setOpenFilterId] = useState<ServiceCategoryFilterId | null>(null);

  const activeCategory = getServiceCategoryTab(categoryId);
  const stores = useMemo(
    () => getServiceCategoryStores(activeCategory.id),
    [activeCategory.id],
  );
  const conversations = useMemo(() => getServiceCategoryConversations(), []);
  const unreadCount = useMemo(() => getServiceCategoryUnreadCount(), []);
  const chatStore = chatStoreId ? getServiceCategoryStoreById(chatStoreId) : null;

  const openChat = (store: ServiceCategoryStore) => {
    setChatStoreId(store.id);
  };

  const closeChat = () => {
    setChatStoreId(null);
  };

  const openChatFromStore = (store: ServiceCategoryStore) => {
    setChatStoreId(store.id);
  };

  const showSearchAndFilters = activeView === "store" && !chatStore;

  return (
    <main
      className={`
        mx-auto w-full max-w-[1600px] px-2 pb-24 lg:px-5 lg:pb-8
        ${chatStore ? "max-w-full overflow-x-hidden pb-0 lg:pb-8" : ""}
      `}
    >
      <div
        className={`mx-auto max-w-[1120px] ${chatStore ? "lg:flex lg:min-h-0 lg:flex-1 lg:flex-col" : ""}`}
      >
        {showSearchAndFilters && (
          <>
            <div className="lg:hidden">
              <SearchBar
                className="mt-0 h-10 gap-2 rounded-xl px-3 sm:h-12 sm:rounded-2xl sm:px-5"
                placeholder="Search services, salons, spas, experts..."
              />
            </div>

            <div className="relative mt-2 sm:mt-3 lg:mt-4">
              <div className="flex gap-1.5 overflow-x-auto pb-1 scrollbar-none sm:gap-2 lg:gap-3">
                {serviceCategoryFilters.map((filter) => {
                  const iconMap = {
                    suburbs: MapPin,
                    languages: Globe,
                    price: Tag,
                    nationalities: CircleUserRound,
                  };

                  return (
                    <FilterChip
                      key={filter.id}
                      icon={iconMap[filter.id]}
                      label={filter.label}
                      value={filterValues[filter.id]}
                      options={serviceCategoryFilterOptions[filter.id]}
                      isOpen={openFilterId === filter.id}
                      onOpenChange={(open) => setOpenFilterId(open ? filter.id : null)}
                      onSelect={(option) =>
                        setFilterValues((current) => ({ ...current, [filter.id]: option }))
                      }
                    />
                  );
                })}
              </div>
            </div>
          </>
        )}

        <section
          className={`
            mt-3 overflow-hidden rounded-2xl border border-(--border) bg-(--bg-primary)
            shadow-(--shadow-card) sm:mt-4 sm:rounded-3xl lg:mt-5 lg:rounded-[32px]
            ${chatStore
              ? "fixed left-2 right-2 top-[4.75rem] bottom-[5.25rem] z-40 mx-auto mt-0 flex w-auto max-w-[calc(100vw-1rem)] min-w-0 flex-col overflow-x-hidden sm:rounded-3xl lg:static lg:inset-auto lg:z-auto lg:mx-0 lg:mt-5 lg:w-full lg:max-w-none lg:flex-none lg:min-h-[min(720px,calc(100dvh-12rem))]"
              : ""}
          `}
        >
          <div className={chatStore ? "hidden lg:block" : ""}>
            <TopSectionTabs
              activeView={activeView}
              unreadCount={unreadCount}
              onChange={(view) => {
                closeChat();
                setActiveView(view);
              }}
            />
          </div>

          <div
            className={`
              p-2 sm:p-4 lg:p-6
              ${chatStore ? "flex min-h-0 w-full min-w-0 flex-1 flex-col overflow-hidden" : ""}
            `}
          >
            {chatStore ? (
              <StoreChatView key={chatStore.id} store={chatStore} onBack={closeChat} />
            ) : activeView === "store" ? (
              <>
                <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none sm:gap-3 sm:pb-2 lg:gap-4">
                  {serviceCategoryTabs.map((category) => (
                    <CategoryPill
                      key={category.id}
                      id={category.id}
                      label={category.label}
                      active={category.id === activeCategory.id}
                      icon={category.icon}
                    />
                  ))}
                </div>

                <div className="mt-3 flex items-center justify-between sm:mt-4 lg:mt-5">
                  <h1 className="font-[family-name:var(--font-heading)] text-[15px] font-bold text-(--text-primary) sm:text-lg lg:text-[28px]">
                    {activeCategory.label} Shops Near You
                  </h1>

                  <button
                    type="button"
                    className="flex items-center gap-0.5 text-[10px] text-(--accent-primary) sm:text-xs lg:text-sm"
                  >
                    <span>See All</span>
                    <ChevronRight className="h-3 w-3 sm:h-3.5 sm:w-3.5" strokeWidth={2.5} />
                  </button>
                </div>

                <div className="mt-2.5 space-y-2 sm:mt-3 sm:space-y-3 lg:mt-5 lg:space-y-4">
                  {stores.length > 0 ? (
                    stores.map((store) => (
                      <StoreCard
                        key={store.id}
                        store={store}
                        onMessage={openChatFromStore}
                      />
                    ))
                  ) : (
                    <EmptyState categoryLabel={activeCategory.label} />
                  )}
                </div>
              </>
            ) : (
              <div>
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <div className="flex items-center gap-1.5">
                      <h1 className="font-[family-name:var(--font-heading)] text-[15px] font-bold text-(--text-primary) sm:text-lg lg:text-[28px]">
                        Messages
                      </h1>
                      <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-(--accent-primary) px-1.5 text-[10px] font-bold text-white sm:h-6 sm:min-w-6 sm:px-2 sm:text-xs">
                        {conversations.length}
                      </span>
                    </div>
                    <p className="mt-0.5 text-[10px] text-(--text-secondary) sm:mt-1 sm:text-xs lg:text-sm">
                      Your conversations with stores and professionals.
                    </p>
                  </div>

                  <button
                    type="button"
                    aria-label="Message options"
                    className="flex h-8 w-8 shrink-0 items-center justify-center text-(--text-secondary) sm:h-10 sm:w-10"
                  >
                    <EllipsisVertical className="h-4 w-4 sm:h-5 sm:w-5" strokeWidth={1.8} />
                  </button>
                </div>

                <div className="mt-2.5 sm:mt-3 lg:mt-4">
                  <div className="search-glass flex h-9 items-center gap-2 rounded-xl border px-3 shadow-(--shadow-card) sm:h-10 sm:gap-3 sm:rounded-2xl sm:px-4">
                    <Search className="h-3.5 w-3.5 text-(--text-secondary) sm:h-4 sm:w-4" strokeWidth={1.8} />
                    <input
                      type="text"
                      placeholder="Search messages..."
                      className="flex-1 bg-transparent text-[11px] text-(--text-primary) placeholder:text-(--text-muted) focus:outline-none sm:text-sm"
                    />
                  </div>
                </div>

                <div className="-mx-2.5 mt-1 sm:-mx-4 sm:mt-2">
                  {conversations.map((conversation) => (
                    <MessageRow
                      key={conversation.id}
                      conversation={conversation}
                      onOpen={openChat}
                    />
                  ))}
                </div>

                <MessagesHelpBanner />
              </div>
            )}
          </div>
        </section>
      </div>
    </main>
  );
}
