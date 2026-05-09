import { cookies } from "next/headers";
import { jwtDecode } from "jwt-decode";
import { error, success } from "@/helpers/response.helpers";

export const GET = async () => {
  const cookieStore = await cookies();

  return success({
    accessToken: cookieStore.get("accessToken")?.value || "",
    refreshToken: cookieStore.get("refreshToken")?.value || "",
  });
};

export const POST = async (req: Request) => {
  const cookieStore = await cookies();
  const body = await req.json();

  const { accessToken, refreshToken } = body;

  if (!accessToken || !refreshToken) {
    return error("Missing token", 400);
  }

  let expAccessToken: number;
  let expRefreshToken: number;

  try {
    expAccessToken = jwtDecode<any>(accessToken).exp;
    expRefreshToken = jwtDecode<any>(refreshToken).exp;
  } catch {
    return error("Invalid token", 400);
  }

  cookieStore.set("accessToken", accessToken, {
    httpOnly: true,
    path: "/",
    expires: new Date(expAccessToken * 1000),
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
  });

  cookieStore.set("refreshToken", refreshToken, {
    httpOnly: true,
    path: "/",
    expires: new Date(expRefreshToken * 1000),
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
  });

  return success(null, "Stored");
};

export const DELETE = async () => {
  const cookieStore = await cookies();

  cookieStore.set("accessToken", "", { maxAge: 0 });
  cookieStore.set("refreshToken", "", { maxAge: 0 });

  return success(null, "Deleted");
};
