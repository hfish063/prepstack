"use client";

import { useAuth } from "@clerk/nextjs";
import { useEffect, useRef, useState } from "react";
import { ArrowUp } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/ui/spinner";
import { Message, sendMessage } from "@/app/api/messages";

type ChatPanelProps = {
  phaseId: number;
  initialMessages: Message[];
};

export default function ChatPanel({ phaseId, initialMessages }: ChatPanelProps) {
  const { getToken } = useAuth();
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, sending]);

  async function handleSubmit(e: React.SubmitEvent<HTMLFormElement>) {
    e.preventDefault();

    const content = input.trim();
    if (!content || sending) return;

    setError(null);
    setInput("");
    setSending(true);
    setMessages((prev) => [
      ...prev,
      {
        id: Date.now(),
        phaseId,
        role: "user",
        content,
        createdAt: new Date().toISOString(),
      },
    ]);

    try {
      const token = await getToken();
      if (!token) throw new Error("Unauthenticated");

      const assistantMessage = await sendMessage(token, phaseId, content);
      setMessages((prev) => [...prev, assistantMessage]);
    } catch {
      setError("Something went wrong sending your message. Please try again.");
    } finally {
      setSending(false);
    }
  }

  return (
    <div className="flex h-full min-h-0 flex-col gap-4">
      <div className="flex min-h-0 flex-1 flex-col gap-3 overflow-y-auto pr-1">
        {messages.map((message) => (
          <ChatBubble key={message.id} message={message} />
        ))}
        {sending && (
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Spinner />
            Thinking...
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {error && <p className="text-sm text-destructive">{error}</p>}

      <form onSubmit={handleSubmit} className="flex gap-2">
        <Input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type your response..."
          disabled={sending}
          autoFocus
        />
        <Button type="submit" size="icon" disabled={sending || !input.trim()}>
          {sending ? <Spinner /> : <ArrowUp />}
        </Button>
      </form>
    </div>
  );
}

type ChatBubbleProps = {
  message: Message;
};

function ChatBubble({ message }: ChatBubbleProps) {
  const isUser = message.role === "user";

  return (
    <div className={cn("flex", isUser ? "justify-end" : "justify-start")}>
      <div
        className={cn(
          "max-w-[75%] rounded-xl px-3 py-2 text-sm",
          isUser ? "bg-primary text-primary-foreground" : "bg-muted text-foreground",
        )}
      >
        {message.content}
      </div>
    </div>
  );
}
