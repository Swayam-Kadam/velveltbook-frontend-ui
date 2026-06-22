import Image from "next/image";
import { MapPin, Share2 } from "lucide-react";
import DirectionsIcon from '@mui/icons-material/Directions';

import { ExtendedOrganization } from "../organization.types";

interface SalonInfoCardProps {
  organization: ExtendedOrganization;
}

export function SalonInfoCard({ organization }: SalonInfoCardProps) {
  return (
    <div className="flex items-center gap-3 px-2">
      <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-xl">
        <Image
          src={organization.thumbnail}
          alt={organization.name}
          fill
          sizes="40px"
          className="object-cover"
        />
      </div>

      <div className="min-w-0 flex-1">
        <p className="truncate text-[12px] font-bold text-[var(--text-primary)]">
          {organization.name}
        </p>
        <div className="mt-0.5 flex items-center gap-1 text-[10px] font-semibold">
          <MapPin size={9} className="text-[var(--success)]" />
          <span className="text-[var(--success)]">{organization.status}</span>
        </div>
      </div>

      <button
        type="button"
        aria-label="Share salon"
        className="
          flex h-8 w-8 shrink-0 items-center justify-center rounded-full
          border border-[var(--border)] bg-[var(--bg-card)]
          text-[var(--accent-primary)]
        "
      >
        {/* <Share2 size={14} strokeWidth={1.6} /> */}
        <DirectionsIcon className="h-2 w-2 text-blue-600" />
      </button>
    </div>
  );
}
