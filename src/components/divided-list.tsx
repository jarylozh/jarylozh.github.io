import { type ReactNode } from "react";

import { FadeIn } from "@/components/fade-in";
import { cn } from "@/lib/utils";

/** Stacks entries between hairline rules, closed off at the bottom. */
export function DividedList({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      className={cn("flex flex-col border-b border-foreground/15", className)}
      {...props}
    />
  );
}

/** One `DividedList` entry, fading in as it scrolls into view. */
export function DividedItem({
  className,
  children,
}: {
  className?: string;
  children: ReactNode;
}) {
  return (
    <FadeIn
      className={cn("border-t border-foreground/15 py-6 sm:py-8", className)}
    >
      {children}
    </FadeIn>
  );
}
