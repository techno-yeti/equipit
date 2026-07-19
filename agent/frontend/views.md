# EJS Views and Expected Data

## 1. `views/index.ejs` — Landing Page

**Route:** `GET /`
**Data:** `{ user }`

- **Hero section**: Equipit branding with tagline, "Get Started" button (links to `/register` if no user, `/dashboard` if authenticated), "Sign In" button (links to `/login`).
- **Feature cards section**: Grid of cards highlighting key features (Equipment Management, Request Workflow, Dispatch Tracking, Multi-depot support).

---

## 2. `views/login.ejs` — Login Form

**Route:** `GET /login`
**Data:** `{ error, user }`

- **Error alert**: Conditionally rendered when `error` is set (e.g., invalid credentials, account not approved).
- **Email input**: `<input type="email">`, labeled "Email Address".
- **Password input**: `<input type="password">`, labeled "Password".
- **Submit button**: "Sign In"
- **Registration link**: "Don't have an account? Register here" linking to `/register`.

---

## 3. `views/register.ejs` — Registration Form

**Route:** `GET /register`
**Data:** `{ error, user, isFirstUser, depotSites }`

- **First user flow** (`isFirstUser === true`): Shows `depotSiteName` text input for the first user to name their depot site.
- **Subsequent user flow** (`isFirstUser === false`): Shows a `depotSite` dropdown populated from `depotSites` array.
- **Fields**: Name, Email, Password, Confirm Password.
- **Error alert**: Conditionally rendered when `error` is set.
- **Submit button**: "Create Account".

---

## 4. `views/error.ejs` — Error Page

**Route:** Varies (error middleware)
**Data:** `{ message, error, user }`

- **Error icon**: Warning or exclamation icon.
- **Message text**: Displays `message` or falls back to a generic message.
- **Buttons**:
  - "Go to Dashboard" — links to `/dashboard`
  - "Go Back" — JavaScript `history.back()`

---

## 5. `views/confirm-delete.ejs` — Delete Confirmation

**Route:** Varies (delete confirmation pages)
**Data:** `{ entityName, cancelUrl, deleteUrl, user }`

- **Warning icon**: Trash or warning icon.
- **Entity name**: Displays `entityName` in bold (e.g., "Are you sure you want to delete 'Roll Cage'?")
- **Cancel button**: Links to `cancelUrl`.
- **Delete button**: POST form targeting `deleteUrl` with destructive styling (`btn-danger`).

---

## 6. `views/help.ejs` — Help Center

**Route:** `GET /help`
**Data:** `{ user }`

- **Data-driven template**: Uses a JavaScript `sections` array defined in the view to render help content.
- **8 sections**:
  1. Getting Started
  2. Dashboard
  3. Equipment Types
  4. Templates
  5. Requests
  6. Security Dispatch
  7. User Management
  8. Cookies & Privacy
- **Each section contains**: `title` (string), `subtitle` (string), and `contentBlocks` (array).
- **Content block types**:
  - `text` — Paragraph text
  - `subhead` — Sub-heading within a section
  - `features` — Bulleted feature list
  - `steps` — Numbered step list
  - `lifecycle` — Request lifecycle diagram explanation
  - `note` — Info/tip callout box
  - `placeholder` — Placeholder for future content
- **Quick Reference cards**: Rendered at the top of the page linking to key sections.
- **Back-to-top links**: Rendered after each section.

---

## 7. `views/dashboard/index.ejs` — Dashboard

**Route:** `GET /dashboard`
**Data:** `{ requests, templates, equipmentTypes, depotSites, stats, user, error, filterDate, search, showUnfulfilled, unfulfilledRequests }`

- **Welcome message**: Greets the user by name.
- **Search bar**: Text input for searching by reference number (max 6 chars, `font-mono`). Works alongside the date filter.
- **Date picker**: Filters the dashboard data by fulfillment date (`filterDate`).
- **Stat cards**: 4 stat cards using the `stat-card` component:
  - Total Requests (`stats.total`)
  - Pending (`stats.pending`)
  - Fulfilled (`stats.fulfilled`)
  - Dispatched (`stats.dispatched`)
