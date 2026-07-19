# Authentication Flows

## 1. Login — `POST /login`

**Steps:**

1. Validate that `email` and `password` are present (non-empty).
2. Look up the user by their **lowercased** email address.
3. Compare the supplied password against the stored bcrypt hash.
4. Check the user's `status` field:
   - `'pending'` — reject with a message indicating the account is pending approval.
   - `'denied'` — reject with a message indicating access has been denied.
   - `'approved'` — proceed.
5. Sign a JWT containing `{ userId: user._id }` with a **7-day expiry** using the configured `JWT_SECRET`.
6. Set an **httpOnly cookie** named `token` with the signed JWT.
7. Redirect based on the user's role:
   - `security` → `/dispatch`
   - all others → `/dashboard`

---

## 2. Registration — `POST /register`

**Steps:**

1. Validate that all required fields are present (email, password, confirm password, name).
2. Check that `password === confirmPassword` and that password is at least **8 characters**.
3. Check that the email is **unique** (not already registered).
4. Determine the new user's role and status:
   - **First admin user** → role `'admin'`, status `'approved'`.
   - **Subsequent users** → role `'user'`, status `'pending'`.
5. Optionally enforce a **domain restriction** (checked against `AppConfig.allowedDomains`). If the user's email domain is not allowed, registration is rejected. Domain restrictions do not apply to the first admin setup.
6. If this is the **first admin setup**, also create an **initial depot site** (a default depot named by the admin).
7. Redirect / respond:
   - **First admin** → **auto-login** by setting the JWT `token` cookie and redirecting to `/dashboard`.
   - **Subsequent users (pending)** → render the login page with a success message telling them their account is pending approval. **No JWT cookie is set** — the user cannot log in until an admin approves their account.
8. The first admin is automatically assigned as the creator of the initial depot site after the user document is saved.

---

## 3. Logout — `GET /logout`

**Steps:**

1. Clear the `token` cookie (set its value to `''` and `maxAge` to `0`).
2. Redirect to `/login`.

---

## 4. `GET /login` — Render Login Form

- If the user is **already authenticated** (valid JWT cookie present), redirect to `/dashboard`.
- Otherwise, render the login page template.

---

## 5. `GET /register` — Render Registration Form

- If the user is **already authenticated** (valid JWT cookie present), redirect to `/dashboard`.
- Check how many users exist in the system:
  - `userCount === 0` → `isFirstUser: true` — show text input for naming the first depot site.
  - `userCount > 0` → `isFirstUser: false` — show depot site dropdown populated from existing sites.
- Pass the list of available **depot sites** for the user to select from (or empty array for first user).
