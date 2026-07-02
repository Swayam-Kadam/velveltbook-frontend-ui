import Image from "next/image";
import { Clock3, ShoppingBag, X } from "lucide-react";
import {
  bookingLocation,
  calcServicesTotal,
  getSelectedServices,
} from "../booking.data";

interface OrganizationBannerInfo {
  name: string;
  banner: string;
  availability: string;
  status: string;
}

interface BookingSelectedServicesPanelProps {
  selectedServiceIds: string[];
  organization?: OrganizationBannerInfo;
  title?: string;
  onRemoveService?: (id: string) => void;
}

export function BookingSelectedServicesPanel({
  selectedServiceIds,
  organization,
  title = "Selected Services",
  onRemoveService,
}: BookingSelectedServicesPanelProps) {
  const selectedServices = getSelectedServices(selectedServiceIds);
  const { subtotal } = calcServicesTotal(selectedServiceIds);
  const hasSelection = selectedServices.length > 0;
  const org = organization ?? {
    name: bookingLocation.name,
    banner: bookingLocation.banner,
    availability: bookingLocation.availability,
    status: bookingLocation.status,
  };

  return (
    <>
      <section className="feature-card overflow-hidden rounded-xl">
        <div className="relative h-[130px] w-full">
          <Image
            src={org.banner}
            alt={org.name}
            fill
            sizes="100vw"
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-linear-to-t from-black/55 via-black/15 to-transparent" />

          <div className="absolute right-2 top-2">
            <div className="primary-button rounded-full px-3 py-1 text-[8px] font-medium text-white">
              {org.availability}
            </div>
          </div>

          <div className="absolute bottom-2 left-2.5 right-2.5">
            <p className="truncate text-[14px] font-bold text-white">
              {org.name}
            </p>
            <p className="text-[9px] font-semibold text-(--success)">
              {org.status}
            </p>
          </div>
        </div>
      </section>

      <section className="feature-card overflow-hidden rounded-xl">
        <div className="flex items-center justify-between border-b border-(--border) px-3 py-2.5">
          <div className="flex items-center gap-2">
            <span className="primary-button flex h-7 w-7 items-center justify-center rounded-full">
              <ShoppingBag size={13} strokeWidth={2} className="text-white" />
            </span>
            <div>
              <p className="text-[11px] font-bold text-(--text-primary)">
                {title}
              </p>
              <p className="text-[8px] font-semibold text-(--text-muted)">
                {hasSelection
                  ? `${selectedServices.length} service${selectedServices.length > 1 ? "s" : ""} added`
                  : "No services selected"}
              </p>
            </div>
          </div>
          {hasSelection && (
            <p className="text-[12px] font-bold text-(--brand-gold)">
              ${subtotal}
            </p>
          )}
        </div>

        {hasSelection ? (
          <div className="grid grid-cols-4 gap-2 p-3">
            {selectedServices.map((service) => (
              <article
                key={service.id}
                className="
                  overflow-hidden rounded-sm border border-(--border)
                  bg-[color-mix(in_srgb,var(--accent-primary)_4%,transparent)]
                "
              >
                <div className="relative h-14 w-full">
                  <Image
                    src={service.image}
                    alt={service.name}
                    fill
                    sizes="80px"
                    className="object-cover"
                  />
                  {onRemoveService && (
                    <button
                      type="button"
                      onClick={() => onRemoveService(service.id)}
                      aria-label={`Remove ${service.name}`}
                      className="
                        absolute right-0.5 top-0.5 flex h-4 w-4 items-center
                        justify-center rounded-full border border-(--border)
                        bg-(--bg-card)/95 text-(--text-muted)
                        transition-colors hover:border-(--accent-primary)
                        hover:text-(--accent-primary)
                      "
                    >
                      <X size={8} strokeWidth={2.5} />
                    </button>
                  )}
                </div>
                <div className="space-y-0.5 p-1.5">
                  <p className="line-clamp-2 min-h-6 text-[7px] font-bold leading-tight text-(--text-primary)">
                    {service.name}
                  </p>
                  <div className="flex items-center gap-0.5 text-[6px] font-semibold text-(--text-secondary)">
                    <Clock3 size={6} />
                    <span className="truncate">{service.duration}</span>
                  </div>
                  <p className="text-[8px] font-bold text-(--brand-gold)">
                    {service.priceLabel}
                  </p>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <p className="px-3 py-4 text-center text-[9px] font-medium text-(--text-muted)">
            No services selected yet
          </p>
        )}
      </section>
    </>
  );
}
