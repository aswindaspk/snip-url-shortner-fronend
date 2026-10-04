import Link from "next/link";
import { ArrowRight, ChartNoAxesCombined, Link2 } from "lucide-react";
import { Button } from "./ui/button";
export function Unavailable({ analytics = false }: { analytics?: boolean }) {
  const Icon = analytics ? ChartNoAxesCombined : Link2;
  return (
    <>
      <p className="text-xs text-muted-foreground tracking-widest uppercase mb-2">
        Your workspace
      </p>
      <h1 className="text-3xl tracking-tight font-semibold">
        {analytics ? "Analytics" : "My links"}
      </h1>
      <p className="text-muted-foreground mt-3 mb-8">
        {analytics
          ? "A clearer picture of every connection."
          : "A little less clutter. All your links in one place."}
      </p>
      <section className="border rounded-xl bg-card p-10 sm:p-16 text-center">
        <span className="inline-flex rounded-2xl bg-muted p-5 text-primary">
          <Icon size={32} />
        </span>
        <p className="text-[10px] uppercase tracking-widest text-muted-foreground mt-6">
          Not available yet
        </p>
        <h2 className="text-xl font-semibold mt-3">
          {analytics
            ? "Insights need a data connection"
            : "Your link library is on its way"}
        </h2>
        <p className="max-w-md mx-auto text-muted-foreground leading-6 mt-3">
          {analytics
            ? "The current API doesn’t expose analytics data. Click trends, audience insights, and performance reports will be available once the backend supports them."
            : "The current API supports creating links, but doesn’t yet expose saved links or management actions. You can still create, copy, and share new links."}
        </p>
        <Button asChild className="mt-7">
          <Link href="/app#create-link">
            Create a link <ArrowRight size={16} />
          </Link>
        </Button>
      </section>
    </>
  );
}
