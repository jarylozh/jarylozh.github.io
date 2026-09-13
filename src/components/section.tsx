import { type ReactNode } from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { FadeIn } from "@/components/fade-in";
import { BodyText, Eyebrow } from "@/components/typography";
import { cn } from "@/lib/utils";

/** Horizontal gutters shared by every full-width band on the site. */
export const pageGutter = "px-5 sm:px-8 md:px-12 lg:px-24";

const sectionVariants = cva(pageGutter, {
  variants: {
    variant: {
      default: "py-20 sm:py-28 lg:py-32",
      hero: "flex min-h-screen flex-col justify-center py-20 md:py-24",
    },
  },
  defaultVariants: {
    variant: "default",
  },
});

/** Centers content at the page measure and stacks it on the section rhythm. */
export function Container({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      className={cn(
        "mx-auto flex w-full max-w-5xl flex-col gap-10 sm:gap-12",
        className,
      )}
      {...props}
    />
  );
}

/** Page band carrying the shared gutters, vertical rhythm, and container. */
export function Section({
  variant,
  className,
  containerClassName,
  children,
  ...props
}: React.ComponentProps<"section"> &
  VariantProps<typeof sectionVariants> & {
    containerClassName?: string;
  }) {
  return (
    <section className={cn(sectionVariants({ variant }), className)} {...props}>
      <Container className={containerClassName}>{children}</Container>
    </section>
  );
}

/** Display heading for a section, with an optional eyebrow and standfirst. */
export function SectionHeading({
  children,
  as: Tag = "h2",
  eyebrow,
  description,
  className,
}: {
  children: ReactNode;
  as?: "h1" | "h2";
  eyebrow?: string[];
  description?: ReactNode;
  className?: string;
}) {
  return (
    <FadeIn className={cn("flex flex-col gap-3 sm:gap-4", className)}>
      {eyebrow && <Eyebrow items={eyebrow} />}
      <Tag className="text-4xl leading-[0.95] sm:text-6xl md:text-7xl lg:text-8xl">
        {children}
      </Tag>
      {description && <BodyText>{description}</BodyText>}
    </FadeIn>
  );
}
