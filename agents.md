# Generator Contract

This contract defines the mandatory rules that any code-generation agent must follow when producing the application described in `/spec`. It ensures consistency, security, and maintainability across all generated code.

If any spec file contradicts this contract, the contract takes priority unless the spec explicitly overrides it.

---

## 1. General Rules

1. Read all `.md` files under `/spec/**` before generating code.
2. Follow the structure, conventions, and requirements in those files.
3. Produce a **Node.js + Express** backend with **server-rendered views** (EJS).
4. Use **MongoDB** via Mongoose and **TailwindCSS** (compiled via PostCSS).
5. Implement authentication as defined in `/spec/auth/`.
6. Do not introduce client-side frameworks (React, Vue, Angular, etc.), inline `<script>` tags, or inline event handlers.

---

## 2. Output Structure

Create the following folders under `src/`:

```
src/
├── server.js / server.ts
├── config/
├── controllers/
├── middleware/
├── models/
├── routes/
├── services/
├── views/
└── public/
    ├── css/
    └── js/
```

Do not create additional top-level folders unless a spec requires it.

---

## 3. Code Style

- Modern JavaScript (ES modules or CommonJS per spec).
- Use `async/await` for all async operations.
- No unused variables, dead code, commented-out blocks, or `console.log` in production (except where `logging.md` allows).
- Functions interacting with DB, filesystem, network, or framework APIs may have side effects; all others should be pure.

---

## 4. Security

Implement all requirements in `/spec/app/security.md`, including:

- Helmet with CSP
- Rate limiting
- Input sanitisation
- bcrypt password hashing
- Secure cookies (`httpOnly`, `secure`, `sameSite`)
- No unsanitised user-controlled data rendered in HTML

When ambiguous, choose the **most secure** interpretation.

---

## 5. Authentication

Implement the flows in `/spec/auth/flows.md`, strategy in `/spec/auth/strategy.md`, and permissions in `/spec/auth/permissions.md`.

- Login, registration, logout
- Sessions or JWT-in-cookie (as defined in `strategy.md`)
- Role-based access control per `permissions.md`
- Never expose password hashes or sensitive fields

---

## 6. Database

Use Mongoose models per `/spec/database/schema.md`. Apply indexes as defined. Use `.lean()` for read-only queries. Prevent operator injection. Use a test database for integration tests.

---

## 7. API

Implement endpoints per `/spec/api/endpoints.md`, validate requests per `/spec/api/validation.md`, use the global error handler from `/spec/api/error-handling.md`, and return JSON in the shape defined there.

---

## 8. Frontend

- Use EJS templates with Tailwind utility classes.
- Follow `/spec/frontend/layout.md`, `/spec/frontend/components.md`, `/spec/frontend/forms.md`, and `/spec/frontend/accessibility.md`.
- No inline styles, no client-side frameworks, no uncompiled Tailwind in production.

---

## 9. Build

- Tailwind build pipeline via PostCSS.
- Output compiled CSS to `src/public/css/app.css`, minified in production.
- Use environment variables per `/spec/app/env.md`.

---

## 10. Deployment

Produce Dockerfile per `/spec/deployment/docker.md`, CI/CD config per `/spec/deployment/ci-cd.md`, and production server behaviour per `/spec/deployment/production.md`.

---

## 11. Testing

- Unit tests for helpers and validation (per `/spec/testing/unit.md`).
- Integration tests for API endpoints (per `/spec/testing/integration.md`).
- E2E tests for full user flows (per `/spec/testing/e2e.md`).
- Use a test database; never test against production.

---

## 12. Behaviour When Specs Are Missing or Ambiguous

- **Missing file:** choose the most secure and maintainable default.
- **Ambiguous spec:** choose the simplest implementation that satisfies (in order): security, maintainability, consistency.
- **Conflicting specs:** priority order:

  1. `security.md`
  2. `auth/*`
  3. `api/*`
  4. `database/*`
  5. `frontend/*`
  6. `deployment/*`
  7. `testing/*`
  8. `architecture.md`

---

## 13. File Generation Rules

- Create files only where required by the spec.
- Overwrite files only when explicitly instructed.
- Never generate placeholder code unless the spec allows it.
- Never invent new features or endpoints.

---

## 14. Update Rules

When updating code:

- Preserve existing functionality unless the spec contradicts it.
- Preserve security features, environment variable usage, and folder structure.
- Apply minimal changes needed to satisfy the updated spec.

---

## 15. Completion Criteria

The project is complete when:

- All spec files have been implemented.
- All required folders and files exist.
- All tests pass.
- The app runs in development mode, builds for production, and the Docker image builds successfully.
