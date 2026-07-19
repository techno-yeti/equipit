# Equipit

Warehouse Equipment Management System — a Node.js + Express + MongoDB application for managing equipment requests, supplier templates, fulfilment tracking, and security gate dispatch workflows.

> **Stack:** Node.js + Express | MongoDB (Mongoose) | EJS | TailwindCSS

## Features

- **Equipment Types** — Dynamic CRUD for warehouse equipment (roll cages, trays, bases)
- **Templates** — Reusable equipment sets assigned to suppliers; required when creating a request
- **Trailer Types** — CRUD for trailer configurations with equipment allocations
- **Requests** — 6-character alphanumeric request numbers (auto-generated if blank), lifecycle tracking (Pending → Fulfilled → Dispatched) with fulfilment dates. Search by reference number, filter by status. Depot column in list view.
- **Fulfilment** — Box/Bay number required at fulfilment with client-side sanitization and validation. Fulfilment date recorded.
- **Dispatch Note Editing** — Edit box/bay numbers and delivery dispatch notes on fulfilled and dispatched requests. Regenerates the PDF with updated details.
- **PDF Dispatch Advice Notes** — Auto-generated on fulfilment with equipment allocation, storage location (box/bay numbers), QR code for gate scanning, and authorisation section
- **Security Dispatch** — Barcode scanning at the security gate to dispatch loads; security users are restricted to their assigned depot
- **Dashboard** — Fulfilment-based view with date picker and search. Shows requests grouped by fulfilment date plus a read-only unfulfilled requests section.
- **Request View** — Read-only request details page accessible from unfulfilled sections; users can view but not print or fulfil
- **User Management** — Admin approval workflow with role-based access (Admin, Manager, User, Security) and depot assignment. Users, settings, and depots are admin-only.
- **Depot Sites** — Multi-depot support with depot assignment for security users. The first depot site is protected and cannot be deleted.
- **Domain Restrictions** — Restrict registration to specific email domains via admin configuration
- **Cookie Consent Banner** — Modal overlay on first visit explaining the authentication cookie, with Accept/Decline options and a live CORS origins display
- **Mobile-Responsive Navbar** — Hamburger menu toggle on small screens with role-based navigation links
- **Security Headers** — CSP (Content Security Policy) via Helmet blocks inline scripts and inline event handlers; all JavaScript is in external files
- **Rate Limiting** — Auth routes (`/login`, `/register`) are rate-limited to 20 requests per 15-minute window

## Directory Layout

```
src/
├── server.js                — Express bootstrap
├── seed.js                  — Database seeder for equipment types
├── config/                  — Environment, DB, and security config loaders
├── controllers/             — Request handlers (auth, dashboard, admin, etc.)
├── middleware/               — Auth (extractUser, requireAuth, requireRole), error handling
├── models/                  — Mongoose schemas (User, Request, Template, etc.)
├── routes/                  — Domain-based route modules with role guards
├── services/                — Business logic (PDF generation, request numbers, queries)
├── helpers/                 — Shared utilities (equipment parser, error responses, form data)
├── views/                   — EJS templates (6 root views + 20 subdirectory views + 4 partials)
│   ├── partials/            — header, footer, navbar, addEquipmentRow
│   ├── request/view.ejs     — Read-only request details (no print capability)
│   ├── request/print.ejs             — Print view with barcode (included via external print.js)
│   ├── request/edit-dispatch-note.ejs— Edit box/bay numbers and dispatch notes
│   └── ...
├── public/                  — Compiled CSS, external JS files, images
│   ├── css/
│   │   ├── input.css        — TailwindCSS input with @layer components
│   │   └── app.css          — Compiled TailwindCSS output (minified in production)
│   ├── js/
│   │   ├── cookie-banner.js    — Cookie consent banner logic
│   │   ├── equipment-rows.js   — Dynamic equipment row add/remove
│   │   ├── mobile-menu.js      — Hamburger menu toggle for responsive navbar
│   │   ├── print.js            — Print button handler for print view
│   │   ├── sanitize-location.js— Input sanitization for box/bay number fields
│   │   └── validate-fulfill.js — Client-side validation for fulfilment form
│   └── images/
│       └── favicon.svg      — Favicon
└── uploads/pdfs/            — Generated PDF output directory
agent/                       — Project agent configuration
specs/                       — Project specification markdown files (architecture, auth, database, frontend, testing, deployment)
test/                        — Jest test suites (40 tests across 6 files)
```

## Prerequisites

- Node.js 20.x or later
- MongoDB 7.x or later

## Local Development Setup

```bash
git clone <repository-url>
cd equipit
npm install
cp .env.example .env
```

Edit `.env` with your local MongoDB connection string:

```
NODE_ENV=development
PORT=3000
MONGO_URI=mongodb://localhost:27017/equipit
JWT_SECRET=generate-a-strong-random-secret-here
APP_BASE_URL=http://localhost:3000
LOG_LEVEL=debug
CORS_ALLOWED_ORIGINS=http://localhost:3000
```

Build Tailwind CSS and seed initial equipment types:

```bash
npm run build:css
npm run seed
```

Start the development server:

```bash
npm run dev
```

Open http://localhost:3000 and register the first user — they automatically become the system Administrator.

## Available Scripts

| Script      | Command                                                |
| ----------- | ------------------------------------------------------ |
| `start`     | `NODE_ENV=production node src/server.js`               |
| `dev`       | Tailwind watch + nodemon concurrently                  |
| `build:css` | Tailwind build to `src/public/css/app.css` (minified)  |
| `test`      | `npx jest --forceExit` (40 tests)                      |
| `seed`      | `node src/seed.js` (idempotent equipment types seeder) |

## Request Lifecycle

