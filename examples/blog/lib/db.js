const BLOG_POSTS = [
  { id: 1, title: "First Post" },
  { id: 2, title: "Second Post" },
]

export async function getBlogPosts() {
  await new Promise((resolve) => setTimeout(resolve, 2000));
  return BLOG_POSTS;
}