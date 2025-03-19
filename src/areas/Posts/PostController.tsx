import { Layout } from "../../shared/Layout";
import { IController, IPostsService } from "../../shared/interfaces";
import { BaseController } from "../../shared/BaseController";
import { Index } from "./views/index";
import { authMiddleware } from "../../middlewares";
import { Header } from "./views/Header";
import { EditPost } from "./views/EditPost";
import { PostSchema } from "../../shared/dtos";

export class PostController extends BaseController implements IController {
  public readonly path: string = "/posts";
  private _postsService: IPostsService;

  constructor(service: IPostsService) {
    super();
    this._postsService = service;
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.post(`${this.path}`, authMiddleware, ...this.createPosts)

    this.router.post(
      `${this.path}/:id/comment`,
      authMiddleware,
      ...this.createComment
    );
    this.router.get(
      `${this.path}/:id/comments`,
      authMiddleware,
      ...this.getComments
    );
    this.router.get(
      `${this.path}/edit/:id`,
      authMiddleware,
      ...this.editPostPage
    );
    this.router.get(`${this.path}/*`, authMiddleware, ...this.showPostsPage);
  }


  // Create Posts
  private createPosts = this.factory.createHandlers(async(c) => {
    const body = await c.req.parseBody();
    const validatedPost = PostSchema.parse(body)
    const user = c.get("user");
    if(!user) {
      return c.redirect("/auth/login");
    } 
    try {
      if (typeof body.content === "string") {
        await this._postsService.createPost({ text: body.content }, user.id);
      }    
    } catch (error) {
      console.error("Error creating post", error)
    }
    return c.redirect("/posts")
  })

  /*
   *********************
   *  Home Routes  *
   *********************
   */
  private showPostsPage = this.factory.createHandlers(async (c) => {
    console.log("The currently logged in User:");
    const user = c.get("user");
    console.log(user);
    const posts = await this._postsService.getPosts();
    return c.render(
      <Layout>
        <Header />
        <Index posts={posts} />
      </Layout>
    );
  });

  private editPostPage = this.factory.createHandlers(async(c) => {
    const id = c.req.param("id");
    if (!id) throw new Error("id missing");
    const posts = await this._postsService.getPosts()
    return c.render(
      <Layout>
        <Header />
        <EditPost post={posts[parseInt(id)].text} />
      </Layout>
    );
  });

  /*
   *********************
   *  Comment Routes  *
   *********************
   */
  private getComments = this.factory.createHandlers((c) => {
    // 🚀 TODO: Implement this (In Phase 2)
    return c.json([]);
  });

  private createComment = this.factory.createHandlers((c) => {
    // 🚀 TODO: Implement this (In Phase 2)
    const createdCommented = {};
    return c.json(createdCommented);
  });
}
