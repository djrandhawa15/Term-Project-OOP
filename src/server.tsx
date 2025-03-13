import { Hono } from "hono";
import { errorHandler, notFound } from "./middlewares/index";
import { IController } from "./shared/interfaces";
import { prettyJSON } from "hono/pretty-json";
import { serveStatic } from "@hono/node-server/serve-static";
import { logger } from "hono/logger";
import { RedisStoreAdapter } from "./lib";
import Redis from "ioredis";
import { CookieStore, sessionMiddleware, Session} from "hono-sessions";

import dotenv from 'dotenv';
import path from 'path';

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
    this._app.use('*', sessionMiddleware({
      store: this._store,
      encryptionKey: 'password_at_least_32_characters_long', 
      expireAfterSeconds: 900, 
      cookieOptions: {
        sameSite: 'Lax', 
        path: '/', 
        httpOnly: true, 
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
