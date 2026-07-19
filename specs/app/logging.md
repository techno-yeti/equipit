# Logging specification

**Goals:**

- Provide enough information for debugging and auditing.
- Avoid logging sensitive data (passwords, tokens, secrets).

**Levels:**

- `debug` — development-only details.
- `info` — high-level events (user login, logout, registration).
- `warn` — recoverable issues.
- `error` — unexpected failures.

**Implementation:**

- Use a logger with:
  - Timestamps
  - Log level
  - Correlation/request ID (if available)
- Log:
  - Incoming requests (method, path, status, duration) at `info` in production.
  - Errors in the global error handler with stack traces (only to logs, not responses).
