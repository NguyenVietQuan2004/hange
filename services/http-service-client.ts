import { ERROR_CODE } from "@/const/auth/error-auth-code";
import { HttpStatus } from "@/const/error-status";
import { AuthToken, RefreshTokenResponseType, TokenResponseType } from "@/types/auth/auth-type";
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
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ refreshToken }),
  });

  const json: RefreshTokenResponseType = await res.json();

  console.log(">>> Case: Refresh-Token response:", json);

  if (!res.ok) return null;

  return {
    accessToken: json.data.accessToken,
    refreshToken: json.data.refreshToken,
  };
};

const buildRequest = (body: any, headers: Record<string, string>) => {
  const finalHeaders: Record<string, string> = { ...headers };

  let finalBody: any;

  if (body == null) {
    return {
      finalHeaders,
      finalBody,
    };
  }

  if (body instanceof FormData) {
    return {
      finalHeaders,
      finalBody: body,
    };
  }

  if (typeof body === "string") {
    finalHeaders["Content-Type"] ||= "text/plain";

    return {
      finalHeaders,
      finalBody: body,
    };
  }

  finalHeaders["Content-Type"] ||= "application/json";

  return {
    finalHeaders,
    finalBody: JSON.stringify(body),
  };
};

const forceLogout = async (reason: string) => {
  await fetch(API_URL.NEXT_SERVER.LOGOUT, {
    method: "POST",
  });

  console.log(">>> Case: Force - logout: ", reason);

  window.location.href = "/login";

  throw new Error(reason);
};

const getStoredTokens = async (): Promise<AuthToken | null> => {
  const tokenRes = await fetch(API_URL.NEXT_SERVER.TOKENS);

  if (!tokenRes.ok) {
    return null;
  }

  const data: TokenResponseType = await tokenRes.json();

  return {
    accessToken: data.data.accessToken,
    refreshToken: data.data.refreshToken,
  };
};

const attachAuthorizationHeader = async (headers: Record<string, string>): Promise<string | null> => {
  const tokenData = await getStoredTokens();

  if (!tokenData) {
    await forceLogout(">>> Case 1: Cannot get token from next-server");
  }

  if (tokenData?.accessToken) {
    headers.Authorization = `Bearer ${tokenData.accessToken}`;
  }

  return tokenData?.refreshToken || null;
};

const executeRequest = async <T>(url: string, method: HttpMethod, headers: Record<string, string>, body?: any) => {
  const res = await fetch(url, {
    method,
    headers,
    ...(body ? { body } : {}),
    cache: "no-store",
  });

  const json: ApiResponse<T> = await res.json();

  console.log(">>> Case: Result call API", url, json);

  return {
    res,
    json,
  };
};

const shouldRefreshToken = (status: number, errorCode: string | undefined, retry: boolean, auth: boolean) => {
  return (
    (status === HttpStatus.UNAUTHORIZED &&
      retry &&
      auth &&
      [ERROR_CODE.TOKEN_INVALID, ERROR_CODE.TOKEN_EXPIRED, ERROR_CODE.TOKEN_REVOKED].includes(errorCode as any)) ||
    [ERROR_CODE.INVALID_TOKEN_VERSION].includes(errorCode as any)
  );
};

const syncTokenToNextServer = async (tokenData: AuthToken) => {
  await fetch(API_URL.NEXT_SERVER.LOGIN, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(tokenData),
  });
};

const refreshAccessToken = async (refreshToken: string): Promise<AuthToken | null> => {
  if (!refreshTokenPromise) {
    refreshTokenPromise = (async () => {
      const tokenData: AuthToken | null = await callAPIRefreshToken(refreshToken);

      if (!tokenData) return null;

      await syncTokenToNextServer(tokenData);

      return tokenData;
    })().finally(() => {
      refreshTokenPromise = null;
    });
  }

  return refreshTokenPromise;
};

const retryRequest = async <T>(url: string, options: FetchOptions, tokenData: AuthToken) => {
  return await coreFetch<T>(url, {
    ...options,
    body: url === API_URL.AUTH.LOGOUT ? { refreshToken: tokenData.refreshToken } : options.body,
    auth: options.auth,
    retry: false,
  });
};

const handleRefreshFlow = async <T>(url: string, options: FetchOptions, refreshToken: string | null): Promise<T> => {
  if (!refreshToken) {
    return await forceLogout(">>> Case 2: No refresh token");
  }

  try {
    const tokenData = await refreshAccessToken(refreshToken);

    // .finally() KHÔNG ảnh hưởng kết quả await
    if (!tokenData) {
      return await forceLogout(">>> Case 3: " + JSON.stringify(ERROR_CODE.REFRESH_TOKEN_FAILED));
    }

    return await retryRequest<T>(url, options, tokenData);
  } catch (err: any) {
    throw new Error(err.message || "Error something...");
  }
};

const coreFetch = async <T>(url: string, options: FetchOptions = {}): Promise<T> => {
  const { method = "GET", body, headers = {}, auth = true, retry = true } = options;
  const { finalHeaders, finalBody } = buildRequest(body, headers);
  let refreshToken: string | null = null;

  // =====================
  // AUTH TOKEN ATTACH
  // =====================
  if (auth) {
    refreshToken = await attachAuthorizationHeader(finalHeaders);
  }

  // =====================
  // REQUEST
  // =====================
  const { res, json } = await executeRequest<T>(url, method, finalHeaders, finalBody);

  // =====================
  // SUCCESS
  // =====================
  if (res.ok) {
    return json.data;
  }

  // =====================
  // 401 REFRESH FLOW
  // =====================
  const errorCode = json.errorCode;

  if (shouldRefreshToken(res.status, errorCode, retry, auth)) {
    return await handleRefreshFlow<T>(url, options, refreshToken);
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

  delete: <T>(url: string, headers?: Record<string, string>) =>
    coreFetch<T>(url, {
      method: "DELETE",
      headers,
    }),
};
