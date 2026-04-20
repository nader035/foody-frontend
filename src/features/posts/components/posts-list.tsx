"use client";

import { usePosts } from "@/features/posts/hooks/use-posts";

export function PostsList() {
  const { posts } = usePosts();

  return (
    <div>
      {posts.map((post) => (
        <article key={post.id}>
          <h3>{post.title}</h3>
          <p>{post.content}</p>
        </article>
      ))}
    </div>
  );
}
