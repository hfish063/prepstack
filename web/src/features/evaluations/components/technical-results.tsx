import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import type { InterviewPhaseEvaluationRead } from "@/lib/api/generated"
import { Cpu } from "lucide-react"

type TechnicalEvaluationResultsProps = {
  technicalEvaluation?: InterviewPhaseEvaluationRead
}

export default function TechnicalEvaluationResults({
  technicalEvaluation,
}: TechnicalEvaluationResultsProps) {
  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle>Phase Summary</CardTitle>
          <CardDescription>{technicalEvaluation?.summary}</CardDescription>
        </CardHeader>
        <CardFooter className="mt-auto font-semibold text-confirmation">
          {`Score of ${technicalEvaluation?.score} / 100`}
        </CardFooter>
      </Card>
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
                  <TableCell className="font-semibold">
                    Time Complexity
                  </TableCell>
                  <TableCell>
                    {technicalEvaluation?.codingEvaluation?.timeComplexity}
                  </TableCell>
                  <TableCell>
                    <p className="font-semibold text-destructive">
                      Unavailable
                    </p>
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
                    <p className="font-semibold text-destructive">
                      Unavailable
                    </p>
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
    </div>
  )
}
