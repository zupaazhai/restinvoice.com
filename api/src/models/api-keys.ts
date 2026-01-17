import { z } from "@hono/zod-openapi";

export const ApiKeySchema = z.object({
  key: z.string().openapi({
    example: "riv_live_1234567890",
    description: "The API Key",
  }),
  user_id: z.string().openapi({
    example: "user_2a...",
    description: "The User ID",
  }),
  expired_at: z.number().nullable().openapi({
    example: 1735689600,
    description: "Expiration timestamp (Unix)",
  }),
  created_at: z.number().openapi({
    example: 1704067200,
    description: "Creation timestamp (Unix)",
  }),
});

export const CreateApiKeySchema = z.object({
  name: z.string().optional().openapi({
    example: "My Production Key",
    description: "Friendly name for the API Key",
  }),
});

export const ApiKeyResponseSchema = z.object({
  success: z.boolean().openapi({ example: true }),
  data: z.union([ApiKeySchema, z.array(ApiKeySchema)]),
});
