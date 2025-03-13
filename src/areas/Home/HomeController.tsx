import { Layout } from "../../shared/Layout";
import { IController } from "../../shared/interfaces";
import { BaseController } from "../../shared/BaseController";
import { Index } from "./views/index";
import { forwardAuthMiddleware } from "../../middlewares";

export class HomeController extends BaseController implements IController {
  public readonly path: string = "/";

  constructor() {
    super();
    this.initializeRoutes();
  }

  private initializeRoutes() {
    // Register Routes
    this.router.get(
      `${this.path}/*`,
      forwardAuthMiddleware,
      ...this.showHomePage
    );
  }

  /*
   *********************
   *  Home Routes  *
   *********************
   */
  private showHomePage = this.factory.createHandlers((c) => {
    // const session = c.get("session");
    // @ts-ignore
    const session = c.get("session");
    // @ts-ignore
    session.set('counter', (session.get('counter') || 0) + 1);
    // @ts-ignore
    console.log(session.get('counter'));

    // session.set('counter', (session.get('counter') || 0) + 1)
    return c.html(
      <Layout>
        <Index />
      </Layout>
    )

  }
  );
}
