# Equipit — Specification

Warehouse Equipment Management System.

**Stack:** Node.js + Express | MongoDB (Mongoose) | EJS | TailwindCSS

This specification captures the current state of the project, sufficient to recreate it exactly.

---

## Directory Layout

```
src/
├── server.js                        — Express bootstrap
├── seed.js                          — Database seeder for equipment types
├── config/
│   ├── env.js                       — Environment variable loader
│   ├── db.js                        — MongoDB connection
│   └── security.js                  — Helmet + CSP configuration
├── controllers/
│   ├── auth.controller.js           — Login, register, logout
│   ├── dashboard.controller.js      — Dashboard view, quick request creation
│   ├── equipment.controller.js      — Equipment type CRUD
│   ├── template.controller.js       — Template CRUD
│   ├── request.controller.js        — Request CRUD, view, fulfillment, PDF, dispatch
│   ├── depot.controller.js          — Depot site CRUD
│   ├── dispatch.controller.js       — Security gate barcode dispatch
│   ├── admin.controller.js          — User management, config
│   ├── help.controller.js           — Help page
│   └── trailer.controller.js        — Trailer type CRUD
├── middleware/
│   ├── auth.js                      — extractUser, requireAuth, requireRole
│   └── errorHandler.js              — Global error handler, 404 handler
├── models/
│   ├── User.js                      — User schema (role, status, depot assignment)
│   ├── Request.js                   — Request schema (status, fulfillment, PDF path)
│   ├── Template.js                  — Template schema (named equipment sets)
│   ├── EquipmentType.js             — Equipment type schema
│   ├── DepotSite.js                 — Depot site schema (isFirstSite flag)
│   ├── TrailerType.js               — Trailer type schema (label + equipment)
│   └── AppConfig.js                 — App configuration schema (key-value)
├── routes/
│   ├── auth.routes.js               — /login, /register, /logout (rate-limited)
│   ├── dashboard.routes.js          — /dashboard
│   ├── equipment.routes.js          — /equipment
│   ├── template.routes.js           — /templates
│   ├── request.routes.js            — /requests
│   ├── depot.routes.js              — /depots
│   ├── dispatch.routes.js           — /dispatch
│   ├── admin.routes.js              — /admin/users, /admin/config
│   ├── help.routes.js               — /help
│   └── trailer.routes.js            — /trailers
├── services/
│   ├── requestNumber.service.js     — Unique 6-char number generation (crypto.randomBytes)
│   ├── requestQueries.js            — Reusable Mongoose queries with populates
│   └── pdf.service.js               — PDF generation via PDFKit (Dispatch Advice Note with QR)
├── helpers/
│   ├── errorResponse.js             — serverError(), notFound() helpers
│   ├── formData.js                  — getFormData(), getEquipmentTypes(), getValidFormData()
│   └── equipmentParser.js           — parseEquipmentAllocation()
├── views/
│   ├── index.ejs                    — Landing page with hero and feature cards
│   ├── login.ejs                    — Login form
│   ├── register.ejs                 — Registration form (first-user depot setup)
│   ├── error.ejs                    — Error page
│   ├── confirm-delete.ejs           — Delete confirmation
│   ├── help.ejs                     — Help center (data-driven content blocks)
│   ├── partials/
│   │   ├── header.ejs               — HTML head, cookie banner, external JS/CSS links
│   │   ├── footer.ejs               — Footer with grouped help links
│   │   ├── navbar.ejs               — Navigation bar (role-based links, mobile hamburger)
│   │   └── addEquipmentRow.ejs      — Equipment row add/remove template
│   ├── dashboard/index.ejs          — Dashboard: stats, fulfillment table, search, unfulfilled section
│   ├── dispatch/index.ejs           — Security dispatch page with barcode input
│   ├── equipment/index.ejs          — Equipment types list
│   ├── equipment/form.ejs           — Equipment type create/edit form
│   ├── template/index.ejs           — Templates list (card layout)
│   ├── template/form.ejs            — Template create/edit form (dynamic equipment rows)
│   ├── request/index.ejs            — Requests list with search and status filter
│   ├── request/form.ejs             — Request create form (template, depot, date)
│   ├── request/fulfill.ejs          — Request fulfillment form (box + bay required)
│   ├── request/view.ejs             — Read-only request details view
│   ├── request/print.ejs            — Request print view (barcode, external print.js)
│   ├── depot/index.ejs              — Depot sites list
│   ├── depot/form.ejs               — Depot site create form
│   ├── admin/users.ejs              — User management page (approve/deny/role/depot)
│   ├── admin/config.ejs             — Domain configuration page
│   ├── trailer/index.ejs            — Trailer types list (card layout)
│   └── trailer/form.ejs             — Trailer type create/edit form (dynamic rows)
├── public/
│   ├── css/
│   │   ├── app.css                  — Compiled TailwindCSS output (minified in production)
│   │   └── input.css                — TailwindCSS input with @layer component directives
│   ├── js/
│   │   ├── cookie-banner.js         — Cookie consent banner logic (Accept/Decline, CORS fetch)
│   │   ├── equipment-rows.js        — Dynamic equipment row add/remove
│   │   ├── mobile-menu.js           — Hamburger menu toggle for responsive navbar
│   │   └── print.js                 — Print button handler for print view
│   ├── images/
│   │   └── favicon.svg              — Favicon
│   └── uploads/pdfs/                — Generated PDF output directory
├── seed.js                          — Database seeder
└── server.js                        — Entry point
```

