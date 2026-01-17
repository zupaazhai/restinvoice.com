import { OpenAPIHono, createRoute, z } from '@hono/zod-openapi'
import { TemplateSchema } from '../models/template'

const templates = new OpenAPIHono()

// Mock Data
const SYSTEM_TEMPLATES = [
    {
        id: "system-modern-01",
        name: "Modern Invoice",
        description: "Clean, minimal design perfect for tech companies and startups",
        type: "invoice",
        isSystem: true,
    },
    {
        id: "system-corporate-01",
        name: "Corporate Invoice",
        description: "Formal business style with professional layout",
        type: "invoice",
        isSystem: true,
    },
    {
        id: "system-creative-01",
        name: "Creative Invoice",
        description: "Designer-friendly layout with vibrant accents",
        type: "invoice",
        isSystem: true,
    },
    {
        id: "system-detailed-01",
        name: "Detailed Invoice",
        description: "Itemized breakdown with comprehensive tax calculations",
        type: "invoice",
        isSystem: true,
    },
    {
        id: "system-receipt-simple",
        name: "Simple Receipt",
        description: "Basic receipt for quick transactions",
        type: "receipt",
        isSystem: true,
    },
    {
        id: "system-receipt-detailed",
        name: "Detailed Receipt",
        description: "Full transaction details with customer information",
        type: "receipt",
        isSystem: true,
    },
]

const USER_TEMPLATES = [
    {
        id: "user-custom-01",
        name: "My Custom Invoice",
        description: "Personalized invoice template with my brand colors",
        type: "invoice",
        isSystem: false,
    },
    {
        id: "user-custom-02",
        name: "Project Receipt",
        description: "Receipt template for project-based work",
        type: "receipt",
        isSystem: false,
    },
]

// Routes
const getSystemTemplatesRoute = createRoute({
    method: 'get',
    path: '/system',
    responses: {
        200: {
            content: {
                'application/json': {
                    schema: z.array(TemplateSchema),
                },
            },
            description: 'Retrieve a list of system templates',
        },
    },
})

templates.openapi(getSystemTemplatesRoute, (c) => {
    return c.json(SYSTEM_TEMPLATES as any)
})

const getUserTemplatesRoute = createRoute({
    method: 'get',
    path: '/',
    responses: {
        200: {
            content: {
                'application/json': {
                    schema: z.array(TemplateSchema),
                },
            },
            description: 'Retrieve a list of user templates',
        },
    },
})

templates.openapi(getUserTemplatesRoute, (c) => {
    return c.json(USER_TEMPLATES as any)
})

export default templates
