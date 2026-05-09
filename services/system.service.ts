import { api } from "@/services/http-service-client";
import { UploadRequest, UploadResponse } from "@/types/auth-type";
import { API_URL } from "@/utils/api";

export const systemService = {
  uploadFile: async (payload: UploadRequest) => {
    const formData = new FormData();
    formData.append("file", payload.file);
    formData.append("folder", payload.folder);
    return api.post<UploadResponse>(API_URL.FILES.UPLOAD, formData);
  },
};
