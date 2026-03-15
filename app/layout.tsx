import type { Metadata } from "next";
import { Playfair_Display, Outfit } from "next/font/google";
import "./globals.css";

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
});

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-outfit",
});

export const metadata: Metadata = {
  title: "The Price of a Life",
  description: "Guess the legal settlement. Discover your bias in human valuation.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="bg-black text-white">
      <body
        className={`${playfair.variable} ${outfit.variable} font-sans antialiased bg-black text-white relative overflow-x-hidden`}
      >
        <div className="fixed inset-0 pointer-events-none z-50 opacity-[0.03] noise-bg"></div>
        {children}
      </body>
    </html>
  );
}
