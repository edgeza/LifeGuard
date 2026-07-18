import type { Metadata } from "next";
import "./globals.css";
import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";
import { CookieBanner } from "@/components/CookieBanner";

export const metadata: Metadata = {
  title: "LifeGuard — Wearable safety, operator-grade response, open API",
  description:
    "LifeGuard pairs medical-grade wearables with a Linear-class control-room console and a public REST API. 4 first-party carrier markets. From $9 device-month retail.",
  metadataBase: new URL("https://lifeguard.example.com"),
  openGraph: {
    title: "LifeGuard",
    description: "Wearable safety, operator-grade response, open API.",
    type: "website",
    url: "https://lifeguard.example.com",
    siteName: "LifeGuard",
    images: [
      {
        url: "/og.png",
        width: 1200,
        height: 630,
        alt: "LifeGuard — wearable safety platform",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "LifeGuard — Wearable safety, operator-grade response, open API",
    description: "Wearable safety, operator-grade response, open API.",
    images: ["/og.png"],
    creator: "@lifeguard",
  },
  icons: {
    icon: "/favicon.svg",
  },
  themeColor: "#e11d2e",
  alternates: { canonical: "/" },
};

// JSON-LD structured data — drives rich Google results, organization cards,
// product cards, and FAQ rich snippets. Injected in the document <head>.
const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": "https://lifeguard.example.com/#org",
      name: "LifeGuard",
      url: "https://lifeguard.example.com",
      logo: {
        "@type": "ImageObject",
        url: "https://lifeguard.example.com/og.png",
        width: 1200,
        height: 630,
      },
      description:
        "LifeGuard builds wearable personal-safety hardware and a Linear-class operator console. Founded 2025 in Cape Town, South Africa.",
      foundingDate: "2025",
      founders: [
        { "@type": "Person", name: "Themba Mokoena", jobTitle: "Founder · CEO" },
        { "@type": "Person", name: "Naledi Radebe", jobTitle: "Co-founder · Head of Hardware" },
        { "@type": "Person", name: "Jacobus Steyn", jobTitle: "Head of Operator Experience" },
      ],
      address: { "@type": "PostalAddress", addressLocality: "Cape Town", addressCountry: "ZA" },
      contactPoint: [
        {
          "@type": "ContactPoint",
          contactType: "customer support",
          email: "hello@life.guard",
          availableLanguage: ["English"],
        },
      ],
      sameAs: ["https://github.com/edgeza/lifeguard"],
    },
    {
      "@type": "SoftwareApplication",
      "@id": "https://lifeguard.example.com/#product",
      name: "LifeGuard",
      applicationCategory: "HealthApplication",
      applicationSubCategory: "Personal Safety & Lone-Worker Monitoring",
      operatingSystem: "Web · iOS · Android · Wear OS",
      offers: [
        {
          "@type": "Offer",
          name: "Consumer Direct",
          price: "9.99",
          priceCurrency: "USD",
          category: "subscription",
          description: "One device, one subscription, full operator coverage. From $9.99 per device per month.",
        },
        {
          "@type": "Offer",
          name: "Solo Pro",
          price: "24.99",
          priceCurrency: "USD",
          category: "subscription",
          description: "10–500 workers, white-label option included. $24.99 per worker per month.",
        },
      ],
      featureList: [
        "4G LTE-M + NB-IoT + GPS + Wi-Fi positioning + Bluetooth 5.3",
        "Medical-grade HR / HRV / SpO₂ / skin temperature / 9-axis IMU / fall detection",
        "Open REST API · Webhooks · SDK in 6 languages · 100k events/month included",
        "Linear-class operator console · AI triage · Audit-trail hash chain",
        "ISO 27001 certified · SOC 2 Type II in audit · GDPR · POPIA",
      ],
    },
    {
      "@type": "FAQPage",
      "@id": "https://lifeguard.example.com/#faq",
      mainEntity: [
        {
          "@type": "Question",
          name: "Does LifeGuard include cellular service?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Every plan includes the cellular data the device needs. The SIM is provisioned in our four first-party carrier markets (ZA, UK, NL, AU) and roams on partner LTE-M everywhere else.",
          },
        },
        {
          "@type": "Question",
          name: "What is the white-label markup?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Resellers set their own retail price. Wholesale runs from $2.50/device/month at scale for Operators, with a 20% markup envelope. The margin is yours.",
          },
        },
        {
          "@type": "Question",
          name: "Can I move plans later?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Yes. Upgrade, downgrade, or add devices at any time from your dashboard. We bill monthly in arrears, no annual contract.",
          },
        },
        {
          "@type": "Question",
          name: "Do you offer a free trial?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "We offer a 30-day sandbox with the same APIs and console as a paid tenant. Hardware is sold upfront.",
          },
        },
      ],
    },
  ],
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
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
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
        <CookieBanner />
      </body>
    </html>
  );
}
