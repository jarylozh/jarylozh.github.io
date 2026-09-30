# @jarylozh/ui

## 0.1.0

### Minor Changes

- 3a348b5: Initial release. Extracts the site's design system into a publishable package.

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

### Patch Changes

- 3a348b5: Pin headings to weight 400 so the display face is never synthetically bolded,
  and tighten `body-copy` line height from 1.8 to 1.6.
