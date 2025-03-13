import { z } from "zod";
// Define User Schema
export const UserDTO = z.object({
    id: z.number().optional(),
    email: z.string().email(),
    password: z.string().min(6, "Password must be at least 6 characters"),
    createdAt: z.string().optional(),
    updatedAt: z.string().optional(),
});
export const PostSchema = z.object({
    id: z.number().optional(),
    text: z.string().min(1), // min(1) disallows empty strings
    code: z.string().min(1).optional(), // min(1) disallows empty strings
    createdAt: z.string().optional(),
    updatedAt: z.string().optional(),
    userId: z.number().optional(),
    avatar: z.string().optional(),
    author: z.string().optional(),
    liked: z.boolean().optional(),
    likes: z.number().optional(),
});
// For later purposes, we also define a schema for an array of todos
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
//# sourceMappingURL=dtos.js.map