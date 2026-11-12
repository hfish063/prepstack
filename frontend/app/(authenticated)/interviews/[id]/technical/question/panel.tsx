import { CodingProblem, ProblemExample } from "@/app/api/coding-problems";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Markdown from "react-markdown";
import { ScrollArea } from "@/components/ui/scroll-area";

type ProblemPanelProps = {
  codingProblem: CodingProblem;
};

export default function QuestionPanel({ codingProblem }: ProblemPanelProps) {
  return (
    <ScrollArea className="h-full">
      <div className="flex flex-col gap-4 px-6 py-6 text-sm/8">
        <div className="text-2xl font-bold">{codingProblem.title}</div>
        <Badge>{codingProblem.difficulty}</Badge>
        <Markdown
          components={{
            code: ({ className, children, ...props }) => (
              <code
                className="rounded bg-muted px-1.5 py-0.5 text-sm"
                {...props}
              >
                {children}
              </code>
            ),
          }}
        >
          {codingProblem.prompt}
        </Markdown>
        <ProblemExamplesList examples={codingProblem.examples} />
      </div>
    </ScrollArea>
  );
}

type ProblemExamplesListProps = {
  examples: ProblemExample[];
};

function ProblemExamplesList({ examples }: ProblemExamplesListProps) {
  return (
    <div className="flex flex-col gap-4">
      {examples.map((example, index) => (
        <div key={example.id} className="flex flex-col gap-4">
          <div className="text-lg font-semibold">Example {index + 1}</div>
          <Card>
            <CardContent>
              <div>
                <span className="font-semibold">Input:</span>
                {JSON.stringify(example.input)}
              </div>
              <div>
                <span className="font-semibold">Output:</span>
                {JSON.stringify(example.expectedOutput)}
              </div>
            </CardContent>
          </Card>
          {example.explanation && (
            <div className="flex flex-wrap gap-2">
              Explanation: <div>{example.explanation}</div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
