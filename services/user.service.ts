import { api } from "@/services/http-service-client";
import { UpdateProfileRequest } from "@/types/auth/auth-type";
import { UserDTO } from "@/types/user-type";
import { API_URL } from "@/utils/api";

export const userService = {
  getMe: async () => {
    return api.get<UserDTO>(API_URL.USER.GET_ME, {});
  },

  updateProfile: async (payload: UpdateProfileRequest) => {
    return api.post<UserDTO, UpdateProfileRequest>(API_URL.USER.UPDATE_PROFILE, payload);
  },
};
