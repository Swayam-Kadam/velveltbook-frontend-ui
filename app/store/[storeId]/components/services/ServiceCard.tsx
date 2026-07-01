import Image from "next/image";
import Link from "next/link";

import type { Service } from "../types";

interface Props {
  service: Service;
}

export default function ServiceCard({ service }: Props) {
  return (
    <Link
      href="/menu"
      className="group flex h-full w-full flex-col"
    >
      <div className="relative h-[120px] w-full overflow-hidden rounded-[var(--radius-md)] border border-(--border) sm:h-[130px]">
        <Image
          src={service.image}
          alt={service.title}
          fill
          sizes="180px"
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />

        {service.isExplore && (
          <div className="absolute inset-0 bg-(--accent-primary) opacity-50 transition-opacity group-hover:opacity-60" />
        )}
      </div>

      <div className="mt-2 px-0.5">
        <h3 className="truncate text-xs font-medium text-(--text-primary) lg:text-sm">
          {service.title}
        </h3>

        <span
          className={
            service.isExplore
              ? "text-xs font-semibold text-(--accent-secondary) lg:text-sm"
              : "text-sm font-bold text-(--text-primary) lg:text-base"
          }
        >
          {service.price}
        </span>
      </div>
    </Link>
  );
}
