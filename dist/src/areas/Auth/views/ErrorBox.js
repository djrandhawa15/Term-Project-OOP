import { jsx as _jsx } from "hono/jsx/jsx-runtime";
export function Error({ children }) {
    return (_jsx("div", { class: "p-4 mb-4 text-sm text-red-800 rounded-lg bg-red-50 dark:bg-gray-800 dark:text-red-400", role: "alert", children: _jsx("span", { class: "font-medium", children: children }) }));
}
//# sourceMappingURL=ErrorBox.js.map