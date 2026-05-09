"use client";

import { authService } from "@/services/auth.service";
import { userService } from "@/services/user.service";
import { UserDTO } from "@/types/user-type";
import { useRouter } from "next/navigation";
import { createContext, useContext, useEffect, useState } from "react";

type AuthContextType = {
  user: UserDTO | null;
  loading: boolean;
  logoutLoading: boolean;
  getMe: () => Promise<void>;
  logout: () => Promise<void>;
  setUser: (user: UserDTO | null) => void; // 🔥 ADD
};

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<UserDTO | null>(null);
  const [loading, setLoading] = useState(true);
  const [logoutLoading, setLogoutLoading] = useState(false);
  const router = useRouter();
  const getMe = async () => {
    setLoading(true);
    try {
      const tokenRes = await authService.getTokens();
      if (!tokenRes.accessToken) {
        setUser(null);
        return;
      }
      const data: UserDTO = await userService.getMe(tokenRes.accessToken);
      console.log(data);
      setUser(data);
    } catch (err) {
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    if (logoutLoading) return;

    setLogoutLoading(true);

    try {
      const data = await authService.getTokens();
      const { accessToken, refreshToken } = data;

      if (refreshToken) {
        await authService.logout({ accessToken, refreshToken });
      }
      await authService.logoutNextServer();
      setUser(null);
      router.push("/login");
    } catch (err) {
      console.error("Logout error:", err);

      // 🔥 force cleanup
      await authService.logoutNextServer();
      setUser(null);
      router.push("/login");
    } finally {
      setLogoutLoading(false);
    }
  };

  // 🔥 chạy 1 lần khi reload app
  useEffect(() => {
    getMe();
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading, logoutLoading, getMe, setUser, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
export const useAuth = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used inside AuthProvider");
  }

  return context;
};
