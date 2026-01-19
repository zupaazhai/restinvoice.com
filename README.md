# RestInvoice

> **REST API-powered Invoice & Receipt PDF Generation Platform**

A developer-first platform that eliminates the pain of integrating PDF libraries by providing simple REST APIs for invoice and receipt generation. Send JSON, get beautiful PDFs.

---

## 🎯 Problem Statement

Developers often need to generate invoices or receipts in their applications, but:

1. **PDF libraries are complex** - Installation, dependencies, and configuration vary across languages
2. **Template management is tedious** - Designing and maintaining invoice templates requires frontend expertise
3. **Scaling is challenging** - PDF generation is CPU-intensive and can bottleneck application performance

**RestInvoice solves this** by providing a hosted, scalable PDF generation service accessible via simple RESTful APIs.

---

## 🏗️ System Architecture

```
┌─────────────────────────────────────────────────────────────────────────────────┐
│                              RestInvoice Platform                                │
├─────────────────────────────────────────────────────────────────────────────────┤
│                                                                                  │
│  ┌──────────────┐      ┌──────────────────────┐      ┌────────────────────┐     │
│  │     WEB      │      │         API          │      │      WORKER        │     │
│  │  (React SPA) │◄────►│  (Cloudflare Worker) │◄────►│   (Go + Fly.io)    │     │
│  │              │      │       + Hono         │      │                    │     │
│  └──────────────┘      └──────────────────────┘      └────────────────────┘     │
│        │                        │                            │                   │
│        │                        │                            │                   │
│        ▼                        ▼                            ▼                   │
│  ┌──────────────┐      ┌──────────────────────┐      ┌────────────────────┐     │
│  │   Tailwind   │      │   Cloudflare KV      │      │   wkhtmltopdf      │     │
│  │   Shadcn UI  │      │   Cloudflare R2      │      │   (Patched QT)     │     │
│  └──────────────┘      │   D1 Database        │      └────────────────────┘     │
│                        └──────────────────────┘                                  │
│                                 │                                                │
│                                 ▼                                                │
│                        ┌──────────────────────┐                                  │
│                        │       Stripe         │                                  │
│                        │   (Credit System)    │                                  │
│                        └──────────────────────┘                                  │
│                                                                                  │
└─────────────────────────────────────────────────────────────────────────────────┘
```

---

## 📁 Project Structure

```
restinvoice/
├── web/                    # Frontend SPA Application
│   ├── src/
│   │   ├── components/     # Reusable UI components
│   │   ├── pages/          # Route-based page components
│   │   ├── hooks/          # Custom React hooks
│   │   ├── services/       # API client services
│   │   ├── stores/         # State management
│   │   └── utils/          # Helper utilities
│   └── public/             # Static assets
│
├── api/                    # Cloudflare Worker API
│   ├── src/
│   │   ├── routes/         # API route handlers
│   │   ├── middleware/     # Auth, rate limiting, logging
│   │   ├── services/       # Business logic layer
│   │   ├── models/         # Data models & validation
│   │   └── utils/          # Helper utilities
│   └── wrangler.toml       # Cloudflare configuration
│
├── worker/                 # PDF Generation Service
│   ├── cmd/                # Application entry point
│   ├── internal/
│   │   ├── handler/        # HTTP handlers
│   │   ├── service/        # PDF generation logic
│   │   └── template/       # Template processing
│   ├── Dockerfile          # Container configuration
│   └── fly.toml            # Fly.io deployment config
│
└── README.md               # This file
```

---

## 🧩 Components Deep Dive

### 1. Web Application (`/web`)

**Purpose**: User dashboard for account management, template design, API key management, and credit purchases.

**Technology Stack**:
- **React 19+** - Component-based UI framework
- **TailwindCSS 4** - Utility-first CSS framework
- **Shadcn UI** - Pre-built accessible components
- **React Router 7** - Client-side routing
- **Clerk** - User Management & Authentication
- **Biome** - Linting, formatting, and type checking

**Responsive Design**:
- Mobile-first approach with breakpoints at `sm:`, `md:`, `lg:`, `xl:`
- Collapsible sidebars using Sheet component on mobile devices
- Icon-only buttons on mobile, expanded with labels on desktop
- Full-height editors with dynamic viewport calculations for optimal mobile experience

**Key Features**:

| Feature | Description |
|---------|-------------|
| **Dashboard** | Overview of usage statistics, credit balance, and recent generations |
| **Template Manager** | Browse, preview, and select from pre-built templates |
| **Template Editor** | Create and edit custom HTML templates with live preview |
| **API Keys** | Generate, rotate, and manage API access keys |
| **Billing** | Purchase credits via Stripe, view transaction history |
| **Settings** | Account preferences, webhook configuration |

