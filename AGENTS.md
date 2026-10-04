# URL Shortener Platform — Frontend Agent Instructions

## 1. Project Overview

Build a polished, production-quality frontend for an existing URL-shortening and analytics platform.

**The backend is already implemented.**

This project is **frontend-only**.

The frontend must consume the existing backend APIs and authentication system. Do not implement, modify, redesign, or recreate backend functionality.

The goal is to build a complete SaaS-style frontend that exposes the existing platform capabilities through an excellent user experience.

The application should feel like a real production product, not a tutorial/demo frontend.

---

# 2. Critical Scope Rule

## FRONTEND ONLY

The agent must work exclusively on the frontend.

Do **not**:

- Create backend services
- Create API endpoints
- Modify backend code
- Modify Prisma schemas
- Modify database schemas
- Implement Redis
- Implement caching
- Implement queues
- Implement workers
- Implement rate limiting
- Implement load balancing
- Implement backend authentication
- Implement Better Auth server configuration
- Create backend business logic
- Replace existing backend APIs
- Create mock backend services unless explicitly requested

The backend already exists.

The frontend should consume the backend as an external API.

If a required frontend feature depends on an API that does not appear to exist, **do not invent a backend implementation**.

Instead:

1. Inspect the existing API contract/documentation if available.
2. Determine whether an existing endpoint can support the feature, can do all the features mentioned in this even if its not available in backend now, will add to backend later.
3. If the required capability genuinely does not exist, clearly identify the missing API requirement.
4. Do not modify the backend unless explicitly instructed.

---

# 3. Mandatory Frontend Stack

The frontend **must** use:

### Framework

**Next.js**

Use:

- Next.js App Router
- Server Components by default
- Client Components only when interactivity requires them

Do not unnecessarily make the entire application client-side.

### Language

**TypeScript**

Use strict typing.

Avoid `any` unless there is a strong documented reason.

### Styling

**Tailwind CSS**

Use Tailwind CSS for application styling.

Do not introduce another CSS framework.

### UI Components

**shadcn/ui**

Use shadcn/ui as the primary UI component foundation.

Prefer shadcn/ui for:

- Buttons
- Inputs
- Forms
- Dialogs
- Dropdowns
- Selects
- Tabs
- Tables
- Cards
- Tooltips
- Alerts
- Toasts
- Badges
- Navigation
- Sheets
- Command menus
- Date pickers
- Pagination
- Skeletons
- Popovers
- Calendars

Customize shadcn/ui components using Tailwind when required.

Do not introduce another component library.

### Authentication

**Better Auth**

The existing backend uses Better Auth.

The frontend must integrate with the existing Better Auth setup.

Do not create another authentication system.

### Server State

Prefer:

**TanStack Query**

Use it for appropriate server-side data such as:

- URLs
- Analytics
- User information
- API keys
- API usage

### Forms

Prefer:

**React Hook Form**

for complex forms.

### Validation

Prefer:

**Zod**

for client-side validation and schema validation where useful.

Backend validation remains authoritative.

---

# 4. Existing Backend

The backend is an external dependency.

Assume that the backend already provides functionality such as:

- URL creation
- URL retrieval
- URL modification
- URL deletion
- URL activation/deactivation
- URL redirection
- Authentication
- User sessions
- Analytics
- API keys
- API usage
- Rate limiting
- Other existing platform functionality

The frontend should consume whatever functionality is actually exposed.

Do not assume endpoint names or response structures without checking the existing API contract.

---

# 5. Existing Authentication

Authentication is already implemented using:

**Better Auth**

The frontend must use Better Auth for:

- Sign up
- Sign in
- Sign out
- Session retrieval
- Session state
- User identity
- Account authentication

Do not implement:

- JWT authentication
- Custom token authentication
- Another auth library
- A second session system
- Homemade authentication logic

The Better Auth session is the source of truth.

---

# 6. Better Auth Session States

The frontend must handle:

```text
Session Loading
Authenticated
Unauthenticated
Session Expired
Unauthorized
Forbidden
```

Protected routes must not render authenticated content before the authentication state is known.

General flow:

```text
Application starts
       ↓
Retrieve Better Auth session
       ↓
 ┌───────────────┐
 │               │
Authenticated  Unauthenticated
 │               │
 ▼               ▼
App             Login
```

