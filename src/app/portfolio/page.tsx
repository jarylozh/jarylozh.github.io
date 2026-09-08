import type { Metadata } from "next";
import { Button } from "@/components/ui/button";
import { FadeIn } from "@/components/fade-in";
import { ProjectCard } from "@/components/project-card";
import { portfolio } from "@/lib/portfolio";

export const metadata: Metadata = {
  title: "Portfolio — Jaryl Ong",
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
            <h1 className="text-5xl leading-[0.9] sm:text-7xl md:text-8xl lg:text-9xl">
              {profile.name}
            </h1>
            <div className="flex flex-wrap items-center justify-center gap-x-3 gap-y-1 text-xs text-foreground/70 sm:justify-start sm:text-sm">
              <span>{profile.title}</span>
              <span
                aria-hidden
                className="h-1 w-1 rounded-full bg-foreground/30"
              />
              <span>{profile.location}</span>
            </div>
          </div>

          <p className="mx-auto max-w-2xl text-center text-sm font-normal leading-relaxed text-foreground sm:mx-0 sm:text-left sm:text-base">
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
                <span className="text-foreground/40">{skill.label}</span>
                <span className="text-foreground">{skill.value}</span>
              </div>
            ))}
            <div className="flex flex-col gap-1">
              <span className="text-foreground/40">Experience</span>
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
                          className="text-sm font-normal leading-relaxed text-foreground sm:text-base"
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

          {projects.map((project) => (
            <FadeIn key={project.name}>
              <ProjectCard {...project} />
            </FadeIn>
          ))}
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

          {education.map((entry) => (
            <FadeIn
              key={entry.institution}
              className="grid grid-cols-1 gap-6 sm:gap-8 md:grid-cols-12"
            >
              <div className="flex flex-col gap-2 md:col-span-4">
                <h3 className="text-2xl leading-tight sm:text-3xl">
                  {entry.institution}
                </h3>
                <span className="text-xs text-foreground/50">
                  {entry.period}
                </span>
              </div>

              <div className="flex flex-col md:col-span-8">
                <p className="text-sm font-normal uppercase leading-relaxed tracking-normal text-foreground sm:text-base">
                  {entry.program}
                </p>

                {entry.modules.length > 0 && (
                  <ul className="flex flex-col gap-1 pt-6">
                    {entry.modules.map((module) => (
                      <li
                        key={module.name}
                        className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1 text-sm font-light leading-relaxed text-foreground sm:text-base"
                      >
                        <span>{module.name}</span>
                        <span className="text-xs uppercase text-foreground/70">
                          {module.status}
                        </span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </FadeIn>
          ))}
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
              <p className="text-sm font-light leading-relaxed text-foreground/60 sm:text-base">
                More to come.
              </p>
            </FadeIn>
          ) : (
            <div className="flex flex-col gap-6 sm:gap-8">
              {certifications.map((cert) => (
                <FadeIn
                  key={cert.name}
                  className="grid grid-cols-1 gap-6 sm:gap-8 md:grid-cols-12"
                >
                  <div className="flex flex-col gap-2 md:col-span-4">
                    <h3 className="text-2xl leading-tight sm:text-3xl">
                      {cert.issuer}
                    </h3>
                    <span className="text-xs text-foreground/50">
                      {cert.period}
                    </span>
                    {cert.credentialUrl && (
                      <a
                        href={cert.credentialUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="external-link mt-2"
                      >
                        Verify credential
                        <span aria-hidden>↗</span>
                      </a>
                    )}
                  </div>

                  <div className="flex flex-col md:col-span-8">
                    <p className="text-sm font-normal uppercase leading-relaxed tracking-normal text-foreground sm:text-base">
                      {cert.name}
                    </p>
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
