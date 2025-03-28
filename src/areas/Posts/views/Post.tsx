import { TPost } from "../../../shared/dtos";

type Props = { post: TPost };
export function Post({ post }: Props) {
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
              <code className="mt-1 language-js">{post.code}</code>
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
                      d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z"
                      clipRule="evenodd"
                    />
                  </svg>
                ) : (
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="1.5"
                      d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                    />
                  </svg>
                )}
              </div>
              <span id={`like-count-${post.id}`} className={post.liked ? "text-red-500" : "text-gray-500"}>
                {post.likes}
              </span>
            </button>
            
            <a
              href={`/posts/edit/${post.id}`}
              className="text-gray-500 cursor-pointer p-1.5 rounded-full hover:bg-blue-100"
            >
              Edit
            </a>
            
            <form method="post" action={`/posts/delete/${post.id}`}>
              <button
                type="submit"
                className="text-gray-500 cursor-pointer p-1.5 rounded-full hover:bg-blue-100"
              >
                Delete
              </button>
            </form>
            
            <a
              href="#"
              className="text-gray-500 cursor-pointer p-1.5 rounded-full hover:bg-blue-100 navBtn"
              data-post-id={post.id}
            >
              {post.commentCount || 0} {post.commentCount === 1 ? 'Comment' : 'Comments'}
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}