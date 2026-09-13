import { type ReactNode } from "react";

import { FadeIn } from "@/components/fade-in";
import { BodyText, Eyebrow } from "@/components/typography";
import { cn } from "@/lib/utils";

/** Opening block of a page: eyebrow, display title, summary, actions, aside. */
export function PageHero({
  title,
  eyebrow,
  summary,
  actions,
  aside,
  className,
}: {
  title: ReactNode;
  eyebrow?: string[];
  summary?: ReactNode;
  actions?: ReactNode;
  aside?: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "flex flex-col items-center gap-8 sm:flex-row sm:items-center sm:justify-between sm:gap-12",
        className,
      )}
    >
      <FadeIn
        stagger={0.12}
        className="order-last flex min-w-0 flex-col items-center gap-6 text-center sm:order-first sm:items-start sm:gap-8 sm:text-left"
      >
        {eyebrow && (
          <Eyebrow items={eyebrow} className="justify-center sm:justify-start" />
        )}

        <h1 className="text-5xl leading-[0.9] sm:text-7xl md:text-8xl lg:text-9xl">
          {title}
        </h1>

        {summary && <BodyText>{summary}</BodyText>}

        {actions && (
          <div className="flex flex-wrap justify-center gap-3 sm:justify-start">
            {actions}
          </div>
        )}
      </FadeIn>

      {aside && (
        <FadeIn className="order-first shrink-0 sm:order-last">{aside}</FadeIn>
      )}
    </div>
  );
}
