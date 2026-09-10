import type { Metadata } from "next";
import { Button } from "@/components/ui/button";
import { FadeIn } from "@/components/fade-in";
import { ProjectCard } from "@/components/project-card";
import { portfolio } from "@/lib/portfolio";

export const metadata: Metadata = {
  title: "PORTFOLIO",
  description:
    "Experience, projects, education, and certifications for Jaryl Ong.",
};

const { profile, skills, experience, education, certifications, projects } =
  portfolio;

export default function Home() {
  const yearsOfExperience = new Date().getFullYear() - profile.careerStartYear;

  return (
    <>
      <section
        id="hero"
        className="flex min-h-screen flex-col justify-center px-5 py-20 sm:px-8 md:px-12 md:py-24 lg:px-24"
      >
        <FadeIn
          stagger={0.12}
          className="mx-auto flex w-full max-w-5xl flex-col gap-10 sm:gap-12"
        >
          <div className="flex flex-col items-center gap-4 text-center sm:items-start sm:gap-6 sm:text-left">
            <div className="flex flex-wrap items-center justify-center gap-x-3 gap-y-1 eyebrow sm:justify-start">
              <span>{profile.title}</span>
              <span
                aria-hidden
                className="size-[3px] rounded-full bg-muted-foreground"
              />
              <span>{profile.location}</span>
            </div>
            <h1 className="text-5xl leading-[0.9] sm:text-7xl md:text-8xl lg:text-9xl">
              {profile.name}
            </h1>
          </div>

          <p className="mx-auto max-w-[520px] body-copy text-center font-normal sm:mx-0 sm:text-left">
            {profile.summary}
          </p>

          <div className="flex flex-wrap justify-center gap-3 sm:justify-start">
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
          </div>

          <div className="mt-4 grid grid-cols-2 gap-x-6 gap-y-4 border-t border-foreground/10 pt-8 text-xs text-foreground/60 sm:mt-8 sm:gap-x-8 sm:grid-cols-4">
            {skills.map((skill) => (
              <div key={skill.label} className="flex flex-col gap-1">
                <span className="meta">{skill.label}</span>
                <span className="text-foreground">{skill.value}</span>
              </div>
            ))}
            <div className="flex flex-col gap-1">
              <span className="meta">Experience</span>
              <span className="text-foreground">
                {yearsOfExperience}+ Years
              </span>
            </div>
          </div>
        </FadeIn>
      </section>

      <section
        id="experience"
        className="px-5 py-20 sm:px-8 sm:py-28 md:px-12 lg:px-24 lg:py-32"
      >
        <div className="mx-auto flex w-full max-w-5xl flex-col gap-10 sm:gap-12">
          <FadeIn className="flex flex-col gap-3 sm:gap-4">
            <h2 className="text-4xl leading-[0.95] sm:text-6xl md:text-7xl lg:text-8xl">
              Professional Experience
            </h2>
          </FadeIn>

          {experience.map((job) => (
            <FadeIn
              key={job.company}
              className="grid grid-cols-1 gap-6 sm:gap-8 md:grid-cols-12"
            >
              <div className="flex flex-col gap-2 md:col-span-4">
                <h3 className="text-2xl leading-tight sm:text-3xl">
                  {job.company}
                </h3>
                <span className="text-xs text-foreground/60">
                  {job.location}
                </span>
                <span className="text-xs text-foreground/50">{job.period}</span>
              </div>

              <div className="flex flex-col gap-8 md:col-span-8 md:gap-10">
                {job.roles.map((role) => (
                  <div key={role.title} className="flex flex-col gap-4">
                    <h4 className="text-xl leading-tight text-foreground sm:text-2xl">
                      {role.title}
                    </h4>
                    <ul className="flex flex-col gap-3">
                      {role.bullets.map((bullet) => (
                        <li
                          key={bullet}
                          className="max-w-[520px] body-copy font-normal"
                        >
                          {bullet}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </FadeIn>
          ))}
        </div>
      </section>

      <section
        id="projects"
        className="px-5 py-20 sm:px-8 sm:py-28 md:px-12 lg:px-24 lg:py-32"
      >
        <div className="mx-auto flex w-full max-w-5xl flex-col gap-10 sm:gap-12">
          <FadeIn className="flex flex-col gap-3 sm:gap-4">
            <h2 className="text-4xl leading-[0.95] sm:text-6xl md:text-7xl lg:text-8xl">
              Selected Projects
            </h2>
          </FadeIn>

          <div className="flex flex-col border-b border-foreground/15">
            {projects.map((project) => (
              <FadeIn
                key={project.name}
                className="border-t border-foreground/15 py-6 sm:py-8"
              >
                <ProjectCard {...project} />
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      <section
        id="education"
        className="px-5 py-20 sm:px-8 sm:py-28 md:px-12 lg:px-24 lg:py-32"
      >
        <div className="mx-auto flex w-full max-w-5xl flex-col gap-10 sm:gap-12">
          <FadeIn className="flex flex-col gap-3 sm:gap-4">
            <h2 className="text-4xl leading-[0.95] sm:text-6xl md:text-7xl lg:text-8xl">
              Education
            </h2>
          </FadeIn>

          <div className="flex flex-col border-b border-foreground/15">
            {education.map((entry) => (
              <FadeIn
                key={entry.institution}
                className="flex flex-col gap-3 border-t border-foreground/15 py-6 sm:py-8"
              >
                <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1 meta">
                  <span>{entry.institution}</span>
                  <span>{entry.period}</span>
                </div>

                <h3 className="text-2xl leading-tight sm:text-3xl">
                  {entry.program}
                </h3>

                {entry.modules.length > 0 && (
                  <ul className="flex max-w-[560px] flex-col gap-1 pt-3 sm:pl-6">
                    {entry.modules.map((module) => (
                      <li
                        key={module.name}
                        className="flex items-baseline justify-between gap-x-6 body-copy font-light"
                      >
                        <span className="min-w-0">{module.name}</span>
                        <span className="shrink-0 text-muted-foreground">
                          {module.status}
                        </span>
                      </li>
                    ))}
                  </ul>
                )}
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      <section
        id="certifications"
        className="px-5 py-20 sm:px-8 sm:py-28 md:px-12 lg:px-24 lg:py-32"
      >
        <div className="mx-auto flex w-full max-w-5xl flex-col gap-10 sm:gap-12">
          <FadeIn className="flex flex-col gap-3 sm:gap-4">
            <h2 className="text-4xl leading-[0.95] sm:text-6xl md:text-7xl lg:text-8xl">
              Certifications
            </h2>
          </FadeIn>

          {certifications.length === 0 ? (
            <FadeIn>
              <p className="body-copy font-light">
                More to come.
              </p>
            </FadeIn>
          ) : (
            <div className="flex flex-col border-b border-foreground/15">
              {certifications.map((cert) => (
                <FadeIn
                  key={cert.name}
                  className="flex flex-col gap-3 border-t border-foreground/15 py-6 sm:py-8"
                >
                  <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1 meta">
                    <span>{cert.issuer}</span>
                    <span>{cert.period}</span>
                  </div>

                  <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-2">
                    <h3 className="text-2xl leading-tight sm:text-3xl">
                      {cert.name}
                    </h3>
                    {cert.credentialUrl && (
                      <a
                        href={cert.credentialUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="external-link"
                      >
                        Verify credential
                        <span aria-hidden>↗</span>
                      </a>
                    )}
                  </div>
                </FadeIn>
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  );
}
