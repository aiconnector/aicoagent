// "use client"

import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { ContextProvider } from "../context/context";
import { SessionProvider } from "next-auth/react";
import { ThemeProvider } from "next-themes";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "Search app",
  description: "Google Search",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
          <SessionProvider>
            <ContextProvider>
              {children}
            </ContextProvider>
          </SessionProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
