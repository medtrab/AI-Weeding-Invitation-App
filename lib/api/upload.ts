import { apiClient } from "./client";

export interface UploadResult {
  url: string;
  publicId: string;
  width: number;
  height: number;
}

export const uploadApi = {
  image: async (file: File, folder: "covers" | "gallery" | "backgrounds" | "avatars"): Promise<UploadResult> => {
    const form = new FormData();
    form.append("file", file);
    form.append("folder", folder);
    const { data } = await apiClient.post("/upload", form, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return data;
  },
};
