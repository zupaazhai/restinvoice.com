import { getAuth } from "@hono/clerk-auth";
import { createRoute, OpenAPIHono, z } from "@hono/zod-openapi";
import { PaginatedResponseSchema, PaginationQuerySchema } from "../models/pagination";
import {
  CreateTemplateSchema,
  type Template,
  TemplateSchema,
  UpdateTemplateSchema,
} from "../models/template";
import { db } from "../utils/db";
import { DEFAULT_TEMPLATE_HTML, DEFAULT_TEMPLATE_VARIABLES } from "../utils/defaults";
import { generateUniqueSlug, isUuid } from "../utils/slug";

const templates = new OpenAPIHono<{
  Bindings: {
    DB: D1Database;
  };
}>();

// --- Route Definitions ---

const listTemplatesRoute = createRoute({
  method: "get",
  path: "/",
  request: {
    query: PaginationQuerySchema,
  },
  tags: ["Templates"],
  responses: {
    200: {
      content: {
        "application/json": {
          schema: PaginatedResponseSchema(TemplateSchema),
        },
      },
      description: "List all templates for the current user",
    },
    401: {
      description: "Unauthorized",
    },
  },
});

const listSystemTemplatesRoute = createRoute({
  method: "get",
  path: "/system",
  tags: ["Templates"],
  responses: {
    200: {
      content: {
        "application/json": {
          schema: z.array(TemplateSchema),
        },
      },
      description: "List system templates",
    },
    401: {
      description: "Unauthorized",
    },
  },
});

const getTemplateRoute = createRoute({
  method: "get",
  path: "/{id}",
  request: {
    params: z.object({
      id: z.string().openapi({
        param: {
          name: "id",
          in: "path",
        },
        example: "123e4567-e89b-12d3-a456-426614174000",
        description: "Template UUID or slug",
      }),
    }),
  },
  tags: ["Templates"],
  responses: {
    200: {
      content: {
        "application/json": {
          schema: z.object({
            success: z.boolean(),
            data: TemplateSchema,
          }),
        },
      },
      description: "Template retrieved",
    },
    401: {
      description: "Unauthorized",
    },
    404: {
      description: "Template not found or not owned by user",
    },
  },
});

const createTemplateRoute = createRoute({
  method: "post",
  path: "/",
  request: {
    body: {
      content: {
        "application/json": {
          schema: CreateTemplateSchema,
        },
      },
    },
  },
  tags: ["Templates"],
  responses: {
    201: {
      content: {
        "application/json": {
          schema: z.object({
            success: z.boolean(),
            data: TemplateSchema,
          }),
        },
      },
      description: "Template created",
    },
    401: {
      description: "Unauthorized",
    },
    500: {
      description: "Internal Server Error",
    },
  },
});

const updateTemplateRoute = createRoute({
  method: "patch",
  path: "/{id}",
  request: {
    params: z.object({
      id: z.string().openapi({
        param: {
          name: "id",
          in: "path",
        },
        example: "123e4567-e89b-12d3-a456-426614174000",
        description: "Template UUID or slug",
      }),
    }),
    body: {
      content: {
        "application/json": {
          schema: UpdateTemplateSchema,
        },
      },
    },
  },
  tags: ["Templates"],
  responses: {
    200: {
      content: {
        "application/json": {
          schema: z.object({
            success: z.boolean(),
            data: TemplateSchema,
          }),
        },
      },
      description: "Template updated",
    },
    401: {
      description: "Unauthorized",
    },
    404: {
      description: "Template not found or not owned by user",
    },
    500: {
      description: "Internal Server Error",
    },
  },
});

