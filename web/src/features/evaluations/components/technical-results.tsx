import CodeBlock from "@/components/layout/code-block"
import { Badge } from "@/components/ui/badge"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Item,
  ItemContent,
  ItemDescription,
  ItemGroup,
  ItemMedia,
  ItemTitle,
} from "@/components/ui/item"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import type { InterviewPhaseEvaluationRead } from "@/lib/api/generated"
import { cn } from "cn"
import { Check, CodeXml, Cpu, RotateCwClock, X } from "lucide-react"

type TechnicalEvaluationResultsProps = {
  technicalEvaluation?: InterviewPhaseEvaluationRead
}

export default function TechnicalEvaluationResults({
  technicalEvaluation,
}: TechnicalEvaluationResultsProps) {
  if (!technicalEvaluation) {
    return
  }

  return (
    <div className="mb-4 grid grid-cols-1 gap-4 md:grid-cols-2">
      <PhaseSummaryCard technicalEvaluation={technicalEvaluation} />
      <ComplexityBenchmarkCard technicalEvaluation={technicalEvaluation} />
      <SubmissionCodeCard technicalEvaluation={technicalEvaluation} />
      <SubmissionAttemptsCard technicalEvaluation={technicalEvaluation} />
    </div>
  )
}

type TechnicalEvaluationCardProps = {
  technicalEvaluation: InterviewPhaseEvaluationRead
}

function PhaseSummaryCard({
  technicalEvaluation,
}: TechnicalEvaluationCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Phase Summary</CardTitle>
        <CardDescription>{technicalEvaluation?.summary}</CardDescription>
      </CardHeader>
      <CardFooter
        className={cn(
          "mt-auto font-semibold",
          technicalEvaluation?.score < 70
            ? "text-destructive"
            : "text-confirmation"
        )}
      >
        {`Score of ${technicalEvaluation?.score} / 100`}
      </CardFooter>
    </Card>
  )
}

function ComplexityBenchmarkCard({
  technicalEvaluation,
}: TechnicalEvaluationCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex gap-2">
          <Cpu />
          Big-O Complexity Benchmark
        </CardTitle>
        <CardDescription>
          Comparison against optimal reference bounds
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Card className="gap-0 p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Metric</TableHead>
                <TableHead>Yours</TableHead>
                <TableHead>Optimal</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell className="font-semibold">Time Complexity</TableCell>
                <TableCell>
                  {technicalEvaluation?.codingEvaluation?.timeComplexity}
                </TableCell>
                <TableCell>
                  <p className="font-semibold text-destructive">Unavailable</p>
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-semibold">
                  Space Complexity
                </TableCell>
                <TableCell>
                  {technicalEvaluation?.codingEvaluation?.spaceComplexity}
                </TableCell>
                <TableCell>
                  <p className="font-semibold text-destructive">Unavailable</p>
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </Card>
      </CardContent>
      <CardFooter>
        {technicalEvaluation?.codingEvaluation?.complexityReasoning}
      </CardFooter>
    </Card>
  )
}

function SubmissionCodeCard({
  technicalEvaluation,
}: TechnicalEvaluationCardProps) {
  const codingEvaluation = technicalEvaluation.codingEvaluation

  if (!codingEvaluation) {
    return
  }

  const code = codingEvaluation.submission.sourceCode
  const language = codingEvaluation.submission.language.name
  const passedTests = codingEvaluation.submission.passedTestCases
  const totalTests = codingEvaluation.submission.totalTestCases

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex flex-row items-center justify-between gap-4">
          <div className="flex flex-row gap-2">
            <CodeXml />
            Submission
          </div>
          <Badge
            variant={"outline"}
          >{`${passedTests} / ${totalTests} Passed`}</Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <CodeBlock code={code} language={language} />
      </CardContent>
    </Card>
  )
}

function SubmissionAttemptsCard({
  technicalEvaluation,
}: TechnicalEvaluationCardProps) {
  const codingEvaluation = technicalEvaluation.codingEvaluation

  if (!codingEvaluation) {
    return
  }

  const submissionStats = codingEvaluation.submissionStats
  const submissionAttempts = codingEvaluation.submissionStats.attempts

  if (!submissionAttempts) {
    return
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex flex-row items-center justify-between gap-4">
          <div className="flex flex-row items-center gap-2">
            <RotateCwClock />
            Submission Attempts
          </div>
          <Badge
            variant={"outline"}
          >{`${submissionStats.attemptCount} Attempt(s)`}</Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="relative min-h-0 flex-1">
        <div className="absolute inset-0 px-6">
          <ScrollArea className="size-full">
            <ItemGroup>
              {submissionAttempts.map((submission) => (
                <Item key={submission.attemptNumber} variant={"outline"}>
                  <ItemMedia
                    variant={"icon"}
                    className={
                      submission.accepted
                        ? "text-confirmation"
                        : "text-destructive"
                    }
                  >
                    {submission.accepted ? <Check /> : <X />}
                  </ItemMedia>
                  <ItemContent className="flex flex-row items-center justify-between gap-4">
                    <div className="flex flex-col gap-1">
                      <ItemTitle
                        className={cn(
                          "font-semibold",
                          submission.accepted
                            ? "text-confirmation"
                            : "text-destructive"
                        )}
                      >
                        {submission.accepted ? "Accepted" : "Failed"}
                      </ItemTitle>
                      <ItemDescription>
                        {new Date(submission.createdAt).toLocaleDateString()}
                      </ItemDescription>
                    </div>
                    <div>{`${submission.passedTestCases} / ${submission.totalTestCases} Passed`}</div>
                  </ItemContent>
                </Item>
              ))}
            </ItemGroup>
          </ScrollArea>
        </div>
      </CardContent>
    </Card>
  )
}
