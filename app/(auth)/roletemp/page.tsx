"use client";

import { useState } from "react";
import { ShieldCheck, KeyRound } from "lucide-react";

import PermissionTab from "./permission-tab";
import RoleTab from "./role-tab";

import HeaderLayout from "@/components/layout/header-layout";
import FooterLayout from "@/components/layout/footer-layout";

export default function RbacPage() {
  const [tab, setTab] = useState<"permission" | "role">("permission");

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

                    <h1 className="font-bold mt-1">RBAC Management</h1>
                  </div>

                  {/* MENU */}
                  <div className="space-y-1">
                    <button
                      onClick={() => setTab("permission")}
                      className={`w-full flex items-center gap-4 px-3 py-3 rounded-lg transition
                      ${
                        tab === "permission"
                          ? "bg-accent text-accent-foreground"
                          : "hover:bg-accent text-muted-foreground hover:text-foreground"
                      }`}
                    >
                      <ShieldCheck size={20} strokeWidth={1.8} />

                      <span className="font-medium">Permissions</span>
                    </button>

                    <button
                      onClick={() => setTab("role")}
                      className={`w-full flex items-center gap-4 px-3 py-3 rounded-lg transition
                      ${
                        tab === "role"
                          ? "bg-accent text-accent-foreground"
                          : "hover:bg-accent text-muted-foreground hover:text-foreground"
                      }`}
                    >
                      <KeyRound size={20} strokeWidth={1.8} />

                      <span className="font-medium">Roles</span>
                    </button>
                  </div>
                </div>
              </div>
            </aside>

            {/* RIGHT CONTENT */}
            <main className="flex-1 flex justify-start">
              <div className="w-full max-w-275 px-2 sm:px-8 md:px-14 py-10">
                {/* PAGE HEADER */}
                <div>
                  <h1 className="font-bold tracking-[-1px] text-lg">Access Control</h1>

                  <p className="mt-3 text-muted-foreground">
                    Manage system permissions and role authorization settings.
                  </p>

                  {/* TABS */}
                  <div className="flex items-center gap-10 mt-10 border-b border-border">
                    <button
                      onClick={() => setTab("permission")}
                      className={`pb-4 font-medium border-b-2 transition-all
                      ${
                        tab === "permission"
                          ? "border-primary text-primary"
                          : "border-transparent text-muted-foreground hover:text-foreground"
                      }`}
                    >
                      Permissions
                    </button>

                    <button
                      onClick={() => setTab("role")}
                      className={`pb-4 font-medium border-b-2 transition-all
                      ${
                        tab === "role"
                          ? "border-primary text-primary"
                          : "border-transparent text-muted-foreground hover:text-foreground"
                      }`}
                    >
                      Roles
                    </button>
                  </div>
                </div>

                {/* BODY */}
                <div className="pt-8">{tab === "permission" ? <PermissionTab /> : <RoleTab />}</div>
              </div>
            </main>
          </div>
        </div>
      </FooterLayout>
    </HeaderLayout>
  );
}
