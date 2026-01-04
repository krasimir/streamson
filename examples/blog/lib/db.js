const BLOG_POSTS = [
  { id: 1, title: "First Post" },
  { id: 2, title: "Second Post" },
]

export async function getBlogPosts() {
  await new Promise((resolve) => setTimeout(resolve, 2000));
  return BLOG_POSTS.map(post => ({
    ...post,
    comments: getComments(post.id),
  }));
}
export async function getComments(postId) {
  await new Promise((resolve) => setTimeout(resolve, 1500));
  return [
    { id: 1, postId, content: "Great post!" },
    { id: 2, postId, content: "Thanks for sharing." },
  ];
}