# portfolio

## 0.2.0

### Minor Changes

- 19b028a: - Added the Askbot project to the Selected Projects section — a streaming chat-based Q&A app exploring LLM-framework internals (OpenAI SDK + FastAPI + Next.js), linking to the GitHub repo with expandable contribution bullets covering token streaming and conversation-memory summarization.
- c566e5e: Rewrote the Vault of Cards contribution bullets in a more casual voice, dropped Askbot's bullets so its description stands alone (personal project, not group work), and added a Certifications section to the homepage. ProjectCard now hides the "Show my contributions" toggle when a project has no bullets.
- 598a836: Initial portfolio scaffold:

  - Typography system using Inter (body) + Bebas Neue (headings) with editorial uppercase tracking; long-form copy renders in Inter Thin (weight 100).
  - Installed shadcn/ui with Base UI primitives; customized `Button` to a flat, uppercase, editorial variant matching the type system.
  - Hero section with name, role + location, description, contact CTAs (mailto + LinkedIn), and a skills/experience strip. Years-of-experience auto-derived from career start year.
  - Professional Experience section pulling ST Engineering roles and achievements from the resume.
  - GSAP-driven scroll fade-in animations via a reusable `<FadeIn>` client component using `useGSAP` + `ScrollTrigger`.
  - Responsive layout: mobile-first sizing, centered hero on small screens, multi-column grid from `md:` upward.

- 1cd636e: - Added a live-site link on the Vault of Cards project entry pointing to `dev.vaultofcards.io` (renders as a small uppercase underlined link with an external-link glyph in the project meta column).
  - Added a third NUS Stackable Graduate Programme module — "Architecting AI Systems" — marked as `In Progress`.
- 6e18687: Added a Resume CTA to the hero, linking to the hosted resume PDF on Google Drive (opens in a new tab).
- 9de9924: Added a site footer with copyright and shadcn/ui credit, a Certifications link in the nav, restyled nav links with the heading font, and extracted a shared `external-link` utility for consistent outbound link styling.
- ac507e9: Added Projects and Education sections, plus a sticky shadcn navigation bar:

  - **Projects section** with a click-to-expand `<ProjectCard>` client component — GSAP-animated height/opacity reveals contribution bullets under the project description.
  - **Education section** mirroring the project layout (NUS MTech with module/status pairs, DigiPen bachelor's degree).
  - **Sticky nav** built on shadcn's `NavigationMenu` (`SiteNav`), mounted from the root layout, with GSAP `ScrollToPlugin` driving a gradual scroll animation between sections.
  - Unified type hierarchy across sections (lede vs body weight/color), bumped contributions weight to `font-light` for readability against pure-white background.

### Patch Changes

- 172e502: Outline buttons now invert (fill with foreground, swap text color) on hover with a smooth 300ms transition for a more tactile feel.
- 06714e3: Updated the Resume button to point at the current Google Drive link.
- Updated dependencies [3a348b5]
- Updated dependencies [3a348b5]
  - @jarylozh/ui@0.1.0
