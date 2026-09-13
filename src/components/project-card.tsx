"use client";

import { useEffect, useRef, useState, type KeyboardEvent } from "react";
import gsap from "gsap";

import { TagList } from "@/components/tag-list";
import {
  BodyText,
  EntryTitle,
  ExternalLink,
  MetaRow,
} from "@/components/typography";
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
      <MetaRow stacked={compact}>
        <span>{context}</span>
        <span>{role}</span>
      </MetaRow>

      <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-2">
        <EntryTitle size={compact ? "sm" : "lg"}>{name}</EntryTitle>
        {link && <ExternalLink href={link}>Visit site</ExternalLink>}
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
            <BodyText measure={!compact}>{description}</BodyText>
            <span className="text-xs text-foreground/50 transition-colors group-hover/desc:text-foreground">
              {expanded ? "− Hide my contributions" : "+ Show my contributions"}
            </span>
          </div>
        ) : (
          <BodyText measure={!compact}>{description}</BodyText>
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
                <BodyText
                  key={bullet}
                  as="li"
                  measure={!compact}
                  className="font-light"
                >
                  {bullet}
                </BodyText>
              ))}
            </ul>
          </div>
        )}

        <TagList items={stack} className={compact ? "pt-4" : "pt-6"} />
      </div>
    </div>
  );
}
