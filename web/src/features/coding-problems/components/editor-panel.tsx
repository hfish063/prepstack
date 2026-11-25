import { Editor } from "@monaco-editor/react"
import {
  ChevronDown,
  ChevronUp,
  CloudUpload,
  CodeXml,
  Play,
  RotateCcw,
} from "lucide-react"
import { useState } from "react"

import EditorConsole from "./editor-console"
import type {
  ProblemExampleRead,
  ProblemSubmissionSummaryRead,
  SubmissionResultRead,
} from "@/lib/api/generated"
import { useCodingProblem } from "../hooks/use-coding-problem"
import { useEditorDraft } from "../hooks/use-editor-draft"
import { useLanguageTemplate } from "../hooks/use-language-template"
import { useRunCode } from "../hooks/use-run-code"
import { useSubmitCode } from "../hooks/use-submit-code"
import { getPreferredLanguage } from "../utils/utils"
import { useTheme } from "@/components/theme-provider"
import { toast } from "@/components/ui/toast"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable"
import { Spinner } from "@/components/ui/spinner"
import EditorPanelConfigurationMenu from "./editor-config-menu"

const DEFAULT_FONT_SIZE = 14
const DEFAULT_TAB_SIZE = 4
const DEFAULT_WORD_WRAP = true

const EDITOR_PANEL_SIZE_PERCENT = 50
const CONSOLE_PANEL_SIZE_PERCENT = 50

export type ExecutionResult =
  | {
      type: "run"
      data: SubmissionResultRead[]
      examples: ProblemExampleRead[]
    }
  | { type: "submission"; data: ProblemSubmissionSummaryRead }

type EditorPanelProps = {
  phaseId: number
  onSubmitted: () => void
}

export default function EditorPanel({
  phaseId,
  onSubmitted,
}: EditorPanelProps) {
  const { data: codingProblem } = useCodingProblem(phaseId)
  const language = getPreferredLanguage(codingProblem.languages)
  const {
    data: { starterCode },
  } = useLanguageTemplate(phaseId, language.id)

  const runCode = useRunCode()
  const submitCode = useSubmitCode()
  const isRunning = runCode.isPending
  const isSubmissionLoading = submitCode.isPending

  const storageKey = `editor-${phaseId}-${language.id}`
  const { handleEditorMount, handleEditorChange, resetDraft, getCode } =
    useEditorDraft(storageKey, starterCode)

  const { theme } = useTheme()

  // Monaco editor configuration variables
  const [fontSize, setFontSize] = useState(DEFAULT_FONT_SIZE)
  const [tabSize, setTabSize] = useState(DEFAULT_TAB_SIZE)
  const [wordWrapEnabled, setWordWrapEnabled] = useState(DEFAULT_WORD_WRAP)

  const [isConsoleOpen, setIsConsoleOpen] = useState(false)
  const [executionResults, setExecutionResults] = useState<ExecutionResult>()

  const handleToggleConsole = () => {
    setIsConsoleOpen(!isConsoleOpen)
  }

  const buildExecutionRequest = () => ({
    path: { phase_id: phaseId },
    body: { sourceCode: getCode(), languageId: language.id },
  })

  const handleExecutionError = (message: string) => (e: unknown) => {
    console.error(message, e)
    setExecutionResults(undefined)
    toast.add({
      type: "error",
      description: `${message} Please try again.`,
    })
  }

  const handleRunCode = () => {
    runCode.mutate(buildExecutionRequest(), {
      onSuccess: (results) => {
        setExecutionResults({
          type: "run",
          data: results,
          examples: codingProblem.examples,
        })
      },
      onError: handleExecutionError("Error running code."),
      onSettled: () => setIsConsoleOpen(true),
    })
  }

  const handleSubmitCode = () => {
    submitCode.mutate(buildExecutionRequest(), {
      onSuccess: (submission) => {
        setExecutionResults({ type: "submission", data: submission })
        onSubmitted()
      },
      onError: handleExecutionError("Error submitting code."),
      onSettled: () => setIsConsoleOpen(true),
    })
  }

  return (
    <Card className="h-full gap-0 p-0">
      <CardHeader className="flex shrink-0 flex-row items-center justify-between gap-4 py-2">
        <div className="flex flex-row items-center gap-2 font-semibold">
          <CodeXml />
          Code
        </div>
        <div className="flex flex-row">
          <Tooltip>
            <TooltipTrigger
              render={
                <Button
                  variant={"ghost"}
                  size={"icon"}
                  onClick={resetDraft}
                  aria-label="Reset code"
                >
                  <RotateCcw />
                </Button>
              }
            />
            <TooltipContent>Reset Code</TooltipContent>
          </Tooltip>
          <EditorPanelConfigurationMenu
            fontSize={fontSize}
            tabSize={tabSize}
            wordWrapEnabled={wordWrapEnabled}
            onFontSizeChange={setFontSize}
            onTabSizeChange={setTabSize}
            onWordWrapChange={setWordWrapEnabled}
          />
        </div>
      </CardHeader>

      <Separator />

      <CardContent className="min-h-0 flex-1 p-0">
        <ResizablePanelGroup orientation="vertical">
          <ResizablePanel
            defaultSize={
              isConsoleOpen
                ? EDITOR_PANEL_SIZE_PERCENT
                : EDITOR_PANEL_SIZE_PERCENT + CONSOLE_PANEL_SIZE_PERCENT
            }
            style={{ overflow: "hidden" }}
          >
            <Editor
              key={storageKey}
              theme={theme === "dark" ? "vs-dark" : "light"}
              loading={<Spinner />}
              language={language.name.toLowerCase()}
              height="100%"
              onChange={handleEditorChange}
              onMount={handleEditorMount}
              options={{
                fontSize: fontSize,
                tabSize: tabSize,
                wordWrap: wordWrapEnabled ? "on" : "off",
                minimap: { enabled: false },
              }}
            />
          </ResizablePanel>
          {isConsoleOpen && (
            <>
              <ResizableHandle className="mb-2" withHandle />
              <ResizablePanel defaultSize={CONSOLE_PANEL_SIZE_PERCENT}>
                {executionResults && (
                  <EditorConsole
                    isLoading={isSubmissionLoading || isRunning}
                    executionResults={executionResults}
                  />
                )}
              </ResizablePanel>
            </>
          )}
        </ResizablePanelGroup>
      </CardContent>

      <Separator />

      <CardFooter className="flex justify-between gap-4 py-2">
        <Button variant={"ghost"} onClick={handleToggleConsole}>
          Console {isConsoleOpen ? <ChevronDown /> : <ChevronUp />}
        </Button>
        <div className="flex flex-row items-center gap-4">
          <Button
            variant={"secondary"}
            onClick={handleRunCode}
            disabled={isRunning || isSubmissionLoading}
            aria-label="Run code"
          >
            {isRunning ? <Spinner /> : <Play />}
          </Button>
          <Button
            variant={"confirmation"}
            onClick={handleSubmitCode}
            disabled={isRunning || isSubmissionLoading}
          >
            {isSubmissionLoading ? <Spinner /> : <CloudUpload />}
            Submit
          </Button>
        </div>
      </CardFooter>
    </Card>
  )
}
