# RestInvoice API - Agent Guide

This guide provides essential information for AI coding agents working on the RestInvoice API project.

## Project Overview

RestInvoice API is a RESTful API backend for managing invoice templates and API keys. It's designed to run on Cloudflare Workers with authentication via Clerk.

### Technology Stack

| Component | Technology |
|-----------|------------|
| **Runtime** | Cloudflare Workers (Edge) |
| **Framework** | [Hono](https://hono.dev/) + `@hono/zod-openapi` |
| **Language** | TypeScript (ESNext) |
| **Authentication** | Clerk (`@hono/clerk-auth`) |
| **Database** | Cloudflare D1 (SQLite) |
| **Key-Value Storage** | Cloudflare KV |
| **Validation** | Zod |
| **API Documentation** | Swagger UI via `@hono/swagger-ui` |
| **Formatter/Linter** | Biome |

## Project Structure

```
├── src/
│   ├── index.ts              # Main entry point, route mounting
│   ├── models/               # Zod schemas for API validation
│   │   ├── api-keys.ts       # API key request/response schemas
│   │   ├── pagination.ts     # Pagination schemas
│   │   └── template.ts       # Template schemas
│   ├── routes/               # API route handlers
│   │   ├── api-keys.ts       # /v1/api-keys endpoints
│   │   └── templates.ts      # /v1/templates endpoints
│   └── utils/                # Utility modules
│       ├── auth.ts           # Authentication helpers
│       ├── crypto.ts         # API key generation
│       ├── db.ts             # QueryBuilder for D1
│       ├── defaults.ts       # Default template HTML/variables
│       └── slug.ts           # Friendly slug generation
├── migrations/               # D1 database migrations
├── specs/                    # API specifications (Markdown)
├── scripts/                  # Utility scripts
├── wrangler.jsonc            # Cloudflare Workers config
├── biome.json                # Code style configuration
└── .dev.vars                 # Local environment variables
```

## Build and Development Commands

```bash
# Install dependencies
npm install

# Start local development server (uses Wrangler dev server)
npm run dev

# Deploy to production
npm run deploy

# Generate Cloudflare types based on wrangler.jsonc
npm run cf-typegen
```

### Code Quality Commands

```bash
# Check all (format + lint)
npm run biome:check

# Fix all auto-fixable issues
npm run biome:check:write

# Check formatting only
npm run biome:format

# Fix formatting
npm run biome:format:write

# Lint only
npm run biome:lint

# Fix lint issues
npm run biome:lint:write

# CI mode (strict, no write)
npm run biome:ci
```

### Database Commands

```bash
# Create a new migration
npm run db:create

# Apply migrations locally
npm run db:migrate:local

# Apply migrations to production
npm run db:migrate:prod
```

## Code Style Guidelines

The project uses **Biome** for formatting and linting. Key rules:

- **Indentation**: 2 spaces
- **Line width**: 100 characters
- **Quotes**: Double quotes
- **Semicolons**: Always required
- **Arrow functions**: Always use parentheses
- **Trailing commas**: ES5 style (no trailing commas in function parameters)

### Important Lint Rules

| Rule | Severity |
|------|----------|
| `noUnusedVariables` | Error |
| `noUnusedImports` | Error |
| `useConst` | Warning |
| `useTemplate` | Warning |
| `noExplicitAny` | Warning |
| `noDoubleEquals` | Warning |

Note: Configuration files (`*.config.js`, `*.config.ts`, `wrangler.jsonc`, `worker-configuration.d.ts`) are excluded from linting.

## Architecture

### Route Organization

Routes follow a RESTful structure under `/v1`:

| Endpoint | Description | Auth Required |
|----------|-------------|---------------|
| `GET /` | Health check | No |
| `GET /doc` | OpenAPI JSON spec | No |
| `GET /ui` | Swagger UI | No |
| `GET /v1/templates` | List user templates | Yes (Clerk) |
| `GET /v1/templates/system` | List system templates | Yes (Clerk) |
| `GET /v1/templates/:id` | Get template by ID/slug | Yes (Clerk) |
| `POST /v1/templates` | Create template | Yes (Clerk) |
| `PATCH /v1/templates/:id` | Update template | Yes (Clerk) |
| `DELETE /v1/templates/:id` | Delete template | Yes (Clerk) |
| `GET /v1/api-keys` | List API keys | Yes (Clerk) |
| `POST /v1/api-keys` | Create API key | Yes (Clerk) |
| `DELETE /v1/api-keys/:ref` | Revoke API key | Yes (Clerk) |

### Authentication

All protected routes use Clerk JWT authentication via middleware:

```typescript
import { clerkMiddleware } from "@hono/clerk-auth";
import { requireAuth } from "../utils/auth";

// Global middleware
app.use("*", clerkMiddleware());

// Route handler
const auth = requireAuth(c); // Throws 401 if not authenticated
const userId = auth.userId;  // Clerk user ID
```

### Database Access Pattern

Use the custom `QueryBuilder` in `src/utils/db.ts` for D1 queries:

```typescript
import { db } from "../utils/db";

// Simple query
const results = await db(c.env.DB)
  .table("templates")
  .where("user_id", userId)
  .get();

// Paginated query
const { data, meta } = await db(c.env.DB)
  .table("api_keys")
  .where("user_id", userId)
  .orderBy("created_at", "desc")
  .paginate(page, perPage);
```

The QueryBuilder provides:
- SQL injection protection via identifier validation and prepared statements
- Fluent API for building queries
- Automatic pagination metadata

### OpenAPI Documentation

Routes are documented using `@hono/zod-openapi`:

```typescript
import { createRoute, OpenAPIHono, z } from "@hono/zod-openapi";

const route = createRoute({
  method: "get",
  path: "/",
  request: { query: PaginationQuerySchema },
  tags: ["Templates"],
  responses: {
    200: {
      content: { "application/json": { schema: ResponseSchema } },
      description: "Success",
    },
    401: { description: "Unauthorized" },
  },
});

app.openapi(route, async (c) => { /* handler */ });
```

## Environment Variables

Local development uses `.dev.vars` (do not commit):

```
CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...
```

Production variables are configured in Cloudflare Dashboard.

## Cloudflare Bindings

Defined in `wrangler.jsonc`:

| Binding | Type | Description |
|---------|------|-------------|
| `DB` | D1 Database | SQLite database for persistent storage |
| `RESTINVOICE_API_KEY` | KV Namespace | Stores API key secrets (never in D1) |

## API Key Security Model

API keys follow a split storage pattern for security:

- **Public reference** (`ref`): Stored in D1 with metadata
- **Secret**: Stored in KV only, never in D1
- **Format**: `riv_{env}_{ref}_{secret}`

Example key generation in `src/utils/crypto.ts`.

## Testing

Currently, there are no automated tests. Testing is done via:

1. **Local development**: `npm run dev` + manual API testing
2. **Swagger UI**: Available at `http://localhost:8787/ui` when running locally
3. **API specs**: Reference `specs/` directory for endpoint documentation

## Deployment

The project deploys to Cloudflare Workers:

```bash
npm run deploy
```

This uses Wrangler with minification enabled. The `wrangler.jsonc` defines the compatibility date and bindings.

## Development Conventions

### File Naming
- Routes: `kebab-case.ts` (e.g., `api-keys.ts`)
- Utils: `kebab-case.ts` (e.g., `slug.ts`)
- Models: Singular noun, `kebab-case.ts`

### Type Safety
- All routes use typed bindings via `OpenAPIHono<{ Bindings: CloudflareBindings }>`
- Zod schemas define all request/response shapes
- TypeScript strict mode is enabled

### Error Handling
- Use `HTTPException` from `hono/http-exception` for auth errors
- Return consistent error format: `{ message: string }` with appropriate HTTP status
- Log errors to console for debugging

### Date/Time Handling
- Store timestamps as Unix epoch integers (seconds)
- Use `Math.floor(Date.now() / 1000)` for current time

## Security Considerations

1. **SQL Injection**: Always use QueryBuilder or prepared statements; never interpolate SQL
2. **User Isolation**: All queries must filter by `user_id`
3. **API Keys**: Secrets stored in KV only; refs in D1 only
4. **CORS**: Currently configured for `http://localhost:5173` (adjust for production)
5. **Input Validation**: All inputs validated via Zod schemas
6. **Slug Validation**: Slugs follow pattern `/^[a-z0-9]+(-[a-z0-9]+)*$/`

## Useful References

- [Hono Documentation](https://hono.dev/)
- [Zod Documentation](https://zod.dev/)
- [Cloudflare Workers](https://developers.cloudflare.com/workers/)
- [Cloudflare D1](https://developers.cloudflare.com/d1/)
- [Cloudflare KV](https://developers.cloudflare.com/kv/)
- [Clerk Backend SDK](https://clerk.com/docs/references/backend/overview)
