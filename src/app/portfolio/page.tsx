import type { Metadata } from "next";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { DividedItem, DividedList } from "@/components/divided-list";
import { FadeIn } from "@/components/fade-in";
import { PageHero } from "@/components/page-hero";
import { ProjectCard } from "@/components/project-card";
import { Section, SectionHeading } from "@/components/section";
import { StatGrid } from "@/components/stat-grid";
import { TagList } from "@/components/tag-list";
import {
  BodyText,
  EntryTitle,
  ExternalLink,
  MetaRow,
} from "@/components/typography";
import { portfolio, type Education } from "@/lib/portfolio";

export const metadata: Metadata = {
  title: "PORTFOLIO",
  description:
    "Experience, projects, education, and certifications for Jaryl Ong.",
};

const { profile, skills, experience, education, certifications, projects } =
  portfolio;

const AVATAR_W = 896;
const AVATAR_H = 864;

/** Counts the graduate certificates an entry has finished. */
function countCompleted(entry: Education) {
  return entry.certificates.filter(
    (certificate) => certificate.status === "Completed",
  ).length;
}

export default function Home() {
  const yearsOfExperience = new Date().getFullYear() - profile.careerStartYear;

  return (
    <>
      <Section id="hero" variant="hero">
        <PageHero
          eyebrow={[profile.title, profile.location]}
          title={profile.name}
          summary={profile.summary}
          actions={
            <>
              <Button
                size="lg"
                nativeButton={false}
                render={<a href={`mailto:${profile.links.email}`} />}
              >
                Get in touch
              </Button>
              <Button
                size="lg"
                variant="outline"
                nativeButton={false}
                render={
                  <a
                    href={profile.links.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                  />
                }
              >
                LinkedIn
              </Button>
              <Button
                size="lg"
                variant="outline"
                nativeButton={false}
                render={
                  <a
                    href={profile.links.resume}
                    target="_blank"
                    rel="noopener noreferrer"
                  />
                }
              >
                Resume
              </Button>
            </>
          }
          aside={
            <Image
              src="/avatar.png"
              alt={profile.name}
              width={AVATAR_W}
              height={AVATAR_H}
              priority
              className="h-auto w-32 mask-b-from-80% mask-b-to-100% sm:w-56 lg:w-72"
            />
          }
        />

        <StatGrid
          className="mt-4 sm:mt-8"
          items={[
            ...skills,
            { label: "Experience", value: `${yearsOfExperience}+ Years` },
          ]}
        />
      </Section>

      <Section id="experience">
        <SectionHeading>Professional Experience</SectionHeading>

        {experience.map((job) => (
          <FadeIn
            key={job.company}
            className="grid grid-cols-1 gap-6 sm:gap-8 md:grid-cols-12"
          >
            <div className="flex flex-col gap-2 md:col-span-4">
              <EntryTitle>{job.company}</EntryTitle>
              <span className="text-xs text-foreground/60">{job.location}</span>
              <span className="text-xs text-foreground/50">{job.period}</span>
            </div>

            <div className="flex flex-col gap-8 md:col-span-8 md:gap-10">
              {job.roles.map((role) => (
                <div key={role.title} className="flex flex-col gap-4">
                  <EntryTitle as="h4" size="md">
                    {role.title}
                  </EntryTitle>
                  <ul className="flex flex-col gap-3">
                    {role.bullets.map((bullet) => (
                      <BodyText key={bullet} as="li">
                        {bullet}
                      </BodyText>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </FadeIn>
        ))}
      </Section>

      <Section id="projects">
        <SectionHeading>Selected Projects</SectionHeading>

        <DividedList>
          {projects.map((project) => (
            <DividedItem key={project.name}>
              <ProjectCard {...project} />
            </DividedItem>
          ))}
        </DividedList>
      </Section>

      <Section id="education">
        <SectionHeading>Education</SectionHeading>

        <DividedList>
          {education.map((entry) => (
            <DividedItem
              key={entry.institution}
              className="flex flex-col gap-3"
            >
              <MetaRow>
                <span>{entry.institution}</span>
                <span>{entry.period}</span>
              </MetaRow>

              <EntryTitle>{entry.program}</EntryTitle>

              {entry.certificates.length > 0 && (
                <div className="flex max-w-[560px] flex-col gap-2 pt-3">
                  <span className="meta">
                    Graduate certificates
                    {entry.certificatesRequired &&
                      ` · ${countCompleted(entry)} of ${entry.certificatesRequired} complete`}
                  </span>

                  <ul className="flex flex-col gap-1">
                    {entry.certificates.map((certificate) => (
                      <BodyText
                        key={certificate.name}
                        as="li"
                        measure={false}
                        className="flex items-baseline justify-between gap-x-6"
                      >
                        <span className="min-w-0">{certificate.name}</span>
                        <span className="shrink-0 text-muted-foreground">
                          {certificate.status}
                        </span>
                      </BodyText>
                    ))}
                  </ul>
                </div>
              )}
            </DividedItem>
          ))}
        </DividedList>
      </Section>

      <Section id="certifications">
        <SectionHeading>Certifications</SectionHeading>

        {certifications.length === 0 ? (
          <FadeIn>
            <BodyText measure={false} className="font-light">
              More to come.
            </BodyText>
          </FadeIn>
        ) : (
          <DividedList>
            {certifications.map((cert) => (
              <DividedItem key={cert.name} className="flex flex-col gap-3">
                <MetaRow>
                  <span>{cert.issuer}</span>
                  <span>
                    {cert.period}
                    {cert.expires && ` · Expires ${cert.expires}`}
                  </span>
                </MetaRow>

                <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-2">
                  <EntryTitle>{cert.name}</EntryTitle>
                  {cert.credentialUrl && (
                    <ExternalLink href={cert.credentialUrl}>
                      Verify credential
                    </ExternalLink>
                  )}
                </div>

                {cert.description && (
                  <BodyText className="pt-3">{cert.description}</BodyText>
                )}

                <TagList items={cert.topics} className="pt-3" />
              </DividedItem>
            ))}
          </DividedList>
        )}
      </Section>
    </>
  );
}
