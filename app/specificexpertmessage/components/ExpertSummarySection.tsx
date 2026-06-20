import Image from "next/image";
import Link from "next/link";
import {
  BadgeCheck,
  CalendarDays,
  Clock3,
  MessageCircle,
  Play,
  Star,
} from "lucide-react";

import { getExpert } from "@/specificexpert/expert.data";

interface ExpertSummarySectionProps {
  expertId: string;
}

export function ExpertSummarySection({ expertId }: ExpertSummarySectionProps) {
  const expert = getExpert(expertId);
  const experienceShort = expert.experience.replace(" Experience", " Exp");

  return (
    <section className="space-y-2">
      <div className="flex gap-3">
        <div className="relative shrink-0">
          <div
            className="
              relative h-14 w-14 overflow-hidden rounded-full
              border-2 border-[var(--brand-gold)]
            "
          >
            <Image
              src={expert.image}
              alt={expert.name}
              fill
              sizes="56px"
              className="object-cover"
              priority
            />
          </div>

          <span
            className="
              primary-button absolute -bottom-0.5 -right-0.5 flex h-5 w-5
              items-center justify-center rounded-full
            "
          >
            <Play size={8} className="ml-0.5 fill-white text-white" />
          </span>
        </div>

        <div className="min-w-0 flex-1 pt-0.5">
          <div className="flex items-center gap-1">
            <h1 className="truncate text-sm font-semibold text-[var(--text-primary)]">
              {expert.name}
            </h1>
            <BadgeCheck
              size={14}
              className="shrink-0 text-[var(--brand-gold)]"
              strokeWidth={1.8}
            />
          </div>

          <p className="mt-0.5 text-[9px] text-[var(--text-muted)]">{expert.title}</p>

          <div className="mt-1 flex flex-wrap items-center gap-1.5 text-[8px] text-[var(--text-secondary)]">
            <div className="flex items-center gap-0.5">
              <Star
                size={9}
                className="fill-[var(--brand-gold)] text-[var(--brand-gold)]"
              />
              <span>
                {expert.rating} ({expert.reviews} Reviews)
              </span>
            </div>

            <span className="h-3 w-px bg-[var(--border)]" />

            <div className="flex items-center gap-0.5">
              <Clock3 size={9} strokeWidth={1.6} className="text-[var(--brand-gold)]" />
              <span>{experienceShort}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2">
        <Link
          href="/booking"
          className="
            primary-button inline-flex flex-1 items-center justify-center gap-2
            rounded-xl py-2 text-[10px] font-medium text-white
          "
        >
          <CalendarDays size={14} strokeWidth={1.8} />
          Book Now
        </Link>

        <Link
          href={`/specificexpertmessage/${expertId}`}
          className="
            secondary-button inline-flex items-center justify-center gap-2
            rounded-xl py-2 text-[10px] font-medium
            border-[var(--accent-primary)] bg-[color-mix(in_srgb,var(--accent-primary)_8%,var(--bg-card))]
            text-[var(--text-primary)]
          "
        >
          <MessageCircle size={14} strokeWidth={1.8} />
          Message
        </Link>
      </div>
    </section>
  );
}
