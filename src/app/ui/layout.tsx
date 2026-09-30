import type { Metadata } from "next";

import { SiteFooter } from "@/components/site-footer";

export const metadata: Metadata = {
  title: "COMPONENTS",
  description:
    "Every component in the jarylozh.github.io library, with its variants.",
};

export default function UiLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      {children}
      <SiteFooter />
    </>
  );
}
