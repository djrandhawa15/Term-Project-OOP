import { IPost, IUser, ILogin, PostCreate, PostDelete, postDeleteSchema, PostUpdate, IComment, CommentCreate } from "./dtos";

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
  getPosts(currentUserId?: number): Promise<IPost[]>;
  createPost(post: PostCreate, userId: number): Promise<IPost>;
  deletePost(postId: PostDelete, userId: number): Promise<void>;
  updatePost(update: PostUpdate, userId: number): Promise<IPost>
  getPostById(postId: number, currentUserId?: number): Promise<IPost | null>
  getCommentsByPost(postId: number): Promise<IComment[]>
  createComment(comment: CommentCreate, userId: number, postId: number): Promise<IComment>
  toggleLike(postId: number, userId: number, likeValue: number): Promise<void>;
}
