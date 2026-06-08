// "use client";
// import { useState, useEffect, useCallback } from "react";
// import { useAuth } from "@/hook/auth-provider";
// import Link from "next/link";
// import { ModeToggle } from "./mode-toggle";
// import Image from "next/image";

// import type { NotificationDTO } from "@/types/booking/notification-type";
// import { notificationService } from "@/services/booking/notification.service";
// import { Bell, CheckCircle, XCircle, Info, Menu } from "lucide-react";
// import { addNotificationListener, disconnectSocket } from "@/lib/socket";
// import { usePathname, useRouter } from "next/navigation";
// import { CoreIcon } from "@/public/icons";

// import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";

// type SocketNotificationPayload = {
//   data: NotificationDTO;
//   event: string;
// };

// const getNotificationStyle = (type: string) => {
//   switch (type) {
//     case "CONFIRMED":
//       return { color: "text-green-600 dark:text-green-500", icon: CheckCircle, bg: "bg-green-50 dark:bg-green-950/30" };
//     case "REJECTED":
//     case "CANCELLED":
//       return { color: "text-red-600 dark:text-red-500", icon: XCircle, bg: "bg-red-50 dark:bg-red-950/30" };
//     case "BOOKING_CREATED":
//       return { color: "text-blue-600 dark:text-blue-500", icon: Info, bg: "bg-blue-50 dark:bg-blue-950/30" };
//     default:
//       return { color: "text-muted-foreground", icon: Bell, bg: "" };
//   }
// };

// export default function Header() {
//   const { user, loading, logout } = useAuth();
//   const router = useRouter();
//   const pathname = usePathname();
//   const [openUserMenu, setOpenUserMenu] = useState(false);
//   const [openNotifications, setOpenNotifications] = useState(false);
//   const [openMobileMenu, setOpenMobileMenu] = useState(false);

//   const [notifications, setNotifications] = useState<NotificationDTO[]>([]);
//   const [unreadCount, setUnreadCount] = useState(0);
//   const [loadingNoti, setLoadingNoti] = useState(false);

//   const appName = "Hange";
//   const defaultAvatar = "/image/default.png";

//   const dropdownItems = [
//     { label: "Personal information", href: "/me", show: true },
//     { label: "My bookings", href: "/me/my-bookings", show: true },
//     { label: "RBAC Management", href: "/admin/rbac/roles", show: user?.role?.includes("ADMIN") },
//     { label: "Service Management", href: "/admin/categories", show: user?.role?.includes("ADMIN") },
//   ];

//   const nav = [
//     { key: "Home", link: "/" },
//     { key: "About", link: "/about" },
//     { key: "Contact", link: "/contact" },
//     { key: "Booking", link: "/appoinment" },
//   ];

//   const fetchNotifications = async () => {
//     if (!user?.id) return;
//     setLoadingNoti(true);
//     try {
//       const response = await notificationService.getByUser(user.id);
//       setNotifications(response);
//       setUnreadCount(response.filter((n) => !n.isRead).length);
//     } catch (error) {
//       console.error("Failed to fetch notifications:", error);
//     } finally {
//       setLoadingNoti(false);
//     }
//   };

//   const handleNewNotification = useCallback((payload: SocketNotificationPayload) => {
//     setNotifications((prev) => [payload.data, ...prev]);
//     setUnreadCount((prev) => prev + 1);
//   }, []);

//   useEffect(() => {
//     if (!user?.id) return;
//     fetchNotifications();
//     const unsubscribe = addNotificationListener(handleNewNotification);
//     return () => {
//       unsubscribe();
//     };
//   }, [user?.id, handleNewNotification]);

//   const clickNoti = async (notiId: number, bookingId: number) => {
//     try {
//       await notificationService.markAsRead(notiId);
//       fetchNotifications();
//     } catch (error) {
//       console.error("Failed to mark as read:", error);
//     }

//     if (user?.role?.includes("ADMIN") || user?.role?.includes("ROLE_ADMIN")) {
//       router.push(`/admin/bookings/${bookingId}`);
//     } else {
//       router.push(`/me/my-bookings`);
//     }

//     setOpenNotifications(false);
//   };