If the session expires:

- Update authentication state
- Stop rendering protected content
- Redirect to login where appropriate
- Avoid infinite redirects
- Preserve intended navigation where appropriate

---

# 7. Better Auth Client Integration

Keep authentication logic centralized.

Recommended structure:

```text
src/
└── lib/
    └── auth/
        ├── client.ts
        ├── session.ts
        └── types.ts
```

Use the existing Better Auth integration.

Do not duplicate authentication logic inside individual pages/components.

Do not manually manage authentication tokens unless required by the existing Better Auth setup.

Never log:

- Passwords
- Session secrets
- Tokens
- API keys
- Sensitive authentication information

---

# 8. Next.js Architecture

Prefer a structure similar to:

```text
src/
├── app/
│   ├── (public)/
│   │   ├── page.tsx
│   │   ├── features/
│   │   └── docs/
│   │
│   ├── (auth)/
│   │   ├── login/
│   │   ├── signup/
│   │   ├── forgot-password/
│   │   └── reset-password/
│   │
│   ├── app/
│   │   ├── layout.tsx
│   │   ├── page.tsx
│   │   ├── urls/
│   │   ├── analytics/
│   │   ├── developers/
│   │   ├── profile/
│   │   └── settings/
│   │
│   └── admin/
│
├── components/
│   ├── ui/
│   ├── layout/
│   ├── urls/
│   ├── analytics/
│   ├── auth/
│   └── developers/
│
├── lib/
│   ├── api/
│   ├── auth/
│   ├── validations/
│   └── utils/
│
├── hooks/
├── types/
└── config/
```

The exact structure can evolve.

Do not create unnecessary abstractions solely to match this example.

---

# 9. Server Components vs Client Components

Use Server Components by default.

Use Client Components when required for:

- React state
- Event handlers
- Interactive forms
- Dialogs
- Dropdowns
- Interactive charts
- Copy-to-clipboard
- Web Share API
- TanStack Query
- Browser APIs
- Better Auth client interactions where required

Do not add `"use client"` unnecessarily.

---

# 10. Public Pages

The public application should contain:

```text
/
├── Home
├── Features
├── API Documentation
├── Login
├── Sign Up
├── Forgot Password
└── Reset Password
```

Only implement authentication pages supported by the existing Better Auth configuration.

---

# 11. Landing Page

The landing page must communicate the product clearly.

Include:

- Product name/logo
- Strong value proposition
- URL shortening form
- Login
- Sign up
- Features
- Analytics explanation
- Developer/API explanation
- Performance/scalability positioning
- Responsive design

## URL Shortening Form

Fields:

- Original URL
- Optional custom alias
- Optional expiration date/time

Handle:

- Validation
- Loading
- Success
- Server errors
- Rate-limit errors

## Successful Result

Display:

- Short URL
- Copy
- Open
- QR code
- Analytics link if available
- Share action where appropriate

---

# 12. Authentication Pages

## Sign Up

Support the fields required by the existing Better Auth configuration.

Potential fields:

- Email
- Password
- Name
- Confirm password

Handle:

- Validation
- Loading
- Success
- Duplicate account
- Server errors

## Login

Support:

- Email
- Password
- Forgot password if available
- OAuth if already configured
- Loading
- Invalid credentials
- Network errors

## Logout

Use Better Auth's existing sign-out mechanism.

Do not implement logout by merely clearing frontend state.

---

# 13. Dashboard

Authenticated users should land on a dashboard.

Display:

### Overview

- Total URLs
- Total clicks
- Active URLs
- Expired URLs

### Activity

- Recent URLs
- Recent clicks
- Top-performing URLs
- Click trends

### Quick Actions

- Create URL
- View URLs
- View analytics
- Manage API keys

Handle:

- Loading
- Empty
- Error
- Retry

---

# 14. URL Management

## Create URL

Fields:

- Original URL
- Custom alias
- Expiration date/time
- Title/description if supported

Handle:

- Validation
- Alias availability
- Loading
- Success
- Errors

Do not invent fields unsupported by the backend.

---

# 15. URL List

Display:

- Short URL
- Original URL
- Title/description
- Creation date
- Expiration date
- Status
- Click count
- Last accessed time

