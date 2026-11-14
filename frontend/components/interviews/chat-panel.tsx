"use client";

import { useState } from "react";
import { ArrowUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/ui/spinner";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Message as MessageData } from "@/app/api/messages";
import { useMessages } from "@/hooks/use-messages";
import {
  MessageScrollerProvider,
  MessageScroller,
  MessageScrollerViewport,
  MessageScrollerContent,
  MessageScrollerItem,
  MessageScrollerButton,
} from "@/components/ui/message-scroller";
import { Message, MessageContent } from "@/components/ui/message";
import { Bubble, BubbleContent } from "@/components/ui/bubble";

type ChatPanelProps = {
  phaseId: number;
  initialMessages: MessageData[];
};

export default function ChatPanel({
  phaseId,
  initialMessages,
}: ChatPanelProps) {
  const { sendMessage } = useMessages();
  const [messages, setMessages] = useState<MessageData[]>(initialMessages);
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);

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
      const assistantMessage = await sendMessage(phaseId, content);
      setMessages((prev) => [...prev, assistantMessage]);
    } catch {
      setError("Something went wrong sending your message. Please try again.");
    } finally {
      setSending(false);
    }
  }

  return (
    <Card className="flex h-full min-h-0 flex-col p-0 gap-0">
      <MessageScrollerProvider autoScroll>
        <MessageScroller className="min-h-0 flex-1">
          <MessageScrollerViewport className="p-4">
            <MessageScrollerContent>
              {messages.map((message) => (
                <MessageScrollerItem
                  key={message.id}
                  messageId={String(message.id)}
                >
                  <Message align={message.role === "user" ? "end" : "start"}>
                    <MessageContent>
                      <Bubble
                        align={message.role === "user" ? "end" : "start"}
                        variant={message.role === "user" ? "default" : "muted"}
                      >
                        <BubbleContent>{message.content}</BubbleContent>
                      </Bubble>
                    </MessageContent>
                  </Message>
                </MessageScrollerItem>
              ))}
              {sending && (
                <MessageScrollerItem>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Spinner />
                    Thinking...
                  </div>
                </MessageScrollerItem>
              )}
            </MessageScrollerContent>
          </MessageScrollerViewport>
          <MessageScrollerButton />
        </MessageScroller>
      </MessageScrollerProvider>

      <Separator />

      {error && <p className="text-sm text-destructive px-4">{error}</p>}

      <form onSubmit={handleSubmit} className="flex gap-2 p-8">
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
    </Card>
  );
}
