# Specifications

This directory defines _what_ to build for a MERN-style web app (MongoDB, Express, Node) **without React**, using server-rendered views and TailwindCSS.

## Structure

| Area               | Files                                                                                   |
| ------------------ | --------------------------------------------------------------------------------------- |
| **Application**    | `app/` — architecture, environment config, logging, middleware, routing, security       |
| **Authentication** | `auth/` — registration/login/logout flows, JWT/session strategy, role-based permissions |
| **Database**       | `database/` — MongoDB schemas, query patterns, migrations                               |
| **Frontend**       | `frontend/` — EJS layout, TailwindCSS setup, reusable components, forms, accessibility  |
| **Deployment**     | `deployment/` — CI/CD pipeline, production runtime                                      |
| **Testing**        | `testing/` — unit, integration, and end-to-end testing strategies                       |

## Rules for the Generator

- Read all spec files before generating code.
- Use **Express** for HTTP routing, **MongoDB** (Mongoose) for persistence, **TailwindCSS** (compiled) for styling.
- Never introduce client-side frameworks.
- Never hardcode secrets; read from environment variables defined in `app/env.md`.
- Follow the companion `agents.md` contract for consistency, security, and generation rules.

## How to Read

Start with `app/architecture.md` for the high-level structure, then explore the area you need.

See the root `README.md` for the full project overview and key design decisions.
