const serviceSteps = [
  { num: 1, label: "Service" },
  { num: 2, label: "Staff" },
  { num: 3, label: "Date & Time" },
  { num: 4, label: "Payment" },
];

const productSteps = [
  { num: 1, label: "Preview" },
  { num: 2, label: "Address" },
  { num: 3, label: "Payment" },
];

const productStepsDesktop = [
  { num: 1, label: "Preview" },
  { num: 2, label: "Payment" },
];

interface BookingProgressProps {
  currentStep: number;
  productDesktopStep?: number;
  mode?: "service" | "product";
}

function ProgressTrack({
  steps,
  currentStep,
}: {
  steps: { num: number; label: string }[];
  currentStep: number;
}) {
  const progressRatio =
    steps.length > 1 ? (currentStep - 1) / (steps.length - 1) : 0;

  return (
    <>
      <div
        className="absolute inset-x-3 top-3 h-px bg-(--border) lg:inset-x-12 lg:top-4 lg:h-[2px]"
        aria-hidden
      />
      <div
        className="
          absolute left-3 top-3 h-px bg-(--accent-primary)
          transition-all duration-300
          lg:left-12 lg:top-4 lg:h-[2px]
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
              className="flex w-6 flex-col items-center lg:w-auto lg:min-w-[88px]"
            >
              <div
                className={`
                  relative z-10 flex h-6 w-6 shrink-0 items-center justify-center
                  rounded-full text-[9px] font-semibold
                  lg:h-9 lg:w-9 lg:text-[13px]
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
                  lg:mt-2 lg:text-[12px]
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
    </>
  );
}

export function BookingProgress({
  currentStep,
  productDesktopStep = 1,
  mode = "service",
}: BookingProgressProps) {
  if (mode === "product") {
    return (
      <div className="relative mt-4 lg:mt-6 lg:px-8">
        <div className="lg:hidden">
          <ProgressTrack steps={productSteps} currentStep={currentStep} />
        </div>
        <div className="hidden lg:block">
          <ProgressTrack
            steps={productStepsDesktop}
            currentStep={productDesktopStep}
          />
        </div>
      </div>
    );
  }

  const progressRatio =
    serviceSteps.length > 1
      ? (currentStep - 1) / (serviceSteps.length - 1)
      : 0;

  return (
    <div className="relative mt-4 lg:mt-6 lg:px-8">
      <div
        className="absolute inset-x-3 top-3 h-px bg-(--border) lg:inset-x-12 lg:top-4 lg:h-[2px]"
        aria-hidden
      />
      <div
        className="
          absolute left-3 top-3 h-px bg-(--accent-primary)
          transition-all duration-300
          lg:left-12 lg:top-4 lg:h-[2px]
        "
        style={{
          width: `calc((100% - 1.5rem) * ${progressRatio})`,
        }}
        aria-hidden
      />

      <div className="relative flex justify-between">
        {serviceSteps.map((step) => {
          const active = currentStep === step.num;
          const completed = currentStep > step.num;

          return (
            <div
              key={step.num}
              className="flex w-6 flex-col items-center lg:w-auto lg:min-w-[88px]"
            >
              <div
                className={`
                  relative z-10 flex h-6 w-6 shrink-0 items-center justify-center
                  rounded-full text-[9px] font-semibold
                  lg:h-9 lg:w-9 lg:text-[13px]
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
                  lg:mt-2 lg:text-[12px]
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
