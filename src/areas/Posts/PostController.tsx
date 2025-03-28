import { Layout } from "../../shared/Layout";
import { IController, IPostsService } from "../../shared/interfaces";
import { BaseController } from "../../shared/BaseController";
import { Index } from "./views/index";
import { authMiddleware } from "../../middlewares";
import { Header } from "./views/Header";
import { EditPost } from "./views/EditPost";
import { PostSchema } from "../../shared/dtos";
import {
  postCreateSchema,
  postUpdateSchema,
  postDeleteSchema,
} from "../../shared/dtos";

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

    this.router.post(`${this.path}/delete/:id`, authMiddleware, ...this.deletePost)

    this.router.post(`${this.path}/update/:id`, authMiddleware, ...this.updatePost)

    this.router.get(`${this.path}/edit/:id`, authMiddleware, ...this.editPostPage)

    this.router.post(`${this.path}/:id/like`, authMiddleware, ...this.toggleLike);

  }


  private toggleLike = this.factory.createHandlers(async (c) => {
    const id = c.req.param("id");
    if (!id) throw new Error("Post ID missing");
    
    const user = c.get("user");
    if (!user) {
      if (c.req.header("X-Requested-With") === "XMLHttpRequest") {
        return c.json({ 
          success: false, 
          error: "Authentication required" 
        }, 401);
      }
      return c.redirect("/auth/login");
    }
    
    const postId = parseInt(id);
    const body = await c.req.parseBody();
    
    let likeValue = 1;  
    if (body.action === "unlike") {
      likeValue = -1; 
    }    

    try {
      await this._postsService.toggleLike(postId, user.id, likeValue);
      
      const isAjax = c.req.header("X-Requested-With") === "XMLHttpRequest";
      
      if (isAjax) {
        const updatedPost = await this._postsService.getPostById(postId, user.id);
        return c.json({ 
          success: true, 
          post: updatedPost 
        });
      } else {
        return c.redirect("/posts");
      }
    } catch (error) {
      if (c.req.header("X-Requested-With") === "XMLHttpRequest") {
        return c.json({ 
          success: false, 
          error: (error as Error).message 
        });
      }
      throw error;
    }
  });

  private updatePost = this.factory.createHandlers(async (c) => {
    const id = c.req.param("id")
    if(!id) throw new Error("Post ID Missing")
    const body = await c.req.parseBody()
    const updateData = postUpdateSchema.parse({ 
      id: parseInt(id),
      text: body.content || body.text
    })
    const user = c.get("user")
    if(!user) return c.redirect("/auth/login")
    try {
      await this._postsService.updatePost(updateData, user.id)
    } catch (error) {
      console.error("Error updating post", error)
      throw error;
    }
    return c.redirect("/posts")
  })

  private deletePost = this.factory.createHandlers(async (c) => {
    const id = c.req.param("id")
    if(!id) throw new Error("Post ID missing")
    
    const user = c.get("user");
    if (!user) return c.redirect("/auth/login");
    
    const deleteData = postDeleteSchema.parse({ id: parseInt(id)})
    try {
      await this._postsService.deletePost(deleteData, user.id)
    } catch (error) {
      console.error("Error deleting post", error)
      throw error;
    }
    return c.redirect("/posts");
  })

  private createPosts = this.factory.createHandlers(async(c) => {
    const body = await c.req.parseBody();
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
    const user = c.get("user");
    console.log(`The currently logged in User:${user}`);

   let posts;
  if (user) {
    posts = await this._postsService.getPosts(user.id);
  } else {
    posts = await this._postsService.getPosts();
  }
  
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
    const postId = parseInt(id)
    
    const user = c.get("user");
    if (!user) return c.redirect("/auth/login");
    
    const postDetails = await this._postsService.getPostById(postId);
    if (!postDetails) throw new Error("Post not found");
    
    if (postDetails.author !== user.username) {
      throw new Error("You cannot edit posts you don't own");
    }
    
    return c.render(
      <Layout>
        <Header />
        <EditPost post={postDetails.text} postId={postDetails.id!} />
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