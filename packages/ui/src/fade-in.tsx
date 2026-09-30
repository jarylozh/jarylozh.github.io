"use client";

import { useRef, type ReactNode } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger, useGSAP);

type FadeInProps = {
  children: ReactNode;
  className?: string;
  delay?: number;
  y?: number;
  duration?: number;
  stagger?: number;
  as?: "div" | "section" | "article";
};

export function FadeIn({
  children,
  className,
  delay = 0,
  y = 24,
  duration = 0.9,
  stagger,
  as: Tag = "div",
}: FadeInProps) {
  const ref = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const target = ref.current;
      if (!target) return;

      const targets = stagger ? target.children : target;

      gsap.from(targets, {
        opacity: 0,
        y,
        duration,
        delay,
        ease: "power3.out",
        stagger,
        scrollTrigger: {
          trigger: target,
          start: "top 88%",
          toggleActions: "play none none none",
        },
      });
    },
    { scope: ref }
  );

  return (
    <Tag ref={ref as never} className={className}>
      {children}
    </Tag>
  );
}
