// Bonus: skeleton loading placeholder, shown instead of a plain "Loading…" text.
export default function DoctorCardSkeleton() {
  return (
    <div className="flex items-center gap-3 py-3 border-b border-black/10 dark:border-white/10 last:border-0 animate-pulse">
      <div className="w-11 h-11 rounded-xl bg-black/10 dark:bg-white/10 shrink-0" />
      <div className="flex-1 flex flex-col gap-2">
        <div className="h-3 w-28 rounded bg-black/10 dark:bg-white/10" />
        <div className="h-2.5 w-20 rounded bg-black/10 dark:bg-white/10" />
      </div>
    </div>
  );
}
