import { Hono } from "hono";
import { Session } from "hono-sessions";
import { createFactory } from "hono/factory";


type SessionDataTypes = {
  'counter': number
}

export abstract class BaseController {
  public router;
  public factory = createFactory();
  constructor() {
    this.router = new Hono({ strict: false });
  }
}
