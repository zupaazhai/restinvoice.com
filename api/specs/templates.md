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
      "html_content": "...",
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

**Response:** `201 Created`
```json
{
  "success": true,
  "data": {
    "id": 2,
    "name": "New Template",
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
