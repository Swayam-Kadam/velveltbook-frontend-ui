import { ChevronRight, Scissors, UserRound } from "lucide-react";

const options = [
  {
    id: "service",
    title: "Select Service",
    description: "Browse services and choose what you need",
    icon: Scissors,
    iconBg: "bg-[color-mix(in_srgb,var(--accent-primary)_12%,transparent)]",
    iconColor: "text-(--accent-primary)",
  },
  {
    id: "expert",
    title: "Select Expert",
    description: "Choose your preferred expert",
    icon: UserRound,
    iconBg: "bg-[color-mix(in_srgb,var(--brand-gold)_18%,transparent)]",
    iconColor: "text-(--brand-gold)",
  },
];

export function ChooseOptionSection() {
  return (
    <section>
      <h2 className="mb-3 text-sm font-medium text-(--text-primary)">
        Choose an Option
      </h2>

      <div className="grid grid-cols-2 gap-2">
        {options.map(
          ({ id, title, description, icon: Icon, iconBg, iconColor }) => (
            <button
              key={id}
              type="button"
              className="
                feature-card flex items-center gap-2 rounded-xl p-2.5
                text-left transition-all duration-300
                hover:border-[color-mix(in_srgb,var(--accent-secondary)_25%,var(--border))]
                active:scale-[0.98]
              "
            >
              <div
                className={`
                  flex h-8 w-8 shrink-0 items-center justify-center rounded-full
                  ${iconBg}
                `}
              >
                <Icon size={14} strokeWidth={1.6} className={iconColor} />
              </div>

              <div className="min-w-0 flex-1">
                <p className="text-[9px] font-medium text-(--text-primary)">
                  {title}
                </p>
                <p className="mt-0.5 line-clamp-2 text-[7px] leading-tight text-(--text-muted)">
                  {description}
                </p>
              </div>

              <ChevronRight
                size={12}
                className="shrink-0 text-(--text-muted)"
              />
            </button>
          ),
        )}
      </div>
    </section>
  );
}
