"use client";

import { useEffect, useRef, useState, type KeyboardEvent } from "react";
import gsap from "gsap";

import { TagList } from "@/components/tag-list";
import { cn } from "@/lib/utils";

type ProjectCardProps = {
  name: string;
  context: string;
  role: string;
  description: string;
  stack: string[];
  bullets: string[];
  link?: string;
  compact?: boolean;
};

export function ProjectCard({
  name,
  context,
  role,
  description,
  stack,
  bullets,
  link,
  compact = false,
}: ProjectCardProps) {
  const [expanded, setExpanded] = useState(false);
  const bulletsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = bulletsRef.current;
    if (!el) return;
    gsap.to(el, {
      height: expanded ? "auto" : 0,
      opacity: expanded ? 1 : 0,
      duration: 0.5,
      ease: "power2.out",
    });
  }, [expanded]);

  const toggle = () => setExpanded((prev) => !prev);

  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      toggle();
    }
  };

  const hasBullets = bullets.length > 0;

  return (
    <div className="flex flex-col gap-3">
      <div
        className={cn(
          "meta flex gap-x-6 gap-y-1",
          compact ? "flex-col" : "flex-wrap items-baseline justify-between",
        )}
      >
        <span>{context}</span>
        <span>{role}</span>
      </div>

      <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-2">
        <h3
          className={cn(
            "leading-tight",
            compact ? "text-lg" : "text-2xl sm:text-3xl",
          )}
        >
          {name}
        </h3>
        {link && (
          <a
            href={link}
            target="_blank"
            rel="noopener noreferrer"
            className="external-link"
          >
            Visit site
            <span aria-hidden>↗</span>
          </a>
        )}
      </div>

      <div className={cn("flex flex-col", !compact && "pt-3")}>
        {hasBullets ? (
          <div
            role="button"
            tabIndex={0}
            aria-expanded={expanded}
            onClick={toggle}
            onKeyDown={handleKeyDown}
            className="group/desc flex cursor-pointer flex-col gap-3 outline-none focus-visible:ring-2 focus-visible:ring-foreground/30"
          >
            <p
              className={cn(
                "font-normal",
                "body-copy",
                !compact && "max-w-[520px]",
              )}
            >
              {description}
            </p>
            <span className="text-xs text-foreground/50 transition-colors group-hover/desc:text-foreground">
              {expanded ? "− Hide my contributions" : "+ Show my contributions"}
            </span>
          </div>
        ) : (
          <p
            className={cn(
              "font-normal",
              "body-copy",
              !compact && "max-w-[520px]",
            )}
          >
            {description}
          </p>
        )}

        {hasBullets && (
          <div
            ref={bulletsRef}
            className="overflow-hidden"
            style={{ height: 0, opacity: 0 }}
          >
            <ul
              className={cn("flex flex-col gap-3", compact ? "pt-4" : "pt-6")}
            >
              {bullets.map((bullet) => (
                <li
                  key={bullet}
                  className={cn(
                    "font-light",
                    "body-copy",
                    !compact && "max-w-[520px]",
                  )}
                >
                  {bullet}
                </li>
              ))}
            </ul>
          </div>
        )}

        <TagList items={stack} className={compact ? "pt-4" : "pt-6"} />
      </div>
    </div>
  );
}
