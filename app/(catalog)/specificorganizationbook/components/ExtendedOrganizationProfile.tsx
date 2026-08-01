"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import Swal from "sweetalert2";
import {
  ArrowRight,
  CalendarDays,
  Check,
  ChevronLeft,
  ChevronRight,
  Clock3,
  MapPin,
  PlayCircle,
  Send,
  Share2,
  ShoppingCart,
  Star,
  UserRound,
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
  productCategories,
} from "@/menu/menu.data";
import { buildBookingUrl } from "@/booking/booking.navigation";
import type { SectionData, Suggestion, SuggestionsSectionMeta } from "@/types/store";
import { ExtendedOrganization } from "../organization.types";
import { HeroBanner } from "./HeroBanner";
import {
  SelectionPreviewSidebar,
} from "./SelectionPreviewSidebar";

type MenuCatalogTab = "service" | "product";

interface ExtendedOrganizationProfileProps {
  organization: ExtendedOrganization;
  suggestions?: SectionData<Suggestion, SuggestionsSectionMeta>;
}

const swalDefaults = {
  confirmButtonText: "Okay",
  confirmButtonColor: "#b8860b",
  background: "#1a1a1a",
  color: "#ffffff",
} as const;

function parsePrice(price: string) {
  return Number(price.replace(/[^0-9.]/g, "")) || 0;
}

function MenuCatalogTabs({
  active,
  onChange,
}: {
  active: MenuCatalogTab;
  onChange: (tab: MenuCatalogTab) => void;
}) {
  return (
    <div className="mb-4 flex items-center justify-between gap-3">
      <div
        className="
          inline-flex rounded-full border border-(--border)
          bg-(--bg-secondary) p-0.5
        "
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
                min-w-[88px] rounded-full px-4 py-1.5 text-sm font-semibold
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
        className="inline-flex items-center gap-1 text-sm font-medium text-(--brand-gold) transition-opacity hover:opacity-80"
      >
        <span>Select</span>
        <ArrowRight size={16} />
      </button>
    </div>
  );
}

function DesktopSectionHeader({
  title,
  actionLabel = "View All",
}: {
  title: string;
  actionLabel?: string;
}) {
  return (
    <div className="mb-4 flex items-center justify-between">
      <h2 className="text-xl font-semibold text-(--text-primary)">{title}</h2>
      <button
        type="button"
        className="inline-flex items-center gap-1 text-sm font-medium text-(--brand-gold) transition-opacity hover:opacity-80"
      >
        <span>{actionLabel}</span>
        <ArrowRight size={16} />
      </button>
    </div>
  );
}

