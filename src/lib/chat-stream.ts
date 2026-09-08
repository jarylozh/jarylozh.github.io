export type ChatMessage = {
  role: "user" | "assistant";
  content: string;
};

const CHAT_API_URL =
  process.env.NEXT_PUBLIC_CHAT_API_URL || "http://localhost:4000/v1/chat";

const MAX_HISTORY_TURNS = 6;

type StreamChatOptions = {
  message: string;
  history: ChatMessage[];
  signal: AbortSignal;
  onDelta: (delta: string) => void;
};

type Frame = {
  name: string;
  data: string;
};

/**
 * Posts a question to the chat API and calls onDelta for each streamed token.
 * Resolves when the stream ends, throws on transport or in-stream errors.
 */
export async function streamChat({
  message,
  history,
  signal,
  onDelta,
}: StreamChatOptions): Promise<void> {
  const response = await fetch(CHAT_API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      message,
      history: history.slice(-MAX_HISTORY_TURNS * 2),
    }),
    signal,
  });

  if (!response.ok || !response.body) {
    throw new Error(`the assistant is unavailable (${response.status})`);
  }

  const reader = response.body.getReader();
  const decoder = new TextDecoder();
  let buffer = "";

  for (;;) {
    const { done, value } = await reader.read();
    if (done) return;

    buffer += decoder.decode(value, { stream: true });

    const frames = buffer.split("\n\n");
    buffer = frames.pop() ?? "";

    for (const frame of frames) {
      const event = parseFrame(frame);
      if (!event) continue;

      if (event.data === "[DONE]") return;

      if (event.name === "error") {
        throw new Error(readMessage(event.data));
      }

      const delta = readDelta(event.data);
      if (delta) onDelta(delta);
    }
  }
}

/** Parses one SSE frame into its event name and joined data payload. */
function parseFrame(raw: string): Frame | null {
  let name = "message";
  const data: string[] = [];

  for (const line of raw.split("\n")) {
    if (line.trim() === "" || line.startsWith(":")) continue;

    if (line.startsWith("event:")) {
      name = line.slice("event:".length).trim();
    } else if (line.startsWith("data:")) {
      data.push(line.slice("data:".length).trimStart());
    }
  }

  return data.length > 0 ? { name, data: data.join("\n") } : null;
}

function readDelta(data: string): string {
  try {
    return (JSON.parse(data) as { delta?: string }).delta ?? "";
  } catch {
    return "";
  }
}

function readMessage(data: string): string {
  try {
    return (
      (JSON.parse(data) as { message?: string }).message ??
      "the assistant hit an error"
    );
  } catch {
    return "the assistant hit an error";
  }
}
