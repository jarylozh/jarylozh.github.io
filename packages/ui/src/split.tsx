import { type ReactNode } from "react";

import { cn } from "./lib/utils.js";

/** Full-width band pairing edge-to-edge media with an inset text column. */
export function Split({
  media,
  side = "start",
  className,
  children,
  ...props
}: React.ComponentProps<"div"> & {
  media: ReactNode;
  side?: "start" | "end";
}) {
  return (
    <div
      data-slot="split"
      className={cn(
        "grid w-full grid-cols-1 items-center gap-10 md:grid-cols-[1.15fr_1fr] md:gap-0",
        className,
      )}
      {...props}
    >
      <div className={cn("relative w-full", side === "end" && "md:order-last")}>
        {media}
      </div>

      <div
        className={cn(
          "flex w-full max-w-[34rem] flex-col gap-6 px-5 sm:px-8 md:py-16 lg:gap-8",
          side === "end"
            ? "md:justify-self-end md:pr-12 md:pl-0 lg:pr-24"
            : "md:pr-0 md:pl-12 lg:pl-24",
        )}
      >
        {children}
      </div>
    </div>
  );
}
