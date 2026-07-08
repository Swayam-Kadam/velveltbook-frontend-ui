"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { ArrowRight, ChevronLeft, ChevronRight, Send, X } from "lucide-react";

import { CategorySidebar } from "@/menu/components/CategorySidebar";
import { ServiceCard } from "@/menu/components/ServiceCard";
import {
  getServicesByCategory,
  menuCategories,
  type MenuService,
} from "@/menu/menu.data";

const SERVICES_PER_PAGE = 9;

export type SelectedChatService = {
  id: string;
  name: string;
  price: string;
  category: string;
  duration: string;
};

export function formatSelectedServicesMessage(services: SelectedChatService[]): string {
  return services
    .map((service) => `${service.category}\n${service.name}\n${service.price}`)
    .join("\n\n");
}

function getCategoryHeading(categoryId: string): string {
  const category = menuCategories.find((item) => item.id === categoryId);
  if (!category) return "Popular Services";
  return `Popular ${category.label}`;
}

interface ChatServicePickerProps {
  onClose: () => void;
  onSend: (services: SelectedChatService[]) => void;
}

export function ChatServicePicker({ onClose, onSend }: ChatServicePickerProps) {
  const [activeCategory, setActiveCategory] = useState("massage");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedServices, setSelectedServices] = useState<Map<string, SelectedChatService>>(
    () => new Map(),
  );
  const menuScrollRef = useRef<HTMLDivElement>(null);

  const categoryLabel =
    menuCategories.find((category) => category.id === activeCategory)?.label ??
    "Services";

  const visibleServices = useMemo(
    () => getServicesByCategory(activeCategory),
    [activeCategory],
  );

  const totalPages = Math.ceil(visibleServices.length / SERVICES_PER_PAGE);

  const paginatedServices = useMemo(() => {
    const start = (currentPage - 1) * SERVICES_PER_PAGE;
    return visibleServices.slice(start, start + SERVICES_PER_PAGE);
  }, [visibleServices, currentPage]);

  const selectedList = useMemo(() => Array.from(selectedServices.values()), [selectedServices]);

  useEffect(() => {
    if (currentPage > totalPages && totalPages > 0) {
      setCurrentPage(totalPages);
    }
  }, [currentPage, totalPages]);

  useEffect(() => {
    menuScrollRef.current?.scrollTo({ top: 0, behavior: "smooth" });
  }, [activeCategory, currentPage]);

  const handleCategorySelect = (categoryId: string) => {
    setActiveCategory(categoryId);
    setCurrentPage(1);
  };

  const toggleService = (service: MenuService) => {
    setSelectedServices((current) => {
      const next = new Map(current);
      if (next.has(service.id)) {
        next.delete(service.id);
      } else {
        next.set(service.id, {
          id: service.id,
          name: service.title,
          price: service.price,
          category: categoryLabel,
          duration: service.duration,
        });
      }
      return next;
    });
  };

  const handleSend = () => {
    if (selectedList.length === 0) return;
    onSend(selectedList);
  };

  return (
    <div
      className="
        fixed inset-x-0 top-0 bottom-[5.25rem] z-[60] flex items-end justify-center
        bg-black/45 px-2 pb-1 pt-2 lg:inset-0 lg:items-center lg:pb-0
      "
      role="dialog"
      aria-modal="true"
      aria-label="Select services"
    >
      <div
        className="
          flex w-full max-w-lg min-w-0 flex-col overflow-hidden rounded-2xl
          border border-(--border) bg-(--bg-primary) shadow-(--shadow-card)
          sm:rounded-3xl
        "
      >
        <div className="flex shrink-0 items-center justify-between border-b border-(--border) px-3 py-1.5">
          <h2 className="font-[family-name:var(--font-heading)] text-sm font-bold text-(--text-primary) sm:text-base">
            Select Services
          </h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close services menu"
            className="flex h-7 w-7 items-center justify-center rounded-full bg-(--bg-card-hover) text-(--text-primary)"
          >
            <X className="h-4 w-4" strokeWidth={2} />
          </button>
        </div>

        <div className="flex h-[min(54dvh,332px)] shrink-0 overflow-hidden sm:h-[332px]">
          <CategorySidebar
            categories={menuCategories}
            activeId={activeCategory}
            onSelect={handleCategorySelect}
          />

          <div className="flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden bg-(--bg-secondary)">
            <div
              ref={menuScrollRef}
              className="scrollbar-thin h-full min-h-0 overflow-y-auto overscroll-y-contain"
            >
              <div className="px-2 pt-1.5 pb-1 sm:px-2.5 sm:pt-2">
                <div className="mb-1.5 flex items-center justify-between gap-2">
                  <h3 className="truncate text-[10px] font-medium text-(--text-primary) sm:text-xs">
                    {getCategoryHeading(activeCategory)}
                  </h3>
                  <button
                    type="button"
                    className="flex shrink-0 items-center gap-0.5 text-[8px] text-(--brand-gold) sm:text-[9px]"
                  >
                    <span>View All</span>
                    <ArrowRight className="h-2.5 w-2.5" strokeWidth={2} />
                  </button>
                </div>

                {visibleServices.length > 0 ? (
                  <>
                    <div className="grid grid-cols-3 gap-1">
                      {paginatedServices.map((service) => (
                        <ServiceCard
                          key={service.id}
                          service={service}
                          compact
                          selected={selectedServices.has(service.id)}
                          onSelect={() => toggleService(service)}
                        />
                      ))}
                    </div>

                    {totalPages > 1 && (
                      <div className="mt-1.5 flex items-center justify-center gap-1.5">
                        <button
                          type="button"
                          disabled={currentPage === 1}
                          onClick={() => setCurrentPage((page) => Math.max(1, page - 1))}
                          aria-label="Previous page"
                          className="flex h-6 w-6 items-center justify-center rounded-full border border-(--border) bg-(--bg-card) text-(--text-primary) disabled:opacity-40"
                        >
                          <ChevronLeft className="h-3.5 w-3.5" strokeWidth={2} />
                        </button>

                        {Array.from({ length: totalPages }, (_, index) => index + 1).map((page) => (
                          <button
                            key={page}
                            type="button"
                            onClick={() => setCurrentPage(page)}
                            aria-label={`Page ${page}`}
                            aria-current={page === currentPage ? "page" : undefined}
                            className={`
                              flex h-6 min-w-6 items-center justify-center rounded-full px-1.5
                              text-[9px] font-medium transition-colors
                              ${
                                page === currentPage
                                  ? "primary-button text-white"
                                  : "border border-(--border) bg-(--bg-card) text-(--text-secondary)"
                              }
                            `}
                          >
                            {page}
                          </button>
                        ))}

                        <button
                          type="button"
                          disabled={currentPage === totalPages}
                          onClick={() => setCurrentPage((page) => Math.min(totalPages, page + 1))}
                          aria-label="Next page"
                          className="flex h-6 w-6 items-center justify-center rounded-full border border-(--border) bg-(--bg-card) text-(--text-primary) disabled:opacity-40"
                        >
                          <ChevronRight className="h-3.5 w-3.5" strokeWidth={2} />
                        </button>
                      </div>
                    )}
                  </>
                ) : (
                  <p className="rounded-xl border border-dashed border-(--border) px-3 py-6 text-center text-[10px] text-(--text-muted) sm:text-xs">
                    Services for this category will appear here soon.
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="shrink-0 border-t border-(--border) bg-(--bg-primary) px-3 py-1.5">
          {selectedList.length > 0 && (
            <div className="scrollbar-thin mb-1 max-h-12 space-y-0.5 overflow-y-auto overscroll-y-contain sm:max-h-14">
              {selectedList.map((service) => (
                <p
                  key={service.id}
                  className="truncate text-[9px] text-(--text-secondary) sm:text-[10px]"
                >
                  {service.category} · {service.name} · {service.price}
                </p>
              ))}
            </div>
          )}

          <button
            type="button"
            disabled={selectedList.length === 0}
            onClick={handleSend}
            className="primary-button flex w-full items-center justify-center gap-1.5 rounded-xl py-1.5 text-[11px] text-white disabled:cursor-not-allowed disabled:opacity-45 sm:py-2 sm:text-xs"
          >
            <Send className="h-3.5 w-3.5" strokeWidth={2} />
            {selectedList.length === 0
              ? "Send Services"
              : `Send ${selectedList.length} Service${selectedList.length > 1 ? "s" : ""}`}
          </button>
        </div>
      </div>
    </div>
  );
}
