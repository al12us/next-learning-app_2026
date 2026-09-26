import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const inter = Inter({
  subsets: ["latin"],
  display: "swap", // Asigură că textul se afișează imediat în timp ce fontul se încarcă
  variable: "--font-inter", // Optional: pentru a o folosi și în CSS la nevoie
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
    <html lang="ro" className={inter.className}>
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
