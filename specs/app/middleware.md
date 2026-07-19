# Middleware specification

**Global middleware (order-sensitive):**

1. **Security headers:** Helmet with CSP (see `security.md`).
2. **Request logging:** Minimal in dev, structured in prod.
3. **Body parsing:** `express.json()` and `express.urlencoded({ extended: false })`.
4. **Cookie parsing:** For session/JWT cookies.
5. **Rate limiting:** IP-based for auth and sensitive routes.
6. **CORS:** Restrictive; allow only configured origins.
7. **Auth extraction:** Read session/JWT and attach `req.user` if valid.
8. **Error handler:** Final middleware for errors.

**Custom middleware:**

- `requireAuth` — rejects unauthenticated requests.
- `requireRole(role)` — enforces role-based access.
- `validate(schema)` — validates body/query/params using shared schemas.
