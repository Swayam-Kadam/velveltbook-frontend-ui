"use client";

import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";

import type { ExpertType } from "@/menu/components/ExpertSelection";
import { getExtendedOrganization } from "@/specificorganizationbook/organization.data";
import { parseBookingSearchParams } from "../booking.navigation";
import {
  calcServicesTotal,
  createDefaultServiceSchedule,
  getDefaultSeatId,
  getStaffByGender,
  syncServiceSchedules,
} from "../booking.data";
import type { ServiceSchedules } from "../booking.types";
import { BookingHeader } from "./BookingHeader";
import { BookingProgress } from "./BookingProgress";
import { BookingStickyFooter } from "./BookingStickyFooter";
import { Step1ServiceSelection } from "./steps/Step1ServiceSelection";
import { Step2StaffSelection } from "./steps/Step2StaffSelection";
import { Step3DateTimeSelection } from "./steps/Step3DateTimeSelection";
import {
  getStep4Total,
  Step4PaymentConfirmation,
} from "./steps/Step4PaymentConfirmation";

export function BookingFlow() {
  const searchParams = useSearchParams();
  const [initialized, setInitialized] = useState(false);

  const [step, setStep] = useState(1);
  const [serviceIds, setServiceIds] = useState<string[]>([]);
  const [expertType, setExpertType] = useState<ExpertType>("");
  const [organizationId, setOrganizationId] = useState<string | undefined>();

  const toggleService = (id: string) => {
    setServiceIds((prev) =>
      prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id],
    );
  };

  const removeService = (id: string) => {
    setServiceIds((prev) => prev.filter((s) => s !== id));
  };

  const [staffId, setStaffId] = useState("sony");
  const [serviceSchedules, setServiceSchedules] = useState<ServiceSchedules>({});
  const [selectedSeatId, setSelectedSeatId] = useState(getDefaultSeatId);
  const [seatConfirmed, setSeatConfirmed] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("card");
  const [promoCode, setPromoCode] = useState("");
  const [billingName, setBillingName] = useState("");
  const [billingEmail, setBillingEmail] = useState("");
  const [billingPhone, setBillingPhone] = useState("");

  useEffect(() => {
    if (initialized) return;

    const parsed = parseBookingSearchParams(searchParams);

    if (parsed.serviceIds.length > 0) {
      setServiceIds(parsed.serviceIds);
    }
    if (parsed.expertType) {
      setExpertType(parsed.expertType);
      const matchingStaff = getStaffByGender(parsed.expertType);
      if (matchingStaff[0]) {
        setStaffId(matchingStaff[0].id);
      }
    }
    if (parsed.organizationId) {
      setOrganizationId(parsed.organizationId);
    }
    if (parsed.step === 2 && parsed.serviceIds.length > 0 && parsed.expertType) {
      setStep(2);
    }

    setInitialized(true);
  }, [initialized, searchParams]);

  useEffect(() => {
    setServiceSchedules((current) => syncServiceSchedules(current, serviceIds));
  }, [serviceIds]);

  const organizationBanner = useMemo(() => {
    if (!organizationId) return undefined;
    const org = getExtendedOrganization(organizationId);
    return {
      name: org.name,
      banner: org.heroImages[0],
      availability: org.availability,
      status: org.status,
    };
  }, [organizationId]);

  const { total } = calcServicesTotal(serviceIds);

  const handleBillingChange = (
    field: "billingName" | "billingEmail" | "billingPhone",
    value: string,
  ) => {
    if (field === "billingName") setBillingName(value);
    if (field === "billingEmail") setBillingEmail(value);
    if (field === "billingPhone") setBillingPhone(value);
  };

  const handleSelectSeat = (id: string) => {
    setSelectedSeatId(id);
    setSeatConfirmed(false);
  };

  const handleConfirmSeat = () => {
    setSeatConfirmed(true);
  };

  const handleSelectStaff = (id: string) => {
    setStaffId(id);
  };

  const handleSelectServiceDay = (serviceId: string, dayId: string) => {
    setServiceSchedules((current) => ({
      ...current,
      [serviceId]: {
        ...(current[serviceId] ?? createDefaultServiceSchedule()),
        dayId,
        isSet: true,
      },
    }));
  };

  const handleSelectServiceTime = (serviceId: string, time: string) => {
    setServiceSchedules((current) => ({
      ...current,
      [serviceId]: {
        ...(current[serviceId] ?? createDefaultServiceSchedule()),
        time,
        isSet: true,
      },
    }));
  };

  const footerConfig = () => {
    if (step === 4) {
      return {
        totalLabel: `$${getStep4Total(serviceIds)}`,
        buttonLabel: "Pay Now & Confirm Booking",
        buttonSubtext: "You'll receive a confirmation instantly",
        showLock: true,
        onAction: () => alert("Booking confirmed!"),
      };
    }
    if (step === 3) {
      return {
        totalLabel: `$${total}`,
        buttonLabel: "Continue to Payment",
        onAction: () => {
          if (seatConfirmed) setStep(4);
        },
      };
    }
    return null;
  };

  const footer = footerConfig();

  return (
    <div className="relative pb-[140px]">
      <div className="space-y-4 px-2 pt-2">
        <BookingHeader />
        <BookingProgress currentStep={step} />

        {step === 1 && (
          <Step1ServiceSelection
            selectedServiceIds={serviceIds}
            onToggleService={toggleService}
            onNext={() => setStep(2)}
          />
        )}

        {step === 2 && (
          <Step2StaffSelection
            selectedServiceIds={serviceIds}
            organizationBanner={organizationBanner}
            expertType={expertType}
            staffId={staffId}
            serviceSchedules={serviceSchedules}
            selectedSeatId={selectedSeatId}
            seatConfirmed={seatConfirmed}
            onSelectStaff={handleSelectStaff}
            onSelectServiceDay={handleSelectServiceDay}
            onSelectServiceTime={handleSelectServiceTime}
            onSelectSeat={handleSelectSeat}
            onConfirmSeat={handleConfirmSeat}
            onRemoveService={removeService}
            onBack={() => setStep(1)}
            onNext={() => setStep(3)}
            onEditService={() => setStep(1)}
          />
        )}

        {step === 3 && (
          <Step3DateTimeSelection
            selectedServiceIds={serviceIds}
            organizationBanner={organizationBanner}
            expertType={expertType}
            staffId={staffId}
            serviceSchedules={serviceSchedules}
            selectedSeatId={selectedSeatId}
            seatConfirmed={seatConfirmed}
            onSelectServiceDay={handleSelectServiceDay}
            onSelectServiceTime={handleSelectServiceTime}
            onSelectStaff={handleSelectStaff}
            onSelectSeat={handleSelectSeat}
            onConfirmSeat={handleConfirmSeat}
            onRemoveService={removeService}
            onBack={() => setStep(2)}
            onNext={() => setStep(4)}
          />
        )}

        {step === 4 && (
          <Step4PaymentConfirmation
            selectedServiceIds={serviceIds}
            organizationBanner={organizationBanner}
            staffId={staffId}
            serviceSchedules={serviceSchedules}
            paymentMethod={paymentMethod}
            promoCode={promoCode}
            billingName={billingName}
            billingEmail={billingEmail}
            billingPhone={billingPhone}
            onPaymentMethodChange={setPaymentMethod}
            onPromoCodeChange={setPromoCode}
            onBillingChange={handleBillingChange}
            onRemoveService={removeService}
            onBack={() => setStep(3)}
            onConfirm={() => alert("Booking confirmed!")}
            onEditService={() => setStep(1)}
            onChangeStaff={() => setStep(2)}
            onChangeTime={() => setStep(3)}
          />
        )}
      </div>

      {footer && (
        <BookingStickyFooter
          totalLabel={footer.totalLabel}
          buttonLabel={footer.buttonLabel}
          onAction={footer.onAction}
          showLock={footer.showLock}
          disabled={step === 3 && !seatConfirmed}
          buttonSubtext={"buttonSubtext" in footer ? footer.buttonSubtext : undefined}
        />
      )}
    </div>
  );
}
