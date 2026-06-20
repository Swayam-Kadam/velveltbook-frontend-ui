import { Droplets, ShieldCheck, Sparkles, UserCheck } from "lucide-react";

const items = [
  { icon: UserCheck, label: "Certified & Experienced Therapists" },
  { icon: ShieldCheck, label: "Clean & Hygienic Environment" },
  { icon: Droplets, label: "Premium Quality Oils & Products" },
  { icon: Sparkles, label: "Customer Satisfaction Guarantee" },
];

export function WhyChooseUs() {
  return (
    <section className="mt-4">
      <h2 className="mb-3 text-center text-xs font-medium text-[var(--text-primary)]">
        Why Choose Us?
      </h2>

      <div className="grid grid-cols-4 gap-1">
        {items.map(({ icon: Icon, label }, index) => (
          <div
            key={label}
            className={`
              flex flex-col items-center px-1 text-center
              ${index < items.length - 1 ? "border-r border-[var(--border)]" : ""}
            `}
          >
            <Icon
              size={16}
              strokeWidth={1.4}
              className="text-[var(--accent-primary)]"
            />
            <p className="mt-1 text-[6px] leading-tight text-[var(--text-secondary)]">
              {label}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
