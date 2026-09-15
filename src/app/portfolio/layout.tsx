import { SiteFooter } from "@/components/site-footer";

export default function PortfolioLayout({
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
