const videoContainer = document.getElementById('videoContainer');
const form = document.getElementById('commentForm');
const deleteIcon = document.querySelectorAll('.comment-del');

const deleteComment = async (event) => {
  const dComment = event.target.parentElement;

  const {
    dataset: { id },
  } = event.target.parentElement;

  const videoId = videoContainer.dataset.id;

  const response = await fetch(`/api/videos/${videoId}/comment/delete`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ commentId: id }),
  });

  if (response.status === 200) {
    dComment.remove();
  }
};

const addComment = (text, id) => {
  const videoComments = document.querySelector('.video__comments ul');
  const newComment = document.createElement('li');
  newComment.className = 'video__comment';
  newComment.dataset.id = id;
  const icon = document.createElement('i');
  icon.className = 'fas fa-comment';
  const span = document.createElement('span');
  span.innerText = `${text}`;
  const span2 = document.createElement('span');
  span2.innerText = '❌';
  span2.className = 'comment-del';
  newComment.appendChild(icon);
  newComment.appendChild(span);
  newComment.appendChild(span2);
  videoComments.prepend(newComment);
  span2.addEventListener('click', deleteComment);
};

const handleSubmit = async (event) => {
  event.preventDefault();
  const textarea = form.querySelector('textarea');
  const text = textarea.value;
  const videoId = videoContainer.dataset.id;
  if (text === '') {
    return;
  }
  const response = await fetch(`/api/videos/${videoId}/comment`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ text }),
  });
  if (response.status === 201) {
    textarea.value = '';
    const { newCommentId } = await response.json();
    addComment(text, newCommentId);
  }
};

if (form) {
  form.addEventListener('submit', handleSubmit);
}

if (deleteIcon) {
  deleteIcon.forEach((icon) => icon.addEventListener('click', deleteComment));
}