Actions:

- Copy
- Open
- Analytics
- Edit
- Disable
- Enable
- Delete

Use shadcn/ui components.

---

# 16. URL Search

Search by:

- Short code
- Custom alias
- Original URL
- Title/description

Requirements:

- Debounced search
- Loading state
- Clear search
- No-results state
- Error state
- Pagination compatibility

---

# 17. URL Filtering

Filters:

```text
Active
Expired
Disabled
```

Date filters:

```text
Today
Last 7 days
Last 30 days
Custom range
```

Sorting:

```text
Newest
Oldest
Most clicks
Least clicks
Recently accessed
```

Preserve filters/search/sorting in URL query parameters where appropriate.

---

# 18. Pagination

Prefer cursor-based pagination when supported by the backend.

Support:

- Next
- Previous where available
- Loading
- Search preservation
- Filter preservation
- Sort preservation

Do not fetch the entire URL collection unnecessarily.

---

# 19. URL Details

Display:

- Short URL
- Original URL
- Custom alias
- Title/description
- Created date
- Expiration
- Status
- Total clicks
- Unique visitors
- Last accessed
- QR code

Actions:

- Copy
- Open
- Edit
- Enable
- Disable
- Delete
- Analytics

---

# 20. URL Editing

Editable fields should match the backend API.

Potential fields:

- Original URL
- Expiration
- Title/description
- Active/inactive status

If the short code is immutable, communicate this clearly.

Handle:

- Edit
- Save
- Cancel
- Validation
- Unsaved changes
- Loading
- Success
- Error

---

# 21. URL Status

Display:

```text
Active
Expired
Disabled
```

Support:

- Disable
- Enable
- Delete

Use confirmation dialogs for destructive actions.

---

# 22. QR Codes

Support QR codes for usable short URLs.

Features:

- Generate
- Display
- Download
- Copy URL
- Share

Make QR functionality available from appropriate URL views.

---

# 23. Analytics Dashboard

Analytics is a major product feature.

## Metrics

Display:

- Total clicks
- Unique visitors
- Clicks today
- Clicks this week
- Clicks this month
- Average clicks/day
- Growth/change percentage

Only display metrics actually provided by the backend.

---

# 24. Time-Series Analytics

Support:

- Hourly
- Daily
- Weekly
- Monthly

Filters:

```text
Last 24 hours
Last 7 days
Last 30 days
Last 90 days
Custom range
```

Charts should be interactive where useful.

---

# 25. Geographic Analytics

Where backend data exists, display:

- Country
- Region/state
- City
- Click counts

Potential visualizations:

- Country ranking
- Geographic chart/map
- Location breakdown

Never expose raw IP addresses.

---

# 26. Device Analytics

Display:

```text
Desktop
Mobile
Tablet
```

---

# 27. Browser Analytics

Display:

```text
Chrome
Safari
Firefox
Edge
Other
```

---

# 28. Operating System Analytics

Display:

```text
Windows
macOS
Linux
Android
iOS
Other
```

---

# 29. Referrer Analytics

Display:

```text
Google
Instagram
Facebook
Direct
Other
```

Do not assume every click has a referrer.

---

# 30. Analytics Interactions

Support:

- Interactive charts
- Tooltips
- Date filtering
- Metric selection
- URL-specific analytics
- Drill-down
- Empty states
- Loading states
- Error states
- Retry

Charts must work well on mobile.

---

# 31. Analytics Export

If the backend supports exports:

- Export CSV
- Select date range
- Export URL-specific analytics
- Loading/progress state

Do not create client-side exports that misrepresent incomplete backend data.

---

# 32. Developer Dashboard

Provide:

## API Documentation

- API overview
- Authentication instructions
- Endpoints
- Request examples
- Response examples
- Error responses
- Rate limits

Documentation must match the actual backend API.

Do not invent endpoint names or request formats.

---

# 33. API Keys

If supported by the backend:

- Create API key
- Copy API key
- View active keys
- Revoke API key

Security:

- Never log API keys
- Never expose secrets unnecessarily
- Only display a secret according to backend behavior
- Warn users before leaving the creation state if the key is shown only once

---

# 34. API Usage

If supported:

Display:

