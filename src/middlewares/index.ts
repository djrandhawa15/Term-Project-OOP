import { Context, Next } from "hono";
import { getCookie, setCookie } from "hono/cookie";
import { redisClient } from "../database/sessionDB";
import { randomUUID } from "crypto";
import { StatusCode } from "hono/utils/http-status";
import { Session } from "hono-sessions";


/**
 * Forward authentication middleware
 * Redirects authenticated users away from auth pages
 */
export const forwardAuthMiddleware = async (c: Context, next: Next) => {
  try {
    const session = c.get("session");
    const user = session.get('user');
    if (user) {
      return c.redirect("/posts");
    }
    
    return await next();
  } catch (error) {
    console.log("Error in forwardAuthMiddleware:", error);
    return await next();
  }
};

export const authMiddleware = async (c: Context, next: Next) => {
  try {
    const session = c.get("session");
    const user = session.get('user');

  if (!user) {
    return c.redirect("/auth/login");
  }

  c.set("userId", user); 
  await next();
} catch (error) {
  console.log("Error in authMiddleware:", error);
  return c.redirect("/auth/login");
}
};

export const errorHandler = (c: Context, status: number = 401) => {
  return c.json(
    {
      success: false,
      message: c.error?.message,
      stack: process.env.NODE_ENV === "production" ? null : c.error?.stack,
    },
    status as any
  );
};

export const notFound = (c: Context) => {
  return c.json(
    {
      success: false,
      message: `Not Found - [${c.req.method}] ${c.req.url}`,
    },
    404
  );
};