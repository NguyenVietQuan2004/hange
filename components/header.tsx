"use client";
import { useState, useEffect, useCallback } from "react";
import { useAuth } from "@/hook/auth-provider";
import Link from "next/link";
import { ModeToggle } from "./mode-toggle";
import Image from "next/image";

import type { NotificationDTO } from "@/types/booking/notification-type";
import { notificationService } from "@/services/booking/notification.service";
import { Bell, CheckCircle, XCircle, AlertCircle, Info } from "lucide-react";
// Socket
import { initSocket, addNotificationListener, disconnectSocket } from "@/lib/socket"; // ← chỉnh path cho đúng
import { Router } from "next/router";
import { useRouter } from "next/navigation";
type SocketNotificationPayload = {
  data: NotificationDTO;
  event: string;
};

const getNotificationStyle = (type: string) => {
  switch (type) {
    case "CONFIRMED":
      return { color: "text-green-600 dark:text-green-500", icon: CheckCircle, bg: "bg-green-50 dark:bg-green-950/30" };
    case "REJECTED":
    case "CANCELLED":
      return { color: "text-red-600 dark:text-red-500", icon: XCircle, bg: "bg-red-50 dark:bg-red-950/30" };
    case "BOOKING_CREATED":
      return { color: "text-blue-600 dark:text-blue-500", icon: Info, bg: "bg-blue-50 dark:bg-blue-950/30" };
    default:
      return { color: "text-muted-foreground", icon: Bell, bg: "" };
  }
};
export default function Header() {
  const { user, loading, logout } = useAuth();
  const router = useRouter();
  const [openUserMenu, setOpenUserMenu] = useState(false);
  const [openNotifications, setOpenNotifications] = useState(false);

  const [notifications, setNotifications] = useState<NotificationDTO[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loadingNoti, setLoadingNoti] = useState(false);

  console.log(notifications);
  // ================== CONFIG ==================
  const appName = "Hange";
  const logoSrc = "/image/logo.png";
  const defaultAvatar = "/image/default.png";

  const dropdownItems = [
    { label: "Personal information", href: "/me", show: true },
    { label: "My bookings", href: "/me/my-bookings", show: true },
    { label: "RBAC Management", href: "/admin/rbac/roles", show: user?.role?.includes("ADMIN") },
    { label: "Service Management", href: "/admin/categories", show: user?.role?.includes("ADMIN") },
  ];

  // Fetch notifications ban đầu
  const fetchNotifications = async () => {
    if (!user?.id) return;
    setLoadingNoti(true);
    try {
      const response = await notificationService.getByUser(user.id);

      setNotifications(response);
      setUnreadCount(response.filter((n) => !n.isRead).length);
    } catch (error) {
      console.error("Failed to fetch notifications:", error);
    } finally {
      setLoadingNoti(false);
    }
  };

  // Xử lý khi nhận thông báo mới từ Socket
  const handleNewNotification = useCallback((payload: SocketNotificationPayload) => {
    setNotifications((prev) => [payload.data, ...prev]); // thêm lên đầu
    setUnreadCount((prev) => prev + 1);
  }, []);

  // Khởi tạo Socket + Listener khi có user
  useEffect(() => {
    if (!user?.id) {
      // setNotifications([]);
      // setUnreadCount(0);
      return;
    }

    // initSocket(user.id);
    fetchNotifications();

    const unsubscribe = addNotificationListener(handleNewNotification);

    return () => {
      unsubscribe(); // Chỉ hủy listener
    };
  }, [user?.id, handleNewNotification]);

  // Đánh dấu đã đọc
  const clickNoti = async (notiId: number, bookingId: number) => {
    try {
      await notificationService.markAsRead(notiId);
      fetchNotifications();
    } catch (error) {
      console.error("Failed to mark as read:", error);
    }

    if (user?.role?.includes("ADMIN") || user?.role?.includes("ROLE_ADMIN")) {
      router.push(`/admin/bookings/${bookingId}`);
    } else {
      router.push(`/me/my-bookings`);
    }

    setOpenNotifications(false);
  };

  const handlemarkReadAll = async (userId: number) => {
    if (unreadCount <= 0 || !userId) return;
    try {
      await notificationService.markAllRead(userId);
      setNotifications((prev: NotificationDTO[]) =>
        prev.map((item: NotificationDTO) => ({
          ...item,
          isRead: true, // ← Sửa ở đây
        })),
      );
      setUnreadCount(0);
      setOpenNotifications(false);
    } catch (error) {
      console.error("Failed to mark as read:", error);
    }
  };
  return (
    <header className="w-full px-6 py-4 border-b border-border bg-background text-foreground flex justify-between items-center">
      {/* LOGO */}
      <div className="flex items-center gap-1.5">
        <Image src={logoSrc} alt="logo" width={100} height={100} className="rounded-full w-8 h-8 select-none" />
        <Link href="/" className="font-bold text-2xl text-foreground">
          {appName}
        </Link>
      </div>

      {/* RIGHT SIDE */}
      <div className="flex items-center gap-3">
        {user && (
          <>
            {/* Notification Bell */}
            <div className="relative">
              <button
                onClick={async () => {
                  setOpenNotifications(!openNotifications);
                }}
                className="relative p-2 hover:bg-muted rounded-full transition-colors"
              >
                <Bell className="w-5 h-5" />
                {unreadCount > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] text-white font-medium">
                    {unreadCount > 99 ? "99+" : unreadCount}
                  </span>
                )}
              </button>

              {/* Dropdown Notifications */}
              {openNotifications && (
                <div className="absolute right-0 mt-2 w-86 bg-popover text-popover-foreground border border-border rounded-lg shadow-lg z-50 overflow-hidden">
                  <div className="p-3 border-b border-border font-medium flex justify-between bg-muted/50">
                    <span>Notifications</span>
                    {unreadCount > 0 && (
                      <div className="  flex items-center gap-1 text-xs text-muted-foreground">
                        <button
                          className=" underline hover:opacity-80 transition-all duration-500"
                          onClick={() => handlemarkReadAll(user?.id)}
                        >
                          Mark read all{" "}
                        </button>
                        ( {unreadCount} unread )
                      </div>
                    )}
                  </div>
                  <div className="max-h-[380px] overflow-y-auto">
                    {loadingNoti ? (
                      <div className="p-8 text-center text-muted-foreground">Loading...</div>
                    ) : notifications.length > 0 ? (
                      notifications.map((noti) => {
                        const { color, icon: Icon, bg } = getNotificationStyle(noti.type);

                        return (
                          <div
                            key={noti.id}
                            className={`p-3 border-b block border-border hover:bg-muted transition-colors ${bg} cursor-pointer ${
                              // !noti.isRead ? "bg-blue-50/50 dark:bg-blue-950/30" : ""
                              !noti.isRead
                                ? "bg-blue-50/80 dark:bg-blue-950/50  border-blue-500" // Unread
                                : "bg-background"
                            }`}
                            onClick={() => clickNoti(noti.id, noti.bookingId)}
                          >
                            <div className="flex gap-3">
                              <Icon className={`w-5 h-5 mt-0.5 flex-shrink-0 ${color}`} />
                              <div className="flex-1 text-sm">
                                <p className="font-medium">{noti.title}</p>
                                <p className="text-muted-foreground mt-1 line-clamp-2">{noti.message}</p>
                                <p className="text-xs text-muted-foreground mt-2">
                                  {new Date(noti.createdAt).toLocaleString("vi-VN")}
                                </p>
                              </div>
                              {!noti.isRead && <div className="w-2 h-2 bg-blue-500 rounded-full mt-2" />}
                            </div>
                          </div>
                        );
                      })
                    ) : (
                      <div className="p-8 text-center text-muted-foreground">No notifications found</div>
                    )}
                  </div>

                  <div className="p-3 border-t border-border text-center">
                    <Link
                      href="#"
                      className="text-primary text-sm hover:underline"
                      onClick={() => setOpenNotifications(false)}
                    >
                      Load more
                    </Link>
                  </div>
                </div>
              )}
            </div>
          </>
        )}

        {/* User Menu */}
        {loading ? (
          <Image
            src={defaultAvatar}
            alt="avatar"
            width={32}
            height={32}
            className="rounded-full w-8 h-8 border border-border"
          />
        ) : user ? (
          <div className="relative">
            <div
              onClick={() => {
                setOpenUserMenu(!openUserMenu);
                setOpenNotifications(false);
              }}
              className="cursor-pointer"
            >
              <Image
                src={user.avatarUrl || defaultAvatar}
                alt="avatar"
                width={32}
                height={32}
                className="rounded-full object-cover w-8 h-8 hover:brightness-95 duration-500"
              />
            </div>

            {openUserMenu && (
              <div className="absolute right-0 mt-2 w-56 bg-popover text-popover-foreground border border-border rounded-lg shadow-md z-50 overflow-hidden py-1">
                {dropdownItems.map((item) =>
                  item.show ? (
                    <Link
                      key={item.href}
                      href={item.href}
                      className="block px-4 py-2.5 text-sm hover:bg-muted transition-colors"
                      onClick={() => setOpenUserMenu(false)}
                    >
                      {item.label}
                    </Link>
                  ) : null,
                )}
                <button
                  onClick={() => {
                    setOpenUserMenu(false);
                    logout();
                    disconnectSocket();
                  }}
                  className="w-full text-left px-4 py-2.5 text-destructive hover:bg-muted transition-colors"
                >
                  Sign out
                </button>
              </div>
            )}
          </div>
        ) : (
          <div className="flex items-center gap-3">
            <Link href="/login" className="text-primary hover:underline">
              Sign in
            </Link>
            <Link href="/register" className="text-primary border border-border px-4 py-1.5 rounded hover:bg-accent">
              Sign up
            </Link>
          </div>
        )}

        <ModeToggle />
      </div>
    </header>
  );
}
