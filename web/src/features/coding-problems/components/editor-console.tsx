import { Check, Terminal, X } from "lucide-react"
import { cn } from "cn"
import type {
  ProblemExampleRead,
  ProblemSubmissionSummaryRead,
  SubmissionResultRead,
} from "@/lib/api/generated"
import type { ExecutionResult } from "./editor-panel"
import { Separator } from "@/components/ui/separator"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card } from "@/components/ui/card"

type ExampleResult = Pick<
  SubmissionResultRead,
  "passed" | "stderr" | "compileOutput"
> & {
  example: ProblemExampleRead
  actualOutput: SubmissionResultRead["output"]
}

type EditorConsoleProps = {
  isLoading: boolean
  executionResults: ExecutionResult
}

export default function EditorConsole({
  isLoading,
  executionResults,
}: EditorConsoleProps) {
  if (isLoading) return

  if (executionResults.type == "submission") {
    return <SubmissionContent submission={executionResults.data} />
  }

  return (
    <RunResultContent
      runResults={executionResults.data}
      examples={executionResults.examples}
    />
  )
}

type SubmissionContentProps = {
  submission: ProblemSubmissionSummaryRead
}

function SubmissionContent({ submission }: SubmissionContentProps) {
  return (
    <div className="flex flex-col gap-4 p-4">
      <div className="flex flex-row items-center justify-between">
        {submission.accepted ? (
          <p className="text-lg text-confirmation">Accepted</p>
        ) : (
          <p className="text-lg text-destructive">Failed</p>
        )}
        <p>{`Passed test cases: ${submission.passedTestCases} / ${submission.totalTestCases}`}</p>
      </div>
      {submission.accepted && (
        <p>You have successfully completed this problem!</p>
      )}
      {(submission.stderr || submission.compileOutput) && (
        <ErrorDisplay
          stderr={submission.stderr}
          compileOutput={submission.compileOutput}
        />
      )}
    </div>
  )
}

type RunResultContentProps = {
  runResults: SubmissionResultRead[]
  examples: ProblemExampleRead[]
}

function RunResultContent({ runResults, examples }: RunResultContentProps) {
  const status =
    runResults.length > 0
      ? runResults.every((result) => result.passed)
        ? "accepted"
        : "failed"
      : null

  const exampleResults: ExampleResult[] = runResults.flatMap((result) => {
    const example = examples.find((example) => example.id === result.testCaseId)
    return example
      ? [
          {
            example,
            passed: result.passed,
            stderr: result.stderr,
            compileOutput: result.compileOutput,
            actualOutput: result.output,
          },
        ]
      : []
  })

  const passed = exampleResults.filter((result) => result.passed)

  return (
    <div className="flex h-full flex-col">
      <div className="flex items-center gap-1 px-4 pb-2 font-semibold">
        <Terminal />
        Output
      </div>
      <Separator />

      {status && (
        <ScrollArea className="min-h-0 flex-1">
          <div className="flex flex-row items-center justify-between gap-4 px-4 pt-4">
            <p
              className={
                status === "accepted"
                  ? "text-lg text-confirmation"
                  : "text-lg text-destructive"
              }
            >
              {status === "accepted" ? "Accepted" : "Failed"}
            </p>
            <p>{`Passed test cases: ${passed.length} / ${exampleResults.length}`}</p>
          </div>
          <ExampleTabsLine results={exampleResults} />
        </ScrollArea>
      )}
    </div>
  )
}

type ExampleTabsLineProps = {
  results: ExampleResult[]
}

function ExampleTabsLine({ results }: ExampleTabsLineProps) {
  return (
    <Tabs className="p-4">
      <TabsList>
        {results.map((result, index) => (
          <TabsTrigger key={result.example.id} value={result.example.id}>
            {result.passed ? (
              <Check className="text-confirmation" />
            ) : (
              <X className="text-destructive" />
            )}
            {`Case ${index + 1}`}
          </TabsTrigger>
        ))}
      </TabsList>
      {results.map((result) => (
        <TabsContent key={result.example.id} value={result.example.id}>
          <ExampleTabContent testCase={result.example} runResult={result} />
        </TabsContent>
      ))}
    </Tabs>
  )
}

type ExampleTabContentProps = {
  testCase: ProblemExampleRead
  runResult: ExampleResult
}

function ExampleTabContent({ testCase, runResult }: ExampleTabContentProps) {
  const borderClass = cn(
    "h-13 rounded-none border-l-4 p-4",
    runResult.passed ? "border-l-confirmation" : "border-l-destructive"
  )
  const expectedOutput = testCase.expectedOutput
  const candidateOutput = runResult.actualOutput

  return (
    <div className="flex flex-col gap-4">
      {(runResult.stderr || runResult.compileOutput) && (
        <ErrorDisplay
          stderr={runResult.stderr}
          compileOutput={runResult.compileOutput}
        />
      )}
      <div>Input</div>
      <Card className="rounded-none p-4">{JSON.stringify(testCase.input)}</Card>
      <div>Expected Output</div>
      <Card className={borderClass}>{JSON.stringify(expectedOutput)}</Card>
      <div>Your Output</div>
      <Card className={borderClass}>
        {candidateOutput !== undefined ? JSON.stringify(candidateOutput) : ""}
      </Card>
    </div>
  )
}

type ErrorDisplayProps = Pick<SubmissionResultRead, "stderr" | "compileOutput">

function ErrorDisplay({ stderr, compileOutput }: ErrorDisplayProps) {
  return (
    <div className="bg-destructive/20 p-2 font-mono text-sm whitespace-pre-wrap text-destructive">
      {stderr || compileOutput}
    </div>
  )
}
