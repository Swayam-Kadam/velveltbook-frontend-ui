"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import Swal from "sweetalert2";
import {
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  Gift,
  Heart,
  Lock,
  Minus,
  Plus,
  RefreshCw,
  ShieldCheck,
  ShoppingBag,
  Trash2,
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
import {
  DEFAULT_PRODUCT_ADDRESS,
  ProductDeliverySections,
  validateProductDeliveryAddress,
  type ProductDeliveryAddress,
} from "./ProductAddressFields";

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
  initialAddress?: ProductDeliveryAddress;
  onToggleProduct: (id: string) => void;
  onRemoveProduct: (id: string) => void;
  onUpdateQuantity: (id: string, quantity: number) => void;
  onNext: () => void;
  onDesktopContinue?: (address: ProductDeliveryAddress) => void;
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
          <div className="flex justify-between gap-1">
          <p className="mt-0.5 text-[11px] text-(--text-muted)">{sizeLabel}</p>
            <p className="rounded-full bg-[color-mix(in_srgb,var(--brand-gold)_22%,white)] px-1.5 py-0.5 text-[10px] font-semibold text-(--text-primary)">
            -{discount}%
          </p>
          </div>
          <p className="mt-1 line-clamp-3 text-[11px] leading-4 text-(--text-secondary)">
            Premium {name.toLowerCase()} for spa and home wellness routines.
          </p>
        </div>

        {/* <div className="flex flex-wrap items-center gap-1.5">
          <span className="text-[14px] font-bold text-(--text-primary)">
            {priceLabel}
          </span>
          <span className="text-[11px] text-(--text-muted) line-through">
            ${original.toFixed(2)}
          </span>
          <span className="rounded-full bg-[color-mix(in_srgb,var(--brand-gold)_22%,white)] px-1.5 py-0.5 text-[10px] font-semibold text-(--text-primary)">
            -{discount}%
          </span>
        </div> */}

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

          <span className="text-[14px] font-bold text-(--brand-gold)">
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
        {selectedProducts.length > 2 &&
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
}

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

        {selectedProducts.length > 2 &&
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
}
      </div>
    </div>
  );
}

function DesktopCartItemRow({
  id,
  name,
  sizeLabel,
  price,
  image,
  quantity,
  onUpdateQuantity,
  onRemove,
}: {
  id: string;
  name: string;
  sizeLabel: string;
  price: number;
  image: string;
  quantity: number;
  onUpdateQuantity: (id: string, quantity: number) => void;
  onRemove: (id: string) => void;
}) {
  return (
    <article className="flex items-center gap-3 border-b border-(--border) py-3.5 last:border-b-0">
      <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-xl bg-(--bg-secondary)">
        <Image src={image} alt={name} fill sizes="56px" className="object-cover" />
      </div>
      <div className="min-w-0 flex-1">
        <p className="truncate text-[13px] font-semibold text-(--text-primary)">
          {name}
        </p>
        <p className="mt-0.5 text-[11px] text-(--text-muted)">{sizeLabel}</p>
      </div>
      <p className="shrink-0 text-[13px] font-bold text-(--brand-gold)">
        ${(price * quantity).toFixed(2)}
      </p>
      <div className="inline-flex h-8 shrink-0 items-center rounded-lg border border-(--border) bg-(--bg-card) px-1">
        <button
          type="button"
          aria-label="Decrease quantity"
          onClick={() => onUpdateQuantity(id, quantity - 1)}
          className="flex h-6 w-6 items-center justify-center rounded-md text-(--text-primary)"
        >
          <Minus size={13} />
        </button>
        <span className="min-w-5 text-center text-[12px] font-semibold text-(--text-primary)">
          {quantity}
        </span>
        <button
          type="button"
          aria-label="Increase quantity"
          onClick={() => onUpdateQuantity(id, quantity + 1)}
          className="flex h-6 w-6 items-center justify-center rounded-md text-(--text-primary)"
        >
          <Plus size={13} />
        </button>
      </div>
      <button
        type="button"
        onClick={() => onRemove(id)}
        aria-label={`Remove ${name}`}
        className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-(--border) text-(--text-muted) transition-colors hover:border-(--accent-primary) hover:text-(--accent-primary)"
      >
        <Trash2 size={14} />
      </button>
    </article>
  );
}

