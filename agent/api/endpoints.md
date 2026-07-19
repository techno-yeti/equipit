# API Endpoints

## Auth Routes (mounted at `/`)

| Method | Path      | Auth Guards | Controller   | Description                            |
| ------ | --------- | ----------- | ------------ | -------------------------------------- |
| GET    | /login    | authLimiter | getLogin     | Render login page                      |
| GET    | /register | authLimiter | getRegister  | Render registration page               |
| POST   | /register | authLimiter | postRegister | Handle user registration submission    |
| POST   | /login    | authLimiter | postLogin    | Handle login credentials submission    |
| GET    | /logout   | —           | getLogout    | Log out current user and clear session |

## Dashboard Routes (mounted at `/dashboard`)

| Method | Path           | Auth Guards                                         | Controller       | Description                                                                           |
| ------ | -------------- | --------------------------------------------------- | ---------------- | ------------------------------------------------------------------------------------- |
| GET    | /              | requireAuth + requireRole('admin','manager','user') | getDashboard     | Render main dashboard page with stats, search, fulfillment table, unfulfilled section |
| POST   | /quick-request | requireAuth + requireRole('admin','manager')        | postQuickRequest | Handle quick request form submission                                                  |

## Equipment Routes (mounted at `/equipment`)

| Method | Path        | Auth Guards                                  | Controller          | Description                        |
| ------ | ----------- | -------------------------------------------- | ------------------- | ---------------------------------- |
| GET    | /           | requireAuth                                  | getEquipment        | List all equipment types           |
| GET    | /create     | requireAuth + requireRole('admin','manager') | getCreateEquipment  | Render create equipment form       |
| POST   | /create     | requireAuth + requireRole('admin','manager') | postCreateEquipment | Handle equipment creation          |
| GET    | /:id/edit   | requireAuth + requireRole('admin','manager') | getEditEquipment    | Render edit equipment form         |
| POST   | /:id/edit   | requireAuth + requireRole('admin','manager') | postEditEquipment   | Handle equipment update submission |
| POST   | /:id/delete | requireAuth + requireRole('admin','manager') | postDeleteEquipment | Handle equipment deletion          |
| GET    | /:id/delete | requireAuth + requireRole('admin','manager') | getDeleteEquipment  | Render delete confirmation page    |

## Template Routes (mounted at `/templates`)

| Method | Path        | Auth Guards                                  | Controller         | Description                     |
| ------ | ----------- | -------------------------------------------- | ------------------ | ------------------------------- |
| GET    | /           | requireAuth                                  | getTemplates       | List all templates              |
| GET    | /create     | requireAuth + requireRole('admin','manager') | getCreateTemplate  | Render create template form     |
| POST   | /create     | requireAuth + requireRole('admin','manager') | postCreateTemplate | Handle template creation        |
| GET    | /:id/edit   | requireAuth + requireRole('admin','manager') | getEditTemplate    | Render edit template form       |
| POST   | /:id/edit   | requireAuth + requireRole('admin','manager') | postEditTemplate   | Handle template update          |
| POST   | /:id/delete | requireAuth + requireRole('admin','manager') | postDeleteTemplate | Handle template deletion        |
| GET    | /:id/delete | requireAuth + requireRole('admin','manager') | getDeleteTemplate  | Render delete confirmation page |

## Request Routes (mounted at `/requests`)

| Method | Path         | Auth Guards                                         | Controller         | Description                                        |
| ------ | ------------ | --------------------------------------------------- | ------------------ | -------------------------------------------------- |
| GET    | /            | requireAuth + requireRole('admin','manager','user') | getRequests        | List all requests with search & filter             |
| GET    | /create      | requireAuth + requireRole('admin','manager')        | getCreateRequest   | Render create request form                         |
| POST   | /create      | requireAuth + requireRole('admin','manager')        | postCreateRequest  | Handle request creation                            |
| GET    | /:id/view    | requireAuth + requireRole('admin','manager','user') | getRequestView     | Render read-only request details                   |
| GET    | /:id/print   | requireAuth + requireRole('admin','manager','user') | getRequestPrint    | Render print-friendly request view                 |
| GET    | /:id/fulfill | requireAuth + requireRole('admin','manager')        | getFulfillForm     | Render fulfillment form (admin/manager only)       |
| POST   | /:id/fulfill | requireAuth + requireRole('admin','manager')        | postFulfillRequest | Handle fulfillment submission (admin/manager only) |
| GET    | /:id/pdf     | requireAuth + requireRole('admin','manager','user') | getViewPDF         | Serve request PDF with actual filename             |

