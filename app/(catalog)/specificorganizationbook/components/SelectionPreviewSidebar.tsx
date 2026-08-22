"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  ChevronRight,
  MapPin,
  Settings2,
  Star,
  UserRound,
  X,
} from "lucide-react";

import type { ExtendedStaff } from "../organization.types";
import type { MenuProduct } from "@/menu/menu.data";
import type {
  SectionData,
  Suggestion,
  SuggestionsSectionMeta,
} from "@/types/store";

export type SelectionPreviewTab = "service" | "product";

export interface PreviewServiceItem {
  id: string;
  name: string;
  price: string;
  image: string;
  duration?: string;
}

interface SelectionPreviewSidebarProps {
  previewTab: SelectionPreviewTab;
  onPreviewTabChange: (tab: SelectionPreviewTab) => void;
  services: PreviewServiceItem[];
  products: MenuProduct[];
  serviceStaff: Record<string, string>;
  staffById: Record<string, ExtendedStaff>;
  assigningServiceId: string | null;
  totalPrice: number;
  onAssignStaffRequest: (serviceId: string) => void;
  onRemoveService: (serviceId: string) => void;
  onRemoveProduct: (productId: string) => void;
  onNext: () => void;
  suggestions?: SectionData<Suggestion, SuggestionsSectionMeta>;
}

/** Keeps at least one suggestion card + header/footer visible while selection grows. */
const MIN_SUGGESTION_HEIGHT = 280;

function SuggestionStoreCard({
  suggestion,
  bookNowLabel,
}: {
  suggestion: Suggestion;
  bookNowLabel: string;
}) {
  const href = `/store/${suggestion.storeId}`;

  return (
    <article className="rounded-2xl border border-(--border) bg-(--bg-card) p-3 transition-all hover:border-(--accent-primary)/35">
      <Link href={href} className="flex w-full items-start gap-2.5 text-left">
        <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-xl">
          <Image
            src={suggestion.image}
            alt={suggestion.name}
            fill
            sizes="56px"
            className="object-cover"
          />
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0">
              <h3 className="truncate text-[14px] font-semibold text-(--text-primary)">
                {suggestion.name}
              </h3>
              <p className="mt-0.5 truncate text-[11px] text-(--text-muted)">
                {suggestion.subtitle}
              </p>
            </div>
            <span className="primary-button shrink-0 rounded-full px-2 py-0.5 text-[9px] font-semibold text-white">
              {suggestion.timing}
            </span>
          </div>

          <div className="mt-1.5 flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] text-(--text-secondary)">
            <span className="inline-flex items-center gap-1">
              <Star
                size={11}
                className="fill-(--brand-gold) text-(--brand-gold)"
              />
              <span className="font-medium text-(--text-primary)">
                {suggestion.rating}
              </span>
              <span>({suggestion.reviewsLabel})</span>
            </span>
            <span className="inline-flex items-center gap-1">
              <MapPin size={11} />
              {suggestion.distance}
            </span>
          </div>
        </div>
      </Link>

      <Link
        href={href}
        className="
          primary-button mt-3 flex h-10 w-full items-center justify-between
          rounded-full px-4 text-[13px] font-semibold text-white
        "
      >
        <span>{bookNowLabel}</span>
        <span className="flex h-6 w-6 items-center justify-center rounded-full bg-white/20">
          <ChevronRight size={14} strokeWidth={2.5} />
        </span>
      </Link>
    </article>
  );
}

