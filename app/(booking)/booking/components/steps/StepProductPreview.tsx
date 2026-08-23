"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import Swal from "sweetalert2";
import {
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  Heart,
  Leaf,
  Minus,
  Plus,
  RefreshCw,
  ShieldCheck,
  ShoppingBag,
  Sparkles,
  Truck,
  X,
} from "lucide-react";

import {
  BookingOrganizationBanner,
  type BookingOrganizationBannerInfo,
} from "../BookingOrganizationBanner";
import {
  bookingLocation,
  calcProductsTotal,
  getSelectedProducts,
} from "../../booking.data";
import { ProductAddMoreModal } from "../ProductAddMoreModal";

const swalDefaults = {
  confirmButtonText: "Okay",
  confirmButtonColor: "#b8860b",
  background: "#1a1a1a",
  color: "#ffffff",
  allowOutsideClick: false,
  allowEscapeKey: false,
} as const;

const PLATFORM_FEATURES = [
  {
    icon: RefreshCw,
    title: "7-Day Replace",
    subtitle: "Easy product replacement",
  },
  // {
  //   icon: Leaf,
  //   title: "Natural Products",
  //   subtitle: "Clean & organic picks",
  // },
  {
    icon: ShieldCheck,
    title: "Verified Quality",
    subtitle: "Trusted salon brands",
  },
  {
    icon: Truck,
    title: "Fast Delivery",
    subtitle: "Quick store pickup",
  },
  // {
  //   icon: Sparkles,
  //   title: "Spa Grade",
  //   subtitle: "Professional formulas",
  // },
] as const;

