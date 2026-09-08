"use client";

import { useEffect, useRef, useState, type KeyboardEvent } from "react";
import gsap from "gsap";

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
    <div
      className={cn(
        "grid grid-cols-1",
        compact ? "gap-4" : "gap-6 sm:gap-8 md:grid-cols-12",
      )}
    >
      <div className={cn("flex flex-col gap-2", !compact && "md:col-span-4")}>
        <h3
          className={cn(
            "leading-tight",
            compact ? "text-lg" : "text-2xl sm:text-3xl",
          )}
        >
          {name}
        </h3>
        <span className="text-xs text-foreground/60">{context}</span>
        <span className="text-xs text-foreground/50">{role}</span>
        {link && (
          <a
            href={link}
            target="_blank"
            rel="noopener noreferrer"
            className="external-link mt-2"
          >
            {name}
            <span aria-hidden>↗</span>
          </a>
        )}
      </div>

      <div className={cn("flex flex-col", !compact && "md:col-span-8")}>
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
                "font-normal leading-relaxed text-foreground",
                compact ? "text-sm" : "text-sm sm:text-base",
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
              "font-normal leading-relaxed text-foreground",
              compact ? "text-sm" : "text-sm sm:text-base",
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
                    "font-light leading-relaxed text-foreground",
                    compact ? "text-sm" : "text-sm sm:text-base",
                  )}
                >
                  {bullet}
                </li>
              ))}
            </ul>
          </div>
        )}

        <div className={cn("flex flex-wrap gap-2", compact ? "pt-4" : "pt-6")}>
          {stack.map((tech) => (
            <span
              key={tech}
              className="border border-foreground/15 px-3 py-1 text-xs text-foreground/70"
            >
              {tech}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
