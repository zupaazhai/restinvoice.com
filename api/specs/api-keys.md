# API Keys Specification

## Overview

The API Keys module provides endpoints for managing user API keys used for authenticating requests to RestInvoice's public API.

**Key Format:** `riv_{env}_{ref}_{secret}`
- `ref`: Public reference ID (stored in D1)
- `secret`: Private secret (stored in KV, NEVER in D1)

---

## Base URL

```
/v1/api-keys
```

---

## Data Model

### API Key Object (D1)

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `id` | string | Yes | Unique ID (Public Reference) |
| `ref` | string | Yes | Public reference part of the key |
| `name` | string \| null | No | Friendly name |
| `user_id` | string | Yes | Clerk user ID |
| `created_at` | integer | Yes | Creation timestamp (Unix) |

### KV storage

**Key:** `{ref}`
**Value:**
```json
{
  "secret": "...",
  "user_id": "..."
}
```

---

## Endpoints

### GET /v1/api-keys

Retrieves all API keys for the authenticated user.

**Authentication:** Required (Clerk JWT)

**Response:** `200 OK`
```json
{
  "success": true,
  "data": [
    {
      "id": "abc12345",
      "ref": "abc12345",
      "name": "My Test Key",
      "user_id": "user_123...",
      "created_at": 1768716350
    }
  ]
}
```

**Errors:**
- `401 Unauthorized` - Missing or invalid token

---

### POST /v1/api-keys

Creates a new API key.

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
    "key": "riv_test_abc12345_verysecret...",
    "id": "abc12345",
    "name": "My Test Key",
    "user_id": "user_...",
    "created_at": 1768716350
  }
}
```

**Errors:**
- `401 Unauthorized` - Missing or invalid token
- `500 Internal Server Error` - Database/KV error

---

### DELETE /v1/api-keys/:id

Revokes an API key.

**Authentication:** Required (Clerk JWT)

**Path Parameters:**
| Parameter | Type | Description |
|-----------|------|-------------|
| `id` | string | API Key ID (Ref) to revoke |

**Response:** `200 OK`
```json
{
  "success": true
}
```

---

## Database Schema

```sql
DROP TABLE IF EXISTS api_keys;
CREATE TABLE api_keys (
  id TEXT PRIMARY KEY,
  ref TEXT NOT NULL,
  user_id TEXT NOT NULL,
  name TEXT,
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
| Storage split | Public ref in D1, Secret in KV |
| Secret safety | Secret never stored in D1 |

---

## Implementation Status

| Endpoint | Method | Status |
|----------|--------|--------|
| /v1/api-keys | GET | ✅ Implemented |
| /v1/api-keys | POST | ✅ Implemented |
| /v1/api-keys/:key | DELETE | ✅ Implemented |
