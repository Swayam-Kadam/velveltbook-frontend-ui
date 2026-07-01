interface EmptyStateProps {
  title: string;
  description: string;
}

export default function EmptyState({ title, description }: EmptyStateProps) {
  return (
    <div className="rounded-[var(--radius-md)] border border-(--border) bg-(--bg-card) p-10 text-center shadow-[var(--shadow-card)]">
      <h3 className="text-xl font-semibold text-(--text-primary)">{title}</h3>
      <p className="mt-2 text-(--text-secondary)">{description}</p>
    </div>
  );
}
