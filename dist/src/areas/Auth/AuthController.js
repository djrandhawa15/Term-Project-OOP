import { jsx as _jsx, jsxs as _jsxs } from "hono/jsx/jsx-runtime";
import { Layout } from "../../shared/Layout";
import { Login, Register } from "./views";
import { BaseController } from "../../shared/BaseController";
import { z } from "zod";
import { UserDTO } from "../../shared/dtos";
import { authMiddleware, forwardAuthMiddleware } from "../../middlewares";
import { Profile } from "./views/Profile";
import { Header } from "../Posts/views/Header";
export class AuthController extends BaseController {
    path = "/auth";
    _authService;
    constructor(service) {
        super();
        this._authService = service;
        this.initializeRoutes();
    }
    initializeRoutes() {
        // Register Routes
        this.router.get(`${this.path}/register`, forwardAuthMiddleware, ...this.showRegisterPage);
        this.router.post(`${this.path}/register`, ...this.registerUser);
        // Login Routes
        this.router.get(`${this.path}/login`, forwardAuthMiddleware, ...this.showLoginPage);
        this.router.post(`${this.path}/login`, ...this.loginUser);
        this.router.get(`${this.path}/logout`, ...this.logoutUser);
        this.router.get(`${this.path}/profile`, authMiddleware, ...this.showProfile);
    }
    /*
     *********************
     *  Register Routes  *
     *********************
     */
    showRegisterPage = this.factory.createHandlers((c) => {
        const error = c.req.query("error") || "";
        return c.render(_jsx(Layout, { children: _jsx(Register, { error: error }) }));
    });
    registerUser = this.factory.createHandlers(async (c) => {
        const { error, data: validatedUser } = UserDTO.safeParse(await c.req.parseBody());
        if (error)
            return c.redirect("/auth/login");
        try {
            await this._authService.createUser(validatedUser);
        }
        catch (error) {
            return c.redirect(`/auth/register?error=${encodeURIComponent(error.message)}`);
        }
        return c.redirect("/auth/login");
    });
    /*
     *********************
     *   Login Routes    *
     *********************
     */
    showLoginPage = this.factory.createHandlers((c) => {
        const error = c.req.query("error") || "";
        return c.render(_jsx(Layout, { children: _jsx(Login, { error: error }) }));
    });
    loginUser = this.factory.createHandlers(async (c) => {
        try {
            const validatedUser = UserDTO.parse(await c.req.parseBody());
            const foundUser = await this._authService.loginUser(validatedUser);
            const session = c.get("session");
            session.set("userId", foundUser.id);
            return c.redirect("/posts");
        }
        catch (err) {
            let errorMessage = "";
            if (err instanceof z.ZodError) {
                errorMessage = err.issues[0].message;
            }
            else if (err instanceof Error) {
                errorMessage = err.message;
            }
            return c.redirect(`/auth/login?error=${encodeURIComponent(errorMessage)}`);
        }
    });
    logoutUser = this.factory.createHandlers(async (c) => {
        const session = c.get("session");
        session.set("userId", null);
        return c.redirect("/auth/login");
    });
    /*
     *********************
     *  Profile Routes   *
     *********************
     */
    showProfile = this.factory.createHandlers((c) => c.html(_jsxs(Layout, { children: [_jsx(Header, {}), _jsx(Profile, {})] })));
}
//# sourceMappingURL=AuthController.js.map