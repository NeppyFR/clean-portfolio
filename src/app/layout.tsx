import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import { content } from "@/content";
import { LanguageProvider } from "@/i18n";
import "./globals.css";

const site = content.en.site;

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: `${site.name} — ${site.role}`,
  description: `${site.name}, ${site.role} based ${site.location}. Building thoughtful applications that solve real problems.`,
  openGraph: {
    title: `${site.name} — ${site.role}`,
    description: `${site.role} based ${site.location}.`,
    type: "website",
  },
};

export const viewport: Viewport = {
  themeColor: "#08080a",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    // lang is updated client-side by LanguageProvider when the user switches.
    <html lang="en" className={inter.variable}>
      <body>
        <LanguageProvider>{children}</LanguageProvider>
      </body>
    </html>
  );
}
