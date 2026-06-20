"use client";

import Image from "next/image";
import Link from "next/link";
import { ChevronRight, Mars, Search, Star, Venus } from "lucide-react";

import { femaleExperts, maleExperts } from "../help.data";
import { HomeExpert } from "../help.types";

interface ChooseExpertSectionProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
}

function ExpertColumn({
  title,
  genderIcon: GenderIcon,
  headerClass,
  experts,
  viewAllLabel,
  viewAllClass,
}: {
  title: string;
  genderIcon: typeof Mars;
  headerClass: string;
  experts: HomeExpert[];
  viewAllLabel: string;
  viewAllClass?: string;
}) {
  return (
    <div className="min-w-0 flex-1">
      <div
        className={`mb-2 flex items-center justify-center gap-1 rounded-lg px-2 py-1.5 ${headerClass}`}
      >
        <GenderIcon size={12} strokeWidth={1.6} />
        <span className="text-[8px] font-medium">{title}</span>
      </div>

      <div className="space-y-2">
        {experts.map((expert) => (
          <button
            key={expert.id}
            type="button"
            className="flex w-full items-center gap-1.5 text-left"
          >
            <div className="relative h-8 w-8 shrink-0">
              <div className="relative h-8 w-8 overflow-hidden rounded-full">
                <Image
                  src={expert.image}
                  alt={expert.name}
                  fill
                  sizes="32px"
                  className="object-cover"
                />
              </div>
              <span
                className="
                  absolute bottom-0 right-0 h-2 w-2 rounded-full
                  border border-[var(--bg-card)] bg-[var(--success)]
                "
              />
            </div>

            <div className="min-w-0 flex-1">
              <p className="truncate text-[8px] font-medium text-[var(--text-primary)]">
                {expert.name}
              </p>
              <p className="truncate text-[7px] text-[var(--text-muted)]">
                {expert.profession}
              </p>
              <div className="flex items-center gap-0.5 text-[6px] text-[var(--text-secondary)]">
                <Star
                  size={7}
                  className="fill-[var(--brand-gold)] text-[var(--brand-gold)]"
                />
                <span>
                  {expert.rating} ({expert.reviews})
                </span>
              </div>
            </div>

            <ChevronRight size={10} className="shrink-0 text-[var(--text-muted)]" />
          </button>
        ))}
      </div>

      <div className="mt-2 grid grid-cols-2 gap-1">
        <button
          type="button"
          className="primary-button rounded-md py-1 text-[7px] font-medium text-white"
        >
          Select
        </button>
        <Link
          href={`/specificexpert/e1`}
          className="
            secondary-button flex items-center justify-center rounded-md
            py-1 text-[7px] font-medium text-[var(--text-primary)]
          "
        >
          View
        </Link>
      </div>

      <button
        type="button"
        className={`
          secondary-button mt-2 flex w-full items-center justify-between
          rounded-lg px-2 py-1.5 text-[7px] font-medium
          text-[var(--text-primary)] ${viewAllClass ?? ""}
        `}
      >
        <span>{viewAllLabel}</span>
        <ChevronRight size={10} className="text-[var(--brand-gold)]" />
      </button>
    </div>
  );
}

export function ChooseExpertSection({
  searchQuery,
  onSearchChange,
}: ChooseExpertSectionProps) {
  const filterExperts = (experts: HomeExpert[]) =>
    experts.filter(
      (e) =>
        e.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        e.profession.toLowerCase().includes(searchQuery.toLowerCase()),
    );

  return (
    <section>
      <h2 className="mb-3 text-sm font-medium text-[var(--text-primary)]">
        2. Choose an Expert
      </h2>

      <div
        className="
          search-glass mb-3 flex items-center gap-2 rounded-xl border
          px-3 py-2
        "
      >
        <Search size={14} className="shrink-0 text-[var(--text-muted)]" strokeWidth={1.4} />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Search expert by name or username"
          className="
            w-full bg-transparent text-[9px] text-[var(--text-primary)]
            placeholder:text-[var(--text-muted)] focus:outline-none
          "
        />
      </div>

      <div className="flex gap-2">
        <ExpertColumn
          title="Male Experts"
          genderIcon={Mars}
          headerClass="bg-[color-mix(in_srgb,var(--accent-primary)_10%,var(--bg-card))] text-[var(--accent-primary)]"
          experts={filterExperts(maleExperts)}
          viewAllLabel="View All Male Experts"
        />
        <ExpertColumn
          title="Female Experts"
          genderIcon={Venus}
          headerClass="bg-[color-mix(in_srgb,#ec4899_12%,var(--bg-card))] text-pink-500"
          experts={filterExperts(femaleExperts)}
          viewAllLabel="View All Female Experts"
          viewAllClass="border-pink-300/40"
        />
      </div>
    </section>
  );
}
