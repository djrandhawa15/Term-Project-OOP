import { jsx as _jsx, jsxs as _jsxs } from "hono/jsx/jsx-runtime";
import { Comment } from "./Comment";
import { CommentsBarHeader } from "./CommentsBarHeader";
import { CommentsSection } from "./CommentsSection";
import { CreateCommentForm } from "./CreateCommentForm";
export function CommentsBar() {
    return (_jsx("div", { id: "sideBar", class: "fixed top-0 right-0 bg-transparent w-0 h-full overflow-x-hidden duration-500 z-10", children: _jsxs("div", { id: "sideNav", class: "fixed top-0 right-0 shadow-lg bg-white text-black w-0 h-full flex justify-center items-baseline overflow-x-hidden duration-500 font-bold z-50", children: [_jsx("a", { id: "Xbtn", href: "javascript:void(0)", class: "text-3xl absolute top-0 right-0 mr-3 mt-2", children: "\u00D7" }), _jsxs(CommentsSection, { children: [_jsx(CommentsBarHeader, {}), _jsx(CreateCommentForm, {}), _jsx(Comment, {})] })] }) }));
}
//# sourceMappingURL=CommentsBar.js.map