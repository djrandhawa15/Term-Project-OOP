import { jsx as _jsx, jsxs as _jsxs } from "hono/jsx/jsx-runtime";
import { html } from "hono/html";
const Head = () => {
    return (_jsxs("head", { children: [_jsx("title", { children: "DevHouse" }), _jsx("meta", { name: "viewport", content: "initial-scale=1,maximum-scale=1,user-scalable=no" }), html ` <script src="/static/script.js"></script> `, _jsx("link", { rel: "stylesheet", href: "/static/index.css" }), _jsx("link", { rel: "icon", type: "image/x-icon", href: "/static/favicon.ico" }), _jsx("link", { rel: "stylesheet", href: "https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.9.0/styles/default.min.css" }), _jsx("script", { src: "https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.9.0/highlight.min.js" })] }));
};
export const Layout = ({ children, }) => {
    return (_jsxs("html", { children: [_jsx(Head, {}), _jsx("body", { children: children }), _jsx("script", { children: "hljs.highlightAll();" })] }));
};
//# sourceMappingURL=Layout.js.map