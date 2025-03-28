document.addEventListener("DOMContentLoaded", () => {
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
    .forEach((b) => (b.onclick = () => openNav()));

  const exitButton = document.querySelector("#Xbtn");
  if (exitButton) {
    exitButton.onclick = () => exitNav();
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
});