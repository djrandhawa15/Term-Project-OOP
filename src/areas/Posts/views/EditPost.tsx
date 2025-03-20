export function EditPost({ post, postId }: { post: string; postId: number }) {
  return (
    <main className="max-w-4xl mx-auto">
      <h1 className="text-center mt-10 text-4xl font-extrabold text-indigo-600">
        Edit Post
      </h1>
      <div className="bg-white rounded-lg shadow-sm mt-4 p-4 hover:bg-gray-100 transition-all duration-300 ease-in-out">
        {/* <form onSubmit={() => {}}> */}
        <form action={`/posts/update/${postId}`} method="post">
          <div className="flex space-x-4">
            <div className="w-10 h-10 rounded-full bg-indigo-100 flex-shrink-0 flex items-center justify-center overflow-hidden">
              <img
                src="https://morgancarter.com.au/assets/images/blog/encouraging-upload/thumbnail.png"
                alt="Your profile"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="flex-grow">
              <textarea
                name="text"
                id="post-textarea"
                className="w-full border-0 text-lg resize-none placeholder-gray-400 p-2 rounded outline-none hover:bg-gray-100 transition-all duration-300 ease-in-out"
                rows={3}
              >
                {post}
              </textarea>
            </div>
          </div>
          <div className="mt-2 flex justify-end">
            <button
              type="submit"
              className="px-4 py-2 bg-indigo-600 text-white font-medium rounded-full hover:bg-indigo-700 focus:outline-none"
            >
              Update
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}
