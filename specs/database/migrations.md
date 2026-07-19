# Schema changes and migrations

**Approach:**

- Use a simple migration mechanism (scripts or a library) to apply schema/data changes.

**Requirements:**

- Migrations must be:
  - Idempotent or tracked with a `migrations` collection.
  - Versioned and documented.
- Provide:
  - A command to run all pending migrations.
  - A clear process for adding new migrations.

Document any manual steps required for production deployments.
