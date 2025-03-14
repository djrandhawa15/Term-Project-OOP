import { db } from "../../../database/client";
import { IPost, IUser, PostCreate, PostDelete } from "../../../shared/dtos";
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
    console.log("New post created:", newPost);

    const allPosts = await db.post.findMany();
    console.log("All posts in database:", allPosts);


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
  deletePost(postId: PostDelete): Promise<void> {
    throw new Error("Method not implemented.");   // Will add later
  }
  
}
