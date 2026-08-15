"use client";

import { useEffect } from "react";
import { MapPin, X } from "lucide-react";

interface EnableLocationModalProps {
  open: boolean;
  onClose: () => void;
  onEnable: () => void;
}

export function EnableLocationModal({
  open,
  onClose,
  onEnable,
}: EnableLocationModalProps) {
  useEffect(() => {
    if (!open) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };

    document.addEventListener("keydown", handleEscape);
    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", handleEscape);
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[80] flex items-center justify-center p-5"
      role="dialog"
      aria-modal="true"
      aria-labelledby="enable-location-title"
    >
      <button
        type="button"
        aria-label="Close location dialog"
        onClick={onClose}
        className="absolute inset-0 bg-black/45 backdrop-blur-[2px]"
      />

      <div className="relative z-10 w-full max-w-[320px] overflow-hidden rounded-[28px] border border-(--border) bg-(--bg-card) px-6 pb-6 pt-5 shadow-(--shadow-card)">
        <button
          type="button"
          onClick={onClose}
          aria-label="Close"
          className="
            absolute right-3 top-3 flex h-8 w-8 items-center justify-center
            rounded-full text-(--text-muted) transition-colors
            hover:bg-(--bg-secondary) hover:text-(--text-primary)
          "
        >
          <X size={16} strokeWidth={2.2} />
        </button>

        <div className="mx-auto mb-4 flex h-[88px] w-[118px] items-center justify-center">
          <div className="relative h-[72px] w-[108px]">
            <div className="absolute inset-x-2 bottom-1 h-10 rounded-[10px] bg-[color-mix(in_srgb,var(--accent-primary)_14%,white)] shadow-sm" />
            <div className="absolute inset-x-5 bottom-4 h-8 -rotate-6 rounded-[8px] bg-[color-mix(in_srgb,var(--accent-primary)_22%,white)]" />
            <div className="absolute inset-x-0 bottom-0 h-3 rounded-full bg-[color-mix(in_srgb,var(--accent-primary)_10%,transparent)] blur-[1px]" />
            <div className="absolute left-1/2 top-0 flex h-11 w-11 -translate-x-1/2 items-center justify-center rounded-full bg-(--accent-primary) shadow-[0_8px_18px_color-mix(in_srgb,var(--accent-primary)_35%,transparent)]">
              <MapPin size={22} className="text-white" strokeWidth={2.4} fill="currentColor" />
            </div>
          </div>
        </div>

        <h2
          id="enable-location-title"
          className="text-center text-[20px] font-bold tracking-tight text-(--text-primary)"
        >
          Enable Location
        </h2>

        <p className="mt-2 text-center text-[13px] leading-relaxed text-(--text-secondary)">
          Allow Velvetbook to access your location to find nearby salons, spas
          and services.
        </p>

        <button
          type="button"
          onClick={onEnable}
          className="
            mt-5 flex h-12 w-full items-center justify-center rounded-xl
            bg-(--accent-primary) text-[15px] font-semibold text-white
            transition-opacity hover:opacity-90
          "
        >
          Enable Location
        </button>

        <button
          type="button"
          onClick={onClose}
          className="
            mt-3 flex w-full items-center justify-center py-1.5
            text-[14px] font-semibold text-(--accent-primary)
            transition-opacity hover:opacity-80
          "
        >
          Not Now
        </button>
      </div>
    </div>
  );
}
