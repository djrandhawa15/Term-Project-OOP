document.addEventListener("DOMContentLoaded", () => {
  let currentPostId = null;

  function openNav() {
    document.getElementById("sideBar").style.width = "100%";
    document.getElementById("sideNav").style.width = "40%";
  }

  function exitNav() {
    document.getElementById("sideBar").style.width = "0";
    document.getElementById("sideNav").style.width = "0";
  }
  
  document
    .querySelectorAll(".navBtn")
    .forEach((btn) => {
      btn.onclick = async (e) => {
        e.preventDefault();
        e.stopPropagation(); 
        currentPostId = btn.getAttribute("data-post-id");
        if (currentPostId) {
          await loadComments(currentPostId);
          openNav();
        } else {
          openNav();
        }
      };
    });

  const exitButton = document.querySelector("#Xbtn");
  if (exitButton) {
    exitButton.onclick = () => exitNav();
  }

  const sideBar = document.getElementById("sideBar");
  const sideNav = document.getElementById("sideNav");
  
  if (sideBar) {
    sideBar.addEventListener("click", (e) => {
      if (e.target === sideBar) {
        exitNav();
      }
    });
  }
  
  if (sideNav) {
    sideNav.addEventListener("click", (e) => {
      e.stopPropagation();
    });
  }

  const dropdown = document.querySelector("#dropdown");
  const dropdownItems = document.querySelector("#dropdown-items");

  if (dropdown && dropdownItems) {
    dropdown.onclick = (e) => {
      e.stopPropagation(); 
      dropdownItems.classList.toggle("hidden");
    };

    document.addEventListener("click", (e) => {
      if (!dropdown.contains(e.target) && !dropdownItems.contains(e.target)) {
        dropdownItems.classList.add("hidden");
      }
    });
  }

  const textarea = document.getElementById("post-textarea");
  if (textarea) {
    function autoResizeTextarea() {
      textarea.style.height = "auto"; 
      textarea.style.height = `${textarea.scrollHeight}px`;
    }

    textarea.addEventListener("input", autoResizeTextarea);
    autoResizeTextarea();
  }

  document.querySelectorAll('.like-button').forEach(button => {
    button.addEventListener('click', handleLikeClick);
  });

  async function handleLikeClick(event) {
    event.preventDefault();
    const button = event.currentTarget;
    const postId = button.dataset.postId;
    const action = button.dataset.action; 
    
    try {
      const currentLikeCount = parseInt(document.getElementById(`like-count-${postId}`).textContent) || 0;
      const newLikeCount = action === "like" ? currentLikeCount + 1 : Math.max(0, currentLikeCount - 1);
      
      const tempUpdate = {
        id: parseInt(postId),
        likes: newLikeCount,
        liked: action === "like"
      };
      updateLikeUI(button, tempUpdate);
      
      const response = await fetch(`/posts/${postId}/like`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'X-Requested-With': 'XMLHttpRequest'
        },
        body: `action=${action}`
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      
      if (data.success) {
        updateLikeUI(button, data.post);
      } else {
        console.error('Server error:', data.error);
        const revertUpdate = {
          id: parseInt(postId),
          likes: action === "like" ? currentLikeCount : currentLikeCount,
          liked: action !== "like"
        };
        updateLikeUI(button, revertUpdate);
      }
    } catch (error) {
      console.error('Failed to process like:', error);
    }
  }

  function updateLikeUI(button, post) {
    const likeCountElement = document.getElementById(`like-count-${post.id}`);
    if (likeCountElement) {
      likeCountElement.textContent = post.likes;
    }
    
    const isNowLiked = post.liked;
    button.dataset.action = isNowLiked ? 'unlike' : 'like';
    
    const heartIcon = button.querySelector('svg');
    if (heartIcon) {
      if (isNowLiked) {
        heartIcon.innerHTML = `
          <path
            fillRule="evenodd"
            d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z"
            clipRule="evenodd"
          />
        `;
        heartIcon.setAttribute('fill', 'currentColor');
        heartIcon.removeAttribute('stroke');
      } else {
        heartIcon.innerHTML = `
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="1.5"
            d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
          />
        `;
        heartIcon.setAttribute('fill', 'none');
        heartIcon.setAttribute('stroke', 'currentColor');
      }
    }
    
    const iconContainer = button.querySelector('div');
    if (iconContainer) {
      if (isNowLiked) {
        iconContainer.classList.remove('text-gray-500');
        iconContainer.classList.add('text-red-500');
      } else {
        iconContainer.classList.remove('text-red-500');
        iconContainer.classList.add('text-gray-500');
      }
    }
    
    if (likeCountElement) {
      if (isNowLiked) {
        likeCountElement.classList.remove('text-gray-500');
        likeCountElement.classList.add('text-red-500');
      } else {
        likeCountElement.classList.remove('text-red-500');
        likeCountElement.classList.add('text-gray-500');
      }
    }
  }

  async function loadComments(postId) {
    try {
      const response = await fetch(`/posts/${postId}/comments`);
      const data = await response.json();
      
      if (data.success) {
        const commentsList = document.getElementById("comments-list");
        if (commentsList) {
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
      }
      const commentHeader = document.getElementById("comment-header");
      if (commentHeader) {
        const count = data.comments.length;
        commentHeader.textContent = `Discussion (${count} ${count === 1 ? 'Comment' : 'Comments'})`;
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

        console.log("Submitting comment for post ID:", currentPostId);

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
});