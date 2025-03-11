export const _sessionStore = new Map<string, string>();
import Redis from "ioredis";

export const redisClient = new Redis({
  host: process.env.REDIS_HOST || "127.0.0.1",
  port: parseInt(process.env.REDIS_PORT || "6379"),
  password: process.env.REDIS_PASSWORD || undefined,
});
