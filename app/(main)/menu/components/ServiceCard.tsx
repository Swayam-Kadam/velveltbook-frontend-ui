"use client";

import { useState } from "react";
import Image from "next/image";
import { Check, Clock3, Plus } from "lucide-react";

import { MenuService } from "../menu.data";
import { Button } from "@/components/Button";
import { MenuItemGalleryModal } from "./MenuItemGalleryModal";

interface ServiceCardProps {
  service: MenuService;
  compact?: boolean;
  selected?: boolean;
  onSelect?: () => void;
  largeText?: boolean;
}

export function ServiceCard({
  service,
  compact = false,
  selected = false,
  onSelect,
  largeText = false,
}: ServiceCardProps) {
  const [galleryOpen, setGalleryOpen] = useState(false);
  const openGallery = () => setGalleryOpen(true);

  const gallery = galleryOpen ? (
    <MenuItemGalleryModal
      title={service.title}
      subtitle={`${service.duration} · ${service.price}`}
      image={service.image}
      images={service.images}
      onClose={() => setGalleryOpen(false)}
    />
  ) : null;

  if (compact) {
    return (
      <>
        <article
          className={`
            feature-card group flex h-full flex-col overflow-hidden rounded-xl
            transition-all duration-300
            hover:border-[color-mix(in_srgb,var(--accent-secondary)_25%,var(--border))]
            hover:shadow-(--shadow-glow)
            ${selected ? "border-(--accent-primary) shadow-(--shadow-glow)" : ""}
          `}
        >
          <button
            type="button"
            onClick={openGallery}
            aria-label={`View images for ${service.title}`}
            className="relative h-[88px] shrink-0 overflow-hidden rounded-t-xl lg:h-[120px]"
          >
            <Image
              src={service.image}
              alt={service.title}
              fill
              sizes="80px"
              className="object-cover transition-transform duration-300 group-hover:scale-105"
            />
          </button>

          <div className={`flex flex-1 flex-col ${largeText ? "p-1.5" : "p-1"}`}>
            <h3
              className={`line-clamp-2 font-bold leading-tight text-(--text-primary) ${
                largeText ? "min-h-[34px] text-[15px]" : "min-h-[24px] text-[10px]"
              }`}
            >
              <button
                type="button"
                onClick={openGallery}
                className="text-left transition-colors hover:text-(--brand-gold)"
              >
                {service.title}
              </button>
            </h3>

            <div className="mt-auto flex shrink-0 items-center justify-between gap-1">
              <div className="flex min-w-0 flex-col items-start justify-start gap-0.5">
                <p
                  className={
                    largeText
                      ? "text-[14px] font-bold text-(--brand-gold)"
                      : "text-[8px] font-bold text-(--brand-gold)"
                  }
                >
                  {service.price}
                </p>
                <div
                  className={`flex shrink-0 items-center gap-0.5 font-bold text-(--text-primary) ${
                    largeText ? "text-[10px]" : "text-[7px]"
                  }`}
                >
                  <Clock3 size={largeText ? 12 : 7} strokeWidth={3} />
                  <span>{service.duration}</span>
                </div>
              </div>

              <Button
                type="button"
                onClick={(event) => {
                  event.stopPropagation();
                  onSelect?.();
                }}
                variant="primary"
                aria-label={
                  selected
                    ? `Deselect ${service.title}`
                    : `Select ${service.title}`
                }
                className={`
                  flex items-center justify-center rounded-full text-white
                  ${
                    largeText
                      ? "h-8 min-w-8 gap-1 px-2.5 text-[11px] font-semibold lg:h-9 lg:px-3 lg:text-[12px]"
                      : "h-4 w-4"
                  }
                  ${selected ? "border-(--accent-primary)" : "border-white"}
                `}
              >
                {selected ? (
                  <Check size={largeText ? 14 : 8} strokeWidth={3} />
                ) : (
                  <Plus size={largeText ? 14 : 8} strokeWidth={3} />
                )}
              </Button>
            </div>
          </div>
        </article>
        {gallery}
      </>
    );
  }

  return (
    <>
      <article
        className={`
          feature-card group overflow-hidden rounded-xl text-left
          transition-all duration-300
          hover:border-[color-mix(in_srgb,var(--accent-secondary)_25%,var(--border))]
          hover:shadow-(--shadow-glow)
          ${selected ? "border-(--accent-primary) shadow-(--shadow-glow)" : ""}
        `}
      >
        <button
          type="button"
          onClick={openGallery}
          aria-label={`View images for ${service.title}`}
          className="relative h-[72px] w-full overflow-hidden"
        >
          <Image
            src={service.image}
            alt={service.title}
            fill
            sizes="100px"
            className="object-cover transition-transform duration-300 group-hover:scale-105"
          />
        </button>

        <div className="space-y-0.5 p-1.5">
          <h3 className="h-8 text-[12px] font-bold leading-tight text-(--text-primary)">
            <button
              type="button"
              onClick={openGallery}
              className="line-clamp-2 text-left transition-colors hover:text-(--brand-gold)"
            >
              {service.title}
            </button>
          </h3>

          <p className="text-[12px] font-bold text-(--brand-gold)">
            {service.price}
          </p>

          <div className="flex items-center justify-between gap-1">
            <div className="flex items-center gap-0.5 text-[9px] font-bold text-(--text-primary)">
              <Clock3 size={9} strokeWidth={3} />
              <span>{service.duration}</span>
            </div>
            {onSelect && (
              <Button
                type="button"
                onClick={onSelect}
                variant="primary"
                aria-label={
                  selected
                    ? `Deselect ${service.title}`
                    : `Select ${service.title}`
                }
                className={`
                  flex h-5 w-5 items-center justify-center rounded-full text-white
                  ${selected ? "border-(--accent-primary)" : "border-white"}
                `}
              >
                {selected ? (
                  <Check size={10} strokeWidth={3} />
                ) : (
                  <Plus size={10} strokeWidth={3} />
                )}
              </Button>
            )}
          </div>
        </div>
      </article>
      {gallery}
    </>
  );
}
