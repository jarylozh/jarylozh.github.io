import { portfolio } from "@/lib/portfolio";
import { Button, Card, CardDescription, CardFooter, CardHeader, CardTitle } from "@jarylozh/ui";

export function ResumeCard() {
  const { links, name, title } = portfolio.profile;

  return (
    <Card
      size="sm"
      className="animate-in duration-700 ease-out fade-in blur-in-2 slide-in-from-bottom-2 motion-reduce:animate-none"
    >
      <CardHeader>
        <CardTitle>Resume</CardTitle>
        <CardDescription>
          {name} · {title}
        </CardDescription>
      </CardHeader>

      <CardFooter className="flex-wrap">
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
      </CardFooter>
    </Card>
  );
}
