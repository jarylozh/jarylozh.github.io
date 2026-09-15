import type { Metadata } from "next";
import { type ReactNode } from "react";
import Image from "next/image";
import Link from "next/link";

import { FadeIn } from "@/components/fade-in";
import { Section, SectionHeading } from "@/components/section";
import { SiteNav } from "@/components/site-nav";
import { BodyText } from "@/components/typography";
import { portfolio } from "@/lib/portfolio";

export const metadata: Metadata = {
  title: "PROJECTS",
  description: "Every project Jaryl Ong has built, with a link to each one.",
};

const { projects } = portfolio;

const PLACEHOLDER = "/previews/placeholder.svg";

const CARD = "group flex h-full flex-col gap-5";

const PAGES = {
  label: "Projects",
  items: [
    { label: "Home", href: "/" },
    { label: "Portfolio", href: "/portfolio" },
    { label: "Projects", href: "/portfolio/projects" },
  ],
};

/** Wraps a card in a route link when the project lives on this site. */
function CardLink({ href, children }: { href: string; children: ReactNode }) {
  if (href.startsWith("/")) {
    return (
      <Link href={href} className={CARD}>
        {children}
      </Link>
    );
  }

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={CARD}
    >
      {children}
    </a>
  );
}

export default function Projects() {
  return (
    <>
      <SiteNav menu={PAGES} />

      <Section id="projects">
        <SectionHeading
          as="h1"
          description="Everything I have built, each card opening the project."
        >
          All Projects
        </SectionHeading>

        <div className="grid gap-6 px-6 sm:grid-cols-2 sm:px-0 lg:grid-cols-3">
          {projects.map((project) => (
            <FadeIn key={project.id}>
              <CardLink href={project.link}>
                <div className="relative aspect-[4/3] w-full overflow-hidden bg-muted transition-opacity duration-500 ease-out group-hover:opacity-80">
                  <Image
                    src={project.preview ?? PLACEHOLDER}
                    alt=""
                    fill
                    sizes="(min-width: 1024px) 341px, (min-width: 640px) 50vw, 100vw"
                    className="object-contain p-8"
                  />
                </div>

                <div className="flex flex-col gap-3">
                  <h2 className="font-sans text-sm tracking-[0.15em] text-foreground">
                    {project.name}
                  </h2>
                  <BodyText measure={false}>{project.description}</BodyText>
                </div>
              </CardLink>
            </FadeIn>
          ))}
        </div>
      </Section>
    </>
  );
}
