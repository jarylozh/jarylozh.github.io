import { cn } from "@/lib/utils";

/** Renders labels as bordered chips. Returns null when there are none. */
export function TagList({
  items,
  className,
}: {
  items: string[];
  className?: string;
}) {
  if (items.length === 0) return null;

  return (
    <div className={cn("flex flex-wrap gap-2", className)}>
      {items.map((item) => (
        <span
          key={item}
          className="border border-foreground/15 px-3 py-1 text-xs text-foreground/70"
        >
          {item}
        </span>
      ))}
    </div>
  );
}
