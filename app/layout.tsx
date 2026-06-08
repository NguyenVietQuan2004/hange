import "./globals.css";
import "./animate.css";
import { cn } from "@/lib/utils";
import type { Metadata } from "next";
import localFont from "next/font/local";
import { Geist } from "next/font/google";
import { Toaster } from "@/components/ui/sonner";
import { AuthProvider } from "@/hook/auth-provider";
import { ThemeProvider } from "@/components/theme-provider";
import SocketProvider from "@/hook/socket-provider";
import { CoreIcon } from "@/public/icons";
import { MasterDataProvider } from "@/hook/master-data-provider";

const geist = Geist({ subsets: ["latin"], variable: "--font-sans" });

// app/layout.tsx

const monaSans = localFont({
  src: [
    {
      path: "../public/fonts/MonaSansVF.woff2",
      weight: "100 900",
      style: "normal",
    },
  ],
  variable: "--font-mona",
  display: "swap",
});
export const metadata: Metadata = {
  title: "Hange",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={cn("h-full", "antialiased", monaSans.variable, "font-sans", geist.variable)}
    >
      <body className="min-h-screen max-w-[100vw] flex flex-col  text-sm font-sans">
        <AuthProvider>
          {" "}
          <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
            <SocketProvider>
              <MasterDataProvider />
              {children}
            </SocketProvider>
          </ThemeProvider>
        </AuthProvider>

        <Toaster />
      </body>
    </html>
  );
}
