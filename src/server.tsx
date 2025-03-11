import { Hono } from "hono";
import { errorHandler, notFound } from "./middlewares/index";
import { IController } from "./shared/interfaces";
import { prettyJSON } from "hono/pretty-json";
import { serveStatic } from "@hono/node-server/serve-static";
import { logger } from "hono/logger";
import { Session, sessionMiddleware, CookieStore, RedisStore } from "hono-sessions-redis";
import Redis from "ioredis";


export class App {
  private _app: Hono;
  constructor(controllers: IController[]) {
    this._app = new Hono({ strict: false });
    this.initMiddleware();
    this.initControllers(controllers);
    this.initErrorHandling();
  }

  public build() {
    return this._app;
  }

  private async initMiddleware() {
    
    this._app.use("*", logger(), prettyJSON());
    this._app.use("/static/*", serveStatic({ root: "./" }));
    // const store = new CookieStore();
    let store;
    //for production maybe
    // const store = new redisStore({
    if (process.env.NODE_ENV === "production") {
      const redisClient = new Redis({
        host: process.env.REDIS_HOST || "127.0.0.1",
        port: parseInt(process.env.REDIS_PORT || "6379"),
        password: process.env.REDIS_PASSWORD || undefined,
      });
      store = new RedisStore(redisClient);
    } else {
      store = new CookieStore();
    }
    this._app.use('*', sessionMiddleware({
      store,
      encryptionKey: 'password_at_least_32_characters_long', // Required for CookieStore, recommended for others
      expireAfterSeconds: 900, // Expire session after 15 minutes of inactivity
      cookieOptions: {
        sameSite: 'Lax', // Recommended for basic CSRF protection in modern browsers
        path: '/', // Required for this library to work properly
        httpOnly: true, // Recommended to avoid XSS attacks
      },
    }))
  }

  private initErrorHandling() {
    this._app.onError((err, c) => {
      return errorHandler(c, (err as any).status || 500);
    });
    this._app.notFound((c) => {
      return notFound(c);
    });
  }

  private initControllers(controllers: IController[]) {
    controllers.forEach((controller) => {
      this._app.route("/", controller.router);
    });
  }
}
