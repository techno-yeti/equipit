# Security Setup

## 1. Helmet with Custom CSP

The app configures Helmet with the following Content Security Policy directives:

| Directive | Value |
|---|---|
| `default-src` | `'self'` |
| `script-src` | `'self'` |
| `style-src` | `'self' 'unsafe-inline'` |
| `img-src` | `'self' data:` |
| `font-src` | `'self' https://fonts.gstatic.com` |
| `connect-src` | `'self'` |

In production, HSTS is enabled with:

| Option | Value |
|---|---|
| `maxAge` | `63072000` (2 years) |
| `includeSubDomains` | `true` |

---

## 2. Cookie Security

The `token` cookie used for JWT authentication is configured with the following options:

| Option | Value |
|---|---|
| `httpOnly` | `true` — not accessible via JavaScript |
| `secure` | `true` in production, `false` otherwise |
| `sameSite` | `'lax'` — allows top-level navigation GET requests |
| `maxAge` | `7 * 24 * 60 * 60 * 1000` (7 days) |

---

## 3. Password Hashing — bcrypt

Passwords are hashed using bcrypt with a **cost factor of 12**.

- Implemented as a **Mongoose pre-save hook** on the User model.
- The hook runs only when the password field has been modified (i.e. on creation and password change).
- Plain-text passwords are never persisted or logged.

---

## 4. Rate Limiting — Auth Routes

Auth routes (`/login`, `/register`) are protected by a rate limiter using `express-rate-limit`:

| Setting | Value |
|---|---|
| Window | 15 minutes |
| Max requests | 20 per window |
| Handler | Returns a `429 Too Many Requests` response with a user-friendly message |

---

## 5. Error Handling

- **Production**: Stack traces are hidden from error responses. The app renders a generic error page or returns a sanitized JSON error body.
- **Development / Test**: Full stack traces are included to aid debugging.
- Internal details (file paths, database queries, internal IPs) are **never** exposed to the client in any environment.
