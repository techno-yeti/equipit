# Environment Variables

The application loads configuration from a `.env` file located at the project root using `dotenv`. Three variables are **required** and will throw an error at startup if missing.

---

## Env Vars

| Variable | Description | Required | Default |
|---|---|---|---|
| `NODE_ENV` | Application environment: `'development'`, `'production'`, or `'test'` | Yes | `'development'` |
| `PORT` | HTTP port the server listens on | Yes | `3000` |
| `MONGO_URI` | MongoDB connection string | **Yes †** | — |
| `JWT_SECRET` | Strong random secret used for JWT signing | **Yes †** | — |
| `JWT_EXPIRES_IN` | Token expiry duration (e.g. `'7d'`, `'24h'`) | No | `'7d'` |
| `APP_BASE_URL` | Public-facing base URL of the application | **Yes †** | — |
| `LOG_LEVEL` | Logging verbosity: `'debug'`, `'info'`, `'warn'`, `'error'` | No | `'info'` |
| `CORS_ALLOWED_ORIGINS` | Comma-separated list of allowed CORS origins | No | `''` (empty array) |

> **†** These three variables (`MONGO_URI`, `JWT_SECRET`, `APP_BASE_URL`) are **hard-required** — the config loader throws if any of them is missing.

---

## Derived Boolean Flags

The config object exposes three derived boolean values computed from `NODE_ENV`:

| Key | Logic |
|---|---|
| `isProduction` | `true` when `NODE_ENV === 'production'` |
| `isTest` | `true` when `NODE_ENV === 'test'` |
| `isDevelopment` | `true` when `NODE_ENV === 'development'` |

These are used throughout the app to toggle behaviour such as cookie security, error stack traces, and HSTS headers.
