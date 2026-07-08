"use client";

import Image from "next/image";
import { Check, Star } from "lucide-react";

import { Button } from "@/components/Button";
import { ServiceExpert } from "../service.types";

interface SelectExpertsSectionProps {
  experts: ServiceExpert[];
  selectedExpertId: string | null;
  onSelectExpert: (id: string) => void;
}

export function SelectExpertsSection({
  experts,
  selectedExpertId,
  onSelectExpert,
}: SelectExpertsSectionProps) {
  return (
    <section>
      <div className="mb-3 flex items-center gap-3">
        <h2 className="shrink-0 text-sm font-medium text-(--text-primary)">
          Select Experts
        </h2>
        <div className="h-px flex-1 bg-(--border)" />
      </div>

      <div
        className="
          flex gap-2 overflow-x-auto pb-1
          snap-x snap-mandatory scrollbar-none
        "
      >
        {experts.map((expert) => {
          const selected = selectedExpertId === expert.id;

          return (
            <article
              key={expert.id}
              role="button"
              tabIndex={0}
              onClick={() => onSelectExpert(expert.id)}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  onSelectExpert(expert.id);
                }
              }}
              className={`
                feature-card w-[118px] shrink-0 snap-start cursor-pointer
                rounded-xl transition-all duration-300
                ${
                  selected
                    ? "border-(--accent-primary) shadow-(--shadow-glow)"
                    : "hover:border-[color-mix(in_srgb,var(--accent-secondary)_25%,var(--border))]"
                }
              `}
            >
              <div className="relative mx-auto h-20 w-full">
                <div className="relative h-20 w-full overflow-hidden rounded-t-xl">
                  <Image
                    src={expert.image}
                    alt={expert.name}
                    fill
                    sizes="118px"
                    className="object-cover"
                  />
                </div>

                {selected && (
                  <span
                    className="
                      primary-button absolute right-1.5 top-1.5 flex h-4 w-4
                      items-center justify-center rounded-full text-white
                    "
                  >
                    <Check size={10} strokeWidth={2.5} />
                  </span>
                )}
              </div>

              <div className="px-2.5 py-1.5">
                <p className="mt-2 truncate text-center text-[10px] font-semibold text-(--text-primary)">
                  {expert.name}
                </p>

                <p className="mt-0.5 truncate text-center text-[9px] font-semibold text-(--text-muted)">
                  {expert.specialty}
                </p>

                <div className="mt-1 flex items-center justify-center gap-0.5 text-[8px] font-semibold text-(--text-secondary)">
                  <Star
                    size={8}
                    className="fill-(--brand-gold) text-(--brand-gold)"
                  />
                  <span>
                    {expert.rating} ({expert.reviews})
                  </span>
                </div>

                <p className="mt-0.5 text-center text-[8px] font-semibold text-(--text-muted)">
                  {expert.experience}
                </p>

                <div className="mt-2 flex flex-col gap-1">
                  <Button
                    type="button"
                    variant={selected ? "secondary" : "primary"}
                    onClick={(e) => {
                      e.stopPropagation();
                      onSelectExpert(expert.id);
                    }}
                    className="w-full rounded-xs py-1 text-[7px] font-medium"
                  >
                    {selected ? "Selected" : "Select"}
                  </Button>
                </div>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}
