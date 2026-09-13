import { Fragment } from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

/** Mono label row with dot separators. Returns null when there are no items. */
export function Eyebrow({
  items,
  className,
}: {
  items: string[];
  className?: string;
}) {
  if (items.length === 0) return null;

  return (
    <div
      className={cn(
        "flex flex-wrap items-center gap-x-3 gap-y-1 eyebrow",
        className,
      )}
    >
      {items.map((item, index) => (
        <Fragment key={item}>
          {index > 0 && (
            <span
              aria-hidden
              className="size-[3px] rounded-full bg-muted-foreground"
            />
          )}
          <span>{item}</span>
        </Fragment>
      ))}
    </div>
  );
}

/** Row of uppercase labels, spread apart on one line or stacked. */
export function MetaRow({
  stacked = false,
  className,
  ...props
}: React.ComponentProps<"div"> & { stacked?: boolean }) {
  return (
    <div
      className={cn(
        "meta flex gap-x-6 gap-y-1",
        stacked ? "flex-col" : "flex-wrap items-baseline justify-between",
        className,
      )}
      {...props}
    />
  );
}

// tailwind-merge drops a leading-* class placed before a text size.
const entryTitleVariants = cva("", {
  variants: {
    size: {
      lg: "text-2xl leading-tight sm:text-3xl",
      md: "text-xl leading-tight sm:text-2xl",
      sm: "text-lg leading-tight",
    },
  },
  defaultVariants: {
    size: "lg",
  },
});

/** Heading for a single entry in a list. */
export function EntryTitle({
  as: Tag = "h3",
  size,
  className,
  ...props
}: React.HTMLAttributes<HTMLHeadingElement> &
  VariantProps<typeof entryTitleVariants> & {
    as?: "h2" | "h3" | "h4";
  }) {
  return (
    <Tag className={cn(entryTitleVariants({ size }), className)} {...props} />
  );
}

/** Body copy at the reading size, capped to the reading measure. */
export function BodyText({
  as: Tag = "p",
  measure = true,
  className,
  ...props
}: React.HTMLAttributes<HTMLElement> & {
  as?: "p" | "li" | "span" | "div";
  measure?: boolean;
}) {
  return (
    <Tag
      className={cn(
        "body-copy font-normal",
        measure && "max-w-[520px]",
        className,
      )}
      {...props}
    />
  );
}

/** Anchor to another site, suffixed with an arrow glyph. */
export function ExternalLink({
  className,
  children,
  ...props
}: React.ComponentProps<"a">) {
  return (
    <a
      target="_blank"
      rel="noopener noreferrer"
      className={cn("external-link", className)}
      {...props}
    >
      {children}
      <span aria-hidden>↗</span>
    </a>
  );
}
