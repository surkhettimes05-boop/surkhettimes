import type { Metadata, Viewport } from "next";
import { Martel, Mukta } from "next/font/google";
import { Analytics } from "@vercel/analytics/react";
import "./globals.css";

const martel = Martel({
  variable: "--font-martel",
  subsets: ["latin"],
  display: "swap",
  weight: ["400", "700", "900"],
});

const mukta = Mukta({
  variable: "--font-mukta",
  subsets: ["latin"],
  display: "swap",
  weight: ["300", "400", "600", "700"],
});

export const viewport: Viewport = {
  themeColor: "#F7F5F0",
  width: "device-width",
  initialScale: 1,
};

export const metadata: Metadata = {
  title: {
    default: "SurkhetTimes — Karnali Province News",
    template: "%s | SurkhetTimes",
  },
  description:
    "SurkhetTimes delivers the latest news, stories, and updates from Surkhet, " +
    "Karnali Province, and across Nepal. Stay informed with local politics, " +
    "sports, business, culture, and community coverage.",
  keywords: [
    "Surkhet",
    "Karnali Province",
    "Nepal news",
    "local news",
    "Nepali news",
    "सुर्खेत",
    "कर्णाली प्रदेश",
  ],
  authors: [{ name: "SurkhetTimes" }],
  creator: "SurkhetTimes",
  publisher: "SurkhetTimes",
  metadataBase: new URL("https://surkhettimes.com"),
  openGraph: {
    type: "website",
    locale: "ne_NP",
    siteName: "SurkhetTimes",
    title: "SurkhetTimes — Karnali Province News",
    description:
      "Latest news and stories from Surkhet, Karnali Province, and Nepal.",
  },
  twitter: {
    card: "summary_large_image",
    title: "SurkhetTimes — Karnali Province News",
    description:
      "Latest news and stories from Surkhet, Karnali Province, and Nepal.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {
    google: "lO9MCJwjXpsRdukdOtj2j1qRqrJZSmyoYe_cnIduYqU",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ne" className={`${martel.variable} ${mukta.variable}`}>
      <body>
        <a href="#main-content" className="skip-to-content">
          Skip to content
        </a>
        {children}
        <Analytics />
      </body>
    </html>
  );
}
