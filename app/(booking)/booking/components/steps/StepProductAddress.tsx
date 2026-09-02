"use client";

import { useState } from "react";
import Image from "next/image";
import {
  ArrowLeft,
  ArrowRight,
  ShoppingBag,
  X,
} from "lucide-react";
import Swal from "sweetalert2";

import {
  bookingLocation,
  calcProductsTotal,
  getSelectedProducts,
} from "../../booking.data";
import {
  DEFAULT_PRODUCT_ADDRESS,
  ProductDeliverySections,
  validateProductDeliveryAddress,
  type ProductDeliveryAddress,
} from "./ProductAddressFields";

export type { ProductDeliveryAddress, ProductDeliveryType } from "./ProductAddressFields";

interface StepProductAddressProps {
  selectedProductIds: string[];
  productQuantities: Record<string, number>;
  initialAddress?: ProductDeliveryAddress;
  onRemoveProduct: (id: string) => void;
  onBack: () => void;
  onNext: (address: ProductDeliveryAddress) => void;
}

const swalDefaults = {
  confirmButtonText: "Okay",
  confirmButtonColor: "#b8860b",
  background: "#1a1a1a",
  color: "#ffffff",
  allowOutsideClick: false,
  allowEscapeKey: false,
} as const;

export function StepProductAddress({
  selectedProductIds,
  productQuantities,
  initialAddress,
  onRemoveProduct,
  onBack,
  onNext,
}: StepProductAddressProps) {
  const [address, setAddress] = useState<ProductDeliveryAddress>(
    () => initialAddress ?? DEFAULT_PRODUCT_ADDRESS,
  );

  const selectedProducts = getSelectedProducts(selectedProductIds);
  const { subtotal } = calcProductsTotal(
    selectedProductIds,
    productQuantities,
  );

  const handleNext = async () => {
    if (selectedProducts.length === 0) {
      await Swal.fire({
        icon: "warning",
        title: "No products selected",
        text: "Please go back and add at least one product.",
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

    onNext(address);
  };

  const productStrip = (
    <section className="overflow-hidden rounded-2xl border border-(--brand-gold)/35 bg-[color-mix(in_srgb,var(--brand-gold)_6%,white)]">
      <div className="flex items-center justify-between gap-2 border-b border-(--brand-gold)/25 px-3 py-2.5">
        <div className="flex min-w-0 items-center gap-2">
          <span className="primary-button flex h-7 w-7 items-center justify-center rounded-lg">
            <ShoppingBag size={13} className="text-white" />
          </span>
          <p className="truncate text-[12px] font-bold text-(--text-primary)">
            Total Products - {selectedProducts.length}
          </p>
        </div>
        <p className="shrink-0 text-[12px] font-semibold text-(--text-primary)">
          total amount-{" "}
          <span className="font-bold text-(--brand-gold)">${subtotal}</span>
        </p>
      </div>

      <div className="scrollbar-none flex min-w-0 gap-2 overflow-x-auto p-3">
        {selectedProducts.map((product) => {
          const qty = Math.max(1, productQuantities[product.id] ?? 1);
          return (
            <article
              key={product.id}
              className="relative w-auto shrink-0 basis-[calc((100%-1.5rem)/4)] overflow-hidden rounded-xl border border-(--brand-gold)/40 bg-(--bg-card)"
            >
              <button
                type="button"
                onClick={() => onRemoveProduct(product.id)}
                aria-label={`Remove ${product.name}`}
                className="
                  absolute top-1.5 right-1.5 z-10 flex h-5 w-5 items-center
                  justify-center rounded-full border border-(--border)
                  bg-white text-(--text-muted)
                "
              >
                <X size={11} strokeWidth={2.5} />
              </button>
              <div className="relative h-[72px] w-full">
                <Image
                  src={product.image}
                  alt={product.name}
                  fill
                  sizes="25vw"
                  className="object-cover"
                />
              </div>
              <div className="space-y-0.5 p-2">
                <p className="line-clamp-2 text-[11px] font-semibold leading-tight text-(--text-primary)">
                  {product.name}
                </p>
                <p className="text-[10px] text-(--text-muted)">Qty {qty}</p>
                <p className="text-[12px] font-bold text-(--brand-gold)">
                  ${(product.price * qty).toFixed(2)}
                </p>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );

  return (
    <div className="space-y-3 lg:hidden">
      {productStrip}
      <ProductDeliverySections
        address={address}
        onChange={setAddress}
        storeName={bookingLocation.name}
        storeAddress={bookingLocation.address}
      />
      <div className="flex gap-2.5">
        <button
          type="button"
          onClick={onBack}
          className="
            secondary-button inline-flex h-12 flex-1 items-center justify-center
            gap-1.5 rounded-xl border border-(--accent-primary) text-[13px]
            font-semibold text-(--accent-primary)
          "
        >
          <ArrowLeft size={15} />
          Back
        </button>
        <button
          type="button"
          onClick={handleNext}
          className="
            primary-button inline-flex h-12 flex-[1.6] items-center justify-center
            gap-1.5 rounded-xl text-[13px] font-semibold text-white
          "
        >
          Next: Payment
          <ArrowRight size={15} />
        </button>
      </div>
    </div>
  );
}
