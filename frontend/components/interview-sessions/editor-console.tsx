import { Check, Terminal, X } from "lucide-react";
import { cn } from "cn";
import { Card } from "../ui/card";
import { Separator } from "../ui/separator";
import { ScrollArea } from "../ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { ProblemExample } from "@/app/api/coding-problems";
import { ExampleRunResultRead } from "@/app/api/code-execution";

type ExampleResult = {
  example: ProblemExample;
  passed: boolean;
  stderr: string | null;
  compileOutput: string | null;
  actualOutput: string;
};

type EditorConsoleProps = {
  isLoading: boolean;
  results: ExampleRunResultRead[];
  examples: ProblemExample[];
};

export default function EditorConsole({
  isLoading,
  results,
  examples,
}: EditorConsoleProps) {
  const status =
    results.length > 0
      ? results.every((result) => result.passed)
        ? "accepted"
        : "failed"
      : null;

  const passed = results.filter((result) => result.passed);

  const exampleResults: ExampleResult[] = results
    .map((result) => {
      const example = examples.find(
        (example) => example.id === result.exampleId,
      );
      return example
        ? {
            example,
            passed: result.passed,
            stderr: result.stderr,
            compileOutput: result.compileOutput,
            actualOutput: result.actualOutput,
          }
        : null;
    })
    .filter((result): result is ExampleResult => result !== null);

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center gap-1 font-semibold px-4 pb-2">
        <Terminal />
        Output
      </div>
      <Separator />

      {status && !isLoading && (
        <ScrollArea className="flex-1 min-h-0">
          <div className="flex flex-row gap-4 px-4 pt-4 justify-between items-center">
            <p
              className={
                status === "accepted"
                  ? "text-lg text-confirmation"
                  : "text-lg text-destructive"
              }
            >
              {status === "accepted" ? "Accepted" : "Failed"}
            </p>
            <p>{`Passed test cases: ${passed.length} / ${examples.length}`}</p>
          </div>
          <ExampleTabsLine results={exampleResults} />
        </ScrollArea>
      )}
    </div>
  );
}

type ExampleTabsLineProps = {
  results: ExampleResult[];
};

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
  );
}

type ExampleTabContentProps = {
  testCase: ProblemExample;
  runResult: ExampleResult;
};

function ExampleTabContent({ testCase, runResult }: ExampleTabContentProps) {
  const borderClass = cn(
    "border-l-4 rounded-none p-4 h-13",
    runResult.passed ? "border-l-confirmation" : "border-l-destructive",
  );
  const expectedOutput = testCase.expectedOutput;
  const candidateOutput = runResult.actualOutput;

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
        {candidateOutput ? JSON.stringify(candidateOutput) : ""}
      </Card>
    </div>
  );
}

type ErrorDisplayProps = {
  stderr: string | null;
  compileOutput: string | null;
};

function ErrorDisplay({ stderr, compileOutput }: ErrorDisplayProps) {
  return (
    <div className="text-destructive bg-destructive/20 p-2 font-mono text-sm whitespace-pre-wrap">
      {stderr || compileOutput}
    </div>
  );
}
