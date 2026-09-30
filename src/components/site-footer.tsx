import Link from "next/link";

import { cn } from "@/lib/utils";
import { pageGutter } from "@jarylozh/ui";

export function SiteFooter() {
  const year = new Date().getFullYear();

  return (
    <footer className="mt-auto border-t border-foreground/10">
      <div className={cn("py-6", pageGutter)}>
        <div className="mx-auto flex w-full max-w-5xl flex-col items-center justify-between gap-2 text-xs text-foreground/60 sm:flex-row">
          <span>© {year} Jaryl Ong</span>
          <span>
            Built with{" "}
            <Link
              href="/ui"
              className="text-foreground/80 underline-offset-4 hover:underline"
            >
              @jarylozh/ui
            </Link>
          </span>
        </div>
      </div>
    </footer>
  );
}