> **Note:** The `/:id/fulfill` routes are guarded with `requireRole('admin', 'manager')`. The `user` role cannot fulfill requests. The `/:id/pdf` endpoint uses the actual basename of `request.pdfPath` in the `Content-Disposition` header.

## Depot Routes (mounted at `/depots`)

| Method | Path        | Auth Guards                                  | Controller      | Description                     |
| ------ | ----------- | -------------------------------------------- | --------------- | ------------------------------- |
| GET    | /           | requireAuth + requireRole('admin','manager') | getDepots       | List all depot sites            |
| GET    | /create     | requireAuth + requireRole('admin')           | getCreateDepot  | Render create depot form        |
| POST   | /create     | requireAuth + requireRole('admin')           | postCreateDepot | Handle depot creation           |
| POST   | /:id/delete | requireAuth + requireRole('admin')           | postDeleteDepot | Handle depot deletion           |
| GET    | /:id/delete | requireAuth + requireRole('admin')           | getDeleteDepot  | Render delete confirmation page |

## Dispatch Routes (mounted at `/dispatch`)

| Method | Path  | Auth Guards                                             | Controller      | Description                            |
| ------ | ----- | ------------------------------------------------------- | --------------- | -------------------------------------- |
| GET    | /     | requireAuth + requireRole('security','admin','manager') | getDispatch     | Render dispatch/scanning page          |
| POST   | /scan | requireAuth + requireRole('security','admin','manager') | postScanBarcode | Handle QR code/barcode scan submission |

## Admin Routes (mounted at `/admin`)

| Method | Path               | Auth Guards                        | Controller      | Description                      |
| ------ | ------------------ | ---------------------------------- | --------------- | -------------------------------- |
| GET    | /users             | requireAuth + requireRole('admin') | getUsers        | List all users with status       |
| POST   | /users/:id/approve | requireAuth + requireRole('admin') | postApproveUser | Approve a pending user           |
| POST   | /users/:id/deny    | requireAuth + requireRole('admin') | postDenyUser    | Deny a pending user              |
| POST   | /users/:id/delete  | requireAuth + requireRole('admin') | postDeleteUser  | Handle user deletion             |
| GET    | /users/:id/delete  | requireAuth + requireRole('admin') | getDeleteUser   | Render delete user confirmation  |
| POST   | /users/:id/role    | requireAuth + requireRole('admin') | postUpdateRole  | Update a user's role             |
| GET    | /config            | requireAuth + requireRole('admin') | getConfig       | View application configuration   |
| POST   | /config            | requireAuth + requireRole('admin') | postConfig      | Update application configuration |

> **Note:** All `/admin/*` routes are guarded with `requireRole('admin')`. Managers and users cannot access any admin pages.

## Trailer Routes (mounted at `/trailers`)

| Method | Path        | Auth Guards                                  | Controller        | Description                |
| ------ | ----------- | -------------------------------------------- | ----------------- | -------------------------- |
| GET    | /           | requireAuth                                  | getTrailers       | List all trailer types     |
| GET    | /create     | requireAuth + requireRole('admin','manager') | getCreateTrailer  | Render create trailer form |
| POST   | /create     | requireAuth + requireRole('admin','manager') | postCreateTrailer | Handle trailer creation    |
| GET    | /:id/edit   | requireAuth + requireRole('admin','manager') | getEditTrailer    | Render edit trailer form   |
| POST   | /:id/edit   | requireAuth + requireRole('admin','manager') | postEditTrailer   | Handle trailer update      |
| POST   | /:id/delete | requireAuth + requireRole('admin')           | postDeleteTrailer | Handle trailer deletion    |

## Help Routes (mounted at `/help`)

| Method | Path | Auth Guards | Controller | Description              |
| ------ | ---- | ----------- | ---------- | ------------------------ |
| GET    | /    | public      | getHelp    | Render help/support page |

## Other Routes

| Method | Path              | Auth Guards | Controller       | Description                                                         |
| ------ | ----------------- | ----------- | ---------------- | ------------------------------------------------------------------- |
| GET    | /                 | —           | (homepage)       | Homepage — redirects authenticated users to /dashboard or /dispatch |
| GET    | /health           | public      | (healthCheck)    | Public health check, returns JSON `{ status, timestamp }`           |
| GET    | /api/cors-origins | public      | (getCorsOrigins) | Public, returns `{ origins: [...] }` from config                    |
