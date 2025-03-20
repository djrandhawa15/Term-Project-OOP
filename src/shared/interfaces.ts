import { IPost, IUser, ILogin, PostCreate, PostDelete, postDeleteSchema, PostUpdate } from "./dtos";

export interface IController {
  path: string;
  // router: Hono; // TODO: DELETE THIS (NO LONGER NECESSARY)
}

export interface IAuthService {
  createUser(user: IUser): Promise<IUser>;
  loginUser(user: ILogin): Promise<IUser>;
}

export interface IPostsService {
  createPost(post: PostCreate, userId: number): Promise<IPost>;
  deletePost(postId: PostDelete, userId: number): Promise<void>;
  getPosts(): Promise<IPost[]>;

  updatePost(update: PostUpdate, userId: number): Promise<IPost>
  getPostById(postId: number): Promise<IPost | null>
}
