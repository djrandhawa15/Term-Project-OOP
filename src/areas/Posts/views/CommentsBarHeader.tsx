type Props = { 
  postId?: number;
};

export function CommentsBarHeader({ postId }: Props) {
  return (
    <div class="flex justify-between items-center mb-6">
      <h2 class="text-lg lg:text-2xl font-bold text-gray-900 dark:text-white" id="comment-header">
        Discussion (0 Comments)
      </h2>
    </div>
  );
}