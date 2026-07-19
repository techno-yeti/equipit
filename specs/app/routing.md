# Routing specification

**Page routes (server-rendered views):**

- `GET /` — landing page
- `GET /login`
- `GET /register`
- `GET /dashboard` — authenticated

**Conventions:**

- Use `router` modules per domain: `auth.routes`, `user.routes`, etc.
- Protect authenticated routes with auth middleware.
- Return the consistent JSON shape defined in `/spec/api/error-handling.md`.
