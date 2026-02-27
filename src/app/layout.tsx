import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import Script from "next/script";
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
  title: "Devian | Control Center for Your Local Environment",
  description: "Understand and control everything running on your machine — from projects and ports to Docker containers and disk usage — with AI powered insights.",
  keywords: ["developer tools", "local environment", "docker management", "port monitor", "project scanner", "macOS app", "dev tools"],
  authors: [{ name: "Devian Labs" }],
  openGraph: {
    type: "website",
    locale: "en_US",
    title: "Devian | AI-Powered Local Dev Environment Manager",
    description: "Understand and control everything running on your machine — from projects and ports to Docker containers and disk usage.",
    siteName: "Devian",
  },
  twitter: {
    card: "summary_large_image",
    title: "Devian | Control Center for Your Local Environment",
    description: "Understand and control everything running on your machine with AI-powered insights.",
    creator: "@devian",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
        <Analytics />
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-6W1LFN2P2J"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
          
            gtag('config', 'G-6W1LFN2P2J');
          `}
        </Script>
      </body>
    </html>
  );
}
