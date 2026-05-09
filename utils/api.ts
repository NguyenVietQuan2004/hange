import { ENV_CONFIG } from "@/config/env";

const api = (path: string) => `${ENV_CONFIG.API_URL}${path}`;

const app = (path: string) => `${ENV_CONFIG.APP_URL}${path}`;

export const API_URL = {
  BASE: ENV_CONFIG.API_URL,

  AUTH: {
    LOGIN: api("/auth/login"),
    LOGOUT: api("/auth/logout"),
    REGISTER: api("/auth/register"),
    REFRESH: api("/auth/refresh-token"),
    CHANGE_PASSWORD: api("/auth/change-password"),
    FORGOT_PASSWORD: api("/auth/forgot-password"),
    RESEND_EMAIL_VERIFICATION: api("/auth/resend-verification"),
    RESET_PASSWORD: api("/auth/reset-password"),
    VERIFY_EMAIL: api("/auth/verify-email"),
    PING: api("/ping"),
  },

  NEXT_SERVER: {
    LOGIN: app("/api/login"),
    LOGOUT: app("/api/logout"),
    TOKENS: app("/api/tokens"),
  },

  USER: {
    GET_ME: api("/users/me"),
    UPDATE_PROFILE: api("/users/update-profile"),
  },

  FILES: {
    UPLOAD: api("/files"),
  },

  PERMISSION: {
    BASE: api("/permissions"),
    GET_ALL: api("/permissions"),
    CREATE: api("/permissions"),
    UPDATE: (id: number) => api(`/permissions/${id}`),
    DELETE: (id: number) => api(`/permissions/${id}`),
  },

  ROLE: {
    BASE: api("/roles"),
    GET_ALL: api("/roles"),
    CREATE: api("/roles"),
    UPDATE: (id: number) => api(`/roles/${id}`),
    DELETE: (id: number) => api(`/roles/${id}`),
  },
};