## Root Configuration Files

- `package.json` — Dependencies and scripts
- `jest.config.js` — Jest test configuration (verbose, coverage on helpers/services/middleware)
- `postcss.config.js` — PostCSS with Tailwind + Autoprefixer
- `tailwind.config.js` — Custom color palette, shadows, Inter font family
- `.gitignore` — Ignores node_modules, .env, compiled CSS, PDFs, logs

---

## Key Project Notes

- **No JavaScript comments** — Zero comments exist in any `.js` file in the codebase.
- **CSP blocks inline scripts** — All JavaScript is loaded from external files (`/js/*.js`). No inline `<script>` tags or event handlers are used.
- **Request number auto-generation** — If the request number is left blank during creation, a 6-character alphanumeric string is auto-generated using `crypto.randomBytes`. If provided, it must match `/^[A-Za-z0-9]{6}$/`.
- **Status flow is locked** — Once a request reaches `dispatched` status, it cannot be changed. Flow: `pending` → `fulfilled` (PDF generated) → `dispatched` (locked).
- **First depot site protection** — The first depot site created during initial admin setup has `isFirstSite: true` and cannot be deleted.
- **Rate limiting on auth routes** — `/login` and `/register` are protected by `express-rate-limit` (20 requests per 15-minute window, returns 429).
- **Print view is separate** — A dedicated `request/print.ejs` page exists with barcode display. The `print.js` external script handles the print button click. Print buttons are only shown on the print view page — not on the dashboard or request list.
- **Read-only request view** — A dedicated `request/view.ejs` page provides a read-only view of request details, linked from unfulfilled sections.
- **Search by reference number** — Both the dashboard and requests pages support searching by request reference number.
- **Status filter** — The requests page includes a status filter dropdown (All / Unfulfilled / Fulfilled / Dispatched).
- **Unfulfilled requests section** — The dashboard includes a dedicated section listing pending (unfulfilled) requests.
- **Fulfill requires box AND bay number** — Both fields must be filled in before a request can be fulfilled.
- **Fulfill is admin/manager only** — The `user` role is read-only and cannot fulfill requests.
- **Users/settings are admin-only** — All `/admin/*` routes require `requireRole("admin")`.
- **PDF filename** — The Content-Disposition header uses the actual filename from `request.pdfPath`.
- **Pending approval fix** — Registration no longer auto-logs in pending users. Only the first admin setup receives an auto-login JWT.
- **Mobile-responsive navbar** — The navbar collapses into a hamburger menu on small screens via `mobile-menu.js`.
- **Cookie consent banner** — A modal overlay shown on first visit, managed by `cookie-banner.js`. Fetches live CORS origins from `/api/cors-origins`. Accept = 365 days, Decline = 30 days.
- **Trailer types** — Full CRUD for trailer configurations, each with a label and equipment allocation list.
- **Security gate dispatch** — Security users can scan barcodes to dispatch fulfilled requests. Security users are restricted to viewing only requests from their assigned depot.
