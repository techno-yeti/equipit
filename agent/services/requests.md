# Request Services

## 1. `requestNumber.service.js`

### Function: `generateRequestNumber()`

Generates a unique 6-character alphanumeric string for identifying requests.

#### Character Set

```
ABCDEFGHJKLMNPQRSTUVWXYZ23456789
```

> Excludes `0`, `O`, `I`, and `1` to prevent visual ambiguity.

#### Logic

1. Use `crypto.randomBytes` to generate cryptographically secure random bytes
2. Map each byte to an index in the character set to build a 6-character string
3. Check uniqueness by querying the `Request` collection for the generated number
4. If the number already exists, retry (up to **100 attempts**)
5. If all 100 attempts are exhausted without a unique number, **throw an error**

#### Returns

- `string` — A unique 6-character alphanumeric request number

#### Throws

- `Error` — If unable to generate a unique number after 100 retries

---

## 2. `requestQueries.js`

### Common Populate Array (`requestPopulate`)

```javascript
const requestPopulate = [
  { path: "equipments.equipmentType" },
  { path: "template", select: "name" },
  { path: "depotSite", select: "name" },
  { path: "createdBy", select: "name" },
  { path: "fulfilledBy", select: "name" },
];
```

Used by: `findAllRequests`, `findRequestById`

### Dispatch-Specific Populate Array (`dispatchPopulate`)

```javascript
const dispatchPopulate = [
  { path: "equipments.equipmentType" },
  { path: "depotSite", select: "name" },
];
```

Used by: `findDispatchRequests`

### Function: `findAllRequests(filters = {})`

- **Accepts an optional `filters` object** with the following optional properties:
  - `status` (string) — Filters by request status (e.g., `"pending"`, `"fulfilled"`, `"dispatched"`).
  - `search` (string) — Searches by request number using a case-insensitive regex that matches from the start of the number.
- **Query:** `Request.find(query)` where `query` is built dynamically from the provided filters.
- **Populate:** `requestPopulate`
- **Sort:** `{ createdAt: -1 }` (descending)
- **Return:** `.lean()` — plain JavaScript objects

### Function: `findRequestById(id)`

- **Query:** `Request.findById(id)`
- **Populate:** `requestPopulate`
- **Returns:** Single request document as a plain JS object, or `null`

### Function: `findRequestByNumber(requestNumber)`

- **Query:** `Request.findOne({ requestNumber })`
- **Populate:** None (lean query)
- **Returns:** Single request document as a plain JavaScript object, or `null`

### Function: `findDispatchRequests(user)`

- **Query:** `Request.find()`
  - If `user.role === 'security'`, filter by `{ depotSite: user.depotSite }`
  - Otherwise, return all requests (admin/manager)
- **Populate:** `dispatchPopulate`
- **Sort:** `{ createdAt: -1 }` (descending)
- **Returns:** Filtered requests with equipment type and depot site data, newest first

---

## Changes from Previous Versions

- **`findUnfulfilledRequests` removed** — This function no longer exists. To fetch unfulfilled (pending) requests, call `findAllRequests({ status: "pending" })` instead.
- **`findAllRequests` now accepts filters** — Previously had no parameters. Now accepts an optional `filters` object with `status` and `search` properties.
- **Search uses regex** — The `search` filter builds a case-insensitive regex against `requestNumber`, escaping special regex characters to prevent injection.
