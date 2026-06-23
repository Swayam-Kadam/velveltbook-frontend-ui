import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { ExtendedStaff } from "../organization.types";

interface StaffSectionProps {
  staff: ExtendedStaff[];
}

export function StaffSection({ staff }: StaffSectionProps) {
  return (
    <section>
      <div className="mb-1 flex items-center justify-between">
        <h2 className="text-lg font-bold text-(--text-primary)">Staff</h2>
        <button
          type="button"
          className="primary-button flex items-center gap-0.5 text-[9px] font-bold text-[#efbf04] bg-(--bg-primary) rounded-xs px-2 py-1"
        >
          <span>View All</span>
          <ArrowRight size={10} strokeWidth={2} />
        </button>
      </div>

      <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
        {staff.map((member) => (
          <article
            key={member.id}
            className="feature-card w-[119px] shrink-0 rounded-xl"
          >
            <div className="relative h-[90px] overflow-hidden rounded-t-xl">
              <Image
                src={member.image}
                alt={member.name}
                fill
                sizes="110px"
                className="object-cover"
              />
            </div>

            <div className="p-2">
            <p className="mt-2 text-[11px] font-bold text-(--text-primary)">
              {member.name}
            </p>
            <p className="mt-0.5 text-[9px] font-semibold text-(--text-primary)">
              {member.experience}
            </p>

            <div className="mt-2 grid grid-cols-2 gap-1">
              <button
                type="button"
                className="secondary-button rounded-xs py-1 text-[10px] font-medium"
              >
                Select
              </button>
              <Link
                href="/specificexpert/e1"
                className="
                  secondary-button flex items-center justify-center
                  rounded-xs py-1 text-[10px] font-medium text-(--text-primary)
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
