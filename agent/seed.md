# Seed Script

## File: `src/seed.js`

The seed script populates the database with default equipment types required for the application to function. It is designed to be idempotent — running it multiple times will not create duplicate records.

---

## Execution

```bash
npm run seed
```

This runs `node src/seed.js` (defined in `package.json` scripts).

---

## Behavior

1. **Connect to MongoDB**: Connects using `config.mongoUri` from the application configuration module.
2. **Check for existing records**: For each default equipment type, checks if a record with that name already exists in the `EquipmentType` collection.
3. **Skip duplicates**: If a record exists, it is skipped (no update is performed).
4. **Insert new records**: Only equipment types that do not already exist are inserted.
5. **Exit codes**:
   - `process.exit(0)` — Success, all seeding completed.
   - `process.exit(1)` — Error during seeding (connection failure, insertion error, etc.).

---

## Default Equipment Types

| #   | Name       | Description                                 |
| --- | ---------- | ------------------------------------------- |
| 1   | Roll Cage  | "Standard wire roll cage for general goods" |
| 2   | Full Tray  | "Full-size tray for bulk items"             |
| 3   | Half Tray  | "Half-size tray for smaller loads"          |
| 4   | Black Base | "Black plastic base unit"                   |
| 5   | Green Base | "Green plastic base unit"                   |

Each record contains:

- `name` — Equipment type name (string, required, unique)
- `description` — Description of the equipment type (string, optional, defaults to `""`)

> **Note:** `description` is not a required field in the schema — it has a `default: ""` and `trim: true`.

---

## Error Handling

- If the database connection fails, the script logs the error and exits with code 1.
- If an insertion fails, the script logs the error and exits with code 1.
- Partial failures are not tolerated — if any insertion fails, the entire script exits with an error.
