import { IPost, IUser, ILogin, PostCreate, PostDelete, postDeleteSchema, PostUpdate } from "./dtos";

export interface IController {
  path: string;
}

export interface IAuthService {
  createUser(user: IUser): Promise<IUser>;
  loginUser(user: ILogin): Promise<IUser>;
  getUserById(id: number): Promise<IUser | null>;
  updateUser(user: IUser): Promise<IUser>;
}

export interface IPostsService {
  createPost(post: PostCreate, userId: number): Promise<IPost>;
  deletePost(postId: PostDelete, userId: number): Promise<void>;
  getPosts(currentUserId?: number): Promise<IPost[]>;
  updatePost(update: PostUpdate, userId: number): Promise<IPost>
  getPostById(postId: number, currentUserId?: number): Promise<IPost | null>
  toggleLike(postId: number, userId: number, likeValue: number): Promise<void>;
}
