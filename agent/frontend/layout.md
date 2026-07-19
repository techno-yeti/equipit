# EJS Layout Structure

## Partials

### `header.ejs`

This partial is included at the top of every view. It handles the opening HTML document structure.

- Outputs the `<!DOCTYPE html>` declaration and opening `<html lang="en">` tag.
- Renders a `<head>` block containing:
  - `<meta charset="UTF-8">` and `<meta name="viewport" content="width=device-width, initial-scale=1.0">`
  - **Title**: If a `title` variable is passed, renders `{title} | Equipit`. Otherwise defaults to `Equipit`.
  - **Inter font** from Google Fonts (`https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap`)
  - `app.css` stylesheet link (`/css/app.css`)
  - Favicon link (`/favicon.ico`)
  - Cookie banner script: `<script src="/js/cookie-banner.js" defer></script>`
  - Cookie consent banner `<div>` (hidden by default via `hidden` class)
- Opens the `<body>` tag with Tailwind classes `class="min-h-screen flex flex-col"`.

### `navbar.ejs`

Renders the navigation bar. Expects a `user` object in the view data.

- **Position**: Sticky top navigation (`sticky top-0 z-50`)
- **Logo**: Links to the dashboard or landing page
- **Role-based nav links**: Conditionally rendered based on `user.role`:
  - Dashboard (all roles)
  - Dispatch (requires `user.role === 'security'`, `'admin'`, or `'manager'`)
  - Admin links (user management, config) shown only for admin role
- **Mobile hamburger menu**: On small screens, the nav links collapse into a hamburger menu toggled via `mobile-menu.js`. The `#mobileMenuToggle` button toggles `aria-expanded` and shows/hides the `#mobileMenu` element. Links auto-close the menu on click.
- **User info**: Displays the user's role badge and full name
- **Logout button**: Form/button that POSTs to `/auth/logout`
- Opens the `<main>` content wrapper div: `<div class="flex-grow">`

### `footer.ejs`

This partial is included at the bottom of every view. It closes the main content div and renders the footer.

- Closes the `<main>` wrapper div (opened by `navbar.ejs`)
- Renders a `<footer>` containing:
  - **4-column Help link grid** with the following sections:
    - Getting Started
    - Requests
    - Operations
    - Administration
  - Copyright line: `&copy; {currentYear} Equipit. All rights reserved.`
- Closes the `<body>` and `<html>` tags.

## Inclusion Pattern

All EJS views follow the same pattern:

**Top of the file:**

```ejs
<%- include('../partials/header', { title: 'Page Title' }) %>
```

**Bottom of the file:**

```ejs
<%- include('../partials/footer') %>
```

### Path Resolution for Nested Views

Views residing in subdirectories (e.g., `dashboard/`, `dispatch/`, `equipment/`, `template/`, `request/`, `depot/`, `admin/`, `trailer/`) use relative paths from their own directory:

```ejs
<%- include('../../partials/header', { title: 'Dashboard' }) %>
```

This resolves as: from `views/dashboard/index.ejs`, look up to `views/`, then into `partials/header.ejs`.
