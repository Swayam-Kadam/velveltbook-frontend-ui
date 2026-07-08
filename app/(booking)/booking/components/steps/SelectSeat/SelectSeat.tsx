"use client";

import { useCallback, useMemo, useRef, useState, type SVGProps } from "react";

import "./SelectSeat.css";

export type SeatAvailability = "available" | "unavailable";

export interface Seat {
  id: string;
  label: string;
  status?: SeatAvailability;
  availability?: SeatAvailability;
}

export interface SelectSeatProps {
  seats?: Seat[];
  selectedSeatId?: string | null;
  seatConfirmed?: boolean;
  initialSelectedSeatId?: string | null;
  onSelectSeat?: (seatId: string) => void;
  onConfirmSeat?: () => void;
  onConfirm?: (seatId: string) => void;
  serviceCount?: number;
  expertName?: string;
  totalPrice?: number;
  currency?: string;
  onContinue?: () => void;
  className?: string;
}

type IconProps = SVGProps<SVGSVGElement> & { size?: number };

function ArmchairIcon({
  size = 24,
  fill = "none",
  stroke = "currentColor",
  strokeWidth = 1.5,
  ...props
}: IconProps & { fill?: string; stroke?: string; strokeWidth?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill={fill}
      stroke={stroke}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      {...props}
    >
      <path d="M5 11V8a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v3" />
      <path d="M4 11h16v5a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2v-5Z" />
      <path d="M6 18v2" />
      <path d="M18 18v2" />
      <path d="M8 11V7a1 1 0 0 1 1-1h6a1 1 0 0 1 1 1v4" />
    </svg>
  );
}

function ChevronLeftIcon({ size = 16, ...props }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      {...props}
    >
      <path d="m15 18-6-6 6-6" />
    </svg>
  );
}

function ChevronRightIcon({ size = 16, ...props }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      {...props}
    >
      <path d="m9 18 6-6-6-6" />
    </svg>
  );
}

function CheckIcon({ size = 10, ...props }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="3"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      {...props}
    >
      <path d="M20 6 9 17l-5-5" />
    </svg>
  );
}

function XIcon({ size = 10, ...props }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="3"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      {...props}
    >
      <path d="M18 6 6 18" />
      <path d="m6 6 12 12" />
    </svg>
  );
}

function ArrowRightIcon({ size = 18, ...props }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      {...props}
    >
      <path d="M5 12h14" />
      <path d="m12 5 7 7-7 7" />
    </svg>
  );
}

function DoorIcon({ ...props }: IconProps) {
  return (
    <svg
      viewBox="0 0 28 36"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.4"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      {...props}
    >
      <rect x="4" y="3" width="20" height="30" rx="2.5" />
      <path d="M4 12h20" />
      <circle cx="19" cy="21" r="1.2" fill="currentColor" stroke="none" />
    </svg>
  );
}

function MirrorIllustration({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 48 56"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <rect x="6" y="1" width="2.5" height="14" rx="1.25" fill="currentColor" opacity="0.5" />
      <rect x="39.5" y="1" width="2.5" height="14" rx="1.25" fill="currentColor" opacity="0.5" />
      <path
        d="M11 5c0-2.2 1.8-4 4-4h18c2.2 0 4 1.8 4 4v26H11V5Z"
        stroke="currentColor"
        strokeWidth="1.4"
      />
      <path
        d="M15 9c0-1.1.9-2 2-2h14c1.1 0 2 .9 2 2v18H15V9Z"
        fill="currentColor"
        opacity="0.1"
      />
      <path d="M9 31h30" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
    </svg>
  );
}

const DEFAULT_SEATS: Seat[] = [
  { id: "a1", label: "A1", availability: "available" },
  { id: "a2", label: "A2", availability: "available" },
  { id: "a3", label: "A3", availability: "available" },
  { id: "a4", label: "A4", availability: "available" },
  { id: "a5", label: "A5", availability: "available" },
  { id: "a6", label: "A6", availability: "unavailable" },
  { id: "a7", label: "A7", availability: "available" },
  { id: "a8", label: "A8", availability: "available" },
];

