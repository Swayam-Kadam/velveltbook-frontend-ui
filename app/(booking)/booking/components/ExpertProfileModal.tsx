"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import Image from "next/image";
import { BadgeCheck, Clock3, Play, Star, X } from "lucide-react";

import { experts } from "@/specificexpert/expert.data";
import type { ExpertProfile } from "@/specificexpert/expert.types";
import {
  CertificationCard,
  HobbiesCard,
  TagsCard,
} from "@/specificexpert/components/ExpertContentCards";
import type { BookingStaff } from "@/types/booking";

/** Change this value to resize the modal (e.g. "20rem", "24rem", "480px"). */
export const EXPERT_PROFILE_MODAL_HEIGHT = "30rem";

function getExpertProfileForStaff(staff: BookingStaff): ExpertProfile {
  if (experts[staff.id]) {
    return experts[staff.id];
  }

  const fallback = experts.e1;
  const tags = staff.specialties
    .replace(/^Specializes in:\s*/i, "")
    .split(",")
    .map((tag) => tag.trim())
    .filter(Boolean);

  const specialtyLine = staff.specialties
    .replace(/^Specializes in:\s*/i, "")
    .trim();
  const description =
    specialtyLine.length > 60
      ? staff.specialties
      : `With ${staff.experience.toLowerCase().replace(/\s*exp\.?$/i, " of professional experience")}, ${staff.name} specializes in ${specialtyLine || "personalized wellness treatments"}. Known for attention to detail and a warm approach, every session is tailored to help clients leave feeling confident and refreshed.`;

  return {
    id: staff.id,
    name: staff.name,
    title: "Certified Therapist",
    image: staff.image,
    rating: staff.rating,
    reviews: staff.reviews,
    experience: staff.experience,
    description,
    tags: tags.length > 0 ? tags : fallback.tags,
    certificationTitle: fallback.certificationTitle,
    certificationItems: fallback.certificationItems,
    reviewsList: fallback.reviewsList,
    hobbies: fallback.hobbies,
  };
}

function ModalExpertHero({ expert }: { expert: ExpertProfile }) {
  return (
    <section className="relative overflow-hidden rounded-xl bg-(--bg-card) px-2.5 pb-3 pt-2.5">
      <div className="pointer-events-none absolute inset-0 opacity-40 bg-[radial-gradient(ellipse_at_top,rgba(193,154,107,0.12)_0%,transparent_55%)]" />

      <div className="relative">
        <div className="flex w-full items-start gap-2.5">
          <div className="relative shrink-0">
            <div className="relative h-[72px] w-[72px] overflow-hidden rounded-full border-2 border-(--brand-gold)">
              <Image
                src={expert.image}
                alt={expert.name}
                fill
                sizes="72px"
                className="object-cover"
              />
            </div>
            <span className="primary-button absolute -bottom-0.5 left-1/2 flex h-6 w-6 -translate-x-1/2 items-center justify-center rounded-full">
              <Play size={10} className="ml-0.5 fill-white text-white" />
            </span>
          </div>

          <p className="min-w-0 flex-1 pt-0.5 text-[10px] font-bold leading-relaxed text-(--text-primary)">
            {expert.description}
          </p>
        </div>

        <div className="mt-3 flex items-center gap-1">
          <h2 className="text-[15px] font-semibold text-(--text-primary)">
            {expert.name}
          </h2>
          <BadgeCheck
            size={14}
            className="shrink-0 text-(--brand-gold)"
            strokeWidth={1.8}
          />
        </div>

        <div className="mt-1.5 flex w-full items-center gap-2">
          <div className="h-px flex-1 bg-(--border)" />
          <span className="shrink-0 text-[9px] text-(--text-muted)">
            {expert.title}
          </span>
          <div className="h-px flex-1 bg-(--border)" />
        </div>

        <div className="mt-2.5 flex flex-wrap items-center justify-center gap-x-2 gap-y-1 text-[9px] text-(--text-secondary)">
          <div className="flex items-center gap-0.5">
            <Star
              size={10}
              className="fill-(--brand-gold) text-(--brand-gold)"
            />
            <span className="font-medium text-(--text-primary)">
              {expert.rating}
            </span>
          </div>
          <span className="h-3 w-px bg-(--border)" />
          <span>{expert.reviews} Reviews</span>
          <span className="h-3 w-px bg-(--border)" />
          <div className="flex items-center gap-0.5">
            <Clock3
              size={10}
              strokeWidth={1.6}
              className="text-(--brand-gold)"
            />
            <span>{expert.experience}</span>
          </div>
        </div>
      </div>
    </section>
  );
}

interface ExpertProfileModalProps {
  staff: BookingStaff;
  onClose: () => void;
  /** Modal panel height. Defaults to EXPERT_PROFILE_MODAL_HEIGHT. */
  height?: string;
}

export function ExpertProfileModal({
  staff,
  onClose,
  height = EXPERT_PROFILE_MODAL_HEIGHT,
}: ExpertProfileModalProps) {
  const expert = getExpertProfileForStaff(staff);
  const bodyRef = useRef<HTMLDivElement>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    bodyRef.current?.scrollTo({ top: 0 });

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [mounted]);

  if (!mounted) return null;

  return createPortal(
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 p-3 pb-[calc(5.5rem+env(safe-area-inset-bottom))] pt-[max(0.75rem,env(safe-area-inset-top))]"
      onClick={onClose}
      role="presentation"
    >
      <div
        className="
          flex w-full max-w-md shrink-0 flex-col overflow-hidden
          rounded-2xl bg-(--bg-primary) shadow-(--shadow-glow)
        "
        style={{
          height,
          maxHeight: "calc(100dvh - 6.5rem)",
        }}
        onClick={(event) => event.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="expert-profile-title"
      >
        <header className="shrink-0 border-b border-(--border) px-3 py-2.5">
          <div className="flex items-center justify-between gap-2">
            <div className="min-w-0">
              <h3
                id="expert-profile-title"
                className="truncate text-sm font-bold text-(--text-primary)"
              >
                Expert Profile
              </h3>
              <p className="mt-0.5 truncate text-[11px] text-(--text-muted)">
                {expert.name}
              </p>
            </div>
            <button
              type="button"
              onClick={onClose}
              aria-label="Close"
              className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-(--border) text-(--text-primary) transition-colors hover:bg-(--bg-card-hover)"
            >
              <X size={14} strokeWidth={2.5} />
            </button>
          </div>
        </header>

        <div
          ref={bodyRef}
          className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-2 py-2 [-webkit-overflow-scrolling:touch]"
        >
          <div className="space-y-2.5 pb-1">
            <ModalExpertHero expert={expert} />
            <TagsCard tags={expert.tags} />
            <CertificationCard
              title={expert.certificationTitle}
              items={expert.certificationItems}
            />
            <HobbiesCard hobbies={expert.hobbies} />
          </div>
        </div>

        <footer className="shrink-0 border-t border-(--border) p-3">
          <button
            type="button"
            onClick={onClose}
            className="
              primary-button flex h-10 w-full items-center justify-center
              rounded-xl text-[13px] font-semibold text-white
              transition-opacity hover:opacity-90
            "
          >
            Close
          </button>
        </footer>
      </div>
    </div>,
    document.body,
  );
}
