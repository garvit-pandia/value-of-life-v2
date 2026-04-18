import type { Metadata } from "next";
import { Playfair_Display, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { GameProvider } from "@/lib/GameContext";
import { AudioProvider } from "@/lib/AudioProvider";

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
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
    <html lang="en" className="bg-[#050505] text-parchment" suppressHydrationWarning>
      <body
        className={`${playfair.variable} ${jetbrainsMono.variable} font-sans antialiased bg-[#050505] text-parchment relative overflow-x-hidden selection:bg-parchment selection:text-black`}
      >
        <AudioProvider>
          <GameProvider>
            {/* CRT / Document Noise Overlay */}
            <div className="fixed inset-0 pointer-events-none z-50 opacity-[0.06] noise-bg mix-blend-overlay"></div>
            {children}
          </GameProvider>
        </AudioProvider>
      </body>
    </html>
  );
}
