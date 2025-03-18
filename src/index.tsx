import { HomeController, PostController, AuthController } from "./areas";
import { MockAuthService, MockPostsService } from "./areas";
import { AuthService } from "./areas/Auth/services/AuthService";
import { PostsService } from "./areas/Posts/services/PostsService";
import { App } from "./server";

const app = new App([
  new HomeController(),
  new AuthController(new AuthService()),
  new PostController(new PostsService()),
]).build();

export default app;
