# Role-Based Permission Matrix

## Role Definitions

| Role       | Access                                                                                                                                           |
| ---------- | ------------------------------------------------------------------------------------------------------------------------------------------------ |
| `admin`    | Full access. Can manage users, settings, depots, and all CRUD operations including **delete**. Can create and fulfill requests.                  |
| `manager`  | Can create / edit equipment types, templates, and requests. Can **fulfill** requests. Cannot manage users or settings.                           |
| `user`     | **Read-only.** Can view the dashboard and requests list, view request details, and download PDFs. Cannot create, fulfill, or modify any records. |
| `security` | Gate dispatch only. Barcode scanning to dispatch fulfilled loads. Restricted to **assigned depot**.                                              |

---

## Route-Level Guards

| Route                      | Methods                 | Allowed Roles                           |
| -------------------------- | ----------------------- | --------------------------------------- |
| `/`                        | `GET`                   | **public** (redirects based on auth)    |
| `/dashboard`               | `GET`                   | `admin`, `manager`, `user`              |
| `/dashboard/quick-request` | `POST`                  | `admin`, `manager`                      |
| `/equipment`               | `GET`                   | any authenticated                       |
| `/equipment`               | `POST`, `PUT`, `DELETE` | `admin`, `manager`                      |
| `/templates`               | `GET`, `POST`           | `admin`, `manager`                      |
| `/templates`               | `DELETE`                | `admin`, `manager`                      |
| `/requests`                | `GET`                   | `admin`, `manager`, `user`              |
| `/requests`                | `POST`                  | `admin`, `manager`                      |
| `/requests/:id/view`       | `GET`                   | `admin`, `manager`, `user`              |
| `/requests/:id/fulfill`    | `GET`, `POST`           | `admin`, `manager`                      |
| `/requests/:id/pdf`        | `GET`                   | `admin`, `manager`, `user`              |
| `/requests/:id/print`      | `GET`                   | `admin`, `manager`, `user`              |
| `/dispatch`                | `GET`                   | `security`, `admin`, `manager`          |
| `/dispatch/scan`           | `POST`                  | `security`, `admin`, `manager`          |
| `/depots`                  | `GET`                   | `admin`, `manager`                      |
| `/depots`                  | `POST`, `DELETE`        | `admin`                                 |
| `/admin/*`                 | `GET`, `POST`           | `admin`                                 |
| `/trailers`                | `GET`                   | any authenticated                       |
| `/trailers`                | `POST`, `PUT`           | `admin`, `manager`                      |
| `/trailers`                | `DELETE`                | `admin`                                 |
| `/help`                    | `GET`                   | **public** (no authentication required) |

---

## Key Permissions Summary

- **Users & Settings management** — `admin` only. All `/admin/*` routes require `requireRole("admin")`.
- **Fulfill requests** — `admin` and `manager` only. The `user` role has no access to fulfill routes.
- **Create requests** — `admin` and `manager` only. The `user` role cannot create requests.
- **View requests** — `admin`, `manager`, and `user` can all view the requests list and read-only view pages.
- **PDF download** — Available to all authenticated roles (`admin`, `manager`, `user`).
- **Print view** — Available to all authenticated roles. A print button with external `print.js` script is rendered on the print view page only. The dashboard and request list show only the PDF button (no print button).
