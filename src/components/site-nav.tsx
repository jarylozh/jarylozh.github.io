"use client";

import { type MouseEvent } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import gsap from "gsap";
import { ScrollToPlugin } from "gsap/ScrollToPlugin";

import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import { pageGutter } from "@/components/section";
import { cn } from "@/lib/utils";

gsap.registerPlugin(ScrollToPlugin);

export type NavItem = {
  label: string;
  href: string;
};

export type NavMenu = {
  label: string;
  items: NavItem[];
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

const panelLinkClassName = "px-3 py-2 hover:bg-muted hover:no-underline";

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

/** Scrolls when the hash belongs to the open page, routes when it does not. */
function NavLink({
  item,
  pathname,
  className,
}: {
  item: NavItem;
  pathname: string;
  className?: string;
}) {
  const [path, hash] = item.href.split("#");
  const onThisPage =
    Boolean(hash) &&
    (path === "" || normalisePath(path) === normalisePath(pathname));

  return (
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
      className={cn(linkClassName, className)}
    >
      {item.label}
    </NavigationMenuLink>
  );
}

export function SiteNav({
  items = portfolioSections,
  menu,
}: {
  items?: NavItem[];
  menu?: NavMenu;
}) {
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
            {menu ? (
              <NavigationMenuItem>
                <NavigationMenuTrigger className={linkClassName}>
                  {menu.label}
                </NavigationMenuTrigger>
                <NavigationMenuContent className="flex w-44 flex-col">
                  {menu.items.map((item) => (
                    <NavLink
                      key={item.href}
                      item={item}
                      pathname={pathname}
                      className={panelLinkClassName}
                    />
                  ))}
                </NavigationMenuContent>
              </NavigationMenuItem>
            ) : (
              items.map((item) => (
                <NavigationMenuItem key={item.href}>
                  <NavLink item={item} pathname={pathname} />
                </NavigationMenuItem>
              ))
            )}
          </NavigationMenuList>
        </NavigationMenu>
      </div>
    </header>
  );
}
