import type { Metadata } from "next";
import Image from "next/image";

import { FadeIn } from "@/components/fade-in";
import { Section, SectionHeading } from "@/components/section";
import { BodyText } from "@/components/typography";
import { portfolio } from "@/lib/portfolio";

export const metadata: Metadata = {
  title: "PROJECTS",
  description: "Every project Jaryl Ong has built, with a link to each one.",
};

const { projects } = portfolio;

const PLACEHOLDER = "/previews/placeholder.svg";

export default function Projects() {
  return (
    <Section id="projects">
      <SectionHeading
        as="h1"
        description="Every project, each one opening the live site or its repository."
      >
        All Projects
      </SectionHeading>

      <div className="grid gap-6 sm:grid-cols-2">
        {projects.map((project) => (
          <FadeIn key={project.id}>
            <a
              href={project.link}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex h-full flex-col gap-5"
            >
              <div className="relative aspect-[4/3] w-full overflow-hidden bg-muted transition-opacity duration-500 ease-out group-hover:opacity-80">
                <Image
                  src={project.preview ?? PLACEHOLDER}
                  alt={project.preview ? `${project.name} screenshot` : ""}
                  fill
                  sizes="(min-width: 1024px) 512px, (min-width: 640px) 50vw, 100vw"
                  className="object-contain p-8"
                />
              </div>

              <div className="flex flex-col gap-3">
                <h2 className="font-sans text-sm tracking-[0.15em] text-foreground">
                  {project.name}
                </h2>
                <BodyText measure={false}>{project.description}</BodyText>
              </div>
            </a>
          </FadeIn>
        ))}
      </div>
    </Section>
  );
}