export function ExtendedOrganizationProfile({
  organization,
}: ExtendedOrganizationProfileProps) {
  const [activeCategory, setActiveCategory] = useState("massage");
  const [menuTab, setMenuTab] = useState<MenuCatalogTab>("service");
  const [selectedServiceIds, setSelectedServiceIds] = useState<string[]>([]);
  const [selectedProductIds, setSelectedProductIds] = useState<string[]>([]);
  const [serviceStaff, setServiceStaff] = useState<Record<string, string>>({});
  const [assigningServiceId, setAssigningServiceId] = useState<string | null>(
    null,
  );
  const [previewProductId, setPreviewProductId] = useState<string | null>(null);
  const [previewServiceId, setPreviewServiceId] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const serviceTabsScrollRef = useRef<HTMLDivElement>(null);
  const productTabsScrollRef = useRef<HTMLDivElement>(null);

  const scrollPreviewTabs = (
    ref: React.RefObject<HTMLDivElement | null>,
    direction: "left" | "right",
  ) => {
    const container = ref.current;
    if (!container) return;
    container.scrollBy({
      left: direction === "left" ? -180 : 180,
      behavior: "smooth",
    });
  };

  const categoryServices = useMemo(
    () => getServicesByCategory(activeCategory),
    [activeCategory],
  );
  const categoryProducts = useMemo(
    () => getProductsByCategory(activeCategory),
    [activeCategory],
  );

  const catalogCategories =
    menuTab === "product" ? productCategories : menuCategories;

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
    catalogCategories.find((c) => c.id === activeCategory)?.label ??
    (menuTab === "product" ? "Products" : "Services");

  useEffect(() => {
    setPage(1);
  }, [activeCategory, menuTab]);

  useEffect(() => {
    if (page > totalPages) setPage(totalPages);
  }, [page, totalPages]);

  const handleCategorySelect = (categoryId: string) => {
    setActiveCategory(categoryId);
  };

  const handleMenuTabChange = (tab: MenuCatalogTab) => {
    if (tab === menuTab) return;

    setMenuTab(tab);
    setPage(1);

    const nextCategories =
      tab === "product" ? productCategories : menuCategories;
    const stillValid = nextCategories.some((c) => c.id === activeCategory);
    if (!stillValid) {
      setActiveCategory(nextCategories[0]?.id ?? "massage");
    }

    if (tab === "product") {
      setSelectedServiceIds([]);
      setServiceStaff({});
      setAssigningServiceId(null);
      setPreviewServiceId(null);
    } else {
      setSelectedProductIds([]);
      setPreviewProductId(null);
    }
  };

  const toggleService = (serviceId: string) => {
    if (menuTab !== "service") {
      handleMenuTabChange("service");
    }

    setSelectedServiceIds((prev) => {
      const removing = prev.includes(serviceId);
      const next = removing
        ? prev.filter((id) => id !== serviceId)
        : [...prev, serviceId];

      if (removing) {
        setServiceStaff((current) => {
          const { [serviceId]: _, ...rest } = current;
          return rest;
        });
        setAssigningServiceId((current) =>
          current === serviceId ? null : current,
        );
      }

      setPreviewServiceId((current) => {
        if (!removing) return serviceId;
        if (current === serviceId) {
          return next[next.length - 1] ?? null;
        }
        return current && next.includes(current)
          ? current
          : (next[next.length - 1] ?? null);
      });

      return next;
    });
  };

  const toggleProduct = (productId: string) => {
    if (menuTab !== "product") {
      handleMenuTabChange("product");
    }

    setSelectedProductIds((prev) => {
      const removing = prev.includes(productId);
      const next = removing
        ? prev.filter((id) => id !== productId)
        : [...prev, productId];

      setPreviewProductId((current) => {
        if (!removing) return productId;
        if (current === productId) {
          return next[next.length - 1] ?? null;
        }
        return current && next.includes(current)
          ? current
          : (next[next.length - 1] ?? null);
      });

      return next;
    });
  };

  const removeServiceFromSelection = (serviceId: string) => {
    setSelectedServiceIds((prev) => {
      const next = prev.filter((id) => id !== serviceId);
      setPreviewServiceId((current) => {
        if (current !== serviceId) {
          return current && next.includes(current)
            ? current
            : (next[next.length - 1] ?? null);
        }
        return next[next.length - 1] ?? null;
      });
      return next;
    });
    setServiceStaff((current) => {
      const { [serviceId]: _, ...rest } = current;
      return rest;
    });
    setAssigningServiceId((current) =>
      current === serviceId ? null : current,
    );
  };

  const removeProductFromSelection = (productId: string) => {
    setSelectedProductIds((prev) => {
      const next = prev.filter((id) => id !== productId);
      setPreviewProductId((current) => {
        if (current !== productId) {
          return current && next.includes(current)
            ? current
            : (next[next.length - 1] ?? null);
        }
        return next[next.length - 1] ?? null;
      });
      return next;
    });
  };

  const handleAssignStaffRequest = (serviceId: string) => {
    setAssigningServiceId(serviceId);
    setPreviewServiceId(serviceId);
  };

  const handleSelectStaffForService = (staffId: string) => {
    if (!assigningServiceId) {
      Swal.fire({
        icon: "info",
        title: "Choose a service first",
        text: "Tap Select staff on a service in Your Selection, then pick a staff member.",
        ...swalDefaults,
      });
      return;
    }

    setServiceStaff((current) => ({
      ...current,
      [assigningServiceId]: staffId,
    }));
    setAssigningServiceId(null);
  };

  const selectableServices = useMemo(() => {
    const map = new Map<
      string,
      {
        id: string;
        name: string;
        price: string;
        image: string;
        description?: string;
        duration?: string;
        categoryId?: string;
      }
    >();

    for (const service of organization.services) {
      map.set(service.id, service);
    }

    for (const service of allMenuServices) {
      if (!map.has(service.id)) {
        map.set(service.id, {
          id: service.id,
          name: service.title,
          price: service.price,
          image: service.image,
          duration: service.duration,
          categoryId: service.categoryId,
        });
      }
    }

    return map;
  }, [organization.services]);

  const selectedServices = useMemo(
    () =>
      selectedServiceIds
        .map((id) => selectableServices.get(id))
        .filter((service): service is NonNullable<typeof service> => Boolean(service)),
    [selectableServices, selectedServiceIds],
  );

  const selectedProducts = useMemo(
    () =>
      selectedProductIds
        .map((id) => allMenuProducts.find((product) => product.id === id))
        .filter((product): product is NonNullable<typeof product> =>
          Boolean(product),
        ),
    [selectedProductIds],
  );

  const staffById = useMemo(() => {
    const map: Record<string, (typeof organization.staff)[number]> = {};
    for (const member of organization.staff) {
      map[member.id] = member;
    }
    return map;
  }, [organization.staff]);

  const totalPrice = useMemo(() => {
    if (menuTab === "product") {
      return selectedProducts.reduce(
        (sum, product) => sum + parsePrice(product.price),
        0,
      );
    }

    return selectedServices.reduce(
      (sum, service) => sum + parsePrice(service.price),
      0,
    );
  }, [menuTab, selectedProducts, selectedServices]);

  const cartCount =
    menuTab === "product"
      ? selectedProductIds.length
      : selectedServiceIds.length;

  const categorySelectedCounts = useMemo(() => {
    const counts: Record<string, number> = {};

    if (menuTab === "service") {
      for (const service of selectedServices) {
        if (service.categoryId) {
          counts[service.categoryId] = (counts[service.categoryId] ?? 0) + 1;
        }
      }
      return counts;
    }

    for (const productId of selectedProductIds) {
      const product = allMenuProducts.find((item) => item.id === productId);
      if (product) {
        counts[product.categoryId] = (counts[product.categoryId] ?? 0) + 1;
      }
    }
    return counts;
  }, [menuTab, selectedProductIds, selectedServices]);

  const isProductFlow = menuTab === "product";

  const primaryStaffId =
    selectedServiceIds.map((id) => serviceStaff[id]).find(Boolean) ?? undefined;

  const serviceBookingUrl = buildBookingUrl({
    serviceIds: selectedServiceIds,
    expertType: "",
    organizationId: organization.id,
    staffId: primaryStaffId,
    staffAssignments: serviceStaff,
    step: 2,
  });

  const productBookingUrl = buildBookingUrl({
    productIds: selectedProductIds,
    organizationId: organization.id,
    step: 1,
  });

  const bookingUrl = isProductFlow ? productBookingUrl : serviceBookingUrl;

  const handleNext = (options?: { requireStaff?: boolean }) => {
    if (isProductFlow) {
      if (selectedProductIds.length === 0) {
        Swal.fire({
          icon: "warning",
          title: "Select a product first",
          text: "Please choose at least one product before continuing.",
          ...swalDefaults,
        });
        return;
      }

      window.location.href = productBookingUrl;
      return;
    }

    const requireStaff = options?.requireStaff ?? true;

    if (selectedServiceIds.length === 0) {
      Swal.fire({
        icon: "warning",
        title: "Select a service first",
        text: "Please choose at least one service before continuing.",
        ...swalDefaults,
      });
      return;
    }

    if (requireStaff) {
      const missingStaff = selectedServices.filter(
        (service) => !serviceStaff[service.id],
      );

      if (missingStaff.length > 0) {
        const names = missingStaff.map((service) => service.name).join(", ");
        Swal.fire({
          icon: "warning",
          title: "Select staff",
          text:
            missingStaff.length === 1
              ? `Please select a staff member for ${names}.`
              : `Please select staff for: ${names}.`,
          ...swalDefaults,
        });
        setAssigningServiceId(missingStaff[0]?.id ?? null);
        return;
      }
    }

    window.location.href = serviceBookingUrl;
  };

  const handleBookNowMobile = () => {
    handleNext({ requireStaff: false });
  };

  const handleBookNow = () => {
    handleNext({ requireStaff: true });
  };

  const canBookMobile = isProductFlow
    ? selectedProductIds.length > 0
    : selectedServiceIds.length > 0;

  const canBook = isProductFlow
    ? selectedProductIds.length > 0
    : selectedServiceIds.length > 0 &&
      selectedServiceIds.every((id) => Boolean(serviceStaff[id]));

  return (
    <>
      <div className="space-y-4 px-2 pb-32 pt-2 lg:hidden">
        <HeroBanner
          images={organization.heroImages}
          availability={organization.availability}
          salonName={organization.name}
          organization={organization}
          canBook={canBookMobile}
          bookingUrl={bookingUrl}
          onBookNow={handleBookNowMobile}
        />

        <div className="space-y-2">
          <div
            className="
              inline-flex w-full rounded-full border border-(--border)
              bg-(--bg-secondary) p-0.5
            "
            role="tablist"
            aria-label="Catalog type"
          >
            {([
              { id: "service", label: "Service" },
              { id: "product", label: "Product" },
            ] as const).map((tab) => {
              const isActive = menuTab === tab.id;

              return (
                <button
                  key={tab.id}
                  type="button"
                  role="tab"
                  aria-selected={isActive}
                  onClick={() => handleMenuTabChange(tab.id)}
                  className={`
                    flex-1 rounded-full px-3 py-1.5 text-[10px] font-semibold
                    transition-all duration-200
                    ${
                      isActive
                        ? "bg-(--bg-card) text-(--text-primary) shadow-(--shadow-card) ring-1 ring-(--brand-gold)"
                        : "text-(--text-muted)"
                    }
                  `}
                >
                  {tab.label}
                </button>
              );
            })}
          </div>

        <div className="flex min-h-[420px] overflow-hidden rounded-xl border border-(--border)">
          <CategorySidebar
            categories={catalogCategories}
            activeId={activeCategory}
            onSelect={handleCategorySelect}
            selectedCounts={categorySelectedCounts}
          />

          <div className="flex min-w-0 flex-1 flex-col overflow-hidden bg-(--bg-secondary)">
            <div className="flex-1 overflow-y-auto scrollbar-none">
              <div className="px-2 pb-3 pt-3">
                <div className="mb-3 flex items-center justify-between">
                  <div>
                    <h1 className="text-xs font-medium text-(--text-primary)">
                      {menuTab === "service"
                        ? "Select Services"
                        : "Select Products"}
                    </h1>
                    <p className="text-[8px] text-(--text-muted)">
                      {activeCategoryLabel} · {catalogItems.length} available
                      {menuTab === "service"
                        ? selectedServiceIds.length > 0 &&
                          ` · ${selectedServiceIds.length} selected`
                        : selectedProductIds.length > 0 &&
                          ` · ${selectedProductIds.length} selected`}
                    </p>
                  </div>

                  <button
                    type="button"
                    className="
                      flex items-center gap-0.5 text-[8px]
                      text-(--brand-gold) transition-opacity duration-200
                      hover:opacity-80
                    "
                  >
                    <span>View All</span>
                    <ArrowRight size={10} strokeWidth={2} />
                  </button>
                </div>

                <div className="grid grid-cols-3 gap-1.5">
                  {menuTab === "service" ? (
                    paginatedServices.length > 0 ? (
                      paginatedServices.map((service) => (
                        <ServiceCard
                          key={service.id}
                          compact
                          service={service}
                          selected={selectedServiceIds.includes(service.id)}
                          onSelect={() => toggleService(service.id)}
                        />
                      ))
                    ) : (
                      <p className="col-span-3 py-8 text-center text-[10px] text-(--text-muted)">
                        No services in this category yet.
                      </p>
                    )
                  ) : paginatedProducts.length > 0 ? (
                    paginatedProducts.map((product) => (
                      <MenuProductCard
                        key={product.id}
                        product={product}
                        selected={selectedProductIds.includes(product.id)}
                        onSelect={() => toggleProduct(product.id)}
                      />
                    ))
                  ) : (
                    <p className="col-span-3 py-8 text-center text-[10px] text-(--text-muted)">
                      No products in this category yet.
                    </p>
                  )}
                </div>

                {totalPages > 1 && (
                  <div className="mt-3 flex items-center justify-end gap-2 pr-1">
                    <button
                      type="button"
                      onClick={() => setPage((p) => Math.max(1, p - 1))}
                      disabled={page === 1}
                      aria-label="Previous page"
                      className="
                        flex items-center gap-0.5 rounded-md px-2 py-1 text-[11px]
                        font-semibold text-(--text-primary) transition-colors
                        duration-200 hover:bg-(--bg-primary)
                        disabled:cursor-not-allowed disabled:opacity-40
                        disabled:hover:bg-transparent
                      "
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
                            aria-current={page === p ? "page" : undefined}
                            className={`
                              flex h-6 w-6 items-center justify-center rounded-md
                              text-[11px] font-bold transition-colors duration-200
                              ${
                                page === p
                                  ? "bg-(--text-primary) text-(--brand-gold)"
                                  : "text-(--text-primary) hover:bg-(--bg-primary)"
                              }
                            `}
                          >
                            {p}
                          </button>
                        ),
                      )}
                    </div>

                    <button
                      type="button"
                      onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                      disabled={page === totalPages}
                      aria-label="Next page"
                      className="
                        flex items-center gap-0.5 rounded-md px-2 py-1 text-[11px]
                        font-semibold text-(--text-primary) transition-colors
                        duration-200 hover:bg-(--bg-primary)
                        disabled:cursor-not-allowed disabled:opacity-40
                        disabled:hover:bg-transparent
                      "
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

        <div
          className="
            fixed inset-x-2 bottom-[85px] z-40 overflow-hidden rounded-xl
            border border-(--border) bg-(--bg-card)/95 shadow-(--shadow-card)
            backdrop-blur-xl
          "
        >
          <div className="flex items-stretch">
            <div className="flex items-center gap-2.5 px-3 py-2.5">
              <div className="relative shrink-0">
                <span
                  className="
                    primary-button flex h-10 w-10 items-center justify-center
                    rounded-xl
                  "
                >
                  <ShoppingCart size={18} strokeWidth={2} className="text-white" />
                </span>
                {cartCount > 0 && (
                  <span
                    className="
                      absolute -right-1 -top-1 flex h-4 min-w-4 items-center
                      justify-center rounded-full bg-(--brand-gold) px-1
                      text-[8px] font-bold text-(--text-primary)
                    "
                    aria-label={`${cartCount} items in cart`}
                  >
                    {cartCount}
                  </span>
                )}
              </div>

              <div className="min-w-0">
                {cartCount > 0 && (
                  <span className="text-sm font-semibold text-(--brand-gold)">
                    ${totalPrice}
                  </span>
                )}
              </div>
            </div>

            {canBookMobile ? (
              <Link
                href={bookingUrl}
                className="
                  primary-button flex flex-1 items-center justify-center
                  rounded-none px-3 py-3 text-[11px] font-semibold text-white
                "
              >
                Next <ArrowRight size={14} strokeWidth={2.5} />
              </Link>
            ) : (
              <button
                type="button"
                onClick={handleBookNowMobile}
                className="
                  primary-button flex flex-1 items-center justify-center
                  rounded-none px-3 py-3 text-[11px] font-semibold text-white
                  opacity-60
                "
              >
                Next <ArrowRight size={14} strokeWidth={2.5} />
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="hidden lg:block">
        <main className="min-h-screen bg-(--bg-primary) pb-10">
          <div className="mx-auto max-w-[1600px] px-4 py-6 xl:px-8">
            <div className="grid grid-cols-1 gap-5 xl:grid-cols-[280px_minmax(0,1fr)_500px] xl:gap-6">
              <SelectionPreviewSidebar
                previewTab={menuTab}
                onPreviewTabChange={handleMenuTabChange}
                services={selectedServices.map((service) => ({
                  id: service.id,
                  name: service.name,
                  price: service.price,
                  image: service.image,
                  duration: service.duration,
                }))}
                products={selectedProducts}
                serviceStaff={serviceStaff}
                staffById={staffById}
                assigningServiceId={isProductFlow ? null : assigningServiceId}
                totalPrice={totalPrice}
                onAssignStaffRequest={handleAssignStaffRequest}
                onRemoveService={removeServiceFromSelection}
                onRemoveProduct={removeProductFromSelection}
                onNext={() =>
                  handleNext({
                    requireStaff: !isProductFlow,
                  })
                }
              />

              <div className="order-1 space-y-6 xl:order-none xl:space-y-3">
                <section className="overflow-hidden rounded-[28px] border border-(--border) bg-(--bg-card) shadow-[var(--shadow-card)]">
                  <div className="grid grid-cols-1 lg:grid-cols-[1.45fr_0.9fr]">
                    <div className="relative h-[240px] sm:h-[280px] lg:min-h-[280px]">
                      <Image
                        src={organization.heroImages[0] ?? organization.thumbnail}
                        alt={organization.name}
                        fill
                        sizes="(min-width: 1000px) 720px, 100vw"
                        className="object-cover"
                        priority
                      />

                      <div className="absolute left-4 top-4 z-10">
                        <div className="flex items-center gap-2">
                          <TimingsDropdown
                            summary={organization.availability}
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
                          {organization.name}
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

                {!isProductFlow && (
                <section className="overflow-hidden rounded-[20px] border border-(--border) bg-(--bg-card) shadow-[var(--shadow-card)]">
                  {selectedServices.length === 0 ? (
                    <div className="flex min-h-[120px] flex-col items-center justify-center gap-1 bg-(--bg-secondary) px-4 py-6 text-center">
                      <p className="text-sm font-semibold text-(--text-primary)">
                        Service preview
                      </p>
                      <p className="text-[12px] text-(--text-muted)">
                        Select a service from the menu to preview it here.
                      </p>
                    </div>
                  ) : (
                    (() => {
                      const focusedService =
                        selectedServices.find(
                          (service) =>
                            service.id ===
                            (assigningServiceId ?? previewServiceId),
                        ) ?? selectedServices[selectedServices.length - 1];
                      const focusedStaffId = serviceStaff[focusedService.id];
                      const focusedStaff = focusedStaffId
                        ? staffById[focusedStaffId]
                        : undefined;

                      return (
                        <div>
                          <div className="flex items-center gap-2 border-b border-(--border) bg-(--bg-secondary) px-3 py-2.5">
                            <button
                              type="button"
                              onClick={() =>
                                scrollPreviewTabs(serviceTabsScrollRef, "left")
                              }
                              aria-label="Slide service cards left"
                              className="
                                flex h-8 w-8 shrink-0 items-center justify-center
                                rounded-full border border-(--border) bg-(--bg-card)
                                text-(--text-primary) transition-colors
                                hover:border-(--brand-gold)
                              "
                            >
                              <ChevronLeft size={16} strokeWidth={2.5} />
                            </button>

                            <div
                              ref={serviceTabsScrollRef}
                              className="scrollbar-none flex min-w-0 flex-1 gap-2 overflow-x-auto"
                            >
                              {selectedServices.map((service, index) => {
                                const isActive = service.id === focusedService.id;

                                return (
                                  <button
                                    key={service.id}
                                    type="button"
                                    onClick={() => setPreviewServiceId(service.id)}
                                    className={`
                                      flex shrink-0 items-center gap-2 rounded-xl border
                                      px-2 py-1.5 transition-all
                                      ${
                                        isActive
                                          ? "border-(--brand-gold) bg-(--bg-card) shadow-(--shadow-card)"
                                          : "border-(--border) bg-(--bg-card)/70 hover:border-(--brand-gold)/50"
                                      }
                                    `}
                                  >
                                    <div className="relative h-8 w-8 overflow-hidden rounded-lg">
                                      <Image
                                        src={service.image}
                                        alt={service.name}
                                        fill
                                        sizes="32px"
                                        className="object-cover"
                                      />
                                    </div>
                                    <div className="min-w-0 text-left">
                                      <p className="text-[9px] font-semibold uppercase tracking-wide text-(--text-muted)">
                                        Service {index + 1}
                                      </p>
                                      <p
                                        className={`
                                          max-w-[88px] truncate text-[11px] font-semibold
                                          ${
                                            isActive
                                              ? "text-(--text-primary)"
                                              : "text-(--text-secondary)"
                                          }
                                        `}
                                      >
                                        {service.name}
                                      </p>
                                    </div>
                                  </button>
                                );
                              })}
                            </div>

                            <button
                              type="button"
                              onClick={() =>
                                scrollPreviewTabs(serviceTabsScrollRef, "right")
                              }
                              aria-label="Slide service cards right"
                              className="
                                flex h-8 w-8 shrink-0 items-center justify-center
                                rounded-full border border-(--border) bg-(--bg-card)
                                text-(--text-primary) transition-colors
                                hover:border-(--brand-gold)
                              "
                            >
                              <ChevronRight size={16} strokeWidth={2.5} />
                            </button>
                          </div>

                          <div className="grid grid-cols-1 lg:grid-cols-[1.2fr_1fr]">
                            <div className="relative h-[120px] sm:h-[180px] lg:min-h-[180px]">
                              <Image
                                src={focusedService.image}
                                alt={focusedService.name}
                                fill
                                sizes="(min-width: 1000px) 420px, 100vw"
                                className="object-cover"
                              />
                              {assigningServiceId === focusedService.id && (
                                <span className="absolute left-3 top-3 rounded-full bg-(--brand-gold) px-2.5 py-1 text-[10px] font-bold text-(--text-primary)">
                                  Selecting staff
                                </span>
                              )}
                            </div>

                            <div className="flex flex-col justify-center gap-2 bg-(--bg-secondary) p-3 lg:p-4">
                              <div className="min-w-0">
                                <p className="text-[10px] font-semibold uppercase tracking-wide text-(--text-muted)">
                                  Selected service
                                </p>
                                <h2 className="mt-0.5 truncate text-[18px] font-semibold leading-tight text-(--text-primary)">
                                  {focusedService.name}
                                </h2>
                                <p className="mt-1 text-[12px] text-(--text-secondary)">
                                  {[focusedService.duration, focusedService.price]
                                    .filter(Boolean)
                                    .join(" · ")}
                                </p>
                              </div>

                              {focusedStaff ? (
                                <div className="flex items-center gap-2 rounded-xl border border-(--border) bg-(--bg-card) px-2 py-1.5">
                                  <div className="relative h-8 w-8 shrink-0 overflow-hidden rounded-full">
                                    <Image
                                      src={focusedStaff.image}
                                      alt={focusedStaff.name}
                                      fill
                                      sizes="32px"
                                      className="object-cover"
                                    />
                                  </div>
                                  <div className="min-w-0 flex-1">
                                    <p className="truncate text-[11px] font-semibold text-(--text-primary)">
                                      {focusedStaff.name}
                                    </p>
                                    <p className="text-[10px] text-(--text-muted)">
                                      Staff assigned
                                    </p>
                                  </div>
                                  <button
                                    type="button"
                                    onClick={() =>
                                      handleAssignStaffRequest(focusedService.id)
                                    }
                                    className="shrink-0 text-[10px] font-semibold text-(--brand-gold)"
                                  >
                                    Change
                                  </button>
                                </div>
                              ) : (
                                <button
                                  type="button"
                                  onClick={() =>
                                    handleAssignStaffRequest(focusedService.id)
                                  }
                                  className="
                                    primary-button inline-flex h-9 w-fit items-center
                                    justify-center gap-2 rounded-full px-3 text-[11px]
                                    font-semibold text-white
                                  "
                                >
                                  <UserRound size={14} />
                                  Select Staff
                                </button>
                              )}
                            </div>
                          </div>
                        </div>
                      );
                    })()
                  )}
                </section>
                )}

                {isProductFlow && (
                <section className="overflow-hidden rounded-[20px] border border-(--border) bg-(--bg-card) shadow-[var(--shadow-card)]">
                  {selectedProducts.length === 0 ? (
                    <div className="flex min-h-[120px] flex-col items-center justify-center gap-1 bg-(--bg-secondary) px-4 py-6 text-center">
                      <p className="text-sm font-semibold text-(--text-primary)">
                        Product preview
                      </p>
                      <p className="text-[12px] text-(--text-muted)">
                        Select a product from the menu to preview it here.
                      </p>
                    </div>
                  ) : (
                    (() => {
                      const focusedProduct =
                        selectedProducts.find(
                          (product) => product.id === previewProductId,
                        ) ?? selectedProducts[selectedProducts.length - 1];

                      return (
                        <div>
                          <div className="flex items-center gap-2 border-b border-(--border) bg-(--bg-secondary) px-3 py-2.5">
                            <button
                              type="button"
                              onClick={() =>
                                scrollPreviewTabs(productTabsScrollRef, "left")
                              }
                              aria-label="Slide product cards left"
                              className="
                                flex h-8 w-8 shrink-0 items-center justify-center
                                rounded-full border border-(--border) bg-(--bg-card)
                                text-(--text-primary) transition-colors
                                hover:border-(--brand-gold)
                              "
                            >
                              <ChevronLeft size={16} strokeWidth={2.5} />
                            </button>

                            <div
                              ref={productTabsScrollRef}
                              className="scrollbar-none flex min-w-0 flex-1 gap-2 overflow-x-auto"
                            >
                              {selectedProducts.map((product, index) => {
                                const isActive =
                                  product.id === focusedProduct.id;

                                return (
                                  <button
                                    key={product.id}
                                    type="button"
                                    onClick={() =>
                                      setPreviewProductId(product.id)
                                    }
                                    className={`
                                      flex shrink-0 items-center gap-2 rounded-xl border
                                      px-2 py-1.5 transition-all
                                      ${
                                        isActive
                                          ? "border-(--brand-gold) bg-(--bg-card) shadow-(--shadow-card)"
                                          : "border-(--border) bg-(--bg-card)/70 hover:border-(--brand-gold)/50"
                                      }
                                    `}
                                  >
                                    <div className="relative h-8 w-8 overflow-hidden rounded-lg">
                                      <Image
                                        src={product.image}
                                        alt={product.title}
                                        fill
                                        sizes="32px"
                                        className="object-cover"
                                      />
                                    </div>
                                    <div className="min-w-0 text-left">
                                      <p className="text-[9px] font-semibold uppercase tracking-wide text-(--text-muted)">
                                        Product {index + 1}
                                      </p>
                                      <p
                                        className={`
                                          max-w-[88px] truncate text-[11px] font-semibold
                                          ${
                                            isActive
                                              ? "text-(--text-primary)"
                                              : "text-(--text-secondary)"
                                          }
                                        `}
                                      >
                                        {product.title}
                                      </p>
                                    </div>
                                  </button>
                                );
                              })}
                            </div>

                            <button
                              type="button"
                              onClick={() =>
                                scrollPreviewTabs(productTabsScrollRef, "right")
                              }
                              aria-label="Slide product cards right"
                              className="
                                flex h-8 w-8 shrink-0 items-center justify-center
                                rounded-full border border-(--border) bg-(--bg-card)
                                text-(--text-primary) transition-colors
                                hover:border-(--brand-gold)
                              "
                            >
                              <ChevronRight size={16} strokeWidth={2.5} />
                            </button>
                          </div>

                          <div className="grid grid-cols-1 lg:grid-cols-[1.2fr_1fr]">
                            <div className="relative h-[120px] sm:h-[180px] lg:min-h-[180px]">
                              <Image
                                src={focusedProduct.image}
                                alt={focusedProduct.title}
                                fill
                                sizes="(min-width: 1000px) 420px, 100vw"
                                className="object-cover"
                              />
                            </div>

                            <div className="flex flex-col justify-center gap-2 bg-(--bg-secondary) p-3 lg:p-4">
                              <div className="min-w-0">
                                <p className="text-[10px] font-semibold uppercase tracking-wide text-(--text-muted)">
                                  Selected product
                                </p>
                                <h2 className="mt-0.5 truncate text-[18px] font-semibold leading-tight text-(--text-primary)">
                                  {focusedProduct.title}
                                </h2>
                                <p className="mt-1 text-[12px] text-(--text-secondary)">
                                  {[focusedProduct.quantity, focusedProduct.price]
                                    .filter(Boolean)
                                    .join(" · ")}
                                </p>
                              </div>

                              <p className="text-[11px] text-(--text-muted)">
                                {selectedProductIds.length === 1
                                  ? "1 product in your cart"
                                  : `${selectedProductIds.length} products in your cart`}
                              </p>
                            </div>
                          </div>
                        </div>
                      );
                    })()
                  )}
                </section>
                )}

                {!isProductFlow && (
                <section>
                  <DesktopSectionHeader title="Staff" actionLabel="View All" />
                  {assigningServiceId && (
                    <p className="mb-3 rounded-lg border border-(--brand-gold)/40 bg-[color-mix(in_srgb,var(--brand-gold)_10%,transparent)] px-3 py-2 text-sm font-medium text-(--text-primary)">
                      Selecting staff for{" "}
                      <span className="text-(--brand-gold)">
                        {selectableServices.get(assigningServiceId)?.name ??
                          "selected service"}
                      </span>
                      . Tap Select on a staff card.
                    </p>
                  )}
                  <div className="grid grid-cols-2 gap-1.5 xl:grid-cols-4">
                    {organization.staff.map((member, index) => {
                      const isAssignedSomewhere = Object.values(
                        serviceStaff,
                      ).includes(member.id);
                      const isActiveAssignment =
                        assigningServiceId != null &&
                        serviceStaff[assigningServiceId] === member.id;
                      const highlight =
                        isActiveAssignment ||
                        (!assigningServiceId && isAssignedSomewhere);

                      return (
                      <article
                        key={member.id}
                        className={`flex h-full w-full flex-col overflow-hidden rounded-[16px] border bg-(--bg-card) shadow-[var(--shadow-card)] transition-all duration-300 hover:-translate-y-0.5 ${
                          highlight
                            ? "border-(--accent-primary) ring-1 ring-(--accent-primary)"
                            : assigningServiceId
                              ? "border-(--brand-gold)/40"
                              : "border-(--border)"
                        }`}
                      >
                        <div className="relative h-[96px] overflow-hidden rounded-t-[14px] bg-(--bg-secondary)">
                          <span className="absolute left-2 top-2 z-10 h-2 w-2 rounded-full bg-(--success)" />
                          <Image
                            src={member.image}
                            alt={member.name}
                            fill
                            sizes="160px"
                            className="object-cover"
                          />
                        </div>

                        <div className="flex flex-1 flex-col px-2 pb-2 pt-2 text-center">
                          <h3 className="line-clamp-1 text-[13px] font-semibold text-(--text-primary)">
                            {member.name}
                          </h3>
                          <p className="mt-0.5 line-clamp-1 text-[10px] text-(--text-secondary)">
                            {index === 0
                              ? "Massage Expert"
                              : index === 1
                                ? "Spa Therapist"
                                : index === 2
                                  ? "Wellness Coach"
                                  : "Thai Specialist"}
                          </p>

                          <div className="mt-1 flex items-center justify-center gap-0.5 text-[11px] font-medium text-(--text-secondary)">
                            <Star
                              size={11}
                              className="fill-(--brand-gold) text-(--brand-gold)"
                            />
                            <span>{(4.9 - index * 0.1).toFixed(1)}</span>
                          </div>

                          <button
                            type="button"
                            onClick={() => handleSelectStaffForService(member.id)}
                            className={
                              isActiveAssignment || (isAssignedSomewhere && !assigningServiceId)
                                ? "primary-button mt-2 flex h-8 w-full items-center justify-center gap-1.5 rounded-lg text-[11px] font-semibold text-white"
                                : "secondary-button mt-2 flex h-8 w-full items-center justify-center rounded-lg text-[11px] font-semibold"
                            }
                          >
                            {isActiveAssignment ? (
                              <>
                                <Check size={13} />
                                Selected
                              </>
                            ) : assigningServiceId ? (
                              "Select"
                            ) : isAssignedSomewhere ? (
                              <>
                                <Check size={13} />
                                Assigned
                              </>
                            ) : (
                              "Select"
                            )}
                          </button>
                        </div>
                      </article>
                      );
                    })}
                  </div>
                </section>
                )}

                {/* <section>
                  <DesktopSectionHeader title="Reviews" actionLabel="View All" />
                  <div className="grid gap-4 xl:grid-cols-2">
                    {organization.reviews.map((review) => (
                      <article
                        key={review.id}
                        className="relative flex h-full w-full flex-col overflow-hidden rounded-[var(--radius-md)] border border-(--border) bg-(--bg-card) p-3 shadow-[var(--shadow-card)] transition-all duration-300 hover:-translate-y-0.5 lg:p-5"
                      >
                        <div className="flex items-start gap-3">
                          <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-full border border-(--border)">
                            <Image
                              src={review.avatar}
                              alt={review.name}
                              fill
                              sizes="40px"
                              className="object-cover"
                            />
                          </div>

                          <div className="flex min-w-0 flex-1 flex-col">
                            <h3 className="text-sm font-semibold text-(--text-primary)">
                              {review.name}
                            </h3>
                            <div className="mt-0.5 flex items-center gap-2">
                              <div className="flex items-center gap-0.5">
                                {Array.from({ length: 5 }).map((_, index) => (
                                  <Star
                                    key={index}
                                    size={12}
                                    className={
                                      index < Math.floor(review.rating)
                                        ? "fill-(--brand-gold) text-(--brand-gold)"
                                        : "text-(--border)"
                                    }
                                  />
                                ))}
                              </div>
                              <span className="text-[10px] text-(--text-muted) lg:text-xs">
                                {review.date}
                              </span>
                            </div>
                          </div>
                        </div>

                        <p className="mt-3 flex-1 text-xs leading-relaxed text-(--text-secondary) lg:text-sm">
                          {review.text}
                        </p>
                      </article>
                    ))}
                  </div>
                </section> */}
              </div>

              <aside className="order-3 xl:order-none">
                <div className="space-y-5 xl:sticky xl:top-24">
                  <div className="rounded-[var(--radius-lg)] border border-(--border) bg-(--bg-card) p-4 shadow-[var(--shadow-card)] lg:p-5">
                    <MenuCatalogTabs
                      active={menuTab}
                      onChange={handleMenuTabChange}
                    />

                    <div className="flex min-h-[520px] overflow-hidden rounded-xl border border-(--border)">
                      <CategorySidebar
                        categories={catalogCategories}
                        activeId={activeCategory}
                        onSelect={handleCategorySelect}
                        selectedCounts={categorySelectedCounts}
                        largeText
                      />

                      <div className="flex min-w-0 flex-1 flex-col overflow-hidden bg-(--bg-secondary)">
                        <div className="flex-1 overflow-y-auto scrollbar-none">
                          <div className="px-2 pb-3 pt-3">
                            <div className="mb-3">
                              <h3 className="text-sm font-semibold text-(--text-primary)">
                                {menuTab === "service"
                                  ? "Select Services"
                                  : "Select Products"}
                              </h3>
                              <p className="text-[11px] text-(--text-muted)">
                                {activeCategoryLabel} · {catalogItems.length}{" "}
                                available
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
                                      selected={selectedServiceIds.includes(
                                        service.id,
                                      )}
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
                                    selected={selectedProductIds.includes(
                                      product.id,
                                    )}
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
                                        aria-current={visiblePage === p ? "page" : undefined}
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
                                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
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
                </div>
              </aside>
            </div>
          </div>
        </main>

        {/* <div className="pointer-events-none fixed bottom-6 right-20 z-40 hidden lg:block ">
          {canBook ? (
            <Link
              href={""}
              className="px-35 pointer-events-auto primary-button inline-flex h-14 items-center justify-center rounded-full px-8 text-lg font-semibold text-white shadow-[var(--shadow-card)]"
            >
              NEXT
            </Link>
          ) : (
            <button
              type="button"
              onClick={handleBookNow}
              className="px-35 pointer-events-auto primary-button inline-flex h-14 items-center justify-center rounded-full px-8 text-lg font-semibold text-white opacity-60 shadow-[var(--shadow-card)]"
            >
              NEXT
            </button>
          )}
        </div> */}
        <div
          className="
            fixed bottom-10 right-15 z-40 w-[calc(100vw-1rem)] max-w-[350px]
            overflow-hidden rounded-xl border border-(--border)
            bg-(--bg-card)/95 shadow-(--shadow-card) backdrop-blur-xl
          "
        >
          <div className="flex items-stretch ">
            <div className="flex items-center gap-2.5 px-3 py-2.5">
              <div className="relative shrink-0">
                <span
                  className="
                    primary-button flex h-10 w-10 items-center justify-center
                    rounded-xl
                  "
                >
                  <ShoppingCart size={18} strokeWidth={2} className="text-white" />
                </span>
                {cartCount > 0 && (
                  <span
                    className="
                      absolute -right-1 -top-1 flex h-4 min-w-4 items-center
                      justify-center rounded-full bg-(--brand-gold) px-1
                      text-[8px] font-bold text-(--text-primary)
                    "
                    aria-label={`${cartCount} items in cart`}
                  >
                    {cartCount}
                  </span>
                )}
              </div>

              <div className="min-w-0">
                {cartCount > 0 && (
                  <span className="text-sm font-semibold text-(--brand-gold)">
                    ${totalPrice}
                  </span>
                )}
              </div>
            </div>

            {canBook ? (
              <Link
                href={bookingUrl}
                className="
                  primary-button flex flex-1 items-center justify-center
                  rounded-none px-3 py-3 text-[11px] font-semibold text-white
                "
              >
                NEXT <ArrowRight size={14} strokeWidth={2.5} />
              </Link>
            ) : (
              <button
                type="button"
                onClick={() => handleNext({ requireStaff: true })}
                className="
                  primary-button flex flex-1 items-center justify-center
                  rounded-none px-3 py-3 text-[11px] font-semibold text-white
                  opacity-60
                "
              >
                NEXT <ArrowRight size={14} strokeWidth={2.5} />
              </button>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
