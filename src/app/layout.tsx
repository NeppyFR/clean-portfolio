import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import { site } from "@/content";
import "./globals.css";

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
    <html lang="en" className={inter.variable}>
      <body>{children}</body>
    </html>
  );
}