- Total API requests
- Requests over time
- Current limit
- Remaining requests
- Reset time
- Usage history

---

# 35. Rate Limit UX

Handle HTTP `429`.

Display:

- Clear explanation
- Retry timing if supplied
- Appropriate disabled/loading state

Avoid aggressive automatic retries.

For developer usage:

- Rate limit
- Remaining requests
- Reset time

---

# 36. Profile

Display backend-supported user information:

- Name
- Email
- Account creation date
- Other non-sensitive profile information

User identity should come from Better Auth/backend data.

---

# 37. Settings

Only expose settings supported by the application.

Potential settings:

- Default URL expiration
- Notification preferences
- Theme
- Analytics preferences
- Account settings

Client-only preferences such as theme are acceptable when appropriate.

---

# 38. Security Settings

Only expose backend-supported functionality:

- Change password
- Session/security information
- Account deletion
- Logout

Do not invent security features.

---

# 39. Notifications

Use shadcn/ui toast/notification patterns.

Notify for:

- URL created
- URL copied
- URL updated
- URL deleted
- URL enabled
- URL disabled
- Password changed
- API key created
- API key revoked
- Authentication errors
- Rate-limit errors
- Important server errors

---

# 40. Global Error Handling

Handle:

```text
400 Bad Request
401 Unauthorized
403 Forbidden
404 Not Found
409 Conflict
422 Validation Error
429 Too Many Requests
500 Internal Server Error
502 Bad Gateway
503 Service Unavailable
Network Error
Timeout
```

For `401`:

- Check Better Auth session
- Update authentication state
- Redirect to login when appropriate
- Avoid infinite redirects/retries

Never expose raw backend errors or stack traces.

---

# 41. Loading States

Every async operation must have a loading state.

Examples:

- Better Auth session check
- Login
- Signup
- Dashboard
- URL creation
- URL editing
- URL deletion
- Search
- Pagination
- Analytics
- QR generation
- API key creation
- API key revocation
- CSV export

Use shadcn/ui Skeleton where appropriate.

---

# 42. Empty States

Provide intentional empty states for:

- No URLs
- No analytics
- No clicks
- No search results
- No active URLs
- No expired URLs
- No API keys
- No API usage
- No recent activity

Each empty state should provide a useful next action.

---

# 43. Responsive Design

Support:

- Desktop
- Laptop
- Tablet
- Mobile

Pay particular attention to:

- URL tables
- Analytics charts
- Navigation
- Forms
- Dialogs
- Dashboard cards
- Copy/share actions

On mobile, transform complex tables into cards or another appropriate representation.

---

# 44. Navigation

Public:

```text
Home
Features
API Docs
Login
Sign Up
```

Authenticated:

```text
Dashboard
URLs
Analytics
Developers
Profile
Settings
Logout
```

Use appropriate shadcn/ui navigation components.

Clearly indicate the active route.

---

# 45. Theme

Support:

- Light mode
- Dark mode
- System preference

Use Tailwind CSS and the application's theme mechanism.

All components must support both themes.

---

# 46. Accessibility

Requirements:

- Semantic HTML
- Keyboard navigation
- Visible focus states
- Proper labels
- Accessible buttons
- Accessible dialogs
- Screen-reader-friendly controls
- Appropriate ARIA
- Good contrast
- Keyboard-accessible dropdowns
- Accessible alternatives for chart data

Do not rely on color alone to communicate status.

---

# 47. Frontend Performance

Optimize the frontend appropriately:

- Avoid unnecessary API requests
- Debounce search
- Cache server data
- Use pagination
- Lazy-load expensive components
- Code-split routes where useful
- Optimize assets
- Avoid unnecessary re-renders
- Cancel stale requests where appropriate

Do not perform premature or speculative optimization.

---

# 48. Server State

Treat backend data as server state.

Examples:

- URLs
- Analytics
- User profile
- API keys
- API usage
- Better Auth session/user

Use TanStack Query where appropriate.

Avoid duplicating server state into multiple client stores.

---

# 49. Client State

Client state should be limited to UI/application state such as:

- Modal state
- Temporary form state
- Theme
- UI preferences
- Selected tabs
- Temporary filters

Do not use global state for data that should come from the backend.

---

# 50. Forms

