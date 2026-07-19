# Security specification

**Core requirements:**

- **HTTPS-only** in production (enforced via reverse proxy and `X-Forwarded-Proto` checks).
- **Helmet:** Enable standard protections (HSTS, XSS filter, noSniff, frameguard).
- **CSP:** At minimum:
  - `default-src 'self'`
  - `script-src 'self'`
  - `style-src 'self' 'unsafe-inline'` (only if Tailwind requires; prefer precompiled CSS)
  - `img-src 'self' data:`
- **Cookies:**
  - `httpOnly: true`
  - `secure: true` in production
  - `sameSite: 'lax'` or stricter
- **Password hashing:** bcrypt with cost factor 10–12.
- **Brute-force protection:** Rate limit login and password reset endpoints.
- **Input sanitisation:**
  - Prevent MongoDB operator injection.
  - Validate and sanitise all user input via schemas.
- **Error messages:** Never leak stack traces or internal details in production responses.
