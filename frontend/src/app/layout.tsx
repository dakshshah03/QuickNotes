import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/context/AuthContext";
import Navbar from "@/components/Navbar";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "QuickNotes",
  description: "An AI Companion for reading",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased       
            h-full flex flex-col
        `}
      >
        <AuthProvider>
          <div className="
            h-[70px]
            flex-shrink-0
          ">
            <Navbar />
          </div>
          <main className="flex-1 flex flex-col min-h-0
          ">
            {children}
          </main>
        </AuthProvider>
      </body>
    </html>
  );
}
