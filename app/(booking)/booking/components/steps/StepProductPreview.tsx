"use client";

import { useState } from "react";
import Image from "next/image";
import Swal from "sweetalert2";
import { ArrowRight, Plus, ShoppingBag, X } from "lucide-react";

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

interface StepProductPreviewProps {
  selectedProductIds: string[];
  organizationBanner?: BookingOrganizationBannerInfo;
  onToggleProduct: (id: string) => void;
  onRemoveProduct: (id: string) => void;
  onNext: () => void;
}

export function StepProductPreview({
  selectedProductIds,
  organizationBanner,
  onToggleProduct,
  onRemoveProduct,
  onNext,
}: StepProductPreviewProps) {
  const [showAddModal, setShowAddModal] = useState(false);

  const selectedProducts = getSelectedProducts(selectedProductIds);
  const { subtotal, total } = calcProductsTotal(selectedProductIds);
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

  const productList = (
    <div className="space-y-2">
      {selectedProducts.map((product) => (
        <article
          key={product.id}
          className="
            flex items-center gap-2.5 rounded-xl border border-(--border)
            bg-(--bg-secondary) p-2.5 lg:gap-3 lg:p-3
          "
        >
          <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-lg lg:h-14 lg:w-14">
            <Image
              src={product.image}
              alt={product.name}
              fill
              sizes="56px"
              className="object-cover"
            />
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate text-[11px] font-semibold text-(--text-primary) lg:text-[14px]">
              {product.name}
            </p>
            <p className="mt-0.5 text-[9px] text-(--text-muted) lg:text-[12px]">
              {product.quantity}
            </p>
          </div>
          <p className="shrink-0 text-[12px] font-bold text-(--brand-gold) lg:text-[15px]">
            {product.priceLabel}
          </p>
          <button
            type="button"
            onClick={() => onRemoveProduct(product.id)}
            aria-label={`Remove ${product.name}`}
            className="
              flex h-7 w-7 shrink-0 items-center justify-center rounded-full
              border border-(--border) text-(--text-muted)
              transition-colors hover:border-(--accent-primary)
              hover:text-(--accent-primary)
            "
          >
            <X size={13} strokeWidth={2.5} />
          </button>
        </article>
      ))}
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
          <div className="flex items-center justify-between border-b border-(--border) px-3 py-2.5">
            <div className="flex items-center gap-2">
              <span className="primary-button flex h-7 w-7 items-center justify-center rounded-full">
                <ShoppingBag size={13} strokeWidth={2} className="text-white" />
              </span>
              <div>
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
            {hasSelection && (
              <p className="text-[12px] font-bold text-(--brand-gold)">
                ${subtotal}
              </p>
            )}
          </div>

          <div className="p-3">
            {hasSelection ? (
              productList
            ) : (
              <p className="py-4 text-center text-[9px] font-medium text-(--text-muted)">
                Add products to continue to payment
              </p>
            )}

            <button
              type="button"
              onClick={() => setShowAddModal(true)}
              className="
                mt-3 inline-flex w-full items-center justify-center gap-1.5
                rounded-xl border border-dashed border-(--brand-gold)/50
                bg-[color-mix(in_srgb,var(--brand-gold)_8%,transparent)]
                px-3 py-2.5 text-[11px] font-semibold text-(--brand-gold)
              "
            >
              <Plus size={14} strokeWidth={2.5} />
              Add more
            </button>
          </div>
        </section>

        <div className="feature-card flex items-center justify-between rounded-xl px-3 py-2.5">
          <div>
            <p className="text-[8px] text-(--text-muted)">Total</p>
            <p className="text-sm font-bold text-(--brand-gold)">${total}</p>
          </div>
          <button
            type="button"
            onClick={handleNext}
            className="
              primary-button inline-flex items-center gap-1.5 rounded-xl
              px-4 py-2.5 text-[11px] font-semibold text-white
            "
          >
            Continue to Payment
            <ArrowRight size={14} strokeWidth={2.5} />
          </button>
        </div>
      </div>

      {/* Desktop */}
      <div className="hidden lg:block">
        <div className="grid grid-cols-1 gap-5 xl:grid-cols-[minmax(0,1fr)_380px]">
          <section className="rounded-2xl border border-(--border) bg-(--bg-card) p-5 shadow-[var(--shadow-card)]">
            <div className="mb-4 flex items-start justify-between gap-3">
              <div>
                <h2 className="text-[22px] font-semibold text-(--text-primary)">
                  Product preview
                </h2>
                <p className="mt-1 text-[13px] text-(--text-muted)">
                  Review your products, remove any you don't need, or add more
                  before payment.
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
              productList
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

              <button
                type="button"
                onClick={handleNext}
                className="
                  primary-button mt-5 flex w-full items-center justify-center
                  gap-2 rounded-xl py-3.5 text-[14px] font-semibold text-white
                "
              >
                Continue to Payment
                <ArrowRight size={16} strokeWidth={2.5} />
              </button>
            </section>
          </aside>
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
