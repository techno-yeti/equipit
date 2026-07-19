# Authentication strategy

**Approach:** Cookie-based session or JWT-in-cookie (choose one and implement consistently).

**Requirements:**

- On successful login:
  - Issue a session or signed JWT.
  - Store in an `httpOnly`, `secure` cookie.
- On logout:
  - Invalidate session or clear cookie.
- Token/session lifetime:
  - Reasonable expiry (e.g. 1–7 days).
  - Optional sliding expiration on activity.

**Security:**

- Never store passwords in plain text.
- Do not expose tokens in URLs or client-side storage.
- Implement CSRF protection if using cookie-based auth for state-changing requests.
