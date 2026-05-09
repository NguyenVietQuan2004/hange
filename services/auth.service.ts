// import { api } from "@/services/http-service-client";
// import {
//   AuthCredentials,
//   AuthToken,
//   ChangePasswordRequest,
//   ChangePasswordResponse,
//   ForgotPasswordRequest,
//   ForgotPasswordResponse,
//   LoginNextServerRequest,
//   LoginResponse,
//   LogoutRequest,
//   LogoutResponse,
//   ResetPasswordRequest,
//   ResetPasswordResponse,
//   UpdateProfileRequest,
//   UserDTO,
//   VerifyEmailResponse,
// } from "@/types/auth-type";
// import { API_URL } from "@/utils/api";

// export const authService = {
//   getTokens: async () => {
//     return api.get<AuthToken>(API_URL.NEXT_SERVER.TOKENS);
//   },

//   logout: async ({ accessToken, refreshToken }: LogoutRequest) => {
//     return api.post<LogoutResponse>(API_URL.AUTH.LOGOUT, refreshToken, {
//       headers: {
//         "Content-Type": "text/plain",
//         Authorization: `Bearer ${accessToken}`,
//       },
//     });
//   },

//   logoutNextServer: async () => {
//     return api.post(API_URL.NEXT_SERVER.LOGOUT, {}, { auth: false });
//   },

//   changePassword: async (accessToken: string, payload: ChangePasswordRequest) => {
//     return api.post<ChangePasswordResponse, ChangePasswordRequest>(API_URL.AUTH.CHANGE_PASSWORD, payload, {
//       headers: {
//         "Content-Type": "application/json",
//         Authorization: `Bearer ${accessToken}`,
//       },
//     });
//   },

//   forgotPassword: async (payload: ForgotPasswordRequest) => {
//     return api.post<ForgotPasswordResponse, ForgotPasswordRequest>(API_URL.AUTH.FORGOT_PASSWORD, payload, {
//       headers: {
//         "Content-Type": "application/json",
//       },
//     });
//   },

//   login: async (payload: AuthCredentials) => {
//     return api.post<LoginResponse, AuthCredentials>(API_URL.AUTH.LOGIN, payload, {
//       headers: {
//         "Content-Type": "application/json",
//       },
//     });
//   },

//   register: async (payload: AuthCredentials) => {
//     return api.post<AuthToken, AuthCredentials>(API_URL.AUTH.REGISTER, payload, {
//       headers: {
//         "Content-Type": "application/json",
//       },
//     });
//   },

//   loginNextServer: async (payload: LoginNextServerRequest) => {
//     return api.post(API_URL.NEXT_SERVER.LOGIN, payload, {
//       headers: {
//         "Content-Type": "application/json",
//       },
//     });
//   },

//   resetPassword: async (payload: ResetPasswordRequest) => {
//     return api.post<ResetPasswordResponse, ResetPasswordRequest>(API_URL.AUTH.RESET_PASSWORD, payload, {
//       headers: {
//         "Content-Type": "application/json",
//       },
//     });
//   },
//   verifyEmail: async (token: string) => {
//     return api.get<VerifyEmailResponse>(`${API_URL.AUTH.VERIFY_EMAIL}?token=${token}`);
//   },

//   getMe: async (accessToken: string) => {
//     return api.get<UserDTO>(API_URL.USER.GET_ME, {
//       headers: {
//         Authorization: `Bearer ${accessToken}`,
//       },
//       retry: false,
//     });
//   },

//   resendVerification: async (email: string) => {
//     return api.post<void, string>(API_URL.AUTH.RESEND_EMAIL_VERIFICATION, email, {
//       headers: {
//         "Content-Type": "text/plain",
//       },
//     });
//   },

//   updateProfile: async (payload: UpdateProfileRequest) => {
//     return api.post<UserDTO, UpdateProfileRequest>(API_URL.USER.UPDATE_PROFILE, payload);
//   },
// };
import {
  AuthCredentials,
  AuthToken,
  ChangePasswordRequest,
  ForgotPasswordRequest,
  LoginNextServerRequest,
  LoginResponse,
  LogoutRequest,
  LogoutResponse,
  ResetPasswordRequest,
} from "@/types/auth-type";
import { api } from "@/services/http-service-client";
import { API_URL } from "@/utils/api";

export const authService = {
  /* ================= TOKENS ================= */
  getTokens: async () => {
    return api.get<AuthToken>(API_URL.NEXT_SERVER.TOKENS);
  },

  /* ================= AUTH ================= */
  login: async (payload: AuthCredentials) => {
    return api.post<LoginResponse, AuthCredentials>(API_URL.AUTH.LOGIN, payload, {
      headers: { "Content-Type": "application/json" },
    });
  },

  register: async (payload: AuthCredentials) => {
    return api.post<AuthToken, AuthCredentials>(API_URL.AUTH.REGISTER, payload, {
      headers: { "Content-Type": "application/json" },
    });
  },

  logout: async ({ accessToken, refreshToken }: LogoutRequest) => {
    return api.post<LogoutResponse>(API_URL.AUTH.LOGOUT, refreshToken, {
      headers: {
        "Content-Type": "text/plain",
        Authorization: `Bearer ${accessToken}`,
      },
    });
  },

  loginNextServer: async (payload: LoginNextServerRequest) => {
    return api.post(API_URL.NEXT_SERVER.LOGIN, payload, {
      headers: { "Content-Type": "application/json" },
    });
  },

  logoutNextServer: async () => {
    return api.post(API_URL.NEXT_SERVER.LOGOUT, {}, { auth: false });
  },

  /* ================= PASSWORD ================= */
  changePassword: async (accessToken: string, payload: ChangePasswordRequest) => {
    return api.post(API_URL.AUTH.CHANGE_PASSWORD, payload, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
    });
  },

  forgotPassword: async (payload: ForgotPasswordRequest) => {
    return api.post(API_URL.AUTH.FORGOT_PASSWORD, payload, {
      headers: { "Content-Type": "application/json" },
    });
  },

  resetPassword: async (payload: ResetPasswordRequest) => {
    return api.post(API_URL.AUTH.RESET_PASSWORD, payload, {
      headers: { "Content-Type": "application/json" },
    });
  },

  verifyEmail: async (token: string) => {
    return api.get(`${API_URL.AUTH.VERIFY_EMAIL}?token=${token}`);
  },

  resendVerification: async (email: string) => {
    return api.post(API_URL.AUTH.RESEND_EMAIL_VERIFICATION, email, {
      headers: { "Content-Type": "text/plain" },
    });
  },
};
