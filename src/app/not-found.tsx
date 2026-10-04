import Link from "next/link";
import { Button } from "@/components/ui/button";
export default function NotFound() {
  return (
    <main id="main-content" className="max-w-md mx-auto py-24 px-6 text-center">
      <p className="text-primary font-semibold">404</p>
      <h1 className="text-3xl font-semibold mt-4">A link to nowhere.</h1>
      <p className="text-muted-foreground my-6">
        This page doesn’t exist. Let’s get you back on track.
      </p>
      <Button asChild>
        <Link href="/">Back to Snip</Link>
      </Button>
    </main>
  );
}
