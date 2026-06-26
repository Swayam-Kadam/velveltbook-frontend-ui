import { Award, Check, FileText, Heart, Tag } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import {
  Camera,
  Palette,
  Plane,
  Search,
  Video,
} from "lucide-react";

function SectionCard({
  icon: Icon,
  title,
  action,
  children,
}: {
  icon: LucideIcon;
  title: string;
  action?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <article className="feature-card rounded-xl p-3">
      <div className="mb-2.5 flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <div
            className="
              flex h-7 w-7 items-center justify-center rounded-full
              bg-[color-mix(in_srgb,var(--accent-primary)_10%,transparent)]
            "
          >
            <Icon size={14} strokeWidth={1.6} className="text-(--accent-primary)" />
          </div>
          <h2 className="text-xs font-medium text-(--text-primary)">{title}</h2>
        </div>
        {action}
      </div>
      {children}
    </article>
  );
}

interface DescriptionCardProps {
  description: string;
}

export function DescriptionCard({ description }: DescriptionCardProps) {
  return (
    <SectionCard icon={FileText} title="Description">
      <p className="text-[8px] leading-relaxed text-(--text-secondary)">
        {description}
      </p>
    </SectionCard>
  );
}

interface TagsCardProps {
  tags: string[];
}

export function TagsCard({ tags }: TagsCardProps) {
  return (
    <SectionCard icon={Tag} title="Tags">
      <div className="grid grid-cols-3 gap-1.5">
        {tags.map((tag) => (
          <span
            key={tag}
            className="
              rounded-lg bg-(--bg-card-hover) px-2 py-1.5
              text-center text-[9px] font-semibold text-(--text-primary)
            "
          >
            {tag}
          </span>
        ))}
      </div>
    </SectionCard>
  );
}

interface CertificationCardProps {
  title: string;
  items: string[];
}

export function CertificationCard({ title, items }: CertificationCardProps) {
  return (
    <SectionCard
      icon={Award}
      title="Certification"
      action={
        <div className="flex items-center gap-0.5 text-[8px] text-(--brand-gold)">
          <Check size={10} strokeWidth={2.5} />
          <span>Verified</span>
        </div>
      }
    >
      <div className="flex gap-3">
        <div
          className="
            flex h-16 w-16 shrink-0 items-center justify-center rounded-lg
            bg-[color-mix(in_srgb,var(--brand-gold)_12%,transparent)]
          "
        >
          <Award size={28} className="text-(--brand-gold)" strokeWidth={1.4} />
        </div>

        <div className="min-w-0 flex-1">
          <p className="text-[10px] font-medium text-(--text-primary)">{title}</p>

          <ul className="mt-1.5 space-y-1">
            {items.map((item) => (
              <li
                key={item}
                className="flex items-start gap-1 text-[9px] font-semibold text-(--text-secondary)"
              >
                <Check
                  size={10}
                  className="mt-0.5 shrink-0 text-(--brand-gold)"
                  strokeWidth={2.5}
                />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </SectionCard>
  );
}

const hobbyIconMap: Record<string, LucideIcon> = {
  palette: Palette,
  camera: Camera,
  plane: Plane,
  search: Search,
  video: Video,
};

interface HobbiesCardProps {
  hobbies: { id: string; label: string; icon: string }[];
}

export function HobbiesCard({ hobbies }: HobbiesCardProps) {
  return (
    <SectionCard icon={Heart} title="Hobbies">
      <div className="grid grid-cols-2 gap-1.5">
        {hobbies.map(({ id, label, icon }) => {
          const Icon = hobbyIconMap[icon] ?? Heart;

          return (
            <div
              key={id}
              className="
                flex items-center gap-1.5 rounded-lg bg-(--bg-card-hover)
                px-2 py-1.5
              "
            >
              <Icon size={12} className="shrink-0 text-(--accent-primary)" />
              <span className="text-[9px] font-medium text-(--text-primary)">
                {label}
              </span>
            </div>
          );
        })}
      </div>
    </SectionCard>
  );
}
