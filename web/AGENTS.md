# RestInvoice Web Application

This document provides essential information for AI coding agents working on the RestInvoice web application.

## Project Overview

RestInvoice is a web application for managing and customizing invoice templates. It provides a visual template editor, system template browsing, user template management, and API key administration. The application is built as a React SPA deployed to Cloudflare Pages.

**Key Features:**
- Authentication via Clerk (OAuth providers + Email)
- Browse system-provided invoice templates
- Create and manage custom templates
- Visual template editor with Handlebars syntax support
- API key management for programmatic access
- Dashboard with invoice generation testing

## Technology Stack

| Category | Technology |
|----------|------------|
| Framework | React 19.1.1 |
| Language | TypeScript 5.8.3 |
| Build Tool | Vite 7.1.2 |
| Styling | Tailwind CSS 4.1.18 |
| UI Components | shadcn/ui + Radix UI |
| Auth | Clerk (@clerk/clerk-react) |
| Routing | React Router DOM 7.12.0 |
| Forms | react-hook-form + Zod |
| Template Engine | Handlebars 4.7.8 |
| Code Editor | Monaco Editor (@monaco-editor/react) |
| Icons | Lucide React |
| Date Handling | date-fns |
| Deployment | Cloudflare Pages (via Wrangler) |

## Project Structure

```
src/
├── components/           # React components
│   ├── api-keys/        # API key management components
│   ├── auth/            # Authentication-related components
│   ├── dashboard/       # Dashboard-specific components
│   ├── layout/          # Layout components (Header, AuthenticatedLayout)
│   ├── templates/       # Template-related components
│   ├── ui/              # shadcn/ui components and shared UI primitives
│   └── theme-provider.tsx # Theme context provider
├── pages/               # Route-level page components
│   ├── auth/            # Login/Logout pages
│   ├── ApiKeysPage.tsx
│   ├── DashboardPage.tsx
│   ├── MyTemplatesPage.tsx
│   ├── TemplatesPage.tsx
│   └── TemplateEditorPage.tsx
├── lib/                 # Utilities and API
│   ├── api/             # API client modules
│   │   ├── client.ts    # Base ApiClient class
│   │   └── modules/     # API endpoint modules
│   ├── constants/       # Application constants
│   ├── transformers/    # Data transformers
│   ├── utils.ts         # Utility functions (cn, formatDateTime, formatNumber)
│   ├── templateRenderer.ts
│   └── monaco-themes.ts
├── types/               # TypeScript type definitions
│   ├── api-key.types.ts
│   ├── pagination.types.ts
│   └── template.types.ts
├── styles/              # Additional styles (if any)
├── App.tsx              # Main application component with routes
├── main.tsx             # Application entry point
└── index.css            # Global styles and CSS variables

specs/                   # Feature specifications
├── login-flow.md
└── templates.md

public/                  # Static assets
```

## Build and Development Commands

```bash
# Development server
npm run dev

# Production build
npm run build

# Preview production build locally with Wrangler
npm run preview

# Deploy to Cloudflare Pages
npm run deploy

# Generate Cloudflare Worker types
npm run cf-typegen

# Linting (ESLint)
npm run lint

# Code quality (Biome - primary linter/formatter)
npm run biome:check          # Check for issues
npm run biome:check:write    # Fix issues
npm run biome:format         # Check formatting
npm run biome:format:write   # Fix formatting
npm run biome:lint           # Run linter
npm run biome:lint:write     # Fix lint issues
npm run biome:ci             # CI mode (strict)
```

## Configuration Files

| File | Purpose |
|------|---------|
| `vite.config.ts` | Vite configuration with React and Tailwind plugins |
| `tsconfig.json` | TypeScript project references |
| `tsconfig.app.json` | TypeScript config for application code |
| `tsconfig.node.json` | TypeScript config for Vite config |
| `wrangler.jsonc` | Cloudflare Wrangler configuration for deployment |
| `biome.json` | Biome linter/formatter configuration |
| `eslint.config.js` | ESLint configuration |
| `components.json` | shadcn/ui configuration |
| `.env` | Environment variables (VITE_CLERK_PUBLISHABLE_KEY) |

## API Architecture

The application uses a centralized API client pattern:

**Base Client:** `src/lib/api/client.ts`
- `ApiClient` class with methods: `get()`, `post()`, `patch()`, `delete()`
- Supports authentication tokens via `options.token`
- Query parameter support for GET requests
- Base URL from `import.meta.env.VITE_API_URL` or defaults to `http://localhost:8787`

**API Modules:** `src/lib/api/modules/`
- `templates.ts` - Template CRUD operations
- `api-keys.ts` - API key management

**Authentication:**
All authenticated requests use Clerk's `getToken()` to obtain a JWT, passed via the `Authorization: Bearer <token>` header.

## Routing Structure

| Route | Component | Auth Required |
|-------|-----------|---------------|
| `/login` | LoginPage | No |
| `/logout` | LogoutPage | No |
| `/` | DashboardPage | Yes |
| `/templates` | TemplatesPage | Yes |
| `/my-templates` | MyTemplatesPage | Yes |
| `/my-templates/:id/edit` | TemplateEditorPage | Yes |
| `/api-keys` | ApiKeysPage | Yes |

