"use client";
import { useState } from "react";
import { useTheme } from "next-themes";
import { Monitor, Moon, Sun, User, Loader2 } from "lucide-react";
import { authClient, authMessage } from "@/lib/auth";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { toast } from "sonner";
export function Account({ settings = false }: { settings?: boolean }) {
  const { data } = authClient.useSession();
  const { theme, setTheme } = useTheme();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  return (
    <div className="max-w-2xl">
      <h1 className="text-3xl font-semibold tracking-tight">
        {settings ? "Settings" : "Your profile"}
      </h1>
      <p className="text-muted-foreground mt-3 mb-8">
        {settings
          ? "Make your workspace feel like yours."
          : "The person behind the links."}
      </p>
      {settings ? (
        <>
          <section className="rounded-xl border bg-card p-6">
            <h2 className="font-semibold">Appearance</h2>
            <p className="text-xs text-muted-foreground mt-2 mb-6">
              Choose a theme, or follow your device.
            </p>
            <div className="grid grid-cols-3 gap-3">
              {[
                { value: "light", Icon: Sun },
                { value: "dark", Icon: Moon },
                { value: "system", Icon: Monitor },
              ].map(({ value, Icon }) => (
                <button
                  key={value}
                  onClick={() => setTheme(value)}
                  aria-pressed={theme === value}
                  className={`border rounded-lg py-5 flex flex-col items-center gap-3 capitalize ${theme === value ? "border-primary bg-primary/5 text-primary" : "hover:bg-muted"}`}
                >
                  <Icon size={20} />
                  {value}
                </button>
              ))}
            </div>
          </section>
          <section className="rounded-xl border bg-card p-6 mt-6">
            <h2 className="font-semibold mb-5">Change password</h2>
            <form
              className="space-y-5"
              onSubmit={async (e) => {
                e.preventDefault();
                const form = e.currentTarget;
                const values = new FormData(form);
                if (values.get("new") !== values.get("confirm")) {
                  setError("Your new passwords don’t match.");
                  return;
                }
                setBusy(true);
                setError("");
                try {
                  const result = await authClient.changePassword({
                    currentPassword: String(values.get("current")),
                    newPassword: String(values.get("new")),
                    revokeOtherSessions: true,
                  });
                  if (result.error) {
                    setError(authMessage(result.error.code));
                    return;
                  }
                  toast.success(
                    "Password changed. Other sessions have been signed out.",
                  );
                  form.reset();
                } catch {
                  setError("Couldn’t change your password. Please try again.");
                } finally {
                  setBusy(false);
                }
              }}
            >
              {[
                {
                  id: "current",
                  label: "Current password",
                  auto: "current-password",
                },
                { id: "new", label: "New password", auto: "new-password" },
                {
                  id: "confirm",
                  label: "Confirm new password",
                  auto: "new-password",
                },
              ].map(({ id, label, auto }) => (
                <div key={id}>
                  <label htmlFor={id} className="label">
                    {label}
                  </label>
                  <Input
                    id={id}
                    name={id}
                    className="field"
                    type="password"
                    autoComplete={auto}
                    required
                    minLength={8}
                    maxLength={128}
                  />
                </div>
              ))}
              <p className="text-xs text-muted-foreground">
                Other sessions will be signed out after your password changes.
              </p>
              {error && (
                <p role="alert" className="text-red-600">
                  {error}
                </p>
              )}
              <Button disabled={busy}>
                {busy && <Loader2 size={15} className="animate-spin" />}
                {busy ? "Updating…" : "Update password"}
              </Button>
            </form>
          </section>
        </>
      ) : (
        <section className="rounded-xl border bg-card p-7">
          <span className="inline-flex p-4 rounded-full bg-muted">
            <User size={28} />
          </span>
          <dl className="mt-7 space-y-6">
            {[
              ["Name", data?.user.name || "Not provided"],
              ["Email", data?.user.email],
              [
                "Email status",
                data?.user.emailVerified ? "Verified" : "Not verified",
              ],
              [
                "Joined",
                data?.user.createdAt
                  ? new Date(data.user.createdAt).toLocaleDateString(
                      undefined,
                      { year: "numeric", month: "long", day: "numeric" },
                    )
                  : "—",
              ],
            ].map(([label, value]) => (
              <div key={label}>
                <dt className="text-xs text-muted-foreground mb-2">{label}</dt>
                <dd className="font-medium break-words">{value}</dd>
              </div>
            ))}
          </dl>
        </section>
      )}
    </div>
  );
}
