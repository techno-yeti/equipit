# Layout specification

**Layout engine:** EJS (or similar) with a base layout file.

**Base layout:**

- `<html lang="en">`
- `<head>`:
  - `<meta charset="utf-8">`
  - `<meta name="viewport" content="width=device-width, initial-scale=1">`
  - Page `<title>` block
  - Link to compiled Tailwind CSS file
- `<body>`:
  - Top navigation bar (brand, auth links)
  - Main content container
  - Footer

**Pages:**

- `index` — public landing page.
- `auth/login` — login form.
- `auth/register` — registration form.
- `dashboard/index` — authenticated dashboard.

Use Tailwind utility classes for layout (flex, grid, spacing) and keep markup minimal and semantic.
