"use client";

import { createContext, useEffect } from "react";
import { initSocket } from "@/lib/socket";
import { useAuth } from "./auth-provider";

export const SocketContext = createContext(null);

export default function SocketProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  useEffect(() => {
    if (!user || !user.id) return;

    initSocket(user.id);
  }, [user]);

  //   useEffect(() => {
  //     const userId = 1; // lấy từ auth thật

  //     initSocket(userId);
  //   }, []);

  return <SocketContext.Provider value={null}>{children}</SocketContext.Provider>;
}
