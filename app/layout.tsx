import { APP_URL, AUTHOR, IMAGES, SEO, THEME_COLOR } from "@/lib/config";
import { LocaleProvider } from "@/lib/i18n";
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL(APP_URL),
  title: SEO.title,
  description: SEO.description,
  keywords: SEO.keywords,
  authors: [{ name: AUTHOR.name, url: AUTHOR.github }],
  creator: AUTHOR.name,
  publisher: AUTHOR.name,
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    alternateLocale: ["fr_FR"],
    url: APP_URL,
    siteName: "Gantt Generator",
    title: SEO.title.default,
    description: SEO.description,
    images: [
      {
        url: IMAGES.ogImage,
        width: 1200,
        height: 630,
        alt: "Gantt Chart Generator - Professional Project Management Tool",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Gantt Chart Generator | Free Professional Tool",
    description: SEO.description,
    images: [IMAGES.ogImage],
    creator: AUTHOR.twitter,
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
  icons: {
    icon: [
      { url: IMAGES.favicon, sizes: "any" },
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
    ],
    apple: [{ url: IMAGES.appleTouchIcon, sizes: "180x180", type: "image/png" }],
    other: [
      {
        rel: "mask-icon",
        url: "/safari-pinned-tab.svg",
        color: THEME_COLOR,
      },
    ],
  },
  manifest: "/manifest.json",
  alternates: {
    canonical: APP_URL,
    languages: {
      en: APP_URL,
      fr: APP_URL,
    },
  },
  category: "technology",
  classification: "Project Management Tool",
  other: {
    "apple-mobile-web-app-capable": "yes",
    "apple-mobile-web-app-status-bar-style": "default",
    "apple-mobile-web-app-title": "Gantt Generator",
    "mobile-web-app-capable": "yes",
    "msapplication-TileColor": THEME_COLOR,
    "msapplication-config": "/browserconfig.xml",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" dir="ltr">
      <head>
        <link rel="canonical" href={APP_URL} />
        <link rel="alternate" hrefLang="en" href={APP_URL} />
        <link rel="alternate" hrefLang="fr" href={APP_URL} />
        <link rel="alternate" hrefLang="x-default" href={APP_URL} />
        <meta name="theme-color" content={THEME_COLOR} />
        <meta name="color-scheme" content="light" />
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=5" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <LocaleProvider>{children}</LocaleProvider>
      </body>
    </html>
  );
}
