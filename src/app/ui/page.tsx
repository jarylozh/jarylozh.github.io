import { type ReactNode } from "react";
import { BodyText, Button, Card, CardAction, CardContent, CardDescription, CardFooter, CardHeader, CardMedia, CardTitle, Columns, DividedItem, DividedList, EntryTitle, ExternalLink, Eyebrow, FadeIn, Field, FieldError, FieldHeader, FieldHint, FieldLabel, IndexList, Input, MetaRow, NavigationMenu, NavigationMenuContent, NavigationMenuItem, NavigationMenuLink, NavigationMenuList, NavigationMenuTrigger, PageHero, Section, SectionHeading, Separator, Split, StatGrid, Tag, TagButton, TagList, Textarea } from "@jarylozh/ui";
import { ArrowLink, Portrait } from "@jarylozh/ui/next";
import Image from "next/image";
import { ArrowRight, Download, Plus } from "lucide-react";

import { SiteNav } from "@/components/site-nav";

const PAGES = {
  label: "Components",
  items: [
    { label: "Home", href: "/" },
    { label: "Portfolio", href: "/portfolio" },
    { label: "Projects", href: "/portfolio/projects" },
    { label: "Components", href: "/ui" },
  ],
};

const TOKENS = [
  { name: "background", className: "bg-background" },
  { name: "foreground", className: "bg-foreground" },
  { name: "muted", className: "bg-muted" },
  { name: "muted-foreground", className: "bg-muted-foreground" },
  { name: "card", className: "bg-card" },
  { name: "border", className: "bg-border" },
  { name: "ring", className: "bg-ring" },
  { name: "destructive", className: "bg-destructive" },
];

const AVATAR_W = 896;
const AVATAR_H = 864;

const STEPS = [
  {
    title: "Read the brief before the code",
    description:
      "Establish what the change is for, what it touches, and what it must not break, before opening a single file.",
  },
  {
    title: "Make the smallest honest change",
    description:
      "Solve the problem that was asked for. Leave the neighbouring cleanup for its own commit.",
  },
  {
    title: "Prove it against real content",
    description:
      "A component earns its place once a real page uses it. Until then it is a guess with a type signature.",
  },
  {
    title: "Say what you left out",
    description:
      "Report what shipped, what did not, and why. Scaling the work down is the reader's call, not the author's.",
  },
];

/** One library entry: its name, import path, and a live render. */
function Spec({
  name,
  from,
  note,
  children,
}: {
  name: string;
  from: string;
  note?: ReactNode;
  children: ReactNode;
}) {
  return (
    <DividedItem className="flex flex-col gap-4">
      <MetaRow>
        <span className="text-foreground">{name}</span>
        <span className="font-mono normal-case tracking-normal">{from}</span>
      </MetaRow>

      {note && <BodyText measure={false}>{note}</BodyText>}

      <div className="pt-2">{children}</div>
    </DividedItem>
  );
}

/** Lays variants of one component out on a single wrapping line. */
function Row({ children }: { children: ReactNode }) {
  return (
    <div className="flex flex-wrap items-center gap-3">{children}</div>
  );
}

