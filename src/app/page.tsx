import type { Metadata } from "next";

import { ChatPanel } from "@/components/chat/chat-panel";
import { SiteFooter } from "@/components/site-footer";

export const metadata: Metadata = {
  title: "Ask me anything · Jaryl Ong",
  description:
    "Ask a chatbot about Jaryl Ong's work, projects, and experience.",
};

export default function Home() {
  return (
    <>
      <ChatPanel />
      <SiteFooter />
    </>
  );
}
