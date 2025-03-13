import { postsDb } from "../../../database/fakeDB";
export class MockPostsService {
    async deletePost({ id }) {
        const foundPost = postsDb.findIndex((post) => post.id === id);
        if (!foundPost)
            throw new Error("Post not found");
        postsDb.splice(foundPost, 1);
    }
    async findPostById(id) {
        return postsDb.find((post) => post.id === id);
    }
    async createPost(post, userId) {
        const newPost = { id: Date.now(), userId, ...post };
        postsDb.push(newPost);
        return newPost;
    }
    async getPosts() {
        return postsDb;
    }
}
//# sourceMappingURL=MockPostsService.js.map