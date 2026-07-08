import Image from "next/image";
import { Sparkles } from "lucide-react";
import type { DealType } from "../deals.types";

interface DealsHeroProps {
  dealType: DealType;
}

const heroContent = {
  single: {
    title: "Deals",
    subtitle: "Amazing offers on top services at unbeatable prices.",
  },
  package: {
    title: "Packages",
    subtitle: "Curated combos for complete care.",
  },
};

export function DealsHero({ dealType }: DealsHeroProps) {
  const { title, subtitle } = heroContent[dealType];

  return (
    <section className="relative px-1 pt-1">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <h1 className="text-[28px] font-semibold leading-tight text-(--text-primary) lg:text-[36px]">
            {title}
          </h1>
          <p className="mt-1 text-[11px] leading-relaxed text-(--text-secondary) lg:text-[13px]">
            {subtitle}
          </p>
        </div>

        <div className="relative shrink-0 pt-1">
          <div className="absolute -right-1 -top-1 h-2 w-2 rounded-full bg-(--brand-gold) opacity-60" />
          <div className="absolute right-3 top-0 h-1.5 w-1.5 rounded-full bg-(--brand-gold-light) opacity-80" />
          <div className="absolute -left-1 top-3 h-1 w-1 rounded-full bg-(--brand-gold) opacity-50" />

          <div
            className="
              relative flex h-[52px] w-[72px] items-center justify-center
              rounded-sm
              bg-(--accent-primary)
              shadow-(--shadow-glow)
              lg:h-[60px] lg:w-[84px]
            "
            style={{
              clipPath: "polygon(0 0, 100% 0, 100% 85%, 50% 100%, 0 85%)",
            }}
          >
            <div className="absolute inset-0 rounded-sm border border-(--brand-gold)/40" />
            <div className="px-1.5 text-center">
              <Sparkles
                size={10}
                className="mx-auto mb-0.5 text-(--brand-gold)"
                strokeWidth={1.5}
              />
              <p className="text-[6px] font-medium leading-tight text-(--brand-gold) lg:text-[7px]">
                Best Offers
              </p>
              <p className="text-[5.5px] leading-tight text-(--brand-gold-light) lg:text-[6.5px]">
                Just for You
              </p>
            </div>
          </div>

          <Image
            src="/vb-logo.png"
            alt=""
            width={20}
            height={20}
            className="absolute -bottom-1 -right-2 hidden h-4 w-4 opacity-0"
            aria-hidden
          />
        </div>
      </div>
    </section>
  );
}
