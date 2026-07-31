"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import {
  ArrowRight,
  BadgeCheck,
  CalendarDays,
  Camera,
  CheckCheck,
  ChevronLeft,
  ChevronRight,
  Image as ImageIcon,
  MapPin,
  Mic,
  Navigation,
  Paperclip,
  PlayCircle,
  Send,
  Settings2,
  Share2,
  ShoppingCart,
  Star,
} from "lucide-react";

import { TimingsDropdown } from "@/components/TimingsDropdown";
import { CategorySidebar } from "@/menu/components/CategorySidebar";
import { MenuProductCard } from "@/menu/components/MenuProductCard";
import { ServiceCard } from "@/menu/components/ServiceCard";
import {
  SERVICES_PER_PAGE,
  allMenuProducts,
  allMenuServices,
  getProductsByCategory,
  getServicesByCategory,
  getTotalPages,
  menuCategories,
  paginateProducts,
  paginateServices,
} from "@/menu/menu.data";
import { type ServiceCategoryStore } from "../service-category.data";

type ChatMessage = {
  id: string;
  from: "user" | "store";
  text: string;
  time: string;
};

type MenuCatalogTab = "service" | "product";

const DISTANCES = [
  "2.1 km away",
  "3.4 km away",
  "1.8 km away",
  "4.2 km away",
  "2.9 km away",
];

function parsePrice(price: string) {
  return Number(price.replace(/[^0-9.]/g, "")) || 0;
}

function formatMoney(amount: number) {
  return `$${amount.toFixed(2)}`;
}

function formatMessageTime(date = new Date()) {
  return date.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
}

function getInitialChatMessages(store: ServiceCategoryStore): ChatMessage[] {
  return [
    { id: "intro", from: "user", text: store.chatIntro, time: "10:30 AM" },
    {
      id: "reply",
      from: "store",
      text: store.providerReply,
      time: store.providerReplyTime,
    },
    {
      id: "follow-up",
      from: "user",
      text: store.userFollowUp,
      time: store.userFollowUpTime,
    },
    {
      id: "availability",
      from: "store",
      text: store.providerAvailability,
      time: store.providerAvailabilityTime,
    },
  ];
}

function MenuCatalogTabs({
  active,
  onChange,
}: {
  active: MenuCatalogTab;
  onChange: (tab: MenuCatalogTab) => void;
}) {
  return (
    <div className="mb-3 flex items-center justify-between gap-3">
      <div
        className="inline-flex rounded-full border border-(--border) bg-(--bg-secondary) p-0.5"
        role="tablist"
        aria-label="Catalog type"
      >
        {([
          { id: "service", label: "Service" },
          { id: "product", label: "Product" },
        ] as const).map((tab) => {
          const isActive = active === tab.id;

          return (
            <button
              key={tab.id}
              type="button"
              role="tab"
              aria-selected={isActive}
              onClick={() => onChange(tab.id)}
              className={`
                min-w-[84px] rounded-full px-3.5 py-1.5 text-[13px] font-semibold
                transition-all duration-200
                ${
                  isActive
                    ? "bg-(--bg-card) text-(--text-primary) shadow-(--shadow-card) ring-1 ring-(--brand-gold)"
                    : "text-(--text-muted) hover:text-(--text-primary)"
                }
              `}
            >
              {tab.label}
            </button>
          );
        })}
      </div>

      <button
        type="button"
        className="inline-flex items-center gap-1 text-[13px] font-medium text-(--brand-gold) transition-opacity hover:opacity-80"
      >
        <span>Select</span>
        <ArrowRight size={15} />
      </button>
    </div>
  );
}

interface DesktopNegotiationPageProps {
  stores: ServiceCategoryStore[];
  selectedStore: ServiceCategoryStore;
  onSelectStore: (store: ServiceCategoryStore) => void;
}

