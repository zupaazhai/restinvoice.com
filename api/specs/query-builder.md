# QueryBuilder Specification

## Overview

`QueryBuilder` is a fluent, Laravel-inspired query builder for Cloudflare D1 (SQLite). It provides a secure, type-safe way to construct database queries with built-in SQL injection protection.

## Import

```typescript
import { db } from "../utils/db";
```

## Basic Usage

```typescript
// Simple query
const users = await db(c.env.DB)
  .table("users")
  .where("active", true)
  .get();

// Paginated query
const { data, meta } = await db(c.env.DB)
  .table("api_keys")
  .where("user_id", userId)
  .orderBy("created_at", "desc")
  .paginate(1, 15);
```

## API Reference

### `db(d1: D1Database)`

Factory function that returns a new `QueryBuilder` instance.

### `.table(name: string)`

Sets the target table. **Required** before `.get()` or `.paginate()`.

### `.select(fields: string | string[])`

Specifies columns to select. Defaults to `*`.

```typescript
.select(["id", "name", "email"])
.select("id")
```

### `.where(column, value)` / `.where(column, operator, value)`

Adds a WHERE condition. Supports operators: `=`, `!=`, `<>`, `<`, `>`, `<=`, `>=`, `LIKE`, `NOT LIKE`, `IN`, `NOT IN`, `IS`, `IS NOT`.

```typescript
.where("status", "active")           // status = ?
.where("age", ">=", 18)              // age >= ?
.where("id", "IN", [1, 2, 3])        // id IN (?, ?, ?)
```

### `.orderBy(column, direction)`

Adds ORDER BY clause. Direction: `"asc"` or `"desc"` (default: `"asc"`).

```typescript
.orderBy("created_at", "desc")
```

### `.limit(count: number)`

Sets maximum rows. Clamped between 1 and 1000.

### `.get(): Promise<T[]>`

Executes query and returns all matching rows. Enforces default limit of 1000.

### `.paginate(page, perPage): Promise<PaginatedResult<T>>`

Returns paginated results with metadata.

```typescript
interface PaginatedResult<T> {
  data: T[];
  meta: {
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
  };
}
```

## Security Features

| Feature | Protection |
|---------|------------|
| **Identifier validation** | Regex: `/^[a-zA-Z_][a-zA-Z0-9_]*$/` |
| **Operator whitelist** | Only allowed SQL operators |
| **Prepared statements** | All values bound via `?` |
| **IN/NOT IN safety** | Dynamic placeholder generation |
| **Table validation** | Throws if `.table()` not called |
| **Limit bounds** | Clamped to 1-1000 |

## Source File

- `src/utils/db.ts`
