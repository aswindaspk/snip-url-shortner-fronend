"use client";
import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import { useQueryClient } from "@tanstack/react-query";
import { Loader2, LogOut } from "lucide-react";
import { toast } from "sonner";
import { authClient } from "@/lib/auth";
import { Sidebar } from "./navigation";
import { Button } from "./ui/button";
import { useState } from "react";
export function Workspace({ children }: { children: React.ReactNode }) {
  const { data: session, isPending, error, refetch } = authClient.useSession();
  const router = useRouter();
  const path = usePathname();
  const cache = useQueryClient();
  const [busy, setBusy] = useState(false);
  useEffect(() => {
    if (!isPending && !session && !error) {
      cache.clear();
      router.replace(`/login?next=${encodeURIComponent(path)}`);
    }
  }, [session, isPending, error, path, router, cache]);
  if (isPending)
    return (
      <div
        className="min-h-screen flex items-center justify-center gap-3 text-muted-foreground"
        role="status"
      >
        <Loader2 className="animate-spin" size={18} />
        Checking your session…
      </div>
    );
  if (error)
    return (
      <div className="max-w-md mx-auto my-24 rounded-xl border bg-card p-8">
        <h1 className="text-xl font-semibold">
          We couldn’t check your session
        </h1>
        <p className="my-4 text-muted-foreground">
          Check your connection and try again.
        </p>
        <Button onClick={() => refetch()}>Retry</Button>
        <Button variant="ghost" asChild>
          <Link href="/">Back home</Link>
        </Button>
      </div>
    );
  if (!session) return null;
  return (
    <>
      <Sidebar />
      <div className="md:ml-[232px]">
        <header className="h-[77px] border-b bg-card px-6 lg:px-10 flex items-center justify-between">
          <p className="text-xs text-muted-foreground">
            Workspace <span className="mx-3 opacity-50">/</span>
            <span className="text-foreground capitalize">
              {path.split("/")[2] || "Overview"}
            </span>
          </p>
          <div className="flex gap-4 items-center">
            <span
              className="rounded-full w-8 h-8 flex items-center justify-center bg-[#ece7dc] text-[#75674d] text-xs font-semibold"
              title={session.user.name || session.user.email}
            >
              {(session.user.name || session.user.email)
                .slice(0, 2)
                .toUpperCase()}
            </span>
            <Button
              variant="ghost"
              size="icon"
              aria-label="Sign out"
              disabled={busy}
              onClick={async () => {
                setBusy(true);
                try {
                  const result = await authClient.signOut();
                  if (result.error) {
                    toast.error("Couldn’t sign out. Please try again.");
                    return;
                  }
                  cache.clear();
                  router.replace("/login");
                } catch {
                  toast.error("Couldn’t sign out. Please try again.");
                } finally {
                  setBusy(false);
                }
              }}
            >
              {busy ? (
                <Loader2 size={16} className="animate-spin" />
              ) : (
                <LogOut size={16} />
              )}
            </Button>
          </div>
        </header>
        <main id="main-content" className="max-w-[1320px] mx-auto p-6 lg:p-10">
          {children}
        </main>
        <footer className="px-6 lg:px-10 py-6 text-[11px] text-muted-foreground flex justify-between border-t">
          <span>Small links. Big possibilities.</span>
        </footer>
      </div>
    </>
  );
}
