type Props = {
  postId?: number;
};

export function CreateCommentForm({ postId }: Props) {
  return (
    <form id="comment-form" class="mb-6" action={`/posts/${postId}/comment`} method="post">
      <div class="py-2 px-4 mb-4 bg-white rounded-lg rounded-t-lg border border-gray-200 dark:bg-gray-800 dark:border-gray-700">
        <label for="comment" class="sr-only">
          Your comment
        </label>
        <textarea
          id="comment"
          name="text"
          rows={6}
          class="px-0 w-full text-sm text-gray-900 border-0 focus:ring-0 focus:outline-none dark:text-white dark:placeholder-gray-400 dark:bg-gray-800"
          placeholder="Write a comment..."
          required
        ></textarea>
      </div>
      <button
        type="submit"
        class="inline-flex items-center py-2.5 px-4 text-xs font-medium text-center text-gray-900 border-0 focus:ring-0 focus:outline-none dark:text-white dark:placeholder-gray-400 dark:bg-gray-800"
      >
        Post comment
      </button>
    </form>
  );
}
