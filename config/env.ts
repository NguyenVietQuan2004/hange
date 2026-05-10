type Env = "dev" | "prod";

const ENV = (process.env.NEXT_PUBLIC_ENV as Env) || "dev";

export const ENV_CONFIG = {
  ENV,

  API_URL: ENV === "dev" ? process.env.NEXT_PUBLIC_API_URL_DEV : process.env.NEXT_PUBLIC_API_URL_PROD,

  APP_URL: ENV === "dev" ? process.env.NEXT_PUBLIC_APP_URL_DEV : process.env.NEXT_PUBLIC_APP_URL_PROD,
  API_URL_STORAGE:
    ENV === "dev" ? process.env.NEXT_PUBLIC_API_URL_STORAGE_DEV : process.env.NEXT_PUBLIC_API_URL_STORAGE_PROD,
};