export function DesktopNegotiationPage({
  stores,
  selectedStore,
  onSelectStore,
}: DesktopNegotiationPageProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [messages, setMessages] = useState<ChatMessage[]>(() =>
    getInitialChatMessages(selectedStore),
  );
  const [draft, setDraft] = useState("");
  const [menuTab, setMenuTab] = useState<MenuCatalogTab>("service");
  const [activeCategory, setActiveCategory] = useState("massage");
  const [page, setPage] = useState(1);
  const [selectedServiceIds, setSelectedServiceIds] = useState<string[]>([]);
  const [selectedProductIds, setSelectedProductIds] = useState<string[]>([]);

  useEffect(() => {
    setMessages(getInitialChatMessages(selectedStore));
  }, [selectedStore.id]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    setPage(1);
  }, [activeCategory, menuTab]);

  const categoryServices = useMemo(
    () => getServicesByCategory(activeCategory),
    [activeCategory],
  );
  const categoryProducts = useMemo(
    () => getProductsByCategory(activeCategory),
    [activeCategory],
  );

  const catalogItems =
    menuTab === "service" ? categoryServices : categoryProducts;
  const totalPages = getTotalPages(catalogItems.length);
  const visiblePage = Math.min(page, totalPages);

  const paginatedServices = useMemo(
    () => paginateServices(categoryServices, visiblePage),
    [categoryServices, visiblePage],
  );
  const paginatedProducts = useMemo(
    () => paginateProducts(categoryProducts, visiblePage, SERVICES_PER_PAGE),
    [categoryProducts, visiblePage],
  );

  const activeCategoryLabel =
    menuCategories.find((c) => c.id === activeCategory)?.label ?? "Services";

  const categorySelectedCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    const ids =
      menuTab === "service" ? selectedServiceIds : selectedProductIds;
    const source =
      menuTab === "service" ? allMenuServices : allMenuProducts;

    for (const id of ids) {
      const item = source.find((entry) => entry.id === id);
      if (item) {
        counts[item.categoryId] = (counts[item.categoryId] ?? 0) + 1;
      }
    }
    return counts;
  }, [menuTab, selectedProductIds, selectedServiceIds]);

  const selectedServices = useMemo(
    () =>
      selectedServiceIds
        .map((id) => allMenuServices.find((service) => service.id === id))
        .filter(Boolean),
    [selectedServiceIds],
  );

  const selectedProducts = useMemo(
    () =>
      selectedProductIds
        .map((id) => allMenuProducts.find((product) => product.id === id))
        .filter(Boolean),
    [selectedProductIds],
  );

  const servicesTotal = selectedServices.reduce(
    (sum, service) => sum + parsePrice(service!.price),
    0,
  );
  const productsTotal = selectedProducts.reduce(
    (sum, product) => sum + parsePrice(product!.price),
    0,
  );
  const cartCount =
    menuTab === "service"
      ? selectedServiceIds.length
      : selectedProductIds.length;
  const cartTotal = menuTab === "service" ? servicesTotal : productsTotal;

  const timingSummary = `${selectedStore.opensAt} - ${selectedStore.closesAt}`;

  const handleSend = () => {
    const text = draft.trim();
    if (!text) return;
    setMessages((current) => [
      ...current,
      {
        id: `user-${Date.now()}`,
        from: "user",
        text,
        time: formatMessageTime(),
      },
    ]);
    setDraft("");
  };

  const toggleService = (id: string) => {
    setSelectedServiceIds((current) =>
      current.includes(id)
        ? current.filter((item) => item !== id)
        : [...current, id],
    );
  };

  const toggleProduct = (id: string) => {
    setSelectedProductIds((current) =>
      current.includes(id)
        ? current.filter((item) => item !== id)
        : [...current, id],
    );
  };

  return (
    <div className="hidden lg:grid lg:h-[calc(100dvh-7.5rem)] lg:min-h-[720px] lg:grid-cols-[280px_minmax(0,1fr)_440px] lg:gap-4 xl:grid-cols-[300px_minmax(0,1fr)_500px] xl:gap-5">
      {/* ========== LEFT: Suggestions ========== */}
      <aside className="flex min-h-0 flex-col overflow-hidden rounded-[22px] border border-(--border) bg-(--bg-card) shadow-[var(--shadow-card)]">
        <div className="flex shrink-0 items-center justify-between px-4 pt-4 pb-3">
          <h2 className="font-[family-name:var(--font-heading)] text-[22px] font-semibold text-(--text-primary)">
            Suggestions
          </h2>
          <button
            type="button"
            aria-label="Filter suggestions"
            className="flex h-9 w-9 items-center justify-center rounded-xl border border-(--border) text-(--text-muted) transition-colors hover:text-(--text-primary)"
          >
            <Settings2 size={16} />
          </button>
        </div>

        <div className="min-h-0 flex-1 space-y-3 overflow-y-auto px-3 pb-2 scrollbar-none">
          {stores.map((store, index) => {
            const active = store.id === selectedStore.id;
            const distance = DISTANCES[index % DISTANCES.length];

            return (
              <article
                key={store.id}
                className={`
                  rounded-2xl border bg-(--bg-card) p-3 transition-all
                  ${
                    active
                      ? "border-(--accent-primary) shadow-(--shadow-glow)"
                      : "border-(--border) hover:border-(--accent-primary)/35"
                  }
                `}
              >
                <button
                  type="button"
                  onClick={() => onSelectStore(store)}
                  className="flex w-full items-start gap-2.5 text-left"
                >
                  <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-xl">
                    <Image
                      src={store.image}
                      alt={store.name}
                      fill
                      sizes="56px"
                      className="object-cover"
                    />
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0">
                        <h3 className="truncate text-[14px] font-semibold text-(--text-primary)">
                          {store.name}
                        </h3>
                        <p className="mt-0.5 truncate text-[11px] text-(--text-muted)">
                          {store.services[0] ?? "Premium wellness"}
                        </p>
                      </div>
                      <span className="primary-button shrink-0 rounded-full px-2 py-0.5 text-[9px] font-semibold text-white">
                        {store.opensAt} - {store.closesAt}
                      </span>
                    </div>

                    <div className="mt-1.5 flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] text-(--text-secondary)">
                      <span className="inline-flex items-center gap-1">
                        <Star
                          size={11}
                          className="fill-(--brand-gold) text-(--brand-gold)"
                        />
                        <span className="font-medium text-(--text-primary)">
                          {store.rating}
                        </span>
                        <span>({store.reviews}+)</span>
                      </span>
                      <span className="inline-flex items-center gap-1">
                        <MapPin size={11} />
                        {distance}
                      </span>
                    </div>
                  </div>
                </button>

                <Link
                  href={`/booking?organizationId=${store.id}`}
                  className="
                    primary-button mt-3 flex h-10 w-full items-center justify-between
                    rounded-full px-4 text-[13px] font-semibold text-white
                  "
                >
                  <span>Book Now</span>
                  <span className="flex h-6 w-6 items-center justify-center rounded-full bg-white/20">
                    <ChevronRight size={14} strokeWidth={2.5} />
                  </span>
                </Link>
              </article>
            );
          })}
        </div>

        <div className="shrink-0 border-t border-(--border) px-4 py-3 text-center">
          <button
            type="button"
            className="text-[13px] font-semibold text-(--accent-primary) transition-opacity hover:opacity-80"
          >
            View More &gt;
          </button>
        </div>
      </aside>

      {/* ========== CENTER: Hero + Chat ========== */}
      <section className="flex min-h-0 flex-col gap-4 overflow-hidden">
        {/* Banner — same style as specificorganizationbook */}
        {/* <section className="shrink-0 overflow-hidden rounded-[28px] border border-(--border) bg-(--bg-card) shadow-[var(--shadow-card)]">
          <div className="grid grid-cols-1 lg:grid-cols-[1.45fr_0.9fr]">
            <div className="relative min-h-[240px] lg:min-h-[280px]">
              <Image
                src={selectedStore.heroImage}
                alt={selectedStore.name}
                fill
                sizes="720px"
                className="object-cover"
                priority
              />

              <div className="absolute top-4 left-4 z-10">
                <TimingsDropdown
                  summary={timingSummary}
                  buttonClassName="flex items-center gap-1 rounded-full bg-(--accent-primary) px-4 py-2 text-[10px] font-semibold text-white shadow-lg"
                  type="Right-most"
                />
              </div>

              <div className="absolute top-4 right-4 z-10 flex items-center gap-2">
                <button
                  type="button"
                  aria-label="Navigate"
                  className="flex h-8 w-8 items-center justify-center rounded-full bg-(--accent-primary) text-white shadow-lg transition-opacity hover:opacity-90"
                >
                  <Navigation size={15} />
                </button>
                <button
                  type="button"
                  aria-label="Share"
                  className="flex h-8 w-8 items-center justify-center rounded-full bg-(--accent-primary) text-white shadow-lg transition-opacity hover:opacity-90"
                >
                  <Share2 size={15} />
                </button>
              </div>
            </div>

            <div className="flex flex-col justify-center gap-2 bg-(--bg-secondary) p-4 lg:p-5">
              <div>
                <div className="inline-flex items-center gap-2 rounded-full bg-(--accent-primary) px-4 py-2 text-xs font-semibold text-white shadow-sm">
                  <Star
                    size={14}
                    className="fill-(--brand-gold) text-(--brand-gold)"
                  />
                  <span>
                    {selectedStore.rating} ({selectedStore.reviews}+ reviews)
                  </span>
                </div>

                <div className="mt-2 flex items-center gap-2">
                  <h1 className="text-[24px] leading-tight font-medium text-(--text-primary)">
                    {selectedStore.name}
                  </h1>
                  {selectedStore.isVerified && (
                    <BadgeCheck
                      size={18}
                      className="shrink-0 fill-(--accent-primary) text-white"
                    />
                  )}
                </div>
              </div>

              <p className="max-w-[360px] text-[14px] leading-5 text-(--text-secondary)">
                {selectedStore.services.join(", ")}. Specialized care and
                premium treatments tailored for your wellness goals.
              </p>

              <div className="flex flex-wrap gap-1">
                <span className="inline-flex items-center gap-2 rounded-full border border-(--border) bg-(--bg-card) px-3 py-2 text-[10px] font-medium text-(--text-primary)">
                  <span className="h-2.5 w-2.5 rounded-full bg-(--success)" />
                  Online
                </span>
                <span className="inline-flex items-center gap-2 rounded-full border border-(--border) bg-(--bg-card) px-3 py-2 text-[10px] font-medium text-(--text-secondary)">
                  <MapPin size={14} />
                  {selectedStore.address}
                </span>
              </div>

              <div className="flex flex-wrap gap-3 pt-1">
                <Link
                  href={`/booking?organizationId=${selectedStore.id}`}
                  className="primary-button inline-flex h-8 items-center justify-center gap-2 rounded-full px-3 text-[10px] font-semibold text-white"
                >
                  <CalendarDays size={16} />
                  Book Now
                </Link>
                <button
                  type="button"
                  className="inline-flex h-8 items-center justify-center gap-2 rounded-full border border-(--border) bg-(--bg-card) px-3 text-[10px] font-semibold text-(--text-primary) transition-colors hover:bg-(--bg-card-hover)"
                >
                  <PlayCircle size={16} />
                  Watch Video
                </button>
              </div>
            </div>
          </div>
        </section> */}

<section className="overflow-hidden rounded-[28px] border border-(--border) bg-(--bg-card) shadow-[var(--shadow-card)]">
                  <div className="grid grid-cols-1 lg:grid-cols-[1.45fr_0.9fr]">
                    <div className="relative h-[240px] sm:h-[280px] lg:min-h-[280px]">
                      <Image
                         src={selectedStore.heroImage}
                         alt={selectedStore.name}
                        fill
                        sizes="(min-width: 1000px) 720px, 100vw"
                        className="object-cover"
                        priority
                      />

                      <div className="absolute left-4 top-4 z-10">
                        <div className="flex items-center gap-2">
                          <TimingsDropdown
                            summary={timingSummary}
                            buttonClassName="flex items-center gap-1 rounded-full bg-(--accent-primary) px-4 py-2 text-[10px] font-semibold text-white shadow-lg"
                            type="Right-most"
                          />
                        </div>
                      </div>

                      <div className="absolute right-4 top-4 z-10 flex items-center gap-2">
                        <button
                          type="button"
                          aria-label="Send"
                          className="flex h-8 w-8 items-center justify-center rounded-full bg-(--accent-primary) text-white shadow-lg transition-opacity hover:opacity-90"
                        >
                          <Send size={15} />
                        </button>
                        <button
                          type="button"
                          aria-label="Share"
                          className="flex h-8 w-8 items-center justify-center rounded-full bg-(--accent-primary) text-white shadow-lg transition-opacity hover:opacity-90"
                        >
                          <Share2 size={15} />
                        </button>
                      </div>
                    </div>

                    <div className="flex flex-col justify-center gap-2 bg-(--bg-secondary) p-6 lg:p-3">
                      <div>
                        <div className="inline-flex items-center gap-2 rounded-full bg-(--accent-primary) px-4 py-2 text-xs font-semibold text-white shadow-sm">
                          <Star size={14} className="fill-(--brand-gold) text-(--brand-gold)" />
                            <span>4.8 (120+ reviews)</span>
                          </div>

                        <h1 className="mt-2 text-[24px] leading-tight font-medium text-(--text-primary)">
                          {selectedStore.name}
                        </h1>
                      </div>

                      <p className="max-w-[360px] text-[14px] leading-4 text-(--text-secondary)">
                        Specialized deep tissue and traditional oil therapies for body
                        recovery and relaxation.
                      </p>

                      <div className="flex flex-wrap gap-1">
                        <span className="inline-flex items-center gap-2 rounded-full border border-(--border) bg-(--bg-card) px-3 py-2 text-[10px] font-medium text-(--text-primary)">
                          <span className="h-2.5 w-2.5 rounded-full bg-(--success)" />
                          Online
                        </span>
                        <span className="inline-flex items-center gap-2 rounded-full border border-(--border) bg-(--bg-card) px-3 py-2 text-[10px] font-medium text-(--text-secondary)">
                          <MapPin size={14} />
                          Indore, India
                        </span>
                      </div>

                      <div className="flex flex-wrap gap-3 pt-1">
                        <Link
                          // href={bookingUrl}
                          href={"#"}
                          className="primary-button inline-flex h-8 items-center justify-center gap-2 rounded-full px-2 text-[10px] font-semibold text-white"
                        >
                          <CalendarDays size={16} />
                          Book Now
                        </Link>
                        <button
                          type="button"
                          className="inline-flex h-8 items-center justify-center gap-2 rounded-full border border-(--border) bg-(--bg-card) px-2 text-[10px] font-semibold text-(--text-primary) transition-colors hover:bg-(--bg-card-hover)"
                        >
                          <PlayCircle size={16} />
                          Watch Video
                        </button>
                      </div>
                    </div>
                  </div>
                </section>

        {/* Chat */}
        <div className="flex min-h-0 flex-1 flex-col overflow-hidden rounded-[22px] border border-(--border) bg-(--bg-card) shadow-[var(--shadow-card)]">
          <div className="relative flex shrink-0 items-center justify-center px-4 py-3">
            <div className="absolute inset-x-6 top-1/2 h-px -translate-y-1/2 bg-(--border)" />
            <span className="relative bg-(--bg-card) px-3 text-[12px] font-medium text-(--text-muted)">
              Today
            </span>
          </div>

          <div className="min-h-0 flex-1 space-y-4 overflow-y-auto px-4 pb-3 scrollbar-none">
            {messages.map((message) => {
              const isUser = message.from === "user";

              return (
                <div
                  key={message.id}
                  className={`flex items-end gap-2.5 ${
                    isUser ? "justify-end" : "justify-start"
                  }`}
                >
                  {!isUser && (
                    <div className="relative h-8 w-8 shrink-0 overflow-hidden rounded-full">
                      <Image
                        src={selectedStore.image}
                        alt=""
                        fill
                        sizes="32px"
                        className="object-cover"
                      />
                    </div>
                  )}

                  <div
                    className={`flex max-w-[78%] flex-col ${
                      isUser ? "items-end" : "items-start"
                    }`}
                  >
                    <div
                      className={`
                        rounded-2xl px-4 py-2.5 text-[13px] leading-5
                        ${
                          isUser
                            ? "primary-button rounded-br-md text-white"
                            : "rounded-bl-md border border-(--border) bg-(--bg-secondary) text-(--text-primary)"
                        }
                      `}
                    >
                      <span className="whitespace-pre-line">{message.text}</span>
                    </div>
                    <div
                      className={`mt-1 flex items-center gap-1 px-1 ${
                        isUser ? "flex-row-reverse" : ""
                      }`}
                    >
                      <span className="text-[11px] text-(--text-muted)">
                        {message.time}
                      </span>
                      {isUser && (
                        <CheckCheck
                          size={13}
                          className="text-(--accent-primary)"
                          strokeWidth={2.2}
                        />
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
            <div ref={messagesEndRef} />
          </div>

          <div className="shrink-0 border-t border-(--border) px-4 py-3">
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={draft}
                onChange={(e) => setDraft(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleSend();
                }}
                placeholder="Type your message..."
                className="
                  h-12 min-w-0 flex-1 rounded-full border border-(--border)
                  bg-(--bg-secondary) px-5 text-[13px] text-(--text-primary)
                  placeholder:text-(--text-muted)
                  focus:border-(--accent-primary) focus:outline-none
                "
              />

              <button
                type="button"
                onClick={handleSend}
                aria-label="Send message"
                className="primary-button flex h-12 w-12 shrink-0 items-center justify-center rounded-full text-white"
              >
                <Send size={18} />
              </button>

              {[
                { icon: Paperclip, label: "Attach file" },
                { icon: ImageIcon, label: "Gallery" },
                { icon: Camera, label: "Camera" },
                { icon: Mic, label: "Voice message" },
              ].map(({ icon: Icon, label }) => (
                <button
                  key={label}
                  type="button"
                  aria-label={label}
                  className="
                    flex h-11 w-11 shrink-0 items-center justify-center rounded-full
                    border border-(--border) text-(--text-secondary)
                    transition-colors hover:border-(--accent-primary)
                    hover:text-(--accent-primary)
                  "
                >
                  <Icon size={16} strokeWidth={1.8} />
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ========== RIGHT: Menu (same as specificorganizationbook) ========== */}
      <aside className="flex min-h-0 flex-col overflow-hidden rounded-[22px] border border-(--border) bg-(--bg-card) shadow-[var(--shadow-card)]">
        {/* Same banner style as org-book HeroBanner */}

        <div className="flex min-h-0 flex-1 flex-col p-3 lg:p-4">
          <MenuCatalogTabs active={menuTab} onChange={setMenuTab} />

          <div className="flex min-h-0 flex-1 overflow-hidden rounded-xl border border-(--border)">
            <CategorySidebar
              categories={menuCategories}
              activeId={activeCategory}
              onSelect={setActiveCategory}
              selectedCounts={categorySelectedCounts}
              largeText
            />

            <div className="flex min-w-0 flex-1 flex-col overflow-hidden bg-(--bg-secondary)">
              <div className="min-h-0 flex-1 overflow-y-auto scrollbar-none">
                <div className="px-2 pt-3 pb-3">
                  <div className="mb-3">
                    <h3 className="text-sm font-semibold text-(--text-primary)">
                      {menuTab === "service"
                        ? "Select Services"
                        : "Select Products"}
                    </h3>
                    <p className="text-[11px] text-(--text-muted)">
                      {activeCategoryLabel} · {catalogItems.length} available
                      {menuTab === "service"
                        ? selectedServiceIds.length > 0 &&
                          ` · ${selectedServiceIds.length} selected`
                        : selectedProductIds.length > 0 &&
                          ` · ${selectedProductIds.length} selected`}
                    </p>
                  </div>

                  <div className="grid grid-cols-3 gap-2">
                    {menuTab === "service" ? (
                      paginatedServices.length > 0 ? (
                        paginatedServices.map((service) => (
                          <ServiceCard
                            key={service.id}
                            compact
                            largeText
                            service={service}
                            selected={selectedServiceIds.includes(service.id)}
                            onSelect={() => toggleService(service.id)}
                          />
                        ))
                      ) : (
                        <p className="col-span-3 py-8 text-center text-sm text-(--text-muted)">
                          No services in this category yet.
                        </p>
                      )
                    ) : paginatedProducts.length > 0 ? (
                      paginatedProducts.map((product) => (
                        <MenuProductCard
                          key={product.id}
                          largeText
                          product={product}
                          selected={selectedProductIds.includes(product.id)}
                          onSelect={() => toggleProduct(product.id)}
                        />
                      ))
                    ) : (
                      <p className="col-span-3 py-8 text-center text-sm text-(--text-muted)">
                        No products in this category yet.
                      </p>
                    )}
                  </div>

                  {totalPages > 1 && (
                    <div className="mt-3 flex items-center justify-end gap-2 pr-1">
                      <button
                        type="button"
                        onClick={() => setPage((p) => Math.max(1, p - 1))}
                        disabled={visiblePage === 1}
                        aria-label="Previous page"
                        className="flex items-center gap-0.5 rounded-md px-2 py-1 text-[11px] font-semibold text-(--text-primary) transition-colors duration-200 hover:bg-(--bg-primary) disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:bg-transparent"
                      >
                        <ChevronLeft size={14} strokeWidth={2.5} />
                        Back
                      </button>

                      <div className="flex items-center gap-1">
                        {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                          (p) => (
                            <button
                              key={p}
                              type="button"
                              onClick={() => setPage(p)}
                              aria-label={`Go to page ${p}`}
                              aria-current={
                                visiblePage === p ? "page" : undefined
                              }
                              className={`flex h-6 w-6 items-center justify-center rounded-md text-[11px] font-bold transition-colors duration-200 ${
                                visiblePage === p
                                  ? "bg-(--text-primary) text-(--brand-gold)"
                                  : "text-(--text-primary) hover:bg-(--bg-primary)"
                              }`}
                            >
                              {p}
                            </button>
                          ),
                        )}
                      </div>

                      <button
                        type="button"
                        onClick={() =>
                          setPage((p) => Math.min(totalPages, p + 1))
                        }
                        disabled={visiblePage === totalPages}
                        aria-label="Next page"
                        className="flex items-center gap-0.5 rounded-md px-2 py-1 text-[11px] font-semibold text-(--text-primary) transition-colors duration-200 hover:bg-(--bg-primary) disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:bg-transparent"
                      >
                        Next
                        <ChevronRight size={14} strokeWidth={2.5} />
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="shrink-0 border-t border-(--border) bg-(--bg-card)/95 p-3 backdrop-blur-xl">
          <div className="flex items-stretch overflow-hidden rounded-xl border border-(--border)">
            <div className="flex items-center gap-2.5 px-3 py-2.5">
              <div className="relative shrink-0">
                <span className="primary-button flex h-10 w-10 items-center justify-center rounded-xl">
                  <ShoppingCart
                    size={18}
                    strokeWidth={2}
                    className="text-white"
                  />
                </span>
                {cartCount > 0 && (
                  <span className="absolute -top-1 -right-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-(--brand-gold) px-1 text-[8px] font-bold text-(--text-primary)">
                    {cartCount}
                  </span>
                )}
              </div>

              <div className="min-w-0">
                {cartCount > 0 ? (
                  <span className="text-sm font-semibold text-(--brand-gold)">
                    {formatMoney(cartTotal)}
                  </span>
                ) : (
                  <span className="text-[11px] text-(--text-muted)">
                    No items yet
                  </span>
                )}
              </div>
            </div>

            <Link
              href={`/booking?organizationId=${selectedStore.id}`}
              className="primary-button flex flex-1 items-center justify-center rounded-none px-3 py-3 text-[11px] font-semibold text-white"
            >
              NEXT <ArrowRight size={14} strokeWidth={2.5} />
            </Link>
          </div>
        </div>
      </aside>
    </div>
  );
}
