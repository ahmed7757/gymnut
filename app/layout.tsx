import type { Metadata } from "next";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner"

export const metadata: Metadata = {
  title: "GymNut - Your Fitness Companion",
  description: "Track workouts, monitor progress, and achieve your fitness goals with GymNut.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={``}
      >
        <main>
          {children}
        </main>
        <Toaster />
      </body>
    </html>
  );
}
