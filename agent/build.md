# Build Configuration

## 1. package.json Scripts

| Script      | Command                                                                                                                    |
| ----------- | -------------------------------------------------------------------------------------------------------------------------- |
| `start`     | `NODE_ENV=production node src/server.js`                                                                                   |
| `dev`       | `concurrently "npx tailwindcss -i ./src/public/css/input.css -o ./src/public/css/app.css --watch" "nodemon src/server.js"` |
| `build:css` | `npx tailwindcss -i ./src/public/css/input.css -o ./src/public/css/app.css --minify`                                       |
| `test`      | `npx jest --forceExit`                                                                                                     |
| `seed`      | `node src/seed.js`                                                                                                         |

> **Note:** The compiled Tailwind output is `app.css` (not `output.css`).

---

## 2. Dependencies

| Package              | Purpose                           |
| -------------------- | --------------------------------- |
| `express`            | Web framework                     |
| `mongoose`           | MongoDB ODM                       |
| `ejs`                | Template engine                   |
| `bcryptjs`           | Password hashing                  |
| `jsonwebtoken`       | JWT signing and verification      |
| `cookie-parser`      | Cookie parsing                    |
| `cors`               | Cross-origin resource sharing     |
| `helmet`             | Security headers (CSP via Helmet) |
| `morgan`             | HTTP request logging              |
| `express-rate-limit` | Rate limiting (auth routes)       |
| `express-validator`  | Request validation                |
| `dotenv`             | Environment variable loading      |
| `pdfkit`             | PDF generation                    |
| `qrcode`             | QR code generation                |

---

## 3. Dev Dependencies

| Package        | Purpose                           |
| -------------- | --------------------------------- |
| `jest`         | Test runner                       |
| `nodemon`      | Auto-restart during development   |
| `tailwindcss`  | Utility-first CSS framework       |
| `postcss`      | CSS post-processor                |
| `autoprefixer` | Vendor prefix injection           |
| `concurrently` | Run multiple commands in parallel |

---

## 4. Tailwind CSS Configuration

**Content paths** (where Tailwind scans for class usage):

```
./src/views/**/*.ejs
./src/public/js/**/*.js
```

**Custom color palette:**

| Token            | Hex       | Usage                            |
| ---------------- | --------- | -------------------------------- |
| `primary-50`     | `#eef3ff` | Light backgrounds, hover states  |
| `primary-100`    | `#dae4ff` | Selected states                  |
| `primary-200`    | `#bdd0ff` | Borders / muted accents          |
| `primary-300`    | `#90b1ff` | Interactive element borders      |
| `primary-400`    | `#5d87ff` | Default button, primary actions  |
| `primary-500`    | `#3563e9` | Hover states on primary elements |
| `primary-600`    | `#2546d0` | Active states                    |
| `primary-700`    | `#1e36a9` | Dark text / headings on light bg |
| `primary-800`    | `#1e3089` | Darker variant                   |
| `primary-900`    | `#1e2b6f` | Darkest variant, deep accents    |
| `sidebar-bg`     | `#ffffff` | Sidebar background               |
| `sidebar-hover`  | `#f5f7fb` | Nav item hover background        |
| `sidebar-active` | `#eef3ff` | Nav item active background       |
| `sidebar-text`   | `#2A3547` | Nav item text color              |
| `sidebar-muted`  | `#7C8FAC` | Secondary / muted text           |
| `surface`        | `#F6F9FC` | Page background                  |
| `surface-card`   | `#ffffff` | Card / container background      |
| `surface-border` | `#EBF1FF` | Subtle borders                   |

**Font family:**

```js
sans: ["Inter", "system-ui", "-apple-system", "sans-serif"];
```

**Custom shadows:**

| Token        | Value                                                                |
| ------------ | -------------------------------------------------------------------- |
| `card`       | `0 1px 3px 0 rgb(0 0 0 / 0.05), 0 1px 2px -1px rgb(0 0 0 / 0.05)`    |
| `card-hover` | `0 4px 6px -1px rgb(0 0 0 / 0.07), 0 2px 4px -2px rgb(0 0 0 / 0.05)` |
| `nav`        | `0 1px 3px 0 rgb(0 0 0 / 0.04)`                                      |

---

## 5. PostCSS Configuration

```js
module.exports = {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
};
```

---

## 6. Jest Configuration

| Option                | Value                                                                       |
| --------------------- | --------------------------------------------------------------------------- |
| `testEnvironment`     | `node`                                                                      |
| `testMatch`           | `**/__tests__/**/*.test.js`                                                 |
| `setupFiles`          | `['./test/setup.js']`                                                       |
| `verbose`             | `true`                                                                      |
| `collectCoverageFrom` | `['src/helpers/**/*.js', 'src/services/**/*.js', 'src/middleware/**/*.js']` |

Test suites (40 tests total): `authMiddleware` (13), `config` (5), `equipmentParser` (10), `errorResponse` (4), `formData` (3), `requestNumber` (5).

---

## 7. .gitignore

```
node_modules/
.env
src/public/css/app.css
src/uploads/pdfs/*
!src/uploads/pdfs/.gitkeep
dist/
*.log
.DS_Store
```
