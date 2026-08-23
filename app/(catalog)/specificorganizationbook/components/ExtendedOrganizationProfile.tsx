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
  Minus,
  PlayCircle,
  Plus,
  Send,
  Share2,
  ShoppingCart,
  Star,
  Truck,
  ShieldCheck,
  RotateCcw,
  BadgeCheck,
  UserRound,
  Mars,
  Venus,
  X,
  Trash2,
} from "lucide-react";
import { TimingsDropdown } from "@/components/TimingsDropdown";
import { CategorySidebar } from "@/menu/components/CategorySidebar";
import { MenuProductCard } from "@/menu/components/MenuProductCard";
import { MenuProductGalleryModal } from "./MenuProductGalleryModal";
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
import { getBookingDay } from "@/booking/booking.data";
import { buildBookingUrl } from "@/booking/booking.navigation";
import type { SectionData, Suggestion, SuggestionsSectionMeta } from "@/types/store";
import { ExtendedOrganization } from "../organization.types";
import { HeroBanner } from "./HeroBanner";
import {
  SelectionPreviewSidebar,
} from "./SelectionPreviewSidebar";
import { ServiceDateTimeModal } from "./ServiceDateTimeModal";
import { SuggestedProductCard } from "./SuggestedProductsRow";

type MenuCatalogTab = "service" | "product";
type MenuGender = "male" | "female";

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