//   const handlemarkReadAll = async (userId: number) => {
//     if (unreadCount <= 0 || !userId) return;
//     try {
//       await notificationService.markAllRead(userId);
//       setNotifications((prev: NotificationDTO[]) => prev.map((item: NotificationDTO) => ({ ...item, isRead: true })));
//       setUnreadCount(0);
//       setOpenNotifications(false);
//     } catch (error) {
//       console.error("Failed to mark as read:", error);
//     }
//   };

//   return (
//     <header className="w-full h-[70px] fixed top-0 right-0 left-0 z-999 px-6 py-4 border-b border-border bg-background text-foreground flex justify-between items-center">
//       {/* LOGO */}
//       <div className="flex items-center gap-1.5">
//         <CoreIcon />
//         <Link href="/" className="font-bold text-xl text-foreground">
//           {appName}
//         </Link>
//       </div>

//       {/* Desktop Nav */}
//       <div className="hidden md:block">
//         {nav.map((item) => {
//           const isActive = pathname === item.link;
//           return (
//             <Link
//               key={item.link}
//               href={item.link}
//               className={`transition-all duration-300 px-3 py-2 rounded-md ${
//                 isActive ? "text-foreground font-medium" : "text-muted-foreground hover:text-foreground"
//               }`}
//             >
//               {item.key}
//             </Link>
//           );
//         })}
//       </div>

//       {/* RIGHT SIDE */}
//       <div className="flex items-center gap-3">
//         {user && (
//           <>
//             {/* Notification Bell */}
//             <div className="relative">
//               <button
//                 onClick={() => setOpenNotifications(!openNotifications)}
//                 className="relative p-2 hover:bg-muted rounded-full transition-colors"
//               >
//                 <Bell className="w-5 h-5" />
//                 {unreadCount > 0 && (
//                   <span className="absolute -top-0.5 -right-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] text-white font-medium">
//                     {unreadCount > 99 ? "99+" : unreadCount}
//                   </span>
//                 )}
//               </button>

//               {openNotifications && (
//                 <div className="fixed md:absolute right-0 translate-x-0 mt-2 w-86 bg-popover text-popover-foreground border border-border rounded-lg shadow-lg z-50 overflow-hidden">
//                   <div className="p-3 border-b border-border font-medium flex justify-between bg-muted/50">
//                     <span>Notifications {unreadCount !== 0 ? unreadCount : ""} </span>
//                     {unreadCount > 0 && (
//                       <div className="flex items-center gap-1 text-xs text-muted-foreground">
//                         <button
//                           className="underline hover:opacity-80 transition-all duration-500"
//                           onClick={() => handlemarkReadAll(user?.id)}
//                         >
//                           Mark read all
//                         </button>
//                       </div>
//                     )}
//                   </div>
//                   <div className="max-h-[380px] overflow-y-auto">
//                     {loadingNoti ? (
//                       <div className="p-8 text-center text-muted-foreground">Loading...</div>
//                     ) : notifications.length > 0 ? (
//                       notifications.map((noti) => {
//                         const { color, icon: Icon, bg } = getNotificationStyle(noti.type);
//                         return (
//                           <div
//                             key={noti.id}
//                             className={`p-3 border-b block border-border hover:bg-muted transition-colors ${bg} cursor-pointer ${
//                               !noti.isRead ? "bg-blue-50/80 dark:bg-blue-950/50 border-blue-500" : "bg-background"
//                             }`}
//                             onClick={() => clickNoti(noti.id, noti.bookingId)}
//                           >
//                             <div className="flex gap-3">
//                               <Icon className={`w-5 h-5 mt-0.5 flex-shrink-0 ${color}`} />
//                               <div className="flex-1 text-sm">
//                                 <p className="font-medium">{noti.title}</p>
//                                 <p className="text-muted-foreground mt-1 line-clamp-2">{noti.message}</p>
//                                 <p className="text-xs text-muted-foreground mt-2">
//                                   {new Date(noti.createdAt).toLocaleString("vi-VN")}
//                                 </p>
//                               </div>
//                               {!noti.isRead && <div className="w-2 h-2 bg-blue-500 rounded-full mt-2" />}
//                             </div>
//                           </div>
//                         );
//                       })
//                     ) : (
//                       <div className="p-8 text-center text-muted-foreground">No notifications found</div>
//                     )}
//                   </div>
//                   <div className="p-3 border-t border-border text-center">
//                     <Link
//                       href="#"
//                       className="text-primary text-sm hover:underline"
//                       onClick={() => setOpenNotifications(false)}
//                     >
//                       Load more
//                     </Link>
//                   </div>
//                 </div>
//               )}
//             </div>
//           </>
//         )}

