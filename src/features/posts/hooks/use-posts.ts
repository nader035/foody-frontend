import { useEffect, useState } from "react";

import { listPosts } from "@/features/posts/services/posts.service";
import type { Post } from "@/features/posts/types";

export function usePosts() {
  const [posts, setPosts] = useState<Post[]>([]);

  useEffect(() => {
    void listPosts().then(setPosts);
  }, []);

  return { posts };
}
