import { test, afterEach, mock } from "node:test";
import assert from "node:assert/strict";
import { createUrl, urlInput, ApiError } from "../src/lib/api.ts";
afterEach(() => mock.restoreAll());
test("rejects unsafe schemes and invalid aliases", () => {
  for (const longUrl of [
    "javascript:alert(1)",
    "data:text/html,test",
    "ftp://example.com",
  ])
    assert.equal(urlInput.safeParse({ longUrl }).success, false);
  assert.equal(
    urlInput.safeParse({ longUrl: "https://example.com", alias: "../bad" })
      .success,
    false,
  );
  assert.equal(
    urlInput.safeParse({
      longUrl: "https://example.com",
      alias: "way-too-long",
    }).success,
    false,
  );
  assert.equal(
    urlInput.safeParse({ longUrl: "https://example.com", alias: "my-link" })
      .success,
    true,
  );
});
test("sends actual backend shape with session cookies and validates the response", async () => {
  const link = {
    id: 1,
    shortCode: "abc",
    longUrl: "https://example.com",
    createdAt: "2026-10-04T00:00:00Z",
    clickCount: 0,
    isActive: true,
    qrCode: "data:image/png;base64,AA==",
  };
  mock.method(globalThis, "fetch", async (url, options) => {
    assert.equal(url, "/api/v1/urls");
    assert.equal(options.credentials, "include");
    assert.deepEqual(JSON.parse(options.body), {
      longUrl: "https://example.com",
    });
    return Response.json({ shortUrl: link }, { status: 201 });
  });
  assert.deepEqual(await createUrl({ longUrl: "https://example.com" }), link);
});
test("does not expose backend stack traces or arbitrary errors", async () => {
  mock.method(globalThis, "fetch", async () =>
    Response.json(
      { message: "secret internal error", stack: "private stack" },
      { status: 500 },
    ),
  );
  await assert.rejects(
    createUrl({ longUrl: "https://example.com" }),
    (e) =>
      e instanceof ApiError &&
      e.status === 500 &&
      !e.message.includes("secret"),
  );
});
test("honors numeric retry-after", async () => {
  mock.method(
    globalThis,
    "fetch",
    async () =>
      new Response(null, { status: 429, headers: { "Retry-After": "45" } }),
  );
  await assert.rejects(
    createUrl({ longUrl: "https://example.com" }),
    (e) => e.status === 429 && e.retryAfter === 45,
  );
});
test("rejects malformed success payloads", async () => {
  mock.method(globalThis, "fetch", async () =>
    Response.json({ shortUrl: "unexpected" }),
  );
  await assert.rejects(
    createUrl({ longUrl: "https://example.com" }),
    (e) => e.status === 502,
  );
});
test("network failures have safe retry guidance", async () => {
  mock.method(globalThis, "fetch", async () => {
    throw new TypeError("fetch failed");
  });
  await assert.rejects(
    createUrl({ longUrl: "https://example.com" }),
    (e) => e.status === 0 && e.message.includes("try again"),
  );
});

test("non-JSON responses never leak server content", async () => {
  mock.method(
    globalThis,
    "fetch",
    async () => new Response("private backend details"),
  );
  await assert.rejects(
    createUrl({ longUrl: "https://example.com" }),
    (e) => e.status === 502 && !e.message.includes("private"),
  );
});

test("section 66 routes encode IDs, include cookies, and use the specified methods", async () => {
  const { getUserUrls, getUrlDetails, generateQrCode, deleteUrl, updateUrl } =
    await import("../src/lib/api.ts");
  const calls = [];
  mock.method(globalThis, "fetch", async (url, options) => {
    calls.push({ url, method: options.method, body: options.body });
    assert.equal(options.credentials, "include");
    assert.equal(options.cache, "no-store");
    return Response.json({});
  });
  await getUserUrls("user/id");
  await getUrlDetails("user/id", 42);
  await generateQrCode("user/id", 42);
  await deleteUrl("user/id", 42);
  await updateUrl("user/id", 42, {});
  assert.deepEqual(calls, [
    { url: "/api/v1/urls/user%2Fid", method: "GET", body: undefined },
    { url: "/api/v1/urls/user%2Fid/42", method: "GET", body: undefined },
    {
      url: "/api/v1/urls/user%2Fid/42/generateQr",
      method: "GET",
      body: undefined,
    },
    { url: "/api/v1/urls/user%2Fid/42/delete", method: "GET", body: undefined },
    { url: "/api/v1/urls/user%2Fid/42/", method: "POST", body: "{}" },
  ]);
});

test("delete accepts an empty success response without parsing JSON", async () => {
  const { deleteUrl } = await import("../src/lib/api.ts");
  mock.method(
    globalThis,
    "fetch",
    async () => new Response(null, { status: 204 }),
  );
  await deleteUrl("user", 1);
});

test("failed deletion is never automatically retried", async () => {
  const { deleteUrl } = await import("../src/lib/api.ts");
  let calls = 0;
  mock.method(globalThis, "fetch", async () => {
    calls++;
    return new Response(null, { status: 503 });
  });
  await assert.rejects(deleteUrl("user", 1), (e) => e.status === 503);
  assert.equal(calls, 1);
});

test("cancellation preserves the caller's abort reason", async () => {
  const { getUserUrls } = await import("../src/lib/api.ts");
  const controller = new AbortController();
  controller.abort(new DOMException("Cancelled", "AbortError"));
  mock.method(globalThis, "fetch", async (_, options) => {
    options.signal.throwIfAborted();
  });
  await assert.rejects(
    getUserUrls("user", controller.signal),
    (e) => e.name === "AbortError",
  );
});

test("accepts the backend's serialized PNG Buffer and converts it for the browser", async () => {
  const pngBytes = [137, 80, 78, 71, 13, 10, 26, 10];
  mock.method(globalThis, "fetch", async () =>
    Response.json({
      shortUrl: {
        id: 49,
        shortCode: "abc",
        longUrl: "https://example.com",
        createdAt: "2026-10-04T00:00:00Z",
        clickCount: 0,
        isActive: true,
        qrCode: { type: "Buffer", data: pngBytes },
      },
    }),
  );
  const link = await createUrl({ longUrl: "https://example.com" });
  assert.equal(
    link.qrCode,
    `data:image/png;base64,${Buffer.from(pngBytes).toString("base64")}`,
  );
});
