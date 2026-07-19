# Authentication flows

## Registration

- Steps:
  - Validate input (email, password, confirm).
  - Check for existing user.
  - Hash password.
  - Create user record.
  - Optionally auto-login after registration.

## Login

- Steps:
  - Validate credentials.
  - Find user by email.
  - Compare password hash.
  - On success, issue session/JWT and set cookie.
  - On failure, return generic error (no user existence hints).

## Logout

- Steps:
  - Destroy session or invalidate token.
  - Clear auth cookie.

## Password reset (optional but recommended)

- Request reset: `POST /api/v1/auth/password/forgot`
- Perform reset: `POST /api/v1/auth/password/reset`
- Use time-limited, single-use tokens stored in DB.
