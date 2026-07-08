"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Check, ChevronLeft, ChevronRight } from "lucide-react";

import { ServiceCard } from "@/menu/components/ServiceCard";
import { menuCategories } from "@/menu/menu.data";
import { ExtendedService } from "../organization.types";
import { CategoryTabBar } from "./CategoryTabBar";
import { ServicesSelectionBar } from "./ServicesSelectionBar";

const PAGE_SIZE = 8;

const serviceCategories = menuCategories.filter(
  (category) => category.id !== "addons",
);

interface ServicesSectionProps {
  services: ExtendedService[];
  selectedServiceIds: string[];
  onToggleService: (id: string) => void;
  onBookNow: () => void;
}

function DesktopServicesScroll({
  services,
  selectedServiceIds,
  onToggleService,
}: {
  services: ExtendedService[];
  selectedServiceIds: string[];
  onToggleService: (id: string) => void;
}) {
  return (
    <>
      <div className="mb-1 flex items-center justify-between">
        <h2 className="text-lg font-bold text-(--text-primary)">Services</h2>
        <button
          type="button"
          className="primary-button flex items-center gap-0.5 rounded-xs bg-(--bg-primary) px-2 py-1 text-[9px] font-bold text-[#efbf04]"
        >
          <span>View All</span>
          <ArrowRight size={10} strokeWidth={2} />
        </button>
      </div>

      <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
        {services.map((service) => {
          const selected = selectedServiceIds.includes(service.id);

          return (
            <article
              key={service.id}
              className={`
                feature-card w-[119px] shrink-0 rounded-xl
                ${selected ? "border-(--accent-primary) shadow-(--shadow-glow)" : ""}
              `}
            >
              <div className="relative h-[80px] overflow-hidden rounded-t-xl">
                <Image
                  src={service.image}
                  alt={service.name}
                  fill
                  sizes="140px"
                  className="object-cover"
                />
                <button
                  type="button"
                  onClick={() => onToggleService(service.id)}
                  aria-label={selected ? `Deselect ${service.name}` : `Select ${service.name}`}
                  className={`
                    absolute right-1 top-1 z-10 flex h-4 w-4 items-center
                    justify-center rounded-full border-2 transition-all duration-200
                    ${
                      selected
                        ? "primary-button border-(--accent-primary) text-white"
                        : "border-white bg-white/90"
                    }
                  `}
                >
                  {selected && <Check size={9} strokeWidth={3} />}
                </button>
              </div>
              <div className="p-2">
                <p className="mt-2 h-6 text-[10px] font-bold text-(--text-primary)">
                  {service.name}
                </p>
                <p className="mt-0.5 line-clamp-2 text-[9px] font-semibold leading-relaxed text-(--text-primary)">
                  {service.description}
                </p>
                <p className="mt-1 text-[9px] font-bold text-(--brand-gold)">
                  {service.price}
                </p>

                <div className="mt-2">
                  <Link
                    href={`/specificservice/${service.id}`}
                    className="
                      secondary-button flex w-full items-center justify-center
                      rounded-xs py-1 text-[10px] font-medium text-(--text-primary)
                    "
                  >
                    View
                  </Link>
                </div>
              </div>
            </article>
          );
        })}
      </div>
    </>
  );
}

