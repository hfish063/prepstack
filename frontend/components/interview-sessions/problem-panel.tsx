import { CodingProblem, ProblemExample } from "@/app/api/coding-problems";
import { Card, CardContent, CardHeader } from "../ui/card";
import { Badge } from "../ui/badge";
import { Separator } from "../ui/separator";
import { FileText } from "lucide-react";
import Markdown from "react-markdown";

type ProblemPanelProps = {
  codingProblem: CodingProblem;
};

export default function ProblemPanel({ codingProblem }: ProblemPanelProps) {
  return (
    <Card className="h-full">
      <CardHeader>
        <div className="flex flex-row gap-2 items-center font-semibold">
          <FileText />
          Question
        </div>
      </CardHeader>
      <Separator />
      <CardContent className="flex flex-col gap-4 text-sm/8">
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
      </CardContent>
    </Card>
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
                <span className="font-semibold">Input:</span>{" "}
                {JSON.stringify(example.input)}
              </div>
              <div>
                <span className="font-semibold">Output:</span>{" "}
                {JSON.stringify(example.expectedOutput)}
              </div>
            </CardContent>
          </Card>
        </div>
      ))}
    </div>
  );
}
