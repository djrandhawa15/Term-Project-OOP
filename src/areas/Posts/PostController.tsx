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
  commentCreateSchema,
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
  }

  // Update Post
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

  // Delete Post
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

  // Create Posts
  private createPosts = this.factory.createHandlers(async(c) => {
    const body = await c.req.parseBody();
    // const validatedPost = PostSchema.parse(body)
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
  private getComments = this.factory.createHandlers(async (c) => {
    // 🚀 TODO: Implement this (In Phase 2)
    const id = c.req.param("id");

    if(!id) return c.json({ success: false, message: "Post ID missing" })
    const postId = parseInt(id)

    try {
      const comments = await this._postsService.getCommentsByPost(postId);
      return c.json({ success: true, count: comments.length, comments })
    } catch (error) {
      console.error("Error fetching comments", error)
      return c.json({ success: false, message: "Error fetching comments" })
    }
  });

  private createComment = this.factory.createHandlers(async (c) => {
    // 🚀 TODO: Implement this (In Phase 2)

    const id = c.req.param("id");
    if(!id) return c.json({ success: false, message: "Post ID missing" })
    
    const postId = parseInt(id);
    const body = await c.req.parseBody();
    const commentData = commentCreateSchema.parse(body)
    const user = c.get("user");

    if(!user) return c.redirect("/auth/login")
    try {
      const newComment = await this._postsService.createComment(commentData, user.id, postId)
      return c.json({ success: true, comment: newComment })
    } catch (error) {
      console.error("Error creating comment", error)
      return c.json({ success: false, message: "Error creating comment" })
    }
  });
}