function PlatformFeaturesRow() {
  return (
    <section className="overflow-hidden rounded-2xl border border-(--border) bg-(--bg-card) shadow-[var(--shadow-card)]">
      <div className="scrollbar-none flex gap-2 overflow-x-auto p-3 lg:grid lg:grid-cols-5 lg:gap-3 lg:overflow-visible lg:p-4">
        {PLATFORM_FEATURES.map(({ icon: Icon, title, subtitle }) => (
          <article
            key={title}
            className="
              flex w-[168px] shrink-0 items-start gap-2.5 rounded-xl border
              border-(--border) bg-(--bg-secondary) px-3 py-2.5
              lg:w-auto lg:shrink
            "
          >
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-(--accent-primary)/10">
              <Icon size={16} className="text-(--accent-primary)" />
            </span>
            <div className="min-w-0">
              <p className="truncate text-[12px] font-semibold text-(--text-primary) lg:text-[13px]">
                {title}
              </p>
              <p className="mt-0.5 line-clamp-2 text-[10px] text-(--text-muted) lg:text-[11px]">
                {subtitle}
              </p>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

interface StepProductPreviewProps {
  selectedProductIds: string[];
  productQuantities: Record<string, number>;
  organizationBanner?: BookingOrganizationBannerInfo;
  onToggleProduct: (id: string) => void;
  onRemoveProduct: (id: string) => void;
  onUpdateQuantity: (id: string, quantity: number) => void;
  onNext: () => void;
}

function SelectedProductCard({
  id,
  name,
  sizeLabel,
  price,
  priceLabel,
  image,
  quantity,
  onUpdateQuantity,
  onRemove,
}: {
  id: string;
  name: string;
  sizeLabel: string;
  price: number;
  priceLabel: string;
  image: string;
  quantity: number;
  onUpdateQuantity: (id: string, quantity: number) => void;
  onRemove: (id: string) => void;
}) {
  const original = Number((price * 1.35).toFixed(2));
  const discount =
    original > 0 ? Math.round(((original - price) / original) * 100) : 0;

  return (
    <article className="flex w-[160px] shrink-0 flex-col overflow-hidden rounded-2xl border border-(--border) bg-(--bg-card) shadow-[var(--shadow-card)] lg:w-[220px]">
      <div className="relative aspect-4/3 w-full overflow-hidden bg-(--bg-secondary)">
        <Image
          src={image}
          alt={name}
          fill
          sizes="220px"
          className="object-cover"
        />
        <button
          type="button"
          onClick={() => onRemove(id)}
          aria-label={`Remove ${name}`}
          className="
            absolute top-2.5 right-2.5 flex h-8 w-8 items-center justify-center
            rounded-full bg-white text-(--text-muted) shadow-sm
            transition-colors hover:text-(--accent-primary)
          "
        >
          <X size={14} strokeWidth={2.5} />
        </button>
      </div>

      <div className="flex flex-1 flex-col gap-2 p-3">
        <div className="min-w-0">
          <h3 className="line-clamp-1 font-[family-name:var(--font-heading)] text-[14px] font-semibold text-(--text-primary)">
            {name}
          </h3>
          <p className="mt-0.5 text-[11px] text-(--text-muted)">{sizeLabel}</p>
          <p className="mt-1 line-clamp-2 text-[11px] leading-4 text-(--text-secondary)">
            Premium {name.toLowerCase()} for spa and home wellness routines.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-1.5">
          <span className="text-[14px] font-bold text-(--text-primary)">
            {priceLabel}
          </span>
          <span className="text-[11px] text-(--text-muted) line-through">
            ${original.toFixed(2)}
          </span>
          <span className="rounded-full bg-[color-mix(in_srgb,var(--brand-gold)_22%,white)] px-1.5 py-0.5 text-[10px] font-semibold text-(--text-primary)">
            -{discount}%
          </span>
        </div>

        <div className="mt-auto flex items-center justify-between gap-2 pt-1">
          <div className="inline-flex h-9 items-center rounded-full border border-(--border) bg-(--bg-card) px-1">
            <button
              type="button"
              aria-label="Decrease quantity"
              onClick={() => onUpdateQuantity(id, quantity - 1)}
              className="flex h-7 w-7 items-center justify-center rounded-full text-(--text-primary)"
            >
              <Minus size={14} />
            </button>
            <span className="min-w-6 text-center text-[13px] font-semibold text-(--text-primary)">
              {quantity}
            </span>
            <button
              type="button"
              aria-label="Increase quantity"
              onClick={() => onUpdateQuantity(id, quantity + 1)}
              className="flex h-7 w-7 items-center justify-center rounded-full text-(--text-primary)"
            >
              <Plus size={14} />
            </button>
          </div>

          <span className="text-[12px] font-bold text-(--brand-gold)">
            ${(price * quantity).toFixed(0)}
          </span>
        </div>
      </div>
    </article>
  );
}

function ProductPreviewCarousel({
  selectedProducts,
  productQuantities,
  onUpdateQuantity,
  onRemoveProduct,
}: {
  selectedProducts: ReturnType<typeof getSelectedProducts>;
  productQuantities: Record<string, number>;
  onUpdateQuantity: (id: string, quantity: number) => void;
  onRemoveProduct: (id: string) => void;
}) {
  const [activePreviewIndex, setActivePreviewIndex] = useState(0);
  const tabsScrollRef = useRef<HTMLDivElement>(null);
  const cardsScrollRef = useRef<HTMLDivElement>(null);

  const activeIndex =
    selectedProducts.length > 0
      ? Math.min(activePreviewIndex, selectedProducts.length - 1)
      : 0;

  const scrollStrip = (
    container: HTMLDivElement | null,
    direction: "left" | "right",
    minStep: number,
  ) => {
    if (!container) return;
    const delta =
      (direction === "left" ? -1 : 1) *
      Math.max(minStep, Math.floor(container.clientWidth * 0.7));
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

  const handleTabClick = (index: number) => {
    setActivePreviewIndex(index);
    scrollChildIntoView(tabsScrollRef.current, index);
    scrollChildIntoView(cardsScrollRef.current, index);
  };

  return (
    <div className="space-y-3">
      <div className="relative">
        <button
          type="button"
          onClick={() => scrollStrip(tabsScrollRef.current, "left", 120)}
          aria-label="Scroll product tabs left"
          className="
            absolute left-0 top-1/2 z-10 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full
            border border-(--border) bg-(--bg-card) text-(--text-primary)
            shadow-[var(--shadow-card)] transition-colors hover:border-(--brand-gold)
            lg:left-0 lg:h-9 lg:w-9
          "
        >
          <ChevronLeft size={16} strokeWidth={2.5} />
        </button>

        <div
          ref={tabsScrollRef}
          className="scrollbar-none flex min-w-0 gap-2 overflow-x-auto overflow-y-hidden  scroll-smooth"
          style={{ paddingLeft: "40px", paddingRight: "40px" }}
        >
          {selectedProducts.map((product, index) => {
            const active = index === activeIndex;
            return (
              <button
                key={product.id}
                type="button"
                onClick={() => handleTabClick(index)}
                aria-pressed={active}
                className={`
                  shrink-0 rounded-lg border px-3 py-1.5 text-[11px] font-semibold
                  transition-colors lg:text-[12px]
                  ${
                    active
                      ? "border-(--brand-gold) bg-[color-mix(in_srgb,var(--brand-gold)_14%,transparent)] text-(--brand-gold)"
                      : "border-(--border) bg-(--bg-card) text-(--text-secondary) hover:border-(--brand-gold)/50"
                  }
                `}
              >
                Product {index + 1}
              </button>
            );
          })}
        </div>

        <button
          type="button"
          onClick={() => scrollStrip(tabsScrollRef.current, "right", 120)}
          aria-label="Scroll product tabs right"
          className="
            absolute right-0 top-1/2 z-10 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full
            border border-(--border) bg-(--bg-card) text-(--text-primary)
            shadow-[var(--shadow-card)] transition-colors hover:border-(--brand-gold)
            lg:right-0 lg:h-9 lg:w-9
          "
        >
          <ChevronRight size={16} strokeWidth={2.5} />
        </button>
      </div>

      <div className="relative">
        <button
          type="button"
          onClick={() => scrollStrip(cardsScrollRef.current, "left", 220)}
          aria-label="Scroll products left"
          className="
            absolute left-0 top-1/2 z-10 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full
            border border-(--border) bg-(--bg-card) text-(--text-primary)
            shadow-[var(--shadow-card)] transition-colors hover:border-(--brand-gold)
            lg:left-0 lg:h-9 lg:w-9
          "
        >
          <ChevronLeft size={16} strokeWidth={2.5} />
        </button>

        <div
          ref={cardsScrollRef}
          className="scrollbar-none flex min-w-0 gap-1 overflow-x-auto overflow-y-hidden scroll-smooth"
        >
          {selectedProducts.map((product) => (
            <SelectedProductCard
              key={product.id}
              id={product.id}
              name={product.name}
              sizeLabel={product.quantity}
              price={product.price}
              priceLabel={product.priceLabel}
              image={product.image}
              quantity={productQuantities[product.id] ?? 1}
              onUpdateQuantity={onUpdateQuantity}
              onRemove={onRemoveProduct}
            />
          ))}
        </div>

        <button
          type="button"
          onClick={() => scrollStrip(cardsScrollRef.current, "right", 220)}
          aria-label="Scroll products right"
          className="
            absolute right-0 top-1/2 z-10 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full
            border border-(--border) bg-(--bg-card) text-(--text-primary)
            shadow-[var(--shadow-card)] transition-colors hover:border-(--brand-gold)
            lg:right-0 lg:h-9 lg:w-9
          "
        >
          <ChevronRight size={16} strokeWidth={2.5} />
        </button>
      </div>
    </div>
  );
}

export function StepProductPreview({
  selectedProductIds,
  productQuantities,
  organizationBanner,
  onToggleProduct,
  onRemoveProduct,
  onUpdateQuantity,
  onNext,
}: StepProductPreviewProps) {
  const [showAddModal, setShowAddModal] = useState(false);
  const [liked, setLiked] = useState(false);

  const selectedProducts = getSelectedProducts(selectedProductIds);
  const { subtotal, total } = calcProductsTotal(
    selectedProductIds,
    productQuantities,
  );
  const hasSelection = selectedProducts.length > 0;

  const org = organizationBanner ?? {
    name: bookingLocation.name,
    banner: bookingLocation.banner,
    availability: bookingLocation.availability,
    status: bookingLocation.status,
    thumbnail: bookingLocation.image,
    address: bookingLocation.address,
  };

  const handleNext = async () => {
    if (!hasSelection) {
      await Swal.fire({
        icon: "warning",
        title: "Please select a product",
        text: "Choose at least one product before continuing to payment.",
        ...swalDefaults,
      });
      return;
    }
    onNext();
  };

  const handleReplace = () => {
    setShowAddModal(true);
  };

  const previewCarousel = (
    <ProductPreviewCarousel
      selectedProducts={selectedProducts}
      productQuantities={productQuantities}
      onUpdateQuantity={onUpdateQuantity}
      onRemoveProduct={onRemoveProduct}
    />
  );

  const bottomBar = (
    <div className="feature-card overflow-hidden rounded-xl">
      <div className="flex items-stretch">
        <button
          type="button"
          onClick={() => setLiked((value) => !value)}
          className="
            flex w-[72px] flex-col items-center justify-center gap-1 border-r
            border-(--border) px-2 py-2.5 text-(--text-primary)
            transition-colors hover:bg-(--bg-secondary)
          "
        >
          <Heart
            size={16}
            className={
              liked
                ? "fill-(--accent-primary) text-(--accent-primary)"
                : "text-(--text-secondary)"
            }
          />
          <span className="text-[9px] font-semibold">
            {liked ? "Liked" : "Like"}
          </span>
        </button>

        <button
          type="button"
          onClick={handleReplace}
          className="
            flex w-[78px] flex-col items-center justify-center gap-1 border-r
            border-(--border) px-2 py-2.5 text-(--text-primary)
            transition-colors hover:bg-(--bg-secondary)
          "
        >
          <RefreshCw size={15} className="text-(--text-secondary)" />
          <span className="text-[9px] font-semibold">Replace</span>
        </button>

        <div className="flex min-w-0 flex-1 items-center justify-between gap-2 px-3 py-2.5">
          <div className="min-w-0">
            <p className="text-[8px] text-(--text-muted)">Total</p>
            <p className="text-sm font-bold text-(--brand-gold)">${total}</p>
          </div>
          <button
            type="button"
            onClick={handleNext}
            className="
              primary-button inline-flex shrink-0 items-center gap-1.5 rounded-xl
              px-3.5 py-2.5 text-[11px] font-semibold text-white
            "
          >
            Continue
            <ArrowRight size={14} strokeWidth={2.5} />
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile */}
      <div className="space-y-4 lg:hidden">
        <BookingOrganizationBanner
          organization={organizationBanner}
          serviceLabels={selectedProducts.map((product) => product.name)}
        />

        <section className="feature-card overflow-hidden rounded-xl">
          <div className="flex items-center justify-between gap-2 border-b border-(--border) px-3 py-2.5">
            <div className="flex min-w-0 items-center gap-2">
              <span className="primary-button flex h-7 w-7 items-center justify-center rounded-full">
                <ShoppingBag size={13} strokeWidth={2} className="text-white" />
              </span>
              <div className="min-w-0">
                <p className="text-[11px] font-bold text-(--text-primary)">
                  Product preview
                </p>
                <p className="text-[8px] font-semibold text-(--text-muted)">
                  {hasSelection
                    ? `${selectedProducts.length} product${selectedProducts.length > 1 ? "s" : ""} selected`
                    : "No products selected yet"}
                </p>
              </div>
            </div>

            <div className="flex shrink-0 items-center gap-2">
              {hasSelection && (
                <p className="text-[12px] font-bold text-(--brand-gold)">
                  ${subtotal}
                </p>
              )}
              <button
                type="button"
                onClick={() => setShowAddModal(true)}
                className="
                  inline-flex items-center justify-center gap-1 rounded-xl
                  border border-dashed border-(--brand-gold)/50
                  bg-[color-mix(in_srgb,var(--brand-gold)_8%,transparent)]
                  px-2.5 py-1.5 text-[10px] font-semibold text-(--brand-gold)
                "
              >
                <Plus size={13} strokeWidth={2.5} />
                Add more
              </button>
            </div>
          </div>

          <div className="space-y-3 p-1">
            {hasSelection ? (
              previewCarousel
            ) : (
              <p className="py-4 text-center text-[9px] font-medium text-(--text-muted)">
                Add products to continue to payment
              </p>
            )}
          </div>
        </section>

        <PlatformFeaturesRow />

        {bottomBar}
      </div>

      {/* Desktop */}
      <div className="hidden space-y-5 lg:block">
        <div className="grid grid-cols-1 gap-5 xl:grid-cols-[minmax(0,1fr)_380px]">
          <section className="rounded-2xl border border-(--border) bg-(--bg-card) p-5 shadow-[var(--shadow-card)]">
            <div className="mb-3 flex items-start justify-between gap-3">
              <div>
                <h2 className="text-[22px] font-semibold text-(--text-primary)">
                  Product preview
                </h2>
                <p className="mt-1 text-[13px] text-(--text-muted)">
                  Review cards, manage quantity, or add more before payment.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setShowAddModal(true)}
                className="
                  inline-flex shrink-0 items-center gap-1.5 rounded-xl
                  border border-(--border) bg-(--bg-secondary) px-3.5 py-2.5
                  text-[13px] font-semibold text-(--text-primary)
                  transition-colors hover:border-(--brand-gold)
                "
              >
                <Plus size={16} strokeWidth={2.5} />
                Add more
              </button>
            </div>

            {hasSelection ? (
              previewCarousel
            ) : (
              <div className="rounded-xl border border-dashed border-(--border) bg-(--bg-secondary) px-4 py-12 text-center">
                <p className="text-sm font-semibold text-(--text-primary)">
                  No products selected
                </p>
                <p className="mt-1 text-[13px] text-(--text-muted)">
                  Click Add more to browse categories and pick products.
                </p>
                <button
                  type="button"
                  onClick={() => setShowAddModal(true)}
                  className="primary-button mt-4 inline-flex items-center gap-1.5 rounded-xl px-4 py-2.5 text-[13px] font-semibold text-white"
                >
                  <Plus size={16} />
                  Add products
                </button>
              </div>
            )}
          </section>

          <aside className="space-y-4">
            <BookingOrganizationBanner
              organization={organizationBanner ?? org}
              serviceLabels={selectedProducts.map((product) => product.name)}
            />

            <section className="rounded-2xl border border-(--border) bg-(--bg-card) p-5 shadow-[var(--shadow-card)]">
              <p className="text-[12px] text-(--text-muted)">Order total</p>
              <p className="mt-1 text-[28px] font-bold text-(--brand-gold)">
                ${total}
              </p>
              <p className="mt-1 text-[12px] text-(--text-secondary)">
                Includes tax · {selectedProducts.length} item
                {selectedProducts.length === 1 ? "" : "s"}
              </p>

              {/* <div className="mt-4 flex gap-2">
                <button
                  type="button"
                  onClick={() => setLiked((value) => !value)}
                  className="
                    secondary-button inline-flex h-11 flex-1 items-center
                    justify-center gap-1.5 rounded-xl text-[13px] font-semibold
                  "
                >
                  <Heart
                    size={15}
                    className={
                      liked
                        ? "fill-(--accent-primary) text-(--accent-primary)"
                        : ""
                    }
                  />
                  {liked ? "Liked" : "Like"}
                </button>
                <button
                  type="button"
                  onClick={handleReplace}
                  className="
                    secondary-button inline-flex h-11 flex-1 items-center
                    justify-center gap-1.5 rounded-xl text-[13px] font-semibold
                  "
                >
                  <RefreshCw size={15} />
                  Replace
                </button>
              </div> */}

              <button
                type="button"
                onClick={handleNext}
                className="
                  primary-button mt-3 flex w-full items-center justify-center
                  gap-2 rounded-xl py-3.5 text-[14px] font-semibold text-white
                "
              >
                Continue to Payment
                <ArrowRight size={16} strokeWidth={2.5} />
              </button>
            </section>
          </aside>
        </div>

        <PlatformFeaturesRow />
      </div>

      {showAddModal && (
        <ProductAddMoreModal
          selectedProductIds={selectedProductIds}
          onToggleProduct={onToggleProduct}
          onClose={() => setShowAddModal(false)}
        />
      )}
    </>
  );
}
