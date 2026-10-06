/** Browser requests use the Next.js rewrite to preserve same-origin cookies. */
export const apiConfig = {
  urls: "/api/v1/urls",
  auth: "/api/auth",
  shortUrlBase:
    process.env.NEXT_PUBLIC_SHORT_URL_BASE || "http://localhost:3000",
} as const;

function segment(value: string | number): string {
  const text = String(value);
  if (!text.trim() || text === "." || text === "..") {
    throw new Error("A valid user or URL identifier is required.");
  }
  return encodeURIComponent(text);
}

// Verified against the backend router: ownership comes from the Better Auth session.
export const urlEndpoints = {
  create: apiConfig.urls,
  item: (shortCode: string) => `${apiConfig.urls}/${segment(shortCode)}`,
};
