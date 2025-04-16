// app/layout.tsx
import type React from "react";
import "@/app/globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import Header from "@/components/header";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Toaster } from "@/components/ui/sonner"; // Import Sonner Toaster

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Minimalistic Journal",
  description: "Minimalistic Journal",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${inter.className} bg-zinc-50 text-zinc-900 dark:bg-zinc-900 dark:text-zinc-50 min-h-screen`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <Header />
          {children}
          <Toaster richColors position="top-right" /> {/* Add Toaster here */}
        </ThemeProvider>
      </body>
    </html>
  );
}