export default function Ui() {
  return (
    <>
      <SiteNav menu={PAGES} />

      <Section id="overview">
        <PageHero
          eyebrow={["Design system", "v1"]}
          title="Components"
          summary="Every component the site is built from, rendered here with its variants. Square corners, hairline rules, uppercase sans, and a greyscale palette."
          actions={
            <Button
              size="lg"
              nativeButton={false}
              render={
                <a
                  href="https://github.com/jarylozh/jarylozh.github.io/tree/main/src/components/ui"
                  target="_blank"
                  rel="noopener noreferrer"
                />
              }
            >
              Read the source
            </Button>
          }
        />
      </Section>

      <Section id="foundations">
        <SectionHeading
          eyebrow={["01"]}
          description="The variables every component reads from. Radius is pinned to zero, so nothing in the library rounds."
        >
          Foundations
        </SectionHeading>

        <DividedList>
          <Spec name="Colour" from="src/app/globals.css" note="Neutral throughout. Colour appears only for destructive states.">
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
              {TOKENS.map((token) => (
                <div key={token.name} className="flex flex-col gap-2">
                  <div
                    className={`h-16 w-full border border-foreground/15 ${token.className}`}
                  />
                  <span className="meta normal-case">--{token.name}</span>
                </div>
              ))}
            </div>
          </Spec>

          <Spec name="Type" from="src/app/layout.tsx" note="Bebas Neue sets headings, Inter sets body, Space Mono sets labels and code.">
            <div className="flex flex-col gap-4">
              <div className="flex flex-col gap-1">
                <span className="meta normal-case">--font-heading</span>
                <span className="font-heading text-4xl">Bebas Neue</span>
              </div>
              <div className="flex flex-col gap-1">
                <span className="meta normal-case">--font-sans</span>
                <span className="text-sm">Inter</span>
              </div>
              <div className="flex flex-col gap-1">
                <span className="meta normal-case">--font-mono</span>
                <span className="font-mono text-xs">Space Mono</span>
              </div>
            </div>
          </Spec>

          <Spec name="Utilities" from="src/app/globals.css" note="Four class utilities the components compose from.">
            <div className="flex flex-col gap-4">
              <div className="eyebrow">eyebrow</div>
              <div className="meta">meta</div>
              <div className="body-copy">
                body-copy sets the reading size, its line height, and its
                tracking.
              </div>
              <a href="#foundations" className="external-link">
                external-link
              </a>
            </div>
          </Spec>
        </DividedList>
      </Section>

      <Section id="typography">
        <SectionHeading
          eyebrow={["02"]}
          description="Text components. Everything above body size is set in the heading face."
        >
          Typography
        </SectionHeading>

        <DividedList>
          <Spec name="Eyebrow" from="@jarylozh/ui" note="Mono label row with dot separators.">
            <Eyebrow items={["Software engineer", "Singapore", "2026"]} />
          </Spec>

          <Spec name="MetaRow" from="@jarylozh/ui" note="Uppercase labels spread across one line, or stacked.">
            <div className="flex flex-col gap-6">
              <MetaRow>
                <span>ST Engineering</span>
                <span>2022 &ndash; Present</span>
              </MetaRow>
              <MetaRow stacked>
                <span>ST Engineering</span>
                <span>2022 &ndash; Present</span>
              </MetaRow>
            </div>
          </Spec>

          <Spec name="EntryTitle" from="@jarylozh/ui" note="Heading for a single entry in a list, at three sizes.">
            <div className="flex flex-col gap-3">
              <EntryTitle size="lg">Large entry title</EntryTitle>
              <EntryTitle size="md">Medium entry title</EntryTitle>
              <EntryTitle size="sm">Small entry title</EntryTitle>
            </div>
          </Spec>

          <Spec name="BodyText" from="@jarylozh/ui" note="Reading copy, capped to the reading measure unless measure is false.">
            <div className="flex flex-col gap-6">
              <BodyText>
                Capped to the measure. The line length stays short enough to
                read comfortably no matter how wide the viewport gets.
              </BodyText>
              <BodyText measure={false}>
                Uncapped. Fills whatever column it is given, which suits table
                cells and grid entries.
              </BodyText>
            </div>
          </Spec>
        </DividedList>
      </Section>

      <Section id="actions">
        <SectionHeading
          eyebrow={["03"]}
          description="Buttons and links. The outline variant inverts to solid on hover, which is the site's primary gesture."
        >
          Actions
        </SectionHeading>

        <DividedList>
          <Spec name="Button" from="@jarylozh/ui" note="Six variants.">
            <Row>
              <Button>Default</Button>
              <Button variant="outline">Outline</Button>
              <Button variant="secondary">Secondary</Button>
              <Button variant="ghost">Ghost</Button>
              <Button variant="destructive">Destructive</Button>
              <Button variant="link">Link</Button>
            </Row>
          </Spec>

          <Spec name="Button" from="@jarylozh/ui" note="Four text sizes and four icon sizes.">
            <div className="flex flex-col gap-4">
              <Row>
                <Button size="xs">Extra small</Button>
                <Button size="sm">Small</Button>
                <Button size="default">Default</Button>
                <Button size="lg">Large</Button>
              </Row>
              <div className="max-w-sm">
                <Button size="block">Block</Button>
              </div>
              <Row>
                <Button size="icon-xs" variant="outline" aria-label="Add">
                  <Plus />
                </Button>
                <Button size="icon-sm" variant="outline" aria-label="Add">
                  <Plus />
                </Button>
                <Button size="icon" variant="outline" aria-label="Add">
                  <Plus />
                </Button>
                <Button size="icon-lg" variant="outline" aria-label="Add">
                  <Plus />
                </Button>
              </Row>
            </div>
          </Spec>

          <Spec name="Button" from="@jarylozh/ui" note="Icons tighten their side's padding when marked with data-icon.">
            <Row>
              <Button>
                <Download data-icon="inline-start" />
                Download
              </Button>
              <Button variant="outline">
                Continue
                <ArrowRight data-icon="inline-end" />
              </Button>
              <Button disabled>Disabled</Button>
            </Row>
          </Spec>

          <Spec name="ExternalLink" from="@jarylozh/ui" note="Anchor to another site, opened in a new tab.">
            <ExternalLink href="https://github.com/jarylozh">
              github.com/jarylozh
            </ExternalLink>
          </Spec>

          <Spec name="ArrowLink" from="@jarylozh/ui/next" note="Route link closed with a trailing arrow. Pass newTab to open it away from the site.">
            <div className="flex flex-col items-start gap-3">
              <ArrowLink href="/portfolio/projects">View all projects</ArrowLink>
              <ArrowLink href="/portfolio" newTab>
                Open the portfolio in a tab
              </ArrowLink>
            </div>
          </Spec>
        </DividedList>
      </Section>

      <Section id="forms">
        <SectionHeading
          eyebrow={["04"]}
          description="Controls are mono, square, and transparent, so they read as cut into the page rather than sitting on it."
        >
          Forms
        </SectionHeading>

        <DividedList>
          <Spec name="Field" from="@jarylozh/ui" note="Label row, control, and message on one rhythm. Bind the label with htmlFor.">
            <div className="grid gap-6 md:grid-cols-2">
              <Field>
                <FieldHeader>
                  <FieldLabel htmlFor="demo-name">Name</FieldLabel>
                  <FieldHint>Required</FieldHint>
                </FieldHeader>
                <Input id="demo-name" placeholder="Ada Lovelace" />
              </Field>

              <Field>
                <FieldHeader>
                  <FieldLabel htmlFor="demo-email">Email</FieldLabel>
                  <FieldHint>Work address</FieldHint>
                </FieldHeader>
                <Input
                  id="demo-email"
                  type="email"
                  defaultValue="not-an-email"
                  aria-invalid
                />
                <FieldError>Enter a valid email address.</FieldError>
              </Field>
            </div>
          </Spec>

          <Spec name="Input" from="@jarylozh/ui" note="Single-line control. Mirrors Textarea.">
            <div className="grid gap-4 md:grid-cols-2">
              <Input placeholder="Placeholder" />
              <Input defaultValue="Disabled" disabled />
            </div>
          </Spec>

          <Spec name="Textarea" from="@jarylozh/ui" note="Multi-line control, resizable on the vertical axis.">
            <Textarea placeholder="Landorus-Therian @ Assault Vest" rows={4} />
          </Spec>
        </DividedList>
      </Section>

      <Section id="display">
        <SectionHeading
          eyebrow={["05"]}
          description="Containers and chips. Every surface is a hairline border over the card colour, never a shadow."
        >
          Display
        </SectionHeading>

        <DividedList>
          <Spec name="Tag" from="@jarylozh/ui" note="Bordered chip in two tones, plus a pressable variant that inverts on hover.">
            <div className="flex flex-col gap-4">
              <Row>
                <Tag>Default</Tag>
                <Tag variant="solid">Solid</Tag>
              </Row>
              <Row>
                <TagButton>About me</TagButton>
                <TagButton>ST Engineering</TagButton>
                <TagButton disabled>Disabled</TagButton>
              </Row>
            </div>
          </Spec>

          <Spec name="TagList" from="@jarylozh/ui" note="Renders a label array as chips. Returns null when the array is empty.">
            <TagList items={["Go", "TypeScript", "AWS", "Terraform", "React"]} />
          </Spec>

          <Spec name="Card" from="@jarylozh/ui" note="Slotted container. Header, content, and footer share one spacing variable, tightened by size sm.">
            <div className="grid items-start gap-6 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>Pokepaste Converter</CardTitle>
                  <CardDescription>Tool · 2025</CardDescription>
                  <CardAction>
                    <Button size="icon-sm" variant="ghost" aria-label="Add">
                      <Plus />
                    </Button>
                  </CardAction>
                </CardHeader>
                <CardContent>
                  <BodyText measure={false}>
                    Every slot at once: header, title, description, action,
                    content, and footer.
                  </BodyText>
                </CardContent>
                <CardFooter>
                  <Button size="sm" variant="outline">
                    Visit
                  </Button>
                </CardFooter>
              </Card>

              <Card size="sm">
                <CardMedia>
                  <Image
                    src="/previews/vault-of-cards.jpg"
                    alt=""
                    fill
                    sizes="(min-width: 768px) 24rem, 100vw"
                    className="object-cover"
                  />
                </CardMedia>
                <CardHeader>
                  <CardTitle>Vault of Cards</CardTitle>
                  <CardDescription>Side project</CardDescription>
                </CardHeader>
                <CardContent>
                  <BodyText measure={false}>
                    Size sm, opened by a CardMedia block that closes off the top
                    edge.
                  </BodyText>
                </CardContent>
              </Card>
            </div>
          </Spec>

          <Spec name="StatGrid" from="@jarylozh/ui" note="Label and value pairs on a rule-topped grid.">
            <StatGrid
              items={[
                { label: "Languages", value: "Go, TypeScript" },
                { label: "Cloud", value: "AWS" },
                { label: "Focus", value: "Platform" },
                { label: "Experience", value: "6+ Years" },
              ]}
            />
          </Spec>

          <Spec name="Portrait" from="@jarylozh/ui/next" note="next/image faded out along its lower edge.">
            <Portrait
              src="/avatar.png"
              alt="Jaryl Ong"
              width={AVATAR_W}
              height={AVATAR_H}
              className="w-32"
            />
          </Spec>
        </DividedList>
      </Section>

      <Section id="layout">
        <SectionHeading
          eyebrow={["06"]}
          description="The page skeleton. Section carries the gutters and vertical rhythm; everything else stacks inside it."
        >
          Layout
        </SectionHeading>

        <DividedList>
          <Spec name="Section" from="@jarylozh/ui" note="Full-width band with the shared gutters and a centred container. The hero variant fills the viewport. Every band on this page is one.">
            <div className="border border-foreground/15 p-4">
              <span className="meta">Section &rsaquo; Container &rsaquo; children</span>
            </div>
          </Spec>

          <Spec name="SectionHeading" from="@jarylozh/ui" note="Display heading with an optional eyebrow and standfirst. The heading above each band on this page is one.">
            <SectionHeading eyebrow={["Example"]} description="The standfirst sits under the display line.">
              Heading
            </SectionHeading>
          </Spec>

          <Spec name="PageHero" from="@jarylozh/ui" note="Opening block of a page: eyebrow, display title, summary, actions, and an aside. The top of this page is one.">
            <PageHero
              eyebrow={["Role", "Location"]}
              title="Title"
              summary="The summary sits under the display title."
              actions={<Button variant="outline">Action</Button>}
            />
          </Spec>

          <Spec name="DividedList" from="@jarylozh/ui" note="Stacks entries between hairline rules, closed off at the bottom. Each entry fades in as it scrolls into view.">
            <DividedList>
              <DividedItem>
                <EntryTitle size="sm">First entry</EntryTitle>
              </DividedItem>
              <DividedItem>
                <EntryTitle size="sm">Second entry</EntryTitle>
              </DividedItem>
            </DividedList>
          </Spec>

          <Spec name="Separator" from="@jarylozh/ui" note="Hairline rule between blocks, horizontal or vertical.">
            <div className="flex flex-col gap-6 border border-foreground/15 p-4">
              <span className="meta">Above</span>
              <Separator />
              <span className="meta">Below</span>
              <div className="flex h-8 items-center gap-4">
                <span className="meta">Left</span>
                <Separator orientation="vertical" />
                <span className="meta">Right</span>
              </div>
            </div>
          </Spec>

          <Spec name="NavigationMenu" from="@jarylozh/ui" note="Menu with a floating panel. SiteNav composes it into the header at the top of this page.">
            <NavigationMenu>
              <NavigationMenuList>
                <NavigationMenuItem>
                  <NavigationMenuTrigger>Pages</NavigationMenuTrigger>
                  <NavigationMenuContent className="flex w-44 flex-col">
                    {PAGES.items.map((item) => (
                      <NavigationMenuLink
                        key={item.href}
                        href={item.href}
                        className="px-3 py-2"
                      >
                        {item.label}
                      </NavigationMenuLink>
                    ))}
                  </NavigationMenuContent>
                </NavigationMenuItem>
              </NavigationMenuList>
            </NavigationMenu>
          </Spec>

          <Spec name="FadeIn" from="@jarylozh/ui" note="Lifts its children into view on scroll. Pass stagger to walk through them one at a time. Every entry on this page is wrapped in one.">
            <FadeIn stagger={0.12} className="flex flex-col gap-3">
              <EntryTitle size="sm">Staggered one</EntryTitle>
              <EntryTitle size="sm">Staggered two</EntryTitle>
              <EntryTitle size="sm">Staggered three</EntryTitle>
            </FadeIn>
          </Spec>
        </DividedList>
      </Section>

      <Section id="editorial">
        <SectionHeading
          eyebrow={["07"]}
          description="Long-form arrangements. A numbered list that dims what you are not reading, prose split into columns, and a band that runs media to the page edge."
        >
          Editorial
        </SectionHeading>

        <DividedList>
          <Spec name="IndexList" from="@jarylozh/ui" note="Numbered entries between hairline rules. Hover any row and the others drop back, so one entry reads as current. Untouched on devices without a pointer.">
            <IndexList items={STEPS} className="border-b-0" />
          </Spec>

          <Spec name="Columns" from="@jarylozh/ui" note="Flows body copy into balanced columns, collapsing to one on small screens.">
            <Columns>
              <BodyText>
                Multi-column prose suits a run of copy that has no internal
                structure worth pulling out into headings. The column count
                drops to one below the small breakpoint.
              </BodyText>
              <BodyText>
                Children are prevented from breaking across a column boundary
                and have their reading measure released, since the column width
                already caps the line length.
              </BodyText>
            </Columns>
          </Spec>

          <Spec name="Split" from="@jarylozh/ui" note="Page-level band, so it sits beside Section rather than inside it. The live one runs full-bleed directly below.">
            <span className="meta">Rendered edge to edge below</span>
          </Spec>
        </DividedList>
      </Section>

      <Split
        className="pb-20 sm:pb-28 lg:pb-32"
        media={
          <Image
            src="/previews/vault-of-cards.jpg"
            alt=""
            width={1440}
            height={900}
            className="h-auto w-full"
          />
        }
      >
        <Eyebrow items={["Split", "side: start"]} />
        <EntryTitle as="h3" size="lg">
          Edge to edge
        </EntryTitle>
        <BodyText>
          The media column runs to the page edge while the text column stays
          inset on the reading measure. Pass side to put the media on the other
          hand. Below the medium breakpoint the two stack.
        </BodyText>
        <div className="max-w-xs">
          <Button size="block">Read the source</Button>
        </div>
      </Split>
    </>
  );
}