function ProductDesktopStoreSidebar({
  org,
  serviceLabels,
  subtotal,
  discount,
  shipping,
  total,
  itemCount,
  onContinue,
}: {
  org: BookingOrganizationBannerInfo;
  serviceLabels: string[];
  subtotal: number;
  discount: number;
  shipping: number;
  total: number;
  itemCount: number;
  onContinue: () => void;
}) {
  return (
    <aside className="space-y-4">
      <BookingOrganizationBanner
        organization={org}
        serviceLabels={serviceLabels}
      />

      <section className="rounded-2xl border border-(--border) bg-(--bg-card) p-5 shadow-[var(--shadow-card)]">
        <h4 className="text-[14px] font-bold text-(--text-primary)">
          Order Summary
        </h4>
        <div className="mt-3 space-y-2 text-[13px]">
          <div className="flex items-center justify-between text-(--text-secondary)">
            <span>Subtotal</span>
            <span className="font-medium text-(--text-primary)">
              ${subtotal.toFixed(2)}
            </span>
          </div>
          {discount > 0 ? (
            <div className="flex items-center justify-between text-emerald-600">
              <span>Discount</span>
              <span className="font-medium">-${discount.toFixed(2)}</span>
            </div>
          ) : null}
          <div className="flex items-center justify-between text-(--text-secondary)">
            <span>Shipping Fee</span>
            <span className="font-medium text-(--text-primary)">
              {shipping > 0 ? `$${shipping.toFixed(2)}` : "Free"}
            </span>
          </div>
          <div className="border-t border-(--border) pt-3">
            <div className="flex items-end justify-between">
              <div>
                <p className="text-[12px] font-semibold text-(--text-primary)">
                  Total Amount
                </p>
                <p className="text-[10px] text-(--text-muted)">Includes tax</p>
              </div>
              <p className="text-[26px] font-bold leading-none text-(--accent-primary)">
                ${total.toFixed(2)}
              </p>
            </div>
            <p className="mt-1 text-[11px] text-(--text-muted)">
              {itemCount} item{itemCount === 1 ? "" : "s"}
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={onContinue}
          className="
            primary-button mt-4 flex w-full items-center justify-center gap-2
            rounded-xl py-3.5 text-[14px] font-semibold text-white
          "
        >
          Continue to Payment
          <ArrowRight size={16} strokeWidth={2.5} />
        </button>

        <p className="mt-3 flex items-center justify-center gap-1.5 text-[10px] text-(--text-muted)">
          <Lock size={12} />
          Secure &amp; Encrypted Checkout
        </p>
      </section>
    </aside>
  );
}

