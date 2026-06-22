import Image from "next/image";
import Link from "next/link";
import { Star } from "lucide-react";

import { Button } from "@/components/Button";
import { ServiceExpert } from "../service.types";

interface SelectExpertsSectionProps {
  experts: ServiceExpert[];
}

export function SelectExpertsSection({ experts }: SelectExpertsSectionProps) {
  return (
    <section>
      <div className="mb-3 flex items-center gap-3">
        <h2 className="shrink-0 text-sm font-medium text-[var(--text-primary)]">
          Select Experts
        </h2>
        <div className="h-px flex-1 bg-[var(--border)]" />
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
              feature-card w-[118px] shrink-0 snap-start rounded-xl
            "
          >
            <div className="relative mx-auto h-20 w-full">
              <div className="relative h-20 w-full overflow-hidden rounded-t-xl">
                <Image
                  src={expert.image}
                  alt={expert.name}
                  fill
                  sizes="56px"
                  className="object-cover"
                />
              </div>

              {/* {expert.online && (
                <span
                  className="
                    absolute bottom-0 right-0 h-2.5 w-2.5
                    rounded-full border-2 border-[var(--bg-card)]
                    bg-[var(--success)]
                  "
                />
              )} */}
            </div>

            <div className="px-2.5 py-1.5">
            <p className="mt-2 truncate text-center text-[10px] font-semibold text-[var(--text-primary)]">
              {expert.name}
            </p>

            <p className="mt-0.5 truncate text-center text-[9px] font-semibold text-[var(--text-muted)]">
              {expert.specialty}
            </p>

            <div className="mt-1 flex items-center justify-center gap-0.5 text-[8px] font-semibold text-[var(--text-secondary)]">
              <Star
                size={8}
                className="fill-[var(--brand-gold)] text-[var(--brand-gold)]"
              />
              <span>
                {expert.rating} ({expert.reviews})
              </span>
            </div>

            <p className="mt-0.5 text-center text-[8px] font-semibold text-[var(--text-muted)]">
              {expert.experience}
            </p>

            <div className="mt-2 flex flex-col gap-1">
              <Button
                variant="primary"
                className="w-full rounded-xs py-1 text-[7px] font-medium"
              >
                Select
              </Button>

              <Link
                href={`/specificexpert/${expert.id}`}
                className="
                  secondary-button flex w-full items-center justify-center
                  rounded-xs py-1 text-[7px] font-medium
                  text-[var(--text-primary)] transition-all duration-300
                "
              >
                View
              </Link>
            </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
