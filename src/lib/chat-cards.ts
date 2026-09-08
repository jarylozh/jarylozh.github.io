const PROJECT_MARKER = /[ \t]*\[\[project:([a-z0-9-]+)\]\]/g;

const RESUME_MARKER = /[ \t]*\[\[resume\]\]/g;

const PARTIAL_MARKER = /[ \t]*\[\[?[a-z0-9:-]*\]?$/;

export type ParsedReply = {
  text: string;
  projectIds: string[];
  resume: boolean;
};

/**
 * Splits card markers out of a streamed reply. Complete markers become ids,
 * and a trailing partial marker is withheld so it never flashes on screen.
 */
export function parseReply(content: string, knownIds: string[]): ParsedReply {
  const projectIds: string[] = [];

  let resume = false;

  let text = content.replace(RESUME_MARKER, () => {
    resume = true;
    return "";
  });

  text = text.replace(PROJECT_MARKER, (_match, id: string) => {
    if (knownIds.includes(id) && !projectIds.includes(id)) {
      projectIds.push(id);
    }
    return "";
  });

  text = text.replace(PARTIAL_MARKER, "");

  return { text: text.trimEnd(), projectIds, resume };
}

/** Splits a reply into paragraphs on blank lines, always returning at least one. */
export function splitParagraphs(text: string): string[] {
  const paragraphs = text
    .split(/\n{2,}/)
    .map((paragraph) => paragraph.trim())
    .filter((paragraph) => paragraph !== "");

  return paragraphs.length > 0 ? paragraphs : [""];
}

const URL_TOKEN = /^(https?:\/\/|www\.)\S+$/i;

const EMAIL_TOKEN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const TRAILING_PUNCTUATION = /[.,;:!?)\]}'"]+$/;

export type TokenLink = {
  href: string;
  label: string;
  trailing: string;
  external: boolean;
};

/**
 * Reads a whitespace-delimited token as a link. Trailing punctuation is
 * returned separately so it stays out of the href.
 */
export function linkToken(token: string): TokenLink | null {
  const punctuation = token.match(TRAILING_PUNCTUATION)?.[0] ?? "";
  const core = punctuation ? token.slice(0, -punctuation.length) : token;

  if (URL_TOKEN.test(core)) {
    const href = core.toLowerCase().startsWith("www.")
      ? `https://${core}`
      : core;
    return { href, label: core, trailing: punctuation, external: true };
  }

  if (EMAIL_TOKEN.test(core)) {
    return {
      href: `mailto:${core}`,
      label: core,
      trailing: punctuation,
      external: false,
    };
  }

  return null;
}
