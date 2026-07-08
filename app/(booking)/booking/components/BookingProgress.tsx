const steps = [
  { num: 1, label: "Service" },
  { num: 2, label: "Staff" },
  { num: 3, label: "Date & Time" },
  { num: 4, label: "Payment" },
];

interface BookingProgressProps {
  currentStep: number;
}

export function BookingProgress({ currentStep }: BookingProgressProps) {
  const progressRatio =
    steps.length > 1 ? (currentStep - 1) / (steps.length - 1) : 0;

  return (
    <div className="relative mt-4">
      <div
        className="absolute inset-x-3 top-3 h-px bg-(--border)"
        aria-hidden
      />
      <div
        className="
          absolute left-3 top-3 h-px bg-(--accent-primary)
          transition-all duration-300
        "
        style={{
          width: `calc((100% - 1.5rem) * ${progressRatio})`,
        }}
        aria-hidden
      />

      <div className="relative flex justify-between">
        {steps.map((step) => {
          const active = currentStep === step.num;
          const completed = currentStep > step.num;

          return (
            <div
              key={step.num}
              className="flex w-6 flex-col items-center"
            >
              <div
                className={`
                  relative z-10 flex h-6 w-6 shrink-0 items-center justify-center
                  rounded-full text-[9px] font-semibold
                  ${
                    active || completed
                      ? "primary-button text-white shadow-none"
                      : "border border-(--border) bg-(--bg-card) text-(--text-muted)"
                  }
                `}
              >
                {step.num}
              </div>

              <span
                className={`
                  mt-1 w-max text-center text-[7px] leading-tight whitespace-nowrap
                  ${
                    active
                      ? "font-medium text-(--text-primary)"
                      : "text-(--text-muted)"
                  }
                `}
              >
                {step.label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
