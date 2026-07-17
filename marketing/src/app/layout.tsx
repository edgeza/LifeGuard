import type { Metadata } from "next";
import "./globals.css";
import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";

export const metadata: Metadata = {
  title: "LifeGuard — Wearable safety, operator-grade response, open API",
  description:
    "LifeGuard pairs medical-grade wearables with a Linear-class control-room console and a public API. 195 countries. From $2.50 per device-month.",
  metadataBase: new URL("https://lifeguard.example.com"),
  openGraph: {
    title: "LifeGuard",
    description: "Wearable safety, operator-grade response, open API.",
    type: "website",
  },
  icons: {
    icon: "/favicon.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;510;600&family=JetBrains+Mono:wght@400;500&display=swap"
        />
      </head>
      <body>
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-50 focus:bg-white focus:px-3 focus:py-2 focus:rounded-md focus:shadow-stripe-3 focus:text-ink"
          style={{ color: "var(--color-ink)" }}
        >
          Skip to content
        </a>
        <Nav />
        <main id="main">{children}</main>
        <Footer />
      </body>
    </html>
  );
}