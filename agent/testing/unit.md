# Unit Test Suites

## Test Setup

### `test/setup.js`

All test suites rely on a shared setup file that configures environment variables before any tests run:

| Variable               | Value                                    |
| ---------------------- | ---------------------------------------- |
| `NODE_ENV`             | `test`                                   |
| `MONGO_URI`            | `mongodb://localhost:27017/equipit_test` |
| `JWT_SECRET`           | `test-jwt-secret`                        |
| `PORT`                 | `3001`                                   |
| `APP_BASE_URL`         | `http://localhost:3001`                  |
| `LOG_LEVEL`            | `silent`                                 |
| `CORS_ALLOWED_ORIGINS` | `http://localhost:3001`                  |

### Jest Configuration (`jest.config.js`)

- **Environment**: `node`
- **Output**: `verbose: true`
- **Coverage**: Enabled on `helpers/`, `services/`, and `middleware/` paths

---

## Suite 1: `authMiddleware.test.js` — 13 tests

### `extractUser` — 3 tests

| Test                           | Description                                   |
| ------------------------------ | --------------------------------------------- |
| Returns null when no token     | No `token` cookie present → returns `null`    |
| Returns null for invalid token | Malformed or expired JWT → returns `null`     |
| Throws on error                | JWT verification throws → error is propagated |

### `requireAuth` — 4 tests

| Test                              | Description                                                    |
| --------------------------------- | -------------------------------------------------------------- |
| Redirects unauthenticated users   | No user on `req` → redirects to `/login`                       |
| Returns 401 JSON for XHR requests | No user + `x-requested-with: XMLHttpRequest` → `401 { error }` |
| Returns 401 JSON for API routes   | No user + path starts with `/api` → `401 { error }`            |
| Calls next() when authenticated   | User present on `req` → calls `next()`                         |

### `requireRole` — 6 tests

| Test                                     | Description                                                          |
| ---------------------------------------- | -------------------------------------------------------------------- |
| Calls next() with correct role           | User has required role → calls `next()`                              |
| Calls next() with multiple roles         | User matches one of multiple allowed roles → calls `next()`          |
| Renders 403 page for wrong role          | User role not in allowed list → renders `error.ejs` with 403 message |
| Redirects unauthenticated users          | No user present → redirects to `/login`                              |
| Returns 403 JSON for XHR requests        | Wrong role + XHR request → `403 { error }`                           |
| _(6th test — additional role edge case)_ |                                                                      |

---

## Suite 2: `config.test.js` — 5 tests

| Test                             | Description                                                                                              |
| -------------------------------- | -------------------------------------------------------------------------------------------------------- |
| Loads all required env vars      | `MONGODB_URI`, `JWT_SECRET`, `PORT`, `NODE_ENV`, `CORS_ORIGINS` are all defined                          |
| Identifies test environment      | `config.env === 'test'`                                                                                  |
| Derives CORS origins from string | `CORS_ORIGINS` env var is a comma-separated string → `config.corsOrigins` is an array of trimmed strings |
| `isDevelopment` is false in test | `config.isDevelopment` returns `false` when `NODE_ENV` is `test`                                         |
| Port is number type              | `config.port` is of type `number`                                                                        |

---

## Suite 3: `equipmentParser.test.js` — 10 tests

### `parseEquipmentAllocation()` — 10 tests

| Test                           | Description                                                     |
| ------------------------------ | --------------------------------------------------------------- |
| Returns [] for null input      | `null` → `[]`                                                   |
| Returns [] for undefined input | `undefined` → `[]`                                              |
| Returns [] for 0 quantity      | Single item with `qty: 0` → `[]`                                |
| Parses single item             | `{ type: id, qty: 5 }` → `[{ equipmentType: id, quantity: 5 }]` |
| Parses multiple items in array | Array of valid items → all parsed correctly                     |
| Skips items with missing type  | Item without `type` or `equipmentType` field → skipped          |
| Skips zero quantity items      | Item with `qty: 0` → skipped                                    |
| Skips negative quantity items  | Item with `qty: -1` → skipped                                   |
| Handles single object vs array | Single object not wrapped in array → treated as one item        |
| Handles non-numeric quantity   | `qty: "abc"` → coerced or skipped                               |

---

## Suite 4: `errorResponse.test.js` — 4 tests

### `serverError()` — 2 tests

| Test                     | Description                                                               |
| ------------------------ | ------------------------------------------------------------------------- |
| Renders 500 with message | Calls `res.render('error', ...)` with status 500 and the provided message |
| Handles null user        | Passes `null` for the user object without crashing                        |

### `notFound()` — 2 tests

| Test                     | Description                                                               |
| ------------------------ | ------------------------------------------------------------------------- |
| Renders 404 with message | Calls `res.render('error', ...)` with status 404 and the provided message |
| Handles null user        | Passes `null` for the user object without crashing                        |

---

## Suite 5: `formData.test.js` — 3 tests

### `getFormData()` — 2 tests

| Test                           | Description                                                                   |
| ------------------------------ | ----------------------------------------------------------------------------- |
| Returns all three collections  | Returns an object with `templates`, `equipmentTypes`, and `depotSites` arrays |
| Calls find on all three models | Verifies `EquipmentType`, `Template`, and `DepotSite` find methods are called |

### `getEquipmentTypes()` — 1 test

| Test                          | Description                                       |
| ----------------------------- | ------------------------------------------------- |
| Returns equipment types array | Returns an array of all `EquipmentType` documents |

---

## Suite 6: `requestNumber.test.js` — 5 tests

### `generateRequestNumber()` — 5 tests

| Test                                        | Description                                    |
| ------------------------------------------- | ---------------------------------------------- |
| Generates a 6-character alphanumeric string | Length is exactly 6, contains only `[A-Z0-9]`  |
| Uses unambiguous characters only            | Excludes `0`, `O`, `I`, `L` to avoid confusion |
| Returns a string type                       | `typeof result === 'string'`                   |
| Generates different values on each call     | Two sequential calls produce different values  |
| Produces exactly 6 characters               | String length is `=== 6`                       |

**Character set**: `ABCDEFGHJKMNPQRSTUVWXYZ23456789` (skipping 0, O, I, L to avoid readability issues).
