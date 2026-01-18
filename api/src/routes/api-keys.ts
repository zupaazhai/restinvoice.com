import { getAuth } from "@hono/clerk-auth";
import { createRoute, OpenAPIHono, z } from "@hono/zod-openapi";
import { ApiKeyCreateResponseSchema, ApiKeySchema, CreateApiKeySchema } from "../models/api-keys";
import { PaginatedResponseSchema, PaginationQuerySchema } from "../models/pagination";
import { generateApiKey } from "../utils/crypto";
import { db } from "../utils/db";

const apiKeys = new OpenAPIHono<{
  Bindings: {
    DB: D1Database;
    RESTINVOICE_API_KEY: KVNamespace;
  };
}>();

// --- Routes Definitions ---

const listApiKeysRoute = createRoute({
  method: "get",
  path: "/",
  request: {
    query: PaginationQuerySchema,
  },
  responses: {
    200: {
      content: {
        "application/json": {
          schema: PaginatedResponseSchema(ApiKeySchema),
        },
      },
      description: "List all API keys for the current user",
    },
    401: {
      description: "Unauthorized",
    },
  },
});

const createApiKeyRoute = createRoute({
  method: "post",
  path: "/",
  request: {
    body: {
      content: {
        "application/json": {
          schema: CreateApiKeySchema,
        },
      },
    },
  },
  responses: {
    201: {
      content: {
        "application/json": {
          schema: z.object({
            success: z.boolean(),
            data: ApiKeyCreateResponseSchema,
          }),
        },
      },
      description: "API Key created",
    },
    401: {
      description: "Unauthorized",
    },
    500: {
      description: "Internal Server Error",
    },
  },
});

const revokeApiKeyRoute = createRoute({
  method: "delete",
  path: "/:id",
  responses: {
    200: {
      content: {
        "application/json": {
          schema: z.object({
            success: z.boolean(),
          }),
        },
      },
      description: "API Key revoked",
    },
    401: {
      description: "Unauthorized",
    },
    500: {
      description: "Internal Server Error",
    },
  },
});

// --- Handlers ---

apiKeys.openapi(listApiKeysRoute, async (c) => {
  const auth = getAuth(c);
  if (!auth?.userId) {
    return c.json({ message: "Unauthorized" }, 401);
  }

  const { page, per_page } = c.req.valid("query");

  const results = await db(c.env.DB)
    .table("api_keys")
    .where("user_id", auth.userId)
    .orderBy("created_at", "desc")
    .paginate(page, per_page);

  return c.json({
    success: true,
    data: results.data,
    meta: results.meta,
  });
});

apiKeys.openapi(createApiKeyRoute, async (c) => {
  const auth = getAuth(c);
  if (!auth?.userId) {
    return c.json({ message: "Unauthorized" }, 401);
  }

  const { name, expires_in } = c.req.valid("json");

  // Generate Key
  // TODO: Use env var or similar for environment prefix, defaulting to 'test' for now
  const { key, ref, secret } = await generateApiKey("test");

  const now = Math.floor(Date.now() / 1000);
  let expired_at: number | null = null;
  let expirationTtl: number | undefined = undefined;

  if (expires_in && expires_in !== "never") {
    const day = 24 * 60 * 60;
    const durationMap: Record<string, number> = {
      "7d": 7 * day,
      "30d": 30 * day,
      "60d": 60 * day,
      "90d": 90 * day,
      "180d": 180 * day,
      "1y": 365 * day,
    };
    const duration = durationMap[expires_in];
    if (duration) {
      expired_at = now + duration;
      expirationTtl = expired_at;
    }
  }

  try {
    // 1. Store in D1 (Metadata only, NO SECRET)
    await c.env.DB.prepare(
      "INSERT INTO api_keys (id, ref, user_id, name, created_at, expired_at) VALUES (?, ?, ?, ?, ?, ?)"
    )
      .bind(ref, ref, auth.userId, name || null, now, expired_at)
      .run();

    // 2. Store in KV (Secret)
    await c.env.RESTINVOICE_API_KEY.put(
      ref,
      JSON.stringify({
        secret,
        user_id: auth.userId,
      }),
      {
        expiration: expirationTtl,
      }
    );

    return c.json(
      {
        success: true,
        data: {
          id: ref,
          ref,
          key,
          name: name || null,
          user_id: auth.userId,
          created_at: now,
          expired_at,
        },
      },
      201
    );
  } catch (e) {
    console.error(e);
    return c.json({ message: "Failed to create API key" }, 500);
  }
});

apiKeys.openapi(revokeApiKeyRoute, async (c) => {
  const auth = getAuth(c);
  if (!auth?.userId) {
    return c.json({ message: "Unauthorized" }, 401);
  }

  const id = c.req.param("id");

  try {
    // Verify ownership and get ref (though id is ref in our logic)
    // We check D1 first to ensure it exists and belongs to user
    const existing = await c.env.DB.prepare("SELECT ref FROM api_keys WHERE id = ? AND user_id = ?")
      .bind(id, auth.userId)
      .first<{ ref: string }>();

    if (!existing) {
      // Idempotent success or 404? Spec said idempotent success for non-existent.
      // But if it exists but different user, we also might want to return success to avoid leaking existence.
      // However, if we want to confirm deletion, we proceed.
      // If it's not in DB, we consider it "gone".
      // We should also try to delete from KV just in case.
      // But we need the ref. If 'id' IS 'ref', we can try deleting from KV anyway.
    }

    // Delete from D1
    await c.env.DB.prepare("DELETE FROM api_keys WHERE id = ? AND user_id = ?")
      .bind(id, auth.userId)
      .run();

    // If we deleted from D1, we delete from KV.
    // If we didn't find it in D1, we might still want to try 'id' as key for KV.
    await c.env.RESTINVOICE_API_KEY.delete(id);

    return c.json({
      success: true,
    });
  } catch (e) {
    console.error(e);
    return c.json({ message: "Failed to revoke API key" }, 500);
  }
});

export default apiKeys;
