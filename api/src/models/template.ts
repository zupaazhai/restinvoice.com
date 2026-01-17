import { z } from '@hono/zod-openapi'

export const TemplateSchema = z.object({
    id: z.string().openapi({
        example: 'system-modern-01'
    }),
    name: z.string().openapi({
        example: 'Modern Invoice'
    }),
    description: z.string().openapi({
        example: 'Clean, minimal design perfect for tech companies and startups'
    }),
    type: z.enum(['invoice', 'receipt']).openapi({
        example: 'invoice'
    }),
    isSystem: z.boolean().openapi({
        example: true
    })
}).openapi('Template')

export type Template = z.infer<typeof TemplateSchema>
