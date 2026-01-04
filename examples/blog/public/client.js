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
  $content.innerHTML = posts.map(post => `<h2>${post.title}</h2>`).join('');
})