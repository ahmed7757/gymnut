import type { Metadata } from "next";
import { Inter, Outfit } from "next/font/google";
import { Toaster } from "sonner";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" });
const outfit = Outfit({ subsets: ["latin"], variable: "--font-heading" });

export const metadata: Metadata = {
  title: "GymNut - AI Fitness Tracker",
  description: "Your personal AI-powered fitness and nutrition companion",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} ${outfit.variable} font-sans antialiased`}>
        <div className="relative h-full w-full bg-background">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(37,106,244,0.15)_0%,rgba(16,22,34,0)_70%)] pointer-events-none"></div>
          <div className="absolute top-20 right-0 w-[500px] h-[500px] bg-primary/5 rounded-full blur-3xl pointer-events-none"></div>
          {children}
          <Toaster richColors position="top-right" />
        </div>
      </body>
    </html>
  );
}