Protected routes are wrapped with `<RequireAuth>` component that redirects to `/login` if not authenticated.

## Design System and Code Style

### Color Tokens (Semantic Only)

**CRITICAL:** Never use literal color scales (e.g., `text-red-500`). Always use semantic CSS variables:

- Backgrounds: `bg-background`, `bg-card`, `bg-muted`
- Text: `text-primary`, `text-secondary`, `text-muted-foreground`
- Accents: `bg-primary`, `border-input`, `ring-ring`
- States: `text-destructive`, `bg-accent`
- Sidebar: `bg-sidebar`, `text-sidebar-foreground`, etc.

### Layout Standards

**Page Container:** All authenticated pages inherit layout from `AuthenticatedLayout`:
```tsx
<main className="mx-auto max-w-7xl px-4 py-6">{children}</main>
```

Pages must NOT define their own padding or max-width. Use `space-y-6` wrapper:
```tsx
// ✅ CORRECT
<div className="space-y-6">
  <PageHeader ... />
  {/* Content */}
</div>

// ❌ WRONG - Don't add px-6 py-4 max-w-7xl
```

### Border Radius Scale

| Size | Class | Use Case |
|------|-------|----------|
| Small | `rounded-md` | Buttons, Inputs, Badges |
| Medium | `rounded-lg` | Icon containers, Small cards |
| Large | `rounded-xl` | Cards, Modals, Sheets |

### Spacing Standards

- Card vertical padding: `py-6` (24px)
- Card horizontal padding: `px-6` (24px)
- Button height: `h-11` (44px minimum touch target)
- Form field gap: `gap-6` between sections, `gap-3` label-to-input

### Component Patterns

**Buttons:** Must include icon + label composition:
```tsx
<Button>
  <Icon className="h-4 w-4" />
  Label
</Button>
```

**Page Header:**
```tsx
<PageHeader
  icon={IconComponent}
  title="Page Title"
  description="Optional description"
  action={<Button>...</Button>}
/>
```

**Form Validation:** Use Zod schemas with react-hook-form for all forms with validation.

### Responsive Design

- **Mobile First:** Base styles target mobile (< 640px)
- **Breakpoints:** `sm:`, `md:`, `lg:`, `xl:`, `2xl:`
- **Touch Targets:** Minimum 44px × 44px
- **Tables:** Convert to card-based layouts or horizontal scroll on mobile
- **Modals:** Full-screen or near full-screen on mobile (`w-full h-full`)

## TypeScript Guidelines

- **Strict Mode:** Enabled with `noUnusedLocals` and `noUnusedParameters`
- **Path Aliases:** Use `@/` prefix for imports from `src/` (e.g., `@/components/ui/button`)
- **Type Definitions:** Store shared types in `src/types/`
- **API Types:** Match server response structures in API modules

## Authentication

Uses Clerk React SDK with shadcn/ui theme integration:

```tsx
// In main.tsx
<ClerkProvider
  publishableKey={import.meta.env.VITE_CLERK_PUBLISHABLE_KEY}
  appearance={{ theme: shadcn }}
>
```

**RequireAuth Component:** Wraps protected routes, redirects to `/login` if not signed in.

**Get Auth Token:**
```tsx
const { getToken } = useAuth();
const token = await getToken();
```

## Testing

Currently, the project does not have automated tests configured. When adding tests:
- Consider Vitest for unit testing
- Consider Playwright for E2E testing
- Place test files adjacent to source files or in `__tests__` directories

## Deployment

**Platform:** Cloudflare Pages

**Build Output:** `./dist` directory

**Commands:**
```bash
# Deploy to production
npm run deploy

# Preview locally (requires build first)
npm run preview
```

**Environment Variables:**
- `VITE_CLERK_PUBLISHABLE_KEY` - Clerk public key (required)
- `VITE_API_URL` - Backend API base URL (optional, defaults to localhost:8787)

**Wrangler Configuration:**
See `wrangler.jsonc` for Cloudflare-specific settings including compatibility dates and build output directory.

## Security Considerations

1. **Authentication:** All API calls requiring authentication must include a valid Clerk JWT token
2. **API Keys:** API keys are displayed only once upon creation (handled via `CopyInput` component)
3. **Destructive Actions:** All delete operations must use `ConfirmDialog` component with explicit user confirmation
4. **Environment Variables:** Never commit `.env` files - use `.env.example` for templates

## Common Patterns

### API Call with Auth
```tsx
const { getToken } = useAuth();
const token = await getToken();
const data = await templatesApi.list(token);
```

### Form with Validation
```tsx
const form = useForm({
  resolver: zodResolver(schema),
  defaultValues: { ... },
});
```

### Copy to Clipboard
```tsx
<CopyButton value="text-to-copy" variant="ghost" size="icon" />
// or
<CopyInput value="text-to-copy" />
```

### Loading Skeleton
```tsx
const { isLoaded } = useClerk();
{!isLoaded ? <Skeleton /> : <ActualComponent />}
```

## Additional Resources

- **Design System:** See `design-concept.md` for comprehensive UI/UX guidelines
- **Feature Specs:** See `specs/` directory for feature-specific documentation
- **shadcn/ui:** Components follow shadcn/ui patterns - refer to their documentation
