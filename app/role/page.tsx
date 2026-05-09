"use client";

import { useEffect, useState } from "react";
import PermissionTab from "./permission-tab";
import RoleTab from "./role-tab";
import HeaderLayout from "@/components/layout/header-layout";
import FooterLayout from "@/components/layout/footer-layout";

export default function RbacPage() {
  const [tab, setTab] = useState<"permission" | "role">("permission");
  return (
    <HeaderLayout>
      <FooterLayout>
        <div className="p-2 md:p-6  ">
          <div className="flex gap-2 mb-4">
            <button
              onClick={() => setTab("permission")}
              className={`px-4 py-2 border rounded ${tab === "permission" ? "bg-black text-white" : ""}`}
            >
              Permission
            </button>

            <button
              onClick={() => setTab("role")}
              className={`px-4 py-2 border rounded ${tab === "role" ? "bg-black text-white" : ""}`}
            >
              Role
            </button>
          </div>

          {tab === "permission" ? <PermissionTab /> : <RoleTab />}
        </div>
      </FooterLayout>
    </HeaderLayout>
  );
}
