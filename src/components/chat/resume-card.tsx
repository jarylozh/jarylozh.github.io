import { Button } from "@/components/ui/button";
import { portfolio } from "@/lib/portfolio";

export function ResumeCard() {
  const { links, name, title } = portfolio.profile;

  return (
    <div className="flex animate-in flex-col gap-3 border border-foreground/15 bg-card p-4 duration-700 ease-out fade-in blur-in-2 slide-in-from-bottom-2 motion-reduce:animate-none">
      <div className="flex flex-col gap-1">
        <span className="text-sm">Resume</span>
        <span className="text-xs text-foreground/50">
          {name} — {title}
        </span>
      </div>

      <div className="flex flex-wrap gap-2">
        <Button
          size="sm"
          nativeButton={false}
          render={<a href={links.resumeDownload} download />}
        >
          Download PDF
        </Button>
        <Button
          size="sm"
          variant="outline"
          nativeButton={false}
          render={
            <a href={links.resume} target="_blank" rel="noopener noreferrer" />
          }
        >
          Open in Drive
        </Button>
      </div>
    </div>
  );
}
