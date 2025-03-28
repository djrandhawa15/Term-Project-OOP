import { z } from "zod";

export const UserDTO = z.object({
  id: z.number().optional(),
  fName: z.string().min(2, "First name is required"),
  lName: z.string().min(2, "Last name is required"),
  username: z.string().min(6, "Username must be at least 3 characters"),
  email: z.string().email(),
  password: z.string().min(6, "Password must be at least 6 characters"),
  createdAt: z.string().optional(),
  updatedAt: z.string().optional(),
});


export const LoginDTO = z.object({
  email: z.string().email(),
  password: z.string()
})

export const PostSchema = z.object({
  id: z.number().optional(),
  text: z.string().min(1), 
  code: z.string().min(1).optional(),
  createdAt: z.string().optional(),
  updatedAt: z.string().optional(),
  userId: z.number().optional(),
  avatar: z.string().optional(),
  author: z.string().optional(),
  liked: z.boolean().optional(),
  likes: z.number().optional(),
});

export const PostsSchema = z.array(PostSchema);

export const postUpdateSchema = z.object({
  id: z.number(),
  text: z.string(),
});

export const postDeleteSchema = z.object({
  id: z.number(),
});

export const postCreateSchema = z.object({
  text: z.string(),
});

export type TPosts = z.TypeOf<typeof PostsSchema>;
export type TPost = z.TypeOf<typeof PostSchema>;
export type PostUpdate = z.TypeOf<typeof postUpdateSchema>;
export type PostDelete = z.TypeOf<typeof postDeleteSchema>;
export type PostCreate = z.TypeOf<typeof postCreateSchema>;

// Infer TypeScript type from schema
export type IUser = z.infer<typeof UserDTO>;
export type ILogin = z.infer<typeof LoginDTO>
export type IPost = z.infer<typeof PostSchema>;
