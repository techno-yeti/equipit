# Cookie Consent Banner

## Overview

The cookie consent banner informs first-time visitors that Equipit uses a single authentication cookie. No tracking, analytics, or third-party cookies are used. The banner is rendered in the `header.ejs` partial and managed by an external JavaScript file.

---

## Behavior

- **First visit only**: The banner is shown when no `equipit_cookies_accepted` cookie exists.
- **Subsequent visits**: The banner remains hidden; the stored consent cookie is respected.

---

## Visual Design

The banner is rendered as a centered modal overlay:

- **Backdrop**: A semi-transparent dark overlay covering the full viewport.
- **Modal card**: A white rounded card (`rounded-xl`, `shadow-lg`) centered on screen with padding.
- **Title**: "This site uses cookies" in bold (`text-lg font-semibold`).
- **Description paragraph**: "Equipit uses a single authentication cookie to keep you signed in. No tracking, analytics, or third-party cookies are used."
- **CORS explanation section**: An expandable/collapsible section (toggled via a "Learn about cross-origin access" link) explaining CORS (Cross-Origin Resource Sharing) in plain, non-technical language — describing that some deployments serve the frontend and API from different origins, and that a cookie needs to be shared across those origins for authentication to work.
- **Live CORS origins display**: A dynamically populated list fetched from `/api/cors-origins` showing the currently configured allowed origins. Each origin is displayed as a small code badge within the CORS explanation section.
- **Accept button** (`btn-primary`): Stores consent cookie with 365-day expiry.
- **Decline button** (`btn-secondary`): Stores consent cookie with 30-day expiry.

---

## Script: `/js/cookie-banner.js`

- Included via `<script src="/js/cookie-banner.js" defer></script>` in `header.ejs`.
- The script is loaded **externally only** — no inline script blocks, ensuring CSP (Content Security Policy) compliance.
- Execution is deferred to avoid blocking page rendering.

### JavaScript Logic

1. On `DOMContentLoaded`, check for the `equipit_cookies_accepted` cookie.
2. If **not present**: Remove the `hidden` class from the banner element to make it visible.
3. If **present**: Ensure the banner remains hidden (no action needed).
4. **Accept click handler**: Set `equipit_cookies_accepted` cookie with value `"true"` and expiry of 365 days. Add the `hidden` class to dismiss the banner.
5. **Decline click handler**: Set `equipit_cookies_accepted` cookie with value `"false"` and expiry of 30 days. Add the `hidden` class to dismiss the banner.
6. **CORS toggle**: Attach a click handler to the expandable CORS explanation toggle that slides/expands the CORS details section.
7. **Fetch origins**: On expansion of the CORS section, make a `GET` request to `/api/cors-origins` and populate the live origins list with the response data. Handle fetch failures gracefully (show a "Could not load origins" message).

---

## Cookie Specification

| Property       | Value                       |
|---------------|-----------------------------|
| Name           | `equipit_cookies_accepted`  |
| SameSite       | `Lax`                       |
| Value          | `"true"` (accepted) or `"false"` (declined) |
| Expiry (accept)| 365 days                    |
| Expiry (decline)| 30 days                    |
| Path           | `/`                         |
| Secure         | Set in production           |

---

## CSS / Tailwind Integration

- The banner container uses Tailwind's `hidden` class for show/hide toggling.
- No additional CSS is required; styles use existing component classes (`card`, `btn-primary`, `btn-secondary`).
