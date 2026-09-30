import { cn } from "./lib/utils.js";

/** Anchor to another site, opened in a new tab. */
export function ExternalLink({
  className,
  ...props
}: React.ComponentProps<"a">) {
  return (
    <a
      target="_blank"
      rel="noopener noreferrer"
      className={cn("external-link", className)}
      {...props}
    />
  );
}
