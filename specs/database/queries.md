# Database query patterns

**General rules:**

- Use Mongoose models for all DB access.
- Never construct queries from unsanitised user input.
- Prefer lean queries (`.lean()`) for read-only operations.

**Patterns:**

- Pagination:
  - Use `limit` and `skip` with sane maximums.
- User lookup:
  - By `email` for login.
  - By `_id` for profile.

**Error handling:**

- Catch and wrap DB errors in a consistent error format.
- Do not expose raw MongoDB error messages to clients.
