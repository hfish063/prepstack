"use client";

import { useRef, useState } from "react";
import { ArrowUp, Bot, Lightbulb, User } from "lucide-react";
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
import {
  Message,
  MessageAvatar,
  MessageContent,
} from "@/components/ui/message";
import { Bubble, BubbleContent } from "@/components/ui/bubble";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupTextarea,
} from "../ui/input-group";
import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip";

type ChatPanelProps = {
  phaseId: number;
  questionId: number;
  initialMessages: MessageData[];
};

export default function ChatPanel({
  phaseId,
  questionId,
  initialMessages,
}: ChatPanelProps) {
  const { sendMessage } = useMessages();
  const [messages, setMessages] = useState<MessageData[]>(initialMessages);
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const formRef = useRef<HTMLFormElement>(null);

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
        questionId,
        role: "user",
        content,
        createdAt: new Date().toISOString(),
      },
    ]);

    try {
      const assistantMessage = await sendMessage(questionId, content);
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
                    <MessageAvatar>
                      <Avatar>
                        <AvatarFallback>
                          {message.role === "user" ? (
                            <User className="size-4" />
                          ) : (
                            <Bot className="size-4" />
                          )}
                        </AvatarFallback>
                      </Avatar>
                    </MessageAvatar>
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

      {error && <p className="text-sm text-destructive px-4 pt-4">{error}</p>}

      <form onSubmit={handleSubmit} ref={formRef} className="flex gap-2 p-8">
        <InputGroup>
          <InputGroupTextarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type your response..."
            aria-label="Message"
            className="min-h-14"
            onKeyDown={(event) => {
              if (event.key === "Enter" && !event.shiftKey) {
                event.preventDefault();
                formRef.current?.requestSubmit();
              }
            }}
            disabled={sending}
            autoFocus
          />
          <InputGroupAddon align={"block-end"}>
            <Tooltip>
              <TooltipTrigger
                render={
                  <InputGroupButton variant={"outline"} size={"icon-sm"}>
                    <Lightbulb className="text-yellow-500" />
                  </InputGroupButton>
                }
              />
              <TooltipContent>Ask for Hint</TooltipContent>
            </Tooltip>
            <InputGroupButton
              type="submit"
              variant={"default"}
              size={"icon-sm"}
              className="ml-auto"
              disabled={sending || !input.trim()}
            >
              {sending ? <Spinner /> : <ArrowUp />}
            </InputGroupButton>
          </InputGroupAddon>
        </InputGroup>
      </form>
    </Card>
  );
}
