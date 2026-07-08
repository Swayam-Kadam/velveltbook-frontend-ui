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
    <div className="space-y-4 px-2 pb-24 pt-2">
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
        <OrganizationBookingCart
          itemCount={selectedServiceIds.length}
          onClick={navigateToBooking}
        />
      )}
    </div>
  );
}
