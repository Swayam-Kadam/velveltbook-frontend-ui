import type { Metadata } from "next";
import "./globals.css";
import { Cormorant_Garamond, Poppins } from "next/font/google";
import { Providers } from "./providers";
import { Header } from "./components/header/Header";
import { BottomNavigation } from "./components/navigation/mobile/BottomNavigation";

export const headingFont = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-heading",
});


export const bodyFont = Poppins({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-body",
});

export const metadata: Metadata = {
  title: "VelvetBook",
  description: "Wellness & beauty booking platform",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${headingFont.variable} ${bodyFont.variable} bg-(--bg-primary) min-h-screen antialiased`}
      >
        <Providers>
          <Header />
          {children}
          <BottomNavigation />
        </Providers>
      </body>
    </html>
  );
}