**Pages Structure**:
```
/                       → Landing page (public)
/login                  → Authentication
/register               → User registration
/dashboard              → Main dashboard (protected)
/templates              → Template gallery (system templates)
/my-templates           → User's custom templates
/my-templates/:id/edit  → Template editor with live preview
/api-keys               → API key management
/billing                → Credit purchase & history
/settings               → Account settings
```

**Design System**:
See `web/design-concept.md` for detailed UI/UX standards including:
- Spacing, layout, and border radius rules
- Semantic color tokens (no literal scales)
- Header and component patterns
- Mobile-first responsive guidelines

---

### 2. API Gateway (`/api`)

**Purpose**: Central API layer handling authentication, request validation, rate limiting, and orchestrating PDF generation requests.

**Technology Stack**:
- **Hono** - Lightweight web framework for Cloudflare Workers
- **Cloudflare Workers** - Edge computing runtime
- **Cloudflare D1** - SQLite database at the edge
- **Cloudflare KV** - Key-value storage for caching
- **Cloudflare R2** - Object storage for generated PDFs
- **@hono/clerk-auth** - Clerk Middleware for Hono

**API Endpoints**:

#### Authentication & Users
```
POST   /auth/register        → Create new account
POST   /auth/login           → Authenticate user
POST   /auth/refresh         → Refresh access token
GET    /users/me             → Get current user profile
PATCH  /users/me             → Update profile
```

#### API Keys
```
GET    /v1/api-keys             → List all API keys
POST   /v1/api-keys             → Create new API key
DELETE /v1/api-keys/:key        → Revoke API key
```

#### Templates
```
GET    /v1/templates            → List available templates (User's)
GET    /v1/templates/:id        → Get template details
POST   /v1/templates            → Create custom template
PUT    /v1/templates/:id        → Update template
DELETE /v1/templates/:id        → Delete template
GET    /v1/templates/system     → List system templates (Authenticated)
```

#### Invoice Generation (Public API)
```
POST   /v1/invoices/generate → Generate invoice PDF
POST   /v1/receipts/generate → Generate receipt PDF
POST   /v1/render            → Render custom HTML template to PDF
GET    /v1/jobs/:id          → Check generation job status
GET    /v1/jobs/:id/download → Download generated PDF
```

#### Billing & Credits
```
GET    /billing/balance      → Get current credit balance
POST   /billing/checkout     → Create Stripe checkout session
POST   /billing/webhook      → Stripe webhook handler
GET    /billing/history      → Transaction history
```

**Request/Response Examples**:

##### Generate Invoice
```http
POST /v1/invoices/generate
Authorization: Bearer {api_key}
Content-Type: application/json

{
  "template_id": "system-modern-01",
  "data": {
    "invoice_number": "INV-2026-001",
    "date": "2026-01-14",
    "due_date": "2026-02-14",
    "from": {
      "name": "Acme Corp",
      "address": "123 Business St, City, Country",
      "email": "billing@acme.com"
    },
    "to": {
      "name": "Client Inc",
      "address": "456 Client Ave, Town, Country",
      "email": "accounts@client.com"
    },
    "items": [
      {
        "description": "Web Development Services",
        "quantity": 40,
        "unit": "hours",
        "unit_price": 150.00
      },
      {
        "description": "Server Hosting (Monthly)",
        "quantity": 1,
        "unit": "month",
        "unit_price": 99.00
      }
    ],
    "tax_rate": 7,
    "notes": "Payment due within 30 days",
    "currency": "USD"
  },
  "options": {
    "format": "A4",
    "orientation": "portrait"
  }
}
```

##### Response
```json
{
  "success": true,
  "job_id": "job_abc123",
  "status": "processing",
  "download_url": null,
  "expires_at": null,
  "credits_used": 1
}
```

##### Download Ready Response
```json
{
  "success": true,
  "job_id": "job_abc123",
  "status": "completed",
  "download_url": "https://r2.restinvoice.com/generated/job_abc123.pdf",
  "expires_at": "2026-01-15T21:02:27Z",
  "credits_used": 1
}
```

---

### 3. PDF Worker Service (`/worker`)

**Purpose**: Stateless microservice that converts HTML templates + data into PDF documents using wkhtmltopdf.

**Technology Stack**:
- **Go 1.21+** - High-performance backend language
- **wkhtmltopdf** - HTML to PDF converter with patched QT
- **Fly.io** - Container deployment platform

