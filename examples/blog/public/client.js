window.addEventListener('load', async () => {
  const $title = document.getElementById('title');
  const $description = document.getElementById('description');
  const $content = document.getElementById('content');

  $title.textContent = 'Loading...';

  const request = Streamson("/data");
  const data = await request.get();
  $title.textContent = data.title;
  $description.textContent = data.description;

  const posts = await request.get('posts');
  $content.innerHTML = posts.map(post => `<h2>${post.title}</h2><div id="post-${post.id}"></div>`).join('');

  posts.forEach(loadComments);

  async function loadComments(post) {
    const $post = document.getElementById(`post-${post.id}`);
    $post.innerHTML = '<h3>Comments:</h3><ul>Loading comments...</ul>';
    const comments = await request.get(`posts.${posts.indexOf(post)}.comments`);
    const commentsHtml = comments.map(comment => `<li>${comment.content}</li>`).join('');
    $post.querySelector('ul').innerHTML = commentsHtml;
  }
})