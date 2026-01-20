import { getAuth } from "@hono/clerk-auth";
import type { Context } from "hono";
import { HTTPException } from "hono/http-exception";

/**
 * Require authentication and return the auth object
 * Throws HTTPException if user is not authenticated
 */
export function requireAuth(c: Context) {
  const auth = getAuth(c);
  if (!auth?.userId) {
    throw new HTTPException(401, { message: "Unauthorized" });
  }
  return auth;
}
