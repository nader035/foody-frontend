# Foody Frontend Architecture

## Layers

- `src/app`: Next.js routing only. Pages and layouts compose feature entrypoints.
- `src/features`: pure feature modules. Each feature owns `components`, `hooks`, `services`, `types`, and `schemas`.
- `src/platform`: cross-cutting runtime concerns such as auth/session and transport.
- `src/shared`: reusable design system, branding, and business-agnostic presentational primitives.

## Boundaries

- App routes import from feature root entrypoints such as `@/features/customer`.
- Features can depend on `platform` and `shared`, but routes should not reach into feature internals.
- Shared modules stay business-agnostic. If a component needs business knowledge, it belongs in that feature.
- Auth/session state lives under `platform/auth`, not in route files or shared UI.

## Refactor Rationale

- The previous structure mixed routing, business logic, API access, and shared UI across `domains`, `features`, and `lib`.
- This shape keeps co-located behavior inside features while preserving a clean App Router surface.
- Public feature entrypoints make ownership explicit and give us a stable place to grow tests, server actions, and data adapters later.