function MobileTabbedServices({
  services,
  selectedServiceIds,
  onToggleService,
  onBookNow,
}: {
  services: ExtendedService[];
  selectedServiceIds: string[];
  onToggleService: (id: string) => void;
  onBookNow: () => void;
}) {
  const [activeCategory, setActiveCategory] = useState("massage");
  const [page, setPage] = useState(1);

  const activeLabel =
    serviceCategories.find((c) => c.id === activeCategory)?.label ?? "";

  const filteredServices = useMemo(
    () => services.filter((service) => service.categoryId === activeCategory),
    [services, activeCategory],
  );

  const selectedCounts = useMemo(() => {
    const counts: Record<string, number> = {};

    for (const id of selectedServiceIds) {
      const service = services.find((item) => item.id === id);
      if (service?.categoryId) {
        counts[service.categoryId] = (counts[service.categoryId] ?? 0) + 1;
      }
    }

    return counts;
  }, [selectedServiceIds, services]);

  const totalPages = Math.max(1, Math.ceil(filteredServices.length / PAGE_SIZE));

  const paginatedServices = useMemo(
    () =>
      filteredServices.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE),
    [filteredServices, page],
  );

  useEffect(() => {
    setPage(1);
  }, [activeCategory]);

  useEffect(() => {
    if (page > totalPages) setPage(totalPages);
  }, [page, totalPages]);

  return (
    <>
      <CategoryTabBar
        categories={serviceCategories}
        activeId={activeCategory}
        onSelect={setActiveCategory}
        selectedCounts={selectedCounts}
      />

      <div className="mt-3 flex items-center justify-between">
        <div>
          <h2 className="font-[family-name:var(--font-heading)] text-lg font-bold text-(--text-primary)">
            Select Services
          </h2>
          <p className="text-[10px] text-(--text-muted)">
            {activeLabel} • {filteredServices.length} available
            {(selectedCounts[activeCategory] ?? 0) > 0 &&
              ` • ${selectedCounts[activeCategory]} selected`}
          </p>
        </div>

        <button
          type="button"
          className="
            flex items-center gap-0.5 text-[9px] font-bold text-(--brand-gold)
            transition-opacity duration-200 hover:opacity-80
          "
        >
          <span>View All</span>
          <ArrowRight size={10} strokeWidth={2} />
        </button>
      </div>

      <div className="mt-2 grid grid-cols-4 items-stretch gap-2">
        {paginatedServices.map((service) => (
          <ServiceCard
            key={service.id}
            compact
            selected={selectedServiceIds.includes(service.id)}
            onSelect={() => onToggleService(service.id)}
            service={{
              id: service.id,
              title: service.name,
              price: service.price,
              duration: service.duration ?? "",
              image: service.image,
              categoryId: service.categoryId ?? "",
            }}
          />
        ))}
      </div>

      {totalPages > 1 && (
        <div className="mt-3 flex items-center justify-center gap-3">
          <button
            type="button"
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page <= 1}
            className="
              flex items-center gap-0.5 text-[9px] font-bold text-(--text-primary)
              transition-opacity duration-200 disabled:opacity-30
            "
          >
            <ChevronLeft size={12} strokeWidth={2} />
            <span>Back</span>
          </button>

          <div className="flex items-center gap-1.5">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map(
              (pageNum) => (
                <button
                  key={pageNum}
                  type="button"
                  onClick={() => setPage(pageNum)}
                  className={`
                    flex h-5 w-5 items-center justify-center rounded-full
                    text-[9px] font-bold transition-all duration-200
                    ${
                      pageNum === page
                        ? "primary-button text-white"
                        : "text-(--text-muted) hover:text-(--text-primary)"
                    }
                  `}
                >
                  {pageNum}
                </button>
              ),
            )}
          </div>

          <button
            type="button"
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page >= totalPages}
            className="
              flex items-center gap-0.5 text-[9px] font-bold text-(--text-primary)
              transition-opacity duration-200 disabled:opacity-30
            "
          >
            <span>Next</span>
            <ChevronRight size={12} strokeWidth={2} />
          </button>
        </div>
      )}

      <ServicesSelectionBar
        selectedCount={selectedServiceIds.length}
        onBookNow={onBookNow}
      />
    </>
  );
}

export function ServicesSection({
  services,
  selectedServiceIds,
  onToggleService,
  onBookNow,
}: ServicesSectionProps) {
  return (
    <section>
      <div className="md:hidden">
        <MobileTabbedServices
          services={services}
          selectedServiceIds={selectedServiceIds}
          onToggleService={onToggleService}
          onBookNow={onBookNow}
        />
      </div>

      <div className="hidden md:block">
        <DesktopServicesScroll
          services={services}
          selectedServiceIds={selectedServiceIds}
          onToggleService={onToggleService}
        />
        <ServicesSelectionBar
          selectedCount={selectedServiceIds.length}
          onBookNow={onBookNow}
        />
      </div>
    </section>
  );
}
