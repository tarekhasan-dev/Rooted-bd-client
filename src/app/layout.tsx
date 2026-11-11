import type { Metadata } from "next";
import type { ReactNode } from "react";
import { Geist, Geist_Mono, Noto_Sans_Bengali } from "next/font/google";
import Navbar from "@/components/Navbar";
import ThemeInit from "@/components/ThemeInit";
import { LanguageProvider } from "@/components/LanguageProvider";
import "../styles/globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const bnFont = Noto_Sans_Bengali({
  variable: "--font-bn",
  subsets: ["bengali", "latin"],
});

export const metadata: Metadata = {
  title: "rooted.BD | Social Development Events",
  description:
    "Find tree drives, river cleanups and community events near you across Bangladesh.",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html
      lang="en"
      data-scroll-behavior="smooth"
      suppressHydrationWarning
      className={`${geistSans.variable} ${geistMono.variable} ${bnFont.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <LanguageProvider>
          <ThemeInit />
          <Navbar />
          {children}
        </LanguageProvider>
      </body>
    </html>
  );
}