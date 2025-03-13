import { jsx as _jsx } from "hono/jsx/jsx-runtime";
import { Layout } from "../../shared/Layout";
import { BaseController } from "../../shared/BaseController";
import { Index } from "./views/index";
import { forwardAuthMiddleware } from "../../middlewares";
export class HomeController extends BaseController {
    path = "/";
    constructor() {
        super(); // BaseController.constructor()
        this.initializeRoutes();
    }
    initializeRoutes() {
        // Register Routes
        this.router.get(`${this.path}/*`, forwardAuthMiddleware, ...this.showHomePage);
    }
    /*
     *********************
     *  Home Routes  *
     *********************
     */
    showHomePage = this.factory.createHandlers((c) => {
        return c.html(_jsx(Layout, { children: _jsx(Index, {}) }));
    });
}
//# sourceMappingURL=HomeController.js.map