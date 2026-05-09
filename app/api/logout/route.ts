import { error, success } from "@/helpers/response.helpers";
import { cookies } from "next/headers";
export const POST = async () => {
  const cookieStore = await cookies();

  try {
    cookieStore.delete("accessToken");
    cookieStore.delete("refreshToken");

    return success(null, "Success");
  } catch (e) {
    return error("Failed to clear cookies", 500);
  }
};
