# CI/CD specification

**Pipeline stages:**

1. **Install:**
   - Install dependencies with lockfile.
2. **Lint & test:**
   - Run linter.
   - Run unit and integration tests.
3. **Build:**
   - Build Tailwind CSS and any compiled assets.

**Rules:**

- Fail the pipeline on any test or lint error.
- Use environment-specific configuration for staging vs production.
