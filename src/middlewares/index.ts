
import { Context, Next } from "hono";
import { StatusCode } from "hono/utils/http-status";
import { getCookie } from "hono/cookie";
import { redisClient } from "../database/sessionDB";

export const forwardAuthMiddleware = async (c: Context, next: Next) => {
  const sessionId = getCookie(c, "session");
  if (!sessionId) {
    return await next();
  }

  const userId = await redisClient.get(sessionId);
  if (!userId) {
    return await next();
  }

  return c.redirect("/posts");
};

export const authMiddleware = async (c: Context, next: Next) => {
  const sessionId = getCookie(c, "session");
  if (!sessionId) {
    return c.redirect("/auth/login");
  }

  const userId = await redisClient.get(sessionId);
  if (!userId) {
    return c.redirect("/auth/login");
  }

  c.set("userId", userId);
  await next();
};

export const errorHandler = (c: Context, status: number = 401) => {
  return c.json(
    {
      success: false,
      message: c.error?.message,
      stack: process.env.NODE_ENV === "production" ? null : c.error?.stack,
    },
    status as StatusCode
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
