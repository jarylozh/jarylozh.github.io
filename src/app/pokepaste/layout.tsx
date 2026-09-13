import type { Metadata } from "next";

import { SiteFooter } from "@/components/site-footer";

export const metadata: Metadata = {
  title: "POKEPASTE | CONVERTER",
  description: "Turn a Pokepaste team export into EV spreads.",
};

export default function PokepasteLayout({
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
