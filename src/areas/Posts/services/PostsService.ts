import { db } from "../../../database/client";
import { IPost, IUser, PostCreate, PostDelete, PostUpdate, IComment, CommentCreate } from "../../../shared/dtos";
import { IPostsService } from "../../../shared/interfaces";
import { PrismaClient } from '@prisma/client';

export class PostsService implements IPostsService {
  async getPosts(currentUserId?: number): Promise<IPost[]> {
    const posts = await db.post.findMany({
      include: { 
        user: true,
        likes: true,
        comments: {
          select: {
            id: true
          }
        }
      }
    });

    return posts.map((p) => {
      let isLiked = false;
      if (currentUserId) {
        for (const like of p.likes) {
          if (like.userId === currentUserId) {
            isLiked = true;
            break;
          }
        }
      }

      return {
        id: p.id,
        author: p.user.username,
        avatar: "https://morgancarter.com.au/assets/images/blog/encouraging-upload/thumbnail.png",
        text: p.content,
        likes: p.likesCount,
        liked: isLiked,
        code: "",
        commentCount: p.comments.length
      };
    });
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
    });
  }
  
  async updatePost(update: PostUpdate, userId: number): Promise<IPost> {
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
    });
    
    return {
      id: updatedPost.id,
      author: updatedPost.user.username,
      avatar: "https://morgancarter.com.au/assets/images/blog/encouraging-upload/thumbnail.png",
      text: updatedPost.content,
      likes: updatedPost.likesCount,
      liked: false,
      code: "",
    };
  }

  async getPostById(postId: number, currentUserId?: number): Promise<IPost | null> {
    const post = await db.post.findUnique({
      where: { id: postId },
      include: { user: true, likes: true,  comments: {
        select: {
          id: true
        }
      }
      }
    });

    if (!post) {
      return null;
    }

    let isLiked = false;
    if (currentUserId) {
      for (const like of post.likes) {
        if (like.userId === currentUserId) {
          isLiked = true;
          break;
        }
      }
    }

    return {
      id: post.id,
      author: post.user.username,
      avatar: "https://morgancarter.com.au/assets/images/blog/encouraging-upload/thumbnail.png",
      text: post.content,
      likes: post.likesCount,
      liked: isLiked,
      code: "",
      commentCount: post.comments.length
    };
  }

  async getCommentsByPost(postId: number): Promise<IComment[]> {
    const comments = await db.comment.findMany({
      where: { postId },
      include: { user: true },
      orderBy: { createdAt: "asc" }
    });

    return comments.map((c) => ({
      id: c.id,
      text: c.text,
      createdAt: c.createdAt.toISOString(),
      userId: c.userId,
      username: c.user.username,
      postId: c.postId,
    }));
  }

  async createComment(comment: CommentCreate, userId: number, postId: number | string): Promise<IComment> {
    const parsedPostId = typeof postId === 'string' ? parseInt(postId, 10) : postId;
    
    if (isNaN(parsedPostId)) {
      throw new Error("Invalid post ID");
    }
    
    const post = await db.post.findUnique({
      where: { id: parsedPostId }
    });
    
    if (!post) {
      throw new Error("Post not found");
    }
    
    const newComment = await db.comment.create({
      data: {
        text: comment.text,
        userId,
        postId: parsedPostId
      },
      include: { user: true }
    });
    
    return {
      id: newComment.id,
      text: newComment.text,
      createdAt: newComment.createdAt.toISOString(),
      userId: newComment.userId,
      username: newComment.user.username,
      postId: newComment.postId,
    };
  }

  async toggleLike(postId: number, userId: number, likeValue: number): Promise<void> {
    const post = await db.post.findUnique({
      where: { id: postId },
      include: { user: true }
    });

    if (!post) {
      throw new Error("Post not found");
    }

    const existingLike = await db.like.findUnique({
      where: {
        postId_userId: {
          postId,
          userId
        }
      }
    });
    
    if (likeValue > 0 && !existingLike) {
      await db.like.create({
        data: {
          postId,
          userId
        }
      });
      
      await db.post.update({
        where: { id: postId },
        data: { likesCount: { increment: 1 } }
      });
    } 
    else if (likeValue < 0 && existingLike) {
      await db.like.delete({
        where: {
          postId_userId: {
            postId,
            userId
          }
        }
      });
      
      await db.post.update({
        where: { id: postId },
        data: { likesCount: { decrement: 1 } }
      });
    }
  }

  async getPostsWithLikeStatus(userId: number): Promise<IPost[]> {
    const posts = await db.post.findMany({
      include: { 
        user: true,
        likes: {
          where: {
            userId
          }
        },
        comments: {
          select: {
            id: true
          }
        }
      },
    });

    return posts.map((p) => ({
      id: p.id,
      author: p.user.username,
      avatar: "https://morgancarter.com.au/assets/images/blog/encouraging-upload/thumbnail.png",
      text: p.content,
      likes: p.likesCount,
      liked: p.likes.length > 0,
      code: "",
      commentCount: p.comments.length 
    }));
  }
}