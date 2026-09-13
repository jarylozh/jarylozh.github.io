import { type ReactNode } from "react";

import { FadeIn } from "@/components/fade-in";
import { cn } from "@/lib/utils";

export type Stat = {
  label: string;
  value: ReactNode;
};

/** Label and value pairs on a rule-topped grid. Returns null when empty. */
export function StatGrid({
  items,
  className,
}: {
  items: Stat[];
  className?: string;
}) {
  if (items.length === 0) return null;

  return (
    <FadeIn
      className={cn(
        "grid grid-cols-2 gap-x-6 gap-y-4 border-t border-foreground/10 pt-8 text-xs text-foreground/60 sm:grid-cols-4 sm:gap-x-8",
        className,
      )}
    >
      {items.map((item) => (
        <div key={item.label} className="flex flex-col gap-1">
          <span className="meta">{item.label}</span>
          <span className="text-foreground">{item.value}</span>
        </div>
      ))}
    </FadeIn>
  );
}
