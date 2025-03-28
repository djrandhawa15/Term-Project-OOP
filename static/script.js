document.addEventListener("DOMContentLoaded", () => {
  let currentPostId = null;

  function openNav() {
    document.getElementById("sideBar").style.width = "100%";
    document.getElementById("sideNav").style.width = "40%";
  }

  /*Close navigation*/
  function exitNav() {
    document.getElementById("sideBar").style.width = "0";
    document.getElementById("sideNav").style.width = "0";
  }

  document.querySelectorAll(".navBtn").forEach((btn) => {
    btn.onclick = async (e) => {
      e.preventDefault();
      currentPostId = btn.getAttribute("data-post-id");
      if (currentPostId) {
        await loadComments(currentPostId);
        openNav();
      }
    };
  });

  document.querySelector("#Xbtn").onclick = () => {
    exitNav();
  };

  async function loadComments(postId) {
    try {
      const response = await fetch(`/posts/${postId}/comments`);
      const data = await response.json();
      
      if (data.success) {
        const commentsList = document.getElementById("comments-list");
        commentsList.innerHTML = data.comments.map(comment => `
          <article class="p-6 mb-4 text-base bg-white rounded-lg dark:bg-gray-900">
            <footer class="flex justify-between items-center mb-2">
              <div class="flex items-center">
                <p class="inline-flex items-center mr-3 text-sm text-gray-900 dark:text-white">
                  <img class="mr-2 w-6 h-6 rounded-full" src="https://flowbite.com/docs/images/people/profile-picture-2.jpg" alt="${comment.username}">
                  ${comment.username}
                </p>
                <p class="text-sm text-gray-600 dark:text-gray-400">
                  <time datetime="${comment.createdAt}">${new Date(comment.createdAt).toLocaleDateString()}</time>
                </p>
              </div>
            </footer>
            <p class="text-gray-500 dark:text-gray-400">${comment.text}</p>
          </article>
        `).join('');
      }
    } catch (error) {
      console.error("Error loading comments:", error);
    }
  }

  const commentForm = document.getElementById("comment-form");
  if (commentForm) {
    commentForm.addEventListener("submit", async (e) => {
      e.preventDefault();
      if (!currentPostId) {
        console.error("No post ID found");
        return;
      }

      const formData = new FormData(commentForm);
      const submitButton = commentForm.querySelector('button[type="submit"]');
      
      try {
        submitButton.disabled = true;
        submitButton.textContent = "Posting...";

        const response = await fetch(`/posts/${currentPostId}/comment`, {
          method: "POST",
          body: formData
        });
        
        const data = await response.json();
        
        if (data.success) {
          commentForm.reset();
          await loadComments(currentPostId);
        } else {
          console.error("Failed to post comment:", data.message);
        }
      } catch (error) {
        console.error("Error posting comment:", error);
      } finally {
        submitButton.disabled = false;
        submitButton.textContent = "Post comment";
      }
    });
  }

  const dropdown = document.querySelector("#dropdown");
  const dropdownItems = document.querySelector("#dropdown-items");

  // Toggle dropdown visibility when the dropdown button is clicked
  dropdown.onclick = (e) => {
    e.stopPropagation(); // 🙅‍♂️ Prevent the click event from bubbling up to the document
    dropdownItems.classList.toggle("hidden");
  };

  // Close the dropdown when clicking outside of it
  document.addEventListener("click", (e) => {
    if (!dropdown.contains(e.target) && !dropdownItems.contains(e.target)) {
      dropdownItems.classList.add("hidden");
    }
  });

  // Get the textarea element
  const textarea = document.getElementById("post-textarea");

  // Function to auto-resize the textarea
  function autoResizeTextarea() {
    textarea.style.height = "auto"; // Reset the height
    textarea.style.height = `${textarea.scrollHeight}px`; // Set the height to the scroll height
  }

  // Add an event listener for the 'input' event
  textarea.addEventListener("input", autoResizeTextarea);

  // Optionally, trigger the resize on page load if there's initial content
  autoResizeTextarea();
});
