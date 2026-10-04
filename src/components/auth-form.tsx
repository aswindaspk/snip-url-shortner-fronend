"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { ArrowRight, Loader2 } from "lucide-react";
import {
  authClient,
  authMessage,
  intendedDestination,
  signInWithGoogle,
} from "@/lib/auth";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
export function AuthForm({ signup = false }: { signup?: boolean }) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  useEffect(() => {
    if (new URLSearchParams(window.location.search).get("error") === "oauth") {
      setError(
        "Google sign-in couldn’t be completed. Try again or sign in with email.",
      );
    }
  }, []);
  return (
    <form
      className="space-y-5"
      onSubmit={async (e) => {
        e.preventDefault();
        const data = new FormData(e.currentTarget);
        const email = String(data.get("email"));
        const password = String(data.get("password"));
        if (signup && password !== data.get("confirm")) {
          setError("Your passwords don’t match.");
          return;
        }
        setBusy(true);
        setError("");
        try {
          const result = signup
            ? await authClient.signUp.email({
                email,
                password,
                name: String(data.get("name")),
              })
            : await authClient.signIn.email({ email, password });
          if (result.error) {
            setError(authMessage(result.error.code));
            return;
          }
          router.replace(intendedDestination());
          router.refresh();
        } catch {
          setError(
            "Couldn’t connect to the authentication service. Please try again.",
          );
        } finally {
          setBusy(false);
        }
      }}
    >
      {signup && (
        <div>
          <label htmlFor="name" className="label">
            Name
          </label>
          <Input
            className="field"
            id="name"
            name="name"
            autoComplete="name"
            required
            maxLength={100}
          />
        </div>
      )}
      <div>
        <label htmlFor="email" className="label">
          Email address
        </label>
        <Input
          className="field"
          id="email"
          name="email"
          type="email"
          autoComplete="email"
          placeholder="you@example.com"
          required
        />
      </div>
      <div>
        <label htmlFor="password" className="label">
          Password
        </label>
        <Input
          className="field"
          id="password"
          name="password"
          type="password"
          minLength={8}
          maxLength={128}
          autoComplete={signup ? "new-password" : "current-password"}
          required
        />
        {signup && (
          <p className="text-xs text-muted-foreground mt-2">
            Use at least 8 characters.
          </p>
        )}
      </div>
      {signup && (
        <div>
          <label htmlFor="confirm" className="label">
            Confirm password
          </label>
          <Input
            className="field"
            id="confirm"
            name="confirm"
            type="password"
            autoComplete="new-password"
            required
          />
        </div>
      )}
      {error && (
        <p
          role="alert"
          className="rounded-lg bg-red-500/10 p-3 text-sm text-red-700 dark:text-red-300"
        >
          {error}
        </p>
      )}
      <Button className="w-full" disabled={busy}>
        {busy ? <Loader2 className="animate-spin" size={16} /> : null}
        {busy ? "Please wait…" : signup ? "Create account" : "Sign in"}
        <ArrowRight size={16} />
      </Button>
      <Button
        type="button"
        variant="outline"
        className="w-full"
        disabled={busy}
        onClick={async () => {
          setBusy(true);
          setError("");
          try {
            const result = await signInWithGoogle();
            if (result.error) {
              setError(
                "Google sign-in is unavailable. Try again or sign in with email.",
              );
            }
          } catch {
            setError("Couldn’t connect to Google sign-in. Please try again.");
          } finally {
            setBusy(false);
          }
        }}
      >
        Continue with Google
      </Button>
      <p className="text-center text-sm text-muted-foreground">
        {signup ? "Already have an account?" : "New to Snip?"}{" "}
        <Link
          className="text-primary font-medium"
          href={signup ? "/login" : "/signup"}
        >
          {signup ? "Sign in" : "Create an account"}
        </Link>
      </p>
    </form>
  );
}
