import { cn } from "./lib/utils.js";

function Input({ className, ...props }: React.ComponentProps<"input">) {
  return (
    <input
      data-slot="input"
      className={cn(
        "flex h-9 w-full rounded-none border border-foreground/20 bg-transparent px-3 py-2 font-mono text-xs leading-[1.8] text-foreground transition-colors outline-none placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 disabled:pointer-events-none disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20 file:mr-3 file:border-0 file:bg-transparent file:p-0 file:font-mono file:text-xs file:text-foreground",
        className,
      )}
      {...props}
    />
  );
}

export { Input };
