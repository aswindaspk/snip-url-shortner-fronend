import { z } from "zod";
import { urlEndpoints } from "./api-config.ts";
export const urlInput = z.object({
  longUrl: z
    .url()
    .refine((v) => /^https?:\/\//i.test(v), "Use an http:// or https:// URL."),
  alias: z
    .string()
    .max(10, "Use 10 characters or fewer.")
    .regex(/^[a-zA-Z0-9_-]*$/, "Use letters, numbers, hyphens, or underscores.")
    .optional(),
});
const result = z.object({
  shortUrl: z.object({
    id: z.number(),
    shortCode: z.string(),
    longUrl: z.string(),
    createdAt: z.string(),
    clickCount: z.number(),
    isActive: z.boolean(),
    qrCode: z.union([
      z.string().regex(/^data:image\/png;base64,[A-Za-z0-9+/=]+$/),
      z
        .object({
          type: z.literal("Buffer"),
          data: z.array(z.number().int().min(0).max(255)).min(8).max(1048576),
        })
        .refine(
          ({ data }) =>
            [137, 80, 78, 71, 13, 10, 26, 10].every(
              (byte, index) => data[index] === byte,
            ),
          "Expected PNG image bytes",
        )
        .transform(
          ({ data }) =>
            `data:image/png;base64,${btoa(data.map((byte) => String.fromCharCode(byte)).join(""))}`,
        ),
    ]),
  }),
});
export type ShortLink = z.infer<typeof result>["shortUrl"];
export class ApiError extends Error {
  constructor(
    message: string,
    public status: number,
    public retryAfter = 0,
  ) {
    super(message);
  }
}
type RequestOptions = {
  method?: "GET" | "POST";
  body?: unknown;
  signal?: AbortSignal;
};

async function request(
  endpoint: string,
  options: RequestOptions = {},
): Promise<Response> {
  let response: Response;
  try {
    const timeout = AbortSignal.timeout(15000);
    response = await fetch(endpoint, {
      method: options.method || "GET",
      credentials: "include",
      cache: "no-store",
      headers:
        options.body === undefined
          ? undefined
          : { "Content-Type": "application/json" },
      body:
        options.body === undefined ? undefined : JSON.stringify(options.body),
      signal: options.signal
        ? AbortSignal.any([options.signal, timeout])
        : timeout,
    });
  } catch {
    if (options.signal?.aborted) throw options.signal.reason;
    throw new ApiError(
      "Couldn’t connect. Check your connection and try again.",
      0,
    );
  }
  if (!response.ok) {
    const messages: Record<number, string> = {
      400: "Check your URL or try a different alias.",
      401: "Your session expired. Please sign in again.",
      403: "You don’t have permission to do this.",
      404: "This service is not available.",
      409: "That alias is already taken. Try another.",
      422: "Check the fields and try again.",
      429: "Too many requests. Please wait before trying again.",
    };
    const retry = response.headers.get("Retry-After");
    const seconds = retry
      ? /^\d+$/.test(retry)
        ? Number(retry)
        : Math.max(0, Math.ceil((Date.parse(retry) - Date.now()) / 1000))
      : 0;
    throw new ApiError(
      messages[response.status] ||
        "The service is temporarily unavailable. Please try again shortly.",
      response.status,
      Number.isFinite(seconds) ? seconds : 0,
    );
  }
  return response;
}

async function readJson(response: Response): Promise<unknown> {
  try {
    return await response.json();
  } catch {
    throw new ApiError(
      "The service returned an unexpected response. Please try again.",
      502,
    );
  }
}

export async function createUrl(
  input: z.infer<typeof urlInput>,
): Promise<ShortLink> {
  const response = await request(urlEndpoints.create, {
    method: "POST",
    body: urlInput.parse(input),
  });
  const parsed = result.safeParse(await readJson(response));
  if (!parsed.success)
    throw new ApiError(
      "The service returned an unexpected response. Please try again.",
      502,
    );
  return parsed.data.shortUrl;
}

/** Section 66 defines routes only. Keep payloads unknown until schemas are supplied. */
export async function getUserUrls(
  userId: string,
  signal?: AbortSignal,
): Promise<unknown> {
  return readJson(await request(urlEndpoints.list(userId), { signal }));
}

export async function getUrlDetails(
  userId: string,
  urlId: string | number,
  signal?: AbortSignal,
): Promise<unknown> {
  return readJson(
    await request(urlEndpoints.details(userId, urlId), { signal }),
  );
}

/** Return the response so its documented image/JSON format can be decoded by the caller. */
export function generateQrCode(
  userId: string,
  urlId: string | number,
  signal?: AbortSignal,
): Promise<Response> {
  return request(urlEndpoints.qr(userId, urlId), { signal });
}

/** Explicit mutation only: this backend uses GET for deletion. Never prefetch or retry it. */
export async function deleteUrl(
  userId: string,
  urlId: string | number,
): Promise<void> {
  await request(urlEndpoints.delete(userId, urlId));
}

/** The backend owner must provide the allowed update fields before wiring an edit form. */
export async function updateUrl(
  userId: string,
  urlId: string | number,
  input: Readonly<Record<string, unknown>>,
): Promise<unknown> {
  const response = await request(urlEndpoints.update(userId, urlId), {
    method: "POST",
    body: input,
  });
  return response.status === 204 ? undefined : readJson(response);
}
