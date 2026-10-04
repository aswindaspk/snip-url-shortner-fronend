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

// Section 66's :/userId:/urlId notation represents /:userId/:urlId.
export const urlEndpoints = {
  create: apiConfig.urls,
  list: (userId: string) => `${apiConfig.urls}/${segment(userId)}`,
  details: (userId: string, urlId: string | number) =>
    `${apiConfig.urls}/${segment(userId)}/${segment(urlId)}`,
  qr: (userId: string, urlId: string | number) =>
    `${urlEndpoints.details(userId, urlId)}/generateQr`,
  delete: (userId: string, urlId: string | number) =>
    `${urlEndpoints.details(userId, urlId)}/delete`,
  update: (userId: string, urlId: string | number) =>
    `${urlEndpoints.details(userId, urlId)}/`,
};