- **Search indicator**: When `search` is non-empty, shows a search results banner with a "Clear" link.
- **Fulfillment table**: Table showing recent requests by fulfillment date with actions per row. Actions column only shows the **PDF** button (no print button).
- **Unfulfilled requests section**: Conditionally rendered when `unfulfilledRequests.length > 0`. Shows a table of pending requests with a "View all →" link to `/requests?status=pending`. Each row has a **View** button linking to `/requests/:id/view`.
- **Error alert**: Conditionally rendered when `error` is set.

---

## 8. `views/dispatch/index.ejs` — Dispatch

**Route:** `GET /dispatch`
**Data:** `{ requests, user, error, success }`

- **Barcode input**: Text input for scanning/entering dispatch barcode.
- **Recent requests table**: Table showing recent requests with their dispatch status.
- **Error/success alerts**: Conditionally rendered.

---

## 9. `views/equipment/index.ejs` — Equipment List

**Route:** `GET /equipment`
**Data:** `{ equipment, user, error }`

- **Table columns**: Name, Description, Created Date, Actions (Edit / Delete).
- **"Add Equipment" button**: Links to `/equipment/create`.
- **Error alert**: Conditionally rendered.

---

## 10. `views/equipment/form.ejs` — Equipment Form (Create/Edit)

**Routes:** `GET /equipment/create`, `GET /equipment/:id/edit`
**Data:** `{ equipment (null for create), user, error }`

- **Dynamic title**: "Create Equipment" when `equipment` is null, "Edit Equipment" otherwise.
- **Dynamic action URL**: Form POSTs to `/equipment/create` for new records, `/equipment/:id` for edits.
- **Fields**: Name (text input), Description (textarea).
- **Error alert**: Conditionally rendered.

---

## 11. `views/template/index.ejs` — Template List

**Route:** `GET /templates`
**Data:** `{ templates, user, error }`

- **Card-based layout**: Each template displayed as a `card` component.
- **Content per card**: Template name, supplier name, embedded equipment table listing equipment types and quantities.
- **Actions per card**: Edit and Delete buttons.
- **"Add Template" button**: Links to `/templates/create`.

---

## 12. `views/template/form.ejs` — Template Form (Create/Edit)

**Routes:** `GET /templates/create`, `GET /templates/:id/edit`
**Data:** `{ template, equipmentTypes, user, error }`

- **Fields**: Name (text input), Supplier (text input).
- **Dynamic equipment rows**: Users can add/remove equipment type rows (type dropdown + quantity input).
- **JavaScript**: Equipment row management via `equipment-rows.js`.
- **Error alert**: Conditionally rendered.

---

## 13. `views/request/index.ejs` — Request List

**Route:** `GET /requests`
**Data:** `{ requests, user, error, search, statusFilter }`

- **Search bar**: Text input for searching by reference number (max 6 chars, `font-mono`).
- **Status filter**: Dropdown select with options: All statuses, Unfulfilled (`pending`), Fulfilled (`fulfilled`), Dispatched (`dispatched`).
- **"New Request" button**: Visible only for `admin` and `manager` roles. Links to `/requests/create`.
- **Clear link**: Shows when either `search` or `statusFilter` is active, linking to `/requests` to clear filters.
- **Table columns**: Request Number, Supplier, Status, Depot, Created By, Fulfilled By, Created, Actions.
- **Actions per row**:
  - PDF (links to `/requests/:id/pdf` in a new tab, only shown when `r.pdfPath` exists)
  - Fulfill (links to `/requests/:id/fulfill`, only shown for `pending` requests AND `admin`/`manager` roles)
- **No print button** is rendered anywhere on the page.

---

## 14. `views/request/form.ejs` — Request Create Form

**Route:** `GET /requests/create`
**Data:** `{ templates, equipmentTypes, depotSites, user, error }`

- **Fields**:
  - Request Number (auto-generated, read-only or pre-filled)
  - Supplier (text input)
  - Template (dropdown populated from `templates`)
  - Depot (dropdown populated from `depotSites`)
  - Fulfillment Date (date picker)
- **Template selection** populates equipment allocation.

---

## 15. `views/request/fulfill.ejs` — Fulfill Form

**Route:** `GET /requests/:id/fulfill`
**Data:** `{ request, user, error }`

