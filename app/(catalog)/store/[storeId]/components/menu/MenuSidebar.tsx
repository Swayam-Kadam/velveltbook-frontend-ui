import type { MenuItem, SectionData, SidebarMeta } from "../types";
import { SidebarFooter, SidebarHeader } from "../shared/Badge";
import MenuCard from "./MenuCard";

const VISIBLE_MENU_ITEMS = 3;

interface Props {
  meta: SidebarMeta;
  items: SectionData<MenuItem, SidebarMeta>["items"];
}

export default function MenuSidebar({ meta, items }: Props) {
  const visibleItems = items.slice(0, VISIBLE_MENU_ITEMS);

  return (
    <div className="rounded-[var(--radius-lg)] border border-(--border) bg-(--bg-card) p-4 shadow-[var(--shadow-card)] lg:p-5">
      <SidebarHeader
        title={meta.title}
        actionLabel={meta.actionLabel}
        actionHref={meta.actionHref}
      />

      <div className="space-y-3">
        {visibleItems.map((item) => (
          <MenuCard key={item.id} item={item} />
        ))}
      </div>

      <SidebarFooter label={meta.footerLabel} href={meta.footerHref} />
    </div>
  );
}
