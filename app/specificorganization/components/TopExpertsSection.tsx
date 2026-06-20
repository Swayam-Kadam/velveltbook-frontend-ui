import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Star } from "lucide-react";

import { Button } from "@/components/Button";
import { OrganizationExpert } from "../organization.types";

interface TopExpertsSectionProps {
  experts: OrganizationExpert[];
}

export function TopExpertsSection({ experts }: TopExpertsSectionProps) {
  return (
    <section>
      <div className="mb-3 flex items-center justify-between">
        <h2 className="text-sm font-medium text-[var(--text-primary)]">
          Top Experts
        </h2>

        <button
          type="button"
          className="
            flex items-center gap-0.5 text-[8px]
            text-[var(--brand-gold)] transition-opacity duration-200
            hover:opacity-80
          "
        >
          <span>View All</span>
          <ArrowRight size={10} strokeWidth={2} />
        </button>
      </div>

      <div
        className="
          flex gap-2 overflow-x-auto pb-1
          snap-x snap-mandatory scrollbar-none
        "
      >
        {experts.map((expert) => (
          <article
            key={expert.id}
            className="
              feature-card w-[118px] shrink-0 snap-start rounded-xl p-2.5
            "
          >
            <div className="relative mx-auto h-14 w-14">
              <div className="relative h-14 w-14 overflow-hidden rounded-full">
                <Image
                  src={expert.image}
                  alt={expert.name}
                  fill
                  sizes="56px"
                  className="object-cover"
                />
              </div>

              {expert.online && (
                <span
                  className="
                    absolute bottom-0 right-0 h-2.5 w-2.5
                    rounded-full border-2 border-[var(--bg-card)]
                    bg-[var(--success)]
                  "
                />
              )}
            </div>

            <p className="mt-2 truncate text-center text-[9px] font-medium text-[var(--text-primary)]">
              {expert.name}
            </p>

            <p className="mt-0.5 truncate text-center text-[7px] text-[var(--text-muted)]">
              {expert.specialty}
            </p>

            <div className="mt-1 flex items-center justify-center gap-0.5 text-[7px] text-[var(--text-secondary)]">
              <Star
                size={8}
                className="fill-[var(--brand-gold)] text-[var(--brand-gold)]"
              />
              <span>
                {expert.rating} ({expert.reviews})
              </span>
            </div>

            <div className="mt-2 grid grid-cols-2 gap-1">
              <Button
                variant="primary"
                className="rounded-xs py-1 text-[7px] font-medium"
              >
                Select
              </Button>

              <Link
                href={`/specificexpert/${expert.id}`}
                className="
                  secondary-button flex items-center justify-center
                  rounded-xs py-1 text-[7px] font-medium
                  text-[var(--text-primary)] transition-all duration-300
                "
              >
                View
              </Link>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
