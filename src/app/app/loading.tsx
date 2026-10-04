import { Skeleton } from "@/components/ui/skeleton";
export default function Loading() {
  return (
    <div role="status" aria-label="Loading workspace" className="space-y-6">
      <Skeleton className="h-9 w-56" />
      <Skeleton className="h-24 w-full" />
      <Skeleton className="h-52 w-full" />
      <div className="grid grid-cols-2 gap-4">
        <Skeleton className="h-32" />
        <Skeleton className="h-32" />
      </div>
      <span className="sr-only">Loading workspace…</span>
    </div>
  );
}