const deleteTemplateRoute = createRoute({
  method: "delete",
  path: "/{id}",
  request: {
    params: z.object({
      id: z.string().openapi({
        param: {
          name: "id",
          in: "path",
        },
        example: "123e4567-e89b-12d3-a456-426614174000",
        description: "Template UUID or slug",
      }),
    }),
  },
  tags: ["Templates"],
  responses: {
    200: {
      content: {
        "application/json": {
          schema: z.object({
            success: z.boolean(),
          }),
        },
      },
      description: "Template deleted",
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

templates.openapi(listTemplatesRoute, async (c) => {
  const auth = getAuth(c);
  if (!auth?.userId) {
    return c.json({ message: "Unauthorized" }, 401);
  }

  const { page, per_page } = c.req.valid("query");

  const results = await db(c.env.DB)
    .table("templates")
    .where("user_id", auth.userId)
    .orderBy("created_at", "desc")
    .paginate(page, per_page);

  return c.json({
    success: true,
    data: results.data,
    meta: results.meta,
  });
});

templates.openapi(listSystemTemplatesRoute, async (c) => {
  const auth = getAuth(c);
  if (!auth?.userId) {
    return c.json({ message: "Unauthorized" }, 401);
  }

  const systemTemplate: Template = {
    id: "00000000-0000-0000-0000-000000000001",
    slug: "standard-invoice-0001",
    name: "Standard Invoice",
    description: "A professional and clean invoice template suitable for most businesses.",
    user_id: "system",
    html_content: DEFAULT_TEMPLATE_HTML,
    variables: DEFAULT_TEMPLATE_VARIABLES,
    created_at: 1705680000, // Fixed timestamp
    updated_at: 1705680000,
  };

  return c.json([systemTemplate]);
});

templates.openapi(getTemplateRoute, async (c) => {
  const auth = getAuth(c);
  if (!auth?.userId) {
    return c.json({ message: "Unauthorized" }, 401);
  }

  const { id } = c.req.valid("param");

  // Try to find by UUID first, then by slug
  const idIsUuid = isUuid(id);
  let template: unknown[] | undefined;
  if (idIsUuid) {
    template = await db(c.env.DB)
      .table("templates")
      .where("id", id)
      .where("user_id", auth.userId)
      .select([
        "id",
        "slug",
        "name",
        "description",
        "user_id",
        "html_content",
        "variables",
        "created_at",
        "updated_at",
      ])
      .get();
  } else {
    template = await db(c.env.DB)
      .table("templates")
      .where("slug", id)
      .where("user_id", auth.userId)
      .select([
        "id",
        "slug",
        "name",
        "description",
        "user_id",
        "html_content",
        "variables",
        "created_at",
        "updated_at",
      ])
      .get();
  }

  if (!template || template.length === 0) {
    return c.json({ message: "Template not found" }, 404);
  }

  return c.json({
    success: true,
    data: template[0],
  });
});

templates.openapi(createTemplateRoute, async (c) => {
  const auth = getAuth(c);
  if (!auth?.userId) {
    return c.json({ message: "Unauthorized" }, 401);
  }

  const { name, description, html_content, variables } = c.req.valid("json");

  const now = Math.floor(Date.now() / 1000);

  try {
    const id = crypto.randomUUID();
    const variablesJson = variables ? JSON.stringify(variables) : null;

    // Auto-generate unique slug (checks duplicates and regenerates if needed)
    const slug = await generateUniqueSlug(c.env.DB);

    await c.env.DB.prepare(
      "INSERT INTO templates (id, slug, name, description, user_id, html_content, variables, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)"
    )
      .bind(id, slug, name, description || null, auth.userId, html_content, variablesJson, now, now)
      .run();

    // Fetch the created template
    const created = await c.env.DB.prepare(
      "SELECT id, slug, name, description, user_id, html_content, variables, created_at, updated_at FROM templates WHERE id = ?"
    )
      .bind(id)
      .first<Template>();

    return c.json(
      {
        success: true,
        data: created,
      },
      201
    );
  } catch (e: unknown) {
    console.error(e);
    const message = e instanceof Error ? e.message : "Unknown error";
    return c.json({ message: `Failed to create template: ${message}` }, 500);
  }
});

templates.openapi(updateTemplateRoute, async (c) => {
  const auth = getAuth(c);
  if (!auth?.userId) {
    return c.json({ message: "Unauthorized" }, 401);
  }

  const { id } = c.req.valid("param");
  const updates = c.req.valid("json");

  try {
    // Find by UUID or slug
    const idIsUuid = isUuid(id);
    const column = idIsUuid ? "id" : "slug";

    // Check ownership
    const existing = await c.env.DB.prepare(
      `SELECT id FROM templates WHERE ${column} = ? AND user_id = ?`
    )
      .bind(id, auth.userId)
      .first<{ id: string }>();

    if (!existing) {
      return c.json({ message: "Template not found" }, 404);
    }

    // Build update query dynamically
    const updateFields: string[] = [];
    const values: unknown[] = [];

    if (updates.name !== undefined) {
      updateFields.push("name = ?");
      values.push(updates.name);
    }
    if (updates.description !== undefined) {
      updateFields.push("description = ?");
      values.push(updates.description);
    }
    if (updates.html_content !== undefined) {
      updateFields.push("html_content = ?");
      values.push(updates.html_content);
    }
    if (updates.variables !== undefined) {
      updateFields.push("variables = ?");
      values.push(updates.variables ? JSON.stringify(updates.variables) : null);
    }

    // Always update updated_at
    updateFields.push("updated_at = ?");
    values.push(Math.floor(Date.now() / 1000));

    // Add WHERE clause values
    values.push(existing.id, auth.userId);

    await c.env.DB.prepare(
      `UPDATE templates SET ${updateFields.join(", ")} WHERE id = ? AND user_id = ?`
    )
      .bind(...values)
      .run();

    // Fetch updated template
    const updated = await c.env.DB.prepare(
      "SELECT id, slug, name, description, user_id, html_content, variables, created_at, updated_at FROM templates WHERE id = ?"
    )
      .bind(existing.id)
      .first<Template>();

    return c.json({
      success: true,
      data: updated,
    });
  } catch (e) {
    console.error(e);
    return c.json({ message: "Failed to update template" }, 500);
  }
});

templates.openapi(deleteTemplateRoute, async (c) => {
  const auth = getAuth(c);
  if (!auth?.userId) {
    return c.json({ message: "Unauthorized" }, 401);
  }

  const { id } = c.req.valid("param");

  try {
    // Find by UUID or slug
    const idIsUuid = isUuid(id);
    const column = idIsUuid ? "id" : "slug";

    // Delete (idempotent - success even if already deleted)
    await c.env.DB.prepare(`DELETE FROM templates WHERE ${column} = ? AND user_id = ?`)
      .bind(id, auth.userId)
      .run();

    return c.json({
      success: true,
    });
  } catch (e) {
    console.error(e);
    return c.json({ message: "Failed to delete template" }, 500);
  }
});

export default templates;