//         {/* User Menu */}
//         {loading ? (
//           <Image
//             src={defaultAvatar}
//             alt="avatar"
//             width={32}
//             height={32}
//             className="rounded-full w-8 h-8 border border-border"
//           />
//         ) : user ? (
//           <div className="relative">
//             <div
//               onClick={() => {
//                 setOpenUserMenu(!openUserMenu);
//                 setOpenNotifications(false);
//               }}
//               className="cursor-pointer"
//             >
//               <Image
//                 src={user.avatarUrl || defaultAvatar}
//                 alt="avatar"
//                 width={32}
//                 height={32}
//                 className="rounded-full object-cover w-8 h-8 hover:brightness-95 duration-500"
//               />
//             </div>

//             {openUserMenu && (
//               <div className="absolute right-0 mt-2 w-56 bg-popover text-popover-foreground border border-border rounded-lg shadow-md z-50 overflow-hidden py-1">
//                 {dropdownItems.map((item) =>
//                   item.show ? (
//                     <Link
//                       key={item.href}
//                       href={item.href}
//                       className="block px-4 py-2.5 text-sm hover:bg-muted transition-colors"
//                       onClick={() => setOpenUserMenu(false)}
//                     >
//                       {item.label}
//                     </Link>
//                   ) : null,
//                 )}
//                 <button
//                   onClick={() => {
//                     setOpenUserMenu(false);
//                     logout();
//                     disconnectSocket();
//                   }}
//                   className="w-full text-left px-4 py-2.5 text-destructive hover:bg-muted transition-colors"
//                 >
//                   Sign out
//                 </button>
//               </div>
//             )}
//           </div>
//         ) : (
//           <div className="hidden md:flex items-center gap-3">
//             <Link href="/login" className="text-primary hover:underline">
//               Sign in
//             </Link>
//             <Link href="/register" className="text-primary border border-border px-4 py-1.5 rounded hover:bg-accent">
//               Sign up
//             </Link>
//           </div>
//         )}

//         <ModeToggle />

//         {/* Mobile Hamburger Menu */}
//         <div className="md:hidden">
//           <Sheet open={openMobileMenu} onOpenChange={setOpenMobileMenu}>
//             <SheetTrigger asChild>
//               <button className="p-2 hover:bg-muted rounded-md transition-colors">
//                 <Menu className="w-5 h-5" />
//               </button>
//             </SheetTrigger>
//             <SheetContent side="left" className="w-72 z-1001 border-border">
//               <SheetHeader>
//                 <SheetTitle className="flex items-center gap-1.5">
//                   <CoreIcon />
//                   <span>{appName}</span>
//                 </SheetTitle>
//               </SheetHeader>

//               {/* Nav Links */}
//               <nav className="mt-6 flex flex-col gap-1">
//                 {nav.map((item) => {
//                   const isActive = pathname === item.link;
//                   return (
//                     <Link
//                       key={item.link}
//                       href={item.link}
//                       onClick={() => setOpenMobileMenu(false)}
//                       className={`px-4 py-2.5 rounded-md text-sm transition-colors ${
//                         isActive
//                           ? "bg-muted text-foreground font-medium"
//                           : "text-muted-foreground hover:bg-muted hover:text-foreground"
//                       }`}
//                     >
//                       {item.key}
//                     </Link>
//                   );
//                 })}
//               </nav>

//               {/* Divider */}
//               <div className="my-4 border-t border-border" />