- **Request summary**: Displays request number, supplier, status, depot, and dates.
- **Box AND Bay number inputs**: Both fields are validated server-side. Fulfillment is rejected with an error if either is missing. Both are required before fulfilling.
- **Equipment allocation table**: Editable table showing each equipment type and the quantity being fulfilled.
- **Error alert**: Conditionally rendered when validation fails (e.g., "Both Box Number and Bay Number are required before fulfilling.").
- **Access**: Only `admin` and `manager` roles can access this page. The `user` role is redirected or denied by route guard.

---

## 16. `views/request/view.ejs` — Read-Only Request View

**Route:** `GET /requests/:id/view`
**Data:** `{ request, user }`

- **Read-only page** — No forms or edit controls.
- **Header**: "Request: {requestNumber}" with a "Back" button linking to `/`.
- **Detail card**: Grid of fields showing Status (badge), Supplier, Depot Site, Created By, Created At.
- **Fulfillment details**: If `request.status !== 'pending'`, additionally shows Fulfilled By, Box Number, Bay Number.
- **Equipment table**: Lists all allocated equipment types with their quantities.
- **No navigation/footer changes**: Uses the standard navbar and footer partials.

---

## 17. `views/request/print.ejs` — Print View

**Route:** `GET /requests/:id/print`
**Data:** `{ request, user }`

- **Request details**: Request number, supplier, depot, dates.
- **Equipment table**: Full equipment allocation list with quantities.
- **Dispatch barcode**: Rendered barcode for dispatch scanning.
- **External print script** — The `print.js` file (`/js/print.js`) listens for a click on `#printBtn` and calls `window.print()`. Included via `<script src="/js/print.js" defer></script>`.
- **No navigation/footer**: Minimal layout suitable for printing.

---

## 18. `views/depot/index.ejs` — Depot List

**Route:** `GET /depots`
**Data:** `{ depots, user, error }`

- **Table columns**: Name, Created By, First Site (badge showing the first depot site name), Created Date.
- **Actions**: Delete button per depot.
- **"Add Depot" button**: Links to `/depots/create`.

---

## 19. `views/depot/form.ejs` — Depot Create Form

**Route:** `GET /depots/create`
**Data:** `{ depot, user, error }`

- **Fields**: Name (text input).
- **Error alert**: Conditionally rendered.
- **Submit button**: "Create Depot".

---

## 20. `views/admin/users.ejs` — User Management

**Route:** `GET /admin/users`
**Data:** `{ users, depots, user, error, success }`

- **Admin-only access**: Route guarded by `requireRole("admin")`.
- **Table columns**: Name, Email, Role (dropdown to change), Depot (dropdown to assign), Status (badge).
- **Actions per row**:
  - Approve (for pending users)
  - Deny (for pending users)
  - Delete
- **Success/Error alerts**: Conditionally rendered.

---

## 21. `views/admin/config.ejs` — Domain Configuration

**Route:** `GET /admin/config`
**Data:** `{ domains, user, error, success }`

- **Admin-only access**: Route guarded by `requireRole("admin")`.
- **Textarea**: For entering/editing allowed registration domains (one per line).
- **Current domains display**: Shows currently configured domains as badges.
- **Registration flow info**: Explanation text about how domain restrictions affect registration.
- **Success/Error alerts**: Conditionally rendered.

---

## 22. `views/trailer/index.ejs` — Trailer List

**Route:** `GET /trailers`
**Data:** `{ trailers, user, error }`

- **Card layout**: Each trailer displayed as a `card` component.
- **Content per card**: Trailer label, equipment count (number of equipment types assigned).
- **Actions**: Edit and Delete buttons per card.
- **"Add Trailer" button**: Links to `/trailers/create`.

---

## 23. `views/trailer/form.ejs` — Trailer Form (Create/Edit)

**Routes:** `GET /trailers/create`, `GET /trailers/:id/edit`
**Data:** `{ trailer, equipmentTypes, user, error }`

- **Fields**: Label (text input).
- **Dynamic equipment rows**: Users can add/remove equipment type rows (type dropdown + quantity input).
- **Partial**: Equipment rows rendered using the `addEquipmentRow.ejs` partial.
- **Error alert**: Conditionally rendered.
