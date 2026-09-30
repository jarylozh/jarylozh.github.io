import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "./lib/utils.js";

const tagVariants = cva("inline-flex items-center border px-3 py-1 text-xs", {
  variants: {
    variant: {
      default: "border-foreground/15 text-foreground/70",
      solid: "border-foreground bg-foreground text-background",
    },
  },
  defaultVariants: {
    variant: "default",
  },
});

/** Bordered chip carrying one label. */
export function Tag({
  variant,
  className,
  ...props
}: React.ComponentProps<"span"> & VariantProps<typeof tagVariants>) {
  return (
    <span
      data-slot="tag"
      className={cn(tagVariants({ variant }), className)}
      {...props}
    />
  );
}

/** Chip that inverts on hover and reports a press. */
export function TagButton({
  variant,
  className,
  ...props
}: React.ComponentProps<"button"> & VariantProps<typeof tagVariants>) {
  return (
    <button
      type="button"
      data-slot="tag-button"
      className={cn(
        tagVariants({ variant }),
        "font-normal transition-colors outline-none hover:border-foreground hover:bg-foreground hover:text-background focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 disabled:pointer-events-none disabled:opacity-50",
        className,
      )}
      {...props}
    />
  );
}

/** Renders labels as chips. Returns null when there are none. */
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
        <Tag key={item}>{item}</Tag>
      ))}
    </div>
  );
}
