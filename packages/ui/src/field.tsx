import { MetaRow } from "./typography.js";
import { cn } from "./lib/utils.js";

/** Stacks a label row, a control, and a message on the field rhythm. */
export function Field({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="field"
      className={cn("flex flex-col gap-3", className)}
      {...props}
    />
  );
}

/** Label row for a field, spreading the label and hint apart. */
export function FieldHeader({ className, ...props }: React.ComponentProps<"div">) {
  return <MetaRow data-slot="field-header" className={className} {...props} />;
}

/** Caption bound to a control by `htmlFor`. */
export function FieldLabel({
  className,
  ...props
}: React.ComponentProps<"label">) {
  return (
    <label
      data-slot="field-label"
      className={cn("text-foreground", className)}
      {...props}
    />
  );
}

/** Secondary caption sitting opposite the label. */
export function FieldHint({ className, ...props }: React.ComponentProps<"span">) {
  return <span data-slot="field-hint" className={className} {...props} />;
}

/** Validation message for a field. Returns null when there is no message. */
export function FieldError({
  children,
  className,
  ...props
}: React.ComponentProps<"p">) {
  if (!children) return null;

  return (
    <p
      data-slot="field-error"
      role="alert"
      className={cn("meta text-destructive", className)}
      {...props}
    >
      {children}
    </p>
  );
}
