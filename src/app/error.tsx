"use client";
import { Button } from "@/components/ui/button";
export default function ErrorPage({ reset }: { reset: () => void }) {
  return (
    <main id="main-content" className="p-12 text-center">
      <h1 className="text-2xl font-semibold">Something didn’t load.</h1>
      <p className="my-5 text-muted-foreground">
        Please try again in a moment.
      </p>
      <Button onClick={reset}>Try again</Button>
    </main>
  );
}
