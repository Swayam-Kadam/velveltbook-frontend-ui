"use client";

import Image from "next/image";
import { ArrowRight, UserRound, X } from "lucide-react";

import type { ExtendedStaff } from "../organization.types";
import type { MenuProduct } from "@/menu/menu.data";

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
}: SelectionPreviewSidebarProps) {
  const itemCount =
    previewTab === "service" ? services.length : products.length;

  return (
    <aside className="order-2 xl:order-none">
      <div className="xl:sticky xl:top-24">
        <div className="rounded-[var(--radius-lg)] border border-(--border) bg-(--bg-card) p-4 shadow-[var(--shadow-card)] lg:p-5">
          <div className="mb-3">
            <h2 className="text-base font-semibold text-(--text-primary) lg:text-lg">
              Your Selection
            </h2>
            <p className="mt-0.5 text-[11px] text-(--text-muted)">
              {itemCount} item{itemCount === 1 ? "" : "s"} selected
            </p>
          </div>

          <div
            className="
              mb-4 inline-flex w-full rounded-full border border-(--border)
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

          {assigningServiceId && previewTab === "service" && (
            <p className="mb-3 rounded-lg border border-(--brand-gold)/40 bg-[color-mix(in_srgb,var(--brand-gold)_10%,transparent)] px-2.5 py-2 text-[11px] font-medium text-(--text-primary)">
              Select a staff member below for this service.
            </p>
          )}

          <div className="max-h-[520px] space-y-2.5 overflow-y-auto scrollbar-none">
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
                <p className="py-10 text-center text-sm text-(--text-muted)">
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
              <p className="py-10 text-center text-sm text-(--text-muted)">
                No products selected yet.
              </p>
            )}
          </div>

          <div className="mt-4 flex items-center gap-2 border-t border-(--border) pt-3">
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
    </aside>
  );
}
