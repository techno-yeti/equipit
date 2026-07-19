# Integration testing

**Scope:**

- API endpoints with:
  - Express app
  - Test database (MongoDB test instance)

**Requirements:**

- Spin up an isolated DB per test run (or clear collections between tests).
- Test:
  - Auth flows (register, login, logout).
  - Protected routes.
  - Validation errors and success paths.

Use realistic HTTP requests and assert on status codes and response bodies.
