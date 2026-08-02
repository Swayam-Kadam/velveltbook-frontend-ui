"use client";

import { useState } from "react";
import Image from "next/image";
import { Heart, Minus, Plus } from "lucide-react";

import type { MenuProduct } from "@/menu/menu.data";

function parsePrice(price: string) {
  return Number(price.replace(/[^0-9.]/g, "")) || 0;
}

function getProductMeta(product: MenuProduct) {
  const current = parsePrice(product.price);
  const original = Number((current * 1.35).toFixed(2));
  const discount =
    original > 0 ? Math.round(((original - current) / original) * 100) : 0;

  return {
    currentLabel: product.price.startsWith("$")
      ? product.price
      : `$${current.toFixed(2)}`,
    originalLabel: `$${original.toFixed(2)}`,
    discountPercent: discount,
    description: `Premium ${product.title.toLowerCase()} for spa and home wellness routines.`,
  };
}

function SuggestedProductCard({
  product,
  onAdd,
}: {
  product: MenuProduct;
  onAdd: (productId: string, quantity: number) => void;
}) {
  const [qty, setQty] = useState(1);
  const [saved, setSaved] = useState(false);
  const meta = getProductMeta(product);

  return (
    <article className="flex w-[200px] shrink-0 flex-col overflow-hidden rounded-2xl border border-(--border) bg-(--bg-card) shadow-[var(--shadow-card)]">
      <div className="relative aspect-4/3 w-full overflow-hidden bg-(--bg-secondary)">
        <Image
          src={product.image}
          alt={product.title}
          fill
          sizes="200px"
          className="object-cover"
        />
      </div>

      <div className="flex flex-1 flex-col gap-2 p-3">
        <div className="min-w-0">
          <h3 className="line-clamp-1 font-[family-name:var(--font-heading)] text-[14px] font-semibold text-(--text-primary)">
            {product.title}
          </h3>
          <p className="mt-0.5 text-[11px] text-(--text-muted)">
            {product.quantity}
          </p>
          <p className="mt-1 line-clamp-2 text-[11px] leading-4 text-(--text-secondary)">
            {meta.description}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-1.5">
          <span className="text-[14px] font-bold text-(--text-primary)">
            {meta.currentLabel}
          </span>
          <span className="text-[11px] text-(--text-muted) line-through">
            {meta.originalLabel}
          </span>
          <span className="rounded-full bg-[color-mix(in_srgb,var(--brand-gold)_22%,white)] px-1.5 py-0.5 text-[10px] font-semibold text-(--text-primary)">
            -{meta.discountPercent}%
          </span>
        </div>

        <div className="mt-auto flex items-center justify-between gap-2 pt-1">
          <div className="inline-flex h-9 items-center rounded-full border border-(--border) bg-(--bg-card) px-1">
            <button
              type="button"
              aria-label="Decrease quantity"
              onClick={() => setQty((value) => Math.max(1, value - 1))}
              className="flex h-7 w-7 items-center justify-center rounded-full text-(--text-primary)"
            >
              <Minus size={14} />
            </button>
            <span className="min-w-6 text-center text-[13px] font-semibold text-(--text-primary)">
              {qty}
            </span>
            <button
              type="button"
              aria-label="Increase quantity"
              onClick={() => setQty((value) => value + 1)}
              className="flex h-7 w-7 items-center justify-center rounded-full text-(--text-primary)"
            >
              <Plus size={14} />
            </button>
          </div>

          <button
            type="button"
            aria-label={`Add ${product.title}`}
            onClick={() => onAdd(product.id, qty)}
            className="
              primary-button flex h-9 w-9 items-center justify-center
              rounded-full text-white
            "
          >
            <Plus size={18} strokeWidth={2.5} />
          </button>
        </div>
      </div>
    </article>
  );
}

interface SuggestedProductsRowProps {
  products: MenuProduct[];
  onAddProduct: (productId: string, quantity: number) => void;
  title?: string;
}

export function SuggestedProductsRow({
  products,
  onAddProduct,
  title = "Suggested Products",
}: SuggestedProductsRowProps) {
  if (products.length === 0) return null;

  return (
    <section className="space-y-3">
      <div className="flex items-center justify-between gap-2">
        <h2 className="text-xl font-semibold text-(--text-primary)">
          {title}
        </h2>
      </div>

      <div className="scrollbar-none flex gap-3 overflow-x-auto pb-1">
        {products.map((product) => (
          <SuggestedProductCard
            key={product.id}
            product={product}
            onAdd={onAddProduct}
          />
        ))}
      </div>
    </section>
  );
}
