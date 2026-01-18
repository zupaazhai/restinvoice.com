import { z } from "@hono/zod-openapi";

export const ApiKeySchema = z.object({
  ref: z.string().openapi({
    example: "abc12345",
    description: "The API Key Reference",
  }),
  name: z.string().nullable().optional().openapi({
    example: "My Production Key",
    description: "Friendly name",
  }),
  user_id: z.string().openapi({
    example: "user_2a...",
    description: "The User ID",
  }),
  created_at: z.number().openapi({
    example: 1704067200,
    description: "Creation timestamp (Unix)",
  }),
  expired_at: z.number().nullable().optional().openapi({
    example: 1735689600,
    description: "Expiration timestamp (Unix), null if never expires",
  }),
});

export const ApiKeyCreateResponseSchema = ApiKeySchema.extend({
  key: z.string().openapi({
    example: "riv_live_abc12345_secret...",
    description: "The Full API Key (Only shown once)",
  }),
});

export const CreateApiKeySchema = z.object({
  name: z.string().optional().openapi({
    example: "My Production Key",
    description: "Friendly name for the API Key",
  }),
  expires_in: z
    .enum(["7d", "30d", "60d", "90d", "180d", "1y", "never"])
    .optional()
    .openapi({
      example: "30d",
      description: "Expiration duration",
    }),
});

export const ApiKeyResponseSchema = z.object({
  success: z.boolean().openapi({ example: true }),
  data: z.union([ApiKeySchema, z.array(ApiKeySchema)]),
});
