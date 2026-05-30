"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { FolderPlus, BriefcaseBusiness, MapPin, CalendarClock, UserCheck, Clock, LayoutGrid } from "lucide-react";

import HeaderLayout from "@/components/layout/header-layout";
import FooterLayout from "@/components/layout/footer-layout";

type Props = {
  children: React.ReactNode;
};

const menus = [
  { name: "Categories", href: "/categories", icon: FolderPlus },
  { name: "Services", href: "/services", icon: BriefcaseBusiness },
  { name: "Locations", href: "/locations", icon: MapPin },
  { name: "Bookings", href: "/bookings", icon: CalendarClock },
  { name: "My Bookings", href: "/bookings/me", icon: UserCheck },
  { name: "Service Slots", href: "/slots", icon: Clock },
];
export default function BookingAdminLayout({ children }: Props) {
  const pathname = usePathname();

  return (
    <HeaderLayout>
      <FooterLayout>
        <div className="min-h-screen bg-background text-foreground">
          <div className="flex">
            {/* LEFT SIDEBAR */}
            <aside className="hidden lg:flex w-1/3 min-h-screen border-r border-border shrink-0 bg-background">
              <div className="w-full px-10 py-8 flex flex-col items-end">
                <div className="w-full max-w-70">
                  {/* HEADER */}
                  <div className="mb-10">
                    <p className="text-muted-foreground">Administration</p>

                    <h1 className="font-bold mt-1">Booking Management</h1>
                  </div>

                  {/* MENU */}
                  <div className="space-y-1">
                    {menus.map((menu) => {
                      const Icon = menu.icon;
                      const active = pathname === menu.href;
                      return (
                        <Link
                          key={menu.name}
                          href={menu.href}
                          className={`w-full flex items-center gap-4 px-3 py-3 rounded-lg transition
                          ${
                            active
                              ? "bg-accent text-accent-foreground"
                              : "hover:bg-accent text-muted-foreground hover:text-foreground"
                          }`}
                        >
                          <Icon size={20} strokeWidth={1.8} />

                          <span className="font-medium">{menu.name}</span>
                        </Link>
                      );
                    })}
                  </div>
                </div>
              </div>
            </aside>

            {/* RIGHT CONTENT */}
            <main className="flex-1 flex justify-start">
              <div className="w-full max-w-7xl px-4 sm:px-8 md:px-14 py-10">
                {/* PAGE HEADER */}
                <div>
                  <div className="flex items-center gap-3">
                    <LayoutGrid className="w-5 h-5 text-primary" />

                    <h1 className="font-bold tracking-[-1px] text-lg">Booking Administration</h1>
                  </div>

                  <p className="mt-3 text-muted-foreground">Manage categories, booking services and service slots.</p>

                  {/* TOP NAV */}
                  <div className="flex items-center gap-10 mt-10 border-b border-border overflow-x-auto">
                    {menus.map((menu) => {
                      const active = pathname === menu.href;

                      return (
                        <Link
                          key={menu.name}
                          href={menu.href}
                          className={`pb-4 font-medium border-b-2 whitespace-nowrap transition-all
          ${active ? "border-primary text-primary" : "border-transparent text-muted-foreground hover:text-foreground"}`}
                        >
                          {menu.name}
                        </Link>
                      );
                    })}
                  </div>
                </div>
                {/* BODY */}
                <div className="pt-8">{children}</div>
              </div>
            </main>
          </div>
        </div>
      </FooterLayout>
    </HeaderLayout>
  );
}
