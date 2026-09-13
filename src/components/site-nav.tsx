"use client";

import { type MouseEvent } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import gsap from "gsap";
import { ScrollToPlugin } from "gsap/ScrollToPlugin";

import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from "@/components/ui/navigation-menu";
import { pageGutter } from "@/components/section";
import { cn } from "@/lib/utils";

gsap.registerPlugin(ScrollToPlugin);

export type NavItem = {
  label: string;
  href: string;
};

const portfolioSections: NavItem[] = [
  { label: "About", href: "/portfolio#hero" },
  { label: "Experience", href: "/portfolio#experience" },
  { label: "Projects", href: "/portfolio#projects" },
  { label: "Education", href: "/portfolio#education" },
  { label: "Certifications", href: "/portfolio#certifications" },
];

const NAV_OFFSET = 64;

const linkClassName =
  "rounded-none px-1.5 text-[10px] leading-[1.8] tracking-[0.04em] uppercase text-foreground transition-[text-decoration] hover:bg-transparent hover:underline hover:underline-offset-4 focus:bg-transparent sm:px-3 sm:text-[12px] sm:tracking-[0.083em]";

function scrollToHash(hash: string) {
  return (event: MouseEvent<HTMLAnchorElement>) => {
    event.preventDefault();
    const target = document.querySelector(hash);
    if (!target) return;
    gsap.to(window, {
      duration: 1.2,
      scrollTo: { y: target, offsetY: NAV_OFFSET },
      ease: "power2.inOut",
    });
    history.replaceState(null, "", hash);
  };
}

/** Drops the trailing slash so `trailingSlash` routes compare cleanly. */
function normalisePath(path: string) {
  return path.replace(/\/+$/, "") || "/";
}

export function SiteNav({ items = portfolioSections }: { items?: NavItem[] }) {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-50 bg-background">
      <div
        className={cn(
          "mx-auto flex w-full max-w-5xl items-center gap-4 overflow-x-auto py-4",
          pageGutter,
        )}
      >
        <NavigationMenu className="mx-auto w-max">
          <NavigationMenuList className="gap-0 sm:gap-1">
            {items.map((item) => {
              const [path, hash] = item.href.split("#");
              const onThisPage =
                Boolean(hash) &&
                (path === "" ||
                  normalisePath(path) === normalisePath(pathname));

              return (
                <NavigationMenuItem key={item.href}>
                  <NavigationMenuLink
                    render={
                      onThisPage ? (
                        <a
                          className="text-foreground"
                          href={`#${hash}`}
                          onClick={scrollToHash(`#${hash}`)}
                        />
                      ) : (
                        <Link className="text-foreground" href={item.href} />
                      )
                    }
                    className={linkClassName}
                  >
                    {item.label}
                  </NavigationMenuLink>
                </NavigationMenuItem>
              );
            })}
          </NavigationMenuList>
        </NavigationMenu>
      </div>
    </header>
  );
}
