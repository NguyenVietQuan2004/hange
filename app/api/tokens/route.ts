import { error, success } from "@/helpers/response.helpers";
import { cookies } from "next/headers";

export const GET = async () => {
  try {
    const cookieStore = await cookies();

    return success({
      accessToken: cookieStore.get("accessToken")?.value || "",
      refreshToken: cookieStore.get("refreshToken")?.value || "",
    });
  } catch (e) {
    return error("Failed to get tokens", 500);
  }
};