export function StepProductPreview({
  selectedProductIds,
  productQuantities,
  organizationBanner,
  initialAddress,
  onToggleProduct,
  onRemoveProduct,
  onUpdateQuantity,
  onNext,
  onDesktopContinue,
}: StepProductPreviewProps) {
  const [showAddModal, setShowAddModal] = useState(false);
  const [liked, setLiked] = useState(false);
  const [address, setAddress] = useState<ProductDeliveryAddress>(
    () => initialAddress ?? DEFAULT_PRODUCT_ADDRESS,
  );
  const [couponCode, setCouponCode] = useState("");

  const selectedProducts = getSelectedProducts(selectedProductIds);
  const { subtotal, tax } = calcProductsTotal(
    selectedProductIds,
    productQuantities,
  );
  const discount = Math.round(subtotal * 0.1);
  const shipping = address.deliveryType === "deliver" ? 8 : 0;
  const orderTotal = subtotal - discount + shipping + tax;
  const hasSelection = selectedProducts.length > 0;
  const totalItemCount = selectedProducts.reduce(
    (sum, product) => sum + Math.max(1, productQuantities[product.id] ?? 1),
    0,
  );

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
        text: "Choose at least one product before continuing.",
        ...swalDefaults,
      });
      return;
    }
    onNext();
  };

  const handleDesktopContinue = async () => {
    if (!hasSelection) {
      await Swal.fire({
        icon: "warning",
        title: "Please select a product",
        text: "Choose at least one product before continuing to payment.",
        ...swalDefaults,
      });
      return;
    }

    const validationError = validateProductDeliveryAddress(address);
    if (validationError) {
      await Swal.fire({
        icon: "warning",
        title: "Complete delivery address",
        text: validationError,
        ...swalDefaults,
      });
      return;
    }

    onDesktopContinue?.(address);
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
            <p className="text-sm font-bold text-(--brand-gold)">
              ${orderTotal.toFixed(0)}
            </p>
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
      {/* Mobile — no store banner */}
      <div className="space-y-4 lg:hidden">
        <section className="feature-card overflow-hidden rounded-xl">
          <div className="flex items-center justify-between gap-2 border-b border-(--border) px-3 py-2.5">
            <div className="flex min-w-0 items-center gap-2">
              <span className="primary-button flex h-7 w-7 items-center justify-center rounded-full">
                <ShoppingBag size={13} strokeWidth={2} className="text-white" />
              </span>
              <div className="min-w-0">
                <p className="text-[12px] font-bold text-(--text-primary)">
                {hasSelection
                    ? `Total Product${selectedProducts.length > 1 ? "s" : ""} - ${selectedProducts.length}`
                    : "No products selected yet"}
                </p>
                <p className="text-[9px] font-bold text-(--text-primary)">
                scroll right and left to view all products
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

      {/* Desktop — cart | address | store + summary */}
      <div className="hidden lg:block">
        <div className="grid grid-cols-1 gap-5 xl:grid-cols-[minmax(0,1fr)_minmax(0,1fr)_360px]">
          <section className="rounded-2xl border border-(--border) bg-(--bg-card) p-5 shadow-[var(--shadow-card)]">
            <div className="mb-4 flex items-center justify-between gap-3">
              <div className="flex items-center gap-2.5">
                <span className="primary-button flex h-9 w-9 items-center justify-center rounded-xl">
                  <ShoppingBag size={16} className="text-white" />
                </span>
                <div>
                  <h2 className="text-[16px] font-bold text-(--text-primary)">
                    Your Cart ({totalItemCount} item
                    {totalItemCount === 1 ? "" : "s"})
                  </h2>
                  <p className="text-[12px] text-(--text-muted)">
                    Review items before checkout
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowAddModal(true)}
                className="
                  inline-flex shrink-0 items-center gap-1.5 rounded-xl
                  border border-(--border) bg-(--bg-secondary) px-3 py-2
                  text-[12px] font-semibold text-(--text-primary)
                  transition-colors hover:border-(--brand-gold)
                "
              >
                <Plus size={14} strokeWidth={2.5} />
                Add more
              </button>
            </div>

            {hasSelection ? (
              <div className="divide-y divide-(--border)">
                {selectedProducts.map((product) => (
                  <DesktopCartItemRow
                    key={product.id}
                    id={product.id}
                    name={product.name}
                    sizeLabel={product.quantity}
                    price={product.price}
                    image={product.image}
                    quantity={Math.max(1, productQuantities[product.id] ?? 1)}
                    onUpdateQuantity={onUpdateQuantity}
                    onRemove={onRemoveProduct}
                  />
                ))}
              </div>
            ) : (
              <div className="rounded-xl border border-dashed border-(--border) bg-(--bg-secondary) px-4 py-10 text-center">
                <p className="text-sm font-semibold text-(--text-primary)">
                  No products selected
                </p>
                <p className="mt-1 text-[13px] text-(--text-muted)">
                  Click Add more to browse and pick products.
                </p>
              </div>
            )}

            <div className="mt-4 rounded-xl border border-dashed border-(--border) bg-(--bg-secondary) p-3">
              <div className="flex items-center gap-2">
                <Gift size={16} className="shrink-0 text-(--accent-primary)" />
                <input
                  type="text"
                  value={couponCode}
                  onChange={(event) => setCouponCode(event.target.value)}
                  placeholder="Add a coupon code"
                  className="
                    min-w-0 flex-1 bg-transparent text-[13px] text-(--text-primary)
                    outline-none placeholder:text-(--text-muted)
                  "
                />
              </div>
            </div>

            <div className="mt-4 grid grid-cols-2 gap-2">
              {PLATFORM_FEATURES.slice(0, 2).map(({ icon: Icon, title, subtitle }) => (
                <article
                  key={title}
                  className="flex items-start gap-2 rounded-xl border border-(--border) bg-(--bg-secondary) px-3 py-2.5"
                >
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-(--accent-primary)/10">
                    <Icon size={14} className="text-(--accent-primary)" />
                  </span>
                  <div className="min-w-0">
                    <p className="text-[12px] font-semibold text-(--text-primary)">
                      {title}
                    </p>
                    <p className="mt-0.5 line-clamp-2 text-[10px] text-(--text-muted)">
                      {subtitle}
                    </p>
                  </div>
                </article>
              ))}
            </div>
          </section>

          <div className="space-y-4">
            <ProductDeliverySections
              address={address}
              onChange={setAddress}
              storeName={org.name}
              storeAddress={org.address ?? bookingLocation.address}
            />
          </div>

          <ProductDesktopStoreSidebar
            org={organizationBanner ?? org}
            serviceLabels={selectedProducts.map((product) => product.name)}
            subtotal={subtotal}
            discount={discount}
            shipping={shipping}
            total={orderTotal}
            itemCount={totalItemCount}
            onContinue={handleDesktopContinue}
          />
        </div>
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
