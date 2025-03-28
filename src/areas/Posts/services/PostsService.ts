import { db } from "../../../database/client";
import { IPost, IUser, PostCreate, PostDelete, PostUpdate, IComment, CommentCreate } from "../../../shared/dtos";
import { IPostsService } from "../../../shared/interfaces";

export class PostsService implements IPostsService {
  async getPosts(): Promise<IPost[]> {
    const posts = await db.post.findMany({
      include: { user: true},
    });

    return posts.map((p) => ({
      id: p.id,
      author: p.user.username,
      avatar: "https://morgancarter.com.au/assets/images/blog/encouraging-upload/thumbnail.png",
      text: p.content,
      likes: 0,  // this will change when adding like functionality
      liked: false,
      code: "",
    }));
  }


  async createPost(post: PostCreate, userId: number): Promise<IPost> {
    const newPost = await db.post.create({
      data: {
        content: post.text,
        userId,
      },
      include: { user: true },
    });

    return {
      id: newPost.id,
      author: newPost.user.username,
      avatar: "https://morgancarter.com.au/assets/images/blog/encouraging-upload/thumbnail.png",
      text: newPost.content,
      likes: 0,
      liked: false,
      code: "",
    }
  }
  async deletePost(post: PostDelete, userId: number): Promise<void> {
    // Check if the post belongs to this user
    const existingPost = await db.post.findUnique({
      where: { id: post.id },
      include: { user: true }
    });
    
    if (!existingPost) {
      throw new Error("Post not found");
    }
    
    if (existingPost.userId !== userId) {
      throw new Error("You cannot delete posts you don't own");
    }
    
    await db.post.delete({ 
      where: { id: post.id }
    })
  }
  
  async updatePost(update: PostUpdate, userId: number): Promise<IPost> {
    // Check if the post belongs to the user
    const post = await db.post.findUnique({
      where: { id: update.id },
      include: { user: true }
    });
    
    if (!post) {
      throw new Error("Post not found");
    }
    
    if (post.userId !== userId) {
      throw new Error("You cannot edit posts you don't own");
    }
    
    const updatedPost = await db.post.update({
      where: { id: update.id},
      data: { content: update.text},
      include: { user: true }
    })
    return {
      id: updatedPost.id,
      author: updatedPost.user.username,
      avatar: "https://morgancarter.com.au/assets/images/blog/encouraging-upload/thumbnail.png",
      text: updatedPost.content,
      likes: 0,
      liked: false,
      code: "",
    }
  }

  async getPostById(postId: number): Promise<IPost | null> {
    const post = await db.post.findUnique({
      where: { id: postId },
      include: { user: true }
    });

    if (!post) {
      return null;
    }

    return {
      id: post.id,
      author: post.user.username,
      avatar: "https://morgancarter.com.au/assets/images/blog/encouraging-upload/thumbnail.png",
      text: post.content,
      likes: 0,
      liked: false,
      code: "",
    };
  }



  async getCommentsByPost(postId: number): Promise<IComment[]> {
    const comments = await db.comment.findMany({
      where: { postId },
      include: { user: true },
      orderBy: { createdAt: "asc" }
    })

    return comments.map((c: any) => ({
      id: c.id,
      text: c.text,
      createdAt: c.createdAt.toISOString(),
      userId: c.userId,
      username: c.user.username,
      postId: c.postId,
    }))
  }



  async createComment(comment: CommentCreate, userId: number, postId: number): Promise<IComment> {
    const newComment = await db.comment.create({
      data: {
        text: comment.text,
        userId,
        postId,
      },
      include: { user: true }
    })
    return {
      id: newComment.id,
      text: newComment.text,
      createdAt: newComment.createdAt.toISOString(),
      userId: newComment.userId,
      username: newComment.user.username,
      postId: newComment.postId,
    }
  }
}