//               {/* Auth Links (mobile, not logged in) */}
//               {!user && !loading && (
//                 <div className="flex flex-col gap-2 px-1">
//                   <Link
//                     href="/login"
//                     onClick={() => setOpenMobileMenu(false)}
//                     className="w-full text-center py-2 rounded-md text-sm text-primary hover:underline"
//                   >
//                     Sign in
//                   </Link>
//                   <Link
//                     href="/register"
//                     onClick={() => setOpenMobileMenu(false)}
//                     className="w-full text-center py-2 rounded-md text-sm border border-border text-primary hover:bg-accent transition-colors"
//                   >
//                     Sign up
//                   </Link>
//                 </div>
//               )}

//               {/* Logged-in user links (mobile) */}
//               {user && (
//                 <div className="flex flex-col gap-1">
//                   {dropdownItems.map((item) =>
//                     item.show ? (
//                       <Link
//                         key={item.href}
//                         href={item.href}
//                         onClick={() => setOpenMobileMenu(false)}
//                         className="px-4 py-2.5 rounded-md text-sm text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
//                       >
//                         {item.label}
//                       </Link>
//                     ) : null,
//                   )}
//                   <button
//                     onClick={() => {
//                       setOpenMobileMenu(false);
//                       logout();
//                       disconnectSocket();
//                     }}
//                     className="mt-2 px-4 py-2.5 rounded-md text-sm text-destructive hover:bg-muted transition-colors text-left"
//                   >
//                     Sign out
//                   </button>
//                 </div>
//               )}
//             </SheetContent>
//           </Sheet>
//         </div>
//       </div>
//     </header>
//   );
// }

"use client";
import { useState, useEffect, useCallback, useRef } from "react";
import { useAuth } from "@/hook/auth-provider";
import Link from "next/link";
import { ModeToggle } from "./mode-toggle";
import Image from "next/image";

import type { NotificationDTO } from "@/types/booking/notification-type";
import { notificationService } from "@/services/booking/notification.service";
import { Bell, CheckCircle, XCircle, Info, Menu, ChevronRight } from "lucide-react";
import { addNotificationListener, disconnectSocket } from "@/lib/socket";
import { usePathname, useRouter } from "next/navigation";
import { CoreIcon } from "@/public/icons";

