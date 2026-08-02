"use client";

import { useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";

import type { ExpertType } from "@/menu/components/ExpertSelection";
import { getExtendedOrganization } from "@/specificorganizationbook/organization.data";
import { parseBookingSearchParams } from "../booking.navigation";
import {
  calcServicesTotal,
  createDefaultServiceSchedule,
  getDefaultSeatId,
  getPrimaryStaffId,
  syncServiceSchedules,
  syncServiceStaffAssignments,
} from "../booking.data";
import type {
  ServiceSchedules,
  ServiceStaffAssignments,
} from "../booking.types";
import { BookingProgress } from "./BookingProgress";
import { BookingStickyFooter } from "./BookingStickyFooter";
import { Step1ServiceSelection } from "./steps/Step1ServiceSelection";
import { Step2StaffSelection } from "./steps/Step2StaffSelection";
import { Step3DateTimeSelection } from "./steps/Step3DateTimeSelection";
import { StepProductPreview } from "./steps/StepProductPreview";
import {
  getStep4Total,
  Step4PaymentConfirmation,
} from "./steps/Step4PaymentConfirmation";

function initialProductStep(parsedStep: number) {
  // Product flow: 1 = Preview, 2 = Payment.
  // Legacy org links used step=4 for payment — treat as payment.
  if (parsedStep >= 2) return 2;
  return 1;
}

export function BookingFlow() {
  const searchParams = useSearchParams();
  const parsed = useMemo(() => parseBookingSearchParams(searchParams), [searchParams]);

  const isProductFlow =
    parsed.productIds.length > 0 && parsed.serviceIds.length === 0;

  const [step, setStep] = useState(() =>
    isProductFlow
      ? initialProductStep(parsed.step)
      : parsed.step >= 1
        ? parsed.step
        : 1,
  );
  const [serviceIds, setServiceIds] = useState<string[]>(() => parsed.serviceIds);
  const [productIds, setProductIds] = useState<string[]>(() => parsed.productIds);
  const [productQuantities, setProductQuantities] = useState<
    Record<string, number>
  >(() => parsed.productQuantities ?? Object.fromEntries(parsed.productIds.map((id) => [id, 1])));
  const expertType: ExpertType = parsed.expertType;
  const organizationId = parsed.organizationId;

  const [staffId, setStaffId] = useState(
    () =>
      getPrimaryStaffId(
        parsed.staffAssignments ?? {},
        parsed.serviceIds,
        parsed.staffId ?? "sony",
      ),
  );
  const [serviceStaff, setServiceStaff] = useState<ServiceStaffAssignments>(
    () =>
      syncServiceStaffAssignments(
        parsed.staffAssignments ?? {},
        parsed.serviceIds,
        Object.keys(parsed.staffAssignments ?? {}).length > 0
          ? undefined
          : (parsed.staffId ?? undefined),
      ),
  );
  const [lockStaffSelection] = useState(
    () =>
      parsed.step === 2 &&
      Boolean(parsed.staffId) &&
      parsed.serviceIds.length > 0 &&
      Object.keys(parsed.staffAssignments ?? {}).length === 0,
  );
  const [serviceSchedules, setServiceSchedules] = useState<ServiceSchedules>(() =>
    syncServiceSchedules(
      parsed.scheduleAssignments ?? {},
      parsed.serviceIds,
    ),
  );
  const [selectedSeatId, setSelectedSeatId] = useState(getDefaultSeatId);
  const [seatConfirmed, setSeatConfirmed] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("visa");
  const [promoCode, setPromoCode] = useState("");
  const [billingName, setBillingName] = useState("");
  const [billingEmail, setBillingEmail] = useState("");
  const [billingPhone, setBillingPhone] = useState("");

  const setSelectedServices = (updater: (current: string[]) => string[]) => {
    setServiceIds((current) => {
      const next = updater(current);
      setServiceSchedules((existing) => syncServiceSchedules(existing, next));
      setServiceStaff((existing) =>
        syncServiceStaffAssignments(
          existing,
          next,
          lockStaffSelection ? staffId : undefined,
        ),
      );
      return next;
    });
  };

  const toggleService = (id: string) => {
    setSelectedServices((current) =>
      current.includes(id) ? current.filter((serviceId) => serviceId !== id) : [...current, id],
    );
  };

  const removeService = (id: string) => {
    setSelectedServices((current) => current.filter((serviceId) => serviceId !== id));
  };

  const toggleProduct = (id: string) => {
    setProductIds((current) => {
      if (current.includes(id)) {
        setProductQuantities((quantities) => {
          const { [id]: _, ...rest } = quantities;
          return rest;
        });
        return current.filter((productId) => productId !== id);
      }

      setProductQuantities((quantities) => ({
        ...quantities,
        [id]: quantities[id] ?? 1,
      }));
      return [...current, id];
    });
  };

  const updateProductQuantity = (id: string, quantity: number) => {
    if (quantity < 1) {
      removeProduct(id);
      return;
    }

    setProductQuantities((current) => ({
      ...current,
      [id]: quantity,
    }));
  };

  const removeProduct = (id: string) => {
    setProductIds((current) => current.filter((productId) => productId !== id));
    setProductQuantities((current) => {
      const { [id]: _, ...rest } = current;
      return rest;
    });
  };

  const organizationBanner = useMemo(() => {
    if (!organizationId) return undefined;
    const org = getExtendedOrganization(organizationId);
    return {
      name: org.name,
      banner: org.heroImages[0],
      availability: org.availability,
      status: org.status,
      thumbnail: org.thumbnail,
    };
  }, [organizationId]);

  const { total: servicesTotal } = calcServicesTotal(serviceIds, organizationId);

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

  const handleSelectServiceStaff = (serviceId: string, nextStaffId: string) => {
    setServiceStaff((current) => ({
      ...current,
      [serviceId]: nextStaffId,
    }));
    setStaffId(nextStaffId);
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
    if (isProductFlow) {
      if (step === 2) {
        return {
          totalLabel: `$${getStep4Total(serviceIds, productIds, productQuantities)}`,
          buttonLabel: "Pay Now & Confirm Order",
          buttonSubtext: "You'll receive a confirmation instantly",
          showLock: true,
          onAction: () => alert("Order confirmed!"),
        };
      }
      return null;
    }

    if (step === 4) {
      return {
        totalLabel: `$${getStep4Total(serviceIds, productIds, productQuantities)}`,
        buttonLabel: "Pay Now & Confirm Booking",
        buttonSubtext: "You'll receive a confirmation instantly",
        showLock: true,
        onAction: () => alert("Booking confirmed!"),
      };
    }
    if (step === 3) {
      return {
        totalLabel: `$${servicesTotal}`,
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
    <div className="relative pb-[140px] lg:pb-10 scrollbar-thin scrollbar-thumb-(--accent-primary) scrollbar-track-(--bg-secondary)">
      <div className="space-y-4 px-2 pt-2 lg:mx-auto lg:w-full lg:max-w-[1600px] lg:space-y-5 lg:px-5 lg:pt-4 scrollbar-thin scrollbar-thumb-(--accent-primary) scrollbar-track-(--bg-secondary)">
        <BookingProgress
          currentStep={step}
          mode={isProductFlow ? "product" : "service"}
        />

        {isProductFlow ? (
          <>
            {step === 1 && (
              <StepProductPreview
                selectedProductIds={productIds}
                productQuantities={productQuantities}
                organizationBanner={organizationBanner}
                onToggleProduct={toggleProduct}
                onRemoveProduct={removeProduct}
                onUpdateQuantity={updateProductQuantity}
                onNext={() => setStep(2)}
              />
            )}

            {step === 2 && (
              <Step4PaymentConfirmation
                selectedServiceIds={[]}
                selectedProductIds={productIds}
                productQuantities={productQuantities}
                organizationBanner={organizationBanner}
                organizationId={organizationId}
                staffId={staffId}
                serviceStaff={{}}
                serviceSchedules={{}}
                paymentMethod={paymentMethod}
                promoCode={promoCode}
                billingName={billingName}
                billingEmail={billingEmail}
                billingPhone={billingPhone}
                onPaymentMethodChange={setPaymentMethod}
                onPromoCodeChange={setPromoCode}
                onBillingChange={handleBillingChange}
                onRemoveProduct={removeProduct}
                onBack={() => setStep(1)}
                onConfirm={() => alert("Order confirmed!")}
                onEditService={() => setStep(1)}
              />
            )}
          </>
        ) : (
          <>
            {step === 1 && (
              <Step1ServiceSelection
                selectedServiceIds={serviceIds}
                organizationBanner={organizationBanner}
                onToggleService={toggleService}
                onNext={() => setStep(2)}
              />
            )}

            {step === 2 && (
              <Step2StaffSelection
                selectedServiceIds={serviceIds}
                organizationBanner={organizationBanner}
                organizationId={organizationId}
                expertType={expertType}
                serviceStaff={serviceStaff}
                lockStaffSelection={lockStaffSelection}
                serviceSchedules={serviceSchedules}
                selectedSeatId={selectedSeatId}
                seatConfirmed={seatConfirmed}
                onSelectServiceStaff={handleSelectServiceStaff}
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
                organizationId={organizationId}
                expertType={expertType}
                serviceStaff={serviceStaff}
                serviceSchedules={serviceSchedules}
                selectedSeatId={selectedSeatId}
                seatConfirmed={seatConfirmed}
                onSelectServiceDay={handleSelectServiceDay}
                onSelectServiceTime={handleSelectServiceTime}
                onSelectServiceStaff={handleSelectServiceStaff}
                onSelectSeat={handleSelectSeat}
                onConfirmSeat={handleConfirmSeat}
                onRemoveService={removeService}
                onBack={() => setStep(2)}
                onNext={() => setStep(4)}
                onEditService={() => setStep(1)}
              />
            )}

            {step === 4 && (
              <Step4PaymentConfirmation
                selectedServiceIds={serviceIds}
                selectedProductIds={productIds}
                productQuantities={productQuantities}
                organizationBanner={organizationBanner}
                organizationId={organizationId}
                staffId={getPrimaryStaffId(serviceStaff, serviceIds, staffId)}
                serviceStaff={serviceStaff}
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
                onRemoveProduct={removeProduct}
                onBack={() => setStep(3)}
                onConfirm={() => alert("Booking confirmed!")}
                onEditService={() => setStep(1)}
                onChangeStaff={() => setStep(2)}
                onChangeTime={() => setStep(3)}
              />
            )}
          </>
        )}
      </div>

      {footer && (
        <BookingStickyFooter
          totalLabel={footer.totalLabel}
          buttonLabel={footer.buttonLabel}
          onAction={footer.onAction}
          showLock={footer.showLock}
          disabled={
            isProductFlow ? false : step === 3 && !seatConfirmed
          }
          buttonSubtext={"buttonSubtext" in footer ? footer.buttonSubtext : undefined}
        />
      )}
    </div>
  );
}
