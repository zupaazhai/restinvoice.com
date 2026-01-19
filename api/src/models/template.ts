import { z } from "@hono/zod-openapi";

// Database schema (full template object)
export const TemplateSchema = z.object({
  id: z.number().openapi({
    example: 1,
    description: "Template ID",
  }),
  name: z.string().max(150).openapi({
    example: "Modern Invoice",
    description: "Template name (max 150 characters)",
  }),
  description: z.string().max(300).nullable().optional().openapi({
    example: "Clean, minimal design perfect for tech companies",
    description: "Template description (max 300 characters)",
  }),
  user_id: z.string().openapi({
    example: "user_2a...",
    description: "Owner user ID",
  }),
  html_content: z.string().openapi({
    example: "<html><body>Invoice #{invoice_number}</body></html>",
    description: "HTML template content",
  }),
  variables: z
    .preprocess((val) => {
      if (typeof val === "string") {
        try {
          return JSON.parse(val);
        } catch {
          return val;
        }
      }
      return val;
    }, z.record(z.string(), z.any()).nullable().optional())
    .openapi({
      example: { invoice_number: "INV-001", total: 100 },
      description: "Template variables (JSON)",
    }),
  created_at: z.number().openapi({
    example: 1704067200,
    description: "Creation timestamp (Unix)",
  }),
  updated_at: z.number().openapi({
    example: 1704067200,
    description: "Last update timestamp (Unix)",
  }),
});

// Create template request schema
export const CreateTemplateSchema = z.object({
  name: z.string().min(1).max(150).openapi({
    example: "My Custom Invoice",
    description: "Template name (1-150 characters)",
  }),
  description: z.string().max(300).optional().openapi({
    example: "Personalized invoice template with my brand colors",
    description: "Optional template description (max 300 characters)",
  }),
  html_content: z.string().min(1).openapi({
    example: "<html><body><h1>Invoice</h1></body></html>",
    description: "HTML template content (required)",
  }),
  variables: z
    .record(z.string(), z.any())
    .optional()
    .openapi({
      example: { invoice_number: "INV-001" },
      description: "Template variables (JSON object)",
    }),
});

// Update template request schema
export const UpdateTemplateSchema = z.object({
  name: z.string().min(1).max(150).optional().openapi({
    example: "Updated Template Name",
    description: "Template name (1-150 characters)",
  }),
  description: z.string().max(300).optional().openapi({
    example: "Updated description",
    description: "Template description (max 300 characters)",
  }),
  html_content: z.string().min(1).optional().openapi({
    example: "<html><body><h1>Updated Invoice</h1></body></html>",
    description: "HTML template content",
  }),
  variables: z
    .record(z.string(), z.any())
    .optional()
    .openapi({
      example: { invoice_number: "INV-002" },
      description: "Template variables (JSON object)",
    }),
});

export type Template = z.infer<typeof TemplateSchema>;
export type CreateTemplate = z.infer<typeof CreateTemplateSchema>;
export type UpdateTemplate = z.infer<typeof UpdateTemplateSchema>;
