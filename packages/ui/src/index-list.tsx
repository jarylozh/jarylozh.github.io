import { type ReactNode } from "react";

import { FadeIn } from "./fade-in.js";
import { BodyText, EntryTitle } from "./typography.js";
import { cn } from "./lib/utils.js";

export type IndexEntry = {
  title: string;
  description: ReactNode;
};

/** Numbered entries between hairline rules. Hovering one dims the rest. */
export function IndexList({
  items,
  className,
}: {
  items: IndexEntry[];
  className?: string;
}) {
  if (items.length === 0) return null;

  return (
    <div
      data-slot="index-list"
      className={cn(
        "group/index-list flex flex-col border-b border-foreground/15",
        className,
      )}
    >
      {items.map((item, index) => (
        <FadeIn key={item.title} className="border-t border-foreground/15">
          <div
            data-slot="index-item"
            className="grid grid-cols-[2rem_1fr] gap-x-4 py-6 transition-opacity duration-500 ease-out group-has-[[data-slot=index-item]:hover]/index-list:not-hover:opacity-35 sm:grid-cols-[3.5rem_1fr] sm:gap-x-6 sm:py-8"
          >
            <span className="meta pt-1 tabular-nums">
              {String(index + 1).padStart(2, "0")}
            </span>

            <div className="flex flex-col gap-2">
              <EntryTitle as="h3" size="sm">
                {item.title}
              </EntryTitle>
              <BodyText>{item.description}</BodyText>
            </div>
          </div>
        </FadeIn>
      ))}
    </div>
  );
}
