# Authentication Strategy

## Token Storage

- The JWT is stored in an **httpOnly cookie** named `token`.
- The cookie is set on login and cleared on logout.
- Algorithm: **HS256** (the default for `jsonwebtoken`).

---

## Middleware

### `extractUser` — runs on every request

1. Reads the `token` cookie from the request.
2. Verifies the JWT using `JWT_SECRET`.
3. Looks up the user by the `userId` claim in the token payload.
4. If the user is found, attaches:
   - `req.user` — the user document as a **lean** plain object.
   - `req.userId` — the user's `_id` as a string.
5. If the token is **missing**, **invalid**, or the user is **not found**:
   - Sets `req.user = null`.
   - Does **not** redirect or throw — the request continues normally.

---

### `requireAuth` — protects routes that need a logged-in user

1. Checks whether `req.user` exists.
2. If **not** authenticated:
   - For **XHR / API requests** (e.g. `Accept: application/json` or `X-Requested-With: XMLHttpRequest`) → return a `401 Unauthorized` JSON response.
   - For **browser requests** → redirect to `/login`.

---

### `requireRole(...roles)` — protects routes by allowed roles

1. Returns a middleware function that accepts a list of allowed role strings.
2. Checks whether `req.user.role` is included in the allowed roles list.
3. If **not** authorized:
   - For **browser requests** → render a `403 Forbidden` page.
   - For **XHR / API requests** → return a `403 Forbidden` JSON response.
