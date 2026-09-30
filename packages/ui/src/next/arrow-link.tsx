import Link from "next/link";

import { cn } from "../lib/utils.js";

/** Route link closed with a trailing arrow. */
export function ArrowLink({
  newTab = false,
  className,
  children,
  ...props
}: React.ComponentProps<typeof Link> & { newTab?: boolean }) {
  return (
    <Link
      className={cn("external-link", className)}
      {...(newTab ? { target: "_blank", rel: "noopener noreferrer" } : {})}
      {...props}
    >
      {children} <span aria-hidden>&rarr;</span>
    </Link>
  );
}