export default function SelectSeat({
  seats = DEFAULT_SEATS,
  selectedSeatId,
  seatConfirmed,
  initialSelectedSeatId = "a1",
  onSelectSeat,
  onConfirmSeat,
  onConfirm,
  serviceCount = 2,
  expertName = "Samar",
  totalPrice = 208,
  currency = "$",
  onContinue,
  className = "",
}: SelectSeatProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const isControlled = selectedSeatId !== undefined;
  const [internalSelectedSeatId, setInternalSelectedSeatId] = useState<
    string | null
  >(() => {
    const initial = seats.find((seat) => seat.id === initialSelectedSeatId);
    const initialAvailability = initial
      ? initial.status ?? initial.availability
      : undefined;

    if (initial && initialAvailability === "available") {
      return initialSelectedSeatId;
    }

    const firstAvailable = seats.find(
      (seat) => (seat.status ?? seat.availability) === "available",
    );
    return firstAvailable?.id ?? null;
  });
  const [internalSeatConfirmed, setInternalSeatConfirmed] = useState(false);

  const activeSeatId = useMemo(() => {
    if (isControlled) return selectedSeatId ?? null;

    const currentSeat = seats.find((seat) => seat.id === internalSelectedSeatId);
    if (currentSeat && (currentSeat.status ?? currentSeat.availability) === "available") {
      return internalSelectedSeatId;
    }

    const preferredSeat = seats.find(
      (seat) =>
        seat.id === initialSelectedSeatId &&
        (seat.status ?? seat.availability) === "available",
    );
    if (preferredSeat) return preferredSeat.id;

    return (
      seats.find((seat) => (seat.status ?? seat.availability) === "available")
        ?.id ?? null
    );
  }, [initialSelectedSeatId, internalSelectedSeatId, isControlled, seats, selectedSeatId]);

  const activeSeatConfirmed = seatConfirmed ?? internalSeatConfirmed;

  const selectedSeat = useMemo(
    () => seats.find((seat) => seat.id === activeSeatId) ?? null,
    [activeSeatId, seats],
  );

  const scrollBy = useCallback((direction: "left" | "right") => {
    const container = scrollRef.current;
    if (!container) return;

    const offset = container.clientWidth * 0.6 * (direction === "left" ? -1 : 1);
    container.scrollBy({ left: offset, behavior: "smooth" });
  }, []);

  const handleSeatSelect = (seat: Seat) => {
    const availability = seat.status ?? seat.availability;
    if (availability !== "available") return;

    if (!isControlled) {
      setInternalSelectedSeatId(seat.id);
      setInternalSeatConfirmed(false);
    }

    onSelectSeat?.(seat.id);
  };

  const handleConfirm = () => {
    if (!activeSeatId) return;

    if (!isControlled) {
      setInternalSeatConfirmed(true);
    }

    if (onConfirmSeat) {
      onConfirmSeat();
      return;
    }

    onConfirm?.(activeSeatId);
  };

  const serviceLabel =
    serviceCount === 1 ? "1 service selected" : `${serviceCount} services selected`;

  return (
    <section className={`select-seat ${className}`.trim()} aria-label="Select your seat">
      <div className="select-seat__top">
        <header className="select-seat__header">
          <div className="select-seat__header-icon">
            <ArmchairIcon size={18} fill="currentColor" stroke="none" />
          </div>
          <div className="select-seat__header-text">
            <h2 className="select-seat__title">Select Your Seat</h2>
            <p className="select-seat__subtitle">
              Choose your preferred seat for the selected time
            </p>
          </div>
        </header>

        <div className="select-seat__legend" role="list" aria-label="Seat legend">
          <div className="select-seat__legend-item" role="listitem">
            <span className="select-seat__legend-icon select-seat__legend-icon--selected">
              <ArmchairIcon size={16} fill="currentColor" stroke="none" />
            </span>
            Selected
          </div>
          <div className="select-seat__legend-item" role="listitem">
            <span className="select-seat__legend-icon select-seat__legend-icon--available">
              <ArmchairIcon size={16} fill="currentColor" stroke="none" />
            </span>
            Available
          </div>
          <div className="select-seat__legend-item" role="listitem">
            <span className="select-seat__legend-icon select-seat__legend-icon--unavailable">
              <ArmchairIcon size={16} fill="currentColor" stroke="none" />
            </span>
            Unavailable
          </div>
        </div>
      </div>

      <div className="select-seat__carousel">
        <button
          type="button"
          className="select-seat__nav-btn select-seat__nav-btn--prev"
          aria-label="Scroll seats left"
          onClick={() => scrollBy("left")}
        >
          <ChevronLeftIcon size={14} />
        </button>

        <div ref={scrollRef} className="select-seat__track" role="listbox" aria-label="Seat options">
          <div className="select-seat__entrance" aria-hidden="true">
            <span className="select-seat__entrance-label">Entrance</span>
            <DoorIcon className="select-seat__entrance-door" />
            <ArrowRightIcon size={12} />
          </div>

          {seats.map((seat) => {
            const availability = seat.status ?? seat.availability;
            const isSelected = seat.id === activeSeatId;
            const isUnavailable = availability === "unavailable";
            const stateClass = isUnavailable
              ? "select-seat__seat--unavailable"
              : isSelected
                ? "select-seat__seat--selected"
                : "select-seat__seat--available";

            return (
              <button
                key={seat.id}
                type="button"
                role="option"
                aria-selected={isSelected}
                aria-disabled={isUnavailable}
                disabled={isUnavailable}
                className={`select-seat__seat ${stateClass}`}
                onClick={() => handleSeatSelect(seat)}
              >
                {isSelected && (
                  <span className="select-seat__badge select-seat__badge--check">
                    <CheckIcon size={7} />
                  </span>
                )}

                {isUnavailable && (
                  <span className="select-seat__badge select-seat__badge--x">
                    <XIcon size={6} />
                  </span>
                )}

                <MirrorIllustration className="select-seat__mirror" />
                <span className="select-seat__seat-chair" aria-hidden="true">
                  {isSelected || isUnavailable ? (
                    <ArmchairIcon size={17} fill="currentColor" stroke="none" />
                  ) : (
                    <ArmchairIcon size={17} stroke="currentColor" strokeWidth={1.6} />
                  )}
                </span>
                <span className="select-seat__seat-label">{seat.label}</span>
              </button>
            );
          })}
        </div>

        <button
          type="button"
          className="select-seat__nav-btn select-seat__nav-btn--next"
          aria-label="Scroll seats right"
          onClick={() => scrollBy("right")}
        >
          <ChevronRightIcon size={14} />
        </button>
      </div>

      <div className="select-seat__footer-bar">
        <div className="select-seat__selection">
          <div className="select-seat__selection-icon">
            <ArmchairIcon size={16} fill="currentColor" stroke="none" />
          </div>
          <div className="select-seat__selection-text">
            <p className="select-seat__selection-label">Selected Seat</p>
            <p className="select-seat__selection-value">
              {selectedSeat?.label ?? "—"}
            </p>
          </div>
        </div>

        <button
          type="button"
          className="select-seat__action-btn select-seat__confirm-btn"
          disabled={!activeSeatId}
          onClick={handleConfirm}
        >
          {activeSeatConfirmed ? "Seat Confirmed" : "Confirm Seat"}
          <ArrowRightIcon size={14} />
        </button>
      </div>

      {/* <div className="select-seat__summary-bar">
        <div className="select-seat__summary-info">
          <p className="select-seat__summary-count">{serviceLabel}</p>
          <p className="select-seat__summary-expert">with {expertName}</p>
        </div>

        <p className="select-seat__summary-price">
          {currency}
          {totalPrice}
        </p>

        <button
          type="button"
          className="select-seat__action-btn select-seat__continue-btn"
          onClick={onContinue}
        >
          Continue
          <ArrowRightIcon size={14} />
        </button>
      </div> */}
    </section>
  );
}
