import { ERROR_CODE } from "@/const/error-code";
import { HttpStatus } from "@/const/error-status";
import { AuthToken, RefreshTokenResponseType, TokenResponseType } from "@/types/auth-type";
import { API_URL } from "@/utils/api";

type HttpMethod = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";

type FetchOptions<T = any> = {
  method?: HttpMethod;
  body?: T;
  headers?: Record<string, string>;
  auth?: boolean;
  retry?: boolean;
};

export type ApiResponse<T> = {
  data: T;
  message?: string;
  error: any;
  statusCode: number;
  errorCode?: string;
};

let refreshTokenPromise: Promise<AuthToken | null> | null = null;

const callAPIRefreshToken = async (refreshToken: string): Promise<AuthToken | null> => {
  if (!refreshToken) return null;

  const res = await fetch(API_URL.AUTH.REFRESH, {
    method: "POST",
    headers: {
      "Content-Type": "text/plain",
    },
    body: refreshToken,
  });

  const json: RefreshTokenResponseType = await res.json();

  if (!res.ok) return null;
  console.log(">>> Case: Refresh-Token success response:", json);

  return {
    accessToken: json.data.accessToken,
    refreshToken: json.data.refreshToken,
  };
};
const buildRequest = (body: any, headers: Record<string, string>) => {
  const finalHeaders: Record<string, string> = { ...headers };
  let finalBody: any;

  if (body == null) return { finalHeaders, finalBody };
  if (body instanceof FormData) {
    return { finalHeaders, finalBody: body };
  }
  if (typeof body === "string") {
    finalHeaders["Content-Type"] ||= "text/plain";
    return { finalHeaders, finalBody: body };
  }

  finalHeaders["Content-Type"] ||= "application/json";

  return {
    finalHeaders,
    finalBody: JSON.stringify(body),
  };
};
const forceLogout = async (reason: string) => {
  await fetch(API_URL.NEXT_SERVER.LOGOUT);
  window.location.href = "/login";
  throw new Error(reason);
};
const coreFetch = async <T>(url: string, options: FetchOptions = {}): Promise<T> => {
  const { method = "GET", body, headers = {}, auth = true, retry = true } = options;

  const { finalHeaders, finalBody } = buildRequest(body, headers);

  let oldRefreshToken: string | null = null;

  // =====================
  // AUTH TOKEN ATTACH
  // =====================
  if (auth) {
    const tokenRes = await fetch(API_URL.NEXT_SERVER.TOKENS);
    if (!tokenRes.ok) return forceLogout("Cannot get token from next server");

    const data: TokenResponseType = await tokenRes.json();

    oldRefreshToken = data.data.refreshToken;

    if (data.data.accessToken) {
      finalHeaders.Authorization = `Bearer ${data.data.accessToken}`;
    }
  }

  // =====================
  // REQUEST
  // =====================
  const res = await fetch(url, {
    method,
    headers: finalHeaders,
    ...(finalBody ? { body: finalBody } : {}),
    cache: "no-store",
  });

  const json: ApiResponse<T> = await res.json();
  console.log(">>> Case: Result call API", url, json);

  // =====================
  // SUCCESS
  // =====================
  if (res.ok) {
    return json.data;
  }
  // if error
  // =====================
  // 401 REFRESH FLOW
  // =====================
  const errorCode = json.errorCode;

  const shouldRefresh =
    res.status === HttpStatus.UNAUTHORIZED &&
    retry &&
    auth &&
    [ERROR_CODE.INVALID_TOKEN, ERROR_CODE.TOKEN_EXPIRED, ERROR_CODE.TOKEN_REVOKED].includes(errorCode as any);
  if (shouldRefresh) {
    if (!oldRefreshToken) {
      return await forceLogout("No refresh token");
    }

    try {
      if (!refreshTokenPromise) {
        refreshTokenPromise = (async () => {
          const tokenData: AuthToken | null = await callAPIRefreshToken(oldRefreshToken);

          if (!tokenData) return null;

          await fetch(API_URL.NEXT_SERVER.LOGIN, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(tokenData),
          });

          return tokenData;
        })().finally(() => {
          refreshTokenPromise = null;
        });
      }
      // .finally() KHÔNG ảnh hưởng kết quả await
      const tokenData = await refreshTokenPromise;

      if (!tokenData) {
        return await forceLogout("Refresh failed");
      }

      return await coreFetch<T>(url, {
        ...options,
        body: url === API_URL.AUTH.LOGOUT ? tokenData!.refreshToken : options.body,
        auth,
        retry: false,
      });
      // re-try 1 lan
    } catch (err) {
      return await forceLogout(JSON.stringify(err) || "Something went wrong...");
    }
  }
  throw new Error(json?.errorCode || json?.error || json?.message || "Error something...");
};

export const api = {
  get: <T>(url: string, options?: Omit<FetchOptions, "method" | "body">) =>
    coreFetch<T>(url, {
      method: "GET",
      ...options,
    }),
  post: <T, B = any>(url: string, body?: B, options?: Omit<FetchOptions, "method" | "body">) =>
    coreFetch<T>(url, {
      method: "POST",
      body,
      ...options,
    }),

  put: <T, B = any>(url: string, body?: B, options?: Omit<FetchOptions, "method" | "body">) =>
    coreFetch<T>(url, {
      method: "PUT",
      body,
      ...options,
    }),

  patch: <T, B = any>(url: string, body?: B, options?: Omit<FetchOptions, "method" | "body">) =>
    coreFetch<T>(url, {
      method: "PATCH",
      body,
      ...options,
    }),

  delete: <T>(url: string, headers?: Record<string, string>) => coreFetch<T>(url, { method: "DELETE", headers }),
};
