import { Settings2 } from "lucide-react";

import type { SectionData, Suggestion, SuggestionsSectionMeta } from "../types";
import { SidebarFooter } from "../shared/Badge";
import SuggestionCard from "./SuggestionCard";

interface Props {
  meta: SuggestionsSectionMeta;
  items: SectionData<Suggestion, SuggestionsSectionMeta>["items"];
}

export default function SuggestionsSidebar({ meta, items }: Props) {
  return (
    <aside className="order-2 xl:order-none">
      <div className="xl:sticky xl:top-24">
        <div className="rounded-[var(--radius-lg)] border border-(--border) bg-(--bg-card) p-4 shadow-[var(--shadow-card)] lg:p-5">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-base font-semibold text-(--text-primary) lg:text-lg">
              {meta.title}
            </h2>
            <button
              type="button"
              aria-label="Filter suggestions"
              className="flex h-8 w-8 items-center justify-center rounded-lg border border-(--border) text-(--text-muted) transition-colors hover:text-(--text-primary)"
            >
              <Settings2 size={16} />
            </button>
          </div>

          <div className="space-y-3">
            {items.map((item) => (
              <SuggestionCard
                key={item.id}
                suggestion={item}
                bookNowLabel={meta.bookNowLabel}
              />
            ))}
          </div>

          <SidebarFooter label={meta.footerLabel} href={meta.footerHref} />
        </div>
      </div>
    </aside>
  );
}
