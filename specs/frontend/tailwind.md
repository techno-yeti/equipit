# TailwindCSS specification

**Setup:**

- Use Tailwind via a build step (e.g. PostCSS).
- Generate a single production CSS file in `public/css/app.css`.

**Config (`tailwind.config.js`):**

- `content` paths:
  - `./src/views/**/*.ejs`
  - `./src/public/**/*.js`
- Custom theme:
  - Primary colour palette (e.g. blue)
  - Neutral greys
  - Font stack (e.g. `Inter`, system fallback)
- Plugins:
  - Typography (optional)
  - Forms (for consistent form styling)

**Rules:**

- Avoid inline styles.
- Use component-like class patterns (documented in `components.md`).
- Enable purge/`content` to remove unused styles in production.
