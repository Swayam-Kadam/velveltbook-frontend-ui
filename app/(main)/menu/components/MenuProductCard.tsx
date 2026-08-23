"use client";

import Image from "next/image";
import { Check, Plus } from "lucide-react";

import type { MenuProduct } from "../menu.data";

interface MenuProductCardProps {
  product: MenuProduct;
  selected?: boolean;
  onSelect?: () => void;
  onTitleClick?: () => void;
  largeText?: boolean;
  ButtonText?: string;
}

export function MenuProductCard({
  product,
  selected = false,
  onSelect,
  onTitleClick,
  largeText = false,
  ButtonText = "buy",
}: MenuProductCardProps) {
  return (
    <article
      className={`
        feature-card group flex h-full flex-col overflow-hidden rounded-xl
        transition-all duration-300
        hover:border-[color-mix(in_srgb,var(--accent-secondary)_25%,var(--border))]
        hover:shadow-(--shadow-glow)
        ${selected ? "border-(--accent-primary) shadow-(--shadow-glow)" : ""}
      `}
    >
      <div className="relative h-[88px] shrink-0 overflow-hidden rounded-t-xl bg-(--bg-secondary)" onClick={onTitleClick}>
        <Image
          src={product.image}
          alt={product.title}
          fill
          sizes="(max-width: 1024px) 33vw, 180px"
          className="object-cover transition-transform duration-300 group-hover:scale-105"
        />
      </div>

      <div className={`flex flex-1 flex-col ${largeText ? "p-1.5" : "p-1"}`}>
        <h3
          className={`line-clamp-2 font-bold leading-tight text-(--text-primary) ${
            largeText ? "min-h-[34px] text-[15px]" : "min-h-[24px] text-[10px]"
          }`}
        >
          {onTitleClick ? (
            <button
              type="button"
              onClick={() => onSelect?.()}
              className="text-left transition-colors hover:text-(--brand-gold)"
            >
              {product.title}
            </button>
          ) : (
            product.title
          )}
        </h3>

        <p
          className={`
            text-(--text-muted)
            ${largeText ? "text-[9px]" : "text-[8px]"}
          `}
          onClick={() => onSelect?.()}
        >
          {product.quantity}
        </p>

        <div className="mt-auto flex flex-col items-center justify-between gap-1 pt-0.5 lg:flex-row">
          <span
            className={`
              font-bold text-(--brand-gold)
              ${largeText ? "text-[14px]" : "text-[11px]"}
            `}
            onClick={() => onSelect?.()}
          >
            {product.price}
          </span>

          <button
            type="button"
            onClick={() => onSelect?.()}
            aria-label={
              selected ? `Remove ${product.title}` : `Add ${product.title}`
            }
            className={`
              inline-flex h-6 items-center justify-between gap-0.5 rounded-[8px] px-2 w-full
              text-[9px] font-semibold text-white transition-opacity hover:opacity-90 
              ${selected ? "bg-(--accent-primary)" : "bg-[#5b2a86]"}
            `}
          >
            {selected ? "Added" : ButtonText === "add" ? "Add" : "Buy"}
            <span className="bg-white p-0.5 rounded-full">
            {selected ? <Check size={13} strokeWidth={2.5} className="bg-(--brand-gold) p-0.5 rounded-full" /> : <Plus size={13} strokeWidth={2.5} className="bg-(--brand-gold) p-0.5 rounded-full" />}
            </span>
          </button>
        </div>
      </div>
    </article>
  );
}
