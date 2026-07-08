import Link from "next/link";
import { ArrowRight } from "lucide-react";

interface SectionHeaderProps {
  title: string;
  viewAllLabel?: string;
  viewAllHref?: string;
}

export default function SectionHeader({
  title,
  viewAllLabel,
  viewAllHref = "#",
}: SectionHeaderProps) {
  return (
    <div className="mb-3 flex items-center justify-between lg:mb-5">
      <h2 className="text-sm font-semibold text-(--text-primary) lg:text-xl">
        {title}
      </h2>

      {viewAllLabel && (
        <Link
          href={viewAllHref}
          className="flex items-center gap-1 text-[11px] font-medium text-(--accent-secondary) transition-colors hover:text-(--accent-primary) lg:gap-1.5 lg:text-sm"
        >
          <span>{viewAllLabel}</span>
          <ArrowRight size={14} strokeWidth={2} />
        </Link>
      )}
    </div>
  );
}
