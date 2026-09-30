# @jarylozh/ui

Editorial React components: square corners, hairline rules, uppercase type,
and a greyscale palette. Built on [Base UI][base-ui] and Tailwind CSS v4.

[base-ui]: https://base-ui.com

Live component gallery: <https://jarylozh.github.io/ui>

## Install

The package is hosted on GitHub Packages, so npm needs to know where the
`@jarylozh` scope lives. Add this to your project's `.npmrc`:

```ini
@jarylozh:registry=https://npm.pkg.github.com
```

GitHub Packages requires an authenticated read even for public packages, so
also set `NODE_AUTH_TOKEN` (or add a `_authToken` line) with a personal access
token carrying the `read:packages` scope.

```sh
pnpm add @jarylozh/ui
```

### Peer dependencies

| Package | Required | Used by |
|---|---|---|
| `react`, `react-dom` | yes | everything |
| `@base-ui/react` | yes | `Button`, `NavigationMenu`, `Separator` |
| `gsap`, `@gsap/react` | yes | `FadeIn`, and the components that wrap it |
| `next` | optional | the `@jarylozh/ui/next` entry only |

## Styles

Components are styled with Tailwind utility classes, so your Tailwind build has
to both define the design tokens and scan the shipped component source. One
import does both:

```css
@import "tailwindcss";
@import "@jarylozh/ui/styles.css";
```

`styles.css` carries the `@theme` token mappings, the `eyebrow`, `meta`,
`body-copy`, and `external-link` utilities, the `:root` and `.dark` values, and
a base layer that sets the uppercase body treatment. It declares its own
`@source`, so Tailwind picks up the classes the components use without any
extra configuration.

Three font variables are read but not provided, so that you choose the faces.
Each falls back to a system stack if left unset.

| Variable | Role | Site uses |
|---|---|---|
| `--font-inter` | body and UI | Inter |
| `--font-bebas` | headings | Bebas Neue |
| `--font-space-mono` | labels and code | Space Mono |

## Entry points

`@jarylozh/ui` is framework free. `@jarylozh/ui/next` holds the two components
that import from Next.js, so the main entry installs cleanly in any React app.

```tsx
import { Button, IndexList, Section, SectionHeading } from "@jarylozh/ui";
import { ArrowLink, Portrait } from "@jarylozh/ui/next";
```

## Components

| Entry | Components |
|---|---|
| Layout | `Section`, `Container`, `SectionHeading`, `PageHero`, `Split`, `Columns`, `Separator`, `pageGutter` |
| Lists | `DividedList`, `DividedItem`, `IndexList`, `StatGrid` |
| Typography | `Eyebrow`, `MetaRow`, `EntryTitle`, `BodyText`, `ExternalLink` |
| Actions | `Button`, `buttonVariants`, `Tag`, `TagButton`, `TagList` |
| Forms | `Field`, `FieldHeader`, `FieldLabel`, `FieldHint`, `FieldError`, `Input`, `Textarea` |
| Containers | `Card` and its slots, `NavigationMenu` and its parts |
| Motion | `FadeIn` |
| Utility | `cn` |
| `/next` | `ArrowLink`, `Portrait` |
