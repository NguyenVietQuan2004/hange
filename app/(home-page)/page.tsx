"use client";

import HeaderLayout from "@/components/layout/header-layout";
import FooterLayout from "@/components/layout/footer-layout";

export default function HomePage() {
  return (
    <HeaderLayout>
      <FooterLayout>
        <div className=" flex  items-center justify-center px-4 bg-background text-foreground transition-colors">
          <div className="w-full max-w-2xl"></div>
        </div>
      </FooterLayout>
    </HeaderLayout>
  );
}
