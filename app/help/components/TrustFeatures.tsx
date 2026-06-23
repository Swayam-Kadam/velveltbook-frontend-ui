import { Clock3, ShieldCheck, Sparkles } from "lucide-react";

const features = [
  {
    icon: ShieldCheck,
    title: "Verified Experts",
    subtitle: "Background checked",
  },
  {
    icon: Clock3,
    title: "On-time Service",
    subtitle: "Punctual & reliable",
  },
  {
    icon: Sparkles,
    title: "Hygiene Assured",
    subtitle: "Safe & sanitized tools",
  },
];

export function TrustFeatures() {
  return (
    <section className="grid grid-cols-3 gap-2">
      {features.map(({ icon: Icon, title, subtitle }) => (
        <div key={title} className="text-center">
          <Icon
            size={16}
            strokeWidth={1.4}
            className="mx-auto text-(--accent-primary)"
          />
          <p className="mt-1 text-[7px] font-medium text-(--text-primary)">
            {title}
          </p>
          <p className="mt-0.5 text-[6px] leading-tight text-(--text-muted)">
            {subtitle}
          </p>
        </div>
      ))}
    </section>
  );
}
