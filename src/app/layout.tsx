import type { Metadata } from "next";
import { Inter, Bebas_Neue, Space_Mono } from "next/font/google";
import { cn } from "@/lib/utils";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const bebasNeue = Bebas_Neue({
  variable: "--font-bebas",
  weight: "400",
  subsets: ["latin"],
});

const spaceMono = Space_Mono({
  variable: "--font-space-mono",
  weight: "400",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "JARYL ONG · SOFTWARE ENGINEER",
    template: "%s · JARYL ONG",
  },
  description:
    "Software engineer and solution architect in Singapore, working with Go, TypeScript, and AWS.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={cn(
        "h-full antialiased",
        inter.variable,
        bebasNeue.variable,
        spaceMono.variable,
      )}
    >
      <body className="min-h-full flex flex-col">
        {children}
      </body>
    </html>
  );
}
