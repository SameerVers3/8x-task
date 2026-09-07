import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ProvidersWrapper } from "./components/providers-wrapper";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Fluid — Create anything you imagine",
  description:
    "Create breathtaking images and videos with AI. No expertise needed. Powered by Fluid.",
  keywords: [
    "AI art",
    "image generation",
    "video generation",
    "AI creative",
    "Fluid",
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.variable} antialiased`} suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500;700&family=Space+Grotesk:wght@300;400;500;600;700&family=VT323&family=Nunito:wght@300;400;500;600;700;800&family=Comic+Neue:wght@300;400;700&family=Merriweather:wght@300;400;700&family=Playfair+Display:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-dvh flex flex-col bg-[var(--theme-bg)] text-[var(--theme-fg)] transition-colors duration-300">
        <ProvidersWrapper>{children}</ProvidersWrapper>
      </body>
    </html>
  );
}