export function SelectionPreviewSidebar({
  previewTab,
  onPreviewTabChange,
  services,
  products,
  serviceStaff,
  staffById,
  assigningServiceId,
  totalPrice,
  onAssignStaffRequest,
  onRemoveService,
  onRemoveProduct,
  onNext,
  suggestions,
}: SelectionPreviewSidebarProps) {
  const itemCount =
    previewTab === "service" ? services.length : products.length;

  const suggestionItems = suggestions?.items ?? [];
  const suggestionMeta = suggestions?.meta;

  const stackRef = useRef<HTMLDivElement>(null);
  const selectionShellRef = useRef<HTMLDivElement>(null);
  const selectionHeaderRef = useRef<HTMLDivElement>(null);
  const selectionListContentRef = useRef<HTMLDivElement>(null);
  const selectionFooterRef = useRef<HTMLDivElement>(null);
  const [selectionHeight, setSelectionHeight] = useState<number | null>(null);

  useLayoutEffect(() => {
    const stack = stackRef.current;
    const header = selectionHeaderRef.current;
    const listContent = selectionListContentRef.current;
    const footer = selectionFooterRef.current;
    if (!stack || !header || !listContent || !footer) return;

    const syncHeights = () => {
      const stackHeight = stack.clientHeight;
      if (stackHeight <= 0) return;

      const gap = 12; // gap-3 between panels
      const usable = Math.max(0, stackHeight - gap);
      const half = usable / 2;
      const maxSelection = Math.max(half, usable - MIN_SUGGESTION_HEIGHT);

      // List padding (px-3 pb-2) so natural height matches the rendered panel.
      const listPaddingY = 8;
      const natural =
        header.offsetHeight +
        listContent.scrollHeight +
        listPaddingY +
        footer.offsetHeight;

      const nextHeight = Math.min(maxSelection, Math.max(half, natural));

      setSelectionHeight((current) =>
        current != null && Math.abs(current - nextHeight) < 1
          ? current
          : nextHeight,
      );
    };

    syncHeights();

    const resizeObserver = new ResizeObserver(syncHeights);
    resizeObserver.observe(stack);
    resizeObserver.observe(header);
    resizeObserver.observe(listContent);
    resizeObserver.observe(footer);
    window.addEventListener("resize", syncHeights);

    return () => {
      resizeObserver.disconnect();
      window.removeEventListener("resize", syncHeights);
    };
  }, [itemCount, previewTab, assigningServiceId, services, products]);

  useEffect(() => {
    const list = selectionListContentRef.current?.parentElement;
    if (list && itemCount > 0) {
      list.scrollTop = list.scrollHeight;
    }
  }, [itemCount]);

  return (
    <aside className="order-2 xl:order-none">
      <div
        ref={stackRef}
        className="
          flex flex-col gap-3
          xl:h-[calc(100dvh-7.5rem)] xl:min-h-[680px]
        "
      >
        {/* ========== TOP: Your Selection ========== */}
        <div
          ref={selectionShellRef}
          className="
            flex min-h-0 shrink-0 flex-col overflow-hidden rounded-[22px]
            border border-(--border) bg-(--bg-card) shadow-[var(--shadow-card)]
            transition-[height] duration-200 ease-out
          "
          style={
            selectionHeight != null
              ? { height: selectionHeight }
              : { flex: "1 1 50%", minHeight: 0 }
          }
        >
          <div className="flex min-h-0 flex-1 flex-col">
            <div ref={selectionHeaderRef} className="shrink-0 px-4 pt-4 pb-2">
              <h2 className="text-base font-semibold text-(--text-primary) lg:text-lg">
                Your Selection
              </h2>
              <p className="mt-0.5 text-[11px] text-(--text-muted)">
                {itemCount} item{itemCount === 1 ? "" : "s"} selected
              </p>

              <div
                className="
                  mt-3 inline-flex w-full rounded-full border border-(--border)
                  bg-(--bg-secondary) p-0.5
                "
                role="tablist"
                aria-label="Selection type"
              >
                {([
                  { id: "service", label: "Service" },
                  { id: "product", label: "Product" },
                ] as const).map((tab) => {
                  const isActive = previewTab === tab.id;

                  return (
                    <button
                      key={tab.id}
                      type="button"
                      role="tab"
                      aria-selected={isActive}
                      onClick={() => onPreviewTabChange(tab.id)}
                      className={`
                        flex-1 rounded-full px-3 py-1.5 text-sm font-semibold
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
            </div>

            <div className="min-h-0 flex-1 overflow-y-auto px-3 pb-2 scrollbar-none">
              <div ref={selectionListContentRef} className="space-y-2.5">
              {previewTab === "service" ? (
                services.length > 0 ? (
                  services.map((service) => {
                    const staffId = serviceStaff[service.id];
                    const staff = staffId ? staffById[staffId] : undefined;
                    const isAssigning = assigningServiceId === service.id;

                    return (
                      <article
                        key={service.id}
                        className={`
                          relative overflow-hidden rounded-xl border bg-(--bg-secondary)
                          transition-all duration-200
                          ${
                            isAssigning
                              ? "border-(--brand-gold) shadow-(--shadow-glow)"
                              : "border-(--border)"
                          }
                        `}
                      >
                        <button
                          type="button"
                          aria-label={`Remove ${service.name}`}
                          onClick={() => onRemoveService(service.id)}
                          className="
                            absolute right-1.5 top-1.5 z-10 flex h-5 w-5 items-center
                            justify-center rounded-full border border-(--border)
                            bg-(--bg-card) text-(--text-muted)
                            transition-colors hover:text-(--text-primary)
                          "
                        >
                          <X size={11} strokeWidth={2.5} />
                        </button>

                        <div className="grid grid-cols-2 gap-2 p-2.5 pr-7">
                          <div className="flex min-w-0 items-center gap-2">
                            <div className="relative h-11 w-11 shrink-0 overflow-hidden rounded-lg">
                              <Image
                                src={service.image}
                                alt={service.name}
                                fill
                                sizes="44px"
                                className="object-cover"
                              />
                            </div>
                            <div className="min-w-0">
                              <p className="truncate text-[11px] font-semibold text-(--text-primary)">
                                {service.name}
                              </p>
                              <p className="truncate text-[10px] text-(--text-muted)">
                                {[service.duration, service.price]
                                  .filter(Boolean)
                                  .join(" · ")}
                              </p>
                            </div>
                          </div>

                          <button
                            type="button"
                            onClick={() => onAssignStaffRequest(service.id)}
                            className={`
                              flex min-w-0 items-center gap-2 rounded-lg border px-1.5 py-1
                              text-left transition-colors
                              ${
                                staff
                                  ? "border-(--border) bg-(--bg-card) hover:border-(--brand-gold)/50"
                                  : "border-dashed border-(--border) bg-transparent hover:border-(--brand-gold)"
                              }
                              ${isAssigning ? "border-(--brand-gold)" : ""}
                            `}
                          >
                            {staff ? (
                              <>
                                <div className="relative h-9 w-9 shrink-0 overflow-hidden rounded-full">
                                  <Image
                                    src={staff.image}
                                    alt={staff.name}
                                    fill
                                    sizes="36px"
                                    className="object-cover"
                                  />
                                </div>
                                <div className="min-w-0">
                                  <p className="truncate text-[10px] font-semibold text-(--text-primary)">
                                    {staff.name}
                                  </p>
                                  <p className="truncate text-[9px] text-(--text-muted)">
                                    Change staff
                                  </p>
                                </div>
                              </>
                            ) : (
                              <>
                                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-(--border) bg-(--bg-card)">
                                  <UserRound
                                    size={14}
                                    className="text-(--text-muted)"
                                  />
                                </span>
                                <span className="truncate text-[10px] font-semibold text-(--brand-gold)">
                                  Select staff
                                </span>
                              </>
                            )}
                          </button>
                        </div>
                      </article>
                    );
                  })
                ) : (
                  <p className="py-8 text-center text-sm text-(--text-muted)">
                    No services selected yet.
                  </p>
                )
              ) : products.length > 0 ? (
                products.map((product) => (
                  <article
                    key={product.id}
                    className="
                      relative flex items-center gap-2.5 overflow-hidden rounded-xl
                      border border-(--border) bg-(--bg-secondary) p-2.5 pr-8
                    "
                  >
                    <button
                      type="button"
                      aria-label={`Remove ${product.title}`}
                      onClick={() => onRemoveProduct(product.id)}
                      className="
                        absolute right-1.5 top-1.5 z-10 flex h-5 w-5 items-center
                        justify-center rounded-full border border-(--border)
                        bg-(--bg-card) text-(--text-muted)
                        transition-colors hover:text-(--text-primary)
                      "
                    >
                      <X size={11} strokeWidth={2.5} />
                    </button>

                    <div className="relative h-11 w-11 shrink-0 overflow-hidden rounded-lg">
                      <Image
                        src={product.image}
                        alt={product.title}
                        fill
                        sizes="44px"
                        className="object-cover"
                      />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-[11px] font-semibold text-(--text-primary)">
                        {product.title}
                      </p>
                      <p className="text-[11px] font-bold text-(--brand-gold)">
                        {product.price}
                      </p>
                    </div>
                  </article>
                ))
              ) : (
                <p className="py-8 text-center text-sm text-(--text-muted)">
                  No products selected yet.
                </p>
              )}
              </div>
            </div>

            <div
              ref={selectionFooterRef}
              className="shrink-0 flex items-center gap-2 border-t border-(--border) px-4 py-3"
            >
              <div className="min-w-0 flex-1">
                <p className="text-[10px] text-(--text-muted)">Total</p>
                <p className="text-lg font-bold text-(--brand-gold)">
                  ${totalPrice.toFixed(0)}
                </p>
              </div>
              <button
                type="button"
                onClick={onNext}
                className="
                  primary-button inline-flex items-center justify-center gap-1.5
                  rounded-xl px-4 py-2.5 text-[12px] font-semibold text-white
                "
              >
                Next
                <ArrowRight size={14} strokeWidth={2.5} />
              </button>
            </div>
          </div>
        </div>

        {/* ========== BOTTOM: Suggestions (squeezes, never pushed off) ========== */}
        <div
          className="
            flex min-h-0 flex-1 flex-col overflow-hidden rounded-[22px]
            border border-(--border) bg-(--bg-card) shadow-[var(--shadow-card)]
          "
          style={{ minHeight: MIN_SUGGESTION_HEIGHT }}
        >
          <div className="flex shrink-0 items-center justify-between px-4 pt-4 pb-3">
            <h2 className="font-[family-name:var(--font-heading)] text-[18px] font-semibold text-(--text-primary) xl:text-[20px]">
              {suggestionMeta?.title ?? "Suggestions"}
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
            {suggestionItems.length > 0 ? (
              suggestionItems.map((item) => (
                <SuggestionStoreCard
                  key={item.id}
                  suggestion={item}
                  bookNowLabel={suggestionMeta?.bookNowLabel ?? "Book Now"}
                />
              ))
            ) : (
              <p className="py-8 text-center text-sm text-(--text-muted)">
                No store suggestions yet.
              </p>
            )}
          </div>

          <div className="shrink-0 border-t border-(--border) px-4 py-3 text-center">
            {suggestionMeta?.footerHref ? (
              <Link
                href={suggestionMeta.footerHref}
                className="text-[13px] font-semibold text-(--accent-primary) transition-opacity hover:opacity-80"
              >
                {suggestionMeta.footerLabel ?? "View More"} &gt;
              </Link>
            ) : (
              <button
                type="button"
                className="text-[13px] font-semibold text-(--accent-primary) transition-opacity hover:opacity-80"
              >
                View More &gt;
              </button>
            )}
          </div>
        </div>
      </div>
    </aside>
  );
}
