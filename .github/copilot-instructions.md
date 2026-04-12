# GitHub Copilot Instructions - Landlord Management App

## Architecture Overview

**Monorepo Structure**: pnpm workspace with backend (Fastify), frontend (React Native/Expo), and shared packages.

```
src/
├── apps/
│   ├── backend/     # Fastify API server
│   └── frontend/    # React Native + Expo mobile app
└── shared/
    ├── db/          # Drizzle ORM schemas, migrations
    └── types/       # Shared TypeScript types & validations
```

## Development Workflow

**Start Development**: Use root-level scripts for concurrent development:

- `pnpm dev:backend` - Fastify server with auto-restart + OpenAPI generation
- `pnpm dev:frontend` - Expo dev server + API client generation

**Backend Development**: Features are plugin-based. Each feature has `plugin.ts`, `routes/`, and `services/`. Always use the authentication decorator: `fastify.addHook("preHandler", authenticate(fastify))`.

**Frontend Development**: API client is auto-generated from backend OpenAPI. Never manually write API calls - use generated clients from `@/api`.

## Key Patterns & Conventions

### Backend API Patterns

```typescript
// Standard route structure with Zod validation
typedFastify.get(
  "/:id",
  {
    schema: {
      operationId: "getResource",
      params: paramSchema("id"),
      response: {
        200: responseWrapper(resourceSchema),
        ...errorResponses,
      },
    },
  },
  getResourceRoute(fastify),
);
```

### Database & Types

- **Single Source of Truth**: All types derive from Drizzle schemas in `shared/db/src/schema/`
- **Role System**: Users belong to organizations with roles (ADMIN/owner, COLLECTOR, USER/tenant)
- **Type Imports**: Frontend uses `@/types` (maps to shared/db types), backend uses `@db/types`

### Permission System

Use the `usePermissions()` hook for role-based UI:

```typescript
const { hasPermission, isAdmin } = usePermissions();
if (hasPermission("canCreateProperties")) {
  // Show create button
}
```

### Response Patterns

- **Backend**: Always wrap responses with `responseWrapper()` or `paginatedResponseWrapper()`
- **Frontend**: API responses follow `{ success, data, error }` structure

## Domain Model

**Core Entities**:

- Organizations (multi-tenant)
- Users (with roles per organization)
- Properties (rental units)
- Tenants (renters)
- Rents (rental agreements)

**Key Relationships**: Organization → Users → Properties → Tenants ← Rents

## Critical Files

- `src/apps/backend/src/server.ts` - Main server setup & plugin registration
- `src/shared/db/src/schema.ts` - Database schema exports
- `src/apps/frontend/providers/auth-provider.tsx` - Authentication context
- `pnpm-workspace.yaml` - Workspace configuration

## Development Rules

1. **Never bypass type generation** - Backend changes auto-update frontend API client
2. **Follow feature plugin pattern** - New backend features need plugin.ts + routes/ + services/
3. **Use shared types** - Import from `@/types` (frontend) or `@db/types` (backend)
4. **Respect permissions** - Use `PermissionGuard` or `hasPermission()` for UI access control
5. **Database changes require migrations** - Use Drizzle Kit: `pnpm db:generate`

## Colors & Branding

Primary: `#3338A0` | Secondary: `#C59560` | Accent: `#FCC61D` | Background: `#F7F7F7`
