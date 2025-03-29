import { useEffect } from "react";
import hljs from "highlight.js";
import "highlight.js/styles/github.css"; // You can change this to a different theme
import { TPost } from "../../../shared/dtos";

type Props = { post: TPost };

export function Post({ post }: Props) {
  useEffect(() => {
    document.querySelectorAll("pre code").forEach((block) => {
      hljs.highlightElement(block as HTMLElement);
    });
  }, [post.code]);

  return (
    <div
      key={post.id}
      className="bg-white rounded-lg shadow-sm p-4 hover:shadow-md hover:bg-gray-50"
    >
      <div className="flex space-x-3">
        <div className="flex-shrink-0">
          <div className="w-10 h-10 rounded-full bg-gray-200 overflow-hidden">
            <img
              src={post.avatar}
              alt={post.author}
              className="w-full h-full object-cover"
            />
          </div>
        </div>
        <div className="flex-grow">
          <div className="flex items-center space-x-1">
            <span className="font-bold">{post.author}</span>
            <span className="text-gray-500">·</span>
          </div>
          <p className="mt-1">{post.text}</p>
          {post.code && (
            <pre>
              <code className="language-js">{post.code}</code>
            </pre>
          )}
          <div className="mt-3 flex gap-3 items-center">
            <button
              type="button"
              className="flex items-center space-x-1 group like-button"
              data-post-id={post.id}
              data-action={post.liked ? "unlike" : "like"}
            >
              <div
                className={`cursor-pointer p-2 rounded-full hover:bg-red-50 ${
                  post.liked ? "text-red-500" : "text-gray-500"
                }`}
              >
                {post.liked ? (
                  <svg
                    className="w-5 h-5"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M3.172 10.172a4 4 0 010-5.656l.707-.707a4 4 0 015.656 0l.707.707.707-.707a4 4 0 015.656 0l.707.707a4 4 0 010 5.656l-7.071 7.071a1 1 0 01-1.414 0l-7.071-7.071z"
                      clipRule="evenodd"
                    />
                  </svg>
                ) : (
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    strokeWidth={2}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M5 15l7-7 7 7"
                    />
                  </svg>
                )}
              </div>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
