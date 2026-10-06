"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Trash2 } from "lucide-react";
import { toast } from "sonner";
import {
  ApiError,
  deleteUrl,
  shortCodeInput,
  updateUrl,
  updateUrlInput,
} from "@/lib/api";
import { authClient } from "@/lib/auth";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { UrlForm } from "./url-form";

export function LinkManagement({ initialCode }: { initialCode: string }) {
  const router = useRouter();
  const [code, setCode] = useState(initialCode);
  const [destination, setDestination] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [fields, setFields] = useState<Record<string, string>>({});
  const [cooldown, setCooldown] = useState(0);
  const dialog = useRef<HTMLDialogElement>(null);
  useEffect(() => {
    if (!cooldown) return;
    const timer = setTimeout(() => setCooldown(cooldown - 1), 1000);
    return () => clearTimeout(timer);
  }, [cooldown]);

  async function perform(action: "update" | "delete") {
    if (busy || cooldown) return;
    setBusy(true);
    setError("");
    try {
      if (action === "delete") await deleteUrl(code);
      else
        await updateUrl({
          shortUrl: code.trim(),
          newLongUrl: destination.trim(),
        });
      dialog.current?.close();
      setDestination("");
      if (action === "delete") {
        setCode("");
        router.replace("/app/urls");
      }
      toast.success(
        action === "delete" ? "Link deleted" : "Destination updated",
      );
    } catch (e) {
      const message =
        e instanceof ApiError
          ? e.message
          : "Couldn’t complete the request. Please try again.";
      setError(message);
      if (e instanceof ApiError && e.status === 429)
        setCooldown(e.retryAfter || 30);
      if (e instanceof ApiError && e.status === 401) {
        dialog.current?.close();
        await authClient.getSession({ fetchOptions: { cache: "no-store" } });
        router.replace("/login?next=%2Fapp%2Furls");
      }
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-semibold tracking-tight">My links</h1>
        <p className="mt-3 text-muted-foreground">
          Create a link, update its destination, or remove a link you own.
        </p>
      </div>
      <section className="rounded-xl border bg-card p-6 max-w-2xl">
        <h2 className="text-xl font-semibold">Manage a link</h2>
        <p className="mt-2 mb-6 text-sm text-muted-foreground">
          Enter the code at the end of your short link. Saved-link browsing
          isn’t available yet.
        </p>
        <form
          className="space-y-5"
          onSubmit={(e) => {
            e.preventDefault();
            const parsed = updateUrlInput.safeParse({
              shortUrl: code.trim(),
              newLongUrl: destination.trim(),
            });
            if (!parsed.success) {
              setFields(
                Object.fromEntries(
                  parsed.error.issues.map((i) => [
                    String(i.path[0]),
                    i.message,
                  ]),
                ),
              );
              return;
            }
            setFields({});
            void perform("update");
          }}
        >
          <div>
            <label className="label" htmlFor="manage-code">
              Short code
            </label>
            <Input
              id="manage-code"
              value={code}
              onChange={(e) => {
                setCode(e.target.value);
                setError("");
              }}
              disabled={busy}
              placeholder="my-link"
              required
              aria-invalid={!!fields.shortUrl}
              aria-describedby={fields.shortUrl ? "code-error" : undefined}
            />
            {fields.shortUrl && (
              <p id="code-error" className="mt-2 text-sm text-red-600">
                {fields.shortUrl}
              </p>
            )}
          </div>
          <div>
            <label className="label" htmlFor="manage-destination">
              New destination URL
            </label>
            <Input
              id="manage-destination"
              type="url"
              value={destination}
              onChange={(e) => setDestination(e.target.value)}
              disabled={busy}
              placeholder="https://example.com/new-page"
              required
              aria-invalid={!!fields.newLongUrl}
              aria-describedby={
                fields.newLongUrl ? "destination-error" : undefined
              }
            />
            {fields.newLongUrl && (
              <p id="destination-error" className="mt-2 text-sm text-red-600">
                {fields.newLongUrl}
              </p>
            )}
          </div>
          <p className="text-xs text-muted-foreground">
            Updating the destination keeps the same short link. You can only
            manage links owned by your account.
          </p>
          {error && (
            <p role="alert" className="text-sm text-red-700 dark:text-red-300">
              {error}
            </p>
          )}
          <div className="flex flex-wrap gap-3">
            <Button disabled={busy || cooldown > 0}>
              {busy && <Loader2 size={16} className="animate-spin" />}
              {cooldown
                ? `Retry in ${cooldown}s`
                : busy
                  ? "Saving…"
                  : "Update destination"}
            </Button>
            <Button
              type="button"
              variant="outline"
              disabled={busy || cooldown > 0}
              onClick={() => {
                const parsed = shortCodeInput.safeParse(code);
                if (!parsed.success) {
                  setFields({ shortUrl: parsed.error.issues[0].message });
                  return;
                }
                setFields({});
                setError("");
                dialog.current?.showModal();
              }}
            >
              <Trash2 size={16} />
              Delete link
            </Button>
          </div>
        </form>
      </section>
      <dialog
        ref={dialog}
        aria-labelledby="delete-title"
        aria-describedby="delete-description"
        onCancel={(e) => {
          if (busy) e.preventDefault();
        }}
        className="m-auto w-[calc(100%-2rem)] max-w-md rounded-xl border bg-card p-6 text-foreground shadow-xl backdrop:bg-black/50"
      >
        <h2 id="delete-title" className="text-xl font-semibold">
          Delete this link?
        </h2>
        <p
          id="delete-description"
          className="my-4 text-sm text-muted-foreground break-all"
        >
          The link ending in “{code}” will stop working. This cannot be undone.
        </p>
        {error && (
          <p
            role="alert"
            className="mb-4 text-sm text-red-700 dark:text-red-300"
          >
            {error}
          </p>
        )}
        <div className="flex flex-wrap justify-end gap-3">
          <Button
            type="button"
            variant="outline"
            disabled={busy}
            onClick={() => dialog.current?.close()}
            autoFocus
          >
            Cancel
          </Button>
          <Button
            type="button"
            disabled={busy || cooldown > 0}
            onClick={() => void perform("delete")}
          >
            {busy
              ? "Deleting…"
              : cooldown
                ? `Retry in ${cooldown}s`
                : "Delete permanently"}
          </Button>
        </div>
      </dialog>
      <UrlForm />
    </div>
  );
}
