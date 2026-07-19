# Accessibility specification

**Goals:**

- WCAG-conscious, keyboard-friendly UI.
- Screen-reader compatible structure.

**Requirements:**

- Use proper heading hierarchy (`h1`, `h2`, etc.).
- Ensure all interactive elements are reachable via keyboard (`Tab`, `Shift+Tab`).
- Visible focus states on links and buttons (Tailwind focus classes).
- Provide `aria-label` or `aria-describedby` where text is not explicit.
- Use `role="alert"` for error messages and important alerts.
- Ensure colour contrast meets accessibility guidelines for text and UI elements.
