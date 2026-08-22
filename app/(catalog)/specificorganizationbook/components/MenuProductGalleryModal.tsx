"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight, X } from "lucide-react";

import type { MenuProduct } from "@/data/catalog/menu/products";

interface MenuProductGalleryModalProps {
  product: MenuProduct;
  onClose: () => void;
}

const FALLBACK_GALLERY_POOL = [
  "/massage.webp",
  "/body spa bg.jpg",
  "/spa-header.png",
  "/salon bg.jpg",
  "/barber.jpg",
];

const AUTOPLAY_INTERVAL = 3000;

export function MenuProductGalleryModal({
  product,
  onClose,
}: MenuProductGalleryModalProps) {
  const images = useMemo(() => {
    if (product.images && product.images.length > 0) {
      return product.images;
    }
    const pool = [
      product.image,
      ...FALLBACK_GALLERY_POOL.filter((src) => src !== product.image),
    ];
    return Array.from(new Set(pool)).slice(0, 5);
  }, [product.image, product.images]);

  const [activeIndex, setActiveIndex] = useState(0);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const startAutoplay = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    if (images.length <= 1) return;
    timerRef.current = setInterval(() => {
      setActiveIndex((current) => (current + 1) % images.length);
    }, AUTOPLAY_INTERVAL);
  };

  useEffect(() => {
    startAutoplay();
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [images.length]);

  useEffect(() => {
    document.body.style.overflow = "hidden";
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleEscape);
    return () => {
      document.body.style.overflow = "";
      document.removeEventListener("keydown", handleEscape);
    };
  }, [onClose]);

  const goTo = (index: number) => {
    setActiveIndex((index + images.length) % images.length);
    startAutoplay();
  };

  return (
    <div
      className="fixed inset-0 z-[70] flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-label={`${product.title} images`}
    >
      <button
        type="button"
        aria-label="Close"
        onClick={onClose}
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
      />

      <div className="relative z-10 w-full max-w-md overflow-hidden rounded-2xl border border-(--border) bg-(--bg-card) shadow-(--shadow-card)">
        <div className="flex items-start justify-between gap-3 border-b border-(--border) px-4 py-3">
          <div className="min-w-0">
            <h2 className="truncate text-sm font-bold text-(--text-primary)">
              {product.title}
            </h2>
            <p className="mt-0.5 text-[11px] font-semibold text-(--text-muted)">
              {product.quantity} ·{" "}
              <span className="text-(--brand-gold)">{product.price}</span>
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="
              flex h-8 w-8 shrink-0 items-center justify-center rounded-full
              border border-(--border) bg-(--bg-card) text-(--text-muted)
              transition-colors hover:text-(--accent-primary)
            "
          >
            <X size={15} strokeWidth={2.5} />
          </button>
        </div>

        <div >
          <div className="relative aspect-4/3 w-full overflow-hidden rounded-xs bg-(--bg-secondary)">
            <div
              className="flex h-full w-full transition-transform duration-500 ease-out"
              style={{ transform: `translateX(-${activeIndex * 100}%)` }}
            >
              {images.map((src, index) => (
                <div
                  key={`${src}-${index}`}
                  className="relative h-full w-full shrink-0"
                >
                  <Image
                    src={src}
                    alt={`${product.title} image ${index + 1}`}
                    fill
                    sizes="(max-width: 768px) 90vw, 420px"
                    className="object-cover"
                    priority={index === 0}
                  />
                </div>
              ))}
            </div>

            {images.length > 1 && (
              <>
                <button
                  type="button"
                  onClick={() => goTo(activeIndex - 1)}
                  aria-label="Previous image"
                  className="
                    absolute left-2 top-1/2 z-10 flex h-8 w-8 -translate-y-1/2
                    items-center justify-center rounded-full bg-black/45
                    text-white backdrop-blur-sm transition-colors hover:bg-black/65
                  "
                >
                  <ChevronLeft size={16} strokeWidth={2.5} />
                </button>
                <button
                  type="button"
                  onClick={() => goTo(activeIndex + 1)}
                  aria-label="Next image"
                  className="
                    absolute right-2 top-1/2 z-10 flex h-8 w-8 -translate-y-1/2
                    items-center justify-center rounded-full bg-black/45
                    text-white backdrop-blur-sm transition-colors hover:bg-black/65
                  "
                >
                  <ChevronRight size={16} strokeWidth={2.5} />
                </button>

                <span className="absolute bottom-2 right-2 z-10 rounded-full bg-black/55 px-2 py-0.5 text-[10px] font-semibold text-white backdrop-blur-sm">
                  {activeIndex + 1} / {images.length}
                </span>
              </>
            )}
          </div>

          <div className="mt-3 flex gap-0.5 overflow-x-auto scrollbar-none">
            {images.map((src, index) => {
              const active = index === activeIndex;
              return (
                <button
                  key={`thumb-${src}-${index}`}
                  type="button"
                  onClick={() => goTo(index)}
                  aria-label={`View image ${index + 1}`}
                  aria-current={active}
                  className={`
                    relative h-14 w-14 shrink-0 overflow-hidden rounded-xs border-2
                    transition-all
                    ${
                      active
                        ? "border-(--brand-gold) opacity-100"
                        : "border-(--border) opacity-70 hover:opacity-100"
                    }
                  `}
                >
                  <Image
                    src={src}
                    alt={`${product.title} thumbnail ${index + 1}`}
                    fill
                    sizes="56px"
                    className="object-cover"
                  />
                </button>
              );
            })}
          </div>

          <p className="mt-3 text-center text-[10px] font-medium text-(--text-muted)">
            {images.length} image{images.length === 1 ? "" : "s"} · tap a
            thumbnail to view
          </p>
        </div>
      </div>
    </div>
  );
}
