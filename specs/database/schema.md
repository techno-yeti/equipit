# Database schema (MongoDB)

**User model:**

- `email` — string, unique, required, lowercased.
- `passwordHash` — string, required.
- `role` — string, enum: `user`, `admin`, default `user`.
- `createdAt` — date, default now.
- `updatedAt` — date, auto-updated.

**Session/token models (if needed):**

- `PasswordResetToken`:
  - `userId`
  - `token` (hashed)
  - `expiresAt`
  - `used` (boolean)

**Indexes:**

- Unique index on `email`.
- TTL index on `expiresAt` for reset tokens.

Use Mongoose schemas with validation and pre-save hooks where appropriate.
