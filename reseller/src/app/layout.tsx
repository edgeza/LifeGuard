import type { Metadata } from "next";
import "./globals.css";
import SideNav from "@/components/SideNav";
import TopBar from "@/components/TopBar";

export const metadata: Metadata = {
  title: "LifeGuard · Reseller Dashboard",
  description: "Operator dashboard for security companies and lone-worker employers.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://rsms.me/" />
        <link rel="stylesheet" href="https://rsms.me/inter/inter.css" />
      </head>
      <body>
        <div className="min-h-screen flex">
          <SideNav />
          <div className="flex-1 min-w-0 flex flex-col">
            <TopBar />
            <main className="flex-1 px-6 lg:px-8 py-6">{children}</main>
          </div>
        </div>
      </body>
    </html>
  );
}
