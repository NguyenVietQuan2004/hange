import "./globals.css";
import { cn } from "@/lib/utils";
import type { Metadata } from "next";
import localFont from "next/font/local";
import { Geist } from "next/font/google";
import { Toaster } from "@/components/ui/sonner";
import { AuthProvider } from "@/hook/auth-provider";
import { ThemeProvider } from "@/components/theme-provider";

const geist = Geist({ subsets: ["latin"], variable: "--font-sans" });

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
      <body className="min-h-screen flex flex-col  text-sm font-sans">
        <AuthProvider>
          {" "}
          <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
            {children}
          </ThemeProvider>
        </AuthProvider>

        <Toaster />
      </body>
    </html>
  );
}
