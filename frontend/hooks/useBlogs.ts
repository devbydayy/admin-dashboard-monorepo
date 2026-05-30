import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/lib/api/client";
import type { BlogPost } from "@/types/blog.types"

const fetchBlogs = async (): Promise<BlogPost[]> => {
  const response = await apiClient.get("/blogs");
  return response.data.data;
};

export function useBlogs() {
  return useQuery({
    queryKey: ["blogs"],
    queryFn: fetchBlogs,
  });
}