"use client";

import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type KeyboardEvent,
} from "react";
import Link from "next/link";
import Image from "next/image";
import gsap from "gsap";

import { FadeIn } from "@/components/fade-in";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Card, CardContent } from "@/components/ui/card";
import {
  findProjects,
  ProjectPreview,
} from "@/components/chat/project-preview";
import { ResumeCard } from "@/components/chat/resume-card";
import {
  linkToken,
  parseReply,
  segmentParagraph,
  splitParagraphs,
} from "@/lib/chat-cards";
import { portfolio } from "@/lib/portfolio";
import { streamChat, type ChatMessage } from "@/lib/chat-stream";

const SUGGESTIONS = [
  { label: "About me", question: "Who are you and what do you do?" },
  {
    label: "ST Engineering",
    question: "What have you worked on at ST Engineering?",
  },
  { label: "Studies at NUS", question: "What are you studying at NUS?" },
  {
    label: "Vault of Cards",
    question: "Tell me about the Vault of Cards project.",
  },
];

const TEXTAREA_MAX_HEIGHT = 96;

const CHIP_STAGGER_MS = 70;

const TRANSCRIPT_GAP_PX = 24;

const REVEAL_INTERVAL_MS = 35;

const REVEAL_CATCHUP_CHARS = 240;

const PROJECT_IDS = portfolio.projects.map((project) => project.id);

const AVATAR_PX = 192;

const FADE_IN =
  "animate-in duration-700 ease-out fade-in blur-in-2 motion-reduce:animate-none";

const LINK =
  "normal-case tracking-normal underline underline-offset-4 transition-opacity hover:opacity-70";

// Links are withheld while their token is still arriving, so a half-formed url
// or an unclosed [label]( never shows.
function renderTokens(paragraph: string, streamingTail: boolean) {
  const segments = segmentParagraph(paragraph, streamingTail);
  const lastSegment = segments.length - 1;

  return segments.flatMap((segment, segmentIndex) => {
    if (segment.kind === "link") {
      return [
        <span key={`link-${segmentIndex}`} className={FADE_IN}>
          <a
            href={segment.href}
            target="_blank"
            rel="noopener noreferrer"
            className={LINK}
          >
            {segment.label}
          </a>
        </span>,
      ];
    }

    const parts = segment.text.split(/(\s+)/);

    return parts.map((part, partIndex) => {
      const isTail =
        streamingTail &&
        segmentIndex === lastSegment &&
        partIndex === parts.length - 1;
      const link = isTail ? null : linkToken(part);

      return (
        <span key={`text-${segmentIndex}-${partIndex}`} className={FADE_IN}>
          {link ? (
            <>
              <a
                href={link.href}
                {...(link.external
                  ? { target: "_blank", rel: "noopener noreferrer" }
                  : {})}
                className={LINK}
              >
                {link.label}
              </a>
              {link.trailing}
            </>
          ) : (
            part
          )}
        </span>
      );
    });
  });
}