**Internal Endpoints** (Called by API only):
```
POST   /render              → Render HTML to PDF
GET    /health              → Health check
```

**Render Request**:
```json
{
  "html": "<html>...</html>",
  "options": {
    "page_size": "A4",
    "orientation": "portrait",
    "margin_top": "10mm",
    "margin_bottom": "10mm",
    "margin_left": "10mm",
    "margin_right": "10mm"
  }
}
```

**Response**: Binary PDF stream with `Content-Type: application/pdf`

**Key Design Decisions**:
- **Stateless**: No local file storage; PDFs stream directly back to API
- **Isolated**: Runs in isolated containers for security
- **Scalable**: Fly.io auto-scales based on queue depth
- **Efficient**: Uses connection pooling and process reuse

---

## 💳 Credit System

RestInvoice uses a prepaid credit model for API usage:

### Credit Pricing
| Action | Credits |
|--------|---------|
| Generate invoice (system template) | 1 |
| Generate invoice (custom template) | 1 |
| Generate receipt | 1 |
| Render custom HTML | 2 |

### Credit Packages
| Package | Credits | Price | Per Credit |
|---------|---------|-------|------------|
| Starter | 100 | $9 | $0.09 |
| Growth | 500 | $39 | $0.078 |
| Scale | 2,000 | $129 | $0.065 |
| Enterprise | 10,000 | $499 | $0.05 |

### Credit Flow
```
1. User purchases credits via Stripe
2. Stripe webhook confirms payment
3. Credits added to user account (D1 database)
4. API request received with valid API key
5. Pre-check: Verify sufficient credits
6. PDF generation job queued
7. On success: Deduct credits
8. On failure: No credits deducted
```

---

## 📋 Template System

### System Templates
Pre-designed, professional templates maintained by RestInvoice:

- **Invoice Templates**
  - `modern-01` - Clean, minimal design
  - `corporate-01` - Formal business style
  - `creative-01` - Designer-friendly layout
  - `detailed-01` - Itemized with tax breakdown

- **Receipt Templates**
  - `receipt-simple` - Basic receipt
  - `receipt-detailed` - Full transaction details
  - `receipt-thermal` - 80mm thermal printer style

### Custom Templates
Users can create custom HTML templates with:

- **Mustache/Handlebars syntax** for data binding
- **Embedded CSS** for styling
- **Base64 images** or external URLs
- **Web fonts** from Google Fonts

**Template Variables**:
```handlebars
<h1>Invoice #{{invoice_number}}</h1>
<p>Date: {{date}}</p>

<div class="from">
  <h3>{{from.name}}</h3>
  <p>{{from.address}}</p>
</div>

<table>
  {{#each items}}
  <tr>
    <td>{{description}}</td>
    <td>{{quantity}} x {{unit_price}}</td>
    <td>{{total}}</td>
  </tr>
  {{/each}}
</table>

<div class="totals">
  <p>Subtotal: {{currency}} {{subtotal}}</p>
  <p>Tax ({{tax_rate}}%): {{currency}} {{tax}}</p>
  <p class="total">Total: {{currency}} {{total}}</p>
</div>
```

---

## 🔐 Security Model

### Authentication
- **Dashboard**: Clerk Authentication (JWT-based)
- **Public API**: API Key authentication via `Authorization: Bearer {key}`

### API Key Format
```
riv_live_xxxxxxxxxxxxxxxxxxxxxxxxxxxx  (production)
riv_test_xxxxxxxxxxxxxxxxxxxxxxxxxxxx  (sandbox)
```

### Security Measures
| Layer | Protection |
|-------|------------|
| **Transport** | TLS 1.3 only |
| **Auth** | bcrypt password hashing, secure token generation |
| **Rate Limiting** | Per-key limits (100/min default) |
| **Input Validation** | JSON schema validation on all inputs |
| **Template Sandboxing** | No script execution in templates |
| **PDF Storage** | Signed URLs with expiration |

---

## 🗄️ Database Schema (D1)

