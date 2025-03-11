import { Hono } from "hono";
import { errorHandler, notFound } from "./middlewares/index";
import { IController } from "./shared/interfaces";
import { prettyJSON } from "hono/pretty-json";
import { serveStatic } from "@hono/node-server/serve-static";
import { logger } from "hono/logger";
import { RedisStoreAdapter } from "./lib";
import Redis from "ioredis";
import { CookieStore, sessionMiddleware, Session} from "hono-sessions";

type SessionDataTypes = {
  'counter': number
}

export class App {
  private _app;
  private _store: CookieStore | RedisStoreAdapter;
  constructor(controllers: IController[]) {
    this._app = new Hono({ strict: false });
    this._store = this.createStore();
    this.initMiddleware();
    this.initControllers(controllers);
    this.initErrorHandling();
  }

  public build() {
    return this._app;
  }

  private createStore() {
      const redisClient = {
        ttl: 3600,
        prefix: "MySession:",
        client: new Redis({
          host: "redis-18283.c285.us-west-2-2.ec2.redns.redis-cloud.com",
          port: 18283,
          password: "0q8AF1ZfJu3It7YCSckYZteDlQZ0xADr",
          username: "default",
        })
      }
      
      let store = new RedisStoreAdapter(redisClient);
      return store;
  }

  private async initMiddleware() {
    
    this._app.use("*", logger(), prettyJSON());
    this._app.use("/static/*", serveStatic({ root: "./" }));
    // const store = new CookieStore();
    this._app.use('*', sessionMiddleware({
      store: this._store,
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
