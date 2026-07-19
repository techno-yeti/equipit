# Production deployment

**Runtime environment:**

- Node.js LTS.
- Reverse proxy (e.g. Nginx) terminating TLS.
- App runs behind proxy, trusting `X-Forwarded-*` headers.

**Requirements:**

- Force HTTPS at the proxy level.
- Configure:
  - Health check endpoint.
  - Graceful shutdown (handle SIGTERM).
- Logging:
  - Structured logs to stdout/stderr for aggregation.
- Scaling:
  - Horizontal scaling via multiple app instances if needed.
  - Sticky sessions if using in-memory sessions (or use shared session store).
