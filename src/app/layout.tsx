import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Next.js 16 Learning Hub | Fullstack App",
  description: "Aplicație completă de învățare Next.js cu Server Components, App Router și API CRUD",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ro" className={`${geistSans.variable} ${geistMono.variable}`}>
      <body>
        <Navbar />
        <div className="page-wrapper">
          {children}
        </div>
        <Footer />
      </body>
    </html>
  );
}
