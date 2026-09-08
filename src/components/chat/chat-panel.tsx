"use client";

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type KeyboardEvent,
} from "react";
import Link from "next/link";
import gsap from "gsap";

import { FadeIn } from "@/components/fade-in";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
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

export function ChatPanel() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [isStreaming, setIsStreaming] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const messagesRef = useRef<ChatMessage[]>([]);
  const abortRef = useRef<AbortController | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const transcriptRef = useRef<HTMLDivElement>(null);
  const headingRef = useRef<HTMLDivElement>(null);
  const chipsRef = useRef<HTMLDivElement>(null);

  const hasMessages = messages.length > 0;

  useEffect(() => {
    messagesRef.current = messages;
  }, [messages]);

  useEffect(() => {
    const el = scrollRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [messages]);

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

  const appendDelta = useCallback((delta: string) => {
    setMessages((prev) => {
      const last = prev.at(-1);
      if (last?.role !== "assistant") return prev;
      return [...prev.slice(0, -1), { ...last, content: last.content + delta }];
    });
  }, []);

  const send = useCallback(
    async (question: string) => {
      const trimmed = question.trim();
      if (!trimmed || isStreaming) return;

      const history = messagesRef.current;

      setError(null);
      setInput("");
      setMessages([
        ...history,
        { role: "user", content: trimmed },
        { role: "assistant", content: "" },
      ]);
      setIsStreaming(true);

      const controller = new AbortController();
      abortRef.current = controller;

      try {
        await streamChat({
          message: trimmed,
          history,
          signal: controller.signal,
          onDelta: appendDelta,
        });
      } catch (err) {
        if (!(err instanceof DOMException && err.name === "AbortError")) {
          setError(err instanceof Error ? err.message : "something went wrong");
        }
      } finally {
        abortRef.current = null;
        setIsStreaming(false);
        setMessages((prev) => {
          const last = prev.at(-1);
          const isEmptyReply =
            last?.role === "assistant" && last.content === "";
          return isEmptyReply ? prev.slice(0, -1) : prev;
        });
      }
    },
    [appendDelta, isStreaming],
  );

  function handleKeyDown(event: KeyboardEvent<HTMLTextAreaElement>) {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      void send(input);
    }
  }

  return (
    <section className="flex min-h-svh flex-col justify-end px-4 pb-6 pt-12 sm:justify-center sm:px-8 sm:py-16 md:px-12 lg:px-24">
      <FadeIn
        stagger={0.12}
        className="mx-auto flex w-full max-w-3xl flex-1 flex-col sm:flex-none"
      >
        <div
          ref={headingRef}
          className="my-auto overflow-hidden text-center sm:my-0 sm:pb-8"
        >
          <h1 className="mt-2 text-3xl leading-[1.05] sm:text-5xl md:text-6xl">
            Ask me anything
          </h1>
        </div>

        <div ref={transcriptRef} className="h-0 overflow-hidden opacity-0">
          {hasMessages && (
            <Card className="ring-foreground/15">
              <CardContent
                ref={scrollRef}
                className="flex max-h-[50svh] flex-col gap-5 overflow-y-auto sm:max-h-[55svh] sm:gap-6"
              >
                {messages.map((message, index) => (
                  <article
                    key={index}
                    className="flex animate-in flex-col gap-2 border-t border-foreground/10 pt-4 duration-300 fade-in slide-in-from-bottom-2 first:border-t-0 first:pt-0 motion-reduce:animate-none"
                  >
                    <span className="text-xs text-foreground/40">
                      {message.role === "user" ? "You" : "Jaryl"}
                    </span>
                    <p
                      aria-live={
                        message.role === "assistant" ? "polite" : undefined
                      }
                      className="whitespace-pre-wrap text-sm font-normal leading-relaxed text-foreground sm:text-base"
                    >
                      {message.content}
                      {isStreaming &&
                        index === messages.length - 1 &&
                        message.role === "assistant" && (
                          <span
                            aria-hidden
                            className="ml-0.5 inline-block h-3.5 w-1.5 animate-pulse bg-foreground/60 align-text-bottom"
                          />
                        )}
                    </p>
                  </article>
                ))}

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
                onClick={() => abortRef.current?.abort()}
              >
                Stop
              </Button>
            ) : (
              <Button
                type="submit"
                className="shrink-0 self-end sm:self-auto"
                disabled={input.trim() === ""}
              >
                Enter
              </Button>
            )}
          </form>

          <div ref={chipsRef} className="mb-3 overflow-hidden sm:mb-0 sm:mt-6">
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
    </section>
  );
}
