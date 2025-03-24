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
        this.router.get(
          `${this.path}/register`,
          forwardAuthMiddleware,
          ...this.showRegisterPage
        );
        this.router.post(`${this.path}/register`, ...this.registerUser);
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
        this.router.post(
          `${this.path}/profile`,
          authMiddleware,
          ...this.updateProfile
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
    
       private showProfile = this.factory.createHandlers(async (c) => {
        const session = c.get("session");
        const userId = session.get("userId");
        
        if (!userId) {
          return c.redirect("/auth/login");
        }
        
        const user = await this._authService.getUserById(userId);
    
        if (!user) {
          return c.redirect("/auth/login");
        }
        
        const error = c.req.query("error") || "";
        const success = c.req.query("success") || "";
    
        return c.html(
          <Layout>
            <Header />
            <Profile user={user} error={error} success={success} />
          </Layout>
          );
        });
    
        private updateProfile = this.factory.createHandlers(async (c) => {
          try {
            const session = c.get("session");
            const userId = session.get("userId");
            
            if (!userId) {
              return c.redirect("/auth/login");
            }
    
            const existingUser = await this._authService.getUserById(userId);
            if (!existingUser) {
              return c.redirect("/auth/login");
            }
            
            const formData = await c.req.parseBody();
            
            const updateData: IUser = {
              id: existingUser.id,
              email: formData.email as string || existingUser.email,
              password: existingUser.password,
              username: formData.username as string || existingUser.username,
              fName: formData.fName as string || existingUser.fName,
              lName: formData.lName as string|| existingUser.lName,
              createdAt: existingUser.createdAt,
              updatedAt: new Date().toISOString(),
            }
            
            if (formData.password && (formData.password as string).trim() !== '') {
              updateData.password = formData.password as string;
            } 
            
            await this._authService.updateUser(updateData);
            
            return c.redirect("/auth/profile?success=Profile updated successfully");
          } catch (error: any) {
            return c.redirect(`/auth/profile?error=${encodeURIComponent(error.message)}`);
          }
        });
      }