import { getAuth } from "@hono/clerk-auth";
import { createRoute, OpenAPIHono, z } from "@hono/zod-openapi";
import { ApiKeySchema, CreateApiKeySchema } from "../models/api-keys";
import { PaginatedResponseSchema, PaginationQuerySchema } from "../models/pagination";
import { db } from "../utils/db";

const apiKeys = new OpenAPIHono<{
  Bindings: {
    DB: D1Database;
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
            data: ApiKeySchema,
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
  path: "/:key",
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

  // Generate Key
  const keyBase = crypto.randomUUID().replace(/-/g, "");
  // TODO: Use env var or similar for environment prefix
  const key = `riv_test_${keyBase}`;

  const now = Math.floor(Date.now() / 1000);

  try {
    await c.env.DB.prepare("INSERT INTO api_keys (key, user_id, created_at) VALUES (?, ?, ?)")
      .bind(key, auth.userId, now)
      .run();

    return c.json(
      {
        success: true,
        data: {
          key,
          user_id: auth.userId,
          expired_at: null,
          created_at: now,
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

  const key = c.req.param("key");

  try {
    await c.env.DB.prepare("DELETE FROM api_keys WHERE key = ? AND user_id = ?")
      .bind(key, auth.userId)
      .run();

    return c.json({
      success: true,
    });
  } catch (e) {
    console.error(e);
    return c.json({ message: "Failed to revoke API key" }, 500);
  }
});

export default apiKeys;
