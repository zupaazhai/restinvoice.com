import { z } from "@hono/zod-openapi";

export const PaginationQuerySchema = z.object({
  page: z.coerce.number().min(1).default(1).openapi({
    example: 1,
    description: "Page number",
  }),
  per_page: z.coerce.number().min(1).max(100).default(15).openapi({
    example: 15,
    description: "Items per page",
  }),
});

export const ValidationSchema = z.object({
  page: z.coerce.number().min(1).optional(),
  per_page: z.coerce.number().min(1).max(100).optional(),
});

export function PaginatedResponseSchema<T extends z.ZodType>(itemSchema: T) {
  return z.object({
    success: z.boolean().openapi({ example: true }),
    data: z.array(itemSchema),
    meta: z.object({
      current_page: z.number().openapi({ example: 1 }),
      last_page: z.number().openapi({ example: 10 }),
      per_page: z.number().openapi({ example: 15 }),
      total: z.number().openapi({ example: 150 }),
    }),
  });
}
