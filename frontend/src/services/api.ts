import { apiClient } from "./apiClient";

export async function analyzeContent(formData: FormData) {
  const response = await apiClient.post("/upload", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return response.data;
}
