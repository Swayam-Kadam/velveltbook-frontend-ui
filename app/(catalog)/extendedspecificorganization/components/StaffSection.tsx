"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Check } from "lucide-react";

import { Button } from "@/components/Button";
import { ExtendedStaff } from "../organization.types";

interface StaffSectionProps {
  staff: ExtendedStaff[];
  selectedStaffId: string | null;
  onSelectStaff: (id: string) => void;
}

export function StaffSection({
  staff,
  selectedStaffId,
  onSelectStaff,
}: StaffSectionProps) {
  return (
    <section>
      <div className="mb-1 flex items-center justify-between">
        <h2 className="text-lg font-bold text-(--text-primary)">Staff</h2>
        <button
          type="button"
          className="primary-button flex items-center gap-0.5 rounded-xs bg-(--bg-primary) px-2 py-1 text-[9px] font-bold text-[#efbf04]"
        >
          <span>View All</span>
          <ArrowRight size={10} strokeWidth={2} />
        </button>
      </div>

      <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
        {staff.map((member) => {
          const selected = selectedStaffId === member.id;

          return (
            <article
              key={member.id}
              className={`
                feature-card w-[119px] shrink-0 rounded-xl transition-all duration-300
                ${
                  selected
                    ? "border-(--accent-primary) shadow-(--shadow-glow)"
                    : ""
                }
              `}
            >
              <div className="relative h-[90px] overflow-hidden rounded-t-xl">
                <Link href="/specificexpert/e1">
                  <Image
                    src={member.image}
                    alt={member.name}
                    fill
                    sizes="110px"
                    className="object-cover"
                  />
                </Link>

                {selected && (
                  <span
                    className="
                      primary-button absolute right-1 top-1 z-10 flex h-4 w-4
                      items-center justify-center rounded-full text-white
                    "
                  >
                    <Check size={10} strokeWidth={2.5} />
                  </span>
                )}
              </div>

              <div className="p-2">
                <p className="mt-2 text-[11px] font-bold text-(--text-primary)">
                  <Link href="/specificexpert/e1">{member.name}</Link>
                </p>
                <Link href="/specificexpert/e1">
                  <p className="mt-0.5 text-[9px] font-semibold text-(--text-primary)">
                    {member.experience}
                  </p>
                </Link>

                <div className="mt-2 grid grid-cols-1 gap-1">
                  <Button
                    type="button"
                    variant={selected ? "secondary" : "primary"}
                    onClick={() => onSelectStaff(member.id)}
                    className="w-full rounded-xs py-1 text-[10px] font-medium"
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
