"use client";

import { useState } from "react";

import { allMenuServices } from "@/menu/menu.data";
import {
  calcServicesTotal,
  getDefaultSeatId,
} from "../booking.data";
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
  const [step, setStep] = useState(1);
  const [serviceIds, setServiceIds] = useState<string[]>([]);

  const toggleService = (id: string) => {
    setServiceIds((prev) =>
      prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id],
    );
  };

  const primaryServiceId = serviceIds[0] ?? allMenuServices[0].id;
  const [staffId, setStaffId] = useState("sony");
  const [selectedDayId, setSelectedDayId] = useState("2026-05-22");
  const [selectedTime, setSelectedTime] = useState("11:00 AM");
  const [selectedSeatId, setSelectedSeatId] = useState(getDefaultSeatId);
  const [seatConfirmed, setSeatConfirmed] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("card");
  const [promoCode, setPromoCode] = useState("");
  const [billingName, setBillingName] = useState("");
  const [billingEmail, setBillingEmail] = useState("");
  const [billingPhone, setBillingPhone] = useState("");

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
            serviceId={primaryServiceId}
            staffId={staffId}
            selectedDayId={selectedDayId}
            selectedTime={selectedTime}
            selectedSeatId={selectedSeatId}
            seatConfirmed={seatConfirmed}
            onSelectStaff={setStaffId}
            onSelectDay={setSelectedDayId}
            onSelectTime={setSelectedTime}
            onSelectSeat={handleSelectSeat}
            onConfirmSeat={handleConfirmSeat}
            onBack={() => setStep(1)}
            onNext={() => setStep(3)}
            onEditService={() => setStep(1)}
          />
        )}

        {step === 3 && (
          <Step3DateTimeSelection
            selectedServiceIds={serviceIds}
            staffId={staffId}
            selectedDayId={selectedDayId}
            selectedTime={selectedTime}
            selectedSeatId={selectedSeatId}
            seatConfirmed={seatConfirmed}
            onSelectDay={setSelectedDayId}
            onSelectTime={setSelectedTime}
            onSelectSeat={handleSelectSeat}
            onConfirmSeat={handleConfirmSeat}
            onBack={() => setStep(2)}
            onNext={() => setStep(4)}
          />
        )}

        {step === 4 && (
          <Step4PaymentConfirmation
            serviceId={primaryServiceId}
            staffId={staffId}
            selectedDayId={selectedDayId}
            selectedTime={selectedTime}
            paymentMethod={paymentMethod}
            promoCode={promoCode}
            billingName={billingName}
            billingEmail={billingEmail}
            billingPhone={billingPhone}
            onPaymentMethodChange={setPaymentMethod}
            onPromoCodeChange={setPromoCode}
            onBillingChange={handleBillingChange}
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
