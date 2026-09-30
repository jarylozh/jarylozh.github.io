import { cn } from "./lib/utils.js";

/** Flows body copy into balanced columns, collapsing to one on small screens. */
export function Columns({
  count = 2,
  className,
  ...props
}: React.ComponentProps<"div"> & { count?: 2 | 3 }) {
  return (
    <div
      data-slot="columns"
      className={cn(
        "gap-x-10 [&>*]:max-w-none [&>*]:break-inside-avoid",
        count === 3 ? "sm:columns-2 lg:columns-3" : "sm:columns-2",
        className,
      )}
      {...props}
    />
  );
}
