import { jsx as _jsx, jsxs as _jsxs } from "hono/jsx/jsx-runtime";
import { Post } from "./Post";
export function Index({ posts }) {
    return (_jsx("div", { className: "min-h-screen", children: _jsxs("main", { className: "max-w-2xl mx-auto", children: [_jsx("div", { className: "bg-white rounded-lg shadow-sm mt-4 p-4 hover:bg-gray-100 transition-all duration-300 ease-in-out", children: _jsxs("form", { onSubmit: () => { }, children: [_jsxs("div", { className: "flex space-x-4", children: [_jsx("div", { className: "w-10 h-10 rounded-full bg-indigo-100 flex-shrink-0 flex items-center justify-center overflow-hidden", children: _jsx("img", { src: "https://morgancarter.com.au/assets/images/blog/encouraging-upload/thumbnail.png", alt: "Your profile", className: "w-full h-full object-cover" }) }), _jsx("div", { className: "flex-grow", children: _jsx("textarea", { className: "w-full border-0 text-lg resize-none placeholder-gray-400 p-2 rounded outline-none hover:bg-gray-100 transition-all duration-300 ease-in-out", placeholder: "What's happening?", rows: 3, value: "New Post" }) })] }), _jsx("div", { className: "mt-2 flex justify-end", children: _jsx("button", { type: "submit", className: "cursor-pointer px-4 py-2 bg-indigo-600 text-white font-medium rounded-full hover:bg-indigo-700 focus:outline-none", children: "Post" }) })] }) }), _jsx("div", { className: "mt-4 space-y-4", children: posts.map((p) => {
                        return _jsx(Post, { post: p });
                    }) })] }) }));
}
//# sourceMappingURL=index.js.map