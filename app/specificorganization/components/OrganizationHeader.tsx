import Image from "next/image";
import { BadgeCheck, Clock3, MapPin, Star } from "lucide-react";

import { Organization } from "../organization.types";

interface OrganizationHeaderProps {
  organization: Organization;
}

export function OrganizationHeader({ organization }: OrganizationHeaderProps) {
  return (
    <section className="flex gap-3">
      <div className="relative h-[100px] w-[100px] shrink-0 overflow-hidden rounded-xl">
        <Image
          src={organization.image}
          alt={organization.name}
          fill
          sizes="100px"
          className="object-cover"
        />

        <div
          className="
            absolute bottom-1.5 left-1.5 flex items-center gap-0.5
            rounded-full bg-(--text-primary)/85 px-1.5 py-0.5
            backdrop-blur-sm
          "
        >
          <Star
            size={8}
            className="fill-(--brand-gold) text-(--brand-gold)"
          />
          <span className="text-[8px] font-medium text-white">
            {organization.rating}
          </span>
        </div>
      </div>

      <div className="min-w-0 flex-1 pt-0.5">
        <div className="flex items-start gap-1">
          <h1 className="text-md font-bold leading-tight text-(--text-primary)">
            {organization.name}
          </h1>

          <BadgeCheck
            size={14}
            className="mt-0.5 shrink-0 text-(--accent-primary)"
            strokeWidth={1.8}
          />
        </div>

        <p className="mt-1 text-[10px]  text-semibold">
          {organization.categories.join(" • ")}
        </p>

        <div className="mt-1.5 flex items-start gap-1 text-[9px] text-semibold">
          <MapPin size={10} strokeWidth={1.6} className="mt-0.5 shrink-0" />
          <span className="leading-tight">{organization.location}</span>
        </div>

        <div className="mt-2 flex items-center gap-2 text-[9px]">
          <div className="flex items-center gap-0.5 text-semibold">
            <Star
              size={9}
              className="fill-(--brand-gold) text-(--brand-gold)"
            />
            <span>
              {organization.rating} ({organization.reviews} Reviews)
            </span>
          </div>

          <span className="h-3 w-px bg-(--border)" />

          <div className="flex items-center gap-0.5 text-semibold">
            <Clock3 size={9} strokeWidth={1.6} />
            <span>
              <span className="text-(--success)">{organization.status}</span>
              {" • "}
              Closes {organization.closesAt}
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