import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import type { CategoryDTO } from "@/types/booking/category-type";
import type { ServiceDTO } from "@/types/booking/service-type";
import { useMasterDataStore } from "@/app/store/master-data-store";
import { useShallow } from "zustand/react/shallow";

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
  const pathname = usePathname();
  const [openUserMenu, setOpenUserMenu] = useState(false);
  const [openNotifications, setOpenNotifications] = useState(false);
  const [openMobileMenu, setOpenMobileMenu] = useState(false);

  // Services mega menu
  const [openServicesMenu, setOpenServicesMenu] = useState(false);
  const [hoveredCategory, setHoveredCategory] = useState<number | null>(null);
  const servicesMenuRef = useRef<HTMLDivElement>(null);
  const servicesTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const { categories, services, fetchCategories, fetchServices } = useMasterDataStore(
    useShallow((state) => ({
      categories: state.categories,
      services: state.services,
      fetchCategories: state.fetchCategories,
      fetchServices: state.fetchServices,
    })),
  );
  const [notifications, setNotifications] = useState<NotificationDTO[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loadingNoti, setLoadingNoti] = useState(false);

  const appName = "Hange";
  const defaultAvatar = "/image/default.png";

  const dropdownItems = [
    { label: "Personal information", href: "/me", show: true },
    { label: "My bookings", href: "/me/my-bookings", show: true },
    { label: "RBAC Management", href: "/admin/rbac/roles", show: user?.role?.includes("ADMIN") },
    { label: "Service Management", href: "/admin/categories", show: user?.role?.includes("ADMIN") },
  ];

  const nav = [
    { key: "Home", link: "/" },
    { key: "About", link: "/about" },
    { key: "Contact", link: "/contact" },
    { key: "Booking", link: "/appoinment" },
  ];

  // Fetch master data khi hover vào Services
  const handleServicesHover = () => {
    if (servicesTimeoutRef.current) clearTimeout(servicesTimeoutRef.current);
    setOpenServicesMenu(true);
    fetchCategories();
    fetchServices();
    // Set category đầu tiên làm mặc định
    if (categories.length > 0 && hoveredCategory === null) {
      setHoveredCategory(categories[0].id);
    }
  };

  const handleServicesLeave = () => {
    servicesTimeoutRef.current = setTimeout(() => {
      setOpenServicesMenu(false);
      setHoveredCategory(null);
    }, 150);
  };

  // Khi categories load xong, tự set category đầu tiên
  useEffect(() => {
    if (openServicesMenu && categories.length > 0 && hoveredCategory === null) {
      setHoveredCategory(categories[0].id);
    }
  }, [categories, openServicesMenu]);

  const getServicesByCategory = (categoryId: number): ServiceDTO[] =>
    services.filter((s) => s.categoryId === categoryId);

  // Notifications
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

  const handleNewNotification = useCallback((payload: SocketNotificationPayload) => {
    setNotifications((prev) => [payload.data, ...prev]);
    setUnreadCount((prev) => prev + 1);
  }, []);

  useEffect(() => {
    if (!user?.id) return;
    fetchNotifications();
    const unsubscribe = addNotificationListener(handleNewNotification);
    return () => {
      unsubscribe();
    };
  }, [user?.id, handleNewNotification]);

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
      setNotifications((prev: NotificationDTO[]) => prev.map((item: NotificationDTO) => ({ ...item, isRead: true })));
      setUnreadCount(0);
      setOpenNotifications(false);
    } catch (error) {
      console.error("Failed to mark as read:", error);
    }
  };

  return (
    <header className="w-full h-[70px] fixed top-0 right-0 left-0 z-999 px-6 py-4 border-b border-border bg-background text-foreground flex justify-between items-center">
      {/* LOGO */}
      <div className="flex items-center gap-1.5">
        <CoreIcon />
        <Link href="/" className="font-bold text-xl text-foreground">
          {appName}
        </Link>
      </div>

      {/* Desktop Nav */}
      <div className="hidden md:flex items-center">
        {nav.map((item) => {
          const isActive = pathname === item.link;
          return (
            <Link
              key={item.link}
              href={item.link}
              className={`transition-all duration-300 px-3 py-2 rounded-md ${
                isActive ? "text-foreground font-medium" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {item.key}
            </Link>
          );
        })}

        {/* Services Mega Menu */}
        <div
          className="relative"
          onMouseEnter={handleServicesHover}
          onMouseLeave={handleServicesLeave}
          ref={servicesMenuRef}
        >
          <button
            className={`transition-all duration-300 px-3 py-2 rounded-md flex items-center gap-1 ${
              openServicesMenu ? "text-foreground font-medium" : "text-muted-foreground hover:text-foreground"
            }`}
          >
            Services
            <ChevronRight
              className={`w-3.5 h-3.5 transition-transform duration-200 ${openServicesMenu ? "rotate-90" : ""}`}
            />
          </button>

          {openServicesMenu && (
            <div
              className="absolute min-w-[620px]  left-0 top-full mt-1 flex bg-popover border border-border rounded-lg shadow-xl z-50 overflow-hidden "
              onMouseEnter={() => {
                if (servicesTimeoutRef.current) clearTimeout(servicesTimeoutRef.current);
              }}
              onMouseLeave={handleServicesLeave}
            >
              {/* Cột trái: Categories */}
              <div className="w-60 border-r border-border bg-muted/30 py-2">
                <p className="px-4 py-1.5 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  Categories
                </p>
                {categories.length === 0 ? (
                  <div className="px-4 py-3 text-sm text-muted-foreground">Loading...</div>
                ) : (
                  categories.map((cat: CategoryDTO) => (
                    <button
                      key={cat.id}
                      onMouseEnter={() => setHoveredCategory(cat.id)}
                      onClick={() => {
                        setOpenServicesMenu(false);
                        router.push(`/categories/${cat.slug}`);
                      }}
                      className={`w-full flex items-center justify-between px-4 py-2.5 text-sm transition-colors text-left ${
                        hoveredCategory === cat.id
                          ? "bg-background text-foreground font-medium"
                          : "text-muted-foreground hover:bg-background hover:text-foreground"
                      }`}
                    >
                      <span>{cat.name}</span>
                      <ChevronRight className="w-3.5 h-3.5 flex-shrink-0" />
                    </button>
                  ))
                )}
              </div>

              {/* Cột phải: Services thuộc category đang hover */}
              <div className="flex-1 py-2 min-w-[280px] max-h-[70vh] overflow-auto">
                {hoveredCategory !== null ? (
                  <>
                    <p className="px-4 py-1.5 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                      {categories.find((c) => c.id === hoveredCategory)?.name}
                    </p>
                    {getServicesByCategory(hoveredCategory).length === 0 ? (
                      <div className="px-4 py-3 text-sm text-muted-foreground">No services found</div>
                    ) : (
                      getServicesByCategory(hoveredCategory).map((svc: ServiceDTO) => (
                        <Link
                          key={svc.id}
                          href={`/services/${svc.slug}`}
                          onClick={() => setOpenServicesMenu(false)}
                          className="flex flex-col px-4 py-2.5 text-sm hover:bg-muted transition-colors rounded-sm mx-1"
                        >
                          <span className="font-medium text-foreground">{svc.name}</span>
                          {svc.description && (
                            <span className="text-xs text-muted-foreground mt-0.5 line-clamp-1">{svc.description}</span>
                          )}
                        </Link>
                      ))
                    )}
                  </>
                ) : (
                  <div className="px-4 py-3 text-sm text-muted-foreground">Hover a category to see services</div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* RIGHT SIDE */}
      <div className="flex items-center gap-3">
        {user && (
          <>
            {/* Notification Bell */}
            <div className="relative">
              <button
                onClick={() => setOpenNotifications(!openNotifications)}
                className="relative p-2 hover:bg-muted rounded-full transition-colors"
              >
                <Bell className="w-5 h-5" />
                {unreadCount > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] text-white font-medium">
                    {unreadCount > 99 ? "99+" : unreadCount}
                  </span>
                )}
              </button>

              {openNotifications && (
                <div className="fixed md:absolute right-0 translate-x-0 mt-2 w-86 bg-popover text-popover-foreground border border-border rounded-lg shadow-lg z-50 overflow-hidden">
                  <div className="p-3 border-b border-border font-medium flex justify-between bg-muted/50">
                    <span>Notifications {unreadCount !== 0 ? unreadCount : ""}</span>
                    {unreadCount > 0 && (
                      <div className="flex items-center gap-1 text-xs text-muted-foreground">
                        <button
                          className="underline hover:opacity-80 transition-all duration-500"
                          onClick={() => handlemarkReadAll(user?.id)}
                        >
                          Mark read all
                        </button>
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
                              !noti.isRead ? "bg-blue-50/80 dark:bg-blue-950/50 border-blue-500" : "bg-background"
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
          <div className="hidden md:flex items-center gap-3">
            <Link href="/login" className="text-primary hover:underline">
              Sign in
            </Link>
            <Link href="/register" className="text-primary border border-border px-4 py-1.5 rounded hover:bg-accent">
              Sign up
            </Link>
          </div>
        )}

        <ModeToggle />

        {/* Mobile Hamburger Menu */}
        <div className="md:hidden">
          <Sheet open={openMobileMenu} onOpenChange={setOpenMobileMenu}>
            <SheetTrigger asChild>
              <button className="p-2 hover:bg-muted rounded-md transition-colors">
                <Menu className="w-5 h-5" />
              </button>
            </SheetTrigger>
            <SheetContent side="left" className="w-72 z-1001 border-border overflow-y-auto">
              <SheetHeader>
                <SheetTitle className="flex items-center gap-1.5">
                  <CoreIcon />
                  <span>{appName}</span>
                </SheetTitle>
              </SheetHeader>

              {/* Nav Links */}
              <nav className="mt-6 flex flex-col gap-1">
                {nav.map((item) => {
                  const isActive = pathname === item.link;
                  return (
                    <Link
                      key={item.link}
                      href={item.link}
                      onClick={() => setOpenMobileMenu(false)}
                      className={`px-4 py-2.5 rounded-md text-sm transition-colors ${
                        isActive
                          ? "bg-muted text-foreground font-medium"
                          : "text-muted-foreground hover:bg-muted hover:text-foreground"
                      }`}
                    >
                      {item.key}
                    </Link>
                  );
                })}

                {/* Services accordion mobile */}
                <MobileServicesMenu
                  categories={categories}
                  services={services}
                  onNavigate={() => setOpenMobileMenu(false)}
                  onFetch={() => {
                    fetchCategories();
                    fetchServices();
                  }}
                />
              </nav>

              <div className="my-4 border-t border-border" />

              {!user && !loading && (
                <div className="flex flex-col gap-2 px-1">
                  <Link
                    href="/login"
                    onClick={() => setOpenMobileMenu(false)}
                    className="w-full text-center py-2 rounded-md text-sm text-primary hover:underline"
                  >
                    Sign in
                  </Link>
                  <Link
                    href="/register"
                    onClick={() => setOpenMobileMenu(false)}
                    className="w-full text-center py-2 rounded-md text-sm border border-border text-primary hover:bg-accent transition-colors"
                  >
                    Sign up
                  </Link>
                </div>
              )}

              {user && (
                <div className="flex flex-col gap-1">
                  {dropdownItems.map((item) =>
                    item.show ? (
                      <Link
                        key={item.href}
                        href={item.href}
                        onClick={() => setOpenMobileMenu(false)}
                        className="px-4 py-2.5 rounded-md text-sm text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
                      >
                        {item.label}
                      </Link>
                    ) : null,
                  )}
                  <button
                    onClick={() => {
                      setOpenMobileMenu(false);
                      logout();
                      disconnectSocket();
                    }}
                    className="mt-2 px-4 py-2.5 rounded-md text-sm text-destructive hover:bg-muted transition-colors text-left"
                  >
                    Sign out
                  </button>
                </div>
              )}
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}

// ─── Mobile Services Accordion ────────────────────────────────────────────────
function MobileServicesMenu({
  categories,
  services,
  onNavigate,
  onFetch,
}: {
  categories: CategoryDTO[];
  services: ServiceDTO[];
  onNavigate: () => void;
  onFetch: () => void;
}) {
  const [open, setOpen] = useState(false);
  const [expandedCat, setExpandedCat] = useState<number | null>(null);
  const router = useRouter();

  const handleOpen = () => {
    if (!open) onFetch();
    setOpen(!open);
  };

  return (
    <div>
      <button
        onClick={handleOpen}
        className="w-full flex items-center justify-between px-4 py-2.5 rounded-md text-sm text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
      >
        <span>Services</span>
        <ChevronRight className={`w-3.5 h-3.5 transition-transform duration-200 ${open ? "rotate-90" : ""}`} />
      </button>

      {open && (
        <div className="ml-3 mt-1 border-l border-border pl-3 flex flex-col gap-0.5">
          {categories.length === 0 ? (
            <p className="px-2 py-1.5 text-xs text-muted-foreground">Loading...</p>
          ) : (
            categories.map((cat) => (
              <div key={cat.id}>
                <button
                  onClick={() => setExpandedCat(expandedCat === cat.id ? null : cat.id)}
                  className="w-full flex items-center justify-between px-3 py-2 rounded-md text-sm text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
                >
                  <span>{cat.name}</span>
                  <ChevronRight
                    className={`w-3 h-3 transition-transform duration-200 ${expandedCat === cat.id ? "rotate-90" : ""}`}
                  />
                </button>

                {expandedCat === cat.id && (
                  <div className="ml-3 mt-0.5 border-l border-border pl-3 flex flex-col gap-0.5 mb-1">
                    {services.filter((s) => s.categoryId === cat.id).length === 0 ? (
                      <p className="px-2 py-1 text-xs text-muted-foreground">No services</p>
                    ) : (
                      services
                        .filter((s) => s.categoryId === cat.id)
                        .map((svc) => (
                          <button
                            key={svc.id}
                            onClick={() => {
                              router.push(`/services/${svc.slug}`);
                              onNavigate();
                            }}
                            className="text-left px-3 py-2 rounded-md text-sm text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
                          >
                            {svc.name}
                          </button>
                        ))
                    )}
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}
