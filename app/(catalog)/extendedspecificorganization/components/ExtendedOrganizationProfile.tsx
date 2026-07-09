"use client";

import { useCallback, useState } from "react";
import { useRouter } from "next/navigation";
import Swal from "sweetalert2";

import { SearchBar } from "@/components/header/SearchBar";
import { buildBookingUrl } from "@/booking/booking.navigation";
import { ExtendedOrganization } from "../organization.types";
import { HeroBanner } from "./HeroBanner";
import { OrganizationBookingCart } from "./OrganizationBookingCart";
import { ReviewsSection } from "./ReviewsSection";
import { ServicesSection } from "./ServicesSection";
import { StaffSection } from "./StaffSection";
import { ArrowRight, ShoppingCart } from "lucide-react";

const swalDefaults = {
  confirmButtonText: "Okay",
  confirmButtonColor: "#b8860b",
  background: "#1a1a1a",
  color: "#ffffff",
} as const;

interface ExtendedOrganizationProfileProps {
  organization: ExtendedOrganization;
}

export function ExtendedOrganizationProfile({
  organization,
}: ExtendedOrganizationProfileProps) {
  const router = useRouter();
  const [selectedServiceIds, setSelectedServiceIds] = useState<string[]>([]);
  const [selectedStaffId, setSelectedStaffId] = useState<string | null>(null);

  const toggleService = useCallback((id: string) => {
    setSelectedServiceIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id],
    );
  }, []);

  const toggleStaff = useCallback((id: string) => {
    setSelectedStaffId((prev) => (prev === id ? null : id));
  }, []);

  const navigateToBooking = useCallback(() => {
    if (!selectedStaffId || selectedServiceIds.length === 0) return;

    router.push(
      buildBookingUrl({
        serviceIds: selectedServiceIds,
        expertType: "",
        organizationId: organization.id,
        staffId: selectedStaffId,
        step: 2,
      }),
    );
  }, [organization.id, router, selectedServiceIds, selectedStaffId]);

  const handleBookNow = useCallback(() => {
    if (selectedServiceIds.length === 0) return;

    if (!selectedStaffId) {
      Swal.fire({
        icon: "warning",
        title: "Please select staff",
        text: "Choose a staff member before continuing to booking.",
        ...swalDefaults,
      });
      return;
    }

    navigateToBooking();
  }, [navigateToBooking, selectedServiceIds.length, selectedStaffId]);

  const showCart =
    selectedStaffId !== null && selectedServiceIds.length > 0;

  return (
    <div className="space-y-4 px-2 pb-35 pt-2">
      <SearchBar />
      <HeroBanner
        images={organization.heroImages}
        availability={organization.availability}
        salonName={organization.name}
        organization={organization}
      />
      <ServicesSection
        services={organization.services}
        selectedServiceIds={selectedServiceIds}
        onToggleService={toggleService}
        onBookNow={handleBookNow}
      />
      <StaffSection
        staff={organization.staff}
        selectedStaffId={selectedStaffId}
        onSelectStaff={toggleStaff}
      />
      <ReviewsSection reviews={organization.reviews} />

      {showCart && (
        <div
          className="
            fixed inset-x-2 bottom-[85px] z-40 overflow-hidden rounded-xl
            border border-(--border) bg-(--bg-card)/95 shadow-(--shadow-card)
            backdrop-blur-xl
          "
        >
          <div className="flex items-stretch">
            <div className="flex items-center gap-2.5 px-3 py-2.5">
              <div className="relative shrink-0">
                <span
                  className="
                    primary-button flex h-10 w-10 items-center justify-center
                    rounded-xl
                  "
                >
                  <ShoppingCart size={18} strokeWidth={2} className="text-white" />
                </span>
                <span
                  className="
                    absolute -right-1 -top-1 flex h-4 min-w-4 items-center
                    justify-center rounded-full bg-(--brand-gold) px-1
                    text-[8px] font-bold text-(--text-primary)
                  "
                  aria-label={`${selectedServiceIds.length} services in cart`}
                >
                  {selectedServiceIds.length}
                </span>
              </div>

              <div className="min-w-0">
                <span className="text-sm font-semibold text-(--brand-gold)">
                  $234
                </span>
              </div>
            </div>

            <button
              type="button"
              onClick={navigateToBooking}
              className="
                primary-button flex flex-1 items-center justify-center
                rounded-none px-3 py-3 text-[11px] font-semibold text-white
              "
            >
              NEXT <ArrowRight size={14} strokeWidth={2.5} />
            </button>
          </div>
        </div>
      )}

    </div>
  );
}
