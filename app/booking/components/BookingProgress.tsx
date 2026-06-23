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
  return (
    <div className="mt-4 px-1">
      <div className="flex items-start justify-between">
        {steps.map((step, index) => {
          const active = currentStep === step.num;
          const completed = currentStep > step.num;

          return (
            <div key={step.num} className="flex flex-1 flex-col items-center">
              <div className="flex w-full items-center">
                {index > 0 && (
                  <div
                    className={`h-px flex-1 ${completed || active ? "bg-(--accent-primary)" : "bg-(--border)"}`}
                  />
                )}

                <div
                  className={`
                    flex h-6 w-6 shrink-0 items-center justify-center rounded-full
                    text-[9px] font-semibold
                    ${
                      active || completed
                        ? "primary-button text-white shadow-none"
                        : "border border-(--border) bg-(--bg-card) text-(--text-muted)"
                    }
                  `}
                >
                  {step.num}
                </div>

                {index < steps.length - 1 && (
                  <div
                    className={`h-px flex-1 ${completed ? "bg-(--accent-primary)" : "bg-(--border)"}`}
                  />
                )}
              </div>

              <span
                className={`mt-1 text-center text-[7px] leading-tight ${
                  active
                    ? "font-medium text-(--text-primary)"
                    : "text-(--text-muted)"
                }`}
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
