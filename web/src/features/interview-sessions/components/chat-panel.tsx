import { useRef, useState } from "react"
import { ArrowUp, Bot, Lightbulb, User } from "lucide-react"
import { Spinner } from "@/components/ui/spinner"
import { Card } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import {
  MessageScrollerProvider,
  MessageScroller,
  MessageScrollerViewport,
  MessageScrollerContent,
  MessageScrollerItem,
  MessageScrollerButton,
} from "@/components/ui/message-scroller"
import { Message, MessageAvatar, MessageContent } from "@/components/ui/message"
import { Bubble, BubbleContent } from "@/components/ui/bubble"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { useSendMessage } from "@/features/messages/hooks/use-send-message"
import { useRequestHint } from "@/features/messages/hooks/use-request-hint"
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupTextarea,
} from "@/components/ui/input-group"
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
} from "@/components/ui/tooltip"
import { useMessages } from "@/features/messages/hooks/use-messages"
import { toast } from "@/components/ui/toast"
import type { MessageKind, MessageRole } from "@/lib/api/generated"

type ChatPanelProps = {
  questionId: number
}

export default function ChatPanel({ questionId }: ChatPanelProps) {
  const { data: messages } = useMessages(questionId)
  const sendMessage = useSendMessage({
    mutationConfig: {
      onError: () =>
        toast.add({
          type: "error",
          description:
            "Something went wrong sending your message. Please try again.",
        }),
    },
  })
  const requestHint = useRequestHint()
  const [input, setInput] = useState("")
  const sending = sendMessage.isPending || requestHint.isPending

  const formRef = useRef<HTMLFormElement>(null)

  async function handleSubmit(e: React.SubmitEvent<HTMLFormElement>) {
    e.preventDefault()

    const content = input.trim()
    if (!content || sending) return

    setInput("")
    sendMessage.mutate({ path: { question_id: questionId }, body: { content } })
  }

  async function handleHintRequest() {
    if (sending) return

    requestHint.mutate({ path: { question_id: questionId } })
  }

  return (
    <Card className="flex min-h-0 flex-1 flex-col gap-0 p-0">
      <MessageScrollerProvider autoScroll>
        <MessageScroller className="min-h-0 flex-1">
          <MessageScrollerViewport className="p-4">
            <MessageScrollerContent>
              {messages.map((message) => (
                <MessageScrollerItem
                  key={message.id}
                  messageId={String(message.id)}
                >
                  <ChatMessage
                    role={message.role}
                    kind={message.kind}
                    content={message.content}
                  />
                </MessageScrollerItem>
              ))}
              {sendMessage.isPending && (
                <ChatMessage
                  role={"user"}
                  kind={"message"}
                  content={sendMessage.variables.body.content}
                />
              )}
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

      <form onSubmit={handleSubmit} ref={formRef} className="flex gap-2 p-4">
        <InputGroup>
          <InputGroupTextarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type your response..."
            aria-label="Message"
            className="min-h-14"
            onKeyDown={(event) => {
              if (event.key === "Enter" && !event.shiftKey) {
                event.preventDefault()
                formRef.current?.requestSubmit()
              }
            }}
            disabled={sending}
            autoFocus
          />
          <InputGroupAddon align={"block-end"}>
            <Tooltip>
              <TooltipTrigger
                render={
                  <InputGroupButton
                    variant={"outline"}
                    size={"icon-sm"}
                    onClick={handleHintRequest}
                    disabled={sending}
                  >
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
  )
}

type ChatMessageProps = {
  role: MessageRole
  kind: MessageKind
  content: string
}

function ChatMessage({ role, kind, content }: ChatMessageProps) {
  return (
    <Message align={role === "user" ? "end" : "start"}>
      <MessageAvatar>
        <Avatar>
          <AvatarFallback>
            {role === "user" ? (
              <User className="size-4" />
            ) : kind === "hint" ? (
              <Lightbulb className="size-4 text-yellow-500" />
            ) : (
              <Bot className="size-4" />
            )}
          </AvatarFallback>
        </Avatar>
      </MessageAvatar>
      <MessageContent>
        <Bubble
          align={role === "user" ? "end" : "start"}
          variant={role === "user" ? "default" : "muted"}
        >
          <BubbleContent>{content}</BubbleContent>
        </Bubble>
      </MessageContent>
    </Message>
  )
}
