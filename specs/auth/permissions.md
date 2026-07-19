# Permissions and authorisation

**Roles:**

- `user` — default authenticated user.
- `admin` — elevated privileges.

**Implementation:**

- Store `role` on user model.
- Middleware:
  - `requireAuth` — ensures `req.user` is present.
  - `requireRole('admin')` — ensures `req.user.role === 'admin'`.

**Protected areas:**

- `/dashboard` — requires `user` or higher.
- Admin-only endpoints (e.g. user management) require `admin`.

Return `403 Forbidden` for insufficient permissions, without leaking details about resource existence.
