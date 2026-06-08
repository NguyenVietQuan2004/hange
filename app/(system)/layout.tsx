"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { FolderPlus, BriefcaseBusiness, MapPin, CalendarClock, UserCheck, Clock, LayoutGrid } from "lucide-react";

import HeaderLayout from "@/components/layout/header-layout";
import FooterLayout from "@/components/layout/footer-layout";

type Props = {
  children: React.ReactNode;
};

export default function BookingAdminLayout({ children }: Props) {
  const pathname = usePathname();

  return (
    <HeaderLayout>
      <FooterLayout>
        <div className="pt-0">{children}</div>
      </FooterLayout>
    </HeaderLayout>
  );
}