function MenuGenderToggle({
  value,
  onChange,
}: {
  value: MenuGender;
  onChange: (value: MenuGender) => void;
}) {
  return (
    <div
      className="inline-flex shrink-0 overflow-hidden rounded-lg border border-(--border) bg-(--bg-card)"
      role="group"
      aria-label="Select gender"
    >
      {([
        { id: "male", label: "Male", icon: Mars },
        { id: "female", label: "Female", icon: Venus },
      ] as const).map((option, index) => {
        const active = value === option.id;
        const Icon = option.icon;

        return (
          <button
            key={option.id}
            type="button"
            aria-pressed={active}
            onClick={() => onChange(option.id)}
            className={`
              inline-flex items-center gap-1.5 px-2.5 py-1.5 text-[10px] font-medium
              lg:px-3.5 lg:py-2 lg:text-[12px]
              ${index > 0 ? "border-l border-(--border)" : ""}
              ${
                active
                  ? "bg-(--bg-card-hover) text-(--text-primary)"
                  : "text-(--text-secondary) hover:text-(--text-primary)"
              }
            `}
          >
            <Icon size={12} strokeWidth={1.8} className="lg:h-3.5 lg:w-3.5" />
            {option.label}
          </button>
        );
      })}
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
  suggestions,
}: ExtendedOrganizationProfileProps) {
  const menuSectionRef = useRef<HTMLDivElement>(null);
  const [activeCategory, setActiveCategory] = useState("massage");
  const [menuTab, setMenuTab] = useState<MenuCatalogTab>("service");
  const [menuGender, setMenuGender] = useState<MenuGender>("male");
  const showMenuGenderToggle = organization.id === "store-1";
  const [selectedServiceIds, setSelectedServiceIds] = useState<string[]>([]);
  const [selectedProductIds, setSelectedProductIds] = useState<string[]>([]);
  const [serviceStaff, setServiceStaff] = useState<Record<string, string>>({});
  const [assigningServiceId, setAssigningServiceId] = useState<string | null>(
    null,
  );
  const [previewProductId, setPreviewProductId] = useState<string | null>(null);
  const [previewServiceId, setPreviewServiceId] = useState<string | null>(null);
  const [productQuantities, setProductQuantities] = useState<
    Record<string, number>
  >({});
  const [dateTimeModalOpen, setDateTimeModalOpen] = useState(false);
  const [serviceSchedules, setServiceSchedules] = useState<
    Record<string, { dayId: string; time: string }>
  >({});
  const [page, setPage] = useState(1);
  const [showAllReviews, setShowAllReviews] = useState(false);
  const [galleryProduct, setGalleryProduct] = useState<
    (typeof allMenuProducts)[number] | null
  >(null);
  const serviceTabsScrollRef = useRef<HTMLDivElement>(null);
  const productPreviewTabsScrollRef = useRef<HTMLDivElement>(null);
  const productPreviewCardsScrollRef = useRef<HTMLDivElement>(null);

  const reviewStats = useMemo(() => {
    const reviews = organization.reviews ?? [];
    const count = reviews.length;
    const average =
      count > 0
        ? reviews.reduce((sum, review) => sum + review.rating, 0) / count
        : 4.8;
    const distribution = [5, 4, 3, 2, 1].map((star) => {
      const starCount = reviews.filter(
        (review) => Math.round(review.rating) === star,
      ).length;
      return {
        star,
        starCount,
        percent: count > 0 ? Math.round((starCount / count) * 100) : 0,
      };
    });
    return {
      count,
      average: Number(average.toFixed(1)),
      distribution,
    };
  }, [organization.reviews]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (window.location.hash !== "#menu-section") return;

    const timer = window.setTimeout(() => {
      menuSectionRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }, 120);

    return () => window.clearTimeout(timer);
  }, []);

  const scrollPreviewTabs = (
    ref: React.RefObject<HTMLDivElement | null>,
    direction: "left" | "right",
  ) => {
    const container = ref.current;
    if (!container) return;
    const delta =
      (direction === "left" ? -1 : 1) *
      Math.max(120, Math.floor(container.clientWidth * 0.65));
    const next = Math.max(
      0,
      Math.min(
        container.scrollWidth - container.clientWidth,
        container.scrollLeft + delta,
      ),
    );
    container.scrollTo({ left: next, behavior: "smooth" });
  };

  const scrollChildIntoView = (
    container: HTMLDivElement | null,
    index: number,
  ) => {
    if (!container) return;
    const child = container.children[index] as HTMLElement | undefined;
    if (!child) return;
    const containerRect = container.getBoundingClientRect();
    const childRect = child.getBoundingClientRect();
    const delta =
      childRect.left -
      containerRect.left -
      (container.clientWidth - child.clientWidth) / 2;
    container.scrollTo({
      left: container.scrollLeft + delta,
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
      setServiceSchedules({});
      setAssigningServiceId(null);
      setPreviewServiceId(null);
      setDateTimeModalOpen(false);
    } else {
      setSelectedProductIds([]);
      setPreviewProductId(null);
      setProductQuantities({});
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
        setServiceSchedules((current) => {
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

  const toggleProduct = (productId: string, quantity = 1) => {
    if (menuTab !== "product") {
      handleMenuTabChange("product");
    }

    setSelectedProductIds((prev) => {
      const removing = prev.includes(productId);
      const next = removing
        ? prev.filter((id) => id !== productId)
        : [...prev, productId];

      if (removing) {
        setProductQuantities((current) => {
          const { [productId]: _, ...rest } = current;
          return rest;
        });
      } else {
        setProductQuantities((current) => ({
          ...current,
          [productId]: Math.max(1, quantity),
        }));
      }

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

  const updateProductQuantity = (productId: string, nextQty: number) => {
    if (nextQty < 1) {
      removeProductFromSelection(productId);
      return;
    }

    setProductQuantities((current) => ({
      ...current,
      [productId]: nextQty,
    }));
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
    setServiceSchedules((current) => {
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
    setProductQuantities((current) => {
      const { [productId]: _, ...rest } = current;
      return rest;
    });
  };

  const isServiceFullyAssigned = (serviceId: string) =>
    Boolean(serviceStaff[serviceId] && serviceSchedules[serviceId]);

  /** First selected service that still needs staff or date/time. */
  const getFirstIncompleteServiceId = (beforeServiceId?: string) => {
    const stopAt = beforeServiceId
      ? selectedServiceIds.indexOf(beforeServiceId)
      : selectedServiceIds.length;

    if (stopAt <= 0) return null;

    for (let index = 0; index < stopAt; index += 1) {
      const serviceId = selectedServiceIds[index];
      if (serviceId && !isServiceFullyAssigned(serviceId)) {
        return serviceId;
      }
    }

    return null;
  };

  const focusServiceTab = (serviceId: string) => {
    setPreviewServiceId(serviceId);
    setAssigningServiceId(null);
    setDateTimeModalOpen(false);
  };

  const promptCompletePriorServices = (targetServiceId: string) => {
    const incompleteId = getFirstIncompleteServiceId(targetServiceId);
    if (!incompleteId) return false;

    const incompleteIndexes = selectedServiceIds
      .slice(0, selectedServiceIds.indexOf(targetServiceId))
      .map((id, index) => ({ id, index }))
      .filter(({ id }) => !isServiceFullyAssigned(id));

    const labels = incompleteIndexes.map(({ index }) => `Service ${index + 1}`);
    const labelText =
      labels.length === 1
        ? labels[0]
        : labels.length === 2
          ? `${labels[0]} or ${labels[1]}`
          : `${labels.slice(0, -1).join(", ")}, or ${labels[labels.length - 1]}`;

    void Swal.fire({
      icon: "warning",
      title: "Complete previous services first",
      text: `Please first select staff and date & time for ${labelText}.`,
      ...swalDefaults,
    }).then((result) => {
      if (result.isConfirmed) {
        focusServiceTab(incompleteId);
      }
    });

    return true;
  };

  const handleFocusServiceTab = (serviceId: string) => {
    setPreviewServiceId(serviceId);
    setAssigningServiceId(null);
  };

  const handleAssignStaffRequest = (serviceId: string) => {
    if (promptCompletePriorServices(serviceId)) return;
    setAssigningServiceId(serviceId);
    setPreviewServiceId(serviceId);
  };

  const handleOpenDateTimeModal = (serviceId: string) => {
    if (promptCompletePriorServices(serviceId)) return;
    setPreviewServiceId(serviceId);
    setDateTimeModalOpen(true);
  };

  const handleSelectStaffForService = (
    staffId: string,
    serviceIdOverride?: string,
  ) => {
    const targetServiceId = serviceIdOverride ?? assigningServiceId;

    if (!targetServiceId) {
      Swal.fire({
        icon: "info",
        title: "Choose a service first",
        text: "Tap Select staff on a service in Your Selection, then pick a staff member.",
        ...swalDefaults,
      });
      return;
    }

    if (promptCompletePriorServices(targetServiceId)) return;

    setServiceStaff((current) => ({
      ...current,
      [targetServiceId]: staffId,
    }));
    setPreviewServiceId(targetServiceId);
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

  const handleFocusProductTab = (productId: string) => {
    setPreviewProductId(productId);
  };

  useEffect(() => {
    if (!previewProductId) return;
    const productIndex = selectedProducts.findIndex(
      (product) => product.id === previewProductId,
    );
    if (productIndex < 0) return;

    scrollChildIntoView(productPreviewTabsScrollRef.current, productIndex);
    scrollChildIntoView(productPreviewCardsScrollRef.current, productIndex);
  }, [previewProductId, selectedProducts]);

  const staffById = useMemo(() => {
    const map: Record<string, (typeof organization.staff)[number]> = {};
    for (const member of organization.staff) {
      map[member.id] = member;
    }
    return map;
  }, [organization.staff]);

  const totalPrice = useMemo(() => {
    if (menuTab === "product") {
      return selectedProducts.reduce((sum, product) => {
        const qty = productQuantities[product.id] ?? 1;
        return sum + parsePrice(product.price) * qty;
      }, 0);
    }

    return selectedServices.reduce(
      (sum, service) => sum + parsePrice(service.price),
      0,
    );
  }, [menuTab, productQuantities, selectedProducts, selectedServices]);

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
    scheduleAssignments: serviceSchedules,
    step: 2,
  });

  const productBookingUrl = buildBookingUrl({
    productIds: selectedProductIds,
    productQuantities,
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
        }).then((result) => {
          if (result.isConfirmed) {
            focusServiceTab(missingStaff[0]!.id);
            setAssigningServiceId(missingStaff[0]!.id);
          }
        });
        return;
      }

      const missingSchedule = selectedServices.filter(
        (service) => !serviceSchedules[service.id],
      );

      if (missingSchedule.length > 0) {
        const names = missingSchedule.map((service) => service.name).join(", ");
        Swal.fire({
          icon: "warning",
          title: "Choose date & time",
          text:
            missingSchedule.length === 1
              ? `Please choose a date and time for ${names}.`
              : `Please choose date and time for: ${names}.`,
          ...swalDefaults,
        }).then((result) => {
          if (result.isConfirmed) {
            focusServiceTab(missingSchedule[0]!.id);
          }
        });
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
      selectedServiceIds.every(
        (id) => Boolean(serviceStaff[id]) && Boolean(serviceSchedules[id]),
      );

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

        <div
          id="menu-section"
          ref={menuSectionRef}
          className="scroll-mt-20 space-y-2"
        >
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
                <div className="mb-3 flex items-start justify-between gap-2">
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

                  {showMenuGenderToggle ? (
                    <MenuGenderToggle
                      value={menuGender}
                      onChange={setMenuGender}
                    />
                  ) : (
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
                  )}
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
                        onTitleClick={() => setGalleryProduct(product)}
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

        <section className="space-y-3 pt-1 lg:hidden">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-[13px] font-bold text-(--text-primary)">
                Customer Reviews
              </h2>
              <p className="text-[9px] font-semibold text-(--text-muted)">
                What guests say about {organization.name}
              </p>
            </div>
            <button
              type="button"
              className="
                inline-flex items-center gap-1 rounded-full border
                border-(--brand-gold)/50
                bg-[color-mix(in_srgb,var(--brand-gold)_8%,transparent)]
                px-2.5 py-1.5 text-[10px] font-semibold text-(--brand-gold)
              "
            >
              <Plus size={12} strokeWidth={2.5} />
              Write a review
            </button>
          </div>

          <div className="feature-card rounded-xl p-3">
            <div className="flex items-center gap-4">
              <div className="flex shrink-0 flex-col items-center">
                <span className="text-[26px] font-bold leading-none text-(--text-primary)">
                  {reviewStats.average.toFixed(1)}
                </span>
                <div className="mt-1 flex items-center gap-0.5">
                  {Array.from({ length: 5 }).map((_, index) => (
                    <Star
                      key={index}
                      size={11}
                      className={
                        index < Math.round(reviewStats.average)
                          ? "fill-(--brand-gold) text-(--brand-gold)"
                          : "text-(--border)"
                      }
                    />
                  ))}
                </div>
                <span className="mt-1 text-[8px] font-semibold text-(--text-muted)">
                  {reviewStats.count > 0
                    ? `${reviewStats.count} review${reviewStats.count === 1 ? "" : "s"}`
                    : "120+ reviews"}
                </span>
              </div>

              <div className="min-w-0 flex-1 space-y-1">
                {reviewStats.distribution.map((row) => (
                  <div key={row.star} className="flex items-center gap-2">
                    <span className="flex w-5 shrink-0 items-center gap-0.5 text-[8px] font-semibold text-(--text-muted)">
                      {row.star}
                      <Star
                        size={8}
                        className="fill-(--brand-gold) text-(--brand-gold)"
                      />
                    </span>
                    <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-(--bg-secondary)">
                      <div
                        className="h-full rounded-full bg-(--brand-gold)"
                        style={{ width: `${row.percent}%` }}
                      />
                    </div>
                    <span className="w-6 shrink-0 text-right text-[8px] font-semibold text-(--text-muted)">
                      {row.percent}%
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {organization.reviews && organization.reviews.length > 0 && (
            <div className="space-y-2">
              {(showAllReviews
                ? organization.reviews
                : organization.reviews.slice(0, 3)
              ).map((review) => (
                <article
                  key={review.id}
                  className="feature-card rounded-xl p-3"
                >
                  <div className="flex items-start gap-2.5">
                    <div className="relative h-9 w-9 shrink-0 overflow-hidden rounded-full border border-(--border)">
                      <Image
                        src={review.avatar}
                        alt={review.name}
                        fill
                        sizes="36px"
                        className="object-cover"
                      />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between gap-2">
                        <p className="truncate text-[11px] font-bold text-(--text-primary)">
                          {review.name}
                        </p>
                        <span className="shrink-0 text-[8px] font-semibold text-(--text-muted)">
                          {review.date}
                        </span>
                      </div>
                      <div className="mt-0.5 flex items-center gap-0.5">
                        {Array.from({ length: 5 }).map((_, index) => (
                          <Star
                            key={index}
                            size={10}
                            className={
                              index < Math.floor(review.rating)
                                ? "fill-(--brand-gold) text-(--brand-gold)"
                                : "text-(--border)"
                            }
                          />
                        ))}
                      </div>
                      <p className="mt-1.5 text-[10px] leading-relaxed text-(--text-secondary)">
                        {review.text}
                      </p>
                    </div>
                  </div>
                </article>
              ))}

              {organization.reviews.length > 3 && (
                <button
                  type="button"
                  onClick={() => setShowAllReviews((value) => !value)}
                  className="
                    flex w-full items-center justify-center gap-1 rounded-xl
                    border border-(--border) bg-(--bg-card) py-2 text-[10px]
                    font-semibold text-(--text-primary)
                  "
                >
                  {showAllReviews
                    ? "Show less"
                    : `Show all ${organization.reviews.length} reviews`}
                  <ChevronRight size={12} strokeWidth={2.5} />
                </button>
              )}
            </div>
          )}
        </section>

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
            <div className="grid grid-cols-1 gap-5 xl:grid-cols-[300px_minmax(0,1fr)_500px] xl:gap-6">
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
                suggestions={suggestions}
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
                        {/* <Link
                          // href={bookingUrl}
                          href={"#"}
                          className="primary-button inline-flex h-8 items-center justify-center gap-2 rounded-full px-2 text-[10px] font-semibold text-white"
                        >
                          <CalendarDays size={16} />
                          Book Now
                        </Link> */}
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
                    <div className="flex min-h-[245px] flex-col items-center justify-center gap-1 bg-(--bg-secondary) px-4 py-6 text-center">
                      <p className="text-2xl font-bold text-(--text-primary)">
                        Service preview
                      </p>
                      <p className="text-[20px] text-(--text-muted) font-semibold">
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
                      const isFocusedServiceReady = isServiceFullyAssigned(
                        focusedService.id,
                      );

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
                                const isReady = isServiceFullyAssigned(service.id);

                                return (
                                  <div
                                    key={service.id}
                                    className={`
                                      relative flex shrink-0 items-center gap-2 rounded-xl border
                                      px-2 py-1.5 pr-6 transition-all
                                      ${
                                        isReady
                                          ? "border-(--success)"
                                          : "border-(--danger)"
                                      }
                                      ${
                                        isActive
                                          ? "bg-(--bg-card) shadow-(--shadow-card) ring-1 ring-(--brand-gold)"
                                          : "bg-(--bg-card)/70"
                                      }
                                    `}
                                  >
                                    <button
                                      type="button"
                                      onClick={() =>
                                        handleFocusServiceTab(service.id)
                                      }
                                      className="flex min-w-0 items-center gap-2 text-left"
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
                                            max-w-[88px] text-[11px] font-semibold
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

                                    <button
                                      type="button"
                                      aria-label={`Remove ${service.name}`}
                                      onClick={(event) => {
                                        event.stopPropagation();
                                        removeServiceFromSelection(service.id);
                                      }}
                                      className="
                                        absolute right-1 top-1 flex h-4 w-4 items-center
                                        justify-center rounded-full border border-(--border)
                                        bg-(--bg-card) text-(--text-muted)
                                        transition-colors hover:text-(--text-primary)
                                      "
                                    >
                                      <X size={10} strokeWidth={2.5} />
                                    </button>

                                    <span
                                      aria-label={isReady ? "Ready" : "Pending"}
                                      className={`
                                        absolute right-5 top-1.5 h-2 w-2 rounded-full
                                        ${isReady ? "bg-(--success)" : "bg-(--danger)"}
                                      `}
                                    />
                                  </div>
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

                          <div className="grid grid-cols-1 lg:grid-cols-[1.2fr_2fr]">
                            <div className="relative h-[120px] sm:h-[200px] lg:min-h-[200px]">
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
                                <div className="flex items-center justify-between gap-2">
                                <p className="text-[10px] font-semibold uppercase tracking-wide text-(--text-muted)">
                                  Selected service
                                </p>
                                <p className={`text-[10px] font-semibold uppercase tracking-wide ${isFocusedServiceReady ? "text-green-600" : "text-red-600"}`}>
                                  {isFocusedServiceReady ? "Ready" : "Pending"}
                                </p>
                                </div>
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
                                    className="shrink-0 text-[10px] font-semibold text-(--brand-gold) cursor-pointer"
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

                              
                            <div className="flex justify-between items-center gap-2 mt-2">
                              {(() => {
                                const schedule =
                                  serviceSchedules[focusedService.id];
                                const day = schedule
                                  ? getBookingDay(schedule.dayId)
                                  : null;

                                if (schedule && day) {
                                  return (
                                    <div className="flex items-center gap-2 rounded-xl border border-(--border) bg-(--bg-card) px-2 py-1.5">
                                      <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-(--border) bg-(--bg-secondary)">
                                        <CalendarDays
                                          size={14}
                                          className="text-(--accent-primary)"
                                        />
                                      </span>
                                      <div className="min-w-0 flex-1">
                                        <p className="truncate text-[11px] font-semibold text-(--text-primary)">
                                          {day.weekday}, {day.date}
                                        </p>
                                        <p className="text-[10px] text-(--text-muted)">
                                          {schedule.time}
                                        </p>
                                      </div>
                                      <button
                                        type="button"
                                        onClick={() =>
                                          handleOpenDateTimeModal(
                                            focusedService.id,
                                          )
                                        }
                                        className="shrink-0 text-[10px] font-semibold text-(--brand-gold) cursor-pointer"
                                      >
                                        Change
                                      </button>
                                    </div>
                                  );
                                }

                                return (
                                  <button
                                    type="button"
                                    onClick={() =>
                                      handleOpenDateTimeModal(focusedService.id)
                                    }
                                    className="
                                      primary-button inline-flex h-9 w-fit items-center
                                      justify-center gap-2 rounded-full px-3 text-[11px]
                                      font-semibold text-white
                                    "
                                  >
                                    <CalendarDays size={14} />
                                    Choose Date &amp; Time
                                  </button>
                                );
                              })()}
                              <div onClick={() => removeServiceFromSelection(focusedService.id)}
                                className="cursor-pointer hover:text-red-700 bg-red-500 p-2 rounded-full"
                              >
                                <Trash2 size={17} className="text-red-500 cursor-pointer" />
                              </div>
                              </div>
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
                    <div className="flex min-h-[420px] flex-col items-center justify-center gap-1 bg-(--bg-secondary) px-4 py-6 text-center lg:min-h-[380px]">
                      <p className="text-2xl font-bold text-(--text-primary)">
                        Product preview
                      </p>
                      <p className="text-[20px] text-(--text-muted) font-semibold">
                        Select a product from the menu to preview it here.
                      </p>
                    </div>
                  ) : (
                    <div className="flex min-h-[420px] flex-col bg-(--bg-secondary) lg:min-h-[380px]">
                      <div className="flex items-center gap-2 border-b border-(--border) px-3 py-2.5">
                        <div className="min-w-0 shrink-0">
                          <p className="text-[13px] font-semibold text-(--text-primary)">
                            Selected Products
                          </p>
                          <p className="text-[11px] text-(--text-muted)">
                            {selectedProducts.length} product
                            {selectedProducts.length === 1 ? "" : "s"}
                          </p>
                        </div>

                        {selectedProducts.length > 0 && (
                          <div className="flex min-w-0 flex-1 items-center gap-1.5">
                            <button
                              type="button"
                              onClick={() =>
                                scrollPreviewTabs(
                                  productPreviewTabsScrollRef,
                                  "left",
                                )
                              }
                              aria-label="Scroll product tabs left"
                              className="
                                flex h-8 w-8 shrink-0 items-center justify-center rounded-full
                                border border-(--border) bg-(--bg-card) text-(--text-primary)
                                transition-colors hover:border-(--brand-gold)
                              "
                            >
                              <ChevronLeft size={16} strokeWidth={2.5} />
                            </button>

                            <div
                              ref={productPreviewTabsScrollRef}
                              className="
                                scrollbar-none scrollbar-thumb-(--accent-primary)
                                scrollbar-track-transparent flex min-w-0 flex-1
                                snap-x snap-mandatory items-center gap-1.5 overflow-x-auto
                                overflow-y-hidden scroll-smooth pb-1
                              "
                            >
                              {selectedProducts.map((product, index) => {
                                const isActive = product.id === previewProductId;

                                return (
                                  <button
                                    key={product.id}
                                    type="button"
                                    onClick={() => handleFocusProductTab(product.id)}
                                    aria-pressed={isActive}
                                    className={`
                                      shrink-0 snap-start rounded-full border px-2.5 py-1
                                      text-[11px] font-semibold transition-colors
                                      ${
                                        isActive
                                          ? "border-(--brand-gold) bg-[color-mix(in_srgb,var(--brand-gold)_14%,transparent)] text-(--brand-gold)"
                                          : "border-(--border) bg-(--bg-card) text-(--text-secondary) hover:border-(--brand-gold)/50 hover:text-(--text-primary)"
                                      }
                                    `}
                                  >
                                    Product-{index + 1}
                                  </button>
                                );
                              })}
                            </div>

                            <button
                              type="button"
                              onClick={() =>
                                scrollPreviewTabs(
                                  productPreviewTabsScrollRef,
                                  "right",
                                )
                              }
                              aria-label="Scroll product tabs right"
                              className="
                                flex h-8 w-8 shrink-0 items-center justify-center rounded-full
                                border border-(--border) bg-(--bg-card) text-(--text-primary)
                                transition-colors hover:border-(--brand-gold)
                              "
                            >
                              <ChevronRight size={16} strokeWidth={2.5} />
                            </button>
                          </div>
                        )}
                      </div>

                      <div className="flex min-h-0 flex-1 items-stretch gap-1.5 p-3 pt-0">
                        {/* <button
                          type="button"
                          onClick={() =>
                            scrollPreviewTabs(
                              productPreviewCardsScrollRef,
                              "left",
                            )
                          }
                          aria-label="Scroll products left"
                          className="
                            mb-1 flex h-8 w-8 shrink-0 self-center items-center justify-center rounded-full
                            border border-(--border) bg-(--bg-card) text-(--text-primary)
                            transition-colors hover:border-(--brand-gold)
                          "
                        >
                          <ChevronLeft size={16} strokeWidth={2.5} />
                        </button> */}

                        <div
                          ref={productPreviewCardsScrollRef}
                          className="
                            scrollbar-thin scrollbar-thumb-(--accent-primary)
                            scrollbar-track-transparent flex min-h-0 min-w-0 flex-1
                            snap-x snap-mandatory gap-3 overflow-x-auto overflow-y-hidden
                            scroll-smooth pb-1
                          "
                        >
                          {selectedProducts.map((product) => {
                            const qty = productQuantities[product.id] ?? 1;
                            const isActive = product.id === previewProductId;

                            return (
                              <SuggestedProductCard
                                key={product.id}
                                product={product}
                                quantity={qty}
                                isActive={isActive}
                                className="
                                  h-full min-h-[320px] shrink-0 snap-start
                                  basis-[calc((100%-1.5rem)/3)]
                                "
                                onQuantityChange={(nextQty) =>
                                  updateProductQuantity(product.id, nextQty)
                                }
                                onRemove={() =>
                                  removeProductFromSelection(product.id)
                                }
                              />
                            );
                          })}
                        </div>

                        {/* <button
                          type="button"
                          onClick={() =>
                            scrollPreviewTabs(
                              productPreviewCardsScrollRef,
                              "right",
                            )
                          }
                          aria-label="Scroll products right"
                          className="
                            mb-1 flex h-8 w-8 shrink-0 self-center items-center justify-center rounded-full
                            border border-(--border) bg-(--bg-card) text-(--text-primary)
                            transition-colors hover:border-(--brand-gold)
                          "
                        >
                          <ChevronRight size={16} strokeWidth={2.5} />
                        </button> */}
                      </div>
                    </div>
                  )}
                </section>
                )}

                {isProductFlow && (
                  <section className="overflow-hidden rounded-[16px] border border-(--border) bg-(--bg-card) shadow-[var(--shadow-card)]">
                    <div className="grid grid-cols-4 divide-x divide-(--border)">
                      {[
                        {
                          icon: Truck,
                          title: "Free Delivery",
                          subtitle: "On orders over $50",
                        },
                        {
                          icon: BadgeCheck,
                          title: "Genuine Products",
                          subtitle: "100% authentic items",
                        },
                        {
                          icon: RotateCcw,
                          title: "Easy Returns",
                          subtitle: "7-day return policy",
                        },
                        {
                          icon: ShieldCheck,
                          title: "Secure Payment",
                          subtitle: "Safe & encrypted",
                        },
                      ].map(({ icon: Icon, title, subtitle }) => (
                        <div
                          key={title}
                          className="flex items-center gap-2.5 px-3 py-3 xl:px-4"
                        >
                          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[color-mix(in_srgb,var(--accent-primary)_10%,transparent)] text-(--accent-primary)">
                            <Icon size={16} strokeWidth={2} />
                          </span>
                          <div className="min-w-0">
                            <p className="truncate text-[12px] font-semibold text-(--text-primary)">
                              {title}
                            </p>
                            <p className="truncate text-[10px] text-(--text-muted)">
                              {subtitle}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
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
                  <div
                    className={`grid grid-cols-2 gap-1.5 xl:grid-cols-4 ${
                      assigningServiceId ? "rounded-2xl p-1" : ""
                    }`}
                  >
                    {(() => {
                      const focusedStaffServiceId =
                        assigningServiceId ??
                        previewServiceId ??
                        selectedServiceIds[selectedServiceIds.length - 1] ??
                        null;
                      const isSelectingStaff = Boolean(assigningServiceId);

                      return organization.staff.map((member, index) => {
                        const isAssignedToFocusedService =
                          focusedStaffServiceId != null &&
                          serviceStaff[focusedStaffServiceId] === member.id;

                        return (
                          <article
                            key={member.id}
                            className={`
                              flex h-full w-full flex-col overflow-hidden rounded-[16px] border
                              bg-(--bg-card) transition-all duration-300
                              ${
                                isAssignedToFocusedService
                                  ? "border-(--accent-primary) shadow-(--shadow-glow) ring-2 ring-(--accent-primary)/50 -translate-y-0.5"
                                  : isSelectingStaff
                                    ? "border-(--brand-gold) shadow-[0_0_0_1px_color-mix(in_srgb,var(--brand-gold)_35%,transparent),0_8px_28px_color-mix(in_srgb,var(--brand-gold)_28%,transparent)] hover:-translate-y-1 hover:shadow-[0_0_0_1px_var(--brand-gold),0_10px_32px_color-mix(in_srgb,var(--brand-gold)_40%,transparent)]"
                                    : "border-(--border) shadow-[var(--shadow-card)] hover:-translate-y-0.5"
                              }
                            `}
                          >
                            <div className="relative h-[96px] overflow-hidden rounded-t-[14px] bg-(--bg-secondary)">
                              <span className="absolute left-2 top-2 z-10 h-2 w-2 rounded-full bg-(--success)" />
                              {isSelectingStaff && !isAssignedToFocusedService && (
                                <div className="pointer-events-none absolute inset-0 bg-[color-mix(in_srgb,var(--brand-gold)_12%,transparent)]" />
                              )}
                              {isAssignedToFocusedService && (
                                <div className="pointer-events-none absolute inset-0 bg-[color-mix(in_srgb,var(--accent-primary)_18%,transparent)]" />
                              )}
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
                                onClick={() =>
                                  handleSelectStaffForService(
                                    member.id,
                                    focusedStaffServiceId ?? undefined,
                                  )
                                }
                                className={
                                  isAssignedToFocusedService
                                    ? "primary-button mt-2 flex h-8 w-full items-center justify-center gap-1.5 rounded-lg text-[11px] font-semibold text-white shadow-(--shadow-glow)"
                                    : isSelectingStaff
                                      ? "mt-2 flex h-8 w-full items-center justify-center rounded-lg border border-(--brand-gold) bg-[color-mix(in_srgb,var(--brand-gold)_14%,transparent)] text-[11px] font-semibold text-(--text-primary) transition-all hover:bg-[color-mix(in_srgb,var(--brand-gold)_24%,transparent)]"
                                      : "secondary-button mt-2 flex h-8 w-full items-center justify-center rounded-lg text-[11px] font-semibold"
                                }
                              >
                                {isAssignedToFocusedService ? (
                                  <>
                                    <Check size={13} strokeWidth={2.5} />
                                    Assigned
                                  </>
                                ) : (
                                  "Select"
                                )}
                              </button>
                            </div>
                          </article>
                        );
                      });
                    })()}
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

              <aside className="order-3 flex h-full min-h-0 flex-col xl:order-none">
                <div className="flex min-h-0 flex-1 flex-col space-y-5">
                  <div className="flex min-h-0 flex-1 flex-col rounded-[var(--radius-lg)] border border-(--border) bg-(--bg-card) p-4 shadow-[var(--shadow-card)] lg:p-5">
                    <MenuCatalogTabs
                      active={menuTab}
                      onChange={handleMenuTabChange}
                    />

                    <div
                      className={`
                        flex min-h-0 flex-1 overflow-hidden rounded-xl border border-(--border)
                        ${isProductFlow ? "min-h-[640px]" : "min-h-[520px]"}
                      `}
                    >
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
                            <div className="mb-3 flex items-start justify-between gap-3">
                              <div>
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

                              {showMenuGenderToggle && (
                                <MenuGenderToggle
                                  value={menuGender}
                                  onChange={setMenuGender}
                                />
                              )}
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
                                    onTitleClick={() =>
                                      setGalleryProduct(product)
                                    }
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

      <ServiceDateTimeModal
        isOpen={dateTimeModalOpen}
        serviceName={
          selectedServices.find(
            (service) =>
              service.id === (assigningServiceId ?? previewServiceId),
          )?.name ?? selectedServices[selectedServices.length - 1]?.name
        }
        initialDayId={
          serviceSchedules[
            assigningServiceId ??
              previewServiceId ??
              selectedServiceIds[selectedServiceIds.length - 1] ??
              ""
          ]?.dayId
        }
        initialTime={
          serviceSchedules[
            assigningServiceId ??
              previewServiceId ??
              selectedServiceIds[selectedServiceIds.length - 1] ??
              ""
          ]?.time
        }
        onClose={() => setDateTimeModalOpen(false)}
        onConfirm={(dayId, time) => {
          const serviceId =
            assigningServiceId ??
            previewServiceId ??
            selectedServiceIds[selectedServiceIds.length - 1];
          if (!serviceId) {
            setDateTimeModalOpen(false);
            return;
          }
          setServiceSchedules((current) => ({
            ...current,
            [serviceId]: { dayId, time },
          }));
          setDateTimeModalOpen(false);
        }}
      />

      {galleryProduct && (
        <MenuProductGalleryModal
          product={galleryProduct}
          onClose={() => setGalleryProduct(null)}
        />
      )}
    </>
  );
}
