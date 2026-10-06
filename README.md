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

## Backend API integration

`src/lib/api-config.ts` centralizes endpoint paths. `BACKEND_URL` configures the existing Next.js rewrite (default `http://localhost:3000`). Requests include Better Auth session cookies; no user IDs are sent as proof of ownership.

Verified against `../snip-url-shortner/src` on October 6, 2026:

| Action | Method and path | Request body |
| --- | --- | --- |
| Create | POST `/api/v1/urls` | `{longUrl, alias?}` |
| Update destination | POST `/api/v1/urls/:shortCode` | `{shortUrl, newLongUrl, aliasChanged: false, urlChanged: true}` |
| Delete | DELETE `/api/v1/urls/:shortCode` | `{shortUrl}` |

Update and delete controllers currently read `shortUrl` from the JSON body, so the frontend sends it in both the route and body. Both return a JSON message. Destructive operations are never automatically retried.

`/app/urls` offers a short-code entry form for updating an owned link's destination and a modal confirmation for deletion. It handles validation, pending requests, errors, rate-limit cooldown, and expired sessions. Authenticated creation results link to this page with the short code prefilled. The existing result supports copy/open/share and PNG QR display/download. No local history is represented as an account-owned collection.

### Remaining backend gaps

- No account URL-list route is mounted. `getUrlDetailsController` is empty and sends no response. Saved-link lists/details therefore cannot be connected yet.
- `optionalAuth` sets `req.user`, but `createUrlController` reads `req.body.user`. The creation controller must use the authenticated request identity for newly created URLs to be owned by the signed-in user. The frontend does not send a client-asserted user identity to work around this.
- Alias updates write `data.alias`, while the Prisma URL model defines `shortCode`. Alias editing is not exposed until that mismatch is fixed.
- A separate QR generation route, enable/disable, and pagination are not implemented. QR codes returned during creation are supported.
- Analytics remains pending.

Google social-provider and localhost:3001 trusted-origin configuration are now present in the inspected auth source. Existing frontend Better Auth sign-in, signup, signout, session, and Google flows use `/api/auth`. Valid server-side Google credentials are still required. See [Better Auth Google documentation](https://better-auth.com/docs/authentication/google).

No backend files were modified. Live authenticated mutation verification requires the backend running on port 3000 and an account-owned test URL.
