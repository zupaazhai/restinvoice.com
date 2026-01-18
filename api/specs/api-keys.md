# API Keys Specification

## Overview

The API Keys module provides endpoints for managing user API keys used for authenticating requests to RestInvoice's public API.

**Key Format:** `riv_{env}_{uuid}`
- `riv_test_...` - Test/development keys
- `riv_live_...` - Production keys (future)

---

## Base URL

```
/v1/api-keys
```

---

## Data Model

### API Key Object

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `key` | string | Yes | Full API key (only shown on creation) |
| `user_id` | string | Yes | Clerk user ID |
| `expired_at` | integer \| null | No | Expiration timestamp (null = never) |
| `created_at` | integer | Yes | Creation timestamp (Unix) |

---

## Endpoints

### GET /v1/api-keys

Retrieves all API keys for the authenticated user with pagination.

**Authentication:** Required (Clerk JWT)

**Query Parameters:**
| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `page` | integer | 1 | Page number (min: 1) |
| `per_page` | integer | 15 | Items per page (min: 1, max: 100) |

**Response:** `200 OK`
```json
{
  "success": true,
  "data": [
    {
      "key": "riv_test_abc123...",
      "user_id": "user_123...",
      "expired_at": null,
      "created_at": 1768716350
    }
  ],
  "meta": {
    "current_page": 1,
    "last_page": 1,
    "per_page": 15,
    "total": 1
  }
}
```

**Errors:**
- `401 Unauthorized` - Missing or invalid token

---

### POST /v1/api-keys

Creates a new API key for the authenticated user.

**Authentication:** Required (Clerk JWT)

**Request Body:**
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `name` | string | No | Friendly name for the key |

**Response:** `201 Created`
```json
{
  "success": true,
  "data": {
    "key": "riv_test_2ff187facc7e4bf29cb64ff84d1f7a67",
    "user_id": "user_38I8LnzAEMzBggTlJd7BeLUKqvp",
    "expired_at": null,
    "created_at": 1768716350
  }
}
```

**Errors:**
- `401 Unauthorized` - Missing or invalid token
- `500 Internal Server Error` - Database error

---

### DELETE /v1/api-keys/:key

Revokes an API key.

**Authentication:** Required (Clerk JWT)

**Path Parameters:**
| Parameter | Type | Description |
|-----------|------|-------------|
| `key` | string | Full API key to revoke |

**Response:** `200 OK`
```json
{
  "success": true
}
```

**Errors:**
- `401 Unauthorized` - Missing or invalid token
- `500 Internal Server Error` - Database error

**Notes:**
- Users can only delete their own keys (enforced by `user_id` filter)
- Deleting a non-existent key returns success (idempotent)

---

## Database Schema

```sql
CREATE TABLE api_keys (
  key TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  expired_at INTEGER,
  created_at INTEGER DEFAULT (unixepoch())
);

CREATE INDEX idx_api_keys_user_id ON api_keys(user_id);
```

---

## Security

| Feature | Implementation |
|---------|----------------|
| Authentication | Clerk JWT via middleware |
| User isolation | Keys filtered by `user_id` |
| Key generation | `crypto.randomUUID()` |
| SQL injection | QueryBuilder with prepared statements |

---

## Implementation Status

| Endpoint | Method | Status |
|----------|--------|--------|
| /v1/api-keys | GET | ✅ Implemented |
| /v1/api-keys | POST | ✅ Implemented |
| /v1/api-keys/:key | DELETE | ✅ Implemented |
