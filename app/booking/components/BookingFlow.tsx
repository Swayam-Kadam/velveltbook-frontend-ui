"use client";

import { useState } from "react";

import {
  calcTotal,
  getService,
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
  const [serviceId, setServiceId] = useState("swedish");
  const [staffId, setStaffId] = useState("sony");
  const [selectedDate, setSelectedDate] = useState(22);
  const [selectedTime, setSelectedTime] = useState("11:00 AM");
  const [paymentMethod, setPaymentMethod] = useState("card");
  const [promoCode, setPromoCode] = useState("");
  const [billingName, setBillingName] = useState("");
  const [billingEmail, setBillingEmail] = useState("");
  const [billingPhone, setBillingPhone] = useState("");

  const service = getService(serviceId);
  const { total } = calcTotal(service.price);

  const handleBillingChange = (
    field: "billingName" | "billingEmail" | "billingPhone",
    value: string,
  ) => {
    if (field === "billingName") setBillingName(value);
    if (field === "billingEmail") setBillingEmail(value);
    if (field === "billingPhone") setBillingPhone(value);
  };

  const footerConfig = () => {
    if (step === 4) {
      return {
        totalLabel: `$${getStep4Total(serviceId)}`,
        buttonLabel: "Pay Now & Confirm Booking",
        showLock: true,
        onAction: () => alert("Booking confirmed!"),
      };
    }
    if (step === 3) {
      return {
        totalLabel: `$${total}`,
        buttonLabel: "Continue to Payment",
        onAction: () => setStep(4),
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
            selectedServiceId={serviceId}
            onSelectService={setServiceId}
            onNext={() => setStep(2)}
          />
        )}

        {step === 2 && (
          <Step2StaffSelection
            serviceId={serviceId}
            staffId={staffId}
            onSelectStaff={setStaffId}
            onBack={() => setStep(1)}
            onNext={() => setStep(3)}
          />
        )}

        {step === 3 && (
          <Step3DateTimeSelection
            serviceId={serviceId}
            staffId={staffId}
            selectedDate={selectedDate}
            selectedTime={selectedTime}
            onSelectDate={setSelectedDate}
            onSelectTime={setSelectedTime}
            onBack={() => setStep(2)}
            onNext={() => setStep(4)}
          />
        )}

        {step === 4 && (
          <Step4PaymentConfirmation
            serviceId={serviceId}
            staffId={staffId}
            selectedDate={selectedDate}
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
          />
        )}
      </div>

      {footer && (
        <BookingStickyFooter
          totalLabel={footer.totalLabel}
          buttonLabel={footer.buttonLabel}
          onAction={footer.onAction}
          showLock={footer.showLock}
        />
      )}
    </div>
  );
}
