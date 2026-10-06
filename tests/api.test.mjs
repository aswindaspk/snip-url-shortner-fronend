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

test("uses the implemented short-code mutation routes and bodies", async () => {
  const { updateUrl, deleteUrl } = await import("../src/lib/api.ts");
  const calls = [];
  mock.method(globalThis, "fetch", async (url, options) => {
    calls.push({ url, method: options.method, body: JSON.parse(options.body) });
    assert.equal(options.credentials, "include");
    return Response.json({ message: "Success" });
  });
  await updateUrl({
    shortUrl: "my-link",
    newLongUrl: "https://example.com/new",
  });
  await deleteUrl("my-link");
  assert.deepEqual(calls, [
    {
      url: "/api/v1/urls/my-link",
      method: "POST",
      body: {
        shortUrl: "my-link",
        newLongUrl: "https://example.com/new",
        aliasChanged: false,
        urlChanged: true,
      },
    },
    {
      url: "/api/v1/urls/my-link",
      method: "DELETE",
      body: { shortUrl: "my-link" },
    },
  ]);
});

test("rejects unsafe edits and invalid short codes before sending", async () => {
  const { updateUrl, deleteUrl } = await import("../src/lib/api.ts");
  const fetchMock = mock.method(globalThis, "fetch", async () => {
    throw new Error("Must not send");
  });
  await assert.rejects(
    updateUrl({ shortUrl: "abc", newLongUrl: "javascript:alert(1)" }),
  );
  await assert.rejects(deleteUrl("../abc"));
  assert.equal(fetchMock.mock.callCount(), 0);
});

test("does not retry failed destructive requests", async () => {
  const { deleteUrl } = await import("../src/lib/api.ts");
  const fetchMock = mock.method(
    globalThis,
    "fetch",
    async () => new Response(null, { status: 503 }),
  );
  await assert.rejects(deleteUrl("abc"), (e) => e.status === 503);
  assert.equal(fetchMock.mock.callCount(), 1);
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
