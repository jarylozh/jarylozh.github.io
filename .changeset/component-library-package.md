---
"@jarylozh/ui": minor
---

Initial release. Extracts the site's design system into a publishable package.

- Layout: `Section`, `Container`, `SectionHeading`, `PageHero`, `Split`,
  `Columns`, `Separator`.
- Lists: `DividedList`, `IndexList`, `StatGrid`.
- Typography: `Eyebrow`, `MetaRow`, `EntryTitle`, `BodyText`, `ExternalLink`.
- Actions: `Button`, `Tag`, `TagButton`, `TagList`.
- Forms: `Field` and its parts, `Input`, `Textarea`.
- Containers: `Card` and its slots, `NavigationMenu` and its parts.
- Motion: `FadeIn`.
- `@jarylozh/ui/next` carries `ArrowLink` and `Portrait`, keeping the main
  entry free of a Next.js dependency.
- `@jarylozh/ui/styles.css` ships the design tokens, the four class utilities,
  and an `@source` declaration so Tailwind scans the component source.
