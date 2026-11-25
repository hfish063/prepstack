import { Prism as SyntaxHighlighter } from "react-syntax-highlighter"
import {
  oneLight,
  vscDarkPlus,
} from "react-syntax-highlighter/dist/esm/styles/prism"
import { useTheme } from "../theme-provider"
import { useState } from "react"
import { Button } from "../ui/button"
import { Check, Copy } from "lucide-react"
import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip"

const CODE_BLOCK_FONT_SIZE = 14
const COPY_TIMEOUT_MS = 2000

type CodeBlockProps = {
  code: string
  language: string
}

export default function CodeBlock({ code, language }: CodeBlockProps) {
  const { resolvedTheme } = useTheme()

  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    await navigator.clipboard.writeText(code)
    setCopied(true)

    setTimeout(() => {
      setCopied(false)
    }, COPY_TIMEOUT_MS)
  }

  return (
    <div className="group relative">
      <Tooltip>
        <TooltipTrigger
          render={
            <Button
              variant={"outline"}
              size={"icon-sm"}
              className="absolute top-4 right-2 z-10 opacity-0 transition-opacity group-hover:opacity-100 focus-visible:opacity-100"
              onClick={handleCopy}
            >
              {copied ? <Check className="text-confirmation" /> : <Copy />}
            </Button>
          }
        />
        <TooltipContent>{copied ? "Copied" : "Copy"}</TooltipContent>
      </Tooltip>
      <SyntaxHighlighter
        language={language.toLowerCase()}
        style={resolvedTheme === "dark" ? vscDarkPlus : oneLight}
        customStyle={{ fontSize: CODE_BLOCK_FONT_SIZE }}
        codeTagProps={{
          style: {
            fontSize: "inherit",
            whiteSpace: "pre-wrap",
            wordBreak: "break-word",
          },
        }}
      >
        {code}
      </SyntaxHighlighter>
    </div>
  )
}