```
Pending → Fulfilled (PDF generated) → Dispatched (locked)
```

- **Pending**: Awaiting fulfilment. Admins/managers can fulfil the request. Box Number and Bay Number are required at fulfilment time.
- **Fulfilled**: Equipment allocated. PDF Dispatch Advice Note is generated. Storage location and dispatch note can be edited (PDF regenerates on save). Fulfilled requests can be dispatched at the security gate.
- **Dispatched**: Load has left the depot. Status is locked once dispatched. Dispatch details remain editable.

## User Roles

| Role         | Permissions                                                                                      |
| ------------ | ------------------------------------------------------------------------------------------------ |
| **Admin**    | Full access: users, settings, depots, all CRUD. Users and settings are admin-only.               |
| **Manager**  | Create/edit equipment, templates, trailers, and requests. Fulfil and delete.                     |
| **User**     | Read-only. View dashboard and requests, search by reference number, download PDFs.               |
| **Security** | Gate dispatch only. Barcode scanning to dispatch loads. Restricted to assigned depot.            |

### Approval Flow

- New users register with **Pending** status
- An admin must **Approve** or **Deny** the account before login is allowed
- The first user to register is automatically approved as Admin
- Approving/denying users, assigning roles, and managing settings are admin-only actions

## Environment Variables

| Variable               | Description                                  | Required |
| ---------------------- | -------------------------------------------- | -------- |
| `NODE_ENV`             | `development`, `production`, or `test`       | Yes      |
| `PORT`                 | HTTP port                                    | Yes      |
| `MONGO_URI`            | MongoDB connection string                    | Yes      |
| `JWT_SECRET`           | Strong random secret for JWT signing         | Yes      |
| `JWT_EXPIRES_IN`       | Token expiry duration (default: `7d`)        | No       |
| `APP_BASE_URL`         | Public base URL (e.g. `https://example.com`) | Yes      |
| `LOG_LEVEL`            | `debug`, `info`, `warn`, or `error`          | No       |
| `CORS_ALLOWED_ORIGINS` | Comma-separated allowed CORS origins         | No       |

## Environment Notice

A `.env` file is required to run the application. Copy `.env.example` to `.env` and populate all required variables (`MONGO_URI`, `JWT_SECRET`, `APP_BASE_URL`). The application will throw an error at startup if any required variable is missing.

## Server Deployment

When deploying to a production server, environment variables should be set at the system level rather than relying solely on a `.env` file. This ensures they persist across restarts and are not accidentally committed to version control.

### Recommended .env for Production

```env
NODE_ENV=production
PORT=3000
MONGO_URI=mongodb://localhost:27017/equipit
JWT_SECRET=replace-with-a-strong-random-string-at-least-32-chars
JWT_EXPIRES_IN=7d
APP_BASE_URL=https://your-domain.com
LOG_LEVEL=info
CORS_ALLOWED_ORIGINS=https://your-domain.com
```

> **Important:** Generate `JWT_SECRET` with a cryptographically strong random value. You can use `openssl rand -hex 32` to generate one.

### Setting Persistent Environment Variables

Choose the method that matches your server setup:

#### Using systemd (recommended for Linux servers)

If you run the app as a systemd service, add environment variables to the service unit file:

```ini
# /etc/systemd/system/equipit.service
[Service]
Environment="NODE_ENV=production"
Environment="PORT=3000"
Environment="MONGO_URI=mongodb://localhost:27017/equipit"
Environment="JWT_SECRET=your-generated-secret"
Environment="APP_BASE_URL=https://your-domain.com"
Environment="LOG_LEVEL=info"
Environment="CORS_ALLOWED_ORIGINS=https://your-domain.com"
```

Then reload and restart:

```bash
sudo systemctl daemon-reload
sudo systemctl restart equipit
```

#### Using a .env file with PM2

If you use PM2 as a process manager, create an `ecosystem.config.js`:

```js
module.exports = {
  apps: [{
    name: 'equipit',
    script: 'src/server.js',
    env: {
      NODE_ENV: 'production',
      PORT: 3000,
      MONGO_URI: 'mongodb://localhost:27017/equipit',
      JWT_SECRET: 'your-generated-secret',
      APP_BASE_URL: 'https://your-domain.com',
      LOG_LEVEL: 'info',
      CORS_ALLOWED_ORIGINS: 'https://your-domain.com'
    }
  }]
};
```

Start with:

```bash
pm2 start ecosystem.config.js
pm2 save      # persist across reboots
pm2 startup   # auto-start on boot
```

#### Using /etc/environment (system-wide)

For a simpler setup, add variables to `/etc/environment` (applies to all users):

```bash
sudo tee -a /etc/environment << 'EOF'
NODE_ENV=production
PORT=3000
MONGO_URI=mongodb://localhost:27017/equipit
JWT_SECRET=your-generated-secret
APP_BASE_URL=https://your-domain.com
LOG_LEVEL=info
CORS_ALLOWED_ORIGINS=https://your-domain.com
EOF
```

Variables in `/etc/environment` are loaded at boot and persist across restarts. Note that you'll need to reboot or re-login for changes to take effect.

#### Using export in shell profile (per-user)

Add to `~/.bashrc` or `~/.profile`:

```bash
export NODE_ENV=production
export PORT=3000
export MONGO_URI=mongodb://localhost:27017/equipit
export JWT_SECRET=your-generated-secret
export APP_BASE_URL=https://your-domain.com
export LOG_LEVEL=info
export CORS_ALLOWED_ORIGINS=https://your-domain.com
```

> This method only applies when the user logs in interactively. For services started at boot, prefer systemd or PM2 methods above.

## License

MIT License

Copyright (c) 2026 Julian Moors

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
