import type { Metadata } from "next";
import { Geist, Geist_Mono, Newsreader } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const newsReader = Newsreader({
  variable: "--font-newsreader",
  subsets: ["latin"],
  style: ["normal", "italic"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Genesis Osasenaga Ighalo - Full-Stack Developer",
  description:
    "Fullstack Developer specialising in web development with React, Next.js, Typescript and Python. Based in Benin City, Nigeria.",
  openGraph: {
    title: "Genesis Osasenaga Ighalo - Full-Stack Developer",
    description:
      "Fullstack Developer specialising in web development with React, Next.js, Typescript and Python. Based in Benin City, Nigeria.",
    url: process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000",
    siteName: "daveshub.vercel.app",
    images: [
      {
        url: `${process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"}/og-image.jpeg`,
        width: 1200,
        height: 630,
        alt: "Genesis Osasenaga Ighalo — Full-Stack Developer",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000",
  ),
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} ${newsReader.variable} h-full antialiased scroll-smooth`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