```sql
-- Users
CREATE TABLE users (
  id TEXT PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  name TEXT,
  credits INTEGER DEFAULT 0,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- API Keys
CREATE TABLE api_keys (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  ref TEXT NOT NULL,
  user_id TEXT NOT NULL,
  name TEXT,
  expired_at INTEGER,
  created_at INTEGER DEFAULT (unixepoch())
);

-- Templates
CREATE TABLE templates (
  id TEXT PRIMARY KEY,
  user_id TEXT REFERENCES users(id),  -- NULL for system templates
  name TEXT NOT NULL,
  description TEXT,
  type TEXT NOT NULL,  -- 'invoice' | 'receipt'
  html_content TEXT NOT NULL,
  schema_json TEXT,  -- JSON schema for data validation
  is_system BOOLEAN DEFAULT FALSE,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Generation Jobs
CREATE TABLE generation_jobs (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL REFERENCES users(id),
  api_key_id TEXT NOT NULL REFERENCES api_keys(id),
  template_id TEXT NOT NULL REFERENCES templates(id),
  status TEXT DEFAULT 'pending',  -- pending | processing | completed | failed
  credits_cost INTEGER NOT NULL,
  file_key TEXT,  -- R2 storage key
  error_message TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  completed_at DATETIME
);

-- Transactions
CREATE TABLE transactions (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL REFERENCES users(id),
  type TEXT NOT NULL,  -- 'purchase' | 'usage'
  amount INTEGER NOT NULL,  -- Positive for purchase, negative for usage
  description TEXT,
  stripe_session_id TEXT,
  job_id TEXT REFERENCES generation_jobs(id),
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
```

---

## 🚀 Development Workflow

### Prerequisites
- Node.js 20+
- Go 1.21+
- Wrangler CLI (Cloudflare)
- Fly CLI
- Docker (for local wkhtmltopdf testing)

### Local Development
```bash
# Terminal 1: Web (React SPA)
cd web
npm install
npm run dev          # http://localhost:5173

# Terminal 2: API (Cloudflare Worker)
cd api
npm install
npm run dev          # http://localhost:8787

# Terminal 3: Worker (Go + wkhtmltopdf)
cd worker
docker-compose up    # http://localhost:8080
```

### Environment Variables

**Web** (`.env`):
```env
VITE_API_URL=http://localhost:8787
VITE_STRIPE_PUBLIC_KEY=pk_test_xxx
VITE_CLERK_PUBLISHABLE_KEY=pk_test_xxx
```

**API** (`.dev.vars`):
```env
JWT_SECRET=your-secret-key
CLERK_PUBLISHABLE_KEY=pk_test_xxx
CLERK_SECRET_KEY=sk_test_xxx
STRIPE_SECRET_KEY=sk_test_xxx
STRIPE_WEBHOOK_SECRET=whsec_xxx
WORKER_URL=http://localhost:8080
R2_PUBLIC_URL=http://localhost:8787/files
```

**Worker** (`fly.toml` secrets):
```bash
fly secrets set API_AUTH_TOKEN=shared-secret
```

---

## 🎯 Suggested Enhancements

Based on your initial idea, here are recommended additions:

### High Priority
1. **Webhook Notifications** - Allow users to receive POST notifications when PDF generation completes
2. **Batch Generation** - Generate multiple invoices in one API call
3. **Template Versioning** - Track changes to templates over time

### Medium Priority
4. **Team Accounts** - Multiple users sharing one credit pool
5. **Usage Analytics** - Detailed API usage dashboards
6. **SDKs** - Official client libraries (Node.js, Python, PHP, Ruby, Go)

### Nice to Have
7. **White-label** - Custom branding for enterprise customers
8. **Invoice Scheduling** - Schedule recurring invoice generation
9. **Email Integration** - Built-in email delivery for generated invoices
10. **Digital Signatures** - Add cryptographic signatures to PDFs

---

## 📊 Metrics & Monitoring

### Key Metrics to Track
- API request latency (p50, p95, p99)
- PDF generation time distribution
- Credit purchase conversion rate
- Template usage distribution
- Error rate by endpoint

### Logging Strategy
```
Level: INFO  → API requests, successful generations
Level: WARN  → Rate limits hit, validation errors
Level: ERROR → Generation failures, payment errors
```

---

## 🧪 Testing Strategy

| Layer | Type | Tools |
|-------|------|-------|
| Web | Unit | Vitest, React Testing Library |
| Web | E2E | Playwright |
| API | Unit | Vitest |
| API | Integration | Miniflare |
| Worker | Unit | Go testing |
| Worker | Integration | Docker Compose |

---

## 📚 Additional Resources

- [Cloudflare Workers Documentation](https://developers.cloudflare.com/workers/)
- [Hono Framework](https://hono.dev/)
- [wkhtmltopdf Documentation](https://wkhtmltopdf.org/usage/wkhtmltopdf.txt)
- [Stripe Payment Integration](https://stripe.com/docs/payments)
- [Fly.io Documentation](https://fly.io/docs/)

---

## 📝 License

Proprietary - All rights reserved

---

*This document is intended to be AI-friendly and provides comprehensive context for LLMs, developers, and automated tools working with the RestInvoice codebase.*
