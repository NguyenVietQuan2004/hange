"use client";

import { useMasterDataStore } from "@/app/store/master-data-store";
import Link from "next/link";
import { useShallow } from "zustand/react/shallow";

export default function Footer() {
  const { services, categories, locations } = useMasterDataStore(
    useShallow((state) => ({
      services: state.services,
      locations: state.locations,
      categories: state.categories,
    })),
  );

  return (
    <footer className="bg-background border-t border-border px-6 py-10">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
        <div className="">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-6 h-6 rounded-full border border-border flex items-center justify-center hover:scale-110 transition-transform duration-200">
              <div className="w-1.5 h-1.5 rounded-full bg-foreground" />
            </div>
            <span className="font-bold text-foreground">Hange</span>
          </div>
          <p className="text-xs text-muted-foreground max-w-xs leading-relaxed">
            Professional auto repair you can book, track, and trust — with a 12-month warranty on all work.
          </p>
        </div>

        <div className="flex flex-wrap gap-8  stagger-2">
          <div>
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">Company</p>
            <div className="space-y-2">
              {[
                ["About", "/about"],
                ["Contact", "/contact"],
                ["Careers", "#"],
              ].map(([l, h]) => (
                <a
                  key={l}
                  href={h}
                  className="block text-sm text-muted-foreground hover:text-foreground transition-colors duration-200 link-underline"
                >
                  {l}
                </a>
              ))}
            </div>
          </div>
          <div>
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">Services</p>
            <div className="space-y-2">
              {categories.map((s) => (
                <a
                  key={s.id}
                  href="/appoinment"
                  className="block text-sm text-muted-foreground hover:text-foreground transition-colors duration-200 link-underline"
                >
                  {s.name}
                </a>
              ))}
            </div>
          </div>
          <div>
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">Legal</p>
            <div className="space-y-2">
              {["Privacy Policy", "Terms of Service", "Warranty Policy"].map((l) => (
                <a
                  key={l}
                  href="#"
                  className="block text-sm text-muted-foreground hover:text-foreground transition-colors duration-200 link-underline"
                >
                  {l}
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto mt-10 pt-6 border-t border-border flex flex-col md:flex-row items-center justify-between gap-3">
        <p className="text-xs text-muted-foreground">© 2026 Hange Auto Repair. All rights reserved.</p>
        <p className="text-xs text-muted-foreground">ASE Certified · Licensed & Insured · 12-Month Warranty</p>
      </div>
    </footer>
  );
}