Forms must provide:

- Client-side validation
- Server-side error display
- Field-level errors
- Submission state
- Disabled submit while submitting
- Success feedback
- Error feedback

Prefer:

```text
React Hook Form
+
Zod
```

for complex forms.

Backend validation remains authoritative.

---

# 51. Security Expectations

The frontend must:

- Never trust client-side validation as authoritative
- Never render arbitrary HTML from user URLs
- Avoid XSS
- Use Better Auth
- Follow Better Auth session behavior
- Never log passwords/tokens/API keys
- Never expose backend stack traces
- Never store sensitive credentials unnecessarily
- Treat backend responses as untrusted input

---

# 52. URL Safety

When displaying user-submitted URLs:

- Render them safely
- Use safe navigation
- Clearly distinguish display from navigation
- Never execute arbitrary URL content
- Reject/avoid unsafe schemes in the frontend where appropriate

The backend remains authoritative for URL validation.

---

# 53. Sharing

Support:

- Copy URL
- Share URL
- QR code
- Web Share API where appropriate

Fallback gracefully if Web Share is unavailable.

---

# 54. Component Requirements

Use shadcn/ui as the base component system.

Common components:

```text
Button
Input
Textarea
Select
DatePicker
Dialog
Sheet
DropdownMenu
Tooltip
Badge
Tabs
Table
Card
Skeleton
Alert
Toast
Pagination
Command
Popover
Calendar
Separator
Breadcrumb
Navigation
```

Customize through Tailwind CSS.

Do not add another component library.

---

# 55. URL Components

Create reusable components such as:

```text
URLCard
URLTable
URLForm
URLStatusBadge
URLActions
URLDetails
URLAnalytics
CreateURLDialog
DeleteURLDialog
DisableURLDialog
```

---

# 56. Analytics Components

Create reusable components such as:

```text
MetricCard
ClicksChart
DeviceChart
BrowserChart
OSChart
ReferrerChart
CountryChart
AnalyticsFilters
DateRangePicker
TopURLs
```

Keep them data-driven.

Do not hardcode production analytics.

---

# 57. API Integration

Centralize API communication.

Do not scatter raw API calls throughout components.

Recommended structure:

```text
src/
├── lib/
│   ├── api/
│   │   ├── urls
│   │   ├── analytics
│   │   ├── users
│   │   ├── apiKeys
│   │   └── usage
│   │
│   └── auth/
│       ├── client
│       ├── session
│       └── types
```

Authentication operations must use Better Auth.

Do not recreate backend business logic in the API layer.

---

# 58. API Contract

The existing backend is authoritative.

Before implementing an API integration:

1. Inspect the existing API contract/documentation.
2. Determine the endpoint.
3. Determine request shape.
4. Determine response shape.
5. Determine error format.
6. Implement typed frontend integration.

Do not guess API structures.

If documentation is unavailable, inspect the existing project code/configuration where appropriate.

Do not modify backend code merely to make frontend integration easier.

---

# 59. Do Not Build Fake Features

Never create UI for unsupported backend functionality.

Examples:

```text
Custom domains
Teams
Billing
Advanced notifications
OAuth providers
2FA
Geographic precision
Exports
```

Only implement these if the existing backend supports them.

Do not create fake API responses merely to make a page appear complete.

Temporary mock data may only be used during initial UI development and must be clearly isolated and removable.

---

# 60. Development Priorities

## Phase 1 — Frontend Foundation

- Next.js setup
- TypeScript
- Tailwind CSS
- shadcn/ui
- App Router
- App shell
- Routing
- Design system
- Landing page
- Responsive layout
- API client
- Better Auth integration
- Session handling
- Error handling
- Loading states

## Phase 2 — Authentication UI

- Sign up
- Sign in
- Better Auth session
- Sign out
- Protected routes
- Password recovery if supported
- Email verification if supported
- OAuth if supported

## Phase 3 — URL Management

- Create URL
- URL list
- URL details
- Edit
- Delete
- Enable/disable
- Search
- Filtering
- Pagination
- QR codes

## Phase 4 — Dashboard

- Metrics
- Recent URLs
- Recent activity
- Top URLs

## Phase 5 — Analytics

