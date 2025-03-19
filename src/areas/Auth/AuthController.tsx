import { Layout } from "../../shared/Layout";
import { Login, Register } from "./views";
import { IController, IAuthService } from "../../shared/interfaces";
import { BaseController } from "../../shared/BaseController";
import { z } from "zod";
import { UserDTO, LoginDTO } from "../../shared/dtos";
import { IUser } from "../../shared/dtos";
import { authMiddleware, forwardAuthMiddleware } from "../../middlewares";
import { Profile } from "./views/Profile";
import { Header } from "../Posts/views/Header";

export class AuthController extends BaseController implements IController {
  public readonly path: string = "/auth";
  private _authService: IAuthService;

  constructor(service: IAuthService) {
    super();
    this._authService = service;
    this.initializeRoutes();
  }

  private initializeRoutes() {
    // Register Routes
    this.router.get(
      `${this.path}/register`,
      forwardAuthMiddleware,
      ...this.showRegisterPage
    );
    this.router.post(`${this.path}/register`, ...this.registerUser);
    // Login Routes
    this.router.get(
      `${this.path}/login`,
      forwardAuthMiddleware,
      ...this.showLoginPage
    );
    this.router.post(`${this.path}/login`, ...this.loginUser);
    this.router.get(`${this.path}/logout`, ...this.logoutUser);
    this.router.get(
      `${this.path}/profile`,
      authMiddleware,
      ...this.showProfile
    );
  }

  /*
   *********************
   *  Register Routes  *
   *********************
   */
  private showRegisterPage = this.factory.createHandlers((c) => {
    const error = c.req.query("error") || "";
    return c.render(
      <Layout>
        <Register error={error} />
      </Layout>
    );
  });

  private registerUser = this.factory.createHandlers(async (c) => {
    const { error, data: validatedUser } = UserDTO.safeParse(
      await c.req.parseBody()
    );
    if (error) return c.redirect("/auth/login");
    try {
      const newUser = await this._authService.createUser(validatedUser);
      const session = c.get("session");
      session.set("userId", newUser.id || null);
    } catch (error: any) {
      return c.redirect(
        `/auth/register?error=${encodeURIComponent(error.message)}`
      );
    }
    return c.redirect("/auth/login");
  });
  /*
   *********************
   *   Login Routes    *
   *********************
   */
  private showLoginPage = this.factory.createHandlers((c) => {
    const error = c.req.query("error") || "";
    return c.render(
      <Layout>
        <Login error={error} />
      </Layout>
    );
  });

  private loginUser = this.factory.createHandlers(async (c) => {
  try {
      const loginCredentials = LoginDTO.parse(await c.req.parseBody());
      const foundUser = await this._authService.loginUser(loginCredentials);
     
      const session = c.get("session");
      session.set("userId", foundUser.id!);
      return c.redirect("/posts");
    } catch (err) {
      let errorMessage = "";
      if (err instanceof z.ZodError) {
        errorMessage = err.issues[0].message;
      } else if (err instanceof Error) {
        errorMessage = err.message;
      }
      return c.redirect(
        `/auth/login?error=${encodeURIComponent(errorMessage)}`
      );
    }
  });

  private logoutUser = this.factory.createHandlers(async (c) => {
    const session = c.get("session");
    session.set("userId", null);
    return c.redirect("/auth/login");
  });

  /*
   *********************
   *  Profile Routes   *
   *********************
   */

  private showProfile = this.factory.createHandlers((c) =>
    c.html(
      <Layout>
        <Header />
        <Profile />
      </Layout>
    )
  );
}
