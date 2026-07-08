export default function Loading() {
  return (
    <div className="min-h-screen bg-(--bg-primary) pb-24 lg:pb-8">
      <div className="mx-auto max-w-[1600px] animate-pulse px-4 py-5 lg:px-8 lg:py-6">
        <div className="grid grid-cols-1 gap-5 xl:grid-cols-[280px_minmax(0,1fr)_300px] xl:gap-6">
          <div className="hidden h-[480px] rounded-[var(--radius-lg)] border border-(--border) bg-(--bg-card) xl:block" />

          <div className="space-y-6">
            <div className="h-[320px] rounded-[var(--radius-lg)] border border-(--border) bg-(--bg-card) sm:h-[380px] lg:h-[420px]" />
            <div className="h-48 rounded-[var(--radius-md)] border border-(--border) bg-(--bg-card)" />
            <div className="h-56 rounded-[var(--radius-md)] border border-(--border) bg-(--bg-card)" />
            <div className="h-40 rounded-[var(--radius-md)] border border-(--border) bg-(--bg-card)" />
            <div className="h-52 rounded-[var(--radius-md)] border border-(--border) bg-(--bg-card)" />
          </div>

          <div className="hidden h-[480px] rounded-[var(--radius-lg)] border border-(--border) bg-(--bg-card) xl:block" />
        </div>
      </div>
    </div>
  );
}