export function ChatPanel() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [isStreaming, setIsStreaming] = useState(false);
  const [isRevealing, setIsRevealing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const messagesRef = useRef<ChatMessage[]>([]);
  const bufferRef = useRef("");
  const streamDoneRef = useRef(true);
  const abortRef = useRef<AbortController | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const transcriptRef = useRef<HTMLDivElement>(null);
  const headingRef = useRef<HTMLDivElement>(null);
  const chipsRef = useRef<HTMLDivElement>(null);

  const hasMessages = messages.length > 0;
  const isBusy = isStreaming || isRevealing;

  // Cards accumulate over the conversation rather than per message.
  const cards = useMemo(() => {
    const projectIds: string[] = [];

    for (const message of messages) {
      if (message.role !== "assistant") continue;

      const parsed = parseReply(message.content, PROJECT_IDS);
      for (const id of parsed.projectIds) {
        if (!projectIds.includes(id)) projectIds.push(id);
      }
    }

    return findProjects(projectIds);
  }, [messages]);

  const hasCards = cards.length > 0;

  const [cardsOpen, setCardsOpen] = useState(true);
  const [seenCardCount, setSeenCardCount] = useState(0);

  // A newly raised card reopens the overlay so it is not missed. Adjusting
  // during render avoids the extra commit an effect would cost.
  if (cards.length !== seenCardCount) {
    setSeenCardCount(cards.length);
    if (cards.length > seenCardCount) setCardsOpen(true);
  }

  const appendDelta = useCallback((delta: string) => {
    setMessages((prev) => {
      const last = prev.at(-1);
      if (last?.role !== "assistant") return prev;
      return [...prev.slice(0, -1), { ...last, content: last.content + delta }];
    });
  }, []);

  useEffect(() => {
    messagesRef.current = messages;
  }, [messages]);

  useEffect(() => {
    const el = scrollRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [messages]);

  // Deltas arrive in bursts, so drain the buffer a word at a time on a fixed
  // interval and let the text appear at a steady pace.
  useEffect(() => {
    if (!isRevealing) return;

    const id = window.setInterval(() => {
      const buffer = bufferRef.current;

      if (buffer === "") {
        if (streamDoneRef.current) setIsRevealing(false);
        return;
      }

      const words = Math.max(
        1,
        Math.ceil(buffer.length / REVEAL_CATCHUP_CHARS),
      );

      let cut = 0;
      for (let taken = 0; taken < words && cut < buffer.length; taken++) {
        const next = buffer.indexOf(" ", cut + 1);
        cut = next === -1 ? buffer.length : next + 1;
      }

      bufferRef.current = buffer.slice(cut);
      appendDelta(buffer.slice(0, cut));
    }, REVEAL_INTERVAL_MS);

    return () => window.clearInterval(id);
  }, [isRevealing, appendDelta]);

  useEffect(() => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = `${Math.min(el.scrollHeight, TEXTAREA_MAX_HEIGHT)}px`;
  }, [input]);

  useEffect(() => () => abortRef.current?.abort(), []);

  useEffect(() => {
    const el = transcriptRef.current;
    if (!el || !hasMessages) return;

    gsap.fromTo(
      el,
      { height: 0, opacity: 0, marginBottom: 0 },
      {
        height: "auto",
        opacity: 1,
        marginBottom: TRANSCRIPT_GAP_PX,
        duration: 0.5,
        ease: "power2.out",
        onComplete: () => {
          el.style.height = "auto";
        },
      },
    );
  }, [hasMessages]);

  useEffect(() => {
    if (!hasMessages) return;

    const targets = [headingRef.current, chipsRef.current].filter(Boolean);
    if (targets.length === 0) return;

    gsap.to(targets, {
      height: 0,
      opacity: 0,
      marginTop: 0,
      marginBottom: 0,
      paddingTop: 0,
      paddingBottom: 0,
      duration: 0.45,
      ease: "power2.inOut",
    });
  }, [hasMessages]);

  const send = useCallback(
    async (question: string) => {
      const trimmed = question.trim();
      if (!trimmed || isBusy) return;

      const history = messagesRef.current;

      setError(null);
      setInput("");
      setMessages([
        ...history,
        { role: "user", content: trimmed },
        { role: "assistant", content: "" },
      ]);
      setIsStreaming(true);

      bufferRef.current = "";
      streamDoneRef.current = false;
      setIsRevealing(true);

      const controller = new AbortController();
      abortRef.current = controller;

      try {
        await streamChat({
          message: trimmed,
          history,
          signal: controller.signal,
          onDelta: (delta) => {
            bufferRef.current += delta;
          },
        });
      } catch (err) {
        if (!(err instanceof DOMException && err.name === "AbortError")) {
          setError(err instanceof Error ? err.message : "something went wrong");
        }
      } finally {
        abortRef.current = null;
        streamDoneRef.current = true;
        setIsStreaming(false);

        // The pacer may still be draining, so only prune once nothing is left.
        if (bufferRef.current === "") {
          setMessages((prev) => {
            const last = prev.at(-1);
            const isEmpty = last?.role === "assistant" && last.content === "";
            return isEmpty ? prev.slice(0, -1) : prev;
          });
        }
      }
    },
    [isBusy],
  );

  function handleKeyDown(event: KeyboardEvent<HTMLTextAreaElement>) {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      void send(input);
    }
  }

  return (
    <section
      className={cn(
        "flex min-h-svh flex-col justify-end px-4 pb-6 sm:justify-center sm:px-8 sm:py-16 md:px-12 lg:px-24",
        hasMessages ? "pt-4" : "pt-12",
      )}
    >
      <div
        className={cn(
          "mx-auto flex w-full max-w-3xl flex-col transition-[max-width] duration-700 ease-out lg:flex-row lg:items-start",
          hasCards && "lg:max-w-[70rem]",
          // Once the heading collapses its auto margins are gone, so stop
          // stretching or the block rides to the top on mobile.
          !hasMessages && "flex-1 sm:flex-none",
        )}
      >
        <FadeIn stagger={0.12} className="flex min-w-0 flex-1 flex-col">
          <div
            ref={headingRef}
            className="my-auto overflow-hidden text-center sm:my-0 sm:pb-8"
          >
            <Image
              src="/avatar.jpeg"
              alt="Jaryl Ong"
              width={AVATAR_PX}
              height={AVATAR_PX}
              priority
              className="mx-auto size-24 animate-in object-cover mix-blend-multiply duration-1000 ease-out fade-in blur-in-2 motion-reduce:animate-none sm:size-28"
            />

            <h1 className="mt-4 animate-in text-3xl leading-[1.05] duration-1000 delay-150 ease-out fade-in fill-mode-backwards motion-reduce:animate-none sm:text-5xl md:text-6xl">
              Ask me anything
            </h1>
          </div>

          <div ref={transcriptRef} className="h-0 overflow-hidden opacity-0">
            {hasMessages && (
              <Card className="ring-foreground/15">
                <CardContent
                  ref={scrollRef}
                  className="flex max-h-[calc(100svh_-_12rem)] flex-col items-stretch gap-4 overflow-y-auto sm:max-h-[55svh]"
                >
                  {messages.map((message, index) => {
                    const reply =
                      message.role === "assistant"
                        ? parseReply(message.content, PROJECT_IDS)
                        : {
                            text: message.content,
                            projectIds: [],
                            resume: false,
                          };
                    const isUser = message.role === "user";

                    return (
                      <article
                        key={index}
                        className={cn(
                          "flex animate-in max-w-[85%] flex-col gap-2 duration-300 fade-in slide-in-from-bottom-2 motion-reduce:animate-none",
                          isUser
                            ? "self-end items-end"
                            : "self-start items-start",
                        )}
                      >
                        {/* Side and colour carry the speaker visually. */}
                        <span className="sr-only">
                          {isUser ? "You said" : "Jaryl said"}
                        </span>
                        <div
                          aria-live={isUser ? undefined : "polite"}
                          className={cn(
                            "flex flex-col gap-3 px-3 py-2 text-sm leading-relaxed sm:text-base",
                            isUser
                              ? "bg-foreground text-background"
                              : "bg-muted text-foreground",
                          )}
                        >
                          {splitParagraphs(
                            isUser ? message.content : reply.text,
                          ).map((paragraph, paragraphIndex, paragraphs) => (
                            <p
                              key={paragraphIndex}
                              className="whitespace-pre-wrap font-normal"
                            >
                              {isUser
                                ? paragraph
                                : renderTokens(
                                    paragraph,
                                    isBusy &&
                                      index === messages.length - 1 &&
                                      paragraphIndex === paragraphs.length - 1,
                                  )}
                              {isBusy &&
                                !isUser &&
                                index === messages.length - 1 &&
                                paragraphIndex === paragraphs.length - 1 && (
                                  <span
                                    aria-hidden
                                    className="ml-1 inline-block h-3.5 w-0.5 animate-pulse bg-foreground/40 align-text-bottom"
                                  />
                                )}
                            </p>
                          ))}
                        </div>

                        {reply.resume && <ResumeCard />}
                      </article>
                    );
                  })}

                  {error && (
                    <p className="animate-in text-sm font-normal leading-relaxed text-destructive duration-300 fade-in motion-reduce:animate-none">
                      {error}
                    </p>
                  )}
                </CardContent>
              </Card>
            )}
          </div>

          <div className="flex flex-col-reverse sm:flex-col">
            <form
              onSubmit={(event) => {
                event.preventDefault();
                void send(input);
              }}
              className="flex w-full flex-col gap-2 bg-card px-3 py-2 ring-1 ring-foreground/15 transition-shadow duration-300 focus-within:ring-foreground/40 sm:flex-row sm:items-center sm:px-4"
            >
              <textarea
                ref={textareaRef}
                rows={1}
                value={input}
                onChange={(event) => setInput(event.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Ask about my work, projects, or education…"
                aria-label="Your question"
                className="w-full resize-none bg-transparent px-2 py-1.5 text-sm font-normal leading-relaxed text-foreground outline-none placeholder:text-foreground/40 sm:flex-1 sm:text-base"
              />

              {isStreaming ? (
                <Button
                  type="button"
                  variant="outline"
                  className="shrink-0 self-end sm:self-auto"
                  onClick={() => {
                    bufferRef.current = "";
                    streamDoneRef.current = true;
                    setIsRevealing(false);
                    abortRef.current?.abort();
                  }}
                >
                  Stop
                </Button>
              ) : (
                <Button
                  type="submit"
                  className="shrink-0 self-end sm:self-auto"
                  disabled={input.trim() === "" || isBusy}
                >
                  Enter
                </Button>
              )}
            </form>

            <div
              ref={chipsRef}
              className="mb-3 overflow-hidden sm:mb-0 sm:mt-6"
            >
              <div className="flex flex-wrap gap-2 sm:justify-center">
                {SUGGESTIONS.map((suggestion, index) => (
                  <button
                    key={suggestion.label}
                    type="button"
                    onClick={() => void send(suggestion.question)}
                    style={{ animationDelay: `${index * CHIP_STAGGER_MS}ms` }}
                    className="animate-in border border-foreground/15 px-3 py-1 text-xs font-normal normal-case tracking-normal text-foreground/70 duration-500 fade-in fill-mode-backwards slide-in-from-bottom-1 transition-colors hover:border-foreground hover:bg-foreground hover:text-background motion-reduce:animate-none"
                  >
                    {suggestion.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="mt-4 flex justify-end">
            <Link
              href="/portfolio"
              className="text-xs normal-case tracking-normal text-foreground/50 underline-offset-4 transition-colors hover:text-foreground hover:underline"
            >
              Or just read my portfolio <span aria-hidden>&rarr;</span>
            </Link>
          </div>
        </FadeIn>

        <aside
          aria-label="Project cards"
          className={cn(
            "z-40 shrink-0 flex-col border border-foreground/15 bg-card shadow-lg transition-[width,margin] duration-700 ease-out",
            // Overlays the transcript on small screens, sits beside it on large.
            "fixed inset-x-4 top-4",
            "lg:static lg:inset-auto lg:z-auto lg:w-0 lg:border-0 lg:bg-transparent lg:shadow-none",
            hasCards ? "flex lg:ml-10 lg:w-80" : "hidden lg:flex",
          )}
        >
          <button
            type="button"
            onClick={() => setCardsOpen((open) => !open)}
            aria-expanded={cardsOpen}
            className="flex items-center justify-between gap-3 px-3 py-2 text-xs text-foreground/60 transition-colors hover:text-foreground lg:hidden"
          >
            <span>
              {cards.length === 1 ? "1 project" : `${cards.length} projects`}
            </span>
            <span aria-hidden>{cardsOpen ? "\u2212" : "+"}</span>
          </button>

          <div
            className={cn(
              "flex-col gap-3 overflow-y-auto p-3 pt-0 lg:flex lg:max-h-[70svh] lg:p-0",
              cardsOpen ? "flex max-h-[60svh]" : "hidden",
            )}
          >
            {cards.map((project) => (
              <ProjectPreview key={project.id} project={project} />
            ))}
          </div>
        </aside>
      </div>
    </section>
  );
}
