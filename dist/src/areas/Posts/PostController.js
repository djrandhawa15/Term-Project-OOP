import { jsx as _jsx, jsxs as _jsxs } from "hono/jsx/jsx-runtime";
import { Layout } from "../../shared/Layout";
import { BaseController } from "../../shared/BaseController";
import { Index } from "./views/index";
import { authMiddleware } from "../../middlewares";
import { Header } from "./views/Header";
import { EditPost } from "./views/EditPost";
export class PostController extends BaseController {
    path = "/posts";
    _postsService;
    constructor(service) {
        super();
        this._postsService = service;
        this.initializeRoutes();
    }
    initializeRoutes() {
        this.router.post(`${this.path}/:id/comment`, authMiddleware, ...this.createComment);
        this.router.get(`${this.path}/:id/comments`, authMiddleware, ...this.getComments);
        this.router.get(`${this.path}/edit/:id`, authMiddleware, ...this.editPostPage);
        this.router.get(`${this.path}/*`, authMiddleware, ...this.showPostsPage);
    }
    /*
     *********************
     *  Home Routes  *
     *********************
     */
    showPostsPage = this.factory.createHandlers(async (c) => {
        console.log("The currently logged in User:");
        const user = c.get("user");
        console.log(user);
        const posts = await this._postsService.getPosts();
        return c.render(_jsxs(Layout, { children: [_jsx(Header, {}), _jsx(Index, { posts: posts })] }));
    });
    editPostPage = this.factory.createHandlers((c) => {
        const id = c.req.param("id");
        const posts = [
            {
                id: 1,
                author: "Sarah Chen",
                handle: "@sarahcodes",
                avatar: "https://morgancarter.com.au/assets/images/blog/encouraging-upload/thumbnail.png",
                content: "Just deployed my first React component library! Check out the documentation site I built using Tailwind and TypeScript.",
                likes: 423,
                liked: false,
                time: "2h",
            },
            {
                id: 2,
                author: "DevHouse Team",
                handle: "@devhouse",
                avatar: "https://morgancarter.com.au/assets/images/blog/encouraging-upload/thumbnail.png",
                content: "We're excited to announce our new community features! Join a coding circle and collaborate.",
                likes: 1205,
                liked: false,
                time: "5h",
            },
        ];
        return c.render(_jsxs(Layout, { children: [_jsx(Header, {}), _jsx(EditPost, { post: posts[parseInt(id)].content })] }));
    });
    /*
     *********************
     *  Comment Routes  *
     *********************
     */
    getComments = this.factory.createHandlers((c) => {
        // 🚀 TODO: Implement this (In Phase 2)
        return c.json([]);
    });
    createComment = this.factory.createHandlers((c) => {
        // 🚀 TODO: Implement this (In Phase 2)
        const createdCommented = {};
        return c.json(createdCommented);
    });
}
//# sourceMappingURL=PostController.js.map