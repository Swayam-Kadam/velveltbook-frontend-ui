"use client";

import Image from "next/image";
import { Plus } from "lucide-react";

import type { MenuProduct } from "../menu.data";

interface MenuProductCardProps {
  product: MenuProduct;
  selected?: boolean;
  onSelect?: () => void;
  largeText?: boolean;
}

export function MenuProductCard({
  product,
  selected = false,
  onSelect,
  largeText = false,
}: MenuProductCardProps) {
  return (
    <article
      className={`
        group flex h-full flex-col overflow-hidden rounded-[10px] border
        bg-(--bg-card) shadow-[var(--shadow-card)] transition-all duration-300
        hover:-translate-y-0.5 hover:shadow-(--shadow-glow)
        ${selected ? "border-(--accent-primary)" : "border-(--border)"}
      `}
    >
      <div className="relative h-[88px] shrink-0 overflow-hidden rounded-t-[10px] bg-(--bg-secondary)">
        <Image
          src={product.image}
          alt={product.title}
          fill
          sizes="(max-width: 1024px) 33vw, 180px"
          className="object-cover transition-transform duration-300 group-hover:scale-105"
        />
      </div>

      <div className="flex flex-1 flex-col gap-0.5 p-1.5">
        <h3
          className={`
            line-clamp-2 font-semibold leading-tight text-(--text-primary)
            ${largeText ? "text-[11px]" : "text-[9px]"}
          `}
        >
          {product.title}
        </h3>

        <p
          className={`
            text-(--text-muted)
            ${largeText ? "text-[9px]" : "text-[8px]"}
          `}
        >
          {product.quantity}
        </p>


        <div className="mt-auto flex-col lg:flex-row flex items-center justify-between gap-1 pt-0.5">
          <span
            className={`
              font-bold text-(--brand-gold)
              ${largeText ? "text-[13px]" : "text-[11px]"}
            `}
          >
            {product.price}
          </span>

          <button
            type="button"
            onClick={() => onSelect?.()}
            aria-label={selected ? `Remove ${product.title}` : `Add ${product.title}`}
            className={`
              inline-flex h-6 items-center justify-center gap-0.5 rounded-[8px] px-2
              text-[9px] font-semibold text-white transition-opacity hover:opacity-90
              ${selected ? "bg-(--accent-primary)" : "bg-[#5b2a86]"}
            `}
          >
            <Plus size={10} strokeWidth={2.5} />
            {selected ? "Added" : "Add"}
          </button>
        </div>
      </div>
    </article>
  );
}
