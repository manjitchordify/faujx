import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Analytics } from "@vercel/analytics/next";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "FaujX – Global Talent Acceleration Platform",
  description:
    "FaujX connects vetted, job-ready junior software engineers with top tech companies across India, the U.S., Europe, Canada, and Singapore. Combining AI-powered assessments, expert interviews, and LMS-based upskilling, it ensures a high-quality talent match.",
  keywords: [
    "FaujX",
    "talent acceleration",
    "junior software engineers",
    "tech hiring",
    "AI-powered assessment",
    "expert interview",
    "LMS upskilling",
    "recruitment platform",
    "India tech jobs",
    "global hiring",
    "Foundation Engineers",
    "vetted talent",
  ],
  authors: [{ name: "FaujX" }],
  category: "Technology / Recruitment / EdTech",
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
      </body>
    </html>
  );
}
