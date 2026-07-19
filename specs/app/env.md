# Environment configuration

**Required environment variables:**

- `NODE_ENV` — `development` | `production` | `test`
- `PORT` — HTTP port
- `MONGO_URI` — MongoDB connection string
- `SESSION_SECRET` or `JWT_SECRET` — strong random secret
- `APP_BASE_URL` — public base URL (e.g. `https://example.com`)
- `LOG_LEVEL` — `debug` | `info` | `warn` | `error`
- `CORS_ALLOWED_ORIGINS` — comma-separated list

**Rules:**

- Provide a `.env.example` file with placeholders only.
- Never commit real secrets.
- Config loader must:
  - Fail fast if required variables are missing.
  - Derive booleans/arrays from strings safely.
