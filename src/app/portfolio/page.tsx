import type { Metadata } from "next";
import { Button } from "@/components/ui/button";
import { FadeIn } from "@/components/fade-in";
import { ProjectCard } from "@/components/project-card";

export const metadata: Metadata = {
  title: "Portfolio — Jaryl Ong",
};

const CAREER_START_YEAR = 2021;

const experience = [
  {
    company: "ST Engineering",
    location: "Singapore",
    period: "Jul 2021 — Present",
    roles: [
      {
        title: "Senior Software Engineer",
        bullets: [
          "Engineered a Claude-driven AI engine that automates platform integration, accelerating project onboarding and software delivery for engineering teams.",
          "Co-developed a reusable dynamic form module with SurveyJS, reducing frontend development time and enabling teams to rapidly deploy form-based applications.",
          "Built containerized CI/CD pipelines via GitHub Actions and Docker, automating deployments across multiple core platform modules to accelerate release cycles.",
        ],
      },
      {
        title: "Software Engineer",
        bullets: [
          "Architected a full-stack dashboard framework in Go and Svelte, standardizing custom data visualization and UI widget rendering across internal project teams.",
        ],
      },
    ],
  },
];

const education = [
  {
    institution: "National University of Singapore",
    program: "Master of Technology in Software Engineering",
    period: "Jul 2025 — Present",
    modules: [
      { name: "Architecting Scalable Systems", status: "Completed" },
      { name: "Distributed Modern Software Systems", status: "In Progress" },
      { name: "Architecting AI Systems", status: "In Progress" },
    ],
  },
  {
    institution: "DigiPen Institute of Technology",
    program: "Bachelor of Computer Science in Real-Time Interactive Simulation",
    period: "Graduated 2021",
    modules: [],
  },
];

const certifications: {
  name: string;
  issuer: string;
  period: string;
  credentialUrl?: string;
}[] = [
  {
    name: "AWS Certified Developer — Associate",
    issuer: "Amazon Web Services",
    period: "Dec 2023",
    credentialUrl:
      "https://cp.certmetrics.com/amazon/en/public/verify/credential/SKGHHPGBSFF1QSWC",
  },
  {
    name: "Custom Generative AI Systems for Enterprises",
    issuer: "National University of Singapore",
    period: "Aug 2025",
  },
];

const projects = [
  {
    name: "Vault of Cards",
    context: "NUS MTech — Architecting Scalable Solutions",
    role: "Cloud Architect & Developer",
    link: "https://dev.vaultofcards.io",
    description:
      "A full-stack web application for buying and selling trading card game collectibles. Users can browse and search listings, manage their own listings with image uploads, sign in with email-verified authentication, and message buyers and sellers in real time — all on a responsive frontend backed by a NestJS microservice deployed on AWS.",
    stack: ["Next.js", "NestJS", "AWS", "Docker", "GitHub Actions"],
    bullets: [
      "Built the Next.js frontend and wired up GitHub Actions so every push deploys itself — no downtime, no manual steps.",
      "Set up the AWS infrastructure with containerized microservices so the app stays fast and stays up, even when traffic spikes.",
    ],
  },
  {
    name: "Askbot",
    context: "Personal Project — LLM Framework Internals",
    role: "Developer",
    link: "https://github.com/jarylozh/askbot",
    description:
      "A streaming chat-based Q&A application built to understand how LLM frameworks like LangChain work under the hood — implementing their core primitives such as response streaming, conversation memory, and prompt construction directly on the OpenAI SDK, behind a FastAPI backend and a Next.js frontend.",
    stack: ["Next.js", "FastAPI", "OpenAI", "SQLite", "Typescript", "Python"],
    bullets: [],
  },
];

export default function Home() {
  const yearsOfExperience = new Date().getFullYear() - CAREER_START_YEAR;

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
              Jaryl Ong
            </h1>
            <div className="flex flex-wrap items-center justify-center gap-x-3 gap-y-1 text-xs text-foreground/70 sm:justify-start sm:text-sm">
              <span>Senior Software Engineer</span>
              <span
                aria-hidden
                className="h-1 w-1 rounded-full bg-foreground/30"
              />
              <span>Singapore</span>
            </div>
          </div>

          <p className="mx-auto max-w-2xl text-center text-sm font-normal leading-relaxed text-foreground sm:mx-0 sm:text-left sm:text-base">
            I take a grounded approach to both life and work, preferring quiet
            consistency and practical problem-solving over chasing trends. I
            enjoy the process of breaking down complex ideas, focusing on the
            details, and delivering reliable results without the fluff.
          </p>

          <div className="flex flex-wrap justify-center gap-3 sm:justify-start">
            <Button
              size="lg"
              nativeButton={false}
              render={<a href="mailto:jarylozh@gmail.com" />}
            >
              Get in touch
            </Button>
            <Button
              size="lg"
              variant="outline"
              nativeButton={false}
              render={
                <a
                  href="https://www.linkedin.com/in/jaryl-ong-162ab2144"
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
                  href="https://drive.google.com/file/d/1NVR8i65dySFFxiIz-L8yTcaHlWFPpiuJ/view?usp=sharing"
                  target="_blank"
                  rel="noopener noreferrer"
                />
              }
            >
              Resume
            </Button>
          </div>

          <div className="mt-4 grid grid-cols-2 gap-x-6 gap-y-4 border-t border-foreground/10 pt-8 text-xs text-foreground/60 sm:mt-8 sm:gap-x-8 sm:grid-cols-4">
            <div className="flex flex-col gap-1">
              <span className="text-foreground/40">Languages</span>
              <span className="text-foreground">C++ · Go · TypeScript</span>
            </div>
            <div className="flex flex-col gap-1">
              <span className="text-foreground/40">Frameworks</span>
              <span className="text-foreground">
                Next.js · Svelte · Tailwind
              </span>
            </div>
            <div className="flex flex-col gap-1">
              <span className="text-foreground/40">Cloud</span>
              <span className="text-foreground">AWS · Docker · GitOps</span>
            </div>
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
            <span className="text-xs text-foreground/50 ">02 / Career</span>
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
            <span className="text-xs text-foreground/50">03 / Projects</span>
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
            <span className="text-xs text-foreground/50">04 / Education</span>
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
            <span className="text-xs text-foreground/50">
              05 / Certifications
            </span>
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
