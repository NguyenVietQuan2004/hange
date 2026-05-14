// "use client";

// import HeaderLayout from "@/components/layout/header-layout";
// import FooterLayout from "@/components/layout/footer-layout";

// export default function HomePage() {
//   return (
//     <HeaderLayout>
//       <FooterLayout>
//         <div className=" flex  items-center justify-center px-4 bg-background text-foreground transition-colors">
//           <div className="w-full max-w-2xl"> </div>
//         </div>
//       </FooterLayout>
//     </HeaderLayout>
//   );
// }
"use client";

import { ShieldCheck, Users, Lock, Activity, ArrowRight, Database, Globe, Bell } from "lucide-react";

import HeaderLayout from "@/components/layout/header-layout";
import FooterLayout from "@/components/layout/footer-layout";

export default function HomePage() {
  return (
    <HeaderLayout>
      <FooterLayout>
        <div className="min-h-screen bg-background text-foreground transition-colors">
          {/* HERO */}
          <section className="px-6 md:px-10 pt-20 pb-14 border-b border-border">
            <div className="max-w-7xl mx-auto">
              <div className="max-w-3xl">
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-border bg-accent mb-6">
                  <ShieldCheck size={16} />
                  <span className="text-muted-foreground">System Management Dashboard</span>
                </div>

                <h1 className="font-bold  leading-tight">Modern Access Control & Authentication Platform</h1>

                <p className="mt-6 text-muted-foreground leading-8 max-w-2xl">
                  Manage permissions, roles, user sessions, authentication security, and monitor real-time system
                  activities from a single unified dashboard.
                </p>

                <div className="flex flex-wrap items-center gap-4 mt-10">
                  <button className="h-11 px-6 rounded-xl bg-primary text-primary-foreground font-medium hover:opacity-90 transition">
                    Open Dashboard
                  </button>

                  <button className="h-11 px-6 rounded-xl border border-border hover:bg-accent transition flex items-center gap-2">
                    Documentation
                    <ArrowRight size={16} />
                  </button>
                </div>
              </div>
            </div>
          </section>

          {/* STATS */}
          <section className="px-6 md:px-10 py-10">
            <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
              <StatCard icon={<Users size={20} />} title="Active Users" value="12,482" desc="+18% this month" />

              <StatCard
                icon={<ShieldCheck size={20} />}
                title="Permissions"
                value="148"
                desc="System-wide access rules"
              />

              <StatCard icon={<Lock size={20} />} title="Roles" value="24" desc="Role-based authorization" />

              <StatCard
                icon={<Activity size={20} />}
                title="Security Events"
                value="2,381"
                desc="Live monitoring enabled"
              />
            </div>
          </section>

          {/* MAIN GRID */}
          <section className="px-6 md:px-10 pb-14">
            <div className="max-w-7xl mx-auto grid grid-cols-1 xl:grid-cols-[1.4fr_0.8fr] gap-6">
              {/* LEFT */}
              <div className="space-y-6">
                {/* OVERVIEW */}
                <div className="rounded-3xl border border-border bg-card p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h2 className="font-bold">System Overview</h2>

                      <p className="text-muted-foreground mt-2">Current infrastructure and authentication status.</p>
                    </div>

                    <div className="px-3 py-1 rounded-full bg-green-500/10 text-green-500 border border-green-500/20">
                      Operational
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
                    <OverviewBox icon={<Database size={18} />} title="Database" value="Healthy" />

                    <OverviewBox icon={<Globe size={18} />} title="API Gateway" value="99.98%" />

                    <OverviewBox icon={<Bell size={18} />} title="Alerts" value="3 Active" />
                  </div>
                </div>

                {/* RECENT ACTIVITY */}
                <div className="rounded-3xl border border-border bg-card p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h2 className="font-bold">Recent Activity</h2>

                      <p className="text-muted-foreground mt-2">Latest authentication and authorization events.</p>
                    </div>

                    <button className="text-primary hover:opacity-80 transition">View all</button>
                  </div>

                  <div className="mt-8 space-y-5">
                    <ActivityItem title="Admin role updated" desc="RBAC permissions were modified by administrator." />

                    <ActivityItem title="New user registration" desc="A new account has been successfully verified." />

                    <ActivityItem
                      title="Failed login detected"
                      desc="Security protection blocked suspicious login attempt."
                    />

                    <ActivityItem title="Access token refreshed" desc="Session refresh completed successfully." />
                  </div>
                </div>
              </div>

              {/* RIGHT */}
              <div className="space-y-6">
                {/* QUICK ACTION */}
                <div className="rounded-3xl border border-border bg-card p-6">
                  <h2 className="font-bold">Quick Actions</h2>

                  <div className="mt-6 space-y-3">
                    <QuickButton text="Create New Role" />

                    <QuickButton text="Manage Permissions" />

                    <QuickButton text="View Audit Logs" />

                    <QuickButton text="System Settings" />
                  </div>
                </div>

                {/* SECURITY SCORE */}
                <div className="rounded-3xl border border-border bg-card p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h2 className="font-bold">Security Score</h2>

                      <p className="text-muted-foreground mt-2">Overall protection and authentication health.</p>
                    </div>

                    <div className="w-20 h-20 rounded-full border-8 border-primary flex items-center justify-center font-bold">
                      92%
                    </div>
                  </div>

                  <div className="mt-8 space-y-4">
                    <ProgressItem label="JWT Security" percent="96%" />

                    <ProgressItem label="RBAC Coverage" percent="91%" />

                    <ProgressItem label="API Protection" percent="88%" />

                    <ProgressItem label="Infrastructure" percent="93%" />
                  </div>
                </div>
              </div>
            </div>
          </section>
        </div>
      </FooterLayout>
    </HeaderLayout>
  );
}

function StatCard({ icon, title, value, desc }: { icon: React.ReactNode; title: string; value: string; desc: string }) {
  return (
    <div className="rounded-3xl border border-border bg-card p-6">
      <div className="w-11 h-11 rounded-2xl bg-accent flex items-center justify-center">{icon}</div>

      <div className="mt-5">
        <p className="text-muted-foreground">{title}</p>

        <h3 className="font-bold mt-2">{value}</h3>

        <p className="text-muted-foreground mt-1">{desc}</p>
      </div>
    </div>
  );
}

function OverviewBox({ icon, title, value }: { icon: React.ReactNode; title: string; value: string }) {
  return (
    <div className="rounded-2xl border border-border bg-background p-5">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-accent flex items-center justify-center">{icon}</div>

        <div>
          <p className="text-muted-foreground">{title}</p>

          <h3 className="font-semibold mt-1">{value}</h3>
        </div>
      </div>
    </div>
  );
}

function ActivityItem({ title, desc }: { title: string; desc: string }) {
  return (
    <div className="flex items-start gap-4">
      <div className="w-3 h-3 rounded-full bg-primary mt-2 shrink-0" />

      <div>
        <h4 className="font-semibold">{title}</h4>

        <p className="text-muted-foreground mt-1">{desc}</p>
      </div>
    </div>
  );
}

function QuickButton({ text }: { text: string }) {
  return (
    <button className="w-full h-12 rounded-2xl border border-border bg-background hover:bg-accent transition text-left px-4 font-medium">
      {text}
    </button>
  );
}

function ProgressItem({ label, percent }: { label: string; percent: string }) {
  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <span>{label}</span>

        <span className="text-muted-foreground">{percent}</span>
      </div>

      <div className="w-full h-2 rounded-full bg-accent overflow-hidden">
        <div className="h-full bg-primary rounded-full" style={{ width: percent }} />
      </div>
    </div>
  );
}
