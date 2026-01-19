# Templates Specification

## Overview

The Templates module provides CRUD endpoints for managing user-defined invoice and receipt templates. These templates contain HTML content and metadata used for generating documents.

---

## Base URL

```
/v1/templates
```

---

## Data Model

### Template Object

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `id` | integer | Yes | Unique ID (Auto-increment) |
| `name` | string | Yes | Template name (max 150 chars) |
| `description` | string \| null | No | Optional description (max 300 chars) |
| `user_id` | string | Yes | Owner User ID (Clerk) |
| `html_content` | string | Yes | HTML content of the template |
| `variables` | object \| null | No | JSON object containing template variable definitions |
| `created_at` | integer | Yes | Creation timestamp (Unix) |
| `updated_at` | integer | Yes | Update timestamp (Unix) |

---

## Endpoints

### GET /v1/templates

Lists all templates owned by the authenticated user with pagination.

**Authentication:** Required (Clerk JWT)

**Query Parameters:**
| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `page` | integer | 1 | Page number |
| `per_page` | integer | 15 | Items per page (max 100) |

**Response:** `200 OK`
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "name": "Modern Invoice",
      "description": "Clean design",
      "user_id": "user_...",
      "html_content": "<html>...</html>",
      "variables": {
        "invoice_number": "INV-001",
        "due_date": "2024-01-01"
      },
      "created_at": 1704067200,
      "updated_at": 1704067200
    }
  ],
  "meta": {
    "current_page": 1,
    "last_page": 5,
    "per_page": 15,
    "total": 75
  }
}
```

### GET /v1/templates/:id

Retrieves a single template by ID.

**Authentication:** Required (Clerk JWT)

**Path Parameters:**
| Parameter | Type | Description |
|-----------|------|-------------|
| `id` | integer | Template ID |

**Response:** `200 OK`
```json
{
  "success": true,
  "data": {
    "id": 1,
    "name": "Modern Invoice",
    "variables": { ... },
    "...": "..."
  }
}
```

**Errors:**
- `404 Not Found` - Template does not exist or does not belong to user

### POST /v1/templates

Creates a new template.

**Authentication:** Required (Clerk JWT)

**Request Body:**
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `name` | string | Yes | Template name (1-150 chars) |
| `html_content` | string | Yes | HTML content |
| `description` | string | No | Optional description (max 300 chars) |
| `variables` | object | No | JSON object defining variables |

**Response:** `201 Created`
```json
{
  "success": true,
  "data": {
    "id": 2,
    "name": "New Template",
    "variables": { "foo": "bar" },
    "...": "..."
  }
}
```

### PATCH /v1/templates/:id

Updates an existing template.

**Authentication:** Required (Clerk JWT)

**Request Body:** (All fields optional)
| Field | Type | Description |
|-------|------|-------------|
| `name` | string | Template name |
| `description` | string | Description |
| `html_content` | string | HTML content |
| `variables` | object | Variables JSON |

**Response:** `200 OK` (Returns updated object)

### DELETE /v1/templates/:id

Deletes a template.

**Authentication:** Required (Clerk JWT)

**Response:** `200 OK`
```json
{
  "success": true
}
```

---

## Database Schema

```sql
CREATE TABLE templates (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL CHECK(length(name) <= 150),
  description TEXT CHECK(description IS NULL OR length(description) <= 300),
  user_id TEXT NOT NULL,
  html_content TEXT NOT NULL,
  variables TEXT, -- Stored as JSON string
  created_at INTEGER DEFAULT (unixepoch()),
  updated_at INTEGER DEFAULT (unixepoch())
);

CREATE INDEX idx_templates_user_id ON templates(user_id);
CREATE INDEX idx_templates_created_at ON templates(created_at);
```

---

## Security

| Feature | Implementation |
|---------|----------------|
| Authentication | Clerk JWT via middleware |
| Authorization | Ownership check (`WHERE user_id = ?`) on all access |
| Validation | Zod schemas for all inputs |
| Sanitization | Input length limits enforced at DB level |

---

## Implementation Status

| Endpoint | Method | Status |
|----------|--------|--------|
| /v1/templates | GET | ✅ Implemented |
| /v1/templates/:id | GET | ✅ Implemented |
| /v1/templates | POST | ✅ Implemented |
| /v1/templates/:id | PATCH | ✅ Implemented |
| /v1/templates/:id | DELETE | ✅ Implemented |
| /v1/templates/system | GET | ✅ Implemented |

### GET /v1/templates/system

Lists all available system templates.

**Authentication:** Required (Clerk JWT)

**Response:** `200 OK`
```json
[
  {
    "id": "00000000-0000-0000-0000-000000000001",
    "name": "Standard Invoice",
    "description": "A professional and clean invoice template suitable for most businesses.",
    "user_id": "system",
    "html_content": "<!DOCTYPE html>...",
    "variables": { ... },
    "created_at": 1705680000,
    "updated_at": 1705680000
  }
]
```
