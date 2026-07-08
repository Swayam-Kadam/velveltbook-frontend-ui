import Image from "next/image";
import Link from "next/link";
import { BriefcaseBusiness, CalendarDays, Star } from "lucide-react";

import type { StaffMember } from "../types";

interface Props {
  member: StaffMember;
  bookServiceLabel: string;
}

export default function StaffCard({ member, bookServiceLabel }: Props) {
  return (
    <article className="flex h-full w-full flex-col overflow-hidden rounded-[var(--radius-md)] border border-(--border) bg-(--bg-card) p-3 shadow-[var(--shadow-card)] transition-all duration-300 hover:-translate-y-0.5 lg:p-4">
      <div className="flex flex-col items-center text-center">
        <div className="relative h-16 w-16 overflow-hidden rounded-full border-2 border-(--border) lg:h-24 lg:w-24">
          <Image
            src={member.image}
            alt={member.name}
            fill
            sizes="96px"
            className="object-cover"
          />
        </div>

        <h3 className="mt-2 line-clamp-1 text-xs font-semibold text-(--text-primary) lg:mt-3 lg:text-base">
          {member.name}
        </h3>
        <p className="mt-0.5 line-clamp-1 text-[10px] text-(--text-secondary) lg:text-xs">
          {member.designation}
        </p>
      </div>

      <div className="mt-3 flex-1 space-y-1.5 border-t border-(--border) pt-3 lg:mt-4 lg:space-y-2 lg:pt-4">
        <div className="flex items-center gap-1.5 text-[10px] text-(--text-secondary) lg:gap-2 lg:text-xs">
          <BriefcaseBusiness size={12} className="shrink-0 text-(--text-muted)" />
          <span className="truncate">{member.experience}</span>
        </div>
        <div className="flex items-center gap-1.5 text-[10px] text-(--text-secondary) lg:gap-2 lg:text-xs">
          <CalendarDays size={12} className="shrink-0 text-(--text-muted)" />
          <span className="truncate">{member.specialty}</span>
        </div>
        <div className="flex items-center gap-1.5 text-[10px] text-(--text-secondary) lg:gap-2 lg:text-xs">
          <Star
            size={12}
            className="shrink-0 fill-(--brand-gold) text-(--brand-gold)"
          />
          <span>{member.rating} Rating</span>
        </div>
      </div>

      <Link
        href="/booking"
        className="primary-button mt-3 flex h-8 w-full items-center justify-center rounded-lg text-[11px] font-medium text-white lg:mt-4 lg:h-10 lg:rounded-xl lg:text-sm"
      >
        {bookServiceLabel}
      </Link>
    </article>
  );
}
