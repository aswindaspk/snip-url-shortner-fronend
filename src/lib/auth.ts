"use client";
import { createAuthClient } from "better-auth/react";
import { apiConfig } from "./api-config";
export const authClient = createAuthClient({
  basePath: apiConfig.auth,
  sessionOptions: { refetchInterval: 60, refetchOnWindowFocus: true },
});
export function authMessage(code?: string) {
  if (code === "INVALID_ORIGIN")
    return "Sign-in is unavailable because this site's address is not allowed by the authentication service. Please contact the site administrator.";
  if (
    code === "USER_ALREADY_EXISTS" ||
    code === "USER_ALREADY_EXISTS_USE_ANOTHER_EMAIL"
  )
    return "An account already exists with this email. Try signing in.";
  if (code === "INVALID_EMAIL_OR_PASSWORD")
    return "The email or password is incorrect.";
  return "We couldn’t complete that request. Check your details and try again.";
}

export function intendedDestination(): string {
  const next = new URLSearchParams(window.location.search).get("next");
  return next && /^\/app(?:\/|\?|$)/.test(next) && !next.includes("\\")
    ? next
    : "/app";
}

export function signInWithGoogle() {
  return authClient.signIn.social({
    provider: "google",
    callbackURL: new URL(intendedDestination(), window.location.origin).href,
    errorCallbackURL: new URL("/login?error=oauth", window.location.origin)
      .href,
  });
}
