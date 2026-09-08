"use client";

import { useState } from "react";
import Image from "next/image";

import { ProjectCard } from "@/components/project-card";
import { portfolio, type Project } from "@/lib/portfolio";
import { cn } from "@/lib/utils";

export function findProjects(ids: string[]): Project[] {
  return ids
    .map((id) => portfolio.projects.find((project) => project.id === id))
    .filter((project): project is Project => project !== undefined);
}

function PreviewMedia({ project }: { project: Project }) {
  const [ready, setReady] = useState(false);

  if (!project.preview && !project.previewVideo) return null;

  return (
    <div className="relative aspect-[8/5] w-full overflow-hidden border-b border-foreground/10">
      {project.preview && (
        <Image
          src={project.preview}
          alt={`${project.name} screenshot`}
          fill
          sizes="(min-width: 640px) 640px, 100vw"
          className="object-cover"
        />
      )}

      {project.previewVideo && (
        <video
          src={project.previewVideo}
          autoPlay
          muted
          loop
          playsInline
          aria-label={`${project.name} screen recording`}
          onCanPlay={() => setReady(true)}
          className={cn(
            "absolute inset-0 h-full w-full object-cover transition-opacity duration-1000 ease-out motion-reduce:hidden",
            ready ? "opacity-100" : "opacity-0",
          )}
        />
      )}
    </div>
  );
}

export function ProjectPreview({ project }: { project: Project }) {
  return (
    <div className="flex animate-in flex-col border border-foreground/15 bg-card duration-700 ease-out fade-in blur-in-2 slide-in-from-bottom-2 motion-reduce:animate-none">
      <PreviewMedia project={project} />

      <div className="p-4">
        <ProjectCard compact {...project} />
      </div>
    </div>
  );
}
