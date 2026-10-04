# Snip frontend

Next.js App Router, strict TypeScript, Tailwind CSS, shadcn/ui component foundation, Better Auth, TanStack Query, Zod, and Sonner. All backend files remain unchanged.

## Run

1. `npm install`
2. Copy `.env.example` to `.env.local` and set the backend and public redirect origins.
3. Start the existing backend separately.
4. `npm run dev` opens the frontend on port 3001.

`npm test` checks API validation and failure handling (Node 22.7+); `npm run typecheck` checks types; `npm run build` creates a production build.

Next.js rewrites `/api/*` to the existing backend (default port 3000). This is transport routing only; there are no frontend API handlers or replacement backend services. Production deployment must forward session cookies and configure the frontend origin as a trusted origin in the existing Better Auth deployment. Cross-origin POST authentication can be rejected until the deployment’s trusted origins are configured. Never put secrets in NEXT_PUBLIC variables. Set NEXT_PUBLIC_SHORT_URL_BASE to the actual externally accessible redirect origin.

## Implemented

- Responsive public home and features pages
- Public real URL creation, optional alias, validation, pending/error states, 429 cooldown, timeout, copy/open/share, backend QR preview/download
- Better Auth signup/signin/signout/session checks, protected workspace, profile, change password, intended-route preservation
- Dashboard and honest availability states for missing services
- Light, dark, and system themes

## Backend API configuration (AGENTS.md section 66)

`src/lib/api-config.ts` centralizes URL endpoint paths, Better Auth's base path, and the public short-link origin. `BACKEND_URL` in `.env.local` sets the external backend origin in the existing Next.js rewrite (default `http://localhost:3000`). Restart Next.js after changing it. Browser requests use `/api/*` on the frontend origin and are forwarded to the backend, with cookies included. No API handlers are created.

| Client helper    | Method | Backend path                             |
| ---------------- | ------ | ---------------------------------------- |
| `createUrl`      | POST   | `/api/v1/urls`                           |
| `getUserUrls`    | GET    | `/api/v1/urls/:userId`                   |
| `getUrlDetails`  | GET    | `/api/v1/urls/:userId/:urlId`            |
| `generateQrCode` | GET    | `/api/v1/urls/:userId/:urlId/generateQr` |
| `deleteUrl`      | GET    | `/api/v1/urls/:userId/:urlId/delete`     |
| `updateUrl`      | POST   | `/api/v1/urls/:userId/:urlId/`           |

The `:/userId:/urlId` notation in section 66 is interpreted as separate path segments `/:userId/:urlId`. IDs are encoded. Read helpers accept an AbortSignal. All requests have a 15-second timeout, safe error messages, cookie credentials, and no automatic retries. The delete endpoint is an explicit mutation despite its GET method and must never be prefetched or automatically retried.

### Confirmed contracts and remaining backend requirements

Read-only inspection of `../snip-url-shortner/src` confirms URL creation accepts `{longUrl, alias?}` and returns `{shortUrl: {id,shortCode,longUrl,createdAt,clickCount,isActive,qrCode}}`. Creation is connected to the existing form and validated with Zod.

The local backend currently mounts only the creation route, redirects, and Better Auth. Section 66's list/detail/QR/delete/update routes are now available as frontend transport helpers, but are not implemented in that backend snapshot. Response bodies, update fields, pagination, and analytics schemas have not been supplied. The helpers return `unknown` (QR returns a checked `Response`) so consumers must validate the eventual contract before displaying data. Management and analytics screens remain unavailable until these contracts exist; no payload schemas or metrics are fabricated.

### Authentication and Google sign-in

Better Auth uses `/api/auth` through the same rewrite for signup, email login, logout, and session retrieval. Both auth forms now offer Google sign-in through `authClient.signIn.social`, preserving safe intended workspace navigation and displaying failures.

Google OAuth is not configured in the inspected backend. Its owner must enable the Google provider with server-side credentials, configure its public auth origin and Google callback URI (locally `http://localhost:3000/api/auth/callback/google`), and trust the frontend origin (`http://localhost:3001` locally). Keep secrets on the backend. See [Better Auth Google documentation](https://better-auth.com/docs/authentication/google). Until configured, users can use email/password and Google attempts show an error.

Live authenticated, OAuth, and URL creation validation requires the running backend and its database/Redis dependencies. No backend files were changed.
