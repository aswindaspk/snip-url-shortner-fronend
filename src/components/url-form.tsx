"use client";
import { useMutation } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import Link from "next/link";
import {
  ArrowRight,
  Check,
  Copy,
  Download,
  ExternalLink,
  Link2,
  Loader2,
  QrCode,
  Share2,
  SlidersHorizontal,
  X,
} from "lucide-react";
import { toast } from "sonner";
import { ApiError, createUrl, urlInput } from "@/lib/api";
import { apiConfig } from "@/lib/api-config";
import { safeUrl } from "@/lib/utils";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
export function UrlForm() {
  const [advanced, setAdvanced] = useState(false);
  const [longUrl, setLongUrl] = useState("");
  const [alias, setAlias] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [qr, setQr] = useState(false);
  const [cooldown, setCooldown] = useState(0);
  const mutation = useMutation({
    mutationFn: createUrl,
    onSuccess: () => toast.success("Your short link is ready"),
    onError: (e) => {
      if (e instanceof ApiError && e.status === 429)
        setCooldown(e.retryAfter || 30);
    },
  });
  useEffect(() => {
    if (!cooldown) return;
    const timer = setTimeout(() => setCooldown(cooldown - 1), 1000);
    return () => clearTimeout(timer);
  }, [cooldown]);
  const shortUrl = mutation.data
    ? safeUrl(
        `${apiConfig.shortUrlBase}/${encodeURIComponent(mutation.data.shortCode)}`,
      )
    : null;
  async function copy() {
    if (!shortUrl) return;
    try {
      await navigator.clipboard.writeText(shortUrl);
      toast.success("Link copied to clipboard");
    } catch {
      toast.error("Couldn’t copy. Select the link and copy it manually.");
    }
  }
  return (
    <section
      id="create-link"
      className="rounded-xl border bg-card shadow-[0_3px_15px_#00000003]"
    >
      <div className="border-b px-6 py-5 flex items-center gap-3">
        <span className="text-primary bg-primary/10 rounded-lg p-2">
          <Link2 size={19} />
        </span>
        <div>
          <h2 className="font-semibold text-base">
            Make room for a shorter link
          </h2>
          <p className="text-xs text-muted-foreground mt-1">
            Long URL in. A world of possibilities out.
          </p>
        </div>
      </div>
      <form
        className="p-6"
        onSubmit={(e) => {
          e.preventDefault();
          const parsed = urlInput.safeParse({
            longUrl: longUrl.trim(),
            alias: alias.trim() || undefined,
          });
          if (!parsed.success) {
            setErrors(
              Object.fromEntries(
                parsed.error.issues.map((i) => [String(i.path[0]), i.message]),
              ),
            );
            return;
          }
          setErrors({});
          setQr(false);
          mutation.mutate(parsed.data);
        }}
      >
        <label htmlFor="long-url" className="label">
          Destination URL
        </label>
        <div className="flex gap-3 max-sm:flex-col">
          <div className="relative flex-1">
            <Link2
              className="absolute left-4 top-3.5 text-muted-foreground"
              size={18}
            />
            <Input
              id="long-url"
              type="url"
              required
              placeholder="https://your-very-long-link.com/something-great"
              className="field pl-11 h-12"
              value={longUrl}
              onChange={(e) => setLongUrl(e.target.value)}
              aria-invalid={!!errors.longUrl}
              aria-describedby={errors.longUrl ? "url-error" : undefined}
            />
          </div>
          <Button
            className="h-12 px-6"
            disabled={mutation.isPending || cooldown > 0}
          >
            {mutation.isPending ? (
              <Loader2 className="animate-spin" size={17} />
            ) : null}
            {mutation.isPending
              ? "Shortening…"
              : cooldown
                ? `Retry in ${cooldown}s`
                : "Shorten link"}
            {!mutation.isPending && <ArrowRight size={17} />}
          </Button>
        </div>
        {errors.longUrl && (
          <p id="url-error" className="text-red-600 text-xs mt-2">
            {errors.longUrl}
          </p>
        )}
        <button
          type="button"
          className="flex items-center gap-2 mt-5 text-xs text-muted-foreground hover:text-foreground"
          onClick={() => setAdvanced(!advanced)}
          aria-expanded={advanced}
        >
          <SlidersHorizontal size={14} />
          Customize your link{" "}
          <span className="text-lg leading-none ml-1">
            {advanced ? "−" : "+"}
          </span>
        </button>
        {advanced && (
          <div className="mt-5 max-w-md">
            <label htmlFor="alias" className="label">
              Custom alias{" "}
              <span className="text-muted-foreground font-normal">
                (optional)
              </span>
            </label>
            <Input
              id="alias"
              className="field"
              value={alias}
              maxLength={10}
              placeholder="my-link"
              onChange={(e) => setAlias(e.target.value)}
              aria-describedby="alias-help"
            />
            <p id="alias-help" className="mt-2 text-xs text-muted-foreground">
              Up to 10 letters, numbers, hyphens, or underscores.
            </p>
            {errors.alias && (
              <p className="text-red-600 text-xs mt-2">{errors.alias}</p>
            )}
          </div>
        )}
        {mutation.error && (
          <div
            role="alert"
            className="mt-4 rounded-lg bg-red-500/10 p-4 text-sm text-red-700 dark:text-red-300"
          >
            {mutation.error.message}
            {mutation.error instanceof ApiError &&
              mutation.error.status === 401 && (
                <Link href="/login" className="underline ml-2">
                  Sign in
                </Link>
              )}
          </div>
        )}
      </form>
      {shortUrl && mutation.data && (
        <div
          className="border-t p-6 bg-green-500/5 rounded-b-xl"
          aria-live="polite"
        >
          <div className="flex flex-wrap gap-3 justify-between items-center">
            <div>
              <p className="text-xs text-green-700 dark:text-green-400 flex gap-1 items-center mb-2">
                <Check size={14} />
                Your link is ready to go
              </p>
              <a
                href={shortUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="font-semibold break-all"
              >
                {shortUrl}
              </a>
            </div>
            <div className="flex flex-wrap gap-2">
              <Button variant="outline" size="sm" type="button" onClick={copy}>
                <Copy size={14} />
                Copy
              </Button>
              <Button variant="outline" size="sm" asChild>
                <a href={shortUrl} target="_blank" rel="noopener noreferrer">
                  <ExternalLink size={14} />
                  Open
                </a>
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setQr(!qr)}
                aria-expanded={qr}
              >
                <QrCode size={14} />
                QR
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={async () => {
                  try {
                    if (navigator.share)
                      await navigator.share({ url: shortUrl });
                    else await copy();
                  } catch (e) {
                    if (!(e instanceof DOMException && e.name === "AbortError"))
                      toast.error("Unable to share this link.");
                  }
                }}
              >
                <Share2 size={14} />
                Share
              </Button>
            </div>
          </div>
          {qr &&
            /^data:image\/png;base64,[A-Za-z0-9+/=]+$/.test(
              mutation.data.qrCode,
            ) && (
              <div className="mt-5 flex items-center gap-5">
                <img
                  src={mutation.data.qrCode}
                  alt={`QR code for ${shortUrl}`}
                  width={140}
                  height={140}
                  className="rounded-lg"
                />
                <Button variant="outline" asChild>
                  <a
                    href={mutation.data.qrCode}
                    download={`snip-${mutation.data.shortCode}.png`}
                  >
                    <Download size={15} />
                    Download QR
                  </a>
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  aria-label="Close QR code"
                  onClick={() => setQr(false)}
                >
                  <X size={16} />
                </Button>
              </div>
            )}
        </div>
      )}
      <div className="flex gap-2 items-center px-6 py-3 border-t text-[11px] text-muted-foreground">
        <span className="h-1.5 w-1.5 rounded-full bg-[#8b9e78]" /> Simple to
        create. Easy to share. Built for your next big thing.
      </div>
    </section>
  );
}