- Click metrics
- Time-series charts
- Device
- Browser
- OS
- Referrer
- Geographic analytics
- Date filtering
- URL-specific analytics

## Phase 6 — Developer Platform

- API documentation
- API keys
- API usage
- Rate-limit information

## Phase 7 — Polish

- Dark mode
- Accessibility
- Responsive refinement
- Empty states
- Error states
- Performance optimization
- UX refinement

## Phase 8 — Optional Admin UI

Only if corresponding backend functionality already exists:

- Admin dashboard
- User management
- URL moderation
- System health

---

# 61. Design Principles

## Simple

Shortening a URL should require minimal effort.

## Fast

Provide immediate visual feedback.

## Clear

Users should always understand:

- What happened
- What is loading
- What went wrong
- What they can do next

## Consistent

Use shadcn/ui + Tailwind consistently for:

- Spacing
- Typography
- Colors
- Buttons
- Forms
- Dialogs
- Tables
- Cards
- Notifications

## Production-oriented

Every async operation and failure scenario should be handled intentionally.

## Do Not Overengineer

The frontend should be sophisticated where it adds user value, not complicated for the sake of complexity.

---

# 62. Important UX States

Every major feature must consider:

```text
Initial
Loading
Success
Empty
Validation Error
Authentication Error
Authorization Error
Conflict
Rate Limited
Network Error
Server Error
Retry
```

Authentication additionally requires:

```text
Session Checking
Authenticated
Unauthenticated
Session Expired
```

---

# 63. Definition of Done

A frontend feature is complete only when:

- UI is implemented
- Existing backend API is integrated
- Better Auth integration is correct where applicable
- Validation exists
- Loading state exists
- Empty state exists where relevant
- Error handling exists
- Responsive behavior works
- Accessibility is considered
- shadcn/ui is used where appropriate
- Tailwind CSS is used consistently
- No hardcoded production data remains
- No unnecessary duplicate components exist
- TypeScript types are correct
- Feature works against the real backend
- Authenticated and unauthenticated behavior has been tested
- Realistic failure scenarios have been tested

---

# 64. Core Product Scope

The completed frontend should provide:

```text
                    URL SHORTENER
                          │
        ┌─────────────────┼─────────────────┐
        │                 │                 │
     Shortening       Management        Analytics
        │                 │                 │
        │                 │                 ├── Clicks
        │                 │                 ├── Visitors
        │                 │                 ├── Devices
        │                 │                 ├── Browsers
        │                 │                 ├── OS
        │                 │                 ├── Referrers
        │                 │                 └── Geography
        │                 │
        │                 ├── Search
        │                 ├── Filtering
        │                 ├── Pagination
        │                 ├── Edit
        │                 ├── Delete
        │                 ├── Enable/Disable
        │                 └── QR Code
        │
        ├── Better Auth
        ├── Dashboard
        ├── Developer API
        ├── API Keys
        ├── API Usage
        ├── Profile
        └── Settings
```

---

# 65. Final Implementation Rule

This repository is a **frontend-only project**.

The backend already exists and must be treated as an external service.

The implementation workflow should be:

```text
Existing Backend
       ↓
Inspect API Contract
       ↓
Create Typed API Client
       ↓
Integrate Better Auth
       ↓
Build UI with Next.js
       ↓
Use shadcn/ui + Tailwind
       ↓
Connect Real API Data
       ↓
Handle Loading / Empty / Error States
       ↓
Test Authenticated + Unauthenticated Flows
       ↓
Responsive + Accessibility Polish
       ↓
Performance Optimization
```


# 66. Backend Endpoint rule
Create a common file to setup common url end point
common end point: localhost:3000/api/v1/urls
       - create short url: POST /
       - view created short urls(if logged in) : GET :/userId
       - view user's url and its analytics: GET :/userId:/urlId
       - generate qrcode: GET :/userId:/urlId/generateQr
       - delete url: GET :/userId:/urlId/delete
       - update url: POST :/userId:/urlId/
       -user login, logout (refer better auth docs), add social sign in with google also
end point for auth: localhost:3000/api/auth/
The main end points are   

Never modify or recreate backend functionality unless explicitly instructed by the user.

The final result should demonstrate **high-quality Next.js frontend engineering and product design** on top of the already-built backend.
