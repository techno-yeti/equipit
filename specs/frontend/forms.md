# Forms specification

**General rules:**

- Use semantic `<form>`, `<label>`, `<input>`, `<button>`.
- Associate labels with inputs via `for`/`id`.
- Show validation errors near fields.

**Styling:**

- Inputs:
  - Full width where appropriate.
  - Tailwind classes for border, focus ring, padding, rounded corners.
- Error state:
  - Red border and text.
  - Small error message text below the field.

**Forms required:**

- Login form:
  - Email/username, password, submit button.
- Registration form:
  - Email, password, password confirmation.
- Password reset request and reset forms (if implemented in auth flows).

Client-side JS is optional; server-side validation is mandatory.
