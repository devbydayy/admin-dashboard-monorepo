import { useMutation } from "@tanstack/react-query";

export function useUploadFile(endpoint: string, fieldName = "file") {
  return useMutation({
    mutationFn: async (file: File) => {
      const formData = new FormData();
      formData.append(fieldName, file);
      const res = await fetch(endpoint, {
        method: "POST",
        body: formData,
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.message || "Upload failed");
      }
      const data = await res.json();
      return data.url;
    },
  });
}